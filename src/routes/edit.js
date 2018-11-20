const multer = require("multer");
const Product = require("../db/product");
const ensureAuthenticated = require("../helpers/ensureAuth");

const upload = multer({ dest: `${process.cwd()}/.uploads` });

const edit = app => {
  app.patch(
    "/edit/product/:id",
    ensureAuthenticated,
    upload.single("image"),
    async (req, res) => {
      try {
        const {
          body: { productName, department, price, text },
          params: { id: pid }
        } = req;
        const update = {
          productName,
          department,
          price,
          text
        };
        if (req.file) update.imageSrc = `/uploads/${req.file.filename}`;
        await Product.findByIdAndUpdate(pid, update).exec();
        res.sendStatus(200);
      } catch (error) {
        res.status(500);
        res.send(error);
      }
    }
  );
};

module.exports = edit;
