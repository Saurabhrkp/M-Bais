const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { catchErrors } = require('../controllers/controlHelper');

/**
 * AUTH ROUTES: /api/auth
 */

// Register
router.post(
  '/auth/signup',
  userController.validateSignup,
  catchErrors(userController.signup)
);

// Login
router.post('/auth/signin', userController.signin);

// Logout
router.get('/auth/signout', userController.signout);

/**
 * USER ROUTES: /api/users
 */
router.param('userId', userController.getUserById);

router
  .route('/users/:userId')
  .get(userController.getAuthUser)
  .put(
    userController.checkAuth,
    userController.uploadAvatar,
    catchErrors(userController.resizeAvatar),
    catchErrors(userController.updateUser)
  )
  .delete(userController.checkAuth, catchErrors(userController.deleteUser));

router.get('/users/profile/:userId', userController.getUserProfile);

router.get(
  '/users/feed/:userId',
  userController.checkAuth,
  catchErrors(userController.getUserFeed)
);

module.exports = router;

/**
 //FIXME:
 * 'mongoose-paginate-v2'
 */
