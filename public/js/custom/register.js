$(document).ready(function() {
		
	// Setup form validation on the #register-form element
	$("#register-form").validate({
		
		// specify the validation rules
		rules : {
			fullname : {
				required : true,
				minLength : 6,
				maxlength : 30
			},
			email : {
				required : true,
				email : true
			},
			password : {
				required : true,
				minlength : 6
			},
			password_confirm : {
				minlength : 6,
				equalTo : "#password"
			}
		},
				
		// specify the validation error messages
		messages : {
			fullname : {
				required : "Please enter you fullname",
				minlength : "Name should not be less than 6 characters",
				maxlength : "Name should not be more than 30 characters"
			},
			email : {
				required : "Please enter your email",
				email : "Please enter the correct mail address"
			},
			password : {
				required : "Please enter your password",
				minlength : "Password should have a minimum of 6 characters"
			},
			password_confirm : {
				minlength : "Password should have a minimum of 6 characters",
				equalTo : "Passwords did not match"
			}
		},				
		submitHandler : function(form) {
			form.submit();
		}
	});
});