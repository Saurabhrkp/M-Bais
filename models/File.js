const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
  contentType: { type: String, required: true },
  source: { type: String, required: true },
  key: { type: String, required: true },
  size: { type: Number, required: true },
});

const File = mongoose.model('File', FileSchema);

module.exports = File;
