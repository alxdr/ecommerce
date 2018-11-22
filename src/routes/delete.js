const { ObjectId } = require("mongoose").Types;
const Product = require("../db/product");
const ensureAuthenticated = require("../helpers/ensureAuth");

const del = app => {
  app.delete("/delete/product/:id", ensureAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await Product.delete({ _id: new ObjectId(id) }).exec();
      res.sendStatus(200);
    } catch (error) {
      res.status(500);
      res.type("txt");
      res.send(error.toString());
    }
  });
};

module.exports = del;
