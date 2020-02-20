exports.welcome = function(req, res, next) {
  res.render('welcome', { user: false });
};
exports.dashboard = function(req, res, next) {
  res.render('dashboard', { user: req.user });
};
