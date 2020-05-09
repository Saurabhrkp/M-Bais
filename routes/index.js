const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const { catchErrors } = require('../controllers/controlHelper');

/**
 * POST ROUTES: /posts/
 */
router.get('/', catchErrors(indexController.getPosts));

router.param('slug', indexController.getPostBySlug);

router.put(
  '/:slug/like',
  userController.checkAuth,
  catchErrors(indexController.toggleLike)
);

router.put(
  '/:slug/unlike',
  userController.checkAuth,
  catchErrors(indexController.toggleLike)
);

router.put(
  '/:slug/comment',
  userController.checkAuth,
  catchErrors(indexController.toggleComment)
);

router.put(
  '/:slug/uncomment',
  userController.checkAuth,
  catchErrors(indexController.toggleComment)
);

router.get(
  '/search',
  userController.checkAuth,
  catchErrors(indexController.searchPost),
  catchErrors(indexController.sendPost)
);

router
  .route('/:slug')
  .get(userController.checkAuth, catchErrors(indexController.sendPost));

module.exports = router;
