(function($){

    $.accordion = function(selector, settings){

		// settings
    	var config = {
    		'parent'			:undefined,
    		'vertical_width'	:'100%',
    		'vertical_height'	:800,
    		
    		'horizontal_width'	:'740',
    		'horizontal_height'	:'140',
    		
    		'width'				:'800',
    		'height'			:'800',
    		'mode'				:'vertical',
    		
    		'speed'				:0,
    		
    		'onchange'			:undefined
    			
        };
        
        if ( settings ){$.extend(config, settings);}

        var accordion={
        	config	   : config,	
        	initialize : function(selector){
        		this.accordion  = $(selector);
        		this.items      = $(".item",this.accordion);
        		this.title		= $(".title",this.accordion);
        		this.content	= $(".content",this.accordion);
        		this.director   = $("DIV.director",this.content);
        		this.list		= $(".list",this.accordion);
        		this.icon		= $(".icon",this.accordion);
        		this.lastContent= this.content.last();
        		
        		
        		
        		this.forMinimize = $('<div style="display:none;width:100%;height:100%;background-color:#20222c;" />');
        		this.lastContent.append(this.forMinimize);
        		
        		this.itemCount 	= this.items.size();
        			
        		_this.items.each(function(i){
        			var target = $(this);
        			target.attr("data-li_index",1);
        			target.attr("data-li_count",$("UL LI",target).size());
        		});
        		
        		this.accordionMarginLeft= 0;
        		this.accordionMarginTop= 0;
        		
        		
        		this.directorWidth  	= 0;
            	this.directorHeight 	= 0;
        		
        		this.accordionWidth		= undefined;
        		this.accordionHeight	= undefined;
        		
        		this.itemWidth			= undefined;
        		this.itemHeight			= undefined;
        		
        		this.titleWidth 		= undefined;
        		this.titleHeight 		= undefined;
        		
        		this.contentWidth 		= undefined;
        		this.contentHeight 		= undefined;
        		
        		this.listWidth 			= undefined;
        		this.listHeight			= undefined;
        		
        		this.opened				= _this.items.eq(0).attr("data-index","0").addClass("open");
        		this.minimizeOpened		= undefined;
        		
        		this.progressing 		= false;
        		this.directorProcessing = false;
        		
        		this.initLayout();
        		
        		_this.content.each(function(i){
        			if(i!=0){
        				$(this).hide();
        			}
        		});
        		
        		this.beforeMode 		= config.mode;
        		
        		this.accordion.delegate("div.director","click",function(event){
        			
        			if(_this.directorProcessing){ return ;}
        			_this.directorProcessing = true;
        			
        			var director = $(this);
        			var item = director.closest("DIV.item");
        			var firstShowingLiIndex = Number(item.attr("data-li_index"));
        			var liCount = Number(item.attr("data-li_count"));
        			
        			
        			var targetUL = $("UL",item);
        			var li = $("li:eq(0)",targetUL);
        			var direction = undefined;
        			
        			if(director.hasClass("prev")){
        				if(firstShowingLiIndex == 1){
        					_this.directorProcessing = false;
							return;
						}else{
							item.attr("data-li_index",firstShowingLiIndex-1);
						}
        				
        				if(config.mode=="vertical"){
    						direction = "down";
    						targetUL.animate({left:0,top: "+="+(li.outerHeight(true))+"px", leaveTransforms:true },config.speed, function() {
    							_this.directorProcessing = false;
    						});
    					}else{
    						direction = "right";
    						targetUL.animate({left: "+="+(li.outerWidth(true))+"px",top:0, leaveTransforms:true },config.speed, function() {
    							_this.directorProcessing = false;
    						});
    					}
        				
        			}else if( director.hasClass("next")){
        				if(firstShowingLiIndex == liCount){
        					_this.directorProcessing = false;
							return;
						}else{
							item.attr("data-li_index",firstShowingLiIndex+1);
						}
        				
        				if(config.mode=="vertical"){
        					direction = "up";
    						targetUL.animate({left:0,top: "-="+(li.outerHeight(true))+"px", leaveTransforms:true },config.speed, function() {
    							_this.directorProcessing = false;
    						});
    					}else{
    						direction = "left";
    						targetUL.animate({left: "-="+(li.outerWidth(true))+"px",top:0, leaveTransforms:true },config.speed, function() {
    							_this.directorProcessing = false;
    						});
    					}
        				
        				
        			}
        		});
        		
        		this.accordion.delegate("div.icon","click",function(event,data){
        			_this.minimizeOpened = $(this);
        			_this.progressing = false;
        			$("#personalResize").trigger("click");
        		});
        		
        		this.accordion.delegate("div.title","click",function(event,data){
        			var item = $(this.parentNode); 
        			if(!item.hasClass("open") && !_this.progressing){
        				_this.progressing = true;
        				var moveTarget = undefined;
        				var direction  = undefined;
        				if(item.prevAll(".open").size()>0){
        					if(config.mode=="vertical"){
        						direction = "up";
        					}else{
        						direction = "left";
        					}
        					
        					moveTarget = item.prevUntil(".open").andSelf();
        				}else{
        					if(config.mode=="vertical"){
        						direction = "down";
        					}else{
        						direction = "right";
        					}
        					
        					moveTarget = item.nextUntil(".open ~ DIV");
        				}
        				
        				_this.opened.removeClass("open");
        				if(data!="minimize"){
        					item.addClass("open");
        				}
        				
        				var dataIndex   = parseInt(item.attr("data-index"));
        				var titleWidth  = _this.titleWidth;
        				var titleHeight = _this.titleHeight;
        				var contentHeight = _this.contentHeight;
        				var contentWidth = _this.contentWidth;
        				
        				var moveWrapper = $('<div class="moveWrapper" style="width:100%;height:100%;position:absolute;top:0;left:0;" />');
        				moveTarget.wrapAll(moveWrapper);
						moveWrapper = $(".moveWrapper",_this.accordion);
						
						$(".content",item).show();
						
						if(moveTarget.size()==0){
							_this.progressing = false;
						}
						
        				switch(direction){
        					case "left":
        						moveWrapper.animate({left: "-"+(contentWidth)+"px",top:0, leaveTransforms:true },config.speed, function() {
        							var prevTop = _this.opened.css("left");
            						prevTop = parseInt(prevTop)+_this.itemWidth;
        							
            						$(".content",_this.opened).hide();
        							_this.opened = item;
        							
        							moveTarget.unwrap();
        							moveTarget.each(function(i){
        								$(this).attr("style","left: "+(prevTop+(_this.itemWidth*(i)))+"px");
        							});
        							
        							_this.progressing = false;
        						});
        						
        						break;
        					case "right":
        						moveWrapper.animate({left: contentWidth+"px",top:0, leaveTransforms:true },config.speed, function() {
        							var nextTop = item.prev().css("left");
            						nextTop = nextTop === undefined ? "-"+ _this.itemWidth+"px":nextTop;
            						nextTop = parseInt(nextTop)+_this.itemWidth+contentWidth;
        							
            						$(".content",_this.opened).hide();
            						_this.opened = item;
            						
        							moveTarget.unwrap();
        							moveTarget.each(function(i){
        								$(this).attr("style","left: "+(nextTop+((i+1)*_this.itemWidth))+"px");
        							});
        							
        							_this.progressing = false;
        						});
        						
        						break;
        					case "up":
        						
        						moveWrapper.animate({left:0,top: "-"+(contentHeight)+"px", leaveTransforms:true },config.speed, function() {
        							var prevTop = _this.opened.css("top");
            						prevTop = parseInt(prevTop)+titleHeight;
        							
            						$(".content",_this.opened).hide();
        							_this.opened = item;
        							
        							moveTarget.unwrap();
        							moveTarget.each(function(i){
        								$(this).attr("style","top: "+(prevTop+(titleHeight*(i)))+"px");
        							});
        							
        							_this.progressing = false;
        						});
        						break;
        					case "down":
        						
        						moveWrapper.animate({left:0,top: contentHeight+"px", leaveTransforms:true },config.speed, function() {
        							var nextTop = item.prev().css("top");
            						nextTop = nextTop === undefined ? "-"+ titleHeight+"px":nextTop;
            						nextTop = parseInt(nextTop)+titleHeight+contentHeight;
        							
            						$(".content",_this.opened).hide();
            						_this.opened = item;
            						
        							moveTarget.unwrap();
        							moveTarget.each(function(i){
        								$(this).attr("style","top: "+(nextTop+((i+1)*_this.titleHeight))+"px");
        							});
        							
        							_this.progressing = false;
        						});
        						break;
        					default:
        						break;
        				}
        			}
        		});
        		return this;
        	},
        	
        	reset : function(){
        		$("UL",_this.accordion).each(function(){
    				var ul = $(this);
    				ul.attr("style","");
    				var item = ul.closest("DIV.item").attr("data-li_index",1);
    			});
        	},
        	
        	setListType : function(type){
        		if(type=="box"){
        			_this.accordion.addClass("box");	
        		}else if(type=="list"){
        			_this.accordion.removeClass("box");
        		}
        		
        		_this.reset();
        	},
        	
        	initLayout : function(customSetting){
        		if ( customSetting ){$.extend(config, customSetting);}
        		
        		_this.changeLayout(config.mode);
        		
        		//모드가 변경되었다면 초기화 작업을 수행
        		if(this.beforeMode != config.mode){
        			this.beforeMode = config.mode;
        			
        			if(config.onchange){
        				config.onchange();
        			}
        			
        			if(this.director.css("display")!="none"){
            			this.directorWidth  	= this.director.outerWidth(true);
                		this.directorHeight 	= this.director.outerHeight(true);
            		}
            		
            		try{
            			this.accordionMarginLeft = parseInt($("DIV.accordionArea").css("margin-left"));
            		}catch(e){
            			this.accordionMarginLeft = 0;
            		}
            		try{
            			this.accordionMarginTop = parseInt($("DIV.accordionArea").css("padding-top"));
            		}catch(e){
            			this.accordionMarginTop = 0;
            		}
        			_this.reset();
        			
        			if(config.mode == "vertical"){
        				var targetUL = $("UL",this.list); 
    					targetUL.width((this.title.width()));
        			}else{
        				this.list.each(function(){
        					var targetUL = $("UL",$(this)); 
        					var li = $("li",targetUL);
        					targetUL.width((li.eq(0).outerWidth(true)*li.size()));
            			});
        			}
        		}
        		
        		var openIndex = this.opened.attr("data-index");
        		
        		if( config.mode == "vertical" ){
        			var title = _this.title.eq(0);
            		_this.titleWidth  = title.outerWidth(true);
            		_this.titleHeight = title.outerHeight(true);
        			
        			_this.accordionWidth	= config.width- _this.accordionMarginLeft;
            		_this.accordionHeight	= config.height - _this.accordionMarginTop;
        			
            		_this.contentWidth		= _this.accordionWidth;
            		_this.contentHeight		= _this.accordionHeight - ( _this.titleHeight * _this.itemCount );
            		
            		_this.accordion.css({width:_this.accordionWidth, height:_this.accordionHeight});
            		_this.content.css({width:_this.contentWidth, height:_this.contentHeight});
            		_this.list.css({width:_this.contentWidth, height:_this.contentHeight-(_this.directorHeight*2)});
            		
            		_this.items.each(function(i){
            			var contentHeight = 0;
            			if(i > openIndex){
            				contentHeight = openIndex == i ? 0 : _this.contentHeight;
            			}
        				
        				$(this).attr("data-index",i).css({"top":((_this.titleHeight*i)+contentHeight)+"px",left:0});
            		});
            		
        		}else if( config.mode == "horizontal" ){
        			var item = _this.items.eq(0);
            		_this.itemWidth  = item.outerWidth(true);
            		_this.itemHeight = item.outerHeight(true);
        			

            		var fixWidth = 0;
            		
            		config.parent.prevAll().each(function(){
            			fixWidth += $(this).outerWidth(true);
            		});
            		if($.browser.msie && $.browser.version=="7.0"){
            			fixWidth = 0;
            		}
            		
            		
        			_this.accordionWidth	= config.width-fixWidth;
            		_this.accordionHeight	= config.height;
        			
        			_this.contentWidth		= _this.accordionWidth - ( _this.itemWidth * _this.itemCount );
            		_this.contentHeight		= _this.accordionHeight;
            		
            		_this.accordion.css({width:_this.accordionWidth,height:_this.accordionHeight});
            		_this.content.css({width:_this.contentWidth,height:_this.contentHeight});
            		_this.list.css({width:_this.contentWidth - (_this.directorWidth*2),height:_this.contentHeight});
            		
            		_this.items.each(function(i){
        				var contentWidth = 0;
        				if(i > openIndex){
        					contentWidth = openIndex == i ? 0 : _this.contentWidth;
            			}
        				
        				$(this).attr("data-index",i).css({top:0,"left":(((_this.itemWidth)*i)+contentWidth)+"px"});
            		});
        		}
        	},
        	
        	changeLayout : function(mode){
        		if( mode == "narrow" ){
        			_this.accordion.removeClass("verticalAccordion").addClass("horizontalAccordion");
        			config.mode = "horizontal";
    			}else{
    				_this.accordion.removeClass("horizontalAccordion").addClass("verticalAccordion");
    				config.mode = "vertical";
    			}
        	},
        	
        	minimize : function(){
        		_this.minimizeOpened = $("DIV.item.open",_this.accordion);
        		_this.accordion.addClass("minimize");
        		_this.forMinimize.show();
        		var lastItem = _this.items.last();
        		$(".title",lastItem).trigger("click","minimize");
        		return lastItem;
        	},
        	
        	maximize : function(){
        		_this.accordion.removeClass("minimize");
        		_this.forMinimize.hide();
        		var firstItem = _this.items.first();
        		$(".title",_this.minimizeOpened).trigger("click","maximize");
        		return firstItem;
        	}
        
        };
        
        var _this = accordion;
        
        var accordionObject = _this.initialize(selector); 
        
        $("#"+_this.id).data("accordion",accordionObject);
        return accordionObject;
    };
    
    function log (obj,tag){
    	if(true){
    		if(!tag) {
    			tag = "";
    		}
    		
    		var consoleLog = document.getElementById("consoleLog");
    		if(consoleLog == null){
    			
    			if (typeof document.compatMode!='undefined'&&document.compatMode!='BackCompat') { 
    				cot_t1_DOCtp="_top:expression(document.documentElement.scrollTop+document.documentElement.clientHeight-this.clientHeight);_left:expression(document.documentElement.scrollLeft + document.documentElement.clientWidth - offsetWidth);}"; 
    			} 
    			else { 
    				cot_t1_DOCtp="_top:expression(document.body.scrollTop+document.body.clientHeight-this.clientHeight);_left:expression(document.body.scrollLeft + document.body.clientWidth - offsetWidth);}"; 
    			} 
    				  
    			var cot_tl_bodyCSS='* html {background:url(blank.gif) fixed;background-repeat: repeat;background-position: right bottom;}'; 
    			var cot_tl_fixedCSS='#consoleLog{'; 
    			cot_tl_fixedCSS+='right:0px;width:100%;bottom:0px;z-index:10000;position:fixed;_position:absolute;background-color: white;'; 
    			cot_tl_fixedCSS+=cot_t1_DOCtp ; 
    			  
    			var styleTag = document.createElement("STYLE");
    			styleTag.setAttribute("type","text/css");
    			if(styleTag.styleSheet){ //IE
    				styleTag.styleSheet.cssText=cot_tl_fixedCSS;
    			}else{//OTHER
    				try{
    					styleTag.innerHTML=cot_tl_fixedCSS;
    				}catch(e){//Safari
    					styleTag.innerText=cot_tl_fixedCSS;
    				}
    			}
    			document.getElementsByTagName("HEAD")[0].appendChild(styleTag);
    			
    			var console = "<div id='consoleLog'>" +
    					"<div id='consoleControlArea' > " +
    					"	<div style='float:left'> " +
    					"		Filter By Tag : <input type='text' id='consoleControlFilter' />" +
    					"	</div>" +
    					"	<div style='float:right'> " +
    					"		<input type='button' value='clear' onclick='document.getElementById(\"consoleLogArea\").innerHTML=\"\"' />" +
    					"   	<input type='button' value='show' onclick='document.getElementById(\"consoleLogArea\").style.display=\"block\"'  />" +
    					"   	<input type='button' value='hide' onclick='document.getElementById(\"consoleLogArea\").style.display=\"none\"'  />" +
    					"	</div>" +
    					"	<div style='clear:both'></div>" +
    					"</div>" +
    					"<div id='consoleLogArea' style='height:92px;overflow:auto;'></div>" +
    					"</div>";
    			$('body').append(console);
    		}
    		
    		var filterLog = true;
    		var consoleControlFilterVal = document.getElementById("consoleControlFilter").value;
    		if(consoleControlFilterVal != "" && consoleControlFilterVal != tag){
    			filterLog = false;
    		}
    		
    		if(filterLog){
    			var time = new Date().toLocaleTimeString();
    			if(typeof obj === 'object'){
    				for(var i in obj){
    					if(typeof obj[i] ==='object'){
    						for(var j in obj[i]){
    							$("#consoleLogArea").append(time +"<font color='red'>["+tag+"]</font> "+ i + "."  + j + " = " + obj[i][j]+"<br />");
    						}
    					}else{
    						$("#consoleLogArea").append(time+" <font color='red'>["+tag+"]</font> "+ i + " = " + obj[i]+"<br />");
    					}
    				}
    			}else{
    				$("#consoleLogArea").append(time+" <font color='red'>["+tag+"]</font> " + obj+"<br />");
    			}
    			var scrollTop = $("#consoleLogArea").scrollTop(); 
    			$("#consoleLogArea").scrollTop(scrollTop+1000);
    		}
    	}
    }
    
})(jQuery);