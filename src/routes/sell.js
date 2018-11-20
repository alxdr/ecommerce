const multer = require("multer");
const Product = require("../db/product");
const User = require("../db/user");
const ensureAuthenticated = require("../helpers/ensureAuth");

const upload = multer({ dest: `${process.cwd()}/.uploads` });

const sell = app => {
  app.post(
    "/sell",
    ensureAuthenticated,
    upload.single("image"),
    async (req, res) => {
      try {
        const {
          body: { productName, department, price, text },
          user: { _id: id },
          file: { filename: imageName }
        } = req;
        const { _id: pid } = await new Product({
          productName,
          department,
          price,
          text,
          imageSrc: `/uploads/${imageName}`,
          seller: id
        }).save();
        await User.findByIdAndUpdate(id, {
          $push: { selling: pid }
        }).exec();
        res.sendStatus(200);
      } catch (error) {
        res.status(500);
        res.type("txt");
        res.send(error.toString());
      }
    }
  );
};

module.exports = sell;
