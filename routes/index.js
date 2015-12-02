// routes/index.js
var Post = require('../models/post');

module.exports = function(app, passport) {

	// ARTICLE ROUTES ================================================================

	// display list of published articles
	
	app.get('/', function(req, res, next) {
		Post.find({published : true}, null, {sort : {_id : -1}}, function(err, posts) {
			if (err) return next(err);
			res.render('index', {posts : posts})
		})
	});

	//  display individual post article

	app.get('/posts/:slug', function(req, res, next) {
		Post.findOne({slug : req.params.slug}, function(err, posts) {
			if (err) return next(err)
				res.render('article', posts);
		});
	});

	// post an article

	app.get('/post', function(req, res, next) {
		if  (!req.body.title)
			res.render('post');
	});

	app.post('/post', function(req, res, next) {
		if (!req.body.title || !req.body.slug || !req.body.text) {
  			return res.render('post', {error: 'Fill title, slug, and text'});
  		}
  		var article = {
  			title : req.body.title,
  			slug : req.body.slug,
  			text : req.body.text,
			author: "George Otieno",
			published: false
  		};

  		Post.create(article, function(err, postResponse) {
  			if (err) return next(err)
  			res.render('post', {success: 'Your article has been added succesfully, go to manage page to publish it'});
  		});
	});

	// publish page

	app.get('/publish', function(req, res, next) {
		Post.find({"author" : "George Otieno"}, null, {sort: {_id:-1}}, function(error, posts)  {
		if (error) return next(error);
		res.render('publish', {posts : posts});
		});
	});

	// AUTHENTICATION ===========================================================================

	// Sign Up
	app.get('/signup', function(req, res, next) {
		res.render('register', { message: req.flash('signupMessage') });
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/publish', // temporarily redirect to publish page
		failureRedirect : '/signup', // redirect back to signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// REST API ROUTES ==========================================================================

	// pulish or unpublish article

	app.put('/api/articles/:id', function(req, res, next) {
		if (!req.params.id) return next(new Error('No article ID.'));
		Post.findById(req.params.id, function(err, post) {
			if (err) return next(err);
			post.update({$set : req.body.article}, function(err, count, raw) {
      			if (err) return next(err);
      			res.send({affectedCount: count});
    		});
		});
	});

	// delete article

	app.delete('/api/articles/:id', function(req, res, next) {
		if (!req.params.id) return next(new Error('No article ID.'));
		Post.findById(req.params.id, function(err, post) {
			if (err) return next(err);
			if (!post) return next(new Error('post not found'));
			post.remove(function(err, doc) {
				res.send(doc);
			});
		});
	});

	// add article

	app.post('/api/articles', function(req, res, next) {
		if (!req.body.article) return next(new Error('No article payload.'));
		var article = req.body.article;
		article.published = false;
		Post.create(article, function(err, postResponse) {
  			if (err) return next(err)
  			res.send(postResponse);
  		});
	});


};