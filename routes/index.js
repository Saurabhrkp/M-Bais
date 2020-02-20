const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const index = require('../controllers/indexController');

// Welcome Page
router.get('/', index.welcome);

// Dashboard Page
router.get('/dashboard', ensureAuthenticated, index.dashboard);

// Contact Page
router.get('/contact', index.contact);

module.exports = router;
