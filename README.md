# Mech-Bais
Dharvesh's Project

Working on Project to show-case for business.

<!-- ? # TODO: Check All Routes 

- # /posts, index ⚡
  - ## PARAMS postID ✔
    - indexController.getPostByIds ✔
  - ## /new ❔
    - ### POST ✔
      - userController.checkAuth ✔
      - indexController.uploadImage ✔
        - indexController.resizeImage ❔
        - indexController.addPost ✔
  - ## PARAMS username
  - ## /by/:username ⚡
    - ### GET ✔
        - indexController.getPostsByUser ✔
  - ## /feed ⚡
    - ### GET ✔
      - indexController.getPostFeed ✔
  - ## PARAMS filename
  - ## /play/:filename
    - ### GET 
      - indexController.playVideo
  - ## /delete ⚡
    - ### DELETE ✔
      - userController.checkAuth ✔
        - indexController.deletePost ✔
  - ## /comment ⚡
    - ### PUT ✔
      - userController.checkAuth ✔
        - indexController.toggleComment ✔
  - ## /uncomment ⚡
    - ### PUT ✔
      - userController.checkAuth ✔
        - indexController.toggleComment ✔
  - ## /like ⚡
    - ### PUT ✔
      - userController.checkAuth ✔
        - indexController.toggleLike ✔
  - ## /unlike ⚡
    - ### PUT ✔
      - userController.checkAuth ✔
        - indexController.toggleLike ✔
- # /api, user
  - ## /signup ⚡
    - ### POST ✔
      - userController.validateSignup ✔
        - userController.signup ✔
  - ## /signin ⚡
    - ## POST ✔
      - userController.signin ✔
  - ## /signout ⚡
    - ## GET ✔
      - userController.signout ✔
  - ## PARAMS userId
    - userController.getUserById
  - ## /users/:userId ⚡
    - ### GET ✔
      - userController.getAuthUser ✔
    - ### PUT ✔
      - userController.checkAuth ✔
      - userController.uploadAvatar ✔
        - userController.resizeAvatar ✔
        - userController.updateUser ✔
    - ### DELETE ✔
      - userController.checkAuth ✔
        - userController.deleteUser ✔
  - ## /users/profile/:userId ⚡
    - ### GET ✔
    - userController.getUserProfile ✔
  - ## /users/feed/:userId ❔
    - ### GET ✔
      - userController.checkAuth ✔
        - userController.getUserFeed ❔
- # /admin, admin
  - ## userId
    - userController.getUserById
  - ## ROUTE /article/:userId
    - ### GET
      - userController.getAuthUser
        - adminController.getAdminFeed
    - ### POST
      - userController.checkAuth
      - adminController.uploadVideo
        - adminController.savePost
    - ### PUT
      - userController.checkAuth
      - adminController.uploadVideo
        - adminController.savePost
    - ### DELETE
      - userController.checkAuth
      - userController.deleteUser
  - ## /play/:filename
    - ### GET
      - indexController.playVideo
  - ## /all/users
    - ### GET
      - adminController.getUsers
  - ## /video/:filename
    - ### DELETE
      - adminController.deleteVideo
  - ## /image/:filename
    - ## DELETE
      - adminController.deleteImage -->

<!--
? USE ME For Creating Good Article
<script src="https://cdn.ckeditor.com/4.11.4/standard/ckeditor.js"></script>

<textarea name='article'></textarea>

<script>
  CKEDITOR.replace('article');
</script>

! Do check this for pagination

'mongoose-paginate-v2'

-->