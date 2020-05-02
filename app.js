const express = require('express');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const next = require('next');
const dev = process.env.NODE_DEV !== 'production'; //true false

const app = express();
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler(); //part of next config
nextApp.prepare();

// Passport Config
require('./lib/passport')(passport);

// Calling MongoDB
require('./models/Database');

// Get Status of MongoDB
const mongo_express = require('mongo-express/lib/middleware');
var mongo_express_config = require('./models/config');
app.use('/mongo-express', mongo_express(mongo_express_config));

// Gets Status of Express app
app.use(require('express-status-monitor')());

// Calling routes
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const adminRouter = require('./routes/admin');

// Logging
app.use(
  logger('dev', {
    skip: (req) => req.url.includes('_next'),
  })
);

// Body parser for Forms
app.use(bodyParser.json());

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Servering static files
app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(
  session({
    secret: 'secret',
    name: 'next-express-connect.sid',
    rolling: true,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 14 /* expires in 14 days*/,
      httpOnly: true,
    }, // week
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  /* custom middleware to put our user data (from passport)
   * on the req.user so we can access it as such anywhere
   * in our app
   */
  res.locals.user = req.user || null;
  next();
});

/* give all Next.js's requests to Next.js server */
app.get('/_next/*', (req, res) => {
  handle(req, res);
});

// Routes
app.use('/posts', indexRouter);
app.use('/api', userRouter);
app.use('/admin', adminRouter);

/* Error handling from async / await functions */
app.use((err, req, res, next) => {
  const { status = 500, message } = err;
  res.status(status).json(message);
});

/* default route
  - allows Next to handle all other routes
  - includes the numerous `/_next/...` routes which must be exposed for the next app to work correctly
  - includes 404'ing on unknown routes 
*/
app.get('*', (req, res) => {
  return handle(req, res);
});

// Connect flash
app.use(flash());

module.exports = app;
