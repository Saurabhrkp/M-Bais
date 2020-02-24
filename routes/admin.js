const express = require('express');
const router = express.Router();
const { ensureAdmin, forwardAdmin } = require('../config/auth');
const admin = require('../controllers/adminController');
const upload = require('../database').uploadFile;

// Admin panel
router.get('/', ensureAdmin, admin.panel);

// Admin panel post
router.post('/upload', upload.single('file'), ensureAdmin, admin.upload);

//
router.get('/viewAll', ensureAdmin, admin.viewAll);

//
router.get('/files/:filename', ensureAdmin, admin.getOne);

//
router.get('/view/:id', ensureAdmin, admin.viewOne);

//
router.get('/play/:filename', ensureAdmin, admin.play);

//
router.delete('/delete/:id', ensureAdmin, admin.delete);

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
