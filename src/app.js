const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const csrf = require("csurf");
const compression = require("compression");
const expressStaticGzip = require("express-static-gzip");
const connect = require("./db/connect");
const root = require("./routes/root");
const search = require("./routes/search");
const auth = require("./routes/auth");
const cart = require("./routes/cart");
const checkout = require("./routes/checkout");
const redirect = require("./routes/redirect");
const check = require("./routes/check");
const sell = require("./routes/sell");
const profile = require("./routes/profile");
const product = require("./routes/product");
const edit = require("./routes/edit");
const del = require("./routes/delete");
const vote = require("./routes/vote");

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "https://stripe.com/img/"],
        styleSrc: ["'self'"],
        scriptSrc: ["'self'", "https://js.stripe.com/v3/"],
        frameSrc: ["'self'", "https://js.stripe.com/"],
        fontSrc: ["'self'"]
      }
    },
    hidePoweredBy: { setTo: "PHP 7.3.0" }
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/dist",
  expressStaticGzip(`${process.cwd()}/dist`, {
    index: false,
    enableBrotli: true,
    orderPreference: ["br", "gz"]
  })
);
app.use(compression());
app.use("/public", express.static(`${process.cwd()}/public`));
app.use("/uploads", express.static(`${process.cwd()}/.uploads`));

connect()
  .then(
    mongoose => {
      app.use(
        session({
          secret: process.env.SESSION_SECRET,
          store: new MongoStore({ mongooseConnection: mongoose.connection }),
          resave: true,
          saveUninitialized: true,
          name: "id"
        })
      );
      app.use(csrf());
      root(app);
      search(app);
      cart(app);
      auth(app);
      product(app);
      checkout(app);
      redirect(app);
      check(app);
      sell(app);
      profile(app);
      edit(app);
      del(app);
      vote(app);

      app.use((err, req, res, next) => {
        if (err.code !== "EBADCSRFTOKEN") return next(err);
        // handle CSRF token errors here
        res.status(403);
        res.type("txt");
        return res.send("Form tampered with!");
      });

      app.use((err, req, res, next) => {
        if (res.headersSent) return next(err);
        res.status(500);
        res.type("txt");
        return res.send("Something broke on the server!");
      });
    },
    err => {
      console.log(err);
      console.error(err.stack);
    }
  )
  .catch(err => {
    console.log(err);
    console.error(err.stack);
  });

module.exports = app;
