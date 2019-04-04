/*(function(ci){
    window.ci = ci;
    ci.keyboard = ci.keyboard||{};
    
    ci.keyboard.initialize = false;
    ci.keyboard.withShiftKey = false;
    ci.keyboard.withControlKey = false;
    
    if(!ci.keyboard.initialize){
        var $keydownEvent = function(e){
            var k = e.keyCode;
            if(k==16){
                ci.keyboard.withShiftKey = true;
                //$setSelection(!withShiftKey);
                //document.ondragstart=function(){return false;};
            }else if(k==17){
                ci.keyboard.withControlKey = true;
                //$setSelection(!_this.withControlKey);
                //document.ondragstart=function(){return false;};
            }
            
        };
        
        var $keyupEvent = function(e){
            var k = e.keyCode;
            if(k==16){
                ci.keyboard.withShiftKey = false;
                //$setSelection(!_this.withShiftKey);
                //document.ondragstart=function(){return true;};
            }else if(k==17){
                ci.keyboard.withControlKey = false;
                //$setSelection(!_this.withControlKey);
                //document.ondragstart=function(){return true;};
            }
            
        };
        
        if($.browser.msie){
            $(window.document).bind('keydown.interestCode',$keydownEvent);
            $(window.document).bind('keyup.interestCode', $keyupEvent);
        }else{
            $(window).bind('keydown.interestCode', $keydownEvent);
            $(window).bind('keyup.interestCode', $keyupEvent);
        }
        
        ci.keyboard.initialize  = true;
    }
})(window.ci||{});*/
    
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
    /*
    $(document).ready(function() {
        SCROLL_BAR_WIDTH = getScrollWidth();
    });
    */
    $.dataGrid = function(selector, settings){

        // settings
        var config = {
            'width'             :'100%',
            'height'            :200,
            'rows'              :undefined,
            'gridInfo'          :false,
            'displayHeader'     :true,
            'columnResizable'   :false,
            'multiSelectable'   :true,
            'onclick'           :undefined,
            'hover'             :true,
            
            'hiddenColumn'      :undefined,
            'fixColumn'         :undefined,
            'sortColumn'        :undefined,
            'editColumn'        :undefined,
            'rotateColumn'      :undefined,
            'chooseColumn'      :undefined,
            'selectColumn'		:undefined,
            'expandColumn'      :undefined,
            'slideColumn'		:undefined,
            'slideCount'		:4,
            'paging'            :{rows:undefined,type:'1',query:false,page:1},
            'server'            :undefined,  //{bld:'samples/database/listCities',view:'/common/component/grid/example/server_data.jsp',sort:"airport"}

            'showInit'          :true,
            'selectClassName'   :'selectedTR',
            'gridTextAlign'     :'right',
            'gridPath'          :GRID_HOME,
            
            'mobileAutoHeight'  :true,
            'mobileAutoWidth'   :true,
            'showScrollToolTip' :false
        };
        
        var rowsHeight = {
        	"5":"134",
        	"6":"161",
        	"10":"269",
        	"8":"215",
        	"20":"539",
        	"23":"620"
        };
        
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
                
                //그리드가 hidden처리 되어 있으면(자신이든 부모든) width값을 제대로 잡아내지 못함
                var unVisibleParent = undefined;
                if(!this.tbl.is(":visible")){
                    //unVisibleParent = this.tbl.parents().not(":visible");
                    //unVisibleParent.show();
                }
                
                this.resizeEventArray = [];
                
                this.totalCount = 0;                //그리드 총 로우 개수
                this.gridCurrentPage = 1;           //페이징 모드 사용시 그리드가 표현하고 있는 페이지 번호
                this.isColumnResizing = false;      //컬럼의 리사이징이 발생하고 있는지 체크 ( 이 값으로 리사이징 이벤트시 정렬이벤트가 발생되는것을 막는다. )
                this.isRelativeWidth = false;       //table의 width 값이 %로 설정되어있는지 px로 설정되어 있는지 체크
                this.isRelativeCol = false;         //col의 width 값이 %로 설정되어있는지 px로 설정되어 있는지 체크
                this.withControlKey = false;        //table의 row를 선택시 control 키를 누른상태로 선택중인지 체크 ( for multiSelectable ) 
                this.withShiftKey = false;          //table의 row를 선택시 shift   키를 누른상태로 선택중인지 체크 ( for multiSelectable )
                this.selectedRows = new Array();    //선택된  row를 가지고있는 배열   
                this.lastSelectedTRIndex = null;    //마지막으로 선택된 row의 인덱스 값을 저장하고 있는 변수
                this.colPadding = null;             //table td padding
                this.lastAjaxForm = null;           //마지막으로 Ajax처리가 된 폼의 정보 (updateBody 또는 sendServer시 사용한 정보
                
                this.rowArray = {};                 //연관배열로 사용되며 인덱스는 0부터 시작 rows가 설정되었다면 rows만큼이 하나의 인덱스를 사용 rows가 없다면 전체가 index 0에 설정
                this.currentRowArrayIndex = 0;
                this.selectedRowArray = {};         //선택된  row를 가지고있는 Object 키는 tr의 data-uuid에 저장된 값으로 uuid에 의해 생성된값..   
                this.editedRowArray   = {};         //추가editedRowArray["append"], 수정editedRowArray["update"], 삭제editedRowArray["remove"] 된 rowArray를 담고있는 배열
                this.editedRowArray["append"]= [];
                this.editedRowArray["update"]= [];
                this.editedRowArray["remove"]= [];
                
                this.cellFixMode = false;           //셀고정 모드인지 아닌지 설정  ( col tag의 class 속성에 fixable 있는경우 true로 변경됨 )
                this.tableContainerFixWidth = 0;
                
                this.heightByRow = undefined;
                if(config.rows!==undefined){
                    config.height = rowsHeight[config.rows];
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
                    slideColumn = undefined;
                }else{
                    config.columnResizable = false;
                }
                
                var dataGridAttr = this.tbl.attr("data-grid");
                this.tbl.removeAttr("data-grid");
                this._initLayout(selector);
                this.tbodyTable.attr("data-grid",dataGridAttr);
                //containerDiv;tableContainer;tableHeadDiv;tableBodyDiv;
                
                //wts전용으로 모바일에서 모든 그리드는 7줄 사이즈 기준으로 보여줌
                if(GRID_DEVICE=="mobile" && config.mobileAutoHeight==true){
                    //this.updateGridHeight(this.trHeight*8);
                    this.updateGridHeight("auto");
                }
                
                
                
                
                
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
                
                
                if(unVisibleParent!==undefined){
                    //unVisibleParent.hide();
                }
                return this;
            },
            
            _initLayout : function(selector){
                this.tbl = $(selector);
                this.tbl.css({"table-layout":"fixed","display":"table","empty-cell":"show"}).removeClass("type2");
                this.tbl.attr("width",this.tbl.width());//%일 경우
                this.tbl.get(0).cellPadding = "0";
                this.tbl.get(0).cellSpacing = "0";
                this.trReference = $("tbody tr",this.tbl).clone();
                this.dataRowGroupCount = $("TBODY",this.tbl).attr("data-rowgroup")===undefined ? "1" : $("TBODY",this.tbl).attr("data-rowgroup");
                this.id  = this.tbl.attr("id");
                
                if(config.onclick){
                	//_this.tbl.find("tbody tr").attr("tabindex","0");
                }
                
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
                
                var gridInfoArea = "";
                if(config.gridInfo){
                    gridInfoArea  = '<div class="gridInfoBar">';
                    gridInfoArea += '   <div class="gridPageInfo" style="text-align:right;">';
                    gridInfoArea += '       총 <span id="gridInfo_'+this.id+'_count" >0</span>건 <span id="gridInfo_'+this.id+'_page" style="margin-left:10px;"></span>';
                    gridInfoArea += '   </div>';// end of <div class="gridPageInfo">
                    gridInfoArea += '   <div style="clear:both;"></div>';
                    gridInfoArea += '</div>';//end of <div class="gridInfoBar">
                    
                    gridInfoArea = $(gridInfoArea);
                    
                    //gridInfoBar 높이를 전체 높이에서 빼줌. 20사이즈는 gridInfoBar class 에 정의되있음.
                    configHeight = parseInt(configHeight)-20;
                }
                
                var theadTable = this.tbl.clone();
                theadTable.get(0).id = this.id+"_head";//attr로 하니까 7에서 tbodyTable까지영향(jQuery버그)
                //theadTable.css("border-collapse","separate");  //display:none 됐을경우 잔상제거(seperate)..

                
                //****************************************************************************/
                //theadTable은 데이터 테이블이 아니고 레이아웃용이기 때문에 caption과 summary가 필요 없다.
                //또한 thead영역이 존재하지만 실제 tbody가 없으므로 thead는 사용하면 안됨 th가 아닌 td로 구성
                var theadTableHead = theadTable.find("thead");
                var theadHtml = "<tbody class='layoutTableBody'>"+theadTableHead.html().replace(/<th/ig,"<td").replace(/th>/ig,"td>")+"</tbody>";
                theadTable.empty().append(this.tbl.find("colgroup").clone()).append(theadHtml);
                theadTable.removeAttr("summary");
                theadTable.find("td[id]").each(function(){
                	this.id = "head_"+this.id;//웹접근성 아이디가 겹치므로 head는 head_를 붙여 준다.
                });
                //****************************************************************************/

                
                var tbodyTable = this.tbl;
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
                //fixable 모드일 때 보더가 겹쳐서 전체 컨테이너 사이즈를 늘려줘야 떨어지지 않음.
                
                //display:table : IE8에서 display:none 된 칼럼 사이즈가 있을경우 헤더 셀크기가 재조절이 안되는 버그 수정.
                var tableHeadDiv = $(document.createElement('div'))
                .attr('class','tableHeadDiv')
                .attr('style','overflow-x: hidden;overflow-y: hidden;display:table;');
                
                var cursor = config.onclick === undefined ? "" : " bindEvent" ;
                var tableBodyDiv = $(document.createElement('div'))
                .attr('class','tableBodyDiv'+cursor).attr("tabindex","0")
                .attr('style','overflow-x: auto;overflow-y: scroll;width:100%;height:'+configHeight+'px;'+cursor);
                //width:100%는 IE6 scroll에서 필요..
                
                var loadingImage = $(document.createElement('img'))
                .attr('src',config.gridPath+"/img/ajax-loader.gif")
                .attr('id',this.id+"_loadingImage")
                .attr('style','position:absolute;top:'+(configHeight/2)+'px;display:none')
                .attr('alt','WTS 로딩 이미지');
                
                containerDiv.insertBefore(tbodyTable);
                tableHeadDiv.append(theadTable);
                tableBodyDiv.append(tbodyTable);
                tableContainer.append(tableHeadDiv);
                tableContainer.append(tableBodyDiv);
                containerDiv.append(tableContainer);
                containerDiv.append(gridInfoArea);
                //containerDiv.append(loadingImage);
                
                if(config.showScrollToolTip&&GRID_DEVICE=="mobile"){
                    $("<div style='margin:0 auto;margin-right:0;width:60px;height:21px;background-size:100%;line-height:21px;background: url(/WEB-APP/_webponent/grid/img/img_slide.png) center center no-repeat;'></div>").insertBefore(containerDiv);
                }
                
                //========================================전역변수 설정=========================================
                this.theadTable = theadTable;
                this.tbodyTable = tbodyTable;
                this.tableHeadDiv = tableHeadDiv;
                this.tableBodyDiv = tableBodyDiv;
                this.tableContainer = tableContainer;
                this.loadingImage = loadingImage;
                this.containerDiv = containerDiv;
                this.thead = $("thead",theadTable);
                this.tbody = $("tbody",tbodyTable).attr("id","tbody_0");
                
                //colPadding과 tr의 높이 구하기
                var tempTR = $("<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td></tr>");
                this.tbl.append(tempTR);
                this.trHeight = tempTR.outerHeight();
                if( this.colPadding == null){
                    var tempTD = $("TD",tempTR).eq(1);
                    var innerWidth = tempTD.innerWidth();
                    var tdWidth = tempTD.width();
                    this.colPadding = innerWidth - tdWidth;
                    
                    var outerWidth = tempTD.outerWidth(false);
                    this.tdBorderWidth = outerWidth - innerWidth;
                    
                    //alert(outerWidth+": "+innerWidth+""+(outerWidth - innerWidth));
                }
                
                tempTR.remove();//필요 없으므로 삭제
                
                //컬그룹 기본 설정
                this.theadColGroup = $("colgroup", this.theadTable);
                if(this.theadColGroup.size()==0){
                    var colsgrp = $(document.createElement('colgroup'));
                    for(var i = 0,i2 = $("td",this.theadTable), i3 = i2.size(); i < i3; i++ ){
                        var c = i2.eq(i).attr("colspan");
                        if(!c){
                            c = 1;
                        }
                        for(var j =0; j < c; j++){
                            var col = $(document.createElement('col'));
                            colsgrp.append(col);
                        }
                    }
                    this.theadColGroup = colsgrp;
                }
                this.theadCols = $("col", this.theadColGroup);
                //thead의 rowspan 및 colspan설정 또한 임의의 속성 x, y 추가
                for ( var i = 0, i2 = theadTable.get(0).rows, i2c = i2.length; i < i2c; i++) {
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
                
                //웹표준 코딩 문제로 width 속성을 사용할수 없어 style의 width값을 가져와 width속성값을 설정(width속성이 설정하기 용이.)
                this.theadCols.each(function(k){
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
                
                //로테이트 컬럼 설정(해당 col의 class에 rotatable을 추가하고 data-rotate 속성을 부여);
                if(config.rotateColumn !== undefined){
                    var rotateColumn = config.rotateColumn;
                    for(var i in rotateColumn){
                        var rotateArray = rotateColumn[i];
                        var rotateGroup = rotateArray.slice();
                        rotateGroup.unshift(i);
                        $("col[id=\"col_"+i+"\"]", this.theadColGroup).addClass("rotatable").attr("data-rotate",rotateGroup.join(","));
                        for( var j = 0, jc = rotateArray.length; j < jc; j++ ){
                            $("col[id=\"col_"+rotateArray[j]+"\"]", this.theadColGroup).addClass("rotatable hiddenable").attr("data-rotate",rotateGroup.join(","));
                        }
                    }
                }
                
                //choose 컬럼 설정(해당 col의 class에 choosable을 추가 한다.)
                var choosable = this.theadColGroup.find(".choosable");
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
                	this.theadColGroup.find("col").addClass("hiddenable");
                	for( var i = 0, ic = chooseColumn.length; i < ic ; i++ ){
                        $("col[id=\"col_"+chooseColumn[i]+"\"]", this.theadColGroup).removeClass("hiddenable").addClass("choosable");
                    }
                }
                
                //히든 컬럼 설정(해당 col의 class에 hiddenable을 추가 한다.)
                if(config.hiddenColumn !== undefined){
                    var hiddenColumn = config.hiddenColumn;
                    for( var i = 0, ic = hiddenColumn.length; i < ic ; i++ ){
                        $("col[id=\"col_"+hiddenColumn[i]+"\"]", this.theadColGroup).addClass("hiddenable");
                    }
                }
                
                //확장 컬럼 설정(해당 col의 class에 hiddenable을 추가 한다.)
                if(config.expandColumn !== undefined){
                    var expandColumn = config.expandColumn;
                    for( var i = 0, ic = expandColumn.length; i < ic ; i++ ){
                        $("col[id=\"col_"+expandColumn[i]+"\"]", this.theadColGroup).addClass("expandable").addClass("hiddenable");
                    }
                }else{
                	if(this.theadCols.hasClass("expandable")){
                		var expandableArr = new Array();
                		this.theadCols.filter(".expandable").each(function(){
                			expandableArr.push(_this.removeColPrefix($(this).addClass("hiddenable").attr("id")));
                		});
                		config.expandColumn = expandableArr;
                	}
                }
                
                //슬라이드 컬럼 설정(해당 col의 class에 slidable 추가 한다.)
                if(config.slideColumn !== undefined){
                    var slideColumn = config.slideColumn;
                    for( var i = 0, ic = slideColumn.length; i < ic ; i++ ){
                    	var targetCol = $("col[id=\"col_"+slideColumn[i]+"\"]", this.theadColGroup);
                    	targetCol.addClass("slidable");
                        if(config.slideCount < (i+1)){
                        	targetCol.addClass("hiddenable");
                        }
                    }
                }else{
                	if(this.theadCols.hasClass("slidable")){
                		var slidableArr = new Array();
                		this.theadCols.filter(".slidable").each(function(index){
                			if(config.slideCount < (index+1)){
                				$(this).addClass("hiddenable");
                			}
                			slidableArr.push(_this.removeColPrefix($(this).attr("id")));
                		});
                		config.slideColumn = slidableArr;
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
                
                //에디트 컬럼 설정
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
                
                /*!!!모든 col과 head의 설정이 끝났다면 theadCol에 설정된 모든 속성을 tbodyCol에도 전달!!!*/
                $("colgroup",this.tbodyTable).replaceWith(this.theadColGroup.clone());
                
                //col의 클래스중 fixable이 포함되어 있다면 아래의 코드를 추가
                if( $("col[class*=\"fixable\"]", this.theadColGroup).size() > 0 ){
                    var theadTableFix = this.theadTable.clone();
                    theadTableFix.attr("id", this.id+"_headFix");
                    
                    var tbodyTableFix = this.tbodyTable.clone();
                    //웹접근성 이슈 관련 fix 된 테이블은 layout table이 되어야 한다.(caption, summary, thead 제거)
                    tbodyTableFix.find("caption").remove();
                    tbodyTableFix.find("thead").remove();
                    tbodyTableFix.removeAttr("summary");

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
                    }).height(configHeight - SCROLL_BAR_WIDTH);
                    
                    tableHeadDivFix.append(theadTableFix);
                    tableBodyDivFix.append(tbodyTableFix);
                    tableContainerFix.append(tableHeadDivFix);
                    tableContainerFix.append(tableBodyDivFix);
                    //스크롤 적용하면서 필요 없어짐
                    //tableContainerFix.append($('<div style="background-color:#ededed;height:'+ (SCROLL_BAR_WIDTH-1) +'px;margin-top:1px;"></div>'));
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
                    
                    if(config.hover){
                        if(!TOUCH_DEVICE){
                            //fix테이블 TR에 하버가 일어날 경우 ori테이블에도 동일하게 발생
                            _this.tbodyTableFix.delegate("tbody tr","mouseover mouseout",function(event){
                                var tr          = this;
                                var rowIndex    = tr.sectionRowIndex;   //$("tr",tbody).index(tr);
                                
                                var rowGroup = _this.getRowGroup(tr);
                                if(event.type=="mouseover"){
                                    rowGroup.addClass("hover");
                                    
                                    rowGroup = _this.getRowGroup($("tbody tr:eq("+rowIndex+")",_this.tbodyTable));
                                    rowGroup.addClass("hover");
                                }else if(event.type=="mouseout"){
                                    rowGroup.removeClass("hover");
                                    
                                    rowGroup = _this.getRowGroup($("tbody tr:eq("+rowIndex+")",_this.tbodyTable));
                                    rowGroup.removeClass("hover");
                                }
                            });
                        }
                    }
                    
                    
                    //원래 테이블 영역에서 스크롤 이벤트가 발생한경우 틀고정 테이블영역도 같이 이동시켜준다.
                    tableBodyDiv.on('scroll.grid' ,function(e) {
                        _this.tableBodyDivFix.scrollTop(_this.tableBodyDiv.scrollTop());
                    });
                    
                    //틀고정 된 테이블영역에서 마우스 휠이벤트가 발생한경우
                    tableBodyDivFix.mousewheel(function(objEvent, intDelta){
                        //다른 영역(body) 스크롤이 같이 되는것을 막는다.
                        objEvent.preventDefault ? objEvent.preventDefault() : objEvent.returnValue = false;
                        if (intDelta > 0){  //마우스 업
                            _this.tableBodyDiv.scrollTop(_this.tableBodyDiv.scrollTop()-25 );
                        } else if (intDelta < 0){  //다운
                            _this.tableBodyDiv.scrollTop(_this.tableBodyDiv.scrollTop()+25 );
                        }
                    });
                }
                
                if(config.hover){
                    if(!TOUCH_DEVICE){
                        //ori테이블 TR에 하버가 일어날 경우 fix테이블에도 동일하게 발생
                        _this.tbodyTable.delegate("tbody tr","mouseover mouseout",function(event){
                            var tr          = this;
                            
                            if($(tr).hasClass("expandTR")){
                            	return;
                            }
                            
                            var rowGroup = _this.getRowGroup(tr);
                            if(event.type=="mouseover"){
                                rowGroup.addClass("hover");
                            }else if(event.type=="mouseout"){
                                rowGroup.removeClass("hover");
                            }
                            
                            if(_this.cellFixMode){
                                var rowIndex    = tr.sectionRowIndex;   //$("tr",tbody).index(tr);
                                rowGroup = _this.getRowGroup($("tbody tr:eq("+rowIndex+")",_this.tbodyTableFix));
                                if(event.type=="mouseover"){
                                    rowGroup.addClass("hover");
                                }else if(event.type=="mouseout"){
                                    rowGroup.removeClass("hover");
                                }
                            }
                        });
                    }
                }
                
                
                this._initSetTableHeadMeta();
                
                if(config.showInit){
                    _this._onSuccess(this.trReference,'',this.trReference.size());
                }

                loadingImage.css("margin-left",containerDiv.width()/2);//이게 왜 아래 있을까 위에 있어야 할꺼 같은디..
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
                    /* 이거풀면 +4 div*/
                    $(window).resize(function(e) {
                        clearTimeout(_this.browserResizeTimer);
                        _this.browserResizeTimer = setTimeout(function(){
                            _this.resizing();
                            //_this.tableBodyDiv.scrollLeft(_this.tableBodyDiv.scrollLeft());
                        },500);
                    });
                }
                
                
                
                //스크롤 이동시 (상하는 관계 없고 좌우스크롤시 header테이블을 body테이블과 같도록 이동)
                tableBodyDiv.on('scroll.grid', function(e) {
                    _this.tableHeadDiv.css('margin-left', (e.currentTarget.scrollLeft * -1) +"px");
                });
                
                //멀티 셀렉트 모드를 위한 변수 설정 이벤트 바인드
                if(config.multiSelectable){
                    var $setSelection = function(booleanVal){
                        var mozSelect = booleanVal?'':'none';
                        if (typeof document.onselectstart !== undefined) {
                            document.onselectstart = function(){ return booleanVal; };
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
                    
                    /* 이거풀면 +4 div*/
                    if(GRID_BROWSER.indexOf("IE")==0){
                        $(window.document).bind('keydown',$keydownEvent);
                        $(window.document).bind('keyup', $keyupEvent);
                    }else{
                        $(window).bind('keydown', $keydownEvent);
                        $(window).bind('keyup', $keyupEvent);
                    }
                    
                }
                
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
                
                //header 클릭시 오름차순 내림차순으로 정렬을 할 수 있는 이벤트 
                _this._sortMode( this.theadTable);
                
                //tbody의 TD를 클릭시 에디트 모드 이벤트와 셀렉트 모드 이벤트 ($editAndSelectEvent) 바인딩 
                tbodyTable.bind("click keydown",{target:_this.tbodyTable},_this._editAndSelectEvent);
                
                //헤더를 안보이게 하는 설정
                if(!config.displayHeader){
                    this.theadTable.hide();
                    _this._syncWithFix("displayHeader");
                }
                
                if(_this.cellFixMode){
                    _this._sortMode( this.theadTableFix);
                    _this.tbodyTableFix.bind("click",{target:_this.tbodyTableFix},_this._editAndSelectEvent);
                }
            },
            
            _slideMode : function(){
            	_this.containerDiv.addClass("slideMode");
            	
            	var prevLeft = _this.theadTable.find("TD[x="+$("col.slidable",_this.theadColGroup).eq(0).index()+"]")[0].offsetLeft;
            	
            	var prevBtn = $('<input type="button" value="이전 컬럼 보기" class="sprite slide_able prev disabled" disabled="disabled" style="position:absolute;left:'+prevLeft+'px;"/>');
            	var nextBtn = $('<input type="button" value="다음 컬럼 보기" class="sprite slide_able next" style="position:absolute;right:0;" />');
            	
            	prevBtn.on("click",function(){
            		nextBtn.removeClass("disabled").prop("disabled",false);
            		var cols = $("col",_this.theadColGroup), showedCol = cols.filter(".slidable").not(".hiddenable"), showedColSize = (showedCol.size()-1),
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
            		var cols = $("col",_this.theadColGroup), showedCol = cols.filter(".slidable").not(".hiddenable"),
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
                		
                		$(".expandable",_this.theadColGroup).each(function(){
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
            		_this.theadColGroup.find("col").each(function(i){
            			
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
            			var targetCol = _this.theadColGroup.find("#"+this.getAttribute("data-colId"));
            			if(this.checked){
            				targetCol.removeClass("hiddenable").addClass("choosable");
            			}else{
            				targetCol.removeClass("choosable").addClass("hiddenable");
            			}
            		});
            		
            		_this._makeInternalStyle($("col",_this.theadColGroup));
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
                
                var parent = eventEle;
                var td = undefined;
                while(parent.nodeName != "TR"){
                    if(parent.nodeName=="TD")      {td = parent;}
                    if(parent.nodeName == "TABLE") {break;}
                    parent = parent.parentNode;
                    
                    if(parent == null) return;
                }
                
                if( parent.className.indexOf("expand") > -1 ){
                	return;
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
                    var rowGroup = _this.getRowGroup(parent);
                    rowGroup.each(function(){
                        var parent = $(this);
                        parent.addClass(config.selectClassName);
                        var uuid = _this.uuid(parent);
                        var info = _this._updateRowArray(parent);
                        _this.selectedRowArray[uuid] = info;
                        _this._syncWithFix("addSelectedTR",{info:info});
                    });
                }
                
                if(config.onclick !== undefined){
                    if(_this.onEvent === true){
                    	if(event.type=="keydown"){//엔터 입력으로 onclick시는 td가 없음
                    		td = parent;
                    	}
                    	
                        if(typeof onclick == 'function'){
                            config.onclick(td,_this,event);
                        }else{
                            eval(config.onclick)(td,_this,event);
                        }
                    }
                }
                
                _this._editMode(eventEle);
            },
            
            _initSetTableHeadMeta : function(){
                
                
                
                //IE8버그(hidden 또는 다시 보이게 하는 컨트롤시 )
                if(GRID_BROWSER=="IE8"){
                    _this.tableBodyDiv.addClass("displayTable");
                }
                
                //먼저 CSS를 만들고 아래 table 길이를 설정해야 정상설정
                this._makeInternalStyle($("col",this.theadColGroup));
                
                //Table의 길이를 설정
                var tblWidth = 0;
                var cols = $("col",this.theadColGroup);
                
                this.containerWidth  = this.containerDiv.width();
                var configWidth = config.width+"";
                if(configWidth.indexOf("%")>-1){
                    this.isRelativeWidth = true;
                }
                
                if(!this.cellFixMode){//일반일경우
                    
                    for(var i =0, ic = cols.size(); i < ic; i++ ){
                        try {
                            var targetCol = cols.eq(i);
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
                        this.theadTable.css("width",tblWidth);
                        this.tbodyTable.css("width",tblWidth);
                    }else{
                        this.theadTable.css("width",this.containerWidth-SCROLL_BAR_WIDTH);
                        this.tbodyTable.css("width",this.containerWidth-SCROLL_BAR_WIDTH);
                    }
                }else{
                	var tableContainerFixWidth = 0;
                	
                    for(var i =0, ic = cols.size(); i < ic; i++ ){
                        try {
                            var targetCol = cols.eq(i);
                            var w = targetCol.attr("width");
                            
                            if(w === undefined || w == null || w==""){  //IE7의 경우는 "" 으로 나오내..
                                var inlineStyle= targetCol.attr("style");
                                if(inlineStyle !== undefined && inlineStyle != "undefined"){
                                    var expression = 'width.*?[x|%]';
                                    var result = inlineStyle.match(new RegExp(expression,'g'));
                                    w = (""+result[0]).split(":")[1];
                                }
                            }
                            
                            if(w.indexOf('%') > -1){
                                w = parseInt((this.containerWidth*(parseInt(w)/100)));
                                this.isRelativeCol = true;
                            }
                            
                            if(targetCol.hasClass("fixable")){
                                var cellFixWidth = parseInt(w);
                                tableContainerFixWidth += cellFixWidth*1;
                                if(GRID_BROWSER=="IE7"){
                                	tableContainerFixWidth = (tableContainerFixWidth + this.colPadding + this.tdBorderWidth);
                                }
                            }
                            
                            if(w==null||w==""){
                                if(targetCol.hasClass("hiddenable")||targetCol.hasClass("hidden")){
                                    w = 0;
                                }else{
                                    tblWidth = 0;
                                    break;
                                }
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
                    
                    var fixContainerWidth = tableContainerFixWidth - parseInt(this.tableContainerFix.css("borderRightWidth"));
                    this.tbodyTableFix.css("width",fixContainerWidth);
                    this.theadTableFix.css("width",fixContainerWidth);
                    this.tableContainerFix.width(fixContainerWidth);
                    
                    var containerWidth = this.containerWidth - tableContainerFixWidth;
                    if(!this.isRelativeCol){
                        this.theadTable.css("width",this.theadTable.width()-tableContainerFixWidth);
                        this.tbodyTable.css("width",this.tbodyTable.width()-tableContainerFixWidth);
                    }else{
                        this.theadTable.css("width",containerWidth-SCROLL_BAR_WIDTH);
                        this.tbodyTable.css("width",containerWidth-SCROLL_BAR_WIDTH);
                    }
                    this.tableContainer.width(containerWidth);
                    
                    
                    this.tableContainerFixWidth = tableContainerFixWidth;
                }
                
                if(GRID_BROWSER=="IE8"){
                    _this.tableBodyDiv.removeClass("displayTable");
                }
                
                if(_this.scrollBar){ _this.scrollBar.resize(); }
            },
            
            _makeInternalStyle : function(cols){
                if(!cols){
                    cols = $("col",this.theadColGroup);
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
                    cssTxt_head = cssTxt_head + "#"+ _this.id+'_head' + ' td:first-child ';
                    for ( var j = 0; j < i; j++) {
                        cssTxt = cssTxt + ' + td';
                        cssTxt_head = cssTxt_head + ' + td';
                    }
                    
                    //셀 hidden hidden 모드 일시 셀모드를 우선한다.
                    if(targetCol.hasClass("hiddenable") || targetCol.hasClass("hidden")){
                        cssTxt = cssTxt + ' {text-align:' + txtAlign + ';display:none;} ';
                        cssTxt_head = cssTxt_head + ' {display:none;}';
                    }else{
                        //셀 고정
                        var cellFixTxt = '';
                        if(targetCol.hasClass("fixable")){
                            cellFixTxt = "visibility:hidden;display: block;overflow: hidden;position: absolute;top: 0;left: 0;width: 0;height: 0;border: 0;background: none !important;font-size: 0;line-height: 0;";
                            //targetCol.width(0);
                            //targetColBody.width(0);
                            
                            
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
                
                
                var cssTxtFix = '';
                var cssTxt_headFix = '';
                if(_this.cellFixMode){
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
                        
                        if(isCellFix){
                            cellFixTxt = "";
                        }else{
                            cellFixTxt = "display:none;";
                            targetCol.hide();
                            targetColBody.hide();
                        }
                        
                        cssTxtFix = cssTxtFix + "#"+ _this.id+'Fix' + ' td:first-child ';
                        cssTxt_headFix = cssTxt_headFix + "#"+ _this.id+'_headFix' + ' td:first-child ';
                        
                        for ( var j = 0; j < i; j++) {
                            cssTxtFix = cssTxtFix + ' + td';
                            cssTxt_headFix = cssTxt_headFix + ' + td';  
                        }
                        
                        cssTxtFix = cssTxtFix + ' {text-align:' + txtAlign + ';' + cellFixTxt + '} ';
                        cssTxt_headFix = cssTxt_headFix + ' {' + cellFixTxt + '} ';
                    }
                }
                
                //alert($.browser.version)
                if(GRID_BROWSER=="IE7"||GRID_BROWSER=="IE6"){ 
                    return;
                }
                
                var internalCss = cssTxt + cssTxt_head + cssTxtFix + cssTxt_headFix;
                
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
                $("col[id=\""+colId2+"\"]", this.theadColGroup).removeClass("hiddenable");
                $("col[id=\""+colId2+"\"]", this.tbodyTable).removeClass("hiddenable");
                $("col[id=\""+colId+"\"]" , this.theadColGroup).addClass("hiddenable");
                $("col[id=\""+colId+"\"]" , this.tbodyTable).addClass("hiddenable");
                
                this._makeInternalStyle($("col",this.theadColGroup));
            },
            
            hideColumn:function(args,isMakeStyle){
                if(typeof args=="string"){ args = [args]; }
                
                for( var i =0, ic = args.length; i < ic; i++ ){
                    var targetId = args[i];
                    $("col[id=\"col_"+targetId+"\"]", this.theadColGroup).addClass("hiddenable");
                    $("col[id=\"col_"+targetId+"\"]", this.tbodyTable).addClass("hiddenable");
                }
                
                if(isMakeStyle === undefined ? true : isMakeStyle){
                    this._makeInternalStyle($("col",this.theadColGroup));
                }
            },
            
            showColumn:function(args,isMakeStyle){
                if(typeof args=="string"){ args = [args]; }
                
                for( var i =0, ic = args.length; i < ic; i++ ){
                    var targetId = args[i];
                    $("col[id=\"col_"+targetId+"\"]", this.theadColGroup).removeClass("hiddenable");
                    $("col[id=\"col_"+targetId+"\"]", this.tbodyTable).removeClass("hiddenable");
                }
                if(isMakeStyle === undefined ? true : isMakeStyle){
                    this._makeInternalStyle($("col",this.theadColGroup));
                }
            },
            //*/
            
            _rotateMode : function(){
                var rotateIcon  = '<div class="rotate_able" style="background:transparent;position:absolute;top:0px;right:0;width:30px;height:100%;">';
                rotateIcon     += '<button type="button" class="sprite" style="cursor:pointer;float:right;width:15px;height:15px;display:block;margin:0;padding:0;border:none;background-position:-65px -10px;"></button>';
                rotateIcon     += '</div>';
                
                $("td",this.theadTable).each(function(k){
                    var thElement = $(this);
                    if(thElement.attr("y")!=0){//제일 첫번째꺼에만 생성
                        //return true;
                    	rotateIcon = '<div class="rotate_able" style="background:transparent;position:absolute;top:0px;right:0;width:30px;height:100%;"></div>';
                    }
                    
                    
                    var theadCol    = $("col",_this.theadColGroup).eq(thElement.attr("x"));
                    var rotate = theadCol.attr("data-rotate");

                    if(rotate){
                        var theadColId = theadCol.attr("id").substring(4);  //col_ 제거
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
            
            _sortMode:function(sortObj){
                var $reverse = function(){
                    if(config.server===undefined){
                        _this.loadingImage.show();
                        
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
                        _this.loadingImage.hide();
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
                        
                        var sortIcon = $("<span>",{ "id":"sortable_icon","class":"sort_able" });
                        sortIcon.html("&nbsp;&nbsp;&nbsp;");
                        $(".thWrapper",el).prepend(sortIcon);
                        
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
                                sortIcon.attr("class","sort_desc");
                                _this.loadingImage.hide();
                            }else if(className=="sort_desc"){
                                $reverse();
                                sortIcon.attr("class","sort_asc");
                            }else{
                                $("SPAN#sortable_icon",_this.containerDiv).each(function(k){ //아이콘 초기화
                                    $(this).attr("class","sort_able");
                                });
                                
                                $("THEAD TH.sorting",_this.containerDiv).each(function(k){ //th컬러 초기화
                                    $(this).removeClass("sorting");
                                });
                                
                                sortIcon.attr("class","sort_desc");
                                el.addClass("sorting");
                                
                                if(config.server===undefined){
                                    _this.loadingImage.show();
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
                                    _this.loadingImage.hide();
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
            
            _columnResizeMode : function(){
                var resizeCursor    = '<div class="resizeCursor" style="position:absolute;top:0px;right:0px;width:5px;height:100%;cursor:e-resize;"></div>';
                var resizeBar       = '<div class="resizeBar" style="position:absolute;top:0px;background-color:red;width:2px;height:100%;cursor:e-resize;"></div>';
                var resizeBarFix    = getOffSet(_this.containerDiv.get(0)).x;
                
                var thFix = $("td", _this.theadFix);

                $("td",this.theadTable).each(function(k){
                    var thElement = $(this);
                    if(thElement.attr("colspan")==1){
                        var resizeCursorClone = $(resizeCursor);
                        
                        $(resizeCursorClone).mousedown(function(e){
                            $("body").css("cursor","e-resize");
                            document.onselectstart = function(){ return false;};
                            document.ondragstart=function(){return false;};
                            resizeCursorClone.attr("data-isResizing","true");
                            resizeCursorClone.thWidth = Number($(this.parentNode).width());
                            resizeCursorClone.startX =  e.pageX;
                            var resizeBarClone    = $(resizeBar).css("left",e.pageX-resizeBarFix);
                            _this.containerDiv.append(resizeBarClone);
                            
                            $(document).on("mouseup.grid",function(e){
                                $("body").css("cursor","default");
                                document.onselectstart = function(){ return true;};
                                document.ondragstart=function(){return true;};
                                $(document).off("mouseup.grid");
                                $(document).off("mousemove.grid");
                                resizeCursorClone.attr("data-isResizing","false");
                                
                                _this.isColumnResizing = true;
                                
                                var changedWidth = (e.pageX - resizeCursorClone.startX);
                                
                                var theadColArray   = $("col",_this.theadTable);
                                if(changedWidth > 0){   //늘리기
                                    theadColArray.eq(thElement.attr("x")).attr("width",(resizeCursorClone.thWidth+changedWidth));
                                }else{  //줄이기
                                    var theadColArrayClone  = $("col",_this.theadColGroup).clone();
                                    theadColArrayClone.eq(thElement.attr("x")).attr("width",(resizeCursorClone.thWidth+changedWidth));
                                    _this.theadColGroup.empty().append(theadColArrayClone);
                                    
                                    var tableWidth = (_this.theadTable.width()+changedWidth);
                                    _this.theadTable.width(tableWidth-2); //-2는 보더인가 -_-;; 안하믄 조금씩 떨림..
                                    _this.tbodyTable.width(tableWidth-2); 
                                    
                                    var tableAttrWidth = (Number(_this.theadTable.attr("width"))+changedWidth);
                                }
                                _this.resizing();
                                resizeBarClone.remove();
                            }).on("mousemove.grid",function(e){
                                if(resizeCursorClone.attr("data-isResizing")=="true"){
                                    resizeBarClone.css("left",e.pageX-resizeBarFix);
                                }
                            });
                        });
                        
                        $(".tdWrapper",thElement).eq(0).append(resizeCursorClone);
                        
                        if(_this.cellFixMode){
                            //fixable th 높이 맞추기 위해..span 을 삽입.
                            var resizeCursorFixClone = resizeCursorClone.clone();
                            resizeCursorFixClone.css('cursor', '');
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
                    
                    var newHTML     = undefined;
                    var dataEvents  = col.attr("data-events");
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
                        var tr          = rowInfo.row;
                        var uuid        = _this.uuid(tr);
                        var tbodyId     = rowInfo.tbodyId;
                        var tbodySeq    = rowInfo.tbodySeq;
                        if(tbodyId.indexOf("tbodyFix")==0){
                            isFixTable = true;
                        }
                        
                        var targetRowArray = _this.rowArray[tbodySeq];
                        for( var i = 0, ic = targetRowArray.length; i < ic ; i++ ){
                            
                            if(targetRowArray[i]===undefined){
                                continue;//undefined가 왜 들어가는지 몰르겠내... 잡아내야 할듯..
                            }
                            
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
                var tr          = $(obj);
                var tbody       = tr.closest("TBODY");
                var tbodyId     = tbody.attr("id");
                var tbodySeq    = tbodyId.substring(tbodyId.lastIndexOf("_")+1);//"tbody_" 또는 "tbodyFix_" 를 제거
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
                //funcResizing
                if(this.isResizing) return;
                if(!this.tbodyTable.is(":visible")){return;}//보이지 않는 테이블은 리사이징 하지 않음
                
                this.isResizing=true;
                try{
                    //모바일 환경에서 화면당 4개의 컬럼을 보여주고 기울기 변경시 자동으로 사이즈 조정
                    if(GRID_DEVICE=="mobile"&& config.mobileAutoWidth==true){
                    	var theadColGroup = this.theadColGroup;
                        
                        var targetTable = this.tbl;
                        var colsPerViewport = targetTable.attr('data-colnum') === undefined ? 4 : targetTable.attr('data-colnum') ;
                        var cols = theadColGroup.find('col');
                        cols.removeAttr('width');
                        var visibleCol =theadColGroup.find('col:not(.hiddenable)'); 
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
                    
                    
                    if(config.columnResizable){
                        var cols = this.theadColGroup.find('col');
                        //이작업은 컬럼 리사이즈에서만 필요한듯해서 일단 주석
                        var tbodyColGroup = this.tbodyTable.find("colgroup");
                        tbodyColGroup.empty().append(cols.clone());
                    }
                    
                    //대부분 필요 없는 로직일듯 컬럼 리사이즈시에만 필요한듯 추후 체크
                    if(GRID_BROWSER=="IE7"||GRID_BROWSER=="IE6"){
                        
                        
                        if(this.cellFixMode){
                            
                            
                            
                            
                            
                            /*
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
                            */
                        }
                       
                        
                    	
                        /*
                        var colspanCellGroup = $("tr td:visible", this.theadTable);
                        var cols = this.tbodyTable.find('col');
                        // colspan 대상 셀들이 +1 되는 현상 수정
                        for(var i=0, ic = colspanCellGroup.size(); i < ic; i++) {
                        	var target = colspanCellGroup.eq(i);
                            if(target.attr("colspan") > 1){
                                var posi = target.attr("x");
                            	var targetCol = cols.eq(posi);
                                

                            	if(targetCol.attr("width").indexOf('%') == -1){
                            		targetCol.attr("width",parseInt(targetCol.attr("width"))+11);
                                }

                                
                                var nextCol = cols.eq(posi+1);
                                if(nextCol.attr("width").indexOf('%') == -1){
                                    nextCol.attr("width",parseInt(nextCol.attr("width"))-10);
                                }
                               
                            }
                        }
                        */
                    }
                    
                    //IE8버그(hidden 또는 다시 보이게 하는 컨트롤시 )
                    if(GRID_BROWSER=="IE8"){
                        _this.tableBodyDiv.addClass("displayTable");
                    }
                    
                    if(!this.cellFixMode){
                        if(_this.isRelativeWidth){      //width가 %
                            //_this.containerWidth  = this.containerDiv.width();//100%테이블일때 안보이는 경우(display) width가 제대로 나오지 않음
                            _this.containerWidth  = this.containerDiv.parent().width();
                            if(_this.isRelativeCol){    //col이 %
                                var w = _this.containerWidth - SCROLL_BAR_WIDTH;
                                if(w!=0){
                                    this.tbodyTable.width(w);
                                    this.theadTable.width(w);
                                }
                            }
                        }else{  //width가 px일때
                            
                        }
                    }else{
                        if(_this.isRelativeWidth){ //width가 %
                            _this.containerWidth  = this.containerDiv.width();
                            
                            var realWidth = this.containerWidth - this.tableContainerFixWidth;
                            this.tableContainer.width(realWidth);
                            
                            if(this.isRelativeCol){ //col이 %일때는 사실 틀고정에서는 의미 없는대...
                                this.theadTable.css("width",realWidth-SCROLL_BAR_WIDTH);
                                this.tbodyTable.css("width",realWidth-SCROLL_BAR_WIDTH);
                            }
                        }else{  //width가 px일때
                            
                        }
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
                _this.loadingImage.show();
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
                var tableRows           = null;
                var tbodyNodeList       = null;
                var tbodyNodeListLength = 0;
                if(typeof data == "string"){    //ajax 호출후 콜백으로 받은경우
                    var tempNode        = document.createElement('div');
                    tempNode.innerHTML  = "<table>" + data + "</table>";
                    tbodyNodeList       = tempNode.getElementsByTagName("TBODY");
                    tbodyNodeListLength = tbodyNodeList.length;
                    tableRows = tempNode.firstChild.rows;
                }else{  //소팅후에는 Object Array가 나옴
                    tableRows = data;
                }
                
                _this.totalCount  = tableRows.length;
                _this.tbody.hide();
                _this.loadingImage.show();
                
                if(tbodyNodeListLength > 1){ //서버측에서 tbody로 나누어서 내려줄 경우
                    for(var i =0, ic = tbodyNodeListLength ; i < ic ; i++ ){
                        _this.rowArray[i] = _this.convertToArray(tbodyNodeList[i].childNodes,0);
                    }
                    _this.rowArray.length = tbodyNodeListLength;
                }else{  //일반적인 경우
                    //Object nodeList를 Array로 변환
                    var newArr = _this.convertToArray( tableRows, 0 );
                    
                    //서버의 쿼리 페이징이 아니고 내부페이징인경우
                    if(config.paging.query === undefined && config.paging.rows !== undefined){
                        var rowsPerPage = parseInt(config.paging.rows);
                        var tbodyGroupCount = parseInt( _this.totalCount / rowsPerPage ); 
                        for( var i = 0; i < tbodyGroupCount; i++ ){
                            var start   = i * rowsPerPage;
                            var end     = ( i+1 ) * rowsPerPage;
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
                
                //*********************************************************//
                _this.resizing();//중간에 UI update time을 준다면 더빨라짐.... ??
                
                //*********************************************************//
                
                if(config.paging.rows !== undefined){ //페이징 할 때...
                    var totalCount = typeof jqXHR=='object' ? jqXHR.getResponseHeader("gridTotalCount") : jqXHR;
                    _this._pagingMode(data,totalCount);
                    _this.tbodyHeight = config.paging.rows*_this.trHeight;  
                }else{  //페이징 안 할 때..
                    if(_this.cellFixMode){
                        var clonedData = $(document.createElement("tbody")).append(data).clone().children();
                        _this.tbodyFix.html(clonedData);
                    }
                    
                    
                    /*var tempNode  = document.createElement('table');
                    var thread = new ThreadedLoop({
                        array:_this.convertToArray( tableRows, 0 ),
                        before:function(){
                            _this.tbodyTable.hide();
                            _this.tbody.empty();
                        },
                        finish:function(){
                            _this.tbodyTable.show();
                        },
                        action:function(target,index,threadObj){
                            _this.tbody.append(target);
                        }
                    });
                    
                    thread.start();*/
                    
                    //_this.tbody.append(data);
                    _this.tbody.html(data);
                    
                    _this.tbodyHeight = ( _this.totalCount  * _this.trHeight );
                }

                //총건수 출력.
                if(config.gridInfo == true){
                    $('#gridInfo_'+_this.id+'_count').text(_this.getRowCount());
                }
                
                //_this.tableBodyDiv.scrollTop(0);
                
                
                //if(_this.totalCount>100) 
                {
                    _this.tableBodyDiv.get(0).scrollTop=0;  
                    _this.tbody.show();
                    _this.loadingImage.hide();
                }
                
                if(config.onclick){
                	//_this.tableBodyDiv.find("TBODY TR").attr("tabindex","0");
                }
                
                
                if(ajaxOptions!==undefined && ajaxOptions['success']){
                    ajaxOptions['success'](data,textStatus,jqXHR);
                }
                
                /*if(GRID_DEVICE == 'mobile'){
                    var target_offset = null;
                    var parentObj = _this.containerDiv;                 
                    
                    target_offset = $(parentObj).offset();
                    
                    
                    var target_top = target_offset.top; //                  //
                    $('html, body').animate({scrollTop:target_top}, 500);
                }*/
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
                _this.loadingImage.hide();
                
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
            
            html : function(rows){
                _this.tbody.html(rows);
            },
            
            appendRow : function(rows){
                //새로운 로우가 추가된다면 기존에 선택되었던 로우를 전부 unselect 한다.
                _this.unSelectRows();
                var rowLength = _this.rowArray.length-1;
                $(rows).each(function(){
                    var tr = $(this);
                    tr.attr("data-execute","append");
                    _this.editedRowArray["append"][_this.uuid(tr)]=(this);
                    _this.rowArray[0].unshift(this);
                    //_this.rowArray[rowLength].push(this);
                });
                
                _this.reload();
            },
            
            removeRow : function(row){
                $(row).each(function(){
                    var tr      = this;
                    
                    var uuid    = _this.uuid(tr);
                    if(tr.getAttribute("data-execute")!="append"){
                        _this.editedRowArray["remove"][uuid]=(this);
                        delete _this.editedRowArray["update"][uuid];
                    }else{
                        delete _this.editedRowArray["append"][uuid];
                    }
                    
                    var tbody   = $(tr.parentNode);
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
                $("tbody",this.tbodyTable).empty();
                
            },
            
            reset :function(){
                _this.rowArray = {};
                _this.rowArray.length = 0;
                
                _this.editedRowArray = {};
                _this.editedRowArray["append"]= [];
                _this.editedRowArray["update"]= [];
                _this.editedRowArray["remove"]= [];
                
                _this.currentRowArrayIndex = 0;
                _this.reload();
            },
            
            //테이블의 현재 로우들을 재배치한다. fromTableRow가 true일경우 현재 TBODY만으로 재배치
            reload: function(formTableRow){
                if(!formTableRow){
                    var newArr = new Array();
                    for( var i = 0, ic = _this.rowArray.length; i < ic; i++ ){
                        newArr = newArr.concat(_this.rowArray[i]);
                    }
                    
                    _this._onSuccess(newArr,'',newArr.length);//jqXHR 객체가 없다...
                }else{
                    var newArr = _this.convertToArray(_this.tbodyTable.get(0).rows);
                    _this._onSuccess(newArr,'',newArr.length);//jqXHR 객체가 없다...
                }
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
                childObject = $(childObject).get(0);
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
                */
            },
            
            //현재 선택된 행을 반환
            getSelectedRow : function(){
                return $("tr."+config.selectClassName, this.tbodyTable);
            },
            
            //현재 선택된 행을 반환(multi)
            getSelectedMultiRow : function(){
                return $("tr."+config.selectClassName, this.tbodyTable);
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

                $("."+config.selectClassName, this.tbodyTable).each(function() {
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
                        
                        if(targetRows[i]===undefined){
                            continue;//undefined가 왜 들어가는지 몰르겠내... 잡아내야 할듯..
                        }
                        
                        if(targetRows[i].getAttribute("data-uuid") == uuid){
                            $("#"+info.tbodyId+" tr[data-uuid=\""+uuid+"\"]",_this.containerDiv).removeClass(config.selectClassName);
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
            
            removeColPrefix : function(colId){
            	return colId.substring(4);
            },
            
            convertToArray : function(obj,n){
                //$.makeArray 랑 어느게 좋음?
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
    
    function getLength(obj){     
        var key,len=0; 
        for(key in obj){ 
            len += Number( obj.hasOwnProperty(key) ); 
        } 
        return len; 
    } 
    
    function Map() { 
        this.length = 0; 
        function add(key, value) { this[key] = value; this.length++; } 
        function remove(key) { if (this.hasOwnProperty(key)) { delete this[key]; this.length--; }} 
    }

    function getOffSet(obj){
        var left = 0;
        var top = 0;
        if(obj.offsetHeight==0){//Safari fix
            obj = obj.firstChild;//a table cell
        }
        
        while (obj.offsetParent){
            left += obj.offsetLeft;
            top  += obj.offsetTop;
            obj     = obj.offsetParent;
        }

        left += obj.offsetLeft;
        top  += obj.offsetTop;
        
        return {x:left,y:top};
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
    
    
    //loops through an array in segments
    var ThreadedLoop = function(option) {
        var self = this;

        //holds the threaded work
        var thread = {
            work: null,
            wait: null,
            index: 0,
            total: option.array.length,
            finished: false,
            tempTable : document.createElement("table")
        };

        //set the properties for the class
        this.collection = option.array;
        this.finish = option.finish!==undefined?option.finish:function() { };
        this.before = option.before!==undefined?option.before:function() { };
        this.action = option.action!==undefined?option.action:function() { throw "You must provide the action to do for each element"; };
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
                while (thread.index < part) {
                    self.action(self.collection[thread.index], thread.index, thread);
                    thread.index++;
                }
            }
            else {

                //no thread, just finish the work
                while(thread.index < thread.total) {
                    self.action(self.collection[thread.index], thread.index, thread);
                    thread.index++;
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
            self.before();
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