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

exports.searchPost = async (req, res, next, code) => {
  try {
    const post = await Post.findOne({ code: code });
    req.post = post;
    const posterId = mongoose.Types.ObjectId(req.post.author._id);
    if (req.user && posterId.equals(req.user._id)) {
      req.isPoster = true;
      return next();
    }
    next();
  } catch (error) {
    console.error(error);
    res.json({ message: `Not post for ${code} found` });
  }
};

exports.sendPost = async (req, res) => {
  const { post } = req;
  res.json(post);
};

exports.getPosts = async (req, res) => {
  try {
    const options = {
      page: req.query.page || 1,
      limit: req.query.limit || 2,
    };
    const posts = await Post.paginate({}, options);
    return res.json(posts);
  } catch (error) {
    return res.json(error);
  }
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
  const { _id } = req.post;
  let operator;
  let data;
  if (req.url.includes('uncomment')) {
    operator = '$pull';
    data = { _id: req.body.comment._id };
  } else {
    operator = '$push';
    data = { text: req.body.comment.text, postedBy: req.user._id };
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
