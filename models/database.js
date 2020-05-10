const mongoose = require('mongoose');
const S3 = require('aws-sdk/clients/s3');

// DB Config
const { mongoURI, config } = require('../bin/keys');

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.info(`MongoDB is Connected on ${mongoURI}`))
  .catch((err) => console.error(`Unable to MongoDB due to ${err.message}`));

// Promise of mongoose
mongoose.Promise = global.Promise;

// Instantiate a storage client
const S3Client = new S3(config);
/*  Notice that if you don't provide a dirName, the file will be automatically uploaded to the root of your bucket */

module.exports = { bucket: S3Client };
