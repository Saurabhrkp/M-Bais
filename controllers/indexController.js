// Load Post model
const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.getPostBySlug = async (req, res, next, slug) => {
  try {
    req.post = await Post.findOne({ slug: slug });
    if (req.post !== null) {
      return next();
    }
    req.flash(
      'error_msg',
      `No Video with slug: ${slug}, may be because slug is incorrect or modified`
    );
    res.redirect('/');
  } catch (error) {
    next(error);
  }
};

exports.searchPost = async (req, res, next) => {
  try {
    const code = req.body.code;
    req.post = await Post.findOne({ code: code });
    if (req.post !== null) {
      return res.redirect(`/${req.post.slug}`);
    }
    req.flash(
      'error_msg',
      `No Video with code: ${code}, may be because code is incorrect`
    );
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
      req.flash('success_msg', `${req.post.title} removed from liked posts`);
      await post.likes.pull(authUserId);
    } else {
      req.flash('success_msg', `${req.post.title} added to liked posts`);
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
      req.flash('success_msg', `${comment.text} deleted from post`);
    } else {
      operator = '$push';
      comment = await new Comment({
        text: req.body.comment,
        postedBy: req.user._id,
      });
      await comment.save();
      req.flash('success_msg', `Added your comment to post`);
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
