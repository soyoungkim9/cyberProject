//var GRID_HOME = "/coreframe/webponent/examples/html-grid-jquery";
var GRID_HOME = "..";
var DEBUG_LOG = false;

document.write('<link rel="stylesheet" type="text/css" href="'+GRID_HOME+'/dataGrid.css"/>');

(function($){

    $.dataGrid = function(selector, settings){

		// settings
    	var config = {
            'width'				:'100%',
            'height'			:200,
            'gridInfo'		 	:false,
            'displayHeader'	 	:true,
            'columnResizable'	:true,
            'multiSelectable'	:true,
            'onclick'        	:undefined,
            
            'hiddenColumn'		:undefined,
            'fixColumn'			:undefined,
            'sortColumn'		:undefined,
            'editColumn'		:undefined,
            'paging'  			:{rows:undefined,type:'1',query:false,page:1},
            'server'         	:undefined,  //{bld:'samples/database/listCities',view:'/common/component/grid/example/server_data.jsp',sort:"airport"}
            'calendar'			:{type:'normalT',delim:'-'},
            'tree'				:undefined,
            
            'selectClassName'	:'selectedTR',
            'gridTextAlign'		:'left',
            'gridPath'			:GRID_HOME
        };
        
        if ( settings ){$.extend(config, settings);}

        var grid={
        	selector:selector,
        	initialize : function(selector){
     		    this.totalCount = 0;              	//그리드 총 로우 개수
     		    this.gridCurrentPage = 1;         	//페이징 모드 사용시 그리드가 표현하고 있는 페이지 번호
        		this.isColumnResizing = false;    	//컬럼의 리사이징이 발생하고 있는지 체크 ( 이 값으로 리사이징 이벤트시 정렬이벤트가 발생되는것을 막는다. )
        		this.isRelativeWidth = false;     	//table의 width 값이 %로 설정되어있는지 px로 설정되어 있는지 체크
        		this.withControlKey = false;      	//table의 row를 선택시 control 키를 누른상태로 선택중인지 체크 ( for multiSelectable ) 
     		    this.withShiftKey = false;        	//table의 row를 선택시 shift   키를 누른상태로 선택중인지 체크 ( for multiSelectable )
     		    this.selectedRows = new Array();  	//선택된  row를 가지고있는 배열   
     		    this.lastSelectedTRIndex = null;  	//마지막으로 선택된 row의 인덱스 값을 저장하고 있는 변수
     		    this.colPadding = null;           	//table td padding
     		    this.lastAjaxForm = null;         	//마지막으로 Ajax처리가 된 폼의 정보 (updateBody 또는 sendServer시 사용한 정보
     		    
     		    this.rowArray = {};               	//연관배열로 사용되며 인덱스는 0부터 시작 rows가 설정되었다면 rows만큼이 하나의 인덱스를 사용 rows가 없다면 전체가 index 0에 설정
     		    this.currentRowArrayIndex = 0;
     		    this.selectedRowArray = {};			//선택된  row를 가지고있는 Object 키는 tr의 data-uuid에 저장된 값으로 uuid에 의해 생성된값..   
     		    this.editedRowArray   = {};			//추가editedRowArray["append"], 수정editedRowArray["update"], 삭제editedRowArray["remove"] 된 rowArray를 담고있는 배열
     		    this.editedRowArray["append"]= [];
     		    this.editedRowArray["update"]= [];
     		  	this.editedRowArray["remove"]= [];
     		  	
     		  	this.cellFixMode = false;         	//셀고정 모드인지 아닌지 설정  ( col tag의 class 속성에 fixable 있는경우 true로 변경됨 )
        		this.tableContainerFixWidth = 0;
     		  	
     		  	this.treeInitialized = false;
        		
     		    
        		//ScrollBar Width 구하기...
    		    var $c = $("<div style='position:absolute; top:-10000px; left:-10000px; width:100px; height:100px; overflow:scroll;'></div>").appendTo("body");
    		    this.scrollBarWidth = $c.width() - $c[0].clientWidth;
    		    this.scrollBarHeight = $c.height() - $c[0].clientHeight;
    		    $c.remove();
    		    
            	this._initLayout();
            	this.resizing();
            	
				/*
            	var historyCallBack = function(hash){
            		if(hash) {
            			log("log : " + hash);
	        		} else {
	        			log("no : " + hash);
	        		}
            	};
            	
				// Initialize history plugin.
        		// The callback is called at once by present location.hash. 
        		//$.history.init(historyCallBack);
				*/
        		return this;
            },
            
            _initLayout : function(){
            	this.tbl = $(this.selector);
            	this.id  = this.tbl.attr("id");
            	this.tbl.css("table-layout","fixed").css("empty-cell","show");
            	this.tbl.attr("width",this.tbl.width());
            	this.tbl.get(0).cellPadding = "0";
        		this.tbl.get(0).cellSpacing = "0";
        		this.trReference = $("tbody tr",this.tbl).clone();
        		//$("tbody",this.tbl).empty();
        		
        		
        		$("thead th",this.tbl).each(function(){
        			var a = '<a class="thWrapper" style="position:relative;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display: block;">'+$(this).html()+'</a>';
        			$(this).html(a);
        		});
        		
        		var configWidth  = config.width;
        		var configHeight = parseInt(config.height);
        		
        		var gridInfoArea = "";
        		if(config.gridInfo){
        			gridInfoArea  = '<div class="gridInfoBar">';
        			gridInfoArea += '	<div class="gridPageInfo" style="text-align:right;">';
        			gridInfoArea += '		총 <span id="gridInfo_'+this.id+'_count" >0</span>건 <span id="gridInfo_'+this.id+'_page" style="margin-left:10px;"></span>';
        			gridInfoArea += '	</div>';// end of <div class="gridPageInfo">
        			gridInfoArea += '	<div style="clear:both;"></div>';
        			gridInfoArea += '</div>';//end of <div class="gridInfoBar">
        			
        			gridInfoArea = $(gridInfoArea);
        			
        			//gridInfoBar 높이를 전체 높이에서 빼줌. 20사이즈는 gridInfoBar class 에 정의되있음.
        			configHeight = parseInt(configHeight)-20;
        		}
        		
            	var theadTable = this.tbl.clone();
            	theadTable.attr("id", this.id+"_head");
            	theadTable.css("border-collapse","separate");  //display:none 됐을경우 잔상제거..

            	$("tbody",theadTable).each(function(k){
        			$(this).remove();
        		});
            	
        		var tbodyTable = this.tbl.clone();
        		$("thead",tbodyTable).each(function(k){
        			$(this).remove();
        		});
        		
        		var tableContainerStyle = "overflow-x: hidden;overflow-y: hidden;";
        		if($.browser.msie && $.browser.version=="6.0"){
            		tableContainerStyle += "float:left;";
        		}
        		
        		var tableContainer = $('<div />',{
        			"class":"tableContainer",
        			"style":tableContainerStyle
        		}).css("width", configWidth);

        		var containerDiv = $('<div />',{
        			"id":"containerDiv_"+this.id,
        			"class":"containerDiv"
        		}).css("width", configWidth+4);
        		//fixable 모드일 때 보더가 겹쳐서 전체 컨테이너 사이즈를 늘려줘야 떨어지지 않음.
        		
        		//display:table : IE8에서 display:none 된 칼럼 사이즈가 있을경우 헤더 셀크기가 재조절이 안되는 버그 수정.
        		var tableHeadDiv = $('<div />',{
        			"class":"tableHeadDiv",
        			"style":"overflow-x: hidden;overflow-y: hidden;display:table;"
        		});
        		
        		var tableBodyDiv = $('<div />',{
        			"class":"tableBodyDiv",
        			'style' : 'overflow-x: auto;overflow-y: scroll;width:100%;' //width:100%는 IE6 scroll에서 필요..
        		}).height(configHeight);
        		
        		var loadingDiv =  $('<div />',{
        			"class" : "loadingDiv",
        			"id"    : "loadingDiv_"+this.id,
        			"style" : "width:100%;margin-top:-"+configHeight+"px;display:none;"
	        	}).height(configHeight);
        		
        		var loadingImage = $('<img />',{
        			"src"  :config.gridPath+"/img/ajax-loader.gif",
        			"id"   :this.id+"_loadingImage",
        			"style":"margin-top:"+(configHeight/2 - 20)+"px;"
	        	});
	        	
        		loadingDiv.append('<div class="clear"></div>');
        		loadingDiv.append(loadingImage);
        		tableHeadDiv.append(theadTable);
            	tableBodyDiv.append(tbodyTable);
            	tableContainer.append(tableHeadDiv);
        		tableContainer.append(tableBodyDiv);
        		
        		containerDiv.append(tableContainer);
        		containerDiv.append(gridInfoArea);
        		containerDiv.append(loadingDiv);
        		containerDiv.append('<div class="clear"></div>');
        		
        		loadingImage.css("margin-left",containerDiv.width()/2);
        		
        		//========================================전역변수 설정=========================================

        		this.theadTable = theadTable;
        		this.tbodyTable = tbodyTable;
        		this.tableHeadDiv = tableHeadDiv;
        		this.tableBodyDiv = tableBodyDiv;
        		this.tableContainer = tableContainer;
        		this.loadingDiv = loadingDiv;
        		this.containerDiv = containerDiv;
        		this.thead = $("thead",theadTable);
        		this.tbody = $("tbody",tbodyTable).attr("id","tbody_0");
        		this.theadColGroup = $("colgroup", this.theadTable);
        		if(this.theadColGroup.size()==0){
            		var colsgrp = $('<colgroup>');
            		for(var i = 0,i2 = $("th",this.theadTable), i3 = i2.size(); i < i3; i++ ){
            			var c = i2.eq(i).attr("colspan");
            			if(!c){
            				c = 1;
            			}
            			for(var j =0; j < c; j++){
            				var col = $("<col>");
            				colsgrp.append(col);
            			}
            		}
            		this.theadColGroup = colsgrp;
            	}

        		this.theadCols = $("col", this.theadColGroup);
        		
        		if(config.tree !== undefined){
        			this.treeMode = true;
        		}
        		
        		//히든 컬럼 설정(해당 col의 class에 hidden을 추가 한다.)
        		if(config.hiddenColumn !== undefined){
        			var hiddenColumn = config.hiddenColumn;
        			for( var i = 0, ic = hiddenColumn.length; i < ic ; i++ ){
        				$("col[id=\"col_"+hiddenColumn[i]+"\"]", this.theadColGroup).addClass("hiddenable");
        			}
        		}
        		
        		//소팅 컬럼 설정(해당 col에 data-sortType에 타입 설정 추가)
        		if(config.sortColumn !== undefined){
        			var sortColumn = config.sortColumn;
        			for( var  i in sortColumn ){
        				var targetCol = $("col[id=\"col_"+i+"\"]", this.theadColGroup);
        				targetCol.addClass(sortColumn[i]);
        			}
        		}
        		
        		//에디트 컬럼 설정 ( 
        		if(config.editColumn !== undefined){
        			var editColumn = config.editColumn;
        			for( var i in editColumn){
        				var targetCol = $("col[id=\"col_"+i+"\"]", this.theadColGroup);
        				targetCol.addClass("editable");
        				
        				var editColumnI = editColumn[i]; 
        				for( var j in editColumnI){
        					targetCol.attr("data-"+j,editColumnI[j]);
        				}
        			}
        		}
        		
        		//고정 컬럼 설정(해당 col에 class에 fixable 추가 한다.)
        		if(config.fixColumn !== undefined){
        			var fixColumn = config.fixColumn;
        			for( var i = 0, ic = fixColumn.length; i < ic ; i++ ){
        				$("col[id=\"col_"+fixColumn[i]+"\"]", this.theadColGroup).addClass("fixable");
        			}
        		}
        		
        		//col의 클래스중 fixable이 포함되어 있다면 아래의 코드를 추가
        		if( $("col[class*=\"fixable\"]", this.theadColGroup).size() > 0 ){
	        		var theadTableFix = this.theadTable.clone();
	        		theadTableFix.attr("id", this.id+"_headFix");
	        		
	        		var tbodyTableFix = this.tbodyTable.clone();
	        		$("THEAD",tbodyTableFix).each(function(){
	        			$(this).remove();
	        		});

	        		tbodyTableFix.attr("id", this.id+"Fix");
	        		
	        		var tableContainerFix = $('<div />',{
	        			"class":"tableContainer tableContainerBorderFix",
	        			'style' : 'overflow-x: hidden;overflow-y: hidden;float:left;'
	        		});
	        		
	        		var tableHeadDivFix = $('<div />',{
	        			"class":"tableHeadDiv",
	        			"style":"overflow-x: hidden;overflow-y: hidden;"
	        		});
	        		
	        		var tableBodyDivFix = $('<div />',{
	        			"class" :"tableBodyDiv",
	        			"style" :"overflow-x: hidden;overflow-y: hidden;width:100%;" //width:100%는 IE6 scroll에서 필요..
  	        		}).height(configHeight - this.scrollBarWidth);
	        		
	        		tableHeadDivFix.append(theadTableFix);
        			tableBodyDivFix.append(tbodyTableFix);
        			tableContainerFix.append(tableHeadDivFix);
            		tableContainerFix.append(tableBodyDivFix);
            		tableContainerFix.append($('<div style="background-color:#ededed;height:'+ this.scrollBarWidth +'px;"></div>'));
            		tableContainerFix.insertBefore(tableContainer);
            		
            		this.theadTableFix = theadTableFix;
	        		this.tbodyTableFix = tbodyTableFix;
	        		this.tableHeadDivFix = tableHeadDivFix;
	        		this.tableBodyDivFix = tableBodyDivFix;
	        		this.tableContainerFix = tableContainerFix;
	        		this.theadFix = $("thead",theadTableFix);
	        		this.tbodyFix = $("tbody",tbodyTableFix).attr("id","tbodyFix_0");
	        		this.cellFixMode = true;
	        		
	        		//셀고정 모드라면 하단 스크롤도 항상 나오도록.. 틀 고정 DIV의 하단 회색 영역의 height 설정이 어렵다..
	        		_this.tableBodyDiv.css("overflow-x","scroll");
	        		
	        		
	        		//ori테이블 TR에 하버가 일어날 경우 fix테이블에도 동일하게 발생
	        		_this.tbodyTable.delegate("tbody tr","mouseover mouseout",function(event){
	        			var tr 			= this;
	        			var tbody    	= $(tr.parentNode);
	        			var rowIndex 	= this.sectionRowIndex;	//$("tr",tbody).index(tr);
	        			var tbodyFixId 	= tbody.attr("id").replace("tbody","tbodyFix");
	        			if(event.type=="mouseover"){
	        				$("tbody#"+tbodyFixId+" tr",this.tbodyTableFix).eq(rowIndex).addClass("hover");
	        			}else if(event.type=="mouseout"){
	        				$("tbody#"+tbodyFixId+" tr",this.tbodyTableFix).eq(rowIndex).removeClass("hover");
	        			}
	        		});
	        		
	        		//fix테이블 TR에 하버가 일어날 경우 ori테이블에도 동일하게 발생
	        		_this.tbodyTableFix.delegate("tbody tr","mouseover mouseout",function(event){
	        			var tr 			= this;
	        			var tbody    	= $(tr.parentNode);
	        			var rowIndex 	= this.sectionRowIndex;	//$("tr",tbody).index(tr);
	        			var tbodyFixId 	= tbody.attr("id").replace("tbodyFix","tbody");
	        			if(event.type=="mouseover"){
	        				$("tbody#"+tbodyFixId+" tr",this.tbodyTableFix).eq(rowIndex).addClass("hover");
	        			}else if(event.type=="mouseout"){
	        				$("tbody#"+tbodyFixId+" tr",this.tbodyTableFix).eq(rowIndex).removeClass("hover");
	        			}
	        		});
	        		
	        		
	        		//원래 테이블 영역에서 스크롤 이벤트가 발생한경우 틀고정 테이블영역도 같이 이동시켜준다.
	        		tableBodyDiv.scroll(function(e) {
	        			_this.tableBodyDivFix.scrollTop(_this.tableBodyDiv.scrollTop());
	        		});
	        		
	        		//틀고정 된 테이블영역에서 마우스 휠이벤트가 발생한경우
    		    	tableBodyDivFix.mousewheel(function(objEvent, intDelta){
    		    		//다른 영역(body) 스크롤 같이 되는것을 막는다.
    			    	objEvent.preventDefault ? objEvent.preventDefault() : objEvent.returnValue = false;
    			    	if (intDelta > 0){  //마우스 업
    			    		_this.tableBodyDiv.scrollTop(_this.tableBodyDiv.scrollTop()-25 );
    					} else if (intDelta < 0){  //다운
    				        _this.tableBodyDiv.scrollTop(_this.tableBodyDiv.scrollTop()+25 );
    				    }
    		    	});
        		}
        		
        		containerDiv.insertBefore(this.tbl);
        		this.tbl.attr("id", "");
        		this.tbl.hide();//기존 테이블 제거
        		
    		    this._initSetTableHeadMeta();
    		    
    		    _this._onSuccess(this.trReference,'',this.trReference.size());
    		    
    		    var tempTR = $("<tr><td>1</td><td>2</td><td>3</td><td>4</td></tr>");
    		    if(this.trReference.size()> 0){
    		    	tempTR = this.trReference.eq(0).clone();
    		    }
    		    this.tbodyTable.append(tempTR);
    		    this.trHeight = tempTR.outerHeight();
    		    tempTR.remove();

    		    //========================================이벤트 설정=========================================
    		    //윈도우 창의 크기가 변했을경우 발생하는 이벤트
    		    $(window).bind('resizestop',function(e) {
    				_this.resizing();
        			_this.tableBodyDiv.scrollLeft(_this.tableBodyDiv.scrollLeft());
            	});
    		    
    		    this.tempScrollTop = 0; 
    		    this.beforePageArea = 0;
    		    tableBodyDiv.scroll(function(e) {
    		    	_this.tableHeadDiv.css('margin-left', (e.currentTarget.scrollLeft * -1) +"px");
    		    	
					if(config.paging.type == '3'){
						var scrolltop=_this.tableBodyDiv.scrollTop();
	    				var scrollheight=_this.tableBodyDiv.get(0).scrollHeight;
	    				var windowheight=_this.tableBodyDiv.get(0).clientHeight;
	    				
	    				//스크롤이 내려가다 끝부분에 근접했을경우
	    				if ((scrolltop+30) > (_this.tbodyTable.height() - _this.tableBodyDiv.height())){
	    					var appendIndex = (_this.currentRowArrayIndex + 1) ;
	    					if(appendIndex >= _this.rowArray.length){
	    						return;
	    					}
	    					
	    					//추가
	    					var appendTarget = $("<tbody id=\"tbody_" + (appendIndex) + "\"></tbody>");
	    					var tr = $(_this.rowArray[appendIndex]).clone();
	    					appendTarget.append(tr);
	    					_this.tbodyTable.append(appendTarget);
	    					if(_this.cellFixMode){
		    					var tbodyFix = $("<tbody id=\"tbodyFix_" + (appendIndex) + "\"></tbody>");
		    					tbodyFix.append(tr.clone());
		    					_this.tbodyTableFix.append(tbodyFix);
	    					}
	    					
	    					//삭제
	    					var removeIndex = appendIndex -3;
	    					var removeTarget = $("#tbody_" + (removeIndex), _this.tbodyTable);
	    					if(removeTarget.size() > 0){
	    						removeTarget.remove();
	    						var tbodyHeight = appendTarget.height();
	    						if(_this.cellFixMode){
    								$("#tbodyFix_" + removeIndex, _this.tbodyTableFix).remove();
    							}
	    						
	    						_this.tableBodyDiv.scrollTop(scrolltop - tbodyHeight);
	    					}
    						
	    					//그리드 정보 
    						if(config.gridInfo){
    							var rowsPerPage = config.paging.rows;
    							var stRow = rowsPerPage * (removeIndex+1);
        						var edRow = rowsPerPage * (appendIndex+1);
        						
        						if(stRow < 0){
        							stRow = 0;
        						}
        						
        						if(edRow > _this.totalCount){
        							edRow = _this.totalCount;
        						}
    							
    							$('#gridInfo_'+_this.id+'_page').text("["+stRow+"~"+edRow+"]");
    						}
	    					
    						
    						_this.currentRowArrayIndex++;
	    		        }
	    				
	    				//스크롤을 올리다가 처음부분에 도착할경우
	    				if(scrolltop <= 30){
	    					var appendIndex = (_this.currentRowArrayIndex - 3) ;
	    					
	    					if(appendIndex < 0){
	    						return;
	    					}
	    					
	    					//추가
	    					var tbody = $("<tbody id=\"tbody_" + (appendIndex) + "\"></tbody>");
	    					var tr = $(_this.rowArray[appendIndex]).clone();
	    					tbody.append(tr);
	    					tbody.insertBefore($("#tbody_"+(appendIndex+1),_this.tbodyTable));
	    					
	    					if(_this.cellFixMode){
		    					var tbodyFix = $("<tbody id=\"tbodyFix_" + (appendIndex) + "\"></tbody>");
		    					tbodyFix.append(tr.clone());
		    					tbodyFix.insertBefore($("#tbodyFix_" + (appendIndex+1),_this.tbodyTableFix));
	    					}
	    					
	    					//삭제
	    					var removeIndex = appendIndex+3;
	    					var removeTarget = $("#tbody_" + (removeIndex), _this.tbodyTable);
	    					if(removeTarget.size() > 0){
	    						var tbodyHeight = removeTarget.height();
	    						removeTarget.remove();
	    						
	    						if(_this.cellFixMode){
    								$("#tbodyFix_" + removeIndex, _this.tbodyTableFix).remove();
    							}
	    						
	    						_this.tableBodyDiv.scrollTop(scrolltop + tbodyHeight);
	    					}
	    					
	    					//그리드 정보
	    					if(config.gridInfo){
    							var rowsPerPage = config.paging.rows;
    							var stRow = rowsPerPage * (appendIndex);
        						var edRow = rowsPerPage * (removeIndex);
        						
        						if(stRow < 0){
        							stRow = 0;
        						}
        						
        						if(edRow > _this.totalCount){
        							edRow = _this.totalCount;
        						}
    							
    							$('#gridInfo_'+_this.id+'_page').text("["+stRow+"~"+edRow+"]");
    						}
    						
    						_this.currentRowArrayIndex--;
	    				}
	    				
					} else if(config.paging.type == '2'){
						try{
							var scrolltop	= _this.tableBodyDiv.scrollTop();
		    				var scrollheight= _this.tableBodyDiv.get(0).scrollHeight;
		    				var windowheight= _this.tableBodyDiv.get(0).clientHeight;
		    				
		    				var rowPerPage  = config.paging.rows;
		    				var rowIndex 	= parseInt(((scrolltop+windowheight)/(rowPerPage*_this.trHeight)));
		    				var marginTop 	= _this.trHeight*rowPerPage*(rowIndex-1);
		    				
		    				if(rowIndex == 0){
		    					marginTop = 0;
		    				}
		    				
		    				

							if (_this.tempScrollTop < scrolltop ){
								//log("down");
							}else if(_this.tempScrollTop > scrolltop){
								//log("up");
							}
							_this.tempScrollTop = scrolltop;
		    				
		    				//log("[_this.trHeight :"+_this.trHeight+"] [windowheight : "+windowheight+"] [rowPerPage :"+rowPerPage+"] [scrollheight :" +scrollheight+"] [scrolltop :"+scrolltop +"] [marginTop :"+marginTop+"] [rowIndex :"+rowIndex+"]");
		    				if(_this.beforePageArea != rowIndex){
		    					/*
		    					$("tbody[id*=\"tbody_\"").each(function(){
		    						var thisTbody = $(this);
		    						var id = thisTbody.attr("id");
		    						id = id.substring(6);
		    						_this.rowArray[id] = thisTbody.clone().get(0).childNodes;
		    					});
		    					*/
		    					
		    					//이전 정보
	    						if(rowIndex > 0 ){
	    							var prevTbody = $("<tbody id=\"tbody_" + (rowIndex-1) + "\" ></tbody>");
	    							var prevTr = $(_this.rowArray[(rowIndex-1)]).clone();
			    					prevTbody.append(prevTr);
	    						}
		    					
		    					//현재 정보
		    					var currentTbody = $("<tbody id=\"tbody_" + (rowIndex) + "\" ></tbody>");
		    					var currentTr = $(_this.rowArray[(rowIndex)]).clone();
		    					currentTbody.append(currentTr);
		    					
		    					//다음 정보
		    					if((rowIndex+1) < _this.rowArray.length ){
		    						var nextTbody = $("<tbody id=\"tbody_" + (rowIndex+1) + "\" ></tbody>");
			    					if(_this.rowArray[(rowIndex+1)].length > 0 ){
			    						var nextTr = $(_this.rowArray[(rowIndex+1)]).clone();
				    					nextTbody.append(nextTr);
	    		    				}
		    					}
		    					
		    					
		    					_this.tbodyTable.html("");
		    					_this.tbodyTable.append(prevTbody);
		    					_this.tbodyTable.append(currentTbody);
		    					_this.tbodyTable.append(nextTbody);
		    					_this.tbodyTable.css("margin-top",marginTop);
		    					_this.resizing();
		    					_this.currentRowArrayIndex = rowIndex;
		    					
		    					if(_this.cellFixMode){
		    						_this.tbodyTableFix.html("");
		    						$("tbody",_this.tbodyTable.clone()).each(function(){
		    							var tbody = $(this);
		    							var id = tbody.attr("id");
		    							tbody.attr("id",id.replace("tbody","tbodyFix"));
		    							_this.tbodyTableFix.append(tbody);
		    						});
			    					
			    					_this.tbodyTableFix.css("margin-top",marginTop);
			            			_this.tableBodyDivFix.scrollTop(_this.tableBodyDiv.scrollTop());
			            			_this.resizing();
	    						}
		    					
		    					
		    					/*
		    					$("tbody[id*=\"tbody_\"").each(function(){
		    						var thisTbody = $(this);
		    						var id = thisTbody.attr("id");
		    						id = id.substring(6);
		    						_this.rowArray[id] = thisTbody.clone().get(0).childNodes;
		    					});
		    					
		    					//이전 정보
	    						if(rowIndex > 0 ){
	    							var prevTbody = $("<tbody id=\"tbody_" + (rowIndex-1) + "\" ></tbody>");
	    							var prevTr = $(_this.rowArray[(rowIndex-1)]).clone();
			    					prevTbody.append(prevTr);
	    						}
		    					
		    					//현재 정보
		    					var currentTbody = $("<tbody id=\"tbody_" + (rowIndex) + "\" ></tbody>");
		    					var currentTr = $(_this.rowArray[(rowIndex)]).clone();
		    					currentTbody.append(currentTr);
		    					
		    					//다음 정보
		    					if((rowIndex+1) < _this.rowArray.length ){
		    						var nextTbody = $("<tbody id=\"tbody_" + (rowIndex+1) + "\" ></tbody>");
			    					if(_this.rowArray[(rowIndex+1)].length > 0 ){
			    						var nextTr = $(_this.rowArray[(rowIndex+1)]).clone();
				    					nextTbody.append(nextTr);
	    		    				}
		    					}
		    					
		    					
		    					_this.tbodyTable.html("");
		    					_this.tbodyTable.append(prevTbody);
		    					_this.tbodyTable.append(currentTbody);
		    					_this.tbodyTable.append(nextTbody);
		    					_this.tbodyTable.css("margin-top",marginTop);
		    					_this.resizing();
		    					_this.currentRowArrayIndex = rowIndex;
		    					
		    					if(_this.cellFixMode){
		    						_this.tbodyTableFix.html("");
			    					_this.tbodyTableFix.append(_this.tbodyTable.clone().children());
			    					_this.tbodyTableFix.css("margin-top",marginTop);
			            			_this.tableBodyDivFix.scrollTop(_this.tableBodyDiv.scrollTop());
			            			_this.resizing();
	    						}
		    					*/
		    					
		    					if(config.gridInfo == true){
	    							$('#gridInfo_'+_this.id+'_page').text("["+(rowIndex*rowPerPage)+"~"+((rowIndex+1)*rowPerPage)+"]");
	    						}
		    					_this.beforePageArea = rowIndex;
		    				}
						}catch(e){log(e,"tableBodyDiv.scroll paging.type=3");}
					}
				});
    		    
        		//tbody의 TD를 클릭시 에디트 모드 이벤트와 셀렉트 모드 이벤트
    			this.$editAndSelectEvent = function(event){
    				var eventEle=event.srcElement? event.srcElement : event.target;
    				var parent = eventEle;
    				var td = undefined;
    				while(parent.nodeName != "TR"){
    					if(parent.nodeName=="TD")      {td = parent;}
    					if(parent.nodeName == "TABLE") {break;}
    					parent = parent.parentNode;
    				}
    				parent = $(parent);
    				
    				if(_this.withShiftKey === false && _this.withControlKey === false){
    					_this.unSelectRows();
    				}
    				if(_this.withShiftKey){
    					if(_this.selectedRows.length==0){
    						parent.addClass(config.selectClassName);
    						var info = _this._updateRowArray(parent);
    						_this.selectedRows.push(info);
	    					_this._syncWithFix("addSelectedTR",{info:info});
    					}else{
    						var currentSelectedIndex = parent.rowIndex;
    						var start = _this.lastSelectedTRIndex;
    						var end   = currentSelectedIndex;
    						if(_this.lastSelectedTRIndex > currentSelectedIndex){
    							start = currentSelectedIndex;
    							end   = _this.lastSelectedTRIndex;
    						}
    						var eventTarget = event.data.target; //tbodyTable 만약 fixMode라면 tbodyTableFix 일수도 있음
    						$("tr",eventTarget).each(function(i){
    							if(i > end){
    								return false;
    							}
    							
    							if(start <= i && i <= end ){
    								var targetTR = $(this);
    								targetTR.addClass(config.selectClassName);
    								var info = _this._updateRowArray(targetTR);
    								_this.selectedRows.push(info);
    		    					_this._syncWithFix("addSelectedTR",{info:info});
    							}
    						});
    					}
    				}else{
    					parent.addClass(config.selectClassName);
    					var uuid = _this.uuid(parent);
    					var info = _this._updateRowArray(parent);
    					_this.selectedRowArray[uuid] = info;
    					_this._syncWithFix("addSelectedTR",{info:info});
    				}
				
    				if(config.onclick !== undefined){
    					config.onclick(td,event);
    				}
    				
    				_this._editMode(eventEle);
        		};
        		
        		//멀티 셀렉트 모드를 위한 변수 설정 이벤트 바인드
        		if(config.multiSelectable){
        			
        			var $setSelection = function(boolean){
        				var mozSelect = boolean?'':'none';
        				if (typeof document.onselectstart !== undefined) {
        					document.onselectstart = function(){ return boolean; };
        				} else if (typeof document.style.MozUserSelect !== undefined){ 
        					document.style.MozUserSelect = mozSelect;
        				}
        			};
        			
        			var $keydownEvent = function(e){
        				var k = e.keyCode;
        				if(k==16){
        					_this.withShiftKey = true;
        					$setSelection(!_this.withShiftKey);
        					document.ondragstart=function(){return false;};
        				}else if(k==17){
        					_this.withControlKey = true;
        					$setSelection(!_this.withControlKey);
        					document.ondragstart=function(){return false;};
        				}
        			};
        			
        			var $keyupEvent = function(e){
        				var k = e.keyCode;
        				if(k==16){
        					_this.withShiftKey = false;
        					$setSelection(!_this.withShiftKey);
        					document.ondragstart=function(){return true;};
        				}else if(k==17){
        					_this.withControlKey = false;
        					$setSelection(!_this.withControlKey);
        					document.ondragstart=function(){return true;};
        				}
        			};
        			
        			if($.browser.msie){
        				$(window.document).bind('keydown',$keydownEvent);
            			$(window.document).bind('keyup', $keyupEvent);
        			}else{
        				$(window).bind('keydown', $keydownEvent);
            			$(window).bind('keyup', $keyupEvent);
        			}
        			
        		}
    		    
				//컬럼의 길이를 조절할수 있는 이벤트
        		if(config.columnResizable){
        			this._columnResizeMode();
        		}
        		
        		//header 클릭시 오름차순 내림차순으로 정렬을 할수 있는 이벤트 
        		_this._sortMode( this.theadTable);
        		
        		//tbody의 TD를 클릭시 에디트 모드 이벤트와 셀렉트 모드 이벤트 ($editAndSelectEvent) 바인딩 
        		tbodyTable.bind("click",{target:_this.tbodyTable},_this.$editAndSelectEvent);
        		
        		//헤더를 안보이게 하는 설정
        		if(!config.displayHeader){
        			this.theadTable.hide();
        			_this._syncWithFix("displayHeader");
        		}
        		
        		if(_this.cellFixMode){
        			_this._sortMode( this.theadTableFix);
        			tbodyTableFix.bind("click",{target:_this.tbodyTableFix},_this.$editAndSelectEvent);
        		}
            },
            
            _initSetTableHeadMeta : function(){
            	
            	var $getCellIndex = function(cell) {
            		var row = cell.parentNode, tb = row.parentNode,
            		// this may be any container with .rows (tbody, thead, table...)
            		rows = tb.rows, rIndex = row.rowIndex, numCols = 0, table = [], n,
            		// the spec says that we should autofill missing cells so we'll comply
            		dummyCell = {
            			rowSpan : 1,
            			colSpan : 1
            		}; // pass1 - find the max number of columns
            		for ( var r, y = 0; r = rows[y]; y++) {
            			n = 0;
            			for ( var c, x = 0; c = r.cells[x]; x++) {
            				n += c.colSpan || 1;
            			}
            			numCols = Math.max(numCols, n);
            		} // pass2 - build table matrix (up to our row)
            		for ( var y = 0; y <= rIndex; y++) {
            			n = 0;
            			for ( var x = 0; x <= numCols; x++) {
            				table[y] = (table[y] || []); // assign dimension && prevent overflow
            				r = rows[y];
            				if (!table[y][x]) {
            					c = r.cells[n++] || dummyCell;
            					for ( var i = 0, l = (c.rowSpan || 1); i < l; i++) {
            						for ( var j = 0, m = (c.colSpan || 1); j < m; j++) {
            							table[y + i] = (table[y + i] || []); // assign dimension && prevent overflow
            							table[y + i][x + j] = 1; // debug with: '['+x+'/'+y+']'
            							// we've found our cell, no more work is needed so we use an tried and tested tactic of early return
            							if (c === cell) { 
            								return {
            									x : (x + j),
            									y : (y + i)
            								};
            							}
            						} // for
            					} // for
            				} // if
            			} // for x
            		} // for y
            		// what is appropriate return value here?
            		// if the code is correct then this doesn't occur
            		return;
            	};
            	
            	for ( var i = 0, i2 = this.thead.get(0).rows; i < i2.length; i++) {
            		for(var j =0, j2 = i2[i].cells; j < j2.length; j++){
            			var cell = j2[j];
            			var t = $getCellIndex(cell);
            			cell = $(cell);
            			cell.attr("x", t.x);
            			cell.attr("y", t.y);
            			
            			var rowspan = cell.attr("rowspan");
            			if(rowspan === undefined){
            				cell.attr("rowspan","1");
            			}
            			var colspan = cell.attr("colspan");
            			if(colspan=== undefined){
            				cell.attr("colspan","1");
            			}
            		}
            	}

               	//theadTable의 길이를 설정
            	var tblWidth = 0;
            	var cols = $("col",this.theadColGroup);
            	for(var i =0, ic = cols.size(); i < ic; i++ ){
            		try {
	            		var targetCol = cols.eq(i);
	            		var w = targetCol.attr("width");
	            		
	            		if(targetCol.hasClass("fixable")){
	            			var cellFixWidth = w;
	            			if(w.indexOf('px') != -1){
	            				cellFixWidth = w.substring(0, w.indexOf('px'));
	            			}
	            			this.tableContainerFixWidth += cellFixWidth*1;
	            			
	            			if($.browser.msie){
	                    		if($.browser.version=="6.0" || $.browser.version=="7.0"){
	                    			this.tableContainerFixWidth++;
	                    		}
	            			}
	            		}
	            		
	            		if(w==null||w==""){
	            			if(targetCol.hasClass("hiddenable")){
	            				w = 0;
	            			}else{
	            				tblWidth = 0;
	    						break;
	            			}
	            		}
	            		
	            		if(config.width.toString().indexOf("%")>0){
	            			tblWidth = 0;
	            			this.isRelativeWidth = true;
	    					break;
	            		}
	            		
	            		if(w.indexOf("%")>0){
	            			tblWidth = 0;
	            			this.isRelativeWidth = true;
	    					break;
	            		}

	            		w = parseInt(w);
	            		
	            		if (w > 0) {
	    					tblWidth = tblWidth + w;
	    				}
            		}catch(e){
            			tblWidth = 0;
            			log(e.message,"ERROR_theadTableWidthSetting_initSetTableHeadMeta");
            		}
            	}

            	if(tblWidth > 0){
        			this.theadTable.width(tblWidth);
        			this.tableContainer.width(this.tableContainer.width() - this.tableContainerFixWidth);
            	}else{
            		var w = this.tableContainer.get(0).clientWidth - this.scrollBarWidth;
            		this.theadTable.width(w);
            	}

            	//col 의 align 속성을 테이블의 각 td에 부여하기 위해 inline Style의 스타일 시트를 만들어 head에 붙임 
            	var cssTxt = '';
            	var cssTxt_head = '';

        		var cols_body = $("col", this.tbodyTable);
        		
            	for( var i = 0 , ic = cols.size(); i < ic ; i++ ){
    				var targetCol = cols.eq(i);
    				var targetColBody = cols_body.eq(i);
    				
    				//셀 정렬 
    				var txtAlign   = targetCol.css("text-align");
    				if( txtAlign=='' || txtAlign.length==0 ){
    					txtAlign = targetCol.attr("align");
    				}
    				
    				if(txtAlign==''){
    					txtAlign = config.gridTextAlign;
    				}
    				
    				targetCol.attr("align",txtAlign);
    				
    				//셀 hidden hidden 모드 일시 셀모드를 우선한다.
    				var isHidden = targetCol.hasClass("hiddenable");
    				if(isHidden){
    					var cellFixTxt = '';
    					cellFixTxt = "display:none;";
    					targetCol.hide();
    					targetColBody.hide();
        				
        				cssTxt = cssTxt + "#"+ _this.id + ' tbody tr > td:first-child ';
        				cssTxt_head = cssTxt_head + "#"+ _this.id+'_head' + ' thead tr > th:first-child ';
        				
        				for ( var j = 0; j < i; j++) {
        					cssTxt = cssTxt + '+ td';
        					cssTxt_head = cssTxt_head + '+ th';
        				}
        				
        				cssTxt = cssTxt + ' {text-align:' + txtAlign + ';' + cellFixTxt + '} ';
           				cssTxt_head = cssTxt_head + ' {' + cellFixTxt + '} ';
    				}else{
    					//셀 고정
        				var isCellFix  = targetCol.hasClass("fixable");
        				var cellFixTxt = '';
        				
        				if(isCellFix == true){
        					cellFixTxt = "display:none;";
        					targetCol.hide();
        					targetColBody.hide();
        				}
        				
        				cssTxt = cssTxt + "#"+ _this.id + ' tbody tr > td:first-child ';
        				cssTxt_head = cssTxt_head + "#"+ _this.id+'_head' + ' thead tr > th:first-child ';
        				
        				for ( var j = 0; j < i; j++) {
        					cssTxt = cssTxt + '+ td';
        					cssTxt_head = cssTxt_head + '+ th';
        				}
        				
        				cssTxt = cssTxt + ' {text-align:' + txtAlign + ';' + cellFixTxt + '} ';
           				cssTxt_head = cssTxt_head + ' {' + cellFixTxt + '} ';
    				}
    			}
            	
             	var cssTxtFix = '';
            	var cssTxt_headFix = '';
            	if(_this.cellFixMode){
	            	for ( var i = 0, i2 = this.theadFix.get(0).rows; i < i2.length; i++) {
	            		for(var j =0, j2 = i2[i].cells; j < j2.length; j++){
	            			var cell = j2[j];
	            			var t = $getCellIndex(cell);
	            			
	            			cell = $(cell);
	            			cell.attr("x", t.x);
	            			cell.attr("y", t.y);
	            			
	            			var rowspan = cell.attr("rowspan");
	            			if(rowspan === undefined){
	            				cell.attr("rowspan","1");
	            			}
	            			var colspan = cell.attr("colspan");
	            			if(colspan=== undefined){
	            				cell.attr("colspan","1");
	            			}
	            		}
	            	}
            		
	            	var colsFix = $("col", _this.theadTableFix);
	        		var colsFix_body = $("col", _this.tbodyTableFix);
	            	
	             	for( var i = 0 , ic = colsFix.size(); i < ic ; i++ ){
	    				var targetCol = colsFix.eq(i);
	    				var targetColBody = colsFix_body.eq(i);
	
	    				//셀 정렬 
	    				var txtAlign   = targetCol.css("text-align");
	    				if( txtAlign=='' || txtAlign.length==0 ){
	    					txtAlign = targetCol.attr("align");
	    				}
	    				
	    				if(txtAlign==''){
	    					txtAlign = config.gridTextAlign;
	    				}
	    				
	    				targetCol.attr("align",txtAlign);
	
	    				//셀 고정
	    				var isCellFix  = targetCol.hasClass("fixable");
	    				var cellFixTxt = '';
	    				
	       				if(isCellFix == true){
	       					cellFixTxt = "";
	       				}else{
	       					cellFixTxt = "display:none;";
	       					targetCol.hide();
	    					targetColBody.hide();
	       				}
	       				
	       				cssTxtFix = cssTxtFix + "#"+ _this.id+'Fix' + ' tbody tr > td:first-child ';
	    				cssTxt_headFix = cssTxt_headFix + "#"+ _this.id+'_headFix' + ' thead tr > th:first-child ';
	    				
	    				for ( var j = 0; j < i; j++) {
	    					cssTxtFix = cssTxtFix + '+ td';
	    					cssTxt_headFix = cssTxt_headFix + '+ th';	
	    				}
	    				
	       				cssTxtFix = cssTxtFix + ' {text-align:' + txtAlign + ';' + cellFixTxt + '} ';
	       				cssTxt_headFix = cssTxt_headFix + ' {' + cellFixTxt + '} ';
	    			}
            	}
            	
             	var internalCss = cssTxt + cssTxt_head + cssTxtFix + cssTxt_headFix;
             	var ss = document.createElement('style');
				ss.setAttribute("type", "text/css");
				
				try{
					ss.appendChild(document.createTextNode(internalCss));
    				document.body.appendChild(ss);
				}catch(e){
					if($.browser.msie && $.browser.version=="8.0"){
						ss.styleSheet.cssText = internalCss;
						var head = document.getElementsByTagName('head')[0];
						head.appendChild(ss);
					}
				}
				
				
				/*
				function addStyle() { 
				    var style = document.styleSheets[0];        //select style sheet (0==first) 
				    var styleSel = ".class:hover";              //define selector 
				    var styleDec = "color: red;";             //define declaration 
				 
				    if(style.insertRule) {        //for modern, DOM-compliant browsers 
				 
				        style.insertRule(styleSel+'{'+styleDec+'}', style.cssRules.length); 
				        //I chose to do it this way to more easily support the addRule method, but 
				        //know that insertRule only needs two parameters, full style rule 
				        //(selector+prop/value declarations), and index to insert rule at 
				        //                  styleSheets[0].insertRule(rule, index); 
				 
				    }else {                       //for IE < 9 
				        style.addRule(styleSel, styleDec, -1); 
				    } 
				} 
				*/
            },

            _sortMode:function(sortObj){
        		var $reverse = function(){
        			if(config.server===undefined){
        				_this.loadingDiv.show();
        				
	            		var sortArray = new Array();
						if(config.paging.rows !== undefined){ //페이징 할 때...
							for(var i in _this.rowArray){
								var rowArrayI = _this.rowArray[i];
								for( var j in rowArrayI){
									sortArray[sortArray.length] = rowArrayI[j];
								}
							}
						}else{
							var rows = _this.tbodyTable.get(0).rows;
							for( var i = 0, ic = rows.length; i < ic; i++ ){
        						sortArray[sortArray.length] = rows[i];
        					}
						}
						
						sortArray.reverse();
	            		
    					_this._onSuccess(sortArray,'',sortArray.length);//jqXHR 객체가 없다...
    					_this.loadingDiv.hide();
        			}else{
        				var sortOrder = $("input[name=\"sortOrder\"]",_this.lastAjaxForm).val();
        				sortOrder = sortOrder =="asc" ? "desc" : "asc";
        				
						$("input[name=\"sortOrder\"]",_this.lastAjaxForm).val(sortOrder);
						
						var param = {
			    			url:_this.lastAjaxForm.attr("action"),
			    		 	type:_this.lastAjaxForm.attr("method"),
			    		 	data:_this.lastAjaxForm.serialize()+_this.getQueryPagingInfo(1)
			    		};
						
			    		_this._ajax(param);
        			}
            	};
            	
            	//sorting comparator 인자의 [0]은 tr [1]은 비교하고자 하는 값
            	var $intTypeComparator = function(a,b){
					var aa = parseFloat(a[1].replace(/[^0-9.-]/g,''));
				    if (isNaN(aa)) aa = 0;
				    var bb = parseFloat(b[1].replace(/[^0-9.-]/g,'')); 
				    if (isNaN(bb)) bb = 0;
				    return aa-bb;
				};
				
				var $stringTypeComparator = function(a,b){
					if (a[1] == b[1]){ return 0; }
					else if (a[1] <  b[1]){ return -1;}
					else {return 1;}
				};
				
				var $dateTypeComparator = function(a,b){
					if (a[1] == b[1]){ return 0; }
					else if (a[1] <  b[1]){ return -1;}
					else {return 1;}
				};
            	
            	$("col",_this.theadColGroup).each(function(k){
            		var targetCol = $(this);
            		
            		if( targetCol.hasClass("intType")||targetCol.hasClass("stringType")||targetCol.hasClass("dateType") ){
            			var el = $("th[x=\""+k+"\"]", sortObj);
            			el.css("cursor","pointer");
            			
            			var sortIcon = $("<span>",{ "id":"sortable_icon" });
        				$(".thWrapper",el).append(sortIcon);
        				
        				el.bind("click",function(event){
        					//_columnResize가 수행되는동안 _sortMode 이벤트의 중첩이 발생하는경우를 방지
        					if(_this.isColumnResizing == true){
        						_this.isColumnResizing = false;
        						return;
        					}
        					
        					var obj = event.currentTarget;
        					var sortIcon = $("#sortable_icon",$(obj));
        					var className = sortIcon.attr("class");
        					
        					if(className=="sort_asc"){
        						$reverse();
        						sortIcon.html('&nbsp▲');
        						sortIcon.attr("class","sort_desc");
        						_this.loadingDiv.hide();
        					}else if(className=="sort_desc"){
        						$reverse();
        						sortIcon.html('&nbsp;▼');
        						sortIcon.attr("class","sort_asc");
        					}else{
        						$("SPAN#sortable_icon",_this.containerDiv).each(function(k){ //아이콘 초기화
        							$(this).html("");
        							$(this).attr("class","");
        						});
        						
        						sortIcon.html('&nbsp▲');
        						sortIcon.attr("class","sort_desc");
        						
        						if(config.server===undefined){
        							_this.loadingDiv.show();
        							var startDate = new Date();
        							//Sorting Comparator Setting
        							if(!obj.sortfunction){
                						if(targetCol.hasClass("intType")){
                							obj.sortfunction = $intTypeComparator;
                						} else if(targetCol.hasClass("stringType")){
                							obj.sortfunction = $stringTypeComparator;
                						} else if(targetCol.hasClass("dateType")){
                							obj.sortfunction = $dateTypeComparator;
                						} 
                					}
        							
        							var x = obj.getAttribute("x");
        							var sortArray = new Array();
        							for(var i in _this.rowArray){
    									var rowArrayI = _this.rowArray[i];
    									for( var j in rowArrayI){
    										sortArray[sortArray.length] = [rowArrayI[j],$("TD",rowArrayI[j]).eq(x).text()];
    									}
    								}
                					sortArray.sort(obj.sortfunction);
                					
                					var sortArrayLength = sortArray.length;
                					var dataArray = new Array();
                					for (var j=0; j<sortArrayLength; j++) {
                						dataArray.push(sortArray[j][0]);
                					}
                					delete sortArray;
                					_this._onSuccess(dataArray,'',sortArrayLength);//jqXHR 객체가 없다...
                					_this.loadingDiv.hide();
        						}else{
        							var sortTarget = targetCol.attr("id");
        							if(sortTarget.indexOf("col_")==0){ //col_ 제거
        								sortTarget = sortTarget.substring(4);
        							}
        							
        							var sortType = "stringType";
        							if(targetCol.hasClass("intType")){
        								sortType = "intType";
        							}else if(targetCol.hasClass("stringType")){
        								sortType = "stringType";
        							}else if(targetCol.hasClass("dateType")){
        								sortType = "dateType";
        							}
        							
        							$("input[name=\"sortTarget\"]",_this.lastAjaxForm).val(sortTarget);
        							$("input[name=\"sortType\"]",_this.lastAjaxForm).val(sortType);
        							$("input[name=\"sortOrder\"]",_this.lastAjaxForm).val("asc");
        							
        							var param = {
        				    			url:_this.lastAjaxForm.attr("action"),
        				    		 	type:_this.lastAjaxForm.attr("method"),
        				    		 	data:_this.lastAjaxForm.serialize()+_this.getQueryPagingInfo(1)
        				    		};
        							
        				    		_this._ajax(param);
        						}
        					}
        				});
        			}
            	});
            },

            _pagingMode : function(data,totalCount){
            	
        		var $paging = function(event){  // for paging type 1
        			
        			var $makePagingNavigation = function(currentPage){
    					var rowsPerPage = parseInt(config.paging.rows);
    			    	var start 		= (currentPage - 1) * rowsPerPage;
    			    	var end   		= (currentPage * rowsPerPage) - 1;
    			    	var totalPage   = Math.floor(parseInt(_this.totalCount/rowsPerPage));
        				if(parseInt(_this.totalCount % rowsPerPage) != 0){
        					totalPage += 1;
        				}
        				
        				var prePage = currentPage == 1 ? 1 : currentPage - 1;
        				var nexPage = currentPage == totalPage ? totalPage : currentPage + 1;
        			    var minPage = (Math.floor((currentPage-1) / 10) * 10) + 1;
        			    var maxPage = ((10 - (currentPage % 10)) % 10) + currentPage;
        			    if(maxPage > totalPage) maxPage = totalPage;
    			    	
        			    var navi = $("<div class=\"paginate_complex\"></div>");
        			    
        				if(minPage > 1) {
        					var pre02 = $("<a href='#' rel='history' class='direction prev'><span></span><span></span> 처음</a>");
        					var pre01 = $("<a href='#' rel='history' class='direction prev'><span></span> 이전</a>");
        					pre02.bind("click",{curPage:1},$paging);
        					pre01.bind("click",{curPage:minPage-1},$paging);
        					navi.append(pre02).append(" ");
        					navi.append(pre01).append(" ");
        			    }

        				for(var i = minPage; i <= maxPage; i++) {
        					var numbering;
        			    	if(currentPage == i) {
        			    		numbering = $("<strong>"+i+"</strong>");
        			    		_this.gridCurrentPage = i;
        			    	}else{
        			    		numbering = $("<a href='#' rel='history' >"+i+"</a>");
        			    		numbering.bind("click",{curPage:i},$paging);
        			    	}
        			    	navi.append(numbering).append(" ");
        			    }
        				
        				if(maxPage < totalPage) {
        					var next01= $("<a href='#' rel='history' class='direction next'>다음 <span></span></a>");
        					var next02 = $("<a href='#' rel='history' class='direction next'>끝 <span></span><span></span></a>");
        					next01.bind("click",{curPage:maxPage+1},$paging);
        					next02.bind("click",{curPage:totalPage},$paging);
        					navi.append(next01).append(" ");
        					navi.append(next02).append(" ");
        			    }
        				
        				var pagingArea = $("#"+_this.id+"_gridPagingArea");

        				if(pagingArea.size()==0){
        					pagingArea = $("<div id='"+_this.id+"_gridPagingArea'></div>").css("width", config.width);
        					pagingArea.insertAfter(_this.containerDiv);
        				}
        				
        				if(config.gridInfo){
        					$('#gridInfo_'+_this.id+'_page').text("["+currentPage+"/"+totalPage+"]");
        				}
        				
        				pagingArea.html("");
        				pagingArea.append(navi);
        				log("[ start : "+start +  " , end : " +  end  + " ] [ totCnt = "+ totalCount +" ]");
    				}; // end of $makePagingNavigation
    				
    				var $attachRowToTable = function(rows){
    					$("tbody",_this.tbodyTable).each(function(){
        					$(this).remove();
        				});
    					_this.currentRowArrayIndex = (page-1);
    			    	_this.tbodyTable.append($("<tbody id=\"tbody_"+(page-1)+"\"></tbody>").append(tr));
    			    	$makePagingNavigation(page);
    			    	_this._syncWithFix("pagingMode",{info:{tbodySeq:(page-1),tbodyId:"tbody_"+(page-1),row:tr.clone()}});
    				};// end of attachRowToTable
        			
        			var page = typeof event != "number" ? event.data.curPage : event;
        			if(typeof event =="number" && config.paging.query){
        				$makePagingNavigation(page); //number type 1 으로 들어오는 것은 단지 페이징 네비게이션을 표현하기 위한것
        			}else{
        				if(config.paging.query){
        					$.ajax({
        						url:_this.lastAjaxForm.attr("action"),
        		    		 	type:_this.lastAjaxForm.attr("method"),
        		    		 	data:_this.lastAjaxForm.serialize()+_this.getQueryPagingInfo(page),
        		    		 	success: function (data,jqXHR){
        		    		 		$attachRowToTable($(data));
        		    		 	}
        					});
            			}else{
            				var tr = $(_this.rowArray[(page-1)]).clone();
            				$attachRowToTable(tr);
            			}
        			}
				};// end of $paging
				
				
        		
				var pagingPage = (config.paging.page !== undefined && "" != config.paging.page) ? parseInt(config.paging.page) : 1 ;
				if(config.paging.query){
					_this.totalCount  = totalCount;
					_this.tbody.html(data);
    				if(_this.cellFixMode == true){
      					_this.tbodyFix.html(data);
        			}
    				
    				if(config.paging.type == '1'){         // 페이징
						return $paging(pagingPage);
					}else if(config.paging.type == '2'){   // 스크롤 내리면서 업데이트.
						
					}
				}else{
					
					if(config.paging.type == '1'){         // 페이징
						return $paging(pagingPage);
					}else if(config.paging.type == '3'){   // 스크롤 내리면서 업데이트.
						var tbody = $("<tbody id=\"tbody_0\"></tbody>");
						var tr = $(_this.rowArray[0]).clone();
						_this.currentRowArrayIndex = 0;
						
						tbody.append(tr);
						_this.tbody.remove();         //기존꺼 지우고...어차피 비어있음...
						_this.tbodyTable.html(tbody);

						if(_this.cellFixMode == true){
							var tbodyFix = $("<tbody id=\"tbodyFix_0\"></tbody>");
							tbodyFix.append(tr.clone());
							_this.tbodyFix.remove();
							_this.tbodyTableFix.html(tbodyFix);
						}
						
						if(config.gridInfo == true){
							var rowsPerPage = parseInt(config.paging.rows);
							$('#gridInfo_'+_this.id+'_page').text("[0~"+rowsPerPage+"]");
						}
						
						return tr;
					}else if(config.paging.type == '2'){
						_this.currentRowArrayIndex = 0;
						
						var tr = $(_this.rowArray[0]).clone();
						_this.tbodyTable.html($("<tbody id=\"tbody_0\"></tbody>").append(tr));
						
						var scrollHeight = _this.trHeight * _this.totalCount;
						var virtualScrollHeightDiv = $("DIV.virtualScrollHeightDiv",_this.containerDiv);
						if(virtualScrollHeightDiv.size()==0){
							if($.browser.msie && ($.browser.version=="7.0"||$.browser.version=="6.0")){
								_this.tbodyTable.css("float","left");
								_this.tableBodyDiv.append("<div class='virtualScrollHeightDiv' style='float:left;height:"+scrollHeight+"px'></div><div style='clear:both;'></div>");
							}else{
								_this.tableBodyDiv.css("position","relative");
								$("<div class='virtualScrollHeightDiv' style='position:absolute;width:1px;top:0px;height:"+scrollHeight+"px;'></div>").insertBefore(_this.tbodyTable);
							}
						}else{
							virtualScrollHeightDiv.css("height",scrollHeight+"px");
						}
						
						if(_this.cellFixMode){
							_this.tbodyTableFix.html($("<tbody id=\"tbodyFix_0\"></tbody>").append(tr.clone()));
						}
					}
				}
    		},
    		
    		_columnResizeMode : function(){
            	var resizeCursor = $('<div class="resizeCursor" style="position:absolute;top:0px;right:0px;width:5px;height:100%;cursor:e-resize;"></div>');
            	var theadColArray = $("col",this.theadTable);
            	var thFix = $("th", _this.theadFix);
            	
				$("thead th",this.theadTable).each(function(k){
        			var thElement = $(this);
        			if(thElement.attr("colspan")==1){
        				var resizeCursorClone = resizeCursor.clone();
        				$(resizeCursorClone).mousedown(function(e){
        					$("body").css("cursor","e-resize");
        					document.onselectstart=function(){return false;};
        					document.ondragstart=function(){return false;};
            				resizeCursorClone.attr("data-isResizing","true");
                			resizeCursorClone.width = $(this.parentNode).width();
                			resizeCursorClone.startX = e.pageX;
                			
                			$(document).mouseup(function(e){
                				$("body").css("cursor","default");
                				document.onselectstart=function(){return true;};
                				document.ondragstart=function(){return true;};
                				$(document).unbind("mouseup");
                				$(document).unbind("mousemove");
                    			resizeCursorClone.attr("data-isResizing","false");
                    			_this.resizing();
                    			_this.isColumnResizing = true;
                    		}).mousemove(function(e){
                    			if(resizeCursorClone.attr("data-isResizing")=="true"){
                    				var width = (e.pageX - resizeCursorClone.startX);
                    				var colIndex = thElement.attr("x");
                    				theadColArray.eq(colIndex).attr("width",(resizeCursorClone.width+width)+"px");
                    				_this.resizing();
                    			}
                    		});
                		});
        				
        				$(".thWrapper",thElement).eq(0).append(resizeCursorClone);
            			
            			if(_this.cellFixMode){
            				//fixable th 높이 맞추기 위해..span 을 삽입.
            				var resizeCursorFixClone = resizeCursorClone.clone();
            				resizeCursorFixClone.css('cursor', '');
            				var thFixElement = thFix.eq(k);
            				thFix.eq(k).append(resizeCursorFixClone);
        				}
        			}// end of if(thElement.attr("colspan")==1){
        		});
            },
            
    		_editMode:function(selTdObj){
            	var col = $(this.theadCols.eq(selTdObj.cellIndex));
            	if( col.hasClass("editable")){
            		if (selTdObj.firstChild && selTdObj.firstChild.nodeType != 3){
						return;
					}
            		var selTrObj = $(selTdObj.parentNode);
            		selTdObj = $(selTdObj);
            		var uuid = _this.uuid(selTrObj);
            		
            		//Event Function for input and select
					var bindFunc = function(){
						var inputVal = newHTML.val();
						selTdObj.attr("data-currentValue",inputVal);
						
						if(newHTML.get(0).nodeName=="SELECT"){
							inputVal = $("option:selected",newHTML).text(); 
						}
						inputVal = $.trim(inputVal);
						
						var haveToUpdateRowArray = false;
						var execute = selTrObj.attr("data-execute");
						//처음값과 다르다면.. 즉, 수정되었다면
						if(inputVal != selTdObj.attr("data-preValue")){
							selTrObj.attr("data-isEditedRow","true");
							if("append" != execute){
								selTrObj.attr("data-execute","update");
								selTdObj.addClass("editedTdForUpdate");
								_this.editedRowArray["update"][uuid]=selTrObj;
							}else{
								selTdObj.addClass("editedTdForInsert");
								_this.editedRowArray["append"][uuid]=selTrObj;
							}
						}else{//수정된적이 없거나 다시 처음의 값으로 돌아온경우
							selTdObj.attr("data-isEditedValue","false");
							if("append" != execute){ //기존에 존재하던 row라면
								selTdObj.removeClass("editedTdForUpdate");
								if($("TD[class=\"editedTdForUpdate\"]",selTrObj).size()==0){
									selTrObj.removeAttr("data-execute");
									if(selTrObj.attr("data-isEditedRow")=="true"){
										selTrObj.removeAttr("data-isEditedRow");
										haveToUpdateRowArray = true;
										delete _this.editedRowArray["update"][uuid];
									}
								}
							}else{
								selTdObj.removeClass("editedTdForInsert");
								_this.editedRowArray["append"][uuid]=selTrObj;
							}
						}
						
						selTdObj.removeClass("editMode");
						selTdObj.html(inputVal);
						
						newHTML.remove();
						
						//if( selTrObj.attr("data-execute") !== undefined || haveToUpdateRowArray){
							var info = _this._updateRowArray(selTrObj);
							_this._syncWithFix("editMode",{info:info});
						//}
					};
					
					if( selTrObj.attr("data-isInit") != "true" ){
						selTrObj.attr("data-isInit","true");
						$("td",selTrObj).each(function(){
							var tdObj = $(this); 
							tdObj.attr("data-preValue",$.trim(tdObj.text()));
						});
					};
					
					var w = selTdObj.width();
					var h = selTdObj.height();
					var v = $.trim(selTdObj.text());
					selTdObj.addClass("editMode");
					
					var newHTML 	= undefined;
					var dataEvents	= col.attr("data-events");
					if(dataEvents === null || dataEvents === undefined ){
						dataEvents = "";
					}
					
					if(col.attr("data-select")!==undefined){
						var selectOption = col.attr("data-select");
						var optValues    = selectOption.split(",");
						
						newHTML = "<select class='editSelect' style='width:100%;' "+dataEvents+"  >";
						for ( var j = 0, n = optValues.length; j < n; j++) {
							var selChk = "";
							var optKeyVal = optValues[j].split(":");
							
							var optValue = "";
							var optText = "";
							if(optKeyVal.length == 1){
								optValue = optKeyVal[0];
								optText = optKeyVal[0];
							}else{
								optValue = optKeyVal[0];
								optText = optKeyVal[1];
							}
							
							if (v == optText){
								selChk = " selected='selected' ";
							}
								
							newHTML += "<option value='"+optValue+"' "+selChk+">"+optText+"</option>";
						}
						newHTML = $(newHTML + "</select>");
						
						newHTML.bind('blur',bindFunc);
						newHTML.bind('change',bindFunc);
						selTdObj.html(newHTML);
						
						newHTML.focus();
					} else {
						newHTML = $("<input type='text' class='editInput' value='"+ v +"' style='width:"+ w +"px;height:"+ h +"px;margin:0px;border:0px;' "+dataEvents+" />");
						newHTML.bind('blur',bindFunc);
						selTdObj.html(newHTML);
						
						newHTML.select();
					}
				}
            },
            
            /*
             * fixable 모드와 같이 두테이블간 싱크가 필요한경우를 위한 함수 
             * */
            _syncWithFix : function(mode,jsonData){
            	if(_this.cellFixMode == true){
            		var isFixTable = false;
            		var info = jsonData.info;
            		
            		var $findSyncRow = function(rowInfo){
            			var tr 			= rowInfo.row;
                    	var uuid		= _this.uuid(tr);
                    	var tbodyId 	= rowInfo.tbodyId;
        				var tbodySeq 	= rowInfo.tbodySeq;
        				if(tbodyId.indexOf("tbodyFix")==0){
                			isFixTable = true;
                		}
        				var targetRowArray = _this.rowArray[tbodySeq];
        				for( var i = 0, ic = targetRowArray.length; i < ic ; i++ ){
        					//log(mode+ " : " +uuid+ " : "+tbodyId + " : "+ic + " : " + i);
        					if(targetRowArray[i].getAttribute("data-uuid") == uuid){
        						if(isFixTable){
                        			return $("TBODY#tbody_"+tbodySeq+" TR",_this.tbodyTable).eq(i);
                        		}else{
                        			return $("TBODY#tbodyFix_"+tbodySeq+" TR",_this.tbodyTableFix).eq(i);
                        		}
        					}
        				}
            		};
            		
            		
            		if("addSelectedTR" == mode){
            			$findSyncRow(info).addClass(config.selectClassName);
            		} else if("removeSelectedTR" == mode){
        				$findSyncRow(info).removeClass(config.selectClassName);
            		} else if("editMode" == mode){
            			$findSyncRow(info).replaceWith(info.row.clone());
            		} else if("pagingMode" == mode){
            			$("tbody",_this.tbodyTableFix).each(function(){
            				$(this).remove();
            			});
            			_this.tbodyTableFix.append($("<tbody id=\"tbodyFix_"+info.tbodySeq+"\"></tbody>").append(info.row));
            		} else if("displayHeader"){
            			_this.theadTableFix.hide();
            		}
            	}
            },
                       
            _updateRowArray   : function(obj){
				var tr 			= obj;
            	var tbody 		= $(tr.get(0).parentNode);
				var tbodyId  	= tbody.attr("id");
				var tbodySeq 	= tbodyId.substring(tbodyId.lastIndexOf("_")+1);//"tbody_" 또는 "tbodyFix_" 를 제거
				var index       = tr.get(0).sectionRowIndex;
				
				_this.rowArray[tbodySeq][index] = tr.clone().get(0);
				
				var returnArray = new Object();
				returnArray["row"]      = tr.clone();
				returnArray["tbody"]    = tbody;
				returnArray["tbodyId"]  = tbodyId;
				returnArray["tbodySeq"] = tbodySeq;
				return returnArray;
            },

			resizing : function(){
        		if(this.isResizing) return;
        		this.isResizing=true;
        	    
        	    try{
               		this.tbodyTable.find("colgroup").remove();   	    		
    	    		var tbodyColGroup = this.theadColGroup.clone();
    	    		this.tbodyTable.prepend(tbodyColGroup);
    	    		
    	    		
    	    		if(this.cellFixMode == true){
    	    			this.tbodyTableFix.find("colgroup").remove();
    	    			var tbodyFixColGroup = $("colgroup", this.theadTableFix);
    	    			this.tbodyTableFix.prepend(tbodyFixColGroup.clone());
    	    		}
    	      		if($.browser.msie && ($.browser.version=="7.0" || $.browser.version=="6.0")){
    	    			var cols = $("col", tbodyColGroup);
    	    			
    	    			if( this.colPadding == null){
    	    				var firstCol = $("tbody > tr:first > td:first", this.tbodyTable);
    	    				
    	    				//최초 리사이즈 할 때는 firstCol size가 0
    	    				if(firstCol.size() != 0){
    	    					if( firstCol.innerWidth() == firstCol.width()){ //패딩이 0일 경우
        	    					_this.colPadding = 0; 
        	    				}else{ //패딩이 있을 경우
        	    					_this.colPadding = firstCol.innerWidth() - firstCol.width(); 
        	    				}
    	    				}
    	    			}
    	    			
    	    			// 패딩값 계산 
        	    		for(var i =0, ic = cols.size(); i < ic; i++ ){
        	    			var targetCols = cols.eq(i);
        	    			var colWidth = targetCols.attr("width");
        	    			
        	    			if(colWidth!="" && colWidth.indexOf('%') == -1 && this.colPadding!==null){
								targetCols.attr("width", colWidth - this.colPadding);
        	    			}
        	    		}
    	    			
        	    		if(this.cellFixMode == true){
	        	    		this.tbodyTableFix.find("colgroup").remove();
	        	    		var tbodyFixColGroup = $("colgroup", this.theadTableFix.clone());
	        	    		this.tbodyTableFix.prepend(tbodyFixColGroup);
	        	    		
	        	    		var colsFix = $("col", tbodyFixColGroup);
	        	    		var firstRowColGroupFix = $("tbody > tr:first > td", this.tbodyTableFix);
	        	    		var colspanCellGroupFix = $("thead > tr:first > th[colspan]", this.theadTableFix);

	        	    		// 셀고정 패딩값 계산	        	    		
	        	    		for(var i = 0, ic = colsFix.size(); i < ic; i++ ){
	        	    			var colPaddingFix = firstRowColGroupFix.eq(i).innerWidth() - firstRowColGroupFix.eq(i).width();
	        	    			if(colsFix.eq(i).attr("width").indexOf('%') == -1){
	        	    				colsFix.eq(i).attr("width", colsFix.eq(i).attr("width") - colPaddingFix);
	        	    			}
	        	    		}
	        	    		// colspan 대상 셀들이 +1 되는 현상 수정
	        	    		var colspanCellGroupFix = $("thead > tr:first > th:visible", this.theadTable);

	        	    		for(var i=0, ic = colspanCellGroupFix.size(); i < ic; i++) {
	        	    			if(colspanCellGroupFix.eq(i).attr("colSpan") > 1){
		        	    			if(cols.eq(i).attr("width").indexOf('%') == -1){
		        	    				for(var j=i+1; j<i+colspanCellGroupFix.eq(i).attr("colSpan"); j++){
		        	    					cols.eq(j).attr("width",cols.eq(j).attr("width")-1);
		        	    				}
		        	    			}
	        	    			}
	        	    		}
	        	    	
        	    		}else{
        	    			var colspanCellGroup = $("thead > tr:first > th:visible", this.theadTable);
        		    		// colspan 대상 셀들이 +1 되는 현상 수정
            	    		for(var i=0, ic = colspanCellGroup.size(); i < ic; i++) {
            	    			if(colspanCellGroup.eq(i).attr("colspan") > 1){
            	    				for(var j=colspanCellGroup.eq(i).attr("x"), jc = colspanCellGroup.eq(i).attr("x")*1 + (colspanCellGroup.eq(i).attr("colspan")*1); j < jc; j++){
            	    					if(j != colspanCellGroup.eq(i).attr("x"))
            	    						if(cols.eq(i).attr("width").indexOf('%') == -1){
            	    							cols.eq(j).attr("width",cols.eq(j).attr("width")-1);
            	    						}
            	    				}
            	    			}
            	    		}
        	    		}
    	      		}
    	    		if(_this.isRelativeWidth){
    	    			var w = this.tableContainer.get(0).clientWidth - this.scrollBarWidth;
    	    			this.tbodyTable.width(w);
    	    			this.theadTable.width(w);
    	    			this.containerDiv.width(config.width);
            			this.tableBodyDiv.trigger('scroll');
    	    		}else{
    	    			var w = this.theadTable.width() - this.tableContainerFixWidth;
    	    			this.theadTable.width(w);
        	    		this.tbodyTable.width(w);
        	    		
        	    		if(this.cellFixMode == true){
        	    			this.tableContainerFix.width(this.tableContainerFixWidth);
        	    			this.theadTableFix.width(this.tableContainerFixWidth);
        	    			this.tbodyTableFix.width(this.tableContainerFixWidth);
        	    		}
        	    		
        	    		this.containerDiv.width(this.containerDiv.get(0).clientWidth);
    	    		}
    	    	}catch(e){
    	    		log(e.message, 'resizing' );
    	    	}
    	    	this.isResizing = false;
        	},
            
    		_ajax : function(param){
    			
    			_this.loadingDiv.show();
    			
    			var ajaxOptions = new Object();
    			
    			if (param){$.extend(ajaxOptions, param);}
    			
    			//사용자가 지정한 callback함수를 저장한다. 내부 callback 함수를 수행후 사용자의 callback 함수를 호출 
    			ajaxOptions['success']   = param.success; 
    			ajaxOptions['error']     = param.error; 
    			ajaxOptions['complete']  = param.complete;
    			
    			//callback 함수를 내부 callback 함수로 변경
    			//param['success']   = _this._onSuccess;
    			param['success']   = function(data,textStatus,jqXHR){  _this._onSuccess (data,textStatus,jqXHR,ajaxOptions);  };
    			param['error']     = function(jqXHR,textStatus,errorThrown){  _this._onError   (jqXHR,textStatus,errorThrown,ajaxOptions);  };
    			param['complete']  = function(jqXHR,textStatus){  _this._onComplete(jqXHR,textStatus,ajaxOptions);  };
    			
    			$.ajax(param);
    			
    		},
    		
    		_treeMode : function(tableRows){
    			var parent 	= config.tree.parent;
    			var self 	= config.tree.self;
    			
    			var parentIndex = $("col",_this.tbodyColGroup).index($("col[id=\"col_"+parent+"\"]",_this.tbodyColGroup));
    			var selfIndex 	= $("col",_this.tbodyColGroup).index($("col[id=\"col_"+self+"\"]",_this.tbodyColGroup));
    			
    			var rootMap     = new Object();
    			var rootKeyList = new Array();
    			var firstStep	= new Object();
    			
    			for ( var i = 0, ic = tableRows.length; i < ic ; i++ ){
    				var tr = tableRows[i];
    				var td = tr.cells;
    				
    				var targetTD = td[0];
    				var parentValue = $(td[parentIndex]).text();
    				var selfValue 	= $(td[selfIndex]).text();
    				
    				tr.childArray = new Array();
					tr.parentCode = parentValue;
					tr.selfCode   = selfValue;
					
					rootMap[selfValue] = tr;
					rootKeyList.push(selfValue);
					
					var array = firstStep[parentValue];
					if(array === undefined){
						array = new Array();
					}
					array.push(selfValue);
					firstStep[parentValue] = array;
    			}
    			
    			var secondMap = new Object();
    			var exceptMap = new Object();
    			for ( var i = 0, ic = rootKeyList.length; i < ic ; i++ ){
    				var isPass = false;
    				var key = rootKeyList[i];
    				
    				var row = rootMap[key];
    				var selfCode 	= row.selfCode;
    				var parentCode 	= row.parentCode;
    				
    				if( exceptMap[selfCode] !== undefined ){
    					isPass = true;
    				}
    				
    				for ( var j = 0, jc = ic; j < jc; j++ ){
    					var childKey = rootKeyList[j];
    					var childRow = rootMap[childKey];	
    					var childSelfCode 	= childRow.selfCode;
    					var childParentCode = childRow.parentCode;
    					
    					if(selfCode == childSelfCode){
    						continue;
    					}else if(selfCode  == childParentCode){
    						var targetRow = secondMap[childSelfCode];
    						if( targetRow !== undefined ){
    							//log("부모인 "+childSelfCode+ "가 맵에 존재 하고 있으므로 " + childKey+ "제거후 "+ selfCode+"의 자식으로 "+ childSelfCode+"합류");
    							row.childArray.push(targetRow);
    							delete secondMap[childSelfCode];
    						}else{
    							//log("secondMap에 존재 하지 않음 " +selfCode+"의 자식으로 "+ childSelfCode+"합류");
    							row.childArray.push(childRow);
    							exceptMap[childSelfCode] = childSelfCode;
    						}
    					}
    				}
    				
    				if(!isPass){
    					var parentRow = secondMap[parentCode];
    					if( parentRow !== undefined ){
    						parentRow.childArray.push(row);
    						secondMap[parentCode] 	= parentRow;
    						//log(selfCode+"의 부모는 "+ parentCode +" 이므로 합류");
    					}else{
    						secondMap[selfCode]		= row;
    						//log("부모가 없으므로  "+selfCode +" secondMap 에 합류");
    					}
    				}
    			}
    			
    			
    			
    			
    			
    			
    			
    			
    			
    			
    			
    			
    			
    			
    			
    			
    			
    			
    			
    			
    			
    			
    			
    			
    			var $attachEventTree = function(tr,depth){
    				var childCount = tr.childArray.length;
    				tr.depth = depth;
					for( var i = 0 ; i < childCount; i++ ){
						$attachEventTree(tr.childArray[i],depth+1);
					}
    				
    				var span = $('<span class="treeIcon tree_depth_'+depth+'" style="display:inline-block;width:18px;height:100%;" >&nbsp;</span>');
    				span.css("margin-left",(depth-1)*18);
    				if(childCount > 0){
    					span.addClass("collapse");
    				}else{
    					span.addClass("noChild");
    				}
    				
    				$("td",$(tr)).eq(0).prepend(span);
    			};
    			
    			
    			//함수 재정의...
    			//_this._updateRowArray = function(){ };
    			
    			
    			_this.expand = function(tr){
					var child = tr.childArray;
					for( var i = (child.length-1), ic = child.length; i >= 0; i-- ){
						var childRow = child[i];
						childRow.parentRowUUID = _this.uuid(tr);
						log(childRow.parentRowUUID)
						var uuid 	= _this.uuid(childRow);
						$(childRow).insertAfter(tr);
        			}
    			};
    			
    			_this.collapse = function(tr){
					var childCount = tr.childArray.length;
					var child = tr.childArray;
					for(var i = 0; i < childCount; i ++){
						_this.collapse(child[i]);
						$(child[i]).remove();
						$("TD SPAN[class*=\"expand\"]",child[i]).removeClass("expand").addClass("collapse");
					}
    			};
    			
    			//함수 재정의
    			_this.appendDefaultRow = function(defaultJSON,parentInfo){
        			var newTR = _this.trReference.eq(0).clone();
        			if(defaultJSON){
        				var td = $("td",newTR);
        				for(var i in defaultJSON){
        					td.eq(i).text(defaultJSON[i]);
        				}
        			}
        			_this.appendRow(newTR,parentInfo);
        		},
    			
    			_this.appendRow = function(rows,parentInfo){
    				$(rows).each(function(){
    					
    					var newRow = this;
    					newRow.setAttribute("data-execute","append");
    					newRow.childArray = new Array();
    					newRow.selfCode   = $("td",$(newRow)).eq(selfIndex).text();
    					
    					
    					if(parentInfo === undefined||parentInfo.size()==0){
    						newRow.depth		= 1;
    						newRow.parentCode 	= $("td",newRow).eq(parentIndex).text();
    						$("td",newRow).eq(parentIndex).text(newRow.parentCode);
    						$attachEventTree(newRow,newRow.depth);
    						_this.rowArray[0].unshift(newRow);
    						$("tbody",_this.tbodyTable).eq(0).append(newRow);
    						
    					}else{
    						var parentTR 		= parentInfo.get(0);
    						newRow.depth 		= parentTR.depth+1;
    						newRow.parentCode 	= $("td",parentInfo).eq(selfIndex).text().trim();
    						$("td",$(newRow)).eq(parentIndex).text(newRow.parentCode);
    						
    						$attachEventTree(newRow,newRow.depth);
    						parentTR.childArray.push(newRow);
    						
    						$("td span.treeIcon",parentInfo).removeClass("noChild").removeClass("collapse").addClass("expand");
    	    				_this.expand(parentTR);
    					}
    					
    					_this.editedRowArray["append"][_this.uuid(newRow)] = newRow;
        			});
    			};
    			
    			_this.removeRow = function(row){
        			$(row).each(function(){
        				var targetRow    	= this;
        			
        				var uuid = _this.uuid(targetRow);
        				if(targetRow.getAttribute("data-execute")!="append"){
    						_this.editedRowArray["remove"][uuid]=(this);
    						delete _this.editedRowArray["update"][uuid];
    					}else{
    						delete _this.editedRowArray["append"][uuid];
    					}
        				
        				var childCount = targetRow.childArray.length;
    					var child = targetRow.childArray;
    					for(var i = 0; i < childCount; i ++){
    						_this.removeRow(child[i]);
    						$(child[i]).remove();
    					}
    					
						var parentRowUUID = targetRow.parentRowUUID;
    					//uuid가 없다면.. expand 된적이 없는 자식이거나 루트 노드일경우
    					if(parentRowUUID !== undefined){
    						var parentRow = $("tr[data-uuid=\""+parentRowUUID+"\"]",_this.tbodyTable).get(0); 
        					var childArray = parentRow.childArray;
        					for( var i = 0, ic = childArray.length; i < ic ; i++ ){
        						log(_this.uuid(childArray[i]) + ' : '+uuid);
        						
        						if(_this.uuid(childArray[i])==uuid){
        							childArray.splice(i,1);
        						}
        					}
        					
        					$(this).remove();
    					}
    					
    					
    					
    					
        			});
    				
        		};
    			
    			
    			//트리아이콘 클릭시 이벤트 추가
    			_this.tbodyTable.delegate("tbody tr td span.treeIcon","click",function(event){
					event.stopPropagation();
					event.preventDefault();
					
					var self = $(this);
					var trNode   = this.parentNode.parentNode;
					if(self.hasClass("expand")){
						self.removeClass("expand").addClass("collapse");
						_this.collapse(trNode);
					}else if(self.hasClass("collapse")){
						self.removeClass("collapse").addClass("expand");
						_this.expand(trNode);
					}
        		});
    			
    			
    			
    			var treeArray = new Array();
    			for( var i in secondMap){
    				var depth1 = secondMap[i];
    				$attachEventTree(depth1,1);
    				treeArray.push(depth1);
    			}
    			
    			_this.treeInitialized = true;
    			
    			_this._onSuccess(treeArray,'',treeArray.length);
    			
    			
    		},
    		
    		_onSuccess : function(data,textStatus,jqXHR,ajaxOptions){
				var tableRows 			= null;
				var tbodyNodeList 		= null;
    			var tbodyNodeListLength = 0;
        		if(typeof data == "string"){	//ajax 호출후 콜백으로 받은경우
        			var tempNode  		= document.createElement('div');
        			tempNode.innerHTML 	= "<table>" + data + "</table>";
        			tbodyNodeList 		= tempNode.getElementsByTagName("TBODY");
        			tbodyNodeListLength = tbodyNodeList.length;
        			tableRows = tempNode.firstChild.rows;
        		}else{	//소팅후에는 Object Array가 나옴
        			tableRows = data;
        		}
        		
        		//트리모드라면 초기화
        		if(config.tree!== undefined && !_this.treeInitialized){
    				return _this._treeMode(tableRows);
    			}
        		
    			_this.totalCount  = tableRows.length;
    			
    			
    			
    			
    			
    			if(tbodyNodeListLength > 1){ //서버측에서 tbody로 나누어서 내려줄 경우
    				for(var i =0, ic = tbodyNodeListLength ; i < i ; i++ ){
    					_this.rowArray[i] = _this.convertToArray(tbodyNodeList[i].childNodes,0);
    				}
    				_this.rowArray.length = tbodyNodeListLength;
    			}else{	//일반적인 경우
        			//Object nodeList를 Array로 변환
    				var newArr = _this.convertToArray( tableRows, 0 );
    				
    				//서버의 쿼리 페이징이 아니고 내부페이징인경우
    				if(config.paging.query === undefined && config.paging.rows !== undefined){
    					var rowsPerPage = parseInt(config.paging.rows);
            			var tbodyGroupCount = parseInt( _this.totalCount / rowsPerPage ); 
            			for( var i = 0; i < tbodyGroupCount; i++ ){
            				var start 	= i * rowsPerPage;
            				var end 	= ( i+1 ) * rowsPerPage;
            				_this.rowArray[i] = newArr.slice( start, end );
            			}
            			
            			_this.rowArray.length = tbodyGroupCount;
            			
            			//나머지 row 처리
            			if(_this.totalCount % rowsPerPage != 0){
            				_this.rowArray[tbodyGroupCount] = newArr.slice(tbodyGroupCount*rowsPerPage,_this.totalCount);
            				_this.rowArray.length = tbodyGroupCount + 1;
            			}
    				}else{//서버의 쿼리 페이징이거나 페이징이 없는 경우
    					_this.rowArray[0] = newArr;
    					_this.rowArray.length = 1;
    				}
    			}
    			
    			if(config.paging.rows !== undefined){ //페이징 할 때...
    				var totalCount = typeof jqXHR=='object' ? jqXHR.getResponseHeader("gridTotalCount") : jqXHR;
    				_this._pagingMode(data,totalCount);
    			}else{  //페이징 안 할 때..
    				if(_this.cellFixMode){
    					var clonedData = $("<tbody>").append(data).clone().children();
      					_this.tbodyFix.html(clonedData);
        			}
    				
    				var tbody = $("tbody",_this.tbodyTable);
    				_this.tbody.html(data);
    			}

    			//총건수 출력.
    			if(config.gridInfo == true){
    				$('#gridInfo_'+_this.id+'_count').text(_this.getRowCount());
    			}
    			
    			_this.tableBodyDiv.scrollTop(0);
    			
    			_this.resizing();
    			
    			if(ajaxOptions!==undefined && ajaxOptions['success']){
    				ajaxOptions['success'](data,textStatus,jqXHR);
    			}
    		},
    		_onError : function(jqXHR,textStatus,errorThrown,ajaxOptions){
    			//공통 작업이 있다면 추가
    			log(jqXHR,"ERROR_AJAX_OnError");
    			
    			if(ajaxOptions!==undefined && ajaxOptions['error']){
    				ajaxOptions['error'](jqXHR,textStatus,errorThrown);
    			}
    		},
    		_onComplete : function(jqXHR,textStatus,ajaxOptions){
    			
    			//공통 작업이 있다면 추가
    			_this.loadingDiv.hide();
    			if(ajaxOptions!==undefined && ajaxOptions['complete']){
    				ajaxOptions['complete'](jqXHR,textStatus);
    			}
    		},
    		
    		updateBody : function(formObj,settings){
            	//리셋작업(updateBody가 호출된후는 전역으로 사용한 변수들을 초기화)
        		_this.rowArray = {};
        		_this.rowArray.length = 0;
        		
        		_this.editedRowArray = {};
        		_this.editedRowArray["append"]= [];
        		_this.editedRowArray["update"]= [];
        		_this.editedRowArray["remove"]= [];
        		
        		_this.currentRowArrayIndex = 0;
        		
        		_this.treeInitialized = false;
            	
            	_this.lastAjaxForm = formObj.clone();

            	//셀렉트 박스는 선택된 값이 복사가 안되어 선택된 값을 다시 넣어줌.
            	var origSels = $('select', formObj);
            	var clonedSels = $('select', _this.lastAjaxForm);
            	origSels.each(function(i) {
            		clonedSels.eq(i).val($(this).val());
            	});
            	
            	if(config.server === undefined){
            		var param ={
             			url:_this.lastAjaxForm.attr("action"),
             			type:_this.lastAjaxForm.attr("method"),
             			data:_this.lastAjaxForm.serialize()+_this.getQueryPagingInfo(config.paging.page)
             		};
                	if (settings){$.extend(param, settings);}
                	this._ajax(param);
            	}else{
            		_this.sendServer(_this.lastAjaxForm,settings);
            	}
            	return false;
            },
    		
    		appendDefaultRow : function(defaultJSON){
    			var newTR = _this.trReference.eq(0).clone();
    			if(defaultJSON){
    				var td = $("td",newTR);
    				for(var i in defaultJSON){
    					td.eq(i).text(defaultJSON[i]);
    				}
    			}
    			_this.appendRow(newTR);
    		},
    		
    		appendRow : function(rows){
    			//새로운 로우가 추가된다면 기존에 선택되었던 로우를 전부 unselect 한다.
    			_this.unSelectRows();
    			
    			$(rows).each(function(){
    				var tr = $(this);
    				tr.attr("data-execute","append");
    				_this.editedRowArray["append"][_this.uuid(tr)]=(this);
    				_this.rowArray[0].unshift(this);
    			});
    			_this.reload();
    		},
    		
    		removeRow : function(row){
    			$(row).each(function(){
    				var tr    	= this;
    				
    				var uuid 	= _this.uuid(tr);
    				if(tr.getAttribute("data-execute")!="append"){
						_this.editedRowArray["remove"][uuid]=(this);
						delete _this.editedRowArray["update"][uuid];
					}else{
						delete _this.editedRowArray["append"][uuid];
					}
    				
    				var tbody 	= $(tr.parentNode);
    				var tbodySeq = tbody.attr("id").substring(6);//"tbody_"를 제거
    				var targetRowArray = _this.rowArray[tbodySeq];
    				for( var i = 0, ic = targetRowArray.length; i < ic ; i ++ ){
    					if(targetRowArray[i].getAttribute("data-uuid") == uuid){
    						targetRowArray.splice(i,1);
    						$(this).remove();
    						break;
    					}
    				}
    			});
				_this.reload();
    		},
    		
    		removeAll : function(){
    			$("tbody",this.tbodyTable).html("");
    		},
    		
    		reload: function(){
    			var newArr = new Array();
    			for( var i = 0, ic = _this.rowArray.length; i < ic; i++ ){
    				newArr = newArr.concat(_this.rowArray[i]);
    			}
    			
    			_this._onSuccess(newArr,'',newArr.length);//jqXHR 객체가 없다...
    		},
    		
    		_isJQueryObject :function(obj){
    			if(obj.val !== undefined){
    				return true;
    			}else{
    				return false;
    			}
    		},
    		
    		//childObject를 가지는 ROW를 찾아내어 반환한다.
    		getRowFromChild : function (childObject){
    			if(_this._isJQueryObject(childObject)){
    				childObject = childObject.get(0);
    			}
    			var parent = childObject;
    			while(parent.nodeName != "TR"){
					if(parent.nodeName == "TABLE") break;
					parent = parent.parentNode;
				}
    			return $(parent);
    		},
    		
    		//추가되거나[append], 수정되거나[update], 삭제된[remove] row들을 반환한다.
    		getRowsByCmd : function(cmd){
    			var array = new Array();
    			for (var i in _this.editedRowArray[cmd]){
    				array.push(_this.editedRowArray[cmd][i]);
    			}
    			return $(array);
    		},
    		
    		//row 로부터 td의 값을 연관배열의 형태로 얻는다 설정되는 값은 col 태그의 id (ex: <col id="col_name" />으로 설정시 ['name']으로 값 참조 )
    		getRowDataArray : function(row){
    			var dataArray = new Array();
				$("td",row).each(function( i ){
					var key = _this.theadCols.eq(i).attr("id");
					key = (key != null) ? key.substring(key.indexOf("_")+1) : i;
    				if($(this).find("input").val() != null){
						dataArray[key] = $(this).find("input").val();
					}else{
						dataArray[key] = $(this).text();
					}
    				//변경전 값
    				dataArray["pre_"+key] = $(this).attr("data-preValue");
    			});
    			return dataArray;
    		},
    		
    		//현재 선택된 행을 반환
    		getSelectedRow : function(){
    			return $("tbody > tr."+config.selectClassName, this.tbodyTable);
			},
    		
    		//현재 선택된 행을 반환(multi)
			getSelectedMultiRow : function(){
    			return $("tbody > tr."+config.selectClassName, this.tbodyTable);
    		},
    		
    		//현재 선택된 행의 데이터 반환(연관 배열 형태)
    		getSelectedRowData : function(){
    			if(_this.lastSelectedTRIndex == null){
    				return null;
    			}
    			return _this.getRowDataArray($("tbody > tr", this.tbodyTable).eq(_this.lastSelectedTRIndex));
    		},
    		
    		//그리드 상에 모든 row반환
    		getAllRow : function(){
    			return $("tbody > tr", this.tbodyTable);
    		},
    		
    		//현재 선택된 행의 데이터 반환(multi)
    		
    		getSelectedMultiRowData : function(){
    			var selectedArray = new Array();

    			$("tbody > tr.selectedTR", this.tbodyTable).each(function() {
    				selectedArray.push( _this.getRowDataArray($(this)) );
    			});
    			
    			return selectedArray;
    		},
    		
    		//그리드 상에 모든 row들의 dataArray를 반환
    		getAllRowData : function(){
    			var rowArray = new Array();
    			$("tbody > tr", this.tbodyTable).each(function() {
    				rowArray.push( _this.getRowDataArray($(this)) );
    			});
    			return rowArray;
    		},
    		
    		//선택된 row들을 해제
    		unSelectRows : function(){
    			for( var i in _this.selectedRowArray ){
    				var info = _this.selectedRowArray[i];
    				var targetRows = _this.rowArray[info.tbodySeq];
    				
    				for ( var i = 0, ic = targetRows.length; i < ic ; i++ ){
    					var uuid = _this.uuid(info.row);
    					if(targetRows[i].getAttribute("data-uuid") == uuid){
    						$("TABLE TBODY#"+info.tbodyId+" tr[data-uuid=\""+uuid+"\"]",_this.containerDiv).removeClass(config.selectClassName);
    						targetRows[i] = $(targetRows[i]).removeClass(config.selectClassName).clone().get(0);
    						_this._syncWithFix("removeSelectedTR",{info:info});
    						break;
    					}
    				}
    			}
    			
				_this.selectedRowArray = new Object();
    		},
    		
    		//그리드상의 모든 row의 갯수를 반환
    		getRowCount : function(){
    			if(config.paging.rows !== undefined){
    				return this.totalCount;
    			}else{
    				return $("tbody > tr", this.tbodyTable).size();
    			}
    		},
    		
    		//그리드상에 체크박스가 있을경우 체크박스 index의 true, false에 따라 해당되는 데이터 반환
    		getGridData : function(chkOption, chkIdx){
    			var dataArray = new Array();
    			
    			$("tbody > tr", this.tbodyTable).each(function(){
    				var data = "";
    				if(chkOption == 'checked'){
						if($("td > input", $(this)).eq(chkIdx).is(':checked') == true){
		    				$("td", $(this)).each(function(){
		    					if($(this).find("input").val() != null){
		    						data += $(this).find("input").val()+"|";
		    					}else{
		    						data += $(this).text() + "|";
		    					}
		    				 });
		    				dataArray.push(data.substring(0, data.length-1));
						}
    				}else{
    					$("td", $(this)).each(function(){
	    					if($(this).find("input").val() != null){
	    						data += $(this).find("input").val()+"|";
	    					}else{
	    						data += $(this).text() + "|";
	    					}
	    				 });
	    				dataArray.push(data.substring(0, data.length-1));
    				}
    			 });
    				 
    		    return dataArray;
    		},
    		
    		upExcel : function(excelHeaderDesc, excelHeader, command, sampleFile){
    			if(sampleFile == null) { sampleFile = "";}
    			var param ="left="+(screen.availWidth-800)/2+",top="+(screen.availHeight-350)/2+", width=800,height=420," +
    					"toolbar=no,location=no,status=no,menubar=no,resizable=no,scrollbars=no";
    			var url = "/common/component/grid/grid.jspx?cmd=viewExcelUpload&excelHeader="+excelHeader+"&excelHeaderDesc="+excelHeaderDesc+"&command="+command+"&sampleFile="+sampleFile;
    			
    			
    			window.open(encodeURI(getAdjustUrl(url)),'upExcel',param);
    			//window.open(encodeURI(url),'upExcel',param);
    		},
    		downExcel : function(fileName, bldPath, excelHeader, excelHeaderDesc, cellConvert){
    			if(_this.lastAjaxForm == undefined ){
    				alert("데이터 조회 후 엑셀다운로드가 가능합니다.");
    				return;
    			}
    			
    			var data = _this.lastAjaxForm.serialize();
    			if(excelHeader === undefined){ excelHeader = ""; } ;
    			if(excelHeaderDesc === undefined){ excelHeaderDesc = "";} ;
    			if(cellConvert === undefined){ cellConvert = "";} ;
    			
    			var thGroup = $("TH",_this.thead);
    			
    			if(excelHeader === "" &&  excelHeaderDesc === ""){
	    			for(var i=0, ic=_this.theadCols.length; i<ic; i++){
	    				
	    				if(!_this.theadCols.eq(i).hasClass("noExcel")){
	    					var colId = _this.theadCols.eq(i).attr("id");
		    				colId = colId.substring(4,colId.length);   //col_잘라준다.
		    				
		    				if(colId != ""){
		    					excelHeader += colId + "|";
								excelHeaderDesc += thGroup.eq(i).text() + "|";
		    				}	
						}
	    			}
	    			excelHeader = excelHeader.substring(0,excelHeader.length-1);
	    			excelHeaderDesc = excelHeaderDesc.substring(0,excelHeaderDesc.length-1);
    			}
    			
    			var param ="left="+(screen.availWidth-800)/2+",top="+(screen.availHeight-350)/2+", width=500,height=420," +
				"toolbar=no,location=no,status=no,menubar=no,resizable=yes,scrollbars=yes";
    			var url = "/common/component/grid/gridToexcel.jsp";
    			
    			var frm = '<form id="excelDownFrm" name="excelDownFrm" method="post" target="downExcel" action="'+url+'" >'
    			        + '<input type="hidden" name="excelHeaderDesc" value="'+excelHeaderDesc+'" />'
    					+ '<input type="hidden" name="excelHeader" value="'+excelHeader+'" />'
    					+ '<input type="hidden" name="cellConvert" value="'+cellConvert+'" />'
    					+ '<input type="hidden" name="searchData" value="'+data+'" />'
    					+ '<input type="hidden" name="bldPath" value="'+bldPath+'" />'
    					+ '<input type="hidden" name="fileName" value="'+fileName+'.xls" />'
    					+ '</form>';
    			
    			frm = $(frm);
    			
    			$("body").append(frm);
    			openPopWithForm(frm.get(0), url , 500, 420 , 'downExcel', 'yes', 'yes');
    		},
            
    		sendServer :function(form,ajaxOptions){
    			var serverConfig = config.server;
    			if(serverConfig===undefined){
    				alert("serverConfig 가 정의되지 않았습니다.\n  ex : {bld:'samples/database/listCities'}" );
    				return;
    			}
    			
    			var bld = serverConfig.bld;
    			if(bld === undefined){
    				alert("호출될 bld가 정의되지 않았습니다.\n  ex : 'server' : {bld:'samples/database/listCities'}");
    				return;
    			}
    			
    			form.attr("action",config.gridPath+"/grid.jspx?cmd=getGridData");
    			form.append("<input type='text' name='bldPath' value='"+bld+"' />");
    			
    			if(serverConfig.param !== undefined){
    				var args = serverConfig.param; 
    				if(args.indexOf("&")==0){
    					args = args.substring(1);
    				}
    				var argArr = args.split("&");
    				for (i = 0; i < argArr.length; i++) {
    					var splitVal = argArr[i].split("=");
    					if (splitVal.length < 2 && splitVal[0] == "") {
    						alert("인자의 형태가 유효하지 않습니다.\n ex : empno=OS380&name=neoxeni ");
    						return;
    					}
    					form.append("<input type='hidden' name='"+splitVal[0]+"' value='"+splitVal[1]+"' />");
    				}
    			}
    			
    			
    			if(serverConfig.sort  !== undefined){
    				form.append("<input type='text' name='sortTarget' value='"+serverConfig.sort+"' />");
    			}else{
    				form.append("<input type='text' name='sortTarget' value='' />");
    			}
    			form.append("<input type='text' name='sortOrder'   value='asc' />");
    			form.append("<input type='text' name='sortType'    value='stringType' />");
    			
    			
    			
    			if(serverConfig.view !== undefined){
    				form.append("<input type='text' name='view' value='"+serverConfig.view+"' />");
    			}
    			
    			if(config.paging.rows !== undefined){
    				form.append("<input type='text' name='rowsPerPage' value='"+config.paging.rows+"' />");
    			}
    			
    			if(config.paging.type !== undefined){
    				form.append("<input type='text' name='pagingType' value='"+config.paging.rows+"' />");
    			}
    			
    			if(config.paging.page !== undefined){
    				form.append("<input type='text' name='gridCurrentPage' value='"+config.paging.page+"' />");
    			}
    			
    			var _gridDataInfo = new Array();
    			
    			this.theadCols.each(function(){
    				
    				var colId = $(this).attr("id");
    				
    				if(colId.indexOf("col_") == 0){
    					colId = colId.substring(4);
    				}
    				
    				_gridDataInfo.push(colId);
    			});
    			
    				
    			form.append("<input type='text' name='gridDataInfo' value='"+_gridDataInfo.join(",")+"' />");
    			
    			var param = {
    				url:form.attr("action"),
    		 		type:form.attr("method"),
    		 		data:form.serialize()+_this.getQueryPagingInfo(config.paging.page)
    			};
    			
    			if (ajaxOptions){$.extend(param, ajaxOptions);}
    			_this._ajax(param);
    		},
    		
    		getQueryPagingInfo : function(currentPage){
    			if(!currentPage){
    				currentPage = 1;
    			}
    			
    			var rowsPerPage = config.paging.rows;
    			var startIndex  = (parseInt(currentPage)-1)*parseInt(rowsPerPage);
    			var endIndex    = parseInt(currentPage)*parseInt(rowsPerPage);
    			var info = "&gridRowsPerPage="+rowsPerPage+"&gridCurrentPage="+currentPage;
    			info    += "&gridStartIndex="+startIndex+" &gridEndIndex="+endIndex;
    			return info;
    		},
    		
    		
    		toggleAllCheckBox : function(ele){
				var checkedBox = $("input[type=\"checkbox\"][class=\"gridCheck\"]",_this.tbodyTable);
				if(ele.checked){
					checkedBox.each(function(){
						$(this).attr("checked",true);
					});
				}else{
					checkedBox.each(function(){
						$(this).attr("checked",false);
					});
				}
    		},
    		
    		convertToArray : function(obj,n){
    			
    			if(obj instanceof Array){
    				return obj;
    			}
    			
    			if (! obj.length) {return [];} // length must be set on the object, or it is not iterable  
    			   var a = [];  
    			  
    			   try {  
    			       a = Array.prototype.slice.call(obj, n);  
    			   }  
    			   // IE 6 and posssibly other browsers will throw an exception, so catch it and use brute force  
    			   catch(e) {  
    				   for ( var i =0,ic = obj.length; i<ic; i++ ){ 
    			           a.push(obj[i]); 
    			       } 
    			   }  
    			  
    			   return a;  
    		},
    		
    		uuid : function(obj) {
    			obj = $(obj);
    			
    			if(obj.attr("data-uuid") !== undefined ){
    				return obj.attr("data-uuid");
    			}else{
    				var d = new Date().getTime();
        		    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        		        var r = (d + Math.random()*16)%16 | 0;
        		        d = d/16 | 0;
        		        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
        		    });
        		    obj.attr("data-uuid",uuid);
        		    return uuid;
    			}
    		}

        };
        
        var _this = grid;
        
        return grid.initialize(selector);
    };
})(jQuery);




