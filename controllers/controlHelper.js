// Load Admin model
const Video = require('../models/Video');
const path = require('path');
const { bucket } = require('../database');

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

const copyFileToGCS = (localFilePath, options) => {
  options = options || {};
  const fileName = path.basename(localFilePath);
  const file = bucket.file(fileName);
  return bucket
    .upload(localFilePath, options)
    .then(() => file.makePublic())
    .then(() => getPublicUrl(bucket.name, gcsName));
};

const sendUploadToGCS = (req, res, next) => {
  //TODO: Handle Image Preview upload
  if (!req.file) {
    return next();
  }
  const gcsFileName = `${Date.now()}-${req.file.originalname}`;
  const file = bucket.file(gcsFileName);
  const stream = file.createWriteStream({
    gzip: true,
    metadata: {
      contentType: req.file.mimetype,
    },
  });
  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });
  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsFileName;
    file.makePublic();
    req.file.gcsUrl = getPublicUrl(bucket.name, gcsFileName);
    const video = new Video({
      videoURL: req.file.gcsUrl,
      preview,
      filename: gcsFileName,
    });
    video.save((err, video) => {
      if (err) return res.send(err);
    });
    next();
  });
  stream.end(req.file.buffer);
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
