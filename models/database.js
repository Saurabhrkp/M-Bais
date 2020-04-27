const mongoose = require('mongoose');
var S3 = require('aws-sdk/clients/s3');
const Multer = require('multer');

// DB Config
const { mongoURI, config } = require('../bin/keys');

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Promise of mongoose
mongoose.Promise = global.Promise;

// MongoDB Connection
var connectionURI = mongoose.connection;

// Console logs for connection and error
connectionURI.on('connected', () =>
  console.log(`MongoDB is Connected on ${mongoURI}`)
);
connectionURI.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
);

// Instantiate a storage client
const S3Client = new S3(config);
/*  Notice that if you don't provide a dirName, the file will be automatically uploaded to the root of your bucket */

// Multer is required to process file uploads and make them available via
// req.files.
const upload = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // no larger than 20mb, you can change as needed.
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

module.exports = { bucket: S3Client, uploadFile: upload };
