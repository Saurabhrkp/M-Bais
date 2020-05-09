const User = require('../models/User');
const Post = require('../models/Post');
const File = require('../models/File');

// DB Config
const { bucket } = require('../models/database');

const deleteParams = (file) => {
  return { Bucket: 'awsbucketformbias', Key: file.key };
};

exports.savePost = async (req, res, next) => {
  req.body.author = req.user.id;
  const post = await new Post(req.body).save();
  await Post.populate(post, {
    path: 'author video photos',
    select: '_id name avatar source key',
  });
  res.json(post);
};

exports.getUsers = async (req, res) => {
  const users = await User.find().select('_id name email createdAt updatedAt');
  res.json(users);
};

exports.getAdminFeed = async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
};

exports.updatePost = async (req, res) => {
  req.body.publishedDate = new Date().toISOString();
  const updatedPost = await Post.findOneAndUpdate(
    { _id: req.post._id },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  await Post.populate(updatedPost, {
    path: 'author video photos',
    select: '_id name avatar source key',
  });
  res.json(updatedPost);
};

exports.deletePost = async (req, res) => {
  const { _id } = req.post;
  const deletedPost = await Post.findOneAndDelete({ _id });
  res.json(deletedPost);
};

exports.deleteAllFile = async (req, res, next) => {
  try {
    const { video = {}, photos = [{}] } = req.post;
    if (video !== {}) {
      await File.findOneAndDelete({
        key: video.key,
      });
      const params = deleteParams(video);
      bucket.deleteObject(params, (error, data) => {
        if (error) {
          return Promise.reject(error);
        }
      });
    }
    if (photos !== [{}]) {
      for (const key in photos) {
        if (photos.hasOwnProperty(key)) {
          const file = photos[key];
          await File.findOneAndDelete({
            key: file.key,
          });
          const params = deleteParams(file);
          bucket.deleteObject(params, (error, data) => {
            if (error) {
              return Promise.reject(error);
            }
          });
        }
      }
    }
    return next();
  } catch (error) {
    return Promise.reject(error);
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
    const params = deleteParams(file);
    bucket.deleteObject(params, (error, data) => {
      if (error) {
        return Promise.reject(error);
      }
    });
    res.json({ message: `Files deleted: ${file.key}` });
  } catch (error) {
    return Promise.reject(error);
  }
};
