// Load Post model
const Post = require('../models/Post');
const Image = require('../models/Image');
const mongoose = require('mongoose');

// DB Config
const { bucket, uploadFile } = require('../models/Database');
const { StreamCloudFile } = require('./controlHelper');

exports.uploadPhoto = uploadFile.any('postImage');

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
  const files = bucket.file(req.params.filename);
  files.get().then((data) => {
    const file = data[0];
    // Check if the input is a valid image or not
    if (!file || file.metadata.size === 0) {
      return res.status(404).json({
        err: 'No file exists',
      });
    }

    // If the file exists then check whether it is an image
    if (
      file.metadata.contentType === 'image/jpeg' ||
      file.metadata.contentType === 'image/png' ||
      file.metadata.contentType === 'video/mp4'
    ) {
      // Read output to browser
      StreamCloudFile(req, res, file);
    } else {
      res.status(404).json({
        err: 'Not available',
      });
    }
  });
};
