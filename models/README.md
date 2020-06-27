# Models

***Model:***

Model represents the structure of data, the format and the constraints with which it is stored. It maintains the data of the application. Essentially, it is the database part of the application.

---

[***MongoDB***](https://www.mongodb.com/)

MongoDB is a document database with the scalability and flexibility that you want with the querying and indexing that you need.

- MongoDB stores data in flexible, JSON-like documents, meaning fields can vary from document to document and data structure can be changed over time

- The document model maps to the objects in your application code, making data easy to work with

- Ad hoc queries, indexing, and real time aggregation provide powerful ways to access and analyze your data

- MongoDB is a distributed database at its core, so high availability, horizontal scaling, and geographic distribution are built in and easy to use

- MongoDB is free to use. Versions released prior to October 16, 2018 are published under the AGPL. All versions released after October 16, 2018, including patch fixes for prior versions, are published under the Server Side Public License (SSPL) v1.

---

[**Mongoose**](https://mongoosejs.com/)

Mongoose provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.

[**Amazon S3**](https://docs.aws.amazon.com/AmazonS3/latest/dev/Welcome.html)

Amazon Simple Storage Service is storage for the Internet. It is designed to make web-scale computing easier for developers.

Amazon S3 has a simple web services interface that you can use to store and retrieve any amount of data, at any time, from anywhere on the web. It gives any developer access to the same highly scalable, reliable, fast, inexpensive data storage infrastructure that Amazon uses to run its own global network of web sites. The service aims to maximize benefits of scale and to pass those benefits on to developers.

This guide explains the core concepts of Amazon S3, such as buckets, access points, and objects, and how to work with these resources using the Amazon S3 application programming interface (API).

# [*Plugins used with Mongoose*](https://mongoosejs.com/docs/plugins.html)

- [***Mongoose URL Slug***](https://www.npmjs.com/package/mongoose-url-slugs): A simple URL based slug generator for mongoose models.

  What is a Slug?
  A slug is a human-readable unique identifier that can be used in a URL instead of an ID or hash. This is common in content sites where the title of the article is "slugified" to turn this ugly URL

  ```http
  http://example.com/a12Qv09b4
  ```

  into this pretty one

  ```http
  http://example.com/your-article-title-here
  ```

- [***Mongoose MongoDB Errors***](https://www.npmjs.com/package/mongoose-mongodb-errors): A plugin to transform mongodb like errors (E.G. "11000 - duplicate key") into Mongoose ValidationError instances. This plugin takes advantage of the recently introduced Error Handling Middlewares on mongoose 4.5.

- [***Mongoose Paginate v2***](https://www.npmjs.com/package/mongoose-paginate-v2): A plugin to paginate model. Add plugin to a schema and then use model paginate method

  ```js
  /* Model */
  const mongoose         = require('mongoose');
  const mongoosePaginate = require('mongoose-paginate-v2');

  const mySchema = new mongoose.Schema({
    /* your schema definition */
  });

  mySchema.plugin(mongoosePaginate);

  const myModel = mongoose.model('SampleModel',  mySchema);

  /* Call to paginate */
  const options = {
    page: 1,
    limit: 10,
    collation: {
      locale: 'en'
    }
  };

  Model.paginate({}, options, function(err, result) {
    // result.docs
    // result.totalDocs = 100
    // result.limit = 10
    // result.page = 1
    // result.totalPages = 10
    // result.hasNextPage = true
    // result.nextPage = 2
    // result.hasPrevPage = false
    // result.prevPage = null
    // result.pagingCounter = 1
  });
  ```
---

[***Database.js***](https://github.com/Saurabhrkp/M-Bias/blob/master/models/database.js)

First, we need to define a connection. If your app uses only one database, you should use mongoose.connect. If you need to create additional connections, use mongoose.createConnection.

```js
const mongoose = require('mongoose');

// MongoDB Config
const mongoDBURI = process.env.mongoDBURI;
const mongoDBOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

// Connect to MongoDB
mongoose
  .connect(mongoDBURI, mongoDBOptions)
  .then(() => console.info(`MongoDB is Connected on ${mongoDBURI}`))
  .catch((err) => console.error(`Unable to connect MongoDB due to ${err.message}`));
```

[***AWS SDK***](https://www.npmjs.com/package/aws-sdk)

Importing S3 client from AWS SDK.

```js
// import individual service
const S3 =  require('aws-sdk/clients/s3');
```

Connecting to S3 Bucket with Access Key ID and Secret Access Key by passing it as option to S3 Constructor.

```js
// AWS S3 Config
const s3Options = {
  region: process.env.region,
  apiVersion: process.env.apiVersion,
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
};

// Instantiate a storage client
const S3Client = new S3(s3Options);
```
---

[***User.js***](https://github.com/Saurabhrkp/M-Bias/blob/master/models/User.js)

[***Defining a Model***](https://www.npmjs.com/package/mongoose#defining-a-model)

Models are defined through the [*Schema*](https://mongoosejs.com/docs/guide.html) interface.

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String },
    avatar: { type: Schema.ObjectId, ref: 'File', required: false },
    username: { type: String, unique: true, lowercase: true },
    shortBio: { type: String, required: false, max: 50 },
    posts: [{ type: Schema.ObjectId, ref: 'Post', required: false }],
    password: { type: String },
    email: { type: String, lowercase: true },
    saved: [{ type: Schema.ObjectId, ref: 'Post', required: false }],
    author: { type: Boolean, required: true, default: false },
    verified: { type: Boolean, required: true, default: false },
    },
  { timestamps: true }
);
```

[***Pre***](https://mongoosejs.com/docs/middleware.html#pre)

Pre middleware functions are executed one after another, when each middleware calls next.

```js
const autoPopulateUserBy = function (next) {
  this.where('avatar').populate('avatar', '_id source key contentType size');
  next();
};

UserSchema.pre('findOne', autoPopulateUserBy).pre('find', autoPopulateUserBy);
```

[***Accessing a Model***](https://mongoosejs.com/docs/models.html)

Once we define a model through mongoose.model('ModelName', mySchema), we can access it through the same function

```js
const User = mongoose.model('User');
```

Or just do it all at once

```js
const User = mongoose.model('User', UserSchema);
```

The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural version of your model name. For example, if you use

```js
const User = mongoose.model('User', UserSchema);
```

Then Mongoose will create the model for your tickets collection, not your ticket collection.

---

[***Post.js***](https://github.com/Saurabhrkp/M-Bias/blob/master/models/Post.js)

[***Defining a Model***](https://www.npmjs.com/package/mongoose#defining-a-model)

Models are defined through the [*Schema*](https://mongoosejs.com/docs/guide.html) interface.

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    code: { type: String, unique: true },
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
```

[***Pre***](https://mongoosejs.com/docs/middleware.html#pre)

Pre middleware functions are executed one after another, when each middleware calls next.

```js
const autoPopulate = function (next) {
  this.populate('author', '_id name avatar username');
  this.populate('photos video thumbnail', '_id source key contentType');
  this.populate('comments', '_id text createdAt postedBy');
  next();
};

PostSchema.pre('findOne', autoPopulate).pre('find', autoPopulate);
```

[***Plugins with Mongoose***](https://mongoosejs.com/docs/plugins.html)

Refer *Plugins used with Mongoose* section.

```js
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const URLSlugs = require('mongoose-url-slugs');
const mongoosePaginate = require('mongoose-paginate-v2');

/* The MongoDBErrorHandler plugin gives us a better 'unique' error, rather than: "11000 duplicate key" */
PostSchema.plugin(mongodbErrorHandler);

/* The URLSlug plugin creates a slug that is human-readable unique identifier that can be used in a URL instead of an ID or hash*/
PostSchema.plugin(URLSlugs('title code'));

/* The mongoosePaginate plugin adds paginate method to the Model for Pagination*/
PostSchema.plugin(mongoosePaginate);
```

[***Virtuals***](https://mongoosejs.com/docs/guide.html#virtuals)

Virtuals are document properties that you can get and set but that do not get persisted to MongoDB. The getters are useful for formatting or combining fields, while setters are useful for de-composing a single value into multiple values for storage.

```js
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
```

[***Accessing a Model***](https://mongoosejs.com/docs/models.html)

Once we define a model through mongoose.model('ModelName', mySchema), we can access it through the same function

```js
const Post = mongoose.model('Post', PostSchema);
```
---

[***File.js***](https://github.com/Saurabhrkp/M-Bias/blob/master/models/File.js)

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
  contentType: { type: String, required: true },
  source: { type: String, required: true },
  key: { type: String, required: true },
  size: { type: String, required: true },
});

const File = mongoose.model('File', FileSchema);

module.exports = File;
```
---

[***Comment.js***](https://github.com/Saurabhrkp/M-Bias/blob/master/models/Comment.js)


```js
const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  postedBy: { type: Schema.ObjectId, ref: 'User', required: 'User' },
});

const Comment = mongoose.model('Comment', CommentsSchema);

module.exports = Comment;

```