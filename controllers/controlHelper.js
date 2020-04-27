// Load Admin model
const Video = require('../models/Video');
const Image = require('../models/Image');
const { bucket } = require('../models/Database');

/* Error handler for async / await functions */
const catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

const uploadParams = (file) => {
  return {
    Bucket: 'awsbucketformbias',
    Key: `${Date.now()}-${file.originalname.trim().replace(/\s+/g, '-')}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };
};

const deleteParams = (file) => {
  return { Bucket: 'awsbucketformbias', Key: file.s3_key };
};

const uploadVideo = async (req, res, next) => {
  if (!req.files) {
    return next();
  }
  const video = req.files['video'][0];
  const params = uploadParams(video);
  bucket.upload(params, async (err, data) => {
    if (err) {
      res.status(500).json({ error: true, Message: err });
    } else {
      const videos = new Video();
      videos.videoURL = data.Location;
      videos.s3_key = params.Key;
      await videos.save();
      req.body.video = videos.id;
      next();
    }
  });
};

const uploadImage = async (req, res, next) => {
  if (!req.files) {
    return next();
  }
  var photo;
  req.files['avatar']
    ? (photo = req.files['avatar'][0])
    : req.files['image']
    ? (photo = req.files['image'][0])
    : (photo = req.files[0]);
  const params = uploadParams(photo);
  bucket.upload(params, async (err, data) => {
    if (err) {
      res.status(500).json({ error: true, Message: err });
    } else {
      const image = new Image({
        imageURL: data.Location,
        s3_key: params.Key,
      });
      await image.save();
      req.body.avatar = image.imageURL;
      req.body.image = image.id;
      next();
    }
  });
};

const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

module.exports = {
  escapeRegex: escapeRegex,
  catchErrors: catchErrors,
  uploadImage: uploadImage,
  uploadVideo: uploadVideo,
  deleteParams: deleteParams,
};
