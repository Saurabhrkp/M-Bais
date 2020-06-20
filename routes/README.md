# Routes

This folder routes the incoming request to specified controller based on [*URL path*](https://expressjs.com/en/4x/api.html#app.path), [*params*](https://expressjs.com/en/4x/api.html#req.params), [*Request METHODS*](https://expressjs.com/en/4x/api.html#app.METHOD).

Handles and chains all middleware calls for routes.

---
**In app.js this folder is called.**
```
// Calling routes
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const adminRouter = require('./routes/admin');

```
Assigned to variables then [*pass as options to Express app*](https://expressjs.com/en/4x/api.html#app.use).
```
// Routes
app.use('/', indexRouter);
app.use('/api', userRouter);
app.use('/admin', adminRouter);
```
---

[***Router Param***](https://expressjs.com/en/4x/api.html#router.param)

Adds callback triggers to route parameters, where name is the name of the parameter and callback is the callback function. Although name is technically optional, using this method without it is deprecated starting with Express v4.11.0 (see below).

The parameters of the callback function are:

- req, the request object.
- res, the response object.
- next, indicating the next middleware function.
- The value of the name parameter.
- The name of the parameter.

---

[***What is a slug?***](https://yoast.com/slug/)

A slug is the part of a URL which identifies a particular page on a website in an easy to read form. In other words, it’s the part of the URL that explains the page’s content. For this article, for example, the URL is https://yoast.com/slug, and the slug simply is ‘slug’.

---

# *index.js*

Handles requests for  ``` /* ```

- Request on [*Route*](https://expressjs.com/en/4x/api.html#router.route)  ``` / ``` of [*GET*](https://expressjs.com/en/4x/api.html#app.get.method) is handled here. Four Post on each page and with pagination, using query for next page.

```
router.get('/', catchErrors(indexController.getPosts));
```

- ```:slug``` is [*param*](https://expressjs.com/en/4x/api.html#router.param) and gets the post with this slug and pass on to next middleware.

```
router.param('slug', indexController.getPostBySlug);
```

- Request on [*Route*](https://expressjs.com/en/4x/api.html#router.route)  ``` /:slug/like ``` and ``` /:slug/unlike ``` of [*PUT*](https://expressjs.com/en/4x/api.html#app.put.method) is handled here. This route is to Like and Unlike post.

```
router.put(
  '/:slug/like',
  userController.checkAuth,
  catchErrors(indexController.toggleLike)
);

router.put(
  '/:slug/unlike',
  userController.checkAuth,
  catchErrors(indexController.toggleLike)
);
```

- Request on [*Route*](https://expressjs.com/en/4x/api.html#router.route)  ``` /:slug/comment ``` and ``` /:slug/uncomment ``` of [*PUT*](https://expressjs.com/en/4x/api.html#app.put.method) is handled here. This route is to Comment and Uncomment post.

```
router.put(
  '/:slug/comment',
  userController.checkAuth,
  catchErrors(indexController.toggleComment)
);

router.put(
  '/:slug/uncomment',
  userController.checkAuth,
  catchErrors(indexController.toggleComment)
);
```

- Request on [*Route*](https://expressjs.com/en/4x/api.html#router.route)  ``` /:slug/save ``` and ``` /:slug/remove ``` of [*PUT*](https://expressjs.com/en/4x/api.html#app.put.method) is handled here. This route is to Save and Remove post.

```
router.put(
  '/:slug/save',
  userController.checkAuth,
  catchErrors(userController.toggleSavedPost)
);

router.put(
  '/:slug/remove',
  userController.checkAuth,
  catchErrors(userController.toggleSavedPost)
);
```

- Request on [*Route*](https://expressjs.com/en/4x/api.html#router.route)  ``` /search ``` of [*POST*](https://expressjs.com/en/4x/api.html#app.post.method) are handled here. To searchs post based on code.

```
router.post(
  '/search',
  userController.checkAuth,
  catchErrors(indexController.searchPost),
  catchErrors(indexController.sendPost)
);
```

- Request on [*Route*](https://expressjs.com/en/4x/api.html#router.route)  ``` /:slug ``` of [*GET*](https://expressjs.com/en/4x/api.html#app.get.method) are handled here. ``` /:slug ``` params runs middleware to get post with slug and renders Post page.

```
router
  .route('/:slug')
  .get(userController.checkAuth, catchErrors(indexController.sendPost));
```
---

# *users.js*

Handles requests for  ``` /api/* ```

- Request on [*Route*](https://expressjs.com/en/4x/api.html#router.route)  ``` /signup ``` of [*GET*](https://expressjs.com/en/4x/api.html#app.get.method) and [*POST*](https://expressjs.com/en/4x/api.html#app.post.method) are handled here. Gets the sign up page and signs up users by post request to route.

```
router
  .route('/signup')
  .get(userController.get_signup)
  .post(userController.validateSignup, catchErrors(userController.signup));
```

- Request on [*Route*](https://expressjs.com/en/4x/api.html#router.route)  ``` /login ``` of [*GET*](https://expressjs.com/en/4x/api.html#app.get.method) and [*POST*](https://expressjs.com/en/4x/api.html#app.post.method) are handled here. Gets the Login page and logs in users by post request to route.

```
// Login
router
  .route('/signin')
  .get(userController.get_signin)
  .post(userController.signin);
```

- Request on [*Route*](https://expressjs.com/en/4x/api.html#router.route)  ``` /signout ``` of [*GET*](https://expressjs.com/en/4x/api.html#app.get.method) is handled here. Sign out the user, redirects to homepage.

```
// Logout
router.get('/signout', userController.signout);
```

- ```:username``` is [*param*](https://expressjs.com/en/4x/api.html#router.param) and this will get user from database with username.

```
router.param('username', userController.getUserByUsername);
```

- Request on [*Route*](https://expressjs.com/en/4x/api.html#router.route)  ``` /:username ``` of [*GET*](https://expressjs.com/en/4x/api.html#app.get.method), [*PUT*](https://expressjs.com/en/4x/api.html#app.put.method), [*DELETE*](https://expressjs.com/en/4x/api.html#app.delete.method) is handled here. This routes gets profile pages with user from username, Update profile, and Delete Profile. Can upload profile photo.

```
router
  .route('/:username')
  .get(userController.checkAuth, userController.getAuthUser)
  .put(
    userController.checkAuth,
    upload.fields([{ name: 'avatar', maxCount: 1 }]),
    catchErrors(saveFile),
    catchErrors(checkAndChangeProfile),
    catchErrors(userController.updateUser)
  )
  .delete(
    userController.checkAuth,
    catchErrors(checkAndChangeProfile),
    catchErrors(userController.deleteUser)
  );
```
---

# *admin.js*


Handles requests for  ``` /admin/* ```

- ```:slug``` is [*param*](https://expressjs.com/en/4x/api.html#router.param) and gets the post with this slug and pass on to next middleware.

```
router.param('slug', indexController.getPostBySlug);
```

- Request on [*Route*](https://expressjs.com/en/4x/api.html#router.route)  ``` /panel ``` of [*GET*](https://expressjs.com/en/4x/api.html#app.get.method) is handled here. This gets the Admin Panel.

```
router.get('/panel', userController.checkAuth, adminController.adminpanel);
```

- Request on [*Route*](https://expressjs.com/en/4x/api.html#router.route)  ``` /create ``` of [*GET*](https://expressjs.com/en/4x/api.html#app.get.method) and [*POST*](https://expressjs.com/en/4x/api.html#app.post.method) are handled here. Gets the create post page and creates new post by POST request to route. With one video, at most 6 photos and one thumbnail.

```
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
```

- Request on [*Route*](https://expressjs.com/en/4x/api.html#router.route)  ``` /:slug ``` of [*GET*](https://expressjs.com/en/4x/api.html#app.get.method), [*PUT*](https://expressjs.com/en/4x/api.html#app.put.method), [*DELETE*](https://expressjs.com/en/4x/api.html#app.delete.method) is handled here. This routes gets post pages with post from slug, Update post, and Delete post. Can update video, photos and thumbnail.

```
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
```

- Request on [*Route*](https://expressjs.com/en/4x/api.html#router.route)  ``` /all/users ```, ``` /all/posts ``` and ``` /all/files ``` of [*GET*](https://expressjs.com/en/4x/api.html#app.get.method) are handled here. This all route get all list of users, posts, and files.

```
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
```