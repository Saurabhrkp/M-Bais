const { bucket } = require('../models/database');
const File = require('../models/File');
const Multer = require('multer');
const multerS3 = require('multer-s3-transform');
const sharp = require('sharp');
const async = require('async');

/* Error handler for async / await functions */
const catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

// Multer is required to process file uploads and make them available via req.files.
const upload = Multer({
  storage: multerS3({
    s3: bucket,
    bucket: 'awsbucketformbias',
    acl: 'public-read',
    shouldTransform: function (req, file, cb) {
      cb(null, /^image/i.test(file.mimetype));
    },
    metadata: function (req, file, cb) {
      let metabody = { ...req.body };
      if (metabody.body) {
        delete metabody.body;
      }
      cb(null, Object.assign({}, metabody));
    },
    key: function (req, file, cb) {
      cb(
        null,
        `${Date.now()}-${file.fieldname}.${file.mimetype.split('/')[1]}`
      );
    },
    transforms: [
      {
        id: 'original',
        key: function (req, file, cb) {
          cb(null, `${Date.now()}-${file.fieldname}.png`);
        },
        transform: function (req, file, cb) {
          let options = { height: 600 };
          if (file.fieldname == 'avatar') {
            options = { height: 200, width: 200 };
          }
          cb(null, sharp().resize(options).png({ compressionLevel: 6 }));
        },
      },
    ],
  }),
  limits: {
    fileSize: 100 * 1024 * 1024, // no larger than 100mb, you can change as needed.
  },
  fileFilter: (req, file, next) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      next(null, true);
    } else {
      next(null, false);
    }
  },
});

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const savingFile = async (file) => {
  try {
    let mimeTypeCheck = file.mimetype.startsWith('image/');
    let files = new File({
      contentType: mimeTypeCheck ? 'image/png' : file.mimetype,
      source: file.location ? file.location : file.transforms[0].location,
      size: file.size
        ? formatBytes(file.size)
        : formatBytes(file.transforms[0].size),
      key: file.key ? file.key : file.transforms[0].key,
    });
    let { id } = await files.save();
    return Promise.resolve(id);
  } catch (error) {
    return Promise.reject(error);
  }
};

const saveFile = async (req, res, next) => {
  if (!req.files) {
    return next();
  }
  if (req.files['avatar']) {
    const file = req.files['avatar'][0];
    req.body.avatar = await savingFile(file);
    return next();
  }
  if (req.files['photos']) {
    const photos = req.files['photos'];
    const arrayOfPhoto = [];
    for (const key in photos) {
      if (photos.hasOwnProperty(key)) {
        const file = photos[key];
        let id = await savingFile(file);
        arrayOfPhoto.push(id);
      }
    }
    req.body.photos = new Array(...arrayOfPhoto);
  }
  if (req.files['video']) {
    const file = req.files['video'][0];
    req.body.video = await savingFile(file);
  }
  if (req.files['thumbnail']) {
    const file = req.files['thumbnail'][0];
    req.body.thumbnail = await savingFile(file);
  }
  return next();
};

const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

const deleteFileFromBucket = async (file) => {
  try {
    return await bucket
      .deleteObject({ Bucket: 'awsbucketformbias', Key: file.key })
      .promise();
  } catch (error) {
    return Promise.reject(error);
  }
};

const extractTags = (string) => {
  let tags = string.toLowerCase().split(' ');
  return new Array(...tags);
};

const checkAndChangeProfile = async (req, res, next) => {
  try {
    const { avatar } = req.profile;
    if (
      (avatar !== undefined && req.body.avatar !== undefined) ||
      (avatar !== undefined && req.url.includes('DELETE'))
    ) {
      await File.findOneAndDelete({
        key: avatar.key,
      });
      await deleteFileFromBucket(avatar);
    }
    next();
  } catch (error) {
    next(error);
  }
};

const deleteAllFiles = async (req, res, next) => {
  try {
    const { video = {}, photos = [{}], thumbnail = {} } = req.post;
    if (
      (video !== {} && req.body.video !== undefined) ||
      (video !== undefined && req.url.includes('DELETE'))
    ) {
      await File.findOneAndDelete({
        key: video.key,
      });
      await deleteFileFromBucket(video);
    }
    if (
      (thumbnail !== {} && req.body.thumbnail !== undefined) ||
      (thumbnail !== undefined && req.url.includes('DELETE'))
    ) {
      await File.findOneAndDelete({
        key: thumbnail.key,
      });
      await deleteFileFromBucket(thumbnail);
    }
    if (
      (photos !== [{}] && req.body.photos !== undefined) ||
      (photos !== undefined && req.url.includes('DELETE'))
    ) {
      for (const key in photos) {
        if (photos.hasOwnProperty(key)) {
          const file = photos[key];
          await File.findOneAndDelete({
            key: file.key,
          });
          await deleteFileFromBucket(file);
        }
      }
    }
    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  escapeRegex,
  catchErrors,
  upload,
  saveFile,
  deleteFileFromBucket,
  extractTags,
  checkAndChangeProfile,
  deleteAllFiles,
};
