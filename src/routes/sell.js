const multer = require("multer");
const imagemin = require("imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
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
          file: { filename: imageName, mimetype }
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
        const plugin =
          mimetype === "image/jpeg" ? imageminMozjpeg : imageminPngquant;
        await imagemin(
          [`${process.cwd()}/.uploads/${imageName}`],
          `${process.cwd()}/.uploads`,
          {
            use: [
              plugin({
                quality: 50
              })
            ]
          }
        );
      } catch (error) {
        res.status(500);
        res.type("txt");
        res.send(error.toString());
      }
    }
  );
};

module.exports = sell;
