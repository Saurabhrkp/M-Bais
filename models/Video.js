const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const VideoSchema = new mongoose.Schema({
  preview: { data: Buffer, contentType: String },
  videoURL: { type: String, required: true },
  s3_key: { type: String, required: true },
});

/* The MongoDBErrorHandler plugin gives us a better 'unique' error, rather than: "11000 duplicate key" */
VideoSchema.plugin(mongodbErrorHandler);

const Video = mongoose.model('Video', VideoSchema);

module.exports = Video;
