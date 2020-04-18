// Load Post model
const Post = require('../models/Post');
const Image = require('../models/Image');
const mongoose = require('mongoose');

// ? FIXME: Resizing
// const jimp = require('jimp');

// DB Config
const { bucket, uploadFile } = require('../models/database');
const { getPublicUrl, StreamCloudFile } = require('./controlHelper');

exports.uploadImage = uploadFile.single('image');
// const image = await jimp.read(req.file.buffer);
// req.file = await image.resize(750, jimp.AUTO);
// image.write(req.file);

exports.resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const extension = req.file.mimetype.split('/')[1];
  const gcsFileName = `${req.file.originalname
    .trim()
    .replace(/\s+/g, '-')}-${Date.now()}.${extension}`;
  const file = bucket.file(gcsFileName);
  const stream = file.createWriteStream({
    gzip: true,
    metadata: {
      contentType: req.file.mimetype,
    },
  });
  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });
  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsFileName;
    file.makePublic();
    req.file.image = getPublicUrl(bucket.name, gcsFileName);
    const image = new Image({
      imageURL: req.file.image,
      filename: gcsFileName,
    });
    image.save((err, image) => {
      if (err) return res.send(err);
    });
    req.body.image = image.id;
    next();
  });
  stream.end(req.file.buffer);
};

exports.addPost = async (req, res) => {
  req.body.author = req.user.id;
  const post = await new Post(req.body).save();
  await Post.populate(post, {
    path: 'author',
    select: '_id name avatar',
  });
  res.json(post);
};

exports.getPostById = async (req, res, next, id) => {
  const post = await Post.findOne({ _id: id });
  req.post = post;

  const posterId = mongoose.Types.ObjectId(req.post.author._id);
  if (req.user && posterId.equals(req.user._id)) {
    req.isPoster = true;
    return next();
  }
  next();
};

exports.deletePost = async (req, res) => {
  const { _id, image } = req.post;
  if (!req.isPoster) {
    return res.status(400).json({
      message: 'You are not authorized to perform this action',
    });
  }
  const deletedImage = await Image.findOneAndDelete({
    filename: image.filename,
  });
  bucket.file(image.filename).delete();
  const deletedPost = await Post.findOneAndDelete({ _id });
  res.json({ deletedPost, deletedImage });
};

exports.getPostsByUser = async (req, res) => {
  const posts = await Post.find({ author: req.profile._id }).sort({
    createdAt: 'desc',
  });
  res.json(posts);
};

exports.getPostFeed = async (req, res) => {
  const posts = await Post.find().sort({
    createdAt: 'desc',
  });
  res.json(posts);
};

exports.toggleLike = async (req, res) => {
  const { postId } = req.body;

  const post = await Post.findOne({ _id: postId });
  const likeIds = post.likes.map((id) => id.toString());
  const authUserId = req.user._id.toString();
  if (likeIds.includes(authUserId)) {
    await post.likes.pull(authUserId);
  } else {
    await post.likes.push(authUserId);
  }
  await post.save();
  res.json(post);
};

exports.toggleComment = async (req, res) => {
  const { comment, postId } = req.body;
  let operator;
  let data;

  if (req.url.includes('uncomment')) {
    operator = '$pull';
    data = { _id: comment._id };
  } else {
    operator = '$push';
    data = { text: comment.text, postedBy: req.user._id };
  }
  const updatedPost = await Post.findOneAndUpdate(
    { _id: postId },
    { [operator]: { comments: data } },
    { new: true }
  )
    .populate('author', '_id name avatar')
    .populate('comments.postedBy', '_id name avatar');
  res.json(updatedPost);
};

exports.playVideo = (req, res, next) => {
  StreamCloudFile(req, res, req.params.filename);
};
