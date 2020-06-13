const User = require('../models/User');
const Post = require('../models/Post');
const File = require('../models/File');
const Comment = require('../models/Comment');
const { extractTags, deleteFileFromBucket } = require('./controlHelper');
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
      comments: (callback) => {
        Comment.countDocuments(callback);
      },
    });
    res.render('admin-panel', { results });
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
    res.json(post);
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select(
      '_id name email createdAt updatedAt'
    );
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.getFiles = async (req, res, next) => {
  try {
    const files = await File.find();
    res.json(files);
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
    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { _id } = req.post;
    await User.findOneAndUpdate(req.user.id, { $pull: { posts: _id } });
    const deletedPost = await Post.findOneAndDelete({ _id });
    res.json(deletedPost);
  } catch (error) {
    next(error);
  }
};

exports.deleteAllFiles = async (req, res, next) => {
  try {
    const { video = {}, photos = [{}] } = req.post;
    if (video !== {}) {
      await File.findOneAndDelete({
        key: video.key,
      });
      await deleteFileFromBucket(video);
    }
    if (photos !== [{}]) {
      for (const key in photos) {
        if (photos.hasOwnProperty(key)) {
          const file = photos[key];
          await File.findOneAndDelete({
            key: file.key,
          });
          await deleteFileFromBucket(file);
        }
      }
    }
    return next();
  } catch (error) {
    next(error);
  }
};

exports.deleteFile = async (req, res, next, file) => {
  try {
    await File.findOneAndDelete({
      _id: file,
    });
    let operator, field, data;
    if (req.url.includes('photos')) {
      operator = '$pull';
      field = 'photos';
      data = file._id;
    } else {
      operator = '$unset';
      field = 'video';
      data = 1;
    }
    await Post.findByIdAndUpdate(
      { _id: req.post._id },
      { [operator]: { [field]: [data] } },
      { new: true, runValidators: true }
    );
    await deleteFileFromBucket(file);
    res.json({ message: `Files deleted: ${file.key}` });
  } catch (error) {
    next(error);
  }
};
