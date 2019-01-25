function Line(elem,option){
	
	this.type = "line";
}


Line.prototype = {
	__construct : function(elem,options){
		this.config = $.extend({
			'width'				:'100%',
	        'height'			:200
		},options);
		
		console.log("line init");
	},	
		
	init : function(){
		this.$this.bind("mouseover",function(){
			console.log($(this).attr("id"));
		});
	},

	_onSuccess : function(data,textStatus,jqXHR){
		
	}
};