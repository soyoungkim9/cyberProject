function Visual(){ }

Visual.prototype = {
	__construct : function(elem,options){
		//각 module에서 공통으로 사용할것들만 정의
		this.elem  = elem;
		this._this = elem;
		this.$this = $(elem);
		this.config = options;
		this.$ = $;
	},
	
	_ajax : function(param){
		var ajaxOptions = new Object();
		
		if (param){$.extend(ajaxOptions, param);}
		
		//사용자가 지정한 callback함수를 저장한다. 내부 callback 함수를 수행후 사용자의 callback 함수를 호출 
		ajaxOptions['success']   = param.success;
		ajaxOptions['error']     = param.error;
		ajaxOptions['complete']  = param.complete;
		
		
		var _this = this;
		//callback 함수를 내부 callback 함수로 변경
		//param['success']   = _this._onSuccess;
		param['success']   = function(data,textStatus,jqXHR){  _this.__onSuccess (data,textStatus,jqXHR,ajaxOptions);  };
		param['error']     = function(jqXHR,textStatus,errorThrown){  _this.__onError   (jqXHR,textStatus,errorThrown,ajaxOptions);  };
		param['complete']  = function(jqXHR,textStatus){  _this.__onComplete(jqXHR,textStatus,ajaxOptions);  };
		
		$.ajax(param);
	},
	
	__onSuccess : function(data,textStatus,jqXHR,ajaxOptions){
		
		//공통 작업이 있다면 추가
		this._onSuccess(data,textStatus,jqXHR);//상속받은 클래스의 onSuccess
		
		if(ajaxOptions!==undefined && ajaxOptions['success']){
			ajaxOptions['success'](data,textStatus,jqXHR);
		}
	},
	
	__onError : function(jqXHR,textStatus,errorThrown,ajaxOptions){
		
		//공통 작업이 있다면 추가
		if(ajaxOptions!==undefined && ajaxOptions['error']){
			ajaxOptions['error'](jqXHR,textStatus,errorThrown);
		}
	},
	
	__onComplete : function(jqXHR,textStatus,ajaxOptions){
		
		//공통 작업이 있다면 추가
		if(ajaxOptions!==undefined && ajaxOptions['complete']){
			ajaxOptions['complete'](jqXHR,textStatus);
		}
	},
	
	replaceHTML: function(el,html){/*faster than default innerHTML when browser is not ie*/
		var oldEl = typeof el === "string" ? document.getElementById(el) : el;
		/*@cc_on // Pure innerHTML is slightly faster in IE
			el.innerHTML = html;
			return oldEl;
		@*/
		var newEl = oldEl.cloneNode(false);
		newEl.innerHTML = html;
		oldEl.parentNode.replaceChild(newEl, oldEl);
		/* Since we just removed the old element from the DOM, return a reference
		to the new element, which can be used to restore variable references. */
		return newEl;
	}
};