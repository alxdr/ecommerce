const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongoose").Types;
const User = require("../db/user");

function hashPassword(password) {
  const saltRounds = 13;
  const hash = bcrypt.hash(password, saltRounds);
  return hash;
}

function validateLogin(req, res, next) {
  const { username, password } = req.body;
  const usernamePattern = /[\w-]{8,16}/;
  const validator = { login: true, username: true, password: true };
  if (
    username.length < 8 ||
    username.length > 16 ||
    !usernamePattern.test(username)
  ) {
    validator.login = false;
    validator.username = false;
  }
  if (password.length < 8 || password.length > 16) {
    validator.login = false;
    validator.password = false;
  }
  if (validator.login) {
    next();
  } else {
    res.status(401);
    res.json(validator);
  }
}

function validateRegister(req, res, next) {
  const { username, password, email } = req.body;
  const usernamePattern = /[\w-]{8,16}/;
  const emailPattern = /^[.\w-]+@[a-zA-Z]+.[a-zA-Z]{2,}$/;
  const validator = {
    login: true,
    username: true,
    password: true,
    email: true,
    nameTaken: false
  };
  if (
    username.length < 8 ||
    username.length > 16 ||
    !usernamePattern.test(username)
  ) {
    validator.login = false;
    validator.username = false;
  }
  if (password.length < 8 || password.length > 16) {
    validator.login = false;
    validator.password = false;
  }
  if (!emailPattern.test(email)) {
    validator.login = false;
    validator.email = false;
  }
  if (validator.login) {
    next();
  } else {
    res.status(401);
    res.json(validator);
  }
}

const auth = app => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    const { _id: id } = user;
    done(null, id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(new ObjectId(id))
      .exec()
      .then(
        user => {
          done(null, user);
        },
        error => {
          done(error);
        }
      );
  });

  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username })
        .exec()
        .then(
          async user => {
            if (!user) {
              return done(null, false);
            }
            if (!(await bcrypt.compare(password, user.password))) {
              return done(null, false);
            }
            return done(null, user);
          },
          error => done(error)
        );
    })
  );

  app.post(
    "/login",
    validateLogin,
    passport.authenticate("local"),
    (req, res) => {
      res.status(200);
      res.json({ connected: req.user.stripe.connected });
    }
  );

  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.post(
    "/register",
    validateRegister,
    async (req, res, next) => {
      const { username, password, email } = req.body;
      const hash = await hashPassword(password);
      User.findOne({ username })
        .exec()
        .then(
          user => {
            if (user) {
              res.status(401);
              res.json({
                login: true,
                username: false,
                password: true,
                email: true,
                nameTaken: true
              });
            } else {
              new User({
                username,
                password: hash,
                email
              })
                .save()
                .then(
                  () => {
                    next();
                  },
                  () => {
                    res.sendStatus(500);
                  }
                );
            }
          },
          error => {
            next(error);
          }
        );
    },
    passport.authenticate("local"),
    (req, res) => {
      res.status(200);
      res.json({ connected: req.user.stripe.connected });
    }
  );
};

module.exports = auth;
