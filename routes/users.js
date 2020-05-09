const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {
  catchErrors,
  upload,
  saveFile,
} = require('../controllers/controlHelper');

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

router.param('username', userController.getUserByUsername);

router
  .route('/:username')
  .get(userController.getAuthUser)
  .put(
    userController.checkAuth,
    upload.fields([{ name: 'avatar', maxCount: 1 }]),
    catchErrors(saveFile),
    catchErrors(userController.updateUser)
  )
  .delete(userController.checkAuth, catchErrors(userController.deleteUser));

router.get(
  '/profile/:username',
  userController.checkAuth,
  userController.getUserProfile
);

// ! Should be convert to get saved posts
router.get(
  '/:username/feed',
  userController.checkAuth,
  catchErrors(userController.getUserFeed)
);

module.exports = router;
