exports.welcome = function(req, res, next) {
  res.render('welcome', { title: 'Welcome User' });
};
exports.hello = function(req, res, next) {
  res.render('welcome', { title: 'Hello User' });
};