function duffFasterLoop8(iterations,func) {

	// Original JS Implementation by Jeff Greenberg 2/2001
	// http://home.earthlink.net/~kendrasg/info/js_opt/
	// (fast duff's device) from an anonymous donor to Jeff Greenberg's site
	// (faster duff's defice) by Andrew King 8/2002 for WebSiteOptimization.com
	// bug fix (for iterations<8) by Andrew B. King April 12, 2003
	var pivot = 8;
	
	var startTime = new Date();
    var n = iterations % pivot;

    if (n>0) {
        do 
        {
        	func; 
        }
        while (--n); // n must be greater than 0 here
    }
    n = parseInt(iterations / pivot);
    if (n>0) { // if iterations < 8 an infinite loop, added for safety in second printing  
        do 
        {
        	func;
        	func;
        	func;
        	func;
        	func;
        	func;
        	func;
        	func;
        }
        while (--n); // n must be greater than 0 here also
    }
    
    var endTime = new Date();
    var gap = endTime-startTime;
    log("Total : "+ gap + "  Per Cycle : "+(gap/iterations));
}


//loops through an array in segments
var threadedLoop = function(array) {
	var self = this;

	//holds the threaded work
	var thread = {
		work: null,
		wait: null,
		index: 0,
		total: array.length,
		finished: false
	};

	//set the properties for the class
	this.collection = array;
	this.finish = function() { };
	this.action = function() { throw "You must provide the action to do for each element"; };
	this.interval = 1;

	//set this to public so it can be changed
	var chunk = parseInt(thread.total * .005);
	this.chunk = (chunk == NaN || chunk == 0) ? thread.total : chunk;

	//end the thread interval
	thread.clear = function() {
		window.clearInterval(thread.work);
		window.clearTimeout(thread.wait);
		thread.work = null;
		thread.wait = null;
	};

	//checks to run the finish method
	thread.end = function() {
		if (thread.finished) { return; }
		self.finish();
		thread.finished = true;
	};

	//set the function that handles the work
	thread.process = function() {
		if (thread.index >= thread.total) { return false; }

		//thread, do a chunk of the work
		if (thread.work) {
			var part = Math.min((thread.index + self.chunk), thread.total);
			while (thread.index++ < part) {
				self.action(self.collection[thread.index], thread.index, thread.total);
			}
		}
		else {

			//no thread, just finish the work
			while(thread.index++ < thread.total) {
				self.action(self.collection[thread.index], thread.index, thread.total);
			}
		}

		//check for the end of the thread
		if (thread.index >= thread.total) {
			thread.clear();
			thread.end();
		}

		//return the process took place
		return true;

	};

	//set the working process
	self.start = function() {
		thread.finished = false;
		thread.index = 0;
		thread.work = window.setInterval(thread.process, self.interval);
	};

	//stop threading and finish the work
	self.wait = function(timeout) {

		//create the waiting function
		var complete = function() {
			thread.clear();
			thread.process();
			thread.end();
		};

		//if there is no time, just run it now
		if (!timeout) {
			complete();
		}
		else {
			thread.wait = window.setTimeout(complete, timeout);
		}
	};

};

