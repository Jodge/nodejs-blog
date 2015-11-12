exports.post = require('./post');
/*
* GET home page
*/

exports.index = function(req, res, next) {
	req.models.Post.find({}, null, {sort: {_id:-1}}, function(error, posts) {
		if (error) return next(error);
		res.render('index', {posts : posts})
	})
};