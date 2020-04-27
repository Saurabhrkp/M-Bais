var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = new Schema({
  imageURL: { type: String, required: true },
  s3_key: { type: String, required: true },
});

// Export model.
module.exports = mongoose.model('Image', ImageSchema);
