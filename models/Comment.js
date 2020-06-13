const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  postedBy: { type: Schema.ObjectId, ref: 'User', required: 'User' },
});

/* Kind of like a middleware function after creating our schema (since we have access to next) */
/* Must be a function declaration (not an arrow function), because we want to use 'this' to reference our schema */
const autoPopulateCommentedBy = function (next) {
  this.populate('postedBy', '_id name avatar username');
  next();
};

/* We're going to need to populate the 'postedBy' field virtually every time we do a findOne / find query, so we'll just do it as a pre hook here upon creating the schema */
CommentsSchema.pre('findOne', autoPopulateCommentedBy).pre(
  'find',
  autoPopulateCommentedBy
);
/* The MongoDBErrorHandler plugin gives us a better 'unique' error, rather than: "11000 duplicate key" */
CommentsSchema.plugin(mongodbErrorHandler);

const Comment = mongoose.model('Comment', CommentsSchema);

module.exports = Comment;
