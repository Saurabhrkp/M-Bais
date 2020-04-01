const mongoose = require('mongoose');
const Multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Promise of mongoose
mongoose.Promise = global.Promise;

// MongoDB Connection
var connectionURI = mongoose.connection;

// Console logs for connection and error
connectionURI.on('connected', () =>
  console.log(`MongoDB is Connected on ${db}`)
);
connectionURI.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
);

// Storage
const storage = new GridFsStorage({
  db: connectionURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(8, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex');
        const fileInfo = {
          filename: filename,
          metadata: [req.body.subject, req.body.message],
          aliases: req.body.aliases
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({
  storage
});

module.exports = { connection: connectionURI, uploadFile: upload };
