const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const index = require('../controllers/indexController');

// Welcome Page
router.get('/', index.welcome);

// Dashboard Page
router.get('/dashboard', ensureAuthenticated, index.dashboard);

//
router.get('/search', ensureAuthenticated, index.search);

//
router.get('/files/:filename', ensureAuthenticated, index.getOne);

//
router.get('/show/:filename', ensureAuthenticated, index.show);

//
router.get('/play/:filename', ensureAuthenticated, index.play);

// Contact Page
router.get('/contact', index.contact);

module.exports = router;
