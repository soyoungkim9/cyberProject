function Exam(){ }

Exam.prototype = {
	//생성자 함수
	__construct : function(elem,options){
		
	},	

	//초기화 함수
	init : function(){
		this.$this.bind("mouseover",function(){
			console.log($(this).attr("id"));
		});
	},
	
	//ajax호출 성공시
	_onSuccess : function(data,textStatus,jqXHR){
		
	}
};

