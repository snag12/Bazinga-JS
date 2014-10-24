Bazinga-JS
==========

This is a new framework which in similar to Backbone JS. The objectives of this project is to understand the flow of MV* architecture which backbone implements. This is a basic prototype feel free to clone it start implementing it and let me know if you find any Bug in it.
I have used Underscore framework for genarating a template. There is not such hard dependencies on any other framework like jQuery.

Defining a Model & Collection

	var UserModel = Buzz.Model({

		primaryKey : '_id',

		defaultValue : {
			_id : "",
			CreatedOn : "",
			Email : "",
			FirstName : "",
			LastName : "",
			ContactNumber : "",
			ProfileImage : "",
			IsVerified : '',  //bool true/false
			Groups : new APP.Collection.Group(),
			Albums : new APP.Collection.Album()
		}
	});

	var UserCollection = Buzz.Collection({
		Models : UserModel
	});

var UserView = Buzz.View({

		events : [{
			element : "#reg-submit", //id or className
			methodName : "SubmitForm",
			eventName : "click"
		},
		{
			element : "#reg-cancel", //id or className
			methodName : "CancelForm",
			eventName : "click"	
		}
		],

		Element : 'div',

		template : _.template($("#userRegistration").html()),

		user_id : 0,

		init : function(Obj){
		  // Constructor which will get invoked when an user instantiate this Class
			this.render();
		},

		render : function(userDetails){
			var el = $(this.Element);
			if(userDetails)
				el.html(this.template(userDetails));
			else
				el.html(this.template);
			return this;
		}
	});
	
	//Instantiate the classes
	
	var userView = new UserView();
	var users = new UserCollection();
	var user = new UserModel();
	
	
	
