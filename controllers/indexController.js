// Load Post model
const Post = require('../models/Post');
const mongoose = require('mongoose');

exports.getPostBySlug = async (req, res, next, slug) => {
  try {
    req.post = await Post.findOne({ slug: slug });
    const posterId = mongoose.Types.ObjectId(req.post.author._id);
    if (req.user && posterId.equals(req.user._id)) {
      req.isPoster = true;
      return next();
    }
    next();
  } catch (error) {
    next(error);
  }
};

exports.searchPost = async (req, res, next, code) => {
  try {
    req.post = await Post.findOne({ code: code });
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

exports.sendPost = async (req, res, next) => {
  try {
    res.render('post', { post: req.post, user: req.user });
  } catch (error) {
    next(error);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    if (!req.user) {
      res.render('index', { user: null });
    } else {
      const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 4,
      };
      const posts = await Post.paginate({}, options);
      res.render('index', { posts, user: req.user });
    }
  } catch (error) {
    next(error);
  }
};

exports.toggleLike = async (req, res, next) => {
  try {
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
    res.redirect(`/${req.post.slug}`);
  } catch (error) {
    next(error);
  }
};

exports.toggleComment = async (req, res, next) => {
  try {
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
    await Post.findOneAndUpdate(
      { _id: _id },
      { [operator]: { comments: data } },
      { new: true }
    );
    res.redirect(`/${req.post.slug}`);
  } catch (error) {
    next(error);
  }
};
