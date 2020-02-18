const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const index = require('../controllers/indexController');

// Welcome Page
router.get('/', index.welcome);

// Welcome Page
router.get('/', ensureAuthenticated, index.hello);

module.exports = router;
