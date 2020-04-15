module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.author) {
        return next();
      } else {
        req.flash('error_msg', 'You are not Student');
        res.redirect('/admin/logout');
      }
    } else {
      req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/users/login');
    }
  },
};
