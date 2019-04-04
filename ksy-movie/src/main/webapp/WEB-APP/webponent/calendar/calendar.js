$.calendar = function(selector, settings){
	var config = {
		type:"day"         	// 일달력,월달력 구분  	[day:일 달력,		month:월 달력]
		,delim:"/"			// 년 월 일 사이의 구분자 [- : 2011-10-10]
		,holiday:true		// 공휴일선택가능 여부	[true:선택가능, 	false:선택불가]
		,weekend:true		// 주말 선택가능 여부	[true:선택가능, 	false:선택불가]
		,startRange:""		// 선택가능 시작일		[20111212 : 2011년 12월 12일 이후일만 선택가능]
		,endRange:""		// 선택가능 종료일		[20111231 : 2011년 12월 31일 이전일만 선택가능]
		,label:""			// 인풋 박스 title label 설정(ex: 조회 시작일)
		,lang:"kor"         // 언어설정 (kor or eng)
		,hasdefaultToday : true
		,defaultDay:[0,0,0] //년도, 월, 일 (오늘 기준)
		,reInit : false
		,zIndex : 5
        ,indiTop : 26
        ,indiLeft : 20
        ,mobileIndiTop : 34
        ,mobileIndiLeft : 20
		,left: 0
		,top:32
		,mobileLeft:0
		,mobileTop:40
		,startCalendar:undefined
		,endCalendar:undefined
    };
	
    if ( settings ){$.extend(config, settings);}
    
    var endDayArray 		= [31,28,31,30,31,30,31,31,30,31,30,31];   	//각달의 마지막 날짜
	//var dayNameArray 		= ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]; 	//숫자 요일을 문자 요일 바꿀 함수
    //var monthNameArray	= ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"];
    //var dayNameArray 		= ["일", "월", "화", "수", "목", "금", "토"]; 	//숫자 요일을 문자 요일 바꿀 함수
    //var monthNameArray	= ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
    
    var language = {
    	kor:{
    		dayNameArray:["일", "월", "화", "수", "목", "금", "토"],
    		monthNameArray:["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
    		prevYear:"이전 년",
    		prevMonth:"이전 달",
    		nextYear:"다음 년",
    		nextMonth:"다음 달",
    		calendar:"달력",
    		close:"달력 닫기",
    		year:"년",
    		month:"월",
    		open:"달력 레이어 열기",
    		input:"",
    		startCalMsg:"종료일은 시작일보다 이전일수 없습니다.",
    		endCalMsg:"시작일은 종료일보다 이후일수 없습니다."
    	},
    	eng:{
    		dayNameArray:["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    		monthNameArray:["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"],
	    	prevYear:"prevYear",
			prevMonth:"prevMonth",
			nextYear:"nextYear",
			nextMonth:"nextMonth",
			calendar:"calendar",
			close:"close calendar",
			year:"",
	    	month:"",
	    	open:"open calendar layer",
	    	input:"",
	    	startCalMsg:"종료일은 시작일보다 이전일수 없습니다.",
    		endCalMsg:"시작일은 종료일보다 이후일수 없습니다."
    	}
    };
    
    var calLang = language[config.lang];

    function setCalendarPosition (indi, div) {

		indi.position({
			at : 'left top',
			my : 'left+'+config.indiLeft+'px top+'+ config.indiTop+'px',
			of : _this.inputTag
		});

		div.position({
			at : 'left top',
			my : 'left+'+config.left+'px top+'+ config.top+'px',
			of : _this.inputTag,
			collision : 'fit none'
		});
	}
    
    
    var _this = {
    	initialize : function(){
    		calLang = language[config.lang];
    		try{
    			if(getDevice()=="mobile"){
    				config.left = config.mobileLeft;
    				config.top = config.mobileTop;
                    config.indiLeft = config.mobileIndiLeft;
                    config.indiTop = config.mobileIndiTop;
    			}
    		}catch(e){}
    		
    		
    		this.inputTag  	= $(selector);
    		this.imgTag 	= undefined;
    		this.divTag		= undefined;
            this.divIndi    = undefined;
    		
    		var todayDate  	= new Date();
    		this.today 		= Number(String(todayDate.getFullYear())+padZero(todayDate.getMonth()+1)+padZero(todayDate.getDate()));
    		this.targetYear = String(todayDate.getFullYear());
    		this.targetMonth= padZero(todayDate.getMonth()+1);
    		
    		
    		this.inputTag.bind("disabled.calendar",function(e,flag){
	    		_this.inputTag.prop("disabled",flag);
	    		_this.imgTag.prop("disabled",flag);
	    		
	    		if(flag){
	    			_this.inputTag.data("beforeValue",_this.inputTag.val());
	    			_this.inputTag.val("");
	    		}else{
	    			_this.inputTag.val(_this.inputTag.data("beforeValue"));
	    		}
	    	});
    		

    		function formatCalendar(obj, mode,config){
    			var type = config.type;
    			type = (type === undefined) ? 'day' : type;
    			var limitLengh = type == 'day' ? 8 : 6;
    			//type 이  month일경우 추가 [박대영]
    			if( obj.value == '') {
    				return;
    			}
    			
    			var date = obj.value;
    			date = date.replace(/[^0-9]/g,"");
    					
    			
    			if( mode == 'on'){
    				
    				obj.value = date;
    				obj.select();
    				
    			}else if (mode == 'off') {
    				var jObj = $(obj);
    				var label = config.label;
    				
    				if( date.length != limitLengh) {
    					alert(label + '을 확인 해 주십시오.');
    					jObj.val(jObj.data("validValue"));
    					obj.focus();
    					return "";
    				}
    				
    				if(isNaN(Number(date))) {
    					alert('숫자를 입력해 주시기 바랍니다.');
    					jObj.val(jObj.data("validValue"));
    					obj.focus();
    					return "";
    				}

    				
    				// 입력 월 체크
    				if( date.substring(4, 6) > 12 || date.substring(4, 6) == 0) {
    					alert(label + '을 확인 해 주십시오.');
    					jObj.val(jObj.data("validValue"));
    					obj.focus();
    					return "";
    				}
    				// 입력 일 체크

    				if(type == 'day'){
    					if( date.substring(6) > 31 || date.substring(6) == 0) {
    						alert(label + '을 확인 해 주십시오.');
    						obj.value = '';
    						jObj.val(jObj.data("validValue"));
    						obj.focus();
    						return "";
    					}
    				}
    				
    				return date;
    			}
    		}
    		
    		
    		//type 이  month일경우 추가 [박대영]
    		this.inputTag.bind('focus',function (){
    			formatCalendar(this,'on', config);
    			
    			//입력박스에 포커스가 갈경우 달력을 닫는다.
    			_this.closeCalendar(false);
    		});
    		
    		this.inputTag.bind('blur',function (){
    			var date = formatCalendar(this,'off', config);
    			if(!ci.util.isNull(date)){
    				var dateObj = _this.getDateArray(date,0,0,0);
            		
        			if(config.type == "month"){
        				_this.setDate(dateObj["year"] + config.delim + dateObj["month"],"inputDate");
        			}else if(config.type == "day"){
        				_this.setDate(dateObj["year"] + config.delim + dateObj["month"] +config.delim+ dateObj["day"],"inputDate");
        			}
    			}
    		});
    		
    		if(config.startRange == 'today'){
    			if(config.type == "month"){
    				config.startRange = this.targetYear + this.targetMonth;
    			}else if(config.type == "day"){
    				config.startRange = this.targetYear + config.delim + this.targetMonth +config.delim+ padZero(todayDate.getDate());
    			}
			}
    		
    		if(config.endRange == 'today'){
    			if(config.type == "month"){
    				config.endRange = this.targetYear + this.targetMonth;
    			}else if(config.type == "day"){
    				config.endRange = this.targetYear + config.delim + this.targetMonth +config.delim+ padZero(todayDate.getDate());
    			}
			}
    		
    		if(config.hasdefaultToday == true){    			
        		var defaultDay = config.defaultDay;
        		
        		var date = this.inputTag.val() != "" ? _this.inputTag.val() : _this.today.toString();
        		
        		var dateObj = _this.getDateArray(date,defaultDay[0],defaultDay[1],defaultDay[2]);
        		
    			if(config.type == "month"){
    				_this.setDate(dateObj["year"] + config.delim + dateObj["month"],"defaultDate");
    			}else if(config.type == "day"){
    				_this.setDate(dateObj["year"] + config.delim + dateObj["month"] +config.delim+ dateObj["day"],"defaultDate");
    			}
    		}
    		
    		var spanWrapper = $(_this.inputTag.get(0).parentNode);

    		if(spanWrapper.attr("class")!="calendarWrapper"){
    			_this.inputTag.addClass("calendarInput");
    			_this.inputTag.wrapAll($('<span class="calendarWrapper" style="z-index: '+config.zIndex+';"/>'));
    			 
    			
    			if(config.label=="" && this.inputTag.attr("title")!==undefined){
        			config.label = this.inputTag.attr("title");
        		}
    			
        		this.inputTag.attr("title",config.label+" "+calLang["input"]+"\n(ex:"+Number(String(todayDate.getFullYear()))+padZero(todayDate.getMonth()+1)+padZero(todayDate.getDate())+")");
        		config.label = this.inputTag.attr("title");
        		
        		
    			_this.imgTag = $('<input type="button" class="calOpenBtn" title="'+config.label+' '+calLang["open"]+'">');
    			
    			
    			_this.divTag = $('<div class="calendarDiv"></div>').css({
    				'position': 'absolute',
    				'display': 'none',
    				'z-index': '242424121'
    			});
				
    			_this.divIndi = $('<div class="calendarIndi">');
                _this.divIndi.css({
                    'display' : 'none',
                    'position' : 'absolute'
                });
              
              	setCalendarPosition(_this.divIndi, _this.divTag);
                                    
                _this.inputTag.after($(_this.divTag));
                _this.inputTag.after($(_this.divIndi));
                _this.inputTag.after($(_this.imgTag));

    		}else{
    			if(config.reInit){
    				spanWrapper.find(".calOpenBtn").remove();
    				spanWrapper.find(".calendarDiv").remove();
    				_this.imgTag = $('<input type="button" class="calOpenBtn" title="'+config.label+' '+calLang["open"]+'">');
        			
	    			_this.divTag = $('<div class="calendarDiv"></div>').css({
	    				'position': 'absolute',
	    				'display': 'none',
	    				'z-index': '242424121'
	    			});
	                
	    			_this.divIndi = $('<div class="calendarIndi">');
	                _this.divIndi.css({
	                    'display' : 'none',
	                    'position' : 'absolute'
	                });

	                setCalendarPosition(_this.divIndi, _this.divTag);
                    
        			_this.inputTag.after($(_this.divTag));
                    _this.inputTag.after($(_this.divIndi));
        			_this.inputTag.after($(_this.imgTag));

        			if(config.startRange != "" && config.startRange != null){        				        				
        				_this.inputTag.val(config.startRange);
        			}
        		}else{
        			_this.imgTag = $("button",spanWrapper);
        			_this.divTag = $("div.calendarDiv",spanWrapper);
        		}
    		}

    		_this.initLayout();
    		
    		return this;
    	},
    	
    	initLayout :function(){
    		var inputTag = this.inputTag;
    		var imgTag   = this.imgTag;
    		var divTag   = this.divTag;
            var divIndi   = this.divIndi;
            
    		var dateArray 	= _this.getDateArray(inputTag.val());
    		var vYear		= dateArray["year"];
    		var vMonth		= dateArray["month"];
    		var vDate		= dateArray["day"];
    		
    		var calendar = "";
    		calendar += '<div class="calendar" title="'+calLang["calendar"]+'" >';
    		calendar +=	'<div class="wrap">';
    		
    		
    		if(config.type=="day"){
    			calendar += '<div class="body_day">';
    			calendar += '	<div class="month">';
    			calendar += '		<a href="javascript:void(0)" id="prevYear" title="'+calLang["prevYear"]+'" class="prevYear"><span class="c-prevYear">'+calLang["prevYear"]+'</span></a>';
    			calendar += '		<a href="javascript:void(0)" id="prevMonth" title="'+calLang["prevMonth"]+'" class="prevMonth"><span class="c-prevMonth">'+calLang["prevMonth"]+'</span></a>';
    			calendar += '		<span class="calendarTitle">' + vYear + '.' + vMonth + '</span>';
    			calendar += '		<a href="javascript:void(0)" id="nextMonth" title="'+calLang["nextMonth"]+'" class="nextMonth"><span class="c-nextMonth">'+calLang["nextMonth"]+'</span></a>';
    			calendar += '		<a href="javascript:void(0)" id="nextYear" title="'+calLang["nextYear"]+'" class="nextYear"><span class="c-nextYear">'+calLang["nextYear"]+'</span></a>';
    			calendar += '	</div>'; 
    			calendar += '	<div class="calendarTable"></div>'; //테이블달력이 들어가는 Element
    			calendar += '</div>';
    		}else if(config.type=="month"){
    			calendar += '<div class="body_mon">';
    			calendar += '	<div class="month">';
    			calendar += '		<a href="javascript:void(0)" id="prevYear" title="'+calLang["prevYear"]+'" class="prevYear"><span class="c-prevYear">'+calLang["prevYear"]+'</span></a>';
    			calendar += '		<span class="calendarTitle">' + vYear + '</span>';
    			calendar += '		<a href="javascript:void(0)" id="nextYear" title="'+calLang["nextYear"]+'" class="nextYear"><span class="c-nextYear">'+calLang["nextYear"]+'</span></a>';
    			calendar += '	</div>';
    			calendar += '	<div class="calendarTable"></div>'; //테이블달력이 들어가는 Element
    			calendar += '</div>';
    		}
    		calendar += '<button type="button" id="closeBtn" title="'+calLang["close"]+'"><span class="hidden">'+calLang["close"]+'</span></button>';
    		calendar += '</div>'; //end of <div class="wrap">
    		calendar += '</div>'; //end of <div class="calendar" ~~ >
    		
    		divTag.html(calendar);
    		
    		_this.calendarTitle = $("SPAN.calendarTitle",divTag); 
    		var calendarTable 	= $("DIV.calendarTable",divTag);
    		var prevYear  		= $("#prevYear" ,divTag);
    		var prevMonth 		= $("#prevMonth",divTag);
    		var nextYear 		= $("#nextYear" ,divTag);
    		var nextMonth 		= $("#nextMonth",divTag);
    		var closeBtn 		= $("#closeBtn" ,divTag);
    		
    		//링크 클릭시
    		calendarTable.delegate("td","click",function(){    			
    			var td = $(this);
    			if(td.hasClass("selectable")){
    				if(config.type == "day"){
    					if(_this.setDate(_this.targetYear + config.delim + _this.targetMonth +config.delim+ padZero(td.text().replace(/[^0-9.-]/g,''))),"selectDate"){
    						_this.closeCalendar();
    					};
    				}else if(config.type == "month"){    					
    					if(_this.setDate(_this.targetYear + config.delim + padZero(td.text().replace(/[^0-9.-]/g,''))),"selectDate"){
    						_this.closeCalendar();
    					};
    				}    				
    			}
    		});
    		
    		//달력 닫기 이벤트
    		closeBtn.click(function(event){
                divIndi.hide();
    			divTag.hide();
                _this.inputTag.closest('.calendarWrapper').removeClass('opened');
                imgTag.focus();
    		});
    		
    		//이전년도 클릭시
    		prevYear.click(function(event){
    			_this.moveYearMonth(calendarTable,-1,0,0);
    		});
    		
    		//다음년도 클릭시
    		nextYear.click(function(event){
    			_this.moveYearMonth(calendarTable,1,0,0);
    		});
    		
    		if(config.type=="day"){
    			//이전달 클릭시
    			prevMonth.click(function(event){
    				_this.moveYearMonth(calendarTable,0,-1,0);
    			});
    			//다음달 클릭시
    			nextMonth.click(function(event){
    				_this.moveYearMonth(calendarTable,0,1,0);
    			});
    			
    			//inputTag.attr("maxlength",8);
    		}else if(config.type=="month"){
    			//inputTag.attr("maxlength",6);
    		}
    		
    		//달력 이미지 클릭시
    		
    		imgTag.click( function(event) {
    			
    			
    			if(_this.divTag.css("display")=="block"){
    				_this.divTag.hide();
                    _this.divIndi.hide();
                    _this.inputTag.closest('.calendarWrapper').removeClass('opened');
    				return false;
    			}

                $('span.calendarWrapper').removeClass('opened');
                $('div.calendarIndi').hide();
    			$("DIV.calendarDiv").each(function(){
    				$(this).hide();
    			});
    			
    			var inputDate 	= inputTag.val();
    			var dateArray 	= _this.getDateArray(inputDate);
    			var vYear		= dateArray["year"];
    			var vMonth		= dateArray["month"];
    			var vDate		= dateArray["day"];
    			
    			_this.targetYear	= vYear;
				_this.targetMonth 	= vMonth;
				_this.setCalendarTitle();
    			
    			if(config.type=="day"){
    				calendarTable.html(_this.makeDayCalendar(vYear,vMonth,vDate));
    			}else if(config.type=="month"){
    				calendarTable.html(_this.makeMonthCalendar(vYear,vMonth));
    			}
    			
                _this.inputTag.closest('.calendarWrapper').addClass('opened');

                divIndi.show();
    			divTag.show();

    			setTimeout(function () {
    				setCalendarPosition(divIndi, divTag);
    			}, 5);
                
                
    			return false;
    		});
    	},
    	
    	makeDayCalendar : function(vYear,vMonth,vDate){
    		var dayNameArray = calLang["dayNameArray"];
    		
    		var col=0;  //나중에 앞뒤 빈 날짜칸 계산 

    		var _eDate = new Date(vYear,vMonth-1,1);       // 변경된 날짜 객체 선언
    		var fNumday=_eDate.getDay();    			   // 첫번째 날짜 1일의 숫자 요일
    		var lastDay = endDayArray[_eDate.getMonth()];  // 변경된 월의 마지막 날짜
    		
    		if ((_eDate.getMonth()==1)&&(((_eDate.getYear()%4==0)&&(_eDate.getYear() %100 !=0))||_eDate.getYear() % 400 ==0 ))
    		{lastDay=29;} // 0월 부터 시작하므로 1는 2월임. 윤달 계산 4년마다 29일 , 100년는 28일, 400년 째는 29일
    		
    		var calendarStr = "";
    		
    		calendarStr += '<table>';
    		calendarStr += '<colgroup>';
    		calendarStr += '<col width="27px" /><col width="27px" /><col width="27px" /><col width="27px" /><col width="27px" /><col width="27px" /><col width="27px" />';
    		calendarStr += '</colgroup>';
    		calendarStr += '<thead>';
    		calendarStr += '<tr>';
    		calendarStr += '<th>'+dayNameArray[0]+'</th><th>'+dayNameArray[1]+'</th><th>'+dayNameArray[2]+'</th><th>'+dayNameArray[3]+'</th>';
    		calendarStr += '<th>'+dayNameArray[4]+'</th><th>'+dayNameArray[5]+'</th><th class="last">'+dayNameArray[6]+'</th>';
    		
    		calendarStr += '</tr>';
    		calendarStr += '</thead>';
    		calendarStr += '<tbody>';
    		calendarStr += '<tr>';

    		for (var i=0;i<fNumday;i++){          // 첫번째 날짜의 숫자 요일을 구해서 그전까지는 빈칸 처리
    			calendarStr +="<td><span>&nbsp;</span></td>"; 
    			col++;
    		}
    		
    		var startRange 	 = config.startRange.replace(/\D+/g,"");
    		var endRange 	 = config.endRange.replace(/\D+/g,"");
    		var dayClass     = '';
    		var getDay       = 0;
    		for (var i=1; i<=lastDay; i++){       // 해당 월의 달력
    			_eDate.setDate(i);
    			getDay = _eDate.getDay();
    			dayClass = "";
    			
    			if(getDay == 0){
    				dayClass  = ' sundayCol';
    			}else if(getDay == 6){
    				dayClass  = ' saturdayCol';
    			}
    			
    			var aClass = vDate == i ? ' class="select" ':'';
    			if ( dayClass != '' && config.weekend == false ) {
    				calendarStr += '<td class="disable"><span class="'+dayClass+'">' + i + '</span></td>';    					    					
    			} else {
    				var dateValInt = Number(vYear.toString()+vMonth.toString()+padZero(i));
    				if(startRange!="" && dateValInt<startRange){
    					calendarStr += '<td class="disable"><span class="'+dayClass+'">' + i + '</span></td>';
    				}else if(endRange!="" && dateValInt > endRange){
    					calendarStr += '<td class="disable"><span class="'+dayClass+'">' + i + '</span></td>';
    				}else if(dateValInt==_this.today){						 
    					calendarStr += '<td class="selectable"><a href="javascript:void(0)" class="today" ><span class="'+dayClass+'">' + i + '</span></a></td>';					    				
					}else{    												
						calendarStr += '<td class="selectable"><a href="javascript:void(0)" '+aClass+' ><span class="'+dayClass+'">' + i + '</span></a></td>';						
					}
    			}
    			
    			col++;
    			
    			//7칸을 만들면 줄 바꾸어 새 줄을 만들고 다시 첫 칸부터 시작
    			if(col==7 && i!=lastDay){
    				calendarStr +="</tr><tr>";
    				col=0;
    			}
    		}
    		
    		//마지막 날에서 남은 요일의 빈 칸 만들기
    		for (i=col;i<dayNameArray.length;i++){        
    			calendarStr +="<td><span class='spritef'>&nbsp;</span></td>";
    		}
    		
    		calendarStr += '</tr>';
    		calendarStr += '</tbody>';
    		calendarStr += '</table>';
    		
    		return calendarStr;
    	},
    	
    	makeMonthCalendar : function(vYear,vMonth){
    		var calendarStr = "";
    		calendarStr += '<table style="width:100% !important;">';
    		calendarStr += '<col width="24%" /><col width="26%" /><col width="24%" /><col width="26%" />';
    		calendarStr += '<tbody>';
    		
    		var mm = 1;
    		var startRange 		= config.startRange.replace(/\D+/g,"");
    		var endRange 		= config.endRange.replace(/\D+/g,"");
    		
    		for (var i=0; i<3; i++) {
    			calendarStr += '<tr>';
    			for (var j=0; j<4; j++) {
    				var aClass = vMonth == mm ? ' class="select" ':'';
    				
    				var dateValInt = Number(vYear.toString()+padZero(mm));
    				
    				if(startRange!="" && dateValInt<Number(startRange.substring(0,6))){
    					calendarStr += '<td class="disable"><a href="javascript:void(0);" >' + mm + calLang["month"]+'</a></td>';
    				}else if(endRange != "" && dateValInt > Number(endRange.substring(0,6))){
    					calendarStr += '<td class="disable"><a href="javascript:void(0);" >' + mm + calLang["month"]+'</a></td>';
    				}else{
    					calendarStr += '<td class="selectable"><a href="javascript:void(0);" '+aClass+' >' + mm + calLang["month"]+'</a></td>';
    				}
    				
    				mm++;
    			}
    			calendarStr += '</tr>';
    		}
    		
    		calendarStr += '</tbody>';
    		calendarStr += '</table>';
    		
    		return calendarStr;
    	},
    	
    	moveYearMonth : function(calendarTable,yearOffSet,monthOffSet,dayOffSet){
    		
    		var showDateStr	 =  _this.targetYear+config.delim+_this.targetMonth;  //showDate.text();
    		
    		var selectedValue = $("TABLE TD A.select",calendarTable).text();
    		selectedValue = selectedValue.replace(/\D+/g,"");
    		if(selectedValue==""){
    			selectedValue="01";
    		}
    		
    		var year  = _this.targetYear;
			var month = _this.targetMonth;
			
    		if(config.type=="day"){
    			
    			var day   = selectedValue;
    			
    			var dateObj = _this.getDateArray(year+''+padZero(month)+''+padZero(day),yearOffSet,monthOffSet,dayOffSet);
    			
    			year  = dateObj["year"]+"";
    			month = padZero((dateObj["month"])); 
    			day   = padZero((dateObj["day"]));
    			calendarTable.html(_this.makeDayCalendar(year,month,day));
    		}else if(config.type=="month"){
    			
    			month = selectedValue;
    			
    			var dateObj = _this.getDateArray(year+padZero(month),yearOffSet,monthOffSet,dayOffSet);
    			
    			year  = dateObj["year"]+"";
    			month = padZero((dateObj["month"]));
    			
    			calendarTable.html(_this.makeMonthCalendar(year,month));
    		}
    		
    		
    		_this.targetYear	= year;
			_this.targetMonth 	= month;
			_this.setCalendarTitle();
    		
    		return showDateStr;
    	},
    	
    	setCalendarTitle : function(){

            _this.calendarTitle.text(_this.targetYear+"."+_this.targetMonth);

            return;

    		if(config.type=="day"){
    			_this.calendarTitle.text(_this.targetYear+calLang["year"]+" "+getMonthName(_this.targetMonth));
    		}else{
    			_this.calendarTitle.text(_this.targetYear+calLang["year"]);
    		}
    	},

    	//날짜변경
    	setDate : function (date,dateType) {
    		if(dateType!="defaultDate"){
    			if(config.endCalendar){
        			var compareDate = $(config.endCalendar).val().replace(/[^0-9]/g,'');
        			
        			if(compareDate < date.replace(/[^0-9]/g,'')){
        				alert(calLang["endCalMsg"]);
        				_this.inputTag.val(_this.inputTag.data("validValue"));
        				if(dateType=="inputDate"){
        					_this.inputTag.focus();
        				}
        				return false;
        			}
        		}
        		
        		if(config.startCalendar){
        			var compareDate = $(config.startCalendar).val().replace(/[^0-9]/g,'');
        			
        			if(compareDate > date.replace(/[^0-9]/g,'')){
        				alert(calLang["startCalMsg"]);
        				_this.inputTag.val(_this.inputTag.data("validValue"));
        				if(dateType=="inputDate"){
        					_this.inputTag.focus();
        				}
        				return false;
        			}
        		}
    		}
    		
    		_this.inputTag.val(date);
    		_this.inputTag.data("validValue",date);
    		return true;
    	},

    	//달력 닫기
    	closeCalendar : function(isImgTagFocus){
            _this.divIndi.hide();
    		_this.divTag.hide();
            _this.inputTag.closest('.calendarWrapper').removeClass('opened');

            if(isImgTagFocus === undefined || isImgTagFocus === null){
            	isImgTagFocus = true;
            }
            if(isImgTagFocus){
            	_this.imgTag.focus();
            }
    	},
    	
    	checkValidDate : function (vDate,config) {
    		var regex = config.type=="day" ? /^(\d{4})(\d{2})(\d{2})$/ : /^(\d{4})(\d{2})$/;
    		
    		var matchArray = regex.exec(vDate);
    		if (matchArray == null) { 
    			return false;
    		}
    		var year = matchArray[1];
    		var month = matchArray[2];
    		var day = matchArray[3];
    		
    		if ( month < 1 || month > 12) {
    			return false;
    		}
    		
    		if ( day < 1 || day > 31) {
    			return false;
    		}
    		
    		if ((month==4 || month==6 || month==9 || month==11) && day==31) { 
    			return false;
    		}
    		
    		if (month == 2) { // check for february 29th 
    			var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)); 
    			if (day>29 || (day==29 && !isleap)) { 
    				return false;
    			}
    		}
    		return true;
    	},
    	
    	getDateObject : function(date,yearOffSet,monthOffSet,dayOffSet) {
    		var arr = getDateArray(date);
    		var dateObj = new Date((Number(arr["year"])+Number(yearOffSet)),((Number(arr["month"])-1)+Number(monthOffSet)),(Number(arr["day"])+Number(dayOffSet)));
    		return dateObj;
    	},
    	
    	getDateArray : function(date,yearOffSet,monthOffSet,dayOffSet){
    		date = date.replace(/\D+/g,"");
    		var year 	= "";
    		var month 	= "";
    		var day 	= "";
    		
    		var dateObj = new Date();
    		if(date.length==8){
    			year 	= date.substring(0,4);
    			month 	= date.substring(4,6);
    			day 	= date.substring(6,8);
    		}else if(date.length==6){
    			year 	= date.substring(0,4);
    			month 	= date.substring(4,6);
    			day 	= dateObj.getDate();
    		}else if(date.length==0){
    			year 	= dateObj.getFullYear();
    			month 	= dateObj.getMonth()+1;
    			day		= dateObj.getDate();
    		}
    		
    		if(!yearOffSet){yearOffSet=0;}
    		if(!monthOffSet){monthOffSet=0;}
    		if(!dayOffSet){dayOffSet=0;}
    		
    		var newDate = new Date(year,Number(month)-1,day);
    		newDate.setFullYear(newDate.getFullYear()+Number(yearOffSet));
    		newDate.setMonth(newDate.getMonth()+Number(monthOffSet));
    		newDate.setDate(newDate.getDate()+Number(dayOffSet));

    		var dateArray 		= new Object();
    		dateArray["year"] 	= newDate.getFullYear();
    		dateArray["month"] 	= padZero(newDate.getMonth()+1);
    		dateArray["day"]	= padZero(newDate.getDate());
    		
    		return dateArray;
    	}
    };
    
    function getLastDayOfMonth(year,month){
    	var prevDate = new Date(year,month-1,1);// 변경된 날짜 객체 선언
		var lastDay = endDayArray[month-1];  	    // 변경된 월의 마지막 날짜
		if ((prevDate.getMonth()==1)&&(((prevDate.getYear()%4==0)&&(prevDate.getYear() %100 !=0))||prevDate.getYear() % 400 ==0 )){
			lastDay=29;
		} // 0월 부터 시작하므로 1는 2월임. 윤달 계산 4년마다 29일 , 100년는 28일, 400년 째는 29일
		
		return lastDay;
    }
    
    //===========UTIL==========
	function getMonthName(num){
		return calLang["monthNameArray"][Number(num)-1];
	}
	
	function padZero(num) {
		return (num.toString().length==1)? '0' + num : num;
	}
    
    var object = _this.initialize(); 
    $(selector).data("object",object);
    return object;
};
    