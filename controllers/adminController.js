// Load Video model
const Video = require('../models/Video');
const { StreamCloudFile, escapeRegex } = require('./gcsHelper');

// DB Config
const { bucket } = require('../database');

exports.panel = (req, res, next) => {
  res.render('./admin/upload', { page: { title: 'M-Bias' }, user: req.user });
};

exports.upload = (req, res, next) => {
  if (req.file && req.file.gcsUrl) {
    req.flash('success_msg', 'File Succesfully Uploaded');
    res.render('./admin/upload', {
      page: { title: 'Successfully Uploaded ||M-Bias' },
      files: req.file,
      user: req.user,
    });
  } else {
    req.flash('error_msg', 'File Upload Failed');
    res.render('./admin/upload', {
      page: { title: 'Failed to Upload ||M-Bias' },
      user: req.user,
    });
  }
};

exports.viewAll = (req, res, next) => {
  bucket
    .getFiles()
    .then((data) => {
      const files = data[0];
      // Check if files
      if (!files || files.length === 0) {
        res.render('./admin/viewAll', {
          page: { title: 'No files and Videos ||M-Bias' },
          files: false,
          user: req.user,
        });
      } else {
        files.map((file) => {
          if (
            file.metadata.contentType === 'image/jpeg' ||
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
          user: req.user,
        });
      }
    })
    .catch((error) => {
      console.log(error.msg);
      res.render('./admin/viewAll', {
        page: { title: 'Error in Loading ||M-Bias' },
        files: null,
        user: req.user,
      });
    });
};

exports.viewOne = (req, res, next) => {
  Video.findOne({ filename: req.params.id }).then((video) => {
    const files = bucket.file(video.filename);
    files.get().then((data) => {
      const file = data[0];
      // Check if the input is a valid image or not
      if (!file || file.metadata.size === 0) {
        return res
          .render('./admin/viewOne', {
            page: {
              title: 'No file exists',
            },
            files: false,
            user: req.user,
          })
          .status(404);
      }
      res.render('./admin/viewOne', {
        page: {
          title: file.metadata.subject,
        },
        files: file,
        video: video,
        user: req.user,
      });
    });
  });
};

exports.play = (req, res, next) => {
  const files = bucket.file(req.params.filename);
  files.get().then((data) => {
    const file = data[0];
    // Check if the input is a valid image or not
    if (!file || file.metadata.size === 0) {
      return res.status(404).json({
        err: 'No file exists',
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
        err: 'Not available',
      });
    }
  });
};

exports.getOne = (req, res, next) => {
  const regex = new RegExp(escapeRegex(req.params.filename), 'gi');
  Video.findOne({ filename: regex }).then((video) => {
    const files = bucket.file(video.filename);
    files
      .get()
      .then((data) => {
        const file = data[0];
        // Check if the input is a valid image or not
        if (!file || file.metadata.size === 0) {
          return res.status(404).json({
            err: 'No file exists',
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
            err: 'Not an image',
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(404).json({
          err: 'Not an image',
        });
      });
  });
};

exports.delete = (req, res, next) => {
  Video.findOneAndDelete({ filename: req.params.filename }).then(() => {
    const file = bucket.file(req.params.filename);
    file
      .delete()
      .then(() => {
        req.flash('success_msg', 'Deleted Successfully');
        res.redirect('/admin');
      })
      .catch((err) => res.status(404).json({ err: err.message }));
  });
};
