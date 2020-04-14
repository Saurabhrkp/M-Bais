const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
var Schema = mongoose.Schema;

function URI() {
  var url = this.name;
  return '/user/' + url.replace(/\s/g, '-');
}

var UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      minlength: 4,
      maxlength: 10,
      required: 'Name is required',
    },
    avatar: {
      type: String,
      required: 'Avatar image is required',
      default: '/public/images/profile-image.jpg',
    },
    username: { type: String, required: true, max: 20, unique: true },
    phone: { type: Number, required: false },
    shortBio: { type: String, required: false, max: 50 },
    posts: [{ type: Schema.ObjectId, ref: 'Post', required: false }],
    password: { type: String, required: true, min: 6 },
    url: { type: String, required: true, default: URI },
    title: { type: String, required: false },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: 'Email is required',
    },
    github: { type: String, required: false },
    saved: { type: Array, required: false },
    author: { type: Boolean, required: true, default: false },
  } /* gives us "createdAt" and "updatedAt" fields automatically */,
  { timestamps: true }
);

/* The MongoDBErrorHandler plugin gives us a better 'unique' error, rather than: "11000 duplicate key" */
UserSchema.plugin(mongodbErrorHandler);

const User = mongoose.model('User', UserSchema);

module.exports = User;
