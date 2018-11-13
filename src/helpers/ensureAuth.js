function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.sendStatus(401);
}

module.exports = ensureAuthenticated;
