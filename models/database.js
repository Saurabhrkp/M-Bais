const mongoose = require('mongoose');
const Multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');

// DB Config
const { mongoURI, bucketURI } = require('./bin/keys');

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
const storage = new Storage({
  keyFilename: path.join(__dirname, './bin/mech-bais.json'),
  projectId: 'mech-bais',
});

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

// A bucket is a container for objects (files).
const bucket = storage.bucket(bucketURI);

module.exports = { bucket: bucket, uploadFile: upload };
