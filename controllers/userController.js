// Load User model
const User = require('../models/User');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

exports.validateSignup = (req, res, next) => {
  body('name')
    .isLength({ min: 5 })
    .trim()
    .isAlphanumeric()
    .withMessage('Name has non-alphanumeric characters.');
  body('username')
    .isLength({ min: 7 })
    .trim()
    .isAlphanumeric()
    .withMessage('Username has non-alphanumeric characters.')
    .custom((value) => {
      return User.findOne({ username: value }).then((user) => {
        if (user) {
          return Promise.reject('Username already in use');
        }
      });
    });
  body('email')
    .isEmail()
    .normalizeEmail()
    .custom((value) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject('E-mail already in use');
        }
      });
    });
  body('password')
    .isLength({ min: 5 })
    .withMessage('must be at least 5 chars long')
    .matches(/\d/)
    .withMessage('must contain a number');
  body('passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
  });
  const errors = validationResult(req);
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).send(firstError);
  }
  next();
};

exports.signup = async (req, res) => {
  const { name, email, password, username } = req.body;
  const user = await new User({ name, email, username, password });
  await bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      user.password = hash;
      user.save();
      res.json(user.name);
    });
  });
};

exports.signin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json(err.message);
    }
    if (!user) {
      return res.status(400).json(info.message);
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json(err.message);
      }

      res.json(user);
    });
  })(req, res, next);
};

exports.signout = (req, res) => {
  res.clearCookie('next-express-connect.sid');
  req.logout();
  res.json({ message: 'You are now signed out!' });
};

/**
 * SAVE AND REDIRECT
TODO:
Data from form is valid. Save member.
member.save(function (err) {
  if (err) { return next(err); }
// Successful - redirect to new member record.
   res.redirect(member.url);
  });
*/

/**
 * Convert the type to an array.
(req, res, next) => {
    if(!(req.body.type instanceof Array)){
        if(typeof req.body.type==='undefined')
        req.body.type=[];
        else
        req.body.type=new Array(req.body.type);
    }
    next();
},
*/

/**
  *  Mark our selected types as checked.
for (let i = 0; i < results.types.length; i++) {
    if (member.type(results.types[i]._id) > -1) {
        results.types[i].checked='true';
    }
}
*/
