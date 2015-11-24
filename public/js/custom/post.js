$(document).ready(function() {
	
	jQuery.validator.addMethod("noSpace", function(value, element) {
			return value.indexOf(" ") < 0 ;
	}, "Repalces spaces with underscore (-)");
		
	// Setup form validation on the #post-form element
	$("#post-form").validate({
		
		// specify the validation rules
		rules : {
			title : {
				required : true,
				maxlength : 120
			},
			slug : {
				required : true,
				noSpace : true
			},
			text : "required"
		},
				
		// specify the validation error messages
		messages : {
			title : {
				required : "Please enter the article title",
				maxlength : "Title should to exceed 120 characters"
			},					
			slug : {
				required : "Please enter the article slug",
				noSpace : "Replace the spaces using underscore (-)"
			},
			text : "Please enter the article text"
		},				
		submitHandler : function(form) {
			form.submit();
		}
	});
});