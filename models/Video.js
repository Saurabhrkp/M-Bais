const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  aliases: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  videoURL: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  }
});

const Video = mongoose.model('Video', VideoSchema);

module.exports = Video;
