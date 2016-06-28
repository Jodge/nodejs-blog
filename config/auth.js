// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'twitterAuth' : {
		'consumerKey' : 'your-consumer-key',
		'consumerSecret' : 'your-consumer-secret',
		'callbackURL' : 'http://localhost:3000/auth/twitter/callback'
	}
};