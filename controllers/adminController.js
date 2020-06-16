const User = require('../models/User');
const Post = require('../models/Post');
const File = require('../models/File');
const Comment = require('../models/Comment');
const { extractTags } = require('./controlHelper');
const async = require('async');

exports.adminpanel = async (req, res, next) => {
  try {
    const results = await async.parallel({
      users: (callback) => {
        User.countDocuments(callback);
      },
      posts: (callback) => {
        Post.countDocuments(callback);
      },
      files: (callback) => {
        File.countDocuments(callback);
      },
    });
    results.create = 'Add Post';
    res.render('admin-panel', { results });
  } catch (error) {
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    res.render('post-form', { title: 'create' });
  } catch (error) {
    next(error);
  }
};

exports.savePost = async (req, res, next) => {
  try {
    req.body.author = req.user.id;
    req.body.tags = extractTags(req.body.tagString);
    const post = await new Post(req.body).save();
    const user = await User.findById(req.user.id);
    user.posts.push(post._id);
    await user.save();
    await Post.populate(post, {
      path: 'author video photos thumbnail',
      select: '_id name avatar source key',
    });
    res.redirect(`/${post.slug}`);
  } catch (error) {
    next(error);
  }
};

exports.sendPostForm = async (req, res, next) => {
  try {
    res.render('post-form', {
      title: 'update',
      post: req.post,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.render('lists', { users });
  } catch (error) {
    next(error);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.render('lists', { posts });
  } catch (error) {
    next(error);
  }
};

exports.getFiles = async (req, res, next) => {
  try {
    const files = await File.find();
    res.render('lists', { files });
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    req.body.publishedDate = new Date().toISOString();
    req.body.tags = extractTags(req.body.tagString);
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.post._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    await Post.populate(updatedPost, {
      path: 'author video photos thumbnail',
      select: '_id name avatar source key',
    });
    res.redirect(updatedPost.slug);
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { _id } = req.post;
    const result = await async.parallel({
      user: (callback) => {
        User.findOneAndUpdate(req.user.id, { $pull: { posts: _id } }).exec(
          callback
        );
      },
      post: (callback) => {
        Post.findOneAndDelete({ _id }).exec(callback);
      },
    });
    const deleteRefrence = async (comment) => {
      await Comment.findByIdAndDelete(comment);
    };
    await async.each(result.post.comments, deleteRefrence);
    res.redirect('/admin/panel');
  } catch (error) {
    next(error);
  }
};
