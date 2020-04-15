// Load Video model
const Video = require('../models/Video');
const Post = require('../models/Post');
const { sendUploadToGCS } = require('./controlHelper');
// DB Config
const { bucket, uploadFile: upload } = require('../database');

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

exports.delete = (req, res, next) => {
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
