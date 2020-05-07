// Load Post model
const Post = require('../models/Post');
const mongoose = require('mongoose');

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

exports.searchPost = async (req, res, next) => {
  const code = req.query.search;
  const post = await Post.findOne({ code: code });
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

exports.getPosts = async (req, res) => {
  const posts = await Post.find().sort({
    createdAt: 'desc',
  });
  res.json(posts);
};

exports.toggleLike = async (req, res) => {
  const { _id } = req.post;
  const post = await Post.findOne({ _id: _id });
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
  const { comment, _id } = req.post;
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
    { _id: _id },
    { [operator]: { comments: data } },
    { new: true }
  )
    .populate('author', '_id name avatar')
    .populate('comments.postedBy', '_id name avatar');
  res.json(updatedPost);
};
