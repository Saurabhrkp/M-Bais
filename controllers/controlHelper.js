// Load Admin model
const Video = require('../models/Video');
const Image = require('../models/Image');
const path = require('path');
const { bucket } = require('../models/database');
const ffmpeg = require('ffmpeg-static');
const genThumbnail = require('simple-thumbnail');

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

const sendUploadToGCS = (req, res, next) => {
  if (!req.files) {
    return next();
  }
  req.files.forEach((file) => {
    const type = file.mimetype.split('/')[0];
    const extension = file.mimetype.split('/')[1];
    const gcsFileName = `${file.originalname
      .trim()
      .replace(/\s+/g, '-')}-${Date.now()}.${extension}`;
    if (type !== 'image/') {
      genThumbnail(file, file.preview, '80%', {
        path: ffmpeg,
        seek: '00:00:10.10',
      });
    }
    const data = bucket.file(gcsFileName);
    const stream = data.createWriteStream({
      gzip: true,
      metadata: {
        contentType: file.mimetype,
      },
    });
    stream.on('error', (err) => {
      file.cloudStorageError = err;
      next(err);
    });
    stream.on('finish', () => {
      file.cloudStorageObject = gcsFileName;
      data.makePublic();
      file.gcsUrl = getPublicUrl(bucket.name, gcsFileName);
      if (type !== 'image/') {
        var video = new Video();
        video.videoURL = file.gcsUrl;
        video.preview.data = file.preview;
        video.preview.contentType = 'image/jpg';
        video.filename = gcsFileName;
        video.save((err, video) => {
          if (err) return res.send(err);
          req.body.video = video._id;
        });
      } else {
        const image = new Image({
          imageURL: file.gcsUrl,
          filename: gcsFileName,
        });
        image.save((err, image) => {
          if (err) return res.send(err);
          req.body.image = image._id;
        });
      }
    });
    stream.end(file.buffer);
  });
  next();
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

module.exports = {
  sendUploadToGCS: sendUploadToGCS,
  getPublicUrl: getPublicUrl,
  copyFileToGCS: copyFileToGCS,
  StreamCloudFile: StreamCloudFile,
  escapeRegex: escapeRegex,
  catchErrors: catchErrors,
};
