const ensureAuthenticated = require("../helpers/ensureAuth");
const Transaction = require("../db/transaction");

const profile = app => {
  app.get("/profile", ensureAuthenticated, async (req, res) => {
    const { _id: id } = req.user;
    try {
      const buys = await Transaction.find({ "buyer.id": id })
        .populate("product")
        .exec();
      const sells = await Transaction.find({ "seller.id": id })
        .populate("product")
        .exec();
      res.status(200).json({
        buys,
        sells
      });
    } catch (error) {
      res.status(500).send(error);
    }
  });
};

module.exports = profile;
