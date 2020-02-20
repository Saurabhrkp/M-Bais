const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');

// Load Admin model
const Admin = require('../models/Admin');

module.exports = function(passport) {
  passport.use(
    'Student',
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.use(
    'Admin',
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      Admin.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, { id: user.id, role: user.role });
  });

  passport.deserializeUser(function(obj, done) {
    switch (obj.role) {
      case 'Student':
        User.findById(obj.id).then(user => {
          if (user) {
            done(null, user);
          } else {
            done(new Error('user id not found:' + obj.id, null));
          }
        });
        break;
      case 'Admin':
        Admin.findById(obj.id).then(device => {
          if (device) {
            done(null, device);
          } else {
            done(new Error('device id not found:' + obj.id, null));
          }
        });
        break;
      default:
        done(new Error('no entity type:', obj.role), null);
        break;
    }
  });
};
