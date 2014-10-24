/***
	Author : Sandip
	Version : 1.0
	Descriptions : 
***/

/**
	Buzz Model
	Descriptions : Define a models for that collection and pass a defaults object as an arguments while initilization 
	or by using getter or setter method.
**/
(function(window){

	var Buzz = {};

	var Inherit = function(Class, Object){
		var object = new Class();
		var jsClass = function(){
			this.initialize.apply(this, arguments);
		}

		for(var key in object) {
			if(key != 'initialize')
				jsClass.prototype[prop] = Object[prop];
		}
			
		for(var prop in Object){
			try
			{
				if(!jsClass.prototype.prop)
					jsClass.prototype.prop = Object[prop];
				else
					throw "Method with the same signature already exist";
			}	
			catch(e){
				console.log(e.message);
			}
		}
	}

	Buzz.Model = function(Object) {

		var jsClass = function(Object){
			this._id = 0;
			this.attributes = {};
			window.Object.observe(this.attributes, this.modelChanged);
			if(Object) {
				for(var key in Object) {
					if(Object.hasOwnProperty(key))
						this.attributes[key] = Object[key];
				}	
			}
			
			this.init.apply(this, arguments);
		};

		jsClass.prototype.get = function(key){
			if(this.attributes[key])
				return this.attributes[key];
		};

		jsClass.prototype.set = function(obj){
			var setId = false;
			for(var key in obj){
				if(obj.hasOwnProperty(key)) {
					this.attributes[key] = obj[key];
					if(this.primaryKey && key === this.primaryKey){
						this._id = obj[key];
						setId = true;
					}	
				}
			}
			if(!setId)
				this._id = Math.random() + (new Date()).getTime();
		};
		
		jsClass.prototype.clone = function(obj){
			if(obj == null || typeof(obj) != 'object')
				return;

			var temp = obj.constructor();
			for(var key in obj){
				if(obj.hasOwnProperty(key)){
					temp[key] = this.clone(obj[key]);
				}
			}

			return temp;
		};

		jsClass.prototype.clear = function(){
			if(this.defaultValue) {
				this.attributes = this.clone(defaultValue);
			}
			else
				this.attributes = {};
		};

		jsClass.prototype.toJSON = function(){
			return this.attributes;
		};

		jsClass.prototype.has = function(str){
			var attr = this.attributes;
			for(var key in attr){
				if(attr[key] == str)
					return true;
				else
					return false;	
			}
		};
		
		jsClass.prototype.modelChanged = function(){
			//do something
		};

		for(var property in Object){
			if(Object.hasOwnProperty(property))
				jsClass.prototype[property] = Object[property];
		}

		if(!jsClass.prototype.init)
			jsClass.prototype.init = function(){ };

		return jsClass;
	};

/**
	Buzz Collection
	Descriptions : Define a models for that collection and pass a JSON object as an arguments while initilization 
	or by using getter or setter method.
**/
	Buzz.Collection = function(Object){

		var jsClass = function(Collection){
			this.Collection = [];
			if(Collection && Collection.length > 0) {
				this.SetModel(Collection)
			}
			this.init.apply(this, arguments);
		};
		jsClass.prototype.Models = null;
		jsClass.prototype.SetModel = function(ary){
			var self = this;
			if(ary) {
				for(var i=0; i<ary.length; i++ ) {
					var model = new self.Models();
					model.set(ary[i]);
					this.Push(model, this);
				}
			}
		};

		jsClass.prototype.Push = function(model){
			this.Collection.push(model);
		};

		jsClass.prototype.Splice = function(id) {
			var index;
			if(this.Collection)
			{
				for(var i=0; i< this.Collection.length;i++ ){
					if(this.Collection[i]._id == id)
						index =  i;
				}
				this.Collection.splice(index, 1);
			}
		};

		jsClass.prototype.GetModel = function(id){
			if(this.Collection) {
				for(var i=0; i< coll.length;i++ ){
					if(coll[i]._id == id)
						return coll[i];
				}	
			}
		};

		jsClass.prototype.Count = function(){
			return this.Collection.length;
		};
		
		for(var property in Object){
			if(Object.hasOwnProperty(property))
			 	jsClass.prototype[property] = Object[property];	
		}

		if(!jsClass.prototype.init)
			jsClass.prototype.init = function(){ };

		return jsClass;
	};

	Buzz.View = function(Object) {
		var jsClass = function(){
			this.init.apply(this, arguments);
			this.BindEvents.call(this,null);
		};
		
		//private method
		var GetElementsBySel = function(searchEl, type, eleCollection, parentEl){
			var childNodes = parentEl.children;
			var childNode, children;

			for(var i=0;i<childNodes.length;i++) {
				childNode = parentEl.children[i];
				children = childNode.children;
				if(children && children.length > 0) {
					
					GetElementsBySel(searchEl, type, eleCollection, childNode)
					if(type.toUpperCase() == 'ID' && eleCollection.length > 0)
						return;
				}
				
				var conditions = ((type.toUpperCase() == 'ID' && childNode.id == searchEl) ||
					(type.toUpperCase() == 'CLASS' && childNode.className == searchEl) ||
					(type.toUpperCase() == 'INPUT' && childNode.tagName.toUpperCase() == "INPUT") ||
					(type.toUpperCase() == 'BUTTON' && childNode.tagName.toUpperCase() == "BUTTON") ||
					(type.toUpperCase() == 'TEXTAREA' && childNode.tagName.toUpperCase() == "TEXTAREA") ||
					(type.toUpperCase() == 'CHECKBOX' && childNode.tagName.toUpperCase() == "CHECKBOX") ||
					(type.toUpperCase() == 'RADIO' && childNode.tagName.toUpperCase() == "RADIO"));

				if(eleCollection && conditions) 
					eleCollection.push(childNode);
			}
		}

		jsClass.prototype.GetChildElements = function(searchEl, type, selector){
			if(!selector || !this.Element)
				return;
			var eleCollection = [];
			GetElementsBySel(searchEl, type, eleCollection, (selector || this.Element));
			return eleCollection;
		};

		jsClass.prototype.BindEvents = function(parentEl, evntsAry){
			function AttachEventToElement(eventName, el, method, context, selector) {
				var childEle = [];
				if(el.indexOf("#") > -1)
					childEle = context.GetChildElements(el.replace('#', ''), "ID", selector);
				else if(el.indexOf(".") > -1)
					childEle = context.GetChildElements(el.replace('.', ''), "CLASS", selector);

				for(var count=0;count<childEle.length;count++) {
					if(document.addEventListener)
						childEle[count].addEventListener(eventName, context[method], false);
					else
						childEle[count].attachEvent('on'+eventName, context[method]);
				}
			}

			var evts = evntsAry || this.events;
			var selector = parentEl || this.Element;
			var self = this;
			if(evts) {
				for(var e=0; e<evts.length;e++) {
					var eventName = evts[e].eventName;
					var methodName = evts[e].methodName;
					var el = evts[e].element;
					var eventNameColl = [], elColl = [];
					eventNameColl = eventName.split(" ");
					elColl = el.split(" ");
					
					for(var evt=0;evt<eventNameColl.length;evt++) {
						for(var el=0;el<elColl.length;el++) {
							AttachEventToElement(
								eventNameColl[evt], elColl[el], methodName, this, selector
								);
						}
					}
					
				}
			}
		};

		jsClass.prototype.handleEvent = function(e){
			e.preventDefault();
			var evts = this.events;
			var self = this;
			if(evts) {
				for(var i=0; i<evts.length; i++){
					var methodName = evts[i].methodName;
					var eventName = evts[i].eventName;
					var ele = evts[i].element;
					var cond = eventName == e.type.toString() && 
						((e.target.id != "" && ele.indexOf(e.target.id) != -1) || 
						(e.target.className != "" && ele.indexOf(e.target.className) != -1) || 
						(e.target.type != "" && ele.indexOf(e.target.type.toUpperCase()) != -1 ) );
					
					if(cond) self[methodName]();
				}
			}
		};

		jsClass.prototype.TriggerEvents = function(e){
			
			function AttachEvent(e){
				e.preventDefault();
				if (window.CustomEvent) {

					var myEvent = new CustomEvent(
						eventName, 
						{
							detail : {
								time : new Date()
							},
							bubbles: false,
							cancelable : true
						}
					);
				}
				e.currentTarget.dispatchEvent(myEvent);
			}

			var e = eventObj.element;
			var eventName = eventObj.eventName;

			if(document.addEventListener){
				e.addEventListener(eventName, AttachEvent, false);
			}
			else{
				e.attachEvent('on'+eventName, AttachEvent);
			}

		};

		jsClass.prototype.Validate = function(template){
			var ErrorMsg = {};
			var SuccessMsg = {};
			var passStatus = true;
			var inputs = [];
			try
			{
				if(template.find)
					inputs = template.find('input');
				else
					inputs = this.GetChildElements('input', 'INPUT');

				var RE = /^-{0,1}\d*\.{0,1}\d+$/;
				var isNumeric;
				if(inputs && inputs.length == 0) throw "No inputs in the form";
				for (var i=0; i<inputs.length; i++) {
					isNumeric = ($(inputs[i]).attr('data-numeric') == "true" && RE.test(inputs[i].value));
					var id = $(inputs[i]).attr('id');
					switch(inputs[i].type.toUpperCase())
					{
						case 'TEXT':
						case 'TEL':
						case 'HIDDEN':
						case 'PASSWORD':
						case 'EMAIL':
						case 'DATE':
							if(inputs[i].value == "" ){
								passStatus = false;
								ErrorMsg[id]= "Feild cannot be empty";
							}
							else if($(inputs[i]).attr('data-numeric') && !isNumeric) {
								passStatus = false;
								ErrorMsg[id] = "Feild should be Numeric";
							}
						break;
						case 'CHECKBOX':

						break;
						case 'RADIO':

						break;
						case 'FILE':

						break;
					}
					//Should handle for check and radio as well
				};

			} 
			catch(e){
				passStatus = false;
				ErrorMsg["error"] = e.message;
			} 
			return {
				"passStatus" : passStatus,
				"Success" : { "Message" : 'The validation in succesfully done'},
				"Error" : { "Message" : ErrorMsg }
			}
		};

		/**  Attach an user defined property to jsClass **/
		for(var prop in Object){
			
			if(prop == "Element"){
				var el;
				el = jsClass.prototype.Element = (function() {
					return document.createElement(Object[prop]);
				}());
				//Observe a change in element
				window.Object.observe(el, jsClass.prototype.BindEvents);
			}
			else if(Object.hasOwnProperty(prop))
			{ jsClass.prototype[prop] = Object[prop]; }
		}
		if(!jsClass.prototype.init)
			jsClass.prototype.init = function(){ };

		return jsClass;
	};
	

	Buzz.Model.Inherit = Inherit;
	Buzz.Collection.Inherit = Inherit;
	Buzz.View.Inherit = Inherit;
	
	window.Buzz = Buzz;

}(window));
