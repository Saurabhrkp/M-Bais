// Load Video model
const Video = require('../models/Video');
const Post = require('../models/Post');
const Image = require('../models/Image');
const { sendUploadToGCS } = require('./controlHelper');
// DB Config
const { bucket, uploadFile: upload } = require('../models/database');

exports.uploadVideo = async (req, res, next) => {
  await upload.fields([
    {
      name: 'video',
      maxCount: 1,
    },
    {
      name: 'images',
      maxCount: 1,
    },
  ]);
};

exports.uploadToGCS = async (req, res, next) => {
  req.body.author = req.user.id;
  await sendUploadToGCS(req, res);
  const post = await new Post(req.body).save();
  await Post.populate(post, {
    path: 'author',
    select: '_id name avatar',
  })
    .populate({
      path: 'video',
      select: '_id preview videoURL',
    })
    .populate({
      path: 'image',
      select: '_id imageURL filename',
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
    '_id title url description '
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
  const { _id, video, image = {} } = req.post;

  if (!req.isPoster) {
    return res.status(400).json({
      message: 'You are not authorized to perform this action',
    });
  }
  await Video.findOneAndDelete({ _id: video.filename }).then(() => {
    const file = bucket.file(video.filename);
    file
      .delete()
      .then(() => {
        res.json({ status: 'Deleted' });
      })
      .catch((err) => res.status(404).json({ err: err.message }));
  });
  if (image !== {}) {
    await Image.findOneAndDelete({ _id: image.filename }).then(() => {
      const file = bucket.file(image.filename);
      file
        .delete()
        .then(() => {
          res.json({ status: 'Deleted' });
        })
        .catch((err) => res.status(404).json({ err: err.message }));
    });
  }
  const deletedPost = await Post.findOneAndDelete({ _id });
  res.json(deletedPost);
};

exports.deleteVideo = (req, res, next) => {
  const { _id, video } = req.post;
  Post.findOneAndUpdate(_id, { $pull: { video: video._id } });
  Video.findOneAndDelete({ _id: video.filename }).then(() => {
    const file = bucket.file(video.filename);
    file
      .delete()
      .then(() => {
        res.json({ status: 'Deleted' });
      })
      .catch((err) => res.status(404).json({ err: err.message }));
  });
};

exports.deleteImage = (req, res, next) => {
  const { _id, image } = req.post;
  Post.findOneAndUpdate(_id, { $pull: { image: image._id } });
  Image.findOneAndDelete({ _id: image.filename }).then(() => {
    const file = bucket.file(image.filename);
    file
      .delete()
      .then(() => {
        res.json({ status: 'Deleted' });
      })
      .catch((err) => res.status(404).json({ err: err.message }));
  });
};
