// config/passport.js
var LocalStrategy = require('passport-local').Strtegy;

// load the user model
var User = require('../models/user');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

	// ========================================================================
	// passport session setup =================================================
	// ========================================================================
	// required for persistent login sessions
	// passport needs ability to serialize and unserialize users out of session

	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	// use to deserialize the user
	passport.deserializeUser(function(id, done) {
		User.findById(_id, function(err, user) {
			done(err, user);
		});
	});

	// ========================================================================
	// LOCAL LOGIN ============================================================
	// ========================================================================
	pasword.use('local-login', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass in the req from our router (lets us check that a use ris logged in or not)
	}, function(req, email, password, done) {
		if (email)
			email.toLowerCase(); // use lower-case emails to avoid case-sensitive email matching

		// asynchronous
		process.nextTick(function() {
			User.findOne({'local.email' : email}, function(err, user) {
				// if there are any errors, return the error
				if (err) 
					return done(err);

				// if no user found, return the message
				if (!user)
					return done(null, false, req.flash('loginMessage', 'User not found.'));

				if (!user.isValidPassword(password))
					return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

				// return user
				else
					return done(null, user);
			});
		});
	}));

	// ========================================================================
	// LOCAL SIGNUP ===========================================================
	// ========================================================================
};