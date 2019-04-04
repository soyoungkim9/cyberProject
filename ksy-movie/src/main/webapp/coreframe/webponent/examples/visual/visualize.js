(function($) { 
	$.visualize = function(selector, settings){
		var elem = $(selector);
		
		var config = $.extend({
			type: 'bar', 			//also available: area, pie, line
			width: elem.width(), 	//height of canvas - defaults to table height
			height: elem.height(), 	//height of canvas - defaults to table height
			parseDirection: 'x' 	//which direction to parse the table data
		},settings);
	    
	    var object = getModule(elem.get(0),config);
	    object.init();
	    
	    $(selector).data("object",object);
	    return object;
	};

	$.fn.visualize = function(options){
		return $(this).each(function(k){
			//configuration
			var config = $.extend({
				type: 'bar', 				//also available: area, pie, line
				width: $(this).width(), 	//height of canvas - defaults to table height
				height: $(this).height(), 	//height of canvas - defaults to table height
				parseDirection: 'x' 		//which direction to parse the table data
			},options);
			
			var module = getModule(this,config);
			
			module.init();
			return module;
		});
	};
	
	function getModule(elem,config){
		var type = config.type;
		var module = undefined;
		switch(type){
			case "grid":
				module  = klass(Visual,Grid);
				break;
			case "line":
				module  = klass(Visual,Line);
				break;
			case "pie":
				module  = klass(Visual,Pie);
				break;	
			default :
				module  = undefined;
				break;
		}
		
		return new module(elem,config);
	}
	
	//http://blog.jidolstar.com/795
	var klass = (function () {
		//즉시실행함수를 사용해 임시(프록시) 생성자 F를 클로저 안에 저장해 한 번만 만들도록.  
		var F = function () {};

		return function (Parent, newObject) {
			var Child, i;

			//1. 새로운 생성자
			Child = function() {
				if (Child.uber && Child.uber.hasOwnProperty('__construct')) {
					//console.log('Child.uber.__construct 적용');
					Child.uber.__construct.apply(this, arguments);
				}
		
				if(Child.prototype.hasOwnProperty('__construct')) {
					//console.log('Child.prototype.__construct 적용');
					Child.prototype.__construct.apply(this, arguments);
				}
			};

			//2. 상속
			Parent = Parent || Object;
			F.prototype = Parent.prototype;
			Child.prototype = new F();
			Child.uber = Parent.prototype;
			Child.prototype.constructor = Child;

			//3. 구현 메서드를 추가한다.
			var props = newObject.prototype;
			for (i in props) {
				if (props.hasOwnProperty(i)) {
					Child.prototype[i] = props[i];
				}
			}
			
			//'클래스'를 반환한다.
			return Child;
		};
	}());
	
})(jQuery);