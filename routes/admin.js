const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const { catchErrors } = require('../controllers/controlHelper');

router.post(
  '/posts/video/:userId',
  userController.checkAuth,
  adminController.uploadVideo,
  catchErrors(adminController.uploadToGCS)
);

router.get('/files/:filename', adminController.getOne);

router.get('/play/:filename', indexController.playVideo);

router.delete('/delete/:filename', adminController.delete);

module.exports = router;
