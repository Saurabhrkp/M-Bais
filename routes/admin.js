const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const {
  catchErrors,
  upload,
  saveFile,
} = require('../controllers/controlHelper');

/**
 * Admin ROUTES: /admin
 */

router.get('/', catchErrors(indexController.getPosts));

router.param('username', userController.getUserByUsername);

router.param('slug', indexController.getPostBySlug);

router
  .route('/article/:username')
  .get(userController.checkAuth, catchErrors(adminController.getAllPosts))
  .post(
    userController.checkAuth,
    upload.fields([
      { name: 'video', maxCount: 1 },
      { name: 'photos', maxCount: 6 },
    ]),
    catchErrors(saveFile),
    catchErrors(adminController.savePost)
  );

router
  .route('/:slug')
  .delete(
    userController.checkAuth,
    catchErrors(adminController.deleteAllFiles),
    catchErrors(adminController.deletePost)
  )
  .put(
    userController.checkAuth,
    upload.fields([
      { name: 'video', maxCount: 1 },
      { name: 'photos', maxCount: 6 },
    ]),
    catchErrors(saveFile),
    catchErrors(adminController.updatePost)
  );

router.get(
  '/all/users',
  userController.checkAuth,
  catchErrors(adminController.getUsers)
);

router.delete('/:slug/photos/:file', catchErrors(adminController.deleteFile));

router.delete('/:slug/video/:file', catchErrors(adminController.deleteFile));

module.exports = router;
