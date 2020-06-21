# Public

[***Serving static files***](https://expressjs.com/en/starter/static-files.html)

To serve static files such as images, CSS files, and JavaScript files, use the [*express.static*](https://expressjs.com/en/4x/api.html#express.static) built-in middleware function in Express.

The function signature is:

```
express.static(root, [options])
```

The root argument specifies the root directory from which to serve static assets. For more information on the options argument, see [*express.static*](https://expressjs.com/en/4x/api.html#express.static).

For example, use the following code to serve images, CSS files, and JavaScript files in a directory named [*public*](https://github.com/Saurabhrkp/M-Bias/tree/master/public):

```
app.use(express.static('public'))
```