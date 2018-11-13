const stripe = require("stripe")(process.env.STRIPE_SECRET);
const { ObjectId } = require("mongoose").Types;
const Product = require("../db/product");
const Transaction = require("../db/transaction");
const ensureAuthenticated = require("../helpers/ensureAuth");
const sendMail = require("../helpers/mailer");

const checkout = app => {
  app.post("/checkout", ensureAuthenticated, async (req, res) => {
    const { _id: uid, email: buyerEmail } = req.user;
    const charges = [];
    const transactions = [];
    try {
      const { token, cart, shipping } = req.body;
      const products = cart.map(id => {
        const oid = new ObjectId(id);
        return Product.findById(oid)
          .populate("seller")
          .exec();
      });
      const purchases = await Promise.all(products);
      purchases.forEach(purchase => {
        const {
          _id: pid,
          price,
          productName,
          seller: { _id: sid, email: sellerEmail, stripeUID }
        } = purchase;
        const amount = parseInt(price.replace(".", ""), 10);
        charges.push(
          stripe.charges.create(
            {
              amount,
              currency: "usd",
              description: `Charge for ${productName}`,
              source: token
            },
            {
              stripe_account: stripeUID
            }
          )
        );
        const transac = new Transaction({
          seller: {
            id: sid,
            email: sellerEmail
          },
          buyer: {
            id: uid,
            email: buyerEmail
          },
          product: pid,
          amount: price,
          shipping: new Map(Object.entries(shipping))
        }).save();
        transactions.push(transac);
        const sellerMailOptions = {
          from: "automated@simplecommerce.com",
          to: sellerEmail,
          subject: "Notification of New Order",
          html:
            "<p>You have a new order! Check out your profile page for more details.</p>"
        };
        sendMail(sellerMailOptions);
      });
      await Promise.all(charges);
      await Promise.all(transactions);
      res.sendStatus(200);
    } catch (error) {
      res.status(500);
      res.json({ error });
    }
  });
};

module.exports = checkout;
