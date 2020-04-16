const express = require('express');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const next = require('next');
const dev = process.env.NODE_DEV !== 'production'; //true false

nextApp.prepare();
const app = express();
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler(); //part of next config

// Passport Config
require('./lib/passport')(passport);

// Calling MongoDB
require('./models/database');

// Calling routes
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const adminRouter = require('./routes/admin');

// Logging
app.use(logger('dev'));

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

// Routes
app.use('/posts', indexRouter);
app.use('/api', userRouter);
app.use('/admin', adminRouter);

// for all the react stuff
app.get('*', (req, res) => {
  return handle(req, res);
});

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

module.exports = app;