// Note: this class is not battle-tested, just personal testing on large arrays





/**
 *	str 길이가 length가 될때까지 0을 반복하여 붙인다. 
 *  @param  string  str         0을 추가할 문자열 	  
 *  @param  int     length 	    0을 추가할 str의 최대 길이 
 *  @param  int     gubun 	    0 : 앞에 반복하여 붙인다.  ,  1: 뒤에 반복하여 붙인다. 
 * */
function fillZero(str, length, gubun) {
	var zero = '';
	str = str.toString();

	if (str.length < length) {
		for (i = 0; i < length - str.length; i++){
			zero += '0';
		}
	}
	
	if(gubun==1){
		return str + zero;
	}else{
		return zero + str;
	}
}

function log (obj,tag){
	if(DEBUG_LOG){
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
		
		var d = new Date();
		var s = fillZero(d.getHours(), 2, 0) + ':' + fillZero(d.getMinutes(), 2, 0) + ':' + fillZero(d.getSeconds(), 2, 0);
		
		var filterLog = true;
		var consoleControlFilterVal = document.getElementById("consoleControlFilter").value;
		if(consoleControlFilterVal != "" && consoleControlFilterVal != tag){
			filterLog = false;
		}
		
		if(filterLog){
			if(typeof obj === 'object'){
				for(var i in obj){
					if(typeof obj[i] ==='object'){
						for(var j in obj[i]){
							$("#consoleLogArea").append(s +"<font color='red'>["+tag+"]</font> "+ i + "."  + j + " = " + obj[i][j]+"<br />");
						}
					}else{
						$("#consoleLogArea").append(s+" <font color='red'>["+tag+"]</font> "+ i + " = " + obj[i]+"<br />");
					}
				}
			}else{
				$("#consoleLogArea").append(s+" <font color='red'>["+tag+"]</font> " + obj+"<br />");
			}
			var scrollTop = $("#consoleLogArea").scrollTop(); 
			$("#consoleLogArea").scrollTop(scrollTop+1000);
		}
	}
}

