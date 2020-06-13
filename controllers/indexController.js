// Load Post model
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { escapeRegex } = require('./controlHelper');

exports.getPostBySlug = async (req, res, next, slug) => {
  try {
    req.post = await Post.findOne({ slug: slug });
    next();
  } catch (error) {
    next(error);
  }
};

exports.searchPost = async (req, res, next) => {
  try {
    const code = escapeRegex(req.body.code);
    req.post = await Post.findOne({ code: code });
    if (req.post !== null) {
      return res.redirect(`/${req.post.slug}`);
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
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
    let comment;
    let operator;
    if (req.url.includes('uncomment')) {
      operator = '$pull';
      comment = await Comment.findByIdAndDelete(req.body.id);
    } else {
      operator = '$push';
      comment = await new Comment({
        text: req.body.comment,
        postedBy: req.user._id,
      });
      await comment.save();
    }
    await Post.findOneAndUpdate(
      { _id: req.post._id },
      { [operator]: { comments: comment._id } },
      { new: true }
    );
    res.redirect(`/${req.post.slug}`);
  } catch (error) {
    next(error);
  }
};
