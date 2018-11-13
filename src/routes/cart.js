const qs = require("qs");
const { ObjectId } = require("mongoose").Types;
const Product = require("../db/product");

const cart = app => {
  app.get("/cart/:data", async (req, res) => {
    const { data: encodedData } = req.params;
    const { data } = qs.parse(encodedData);

    if (data === undefined) {
      res.status(404);
      res.type("txt");
      res.send("undefined data");
    } else {
      try {
        const promises = data.map(id => {
          const oid = new ObjectId(id);
          return Product.findById(oid).exec();
        });
        const result = await Promise.all(promises);
        res.status(200);
        res.json(result);
      } catch (err) {
        res.status(500);
        res.type("txt");
        res.send(err);
      }
    }
  });
};

module.exports = cart;
