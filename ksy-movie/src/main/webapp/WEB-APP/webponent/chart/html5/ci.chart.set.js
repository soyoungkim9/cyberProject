CreateChartSet = function(_parent, _options, _styles, _series){
	var _this = this;
	
	/*
	 * 차트 변수
	 */
	this.chart = null;
	var $parent = $(_parent);
	/*
	 *  차트 생성
	 */
	this.id = "";
	var chart_width = $parent.width(), chart_height = $parent.height();
	this.reDraw = function(option, series){
		this.chart.reDraw(option, series);
	};
	
	this.reDrawAdd = function(option) {
		this.chart.reDrawAdd(option);
	};
	
	this.changeSize = function (){
		this.chart.changeSize($parent.width(), $parent.height());
	};
	
	var init = function () {
		_this.id = $parent[0].id || "webponent-chart-"+$parent[0].className;
		
		var $tooltip = null;
		if($parent.children().length > 0) $tooltip = $($parent.children()[0]).clone(true);
		
		if(_options.usestock){
			stockMenuAdd($tooltip);
		} else {
			_this.chart = new CreateChart($parent, _this.id, chart_width, chart_height, _options, _styles, _series, $tooltip);
		}
	};
	
	var stockMenuAdd = function (_$tooltip) {
		$.ajax({
			url: (_options.stockmenuurl)? _options.stockmenuurl : '/WEB-APP/_webponent/chart/html5/ci.chart.personal.html',
			cache: false,
			success: function(data){
				$parent.append(data);
				
				var area = $(".stockchart-personal", $parent);
				var accordion = $.accordion(".stockchart", {
					parent : area, //#pc
					width  : 98,
					height : area.outerHeight(true) - 1,
					speed  : 200,
					mode   : "wide"
				});
				$("div.title", area).eq(0).trigger('click');
				
				try{
					$('input, button, :checkbox, :radio, select', $parent).uniform();
				}catch(e){}
				$('.stockchartover-option-layer, .stockchartsub-option-layer', $parent).hide();
				
				var width = _options.stockMenuWidth || 150;//(_options.stockMenuWidth == undefined) ? 150 : _options.stockMenuWidth;
				if(_options.usemobiledevice == "mobile") width = 0;
				
				stockMenuEvent($('.stockchart-personal', $parent), width);
				
				chart_width = chart_width - width;
				
				_this.chart = new CreateChart($parent, _this.id, chart_width, chart_height, _options, _styles, _series, _$tooltip);
				
				$('div[class~=accordionArea]', $parent).addClass(_this.id+'-personal');
				$('div[class~=accordionArea]', $parent).nextAll('canvas, div').css('left', width);
			}
		});
	};
	
	var stockMenuEvent = function ($personal, width) {
		$personal.css('width', width);
		var $personal_type = $(".stockchart-type", $personal);
		// 차트 형식
		$personal_type.find("input[type='radio']")
			.attr('name', _this.id+"-type")
			.bind("click", function(){
				_this.chart.reDrawMainSeries($(this).attr('value'), _series);
			});
		
		$(".stockchart-overlay", $personal).find("input[type='checkbox']").attr('name', _this.id+"-overlay");// 오버레이
		$(".stockchart-subindex", $personal).find("input[type='checkbox']").attr('name', _this.id+"-subindex");// 보조지표
		
		$(".stockchart-overlay, .stockchart-subindex", $personal).delegate("button", "click", function(){
			if($(this).attr('class') === 'close') return;
			var value = $(this).attr('value');
			if(value === "minus" || value === "plus"){
				if(($(this).closest('div').attr('class')).indexOf("over") > -1){
					changeOptionsParam($(this), 'over');
				} else {
					changeOptionsParam($(this), 'sub');
				}
			} else if($(this).attr('class') === "default-setting"){
				if(($(this).closest('div').attr('class')).indexOf("over") > -1){
					changeOptionsParam($(this), 'over');
				} else {
					changeOptionsParam($(this), 'sub');
				}
			} else { 
				// 옵션버튼 클릭시
			}
		}).delegate("input[type='checkbox']", "click", function (){
			if(($(this).attr('name')).indexOf('over') > -1)	{ // 오버레이 체크박스 클릭
				_this.chart.reDrawOverSeries($(this), $(this).is(':checked'));
				
				if(!$(this).is(':checked')) {
					return;
				}
				var $layer = $('.stockchartover-option-container', $personal); // 새로 써질 레이어
				if($layer.children().length > 0){
					var name = $layer.children().eq(0).attr('class');
					$('.stockchartover-option').find("div."+name).html($layer.find("div."+name).children().clone());
					$layer.children().remove();
				}
				
				var idx = $(".stockchartover-list-layer li").index($(this).parents(".stockchartover-list-layer ul li"));
				var $select = $('.stockchartover-option-select', $personal);
				$select.children().attr('selected', false);
				$select.prepend("<option value="+idx+" selected='selected'>"+$(this).attr('title')+"</option>");
				try{
					$.uniform.update($select, $personal);
				}catch(e){}
				
				var $option = $('.stockchartover-option li', $personal).eq(idx).children();
				$layer.html($option.clone());
			} else { // 보조지표 체크박스 클릭
				_this.chart.reDrawSubSeries($(this), $(this).is(':checked'));
				
				if(!$(this).is(':checked')) {
					return;
				}
				var $layer = $('.stockchartsub-option-container', $personal); // 새로 써질 레이어
				if($layer.children().length > 0){
					var name = $layer.children().eq(0).attr('class');
					$('.stockchartsub-option').find("div."+name).html($layer.find("div."+name).children().clone());
					$layer.children().remove();
				}
				
				var idx = $(".stockchartsub-list-layer li").index($(this).parents(".stockchartsub-list-layer ul li"));
				var $select = $('.stockchartsub-option-select', $personal);
				$select.children().attr('selected', false);
				$select.prepend("<option value="+$(this).val()+" selected='selected'>"+$(this).attr('title')+"</option>");
				try{
					$.uniform.update($select, $personal);
				}catch(e){}
				
				var $option = $('.stockchartsub-option li', $personal).eq(idx).children();
				$layer.html($option.clone());
			}
		});
		
		$('.stockchartover-option-select', $personal).change(function(){
			var idx = $(this).val();
			var $layer = $('.stockchartover-option-container', $personal);
			var name = $layer.children().eq(0).attr('class');
			$('.stockchartover-option').find("div."+name).html($layer.find("div."+name).children().clone());
			
			$layer.children().remove();
			
			var $option = $('.stockchartover-option li', $personal).eq(idx).children();
			$layer.html($option.clone());
		});
		$('.stockchartsub-option-select', $personal).change(function(){
			var idx = $(this).val();
			var $layer = $('.stockchartsub-option-container', $personal);
			var name = $layer.children().eq(0).attr('class');
			$('.stockchartsub-option').find("div."+name).html($layer.find("div."+name).children().clone());
			
			$layer.children().remove();
			
			var $option = $('.stockchartsub-option li', $personal).find('div.'+idx);//.children();
			$layer.html($option.clone());
		});
		
		$('.over-tab01, .over-tab02', $personal).click(function(){
			var t = $(this);
			var closest = t.closest($('div[class*="over"]')).html();
			if(t.attr('class').indexOf("tab01") > 0){ // 선택탭
				$(this).addClass('sel');
				$(this).next().removeClass('sel');
				if(closest != undefined && closest != null){
					$(".stockchartover-list-layer", $personal).show();
					$(".stockchartover-option-layer", $personal).hide();
				}else{
					$(".stockchartsub-list-layer", $personal).show();
					$(".stockchartsub-option-layer", $personal).hide();
				}
			} else { // 설정 탭
				$(this).prev().removeClass('sel');
				$(this).addClass('sel');
				if(closest != undefined && closest != null){
					$(".stockchartover-list-layer", $personal).hide();
					$(".stockchartover-option-layer", $personal).show();
				}else{
					$(".stockchartsub-list-layer", $personal).hide();
					$(".stockchartsub-option-layer", $personal).show();
				}
			}
		});
		$('.over-tab01', $personal).addClass('sel');//.attr('class', 'over-tab01-sel');//.css('background-image', 'url("/WEB-APP/_webponent/chart/img/${theme}/tab01_on.gif")');
	};
	
	var changeOptionsParam = function ($this, _type) {
		if($this.attr('value') == "minus"){
			var next = $this.next();
			var value = next.attr('name').split('_')[0], num = 0;
			if(value != "over4") {
				num = Number(next.attr('value')) - 1;
			} else {
				num = Number(next.attr('value')) - 0.001;
				num = Number(num.toFixed(3));
			}
			if(next.attr('min') > num) {
				num = next.attr('min');
				return;
			}
			next.attr('value', num);
			if(_type == "over")	_this.chart.reDrawOverSeriesOption(next);
			else _this.chart.reDrawSubSeriesOption(next);
		} else if($this.attr('value') == "plus") {
			var prev = $this.prev();
			var value = prev.attr('name').split('_')[0];
			var num = 0;
			if(value != "over4") {
				num = Number(prev.attr('value')) + 1;
			} else {
				num = Number(prev.attr('value')) + 0.001;
				num = Number(num.toFixed(3));
			}
			if(prev.attr('max') < num) {
				num = prev.attr('max');
				return;
			}
			prev.attr('value', num);
			if(_type == "over")	_this.chart.reDrawOverSeriesOption(prev);
			else _this.chart.reDrawSubSeriesOption(prev);
		} else {
			var value = $this.attr('name').split('_')[0];
			var initParam = null;
			switch(value){
				case "over1": initParam = [5, 20, 60]; break;
				case "over2": initParam = [9, 26, 52]; break;
				case "over3": initParam = [20]; break;
				case "over4": initParam = [0.02]; break;
				case "over5": initParam = [20, 5]; break;
				case "over6": initParam = [5, 2, 10]; break;
				case "over7": initParam = [10]; break;
				case "macd": initParam = [12, 26, 9]; break;
				case "slowstc": initParam = [15, 5, 3]; break;
				case "faststc": initParam = [15, 5]; break;
				case "rsi": initParam = [10, 5]; break;
				case "dmi": initParam = [14]; break;
				case "adx": initParam = [14, 14, 9]; break;
				case "sonar": initParam = [12, 26, 9]; break;
				case "cci": initParam = [9]; break;
				case "vr": initParam = [20]; break;
				case "trix": initParam = [5, 3]; break;
				case "pmao": initParam = [5, 20]; break;
				case "psyhological": initParam = [10]; break;
				case "williams": initParam = [14, 3]; break;
				case "roc": initParam = [12]; break;
			}
			var input = $this.closest('div').find('input[type="text"]');
			$.each(input, function(index){
				$(this).attr('value', initParam[index]);
				if(_type == "over"){
					if(value != "over7") _this.chart.overLayFunction[$(this).attr('name')] = initParam[index];
					else _this.chart.over7_param1 = initParam[index];
				} else
					_this.chart.subIndexFunction[$(this).attr('name')] = initParam[index];
			});
			if(_type == "over")	_this.chart.reDrawOverSeriesDefault(value);
			else _this.chart.reDrawSubSeriesDefault(value);
		}
	};
	
	init();
	return _this;
};