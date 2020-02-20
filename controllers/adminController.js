// Load Admin model
const Admin = require('../models/Admin');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const fs = require('fs');

// DB Config
const connection = require('../database').connection;

// Grid fs
const Grid = require('gridfs-stream');

// Connect GridFS and Mongo
Grid.mongo = mongoose.mongo;

// Init gfs
var gfs;

connection.on('open', () => {
  // Init stream
  gfs = Grid(connection.db);
});

exports.loginGet = function(req, res, next) {
  res.render('login');
};

exports.registerGet = function(req, res, next) {
  res.render('register');
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
  res.render('upload', { user: req.user });
};

exports.upload = function(req, res, next) {
  var writestream = gfs.createWriteStream({
    filename: req.body.subject,
    mode: 'w',
    content_type: req.files.file.mimetype,
    metadata: req.body.message
  });
  fs.createReadStream(req.files.file.tempFilePath).pipe(writestream);
  writestream.on('close', function(file) {
    fs.unlink(req.files.file.tempFilePath, function(err) {
      // handle error
      console.log('success!');
      res.status(200).json(file);
    });
  });
};

// router.get('/download/:id', function(req, res) {
//     var readstream = gfs.createReadStream({
//        _id: req.params.id
//     });
//     readstream.pipe(res);
//  });
