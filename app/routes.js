// routes/index.js
const Post = require('./models/post');

module.exports = function (app, passport) {

  // ARTICLE ================================================================

  // display list of published articles

  app.get('/', (req, res, next) => {
    Post.find({
      published: true
    }, null, {
      sort: {
        _id: -1
      }
    }, (err, posts) => {
      if (err) return next(err);
      res.render('index', {
        posts: posts
      })
    })
  });

  //  display individual post article

  app.get('/posts/:slug', (req, res, next) => {
    Post.findOne({
      slug: req.params.slug
    }, (err, posts) => {
      if (err) return next(err)
      res.render('article', posts);
    });
  });

  // post an article

  app.get('/post', isLoggedIn, (req, res) => {
    if (!req.body.title)
      res.render('post');
  });

  app.post('/post', isLoggedIn, (req, res, next) => {
    if (!req.body.title || !req.body.slug || !req.body.text) {
      return res.render('post', {
        error: 'Fill title, slug, and text'
      });
    }
    const article = {
      title: req.body.title,
      slug: req.body.slug,
      text: req.body.text,
      author: req.user.local.fullname,
      published: false
    };

    Post.create(article, (err, postResponse) => {
      if (err) return next(err)
      res.render('post', {
        success: 'Your article has been added succesfully, go to publish page to publish it'
      });
    });
  });

  // publish page

  app.get('/publish', isLoggedIn, (req, res, next) => {
    Post.find({
      'author': req.user.local.fullname
    }, null, {
      sort: {
        _id: -1
      }
    }, (error, posts) => {
      if (error) return next(error);
      res.render('publish', {
        posts: posts
      });
    });
  });

  // AUTHENTICATION ===========================================================================

  // Sign Up
  app.get('/signup', (req, res) => {
    res.render('signup', {
      message: req.flash('signupMessage')
    });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // temporarily redirect to publish page
    failureRedirect: '/signup', // redirect back to signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // Login
  app.get('/login', (req, res) => {
    res.render('login', {
      message: req.flash('loginMessage')
    });
  });

  // twitter authentication and login
  app.get('/auth/twitter', passport.authenticate('twitter'));

  // handle the callback after twitter has authenticated the user
  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/signup'
  }));

  // Logout
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // temporarily redirect to publish page
    failureRedirect: '/login', // redirect back to login page if there is an error
    failureFlash: true // allow flash messages
  }));

  // USER PROFILE =============================================================================

  app.get('/profile', isLoggedIn, (req, res) => {
    //res.render('profile', {userImage : getAvatarUserImage(req.user.local.email)})
    res.render('profile')
  });

  // REST API ROUTES ==========================================================================

  // pulish or unpublish article

  app.put('/api/articles/:id', (req, res, next) => {
    if (!req.params.id) return next(new Error('No article ID.'));
    Post.findById(req.params.id, (err, post) => {
      if (err) return next(err);
      post.update({
        $set: req.body.article
      }, (err, count, raw) => {
        if (err) return next(err);
        res.send({
          affectedCount: count
        });
      });
    });
  });

  // delete article

  app.delete('/api/articles/:id', (req, res, next) => {
    if (!req.params.id) return next(new Error('No article ID.'));
    Post.findById(req.params.id, (err, post) => {
      if (err) return next(err);
      if (!post) return next(new Error('post not found'));
      post.remove((err, doc) => {
        res.send(doc);
      });
    });
  });

  // post article

  app.post('/api/articles', (req, res, next) => {
    if (!req.body.article) return next(new Error('No article payload.'));
    const article = req.body.article;
    article.published = false;
    Post.create(article, (err, postResponse) => {
      if (err) return next(err)
      res.send(postResponse);
    });
  });

  // get articles

  app.get('/api/articles', (req, res, next) => {
    Post.list((err, posts) => {
      if (err) return next(err);
      res.send({
        posts: posts
      });
    });
  });

  // CUSTOM FUNCTIONS ======================================================================

  // route middleware to ensure user is logged in
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/login');
  }
};