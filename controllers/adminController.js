// Load Admin model
const Admin = require('../models/Admin');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// DB Config
const connection = require('../database').connection;

// Grid fs
const Grid = require('gridfs-stream');

// Connect GridFS and Mongo
Grid.mongo = mongoose.mongo;

// Init gfs
var gfs;

connection.once('open', () => {
  // Init stream
  gfs = Grid(connection.db);
});

exports.loginGet = function(req, res, next) {
  res.render('login', { page: { title: 'Login to M-Bias' } });
};

exports.registerGet = function(req, res, next) {
  res.render('register', { page: { title: 'Register new User to M-Bias' } });
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
      page: { title: 'Register new User to M-Bias' },
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    Admin.findOne({ email: email }).then(user => {
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
        const newUser = new Admin({
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
  passport.authenticate('Admin', {
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
  res.render('upload', { page: { title: 'Login to M-Bias' }, user: req.user });
};

exports.upload = function(req, res, next) {
  const buf = crypto.randomBytes(8);
  const filename = buf.toString('hex') + path.extname(req.files.file.name);
  var writestream = gfs.createWriteStream({
    filename: filename,
    mode: 'w',
    content_type: req.files.file.mimetype,
    metadata: req.body,
    aliases: req.body.aliases
  });
  fs.createReadStream(req.files.file.tempFilePath).pipe(writestream);
  writestream.on('close', function(file) {
    fs.unlink(req.files.file.tempFilePath, function(err) {
      // handle error
      console.log('success!');
      req.flash('success_msg', 'File Succesfully Uploaded');
      res.render('viewOne', {
        page: { title: 'Successfully Uploaded ||M-Bias' },
        files: file,
        user: req.user
      });
    });
  });
};

exports.viewAll = function(req, res, next) {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render('view', { files: false, user: req.user });
    } else {
      files.map(file => {
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.render('view', {
        page: { title: 'All Post and Videos ||M-Bias' },
        files: files,
        user: req.user
      });
    }
  });
};

exports.viewOne = function(req, res, next) {
  gfs.files.findOne(new mongoose.Types.ObjectId(req.params.id), (err, file) => {
    // Check if the input is a valid image or not
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    res.render('adminview', {
      page: { title: file.metadata.subject },
      files: file,
      user: req.user
    });
  });
};

exports.getOne = function(req, res, next) {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if the input is a valid image or not
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // If the file exists then check whether it is an image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
};

exports.delete = function(req, res, next) {
  gfs.remove(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
    if (err) return res.status(404).json({ err: err.message });
    req.flash('success_msg', 'Deleted Successfully');
    res.redirect('/admin');
  });
};

// router.get('/download/:id', function(req, res) {
//     var readstream = gfs.createReadStream({
//        _id: req.params.id
//     });
//     readstream.pipe(res);
//  });
