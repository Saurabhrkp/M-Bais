const User = require('../models/User');
const Post = require('../models/Post');
const File = require('../models/File');
const Comment = require('../models/Comment');
const { extractTags } = require('./controlHelper');
const async = require('async');

exports.adminpanel = async (req, res, next) => {
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
};

exports.createPost = (req, res) => {
  res.render('post-form', { title: 'create' });
};

exports.savePost = async (req, res, next) => {
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
};

exports.sendPostForm = (req, res) => {
  res.render('post-form', {
    title: 'update',
    post: req.post,
    user: req.user,
  });
};

exports.getUsers = async (req, res, next) => {
  const users = await User.find();
  res.render('lists', { users });
};

exports.getPosts = async (req, res, next) => {
  const posts = await Post.find();
  res.render('lists', { posts });
};

exports.getFiles = async (req, res, next) => {
  const files = await File.find();
  res.render('lists', { files });
};

exports.updatePost = async (req, res, next) => {
  req.body.publishedDate = new Date().toISOString();
  req.body.tags = extractTags(req.body.tagString);
  await Post.findOneAndUpdate(
    { _id: req.post._id },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  req.flash('success_msg', `${req.post.title} updated`);
  res.redirect(`${req.post.slug}`);
};

exports.deletePost = async (req, res, next) => {
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
    await Comment.findByIdAndDelete(comment._id);
  };
  await async.each(result.post.comments, deleteRefrence);
  req.flash('success_msg', `Deleted ${req.post.tilte}`);
  res.redirect('/admin/panel');
};
