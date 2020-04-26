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

router
  .route('/article/:userId')
  .get(userController.checkAuth, catchErrors(adminController.getAdminFeed))
  .post(
    userController.checkAuth,
    adminController.uploadVideo,
    catchErrors(uploadVideo),
    catchErrors(uploadImage),
    catchErrors(adminController.savePost)
  )
  .put(
    userController.checkAuth,
    adminController.uploadVideo,
    catchErrors(uploadVideo),
    catchErrors(uploadImage),
    catchErrors(adminController.savePost)
  )
  .delete(
    userController.checkAuth,
    adminController.deleteVideo,
    adminController.deleteImage,
    catchErrors(adminController.deletePost)
  );

router.get('/play/:filename', indexController.playVideo);

router.get('/all/users', adminController.getUsers);

router.delete(
  '/video/:filename',
  adminController.deleteVideo,
  catchErrors(adminController.updatePost)
);

router.delete(
  '/image/:filename',
  adminController.deleteImage,
  catchErrors(adminController.updatePost)
);

module.exports = router;
