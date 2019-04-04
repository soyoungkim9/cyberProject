//var GRID_HOME = "/coreframe/webponent/examples/html-grid-jquery";
var GRID_HOME = "..";
var DEBUG_LOG = true;

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
            
            'selectClassName'	:'selectedTR',
            'gridTextAlign'		:'left',
            'gridPath'			:GRID_HOME
        };
        
        if ( settings ){$.extend(config, settings);}

        var grid={
        	selector:selector,
        	initialize : function(selector){
        		this.endScroll = false;
        		this.startIdx = 1;        		  //���� ������
        		this.endIdx = 2;          		  //�������� 
        		this.maxIdx = 3;          		  //�ִ� ��� ������ (rows * maxIdx �� ���������� ����� �ִ� row �� )
     		    this.totalCount = 0;              //�׸��� �� �ο� ����
     		    this.gridCurrentPage = 1;         //����¡ ��� ���� �׸��尡 ǥ���ϰ� �ִ� ������ ��ȣ
        		this.cellFixMode = false;         //������ ������� �ƴ��� ����  ( col tag�� class �Ӽ��� cellFix�� �ִ°�� true�� ����� )
        		this.tableContainerFixWidth = 0;
        		this.isColumnResizing = false;    //�÷��� ������¡�� �߻��ϰ� �ִ��� üũ ( �� ������ ������¡ �̺�Ʈ�� �����̺�Ʈ�� �߻��Ǵ°��� ���´�. )
        		this.isRelativeWidth = false;     //table�� width ���� %�� �����Ǿ��ִ��� px�� �����Ǿ� �ִ��� üũ
        		this.withControlKey = false;      //table�� row�� ���ý� control Ű�� �������·� ���������� üũ ( for multiSelectable ) 
     		    this.withShiftKey = false;        //table�� row�� ���ý� shift   Ű�� �������·� ���������� üũ ( for multiSelectable )
     		    this.selectedRows = new Array();  //���õ�  row�� �������ִ� �迭   
     		    this.lastSelectedTRIndex = null;  //���������� ���õ� row�� �ε��� ���� �����ϰ� �ִ� ����
     		    this.colPadding = null;           //table td padding
     		    this.lastAjaxForm = null;         //���������� Ajaxó���� �� ���� ���� (updateBody �Ǵ� sendServer�� ����� ����
     		    
     		    this.rowArray = {};               //�����迭�� ���Ǹ� �ε����� 0���� ���� rows�� �����Ǿ��ٸ� rows��ŭ�� �ϳ��� �ε����� ��� rows�� ���ٸ� ��ü�� index 0�� ����
     		    this.currentRowArrayIndex = 0;
     		    
     		    
        		//ScrollBar Width ���ϱ�...
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
            	this.id = this.tbl.attr("id");
            	this.tbl.css("table-layout","fixed").css("empty-cell","show");
            	this.tbl.attr("width",this.tbl.width());
            	this.tbl.get(0).cellPadding = "0";
        		this.tbl.get(0).cellSpacing = "0";
        		this.trReference = $("tbody tr",this.tbl).clone();
        		
        		$("thead th",this.tbl).each(function(){
        			var a = '<a class="thWrapper" style="position:relative;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display: block;">'+$(this).html()+'</a>';
        			$(this).html(a);
        		});
        		
        		var configWidth  = config.width;
        		var configHeight = parseInt(config.height);
        		var gridInfoArea = "";
        		
        		if(config.gridInfo){
        			//gridInfoBar ���̸� ��ü ���̿��� ����. 20������� gridInfoBar class �� ���ǵ�����.
        			configHeight = parseInt(configHeight)-20;
        			
        			gridInfoArea  = '<div class="gridInfoBar">';
        			gridInfoArea += '	<div class="gridPageInfo" style="text-align:right;">';
        			gridInfoArea += '		�� <span id="gridInfo_'+this.id+'_count" >0</span>�� <span id="gridInfo_'+this.id+'_page" style="margin-left:10px;"></span>';
        			gridInfoArea += '	</div>';// end of <div class="gridPageInfo">
        			gridInfoArea += '	<div style="clear:both;"></div>';
        			gridInfoArea += '</div>';//end of <div class="gridInfoBar">
        			
        			gridInfoArea = $(gridInfoArea);
        		}
        		
        		$("tbody",this.tbl).empty();
            	
            	var theadTable = this.tbl.clone();
            	theadTable.attr("id", this.id+"_head");
            	theadTable.css("border-collapse","separate");  //display:none ������� �ܻ�����..

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
        		//fixable ����� �� ������ ���ļ� ��ü �����̳� ����� �÷���� �������� ����.
        		
        		//display:table : IE8���� display:none �� Į�� ����� ������� ��� ��ũ�Ⱑ �������� �ȵǴ� ���� ����.
        		var tableHeadDiv = $('<div />',{
        			"class":"tableHeadDiv",
        			"style":"overflow-x: hidden;overflow-y: hidden;display:table;"
        		});
        		
        		var tableBodyDiv = $('<div />',{
        			"class":"tableBodyDiv",
        			'style' : 'overflow-x: auto;overflow-y: scroll;width:100%;' //width:100%�� IE6 scroll���� �ʿ�..
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
        		
        		//========================================�������� ����=========================================

        		this.theadTable = theadTable;
        		this.tbodyTable = tbodyTable;
        		this.tableHeadDiv = tableHeadDiv;
        		this.tableBodyDiv = tableBodyDiv;
        		this.tableContainer = tableContainer;
        		this.loadingDiv = loadingDiv;
        		this.containerDiv = containerDiv;
        		this.thead = $("thead",theadTable);
        		this.tbody = $("tbody",tbodyTable);
        		
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
        		
        		
        		//���� �÷� ����(�ش� col�� class�� hidden�� �߰� �Ѵ�.)
        		if(config.hiddenColumn !== undefined){
        			var hiddenColumn = config.hiddenColumn;
        			for( var i = 0, ic = hiddenColumn.length; i < ic ; i++ ){
        				$("col[id=\"col_"+hiddenColumn[i]+"\"]", this.theadColGroup).addClass("hiddenable");
        			}
        		}
        		
        		//���� �÷� ����(�ش� col�� data-sortType�� Ÿ�� ���� �߰�)
        		if(config.sortColumn !== undefined){
        			var sortColumn = config.sortColumn;
        			for( var  i in sortColumn ){
        				var targetCol = $("col[id=\"col_"+i+"\"]", this.theadColGroup);
        				targetCol.addClass(sortColumn[i]);
        			}
        		}
        		
        		//����Ʈ �÷� ���� ( 
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
        		
        		//���� �÷� ����(�ش� col�� class�� fixable �߰� �Ѵ�.)
        		if(config.fixColumn !== undefined){
        			var fixColumn = config.fixColumn;
        			for( var i = 0, ic = fixColumn.length; i < ic ; i++ ){
        				$("col[id=\"col_"+fixColumn[i]+"\"]", this.theadColGroup).addClass("fixable");
        			}
        		}
        		
        		//col�� Ŭ������ fixable�� ���ԵǾ� �ִٸ� �Ʒ��� �ڵ带 �߰�
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
	        			"style" :"overflow-x: hidden;overflow-y: hidden;width:100%;" //width:100%�� IE6 scroll���� �ʿ�..
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
	        		this.tbodyFix = $("tbody",tbodyTableFix);
	        		this.cellFixMode = true;
	        		
	        		//������ ����� �ϴ� ��ũ�ѵ� �׻� ��������.. Ʋ ���� DIV�� �ϴ� ȸ�� ������ height ������ ��ƴ�..
	        		_this.tableBodyDiv.css("overflow-x","scroll");
        		}
        		
        		containerDiv.insertBefore(this.tbl);
        		this.tbl.attr("id", "");
        		this.tbl.hide();//���� ���̺� ����
        		
    		    this._initSetTableHeadMeta();
    		    
    		    var tempTR = $("<tr><td>1</td><td>2</td></tr>");
    		    this.tbodyTable.append(tempTR);
    		    this.trHeight = tempTR.outerHeight();
    		    tempTR.remove();
    		    
    		    this.beforePageArea = 0;

    		    //========================================�̺�Ʈ ����=========================================
    		    tableBodyDiv.scroll(function(e) {
    		    	if(_this.cellFixMode){
        				_this.tableBodyDivFix.scrollTop(_this.tableBodyDiv.scrollTop());
        			}
    		    	_this.tableHeadDiv.css('margin-left', (e.currentTarget.scrollLeft * -1) +"px");
					
        			
					if(config.paging.type == '2'){
						var scrolltop=_this.tableBodyDiv.scrollTop();
	    				var scrollheight=_this.tableBodyDiv.get(0).scrollHeight;
	    				var windowheight=_this.tableBodyDiv.get(0).clientHeight;
	    				
	    				
	    				
	    				
	    				
	    				log(_this.currentRowArrayIndex);
	    				//��ũ���� �������� ���κп� �����������
	    				if ((scrolltop+30) > (_this.tbodyTable.height() - _this.tableBodyDiv.height())){
	    					if(_this.currentRowArrayIndex == _this.rowArray.length){
	    						return;
	    					}
	    					
	    					//�߰�
	    					var appendIndex = (_this.currentRowArrayIndex + 1) ;
	    					var tbody = $("<tbody id=\"tbody_" + (appendIndex) + "\"></tbody>");
	    					var tr = $(_this.rowArray[appendIndex]).clone();
	    					tbody.append(tr);
	    					_this.tbodyTable.append(tbody);
	    					if(_this.cellFixMode){
		    					var tbodyFix = $("<tbody id=\"tbodyFix_" + (appendIndex) + "\"></tbody>");
		    					tbodyFix.append(tr.clone());
		    					_this.tbodyTableFix.append(tbodyFix);
	    					}
	    					
	    					//����
	    					var removeIndex = _this.currentRowArrayIndex -2;
	    					var removeTarget = $("#tbody_" + (removeIndex), _this.tbodyTable);
	    					if(removeTarget.size() > 0){
	    						var tbodyHeight = removeTarget.height();
	    						removeTarget.remove();
	    						
	    						if(_this.cellFixMode){
    								$("#tbodyFix_" + removeIndex, _this.tbodyTableFix).remove();
    							}
	    						
	    						_this.tableBodyDiv.scrollTop(scrolltop - tbodyHeight);
	    					}
    						
	    					//�׸��� ���� 
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
	    					
    						
    						_this.currentRowArrayIndex = _this.currentRowArrayIndex+1;
	    		        }
	    				
	    				//��ũ���� �ø��ٰ� ó���κп� �����Ұ��
	    				if(scrolltop <= 30){
	    					//�߰�
	    					var appendIndex = (_this.currentRowArrayIndex - 3) ;
	    					
	    					
	    					if(appendIndex < 0){
	    						return;
	    					}
	    					
	    					var tbody = $("<tbody id=\"tbody_" + (appendIndex) + "\"></tbody>");
	    					var tr = $(_this.rowArray[appendIndex]).clone();
	    					tbody.append(tr);
	    					tbody.insertBefore($("#tbody_"+(appendIndex+1),_this.tbodyTable));
	    					
	    					if(_this.cellFixMode){
		    					var tbodyFix = $("<tbody id=\"tbodyFix_" + (appendIndex) + "\"></tbody>");
		    					tbodyFix.append(tr.clone());
		    					tbodyFix.insertBefore($("#tbodyFix_" + (appendIndex+1),_this.tbodyTableFix));
	    					}
	    					
	    					//����
	    					var removeIndex = _this.currentRowArrayIndex;
	    					var removeTarget = $("#tbody_" + (removeIndex), _this.tbodyTable);
	    					if(removeTarget.size() > 0){
	    						var tbodyHeight = removeTarget.height();
	    						removeTarget.remove();
	    						
	    						if(_this.cellFixMode){
    								$("#tbodyFix_" + removeIndex, _this.tbodyTableFix).remove();
    							}
	    						
	    						_this.tableBodyDiv.scrollTop(scrolltop + tbodyHeight);
	    					}
	    					
	    					//�׸��� ����
	    					if(config.gridInfo){
    							var rowsPerPage = config.paging.rows;
    							var stRow = rowsPerPage * (appendIndex+1);
        						var edRow = rowsPerPage * (removeIndex+1);
        						
        						if(stRow < 0){
        							stRow = 0;
        						}
        						
        						if(edRow > _this.totalCount){
        							edRow = _this.totalCount;
        						}
    							
    							$('#gridInfo_'+_this.id+'_page').text("["+stRow+"~"+edRow+"]");
    						}
	    					
    						
    						_this.currentRowArrayIndex = _this.currentRowArrayIndex-1;
	    				}
	    		 
	    				
	    				
	    				
	    				
	    					
	    				
					} else if(config.paging.type == '3'){
						
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
		    				
		    				//log("[_this.trHeight :"+_this.trHeight+"] [windowheight : "+windowheight+"] [rowPerPage :"+rowPerPage+"] [scrollheight :" +scrollheight+"] [scrolltop :"+scrolltop +"] [marginTop :"+marginTop+"] [rowIndex :"+rowIndex+"]");
		    				if(_this.beforePageArea != rowIndex){
		    					
		    					
		    					//���� �ӵ��� �̰� �� �ε巯��� ������... ������Ʈ ��Ʈ���� ���� �ָ�...
		    					$("tbody[id*=\"tbody_\"").each(function(){
		    						var thisTbody = $(this);
		    						var id = thisTbody.attr("id");
		    						id = id.substring(6);
		    						_this.rowArray[id] = thisTbody.clone().get(0).childNodes;
		    					});
		    					
		    					//���� ����
	    						var prevTbody = $("<tbody id=\"tbody_" + (rowIndex-1) + "\" ></tbody>");
		    					var prevTr = $(_this.rowArray[(rowIndex-1)]).clone();
		    					prevTbody.append(prevTr);
		    					
		    					//���� ����
		    					var currentTbody = $("<tbody id=\"tbody_" + (rowIndex) + "\" ></tbody>");
		    					var currentTr = $(_this.rowArray[(rowIndex)]).clone();
		    					currentTbody.append(currentTr);
		    					
		    					//���� ����
		    					var nextTbody = $("<tbody id=\"tbody_" + (rowIndex+1) + "\" ></tbody>");
		    					var nextTr = $(_this.rowArray[(rowIndex+1)]).clone();
		    					nextTbody.append(nextTr);
		    					
		    					_this.tbodyTable.html("");
		    					_this.tbodyTable.append(prevTbody);
		    					_this.tbodyTable.append(currentTbody);
		    					_this.tbodyTable.append(nextTbody);
		    					_this.tbodyTable.css("margin-top",marginTop);
		    					_this.resizing();
		    					
		    					
		    					/*
		    					//�ణ ���������� ������Ʈ ���� ������ ����.. ����Ʈ ��峪 �÷� ���õ��� ����
		    					$("tbody:visible",_this.tbodyTable).each(function(){
		    						$(this).hide();
		    					});
		    					
		    					//���� ����
		    					var prevTbody = $("tbody[id=\"tbody_"+(rowIndex-1)+"\"]",_this.tbodyTable); 
		    					if( prevTbody.size() == 0 ){
		    						prevTbody = $("<tbody id=\"tbody_" + (rowIndex-1) + "\" ></tbody>");
    		    					var tr    = $(_this.rowArray[(rowIndex-1)]).clone();
    		    					prevTbody.append(tr);
    		    					_this.tbodyTable.append(prevTbody);
    		    				}
		    					
		    					//���� ����
		    					var currentTbody = $("tbody[id=\"tbody_"+(rowIndex)+"\"]",_this.tbodyTable);
		    					if( currentTbody.size() == 0 ){
		    						currentTbody = $("<tbody id=\"tbody_" + ((rowIndex)) + "\" ></tbody>");
    		    					var tr    = $(_this.rowArray[((rowIndex))]).clone();
    		    					currentTbody.append(tr);
    		    					_this.tbodyTable.append(currentTbody);
    		    				}
		    					
		    					//���� ����
		    					var nextTbody = $("tbody[id=\"tbody_"+(rowIndex+1)+"\"]",_this.tbodyTable);
		    					if( nextTbody.size() == 0 ){
		    						nextTbody = $("<tbody id=\"tbody_" + ((rowIndex+1)) + "\" ></tbody>");
    		    					var tr    = $(_this.rowArray[((rowIndex+1))]).clone();
    		    					nextTbody.append(tr);
    		    					_this.tbodyTable.append(nextTbody);
    		    				}
		    					
		    					prevTbody.show();
		    					currentTbody.show();
		    					nextTbody.show();
		    					
		    					_this.tbodyTable.css("margin-top",marginTop);
		    					_this.resizing();
		    					*/
		    					
		    					
		    					_this.currentRowArrayIndex = rowIndex;
		    					
		    					if(_this.cellFixMode){
		    						_this.tbodyTableFix.html("");
			    					_this.tbodyTableFix.append(_this.tbodyTable.clone().children());
			    					_this.tbodyTableFix.css("margin-top",marginTop);
			            			_this.tableBodyDivFix.scrollTop(_this.tableBodyDiv.scrollTop());
			            			_this.resizing();
	    						}
		    					
		    					if(config.gridInfo == true){
	    							$('#gridInfo_'+_this.id+'_page').text("["+(rowIndex*rowPerPage)+"~"+((rowIndex+1)*rowPerPage)+"]");
	    						}
		    					
		    					_this.beforePageArea = rowIndex;
		    				}
						}catch(e){log(e,"tableBodyDiv.scroll paging.type=3");}
	    				
					}
				});
    		    
    		    //mousewheel event on cellFixGrid
    		    if(this.cellFixMode == true){
    		    	tableBodyDivFix.mousewheel(function(objEvent, intDelta){
    		    		//�ٸ� ����(body) ��ũ�� ���� �Ǵ°��� ���´�.
    			    	objEvent.preventDefault ? objEvent.preventDefault() : objEvent.returnValue = false;
    			    	if (intDelta > 0){  //���콺 ��
    			    		_this.tableBodyDiv.scrollTop(_this.tableBodyDiv.scrollTop()-25 );
    					} else if (intDelta < 0){  //�ٿ�
    				        _this.tableBodyDiv.scrollTop(_this.tableBodyDiv.scrollTop()+25 );
    				    }
    		    	});
    		    }
    		    
    			$(window).bind('resizestop',function(e) {
    				_this.resizing();
        			_this.tableBodyDiv.scrollLeft(_this.tableBodyDiv.scrollLeft());
        			//_this.tableBodyDiv.trigger('scroll');
            	});
        		//tbody�� TD�� Ŭ���� ����Ʈ ��� �̺�Ʈ�� ����Ʈ ��� �̺�Ʈ
        		var $editAndSelectEvent = function(event){
        			
        			var eventTarget = event.data.target; //tbodyTable ���� fixMode��� tbodyTableFix �ϼ��� ����
        			
    				var eventEle=event.srcElement? event.srcElement : event.target;
            		_this._editMode(eventEle);
    				
    				var parent = eventEle;
    				var td = undefined;
    				try{
	    				while(parent.nodeName != "TR"){
	    					if(parent.nodeName=="TD")      {td = parent;}
	    					if(parent.nodeName == "TABLE") {break;}
	    					parent = parent.parentNode;
	    				}
	    				
	    				//_this.selectedRows = $("TR.selectClassName",$(parent.parentNode));
	    				
	    				if(_this.withShiftKey === false && _this.withControlKey === false){
	    					for(var i =0,ic = _this.selectedRows.length ; i < ic; i++ ){
	    						var selRow = _this.selectedRows[i];
	    						selRow.removeClass(config.selectClassName);
	    						_this._syncWithFix("removeSelectedTR",{rowIndex:selRow.get(0).rowIndex});
	    					}
	    					_this.selectedRows = new Array();
	    				}
	    				
	    				if(_this.withShiftKey){
	    					if(_this.selectedRows.length==0){
	    						$(parent).addClass(config.selectClassName);
	    						_this.selectedRows.push($(parent));
	    						_this._syncWithFix("addSelectedTR",{rowIndex:parent.rowIndex});
	    					}else{
	    						var currentSelectedIndex = parent.rowIndex;
	    						
	    						var start = _this.lastSelectedTRIndex;
	    						var end   = currentSelectedIndex;
	    						if(_this.lastSelectedTRIndex > currentSelectedIndex){
	    							start = currentSelectedIndex;
	    							end   = _this.lastSelectedTRIndex;
	    						}
	    						
	    						$("tr",eventTarget).each(function(i){
	    							if(i > end){
	    								return false;
	    							}
	    							
	    							if(start <= i && i <= end ){
	    								var targetTR = $(this);
	    								targetTR.addClass(config.selectClassName);
	    								_this.selectedRows.push(targetTR);
	    								_this._syncWithFix("addSelectedTR",{rowIndex:targetTR.get(0).rowIndex});
	    							}
	    						});
	    					}
	    				}else{
	    					$(parent).addClass(config.selectClassName);
	    					_this.selectedRows.push($(parent));
	    					_this._syncWithFix("addSelectedTR",{rowIndex:parent.rowIndex});
	    				}
	    				
	    				_this.lastSelectedTRIndex = parent.rowIndex;
    				
	    				if(config.onclick !== undefined){
	    					config.onclick(td,event);
	    				}
    				}catch(e){
    					log(e.message, "case : tbodyTable.click(function(event)");
    				}
        		};
        		
        		
        		//tbody�� TD�� Ŭ���� ����Ʈ ��� �̺�Ʈ�� ����Ʈ ��� �̺�Ʈ
        		var $editAndSelectEvent2 = function(event){
        			
        			var eventTarget = event.data.target; //tbodyTable ���� fixMode��� tbodyTableFix �ϼ��� ����
        			
    				var eventEle=event.srcElement? event.srcElement : event.target;
            		_this._editMode(eventEle);
    				
    				var parent = eventEle;
    				var td = undefined;
    				try{
	    				while(parent.nodeName != "TR"){
	    					if(parent.nodeName=="TD")      {td = parent;}
	    					if(parent.nodeName == "TABLE") {break;}
	    					parent = parent.parentNode;
	    				}
	    						
	    				_this.selectedRows = $("TR.selectedTR",$(parent.parentNode));
	    				
	    				if(_this.withShiftKey === false && _this.withControlKey === false){
	    					for(var i =0,ic = _this.selectedRows.size() ; i < ic; i++ ){
	    						var selRow = _this.selectedRows.eq(i); 
	    						selRow.removeClass(config.selectClassName);
	    						_this._syncWithFix("removeSelectedTR",{rowIndex:selRow.get(0).rowIndex});
	    					}
	    				}
	    				
	    				if(_this.withShiftKey){
	    					if(_this.selectedRows.size()==0){
	    						$(parent).addClass(config.selectClassName);
	    						_this._syncWithFix("addSelectedTR",{rowIndex:parent.rowIndex});
	    					}else{
	    						var currentSelectedIndex = parent.rowIndex;
	    						
	    						var start = _this.lastSelectedTRIndex;
	    						var end   = currentSelectedIndex;
	    						if(_this.lastSelectedTRIndex > currentSelectedIndex){
	    							start = currentSelectedIndex;
	    							end   = _this.lastSelectedTRIndex;
	    						}
	    						
	    						$("tr",eventTarget).each(function(i){
	    							if(i > end){
	    								return false;
	    							}
	    							
	    							if(start <= i && i <= end ){
	    								$(this).addClass(config.selectClassName);
	    								_this._syncWithFix("addSelectedTR",{rowIndex:$(this).get(0).rowIndex});
	    							}
	    						});
	    					}
	    				}else{
	    					$(parent).addClass(config.selectClassName);
	    					_this._syncWithFix("addSelectedTR",{rowIndex:parent.rowIndex});
	    				}
	    				
	    				_this.lastSelectedTRIndex = parent.rowIndex;
    				
	    				if(config.onclick !== undefined){
	    					config.onclick(td);
	    				}
    				}catch(e){
    					log(e.message, "case : tbodyTable.click(function(event)");
    				}
        		};
        		
        		//��Ƽ ����Ʈ ��带 ���� ���� ���� �̺�Ʈ ���ε�
        		if(config.multiSelectable){
        			var $keydownEvent = function(e){
        				var k = e.keyCode;
        				if(k==16){
        					_this.withShiftKey = true;
        					document.onselectstart=function(){return false;};
        					document.ondragstart=function(){return false;};
        				}else if(k==17){
        					_this.withControlKey = true;
        					document.onselectstart=function(){return false;};
        					document.ondragstart=function(){return false;};
        				}
        			};
        			
        			var $keyupEvent = function(e){
        				var k = e.keyCode;
        				if(k==16){
        					_this.withShiftKey = false;
        					document.onselectstart=function(){return true;};
        					document.ondragstart=function(){return true;};
        				}else if(k==17){
        					_this.withControlKey = false;
        					document.onselectstart=function(){return true;};
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
    		    
				//�÷��� ���̸� �����Ҽ� �ִ� �̺�Ʈ
        		if(config.columnResizable){
        			this._columnResizeMode();
        		}
        		
        		//header Ŭ���� �������� ������������ ������ �Ҽ� �ִ� �̺�Ʈ 
        		_this._sortMode( this.theadTable);
        		
        		//tbody�� TD�� Ŭ���� ����Ʈ ��� �̺�Ʈ�� ����Ʈ ��� �̺�Ʈ ($editAndSelectEvent) ���ε� 
        		tbodyTable.bind("click",{target:_this.tbodyTable},$editAndSelectEvent);
        		
        		if(this.cellFixMode == true){
        			_this._sortMode( this.theadTableFix);
        			tbodyTableFix.bind("click",{target:_this.tbodyTableFix},$editAndSelectEvent);
        		}

        		//����� �Ⱥ��̰� �ϴ� ����
        		if(!config.displayHeader){
        			this.theadTable.hide();
        			_this._syncWithFix("displayHeader");
        		}
            },
            /*
             * fixCell ���� ���� �����̺� ��ũ�� �ʿ��Ѱ�츦 ���� �Լ� 
             * */
            _syncWithFix : function(mode,jsonData){
            	if(_this.cellFixMode == true){
            		if("addSelectedTR" == mode){
            			var index = jsonData.rowIndex;
            			$("tr",_this.tbodyTable).eq(index).addClass(config.selectClassName);
            			$("tr",_this.tbodyTableFix).eq(index).addClass(config.selectClassName);
            		} else if("removeSelectedTR" == mode){
            			var index = jsonData.rowIndex;
            			$("tr",_this.tbodyTable).eq(index).removeClass(config.selectClassName);
            			$("tr",_this.tbodyTableFix).eq(index).removeClass(config.selectClassName);
            		} else if("pagingMode" == mode){
            			var rows = jsonData.rows;
            			//_this.tbodyTableFix.html(rows);
            			_this.tbodyFix.html(rows);
            		} else if("editMode" == mode){
            			var rows = jsonData.rows;
            			var index = rows.get(0).rowIndex;
            			var tbodyTableTR = $("tr",_this.tbodyTable).eq(index).replaceWith(rows.clone());
            			var tbodyTableFixTR = $("tr",_this.tbodyTableFix).eq(index).replaceWith(rows.clone());
            		} else if("displayHeader"){
            			_this.theadTableFix.hide();
            		}
            	}
            },
            
            _initSetTableHeadMeta : function(){
            	var cols = $("col",this.theadColGroup);
            	for ( var i = 0, i2 = this.thead.get(0).rows; i < i2.length; i++) {
            		for(var j =0, j2 = i2[i].cells; j < j2.length; j++){
            			var cell = j2[j];
            			var t = this._getCellIndex(cell);
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
               	if(this.cellFixMode == true){
	            	for ( var i = 0, i2 = this.theadFix.get(0).rows; i < i2.length; i++) {
	            		for(var j =0, j2 = i2[i].cells; j < j2.length; j++){
	            			var cell = j2[j];
	            			var t = this._getCellIndex(cell);
	            			
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
            	}

               	//theadTable�� ���̸� ����
            	var tblWidth = 0;
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

            	//col �� align �Ӽ��� ���̺��� �� td�� �ο��ϱ� ���� inline Style�� ��Ÿ�� ��Ʈ�� ����� head�� ���� 
            	var cssTxt = '';
            	var cssTxt_head = '';

        		var cols_body = $("col", this.tbodyTable);
        		
            	for( var i = 0 , ic = cols.size(); i < ic ; i++ ){
    				var targetCol = cols.eq(i);
    				var targetColBody = cols_body.eq(i);
    				
    				//�� ���� 
    				var txtAlign   = targetCol.css("text-align");
    				if( txtAlign=='' || txtAlign.length==0 ){
    					txtAlign = targetCol.attr("align");
    				}
    				
    				if(txtAlign==''){
    					txtAlign = config.gridTextAlign;
    				}
    				
    				targetCol.attr("align",txtAlign);
    				
    				//�� hidden hidden ��� �Ͻ� ����带 �켱�Ѵ�.
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
    					//�� ����
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
            	
            	if(this.cellFixMode == true){
            	
	            	var colsFix = $("col", _this.theadTableFix);
	        		var colsFix_body = $("col", _this.tbodyTableFix);
	            	
	             	for( var i = 0 , ic = colsFix.size(); i < ic ; i++ ){
	    				var targetCol = colsFix.eq(i);
	    				var targetColBody = colsFix_body.eq(i);
	
	    				//�� ���� 
	    				var txtAlign   = targetCol.css("text-align");
	    				if( txtAlign=='' || txtAlign.length==0 ){
	    					txtAlign = targetCol.attr("align");
	    				}
	    				
	    				if(txtAlign==''){
	    					txtAlign = config.gridTextAlign;
	    				}
	    				
	    				targetCol.attr("align",txtAlign);
	
	    				//�� ����
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
            },

        	_sortMode:function(sortObj){
        		var $reverse = function(){
        			if(config.server===undefined){
        				_this.loadingDiv.show();
        				
	            		var sortArray = new Array();
						if(config.paging.rows !== undefined){ //����¡ �� ��...
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
	            		
    					_this._onSuccess(sortArray,'',sortArray.length);//jqXHR ��ü�� ����...
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
            	
            	//sorting comparator ������ [0]�� tr [1]�� ���ϰ��� �ϴ� ��
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
        					//_columnResize�� ����Ǵµ��� _sortMode �̺�Ʈ�� ��ø�� �߻��ϴ°�츦 ����
        					if(_this.isColumnResizing == true){
        						_this.isColumnResizing = false;
        						return;
        					}
        					
        					var obj = event.currentTarget;
        					var sortIcon = $("#sortable_icon",$(obj));
        					var className = sortIcon.attr("class");
        					
        					if(className=="sort_asc"){
        						$reverse();
        						sortIcon.html('&nbsp��');
        						sortIcon.attr("class","sort_desc");
        						_this.loadingDiv.hide();
        					}else if(className=="sort_desc"){
        						$reverse();
        						sortIcon.html('&nbsp;��');
        						sortIcon.attr("class","sort_asc");
        					}else{
        						$("SPAN#sortable_icon",_this.containerDiv).each(function(k){ //������ �ʱ�ȭ
        							$(this).html("");
        							$(this).attr("class","");
        						});
        						
        						sortIcon.html('&nbsp��');
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
        							if(config.paging.rows !== undefined){ //����¡ �� ��...
        								for(var i in _this.rowArray){
        									var rowArrayI = _this.rowArray[i];
        									for( var j in rowArrayI){
        										sortArray[sortArray.length] = [rowArrayI[j],$("TD",rowArrayI[j]).eq(x).text()];
        									}
        								}
        							}else{
        								var rows = _this.tbodyTable.get(0).rows;
        								for( var i = 0, ic = rows.length; i < ic; i++ ){
                    						sortArray[sortArray.length] = [rows[i],$("TD",rows[i]).eq(x).text()];
                    					}
        							}
        							
                					var sortArrayLength = sortArray.length;
                					
                					sortArray.sort(obj.sortfunction);
                					
                					var dataArray = new Array();
                					for (var j=0; j<sortArrayLength; j++) {
                						dataArray.push(sortArray[j][0]);
                					}
                					delete sortArray;
                					_this._onSuccess(dataArray,'',sortArrayLength);//jqXHR ��ü�� ����...
                					_this.loadingDiv.hide();
        						}else{
        							var sortTarget = targetCol.attr("id");
        							if(sortTarget.indexOf("col_")==0){ //col_ ����
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

				var pagingPage = (config.paging.page !==undefined&&""!=config.paging.page) ? parseInt(config.paging.page) : 1 ;
				
				
        		var $paging = function(event){
        			var page = typeof event != "number" ? event.data.curPage : event;
        			if(typeof event =="number" && config.paging.query){
        				$makePagingNavigation(page); //number type 1 ���� ������ ���� ���� ����¡ �׺���̼��� ǥ���ϱ� ���Ѱ�
        			}else{
        				if(config.paging.query){
            				var param = {
        		    			url:_this.lastAjaxForm.attr("action"),
        		    		 	type:_this.lastAjaxForm.attr("method"),
        		    		 	data:_this.lastAjaxForm.serialize()+_this.getQueryPagingInfo(page),
        		    		 	success: function (data,jqXHR){
        		    		 		_this.tbody.html(data);
        		    		 		_this.resizing();
        		    		 		$makePagingNavigation(page);
        		    		 		_this._syncWithFix("pagingMode",{rows:$(data).clone()});
        		    		 	}
        		    		};
        					$.ajax(param);
            			}else{
            				var tr = $(_this.rowArray[(page-1)]).clone();
            				_this.currentRowArrayIndex = (page-1);
        			    	_this.tbody.html(tr);
        			    	$makePagingNavigation(page);
        			    	_this._syncWithFix("pagingMode",{rows:tr.clone()});
            				return tr;
            			}
        			}
				};
				
				var $makePagingNavigation = function(currentPage){
					var rowsPerPage = parseInt(config.paging.rows);
			    	var start = (currentPage-1)*rowsPerPage;
			    	var end   = (currentPage*rowsPerPage) -1;

			    	var totalPage  = Math.floor(parseInt(_this.totalCount/rowsPerPage));
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
    					var pre02 = $("<a href='#' rel='history' class='direction prev'><span></span><span></span> ó��</a>");
    					var pre01 = $("<a href='#' rel='history' class='direction prev'><span></span> ����</a>");
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
    					var next01= $("<a href='#' rel='history' class='direction next'>���� <span></span></a>");
    					var next02 = $("<a href='#' rel='history' class='direction next'>�� <span></span><span></span></a>");
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
    				
    				if(config.gridInfo == true){
    					$('#gridInfo_'+_this.id+'_page').text("["+currentPage+"/"+totalPage+"]");
    				}
    				
    				pagingArea.html("");
    				pagingArea.append(navi);
            		/*
            		// set onlick event for buttons
            		$("a[rel=\"history\"]",pagingArea).click(function(){
            			// 
            			var hash = this.href;
            			hash = hash.replace(/^.*#/, '');
            			// moves to a new page. 
            			// pageload is called at once. 
            			$.history.load(hash);
            			return false;
            		});
    				*/
    				log("[ start : "+start +  " , end : " +  end  + " ] [ totCnt = "+ totalCount +" ]");
				};
        		
				if(config.paging.query){
					_this.totalCount  = totalCount;
					_this.tbody.html(data);
    				if(_this.cellFixMode == true){
      					_this.tbodyFix.html(data);
        			}
    				
    				if(config.paging.type == '1'){         // ����¡
						return $paging(pagingPage);
					}else if(config.paging.type == '2'){   // ��ũ�� �����鼭 ������Ʈ.
						
					}
					
				}else{
					var tempNode  = document.createElement('div');
					var tableRows = null;
					var tbodyNodeList 		= null;
	    			var tbodyNodeListLength = 0;
					
	        		if(typeof data =="string"){	//ajax ȣ���� �ݹ����� �������
	        			tempNode.innerHTML = "<table>" + data + "</table>";
	        			tbodyNodeList = tempNode.getElementsByTagName("TBODY");
	        			tbodyNodeListLength = tbodyNodeList.length;
	        			tableRows = tempNode.firstChild.rows;
	        		}else{	//�����Ŀ��� Object Array�� ����
	        			tableRows = data;
	        		}
	        		
	    			_this.totalCount  = tableRows.length;
	    			var rowsPerPage = parseInt(config.paging.rows);
	    			
	    			if(tbodyNodeListLength > 1){ //���������� tbody�� ����� ������ ���
	    				for(var i =0, ic = tbodyNodeListLength ; i < i ; i++ ){
	    					this.rowArray[i] = tbodyNodeList[i].childNodes;
	    				}
	    				this.rowArray.length = tbodyNodeListLength;
	    			}else{	//�Ϲ����� ���
	        			//Object nodeList�� Array�� ��ȯ
	    				var newArr = _this.convertToArray( tableRows, 0 );
	        			var tbodyGroup = parseInt( _this.totalCount / rowsPerPage ); 
	        			for( var i = 0; i < tbodyGroup; i++ ){
	        				var start 	= i * rowsPerPage;
	        				var end 	= ( i+1 ) * rowsPerPage;
	        				_this.rowArray[i] = newArr.slice( start, end );
	        			}
	        			
	        			_this.rowArray.length = tbodyGroup;
	        			
	        			//������ row ó��
	        			if(_this.totalCount % rowsPerPage != 0){
	        				_this.rowArray[tbodyGroup] = newArr.slice(tbodyGroup*rowsPerPage,_this.totalCount);
	        				_this.rowArray.length = tbodyGroup + 1;
	        			}
	    			}
					
					if(config.paging.type == '1'){         // ����¡
						return $paging(pagingPage);
					}else if(config.paging.type == '2'){   // ��ũ�� �����鼭 ������Ʈ.
						var tbody = $("<tbody id=\"tbody_0\"></tbody>");
						var tr = $(_this.rowArray[0]).clone();
						_this.currentRowArrayIndex = 0;
						
						
						tbody.append(tr);
						_this.tbody.remove();         //������ �����...������ �������...
						_this.tbodyTable.html(tbody);

						if(_this.cellFixMode == true){
							var tbodyFix = $("<tbody id=\"tbodyFix_0\"></tbody>");
							tbodyFix.append(tr.clone());
							_this.tbodyFix.remove();
							_this.tbodyTableFix.html(tbodyFix);
						}
						
						if(config.gridInfo == true){
							$('#gridInfo_'+_this.id+'_page').text("[0~"+rowsPerPage+"]");
						}
						
						return tr;
					}else if(config.paging.type == '3'){
						var tbody = $("<tbody id=\"tbody_0\"></tbody>");
						var tr = $(_this.rowArray[0]).clone();
						_this.currentRowArrayIndex = 0;
						
						tbody.append(tr);
						_this.tbody.remove();         //������ �����...������ �������...
						_this.tbodyTable.html(tbody);
						
						//_this.totalCount ���� -1�� �� ������... ����� �����δ� ��Ȯ�� ������ �𸣰ٳ�..
						var scrollHeight = _this.trHeight * (_this.totalCount-1);
						scrollHeight = scrollHeight;
						
						
						
						if($.browser.msie && ($.browser.version=="7.0"||$.browser.version=="6.0")){
							_this.tbodyTable.css("float","left");
							_this.tableBodyDiv.append("<div style='float:left;height:"+scrollHeight+"px'></div><div style='clear:both;'></div>");
						}else{
							_this.tableBodyDiv.css("position","relative");
							$("<div style='position:absolute;width:1px;top:0px;height:"+scrollHeight+"px;'></div>").insertBefore(_this.tbodyTable);
						}
						
						if(_this.cellFixMode == true){
							var tbodyFix = $("<tbody id=\"tbodyFix_0\"></tbody>");
							tbodyFix.append(tr.clone());
							_this.tbodyFix.remove();
							_this.tbodyTableFix.html(tbodyFix);
						}
					}
				}
    		},
            
            _editMode:function(selTdObj){
            	var col = $(this.theadCols.eq(selTdObj.cellIndex));
            	if( col.hasClass("editable")){
            		if (selTdObj.firstChild && selTdObj.firstChild.nodeType != 3){
						return;
					}
            		var selTrObj = $(selTdObj.parentNode);
            		selTdObj = $(selTdObj);
					
            		//Event Function for input and select
					var bindFunc = function(){
						var inputVal = newHTML.val();
						selTdObj.attr("data-currentValue",inputVal);
						
						if(newHTML.get(0).nodeName=="SELECT"){
							inputVal = $("option:selected",newHTML).text(); 
						}
						
						inputVal = $.trim(inputVal);
						
						var execute = selTrObj.attr("data-execute");
						if(inputVal != selTdObj.attr("data-preValue")){
							selTdObj.attr("data-isEditedValue","true");
							if("insert" != execute){
								selTrObj.attr("data-execute","update");
								selTdObj.addClass("editedTdForUpdate");
							}else{
								selTdObj.addClass("editedTdForInsert");
							}
						}else{
							selTdObj.attr("data-isEditedValue","false");
							if("insert" != execute){
								selTdObj.removeClass("editedTdForUpdate");
								if($("TD[class=\"editedTdForUpdate\"]",selTrObj).size()==0){
									selTrObj.attr("data-execute",null);
								}
							}else{
								selTdObj.removeClass("editedTdForInsert");
							}
						}
						
						selTdObj.removeClass("editMode");
						selTdObj.html(inputVal);
						
						var eventClassName = newHTML.attr('class'); 
						if(eventClassName == 'calendarInput'){
							try{
								var dataChange = col.attr("data-change");
								if(dataChange  !== undefined){
									eval(dataChange)(selTdObj);
								}
							}catch(e){log(e.message, '_editMode' );}
						}
						
						newHTML.remove();
						
						//if(selTdObj.attr("data-isEditedValue")=="true"){
							_this._syncWithFix("editMode",{rows:selTrObj});
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
						
						newHTML.bind('change',bindFunc);
						newHTML.bind('blur',bindFunc);
						selTdObj.html(newHTML);
						
						newHTML.focus();
					}else if(col.attr("data-calendar")!==undefined){
						$("input[class=\"calendarInput\"]",_this.tbodyTable).each(function(){
							$(this).trigger("bindFunc");
						});
						
						newHTML = $("<input type='text' class='calendarInput' value='"+ v +"' style='width:"+ w +"px;height:"+ h +"px;margin:0px;border:0px;' />");
						newHTML.bind('bindFunc',bindFunc);
						selTdObj.html(newHTML);
						
						try{
							popUpYYYYMMDD(newHTML.get(0),config.calendar.type,config.calendar.delim);
						}catch(e){}
					}else {
						newHTML = $("<input type='text' class='editInput' value='"+ v +"' style='width:"+ w +"px;height:"+ h +"px;margin:0px;border:0px;' "+dataEvents+" />");
						newHTML.bind('blur',bindFunc);
						selTdObj.html(newHTML);
						
						newHTML.select();
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
            				
            				//fixable th ���� ���߱� ����..span �� ����.
            				var resizeCursorFixClone = resizeCursorClone.clone();
            				resizeCursorFixClone.css('cursor', '');
            				var thFixElement = thFix.eq(k);
            				thFix.eq(k).append(resizeCursorFixClone);
        				}
        			}// end of if(thElement.attr("colspan")==1){
        		});
            },

            _getCellIndex : function(cell) {
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
    	    				
    	    				//���� �������� �� ���� firstCol size�� 0
    	    				if(firstCol.size() != 0){
    	    					if( firstCol.innerWidth() == firstCol.width()){
        	    					//�е��� 0�� ���
        	    					this.colPadding = 0;
        	    				}else{
        	    					//�е��� ���� ���
        	    					this.colPadding = firstCol.innerWidth() - firstCol.width();
        	    				}
    	    				}
    	    			}
    	    			
    	    			// �е��� ��� 
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

	        	    		// ������ �е��� ���	        	    		
	        	    		for(var i = 0, ic = colsFix.size(); i < ic; i++ ){
	        	    			var colPaddingFix = firstRowColGroupFix.eq(i).innerWidth() - firstRowColGroupFix.eq(i).width();
	        	    			if(colsFix.eq(i).attr("width").indexOf('%') == -1){
	        	    				colsFix.eq(i).attr("width", colsFix.eq(i).attr("width") - colPaddingFix);
	        	    			}
	        	    		}
	        	    		// colspan ��� ������ +1 �Ǵ� ���� ����
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
        		    		// colspan ��� ������ +1 �Ǵ� ���� ����
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
    			
    			//����ڰ� ������ callback�Լ��� �����Ѵ�. ���� callback �Լ��� ������ ������� callback �Լ��� ȣ�� 
    			ajaxOptions['success']   = param.success; 
    			ajaxOptions['error']     = param.error; 
    			ajaxOptions['complete']  = param.complete;
    			
    			//callback �Լ��� ���� callback �Լ��� ����
    			//param['success']   = _this._onSuccess;
    			param['success']   = function(data,textStatus,jqXHR){  _this._onSuccess (data,textStatus,jqXHR,ajaxOptions);  };
    			param['error']     = function(jqXHR,textStatus,errorThrown){  _this._onError   (jqXHR,textStatus,errorThrown,ajaxOptions);  };
    			param['complete']  = function(jqXHR,textStatus){  _this._onComplete(jqXHR,textStatus,ajaxOptions);  };
    			
    			$.ajax(param);
    			
    		},
    		_onSuccess : function(data,textStatus,jqXHR,ajaxOptions){
    			if(config.paging.rows !== undefined){ //����¡ �� ��...
    				var totalCount = typeof jqXHR=='object' ? jqXHR.getResponseHeader("gridTotalCount") : jqXHR;
    				data  = _this._pagingMode(data,totalCount);
    			}else{  //����¡ �� �� ��..
    				if(_this.cellFixMode){
    					var clonedData = $("<tbody>").append(data).clone().children();
      					_this.tbodyFix.html(clonedData);
        			}
    				
    				_this.tbody.html(data);
    			}

    			//�ѰǼ� ���.
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
    			//���� �۾��� �ִٸ� �߰�
    			log(jqXHR,"ERROR_AJAX_OnError");
    			
    			if(ajaxOptions!==undefined && ajaxOptions['error']){
    				ajaxOptions['error'](jqXHR,textStatus,errorThrown);
    			}
    		},
    		_onComplete : function(jqXHR,textStatus,ajaxOptions){
    			
    			//���� �۾��� �ִٸ� �߰�
    			_this.loadingDiv.hide();
    			if(ajaxOptions!==undefined && ajaxOptions['complete']){
    				ajaxOptions['complete'](jqXHR,textStatus);
    			}
    		},
    		
    		updateBody : function(formObj,settings){
            	//�����۾�(updateBody�� ȣ����Ĵ� �������� ����� �������� �ʱ�ȭ)
    			_this.startIdx = 1;        //���� ������
        		_this.endIdx = 2;          //��������
        		_this.rowArray = new Object();
        		_this.rowArray.length = 0;
        		_this.currentRowArrayIndex = 0;
            	
            	_this.lastAjaxForm = formObj.clone();

            	//����Ʈ �ڽ��� ���õ� ���� ���簡 �ȵǾ� ���õ� ���� �ٽ� �־���.
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
    			var newTR = _this.trReference.clone();
    			if(defaultJSON){
    				var td = $("td",newTR);
    				for(var i in defaultJSON){
    					td.eq(i).text(defaultJSON[i]);
    				}
    			}
    			_this.appendRow(newTR);
    		},
    		appendRow : function(rows){
    			var tempTbody = $("<tbody>").append(rows);
    			$("tr",tempTbody).each(function(){
    				$(this).attr("data-execute","insert");
    			});
    			
    			$("tbody",this.tbodyTable).append(tempTbody.clone().children());
    			
    			if(config.paging.rows !== undefined){
    				this.totalCount++;
    			}
    			
    			var scrollHeight = this.tableBodyDiv.attr('scrollHeight');
    			this.tableBodyDiv.scrollTop(scrollHeight + 30);
    			
    			if(this.cellFixMode == true){
    				$("tbody",this.tbodyTableFix).append(tempTbody.clone().children());
    			}
    			
    			if(config.gridInfo == true){
    				$('#gridInfo_'+_this.id+'_count').text(_this.getRowCount());
    			}
    			
    			tempTbody.remove();
   			 	this.resizing();
    		},
    		
    		removeAll : function(){
    			$("tbody",this.tbodyTable).html("");
    		},
    		
    		removeRow : function(row){
    			var rowObj = $(row);
				var execute = rowObj.attr("data-execute");
				if(execute=="insert"){
					rowObj.remove();
				} else {
					rowObj.attr("data-execute","delete");
					rowObj.hide();
				}
				
				if(config.paging.rows !== undefined){
    				this.totalCount--;
    			}
				this.resizing();
    		},
    		
    		_isJQueryObject :function(obj){
    			if(obj.val !== undefined){
    				return true;
    			}else{
    				return false;
    			}
    		},
    		
    		//childObject�� ������ ROW�� ã�Ƴ��� ��ȯ�Ѵ�.
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
    		//�߰��ǰų�[insert], �����ǰų�[update], ������[delete] row���� ��ȯ�Ѵ�.
    		getRowsByCmd : function(cmd){
    			return $("tr[data-execute=\""+cmd+"\"]",_this.tbodyTable);
    		},
    		
    		//row �κ��� td�� ���� �����迭�� ���·� ��´� �����Ǵ� ���� col �±��� id (ex: <col id="col_name" />���� ������ ['name']���� �� ���� )
    		getRowDataArray : function(row){
    			var dataArray = new Array();
				$("td",row).each(function( i ){
					var key = _this.theadCols.eq(this.cellIndex).attr("id");
					key = (key != null) ? key.substring(key.indexOf("_")+1) : i;
    				if($(this).find("input").val() != null){
						dataArray[key] = $(this).find("input").val();
					}else{
						dataArray[key] = $(this).text();
					}
    				//������ ��
    				dataArray["pre_"+key] = $(this).attr("data-preValue");
    			});
    			return dataArray;
    		},
    		
    		//���� ���õ� ���� ��ȯ
    		getSelectedRow : function(){
    			return $("tbody > tr."+config.selectClassName, this.tbodyTable);
			},
    		
    		//���� ���õ� ���� ��ȯ(multi)
    		getSelectedMultiRow : function(){
    			return $("tbody > tr."+config.selectClassName, this.tbodyTable);
    		},
    		
    		//���� ���õ� ���� ������ ��ȯ(���� �迭 ����)
    		getSelectedRowData : function(){
    			if(_this.lastSelectedTRIndex == null){
    				return null;
    			}
    			return _this.getRowDataArray($("tbody > tr", this.tbodyTable).eq(_this.lastSelectedTRIndex));
    		},
    		
    		//�׸��� �� ��� row��ȯ
    		getAllRow : function(){
    			return $("tbody > tr", this.tbodyTable);
    		},
    		
    		//���� ���õ� ���� ������ ��ȯ(multi)
    		getSelectedMultiRowData : function(){
    			var selectedArray = new Array();

    			$("tbody > tr.selectedTR", this.tbodyTable).each(function() {
    				selectedArray.push( _this.getRowDataArray($(this)) );
    			});
    			
    			return selectedArray;
    		},
    		
    		//�׸��� �� ��� row���� dataArray�� ��ȯ
    		getAllRowData : function(){
    			var rowArray = new Array();
    			$("tbody > tr", this.tbodyTable).each(function() {
    				rowArray.push( _this.getRowDataArray($(this)) );
    			});
    			return rowArray;
    		},
    		
    		//���õ� row���� ����
    		unSelectRows : function(){
    			$("tbody > tr."+config.selectClassName, this.tableContainer).each(function() {
    				$(this).removeClass(config.selectClassName);
    			});
    		},
    		
    		//�׸������ ��� row�� ������ ��ȯ
    		getRowCount : function(){
    			if(config.paging.rows !== undefined){
    				return this.totalCount;
    			}else{
    				return $("tbody > tr", this.tbodyTable).size();
    			}
    		},
    		
    		//�׸���� üũ�ڽ��� ������� üũ�ڽ� index�� true, false�� ���� �ش�Ǵ� ������ ��ȯ
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
    				alert("������ ��ȸ �� �����ٿ�ε尡 �����մϴ�.");
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
		    				colId = colId.substring(4,colId.length);   //col_�߶��ش�.
		    				
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
    				alert("serverConfig �� ���ǵ��� �ʾҽ��ϴ�.\n  ex : {bld:'samples/database/listCities'}" );
    				return;
    			}
    			
    			var bld = serverConfig.bld;
    			if(bld === undefined){
    				alert("ȣ��� bld�� ���ǵ��� �ʾҽ��ϴ�.\n  ex : 'server' : {bld:'samples/database/listCities'}");
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
    						alert("������ ���°� ��ȿ���� �ʽ��ϴ�.\n ex : empno=OS380&name=neoxeni ");
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
 *	str ���̰� length�� �ɶ����� 0�� �ݺ��Ͽ� ���δ�. 
 *  @param  string  str         0�� �߰��� ���ڿ� 	  
 *  @param  int     length 	    0�� �߰��� str�� �ִ� ���� 
 *  @param  int     gubun 	    0 : �տ� �ݺ��Ͽ� ���δ�.  ,  1: �ڿ� �ݺ��Ͽ� ���δ�. 
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

//���콺 �� �̺�Ʈ
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
