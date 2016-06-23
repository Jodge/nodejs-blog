// app.js

// set up =====================================================================
// get all the component we require
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var path = require('path');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');

var configDB = require('./config/database');

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
if ('development' == app.get('env')) {
	app.use(errorHandler());
}

// routes =======================================================================
require('./app/routes')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('Express server listening to port ' + port);