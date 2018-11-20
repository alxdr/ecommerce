const multer = require("multer");
const bcrypt = require("bcrypt");
const Product = require("../db/product");
const User = require("../db/user");
const ensureAuthenticated = require("../helpers/ensureAuth");

const upload = multer({ dest: `${process.cwd()}/.uploads` });

function hashPassword(password) {
  const saltRounds = 13;
  const hash = bcrypt.hash(password, saltRounds);
  return hash;
}

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
        res.type("txt");
        res.send(error.toString());
      }
    }
  );
  app.patch("/edit/user/password", ensureAuthenticated, async (req, res) => {
    try {
      const {
        body: { password },
        user: { _id: id }
      } = req;
      if (password.length < 8 || password.length > 16) {
        throw new Error("Your password must be 8-16 characters long.");
      }
      const hash = await hashPassword(password);
      await User.findByIdAndUpdate(id, {
        password: hash
      }).exec();
      res.sendStatus(200);
    } catch (error) {
      res.status(500);
      res.type("txt");
      res.send(error.toString());
    }
  });

  app.patch("/edit/user/email", ensureAuthenticated, async (req, res) => {
    try {
      const {
        body: { email },
        user: { _id: id, email: currentEmail }
      } = req;
      const emailPattern = /^[.\w-]+@[a-zA-Z]+.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(email)) {
        throw new Error("A valid email address is required.");
      }
      if (currentEmail === email) {
        return res.sendStatus(200);
      }
      await User.findByIdAndUpdate(id, {
        email
      }).exec();
      return res.sendStatus(200);
    } catch (error) {
      res.status(500);
      res.type("txt");
      return res.send(error.toString());
    }
  });

  app.patch("/edit/user/username", ensureAuthenticated, async (req, res) => {
    try {
      const {
        body: { username },
        user: { _id: id, username: currentUsername }
      } = req;
      const usernamePattern = /[\w-]{8,16}/;
      if (
        username.length < 8 ||
        username.length > 16 ||
        !usernamePattern.test(username)
      ) {
        throw new Error(
          "Your username must be 8-16 characters long, and only contain letters, numbers or underscore."
        );
      }
      if (currentUsername === username) {
        return res.sendStatus(200);
      }
      const found = await User.findOne({ username }).exec();
      if (found !== null && currentUsername !== username) {
        throw new Error("This username is unavailable.");
      }
      await User.findByIdAndUpdate(id, {
        username
      }).exec();
      return res.sendStatus(200);
    } catch (error) {
      res.status(500);
      res.type("txt");
      return res.send(error.toString());
    }
  });
};

module.exports = edit;
