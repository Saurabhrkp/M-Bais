// Load Admin model
const Admin = require('../models/Admin');
const passport = require('passport');
const bcrypt = require('bcryptjs');

// DB Config
const { bucket } = require('../database');

exports.loginGet = (req, res, next) => {
  res.render('login', { page: { title: 'Admin Login to M-Bias' } });
};

exports.registerGet = (req, res, next) => {
  res.render('register', { page: { title: 'Register new Admin to M-Bias' } });
};

exports.registerPost = (req, res, next) => {
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

exports.loginPost = (req, res, next) => {
  passport.authenticate('Admin', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: true
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
};

exports.panel = (req, res, next) => {
  res.render('./admin/upload', { page: { title: 'M-Bias' }, user: req.user });
};

exports.upload = (req, res, next) => {
  if (req.file && req.file.gcsUrl) {
    req.flash('success_msg', 'File Succesfully Uploaded');
    res.render('./admin/upload', {
      page: { title: 'Successfully Uploaded ||M-Bias' },
      files: req.file,
      user: req.user
    });
  } else {
    req.flash('error_msg', 'File Upload Failed');
    res.render('./admin/upload', {
      page: { title: 'Failed to Upload ||M-Bias' },
      user: req.user
    });
  }
};

exports.viewAll = (req, res, next) => {
  bucket
    .getFiles()
    .then(data => {
      const files = data[0];
      // Check if files
      if (!files || files.length === 0) {
        res.render('./admin/viewAll', {
          page: { title: 'No files and Videos ||M-Bias' },
          files: false,
          user: req.user
        });
      } else {
        files.map(file => {
          if (
            file.metadata.metadata.contentType === 'image/jpeg' ||
            file.metadata.contentType === 'image/png'
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
        });
        res.render('./admin/viewAll', {
          page: { title: 'All Post and Videos ||M-Bias' },
          files: files,
          user: req.user
        });
      }
    })
    .catch(error => {
      console.log(error.msg);
      res.render('./admin/viewAll', {
        page: { title: 'Error in Loading ||M-Bias' },
        files: null,
        user: req.user
      });
    });
};

exports.viewOne = (req, res, next) => {
  const files = bucket.file(req.params.id);
  files.get().then(data => {
    const file = data[0];
    // Check if the input is a valid image or not
    if (!file || file.metadata.size === 0) {
      return res
        .render('./admin/viewOne', {
          page: { title: 'No file exists' },
          files: false,
          user: req.user
        })
        .status(404);
    }
    res.render('./admin/viewOne', {
      page: { title: file.metadata.metadata.subject },
      files: file,
      user: req.user
    });
  });
};

exports.play = (req, res, next) => {
  const files = bucket.file(req.params.filename);
  files.get().then(data => {
    const file = data[0];
    // Check if the input is a valid image or not
    if (!file || file.metadata.size === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // If the file exists then check whether it is an image
    if (
      file.metadata.contentType === 'image/jpeg' ||
      file.metadata.contentType === 'image/png' ||
      file.metadata.contentType === 'video/mp4'
    ) {
      // Read output to browser
      StreamCloudFile(req, res, file);
    } else {
      res.status(404).json({
        err: 'Not available'
      });
    }
  });
};

exports.getOne = (req, res, next) => {
  const files = bucket.file(req.params.filename);
  files
    .get()
    .then(data => {
      const file = data[0];
      // Check if the input is a valid image or not
      if (!file || file.metadata.size === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
      // If the file exists then check whether it is an image
      if (
        file.metadata.contentType === 'image/jpeg' ||
        file.metadata.contentType === 'image/png'
      ) {
        // Read output to browser
        const readstream = file.createReadStream();
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(404).json({
        err: 'Not an image'
      });
    });
};

exports.delete = (req, res, next) => {
  const file = bucket.file(req.params.filename);
  file
    .delete()
    .then(() => {
      req.flash('success_msg', 'Deleted Successfully');
      res.redirect('/admin');
    })
    .catch(err => res.status(404).json({ err: err.message }));
};

const StreamCloudFile = (req, res, files) => {
  const video = bucket.file(files.name);
  video
    .get()
    .then(data => {
      const file = data[0];
      if (req.headers['range']) {
        var parts = req.headers['range'].replace(/bytes=/, '').split('-');
        var partialstart = parts[0];
        var partialend = parts[1];

        var start = parseInt(partialstart, 10);
        var end = partialend
          ? parseInt(partialend, 10)
          : file.metadata.size - 1;
        var chunksize = end - start + 1;

        res.writeHead(206, {
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Range':
            'bytes ' + start + '-' + end + '/' + file.metadata.size,
          'Content-Type': file.metadata.contentType
        });
        file
          .createReadStream({
            name: file.name,
            range: {
              startPos: start,
              endPos: end
            }
          })
          .pipe(res);
      } else {
        res.header('Content-Length', file.metadata.size);
        res.header('Content-Type', file.metadata.contentType);

        file
          .createReadStream({
            name: file.name
          })
          .pipe(res);
      }
    })
    .catch(err => {
      res.status(400).send({
        err: errorHandler.getErrorMessage(err)
      });
    });
};

// router.get('/download/:id', function(req, res) {
//     var readstream = gfs.createReadStream({
//        name: req.params.id
//     });
//     readstream.pipe(res);
//  });
