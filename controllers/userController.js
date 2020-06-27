// Loading models
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const async = require('async');
const { body, validationResult } = require('express-validator');
const { sendEmail } = require('./controlHelper');

exports.get_signup = (req, res) => {
  res.render('signup');
};

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
    const error = errors.map((error) => error.msg)[0];
    const { name, email, username, password, passwordConfirmation } = req.body;
    return res.render('signup', {
      error,
      name,
      username,
      email,
      password,
      passwordConfirmation,
    });
  }
  next();
};

exports.signup = async (req, res, next) => {
  const { name, email, password, username } = req.body;
  const user = await new User({ name, email, username, password });
  await sendEmail(req, user);
  let salt = await bcrypt.genSalt(10);
  let hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  await user.save();
  req.flash('success_msg', 'Registered and check your email for verification');
  res.redirect('/api/signin');
};

exports.get_signin = (req, res) => {
  res.render('signin');
};

exports.set_verified = async (req, res) => {
  try {
    await User.findOneAndUpdate({ _id: req.query.id }, { verified: true });
    req.flash('success_msg', 'Email Verification Complete');
    res.redirect('/api/signin');
  } catch (error) {
    next(error);
  }
};

exports.signin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.render('signin', { error: err.message });
    }
    if (!user) {
      return res.render('signin', { error: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.render('signin', { error: err.message });
      }
      res.redirect('/');
    });
  })(req, res, next);
};

exports.signout = (req, res) => {
  req.session.destroy(() => {
    req.logout();
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};

exports.getAuthUser = (req, res) => {
  res.render('profile', { profile: req.profile });
};

exports.checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'You have to be registered and logged in');
  res.redirect('/api/signin');
};

exports.getUserByUsername = async (req, res, next, username) => {
  try {
    req.profile = await User.findOne({ username: username }).populate({
      path: 'saved',
      select: '-photos -body -video -comments -tags -likes ',
    });
    req.profile.liked = await Post.find({
      likes: { $in: [req.profile._id] },
    }).select('-photos -body -video -comments -tags -likes');
    next();
  } catch (error) {
    next(error);
  }
};

exports.toggleSavedPost = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user.id });
  const savedIds = user.saved.map((id) => id.toString());
  const postId = req.post._id.toString();
  if (savedIds.includes(postId)) {
    await user.saved.pull(postId);
    req.flash('success_msg', `Removed from saved post: ${req.post.title}`);
  } else {
    await user.saved.push(postId);
    req.flash('success_msg', `Added to saved post: ${req.post.title}`);
  }
  await user.save();
  res.redirect(`/${req.post.slug}`);
};

exports.updateUser = async (req, res, next) => {
  req.body.updatedAt = new Date().toISOString();
  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  req.flash('success_msg', 'Your Account is updated');
  res.redirect(`/api/${req.user.username}`);
};

exports.deleteUser = async (req, res, next) => {
  await async.parallel([
    (callback) => {
      User.findByIdAndDelete(req.profile._id).exec(callback);
    },
    (callback) => {
      Post.updateMany(
        { likes: { $in: [req.profile._id] } },
        { $pull: { likes: req.profile._id } }
      ).exec(callback);
    },
  ]);
  const results = await async.parallel({
    comments: (callback) => {
      Comment.find({ postedBy: req.profile._id }).exec(callback);
    },
  });
  const deleteRefrence = async (comment) => {
    await Comment.findByIdAndDelete(comment._id);
    await Post.findOneAndUpdate(
      { comments: { $in: [comment._id] } },
      { $pull: { comments: comment._id } }
    );
  };
  await async.each(results.comments, deleteRefrence);
  res.redirect('/api/signout');
};
