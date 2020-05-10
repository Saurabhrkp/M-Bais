const { bucket } = require('../models/database');
const File = require('../models/File');
const Multer = require('multer');
const multerS3 = require('multer-s3-transform');
const sharp = require('sharp');

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
      cb(null, Object.assign({}, req.body));
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
          var options = { height: 600 };
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

const savingFile = async (file) => {
  try {
    var mimeTypeCheck = file.mimetype.startsWith('image/');
    var files = new File({
      contentType: mimeTypeCheck ? 'image/png' : file.mimetype,
      source: file.location ? file.location : file.transforms[0].location,
      size: file.size ? file.size : file.transforms[0].size,
      key: file.key ? file.key : file.transforms[0].key,
    });
    var { id } = await files.save();
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
        var id = await savingFile(file);
        arrayOfPhoto.push(id);
      }
    }
    req.body.photos = new Array(...arrayOfPhoto);
  }
  if (req.files['video']) {
    const file = req.files['video'][0];
    req.body.video = await savingFile(file);
  }
  return next();
};

const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

module.exports = { escapeRegex, catchErrors, upload, saveFile };
