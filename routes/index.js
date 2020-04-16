const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const { catchErrors } = require('../controllers/controlHelper');

/**
 * POST ROUTES: /posts/
 */
router.param('postId', indexController.getPostById);

router.param('username', userController.getUserByUsername);

router.put(
  '/like',
  userController.checkAuth,
  catchErrors(indexController.toggleLike)
);

router.put(
  '/unlike',
  userController.checkAuth,
  catchErrors(indexController.toggleLike)
);

router.put(
  '/comment',
  userController.checkAuth,
  catchErrors(indexController.toggleComment)
);

router.put(
  '/uncomment',
  userController.checkAuth,
  catchErrors(indexController.toggleComment)
);

router.delete(
  '/delete/:postId',
  userController.checkAuth,
  catchErrors(indexController.deletePost)
);

router.post(
  '/:username/new',
  userController.checkAuth,
  indexController.uploadImage,
  catchErrors(indexController.resizeImage),
  catchErrors(indexController.addPost)
);

router.get('/by/:username', catchErrors(indexController.getPostsByUser));

router.get('/:username/feed', catchErrors(indexController.getPostFeed));

router.get('/play/:filename', indexController.playVideo);

module.exports = router;
