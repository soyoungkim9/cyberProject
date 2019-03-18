var GRID_DEVICE = "pc";

try{
	GRID_DEVICE = getDevice();
}catch(e){}
function setGridDevice(mode){
    GRID_DEVICE = mode;
}

(function($){
    var GRID_HOME    = "/WEB-APP/webponent/grid";
    //document.write('<link rel="stylesheet" type="text/css" href="'+GRID_HOME+'/dataGrid_black.css"/>');
    
    var GRID_BROWSER = getGridBrowser();
    var DEBUG_LOG    = false;
    var SCROLL_BAR_WIDTH = 0;
    var TOUCH_DEVICE = ("ontouchstart" in document.documentElement);
    
    //$(document).ready(function() {
        //SCROLL_BAR_WIDTH = getScrollWidth();
    //});
    
    $.dataGridMini = function(selector, settings){

        // settings
        var config = {
            'width'             :'100%',
            'height'            :200,
            'rows'              :10,
            
            'columnResizable'   :false,
            'onclick'           :undefined,
            'hover'             :true,
            
            'hiddenColumn'      :undefined,
            'rotateColumn'      :undefined,
            'chooseColumn'      :undefined,
            'expandColumn'      :undefined,
            'slideColumn'		:undefined,
            'slideCount'		:4,

            'showInit'          :true,
            'selectClassName'   :'selectedTR',
            'gridTextAlign'     :'right',
            'gridPath'          :GRID_HOME,
            
            'mobileAutoHeight'  :true,
            'mobileAutoWidth'   :true,
            
            'vscroll'			:false,
            'hscroll'			:true
        };
        
        var rowsHeight = 27;
        
        if ( settings ){$.extend(config, settings);}

        var grid={
            onEvent : true,
            selector:selector,
            
            setConfig : function(settings){
                if ( settings ){$.extend(config, settings);}
            },
            
            updateGridHeight : function(height){
                if(height === undefined){
                    height = config.height;
                }
                this.tableBodyDiv.height(height);
            },
            
            initialize : function(selector){
                this.tbl = $(selector);
                var gridObject = this.tbl.data("object");
                if( gridObject !== undefined ){ //data("object")가 있다면 이미 초기화된 그리드
                    return gridObject; 
                }
                
                this.resizeEventArray = [];
                
                if(config.rows!==undefined){
                    config.height = (Number(config.rows) * rowsHeight) -1 + (this.tbl.find("THEAD TR").size()*27);
                }
                
                //wts전용으로 모바일에서만 로테이트 모드를 사용
                if(GRID_DEVICE=="pc"){
                    config.columnResizable = false;
                    config.rotateColumn = undefined;
                    config.expandColumn = undefined;
                    var col = this.tbl.find("col.pchiddenable");
                    col.each(function(){
                        $(this).removeClass("pchiddenable").addClass("hiddenable");
                    });
                    
                    //config.fixColumn = undefined;//웹접근성때문에 틀곶정 모드 사용불가 추후 재수정
                }else if(GRID_DEVICE=="tablet"){
                    config.columnResizable = false;
                    config.rotateColumn = undefined;
                    config.expandColumn = undefined;
                    var col = this.tbl.find("col.pchiddenable");
                    col.each(function(){
                        $(this).removeClass("pchiddenable").addClass("hiddenable");
                    });
                }else if(GRID_DEVICE=="mobile"){
                    config.columnResizable = false;
                    config.fixColumn    = undefined;
                    config.slideColumn = undefined;
                    var col = this.tbl.find("col").removeClass("fixable");                    
                    
                    col = col.filter(".mhiddenable");
                    col.each(function(){
                        $(this).removeClass("mhiddenable").addClass("hiddenable");
                    });
                    if(config.mobileAutoHeight+"" == "true"){
                    	config.height = "auto";
                    }
                    
                    slideColumn = undefined;
                }else{
                    config.columnResizable = false;
                }
                
                this._initLayout(selector);
                
                /*
                if($.fn.niceScroll){
                    //touchbehavior:false
                    var gridAutoHeight = false;
                    if(GRID_DEVICE=="mobile" && config.mobileAutoHeight==true){
                        gridAutoHeight = true;
                    }                   
                    var _this = this;
                    //이거풀면 +6 div
                    _this.scrollBar = _this.tableBodyDiv.niceScroll({scrollPosition:_this.tableContainer,cursorcolor:"#796f67",cursoropacitymax:0.8,cursoropacitymin:0.2,gridAutoHeight:gridAutoHeight});
                }
                */
                
                return this;
            },
            
            _initLayout : function(selector){
            	var tbodyTable = $(selector);
            	this.tbl = tbodyTable;
                tbodyTable.css({"table-layout":"fixed","display":"table","empty-cell":"show","width":this.tbl.width()});
                tbodyTable.get(0).cellPadding = "0";
                tbodyTable.get(0).cellSpacing = "0";
                this.trReference = $("tbody tr",tbodyTable).clone();
                this.dataRowGroupCount = $("TBODY",tbodyTable).attr("data-rowgroup")===undefined ? "1" : $("TBODY",tbodyTable).attr("data-rowgroup");
                this.isRelativeWidth = config.width.indexOf("%") > -1 ? true : false;
                this.id  = tbodyTable.attr("id");
                
                if(!config.showInit){
                    $("tbody",this.tbl).empty();
                }
                
                $("thead th",this.tbl).each(function(){
                    if(config.rotateColumn!==undefined){
                        var a = '<a class="tdWrapper" style="position:relative;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display: block;height:100%;">'+$(this).html()+'</a>';
                        $(this).html(a);//A tag를 씌우면 IE7에서 잔상이 남는다..
                    }
                });
                
                var configWidth  = config.width;
                var configHeight = parseInt(config.height);
                
                var tableContainerStyle = "overflow-x: hidden;overflow-y: hidden;";
                if(GRID_BROWSER=="IE7"){
                    tableContainerStyle += "float:left;position:relative;";//position:relative IE7에서 nicescroll위치 문제"
                }
                
                var tableContainer = $(document.createElement('div'))
                .attr('class','tableContainer')
                .attr('style',tableContainerStyle)
                .css("width", configWidth);
                
                var containerDiv = $(document.createElement('div'))
                .attr('id','containerDiv_'+this.id)
                .attr('class','containerDiv')
                .css("width", configWidth).css("position","relative");//position:relative IE7에서 nicescroll위치 문제"
               
                var cursor = config.onclick === undefined ? "" : " bindEvent" ;
                var tableBodyDiv = $(document.createElement('div'))
                .attr('class','miniGrid'+cursor)
                .attr('style','overflow-x: auto;overflow-y: hidden;width:100%;height:'+configHeight+'px;');
                //width:100%는 IE6 scroll에서 필요..
                
                containerDiv.insertBefore(tbodyTable);
                tableBodyDiv.append(tbodyTable);
                tableContainer.append(tableBodyDiv);
                containerDiv.append(tableContainer);
                
                //========================================전역변수 설정=========================================
                this.tbodyTable = tbodyTable;
                this.tableBodyDiv = tableBodyDiv;
                this.tableContainer = tableContainer;
                this.containerDiv = containerDiv;
                this.thead = $("thead",tbodyTable);
                this.tbody = $("tbody",tbodyTable);
                
                //컬그룹 기본 설정
                this.colgroup = $("colgroup", tbodyTable);
                if(this.colgroup.size()==0){
                	this.colgroup = $(document.createElement('colgroup'));
                    for(var i = 0,i2 = $("th",this.tbodyTable), i3 = i2.size(); i < i3; i++ ){
                        var c = i2.eq(i).attr("colspan");
                        if(!c){
                            c = 1;
                        }
                        for(var j =0; j < c; j++){
                            this.colgroup.append(document.createElement('col'));
                        }
                    }
                }
                
                //thead의 rowspan 및 colspan설정 또한 임의의 속성 x, y 추가
                for ( var i = 0, i2 = this.thead.get(0).rows, i2c = i2.length; i < i2c; i++) {
                    for(var j =0, j2 = i2[i].cells, j2c = j2.length; j < j2c; j++){
                        var cell = j2[j];
                        var t = getCellIndex(cell);
                        cell.setAttribute("x",t.x);
                        cell.setAttribute("y",t.y);
                        
                        var rowspan = cell.getAttribute("rowspan");
                        if( rowspan == "null" || rowspan == "undefined" ){
                            cell.setAttribute("rowspan","1");
                        }
                        
                        var colspan = cell.getAttribute("colspan");
                        if( colspan ===null || colspan === undefined ){
                            cell.setAttribute("colspan","1");
                        }
                    }
                }
                
                this.col = $("col", this.colgroup);
                //웹표준 코딩 문제로 width 속성을 사용할수 없어 style의 width값을 가져와 width속성값을 설정(width속성이 설정하기 용이.)
                this.col.each(function(k){
                    var targetCol = $(this);
                    var w = targetCol.attr("width");
                    var inlineStyle = w;
                    if(w === undefined || w == null || w==""){  //IE7의 경우는 "" 으로 나오내..
                        inlineStyle= targetCol.attr("style");
                        if(inlineStyle !== undefined && inlineStyle != "undefined"){
                            var expression = 'width.*?[x|%]';
                            var result = inlineStyle.match(new RegExp(expression,'g'));
                            if(result!=null){
                            	w = (""+result[0]).split(":")[1];
                                targetCol.css("width","");
                            }
                        }
                    }
                    
                    if(w!="" && w !=null&&w !== undefined){
                    	if(inlineStyle.indexOf("%")>-1){
                            targetCol.attr("width",w);
                        }else{
                            targetCol.attr("width",w);
                        }
                    }	
                });
                
                //colPadding과 tr의 높이 구하기
                var tempTR = $("<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td></tr>");
                tbodyTable.append(tempTR);
                this.trHeight = tempTR.outerHeight();
                if( this.colPadding == null){
                    var tempTD = $("TD",tempTR).eq(1);
                    var innerWidth = tempTD.innerWidth();
                    var tdWidth = tempTD.width();
                    this.colPadding = innerWidth - tdWidth;
                    
                    var outerWidth = tempTD.outerWidth(false);
                    this.tdBorderWidth = outerWidth - innerWidth;
                }
                tempTR.remove();//필요 없으므로 삭제
                
                //로테이트 컬럼 설정(해당 col의 class에 rotatable을 추가하고 data-rotate 속성을 부여);
                if(config.rotateColumn !== undefined){
                    var rotateColumn = config.rotateColumn;
                    for(var i in rotateColumn){
                        var rotateArray = rotateColumn[i];
                        var rotateGroup = rotateArray.slice();
                        rotateGroup.unshift(i);
                        $("col[id=\"col_"+i+"\"]", this.colgroup).addClass("rotatable").attr("data-rotate",rotateGroup.join(","));
                        for( var j = 0, jc = rotateArray.length; j < jc; j++ ){
                            $("col[id=\"col_"+rotateArray[j]+"\"]", this.colgroup).addClass("rotatable hiddenable").attr("data-rotate",rotateGroup.join(","));
                        }
                    }
                }
                
                //choose 컬럼 설정(해당 col의 class에 choosable을 추가 한다.)
                var choosable = this.colgroup.find(".choosable");
            	if(choosable.size() > 0){
            		var choosableArr = [];
            		choosable.each(function(){
            			var id = this.id;
            			id = id.substring(4);//col_ <-- 제거
            			choosableArr.push(id);
            		});
            		config.chooseColumn = choosableArr;
            	}
                
                if(config.chooseColumn !== undefined){
                	var chooseColumn = config.chooseColumn;
                	this.colgroup.find("col").addClass("hiddenable");
                	for( var i = 0, ic = chooseColumn.length; i < ic ; i++ ){
                        $("col[id=\"col_"+chooseColumn[i]+"\"]", this.colgroup).removeClass("hiddenable").addClass("choosable");
                    }
                }
                
                //확장 컬럼 설정(해당 col의 class에 hiddenable을 추가 한다.)
                if(config.expandColumn !== undefined){
                    var expandColumn = config.expandColumn;
                    for( var i = 0, ic = expandColumn.length; i < ic ; i++ ){
                        $("col[id=\"col_"+expandColumn[i]+"\"]", this.colgroup).addClass("expandable").addClass("hiddenable");
                    }
                }else{
                	if(this.col.hasClass("expandable")){
                		var expandableArr = new Array();
                		this.col.filter(".expandable").each(function(){
                			expandableArr.push(_this.removeColPrefix($(this).addClass("hiddenable").attr("id")));
                		});
                		config.expandColumn = expandableArr;
                	}
                }
                
                //슬라이드 컬럼 설정(해당 col의 class에 slidable 추가 한다.)
                if(config.slideColumn !== undefined){
                    var slideColumn = config.slideColumn;
                    for( var i = 0, ic = slideColumn.length; i < ic ; i++ ){
                    	var targetCol = $("col[id=\"col_"+slideColumn[i]+"\"]", this.colgroup);
                    	targetCol.addClass("slidable");
                        if(config.slideCount < (i+1)){
                        	targetCol.addClass("hiddenable");
                        }
                    }
                }else{
                	if(this.col.hasClass("slidable")){
                		var slidableArr = new Array();
                		this.col.filter(".slidable").each(function(index){
                			if(config.slideCount < (index+1)){
                				$(this).addClass("hiddenable");
                			}
                			slidableArr.push(_this.removeColPrefix($(this).attr("id")));
                		});
                		config.slideColumn = slidableArr;
                	}
                }
                
                //히든 컬럼 설정(해당 col의 class에 hiddenable을 추가 한다.)
                if(config.hiddenColumn !== undefined){
                    var hiddenColumn = config.hiddenColumn;
                    for( var i = 0, ic = hiddenColumn.length; i < ic ; i++ ){
                        $("col[id=\"col_"+hiddenColumn[i]+"\"]", this.colgroup).addClass("hiddenable");
                    }
                }
                
                this._initSetTableHeadMeta();
                
                if(config.showInit){
                    _this._onSuccess(this.trReference,'',this.trReference.size());
                }

                //========================================이벤트 설정=========================================
                //윈도우 창의 크기가 변했을경우 발생하는 이벤트
                
                if(GRID_BROWSER.indexOf("IE")==0){
                    this.browserResizeTimer = null;
                    this.beforeWidth = 0;
                    this.beforeHeight = 0;
                    $(window).bind("resize.grid",function(){
                        var win = $(this);
                        var currentWidth = win.width();
                        var currentHeight = win.height();
                        
                        if(_this.beforeWidth != currentWidth || _this.beforeHeight != currentHeight ){
                            _this.beforeWidth  = currentWidth;
                            _this.beforeHeight = currentHeight;
                            _this.resizing();
                        }
                    });
                }else{
                    this.browserResizeTimer = null;
                    $(window).resize(function(e) {
                        clearTimeout(_this.browserResizeTimer);
                        _this.browserResizeTimer = setTimeout(function(){
                            _this.resizing();
                        },500);
                    });
                }
                
                if(config.hover){
                    if(!TOUCH_DEVICE){
                        //ori테이블 TR에 하버가 일어날 경우 fix테이블에도 동일하게 발생
                        _this.tbodyTable.delegate("tbody tr","mouseover mouseout",function(event){
                            var tr          = $(this);
                            if(tr.hasClass("expandTR")){return;}
                            var rowGroup = _this.getRowGroup(tr);
                            if(event.type=="mouseover"){
                                rowGroup.addClass("hover");
                            }else if(event.type=="mouseout"){
                                rowGroup.removeClass("hover");
                            }
                        });
                    }
                }{}
                                
                //컬럼의 길이를 조절 할 수 있는 이벤트
                if(config.rotateColumn){
                    this._rotateMode();
                }
                
                //컬럼을 보여주고 안보여주는 필드를 설정 할 수 있는 이벤트
                if(config.chooseColumn){
                	this._chooseMode();
                }
                
                //컬럼의 길이를 조절할수 있는 이벤트
                if(config.columnResizable){
                    this._columnResizeMode();
                }
                
                //row를 확장하여 컬럼을 추가로 보여 줄 수 있는 이벤트
                if(config.expandColumn){
                    this._expandMode();
                }
                
                //컬럼을 슬라이더형식으로 그룹단위로 보여주고 안보여주는 이벤트
                if(config.slideColumn){
                	this._slideMode();
                }
                
                //tbody의 TD를 클릭시 에디트 모드 이벤트와 셀렉트 모드 이벤트 ($editAndSelectEvent) 바인딩 
                tbodyTable.bind("click keydown",{target:_this.tbodyTable},_this._editAndSelectEvent);
            },
            
            _slideMode : function(){
            	_this.containerDiv.addClass("slideMode");
            	
            	var prevLeft = _this.tbl.find("THEAD TH[x="+$("col.slidable",_this.colgroup).eq(0).index()+"]")[0].offsetLeft;
            	
            	var prevBtn = $('<input type="button" value="이전 컬럼 보기" class="sprite slide_able prev disabled" disabled="disabled" style="position:absolute;left:'+prevLeft+'px;"/>');
            	var nextBtn = $('<input type="button" value="다음 컬럼 보기" class="sprite slide_able next" style="position:absolute;right:0;" />');
            	
            	
            	prevBtn.on("click",function(){
            		nextBtn.removeClass("disabled").prop("disabled",false);
            		var cols = $("col",_this.colgroup), showedCol = cols.filter(".slidable").not(".hiddenable"), showedColSize = (showedCol.size()-1),
            		    targetCol = showedCol.first().prev();
            		for( var i = 0; i < config.slideCount; i++){
            			if(targetCol.hasClass("slidable")){
            				showedCol.eq(showedColSize - i).addClass("hiddenable");
            				targetCol = targetCol.removeClass("hiddenable").prev();
        				}else{
        					prevBtn.addClass("disabled").prop("disabled",true);
        					_this.tableBodyDiv.focus();
        					break;
        				}
        			}
            		
            		_this._makeInternalStyle(cols);
            	});
            	
            	nextBtn.on("click",function(){
            		prevBtn.removeClass("disabled").prop("disabled",false);
            		var cols = $("col",_this.colgroup), showedCol = cols.filter(".slidable").not(".hiddenable"),
            		targetCol = showedCol.last().next();
            		for( var i = 0; i < config.slideCount; i++){
            			if(targetCol.hasClass("slidable")){
            				showedCol.eq(i).addClass("hiddenable");
            				targetCol = targetCol.removeClass("hiddenable").next();
        				}else{
        					targetCol = targetCol.next();
        					if(targetCol.size()==0){
        						nextBtn.addClass("disabled").prop("disabled",true);
        						_this.tableBodyDiv.focus();
            					break;
        					}
        				}
        			}
            		
            		_this._makeInternalStyle(cols);
            	});
            	
            	/*
            	_this.resizeEventArray.push(function(){
            		console.log($("col.slidable",_this.theadColGroup).not(".hiddenable").eq(0).offset());
            	});
            	*/
            	
            	_this.containerDiv.prepend(nextBtn);
            	_this.containerDiv.prepend(prevBtn);
            },
            
            _expandMode : function(){
            	_this.containerDiv.addClass("expandMode");
            	
            	//ori테이블 TR에 하버가 일어날 경우 fix테이블에도 동일하게 발생
                _this.tbodyTable.delegate(".expand_able","click.expandMode",function(event){
                	var tr = $(this).closest("TR");
                	
                	var expandIcon = $(this); 
                	if(expandIcon.hasClass("expand_collapse")){
                		expandIcon.removeClass("expand_collapse");
                		expandIcon.data("expandTR").detach();
                		return;
                	}
                	
                	var expandTR = expandIcon.data("expandTR");
                	if( expandTR === undefined ){
                		var tdText = '<table class="expandTable"><colgroup><col width="50%"/><col width="50%"/></colgroup><tbody>';
                		var tds = tr.find("TD");
                		var ths = _this.tbl.find("TH");
                		
                		$(".expandable",_this.colgroup).each(function(){
                			var index = $(this).index();
                			tdText+= '<tr class="expandTR">';
                			tdText+= '<td class="expandTD">'+ths.eq(index).text()+'</td>';
                			tdText+= '<td class="expandTD">'+tds.eq(index).text()+'</td>';
                			tdText+= "</tr>";
                		});
                		
                		tdText += "</tbody></table>";
                    	var colspan = tds.filter(":visible").size();
                    	expandTR = $("<tr class='expandableTR'><td colspan='"+colspan+"'>"+tdText+"</td></tr>");
                    	expandIcon.data("expandTR",expandTR);                    	
                	}
                	
                	expandTR.insertAfter(tr);                	
                	expandIcon.addClass("expand_collapse");
                });
            },
            
            _chooseMode : function(){
            	var buttonArea = $('<div style="text-align:right;position:relative;"><input type="button" class="chooseColumnButton" value="컬럼선택보기 설정" /><div class="chooseColumnDiv"><ul></ul><input type="button" value="적용" class="chooseColumnApply"/><input type="button" value="취소" class="chooseColumnCancel"/></div></div>');
            	buttonArea.insertBefore(_this.tableContainer);
            	
            	var chooseColumnDiv = buttonArea.find(".chooseColumnDiv");
            	var ul = buttonArea.find("ul");
            	
            	//컬럼선택보기 설정 버튼
            	buttonArea.find('.chooseColumnButton').on("click",function(){
            		ul.empty();
            		_this.colgroup.find("col").each(function(i){
            			
            			var target = _this.tableHeadDiv.find("[x="+i+"]");
            			var text = target.text();
            			if($(this).hasClass("hiddenable")){
            				ul.append("<li><label for='"+_this.id+"_"+this.id+"'><input type='checkbox' class='chooseColumnCheck' id='"+_this.id+"_"+this.id+"' data-colId='"+this.id+"' title='"+text+" 컬럼 보기'/>"+text+"</label></li>");
            			}else{
            				ul.append("<li><label for='"+_this.id+"_"+this.id+"'><input type='checkbox' class='chooseColumnCheck' id='"+_this.id+"_"+this.id+"' data-colId='"+this.id+"' title='"+text+" 컬럼 보기' checked='checked'/>"+text+"</label></li>");
            			}
            		});
            		chooseColumnDiv.show();
            	});
            	
            	//확인버튼
            	buttonArea.find(".chooseColumnApply").on("click",function(){
            		buttonArea.find(".chooseColumnCheck").each(function(){
            			var targetCol = _this.colgroup.find("#"+this.getAttribute("data-colId"));
            			if(this.checked){
            				targetCol.removeClass("hiddenable").addClass("choosable");
            			}else{
            				targetCol.removeClass("choosable").addClass("hiddenable");
            			}
            		});
            		
            		_this._makeInternalStyle();
            		chooseColumnDiv.hide();
            	});
            	
            	//취소버튼
            	buttonArea.find(".chooseColumnCancel").on("click keydown",function(e){
            		if(e.type=="keydown"){
            			var keyCode = e.keyCode || e.which; 				
    					if (keyCode == 9) { 
    					    if(!e.shiftKey){
    					    	chooseColumnDiv.hide();
    					    }					    
    					}
            		}else{
            			chooseColumnDiv.hide();
            		}
            	});
            },
            
            //tbody의 TD를 클릭시 에디트 모드 이벤트와 셀렉트 모드 이벤트
            _editAndSelectEvent : function(event){
            	if(event.type=="keydown"){
            		if(event.keyCode!=13){return true;}
            	}
                
            	var eventEle=event.srcElement? event.srcElement : event.target;
            	
            	var tr = eventEle;
                var td = undefined;
                while(tr.nodeName != "TR"){
                    if(tr.nodeName=="TD")      {td = tr;}
                    if(tr.nodeName == "TABLE") {break;}
                    tr = tr.parentNode;
                    
                    if(tr == null) return;
                }
                
                if( tr.parentNode.nodeName=="THEAD" || tr.className.indexOf("expand") > -1 ){
                	return;
                }
                
                tr = $(tr);
                
                var selectClassName = config.selectClassName;
                if(event.shiftKey){
                    if(_this.selectedTR !== undefined){
                    	var lastSelectedTR = _this.selectedTR.last(); 
                    	
                        var startIndex = lastSelectedTR.get(0).rowIndex;
                        var endIndex   = tr.get(0).rowIndex;
                        
                        if(endIndex>startIndex){
                        	for( var i =0 ; i < (endIndex -startIndex); i++ ){
                            	var nextTR = lastSelectedTR.next();
                            	_this.selectedTR = _this.selectedTR.add(nextTR.addClass(selectClassName));
                            	lastSelectedTR = nextTR;
                            }
                        }else{
                        	for( var i =0 ; i < (startIndex - endIndex); i++ ){
                            	var nextTR = lastSelectedTR.prev();
                            	_this.selectedTR = _this.selectedTR.add(nextTR.addClass(selectClassName));
                            	lastSelectedTR = nextTR;
                            }
                        }
                    }else{
                    	_this.selectedTR = tr.addClass(selectClassName);
                    }
                }else if(event.ctrlKey){
                	var targetTR = _this.getRowGroup(tr).addClass(selectClassName);
                    if(_this.selectedTR !== undefined){
                    	_this.selectedTR = _this.selectedTR.add(targetTR);
                    }else{
                    	_this.selectedTR = targetTR;
                    }
                }else{
                    if(_this.selectedTR !== undefined){
                    	_this.selectedTR.removeClass(selectClassName);
                    }
                    _this.selectedTR = _this.getRowGroup(tr).addClass(selectClassName);
                }
                
                if(config.onclick !== undefined){
                    if(_this.onEvent === true){
                    	if(event.type=="keydown"){//엔터 입력으로 onclick시는 td가 없음
                    		td = tr;
                    	}
                    	
                    	if(td===undefined){
                    		return;
                    	}
                    	
                        if(typeof onclick == 'function'){
                            config.onclick(td,_this,event);
                        }else{
                            eval(config.onclick)(td,_this,event);
                        }
                    }
                }
            },
            
            _initSetTableHeadMeta : function(){
            	//Table의 길이를 설정
                var tblWidth = 0;
                
                
                //IE8버그(hidden 또는 다시 보이게 하는 컨트롤시 )
                if(GRID_BROWSER=="IE8"){
                    _this.tableBodyDiv.addClass("displayTable");
                }
                
                //먼저 CSS를 만들고 아래 table 길이를 설정해야 정상설정
                this._makeInternalStyle();
                var col = this.col;
                for(var i =0, ic = col.size(); i < ic; i++ ){
                    try {
                        var targetCol = col.eq(i);
                        var w = targetCol.attr("width");
                        if(w === undefined || w == null || w==""){  //IE7의 경우는 "" 으로 나오내..
                            var inlineStyle= targetCol.attr("style");
                            if(inlineStyle !== undefined && inlineStyle != "undefined"){
                                var expression = 'width.*?[x|%]';
                                var result = inlineStyle.match(new RegExp(expression,'g'));
                                if(result!=null){
                                    w = (""+result[0]).split(":")[1];
                                }
                            }
                        }
                        
                        if(w==null||w==""||w=="*"){
                            if(targetCol.hasClass("hiddenable")||targetCol.hasClass("rotatable")){
                                w = 0;
                            }else{
                                this.isRelativeCol = true;
                                tblWidth = 0;
                                break;
                            }
                        }
                        
                        if(w.indexOf("%")>0){
                            tblWidth = 0;
                            this.isRelativeCol = true;
                            break;
                        }

                        w = parseInt(w);
                        
                        if(targetCol.hasClass("hiddenable")||targetCol.hasClass("rotatable")){
                            w = 0;
                        }
                        
                        if (w > 0) {
                            tblWidth = tblWidth + w;
                        }
                    }catch(e){
                        tblWidth = 0;
                        log(e.message,"ERROR_theadTableWidthSetting_initSetTableHeadMeta");
                    }
                }
                
                if(tblWidth > 0){
                    this.tbodyTable.css("width",tblWidth);
                }else{
                    this.tbodyTable.css("width",this.containerWidth-SCROLL_BAR_WIDTH);
                }
                
                if(GRID_BROWSER=="IE8"){
                    _this.tableBodyDiv.removeClass("displayTable");
                }
                
                if(_this.scrollBar){ _this.scrollBar.resize(); }
            },
            
            _makeInternalStyle : function(cols){
                this.col = $("col",this.colgroup);
            	
            	if(!cols){
                    cols = this.col;
                }
                
                //col 의 align 속성을 테이블의 각 td에 부여하기 위해 inline Style의 스타일 시트를 만들어 head에 붙임 
                var cssTxt = '';
                var cssTxt_head = '';

                var cols_body = $("col", this.tbodyTable);
                for( var i = 0 , ic = cols.size(); i < ic ; i++ ){
                    var targetCol = cols.eq(i);
                    var targetColBody = cols_body.eq(i);
                    
                    //셀 정렬 
                    var txtAlign = targetCol.attr("align");
                    if( txtAlign === undefined || txtAlign == '' || txtAlign.length == 0 ){
                        txtAlign = config.gridTextAlign;
                    }
                    targetCol.attr("align",txtAlign);

                    cssTxt = cssTxt + "#"+ _this.id + ' td:first-child ';
                    cssTxt_head = cssTxt_head + "#"+ _this.id + ' th:first-child ';
                    for ( var j = 0; j < i; j++) {
                        cssTxt = cssTxt + ' + td';
                        cssTxt_head = cssTxt_head + ' + th';
                    }
                    
                    //셀 hidden hidden 모드 일시 셀모드를 우선한다.
                    if(targetCol.hasClass("hiddenable") || targetCol.hasClass("hidden")){
                        cssTxt = cssTxt + ' {text-align:' + txtAlign + ';display:none;} ';
                        cssTxt_head = cssTxt_head + ' {display:none;}';
                    }else{
                        //셀 고정
                        var cellFixTxt = '';
                        if(targetCol.hasClass("fixable")){
                            cellFixTxt = "display:none;"; 
                            targetCol.hide();
                            targetColBody.hide();
                            
                            if(GRID_BROWSER=="IE7"){//IE7은 답이 읍내..패딩이 없다면 가능한디.
                            	targetCol.hide();
                                targetColBody.hide();
                            }
                        }
                        
                        cssTxt = cssTxt + ' {text-align:' + txtAlign + ';' + cellFixTxt + '} ';
                        cssTxt_head = cssTxt_head + ' {' + cellFixTxt + '} ';
                    }
                }
                
                if(GRID_BROWSER=="IE7"||GRID_BROWSER=="IE6"){ 
                    return;
                }
                
                var internalCss = cssTxt + cssTxt_head;
                
                if(GRID_BROWSER.indexOf("IE")==0){
                    var style = document.getElementById("ciGrid_internalCss");
                    if(style === null){
                        style = document.createElement('style');
                        style.setAttribute("type", "text/css");
                        style.setAttribute("id", "ciGrid_internalCss");
                        document.getElementsByTagName('head')[0].appendChild(style);
                    }
                    
                    var beforeStyle = style.styleSheet.cssText;
                    beforeStyle = beforeStyle.replace(/\r|\n|\r\n/g, "");//기존 스타일을 1줄단위로 변경 
                    
                    //동일한 id의 기존 css 제거(무한정 늘어나는 것을 방지.. IE의 경우 32개의 style 태크 제한이 있다... style이 32개가 초과 하면 오류 발생)
                    var expression = "#"+_this.id+"[^}]*}";
                    var result      = beforeStyle.match(new RegExp(expression,'ig'));
                    if(result!=null&&result.length>0){
                        beforeStyle = beforeStyle.replace(result.join(""),"");
                    }
                    
                    style.styleSheet.cssText = beforeStyle+internalCss;
                }else{
                    var style = document.getElementById(this.id+"_internalCss");
                    if(style === null){
                        style = document.createElement('style');
                        style.setAttribute("type", "text/css");
                        style.setAttribute("id", this.id+"_internalCss");
                        document.getElementsByTagName('head')[0].appendChild(style);
                    }
                    style.innerHTML = internalCss;
                }
                
                _this.resizing();
            },
            
            //*
            rotateColumn:function(colId,colId2){
                $("col[id=\""+colId2+"\"]", this.colgroup).removeClass("hiddenable");
                $("col[id=\""+colId+"\"]" , this.colgroup).addClass("hiddenable");
                this._makeInternalStyle();
            },
            
            hideColumn:function(args,isMakeStyle){
                if(typeof args=="string"){ args = [args]; }
                
                for( var i =0, ic = args.length; i < ic; i++ ){
                    var targetId = args[i];
                    $("col[id=\"col_"+targetId+"\"]", this.colgroup).addClass("hiddenable");
                    $("col[id=\"col_"+targetId+"\"]", this.tbodyTable).addClass("hiddenable");
                }
                
                if(isMakeStyle === undefined ? true : isMakeStyle){
                    this._makeInternalStyle();
                }
            },
            
            showColumn:function(args,isMakeStyle){
                if(typeof args=="string"){ args = [args]; }
                
                for( var i =0, ic = args.length; i < ic; i++ ){
                    var targetId = args[i];
                    $("col[id=\"col_"+targetId+"\"]", this.colgroup).removeClass("hiddenable");
                    $("col[id=\"col_"+targetId+"\"]", this.tbodyTable).removeClass("hiddenable");
                }
                if(isMakeStyle === undefined ? true : isMakeStyle){
                    this._makeInternalStyle();
                }
            },
            //*/
            
            removeColPrefix : function(colId){
            	return colId.substring(4);
            },
            
            _rotateMode : function(){
                var rotateIcon  = '<div class="rotate_able" style="background:transparent;position:absolute;top:0px;right:0;width:30px;height:100%;">';
                rotateIcon     += '<button type="button" class="sprite" style="cursor:pointer;float:right;width:15px;height:15px;display:block;margin:0;padding:0;border:none;background-position:-65px -10px;"></button>';
                rotateIcon     += '</div>';
                
                $("th",this.thead).each(function(k){
                    var thElement = $(this);
                    if(thElement.attr("y")!=0){
                        //return true;//제일 첫번째꺼에만 생성
                    	rotateIcon = '<div class="rotate_able" style="background:transparent;position:absolute;top:0px;right:0;width:30px;height:100%;"></div>';
                    }
                    
                    var targetCol = _this.col.eq(thElement.attr("x"));
                    var rotate    = targetCol.attr("data-rotate");
                    if(rotate){
                        var theadColId = _this.removeColPrefix(targetCol.attr("id"));
                        var rotateOrder = rotate.split(",");
                        
                        var currentCol = undefined;
                        var nextCol = undefined;
                        
                        for( var i = 0, ic = rotateOrder.length; i < ic; i++ ){
                            if(rotateOrder[i] == theadColId){
                                currentCol = rotateOrder[i];
                                nextCol = rotateOrder[i+1];
                                
                                if(nextCol===undefined){
                                    nextCol = rotateOrder[0];
                                }
                            }
                        }
                        
                        var rotaterObj = $(rotateIcon).clone();
                        rotaterObj.bind("click",function(){
                            _this.rotateColumn("col_"+currentCol,"col_"+nextCol);
                        });
                        
                        $(".tdWrapper",thElement).eq(0).append(rotaterObj);
                    }
                });
            },
            
            resizing : function(){
                //funcResizing
                if(this.isResizing) return;
                if(this.tbodyTable.is(":hidden")){return;}//보이지 않는 테이블은 리사이징 하지 않음
                
                this.isResizing=true;
                try{
                    //모바일 환경에서 화면당 4개의 컬럼을 보여주고 기울기 변경시 자동으로 사이즈 조정
                    if(GRID_DEVICE=="mobile"&& config.mobileAutoWidth==true){
                    	
                    	var colgroup = this.colgroup;
                    	var cols = colgroup.find('col');
                        
                        var targetTable = this.tbl;
                        var colsPerViewport = targetTable.attr('data-colnum') === undefined ? 4 : targetTable.attr('data-colnum') ;
                        cols.removeAttr('width');
                        var visibleCol =colgroup.find('col:not(.hiddenable)'); 
                        if(visibleCol.size() < colsPerViewport){
                            colsPerViewport = visibleCol.size();
                        }
                        var viewportWidth = _this.tableContainer.width();
                        var colWidth = viewportWidth/colsPerViewport;
                        cols.outerWidth(colWidth);
                        cols.attr('width', colWidth);
                        
                        //이작업은 컬럼 리사이즈에서만 필요한듯해서 일단 주석
                        var tbodyColGroup = this.tbodyTable.find("colgroup");
                        tbodyColGroup.empty().append(cols.clone());
                    }
                    
                    //IE8버그(hidden 또는 다시 보이게 하는 컨트롤시 )
                    if(GRID_BROWSER=="IE8"){
                        _this.tableBodyDiv.addClass("displayTable");
                    }
                    
                    if(_this.isRelativeWidth){
                        //100%테이블일때 안보이는 경우(display) width가 제대로 나오지 않음
                    	_this.containerWidth  = this.containerDiv.parent().width();
                        if(_this.isRelativeCol){    //col이 %
                            var w = _this.containerWidth - SCROLL_BAR_WIDTH;
                            if(w!=0){
                                this.tbodyTable.width(w);
                            }
                        }else{
                        	
                        }
                    }else{  //width가 px일때
                    	_this.containerWidth = config.width;  
                    }
                    
                    if(GRID_BROWSER=="IE8"){
                        _this.tableBodyDiv.removeClass("displayTable");
                    }
                }catch(e){
                    log(e.message, 'resizing' );
                }
                
                for( var i =0, ic = _this.resizeEventArray.length; i < ic ; i++ ){
                	_this.resizeEventArray[i]();
    			}
                
                if(_this.scrollBar){ _this.scrollBar.resize(); }
                
                this.isResizing = false;
            },
            
            _ajax : function(param){
                _this.tbody.hide();
                var ajaxOptions = new Object();
                if (param){$.extend(ajaxOptions, param);}
                
                //사용자가 지정한 callback함수를 저장한다. 내부 callback 함수를 수행후 사용자의 callback 함수를 호출 
                ajaxOptions['success']   = param.success; 
                ajaxOptions['error']     = param.error;
                ajaxOptions['complete']  = param.complete;
                
                //callback 함수를 내부 callback 함수로 변경
                param['success']   = function(data,textStatus,jqXHR){  _this._onSuccess (data,textStatus,jqXHR,ajaxOptions);  };
                param['error']     = function(jqXHR,textStatus,errorThrown){  _this._onError   (jqXHR,textStatus,errorThrown,ajaxOptions);  };
                param['complete']  = function(jqXHR,textStatus){  _this._onComplete(jqXHR,textStatus,ajaxOptions);  };
                $.ajax(param);
            },
            
            _onSuccess : function(data,textStatus,jqXHR,ajaxOptions){
                _this.html(data);
                    
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
                _this.tableBodyDiv.get(0).scrollTop=0;  
                _this.tbody.show();
                
                if(ajaxOptions!==undefined && ajaxOptions['complete']){
                    ajaxOptions['complete'](jqXHR,textStatus);
                }
            },
            
            updateBody : function(formObj,settings){
                _this.lastAjaxForm = formObj.clone();

                //셀렉트 박스는 선택된 값이 복사가 안되어 선택된 값을 다시 넣어줌.
                var origSels = $('select', formObj);
                var clonedSels = $('select', _this.lastAjaxForm);
                origSels.each(function(i) {
                    clonedSels.eq(i).val($(this).val());
                });
                
                var param ={
                    url:_this.lastAjaxForm.attr("action"),
                    type:_this.lastAjaxForm.attr("method"),
                    data:_this.lastAjaxForm.serialize()
                };
                if (settings){$.extend(param, settings);}
                this._ajax(param);
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
            
            html : function(rows){
            	_this.reset();
                _this.tbody.html(rows);
            },
            
            appendRow : function(rows){
                //새로운 로우가 추가된다면 기존에 선택되었던 로우를 전부 unselect 한다.
                _this.unSelectRows();
                
                $(rows).each(function(){
                    var tr = $(this);
                    tr.attr("data-execute","append");
                });
            },
            
            reset :function(){
            	_this.selectedTR = undefined;
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
                var parent = $(childObject).get(0);
                while(parent.nodeName != "TR"){
                    if(parent.nodeName == "TABLE") break;
                    parent = parent.parentNode;
                }
                return $(parent);
            },
                       
            getRowGroup : function(row){
            	row = this.getRowFromChild(row);
                var nativeRow = row.get(0);
                var rowIndex = parseInt(nativeRow.sectionRowIndex);
                var rowGroupCount = this.dataRowGroupCount;
                var mod = rowIndex%rowGroupCount;
                var rowGroup = null; 
                /*
                var returnG= new Array();
                for(var i = 1; i<rowGroupCount; i++){
                    var q = -(i) + mod;
                    var c = q >= 0 ? q+1 : q;
                    returnG.push(c);
                }
                */
                
                row = $(row);
                
                switch(rowGroupCount){
                    case "1":
                        rowGroup = row;
                        break;
                
                    case "2":
                        if(mod==0){
                            rowGroup = row.add(row.next());
                        }else if(mod==1){
                            rowGroup = row.add(row.prev());
                        }
                        break;
                    case "3":
                        if(mod==0){
                            rowGroup = row.add(row.next()).add(row.next().next());
                        }else if(mod==1){
                            rowGroup = row.add(row.prev()).add(row.next());
                        }else if(mod==2){
                            rowGroup = row.add(row.prev()).add(row.prev().prev());
                        }
                        break;
                    default:
                        rowGroup = $(row);
                        break;
                }
                
                return rowGroup;
            },
            
            //row 로부터 td의 값을 연관배열의 형태로 얻는다 설정되는 값은 col 태그의 id (ex: <col id="col_name" />으로 설정시 ['name']으로 값 참조 )
            getRowDataArray : function(row){
                var rowGroup = this.getRowGroup(row);
                
                var dataArray = new Array();
                rowGroup.each(function(i){
                    dataArray[i] = new Array();
                    $("TD",$(this)).each(function(j){
                        dataArray[i][j+""] = $(this).text();
                    });
                });
                return dataArray;
                /*
                row = _this.getRowFromChild(row);
                var dataArray = new Array();
                $("td",row).each(function( i ){
                    var key = _this.col.eq(i).attr("id");
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
                */
            },
            
            //현재 선택된 행을 반환
            getSelectedRow : function(){
                return _this.selectedTR;
            },
            
            //현재 선택된 행을 반환(multi)
            getSelectedMultiRow : function(){
                return _this.selectedTR;
            },
            
            //현재 선택된 행의 데이터 반환(연관 배열 형태)
            getSelectedRowData : function(){
                return _this.getRowDataArray(_this.selectedTR.last());
            },
            
            //현재 선택된 행의 데이터 반환(multi)
            getSelectedMultiRowData : function(){
                var selectedArray = new Array();
                _this.selectedTR.each(function() {
                    selectedArray.push( _this.getRowDataArray($(this)) );
                });
                
                return selectedArray;
            },
            
            //선택된 row들을 해제
            unSelectRows : function(){
            	_this.selectedTR.removeClass(config.selectClassName);
            	_this.selectedTR = undefined;
            },
            
            //그리드상의 모든 row의 갯수를 반환
            getRowCount : function(){
                return $("tbody > tr", this.tbodyTable).size();
            }
        };
        
        var _this = grid;
        
        var gridObject = grid.initialize(selector);
        _this.tbodyTable.data("object",gridObject);
        $("#"+_this.id).data("object",gridObject);
        return gridObject;
    };
    
    function getGridBrowser(){
        var browser = undefined;
        
        var ua =  navigator.userAgent.toLowerCase(),
        rwebkit = /(webkit)[ \/]([\w.]+)/,
        ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
        rmsie = /(msie) ([\w.]+)/,
        rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;
        var match = rwebkit.exec( ua ) ||ropera.exec( ua ) || rmsie.exec( ua ) || ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) || [];
        
        browser = match[1];
        if(browser == "msie"){
            //호환성보기를 무시하고 브라우저 버전을 체크 할수있다. IE8부터 유저정보에 추가
            var trident = navigator.userAgent.match(/Trident\/(\d.\d)/i);
            if(trident != null){
                
                var version = (trident[1]+"");
                if(version == "6.0"){
                    browser = "IE10";
                }else if(version == "5.0"){
                    browser = "IE9";
                }else if(version == "4.0"){
                    browser = "IE8";
                } else{
                    browser = "IE7";
                }
            }else{
                browser = "IE7";
            }
        }
        return browser;
    }
    
    function getScrollWidth(){
        //ScrollBar Width 구하기...
        var temp = document.createElement("div");
        temp.style.cssText = "position:absolute; top:-10000px; left:-10000px; width:100px; height:100px; overflow:scroll;"; 
        document.body.appendChild(temp);
        var scrollBarWidth = parseInt(temp.style.width) - parseInt(temp.clientWidth);
        document.body.removeChild(temp);
        delete temp;
        
        return scrollBarWidth;
    }
    
    function getCellIndex(cell){
        var row = cell.parentNode, tb = row.parentNode,
        // this may be any container with .rows (tbody, thead, table...)
        rows = tb.rows, rIndex = row.sectionRowIndex, numCols = 0, table = [], n,
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
                        "   <div style='float:left'> " +
                        "       Filter By Tag : <input type='text' id='consoleControlFilter' />" +
                        "   </div>" +
                        "   <div style='float:right'> " +
                        "       <input type='button' value='clear' onclick='document.getElementById(\"consoleLogArea\").innerHTML=\"\"' />" +
                        "       <input type='button' value='show' onclick='document.getElementById(\"consoleLogArea\").style.display=\"block\"'  />" +
                        "       <input type='button' value='hide' onclick='document.getElementById(\"consoleLogArea\").style.display=\"none\"'  />" +
                        "   </div>" +
                        "   <div style='clear:both'></div>" +
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