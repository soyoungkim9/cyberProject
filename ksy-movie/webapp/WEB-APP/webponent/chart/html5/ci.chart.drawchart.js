	DrawChart = function(_CHART_ID, _backctx, _graphctx, _etcctx, _options, _styles){
		var _this = this;
		/* Default Setting
		 * options : 차트 전반적인 옵션
		 * styles : 차트 스타일
		 * series : 차트 구성 시리즈
		 * backctx : AXIS 등 전반적인 것을 그릴 CANVAS CONTEXT
		 * graphctx : SERIES를 그릴 CANVAS CONTEXT
		 */
		var backctx = _backctx, graphctx = _graphctx, etcctx = _etcctx;
		var options = _options, styles = _styles, series = null;
		
		this.drawAxis = null;
		/*
		 * INTERNAL
		 */
		var CHART_WIDTH = 0, CHART_HEIGHT = 0; // 차트 전체 영역의 사이즈
		this.GRAPH_WIDTH = 0, this.GRAPH_HEIGHT = 0; // SERIES가 그려지는 영역의 사이즈
		var CHART_TOP = 0;
		
		var CHART_ID = _CHART_ID, KEY = null; // 현재 그려지고 있는 SERIES의 KEY VALUE
		var max = 0, min = 0, base = 0;
		var seriesType = null;
		this.drawSerieses = [];
		/*
		 * 초기화 - ci.chart.chart.js 에서 호출
		 * param *
		 * - max 
		 * - min 
		 * - base : 마지막날 기준 값
		 * - series : 그려질 series object
		 * - key : 그려질 series의 KEY 값
		 * - type : main | sub
		 */
		this.initialize = function ( _param )
		{
			series = _param.option.series;
			KEY = _param.option.key;
			
			CHART_WIDTH = backctx.canvas.width, CHART_HEIGHT = backctx.canvas.height;
			if(!options.usemultiyaxis){
				_this.GRAPH_WIDTH = CHART_WIDTH - getStyles(KEY, "canvaspaddingleft") - getStyles(KEY, "canvaspaddingright") - getStyles(KEY, "ylabelgap") - getStyles(KEY, "ylabelpaddingright") - getStyles(KEY, "ylabelpaddingleft");
				_this.GRAPH_HEIGHT = _param.option.height - getStyles(KEY, "canvaspaddingtop") - getStyles(KEY, "canvaspaddingbottom") - getStyles(KEY, "xlabelpaddingtop") - getStyles(KEY, "xlabelgap") - getStyles(KEY, "mouseinfoheight");
			} else { // MULTI-YAXIS
				_this.GRAPH_WIDTH = CHART_WIDTH - getStyles(KEY, "canvaspaddingleft") - getStyles(KEY, "canvaspaddingright");
				_this.GRAPH_HEIGHT = _param.option.height - getStyles(KEY, "canvaspaddingtop") - getStyles(KEY, "canvaspaddingbottom") - getStyles(KEY, "xlabelpaddingtop") - getStyles(KEY, "xlabelgap") - getStyles(KEY, "mouseinfoheight");
				var yaxisid = "";
				for(var t in series){
					if(t != "type") {
						if(yaxisid == series[t].yaxisid || (series[t].visible != undefined && !series[t].visible)) continue;
						_this.GRAPH_WIDTH = _this.GRAPH_WIDTH - (styles[KEY])[t].ylabelgap - (styles[KEY])[t].ylabelpaddingright - (styles[KEY])[t].ylabelpaddingleft;
						yaxisid = series[t].yaxisid;
					}
				}
			}
			CHART_TOP = _param.option.top;
			var seriesForm = 0, xaxisValue = "date";
			for(seriesForm in series){
				if(seriesForm != "type"){
					xaxisValue = series[seriesForm].xaxis;
					seriesType = series[seriesForm].series;
					break;
				}
			}
			max = _param.option.max, min = _param.option.min, base = _param.option.base;
			/* X, Y Axis Value */
			var xAxis = [], yAxis = [];
			if(!options.usemultiyaxis){
				if(!options.usefixmaxmin){ // 최소,최대값 자동여백 설정
					yAxis = setYAxis(_param.data), xAxis = setXAxis(_param.data, xaxisValue);
				} else {
					yAxis = setFixYAxis(_param.data), xAxis = setXAxis(_param.data, xaxisValue);
				}
			} else {
				yAxis = setMultiYAxis(_param.data), xAxis = setXAxis(_param.data, xaxisValue);
			}
			/* X, Y Axis Draw */
			_this.drawAxis = new DrawAxis(backctx, options, styles, _param, CHART_WIDTH, CHART_HEIGHT, _this.GRAPH_WIDTH, _this.GRAPH_HEIGHT, seriesType);
			
			if(!options.usemultiyaxis){
				_this.drawAxis.drawYAxis(yAxis);
				if(styles[KEY].usexlabelimage){
					var loader = function (items, thingToDo, allDone) {
					    if (!items) {
					        return;
					    }
					    if ("undefined" === items.length) {
					        items = [items];
					    }
					    var count = imgFiles.length;
					    var thingToDoCompleted = function (items, idx) {
					        count--;
					        imgFiles[idx] = items;
					        if (0 == count) {
					            allDone(imgFiles);
					        }
					    };
					    
					    for (var i = 0; i < items.length; i++) {
					        thingToDo(items, i, thingToDoCompleted);
					    }
					};
					
					var loadImage = function (items, idx, onComplete) {
						var img = new Image();
						var onLoad = function (e) {
					    	$(this).unbind("load");
					        onComplete(img, idx);
					    };
					    $(img).bind("load", onLoad);
					    img.src = items[idx];
					};					
					
					var thisStyles = styles[KEY];
					var imgUrl = thisStyles.xlabelimages.url, imgFormat = thisStyles.xlabelimages.format;
					var imgFiles = thisStyles.xlabelimages.filename.replaceAll(" ", "").split(',');
					
					for(var i = imgFiles.length; i--;){
						imgFiles[i] = imgUrl + imgFiles[i] + "." + imgFormat;
					}
					
					loader(imgFiles, loadImage, function (items) { 
						// X축 라벨에 사용될 이미지 로딩 완료되면 호출
						_this.drawAxis.drawXAxis(xAxis, xaxisValue, items);
					});
				} else {
					_this.drawAxis.drawXAxis(xAxis, xaxisValue);
				}
			} else {
				_this.drawAxis.drawMultiYAxis(yAxis);
				_this.drawAxis.drawMultiXAxis(xAxis, xaxisValue);
			}
			var seriesColumnCount = 0, seriesColumnIndex = 0, seriesColumnId = "";
			if(options.type == "clustered" || options.type == undefined) {
				for(seriesForm in series){
					if(seriesColumnId == "") seriesColumnId = series[seriesForm];
					if((series[seriesForm].series == "column" || series[seriesForm].series == "bar") && series[seriesForm].visible != false) {
						if(series[seriesForm].form == "stacked" && seriesColumnId == series[seriesForm].yaxisid){
							
						} else {
							seriesColumnCount ++;
							seriesColumnId = series[seriesForm].yaxisid;
						}
					}
				}
			}
			var drawSeries = null;
			seriesColumnId = "";
			for(seriesForm in series){
				var thisSeries = series[seriesForm];
				if(thisSeries.visible != false){
					switch(thisSeries.series){
					case "line":
						drawSeries = new DrawLine(graphctx, etcctx, options, styles, _param, (options.usemultiyaxis) ? yAxis[thisSeries.yaxisid] : yAxis,
								{"CHART_WIDTH": CHART_WIDTH, "CHART_HEIGHT": CHART_HEIGHT, "CHART_TOP": CHART_TOP,
								 "GRAPH_WIDTH": _this.GRAPH_WIDTH, "GRAPH_HEIGHT": _this.GRAPH_HEIGHT, 
								 "MINIMAGE": (thisSeries.stockmain) ? _param.minimage: null, "MAXIMAGE": (thisSeries.stockmain) ?_param.maximage : null });
						drawSeries.drawSeries(seriesForm);
						break;
					case "candle":
						drawSeries = new DrawCandle(graphctx, etcctx, options, styles, _param, (options.usemultiyaxis) ? yAxis[thisSeries.yaxisid] : yAxis,
								{"CHART_WIDTH": CHART_WIDTH, "CHART_HEIGHT": CHART_HEIGHT, "CHART_TOP": CHART_TOP,
								 "GRAPH_WIDTH": _this.GRAPH_WIDTH, "GRAPH_HEIGHT": _this.GRAPH_HEIGHT, 
								 "MINIMAGE": (thisSeries.stockmain) ? _param.minimage: null, "MAXIMAGE": (thisSeries.stockmain) ?_param.maximage : null });
						drawSeries.drawSeries(seriesForm);
						break;
					case "hloc":
						drawSeries = new DrawHloc(graphctx, etcctx, options, styles, _param, (options.usemultiyaxis) ? yAxis[thisSeries.yaxisid] : yAxis,
								{"CHART_WIDTH": CHART_WIDTH, "CHART_HEIGHT": CHART_HEIGHT, "CHART_TOP": CHART_TOP,
								 "GRAPH_WIDTH": _this.GRAPH_WIDTH, "GRAPH_HEIGHT": _this.GRAPH_HEIGHT, 
								 "MINIMAGE": (thisSeries.stockmain) ? _param.minimage: null, "MAXIMAGE": (thisSeries.stockmain) ?_param.maximage : null });
						drawSeries.drawSeries(seriesForm);
						break;
					case "column":
						if(thisSeries.form != "stacked" || (thisSeries.form == "stacked" && seriesColumnIndex <= 0) || seriesColumnId != thisSeries.yaxisid){
							if(thisSeries.form == "stacked") ++seriesColumnIndex;
							drawSeries = new DrawColumn(graphctx, options, styles, _param, (options.usemultiyaxis) ? yAxis[thisSeries.yaxisid] : yAxis,
									{"CHART_WIDTH": CHART_WIDTH, "CHART_HEIGHT": CHART_HEIGHT, "CHART_TOP": CHART_TOP,
									 "GRAPH_WIDTH": _this.GRAPH_WIDTH, "GRAPH_HEIGHT": _this.GRAPH_HEIGHT, "FIRSTDATA": _param.firstdata},
									 seriesColumnCount, seriesColumnIndex);
							if(thisSeries.form == "stacked") --seriesColumnIndex;
							seriesColumnId = thisSeries.yaxisid;
						} else {
							drawSeries = new DrawColumn(graphctx, options, styles, _param, (options.usemultiyaxis) ? yAxis[thisSeries.yaxisid] : yAxis,
									{"CHART_WIDTH": CHART_WIDTH, "CHART_HEIGHT": CHART_HEIGHT, "CHART_TOP": CHART_TOP,
									 "GRAPH_WIDTH": _this.GRAPH_WIDTH, "GRAPH_HEIGHT": _this.GRAPH_HEIGHT, "PREV_DATA": _this.drawSerieses[_this.drawSerieses.length - 1].seriesData},
									 seriesColumnCount, seriesColumnIndex);
							seriesColumnId = thisSeries.yaxisid;
							--seriesColumnIndex ;
						}
						drawSeries.drawSeries(seriesForm);
						++seriesColumnIndex ;
						break;
					case "bar":
						if(thisSeries.form != "stacked" || (thisSeries.form == "stacked" && seriesColumnIndex <= 0) || seriesColumnId != thisSeries.yaxisid){
							if(thisSeries.form == "stacked") ++seriesColumnIndex;
							drawSeries = new DrawBar(graphctx, options, styles, _param, (options.usemultiyaxis) ? yAxis[thisSeries.yaxisid] : yAxis,
									{"CHART_WIDTH": CHART_WIDTH, "CHART_HEIGHT": CHART_HEIGHT, "CHART_TOP": CHART_TOP,
									 "GRAPH_WIDTH": _this.GRAPH_WIDTH, "GRAPH_HEIGHT": _this.GRAPH_HEIGHT},
									 seriesColumnCount, seriesColumnIndex);
							if(thisSeries.form == "stacked") --seriesColumnIndex;
							seriesColumnId = thisSeries.yaxisid;
						} else {
							drawSeries = new DrawBar(graphctx, options, styles, _param, (options.usemultiyaxis) ? yAxis[thisSeries.yaxisid] : yAxis,
									{"CHART_WIDTH": CHART_WIDTH, "CHART_HEIGHT": CHART_HEIGHT, "CHART_TOP": CHART_TOP,
									 "GRAPH_WIDTH": _this.GRAPH_WIDTH, "GRAPH_HEIGHT": _this.GRAPH_HEIGHT, "PREV_DATA": _this.drawSerieses[_this.drawSerieses.length - 1].seriesData},
									 seriesColumnCount, seriesColumnIndex);
							seriesColumnId = thisSeries.yaxisid;
							--seriesColumnIndex ;
						}
						drawSeries.drawSeries(seriesForm);
						++seriesColumnIndex ;
						break;
					case "area":
						drawSeries = new DrawArea(graphctx, options, styles, _param, (options.usemultiyaxis) ? yAxis[thisSeries.yaxisid] : yAxis,
								{"CHART_WIDTH": CHART_WIDTH, "CHART_HEIGHT": CHART_HEIGHT, "CHART_TOP": CHART_TOP,
								 "GRAPH_WIDTH": _this.GRAPH_WIDTH, "GRAPH_HEIGHT": _this.GRAPH_HEIGHT});
						drawSeries.drawSeries(seriesForm);
						break;
					case "plot":
						drawSeries = new DrawPlot(graphctx, options, styles, _param, (options.usemultiyaxis) ? yAxis[thisSeries.yaxisid] : yAxis,
								{"CHART_WIDTH": CHART_WIDTH, "CHART_HEIGHT": CHART_HEIGHT, "CHART_TOP": CHART_TOP,
								 "GRAPH_WIDTH": _this.GRAPH_WIDTH, "GRAPH_HEIGHT": _this.GRAPH_HEIGHT});
						drawSeries.drawSeries(seriesForm);
						break;
					}
					if(drawSeries != null) _this.drawSerieses.push(drawSeries);
					drawSeries = null;
				}
			}
		};
	
		/*
		 * Y-Axis 값 구하기
		 */
		var computedMaximum = 0, computedMinimum = 0, computedInterval = 0;
		var setYAxis = function ( _data ) 
		{
			adjustMinMax(max, min, styles[KEY].baseatzero);

			var mmHValue = 0, useAccess = false;
			for(var j in series){
				if(j != "type"){
					if((styles[KEY])[j].useaccessibility != undefined && (styles[KEY])[j].useaccessibility) {
						useAccess = true;
						break;
					}
				}
			}
			var yAxis = [];
			if(useAccess){
				mmHValue = Math.round((70 / (_this.GRAPH_HEIGHT)) * (max - min));
				var str = mmHValue.toString();
				var first = str.substring(0, 1), strleng = str.length - 1;
				var k = 0;
				while(k < strleng){
					first += "0";
					k++;
				}
				mmHValue = Number(first);
			}
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
		var adjustMinMax = function(_maxValue, _minValue, _baseatzero){
			if(_maxValue == 0 && _minValue == 0){ _maxValue = 100; }
			var powerOfTen = Math.floor(Math.log(Math.abs(_maxValue - _minValue)) / Math.LN10);
			var y_userInterval = Math.pow(10, powerOfTen);
			if(_maxValue == _minValue){
				powerOfTen = Math.floor(Math.log(_maxValue) / Math.LN10);
				y_userInterval = Math.pow(10, powerOfTen);
				_maxValue = _maxValue + y_userInterval, _minValue = _minValue - y_userInterval;
			}
			var interval = Math.abs(_maxValue - _minValue) / y_userInterval;
			if(interval < 4) {
				powerOfTen--;
				y_userInterval = y_userInterval * 2 / 5;
			}
			var y_topBound = 100, maxTemp = Math.round(_maxValue / y_userInterval) * y_userInterval;
			if(maxTemp <= _maxValue)
				y_topBound = _maxValue + y_userInterval / 2;
			else 
				y_topBound = (Math.floor(_maxValue / y_userInterval) + 1) * y_userInterval;
				
//			var y_topBound = Math.round(_maxValue / y_userInterval) * y_userInterval < _maxValue ? _maxValue + y_userInterval / 2 : (Math.floor(_maxValue / y_userInterval) + 1) * y_userInterval;
			
			var y_lowerBound;
			if(_minValue < 0 || _baseatzero == false){
				y_lowerBound = Math.floor(_minValue / y_userInterval) * y_userInterval;
				if(_maxValue < 0 && _baseatzero) y_topBound = 0;
			} else {
				y_lowerBound = 0;
			}
			if(y_topBound == _maxValue && y_topBound < 0 && y_lowerBound >= 0) {
				y_topBound = 100, y_userInterval = 20;
			}
			computedInterval = y_userInterval;
			computedMinimum = y_lowerBound, computedMaximum = y_topBound;
		};
		var setMultiYAxis = function (_data){
			var yAxisObj = {}, firstYAxisCount = 0, firstYAxisId = "";
			var smax = 0, smin = 99999999999999999, smaxArr = [], sminArr = [];
			for(var t in series){
				if(t == 'type') continue;
				var axis = series[t].yaxis;
				var tmax = -9999999999999999, tmin = 9999999999999999;
				var yaxisid = series[t].yaxisid;
				for(var a in series){
					if(a == 'type') continue;
					if(series[a].yaxisid == yaxisid){
						if(series[a].form != "stacked"){
							for(var k = _data.length; k --;){
								if(_data[k].xaxis == " " || _data[k].xaxis == "" || _data[k].yaxis == undefined || _data[k].yaxis == "") continue;
								tmax = Math.max(tmax, (_data[k])[series[a].yaxis]);
								tmin = Math.min(tmin, (_data[k])[series[a].yaxis]);
							}
						} else {
							var loop = true;
							var lastSeries = i;
							for(var j = _data.length; j--;){
								var d = _data[j];
								smax = 0;
								for(var k in series) {
									if(k == 'type' || !series[k].visible) continue;
									if(yaxisid == series[k].yaxisid){
										smax = smax + Number(d[series[k].yaxis]);
										lastSeries = k;
									}
								}
								smaxArr.push(smax);
								if(j == 0) {
									loop = false;
								}
							}
							tmax = Math.max.apply(tmax, smaxArr), tmin = Math.min.apply(tmin, smaxArr);
							if(!loop) {
								t = lastSeries;
							}
						}
						t = a;
					}
				}

				if(!firstYAxisCount || firstYAxisId == yaxisid){
					adjustMinMax(tmax, tmin, (styles[KEY])[t].baseatzero);
					var yAxis = [];
					var labelBase = tmin - (Math.floor((tmin - computedMinimum) / computedInterval) * computedInterval);
					if((styles[KEY])[t].baseatzero) labelBase = 0;
					var labelTop = computedMaximum;
					
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
					if(yAxis[0] >= labelBase && !(styles[KEY])[t].baseatzero){
						while(yAxis[0] >= labelBase){
							yAxis.unshift(yAxis[0] - computedInterval);
						}
					}
				} else {
					adjustMinMax(tmax, tmin, (styles[KEY])[t].baseatzero);
					yAxis = [];
					var labelBase = tmin - (Math.floor((tmin - computedMinimum) / computedInterval) * computedInterval);
					var decimal = Math.abs(computedInterval) - Math.floor(Math.abs(computedInterval));
					var precision = decimal == 0 ? 1 : -Math.floor(Math.log(decimal) / Math.LN10);
					
					decimal = Math.abs(computedMinimum) - Math.floor(Math.abs(computedMinimum));
					precision = Math.max(precision, decimal == 0 ? 1: -Math.floor(Math.log(decimal) / Math.LN10));
					if(tmax != tmin && tmax != 0 ) computedInterval = (computedMaximum - computedMinimum)/(firstYAxisCount - 1);
					else computedInterval =  (computedMaximum - computedMinimum)/(firstYAxisCount - 1);
					
					if(String(computedInterval).indexOf('.') > -1 && computedInterval < 10){
						computedInterval = Number((Math.round(computedInterval * 100) / 100).toFixed(2));
					}
					
					var i, roundedValue;
					for(i = 0; i < firstYAxisCount; i ++) {
						roundedValue = (computedMinimum + (computedInterval * i));// * roundBase) / roundBase;
						if(/*roundedValue < 2 && */String(roundedValue).indexOf('.') > -1){
							if(computedInterval > 10)
								roundedValue = Math.round(roundedValue);
							else
								roundedValue = Number((Math.round(roundedValue * 100) / 100).toFixed(2));
						}
						yAxis.push(roundedValue);
					}
					
				}
				yAxisObj[yaxisid] = yAxis;
				if(!firstYAxisCount) {
					firstYAxisCount = yAxis.length, firstYAxisId = yaxisid;
				}
			}
			return yAxisObj;
		};
		var setFixYAxis = function (_data) {
			var step = styles[KEY].yaxisstep ? styles[KEY].yaxisstep : 5;
			var interval = (max - min) / step;
			var yAxis = [];
			yAxis.push(min);
			for(var i = 1; i <= step; i ++){
				yAxis.push(min + (interval*(i)));
			}
			return yAxis;
		};
		/*
		 * X-Axis 값 구하기
		 */
		var setXAxis = function ( _data, _xaxisValue ) 
		{	
			backctx.font = getStyles(KEY, "ylabelfontstyle");
			
			var count = _data.length, i = 0, xLabelSkip = 0;
			var xGap = (seriesType == "bar") ? (_this.GRAPH_HEIGHT - getStyles(KEY, "graphpaddingtop")  - getStyles(KEY, "graphpaddingbottom")) / count
											 : (_this.GRAPH_WIDTH  - getStyles(KEY, "graphpaddingleft") - getStyles(KEY, "graphpaddingright"))  / count;
			var itemW = xGap * count;
			var w = backctx.measureText((_data[0])[_xaxisValue]).width;
			if(w <= 0) w = String((_data[0])[_xaxisValue]).length * (backctx.font.split('px')[0] /2);
			var dataValueWidth = w + 20;
			
			for(i = 0; i < itemW; i += xGap) {
				if(i < dataValueWidth){ xLabelSkip += 1; } 
				else { break; }
			}
			return xLabelSkip;
		};
		var setMultiXAxis = function ( _data, _xaxisValue ) 
		{	
			backctx.font = getStyles(KEY, "ylabelfontstyle");
			
			var count = _data.length, i = 0, xLabelSkip = 0;
			var xGap = (seriesType == "bar") ? (_this.GRAPH_HEIGHT - getStyles(KEY, "graphpaddingtop") - getStyles(KEY, "graphpaddingbottom")) / count
										 	 : (_this.GRAPH_WIDTH - getStyles(KEY, "graphpaddingleft") - getStyles(KEY, "graphpaddingright")) / count;
			var itemW = xGap * count;
			var dataValueWidth = backctx.measureText((_data[0])[_xaxisValue]).width + 20;
			for(i = 0; i < itemW; i += xGap) {
				if(i < dataValueWidth){	xLabelSkip += 1; }
				else { break; }
			}
			return xLabelSkip;
		};
		this.HitItem = null;
		this.onMouseMove = function(_event, _selectCtx, _top, _height, _item){
			var hit = false;
			
			for(var i = _this.drawSerieses.length; i--;){
				var over = _this.drawSerieses[i];
				for(var s in over){
					try{
						if(over[s].series != null && over[s].series != undefined){
							var overSeries = over[s].series;
							for(var j = over.seriesData.length; j--;){
								var dObj = over.seriesData[j];
								var overX = dObj.x, overW = dObj.width, overY = dObj.y, overH = dObj.height;
								if(overSeries === 'candle' || overSeries === 'column' || overSeries === 'area'){
									if(overH  < 0){	overY = overY - Math.abs(overH), overH = Math.abs(overH); }
									if(over[s].minaxis != undefined) {
//										overH = overY - dObj.height;
										overH = overY - dObj.minY;
									}
								} else if(overSeries === 'hloc'){
									overY = dObj._high, overH = dObj._low - dObj._high;
									if(overH  < 0){	overY = overY - Math.abs(overH), overH = Math.abs(overH); }
								} else if(overSeries === "bar" || overSeries === "plot") {
									
								} else {
									overX = overX - (overW / 2), overY = overY - (overH / 2);
								}
								var _y = _event._y;
								if(_event._x > overX && _event._x < overX + overW && _y >= overY && _y <= overY + overH){
									_item.data = {};
									_item.data.item = dObj;
									_item.index = j;
									_item.series = over[s];

									overItem = over.onMouseMove(_item, _selectCtx, dObj);
									_this.HitItem = {};
									_this.HitItem = overItem;
									_this.HitItem.series = over[s];
									if(options.usestock){ // 증권차트일 경우
										overStockItemTip(_item, _event, overItem, overSeries);
									} else{	}
									hit = true;
									break;
								} else { }
							}
						}
					}catch(e){}
					if(hit) break;
				}
				if(hit) break;
			}
			if(hit === false && _this.HitItem != {} || _this.HitItem == {}){
				_selectCtx.clearRect(0, 0, _selectCtx.canvas.width, _selectCtx.canvas.height);
				_item.container.hide();
				_this.HitItem = null;
			}
		};
		
		var overStockItemTip = function(_item, _event, _overItem, _overSeries) {
			_item.container.show();
			var dateStr = eval(options.xaxisformat)(_overItem.item.xaxis);
			if(_overSeries === 'candle'){ _item.container.html(dateStr+"<br/>"+_overItem.text+" : "+String(_overItem.item.close).format()); } 
			else { 
				if(String(_overItem.item.yaxis).indexOf('.') > 0)
					_item.container.html(dateStr+"<br/>"+_overItem.text+" : "+String(_overItem.item.yaxis).split('.')[0].format());
				else 
					_item.container.html(dateStr+"<br/>"+_overItem.text+" : "+String(_overItem.item.yaxis).format());
			}
			
			var tip_w = _item.container.width(), tip_h = _item.container.outerHeight();//(_item.series.form == undefined || (_item.series.form != "updown" && _overItem.item.comp != "down")) ? _item.container.outerHeight() + 5 : -5;
	      	var tip_x = (_overItem.left - tip_w / 2), tip_y = _overItem.top - tip_h - 10;//_overItem.item.comp == "up" ? (_overItem.top + _overItem.item.height - tip_h - 5) : (_overItem.item.y - tip_h - 5);
	      	if(_item.series.form == "updown" || _item.series.form == "updown-n"){
		      	if(_overItem.item.comp === "down") {
		      		tip_y = tip_y + tip_h + 20;
		      	}
	      	}
	      	if(tip_x < Number(getStyles(KEY, "graphpaddingleft"))) tip_x = Number(getStyles(KEY, "graphpaddingleft"));
	      	else if(tip_x + tip_w > CHART_WIDTH) tip_x = CHART_WIDTH - tip_w;
	      	if(tip_y < 0) tip_y = 0;
	      	_item.container[0].style.left = Math.round(tip_x) + 'px', _item.container[0].style.top  = Math.round(tip_y) + 'px';
	      	_item.container[0].style.width = tip_w;
		};
		
		/* 보조지표 생성시 버튼 추가 */
		this.createSubChartButton = function(_series, _top, _height){
			var $button = $("<button><span>X</span></button>");
			$button.css({width: 20, height: 20, position: "absolute", left: _this.GRAPH_WIDTH - 5, top: _top + 5, padding: 0, margin: 0});
			$button.attr({'id':CHART_ID+'-button-'+_series.key, 'value': 'X'});
			
			return $button;
		};
		
		this.allMainClear = function (_mainChartHeight){
			backctx.clearRect(0, 0, CHART_WIDTH, _mainChartHeight);
			graphctx.clearRect(0, 0, CHART_WIDTH, _mainChartHeight);
		};
		
		var getStyles = function (_KEY, _name) {
			_name = _name.toLowerCase();
			var s = styles;
			if(_KEY !== "A") { s = s[_KEY]; } 
			return s[_name];
		};
		return _this;
	};
	/*
	 * X-Y Axis Draw
	 */
	DrawAxis = function(_backctx, _options, _styles, _param, _CHART_WIDTH, _CHART_HEIGHT, _GRAPH_WIDTH, _GRAPH_HEIGHT, seriesType) {
		var _this = this;
		
		var context = _backctx;
		var options = _options, styles = _styles, series = _param.option.series;
		var CHART_WIDTH = _CHART_WIDTH, CHART_HEIGHT = _CHART_HEIGHT, GRAPH_WIDTH = _GRAPH_WIDTH, GRAPH_HEIGHT = _GRAPH_HEIGHT;
		var CHART_TOP = _param.option.top;
		
		var KEY = _param.option.key, DATA = _param.data;
		var thisStyle = styles[KEY];
		this.startX = 0;
		/*
		 * Y-AXIS DRAW ||
		 */
		this.drawYAxis = function (_yAxis) {
			var yLabelGap 	= getStyles(KEY, "ylabelgap");
			var yAxisAlign 	= getStyles(KEY, "yaxisalign"), yLabelAlign = getStyles(KEY, "ylabelalign");
			var yLabelPaddingRight = getStyles(KEY, "ylabelpaddingright"), yLabelPaddingLeft = getStyles(KEY, "ylabelpaddingleft");
			
			var startX = getStyles(KEY, "canvaspaddingleft") + 0.5;
			if(yAxisAlign === "left"){ startX += yLabelGap + yLabelPaddingRight + yLabelPaddingLeft; }
			_this.startX = startX;
			
			var startY = CHART_TOP + getStyles(KEY, "canvaspaddingtop") + getStyles(KEY, "mouseinfoheight") + 0.5; // GRAPH 영역 Y축
			var graphHeight = Math.floor(startY + GRAPH_HEIGHT) + 0.5; // GRAPH 영역 HEIGHT
			
			var graphPaddTop =  getStyles(KEY, "graphpaddingtop"), graphPaddBot =  getStyles(KEY, "graphpaddingbottom");
			var graphRealHeight = GRAPH_HEIGHT - graphPaddTop - graphPaddBot;
			
			
			var item = context;
			item.beginPath();
			// 그래프 영역 배경색 그리기 (딱 한번만)
			item.fillStyle = getStyles(KEY, 'graphbackgroundcolor');
			item.fillRect(startX, startY, GRAPH_WIDTH, GRAPH_HEIGHT);
			// GRAPH CONTAINER TOP LINE
			var graphrightline_x = GRAPH_WIDTH + startX;
			if(getStyles(KEY, 'usegraphstroketop')) {
				item.beginPath();
				item.lineWidth 		= getStyles(KEY, "graphstroketopwidth");
				item.strokeStyle 	= getStyles(KEY, "graphstroketopcolor");
				item.moveTo(startX, startY - 1);
				item.lineTo(graphrightline_x, startY - 1);
				item.stroke();
				item.closePath();
				if(getStyles(KEY, 'usegraphunderstroketop')) {
					item.beginPath();
					item.lineWidth 		= getStyles(KEY, "graphunderstroketopwidth");
					item.strokeStyle 	= getStyles(KEY, "graphunderstroketopcolor");
					item.moveTo(startX, startY);
					item.lineTo(graphrightline_x, startY);
					item.stroke();
					item.closePath();
				}
			}
			// GRAPH CONTAINER BOTTOM LINE
			if(getStyles(KEY, 'usegraphstrokebottom')) {
				item.beginPath();
				item.lineWidth 		= getStyles(KEY, "graphstrokebottomwidth");
				item.strokeStyle 	= getStyles(KEY, "graphstrokebottomcolor");
				item.moveTo(startX, graphHeight);
				item.lineTo(graphrightline_x, graphHeight);
				item.stroke();
				item.closePath();
				if(getStyles(KEY, 'usegraphunderstrokebottom')) {
					item.beginPath();
					item.lineWidth 		= getStyles(KEY, "graphunderstrokebottomwidth");
					item.strokeStyle 	= getStyles(KEY, "graphunderstrokebottomcolor");
					item.moveTo(startX, graphHeight + 1);
					item.lineTo(graphrightline_x, graphHeight + 1);
					item.stroke();
					item.closePath();
				}
			}
			// GRID LINE DRAW
			item.beginPath();
			item.textAlign 		= (seriesType != undefined && seriesType ==="bar")? "center" : yLabelAlign;
			item.textBaseline	= (seriesType != undefined && seriesType ==="bar")? "top" : "middle";
			var prevGap = 0, yLabel_x = 0, yLabelDup = 0;
			if(yAxisAlign == "left") {
				yLabel_x = (yLabelAlign == "left") ? startX - yLabelGap - yLabelPaddingLeft - yLabelPaddingRight : startX - yLabelPaddingLeft - yLabelPaddingRight;
			} else {
				yLabel_x = (yLabelAlign == "left") ? GRAPH_WIDTH + startX + yLabelPaddingLeft : GRAPH_WIDTH + startX + yLabelGap + yLabelPaddingLeft;
			}
			var yFontSize = Number(item.font.toString().substring(0,2)) + 1; // Y축에 값이 겹쳐져서 안나오는 문제 해결하기 위한 변수(글자 사이즈 +1)
			if(seriesType != undefined && seriesType === "bar"){
				item.font			= getStyles(KEY, "xlabelfontstyle");
				item.lineWidth 		= getStyles(KEY, "verticalgridstrokewidth");
				item.strokeStyle 	= getStyles(KEY, "verticalgridstrokecolor");
				var count = _yAxis.length;
				var useXAxisFormat = getUseOptions("xaxisformat"), useXlabel 	= getStyles(KEY, "usexlabel");
				var xGap = (GRAPH_WIDTH - getStyles(KEY, "graphpaddingright")) / (count - 1), xLabelSpace = getStyles(KEY, "xlabelspace");
				var xLabelPaddingTop = Number(getStyles(KEY, "xlabelpaddingtop"));
				var	firstVerticalStroke_x = startX;
				var skip = 0, xDate = "";
				for(var i = 0; i < count; i++){
					xDate = _yAxis[i].toString();
					var xDataWidth = item.measureText(xDate).width;// (useXAxisFormat) ? item.measureText(eval(options.xaxisformat)(_yAxis[i].toString())).width : item.measureText(_yAxis[i]).width;
					var xDataHalfWidth = xDataWidth / 2;
					var gap = Math.floor((xGap * i) + firstVerticalStroke_x - xDataHalfWidth) - 0.5;
					
					if(useXAxisFormat) { xDate = eval(options.xaxisformat)(xDate); }
					
					if(gap - (xDataWidth / 2) <= firstVerticalStroke_x && i != 0){ continue; }
					if(getStyles(KEY, "useverticalgridstroke") == true) {
						if(skip < gap && GRAPH_WIDTH + xDataWidth + firstVerticalStroke_x + xLabelSpace > (gap + (xDataWidth / 2))){
							item.moveTo(gap + xDataHalfWidth, startY);
							item.lineTo(gap + xDataHalfWidth, startY + GRAPH_HEIGHT);
						}
					}
					if(skip < gap && GRAPH_WIDTH + xDataWidth + firstVerticalStroke_x + xLabelSpace > (gap + xDataWidth / 2)) {
						item.fillStyle 		= getStyles(KEY, "xlabelfontcolor");
						if(useXlabel) item.fillText(xDate, gap + xDataHalfWidth, startY + GRAPH_HEIGHT + xLabelPaddingTop);
						skip = gap + xDataWidth + xLabelSpace;
					}
				}
				item.fill();
				item.stroke();
				item.closePath();
			}else{
				item.font			= getStyles(KEY, "ylabelfontstyle");
				item.lineWidth 		= getStyles(KEY, "horizontalgridstrokewidth");
				item.strokeStyle 	= getStyles(KEY, "horizontalgridstrokecolor");
				var yValue = null;
				var useYAxisFormat = getUseOptions("yaxisformat");
				var step = 1, alter = 0, alterStep = 0;
				var underGap = [];
				if(_yAxis.length >= 10 && styles[KEY].yaxisstep == undefined) step = 2;
				for(var i = 0, len = _yAxis.length; i < len; i = i + step){
					var gap = drawYGridLineGap(graphRealHeight, _yAxis, i);
					gap = Math.round((graphRealHeight - gap) + (startY + graphPaddTop)) - 0.5;
					
					if(i == 0){ prevGap = gap + yFontSize; }
					if(i == 0 && !getStyles(KEY, "useyaxisminvalue")){ continue; }
					else if(i == len - 1 && !getStyles(KEY, "useyaxismaxvalue")){ continue; }
					if(prevGap < gap + yFontSize || gap <= 0){
						alter = alter + 1;
					} else {
						yValue = _yAxis[i];
						if(useYAxisFormat) yValue = eval(options.yaxisformat)(yValue);
						if(getStyles(KEY, "usehorizontalgridstroke") == true) {
							if(getStyles(KEY, "usehorizontalalternate")){
								if((alterStep % 2) == 1){
									var h = drawYGridLineGap(graphRealHeight, _yAxis, (i - alter) - step);
									var ph = drawYGridLineGap(graphRealHeight, _yAxis, i);
									
									h = ph - h;
									item.fillStyle = getStyles(KEY, "horizontalalternatecolor");
									item.fillRect(startX, gap, graphrightline_x - startX, h);
								}
								alterStep = alterStep + 1;
								alterBool = false;
							}
							if((getStyles(KEY, "useyaxisminvalue") && i == 0 && getStyles(KEY, "graphpaddingbottom") <= 0) || 
							   (getStyles(KEY, "useyaxismaxvalue") && i == len - 1 && getStyles(KEY, "graphpaddingtop") <= 0)){
								//alter = alter + 1;
							} else {
								if(getStyles(KEY, "usehorizontalgriddashed")){
									item.dashedLineFromTo(startX, gap, graphrightline_x, gap, getStyles(KEY, "horizontalgriddashedstyle"));
								} else {
									item.moveTo(startX, gap);
									item.lineTo(graphrightline_x, gap);		
									underGap.push(gap);
								}
							}
						}
						if(getStyles(KEY, "useylabel")){
							item.fillStyle 		= getStyles(KEY, "ylabelfontcolor");
							item.fillText(yValue, yLabel_x, gap, yLabelGap);
							alter = 0;
						}
						prevGap = gap;
					}
				}
				item.fill();
				item.stroke();
				item.closePath();
			}
			
			if(getStyles(KEY, "usehorizontalgridunderstroke")){
				item.beginPath();
				item.lineWidth 		= getStyles(KEY, "horizontalgridunderstrokewidth");
				item.strokeStyle 	= getStyles(KEY, "horizontalgridunderstrokecolor");
				for(var i = 0, len = underGap.length; i < len; i++){
					if(getStyles(KEY, "usehorizontalgridunderdashed")){
						item.dashedLineFromTo(startX, gap, graphrightline_x, gap, getStyles(KEY, "horizontalgridunderdashedstyle"));
					} else {
						item.moveTo(startX, underGap[i] + 1);
						item.lineTo(graphrightline_x, underGap[i] + 1);									
					}
				}
				item.fill();
				item.stroke();
				item.closePath();
			}
		};
		/*
		 * Y-AXIS DRAW ||
		 */
		this.drawMultiYAxis = function (_yAxisobj) {
			
			/* */
			var yLabelGap = 0, yLabelLeftGap = 0, yLabelRightGap = 0;//getStyles(KEY, "ylabelgap");
			var yLabelLeft_paddingleft = 0, yLabelLeft_paddingright = 0, yLabelRight_paddingleft = 0, yLabelRight_paddingright = 0;
			for(var t in series){
				if(t != 'type'){
					yLabelGap = yLabelGap + thisStyle[t].ylabelgap;
					if(thisStyle[t].yaxisalign == "left"){
						yLabelLeftGap = thisStyle[t].ylabelgap;
						yLabelLeft_paddingleft = thisStyle[t].ylabelpaddingleft;
						yLabelLeft_paddingright = thisStyle[t].ylabelpaddingright;
					} else if(thisStyle[t].yaxisalign == "right") {
						yLabelRightGap = thisStyle[t].ylabelgap;
						yLabelRight_paddingleft = thisStyle[t].ylabelpaddingleft;
						yLabelRight_paddingright = thisStyle[t].ylabelpaddingright;
					}
				}
			}
			var startY = CHART_TOP + getStyles(KEY, "canvaspaddingtop") + getStyles(KEY, "mouseinfoheight");
			var item = context;
			
			// GRID LINE DRAW
			item.beginPath();
			item.textBaseline	= (seriesType != undefined && seriesType === "bar") ? "top" : "middle";
			item.font			= getStyles(KEY, "ylabelfontstyle");
			var fCheck = false;
			var startX = getStyles(KEY, "canvaspaddingleft");
			var graphrightline_x = GRAPH_WIDTH;
			for(var s in _yAxisobj){
				
				var yAxisAlign 	= thisStyle[s].yaxisalign, yLabelAlign = thisStyle[s].ylabelalign;
				item.textAlign 	= yLabelAlign;
				item.fillStyle 	= getStyles(KEY, "ylabelfontcolor");
				
				
				if(!fCheck) {
					startX += yLabelLeftGap + yLabelLeft_paddingleft + yLabelLeft_paddingright;
					_this.startX = startX;
				}
				var prevGap = 0, yLabel_x = 0;
				if(yAxisAlign == "left") {
					yLabel_x = (yLabelAlign == "left") ? startX - yLabelLeftGap - yLabelLeft_paddingleft - yLabelLeft_paddingright 
														: startX - yLabelLeft_paddingright;
				} else {
					yLabel_x = (yLabelAlign == "left") ? GRAPH_WIDTH + startX + yLabelRight_paddingleft : GRAPH_WIDTH + startX + yLabelRightGap + yLabelRight_paddingleft;
				}
				var yFontSize = Number(item.font.toString().substring(0,2)) + 1; // Y축에 값이 겹쳐져서 안나오는 문제 해결하기 위한 변수(글자 사이즈 +1)
				
				var yValue = null;
				var useYAxisFormat = getUseOptions("yaxisformat");
				for(var i = 0, len = _yAxisobj[s].length; i < len; i++){
					var gap = drawYGridLineGap(GRAPH_HEIGHT, _yAxisobj[s], i);
					gap = Math.floor((GRAPH_HEIGHT - gap) + startY) - 0.5;
					
					if(i == 0){ prevGap = gap + yFontSize;}
					if(i == 0 && !getStyles(KEY, "useyaxisminvalue")){ continue; }
					if(i == len - 1 && !getStyles(KEY, "useyaxismaxvalue")){ continue; }
					if(prevGap < gap + yFontSize || gap <= 0){
					} else {
						yValue = (_yAxisobj[s])[i];
						if(useYAxisFormat) yValue = eval(options.yaxisformat)(yValue);
						if(!fCheck) {
							item.fillStyle = getStyles(KEY, 'graphbackgroundcolor');
							item.fillRect(startX, startY, GRAPH_WIDTH, GRAPH_HEIGHT);
							item.fillStyle 		= getStyles(KEY, "ylabelfontcolor");
							if(getStyles(KEY, "usehorizontalgridstroke")){
								if((getStyles(KEY, "useyaxisminvalue") && i == 0) || (getStyles(KEY, "useyaxismaxvalue") && i == len - 1)){
									
								} else {
									item.lineWidth 		= getStyles(KEY, "horizontalgridstrokewidth");
									item.strokeStyle 	= getStyles(KEY, "horizontalgridstrokecolor");
									
									item.moveTo(startX, gap);
									item.lineTo(graphrightline_x + startX, gap);
								}
							}
						}
						item.fillText(yValue, yLabel_x, gap, yLabelGap);
						prevGap = gap;
					}
				}
				item.fill();
				item.stroke();
				item.closePath();
				
				
				fCheck = true;
			}
			item.beginPath();
			// GRAPH CONTAINER TOP LINE
			
			if(getStyles(KEY, 'usegraphstroketop')) {
				item.lineWidth 		= getStyles(KEY, "graphstroketopwidth");
				item.strokeStyle 	= getStyles(KEY, "graphstroketopcolor");
				item.moveTo(startX, startY + 0.5);
				item.lineTo(graphrightline_x + startX, startY + 0.5);
				item.stroke();
			}
			// GRAPH CONTAINER BOTTOM LINE
			if(getStyles(KEY, 'usegraphstrokebottom')) {
				item.lineWidth 		= getStyles(KEY, "graphstrokebottomwidth");
				item.strokeStyle 	= getStyles(KEY, "graphstrokebottomcolor");
				item.moveTo(startX, startY + GRAPH_HEIGHT + 0.5);
				item.lineTo(graphrightline_x + startX, startY + GRAPH_HEIGHT + 0.5);
				item.stroke();
			}
			item.closePath();
		};
		var drawYGridLineGap = function (_height, _yAxis, _count) {
			return (_height * ((_yAxis[_count] - _yAxis[0]) / (_yAxis[_yAxis.length - 1] - _yAxis[0])));
		};
		/*
		 * X-AXIS DRAW --
		 */
		this.drawXAxis = function (_xAxis, _xaxisValue, _xlabelImages) {
			var count = DATA.length;
			var useXlabel 	= getStyles(KEY, "usexlabel");
			var yLabelGap 	= getStyles(KEY, "ylabelgap"), yLabelAlign = getStyles(KEY, "ylabelalign"), xLabelSpace = getStyles(KEY, "xlabelspace");
			var yAxisAlign 	= getStyles(KEY, "yaxisalign");
			var yLabelPaddingRight = getStyles(KEY, "ylabelpaddingright"), yLabelPaddingLeft = getStyles(KEY, "ylabelpaddingleft");
			var xLabelPaddingTop = Number(getStyles(KEY, "xlabelpaddingtop")), xLabelGap = getStyles(KEY, "xlabelgap");
			
			var startX = getStyles(KEY, "canvaspaddingleft") + 0.5;
			if(yAxisAlign === "left"){
				startX += yLabelGap + yLabelPaddingRight + yLabelPaddingLeft;
			}
			var startY = CHART_TOP + getStyles(KEY, "canvaspaddingtop") + getStyles(KEY, "mouseinfoheight") + 0.5;
			var graphPaddTop = getStyles(KEY, "graphpaddingtop"), graphPaddBot = getStyles(KEY, "graphpaddingbottom");
			
			var firstVerticalStroke_x = 0, firstVerticalStroke_y = 0;
			/* X Data 갯수에 맞춘 각 아이템의 넓이 */
			if(seriesType != undefined && seriesType === "bar"){
				var xGap = (GRAPH_WIDTH - getStyles(KEY, "graphpaddingleft") - getStyles(KEY, "graphpaddingright")) / count, 
					yGap = (GRAPH_HEIGHT - graphPaddTop - graphPaddBot) / count;
				var xGapHalf = xGap / 2, yGapHalf = yGap / 2;
				if(getStyles(KEY, "baseatstart")){
					xGap = GRAPH_WIDTH / (count - 1);
					xGapHalf = xGap / 2;
					firstVerticalStroke_x = startX;
					firstVerticalStroke_y = startY;
				} else {
					firstVerticalStroke_x = startX + getStyles(KEY, "graphpaddingleft") + xGapHalf;
					firstVerticalStroke_y = startY + graphPaddTop;// + yGapHalf;
				}
			} else {
				var xGap = (GRAPH_WIDTH - getStyles(KEY, "graphpaddingleft") - getStyles(KEY, "graphpaddingright")) / count, 
					yGap = (GRAPH_HEIGHT - graphPaddTop - graphPaddBot) / count;
				var xGapHalf = xGap / 2, yGapHalf = yGap / 2;
				if(getStyles(KEY, "baseatstart") && count > 1){
					xGap = GRAPH_WIDTH / (count - 1);
					xGapHalf = xGap / 2;
					firstVerticalStroke_x = startX;
					firstVerticalStroke_y = startY;
				} else {
					firstVerticalStroke_x = startX + getStyles(KEY, "graphpaddingleft") + xGapHalf;
					firstVerticalStroke_y = startY + graphPaddTop + yGapHalf;
				}
			}
			
			var item = context;
			// GRID LINE DRAW
			item.beginPath();
			item.textAlign 		= (seriesType != undefined && seriesType === "bar")? getStyles(KEY, "ylabelalign") : "center";
			item.textBaseline	= (seriesType != undefined && seriesType === "bar")? "middle" : "top";
			item.font			= getStyles(KEY, "xlabelfontstyle");
			item.fillStyle 		= getStyles(KEY, "xlabelfontcolor");
			item.lineWidth 		= getStyles(KEY, "verticalgridstrokewidth");
			item.strokeStyle 	= getStyles(KEY, "verticalgridstrokecolor");
			var useXAxisFormat = getUseOptions("xaxisformat");
			var xDataWidth = (useXAxisFormat) ? item.measureText(eval(options.xaxisformat)(DATA[0][_xaxisValue])).width : item.measureText(DATA[0][_xaxisValue]).width;
			xDataWidth = xDataWidth + xLabelSpace;
//			var xDataHalfWidth = xDataWidth / 2;
			if(seriesType != undefined && seriesType === "bar"){ // Bar Series
				var useYAxisFormat = getUseOptions("yaxisformat");
				var yDataHeight = (useYAxisFormat) ? item.measureText(eval(options.yaxisformat)(DATA[0][_xaxisValue])).height : item.measureText(DATA[0][_xaxisValue]).height;
				if(yAxisAlign == "left") {
					yLabel_x = (yLabelAlign == "left") ? startX - yLabelGap - yLabelPaddingLeft - yLabelPaddingRight : startX - yLabelPaddingLeft - yLabelPaddingRight;
				} else {
					yLabel_x = (yLabelAlign == "left") ? GRAPH_WIDTH + startX + yLabelPaddingLeft : GRAPH_WIDTH + startX + yLabelGap + yLabelPaddingLeft;
				}
				for(var i = count - 1; i >= 0; i--){
					var gap = Math.floor((yGap*i) + firstVerticalStroke_y) +yGapHalf + 0.5;
					yDate = DATA[i][_xaxisValue];
					if(useYAxisFormat) { yDate = eval(options.yaxisformat)(yDate); }
					
					if(gap - (yDataHeight / 2) <= firstVerticalStroke_x && i != 0){ continue; }
					if(getStyles(KEY, "usehorizontalgridstroke") == true) {
						item.moveTo(startX,gap);
						item.lineTo(startX + GRAPH_WIDTH,gap);
					}
					item.fillText(yDate, yLabel_x,gap);
				}
			}else{
				if(!options.usexlabelfirst){ // 기본 폰트 사이즈 간격대로 출력됨
					var skip = 0, imgIndex = 0;
					var fontsize = item.font.split('px')[0];
					for(var i = 0; i < count; i++){
						var gap = Math.floor((xGap * i) + firstVerticalStroke_x) + 0.5;
						xDate = String(DATA[i][_xaxisValue]);
						if(useXAxisFormat) { xDate = eval(options.xaxisformat)(xDate); }
						if(getStyles(KEY, "xlabelvertical")){ // 세로로 길게 써질 경우에 처리
							if(getStyles(KEY, "useverticalgridstroke") == true) {
								item.moveTo(gap, startY);
								item.lineTo(gap, startY + GRAPH_HEIGHT);
							}
							for(var j = 0; j < xDate.length; j++){
								item.fillText(xDate.substr(j, 1), Math.round(gap), Math.round(startY + GRAPH_HEIGHT + xLabelPaddingTop) + fontsize * j);
							}
						} else {
							if(gap - (xDataWidth / 2) <= firstVerticalStroke_x && i != 0){ continue; }
							
							if(skip <= gap && CHART_WIDTH > gap || getStyles(KEY, "usexaxislastvalue") && i == count - 1){
								if(getStyles(KEY, "useverticalgridstroke") == true) {
									item.moveTo(gap, startY);
									item.lineTo(gap, startY + GRAPH_HEIGHT);
								}
								if(getStyles(KEY, "usexlabelimage") == true){
									item.textAlign = "left";
									var xWidth = item.measureText(xDate).width;
							       	var xlabelImage = _xlabelImages[imgIndex];
							      	item.drawImage(xlabelImage, gap - (xlabelImage.width / 2), startY + GRAPH_HEIGHT + 10.5);
							      	++imgIndex;
							       	if(useXlabel) item.fillText(xDate, Math.round(gap - xWidth/2), Math.round(startY + GRAPH_HEIGHT + xLabelPaddingTop));
								} else {
									if(useXlabel) item.fillText(xDate, Math.round(gap), Math.round(startY + GRAPH_HEIGHT + xLabelPaddingTop));
								}
								skip = gap + xDataWidth;
							}
						}
					}
				} else { // 월 혹은 시간 첫번째 데이터 기준으로 출력됨
					var firstData = DATA[0][_xaxisValue];
					var xDate;
					var firstXLabel = null;
					var xDataHalfWidth = xDataWidth/2;
					for(var i = 0; i < count; i++){
						var gap = Math.floor((xGap * i) + firstVerticalStroke_x - xDataHalfWidth) + 0.5;
						xDate = DATA[i][_xaxisValue];
						if(i > 0 && (options.usexlabelfirst == "month" && firstData.substr(0, 6) == xDate.substr(0,6) || options.usexlabelfirst == "time" &&  firstData.substr(firstData.length - 4, 2) == xDate.substr(xDate.length - 4, 2))){
							continue;
						} 
						firstData = xDate;
						if(useXAxisFormat) { xDate = eval(options.xaxisformat)(xDate); }
						if(i == 0){
							/*var gap = Math.floor((xGap * i) + firstVerticalStroke_x - xDataHalfWidth) + 0.5;
							if(useXlabel) item.fillText(xDate, Math.round(gap + xDataHalfWidth), startY + GRAPH_HEIGHT + xLabelPaddingTop);*/
						} else {
							if(getStyles(KEY, "useverticalgridstroke") == true) {
									item.moveTo(gap + xDataHalfWidth, startY);
									item.lineTo(gap + xDataHalfWidth, startY + GRAPH_HEIGHT);
							}
							if(useXlabel) item.fillText(xDate, Math.round(gap + xDataHalfWidth), startY + GRAPH_HEIGHT + xLabelPaddingTop);
							if(firstXLabel == null){
								firstXLabel = {};
								firstXLabel.x = Math.round(gap);
								firstXLabel.y = startY + GRAPH_HEIGHT + xLabelPaddingTop;
							}
						}
					}
					var fgap = Math.floor((xGap * 0) + firstVerticalStroke_x - xDataHalfWidth) + 0.5;
					if(fgap + xDataHalfWidth < firstXLabel.x - xDataHalfWidth) {
						if(useXAxisFormat) { firstData = eval(options.xaxisformat)(DATA[0][_xaxisValue]); }
						if(useXlabel) item.fillText(firstData, Math.round(fgap + xDataHalfWidth), startY + GRAPH_HEIGHT + xLabelPaddingTop);
					}
				}
			}
			item.fill();
			item.stroke();
			item.closePath();
			
			// GRAPH CONTAINER LEFT LINE
			if(getStyles(KEY, 'usegraphstrokeleft')) {
				item.beginPath();
				item.lineWidth 		= getStyles(KEY, "graphstrokeleftwidth");
				item.strokeStyle 	= getStyles(KEY, "graphstrokeleftcolor");
				item.moveTo(startX, startY - 1);
				item.lineTo(startX, startY + GRAPH_HEIGHT);
				item.stroke();
				item.closePath();
				if(getStyles(KEY, 'usegraphunderstrokeleft')) {
					item.beginPath();
					item.lineWidth 		= getStyles(KEY, "graphunderstrokeleftwidth");
					item.strokeStyle 	= getStyles(KEY, "graphunderstrokeleftcolor");
					item.moveTo(startX + 1, startY - 1);
					item.lineTo(startX + 1, startY + GRAPH_HEIGHT);
					item.stroke();
					item.closePath();
				}
			}
			// GRAPH CONTAINER RIGHT LINE
			if(getStyles(KEY, 'usegraphstrokeright')) {
				item.beginPath();
				item.lineWidth 		= getStyles(KEY, "graphstrokerightwidth");
				item.strokeStyle 	= getStyles(KEY, "graphstrokerightcolor");
				item.moveTo(GRAPH_WIDTH + startX, startY - 1);
				item.lineTo(GRAPH_WIDTH + startX, startY + GRAPH_HEIGHT);
				item.stroke();
				item.closePath();
				if(getStyles(KEY, 'usegraphunderstrokeright')) {
					item.beginPath();
					item.lineWidth 		= getStyles(KEY, "graphunderstrokerightwidth");
					item.strokeStyle 	= getStyles(KEY, "graphunderstrokerightcolor");
					item.moveTo(GRAPH_WIDTH + startX - 1, startY - 1);
					item.lineTo(GRAPH_WIDTH + startX - 1, startY + GRAPH_HEIGHT);
					item.stroke();
					item.closePath();
				}
			}
		};
		this.drawMultiXAxis = function (_xAxis, _xaxisValue) {
			var count = DATA.length;
			var useXlabel 	= getStyles(KEY, "usexlabel");
			var xLabelPaddingTop = getStyles(KEY, "xlabelpaddingtop"), xLabelGap = getStyles(KEY, "xlabelgap"), xLabelSpace = getStyles(KEY, "xlabelspace");
			
			var yLabelGap 	= 0, yLabelLeftGap = 0, yLabelRightGap = 0;//getStyles(KEY, "ylabelgap");
			var yLabelLeft_paddingleft = 0, yLabelLeft_paddingright = 0, yLabelRight_paddingleft = 0, yLabelRight_paddingright = 0;
			for(var t in series){
				if(t != 'type'){
					yLabelGap = yLabelGap + thisStyle[t].ylabelgap;
					if(thisStyle[t].yaxisalign == "left"){
						yLabelLeftGap = thisStyle[t].ylabelgap;
						yLabelLeft_paddingleft = thisStyle[t].ylabelpaddingleft;
						yLabelLeft_paddingright = thisStyle[t].ylabelpaddingright;
					} else if(thisStyle[t].yaxisalign == "right") {
						yLabelRightGap = thisStyle[t].ylabelgap;
						yLabelRight_paddingleft = thisStyle[t].ylabelpaddingleft;
						yLabelRight_paddingright = thisStyle[t].ylabelpaddingright;
					}
				}
			}
			
			var startX = getStyles(KEY, "canvaspaddingleft") + 0.5 + yLabelLeftGap + yLabelLeft_paddingleft + yLabelLeft_paddingright;
			var startY = CHART_TOP + getStyles(KEY, "canvaspaddingtop") + getStyles(KEY, "mouseinfoheight");
			/* X Data 갯수에 맞춘 각 아이템의 넓이 */
			var xGap = (GRAPH_WIDTH - getStyles(KEY, "graphpaddingleft") - getStyles(KEY, "graphpaddingright")) / count, 
				yGap = (GRAPH_HEIGHT - getStyles(KEY, "graphpaddingtop") - getStyles(KEY, "graphpaddingbottom")) / count;
			var xGapHalf = xGap / 2;
			
			var item = context;
			// GRID LINE DRAW
			item.beginPath();
			item.textAlign 		= (seriesType != undefined && seriesType === "bar")? "left" : "center";
			item.textBaseline	= (seriesType != undefined && seriesType === "bar")? "middle" : "top";
			item.font			= getStyles(KEY, "xlabelfontstyle");
			item.fillStyle 		= getStyles(KEY, "xlabelfontcolor");
			item.lineWidth 		= getStyles(KEY, "verticalgridstrokewidth");
			item.strokeStyle 	= getStyles(KEY, "verticalgridstrokecolor");
			
			var useXAxisFormat = getUseOptions("xaxisformat");
			var xDataWidth = (useXAxisFormat) ? item.measureText(eval(options.xaxisformat)(DATA[0][_xaxisValue])).width : item.measureText(DATA[0][_xaxisValue]).width;
			var xDataHalfWidth = xDataWidth / 2;
			var firstVerticalStroke_x = startX + getStyles(KEY, "graphpaddingleft") + xGapHalf, firstVerticalStroke_y =  Math.round(startY + GRAPH_HEIGHT + xLabelPaddingTop);
			item.clearRect(0, firstVerticalStroke_y, CHART_WIDTH, item.font.split('px')[0]);
			if(!options.usexlabelfirst){ // 기본 폰트 사이즈 간격대로 출력됨
				var skip = 0;
				for(var i = 0; i < count; i++){
	//				if(i % _xAxis == 0 || i == 0){
						var gap = Math.floor((xGap * i) + firstVerticalStroke_x - xDataHalfWidth) + 0.5;
						
						xDate = DATA[i][_xaxisValue];
						
						if(useXAxisFormat) { xDate = eval(options.xaxisformat)(xDate); }
						
						if(gap - (xDataWidth / 2) <= firstVerticalStroke_x && i != 0){ continue; }
						if(getStyles(KEY, "useverticalgridstroke") == true) {
							if(skip < gap && GRAPH_WIDTH + (xDataWidth / 2) > (gap + (xDataWidth / 2))){
								item.moveTo(gap + xDataHalfWidth, startY);
								item.lineTo(gap + xDataHalfWidth, startY + GRAPH_HEIGHT);
							}
						}
						if(skip < gap && GRAPH_WIDTH + xDataWidth / 2 > (gap + xDataWidth / 2) || getStyles(KEY, "usexaxislastvalue") && i == count - 1) {
							if(useXlabel) item.fillText(xDate, Math.round(gap + xDataHalfWidth), startY + GRAPH_HEIGHT + xLabelPaddingTop);
							skip = gap + xDataWidth + xLabelSpace;
						}
				}
			} else { // 월 혹은 시간 첫번째 데이터 기준으로 출력됨
				var firstData = DATA[0][_xaxisValue];
				var xDate;
				var firstXLabel = null;
				for(var i = 0; i < count; i++){
					var gap = Math.floor((xGap * i) + firstVerticalStroke_x - xDataHalfWidth) + 0.5;
					xDate = DATA[i][_xaxisValue];
					if(i > 0 && options.usexlabelfirst == "month" && firstData.substr(0, 6) == xDate.substr(0,6)){
						continue;
					} 
					firstData = xDate;
					if(useXAxisFormat) { xDate = eval(options.xaxisformat)(xDate); }
					if(i == 0){
						/*var gap = Math.floor((xGap * i) + firstVerticalStroke_x - xDataHalfWidth) + 0.5;
						if(useXlabel) item.fillText(xDate, Math.round(gap + xDataHalfWidth), startY + GRAPH_HEIGHT + xLabelPaddingTop);*/
					} else {
						if(getStyles(KEY, "useverticalgridstroke") == true) {
								item.moveTo(gap + xDataHalfWidth, startY);
								item.lineTo(gap + xDataHalfWidth, startY + GRAPH_HEIGHT);
						}
						if(useXlabel) item.fillText(xDate, Math.round(gap + xDataHalfWidth), startY + GRAPH_HEIGHT + xLabelPaddingTop);
						if(firstXLabel == null){
							firstXLabel = {};
							firstXLabel.x = Math.round(gap);
							firstXLabel.y = startY + GRAPH_HEIGHT + xLabelPaddingTop;
						}
					}
				}
				var fgap = Math.floor((xGap * 0) + firstVerticalStroke_x - xDataHalfWidth) + 0.5;
				if(fgap + xDataHalfWidth < firstXLabel.x - xDataHalfWidth) {
					if(useXAxisFormat) { firstData = eval(options.xaxisformat)(DATA[0][_xaxisValue]); }
					if(useXlabel) item.fillText(firstData, Math.round(fgap + xDataHalfWidth), startY + GRAPH_HEIGHT + xLabelPaddingTop);
				}
			}
			item.fill();
			item.stroke();
			item.closePath();
			item.beginPath();
			// GRAPH CONTAINER LEFT LINE
			if(getStyles(KEY, 'usegraphstrokeleft')) {
				item.lineWidth 		= getStyles(KEY, "graphstrokeleftwidth");
				item.strokeStyle 	= getStyles(KEY, "graphstrokeleftcolor");
				item.moveTo(startX, startY);
				item.lineTo(startX, startY + GRAPH_HEIGHT);
				item.stroke();
			}
			// GRAPH CONTAINER RIGHT LINE
			if(getStyles(KEY, 'usegraphstrokeright')) {
				item.lineWidth 		= getStyles(KEY, "graphstrokerightwidth");
				item.strokeStyle 	= getStyles(KEY, "graphstrokerightcolor");
				item.moveTo(GRAPH_WIDTH + startX - 1, startY);
				item.lineTo(GRAPH_WIDTH + startX - 1, startY + GRAPH_HEIGHT);
				item.stroke();
			}
			item.closePath();
		};
		// Number Format 1,000
		var format = function(txt) {
			if(txt==0) return 0;
			 
		    var reg = /(^[+-]?\d+)(\d{3})/;
		    var n = (txt + '');
		 
		    while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');
		 
		    return n;
		};
		// Styles getter
		var getStyles = function (_KEY, _name) {
			_name = _name.toLowerCase();
			var s = styles;
			if(_KEY !== "A") s = s[_KEY];
			return s[_name];
		};
		// Options use check - true | false
		var getUseOptions = function ( _name ) {
			if(options[_name] != undefined && options[_name] != "")
				return true;
			return false;
		};
		
		return _this;
	};

