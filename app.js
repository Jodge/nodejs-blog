var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path'),
	mongoose = require('mongoose'),
	models = require('./public/models'),
	dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/nodejs',
	db = mongoose.connect(dbUrl, {safe : true});

// Express.js Middleware
var logger = require('morgan'),
	errorHandler = require('errorhandler'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override');

var app = express();
app.locals.appTitle = 'NodeJS Blog';

app.use(function(req, res, next) {
	if(!models.Post)
		return next(new Error("No models"))
	req.models = models;
	return next();
});

// Express.js configuration
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Express.js middleware configuration
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

// development only
if ('development' == app.get('env')) {
	app.use(errorHandler());
}

// pages and routes
app.get('/', routes.index);

app.all('*', function(req, res) {
	res.sendStatus(404);
});

var server = http.createServer(app);
var boot = function() {
	server.listen(app.get('port'), function() {
		console.log('Express server listening to port ' + app.get('port'));
	});
}
var shutdown = function() {
	server.close();
}
if (require.main === module) {
	boot();
} else {
	console.info('Running app as a module')
	exports.boot = boot;
	exports.shutdown = shutdown;
	exports.port = app.get('port');
}