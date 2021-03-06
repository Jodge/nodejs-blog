// config/passport.js
const LocalStrategy = require('passport-local').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

// load the user model
const User = require('../app/models/user');

// load the auth variables
const configAuth = require('./auth');

module.exports = function(passport) {

  // ========================================================================
  // passport session setup =================================================
  // ========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // use to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // ========================================================================
  // LOCAL LOGIN ============================================================
  // ========================================================================
  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass in the req from our router (lets us check that a use is logged in or not
  }, ((req, email, password, done) => {
    if (email)
      email.toLowerCase(); // use lower-case emails to avoid case-sensitive email matching

    // asynchronous
    process.nextTick(() => {
      User.findOne({'local.email' : email}, (err, user) => {
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
  })));

  // ========================================================================
  // LOCAL SIGNUP ===========================================================
  // ========================================================================
  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass in the req from our router (lets us check that a use ris logged in or not
  }, ((req, email, password, done) => {
    if (email) 
      email  = email.toLowerCase(); // use lower-case emails to avoid case-sensitive email matching

    // asynchronous
    process.nextTick(() => {
      if (!req.user) {

        User.findOne({'local.email' : email}, (err, user) => {
          // if there is any error, return the error
          if (err)
            return done(err);

          // check to see if theres already a user with that email
          if (user) {
            return done(null, false, req.flash('signupMessage', 'This email is already registered'));
          } else {
            // create the user
            const newUser = new User();

            newUser.local.email = email;
            newUser.local.fullname = newUser.capitalize(req.body.fullname);
            newUser.local.password = newUser.generateHash(password);

            newUser.save((err) => {
              if (err)
                return done(err);

              return done(null, newUser);
            });
          }

        });
      } else if(!req.user.local.email) {
        // ...presumably they're trying to connect a local account
        // BUT let's check if the email used to connect a local account is being used by another user
        User.findOne({ 'local.email' :  email }, (err, user) => {
          if (err)
            return done(err);
                    
          if (user) {
            return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
            // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
          } else {
            const u = req.user;
            u.local.email = email;
            u.local.password = user.generateHash(password);
            u.save((err) => {
              if (err)
                return done(err);
                            
              return done(null,user);
            });
          }
        });

      } else {
        // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
        return done(null, req.user);
      }
    });
  })));
	
  // ========================================================================
  // TWITTER ================================================================
  // ========================================================================
  passport.use(new TwitterStrategy({

    consumerKey : configAuth.twitterAuth.consumerKey,
    consumerSecret : configAuth.twitterAuth.consumerSecret,
    callbackURL : configAuth.twitterAuth.callbackURL
  },
  ((token, tokenSecret, profile, done) => {
    // make the code asynchronous
    // User.findOne only fires after we have all our data back from twitter
    process.nextTick(() => {
      User.findOne({ 'local.twitter_id' : profile.id}, (err, user) => {
        if (err)
          return done(err)
        // if user is found, log them in
        if (user) {
          return done(null, user);
        } else {
          // create a new user
          const newUser = new User();

          // set data
          newUser.local.twitter_id = profile.id;
          newUser.local.twitter_username = profile.username;
          newUser.local.fullname = profile.displayName;

          // save user
          newUser.save((err) => {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  })));
};