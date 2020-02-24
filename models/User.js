const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    required: true
  },
  posts: [
    {
      type: Schema.ObjectId,
      ref: 'Post'
    }
  ]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
