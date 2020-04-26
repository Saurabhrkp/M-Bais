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

router.param('userId', userController.getUserById);

router.param('postId', indexController.getPostById);

router
  .route('/article/:userId')
  .get(userController.checkAuth, catchErrors(adminController.getAdminFeed))
  .post(
    userController.checkAuth,
    adminController.uploadVideo,
    catchErrors(uploadVideo),
    catchErrors(uploadImage),
    catchErrors(adminController.savePost)
  );

// ! PUT Can be modified for replacing Video and Image
router
  .route('/:postId')
  .delete(
    userController.checkAuth,
    adminController.deleteVideo,
    adminController.deleteImage,
    catchErrors(adminController.deletePost)
  )
  .put(
    userController.checkAuth,
    adminController.uploadVideo,
    catchErrors(uploadVideo),
    catchErrors(uploadImage),
    catchErrors(adminController.updatePost)
  );

router.get('/play/:filename', indexController.playVideo);

router.get('/all/users', adminController.getUsers);

router.delete(
  '/:postId/video',
  adminController.deleteVideo,
  catchErrors(adminController.updatePost)
);

router.delete(
  '/:postId/image',
  adminController.deleteImage,
  catchErrors(adminController.updatePost)
);

module.exports = router;
