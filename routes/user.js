var bCrypt = require('bcrypt-nodejs');

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

    // check password
    req.models.User.findOne({
      email : req.body.email
    }, function(error, user) {
      if (error) return next(error);
      if (!user) return res.render('login', {error : 'Incorrect email & password combination'});
      if(!isValidPassword(user, req.body.password)) {
        return res.render('login', {error : 'Incorrect email & password combination'});
      }
      req.session.user = user.toObject().fullname;
      req.session.admin = user.toObject().admin;
      req.session.logged = true;
      res.redirect('/manage');
    });
  };
  
  /*
   * GET user registration 
   */
  exports.register = function(req, res, next) {
	res.render('register');
  }
  
  /*
   * POST user registration
   */
  exports.registerUser = function(req, res, next) {
	if (!req.body.fullname || !req.body.email || !req.body.password) {
  		return res.render('register', {error: 'Fill name, email, and password'});
  	}
	var user = {
		fullname : capitalizeEachWord(req.body.fullname),
		email : req.body.email,
		password : createHash(req.body.password),
		admin : false
	};
	req.models.User.create(user, function(error, postResponse) {
		if (error) return next(error);
		res.render('register', {success : 'Successfully registered, Login to start posting'});
	});
  };

// Generates hash using bCrypt
var createHash = function(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

// validate password
var isValidPassword = function(user, password) {
  return bCrypt.compareSync(password, user.password);
}


var capitalizeEachWord = function(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
