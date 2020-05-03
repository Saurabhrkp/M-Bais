const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const {
  catchErrors,
  uploadVideo,
  uploadImage,
} = require('../controllers/controlHelper');

/**
 * USER ROUTES: /admin
 */

router.param('username', userController.getUserByUsername);

router.param('slug', indexController.getPostBySlug);

router
  .route('/article/:username')
  .get(userController.checkAuth, catchErrors(adminController.getAdminFeed))
  .post(
    userController.checkAuth,
    adminController.uploadVideo,
    catchErrors(uploadVideo),
    // catchErrors(uploadImage),
    catchErrors(adminController.savePost)
  );

// ! PUT Can be modified for replacing Video and Image
router
  .route('/:slug')
  .delete(
    userController.checkAuth,
    adminController.deleteVideo,
    // adminController.deleteImage,
    catchErrors(adminController.deletePost)
  )
  .put(
    userController.checkAuth,
    adminController.uploadVideo,
    catchErrors(uploadVideo),
    catchErrors(uploadImage),
    catchErrors(adminController.updatePost)
  );

router.get(
  '/all/users',
  userController.checkAuth,
  catchErrors(adminController.getUsers)
);

router.delete(
  '/:slug/video',
  adminController.deleteVideo,
  catchErrors(adminController.updatePost)
);

router.delete(
  '/:slug/image',
  adminController.deleteImage,
  catchErrors(adminController.updatePost)
);

module.exports = router;