//마우스 휠 이벤트
jQuery.fn.extend({
	mousewheel: function(up, down, preventDefault) {
		return this.hover(
			function() {
				jQuery.event.mousewheel.giveFocus(this, up, down, preventDefault);
			},
			function() {
				jQuery.event.mousewheel.removeFocus(this);
			}
		);
	},
	mousewheeldown: function(fn, preventDefault) {
		return this.mousewheel(function(){}, fn, preventDefault);
	},
	mousewheelup: function(fn, preventDefault) {
		return this.mousewheel(fn, function(){}, preventDefault);
	},
	/*
	unmousewheel: function() {
		return this.each(function() {
			jQuery(this).unmouseover().unmouseout();
			jQuery.event.mousewheel.removeFocus(this);
		});
	},
	*/
	unmousewheeldown: jQuery.fn.unmousewheel,
	unmousewheelup: jQuery.fn.unmousewheel
});


jQuery.event.mousewheel = {
	giveFocus: function(el, up, down, preventDefault) {
		//if (el._handleMousewheel) jQuery(el).unmousewheel();
		
		if (preventDefault == window.undefined && down && down.constructor != Function) {
			preventDefault = down;
			down = null;
		}
		
		el._handleMousewheel = function(event) {
			if (!event) event = window.event;
			if (preventDefault)
				if (event.preventDefault) event.preventDefault();
				else event.returnValue = false;
			var delta = 0;
			if (event.wheelDelta) {
				delta = event.wheelDelta/120;
				if (window.opera) delta = -delta;
			} else if (event.detail) {
				delta = -event.detail/3;
			}
			if (up && (delta > 0 || !down))
				up.apply(el, [event, delta]);
			else if (down && delta < 0)
				down.apply(el, [event, delta]);
		};
		
		if (window.addEventListener)
			window.addEventListener('DOMMouseScroll', el._handleMousewheel, false);
			
		window.onmousewheel = document.onmousewheel = el._handleMousewheel;
	},
	
	removeFocus: function(el) {
		if (!el._handleMousewheel) return;
		
		if (window.removeEventListener)
			window.removeEventListener('DOMMouseScroll', el._handleMousewheel, false);
		window.onmousewheel = document.onmousewheel = null;
		el._handleMousewheel = null;
	}
};

