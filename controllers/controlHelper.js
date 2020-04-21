// Load Admin model
const Video = require('../models/Video');
const Image = require('../models/Image');
const path = require('path');
const { bucket } = require('../models/Database');
// const ffmpeg = require('ffmpeg-static');
// const genThumbnail = require('simple-thumbnail');

/* Error handler for async / await functions */
const catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

const getPublicUrl = (bucketName, fileName) =>
  `https://storage.googleapis.com/${bucketName}/${fileName}`;

// Example
// https://storage.googleapis.com/mech-bais.appspot.com/1585823732902-hydrogen.mp4

const copyFileToGCS = async (localFilePath, options) => {
  options = options || {};
  const fileName = path.basename(localFilePath);
  const file = bucket.file(fileName);
  await bucket.upload(localFilePath, options);
  await file.makePublic();
  return getPublicUrl(bucket.name, gcsName);
};

const uploadVideo = async (req, res, next) => {
  if (!req.files) {
    return next();
  }
  let video = req.files['video'][0];
  const extension = video.mimetype.split('/')[1];
  const filename = video.originalname.split('.')[0];
  const gcsFileName = `${filename
    .trim()
    .replace(/\s+/g, '-')}-${Date.now()}.${extension}`;
  const file = bucket.file(gcsFileName);
  const stream = file.createWriteStream({
    gzip: true,
    metadata: {
      contentType: video.mimetype,
    },
  });
  stream
    .on('error', (err) => {
      video.cloudStorageError = err;
      next(err);
    })
    .on('finish', async () => {
      video.cloudStorageObject = gcsFileName;
      file.makePublic();
      video.gcsUrl = getPublicUrl(bucket.name, gcsFileName);
      const videos = new Video();
      videos.videoURL = video.gcsUrl;
      videos.filename = gcsFileName;
      req.locals.data = await videos.save();
      console.log(req.locals.data);
      next(req.locals.data);
    })
    .end(video.buffer);
};

const uploadImage = async (req, res, next) => {
  if (!req.files) {
    return next();
  }
  let photo = req.files['avatar'][0] || req.files['image'][0] || req.files[0];
  const extension = photo.mimetype.split('/')[1];
  const gcsFileName = `${req.user.name
    .trim()
    .replace(/\s+/g, '-')}-${Date.now()}.${extension}`;
  const file = bucket.file(gcsFileName);
  const stream = file.createWriteStream({
    gzip: true,
    metadata: {
      contentType: photo.mimetype,
    },
  });
  stream
    .on('error', (err) => {
      photo.cloudStorageError = err;
      next(err);
    })
    .on('finish', () => {
      photo.cloudStorageObject = gcsFileName;
      file.makePublic();
      photo.avatar = getPublicUrl(bucket.name, gcsFileName);
      const image = new Image({
        imageURL: photo.avatar,
        filename: gcsFileName,
      });
      image.save();
      req.body.avatar = image.imageURL;
      req.body.image = image._id;
      next();
    })
    .end(photo.buffer);
};

const StreamCloudFile = (req, res, files) => {
  const video = bucket.file(files.name);
  video
    .get()
    .then((data) => {
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
          'Content-Type': file.metadata.contentType,
        });
        file
          .createReadStream({
            name: file.name,
            range: {
              startPos: start,
              endPos: end,
            },
          })
          .pipe(res);
      } else {
        res.header('Content-Length', file.metadata.size);
        res.header('Content-Type', file.metadata.contentType);

        file
          .createReadStream({
            name: file.name,
          })
          .pipe(res);
      }
    })
    .catch((err) => {
      res.status(400).send({ err });
    });
};

const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

// ! FIX Thumbnail
// genThumbnail(video.avatar, req.preview, '80%', {
//   path: ffmpeg,
//   seek: '00:00:02.10',
// });

// videos.preview.data = req.preview;
// videos.preview.contentType = 'image/jpg';

module.exports = {
  getPublicUrl: getPublicUrl,
  copyFileToGCS: copyFileToGCS,
  StreamCloudFile: StreamCloudFile,
  escapeRegex: escapeRegex,
  catchErrors: catchErrors,
  uploadImage: uploadImage,
  uploadVideo: uploadVideo,
};
