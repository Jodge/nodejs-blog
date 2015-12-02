// models/user.js
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define schema for our user model
var userSchema = mongoose.Schema({
	
	local : {
		fullname : {
		type : String,
		required : true,
		validate : [
			function(value) {
					return value.length>=6 && value.length<=30
			},
			'Name should not be between 6 and 30 characters']		
		},	
		email: {
    		type: String,
    		required: true,
    		set: function(value) {return value.trim().toLowerCase()},
    		validate: [
      			function(email) {
        			return (email.match(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i) != null)},
      'Invalid email']
		},
		password : {
			type : String,
			required : true
		},
		admin : {
			type : Boolean,
			default : false
		},	
		created_at : {
			type : Date,
			required : true,
			default : Date.now
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

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);