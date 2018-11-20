const ensureAuthenticated = require("../helpers/ensureAuth");
const Transaction = require("../db/transaction");
const Product = require("../db/product");

const profile = app => {
  app.get("/profile", ensureAuthenticated, async (req, res) => {
    const { _id: id } = req.user;
    try {
      const buys = await Transaction.find({ "buyer.id": id })
        .populate("product")
        .populate({
          path: "review",
          populate: { path: "author", select: "username" }
        })
        .exec();
      const sells = await Transaction.find({ "seller.id": id })
        .populate("product")
        .populate({
          path: "review",
          populate: { path: "author", select: "username" }
        })
        .exec();
      const selling = await Product.find({ seller: id }).exec();
      res.status(200).json({
        buys,
        sells,
        selling
      });
    } catch (error) {
      res.status(500);
      res.type("txt");
      res.send(error.toString());
    }
  });
};

module.exports = profile;
