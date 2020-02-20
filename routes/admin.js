const express = require('express');
const router = express.Router();
const { ensureAdmin, forwardAdmin } = require('../config/auth');
const admin = require('../controllers/adminController');

// Load User model
const User = require('../models/User');

// Admin planel
router.get('/', ensureAdmin, admin.panel);

// Login Page
router.get('/login', forwardAdmin, admin.loginGet);

// Register Page
router.get('/register', forwardAdmin, admin.registerGet);

// Register
router.post('/register', admin.registerPost);

// Login
router.post('/login', admin.loginPost);

// Logout
router.get('/logout', admin.logout);

module.exports = router;
