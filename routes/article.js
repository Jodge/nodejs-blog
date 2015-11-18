/*
 * GET post page
*/
exports.show = function(req, res, next) {
	if (!req.params.slug) return next(new Error('No post slug'));
	req.models.Post.findOne({slug : req.params.slug}, function(error, posts) {
		if (error) return next(error)
		res.render('article', posts);
	});
};

/*
 * GET post API
 */
 exports.list = function(req, res, next) {
 	req.models.Post.list(function(error, posts) {
 		if (error) return next(error);
 		res.send({posts:posts});
 	});
 };

  /*
  * POST article POST page
  */
exports.post = function(req, res, next) {
	if (!req.body.title)
		res.render('post');
}

 /*
  * POST article POST page
  */
  exports.postArticle = function(req, res, next) {
  	if (!req.body.title || !req.body.slug || !req.body.text) {
  		return res.render('post', {error: 'Fill title, slug, and text'});
  	}
  	var post = {
  		title : req.body.title,
  		slug : req.body.slug,
  		text : req.body.text,
      author: req.session.user,
      published: false
  	};
  	req.models.Post.create(post, function(error, postResponse) {
  		if (error) return next(error);
  		res.render('post', {success: 'Your post has been added succesfully'});
  	});
  };

  /*
   * GET manage page
   */
  exports.manage = function(req, res, next) {
    req.models.Post.find({"author" : req.session.user}, null, {sort: {_id:-1}}, function(error, posts)  {
      if (error) return next(error);
      res.render('manage', {posts : posts});
    });
  };
