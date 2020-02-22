const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

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

exports.welcome = function(req, res, next) {
  res.render('welcome', { user: false });
};

exports.dashboard = function(req, res, next) {
  res.render('dashboard', { user: req.user });
};

exports.contact = function(req, res, next) {
  res.render('contact', { user: false });
};

exports.search = function(req, res, next) {
  const regex = new RegExp(escapeRegex(req.query.search), 'gi');
  gfs.files.findOne({ aliases: regex }, (err, file) => {
    // Check if the input is a valid image or not
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    res.render('viewOne', { files: file, user: req.user });
    // Read output to browser
    // const readstream = gfs.createReadStream(file);
    // readstream.pipe(res);
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

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
