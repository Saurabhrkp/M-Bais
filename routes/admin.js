const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const { catchErrors } = require('../controllers/controlHelper');

/**
 * USER ROUTES: /admin
 */

router.param('userId', userController.getUserById);

router
  .route('/article/:userId')
  .get(userController.getAuthUser, catchErrors(adminController.getAdminFeed))
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
  .delete(userController.checkAuth, catchErrors(userController.deleteUser));

router.get('/play/:filename', indexController.playVideo);

router.get('/all/users', adminController.getUsers);

router.delete('/video/:filename', adminController.deleteVideo);

router.delete('/image/:filename', adminController.deleteImage);

module.exports = router;
