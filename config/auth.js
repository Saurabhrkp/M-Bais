module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.role === 'Student') {
        return next();
      }
      req.flash('error_msg', 'You are not Student');
      res.redirect('/admin/logout');
    } else {
      req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/users/login');
    }
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');
  },
  ensureAdmin: function(req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.role === 'Admin') {
        return next();
      }
      req.flash('error_msg', 'You are not Admin');
      res.redirect('/users/logout');
    } else {
      req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/admin/login');
    }
  },
  forwardAdmin: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('./');
  }
};