/**
 * remark : https://github.com/misteroneill/resize-stop
 */
(function ($, setTimeout) {
    var $window = $(window),
        cache = $([]),
        last = 0,
        timer = 0,
        size = {};
    function onWindowResize() {
        last = $.now();
        timer = timer || setTimeout(checkTime, 10);
    }
    function checkTime() {
        var now = $.now();
        if (now - last < $.resizestop.threshold) {
            timer = setTimeout(checkTime, 10);
        } else {
            clearTimeout(timer);
            timer = last = 0;
            size.width = $window.width();
            size.height = $window.height();
            cache.trigger('resizestop');
        }
    }
    $.resizestop = {
        propagate: false,
        threshold: 200
    };

    $.event.special.resizestop = {
        setup: function (data, namespaces) {
            cache = cache.not(this); // Prevent duplicates.
            cache = cache.add(this);
            if (cache.length === 1) {
                $window.bind('resize', onWindowResize);
            }
        },
        teardown: function (namespaces) {
            cache = cache.not(this);
            if (!cache.length) {
                $window.unbind('resize', onWindowResize);
            }
        },
        add: function (handle) {
            var oldHandler = handle.handler;
            handle.handler = function (e) {
                // Generally, we don't want this to propagate.
                if (!$.resizestop.propagate) {
                    e.stopPropagation();
                }
                e.data = e.data || {};
                e.data.size = e.data.size || {};
                $.extend(e.data.size, size);
                return oldHandler.apply(this, arguments);
            };
        }
    };
})(jQuery, setTimeout);

