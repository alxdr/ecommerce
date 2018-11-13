const check = app => {
  app.get("/check", (req, res) => {
    if (req.isAuthenticated()) {
      return res
        .status(200)
        .json({ loggedIn: true, connected: req.user.stripe.connected });
    }
    return res.status(200).json({ loggedIn: false });
  });
};

module.exports = check;
