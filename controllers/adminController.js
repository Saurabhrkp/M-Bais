// Load Video model
const Video = require('../models/Video');
const User = require('../models/User');
const Post = require('../models/Post');
const Image = require('../models/Image');

// DB Config
const { bucket, uploadFile: upload } = require('../models/Database');

exports.uploadVideo = upload.fields([
  {
    name: 'video',
    maxCount: 1,
  },
  {
    name: 'image',
    maxCount: 1,
  },
]);

exports.savePost = async (req, res, next) => {
  req.body.author = req.user.id;
  const post = await new Post(req.body).save();
  await Post.populate(post, {
    path: 'author video image',
    select: '_id name avatar videoURL imageURL',
  });
  res.json(post);
};

exports.getUsers = async (req, res) => {
  const users = await User.find().select('_id name email createdAt updatedAt');
  res.json(users);
};

exports.getAdminFeed = async (req, res) => {
  const { _id } = req.profile;
  const posts = await Post.find({ author: _id }).select(
    '_id title slug description '
  );
  res.json(posts);
};

exports.updatePost = async (req, res) => {
  req.body.updatedAt = new Date().toISOString();
  const updatedPost = await Post.findOneAndUpdate(
    { _id: req.post._id },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  res.json(updatedPost);
};

exports.deletePost = async (req, res) => {
  const { _id } = req.post;
  const deletedPost = await Post.findOneAndDelete({ _id });
  res.json(deletedPost);
};

exports.deleteVideo = async (req, res, next) => {
  const { _id, video } = req.post;
  let videoResult = {};
  videoResult.fromPost = await Post.findOneAndUpdate(_id, {
    $pull: { video: video._id },
  });
  videoResult.fromVideo = await Video.findOneAndDelete({
    filename: video.filename,
  });
  videoResult.fromBucket = await bucket.file(video.filename).delete()[0];
  next(videoResult);
};

exports.deleteImage = async (req, res, next) => {
  const { _id, image } = req.post;
  let imageResult = {};
  imageResult.fromPost = await Post.findOneAndUpdate(_id, {
    $pull: { image: image._id },
  });
  imageResult.fromImage = await Image.findOneAndDelete({
    filename: image.filename,
  });
  imageResult.fromBucket = await bucket.file(image.filename).delete()[0];
  next(imageResult);
};
