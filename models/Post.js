const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const PostSchema = new mongoose.Schema({
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
  _user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

// Virtual for this text URL.
PostSchema.virtual('url').get(function() {
  return '/post/' + this._id;
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
