// app.js

// set up =====================================================================
// get all the component we require
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const errorHandler = require('errorhandler');
const methodOverride = require('method-override');

const configDB = require('./config/database');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our databse

require('./config/passport')(passport); // pass passport to configuration

// configure our express middleware
app.use(logger('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());
app.use(express.static(__dirname + '/public'));

// setup for templating
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// required for passport
app.use(session({secret : '3T67774A-R649-4D44-9735-43E296ZZ980F', resave : true, saveUninitialized : true}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(function(req,res,next){
  if (req.user) {
    res.locals.user = req.user.local;
  }
  next();
});

// setting app locals
app.locals.moment = require('moment');

// development only
if ('development' === app.get('env')) {
  app.use(errorHandler());
}

// routes =======================================================================
require('./app/routes')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);