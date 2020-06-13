// Loading models
const User = require('../models/User');
const Post = require('../models/Post');
const File = require('../models/File');
const Comment = require('../models/Comment');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const async = require('async');
const { body, validationResult } = require('express-validator');
const { deleteFileFromBucket } = require('./controlHelper');

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
  try {
    const { name, email, password, username } = req.body;
    const user = await new User({ name, email, username, password });
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    await user.save();
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/api/signin');
  } catch (error) {
    next(error);
  }
};

exports.get_signin = (req, res) => {
  res.render('signin');
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
  res.clearCookie('connect.sid');
  req.logout();
  req.session.destroy((err) => {
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
    const results = await async.parallel({
      profile: (callback) => {
        User.findOne({ username: username })
          .populate({
            path: 'saved',
            select: '-photos -body -video -comments -tags -likes ',
          })
          .exec(callback);
      },
      liked: (callback) => {
        Post.find({
          likes: { $in: [req.profile._id] },
        })
          .select('-photos -body -video -comments -tags -likes')
          .exec(callback);
      },
    });
    req.profile = results.profile;
    req.profile.liked = results.liked;
    next();
  } catch (error) {
    next(error);
  }
};

exports.toggleSavedPost = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    const savedIds = user.saved.map((id) => id.toString());
    const postId = req.post._id.toString();
    if (savedIds.includes(postId)) {
      await user.saved.pull(postId);
    } else {
      await user.saved.push(postId);
    }
    await user.save();
    res.redirect(`/${req.post.slug}`);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    req.body.updatedAt = new Date().toISOString();
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.redirect(`/api/${req.user.username}`);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await async.parallel([
      (callback) => {
        User.findByIdAndDelete(req.user._id).exec(callback);
      },
      (callback) => {
        Post.updateMany(
          { likes: { $in: [req.user._id] } },
          { $pull: { likes: req.user._id } }
        ).exec(callback);
      },
    ]);
    if (req.user.avatar !== undefined) {
      await File.findByIdAndDelete(req.user.avatar._id);
      await deleteFileFromBucket(req.user.avatar);
    }
    const results = await async.parallel({
      comments: (callback) => {
        Comment.find({ postedBy: req.user._id }).exec(callback);
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
  } catch (error) {
    next(error);
  }
};
