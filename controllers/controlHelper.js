const { bucket } = require('../models/database');
const Photo = require('../models/Photo');
const Multer = require('multer');
const multerS3 = require('multer-s3-transform');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

/* Error handler for async / await functions */
const catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

const imageString = (buffer) => {
  var str = buffer.toString('base64');
  var size = Buffer.byteLength(str, 'base64');
  return { source: `data:image/webp;base64,${str}`, size };
};

// Multer is required to process file uploads and make them available via req.files.
const upload = Multer({
  storage: multerS3({
    s3: bucket,
    bucket: 'awsbucketformbias',
    shouldTransform: function (req, file, cb) {
      cb(null, /^image/i.test(file.mimetype));
    },
    setResizeOptions: function (req, file, cb) {
      file.options = { height: 600 };
      if (file.filename == 'avatar') {
        file.options = { height: 200, width: 200 };
      }
      cb(null, file.options);
    },
    transforms: [
      {
        id: 'original',
        key: function (req, file, cb) {
          cb(null, `${uuidv4()}.jpg`);
        },
        transform: function (req, file, cb) {
          cb(null, sharp().resize(file.options).webp());
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

const savePhoto = async (req, res, next) => {
  if (!req.files) {
    return next();
  }

  if (req.files['avatar']) {
    const encode_image = await sharp(req.files['avatar'].path)
      .resize(200, 200)
      .webp()
      .toBuffer();
    const { source, size } = imageString(encode_image);
    const photo = new Photo({ source, size });
    await photo.save();
    req.body.avatar = photo.id;
    return next();
  }
  const photos = req.files;
  photos.map((p) =>
    data.push({
      name: p.originalname,
      mimetype: p.mimetype,
      size: p.size,
    })
  );
  const encode_image = await sharp(req.files['avatar'].path)
    .resize(200, 200)
    .webp()
    .toBuffer();
  const { source, size } = imageString(encode_image);
  const photo = new Photo({ source, size });
  await photo.save();
  req.body.avatar = photo.id;
  next();
};

const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

module.exports = {
  escapeRegex: escapeRegex,
  catchErrors: catchErrors,
  upload: upload,
};
