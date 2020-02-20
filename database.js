const mongoose = require('mongoose');

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
var conn = mongoose.connection;

conn.on('connected', () => {
  console.log(`MongoDB is Connected on ${db}`);
});
conn.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Connect GridFS and Mongo
// Grid.mongo = mongoose.mongo;

// Init gfs
// var gfs;

// conn.on('open', () => {
// Init stream
//   gfs = Grid(conn.db);
//   module.exports = gfs;
// });
module.exports = { connection: conn };
