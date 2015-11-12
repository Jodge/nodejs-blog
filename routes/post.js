/*
 * GET post API
 */
 exports.list = function(req, res, next) {
 	req.models.Post.list(function(error, posts) {
 		if (error) return next(error);
 		res.send({posts:posts});
 	});
 };
