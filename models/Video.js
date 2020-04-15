const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const VideoSchema = new mongoose.Schema({
  preview: { data: Buffer, contentType: String },
  videoURL: { type: String, required: true },
  filename: { type: String, required: true },
});

/* Kind of like a middleware function after creating our schema (since we have access to next) */
/* Must be a function declaration (not an arrow function), because we want to use 'this' to reference our schema */
const autoPopulatePostedBy = function (next) {
  this.populate('preview', '_id contentType data');
  next();
};

/* We're going to need to populate the 'postedBy' field virtually every time we do a findOne / find query, so we'll just do it as a pre hook here upon creating the schema */
PostSchema.pre('findOne', autoPopulatePostedBy).pre(
  'find',
  autoPopulatePostedBy
);

/* The MongoDBErrorHandler plugin gives us a better 'unique' error, rather than: "11000 duplicate key" */
VideoSchema.plugin(mongodbErrorHandler);

const Video = mongoose.model('Video', VideoSchema);

module.exports = Video;
