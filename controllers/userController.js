// Loading models
const User = require('../models/User');
const passport = require('passport');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { uploadFile } = require('../models/Database');

// ! TODO: Resize Image before storing
// const jimp = require('jimp');

exports.validateSignup = async (req, res, next) => {
  await body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage(`Name field can't be empty`)
    .run(req);
  await body('username')
    .trim()
    .isLength({ min: 6, max: 16 })
    .withMessage('Username has to be longer than 6.')
    .isAlphanumeric()
    .withMessage('Username has non-alphanumeric characters.')
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error('Username already in use');
      }
      return true;
    })
    .run(req);
  await body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error('E-mail already in use');
      }
      return true;
    })
    .run(req);
  await body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 chars long')
    .matches(/\d/)
    .withMessage('Password must contain a number')
    .run(req);
  await body('passwordConfirmation')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })
    .run(req);
  const errors = validationResult(req).array();
  if (errors.length > 0) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).send(firstError);
  }
  next();
};

exports.signup = async (req, res) => {
  const { name, email, password, username } = req.body;
  const user = await new User({ name, email, username, password });
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      user.password = hash;
      user.save();
      res.json(user);
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

exports.getAuthUser = (req, res) => {
  if (!req.isAuthUser) {
    res.status(403).json({
      message: 'You are unauthenticated. Please sign in or sign up',
    });
    return res.redirect('/signin');
  }
  res.json(req.user);
};

exports.checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/signin');
};

exports.getUserByUsername = async (req, res, next, username) => {
  const user = await User.findOne({ username: username });
  req.profile = user;
  const profileId = mongoose.Types.ObjectId(req.profile._id);
  if (req.user && profileId.equals(req.user._id)) {
    req.isAuthUser = true;
    return next();
  }
  next();
};

exports.getUserProfile = (req, res) => {
  if (!req.profile) {
    return res.status(404).json({
      message: 'No user found',
    });
  }
  res.json(req.profile);
};

exports.getUserFeed = async (req, res) => {
  const { _id } = req.profile;
  const users = await User.find({ _id: _id }).select('_id name avatar ');
  res.json(users);
};

exports.uploadAvatar = uploadFile.any('avatar');

exports.updateUser = async (req, res) => {
  req.body.updatedAt = new Date().toISOString();
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  res.json(updatedUser);
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  if (!req.isAuthUser) {
    return res.status(400).json({
      message: 'You are not authorized to perform this action',
    });
  }
  const deletedUser = await User.findOneAndDelete({ _id: userId });
  res.json(deletedUser);
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
