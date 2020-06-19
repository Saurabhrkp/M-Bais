const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const URLSlugs = require('mongoose-url-slugs');
const mongoosePaginate = require('mongoose-paginate-v2');
const shortId = require('crypto-random-string');
const Schema = mongoose.Schema;

const URI = () => {
  return (random = shortId({ length: 8, type: 'distinguishable' }));
};

const PostSchema = new Schema(
  {
    code: { type: String, unique: true, default: URI },
    title: { type: String, required: true, max: 100 },
    author: { type: Schema.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true },
    description: { type: String, required: true },
    publishedDate: { type: Date, default: Date.now },
    video: { type: Schema.ObjectId, ref: 'File' },
    thumbnail: { type: Schema.ObjectId, ref: 'File', required: true },
    photos: [{ type: Schema.ObjectId, ref: 'File' }],
    tags: [{ type: String }],
    likes: [{ type: Schema.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.ObjectId, ref: 'Comment' }],
  },
  {
    toJSON: { virtuals: true },
  }
);

// Virtual for this metaTitle.
PostSchema.virtual('metaTitle').get(function () {
  return this.title.length > 50 ? this.title.substr(0, 50) + '...' : this.title;
});

// Virtual for this metaDescription.
PostSchema.virtual('metaDescription').get(function () {
  return this.description.length > 70
    ? this.description.substr(0, 70) + '...'
    : this.description;
});

/* Kind of like a middleware function after creating our schema (since we have access to next) */
/* Must be a function declaration (not an arrow function), because we want to use 'this' to reference our schema */
const autoPopulate = function (next) {
  this.populate('author', '_id name avatar username');
  this.populate('photos video thumbnail', '_id source key contentType');
  this.populate('comments', '_id text createdAt postedBy');
  next();
};

/* We're going to need to populate the 'postedBy' field virtually every time we do a findOne / find query, so we'll just do it as a pre hook here upon creating the schema */
PostSchema.pre('findOne', autoPopulate).pre('find', autoPopulate);

/* Create index on keys for more performant querying/post sorting */
PostSchema.index({ code: 1, author: 1, publishedDate: 1 });

/* The MongoDBErrorHandler plugin gives us a better 'unique' error, rather than: "11000 duplicate key" */
PostSchema.plugin(mongodbErrorHandler);

/* The URLSlug plugin creates a slug that is human-readable unique identifier that can be used in a URL instead of an ID or hash*/
PostSchema.plugin(URLSlugs('title code'));

/* The mongoosePaginate plugin adds paginate method to the Model for Pagination*/
PostSchema.plugin(mongoosePaginate);

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
