const ensureLogin = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl || req.url;
    return res.redirect('/login');
  }
  next();
};

module.exports = ensureLogin;