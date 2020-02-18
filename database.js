const mongoose = require('mongoose');
// const multer = require('multer');
// const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.Promise = global.Promise;
var conn = mongoose.connection;

conn.on('connected', () => {
  console.log(`MongoDB is Connected on ${db}`);
});
conn.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Connect GridFS and Mongo
Grid.mongo = mongoose.mongo;

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db);
  gfs.collection('uploads');
});

// Create storage engine
// const storage = new GridFsStorage({
//   url: db,
//   options: { useUnifiedTopology: true },
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString('hex') + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads'
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });
// const upload = multer({ storage });
