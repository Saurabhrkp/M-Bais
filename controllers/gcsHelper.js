const { bucket } = require('../database');
const path = require('path');

const getPublicUrl = (bucketName, fileName) =>
  `https://storage.googleapis.com/${bucketName}/${fileName}`;

// Example
// https://storage.googleapis.com/mech-bais.appspot.com/1585739267079-hydrogen.mp4

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
  if (!req.file) {
    return next();
  }
  const gcsFileName = `${Date.now()}-${req.file.originalname}`;
  const file = bucket.file(gcsFileName);
  const stream = file.createWriteStream({
    gzip: true,
    metadata: {
      contentType: req.file.mimetype,
      metadata: {
        subject: req.body.subject,
        message: req.body.message,
        aliases: req.body.aliases
      }
    }
  });
  stream.on('error', err => {
    req.file.cloudStorageError = err;
    next(err);
  });
  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsFileName;
    file.makePublic();
    req.file.gcsUrl = getPublicUrl(bucket.name, gcsFileName);
    console.log(req.file.gcsUrl);
    next();
  });
  stream.end(req.file.buffer);
};

module.exports = {
  sendUploadToGCS: sendUploadToGCS,
  getPublicUrl: getPublicUrl,
  copyFileToGCS: copyFileToGCS
};
