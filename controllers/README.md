# Controllers

***Controller:***

Controller controls the requests of the user and then generates appropriate response which is fed to the viewer. Typically, the user interacts with the View, which in turn generates the appropriate request, this request will be handled by a controller. The controller renders the appropriate view with the model data as a response.

---

[***Using template engines with Express***](http://expressjs.com/en/guide/using-template-engines.html)

A template engine enables you to use static template files in your application. At runtime, the template engine replaces variables in a template file with actual values, and transforms the template into an HTML file sent to the client. This approach makes it easier to design an HTML page.

Some popular template engines that work with Express are Pug, Mustache, and EJS. The Express application generator uses Jade as its default, but it also supports several others.

[*res.render(view [, locals] [, callback])*](https://expressjs.com/en/4x/api.html#res.render)

Renders a view and sends the rendered HTML string to the client. Optional parameters:

- locals, an object whose properties define local variables for the view.
- callback, a callback function. If provided, the method returns both the possible error and rendered string, but does not perform an automated response. When an error occurs, the method invokes next(err) internally.

The view argument is a string that is the file path of the view file to render. This can be an absolute path, or a path relative to the views setting. If the path does not contain a file extension, then the view engine setting determines the file extension. If the path does contain a file extension, then Express will load the module for the specified template engine (via require()) and render it using the loaded module’s __express function.

[***express-validator***](https://express-validator.github.io/docs/index.html)

An express.js middleware for validator. express-validator is a set of express.js middlewares that wraps validator.js validator and sanitizer functions.

[*Sanitization*](https://express-validator.github.io/docs/sanitization.html)

Sometimes, receiving input in a HTTP request isn't only about making sure that the data is in the right format, but also that it is free of noise.

validator.js provides a handful of sanitizers that can be used to take care of the data that comes in.

[***Async***](https://caolan.github.io/async/v3/)

Async is a utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript. Although originally designed for use with Node.js and installable via npm i async, it can also be used directly in the browser.

- [*parallel(tasks, callbackopt)*](https://caolan.github.io/async/v3/docs.html#parallel)

  ```import parallel from 'async/parallel';```

  Run the tasks collection of functions in parallel, without waiting until the previous function has completed. If any of the functions pass an error to its callback, the main callback is immediately called with the value of the error. Once the tasks have completed, the results are passed to the final callback as an array.

- [*each(coll, iteratee, callbackopt)*](https://caolan.github.io/async/v3/docs.html#each)

  ```import each from 'async/each';```

  Applies the function iteratee to each item in coll, in parallel. The iteratee is called with an item from the list, and a callback for when it has finished. If the iteratee passes an error to its callback, the main callback (for the each function) is immediately called with the error.

---

# [***userController.js***](https://github.com/Saurabhrkp/M-Bias/blob/master/controllers/userController.js)


- This function when called for route, [renders](https://expressjs.com/en/4x/api.html#res.render) ```signup.ejs``` as signup.

  ```js
  exports.get_signup = (req, res) => {
    res.render('signup');
  };
  ```

- This is middleware that validates the sign up request sent from user. [*Sanitizes all fields*](https://express-validator.github.io/docs/sanitization.html). And Custom validators/sanitizers
Although express-validator offers plenty of handy validators and sanitizers through its underlying dependency validator.js, it doesn't always suffice when building your application.

  For these cases, you may consider writing a custom validator or a custom sanitizer.

  [***Custom validator***](https://express-validator.github.io/docs/custom-validators-sanitizers.html)

  A custom validator may be implemented by using the chain method .custom(). It takes a validator function.

  Custom validators may return Promises to indicate an async validation (which will be awaited upon), or throw any value/reject a promise to use a custom error message.

  ```js
  await body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage(`Name field can't be empty`)
    .run(req);
  await body('username')
    .trim()
    .isLength({ min: 6, max: 16 })
    .withMessage('Username has to be longer than 6.')
    .isAlphanumeric()
    .withMessage('Username has non-alphanumeric characters.')
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error('Username already in use');
      }
      return true;
    })
    .run(req);
  ```

  Here custom validator is used to check Username has been already taken by anyone.

  [*validationResult()*](https://express-validator.github.io/docs/validation-result-api.html)

  These methods are all available via require('express-validator').

  validationResult(req)
  req: the express request object
  `Returns: a Result object`

  Extracts the validation errors from a request and makes them available in a Result object.

  [*.array([options])*](https://express-validator.github.io/docs/validation-result-api.html#arrayoptions)

  options (optional): an object of options. Defaults to { onlyFirstError: false }
  `Returns: an array of validation errors.`

  Gets all validation errors contained in this result object.

  If the option onlyFirstError is set to true, then only the first error for each field will be included.

  ```js
  const errors = validationResult(req).array();
  if (errors.length > 0) {
    const error = errors.map((error) => error.msg)[0];
    const { name, email, username, password, passwordConfirmation } = req.body;
    return res.render('signup', {
      error,
      name,
      username,
      email,
      password,
      passwordConfirmation,
  });
  ```

  If validation fails on any field the errors are passed as an array and re-renders sign-up page with error or else pass the req, res to next middleware.

- After validation if no error are found, new user is created with Mongoose User Model imported with values, and using [***bcrypt library***](https://www.npmjs.com/package/bcrypt) hashed password is generated and replaced in user model, then finally save the user in mongodb and redirect new user to login page.

  ```js
  exports.signup = async (req, res, next) => {
    const { name, email, password, username } = req.body;
    const user = await new User({ name, email, username, password });
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    await user.save();
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/api/signin');
  };
  ```

- This function when called for route, [renders](https://expressjs.com/en/4x/api.html#res.render) ```signin.ejs``` as signin.

  ```js
  exports.get_signin = (req, res) => {
    res.render('signin');
  };
  ```

- Refer [Lib folder](https://github.com/Saurabhrkp/M-Bias/tree/master/lib) for more and See [*Passport*](http://www.passportjs.org/) and [*docs*](http://www.passportjs.org/docs/authenticate/).

  ```js
  exports.signin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.render('signin', { error: err.message });
      }
      if (!user) {
        return res.render('signin', { error: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.render('signin', { error: err.message });
        }
        res.redirect('/');
      });
    })(req, res, next);
  };
  ```

- This function destroys sessions, clears cookie and logs out user then redirects to index page. [*Session.destroy(callback)*](http://expressjs.com/en/resources/middleware/session.html)
Destroys the session and will unset the req.session property. Once complete, the callback will be invoked.

  ```js
  exports.signout = (req, res) => {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      req.logout();
      res.redirect('/');
    });
  };
  ```

- This middleware check if request made is by an authenticated user. If request made is Authenticated then pass it to next middleware else redirects it to signin page with error message.

  ```js
  exports.checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'You have to be registered and logged in');
    res.redirect('/api/signin');
  };
  ```

- This middleware fetchs profile of user from database from the username in URL params and also gets all liked post by user. Then pass it to next middleware.

  ```js
  exports.getUserByUsername = async (req, res, next, username) => {
    try {
      req.profile = await User.findOne({ username: username }).populate({
        path: 'saved',
        select: '-photos -body -video -comments -tags -likes ',
      });
      req.profile.liked = await Post.find({
        likes: { $in: [req.profile._id] },
      }).select('-photos -body -video -comments -tags -likes');
      next();
    } catch (error) {
      next(error);
    }
  };
  ```

- This function when called for route, [renders](https://expressjs.com/en/4x/api.html#res.render) ```profile.ejs``` as profile page with given user profile.

  ```js
  exports.getAuthUser = (req, res) => {
    res.render('profile', { profile: req.profile });
  };
  ```

- This function is for toggling saved post. It added if post dont exist in users profile and remove if previously not added to user profile and then redirects to same post page.

  ```js
  exports.toggleSavedPost = async (req, res, next) => {
    const user = await User.findOne({ _id: req.user.id });
    const savedIds = user.saved.map((id) => id.toString());
    const postId = req.post._id.toString();
    if (savedIds.includes(postId)) {
      await user.saved.pull(postId);
      req.flash('success_msg', `Removed from saved post: ${req.post.title}`);
    } else {
      await user.saved.push(postId);
      req.flash('success_msg', `Added to saved post: ${req.post.title}`);
    }
    await user.save();
    res.redirect(`/${req.post.slug}`);
  };
  ```

- This function is for updating user profile and redirecting to same profile page.

  ```js
  exports.updateUser = async (req, res, next) => {
    req.body.updatedAt = new Date().toISOString();
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    req.flash('success_msg', 'Your Account is updated');
    res.redirect(`/api/${req.user.username}`);
  };
  ```

- This function is to delete user profile and everything related to user which are not required then any more. Async library is used here. Please refer [*Async docs*](https://caolan.github.io/async/v3/docs.htm).

  ```js
  exports.deleteUser = async (req, res, next) => {
    await async.parallel([
      (callback) => {
        User.findByIdAndDelete(req.profile._id).exec(callback);
      },
      (callback) => {
        Post.updateMany(
          { likes: { $in: [req.profile._id] } },
          { $pull: { likes: req.profile._id } }
        ).exec(callback);
      },
    ]);
    const results = await async.parallel({
      comments: (callback) => {
        Comment.find({ postedBy: req.profile._id }).exec(callback);
      },
    });
    const deleteRefrence = async (comment) => {
      await Comment.findByIdAndDelete(comment._id);
      await Post.findOneAndUpdate(
        { comments: { $in: [comment._id] } },
        { $pull: { comments: comment._id } }
      );
    };
    await async.each(results.comments, deleteRefrence);
    res.redirect('/api/signout');
  };
  ```
---

# [***indexController.js***](https://github.com/Saurabhrkp/M-Bias/blob/master/controllers/indexController.js)

- This middleware gets post for provided slug in URL. If there is post with such slug then post is passed to next middleware and if no post exist with such slug then user is redirect to home page with error message of not found.

  ```js
  exports.getPostBySlug = async (req, res, next, slug) => {
    try {
      req.post = await Post.findOne({ slug: slug });
      if (req.post !== null) {
        return next();
      }
      req.flash(
        'error_msg',
        `No Video with slug: ${slug}, may be because slug is incorrect or modified`
      );
      res.redirect('/');
    } catch (error) {
      next(error);
    }
  };
  ```

- This middleware search post for provided code in search form. If there is post with such code then it is redirected to post page by its slug url and if no post exist with such code then user is redirect to home page with error message of not found.

  ```js
  exports.searchPost = async (req, res, next) => {
    const code = req.body.code;
    req.post = await Post.findOne({ code: code });
    if (req.post !== null) {
      return res.redirect(`/${req.post.slug}`);
    }
    req.flash(
      'error_msg',
      `No Video with code: ${code}, may be because code is incorrect`
    );
    res.redirect('/');
  };
  ```

- This function when called for route, [renders](https://expressjs.com/en/4x/api.html#res.render) ```post.ejs``` as post page with given post.

  ```js
  exports.sendPost = (req, res) => {
    res.render('post', { post: req.post, user: req.user });
  };
  ```

- This function is to get index page aafter user logs in and displays first 4 posts, have pagination to toggle to next pages which render the same page with next new post in databse.

  ```js
  exports.getPosts = async (req, res, next) => {
    if (!req.user) {
      res.render('index', { user: null });
    } else {
      const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 4,
      };
      const posts = await Post.paginate({}, options);
      res.render('index', { posts, user: req.user });
    }
  };
  ```

- This function is to toggle like/dislike for post and adds/removes user ObjectId to post.liked array.And redirect to same post.

  ```js
  exports.toggleLike = async (req, res, next) => {
    const { _id } = req.post;
    const post = await Post.findOne({ _id: _id });
    const likeIds = post.likes.map((id) => id.toString());
    const authUserId = req.user._id.toString();
    if (likeIds.includes(authUserId)) {
      req.flash('success_msg', `${req.post.title} removed from liked posts`);
      await post.likes.pull(authUserId);
    } else {
      req.flash('success_msg', `${req.post.title} added to liked posts`);
      await post.likes.push(authUserId);
    }
    await post.save();
    res.redirect(`/${req.post.slug}`);
  };
  ```

- This function toggles comments. It adds comment to post and removes comment by user when url includes uncomment word. And redirect to same post.

  ```js
  exports.toggleComment = async (req, res, next) => {
    let comment;
    let operator;
    if (req.url.includes('uncomment')) {
      operator = '$pull';
      comment = await Comment.findByIdAndDelete(req.body.id);
      req.flash('success_msg', `${comment.text} deleted from post`);
    } else {
      operator = '$push';
      comment = await new Comment({
        text: req.body.comment,
        postedBy: req.user._id,
      });
      await comment.save();
      req.flash('success_msg', `Added your comment to post`);
    }
    await Post.findOneAndUpdate(
      { _id: req.post._id },
      { [operator]: { comments: comment._id } },
      { new: true }
    );
    res.redirect(`/${req.post.slug}`);
  };
  ```
---

# [***adminController.js***](https://github.com/Saurabhrkp/M-Bias/blob/master/controllers/adminController.js)


- This function when called for route, [renders](https://expressjs.com/en/4x/api.html#res.render) ```admin-panel.ejs``` as admin panel with numbers of posts, users, files and create button.

  ```js
  exports.adminpanel = async (req, res, next) => {
    const results = await async.parallel({
      users: (callback) => {
        User.countDocuments(callback);
      },
      posts: (callback) => {
        Post.countDocuments(callback);
      },
      files: (callback) => {
        File.countDocuments(callback);
      },
    });
    results.create = 'Add Post';
    res.render('admin-panel', { results });
  };
  ```
- This function when called for route, [renders](https://expressjs.com/en/4x/api.html#res.render) ```post-form.ejs```. To enable admin to create new post.

  ```js
  exports.createPost = (req, res) => {
    res.render('post-form', { title: 'create' });
  };
  ```

- This function is to handle post request to create new post and then redirect to post page.

  ```js
  exports.savePost = async (req, res, next) => {
    req.body.author = req.user.id;
    req.body.tags = extractTags(req.body.tagString);
    const post = await new Post(req.body).save();
    const user = await User.findById(req.user.id);
    user.posts.push(post._id);
    await user.save();
    await Post.populate(post, {
      path: 'author video photos thumbnail',
      select: '_id name avatar source key',
    });
    res.redirect(`/${post.slug}`);
  };
  ```
- This function is to render ```post-form.ejs``` with the post to edit fetched by the slug of post in url.

  ```js
  exports.sendPostForm = (req, res) => {
    res.render('post-form', {
      title: 'update',
      post: req.post,
      user: req.user,
    });
  };
  ```

- This function renders ```list.ejs``` with posts, users, files. Renders list of all docs to edit and delete.

  ```js
  exports.getUsers = async (req, res, next) => {
    const users = await User.find();
    res.render('lists', { users });
  };

  exports.getPosts = async (req, res, next) => {
    const posts = await Post.find();
    res.render('lists', { posts });
  };

  exports.getFiles = async (req, res, next) => {
    const files = await File.find();
    res.render('lists', { files });
  };
  ```

- This function is to save updates made in post by admin on ```post-form.ejs``` page form.

  ```js
  exports.updatePost = async (req, res, next) => {
    req.body.publishedDate = new Date().toISOString();
    req.body.tags = extractTags(req.body.tagString);
    await Post.findOneAndUpdate(
      { _id: req.post._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    req.flash('success_msg', `${req.post.title} updated`);
    res.redirect(`${req.post.slug}`);
  };
  ```

- This function deletes the whole post, comments on post, files in post and removes all refrence of post.

  ```js
  exports.deletePost = async (req, res, next) => {
    const { _id } = req.post;
    const result = await async.parallel({
      user: (callback) => {
        User.findOneAndUpdate(req.user.id, { $pull: { posts: _id } }).exec(
          callback
        );
      },
      post: (callback) => {
        Post.findOneAndDelete({ _id }).exec(callback);
      },
    });
    const deleteRefrence = async (comment) => {
      await Comment.findByIdAndDelete(comment._id);
    };
    await async.each(result.post.comments, deleteRefrence);
    req.flash('success_msg', `Deleted ${req.post.tilte}`);
    res.redirect('/admin/panel');
  };
  ```

---

# [***controlHelper.js***](https://github.com/Saurabhrkp/M-Bias/blob/master/controllers/controlHelper.js)

- [*catchErrors(fn)*](https://gist.github.com/HectorBlisS/7e72ed8750ecfb73551107d6d7fe3bbb)
This is wrapper for async await functions as we need some middleware in order to avoid try catch statements Error handler middleware for async await.

  ```js
  /* Error handler for async / await functions */
  const catchErrors = (fn) => {
    return function (req, res, next) {
      return fn(req, res, next).catch(next);
    };
  };
  ```

- [***Multer***](https://www.npmjs.com/package/multer)

  Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.

  NOTE: Multer will not process any form which is not multipart (multipart/form-data).

  Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.

- [***Multer S3 Transform***](https://www.npmjs.com/package/multer-s3-transform)

  Streaming multer storage engine for AWS S3.

  This project is mostly an integration piece for existing code samples from Multer's storage engine documentation with s3fs as the substitution piece for file system. Existing solutions I found required buffering the multipart uploads into the actual filesystem which is difficult to scale.

- [***Transforming Files Before Upload***](https://www.npmjs.com/package/multer-s3-transform#transforming-files-before-upload)

  The optional shouldTransform option tells multer whether it should transform the file before it is uploaded. By default, it is set to false. If set to true, transforms option must be added, which tells how to transform the file. transforms option should be an Array, containing objects with can have properties id, key and transform.

- Upload is a Multer instance with [*options*](https://www.npmjs.com/package/multer#multeropts). [*Multer storage*](https://www.npmjs.com/package/multer#storage) used here is AWS S3 Bucket with bucket name, [acl](https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl), [*shouldTransform*](https://www.npmjs.com/package/multer-s3-transform#transforming-files-before-upload), [metadata](https://www.npmjs.com/package/multer-s3-transform#setting-metadata), key as name of file in bucket, [transforms](https://www.npmjs.com/package/multer-s3-transform#transforming-files-before-upload)

- [*limits*](https://www.npmjs.com/package/multer#limits)

  An object specifying the size limits of the following optional properties. Multer passes this object into busboy directly, and the details of the properties can be found on busboy's page.

- [*fileFilter*](https://www.npmjs.com/package/multer#filefilter)

  Set this to a function to control which files should be uploaded and which should be skipped.

  ```js
  // Multer is required to process file uploads and make them available via req.files.
  const upload = Multer({
    storage: multerS3({
      s3: bucket,
      bucket: process.env.bucketName,
      acl: 'public-read',
      shouldTransform: function (req, file, cb) {
        cb(
          null,
          file.mimetype.startsWith('image/') && !file.mimetype.includes('gif')
        );
      },
      metadata: function (req, file, cb) {
        if (req.body.body) {
          delete req.body.body;
        }
        cb(null, Object.assign({}, req.body));
      },
      key: function (req, file, cb) {
        cb(
          null,
          `${Date.now()}-${file.fieldname}.${file.mimetype.split('/')[1]}`
        );
      },
      transforms: [
        {
          id: 'original',
          key: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.fieldname}.png`);
          },
          transform: function (req, file, cb) {
            let options = { height: 600 };
            if (file.fieldname == 'avatar') {
              options = { height: 200, width: 200 };
            }
            cb(null, sharp().resize(options).png({ compressionLevel: 6 }));
          },
        },
      ],
    }),
    limits: {
      fileSize: 100 * 1024 * 1024, // no larger than 100mb, you can change as needed.
    },
    fileFilter: (req, file, next) => {
      if (
        file.mimetype.startsWith('image/') ||
        file.mimetype.startsWith('video/')
      ) {
        next(null, true);
      } else {
        next(null, false);
      }
    },
  });
  ```

- [*Converting file size from Bytes to KB, MB etc. Taken from stackoverflow.*](https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript)

  ```js
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  ```

- Saving files and returing Promise of saved files ObjectId. For files which are not transformed by `Multer-S3-Transform` don't contain `file.transforms[0]`.

  ```js
  const savingFile = async (file) => {
    try {
      let files = new File({
        contentType: file.mimetype.startsWith('image/')
          ? file.mimetype.includes('gif')
            ? file.mimetype
            : 'image/png'
          : file.mimetype,
        source: file.location ? file.location : file.transforms[0].location,
        size: file.size
          ? formatBytes(file.size)
          : formatBytes(file.transforms[0].size),
        key: file.key ? file.key : file.transforms[0].key,
      });
      let { id } = await files.save();
      return Promise.resolve(id);
    } catch (error) {
      return Promise.reject(error);
    }
  };
  ```

- Saving files on upload through multer upload engine. First check if there exists `req.files` or else return this function and pass to next middleware. Then `async.parallel` is used to run all contitions parallelly to reduce time to upload. `async.each` to save each photo in photos.

  ```js
  const saveFile = async (req, res, next) => {
    if (!req.files) {
      return next();
    }
    await async.parallel([
      async () => {
        if (req.files['avatar']) {
          const file = req.files['avatar'][0];
          req.body.avatar = await savingFile(file);
        }
        return;
      },
      async () => {
        if (req.files['photos']) {
          const photos = req.files['photos'];
          const arrayOfPhoto = [];
          const saveEach = async (photo) => {
            let id = await savingFile(photo);
            arrayOfPhoto.push(id);
          };
          await async.each(photos, saveEach);
          req.body.photos = new Array(...arrayOfPhoto);
        }
        return;
      },
      async () => {
        if (req.files['video']) {
          const file = req.files['video'][0];
          req.body.video = await savingFile(file);
        }
        return;
      },
      async () => {
        if (req.files['thumbnail']) {
          const file = req.files['thumbnail'][0];
          req.body.thumbnail = await savingFile(file);
        }
        return;
      },
    ]);
    return next();
  };
  ```

- Deleting File from AWS S3 Bucket by taking file as parameter.

  ```js
  const deleteFileFromBucket = async (file) => {
    try {
      return await bucket
        .deleteObject({ Bucket: process.env.bucketName, Key: file.key })
        .promise();
    } catch (error) {
      return Promise.reject(error);
    }
  };
  ```

- Deleting file from Bucket, MongoDB parallelly.

  ```js
  const deleteFileReference = async (file) => {
    await async.parallel([
      (callback) => {
        File.findOneAndDelete({
          key: file.key,
        }).exec(callback);
      },
      async () => {
        await deleteFileFromBucket(file);
      },
    ]);
  };
  ```

- Middleware to delete old Profile Photo of user and also while deleting user profile.

  ```js
  const checkAndChangeProfile = async (req, res, next) => {
    const { avatar } = req.profile;
    if (
      (avatar !== undefined && req.body.avatar !== undefined) ||
      (avatar !== undefined && req.url.includes('DELETE'))
    ) {
      await deleteFileReference(avatar);
    }
    return next();
  };
  ```
- Middleware to delete post files before replacing it with new files.

  ```js
  const deleteAllFiles = async (req, res, next) => {
    const { video, photos, thumbnail } = req.post;
    await async.parallel([
      async () => {
        if (req.body.video !== undefined || req.url.includes('DELETE')) {
          await deleteFileReference(video);
        }
        return;
      },
      async () => {
        if (req.body.thumbnail !== undefined || req.url.includes('DELETE')) {
          await deleteFileReference(thumbnail);
        }
        return;
      },
      async () => {
        if (req.body.photos !== undefined || req.url.includes('DELETE')) {
          await async.each(photos, deleteFileReference);
        }
        return;
      },
    ]);
    return next();
  };
  ```