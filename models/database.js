const mongoose = require('mongoose');
const S3 = require('aws-sdk/clients/s3');

// MongoDB Config
const mongoDBURI = process.env.mongoDBURI;
const mongoDBOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

// Connect to MongoDB
mongoose
  .connect(mongoDBURI, mongoDBOptions)
  .then(() => console.info(`MongoDB is Connected on ${mongoDBURI}`))
  .catch((err) =>
    console.error(`Unable to connect MongoDB due to ${err.message}`)
  );

// Promise of mongoose
mongoose.Promise = global.Promise;

// AWS S3 Config
const s3Options = {
  region: process.env.region,
  apiVersion: process.env.apiVersion,
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
};

// Instantiate a storage client
const S3Client = new S3(s3Options);
/*  Notice that if you don't provide a dirName, the file will be automatically uploaded to the root of your bucket */

module.exports = { bucket: S3Client };
