exports.welcome = function(req, res, next) {
  res.render('welcome', { user: false });
};

exports.dashboard = function(req, res, next) {
  res.render('dashboard', { user: req.user });
};

exports.contact = function(req, res, next) {
  res.render('contact', { user: false });
};
