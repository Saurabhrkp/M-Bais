const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const { catchErrors, uploadImage } = require('../controllers/controlHelper');

/**
 * POST ROUTES: /posts/
 */
router.get('/', catchErrors(indexController.getPosts));

router.param('slug', indexController.getPostBySlug);

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

router.post(
  '/:username/new',
  userController.checkAuth,
  indexController.uploadPhoto,
  catchErrors(uploadImage),
  catchErrors(indexController.addPost)
);

router.get('/by/:username', catchErrors(indexController.getPostsByUser));

router.get(
  '/search',
  catchErrors(indexController.searchPost),
  catchErrors(indexController.sendPost)
);

router
  .route('/:slug')
  .get(catchErrors(indexController.sendPost))
  .put(
    userController.checkAuth,
    indexController.uploadPhoto,
    catchErrors(uploadImage),
    catchErrors(indexController.updatePost)
  )
  .delete(userController.checkAuth, catchErrors(indexController.deletePost));

module.exports = router;
