const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
var async = require('async');

// DB Config
const { bucket } = require('../database');

exports.welcome = function(req, res, next) {
  res.render('welcome', { page: { title: 'Welcome to M-Bias' }, user: false });
};

exports.dashboard = function(req, res, next) {
  res.render('dashboard', {
    page: { title: 'Your Dashboard || M-Bias' },
    user: req.user
  });
};

exports.contact = function(req, res, next) {
  res.render('contact', { page: { title: 'Contact us' }, user: false });
};

exports.search = function(req, res, next) {
  const regex = new RegExp(escapeRegex(req.query.search), 'gi');
  gfs.files.findOne({ aliases: regex }, (err, file) => {
    // Check if the input is a valid image or not
    if (!file || file.length === 0) {
      return res.render('result', {
        page: {
          title: 'Search results not found|| M-Bias',
          search: req.query.search
        },
        files: false,
        user: req.user
      });
    }
    res.render('result', {
      page: { title: 'Search results || M-Bias', search: req.query.search },
      files: file,
      user: req.user
    });
  });
};

exports.searchPost = function(req, res, next) {
  const regex = new RegExp(escapeRegex(req.query.search), 'gi');
  async.parallel(
    {
      post: function(callback) {
        Post.find({ aliases: regex })
          .populate('_user')
          .exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (!results.post || results.post.length === 0) {
        return res.render('viewpost', {
          page: {
            title: 'Search results not found|| M-Bias',
            search: req.query.search
          },
          posts: false,
          user: req.user
        });
      }
      // Successful, so render.
      res.render('viewpost', {
        page: { title: 'Search results || M-Bias', search: req.query.search },
        posts: results.post,
        user: req.user
      });
    }
  );
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
    if (
      file.metadata.contentType === 'image/jpeg' ||
      file.metadata.contentType === 'image/png'
    ) {
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

exports.show = function(req, res, next) {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if the input is a valid image or not
    if (!file || file.length === 0) {
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
      const readstream = gfs.createReadStream(file);
      readstream.pipe(res);
      res.render('video', {
        page: { title: file.metadata.metadata.subject },
        files: file,
        user: req.user
      });
    } else {
      res.status(404).json({
        err: 'Not available'
      });
    }
  });
};

exports.play = function(req, res, next) {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if the input is a valid image or not
    if (!file || file.length === 0) {
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
      StreamGridFile(req, res, file);
    } else {
      res.status(404).json({
        err: 'Not available'
      });
    }
  });
};

// Display detail page for a specific Pdf.
exports.onepost = function(req, res, next) {
  async.parallel(
    {
      post: function(callback) {
        Post.findById(req.params.id)
          .populate('_user')
          .exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.post == null) {
        // No results.
        var err = new Error('Post not found');
        err.status = 404;
        return next(err);
      }
      const isPost = results.post._user.id === req.user.id ? true : false;
      // Successful, so render.
      res.render('viewOne', {
        page: { title: results.post.subject },
        post: results.post,
        user: req.user,
        isPost: isPost
      });
    }
  );
};

exports.delete = function(req, res, next) {
  const ID = req.params.id;
  const UserID = req.user.id;
  async.parallel({}, function(err, results) {
    if (err) {
      return next(err);
    } else {
      User.findOneAndUpdate(UserID, { $pull: { posts: ID } }, function(err) {
        if (err) {
          return res.status(500).json({ error: 'error in deleting address' });
        }
      });
      Post.findOneAndDelete(
        req.params.id,
        function deletephoto(err) {
          if (err) {
            return next(err);
          }
          req.flash('success_msg', 'Succesfully deleted');
          res.redirect('/dashboard');
        },
        console.log(`Deleted from photos`)
      );
    }
  });
};

exports.allpost = function(req, res) {
  async.parallel(
    {
      posts: function(callback) {
        Post.find()
          .populate('_user')
          .exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.posts == null) {
        // No results.
        res.redirect('dashboard');
      }
      // Successful, so render.
      res.render('viewpost', {
        page: { title: 'All Post by you' },
        user: req.user,
        posts: results.posts
      });
    }
  );
};

exports.post_get = function(req, res) {
  res.render('makepost', {
    page: { title: 'Make a new Post' },
    user: req.user
  });
};

exports.post_post = function(req, res) {
  const { subject, message, aliases } = req.body;
  const errors = [];
  if (!subject || !message) {
    errors.push({ msg: 'Please enter Subject & Content' });
  }
  if (errors.length > 0) {
    res.render('makepost', {
      errors,
      subject,
      message,
      aliases,
      page: { title: 'Make a new Post' }
    });
  } else {
    const post = new Post({
      subject,
      message,
      aliases,
      _user: req.user._id
    });
    post.save(function(err, post) {
      if (err) return res.send(err);
      User.findById(req.user._id, function(err, user) {
        if (err) return res.send(err);
        user.posts.push(post._id);
        user.save();
      });
      req.flash('success_msg', 'You are have Uploaded');
      res.redirect('/postAll');
    });
  }
};

// function StreamGridFile(req, res, files) {
//   var file = files.filename;
//   gfs.findOne(
//     {
//       filename: file
//     },
//     function(err, file) {
//       if (err) {
//         return res.status(400).send({
//           err: errorHandler.getErrorMessage(err)
//         });
//       }
//       if (!file) {
//         return res.status(404).send({
//           err: 'No se encontró el registro especificado.'
//         });
//       }

//       if (req.headers['range']) {
//         var parts = req.headers['range'].replace(/bytes=/, '').split('-');
//         var partialstart = parts[0];
//         var partialend = parts[1];

//         var start = parseInt(partialstart, 10);
//         var end = partialend ? parseInt(partialend, 10) : file.length - 1;
//         var chunksize = end - start + 1;

//         res.writeHead(206, {
//           'Accept-Ranges': 'bytes',
//           'Content-Length': chunksize,
//           'Content-Range': 'bytes ' + start + '-' + end + '/' + file.length,
//           'Content-Type': file.contentType
//         });

//         gfs
//           .createReadStream({
//             _id: file._id,
//             range: {
//               startPos: start,
//               endPos: end
//             }
//           })
//           .pipe(res);
//       } else {
//         res.header('Content-Length', file.length);
//         res.header('Content-Type', file.metadata.contentType);

//         gfs
//           .createReadStream({
//             _id: file._id
//           })
//           .pipe(res);
//       }
//     }
//   );
// }

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
