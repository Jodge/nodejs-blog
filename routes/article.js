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
  * POST article API
  */
exports.add = function(req, res, next) {
  if (!req.body.article) return next(new Error('No article payload.'));
  var article = req.body.article;
  article.published = false;
  req.models.Post.create(article, function(error, postResponse) {
    if (error) return next(error);
    res.send(postResponse);
  });
};

/*
 * PUT article API
*/
exports.edit = function(req, res, next) {
  if (!req.params.id) return next(new Error('No article ID.'));
  req.models.Post.findById(req.params.id, function(error, post) {
    if (error) return next(error);
    post.update({$set : req.body.article}, function(error, count, raw) {
      if (error) return next(error);
      res.send({affectedCount: count});
    });
  });
};

/*
 * DELETE article API
 */
 exports.delete = function(req, res, next) {
   if (!req.params.id) return next(new Error('No article ID.'));
   req.models.Post.findById(req.params.id, function(error, post) {
    if (error) return next(error);
      if (!post) return next(new Error('post not found'));
      post.remove(function(error, doc) {
        res.send(doc);
      });
    });
 };

  /*
  * GET article POST page
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
  	var article = {
  		title : req.body.title,
  		slug : req.body.slug,
  		text : req.body.text,
		author: req.session.user,
		published: false
  	};
  	req.models.Post.create(article, function(error, postResponse) {
  		if (error) return next(error);
  		res.render('post', {success: 'Your article has been added succesfully, go to manage page to publish it'});
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
