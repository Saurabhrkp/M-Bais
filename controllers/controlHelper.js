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
    bucket: process.env.bucketName,
    acl: 'public-read',
    shouldTransform: function (req, file, cb) {
      cb(
        null,
        file.mimetype.startsWith('image/') && !file.mimetype.includes('gif')
      );
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
    let files = new File({
      contentType: file.mimetype.startsWith('image/')
        ? file.mimetype.includes('gif')
          ? file.mimetype
          : 'image/png'
        : file.mimetype,
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
  await async.parallel([
    async () => {
      if (req.files['avatar']) {
        const file = req.files['avatar'][0];
        req.body.avatar = await savingFile(file);
      }
      return;
    },
    async () => {
      if (req.files['photos']) {
        const photos = req.files['photos'];
        const arrayOfPhoto = [];
        const saveEach = async (photo) => {
          let id = await savingFile(photo);
          arrayOfPhoto.push(id);
        };
        await async.each(photos, saveEach);
        req.body.photos = new Array(...arrayOfPhoto);
      }
      return;
    },
    async () => {
      if (req.files['video']) {
        const file = req.files['video'][0];
        req.body.video = await savingFile(file);
      }
      return;
    },
    async () => {
      if (req.files['thumbnail']) {
        const file = req.files['thumbnail'][0];
        req.body.thumbnail = await savingFile(file);
      }
      return;
    },
  ]);
  return next();
};

const deleteFileFromBucket = async (file) => {
  try {
    return await bucket
      .deleteObject({ Bucket: process.env.bucketName, Key: file.key })
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
  const { avatar } = req.profile;
  if (
    (avatar !== undefined && req.body.avatar !== undefined) ||
    (avatar !== undefined && req.url.includes('DELETE'))
  ) {
    await deleteFileReference(avatar);
  }
  return next();
};

const deleteFileReference = async (file) => {
  await async.parallel([
    (callback) => {
      File.findOneAndDelete({
        key: file.key,
      }).exec(callback);
    },
    async () => {
      await deleteFileFromBucket(file);
    },
  ]);
};

const deleteAllFiles = async (req, res, next) => {
  const { video, photos, thumbnail } = req.post;
  await async.parallel([
    async () => {
      if (req.body.video !== undefined || req.url.includes('DELETE')) {
        await deleteFileReference(video);
      }
      return;
    },
    async () => {
      if (req.body.thumbnail !== undefined || req.url.includes('DELETE')) {
        await deleteFileReference(thumbnail);
      }
      return;
    },
    async () => {
      if (req.body.photos !== undefined || req.url.includes('DELETE')) {
        await async.each(photos, deleteFileReference);
      }
      return;
    },
  ]);
  return next();
};

module.exports = {
  catchErrors,
  upload,
  saveFile,
  extractTags,
  checkAndChangeProfile,
  deleteAllFiles,
};
