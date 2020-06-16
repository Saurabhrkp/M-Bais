const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const {
  catchErrors,
  upload,
  saveFile,
  deleteAllFiles,
} = require('../controllers/controlHelper');

/**
 * Admin ROUTES: /admin
 */

router.param('slug', indexController.getPostBySlug);

router.get('/panel', userController.checkAuth, adminController.adminpanel);

router
  .route('/create')
  .get(userController.checkAuth, catchErrors(adminController.createPost))
  .post(
    userController.checkAuth,
    upload.fields([
      { name: 'video', maxCount: 1 },
      { name: 'photos', maxCount: 6 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
    catchErrors(saveFile),
    catchErrors(adminController.savePost)
  );

router
  .route('/:slug')
  .delete(
    userController.checkAuth,
    catchErrors(deleteAllFiles),
    catchErrors(adminController.deletePost)
  )
  .put(
    userController.checkAuth,
    upload.fields([
      { name: 'video', maxCount: 1 },
      { name: 'photos', maxCount: 6 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
    catchErrors(saveFile),
    catchErrors(deleteAllFiles),
    catchErrors(adminController.updatePost)
  )
  .get(userController.checkAuth, catchErrors(adminController.sendPostForm));

router.get(
  '/all/users',
  userController.checkAuth,
  catchErrors(adminController.getUsers)
);

router.get(
  '/all/posts',
  userController.checkAuth,
  catchErrors(adminController.getPosts)
);

router.get(
  '/all/files',
  userController.checkAuth,
  catchErrors(adminController.getFiles)
);

module.exports = router;
