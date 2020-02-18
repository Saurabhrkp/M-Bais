const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, user.loginGet);

// Register Page
router.get('/register', forwardAuthenticated, user.registerGet);

// Register
router.post('/register', user.registerPost);

// Login
router.post('/login', user.loginPost);

// Logout
router.get('/logout', user.logout);

module.exports = router;
