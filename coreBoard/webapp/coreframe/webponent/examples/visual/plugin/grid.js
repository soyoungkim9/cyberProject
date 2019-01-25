function Grid(){ }

Grid.prototype = {
	__construct : function(elem,options){
		this.config = $.extend({
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
	        'rotateColumn'		:undefined,
	        'paging'  			:{rows:undefined,type:'2',query:false,page:1},
	        'server'         	:undefined,  //{bld:'samples/database/listCities',view:'/common/component/grid/example/server_data.jsp',sort:"airport"}
	        'calendar'			:{type:'normalT',delim:'-'},
	        'tree'				:undefined,

			'showInit'			:true,
	        'selectClassName'	:'selectedTR',
	        'gridTextAlign'		:'right',
	        'gridPath'			:'lib/webponent/modules/grid'
		},options);
		
		this.isPagingMode 		= this.config.paging.rows === undefined ? false : true;
		this.SCROLL_BAR_WIDTH 	= this.getScrollWidth();
	},
	
	log: function(time,title){
		//console.log(time,title);
	},
	
	init: function(){
		this._configColGroup();
		
		//jQuery 의 scope를 함수단위로 내림(전역까지 올라가지 않으므로 함수에서의 접근이 빠르다.)
		var $ = this.$, config = this.config;
		
		var tbl = this.$this;
		tbl.css({"table-layout":"fixed","border-collapse":"separate","display":"table","empty-cell":"show"});
		tbl.attr("width",tbl.width());
		tbl.get(0).cellPadding = "0";
		tbl.get(0).cellSpacing = "0";
		
		if(tbl.attr("id") === undefined){ tbl.attr("id",this.uuid(tbl)); }
		var tableId = tbl.attr("id");
		
		var theadTH = $("thead th",tbl);
		theadTH.each(function(){
			var a = '<a class="thWrapper" style="position:relative;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display: block;">'+$(this).html()+'</a>';
			$(this).html(a);
			//$(this).html('<a class="thWrapper" style="">'+$(this).html()+'</a>');
		});
		
		
		var configWidth  = config.width;			//%가 존재 할수 있음
		var configHeight = parseInt(config.height);
		var headHeight  = theadTH.eq(0).outerHeight(true);
		var bodyHeight  = configHeight - headHeight;
		
		
		
		var visualContainer = tbl.get(0).parentNode;
		visualContainer.setAttribute("id", tableId+'_visualContainer');
		visualContainer.setAttribute("style", 'width:'+configWidth+';position:relative;height:'+configHeight+"px");
		//$(visualContainer).width(configWidth);
		
		var tbodyTable  = visualContainer.innerHTML;
		var theadTable 	= tbodyTable.replace(/(<tbody).*(<\/tbody>)/ig,"<tbody><\/tbody>").replace(tableId,tableId+"_head");
		tbodyTable 		= tbodyTable.replace(/(thead)/i,"thead style=\"display:none;\"");
		
		var c = ['<div id="'+tableId+'_gridContainer" class="gridContainer" style="overflow-x: hidden;overflow-y: hidden;width:'+configWidth+'">'];
		c.push('<div id="'+tableId+'_theadTableDiv" class="theadTableDiv" style="position:relative;overflow-x: hidden;overflow-y: hidden;display: table; margin-left: 0px; ">');
		c.push(theadTable);
		c.push('</div>');// end of <div class="tableHeadDiv"
		c.push('<div id="'+tableId+'_tbodyTableDiv" class="tbodyTableDiv" style="overflow-x: auto;overflow-y: scroll;width:100%;height:'+bodyHeight+'px">');
		c.push(tbodyTable);
		c.push('</div>');// end of <div class="tableBodyDiv"
		c.push('</div>');// end of <div class="gridContainer"
		
		if(this.isFixMode){
			var fix = c.join("");
			fix = fix.replace(/id=\"/g,"id=\"fix_").replace(/id=\"fix_col_/g,"id=\"col_");
			c.unshift(fix);
			visualContainer.innerHTML = c.join("");
			
			this.tbodyTableFix   	= $("#fix_"+tableId);
			this.theadTableFix   	= $("#fix_"+tableId+"_head");
			this.tbodyTableDivFix   = $("#fix_"+tableId+"_tbodyTableDiv");
			this.theadTableDivFix   = $("#fix_"+tableId+"_theadTableDiv");
			this.colgroupFix	  	= $("COLGROUP",this.theadTableDivFix);
			this.gridContainerFix   = $("#fix_"+tableId+"_gridContainer");
		}else{
			visualContainer.innerHTML = c.join("");
		}
		
		var tbodyTable 	   = document.getElementById(tableId);
		var theadTable 	   = document.getElementById(tableId+"_head");
		var tbodyTableDiv  = document.getElementById(tableId+"_tbodyTableDiv");
		var theadTableDiv  = document.getElementById(tableId+"_theadTableDiv");
		var colgroup	   = $("COLGROUP",$(theadTable));
		var gridContainer  = document.getElementById(tableId+"_gridContainer");
		
		this.tbodyTable   		= $(tbodyTable);
		this.theadTable   		= $(theadTable);
		this.tbodyTableDiv   	= $(tbodyTableDiv);
		this.theadTableDiv   	= $(theadTableDiv);
		this.colgroup	  		= $(colgroup);
		this.gridContainer      = $(gridContainer);
		this.visualContainer 	= $(visualContainer);
		
		//innerHTML로 구성했기 때문에 재 할당
		this.elem  = tbodyTable;
		this._this = tbodyTable;
		this.$this = $(tbodyTable);
		
		
		this.id = tableId;
		this.isRelativeWidth = false;
		this.containerWidth  = 0;
		this.isRelativeCol   = false;
		this.gridContainerFixWidth = 0;
		this.tableWidth = 0;			//테이블의 width 값을 저장해둠 .clientWidth 또는 width()를 않하기 위해 ( reflow 방지 )
		this.totalCount = 0;			//테이블 row의 수
		this.bodyHeight = bodyHeight;	//tbodyTableDiv의 높이
		this.headHeight = headHeight;	//theadTableDiv의 높이
		this.trHeight	= 29;			//tbody 에 존재하는 row의 높이(계산 해줘야함!@!@!@!@@!@!@!@!!!!!!!!!!!!!!!@!@!@!@!@!@)
		this.tbodyHeight= 0;			//tbody 테이블의 height (this.trHeight*this.totalCount)
		this.scrollIndex= 0;			//현재 scroll이 가르치고있는 index 영역
		this.trArray 	= [];			//tr별로 배열로 저장되어 있다.["<tr><td>1</td><td>가</td></tr>", "<tr><td>2</td><td>나</td></tr>"]
		this.trString	= "";           //문자열로 저장된 data      "<tr><td>1</td><td>가</td></tr><tr><td>2</td><td>나</td></tr>"
		this.originData	= "";           //초기화 또는 Submit을 통해 받은 원본 데이터
		
		
		this._initSetTableHeadMeta();
		this._eventBind();
		this.resizing();
	},
	
	_initSetTableHeadMeta : function(){
    	var tblWidth = 0, cols = $("col",this.colgroup);
    	
    	if(this.config.width.indexOf("%")>-1){
    		this.isRelativeWidth = true;
    		this.containerWidth  = this.visualContainer.width(); 
    	}else{
    		this.containerWidth  = parseInt(this.config.width);
    	}
    	
    	for(var i =0, ic = cols.size(); i < ic; i++ ){
    		var targetCol = cols.eq(i);
    		
    		try {
        		
        		var w = targetCol.attr("width");
        		
        		if(targetCol.hasClass("fixable")){
        			var cellFixWidth = w;
        			if(w.indexOf('px') != -1){
        				cellFixWidth = w.substring(0, w.indexOf('px'));
        			}
        			this.gridContainerFixWidth += cellFixWidth*1;
        			
        			if($.browser.msie){
                		if($.browser.version=="6.0" || $.browser.version=="7.0"){
                			this.gridContainerFixWidth++;
                		}
        			}
        		}
        		
        		if(targetCol.hasClass("hiddenable")||targetCol.hasClass("hidden")){
    				w = 0;
    			}
        		
        		if(w==null||w==""||w=="*"){
        			if(targetCol.hasClass("hiddenable")||targetCol.hasClass("hidden")){
        				w = 0;
        			}else{
        				tblWidth = 0;
        				this.isRelativeCol = true;
						break;
        			}
        		}
        		
        		if(w.indexOf("%")>0){
        			tblWidth = 0;
        			this.isRelativeCol = true;
					break;
        		}
        		
        		w = parseInt(w);
        		
        		if (w > 0) {
					tblWidth = tblWidth + w;
				}
    		}catch(e){
    			tblWidth = 0;
    		}
    	}
    	
    	if(this.isFixMode){
    		var fixWidth = 0;
    		var fixScroll = 0;
    		var _this = this;
    		
    		$("COL[class*=fixable]",this.colgroupFix).each(function(){
    			if(_this.isRelativeCol){
    				var width = _this.isRelativeWidth?_this.containerWidth:parseInt(_this.config.width);
    				fixWidth += (width*($(this).width()/100));
    				fixScroll = _this.isRelativeWidth?_this.SCROLL_BAR_WIDTH:0;
    			}else{
    				fixWidth += $(this).width();
    			}
    		});
    		
    		$("TABLE",this.gridContainerFix).width(fixWidth);
    		this.gridContainerFix.width(fixWidth);
    		
    		var table = $("TABLE",this.gridContainer);
    		table.width(table.width() - fixWidth);
    		this.gridContainer.width(this.gridContainer.width()- fixWidth +fixScroll);
    		
    		//셀고정 모드라면 하단 스크롤도 항상 나오도록.. 틀 고정 DIV의 하단 회색 영역의 height 설정이 어렵다..
    		this.tbodyTableDivFix.css({"overflow-x":"hidden","overflow-y":"hidden","height":(this.tbodyTableDivFix.height()-this.SCROLL_BAR_WIDTH)});
    		this.gridContainerFix.css({"position":"absolute","left":"0","top":"0"}).append('<div style="background-color:#ededed;height:'+this.SCROLL_BAR_WIDTH+'px;"></div>');
    		this.tbodyTableDiv.css("overflow-x","scroll");
    		this.gridContainer.css({"position":"absolute","left":fixWidth+"px","top":"0"});
    	}
    	
    	if(tblWidth > 0){
    		this.tableWidth = tblWidth;
    	}
    	
    	if(this.isRelativeCol){
    		//this.visualContainer.width(this.config.width);
    	}
    	
    	this._makeInternalStyle(cols);
    },
	
    _configColGroup:function(){
		var config 		= this.config;
		var table       = this.$this;
		var colgroup 	= this.$this;
		
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
    	
    	for ( var i = 0, i2 = $("THEAD",table).get(0).rows; i < i2.length; i++) {
    		for(var j =0, j2 = i2[i].cells; j < j2.length; j++){
    			var cell = j2[j];
    			var t = $getCellIndex(cell);
    			
    			cell.setAttribute("x",t.x);
    			cell.setAttribute("y",t.y);
    			
    			if(cell.getAttribute("rowspan") === null||cell.getAttribute("rowspan")==1){//IE7
    				cell.setAttribute("rowspan","1");
    				cell.setAttribute("data-rowspan","1");//IE7
    			}
    			if(cell.getAttribute("colspan") === null||cell.getAttribute("colspan")==1){//IE7
    				cell.setAttribute("colspan","1");
    				cell.setAttribute("data-colspan","1");//IE7
    			}
    		}
    	}
    	
    	//col의 아이디를 이용하여 th에 id setting
    	var cols = $("col",colgroup);
    	for(var i =0, ic = cols.size(); i < ic; i++ ){
    		var targetCol = cols.eq(i);
    		//last인이유는 th중 제일 마지막것이 영향을 받게 하기위해
    		$("THEAD TH[x=\""+i+"\"][data-colspan=\"1\"]",table).last().attr("id","th_"+this.getInnerID(targetCol));
    	}
		
		//로테이트 컬럼 설정(해당 col의 class에 rotatable을 추가하고 data-rotate 속성을 부여);
		if(config.rotateColumn){
			var rotateColumn = config.rotateColumn;
			for(var i in rotateColumn){
				var rotateArray = rotateColumn[i];
				var rotateGroup = rotateArray.slice();
				rotateGroup.unshift(i);
				
				$("col[id=\"col_"+i+"\"]", colgroup).addClass("rotatable").attr("data-rotate",rotateGroup.join(","));
				for( var j = 0, jc = rotateArray.length; j < jc; j++ ){
					$("col[id=\"col_"+rotateArray[j]+"\"]", colgroup).addClass("rotatable hiddenable").attr("data-rotate",rotateGroup.join(","));
				}
			}
		}
		
		//히든 컬럼 설정(해당 col의 class에 hidden을 추가 한다.)
		if(config.hiddenColumn !== undefined){
			var hiddenColumn = config.hiddenColumn;
			for( var i = 0, ic = hiddenColumn.length; i < ic ; i++ ){
				$("col[id=\"col_"+hiddenColumn[i]+"\"]", colgroup).addClass("hiddenable");
			}
		}
		
		//소팅 컬럼 설정(해당 col에 data-sortType에 타입 설정 추가)
		if(config.sortColumn !== undefined){
			var sortColumn = config.sortColumn;
			for( var  i in sortColumn ){
				$("col[id=\"col_"+i+"\"]", colgroup).addClass(sortColumn[i]);
			}
		}
		
		
		//고정 컬럼 설정(해당 col에 class에 fixable 추가 한다.)
		if(config.fixColumn !== undefined){
			var fixColumn = config.fixColumn;
			for( var i = 0, ic = fixColumn.length; i < ic ; i++ ){
				$("col[id=\"col_"+fixColumn[i]+"\"]", colgroup).addClass("fixable");
			}
		}
		if( ($("col[class*=\"fixable\"]", colgroup).size() > 0)){
			this.isFixMode = true;
		}
	},
	
	_eventBind:function(){
		var _this  = this; //Grid Object
		var config = this.config;
		
		//스크롤 이동시
		this.tbodyTableDiv.bind("scroll.grid",function(e) {
	    	//좌우 스크롤시
	    	_this.theadTableDiv.css('margin-left', (e.currentTarget.scrollLeft * -1) +"px");
	    	
	    	if(_this.isPagingMode){
	    		//*//상하 스크롤시
				var tbodyIndex 	= parseInt(((_this.tbodyTableDiv.scrollTop()+parseInt(_this.bodyHeight))/_this.tbodyHeight));
				if(_this.scrollIndex != tbodyIndex){
					var rowPerPage  = parseInt(config.paging.rows);
					
					var start = (tbodyIndex-1)*rowPerPage;
					var end   = (tbodyIndex+1)*rowPerPage;
					
					var marginTop 	= _this.tbodyHeight * (tbodyIndex-1);
					if(tbodyIndex == 0){
						marginTop = 0;
						start  = 0 ;
					}
					
					var d = _this.trArray.slice(start, end).join("");
					$("TBODY",_this.tbodyTable).empty().append(d);
					_this.tbodyTable.css("margin-top",marginTop);
					_this.scrollIndex = tbodyIndex;
					
					if(_this.isFixMode){
						$("TBODY",_this.tbodyTableFix).empty().append(d);
						_this.tbodyTableFix.css("margin-top",marginTop);
					}
					
					//this.log("["+(tbodyIndex*rowPerPage)+"~"+((tbodyIndex+1)*rowPerPage)+"] / "+_this.totalCount);
				}//*/
	    	}
	    });
		
		//윈도우 창의 크기가 변했을경우 발생하는 이벤트
		var resizeTimer = null;
		var resizeWindow = function(){
			if(_this.isRelativeWidth){
				var w = _this.visualContainer.width();
				_this.containerWidth = w;
				
				if(_this.isFixMode){
					w = w - _this.gridContainerFix.width();
				}
				_this.gridContainer.width(w);
				
			}else{
				//var w = _this.tableWidth - _this.gridContainerFixWidth;
				//_this.visualContainer.width(w);
			}
			_this.resizing();
			_this.tbodyTableDiv.scrollLeft(_this.tbodyTableDiv.scrollLeft());
		};
	    $(window).bind('resize',function(e) {
	    	clearTimeout(resizeTimer);
	    	resizeTimer = setTimeout(resizeWindow, 200);
    	});
	    
	    //TD를 클릭시 에디트 모드 이벤트와 셀렉트 모드 이벤트
		var _editAndSelectEvent = function(event){
			
			var eventEle=event.srcElement? event.srcElement : event.target;
			var parent = eventEle;
			var td = undefined;
			while(parent.nodeName != "TR"){
				if(parent.nodeName=="TD")      {td = parent;}
				if(parent.nodeName == "TABLE") {break;}
				parent = parent.parentNode;
			}
			parent = $(parent);
			
			if(_this.config.onclick !== undefined){
				_this.config.onclick(td,event);
			}
			//_this._editMode(eventEle);
		};
		
		//tbody의 TD를 클릭시 에디트 모드 이벤트와 셀렉트 모드 이벤트 ($editAndSelectEvent) 바인딩 
		_this.tbodyTableDiv.bind("click",{target:_this.tbodyTable},_editAndSelectEvent);
		
		
		//오름차순 내림차순으로 정렬을 할수 있는 이벤트 
		this._sortMode( this.theadTable);
		
		//로테이트 컬럼 설정(해당 col의 class에 rotatable을 추가하고 data-rotate 속성을 부여);
		if(config.rotateColumn){
			this._rotateMode();
		}
		
		if(this.isFixMode){
			//원래 테이블 영역에서 스크롤 이벤트가 발생한경우 틀고정 테이블영역도 같이 이동시켜준다.
			this.tbodyTableDiv.bind("scroll.grid",function(e) {
				_this.tbodyTableDivFix.scrollTop(_this.tbodyTableDiv.scrollTop());
			});
		}
	},
	
    changeColumn:function(colId,colId2){
    	var colgroup 		= this.colgroup;
    	var colSize     	= $("col",colgroup).size();
    	var moveColSeq  	= $("col[id=\""+colId +"\"]",colgroup).index();
    	var targetColSeq	= $("col[id=\""+colId2+"\"]",colgroup).index();
    	
    	if((targetColSeq - moveColSeq) == 1){//alread exist in front of target
    		return;
    	}
    	
    	/*col change*/
    	var cols = $("col",colgroup);
    	cols.eq(moveColSeq).insertBefore(cols.eq(targetColSeq));
    	
    	cols = $("col",this.tbodyTable);
    	cols.eq(moveColSeq).insertBefore(cols.eq(targetColSeq));
    	
    	/*header change*/
    	var headers = $("th",this.theadTable);
    	headers.eq(moveColSeq).insertBefore(headers.eq(targetColSeq));
    	
    	headers = $("th",this.tbodyTable);
    	headers.eq(moveColSeq).insertBefore(headers.eq(targetColSeq));
    	
    	/*body change*/
    	var regExp = "";
    	var chgExp = "";
    	for( var i = 0; i < colSize; i++ ){
    		regExp += "(<td[^>]*>[^<\/td]*.*?<\/td>)";
    		chgExp += "$"+(i+1)+"|";
    	}
    	chgExp = chgExp.split("|",colSize);
    	
    	var target = chgExp.splice((moveColSeq),1);
    	chgExp.splice((targetColSeq),0,target[0]);
    	var result = this.originData.replace(new RegExp(regExp,'g'),chgExp.join(""));
    	this.originData = result;
    	this._onSuccess(result);
    	
    	/*internalStyle change*/
    	this._makeInternalStyle($("col",colgroup));
    },
	
	_sortMode:function(sortObj){
		var _this = this;
		
		var $reverse = function(){
			if(_this.config.server===undefined){
				var sortedData = _this.trArray.reverse().join("");
				_this.originData = sortedData;
				_this._onSuccess(sortedData);
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
		
    	//sorting comparator [argument[0]:tr,argument[1]:value]
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
		
		var findTargetTDValue = function(tr,index){
			tr = tr.replace(/<((\/)?tr||td)>/ig,""); //remove <tr>, </tr>, <td>
			tr = tr.split("</td>");
			return tr[index];
		};
		
    	$("col",this.colgroup).each(function(k){
    		var targetCol = $(this);
    		
    		if( targetCol.hasClass("intType")||targetCol.hasClass("stringType")||targetCol.hasClass("dateType") ){
    			
    			var el = $("th[id=\"th_"+_this.getInnerID(targetCol)+"\"]", sortObj);
    			el.css("cursor","pointer");
    			
    			var sortIcon = $('<span id="sortable_icon" class="sort_able"><button type="button" class="sprite" style="margin:0;padding:0;border:none;"></button></span>');
    			
				$(".thWrapper",el).prepend(sortIcon);
				
				el.bind("click",function(event){
					var target = event.srcElement || event.target;
					
					//_columnResize가 수행되는동안 _sortMode 이벤트의 중첩이 발생하는경우를 방지
					if(_this.isColumnResizing == true){
						_this.isColumnResizing = false;
						return;
					}
					
					var obj = event.currentTarget;
					var $obj = $(obj);
					var sortIcon = $("#sortable_icon",$obj);
					var className = sortIcon.attr("class");
					
					if(className == "sort_able"){
						$("SPAN#sortable_icon",_this.gridContainer).each(function(k){ //아이콘 초기화
							$(this).attr("class","sort_able");
						});
						
						$("THEAD TH.sorting",_this.gridContainer).each(function(k){ //th컬러 초기화
							$(this).removeClass("sorting");
						});
						
						sortIcon.attr("class","sort_desc");
						el.addClass("sorting");
						
						if(_this.config.server===undefined){
							
							if(!obj.sortfunction){ /*Sorting Comparator Setting*/
        						if(targetCol.hasClass("intType")){
        							obj.sortfunction = $intTypeComparator;
        						} else if(targetCol.hasClass("stringType")){
        							obj.sortfunction = $stringTypeComparator;
        						} else if(targetCol.hasClass("dateType")){
        							obj.sortfunction = $dateTypeComparator;
        						} 
        					}
							
							var x = _this.getInnerID($obj);// th_ 제거
							var targetIndex = $("col[id=\"col_"+x+"\"]",_this.colgroup).index();
							
							var sortArray = new Array();
							for ( var i =0, ic = _this.trArray.length; i < ic; i++ ){
								var targetTR = _this.trArray[i];
								sortArray.push([targetTR,findTargetTDValue(targetTR,targetIndex)]);
							}
        					sortArray.sort(obj.sortfunction);
        					
        					var sortArrayLength = sortArray.length;
        					var dataArray = new Array();
        					for (var j=0; j<sortArrayLength; j++) {
        						dataArray.push(sortArray[j][0]);
        					}
        					
        					var sortedData = dataArray.join("");
        					_this.originData = sortedData;
        					_this._onSuccess(sortedData);//jqXHR 객체가 없다...
        					
        					delete sortArray; delete dataArray;
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
					}else if(className=="sort_asc"){
						$reverse();
						sortIcon.attr("class","sort_desc");
					}else if(className=="sort_desc"){
						$reverse();
						sortIcon.attr("class","sort_asc");
					}
				});
			}
    	});
    },
    
    search: function(id,val){
    	var targetTD 	= "<td[^>]*>(\s)*"+val+"(\s)*<\\/td>";
		var anyTD 		= "<td[^>]*>[^<]*<\\/td>";
    	
		var expression = "";
    	var searchIndex = $("col[id=\"col_"+id+"\"]",this.colgroup).index();
    	for( var i = 0; i < searchIndex; i++ ){
    		expression += anyTD;
    	}
    	expression+=targetTD;
    	expression = "<tr[^>]*>[^<]*(<(?!tr)[^<]*)*"+expression+".*?<\\/tr>";
    	
    	var result = this.originData.match(new RegExp(expression,'g'));
    	if(result){
    		this._onSuccess(result.join(""));
    	}else{
    		alert("조건에 만족하는게 없음");
    	}
    	
    },
	
	_onSuccess : function(data,textStatus,jqXHR){
		
		if(jqXHR){//데이터 뻥티기
			//2817
			//data += data;data += data;data += data;data += data;data += data;
			//5633       //11265      //22529      //45056      
			//data += data;data += data;data += data;data += data;
			//90113        //180225     //360449 	 //720897	  //1441793
			//data += data;data += data;data += data;data += data;data += data;
			this.originData = data;
		}
		
		/*data parsing*/
		this.trString   = data;
		this.trArray 	= data.replace(/<\/tr>/g,"<\/tr>\r\n").split("\r\n");
		this.trArray.splice(this.trArray.length-1,1);/*split에 의해 생기는 마지막 공백 배열을 제거*/
		this.totalCount = this.trArray.length;
		
		/*attach row*/
		if(this.isPagingMode){
			$("TBODY",this.tbodyTable).empty().append(this.trArray.slice(0, 60).join(""));
			if(this.isFixMode){
				$("TBODY",this.tbodyTableFix).empty().append(this.trArray.slice(0, 60).join(""));
			}
			
			/*virtual scroll*/
			var scrollHeight = this.trHeight * (this.totalCount);
			
			var virtualScrollHeightDiv = $("DIV.virtualScrollHeightDiv",this.visualContainer);
			if(virtualScrollHeightDiv.size()==0){
				if($.browser.msie && ($.browser.version=="7.0"||$.browser.version=="6.0")){
					this.tbodyTable.css("float","left");
					this.tbodyTableDiv.append("<div class='virtualScrollHeightDiv' style='float:left;height:"+scrollHeight+"px'></div><div style='clear:both;'></div>");
					if(this.isFixMode){
						this.tbodyTable.css("float","left");
						this.tbodyTableDiv.append("<div class='virtualScrollHeightDiv' style='float:left;height:"+scrollHeight+"px'></div><div style='clear:both;'></div>");
					}
				}else{
					this.tbodyTableDiv.css("position","relative");
					$("<div class='virtualScrollHeightDiv' style='position:absolute;width:1px;top:0px;height:"+scrollHeight+"px'></div>").insertBefore(this.tbodyTable);
					if(this.isFixMode){
						this.tbodyTableDivFix.css("position","relative");
						$("<div class='virtualScrollHeightDiv' style='position:absolute;width:1px;top:0px;height:"+scrollHeight+"px'></div>").insertBefore(this.tbodyTableFix);
					}
				}
			}else{
				virtualScrollHeightDiv.css("height",scrollHeight+"px");
			}
			this.tbodyHeight = parseInt(this.config.paging.rows) * this.trHeight;
			this.scrollIndex = 0;
		}else{
			var table = this.theadTableDiv.get(0).innerHTML.replace(this.id+"_head",this.id).replace(/(thead)/i,"thead style=\"display:none;\"").replace(/<\/tbody>/i,data+"</tbody>");
			
			//this.replaceHTML(this.tbodyTableDiv.get(0), table);
			this.tbodyTableDiv.get(0).innerHTML = table;
			
			//innerHTML로 구성했기 때문에 재 할당
			var tbodyTable 	= document.getElementById(this.id);
			this.elem  		= tbodyTable;
			this._this 		= tbodyTable;
			this.$this 		= $(tbodyTable);
			this.tbodyTable = this.$this;
			
			if(this.isFixMode){
				var fixTable = this.theadTableDivFix.get(0).innerHTML.replace(this.id+"_head",this.id).replace(/(thead)/i,"thead style=\"display:none;\"").replace(/<\/tbody>/i,data+"</tbody>");
				this.tbodyTableDivFix.get(0).innerHTML = fixTable;
				var tbodyTableFix  = document.getElementById("fix_"+this.id);
				this.tbodyTableFix = $(tbodyTableFix);
			}
			
			this.resizing();
			//[7: 115(1000)], [8:110(1400) ], [9:120(1200)], [chrome : 288(800)], [opera : 32(620)], [FF :50(600) ],[safari :160(500)] innerHTML
			//[7: 270], [8:140 ], [9:130],[chrome : 50], [opera : 50], [FF :45 ],[safari :44] replaceHTML
			//*/
		}
		
		if(this.isPagingMode){
			console.log("pagingMode");
		}else{
			console.log("innerHTMLMode");
		}
		
		delete tableMap;
		delete tableArray;
	},
	
	_makeInternalStyle : function(cols){
		if($.browser.msie && ($.browser.version=="7.0"||$.browser.version=="6.0")){ return; }
		
    	var cssTxt = '', cssTxt_head = '', tableId = this.id ;

		for(var i =0, ic = cols.size(); i < ic; i++ ){
			var targetCol = cols.eq(i);
			
			//셀 정렬 
			var txtAlign = targetCol.attr("align");
			if( txtAlign === undefined || txtAlign == '' || txtAlign.length == 0 ){
				txtAlign = this.config.gridTextAlign;
			}
			targetCol.attr("align",txtAlign);
			
			if(targetCol.hasClass("hiddenable") || targetCol.hasClass("hidden")){
				
				cssTxt = cssTxt + "#"+ tableId + ' td:first-child ';
				cssTxt_head = cssTxt_head + "#"+ tableId+'_head' + ' th:first-child ';
				
				for ( var j = 0; j < i; j++) {
					cssTxt = cssTxt + ' + td';
					cssTxt_head = cssTxt_head + ' + th';
				}
				
				cssTxt = cssTxt + ' {text-align:' + txtAlign + ';display:none;} ';
   				cssTxt_head = cssTxt_head + ' {display:none;}';
			}else{
				//셀 고정
				var isCellFix  = targetCol.hasClass("fixable");
				var cellFixTxt = '';
				
				if(isCellFix == true){
					cellFixTxt = "display:none;";
				}
				
				cssTxt = cssTxt + "#"+ tableId + ' td:first-child ';
				cssTxt_head = cssTxt_head + "#"+ tableId+'_head' + ' th:first-child ';
				
				for ( var j = 0; j < i; j++) {
					cssTxt = cssTxt + ' + td';
					cssTxt_head = cssTxt_head + ' + th';
				}
				
				cssTxt = cssTxt + ' {text-align:' + txtAlign + ';' + cellFixTxt + '} ';
   				cssTxt_head = cssTxt_head + ' {' + cellFixTxt + '} ';
			}
		}
    	
     	var cssTxtFix = '';
    	var cssTxt_headFix = '';
    	if(this.isFixMode){
        	var colsFix = $("col", this.theadTableFix);
    		var colsFix_body = $("col", this.tbodyTableFix);
        	
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
   					targetCol.removeClass("fixable");
   					cellFixTxt = "";
   				}else{
   					targetCol.addClass("fixable");
   					cellFixTxt = "display:none;";
   				}
   				
   				cssTxtFix = cssTxtFix + "#"+'fix_'+ this.id + ' td:first-child ';
				cssTxt_headFix = cssTxt_headFix + "#"+'fix_'+ this.id+'_head' + ' th:first-child ';
				
				for ( var j = 0; j < i; j++) {
					cssTxtFix = cssTxtFix + ' + td';
					cssTxt_headFix = cssTxt_headFix + ' + th';	
				}
				
   				cssTxtFix = cssTxtFix + ' {text-align:' + txtAlign + ';' + cellFixTxt + '} ';
   				cssTxt_headFix = cssTxt_headFix + ' {' + cellFixTxt + '} ';
			}
    	}
    	
     	var internalCss = cssTxt + cssTxt_head + cssTxtFix + cssTxt_headFix;
     	
		
     	var style = document.getElementById(tableId+"_internalCss");
    	
    	if(style === null){
    		style = document.createElement('style');
    		style.setAttribute("type", "text/css");
    		style.setAttribute("id", tableId+"_internalCss");
    		document.getElementsByTagName('head')[0].appendChild(style);
    	}
     	
    	
		try{//IE8
			style.styleSheet.cssText = internalCss;
		}catch(e){//그 이외
			style.innerHTML = internalCss;
		}
	},
    
    rotateColumn:function(colId,colId2){
    	$("col[id=\""+colId+"\"]" , this.colgroup).addClass("hiddenable");
    	$("col[id=\""+colId+"\"]" , this.tbodyTable).addClass("hiddenable");
    	$("col[id=\""+colId2+"\"]", this.colgroup).removeClass("hiddenable");
    	$("col[id=\""+colId2+"\"]", this.tbodyTable).removeClass("hiddenable");
    	
    	this._makeInternalStyle($("col",this.colgroup));
    },
    
    hideColumn:function(colId){
    	$("col[id=\""+colId+"\"]", this.colgroup).addClass("hiddenable");
    	$("col[id=\""+colId+"\"]", this.tbodyTable).addClass("hiddenable");
    	
    	this._makeInternalStyle($("col",this.colgroup));
    },
    
    showColumn:function(colId){
    	$("col[id=\""+colId+"\"]", this.colgroup).removeClass("hiddenable");
    	$("col[id=\""+colId+"\"]", this.tbodyTable).removeClass("hiddenable");
    	
    	this._makeInternalStyle($("col",this.colgroup));
    },
    
    _rotateMode : function(){
    	var _this = this;
    	var rotateIcon 	= '<div id="rotatable_icon" class="rotate_able" style="background:transparent;position:absolute;top:0px;right:0;width:30px;height:100%;">';
    	rotateIcon	   += '<button type="button" class="sprite" style="cursor:pointer;float:right;width:15px;height:15px;display:block;margin:0;padding:0;border:none;"></button>';
    	rotateIcon	   += '</div>';
    	$("thead th",this.theadTable).each(function(k){
			var thElement 	= $(this);
			var innerID 	= _this.getInnerID(thElement);
			var rotate 		= $("col[id=\"col_"+innerID+"\"]",_this.colgroup).attr("data-rotate");
			if(rotate){
				var rotateOrder = rotate.split(",");
				var currentCol 	= undefined;
				var nextCol 	= undefined;
				
				for( var i = 0, ic = rotateOrder.length; i < ic; i++ ){
					if( rotateOrder[i] == innerID ){
						currentCol = rotateOrder[i];
						nextCol = rotateOrder[i+1];
						if( nextCol === undefined ){
							nextCol = rotateOrder[0];
						}
					}
				}
				
				var rotaterObj = $(rotateIcon);
				rotaterObj.bind("click",function(){
					_this.rotateColumn("col_"+currentCol,"col_"+nextCol);
				});
				$("A.thWrapper",thElement).eq(0).append(rotaterObj);
			}
		});
	},
    
    resizing : function(){
    	if(this.isResizing) {return;}
		this.isResizing=true;
		
		var tbodyTable = this.tbodyTable; 
		tbodyTable.find("colgroup").remove();   	    		
		tbodyTable.prepend(this.colgroup.clone());
		this.tbodyTableDiv.trigger('scroll.grid');
		
		if(this.isFixMode){
			var tbodyTableFix = this.tbodyTableFix; 
			tbodyTableFix.find("colgroup").remove();   	    		
			tbodyTableFix.prepend(this.colgroupFix.clone());
		}
		
		if(this.isRelativeCol){
			var containerWidth = this.containerWidth;
			//gridContainer의 width를 수정
			var w = containerWidth - this.SCROLL_BAR_WIDTH;
			this.theadTable.width(w);
			tbodyTable.width(w);
			if(this.isFixMode){
				
			}
		}else{
			var w = this.tableWidth - this.gridContainerFixWidth;//width구하는대 시간이 오래 걸림;
			this.theadTable.width(w);
			tbodyTable.width(w);
    		
    		//$(this.visualContainer).width(this.visualContainer.clientWidth);
		}
		
    	this.isResizing = false;
	},
	
	getInnerID : function(col){
		var nodeName = col.get(0).nodeName;
		var id 		 = col.attr("id");
		var position = 0;
		
		switch(nodeName){
			case "COL":
				position = 4;
				break;
			case "TH":
				position = 3;
				break;
			default:
				position = 0;
				break;
		}
		return id.substring(position); //col_ 를 제거
	},
	
	submit : function(formObj,settings){
		if(this.config.server === undefined){
			var param ={
	 			url:formObj.attr("action"),
	 			type:formObj.attr("method"),
	 			data:formObj.serialize()
	 		};
	    	if (settings){$.extend(param, settings);}
	    	this._ajax(param);
		}else{
			_this.sendServer(_this.lastAjaxForm,settings);
		}
		return false;
	},
	
	getScrollWidth : function (){
		var temp = document.createElement("div");
	    temp.style.cssText = "position:absolute; top:-10000px; left:-10000px; width:100px; height:100px; overflow:scroll;"; 
	    document.body.appendChild(temp);
	    var scrollBarWidth = parseInt(temp.style.width) - parseInt(temp.clientWidth);
	    document.body.removeChild(temp);
	    delete temp;
	    
	    return scrollBarWidth;
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
	},
	
	getGridBrowser : function(){
    	var browser = undefined;
    	
    	var ua =  navigator.userAgent.toLowerCase(),
        rwebkit = /(webkit)[ \/]([\w.]+)/,
    	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
    	rmsie = /(msie) ([\w.]+)/,
    	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;
    	var match = rwebkit.exec( ua ) ||ropera.exec( ua ) || rmsie.exec( ua ) || ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) || [];
    	
    	browser = match[1];
        
        if(browser == "msie"){
        	var version = match[2];
        	
        	switch(version){
        		case "10.0":
        			browser = "IE10";
        			break;
        		case "9.0":
        			browser = "IE9";
        			break;
        		case "8.0":
        			browser = "IE8";
        			break;
        		case "7.0":
        			browser = "IE7";
        			break;
        		case "6.0":
        			browser = "IE6";
        			break;
        	}
        }
        
        return browser;
    }
};


