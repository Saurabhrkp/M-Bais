const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const { catchErrors } = require('../controllers/controlHelper');

/**
 * POST ROUTES: /api/posts
 */
router.param('postId', indexController.getPostById);

router.put(
  '/posts/like',
  userController.checkAuth,
  catchErrors(indexController.toggleLike)
);
router.put(
  '/posts/unlike',
  userController.checkAuth,
  catchErrors(indexController.toggleLike)
);

router.put(
  '/posts/comment',
  userController.checkAuth,
  catchErrors(indexController.toggleComment)
);
router.put(
  '/posts/uncomment',
  userController.checkAuth,
  catchErrors(indexController.toggleComment)
);

router.delete(
  '/posts/:postId',
  userController.checkAuth,
  catchErrors(indexController.deletePost)
);

router.post(
  '/posts/new/:userId',
  userController.checkAuth,
  indexController.uploadImage,
  catchErrors(indexController.resizeImage),
  catchErrors(indexController.addPost)
);

router.get('/posts/by/:userId', catchErrors(indexController.getPostsByUser));

router.get('/posts/feed/:userId', catchErrors(indexController.getPostFeed));

router.get('/play/:filename', indexController.playVideo);

module.exports = router;
