// app.js

// set up =====================================================================
// get all the component we require
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var errorHandler = require('errorhandler');

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

// routes =======================================================================
require('./routes')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('Express server listening to port ' + port);





// var express = require('express'),
// 	routes = require('./routes'),
// 	http = require('http'),
// 	path = require('path'),
// 	mongoose = require('mongoose'),
// 	models = require('./models'),
// 	dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/nodejs',
// 	db = mongoose.connect(dbUrl, {safe : true});

// // Express.js Middleware
// var logger = require('morgan'),
// 	errorHandler = require('errorhandler'),
// 	bodyParser = require('body-parser'),
// 	methodOverride = require('method-override'),
// 	cookieParser = require('cookie-parser'),
// 	session = require('express-session');

// var app = express();
// app.locals.appTitle = 'NodeJS Blog';

// app.use(function(req, res, next) {
// 	if(!models.Post && !models.User)
// 		return next(new Error("No models"))
// 	req.models = models;
// 	return next();
// });

// // Express.js configuration
// app.set('port', process.env.PORT || 3000);
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// // Express.js middleware configuration
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(cookieParser());
// app.use(session({secret : '3T67774A-R649-4D44-9735-43E296ZZ980F', resave : true, saveUninitialized : true}));
// app.use(methodOverride());
// app.use(express.static(__dirname + '/public'));

// // Authentication middleware
// app.use(function(req, res, next) {
// 	if (req.session && req.session.logged)
// 		res.locals.logged = true;
// 	next();
// });

// // Authorization middleware
// var authorize = function(req, res, next) {
// 	if (req.session && req.session.logged) 
// 		return next();
// 	else
// 		return res.redirect('/login');
// };

// // development only
// if ('development' == app.get('env')) {
// 	app.use(errorHandler());
// }

// // pages and routes
// app.get('/', routes.index);
// app.get('/posts/:slug', routes.article.show);
// app.get('/post', authorize, routes.article.post);
// app.post('/post', authorize, routes.article.postArticle);
// app.get('/manage', authorize, routes.article.manage)
// app.get('/login', routes.user.login);
// app.post('/login', routes.user.authenticate);
// app.get('/register', routes.user.register);
// app.post('/register', routes.user.registerUser);
// app.get('/logout', routes.user.logout);

// // REST API routes
// app.all('/api', authorize);
// app.get('/api/articles', routes.article.list);
// app.post('/api/articles', routes.article.add);
// app.put('/api/articles/:id', routes.article.edit);
// app.delete('/api/articles/:id', routes.article.delete);

// app.all('*', function(req, res) {
// 	res.sendStatus(404);
// });

// var server = http.createServer(app);
// var boot = function() {
// 	server.listen(app.get('port'), function() {
// 		console.log('Express server listening to port ' + app.get('port'));
// 	});
// }
// var shutdown = function() {
// 	server.close();
// }
// if (require.main === module) {
// 	boot();
// } else {
// 	console.info('Running app as a module')
// 	exports.boot = boot;
// 	exports.shutdown = shutdown;
// 	exports.port = app.get('port');
// }