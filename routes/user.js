/*
 * Get user listing
 */
 exports.list = function(req, res) {
 	res.send('respond with a resource');
 };

 /*
  * GET login page
  */
 exports.login = function(req, res, next) {
  	res.render('login');
 }

  /*
   * GET logout page
   */
  exports.logout = function(req, res, next) {
   	req.session.destroy();
   	res.redirect('/');
  }

   /*
    * POST authenticate route
    */
  exports.authenticate = function(req, res, next) {
  	if (!req.body.email || !req.body.password)
  		return res.render('login', {error : 'Enter your email and password'});
  	req.models.User.findOne({
  		email : req.body.email,
  		password : req.body.password
  	}, function(error, user) {
  		if (error) return next(error);
  		if (!user) return res.render('login', {error : 'Incorrect email&password combination'});
  		req.session.user = user;
  		res.redirect('/');
  	})
  };
