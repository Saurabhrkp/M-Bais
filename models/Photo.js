const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  source: { type: String, required: true },
  key: { type: String, required: true },
  size: { type: Number, required: true },
});

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;
