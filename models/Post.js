const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const URLSlugs = require('mongoose-url-slugs');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: { type: String, required: true, max: 100 },
    author: { type: Schema.ObjectId, ref: 'User', required: true },
    video: { type: Schema.ObjectId, ref: 'Video', required: false },
    body: { type: String, required: true },
    description: { type: String, required: true },
    publishedDate: { type: Date, default: Date.now },
    image: { type: Schema.ObjectId, ref: 'Image', required: false },
    tags: [{ type: String }],
    likes: [{ type: Schema.ObjectId, ref: 'User' }],
    comments: [
      {
        text: String,
        createdAt: { type: Date, default: Date.now },
        postedBy: { type: Schema.ObjectId, ref: 'User' },
      },
    ],
  },
  { toJSON: { virtuals: true } }
);

// Virtual for this metaTitle.
PostSchema.virtual('metaTitle').get(function () {
  return this.title;
});

// Virtual for this metaDescription.
PostSchema.virtual('metaDescription').get(function () {
  return this.description;
});

/* Kind of like a middleware function after creating our schema (since we have access to next) */
/* Must be a function declaration (not an arrow function), because we want to use 'this' to reference our schema */
const autoPopulatePostedBy = function (next) {
  this.populate('video', '_id filename videoURL');
  this.populate('author', '_id name avatar');
  this.populate('image', '_id imageURL filename');
  this.populate('comments.postedBy', '_id name avatar');
  next();
};

/* We're going to need to populate the 'postedBy' field virtually every time we do a findOne / find query, so we'll just do it as a pre hook here upon creating the schema */
PostSchema.pre('findOne', autoPopulatePostedBy).pre(
  'find',
  autoPopulatePostedBy
);

/* Create index on keys for more performant querying/post sorting */
PostSchema.index({ postedBy: 1, createdAt: 1 });

/* The MongoDBErrorHandler plugin gives us a better 'unique' error, rather than: "11000 duplicate key" */
PostSchema.plugin(mongodbErrorHandler);

/* Thi URLSlug plugin creates a slug that is human-readable unique identifier that can be used in a URL instead of an ID or hash*/
PostSchema.plugin(URLSlugs('title'));

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
