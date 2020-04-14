const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { catchErrors } = require('../controllers/controlHelper');

/**
 * AUTH ROUTES: /api/auth
 */

// Register
router.post(
  '/signup',
  userController.validateSignup,
  catchErrors(userController.signup)
);

// Login
router.post('/signin', userController.signin);

// Logout
router.get('/signout', userController.signout);

module.exports = router;
