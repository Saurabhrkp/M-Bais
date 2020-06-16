const mongoose = require('mongoose');
const S3 = require('aws-sdk/clients/s3');

// DB Config
const mongoDBURI = process.env.mongoDBURI;

// AWS S3 Config
const config = {
  region: process.env.region,
  apiVersion: process.env.apiVersion,
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
};

// Connect to MongoDB
mongoose
  .connect(mongoDBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.info(`MongoDB is Connected on ${mongoDBURI}`))
  .catch((err) => console.error(`Unable to MongoDB due to ${err.message}`));

// Promise of mongoose
mongoose.Promise = global.Promise;

// Instantiate a storage client
const S3Client = new S3(config);
/*  Notice that if you don't provide a dirName, the file will be automatically uploaded to the root of your bucket */

module.exports = { bucket: S3Client };
