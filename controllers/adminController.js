// Load User model
const User = require('../models/User');
const passport = require('passport');
const bcrypt = require('bcryptjs');

exports.loginGet = function(req, res, next) {
  res.render('adminlogin');
};

exports.registerGet = function(req, res, next) {
  res.render('adminregister');
};

exports.registerPost = function(req, res, next) {
  const { name, email, password, password2 } = req.body;
  const role = 'Admin';
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          role
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/admin/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
};

exports.loginPost = function(req, res, next) {
  requireAdmin();
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: true
  })(req, res, next);
};

exports.logout = function(req, res, next) {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/admin');
};

exports.panel = function(req, res, next) {
  res.render('upload', { user: req.user });
};

function requireAdmin() {
  return function(req, res, next) {
    const { email } = req.body;
    User.findOne({ email }, function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        // Do something - the user does not exist
        req.flash('error_msg', 'That email is not registered');
        console.log('User dont exists');
      }
      if (user.role !== 'Admin') {
        // Do something - the user exists but is no admin user
        req.flash('error_msg', 'You are not Admin');
        res.redirect('/admin/login');
      }
      // Hand over control to passport
      next();
    });
  };
}
