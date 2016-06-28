// models/user.js
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define schema for our user model
var userSchema = mongoose.Schema({
	
	local : {
		fullname : {
		type : String,		
		},	
		email: {
    		type: String,
    		set: function(value) {return value.trim().toLowerCase()}
		},
		password : {
			type : String
		},
		admin : {
			type : Boolean,
			default : false
		},	
		created_at : {
			type : Date,
			required : true,
			default : Date.now
		},
		twitter_id : {
			type: Number
		},
		twitter_username : {
			type: String
		}
	}
});

// generate a hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// valdiating password
userSchema.methods.isValidPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
}

// capitalize user name
userSchema.methods.capitalize = function(str) {
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);