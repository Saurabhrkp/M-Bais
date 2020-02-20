const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const index = require('../controllers/indexController');

// Welcome Page
router.get('/', forwardAuthenticated, index.welcome);

// Welcome Page
router.get('/dashboard', ensureAuthenticated, index.dashboard);

module.exports = router;
