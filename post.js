var mongoose = require('mongoose');

var postSchema  = new mongoose.Schema({
	title : {
		type : String,
		required : true,
		validate : [
			function(value) {
				return value.length<=120
			},
			'Title is too long (120 max)'
		],
		default : "New Post Entry"
	},
	text : String,
	slug : {
		type : String,
		set : function(value) {
			return value.toLowerCase().replace(' ', '-')
		}
	}
});

postSchema.static({
	list : function(callback) {
		this.find({}, null, {sort : {_id : -1}}, callback);
	}
});
module.exports = mongoose.model('Post', postSchema);