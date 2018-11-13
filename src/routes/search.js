const Product = require("../db/product");

const search = app => {
  app.get("/search", async (req, res) => {
    const { query } = req.query;
    if (query === undefined) {
      res.status(404);
      res.type("txt");
      res.send("undefined query");
    } else {
      try {
        const regex = new RegExp(query, "i");
        const result = await Product.find({
          productName: regex
        }).exec();
        res.status(200);
        res.json({ result, query });
      } catch (err) {
        res.status(500);
        res.type("txt");
        res.send(err);
      }
    }
  });
};

module.exports = search;
