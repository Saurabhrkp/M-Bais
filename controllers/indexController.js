exports.welcome = function(req, res, next) {
  console.log('http://localhost:3000');
  res.render('welcome', { user: false });
};
exports.dashboard = function(req, res, next) {
  res.render('dashboard', { user: req.user });
};
