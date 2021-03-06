const mongoose = require('mongoose');

const postSchema  = new mongoose.Schema({
  title : {
    type : String,
    required : true,
    validate : [
      function(value) {
        return value.length<=120
      },
      'Title is too long (120 max)'
    ],
    default : 'New Post Entry'
  },
  text : String,
  author : String,
  published : {
    type : Boolean,
    default : false
  },
  slug : {
    type : String,
    required : true,
    set : function(value) {
      return value.toLowerCase().replace(' ', '-')
    }
  },
  created_at : {
    type : Date,
    required : true,
    default : Date.now
  }
});

postSchema.static({
  list : function(callback) {
    this.find({}, null, {sort : {_id : -1}}, callback);
  }
});
module.exports = mongoose.model('Post', postSchema);