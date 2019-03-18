(function($) {
	ThreeLineChart = function (_etcctx, _options, _styles, _param) {
		var _this = this;
		
		var maxClose = -999999999999999, minClose = 999999999999999;
		var arr = [], dataArr = [];
		var dOpen = dHigh = dLow = 0, tClose = 0, position = 0;
		var ctx = _etcctx[0].getContext('2d');
		var options = $.extend(true, {}, _options), styles = $.extend(true, {}, _styles);
		var MAINCHART = $.extend(true, {}, _param);
		var KEY = MAINCHART.key;
		
		var CHART_WIDTH = ctx.canvas.width, CHART_HEIGHT = ctx.canvas.height;
		var GRAPH_WIDTH = 0, GRAPH_HEIGHT = 0;
		
		var drawAxis = null;
		this.init = function(_data, _graph_width){
			arr = _data.concat([]);
			var close;
			for(var i = arr.length; i--;){
				close = arr[i].close;
				if(maxClose < close) maxClose = close;
				if(minClose > close) minClose = close;
			}
			var len = arr.length;
			for(i = 0; i < len; i++){
				CalcThreeLine(i);
			}
			var half = (_graph_width / 2) - len;
			for(i = 0; i < half; i++){
				dataArr.push({"date": null});
			}
			MAINCHART.series = {
					"three": { "series": "candle", "xaxis": "date", "open": "open","high": "high","low": "low","close": "close" }
			};
			(styles[KEY]).xlabelgap = 0;
			(styles[KEY]).xlabelpaddingtop = 0;
			
			styles[MAINCHART.key].three = {};
			styles[MAINCHART.key].usexlabel = false;
			
			clearRect();
			
			GRAPH_WIDTH = _graph_width;
			GRAPH_HEIGHT = CHART_HEIGHT - getStyles(KEY, "canvaspaddingtop") - getStyles(KEY, "canvaspaddingbottom") - 10;
			
			/* X, Y Axis Value */
			var xAxis = [], yAxis = [];
			yAxis = setYAxis(dataArr);
			xAxis = setXAxis(dataArr, "date");
			
			//_this.drawAxis = new DrawAxis(backctx, options, styles, _param, CHART_WIDTH, CHART_HEIGHT, _this.GRAPH_WIDTH, _this.GRAPH_HEIGHT, seriesType);
			drawAxis = new DrawAxis(ctx, options, styles, {"data":dataArr, "option": MAINCHART}, CHART_WIDTH, CHART_HEIGHT, GRAPH_WIDTH, GRAPH_HEIGHT, undefined);
			drawAxis.drawYAxis(yAxis);
			drawAxis.drawXAxis(xAxis, "date");
			var drawSeries = new DrawCandle(ctx, ctx, options, styles, {"data":dataArr, "option": MAINCHART}, (options.usemultiyaxis) ? yAxis[seriesForm] : yAxis,
					{"CHART_WIDTH": CHART_WIDTH, "CHART_HEIGHT": CHART_HEIGHT, "CHART_TOP": 0,
				 	 "GRAPH_WIDTH": GRAPH_WIDTH, "GRAPH_HEIGHT": GRAPH_HEIGHT});
			drawSeries.drawSeries("three");
			drawSeries = null;
		};
		CalcThreeLine = function(index){
			var thisIndexArr = arr[index]; 
			dOpen = thisIndexArr.open, tClose = thisIndexArr.close;
			if(position == 0){ // 방향이 없을 때
				if(dOpen < tClose) { // 상승
					dataArr.push({ "date": thisIndexArr.xaxis, "open":dOpen, "high":tClose, "low":dOpen, "close":tClose});
					position = 1;
				} else {
					dataArr.push({"date":thisIndexArr.xaxis, "open":dOpen, "high":dOpen, "low":tClose, "close":tClose});
					position = 2;
				}
			} else { // 방향이 있을 때
				if(position == 1) {	// 상승 추세일때 
					var dPrevHigh = dataArr[dataArr.length - 1].close; // 고점
					if(tClose > dPrevHigh) { // 고점을 돌파한 경우 
						dataArr.push({"date":thisIndexArr.xaxis, "open":dPrevHigh, "high":tClose, "low":dPrevHigh, "close":tClose});
					} else {
						var dLowest = maxClose;
						if(dataArr.length >2) {
							for(var i = dataArr.length - 1; i >= dataArr.length - 3 ; i--){// 이전 3개 내의 최저점 구하기 
								dLow = dataArr[i].low;
								if(dLowest > dLow)	dLowest = dLow;
							}
							if (dLowest > tClose) {// 최저점 돌파한 경우 
								position = 2;
								dataArr.push({"date":thisIndexArr.xaxis,
								"open":dataArr[dataArr.length - 1].open, "high":dataArr[dataArr.length - 1].open, 
								"low":tClose, "close":tClose});
							}
						}
					}
				}
				else { // 하락 추세일때 
					var dPrevLow = dataArr[dataArr.length - 1].low; // 저점
					if(tClose < dPrevLow){	// 저점을 돌파한 경우
						dataArr.push({"date":thisIndexArr.xaxis,
						"open":dPrevLow, "high":dPrevLow, "low":tClose, "close":tClose});
					} else {
						var dHighest = minClose;
						if(dataArr.length >2) {
							for(var j = dataArr.length - 1; j>=dataArr.length-3; j--){// 이전 3개 내의 최저점 구하기 
								dHigh = dataArr[j].high;
								if(dHighest < dHigh) dHighest = dHigh;
							}
														
							if (dHighest < tClose){ // 최고점 돌파한 경우 
								position = 1;
								dataArr.push({"date":thisIndexArr.xaxis,
								"open":dataArr[dataArr.length - 1].open, "high":tClose, 
								"low":dataArr[dataArr.length - 1].open, "close":tClose});		
							}
						}
					}
				}
			}
		};
		/*
		 * Y-Axis 값 구하기
		 */
		var computedMaximum = 0, computedMinimum = 0, computedInterval = 0;
		var setYAxis = function ( _data ) 
		{
			adjustMinMax(maxClose, minClose);

			var mmHValue = 0, yAxis = [];
			var labelBase = computedMinimum - mmHValue, labelTop = computedMaximum + mmHValue;
			
			var decimal = Math.abs(computedInterval) - Math.floor(Math.abs(computedInterval));
			var precision = decimal == 0 ? 1 : -Math.floor(Math.log(decimal) / Math.LN10);
			decimal = Math.abs(computedMinimum) - Math.floor(Math.abs(computedMinimum));
			precision = Math.max(precision, decimal == 0 ? 1: -Math.floor(Math.log(decimal) / Math.LN10));
			
			var roundBase = Math.pow(10, precision);
			var i, roundedValue;
			for(i = labelBase; i <= labelTop; i += computedInterval) {
				roundedValue = Math.round(i * roundBase) / roundBase;
				yAxis.push(roundedValue);
			}
			if(yAxis[yAxis.length - 1] <= labelTop){
				while(yAxis[yAxis.length - 1] <= labelTop){
					yAxis.push(yAxis[yAxis.length - 1] + computedInterval);
				}
			}
			return yAxis;
		};
		var adjustMinMax = function(_maxValue, _minValue){
			if(_maxValue == 0 && _minValue == 0){ _maxValue = 100; }
			
			var powerOfTen = Math.floor(Math.log(Math.abs(_maxValue - _minValue)) / Math.LN10);
			var y_userInterval = Math.pow(10, powerOfTen);
			var interval = Math.abs(_maxValue - _minValue) / y_userInterval;
			if(interval < 4) {
				powerOfTen--;
				y_userInterval = y_userInterval * 2 / 5;
			}
			
			var y_topBound = Math.round(_maxValue / y_userInterval) * y_userInterval ? _maxValue : (Math.floor(_maxValue / y_userInterval) + 1) * y_userInterval;
			
			var y_lowerBound;
			if(_minValue < 0 || styles[KEY].baseatzero == false){
				y_lowerBound = Math.floor(_minValue / y_userInterval) * y_userInterval;
				if(_maxValue < 0 && styles[KEY].baseatzero) y_topBound = 0;
			} else { y_lowerBound = 0; }
			
			computedInterval = y_userInterval;
			computedMinimum = y_lowerBound, computedMaximum = y_topBound;
		};
		/*
		 * X-Axis 값 구하기
		 */
		var setXAxis = function ( _data, _xaxisValue ) 
		{	
			ctx.font = getStyles(KEY, "ylabelfontstyle");
			
			var count = _data.length, i = 0, xLabelSkip = 0;
			var xGap = (_this.GRAPH_WIDTH - getStyles(KEY, "graphpaddingleft") - getStyles(KEY, "graphpaddingright")) / count;
			var itemW = xGap * count;
			var datavalue = (_data[0])[_xaxisValue];
			var dataValueWidth = ctx.measureText(datavalue).width + 20;
			for(i = 0; i < itemW; i += xGap) {
				if(i < dataValueWidth){
					xLabelSkip += 1;
				} else {
					break;
				}
			}
			
			return xLabelSkip;
		};
		
		// Styles getter
		var getStyles = function (_KEY, _name) {
			_name = _name.toLowerCase();
			var s = styles;
			if(_KEY !== "A") { s = s[_KEY]; } 
			return s[_name];
		};
		
		var clearRect = function() {
			ctx.beginPath();
			ctx.fillStyle = "#FFFFFF";
			ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		};
	};
	PnFChart = function (_etcctx, _options, _styles, _param) {
		var _this = this;
		
		var maxClose = -999999999999999, minClose = 999999999999999;
		var max = -999999999999999, min = 999999999999999;
		var arr = [], dataArr = [];
		var dOne = dOpen = dHigh = dLow = 0;
		var tClose = 0, position = 0;
		var ctx = _etcctx[0].getContext('2d');
		var options = $.extend(true, {}, _options), styles = $.extend(true, {}, _styles);
		var MAINCHART = $.extend(true, {}, _param);
		var KEY = MAINCHART.key;
		
		var CHART_WIDTH = ctx.canvas.width, CHART_HEIGHT = ctx.canvas.height;
		var GRAPH_WIDTH = 0, GRAPH_HEIGHT = 0;
		
		var drawAxis = null;
		this.init = function(_data, _graph_width){
			arr = _data.concat([]);
			var close;
			for(var i = arr.length; i--;){
				close = arr[i].close;
				if(maxClose < close) maxClose = close;
				if(minClose > close) minClose = close;
			}
			var len = arr.length;
			for(i = 0; i < len; i++){
				CalcPnF(i);
			}
			var half = _graph_width / 8;
			for(i = 0; i < half - dataArr.length; i++){
				dataArr.push({"date": null});
			}
			
			for(i = dataArr.length; i--;){
				if(dataArr[i].max > max) max = dataArr[i].max;
				if(dataArr[i].min < min) min = dataArr[i].min;
			}
			
			MAINCHART.series = {
					"pnf": { "series": "column", "xaxis": "date", "yaxis": "max", "minaxis": "min" }
			};
			options.xaxisformat = "";
			(styles[KEY]).xlabelgap = 0;
			(styles[KEY]).xlabelpaddingtop = 0;
			(styles[KEY]).usexlabel = false;
			
			styles.main.pnf = { "itemrenderer": "ox" };
			
			clearRect();
			
			GRAPH_WIDTH = _graph_width;
			GRAPH_HEIGHT = CHART_HEIGHT - getStyles(KEY, "canvaspaddingtop") - getStyles(KEY, "canvaspaddingbottom") - 10;
			
			/* X, Y Axis Value */
			var xAxis = [], yAxis = [];
			yAxis = setYAxis(dataArr);
			xAxis = setXAxis(dataArr, "date");
			
			drawAxis = new DrawAxis(ctx, options, styles, {"data":dataArr, "option": MAINCHART}, CHART_WIDTH, CHART_HEIGHT, GRAPH_WIDTH, GRAPH_HEIGHT, undefined);
			drawAxis.drawYAxis(yAxis);
			drawAxis.drawXAxis(xAxis, "date");
			
			var drawSeries = new DrawColumn(ctx, options, styles, {"data":dataArr, "option": MAINCHART}, yAxis,
					{"CHART_WIDTH": CHART_WIDTH, "CHART_HEIGHT": CHART_HEIGHT, "CHART_TOP": 0,
				 	 "GRAPH_WIDTH": GRAPH_WIDTH, "GRAPH_HEIGHT": GRAPH_HEIGHT}, 1, 0);
			drawSeries.drawSeries("pnf");
		};
		
		var CalcPnF = function(index) {
			var tArr = arr[index], ldataArr = dataArr[dataArr.length - 1];
			dOpen = arr[0].open, tClose = tArr.close;
			if(index == 0){
				dOne = (maxClose - minClose) / 50;
				if(maxClose >= 100000) dOne = (dOne / 100 + 0.7) * 100;
				else if(maxClose >= 10000) dOne = (dOne / 10 + 0.7) * 10;
				else if(maxClose >= 1000) dOne = dOne + 0.7;
			}
			if(position == 0){
				var dGap = tClose - dOpen;
				if(Math.abs(dGap) > dOne){
					if(dGap > 0) {
						dataArr.push({"date":tArr.xaxis,"dMin":dOpen, "dMax":tClose,
							"max":((tClose-dOpen)/dOne), "min":0,
							"nPosition":1, "nNum":((tClose-dOpen)/dOne)+1});
							position = 1;
					} else {
						dataArr.push({"date":tArr.xaxis,"dMin":tClose, "dMax":dOpen,
							"max":0, "min":-((dOpen-tClose)/dOne),
							"nPosition":2, "nNum":((dOpen-tClose)/dOne)+1});
							position = 2;
					}
				}
			} else {
				var dHigh = ldataArr.dMax, dLow = ldataArr.dMin;
				if(position == 1) // 상승일때
				{
					if (tClose > dHigh){ // 계속 상승인 경우
						ldataArr.dMax = tClose;
						ldataArr.nNum = ((dHigh - dLow)/dOne)+1;
						ldataArr.max = ldataArr.min + ldataArr.nNum;
					} else if (tClose < dHigh - dOne * 3){	// 하락 추세 전환인 경우
						dataArr.push({"date":tArr.xaxis,"dMin":tClose, 
						"dMax":dLow + (dOne * (ldataArr.nNum- 1)),
						"nPosition":2,
						"max":ldataArr.max-1, 
						"min":ldataArr.max -1- ((((dLow + (dOne * (ldataArr.nNum- 1)))-tClose)/dOne)+1),
						"nNum":(((dLow + (dOne * (ldataArr.nNum- 1)))-tClose)/dOne)+1});
						position = 2;
					}
				} else {// 하락일때
					if (tClose < dLow) {// 계속 하락인 경우 
						ldataArr.dMin = tClose;
						ldataArr.nNum = ((dHigh - dLow)/dOne)+1;
						ldataArr.min = ldataArr.max - ldataArr.nNum;
					} else if (tClose > dLow + dOne * 3){	// 상승 추세 전환인 경우 
						dataArr.push({"date":tArr.xaxis,
						"dMin":dHigh - (dOne * (ldataArr.nNum- 1)), 
						"dMax":tClose,
						"nPosition":1, 
						"max":ldataArr.min+1+(((tClose-(dHigh - (dOne * (ldataArr.nNum- 1))))/dOne)+1),
						"min":ldataArr.min+1,
						"nNum":((tClose-(dHigh - (dOne * (ldataArr.nNum- 1))))/dOne)+1});
						position = 1;
					}
				}
			}
		};
		/* Y-Axis 값 구하기 */
		var computedMaximum = 0, computedMinimum = 0, computedInterval = 0;
		var setYAxis = function ( _data ) 
		{
			adjustMinMax(max, min);

			var mmHValue = 0, yAxis = [];
			var labelBase = computedMinimum - mmHValue, labelTop = computedMaximum + mmHValue;
			
			var decimal = Math.abs(computedInterval) - Math.floor(Math.abs(computedInterval));
			var precision = decimal == 0 ? 1 : -Math.floor(Math.log(decimal) / Math.LN10);
			decimal = Math.abs(computedMinimum) - Math.floor(Math.abs(computedMinimum));
			precision = Math.max(precision, decimal == 0 ? 1: -Math.floor(Math.log(decimal) / Math.LN10));
			
			var roundBase = Math.pow(10, precision);
			var i, roundedValue;
			for(i = labelBase; i <= labelTop; i += computedInterval) {
				roundedValue = Math.round(i * roundBase) / roundBase;
				yAxis.push(roundedValue);
			}
			if(yAxis[yAxis.length - 1] <= labelTop){
				while(yAxis[yAxis.length - 1] <= labelTop){
					yAxis.push(yAxis[yAxis.length - 1] + computedInterval);
				}
			}
			return yAxis;
		};
		var adjustMinMax = function(_maxValue, _minValue){
			if(_maxValue == 0 && _minValue == 0){ _maxValue = 100; }
			
			var powerOfTen = Math.floor(Math.log(Math.abs(_maxValue - _minValue)) / Math.LN10);
			var y_userInterval = Math.pow(10, powerOfTen);
			var interval = Math.abs(_maxValue - _minValue) / y_userInterval;
			if(interval < 4) {
				powerOfTen--;
				y_userInterval = y_userInterval * 2 / 5;
			}
			
			var y_topBound = Math.round(_maxValue / y_userInterval) * y_userInterval ? _maxValue : (Math.floor(_maxValue / y_userInterval) + 1) * y_userInterval;
			var y_lowerBound;
			if(_minValue < 0 || styles[KEY].baseatzero == false){
				y_lowerBound = Math.floor(_minValue / y_userInterval) * y_userInterval;
				if(_maxValue < 0 && styles[KEY].baseatzero) y_topBound = 0;
			} else { y_lowerBound = 0; }
			
			computedInterval = y_userInterval;
			computedMinimum = y_lowerBound;
			computedMaximum = y_topBound;
		};
		/*
		 * X-Axis 값 구하기
		 */
		var setXAxis = function ( _data, _xaxisValue ) 
		{	
			ctx.font = getStyles(KEY, "ylabelfontstyle");
			
			var count = _data.length, i = 0, xLabelSkip = 0;
			var xGap = (_this.GRAPH_WIDTH - getStyles(KEY, "graphpaddingleft") - getStyles(KEY, "graphpaddingright")) / count;
			var itemW = xGap * count;
			var datavalue = (_data[0])[_xaxisValue];
			var dataValueWidth = ctx.measureText(datavalue).width + 20;
			for(i = 0; i < itemW; i += xGap) {
				if(i < dataValueWidth){ xLabelSkip += 1; }
				else { break; }
			}
			
			return xLabelSkip;
		};
		
		// Styles getter
		var getStyles = function (_KEY, _name) {
			_name = _name.toLowerCase();
			var s = styles;
			if(_KEY !== "A") { s = s[_KEY]; } 
			return s[_name];
		};
		
		var clearRect = function() {
			ctx.beginPath();
			ctx.fillStyle = "#FFFFFF";
			ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		};
	};
	
	
	Legend = function (_doc, _id, _container, _styles, _param, _CHART_WIDTH, _CHART_HEIGHT, _subIndex, _useMobileDevice) {
		var _this = this;
		
		var doc = _doc;
		this.container = _container;
		var styles = _styles;
		var MAINCHART = _param;
		var ID = _id, KEY = MAINCHART.key;
		var CHART_WIDTH = _CHART_WIDTH, CHART_HEIGHT = _CHART_HEIGHT, cpl = 0;
		
		var subIndex = _subIndex;
		this.GRAPH_WIDTH = 0, this.GRAPH_HEIGHT = 0;
		
		
		var legend_MainBox = null;
		this.legend_MainBoxLeft = null;
		this.legend_MainBoxRight = null;
		var init = function(){
			cpl = getStyles(KEY, "canvaspaddingleft");
			var cpt = getStyles(KEY, "canvaspaddingtop");
			_this.GRAPH_WIDTH = CHART_WIDTH - cpl - getStyles(KEY, "canvaspaddingright") - getStyles(KEY, "ylabelgap") - getStyles(KEY, "ylabelpaddingright") - getStyles(KEY, "ylabelpaddingleft");
			_this.GRAPH_HEIGHT = CHART_HEIGHT - cpt	- getStyles(KEY, "canvaspaddingbottom")	- getStyles(KEY, "xlabelpaddingtop") - getStyles(KEY, "mouseinfoheight");
			_this.container.css({
				"position": "absolute", "top": "3px", "left": "0px", 
				"width": _this.GRAPH_WIDTH +"px", "height": _this.GRAPH_HEIGHT +"px", "overflow": "hidden", "vertical-align": "top"
			});
			legend_MainBox = boxStyleSetting('main', $(doc.createElement("DIV")), cpt, cpl);
			_this.legend_MainBoxLeft = boxStyleLRSetting('main', $(doc.createElement("DIV")), "left", 0, 0);
			_this.legend_MainBoxRight = boxStyleLRSetting('main', $(doc.createElement("DIV")), "right", _this.GRAPH_WIDTH, 0);
			
			legend_MainBox.append(_this.legend_MainBoxLeft).append(_this.legend_MainBoxRight);
			_this.container.append(legend_MainBox);
		};
		/* 오버레이 - 이동평균 */
		var over1_item1 = over1_item2 = over1_item3 = null;
		this.over1_legend = function(_style, _param1, _param2, _param3){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting("over1", $("<span>이동평균선</span>"));
			over1_item1 = spanItemStyleSetting("over1", $(doc.createElement("SPAN")), _style.over1_series1.strokecolor, -5, -20);
			over1_item1.text(_param1);
			over1_item2 = spanItemStyleSetting("over1", $(doc.createElement("SPAN")), _style.over1_series2.strokecolor, -5, -40);
			over1_item2.text(_param2);
			over1_item3 = spanItemStyleSetting("over1", $(doc.createElement("SPAN")), _style.over1_series3.strokecolor, -5, -60);
			over1_item3.text(_param3);
			
			flag.appendChild(title[0]);
			flag.appendChild(over1_item1[0]);
			flag.appendChild(over1_item2[0]);
			flag.appendChild(over1_item3[0]);
			overLegendDoubleCheck();
			_this.legend_MainBoxLeft.append(flag);
		};
		
		this.over1_legendOption = function(_param1, _param2, _param3){
			over1_item1.text(_param1), over1_item2.text(_param2), over1_item3.text(_param3);
		};
		/* 오버레이 - 일목균형 */
		var over2_item1 = over2_item2 = over2_item3 = null;
		this.over2_legend = function(_style, _param1, _param2, _param3){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting("over2", $("<span>일목균형표</span>"));
			var text1 = spanItemStyleSetting("over2", $(doc.createElement("SPAN")), _style.over2_series1.strokecolor, -5, -120);
			text1.text("전환");
			var text2 = spanItemStyleSetting("over2", $(doc.createElement("SPAN")), _style.over2_series2.strokecolor, -5, -140);
			text2.text("기준");
			var text3 = spanItemStyleSetting("over2", $(doc.createElement("SPAN")), _style.over2_series3.strokecolor, -5, -160);
			text3.text("선행1");
			var text4 = spanItemStyleSetting("over2", $(doc.createElement("SPAN")), _style.over2_series4.strokecolor, -5, -180);
			text4.text("선행2");
			var text5 = spanItemStyleSetting("over2", $(doc.createElement("SPAN")), _style.over2_series5.strokecolor, -5, -200);
			text5.text("후행");
			
			over2_item1 = spanTextStyleSetting("over2", $(doc.createElement("SPAN")), _style.over2_series5.strokecolor);
			over2_item1.text("(" + _param1 + ",");
			over2_item2 = spanTextStyleSetting("over2", $(doc.createElement("SPAN")), _style.over2_series5.strokecolor);
			over2_item2.text(_param2 + ",");
			over2_item3 = spanTextStyleSetting("over2", $(doc.createElement("SPAN")), _style.over2_series5.strokecolor);
			over2_item3.text(_param3 + ")");
			
			flag.appendChild(title[0]);
			flag.appendChild(text1[0]);
			flag.appendChild(text2[0]);
			flag.appendChild(text3[0]);
			flag.appendChild(text4[0]);
			flag.appendChild(text5[0]);
			flag.appendChild(over2_item1[0]);
			flag.appendChild(over2_item2[0]);
			flag.appendChild(over2_item3[0]);
			overLegendDoubleCheck();
			_this.legend_MainBoxLeft.append(flag);
		};
		this.over2_legendOption = function(_param1, _param2, _param3){
			over2_item1.text("(" + _param1 + ","), over2_item2.text(_param2 + ","), over2_item3.text(_param3 + ")");
		};
		/* 오버레이 - Bollinger Band */
		var over3_item1 = null;
		var over3_info1 = null, over3_info2 = null, over3_info3 = null;
		this.over3_legend = function(_style, _param1, _data){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting("over3", $("<span>Bollinger Band</span>"));
			var text1 = spanSquareStyleSetting("over3", $(doc.createElement("SPAN")), _style.over3_series1.strokecolor, -7, -240);
			text1.text("-");
			var text2 = spanSquareStyleSetting("over3", $(doc.createElement("SPAN")), _style.over3_series2.strokecolor, -7, -260);
			text2.text("-");
			var text3 = spanSquareStyleSetting("over3", $(doc.createElement("SPAN")), _style.over3_series3.strokecolor, -7, -280);
			text3.text("-");
			
			over3_item1 = spanTextStyleSetting("over3", $(doc.createElement("SPAN")), "");
			over3_item1.html("&nbsp;(" + _param1 + ")");
			
			flag.appendChild(title[0]);
			flag.appendChild(text1[0]);
			flag.appendChild(text2[0]);
			flag.appendChild(text3[0]);
			flag.appendChild(over3_item1[0]);
			
			over3_legendMouseInit(_data, _style);
			overLegendDoubleCheck();
			_this.legend_MainBoxLeft.append(flag);
		};
		this.over3_legendOption = function(_param1){
			over3_item1.html("&nbsp;(" + _param1 + ")");
		};
		var over3_legendMouseInit = function(_data, _style){
			var flag_r = doc.createDocumentFragment();
			var text1 = spanTextStyleSetting("over3", $(doc.createElement("SPAN")));
			text1.html("U:&nbsp;");
			var text2 = spanTextStyleSetting("over3", $(doc.createElement("SPAN")));
			text2.html("&nbsp;L:&nbsp;");
			var text3 = spanTextStyleSetting("over3", $(doc.createElement("SPAN")));
			text3.html("&nbsp;M:&nbsp;");
			
			over3_info1 = spanTextStyleSetting("over3", $(doc.createElement("SPAN")));
			over3_info1.text(Math.floor(_data.bandTOP).toString().format());
			over3_info2 = spanTextStyleSetting("over3", $(doc.createElement("SPAN")));
			over3_info2.text(Math.floor(_data.bandMID).toString().format());
			over3_info3 = spanTextStyleSetting("over3", $(doc.createElement("SPAN")), _style.over3_series3.strokecolor);
			over3_info3.text(Math.floor(_data.bandBOT).toString().format());
			
			flag_r.appendChild(text1[0]);
			flag_r.appendChild(over3_info1[0]);
			flag_r.appendChild(text2[0]);
			flag_r.appendChild(over3_info2[0]);
			flag_r.appendChild(text3[0]);
			flag_r.appendChild(over3_info3[0]);
			_this.legend_MainBoxRight.append(flag_r);
		};
		this.over3_legendMouseMove = function(_data){
			over3_info1.text(Math.floor(_data.bandTOP).toString().format());
			over3_info2.text(Math.floor(_data.bandMID).toString().format());
			over3_info3.text(Math.floor(_data.bandBOT).toString().format());
		};
		/* 오버레이 - Parabollic SAR */
		var over4_item1 = null;
		var over4_info1 = null;
		this.over4_legend = function(_style, _param1, _data){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting("over4", $("<span>Parabolic</span>"));
			var text1 = spanSquareStyleSetting("over4", $(doc.createElement("SPAN")), _style.over4_series1.fillcolor, -7, -320);
			text1.text("-");
			
			over4_item1 = spanTextStyleSetting("over4", $(doc.createElement("SPAN")), "");
			over4_item1.html("&nbsp;(" + _param1 + ")");
			
			flag.appendChild(title[0]);
			flag.appendChild(text1[0]);
			flag.appendChild(over4_item1[0]);
			
			over4_legendMouseInit(_data, _style);
			overLegendDoubleCheck();
			_this.legend_MainBoxLeft.append(flag);
		};
		this.over4_legendOption = function(_param1){
			over4_item1.html("&nbsp;(" + _param1 + ")");
		};
		var over4_legendMouseInit = function(_data, _style){
			var flag_r = doc.createDocumentFragment();
			var text1 = spanTextStyleSetting("over4", $(doc.createElement("SPAN")));
			text1.html("Parabolic:&nbsp;");
			
			over4_info1 = spanTextStyleSetting("over4", $(doc.createElement("SPAN")), _style.over4_series1.fillcolor);
			over4_info1.text(Math.floor(_data.bandSAR).toString().format());
			
			flag_r.appendChild(text1[0]);
			flag_r.appendChild(over4_info1[0]);
			_this.legend_MainBoxRight.append(flag_r);
		};
		this.over4_legendMouseMove = function(_data){
			over4_info1.text(Math.floor(_data.bandSAR).toString().format());
		};
		/* 오버레이 - Envelop */
		var over5_item1 = null, over5_item2 = null;
		var over5_info1 = null, over5_info2 = null, over5_info3 = null;
		this.over5_legend = function(_style, _param1, _param2, _data){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting("over5", $("<span>Envelop</span>"));
			
			var text1 = spanSquareStyleSetting("over5", $(doc.createElement("SPAN")), _style.over5_series1.strokecolor, -7, -360);
			text1.text("-");
			var text2 = spanSquareStyleSetting("over5", $(doc.createElement("SPAN")), _style.over5_series2.strokecolor, -7, -380);
			text2.text("-");
			var text3 = spanSquareStyleSetting("over5", $(doc.createElement("SPAN")), _style.over5_series3.strokecolor, -7, -400);
			text3.text("-");
			
			over5_item1 = spanTextStyleSetting("over5", $(doc.createElement("SPAN")), "");
			over5_item1.html("&nbsp;(" + _param1 + ",");
			over5_item2 = spanTextStyleSetting("over5", $(doc.createElement("SPAN")), "");
			over5_item2.html(_param2 + ")");
			
			flag.appendChild(title[0]);
			flag.appendChild(text1[0]);
			flag.appendChild(text2[0]);
			flag.appendChild(text3[0]);
			flag.appendChild(over5_item1[0]);
			flag.appendChild(over5_item2[0]);
			
			over5_legendMouseInit(_data, _style);
			overLegendDoubleCheck();
			_this.legend_MainBoxLeft.append(flag);
		};
		this.over5_legendOption = function(_param1, _param2){
			over5_item1.html("&nbsp;(" + _param1 + ",");
			over5_item2.html(_param2 + ")");
		};
		var over5_legendMouseInit = function(_data, _style){
			var flag_r = doc.createDocumentFragment();
			var text1 = spanTextStyleSetting("over5", $(doc.createElement("SPAN")));
			text1.html("U:&nbsp;");
			var text2 = spanTextStyleSetting("over5", $(doc.createElement("SPAN")));
			text2.html("&nbsp;L:&nbsp;");
			var text3 = spanTextStyleSetting("over5", $(doc.createElement("SPAN")));
			text3.html("&nbsp;M:&nbsp;");
			
			over5_info1 = spanTextStyleSetting("over5", $(doc.createElement("SPAN")), _style.over5_series1.strokecolor);
			over5_info1.text(Math.floor(_data.bandETOP).toString().format());
			over5_info2 = spanTextStyleSetting("over5", $(doc.createElement("SPAN")), _style.over5_series2.strokecolor);
			over5_info2.text(Math.floor(_data.bandEBOT).toString().format());
			over5_info3 = spanTextStyleSetting("over5", $(doc.createElement("SPAN")), _style.over5_series3.strokecolor);
			over5_info3.text(Math.floor(_data.bandEMID).toString().format());
			
			flag_r.appendChild(text1[0]);
			flag_r.appendChild(over5_info1[0]);
			flag_r.appendChild(text2[0]);
			flag_r.appendChild(over5_info2[0]);
			flag_r.appendChild(text3[0]);
			flag_r.appendChild(over5_info3[0]);
			_this.legend_MainBoxRight.append(flag_r);
		};
		this.over5_legendMouseMove = function(_data){
			over5_info1.text(Math.floor(_data.bandETOP).toString().format());
			over5_info2.text(Math.floor(_data.bandEMID).toString().format());
			over5_info3.text(Math.floor(_data.bandEBOT).toString().format());
		};
		/* 오버레이 - 그물차트 */
		var over6_item1 = null, over6_item2 = null, over6_item3 = null;
		this.over6_legend = function(_style, _param1, _param2, _param3){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting("over6", $("<span>그물차트</span>"));
			
			var text1 = spanSquareStyleSetting("over6", $(doc.createElement("SPAN")), _style.over6_series1.strokecolor, -7, -440);
			text1.text("-");
			
			over6_item1 = spanTextStyleSetting("over6", $(doc.createElement("SPAN")), "");
			over6_item1.html("&nbsp;(" + _param1 + ",");
			over6_item2 = spanTextStyleSetting("over6", $(doc.createElement("SPAN")), "");
			over6_item2.html(_param2 + ",");
			over6_item3 = spanTextStyleSetting("over6", $(doc.createElement("SPAN")), "");
			over6_item3.html(_param3 + ")");
			
			flag.appendChild(title[0]);
			flag.appendChild(text1[0]);
			flag.appendChild(over6_item1[0]);
			flag.appendChild(over6_item2[0]);
			flag.appendChild(over6_item3[0]);
			
			overLegendDoubleCheck();
			_this.legend_MainBoxLeft.append(flag);
		};
		this.over6_legendOption = function(_param1, _param2, _param3){
			over6_item1.html("&nbsp;(" + _param1 + ",");
			over6_item2.html(_param2 + ",");
			over6_item3.html(_param3 + ")");
		};
		this.over6_legendMouseMove = function(_data){ };
		/* 오버레이 - 매물분석도 */
		var over7_item1 = null;
		this.over7_legend = function(_param1){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting("over7", $("<span>매물분석도</span>"));
			
			over7_item1 = spanTextStyleSetting("over7", $(doc.createElement("SPAN")), "");
			over7_item1.html("&nbsp;(" + _param1 + ")");
			
			flag.appendChild(title[0]);
			flag.appendChild(over7_item1[0]);
			
			overLegendDoubleCheck();
			_this.legend_MainBoxLeft.append(flag);
		};
		this.over7_legendOption = function(_param1){
			over7_item1.html("&nbsp;(" + _param1 + ")");
		};
		this.over7_legendMouseMove = function(_data){ };
		/*
		 * 
		 * SUB
		 * 
		 */
		var SUBCHART = [];
		this.subInit = function(_item){
			var key = _item.key, check = true;
			for(var i = SUBCHART.length; i--;){
				if(SUBCHART[i] == key){  // 이미 만들어져 있으면...
					$(".legend-sub-left-" + ID + "-" + key, _this.container).css("top", _item.top +"px");
					$(".legend-sub-right-" + ID + "-" + key, _this.container).css("top", _item.top +"px");
					check = false;
				}
			}
			if(check){
				var left = $(doc.createElement("DIV"));
				left.attr({
					"class": "legend-sub-left-" + ID + "-" + key
				}).css({
					"position": "absolute", "top": _item.top+"px", "left": cpl+"px"
				});
				var rightPix = "20px";
				if(_useMobileDevice){
					rightPix = "0";
				}
				var right = $(doc.createElement("DIV"));
				right.attr({
					"class": "legend-sub-right-" + ID + "-" + key
				}).css({
					"position": "absolute", "top": _item.top+"px", "right": rightPix, "text-align": "right"
				});
				this["sub_"+key](key, _item.style, _item.lastData, left, right);
				SUBCHART.push(key);
			}
		};
		/* 거래량 */
		this.sub_volume = function(_key, _style, _data, _left, _right){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting(_key, $("<span>거래량</span>"));
			var text1 = spanSquareStyleSetting(_key, $(doc.createElement("SPAN")), "#c1c1c1", -7, -480);
			text1.html("<font style='color:#25ba25;'>-</font>");
			_left.append(title).append(text1);
			volume_legendMouseInit(_key, _right, _data, _style);
			
			flag.appendChild(_left[0]);
			flag.appendChild(_right[0]);
			_this.container.append(flag);
		};
		var volume_info1 = null;
		var volume_legendMouseInit = function(_key, _right, _data, _style){
			var flag = doc.createDocumentFragment();
			var text1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text1.html("거래량:&nbsp;");
			
			volume_info1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			volume_info1.text(Math.floor(_data.VOLUME).toString().format());
			
			flag.appendChild(text1[0]);
			flag.appendChild(volume_info1[0]);
			_right.append(flag);
		};
		this.volume_legendMouseMove = function(_data){
			volume_info1.text(Math.floor(_data.VOLUME).toString().format());
		};
		/* MACD */
		var macd_item1 = macd_item2 = macd_item3 = null;
		this.sub_macd = function(_key, _style, _data, _left, _right){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting(_key, $("<span>MACD</span>"));
			var text1 = spanItemStyleSetting(_key, $(doc.createElement("SPAN")), _style.series2.strokecolor, -7, -500);
			text1.html("<font style='color:#666;'>MACD</font>");
			var text2 = spanItemStyleSetting(_key, $(doc.createElement("SPAN")), _style.series2.strokecolor, -7, -520);
			text2.html("<font style='color:#666;'>Sign</font>");
			var text3 = spanItemStyleSetting(_key, $(doc.createElement("SPAN")), _style.series2.strokecolor, -7, -540);
			text3.html("<font style='color:#666;'>Osc</font>");
			
			macd_item1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			macd_item1.html("&nbsp;("+subIndex.macd_param1 + ",");
			macd_item2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			macd_item2.html(subIndex.macd_param2 + ",");
			macd_item3 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			macd_item3.html(subIndex.macd_param3 + ")");
			
			_left.append(title).append(text1).append(text2).append(text3).append(macd_item1).append(macd_item2).append(macd_item3);

			macd_legendMouseInit(_key, _right, _data, _style);
			
			flag.appendChild(_left[0]);
			flag.appendChild(_right[0]);
			
			_this.container.append(flag);
			if(_this.GRAPH_WIDTH - $(_left).width() < $(_right).width() + 15){ $(_right).hide(); } 
			else { $(_right).show(); }
		};
		var macd_info1 = macd_info2 = macd_info3 = null;
		var macd_legendMouseInit = function(_key, _right, _data, _style){
			var flag = doc.createDocumentFragment();
			var text1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text1.html("MACD:&nbsp;");
			var text2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text2.html("&nbsp;Sign:&nbsp;");
			var text3 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text3.html("&nbsp;Osc:&nbsp;");
			
			macd_info1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			macd_info1.text(Math.floor(_data.MACD).toString().format());
			macd_info2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			macd_info2.text(Math.floor(_data.MACD_SIGNAL).toString().format());
			macd_info3 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			macd_info3.text(Math.floor(_data.MACD_OSC).toString().format());
			
			flag.appendChild(text1[0]);
			flag.appendChild(macd_info1[0]);
			flag.appendChild(text2[0]);
			flag.appendChild(macd_info2[0]);
			flag.appendChild(text3[0]);
			flag.appendChild(macd_info3[0]);
			_right.append(flag);
		};
		this.macd_legendOption = function(_param1, _param2, _param3){
			macd_item1.html("&nbsp;(" + _param1 + ",");
			macd_item2.html(_param2 + ",");
			macd_item3.html(_param3 + ")");
		};
		this.macd_legendMouseMove = function(_data){
			macd_info1.text(Math.floor(_data.MACD).toString().format());
			macd_info2.text(Math.floor(_data.MACD_SIGNAL).toString().format());
			macd_info3.text(Math.floor(_data.MACD_OSC).toString().format());
		};
		/* Slow_STC */
		var slowstc_item1 = slowstc_item2 = slowstc_item3 = null;
		this.sub_slowstc = function(_key, _style, _data, _left, _right){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting(_key, $("<span>Slow STC</span>"));
			var text1 = spanItemStyleSetting(_key, $(doc.createElement("SPAN")), _style.series1.strokecolor, -7, -500);
			text1.html("<font style='color:#666;'>Slow %K</font>");
			var text2 = spanItemStyleSetting(_key, $(doc.createElement("SPAN")), _style.series2.strokecolor, -7, -520);
			text2.html("<font style='color:#666;'>Slow %D</font>");
			
			slowstc_item1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			slowstc_item1.html("&nbsp;("+subIndex.slowstc_param1 + ",");
			slowstc_item2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			slowstc_item2.html(subIndex.slowstc_param2 + ",");
			slowstc_item3 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			slowstc_item3.html(subIndex.slowstc_param3 + ")");
			
			_left.append(title).append(text1).append(text2).append(slowstc_item1).append(slowstc_item2).append(slowstc_item3);
			
			slowstc_legendMouseInit(_key, _right, _data, _style);
			
			flag.appendChild(_left[0]);
			flag.appendChild(_right[0]);
			
			_this.container.append(flag);
			if(_this.GRAPH_WIDTH - $(_left).width() < $(_right).width() + 15){ $(_right).hide(); } 
			else { $(_right).show(); }
		};
		var slowstc_info1 = slowstc_info2 = null;
		var slowstc_legendMouseInit = function(_key, _right, _data, _style){
			var flag = doc.createDocumentFragment();
			var text1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text1.html("Slow %K:&nbsp;");
			var text2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text2.html("Slow %D:&nbsp;");
			
			slowstc_info1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			slowstc_info1.html((_data.SlowSTC_PERK).toFixed(2).format() +"&nbsp;");
			slowstc_info2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			slowstc_info2.text((_data.SlowSTC_PERD).toFixed(2).format());
			
			flag.appendChild(text1[0]);
			flag.appendChild(slowstc_info1[0]);
			flag.appendChild(text2[0]);
			flag.appendChild(slowstc_info2[0]);
			_right.append(flag);
		};
		this.slowstc_legendOption = function(_param1, _param2, _param3){
			slowstc_item1.html("&nbsp;(" + _param1 + ",");
			slowstc_item2.html(_param2 + ",");
			slowstc_item3.html(_param3 + ")");
		};
		this.slowstc_legendMouseMove = function(_data){
			slowstc_info1.html((_data.SlowSTC_PERK).toFixed(2).format() + "&nbsp;");
			slowstc_info2.text((_data.SlowSTC_PERD).toFixed(2).format());
		};
		/* Fast_STC */
		var faststc_item1 = faststc_item2 = null;
		this.sub_faststc = function(_key, _style, _data, _left, _right){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting(_key, $("<span>Fast STC</span>"));
			var text1 = spanItemStyleSetting(_key, $(doc.createElement("SPAN")), _style.series1.strokecolor, -7, -500);
			text1.html("<font style='color:#666;'>Fast %K</font>");
			var text2 = spanItemStyleSetting(_key, $(doc.createElement("SPAN")), _style.series2.strokecolor, -7, -520);
			text2.html("<font style='color:#666;'>Fast %D</font>");
			
			faststc_item1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			faststc_item1.html("&nbsp;("+subIndex.faststc_param1 + ",");
			faststc_item2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			faststc_item2.html(subIndex.faststc_param2 + ")");
			
			_left.append(title).append(text1).append(text2).append(faststc_item1).append(faststc_item2);
			
			faststc_legendMouseInit(_key, _right, _data, _style);
			
			flag.appendChild(_left[0]);
			flag.appendChild(_right[0]);
			
			_this.container.append(flag);
			if(_this.GRAPH_WIDTH - $(_left).width() < $(_right).width() + 15){ $(_right).hide(); } 
			else { $(_right).show(); }
		};
		var faststc_info1 = faststc_info2 = null;
		var faststc_legendMouseInit = function(_key, _right, _data, _style){
			var flag = doc.createDocumentFragment();
			var text1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text1.html("Fast %K:&nbsp;");
			var text2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text2.html("Fast %D:&nbsp;");
			
			faststc_info1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			faststc_info1.html((_data.FastSTC_PERK).toFixed(2).format() +"&nbsp;");
			faststc_info2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			faststc_info2.text((_data.FastSTC_PERD).toFixed(2).format());
			
			flag.appendChild(text1[0]);
			flag.appendChild(faststc_info1[0]);
			flag.appendChild(text2[0]);
			flag.appendChild(faststc_info2[0]);
			_right.append(flag);
		};
		this.faststc_legendOption = function(_param1, _param2){
			faststc_item1.html("&nbsp;(" + _param1 + ",");
			faststc_item2.html(_param2 + ")");
		};
		this.faststc_legendMouseMove = function(_data){
			faststc_info1.html((_data.FastSTC_PERK).toFixed(2).format() + "&nbsp;");
			faststc_info2.text((_data.FastSTC_PERD).toFixed(2).format());
		};
		/* RSI */
		var rsi_item1 = rsi_item2 = null;
		this.sub_rsi = function(_key, _style, _data, _left, _right){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting(_key, $("<span>RSI</span>"));
			var text1 = spanItemStyleSetting(_key, $(doc.createElement("SPAN")), _style.series1.strokecolor, -7, -500);
			text1.html("<font style='color:#666;'>RSI</font>");
			var text2 = spanItemStyleSetting(_key, $(doc.createElement("SPAN")), _style.series2.strokecolor, -7, -520);
			text2.html("<font style='color:#666;'>RSI-Signal</font>");
			
			rsi_item1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			rsi_item1.html("&nbsp;("+subIndex.rsi_param1 + ",");
			rsi_item2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			rsi_item2.html(subIndex.rsi_param2 + ")");
			
			_left.append(title).append(text1).append(text2).append(rsi_item1).append(rsi_item2);
			
			rsi_legendMouseInit(_key, _right, _data, _style);
			
			flag.appendChild(_left[0]);
			flag.appendChild(_right[0]);
			
			_this.container.append(flag);
			if(_this.GRAPH_WIDTH - $(_left).width() < $(_right).width() + 15){ $(_right).hide(); } 
			else { $(_right).show(); }
		};
		var rsi_info1 = rsi_info2 = null;
		var rsi_legendMouseInit = function(_key, _right, _data, _style){
			var flag = doc.createDocumentFragment();
			var text1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text1.html("RSI:&nbsp;");
			var text2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text2.html("RSI-Signal:&nbsp;");
			
			rsi_info1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			rsi_info1.html((_data.RSI).toFixed(2).format() +"&nbsp;");
			rsi_info2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			rsi_info2.text((_data.RSI_SIGNAL).toFixed(2).format());
			
			flag.appendChild(text1[0]);
			flag.appendChild(rsi_info1[0]);
			flag.appendChild(text2[0]);
			flag.appendChild(rsi_info2[0]);
			_right.append(flag);
		};
		this.rsi_legendOption = function(_param1, _param2){
			rsi_item1.html("&nbsp;(" + _param1 + ",");
			rsi_item2.html(_param2 + ")");
		};
		this.rsi_legendMouseMove = function(_data){
			rsi_info1.html((_data.RSI).toFixed(2).format() + "&nbsp;");
			rsi_info2.text((_data.RSI_SIGNAL).toFixed(2).format());
		};
		/* DMI */
		var dmi_item1 = null;
		this.sub_dmi = function(_key, _style, _data, _left, _right){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting(_key, $("<span>DMI</span>"));
			var text1 = spanItemStyleSetting(_key, $(doc.createElement("SPAN")), _style.series1.strokecolor, -7, -500);
			text1.html("<font style='color:#666;'>PDI</font>");
			var text2 = spanItemStyleSetting(_key, $(doc.createElement("SPAN")), _style.series2.strokecolor, -7, -520);
			text2.html("<font style='color:#666;'>MDI</font>");
			
			dmi_item1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			dmi_item1.html("&nbsp;("+subIndex.dmi_param1 + ")");
			
			_left.append(title).append(text1).append(text2).append(dmi_item1);
			
			dmi_legendMouseInit(_key, _right, _data, _style);
			
			flag.appendChild(_left[0]);
			flag.appendChild(_right[0]);
			
			_this.container.append(flag);
			if(_this.GRAPH_WIDTH - $(_left).width() < $(_right).width() + 15){ $(_right).hide(); } 
			else { $(_right).show(); }
		};
		var dmi_info1 = dmi_info2 = null;
		var dmi_legendMouseInit = function(_key, _right, _data, _style){
			var flag = doc.createDocumentFragment();
			var text1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text1.html("PDI:&nbsp;");
			var text2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text2.html("MDI:&nbsp;");
			
			dmi_info1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			dmi_info1.html((_data.DMI_PDI).toFixed(2).format() +"&nbsp;");
			dmi_info2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			dmi_info2.text((_data.DMI_MDI).toFixed(2).format());
			
			flag.appendChild(text1[0]);
			flag.appendChild(dmi_info1[0]);
			flag.appendChild(text2[0]);
			flag.appendChild(dmi_info2[0]);
			_right.append(flag);
		};
		this.dmi_legendOption = function(_param1){
			dmi_item1.html("&nbsp;(" + _param1 + ")");
		};
		this.dmi_legendMouseMove = function(_data){
			dmi_info1.html((_data.DMI_PDI).toFixed(2).format() + "&nbsp;");
			dmi_info2.text((_data.DMI_MDI).toFixed(2).format());
		};
		/* ADX */
		var adx_item1 = adx_item2 = adx_item3 = null;
		this.sub_adx = function(_key, _style, _data, _left, _right){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting(_key, $("<span>ADX</span>"));
			var text1 = spanItemStyleSetting(_key, $(doc.createElement("SPAN")), _style.series1.strokecolor, -7, -500);
			text1.html("<font style='color:#666;'>ADX</font>");
			var text2 = spanItemStyleSetting(_key, $(doc.createElement("SPAN")), _style.series2.strokecolor, -7, -520);
			text2.html("<font style='color:#666;'>MA</font>");
			
			adx_item1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			adx_item1.html("&nbsp;("+subIndex.adx_param1 + ",");
			adx_item2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			adx_item2.html(subIndex.adx_param2 + ",");
			adx_item3 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			adx_item3.html(subIndex.adx_param3 + ")");
			
			_left.append(title).append(text1).append(text2).append(adx_item1).append(adx_item2).append(adx_item3);
			
			adx_legendMouseInit(_key, _right, _data, _style);
			
			flag.appendChild(_left[0]);
			flag.appendChild(_right[0]);
			
			_this.container.append(flag);
			if(_this.GRAPH_WIDTH - $(_left).width() < $(_right).width() + 15){ $(_right).hide(); } 
			else { $(_right).show(); }
		};
		var adx_info1 = adx_info2 = null;
		var adx_legendMouseInit = function(_key, _right, _data, _style){
			var flag = doc.createDocumentFragment();
			var text1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text1.html("ADX:&nbsp;");
			var text2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text2.html("MA:&nbsp;");
			
			adx_info1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			adx_info1.html((_data.ADX).toFixed(2).format() +"&nbsp;");
			adx_info2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			adx_info2.text((_data.ADX_MA).toFixed(2).format());
			
			flag.appendChild(text1[0]);
			flag.appendChild(adx_info1[0]);
			flag.appendChild(text2[0]);
			flag.appendChild(adx_info2[0]);
			_right.append(flag);
		};
		this.adx_legendOption = function(_param1, _param2, _param3){
			adx_item1.html("&nbsp;(" + _param1 + ",");
			adx_item2.html(_param2 + ",");
			adx_item3.html(_param3 + ")");
		};
		this.adx_legendMouseMove = function(_data){
			adx_info1.html((_data.ADX).toFixed(2).format() + "&nbsp;");
			adx_info2.text((_data.ADX_MA).toFixed(2).format());
		};
		/* OBV */
		this.sub_obv = function(_key, _style, _data, _left, _right){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting(_key, $("<span>OBV</span>"));
			var text1 = spanSquareStyleSetting(_key, $(doc.createElement("SPAN")), _style.series1.strokecolor, -7, -500);
			text1.text("-");
			_left.append(title).append(text1);
			obv_legendMouseInit(_key, _right, _data, _style);
			
			flag.appendChild(_left[0]);
			flag.appendChild(_right[0]);
			_this.container.append(flag);
		};
		var obv_info1 = null;
		var obv_legendMouseInit = function(_key, _right, _data, _style){
			var flag = doc.createDocumentFragment();
			var text1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text1.html("OBV:&nbsp;");
			
			obv_info1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			obv_info1.text((_data.OBV).toFixed(2).format());
			
			flag.appendChild(text1[0]);
			flag.appendChild(obv_info1[0]);
			_right.append(flag);
		};
		this.obv_legendMouseMove = function(_data){
			obv_info1.text((_data.OBV).toFixed(2).format());
		};
		/* SONAR */
		var sonar_item1 = sonar_item2 = sonar_item3 = null;
		this.sub_sonar = function(_key, _style, _data, _left, _right){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting(_key, $("<span>SONAR</span>"));
			var text1 = spanItemStyleSetting(_key, $(doc.createElement("SPAN")), _style.series1.strokecolor, -7, -500);
			text1.html("<font style='color:#666;'>SONAR</font>");
			var text2 = spanItemStyleSetting(_key, $(doc.createElement("SPAN")), _style.series2.strokecolor, -7, -520);
			text2.html("<font style='color:#666;'>MA</font>");
			
			sonar_item1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			sonar_item1.html("&nbsp;("+subIndex.sonar_param1 + ",");
			sonar_item2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			sonar_item2.html(subIndex.sonar_param2 + ",");
			sonar_item3 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			sonar_item3.html(subIndex.sonar_param3 + ")");
			
			_left.append(title).append(text1).append(text2).append(sonar_item1).append(sonar_item2).append(sonar_item3);
			
			sonar_legendMouseInit(_key, _right, _data, _style);
			
			flag.appendChild(_left[0]);
			flag.appendChild(_right[0]);
			_this.container.append(flag);
			if(_this.GRAPH_WIDTH - $(_left).width() < $(_right).width() + 15){ $(_right).hide(); } 
			else { $(_right).show(); }
		};
		var sonar_info1 = sonar_info2 = null;
		var sonar_legendMouseInit = function(_key, _right, _data, _style){
			var flag = doc.createDocumentFragment();
			var text1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text1.html("SONAR:&nbsp;");
			var text2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text2.html("MA:&nbsp;");
			
			sonar_info1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			sonar_info1.html((_data.SONAR).toFixed(2).format() +"&nbsp;");
			sonar_info2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			sonar_info2.text((_data.SONAR_SIGNAL).toFixed(2).format());
			
			flag.appendChild(text1[0]);
			flag.appendChild(sonar_info1[0]);
			flag.appendChild(text2[0]);
			flag.appendChild(sonar_info2[0]);
			_right.append(flag);
		};
		this.sonar_legendOption = function(_param1, _param2, _param3){
			sonar_item1.html("&nbsp;(" + _param1 + ",");
			sonar_item2.html(_param2 + ",");
			sonar_item3.html(_param3 + ")");
		};
		this.sonar_legendMouseMove = function(_data){
			sonar_info1.html((_data.SONAR).toFixed(2).format() + "&nbsp;");
			sonar_info2.text((_data.SONAR_SIGNAL).toFixed(2).format());
		};
		/* CCI */
		var cci_item1 = null;
		this.sub_cci = function(_key, _style, _data, _left, _right){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting(_key, $("<span>CCI</span>"));
			var text1 = spanSquareStyleSetting(_key, $(doc.createElement("SPAN")), _style.series1.strokecolor, -7, -500);
			text1.text("-");
			
			cci_item1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			cci_item1.html("&nbsp;("+subIndex.cci_param1 + ")");
			
			_left.append(title).append(text1).append(cci_item1);
			
			cci_legendMouseInit(_key, _right, _data, _style);
			
			flag.appendChild(_left[0]);
			flag.appendChild(_right[0]);
			
			_this.container.append(flag);
			if(_this.GRAPH_WIDTH - $(_left).width() < $(_right).width() + 15){ $(_right).hide(); } 
			else { $(_right).show(); }
		};
		var cci_info1 = null;
		var cci_legendMouseInit = function(_key, _right, _data, _style){
			var flag = doc.createDocumentFragment();
			var text1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text1.html("CCI:&nbsp;");
			
			cci_info1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			cci_info1.text((_data.CCI).toFixed(2).format());
			
			flag.appendChild(text1[0]);
			flag.appendChild(cci_info1[0]);
			_right.append(flag);
		};
		this.cci_legendOption = function(_param1){
			cci_item1.html("&nbsp;(" + _param1 + ")");
		};
		this.cci_legendMouseMove = function(_data){
			cci_info1.text((_data.CCI).toFixed(2).format());
		};
		/* VR */
		var vr_item1 = null;
		this.sub_vr = function(_key, _style, _data, _left, _right){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting(_key, $("<span>VR</span>"));
			var text1 = spanSquareStyleSetting(_key, $(doc.createElement("SPAN")), _style.series1.strokecolor, -7, -500);
			text1.text("-");
			
			vr_item1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			vr_item1.html("&nbsp;("+subIndex.vr_param1 + ")");
			
			_left.append(title).append(text1).append(vr_item1);
			
			vr_legendMouseInit(_key, _right, _data, _style);
			
			flag.appendChild(_left[0]);
			flag.appendChild(_right[0]);
			
			_this.container.append(flag);
			if(_this.GRAPH_WIDTH - $(_left).width() < $(_right).width() + 15){ $(_right).hide(); } 
			else { $(_right).show(); }
		};
		var vr_info1 = null;
		var vr_legendMouseInit = function(_key, _right, _data, _style){
			var flag = doc.createDocumentFragment();
			var text1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text1.html("VR:&nbsp;");
			
			vr_info1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			vr_info1.text((_data.VR).toFixed(2).format());
			
			flag.appendChild(text1[0]);
			flag.appendChild(vr_info1[0]);
			_right.append(flag);
		};
		this.vr_legendOption = function(_param1){
			vr_item1.html("&nbsp;(" + _param1 + ")");
		};
		this.vr_legendMouseMove = function(_data){
			vr_info1.text((_data.VR).toFixed(2).format());
		};
		/* TRIX */
		var trix_item1 = trix_item2 = null;
		this.sub_trix = function(_key, _style, _data, _left, _right){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting(_key, $("<span>TRIX</span>"));
			var text1 = spanItemStyleSetting(_key, $(doc.createElement("SPAN")), _style.series1.strokecolor, -7, -500);
			text1.html("<font style='color:#666;'>TRIX</font>");
			var text2 = spanItemStyleSetting(_key, $(doc.createElement("SPAN")), _style.series2.strokecolor, -7, -520);
			text2.html("<font style='color:#666;'>TRMA</font>");
			
			trix_item1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			trix_item1.html("&nbsp;("+subIndex.trix_param1 + ",");
			trix_item2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			trix_item2.html(subIndex.trix_param2 + ")");
			
			_left.append(title).append(text1).append(text2).append(trix_item1).append(trix_item2);
			
			trix_legendMouseInit(_key, _right, _data, _style);
			
			flag.appendChild(_left[0]);
			flag.appendChild(_right[0]);
			
			_this.container.append(flag);
			if(_this.GRAPH_WIDTH - $(_left).width() < $(_right).width() + 15){ $(_right).hide(); } 
			else { $(_right).show(); }
		};
		var trix_info1 = trix_info2 = null;
		var trix_legendMouseInit = function(_key, _right, _data, _style){
			var flag = doc.createDocumentFragment();
			var text1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text1.html("TRIX:&nbsp;");
			var text2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text2.html("TRMA:&nbsp;");
			
			trix_info1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			trix_info1.html((_data.TRIX).toFixed(2).format() +"&nbsp;");
			trix_info2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			trix_info2.text((_data.TRIX_SIGNAL).toFixed(2).format());
			
			flag.appendChild(text1[0]);
			flag.appendChild(trix_info1[0]);
			flag.appendChild(text2[0]);
			flag.appendChild(trix_info2[0]);
			_right.append(flag);
		};
		this.trix_legendOption = function(_param1, _param2){
			trix_item1.html("&nbsp;(" + _param1 + ",");
			trix_item2.html(_param2 + ")");
		};
		this.trix_legendMouseMove = function(_data){
			trix_info1.html((_data.TRIX).toFixed(2).format() + "&nbsp;");
			trix_info2.text((_data.TRIX_SIGNAL).toFixed(2).format());
		};
		/* PMAO */
		var pmao_item1 = pmao_item2 = null;
		this.sub_pmao = function(_key, _style, _data, _left, _right){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting(_key, $("<span>Price OSC</span>"));
			var text1 = spanSquareStyleSetting(_key, $(doc.createElement("SPAN")), _style.series1.upfillcolor, -7, -540);
			text1.text("-");
			
			pmao_item1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			pmao_item1.html("&nbsp;("+subIndex.pmao_param1 + ",");
			pmao_item2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			pmao_item2.html(subIndex.pmao_param2 + ")");
			
			_left.append(title).append(text1).append(pmao_item1).append(pmao_item2);
			
			pmao_legendMouseInit(_key, _right, _data, _style);
			
			flag.appendChild(_left[0]);
			flag.appendChild(_right[0]);
			
			_this.container.append(flag);
			if(_this.GRAPH_WIDTH - $(_left).width() < $(_right).width() + 15){ $(_right).hide(); } 
			else { $(_right).show(); }
		};
		var pmao_info1 = null;
		var pmao_legendMouseInit = function(_key, _right, _data, _style){
			var flag = doc.createDocumentFragment();
			var text1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text1.html("PMAO:&nbsp;");
			
			pmao_info1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			pmao_info1.text((_data.PMAO).toFixed(2).format());
			
			flag.appendChild(text1[0]);
			flag.appendChild(pmao_info1[0]);
			_right.append(flag);
		};
		this.pmao_legendOption = function(_param1, _param2){
			pmao_item1.html("&nbsp;(" + _param1 + ",");
			pmao_item2.html(_param2 + ")");
		};
		this.pmao_legendMouseMove = function(_data){
			pmao_info1.text((_data.PMAO).toFixed(2).format());
		};
		/* psyhological */
		var psyhological_item1 = null;
		this.sub_psyhological = function(_key, _style, _data, _left, _right){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting(_key, $("<span>투자심리선</span>"));
			var text1 = spanSquareStyleSetting(_key, $(doc.createElement("SPAN")), _style.series1.strokecolor, -7, -500);
			text1.text("-");
			
			psyhological_item1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			psyhological_item1.html("&nbsp;("+subIndex.psyhological_param1 + ")");
			
			_left.append(title).append(text1).append(psyhological_item1);
			
			psyhological_legendMouseInit(_key, _right, _data, _style);
			
			flag.appendChild(_left[0]);
			flag.appendChild(_right[0]);
			
			_this.container.append(flag);
			if(_this.GRAPH_WIDTH - $(_left).width() < $(_right).width() + 15){ $(_right).hide(); } 
			else { $(_right).show(); }
		};
		var psyhological_info1 = null;
		var psyhological_legendMouseInit = function(_key, _right, _data, _style){
			var flag = doc.createDocumentFragment();
			var text1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text1.html("투자심리선:&nbsp;");
			
			psyhological_info1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			psyhological_info1.text((_data.Psyhological).toFixed(2).format());
			
			flag.appendChild(text1[0]);
			flag.appendChild(psyhological_info1[0]);
			_right.append(flag);
		};
		this.psyhological_legendOption = function(_param1){
			psyhological_item1.html("&nbsp;(" + _param1 + ")");
		};
		this.psyhological_legendMouseMove = function(_data){
			psyhological_info1.text((_data.Psyhological).toFixed(2).format());
		};
		/* Williams' %R */
		var williams_item1 = williams_item2 = null;
		this.sub_williams = function(_key, _style, _data, _left, _right){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting(_key, $("<span>Williams' %R</span>"));
			var text1 = spanItemStyleSetting(_key, $(doc.createElement("SPAN")), _style.series1.strokecolor, -7, -500);
			text1.html("<font style='color:#666;'>%R</font>");
			var text2 = spanItemStyleSetting(_key, $(doc.createElement("SPAN")), _style.series2.strokecolor, -7, -520);
			text2.html("<font style='color:#666;'>%D</font>");
			
			williams_item1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			williams_item1.html("&nbsp;("+subIndex.williams_param1 + ",");
			williams_item2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			williams_item2.html(subIndex.williams_param2 + ")");
			
			_left.append(title).append(text1).append(text2).append(williams_item1).append(williams_item2);
			
			williams_legendMouseInit(_key, _right, _data, _style);
			
			flag.appendChild(_left[0]);
			flag.appendChild(_right[0]);
			
			_this.container.append(flag);
			if(_this.GRAPH_WIDTH - $(_left).width() < $(_right).width() + 15){ $(_right).hide(); } 
			else { $(_right).show(); }
		};
		var williams_info1 = williams_info2 = null;
		var williams_legendMouseInit = function(_key, _right, _data, _style){
			var flag = doc.createDocumentFragment();
			var text1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text1.html("%R:&nbsp;");
			var text2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text2.html("%D:&nbsp;");
			
			williams_info1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			williams_info1.html((_data.WILLIAMS_PERR).toFixed(2).format() +"&nbsp;");
			williams_info2 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			williams_info2.text((_data.WILLIAMS_PERD).toFixed(2).format());
			
			flag.appendChild(text1[0]);
			flag.appendChild(williams_info1[0]);
			flag.appendChild(text2[0]);
			flag.appendChild(williams_info2[0]);
			_right.append(flag);
		};
		this.williams_legendOption = function(_param1, _param2){
			williams_item1.html("&nbsp;(" + _param1 + ",");
			williams_item2.html(_param2 + ")");
		};
		this.williams_legendMouseMove = function(_data){
			williams_info1.html((_data.WILLIAMS_PERR).toFixed(2).format() + "&nbsp;");
			williams_info2.text((_data.WILLIAMS_PERD).toFixed(2).format());
		};
		/* ROC */
		var roc_item1 = null;
		this.sub_roc = function(_key, _style, _data, _left, _right){
			var flag = doc.createDocumentFragment();
			
			var title = labelStyleSetting(_key, $("<span>ROC</span>"));
			var text1 = spanSquareStyleSetting(_key, $(doc.createElement("SPAN")), _style.series1.strokecolor, -7, -500);
			text1.text("-");
			
			roc_item1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666");
			roc_item1.html("&nbsp;("+subIndex.roc_param1 + ")");
			
			_left.append(title).append(text1).append(roc_item1);
			
			roc_legendMouseInit(_key, _right, _data, _style);
			
			flag.appendChild(_left[0]);
			flag.appendChild(_right[0]);
			
			_this.container.append(flag);
			if(_this.GRAPH_WIDTH - $(_left).width() < $(_right).width() + 15){ $(_right).hide(); } 
			else { $(_right).show(); }
		};
		var roc_info1 = null;
		var roc_legendMouseInit = function(_key, _right, _data, _style){
			var flag = doc.createDocumentFragment();
			var text1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")));
			text1.html("ROC:&nbsp;");
			
			roc_info1 = spanTextStyleSetting(_key, $(doc.createElement("SPAN")), "#666666");
			roc_info1.html((_data.ROC).toFixed(2).format());
			
			flag.appendChild(text1[0]);
			flag.appendChild(roc_info1[0]);
			_right.append(flag);
		};
		this.roc_legendOption = function(_param1){
			roc_item1.html("&nbsp;(" + _param1 + ")");
		};
		this.roc_legendMouseMove = function(_data){
			roc_info1.text((_data.ROC).toFixed(2).format());
		};
		
		this.remove_overlay = function(_value){
			$.each(_this.legend_MainBoxLeft.children(), function(index){
				if($(this).attr('class').indexOf(_value) >= 0){ $(this).remove(); }
			});
			$.each(_this.legend_MainBoxRight.children(), function(index){
				if($(this).attr('class').indexOf(_value) >= 0){ $(this).remove(); }
			});
			if(_this.legend_MainBoxLeft.children().length <= 0) return;
			var solo = true;
			var over = $(_this.legend_MainBoxLeft.children()[0], _this.legend_MainBoxLeft).attr('class').split(ID+"-")[1];
			$.each(_this.legend_MainBoxLeft.children(), function(index){
				if($(this).attr('class').indexOf(over) < 0){
					solo = false;
					return solo;
				}
			});
			if(solo){ _this.legend_MainBoxRight.show(); }
		};
		this.remove_subIndex = function(_value){
			for(var i = SUBCHART.length; i--;){
				if(_value === SUBCHART[i]) {
					$(".legend-sub-left-" + ID + "-" + _value, _this.container).remove();
					$(".legend-sub-right-" + ID + "-" + _value, _this.container).remove();
					
					SUBCHART.splice(i, 1);
					break;
				}
			}
		};
		var boxStyleSetting = function(name, element, y, x) {
			element.attr({
				"class": "legend-box-" + ID + "-" + name
			}).css({
				"position": "absolute", "top": y+'px', "left": x+'px',
				"clear": 'both', "overflow": "hidden",
				"width": "1000px", "height": "20px", "word-break": "keep-all"
			});
			return element;
		};
		var boxStyleLRSetting = function(name, element, direction, x, y) {
			element.attr({
				"class": "legend-box-" + ID + "-" + name + "-" + direction
			}).css({
				"position": "absolute", "top": y+'px', "text-align": direction, "overflow": "hidden",
				"width": "1000px", "height": "20px", "word-break": "keep-all"
			});
			if(direction == "left") { element.css({"left": "0px", "width": "700px"}); } 
			else { element.css({"left": "-15px", "width": x+"px"});	}
			return element;
		};
		var labelStyleSetting = function(name, element) {
			element.attr({
				"class": "legend-span-" + ID + "-" + name
			}).css({
				"font-size": "11px", "padding-left": "5px", "color": "#666666"
			});
			return element;
		};
		var spanItemStyleSetting = function(name, element, _color, _bg_x, _bg_y) {
			element.attr({
				"class": "legend-span-" + ID + "-" + name
			}).css({
				"display": "inline-block", "padding": "0 5px 0 18px", "height": "11px", "line-height": "11px", "color": _color,
				"background": "url("+getStyles(KEY, "legendimage")+")", "background-repeat": "no-repeat", "background-position": _bg_x + "px " + _bg_y + "px",
				"fontSize": "11px"
			});
			return element;
		};
		var spanSquareStyleSetting = function(name, element, _color, _bg_x, _bg_y) {
			element.attr({
				"class": "legend-span-" + ID + "-" + name
			}).css({
				"display": "inline-block", "padding": "0 0px 0 3px", "width": "10px", "height": "10px", "line-height": "11px", "color": _color,
				"background": "url("+getStyles(KEY, "legendimage")+")", "background-repeat": "no-repeat", "background-position": _bg_x + "px " + _bg_y + "px",
				"fontSize": "11px"
			});
			return element;
		};
		var spanTextStyleSetting = function(name, element, _color) {
			element.attr({
				"class": "legend-span-" + ID + "-" + name
			}).css({
				"display": "inline-block", "color": _color, "height": "11px", "line-height": "11px", "fontSize": "11px"
			});
			return element;
		};
		
		var overLegendDoubleCheck = function(){
			if(_this.legend_MainBoxLeft.children().length <= 0){ _this.legend_MainBoxRight.show(); } 
			else { _this.legend_MainBoxRight.hide(); }
		};
		// Styles getter
		var getStyles = function (_KEY, _name) {
			_name = _name.toLowerCase();
			var s = styles;
			if(_KEY !== "A") { s = s[_KEY]; } 
			return s[_name];
		};
		init();
		return _this;
	};
})(jQuery);