// Load Post model
const Post = require('../models/Post');
const Image = require('../models/Image');
const mongoose = require('mongoose');

// DB Config
const { bucket, uploadFile } = require('../models/Database');
const { deleteParams } = require('./controlHelper');

exports.uploadPhoto = uploadFile.any('postImage');

exports.addPost = async (req, res) => {
  req.body.author = req.user.id;
  const post = await new Post(req.body).save();
  await Post.populate(post, {
    path: 'author image',
    select: '_id name avatar imageURL',
  });
  res.json(post);
};

exports.getPostBySlug = async (req, res, next, slug) => {
  const post = await Post.findOne({ slug: slug });
  req.post = post;

  const posterId = mongoose.Types.ObjectId(req.post.author._id);
  if (req.user && posterId.equals(req.user._id)) {
    req.isPoster = true;
    return next();
  }
  next();
};

exports.sendPost = async (req, res) => {
  const { post } = req;
  res.json(post);
};

exports.deletePost = async (req, res) => {
  const { _id, image } = req.post;
  if (!req.isPoster) {
    return res.status(400).json({
      message: 'You are not authorized to perform this action',
    });
  }
  await Image.findOneAndDelete({
    s3_key: image.s3_key,
  });
  const params = deleteParams(image);
  bucket.deleteObject(params, (err, data) => {
    if (err) {
      console.log(err);
    }
  });
  const deletedPost = await Post.findOneAndDelete({ _id });
  res.json(deletedPost);
};

exports.updatePost = async (req, res) => {
  req.body.publishedDate = new Date().toISOString();
  const updatedPost = await Post.findOneAndUpdate(
    { _id: req.post._id },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  await Post.populate(updatedPost, {
    path: 'author image',
    select: '_id name avatar imageURL',
  });
  res.json(updatedPost);
};

exports.getPosts = async (req, res) => {
  const posts = await Post.find().where({ byAdmin: false }).sort({
    createdAt: 'desc',
  });
  res.json(posts);
};

exports.getPostsByUser = async (req, res) => {
  const { _id } = req.profile;
  const posts = await Post.find({ author: _id })
    .sort({
      createdAt: 'desc',
    })
    .populate('author image video');
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
