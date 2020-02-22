const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const fileupload = require('express-fileupload');
const app = express();

// Passport Config
require('./config/passport')(passport);

// Calling MongoDB
require('./database');

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Logging
app.use(logger('dev'));

// File upload middleware with options
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    safeFileNames: true,
    preserveExtension: true
  })
);

// Body parser for Forms
app.use(bodyParser.json());

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Method overrider
app.use(methodOverride('_method'));

// Servering static files
app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/admin', require('./routes/admin'));

module.exports = app;
