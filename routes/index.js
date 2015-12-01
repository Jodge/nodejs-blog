// routes/index.js
var Post = require('../models/post');

module.exports = function(app, passport) {

	// display list of published articles
	
	app.get('/', function(req, res, next) {
		Post.find({published : true}, null, {sort : {_id : -1}}, function(err, posts) {
			if (err) return next(err);
			res.render('index', {posts : posts})
		})
	});
};