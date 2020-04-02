// Load User model
const User = require('../models/User');
// Load Video model
const Video = require('../models/Video');
// Load Post model
const Post = require('../models/Post');
var async = require('async');
const { StreamCloudFile, escapeRegex } = require('./gcsHelper');

// DB Config
const { bucket } = require('../database');

exports.welcome = (req, res, next) => {
  res.render('welcome', { page: { title: 'Welcome to M-Bias' }, user: false });
};

exports.dashboard = (req, res, next) => {
  res.render('dashboard', {
    page: { title: 'Your Dashboard || M-Bias' },
    user: req.user
  });
};

exports.contact = (req, res, next) => {
  res.render('contact', { page: { title: 'Contact us' }, user: false });
};

exports.search = (req, res, next) => {
  const regex = new RegExp(escapeRegex(req.query.search), 'gi');
  Video.findOne({ aliases: regex }).then(video => {
    const files = bucket.file(video.filename);
    files.get().then(data => {
      const file = data[0];
      // Check if the input is a valid image or not
      if (!file || file.metadata.size === 0) {
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
  });
};

exports.searchPost = (req, res, next) => {
  const regex = new RegExp(escapeRegex(req.query.search), 'gi');
  async.parallel(
    {
      post: callback => {
        Post.find({ aliases: regex })
          .populate('_user')
          .exec(callback);
      }
    },
    (err, results) => {
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

exports.getOne = (req, res, next) => {
  Video.findOne({ filename: req.params.filename }).then(video => {
    const files = bucket.file(video.filename);
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
    });
  });
};

exports.show = (req, res, next) => {
  Video.findOne({ filename: req.params.filename }).then(video => {
    const files = bucket.file(video.filename);
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
        const readstream = file.createReadStream();
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

// Display detail page for a specific Pdf.
exports.onepost = (req, res, next) => {
  async.parallel(
    {
      post: callback => {
        Post.findById(req.params.id)
          .populate('_user')
          .exec(callback);
      }
    },
    (err, results) => {
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

exports.delete = (req, res, next) => {
  const ID = req.params.id;
  const UserID = req.user.id;
  async.parallel({}, (err, results) => {
    if (err) {
      return next(err);
    } else {
      User.findOneAndUpdate(UserID, { $pull: { posts: ID } }, err => {
        if (err) {
          return res.status(500).json({ error: 'error in deleting address' });
        }
      });
      Post.findOneAndDelete(
        req.params.id,
        (deletephoto = err => {
          if (err) {
            return next(err);
          }
          req.flash('success_msg', 'Succesfully deleted');
          res.redirect('/dashboard');
        }),
        console.log(`Deleted from photos`)
      );
    }
  });
};

exports.allpost = (req, res) => {
  async.parallel(
    {
      posts: callback => {
        Post.find()
          .populate('_user')
          .exec(callback);
      }
    },
    (err, results) => {
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

exports.post_get = (req, res) => {
  res.render('makepost', {
    page: { title: 'Make a new Post' },
    user: req.user
  });
};

exports.post_post = (req, res) => {
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
    post.save((err, post) => {
      if (err) return res.send(err);
      User.findById(req.user._id, (err, user) => {
        if (err) return res.send(err);
        user.posts.push(post._id);
        user.save();
      });
      req.flash('success_msg', 'You are have Uploaded');
      res.redirect('/postAll');
    });
  }
};
