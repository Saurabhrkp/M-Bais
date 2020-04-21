const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const { catchErrors, uploadVideo } = require('../controllers/controlHelper');

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
    catchErrors(adminController.uploadToGCS)
  )
  .put(
    userController.checkAuth,
    adminController.uploadVideo,
    catchErrors(adminController.uploadToGCS)
  )
  .delete(
    userController.checkAuth,
    adminController.deleteVideo,
    adminController.deleteImage,
    catchErrors(adminController.deletePost)
  );
router.post(
  '/upload',
  userController.checkAuth,
  adminController.uploadVideo,
  catchErrors(uploadVideo),
  catchErrors(adminController.sendData)
);
router.get('/play/:filename', indexController.playVideo);

router.get('/all/users', adminController.getUsers);

router.delete(
  '/video/:filename',
  adminController.deleteVideo,
  catchErrors(adminController.sendResults)
);

router.delete(
  '/image/:filename',
  adminController.deleteImage,
  catchErrors(adminController.sendResults)
);

module.exports = router;