/*
 * jQuery history plugin
 *
 * Copyright (c) 2006 Taku Sano (Mikage Sawatari)
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Modified by Lincoln Cooper to add Safari support and only call the callback once during initialization
 * for msie when no initial hash supplied.
 * API rewrite by Lauris Buk?is-Haberkorns
 */

(function($) {

function History()
{
	this._curHash = '';
	this._callback = function(hash){};
};

$.extend(History.prototype, {

	init: function(callback) {
		this._callback = callback;
		this._curHash = location.hash;

		if($.browser.msie) {
			// To stop the callback firing twice during initilization if no hash present
			if (this._curHash == '') {
				this._curHash = '#';
			}

			// add hidden iframe for IE
			$("body").prepend('<iframe id="jQuery_history" style="display: none;"></iframe>');
			var iframe = $("#jQuery_history")[0].contentWindow.document;
			iframe.open();
			iframe.close();
			iframe.location.hash = this._curHash;
		}
		else if ($.browser.safari) {
			// etablish back/forward stacks
			this._historyBackStack = [];
			this._historyBackStack.length = history.length;
			this._historyForwardStack = [];
			this._isFirst = true;
			this._dontCheck = false;
		}
		this._callback(this._curHash.replace(/^#/, ''));
		this._historyCheckInterval = setInterval(this._check, 100);
	},
	
	remove : function(){
		clearInterval(this._historyCheckInterval);
	},

	add: function(hash) {
		// This makes the looping function do something
		this._historyBackStack.push(hash);
		
		this._historyForwardStack.length = 0; // clear forwardStack (true click occured)
		this._isFirst = true;
	},
	
	_check: function() {
		if($.browser.msie) {
			// On IE, check for location.hash of iframe
			var ihistory = $("#jQuery_history")[0];
			var iframe = ihistory.contentDocument || ihistory.contentWindow.document;
			var current_hash = iframe.location.hash;
			if(current_hash != $.history._curHash) {
			
				location.hash = current_hash;
				$.history._curHash = current_hash;
				$.history._callback(current_hash.replace(/^#/, ''));
				
			}
		} else if ($.browser.safari) {
			if (!$.history._dontCheck) {
				var historyDelta = history.length - $.history._historyBackStack.length;
				
				if (historyDelta) { // back or forward button has been pushed
					$.history._isFirst = false;
					if (historyDelta < 0) { // back button has been pushed
						// move items to forward stack
						for (var i = 0; i < Math.abs(historyDelta); i++) $.history._historyForwardStack.unshift($.history._historyBackStack.pop());
					} else { // forward button has been pushed
						// move items to back stack
						for (var i = 0; i < historyDelta; i++) $.history._historyBackStack.push($.history._historyForwardStack.shift());
					}
					var cachedHash = $.history._historyBackStack[$.history._historyBackStack.length - 1];
					if (cachedHash != undefined) {
						$.history._curHash = location.hash;
						$.history._callback(cachedHash);
					}
				} else if ($.history._historyBackStack[$.history._historyBackStack.length - 1] == undefined && !$.history._isFirst) {
					// back button has been pushed to beginning and URL already pointed to hash (e.g. a bookmark)
					// document.URL doesn't change in Safari
					if (document.URL.indexOf('#') >= 0) {
						$.history._callback(document.URL.split('#')[1]);
					} else {
						$.history._callback('');
					}
					$.history._isFirst = true;
				}
			}
		} else {
			// otherwise, check for location.hash
			var current_hash = location.hash;
			if(current_hash != $.history._curHash) {
				$.history._curHash = current_hash;
				$.history._callback(current_hash.replace(/^#/, ''));
			}
		}
	},

	load: function(hash) {
		var newhash;
		
		if ($.browser.safari) {
			newhash = hash;
		} else {
			newhash = '#' + hash;
			location.hash = newhash;
		}
		this._curHash = newhash;
		
		if ($.browser.msie) {
			var ihistory = $("#jQuery_history")[0]; // TODO: need contentDocument?
			var iframe = ihistory.contentWindow.document;
			iframe.open();
			iframe.close();
			iframe.location.hash = newhash;
			this._callback(hash);
		}
		else if ($.browser.safari) {
			this._dontCheck = true;
			// Manually keep track of the history values for Safari
			this.add(hash);
			
			// Wait a while before allowing checking so that Safari has time to update the "history" object
			// correctly (otherwise the check loop would detect a false change in hash).
			var fn = function() {$.history._dontCheck = false;};
			window.setTimeout(fn, 200);
			this._callback(hash);
			// N.B. "location.hash=" must be the last line of code for Safari as execution stops afterwards.
			//      By explicitly using the "location.hash" command (instead of using a variable set to "location.hash") the
			//      URL in the browser and the "history" object are both updated correctly.
			location.hash = newhash;
		}
		else {
		  this._callback(hash);
		}
	}
});

$(document).ready(function() {
	$.history = new History(); // singleton instance
});

})(jQuery);




