// Load User model
const User = require('../models/User');
const Image = require('../models/Image');
const passport = require('passport');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jimp = require('jimp');
const { body, validationResult } = require('express-validator');
const { bucket, uploadFile } = require('../database');
const { getPublicUrl } = require('./controlHelper');

/**
 * 
 const ffmpeg = require('ffmpeg-static');
 const genThumbnail = require('simple-thumbnail');
 
// promise
genThumbnail('./surveyPaper.mp4', './surveyPaper.png', '80%', {
  path: ffmpeg,
  seek: '00:00:12.23'
})
  .then(() => console.log('done!'))
  .catch((err) => console.error(err));

// genThumbnail also supports piping to write streams, so you can do this with Express!
app.get('/some/endpoint', (req, res) => {
  genThumbnail('path/to/video.webm', res, '150x100')
    .then(() => console.log('done!'))
    .catch(err => console.error(err))
})
 */

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

/**
 //FIXME:
exports.getUsers = async (req, res) => {
  const users = await User.find().select('_id name email createdAt updatedAt');
  res.json(users);
};
 */

exports.getUserById = async (req, res, next, id) => {
  const user = await User.findOne({ _id: id });
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

//FIXME: 'upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])'
exports.uploadAvatar = async (req, res, next) => {
  await uploadFile.single('avatar');
  const image = await jimp.read(req.file.buffer);
  req.file = await image.resize(250, jimp.AUTO);
};

exports.resizeAvatar = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const extension = req.file.mimetype.split('/')[1];
  const gcsFileName = `${req.user.name}-${Date.now()}.${extension}`;
  const file = bucket.file(gcsFileName);
  const stream = file.createWriteStream({
    gzip: true,
    metadata: {
      contentType: req.file.mimetype,
    },
  });
  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });
  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsFileName;
    file.makePublic();
    req.file.gcsUrl = getPublicUrl(bucket.name, gcsFileName);
    const image = new Image({
      imageURL: req.file.gcsUrl,
      filename: gcsFileName,
    });
    image.save((err, image) => {
      if (err) return res.send(err);
    });
    next();
  });
  stream.end(req.file.buffer);
  next();
};

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
