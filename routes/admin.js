const express = require('express');
const router = express.Router();
const { ensureAdmin, forwardAdmin } = require('../config/auth');
const admin = require('../controllers/adminController');

// Admin panel
router.get('/', ensureAdmin, admin.panel);

// Admin panel post
router.post('/upload', ensureAdmin, admin.upload);

//
router.get('/viewAll', ensureAdmin, admin.viewAll);

//
router.get('/files/:filename', ensureAdmin, admin.getOne);

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
