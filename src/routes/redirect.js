const axios = require("axios");
const qs = require("qs");
const csrf = require("csurf");
const User = require("../db/user");
const ensureAuthenticated = require("../helpers/ensureAuth");

const redirect = app => {
  const csrfProtection = csrf({
    ignoreMethods: ["HEAD", "OPTIONS"],
    value: req => req.query.state
  });

  app.get(
    "/redirect",
    csrfProtection,
    ensureAuthenticated,
    (req, res, next) => {
      const { code, error, error_description: description1 } = req.query;
      if (error) {
        return next(description1);
      }
      return axios
        .post(
          "https://connect.stripe.com/oauth/token",
          qs.stringify({
            client_secret: process.env.STRIPE_SECRET,
            code,
            grant_type: "authorization_code"
          })
        )
        .then(
          async response => {
            try {
              const {
                stripe_publishable_key: stripeKey,
                stripe_user_id: stripeUID,
                refresh_token: refreshTok,
                access_token: accessTok
              } = response.data;
              const { _id: id } = req.user;
              await User.findByIdAndUpdate(id, {
                stripe: {
                  connected: true,
                  stripeKey,
                  stripeUID,
                  refreshTok,
                  accessTok
                }
              }).exec();
            } catch (err) {
              next(err);
            }
            res.redirect("/");
          },
          err => {
            const { error_description: description2 } = err.response.data;
            return next(description2);
          }
        );
    }
  );
};

module.exports = redirect;
