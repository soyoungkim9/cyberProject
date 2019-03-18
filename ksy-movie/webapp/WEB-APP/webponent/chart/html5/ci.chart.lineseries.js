(function($) {
	DrawLine = function (_graphctx, _etcctx, _options, _styles, _param, _yAxis, _sizeObject) {
		var _this = this;

		var context = _graphctx, etcctx = _etcctx;
		var options = _options, styles = _styles;
		this.series = _param.option.series;
		
		var defaultSeriesStyles = {
			"strokecolor": "#77bf10", "strokewidth": 1,
			"overstrokecolor": "#549521", "overstrokewidth": 1,
			"overfillcolor": "#549521", "overitemwidth": 3,
			"upstrokecolor": "#be0001", "upstrokewidth": 1,
			"overupstrokecolor": "#be0001", "overupstrokewidth": 1,
			"overupfillcolor": "#be0001", "overupitemwidth": 3,
			"downstrokecolor": "#1a83d9", "downstrokewidth": 1,
			"overdownstrokecolor": "#1a83d9", "overdownstrokewidth": 1,
			"overdownfillcolor": "#1a83d9", "overdownitemwidth": 3,
			"basestrokecolor": "#000000", "basestrokewidth": 1,
			"usedashedstroke": false, "dashedstrokestyle": [3, 3],
			"tickstyle": null, 
			"ticksize": 3, "tickfillcolor": "#00ca00", "tickstrokewidth": 1, "tickstrokecolor": "#00ca00",
			"overticksize": 3, "overtickfillcolor": "#00ca00", "overtickstrokewidth": 1, "overtickstrokecolor": "#00ca00",
			"usemaxvalue": false, "useminvalue": false,
			"maxvaluefontstyle": "12px 'dotum'", "maxvaluefontcolor": "#dd4242", "maxvaluearrowimage": null,
			"minvaluefontstyle": "12px 'dotum'", "minvaluefontcolor": "#428dd3", "minvaluearrowimage": null
		};
		
		var KEY = _param.option.key, DATA = $.extend(true, [], _param.data);//deepCopy(_param.data);
		var CHART_WIDTH  = _sizeObject.CHART_WIDTH, CHART_HEIGHT = _sizeObject.CHART_HEIGHT, CHART_TOP = _sizeObject.CHART_TOP;
		this.GRAPH_WIDTH  = _sizeObject.GRAPH_WIDTH, this.GRAPH_HEIGHT = _sizeObject.GRAPH_HEIGHT;
		var startX = 0;
		var YAXIS = _yAxis;
		var BASE = _param.option.base;//, MAX = _param.option.max, MIN = _param.option.min;
		
		this.maxItem = null, this.minItem = null;
		
		var thisStyles = styles[KEY], seriesForm = null;
		this.thisSeries = null;
		this.seriesData = [];
		
		var valueMinImage = (_sizeObject.MINIMAGE != undefined) ? _sizeObject.MINIMAGE : null, 
			valueMaxImage = (_sizeObject.MAXIMAGE != undefined) ? _sizeObject.MAXIMAGE : null;
		
		this.drawSeries = function (_seriesForm) {
			seriesForm = _seriesForm;
			_this.thisSeries = _this.series[seriesForm];
			thisStyles[seriesForm] = $.extend(true, defaultSeriesStyles, thisStyles[seriesForm]);
			
			_this.seriesData = parseData(DATA);
			
			var thisSeriesStyles = thisStyles[seriesForm];
			
			var yLabelGap, yAxisAlign, yLabelPaddingRight;
			if(!options.usemultiyaxis){
				yLabelGap 	= getStyles(KEY, "ylabelgap");
				yAxisAlign 	= getStyles(KEY, "yaxisalign"), yLabelAlign = getStyles(KEY, "ylabelalign");
				yLabelPaddingRight = getStyles(KEY, "ylabelpaddingright"), yLabelPaddingLeft = getStyles(KEY, "ylabelpaddingleft");
			} else {
				yLabelGap = thisSeriesStyles.ylabelgap;
				yAxisAlign = thisSeriesStyles.yaxisalign, yLabelAlign = thisSeriesStyles.ylabelalign;
				yLabelPaddingRight = thisSeriesStyles.ylabelpaddingright, yLabelPaddingLeft = thisSeriesStyles.ylabelpaddingleft;
			}
			
			startX = getStyles(KEY, "canvaspaddingleft") + 0.5;
			if(!options.usemultiyaxis){ // 한개 Axis
				if(yAxisAlign === "left"){
					startX += yLabelGap + yLabelPaddingRight + yLabelPaddingLeft;
				}
			} else { // 양쪽 Axis
				if(yAxisAlign === "left"){
					startX += yLabelGap + yLabelPaddingRight + yLabelPaddingLeft;
				} else if(yAxisAlign === "right"){
					var check = true;
					for(var s in styles){
						var sl = styles[s];
						for(var ss in sl){
							try{
								if(!isNaN(sl[ss].ylabelgap) && sl[ss].yaxisalign == "left"){
									startX += sl[ss].ylabelgap + sl[ss].ylabelpaddingleft + sl[ss].ylabelpaddingright;
									check = false;
									break;
								}
							}catch(e){}
						}
						if(!check) break;
					}
				}
			}
			var graphPaddTop = getStyles(KEY, "graphpaddingtop"), graphPaddBottom = getStyles(KEY, "graphpaddingbottom");
			var startY = CHART_TOP + getStyles(KEY, "canvaspaddingtop") + graphPaddTop + getStyles(KEY, "mouseinfoheight") + 0.5;
			_this.GRAPH_HEIGHT = _this.GRAPH_HEIGHT - graphPaddTop - graphPaddBottom;
			var yAxisMax = YAXIS[YAXIS.length - 1], yAxisMin = YAXIS[0];
			var yAxisGap 	= yAxisMax - yAxisMin;
			
			var graphPadLR = getStyles(KEY, "graphpaddingright") + getStyles(KEY, "graphpaddingleft");
			
			var count = _this.seriesData.length;
			var xGap = (_this.GRAPH_WIDTH - graphPadLR) / count, xGapHalf	= xGap / 2;
			var close = 0, i = 0, undefineFrontItem = -1, undefineBackItem = count;
			
			var dataValue = _this.seriesData[0];//, dataValueAfter = _this.seriesData[1];
			
			var firstItem_x = 0;
			if(getStyles(KEY, "baseatstart") && count > 1){
				xGap = _this.GRAPH_WIDTH / (count -1), xGapHalf = xGap / 2;
				firstItem_x = startX;// + getStyles(KEY, "graphpaddingleft") - xGapHalf;
			} else {
				firstItem_x = startX + getStyles(KEY, "graphpaddingleft") + xGapHalf;
			}
			var undefineBackChk = false;
			for(i = 0; i < count; i++){
				dataValue = _this.seriesData[i];
				if((dataValue.yaxis != undefined && dataValue.yaxis != null && dataValue.yaxis != "") || (dataValue.yaxis == 0 && dataValue.yaxis.toString() != "")){
					undefineBackChk = true;
					if(Number(dataValue.yaxis) >= BASE){ dataValue.comp = "up"; }
					else { dataValue.comp = "down"; }
					
					close 	= _this.GRAPH_HEIGHT * ((yAxisMax - dataValue.yaxis) / yAxisGap);
					if(options.usestock){
						dataValue._high = Math.floor(_this.GRAPH_HEIGHT * ((yAxisMax - dataValue.high)  / yAxisGap)) + startY;
						dataValue._low = Math.floor(_this.GRAPH_HEIGHT * ((yAxisMax - dataValue.low)  / yAxisGap)) + startY;
					}
					
					dataValue.x = (xGap * i) + firstItem_x, dataValue.y = close + startY;
					dataValue.width = (xGap), dataValue.height = 3;
					
					unBackItemCheck = true;
				} else if((undefineFrontItem < 0 && dataValue.xaxis != " ") || (dataValue.yaxis == "")) {
					if(!undefineBackChk) undefineFrontItem = i; // series 앞에 Y값이 없을 경우
					else undefineBackItem = i; // series 뒤에 Y값이 없을 경우
				} else { // 오버레이의 일목균형을 위함
					if(dataValue.xaxis == " ") undefineBackItem = i;
				}
			}
			drawCtxSeries(thisSeriesStyles, undefineFrontItem, undefineBackItem, count);
			
			if(etcctx != undefined && valueMinImage != null) etcctx.clearRect(0, 0, CHART_WIDTH, CHART_HEIGHT);
			if(valueMinImage != null){ drawValue("min", _this.minItem, thisStyles[seriesForm]); }
			if(valueMaxImage != null){ drawValue("max", _this.maxItem, thisStyles[seriesForm]); }
		};
		
		var drawCtxSeries = function(thisSeriesStyles, undefineFrontItem, undefineBackItem, count){
			var i = 0, dataValue = null, dataValueAfter = null;
			var item = context;
			item.beginPath();
			item.lineWidth = thisSeriesStyles.strokewidth;
			item.lineJoin = "round";
			item.strokeStyle = thisSeriesStyles.strokecolor;
			if(undefineFrontItem + 1 < count){
				var frontItem = _this.seriesData[undefineFrontItem + 1];
				item.moveTo(frontItem.x, frontItem.y);
				
				if(thisSeriesStyles.usedashedstroke){
					for(i = undefineFrontItem + 1; i < undefineBackItem - 1; i ++){
						dataValue = _this.seriesData[i];
						dataValueAfter = _this.seriesData[i+1];
						if(!getStyles(KEY, "usezeroitem") && dataValue.yaxis == 0 || !getStyles(KEY, "usezeroitem") && dataValueAfter.yaxis == 0) {
							
						} else {
							item.dashedLineFromTo(dataValue.x, dataValue.y, dataValueAfter.x, dataValueAfter.y, thisSeriesStyles.dashedstrokestyle);
						}
					}
				} else {
					// 전일종가 기준으로 업, 다운 색상 표현					
					if(_this.thisSeries.form != undefined && _this.thisSeries.form == "updown-c"){
						var prevClose = _this.seriesData[undefineBackItem - 1].yaxis;
						var prevData = null;
						var baseLine = Math.round((_this.GRAPH_HEIGHT * ((YAXIS[YAXIS.length - 1] - prevClose) / (YAXIS[YAXIS.length - 1] - YAXIS[0]))) + (CHART_TOP + getStyles(KEY, "canvaspaddingtop") + getStyles(KEY, "graphpaddingtop") + getStyles(KEY, "mouseinfoheight") + 0.5));
						
						if(_this.seriesData[undefineFrontItem + 1].yaxis > prevClose){
							item.strokeStyle = thisSeriesStyles.upstrokecolor;
						} else {
							item.strokeStyle = thisSeriesStyles.downstrokecolor;
						}
						
						for(i = undefineFrontItem + 1; i < undefineBackItem; i ++){
							dataValue = _this.seriesData[i];
							if(dataValue.x != undefined && dataValue.xaxis != "") {
								if(!getStyles(KEY, "usezeroitem") && dataValue.yaxis == 0) {
									
								} else {
									if(i > undefineFrontItem + 1){
										item.beginPath();
										prevData = _this.seriesData[i-1];
										item.moveTo(prevData.x, prevData.y);
									}
									if(i > undefineFrontItem + 1 && (prevData.yaxis < prevClose && dataValue.yaxis > prevClose || prevData.yaxis > prevClose && dataValue.yaxis < prevClose)){
										var cross = getCrossPoint({"x":prevData.x, "y": prevData.y}, {"x":dataValue.x, "y": dataValue.y}, baseLine);
										if(cross != null){
											item.lineTo(cross.x, cross.y);
											item.stroke();
											item.closePath();
											if(dataValue.yaxis > prevClose){
												item.strokeStyle = thisSeriesStyles.upstrokecolor;
											} else {
												item.strokeStyle = thisSeriesStyles.downstrokecolor;
											}
											item.beginPath();
											item.moveTo(cross.x, cross.y);
										}
										item.lineTo(dataValue.x, dataValue.y);
										item.stroke();
										item.closePath();
									} else {
										item.lineTo(dataValue.x, dataValue.y);
										item.stroke();
										item.closePath();
									}
								}
							}
						}
						if(thisSeriesStyles.basestrokewidth > 0){
							item.beginPath();
							item.strokeStyle 	= thisSeriesStyles.basestrokecolor;
							item.lineWidth 		= thisSeriesStyles.basestrokewidth;
							item.moveTo(startX, baseLine + 0.5);
							item.lineTo(startX + _this.GRAPH_WIDTH, baseLine + 0.5);
							item.stroke();
							item.closePath();
						}
					} else {
						for(i = undefineFrontItem + 1; i < undefineBackItem; i ++){
							dataValue = _this.seriesData[i];
							if(dataValue.x != undefined && dataValue.xaxis != "") {
								if(!getStyles(KEY, "usezeroitem") && dataValue.yaxis == 0) {
									
								} else {
									item.lineTo(dataValue.x, dataValue.y);
								}
							}
						}
					}
				}
			}
			item.stroke();
			item.closePath();
			
			if(thisSeriesStyles.tickstyle != null){ //도형 (원, 사각형, 마름모)
				item.fillStyle = thisSeriesStyles.tickfillcolor;
				item.lineWidth = thisSeriesStyles.tickstrokewidth;
				item.strokeStyle = thisSeriesStyles.tickstrokecolor;
				var ticksize = thisSeriesStyles.ticksize, PI = Math.PI * 2;
				for(i = undefineFrontItem + 1; i < count; i ++){
					item.beginPath();
					var thisItemInfo = _this.seriesData[i];
					if(thisSeriesStyles.tickstyle == "dot"){ item.arc(thisItemInfo.x, thisItemInfo.y, ticksize, 0, PI, false); }
					if(thisSeriesStyles.tickstyle == "rect"){ item.rect(Math.floor(thisItemInfo.x - ticksize * 0.75) + 0.5, Math.floor(thisItemInfo.y - ticksize * 0.75) + 0.5, Math.floor(ticksize * 1.5), Math.floor(ticksize * 1.5)); }
					if(thisSeriesStyles.tickstyle == "triangle"){
						item.moveTo(thisItemInfo.x, thisItemInfo.y-ticksize*0.5);
						item.lineTo(thisItemInfo.x+ticksize*0.8, thisItemInfo.y+ticksize*0.5);
						item.lineTo(thisItemInfo.x-ticksize*0.8, thisItemInfo.y+ticksize*0.5);
						item.lineTo(thisItemInfo.x, thisItemInfo.y-ticksize*0.5);
					}
					if(thisSeriesStyles.tickstyle == "rhom"){
						item.moveTo(thisItemInfo.x-ticksize, thisItemInfo.y);
						item.lineTo(thisItemInfo.x, thisItemInfo.y+ticksize);
						item.lineTo(thisItemInfo.x+ticksize, thisItemInfo.y);
						item.lineTo(thisItemInfo.x, thisItemInfo.y-ticksize);
						item.lineTo(thisItemInfo.x-ticksize, thisItemInfo.y);
					}
					if(thisSeriesStyles.tickstyle == "star"){
						item.moveTo(thisItemInfo.x, thisItemInfo.y-ticksize);
						item.lineTo(thisItemInfo.x-ticksize*0.7, thisItemInfo.y+ticksize*1.2);
						item.lineTo(thisItemInfo.x+ticksize, thisItemInfo.y-ticksize*0.1);
						item.lineTo(thisItemInfo.x-ticksize, thisItemInfo.y-ticksize*0.1);
						item.lineTo(thisItemInfo.x+ticksize*0.7, thisItemInfo.y+ticksize*1.2);
						item.lineTo(thisItemInfo.x, thisItemInfo.y-ticksize);
					}
					if(thisSeriesStyles.tickstrokewidth != 0) item.stroke();
					item.fill();
					item.closePath();
				}
			}
			
			if(thisStyles[seriesForm].useaccessibility){
				for(i = undefineFrontItem + 1; i < count; i ++){
					var thisItemInfo = _this.seriesData[i];
					if(thisItemInfo.xaxis == " ") continue;
					item.beginPath();
					item.lineWidth = 1;
					var x = thisItemInfo.x, w = thisItemInfo.width > 5 ? 5 : thisItemInfo.width;
					var itemX = Math.floor(x - (w/2)), itemW = Math.floor(x + (w/2));
					var _accessY = _this.GRAPH_HEIGHT - 0.5, _accessW = itemW - itemX, _accessHalf = Math.round(_accessW / 2);
					if(thisItemInfo.open <= thisItemInfo.close) {
						item.strokeStyle = "#dd4242";
						item.moveTo(x, 	_accessY);
						item.lineTo(x, 	_accessY + _accessW + 1);
						item.moveTo(itemX, 	_accessY + _accessHalf);
						item.lineTo(itemW + 1, 	_accessY + _accessHalf);
					} else {
						item.strokeStyle = "#428dd3";
						item.moveTo(itemX,	_accessY + _accessHalf);
						item.lineTo(itemW + 1, 	_accessY + _accessHalf);
					}
					item.stroke();
					item.closePath();
				}
			}
			if(thisStyles.baseatzero && thisSeriesStyles.basestrokewidth > 0){
				var baseLine = (_this.GRAPH_HEIGHT * ((YAXIS[YAXIS.length - 1]) / (YAXIS[YAXIS.length - 1] - YAXIS[0]))) + (CHART_TOP + getStyles(KEY, "canvaspaddingtop") + getStyles(KEY, "graphpaddingtop") + getStyles(KEY, "mouseinfoheight"));
				item.beginPath();
				item.strokeStyle 	= thisSeriesStyles.basestrokecolor;
				item.lineWidth 		= thisSeriesStyles.basestrokewidth;
				item.moveTo(startX, baseLine + 0.5);
				item.lineTo(startX + _this.GRAPH_WIDTH, baseLine + 0.5);
				item.stroke();
				item.closePath();
			}
		};
		
		var parseData = function(_data) {
			var data = [];
			var _max = -99999999999999999, _min = 99999999999999999;
			var useStock = (options.usestock && _this.thisSeries.stockmain) ?  true : false;
			var nHigh, nLow;
			for(var i = 0; i < _data.length; i += 1){
				var obj = {};
				obj = _data[i];
				obj["xaxis"] = (obj)[_this.thisSeries["xaxis"]];
				obj["yaxis"] = (obj)[_this.thisSeries["yaxis"]];
				if(useStock){
					nHigh = obj.high;
					if(_max <= nHigh) {
						_max = nHigh;
						_this.maxItem = obj;
					}
					nLow = obj.low;
					if(_min >= nLow) {
						_min = nLow;
						_this.minItem = obj;
					}
				}
				data.push(obj);
			}
			return data;
		};
		
		this.onMouseMove = function(_item, _selectCtx, dObj){
			var overData = _this.seriesData[_item.index];
			if(options.useselectitem){
				_selectCtx.clearRect(0, 0, _selectCtx.canvas.width, _selectCtx.canvas.height);
				var thisStyleForm = thisStyles[seriesForm];
				_selectCtx.beginPath();
				if(thisStyleForm.tickstyle != null){ // TICK STYLE이 있을 경우
					var overticksize = thisStyleForm.overticksize;
					
					if(thisStyleForm.tickstyle == "dot"){ _selectCtx.arc(overData.x, overData.y, overticksize, 0, Math.PI * 2, false);}
					if(thisStyleForm.tickstyle == "rect"){ _selectCtx.rect(Math.floor(overData.x - overticksize * 0.75) + 0.5, Math.floor(overData.y - overticksize * 0.75) + 0.5, Math.floor(overticksize * 1.5), Math.floor(overticksize * 1.5)); }
					if(thisStyleForm.tickstyle == "triangle"){
						_selectCtx.moveTo(overData.x, overData.y-overticksize*0.5);
						_selectCtx.lineTo(overData.x+overticksize*0.8, overData.y+overticksize*0.5);
						_selectCtx.lineTo(overData.x-overticksize*0.8, overData.y+overticksize*0.5);
						_selectCtx.lineTo(overData.x, overData.y-overticksize*0.5);
					}
					if(thisStyleForm.tickstyle == "rhom"){
						_selectCtx.moveTo(overData.x-overticksize, overData.y);
						_selectCtx.lineTo(overData.x, overData.y+overticksize);
						_selectCtx.lineTo(overData.x+overticksize, overData.y);
						_selectCtx.lineTo(overData.x, overData.y-overticksize);
						_selectCtx.lineTo(overData.x-overticksize, overData.y);
					}
					if(thisStyleForm.tickstyle == "star"){
						_selectCtx.moveTo(overData.x, overData.y-overticksize);
						_selectCtx.lineTo(overData.x-overticksize*0.7, overData.y+overticksize*1.2);
						_selectCtx.lineTo(overData.x+overticksize, overData.y-overticksize*0.1);
						_selectCtx.lineTo(overData.x-overticksize, overData.y-overticksize*0.1);
						_selectCtx.lineTo(overData.x+overticksize*0.7, overData.y+overticksize*1.2);
						_selectCtx.lineTo(overData.x, overData.y-overticksize);
					}
					
					_selectCtx.fillStyle = thisStyleForm.overtickfillcolor;
					_selectCtx.fill();
					
					if(thisStyleForm.overtickstrokewidth != 0){
						_selectCtx.lineWidth = thisStyleForm.overtickstrokewidth;
						_selectCtx.strokeStyle = thisStyleForm.overtickstrokecolor;
						_selectCtx.stroke();
					}
				} else { // TICK STYLE이 없을 경우 - BASIC
					_selectCtx.arc(overData.x, overData.y, thisStyleForm.overitemwidth, 0, Math.PI * 2, false);
					
					if(_this.thisSeries.form == "updown-c"){
						var lastData = _this.seriesData[_this.seriesData.length - 1];
						if(lastData.yaxis <= overData.yaxis){
							_selectCtx.fillStyle = thisStyleForm.overupfillcolor;
							_selectCtx.lineWidth = thisStyleForm.overupstrokewidth;
							if(thisStyleForm.overupstrokewidth != 0){
								_selectCtx.strokeStyle = thisStyleForm.overupstrokecolor;
								_selectCtx.stroke();
							}
						} else {
							_selectCtx.fillStyle = thisStyleForm.overdownfillcolor;
							_selectCtx.lineWidth = thisStyleForm.overudownstrokewidth;
							if(thisStyleForm.overudownstrokewidth != 0){
								_selectCtx.strokeStyle = thisStyleForm.overdownstrokecolor;
								_selectCtx.stroke();
							}
						}
					} else {
						_selectCtx.fillStyle = thisStyleForm.overfillcolor;
						_selectCtx.lineWidth = thisStyleForm.overstrokewidth;
						if(thisStyleForm.overstrokewidth != 0){
							_selectCtx.strokeStyle = thisStyleForm.overstrokecolor;
							_selectCtx.stroke();
						}
					}
					_selectCtx.fill();
				}
				_selectCtx.closePath();
				
			}
			
			var tipleft = overData.x;
			var tiptop = overData.y;
			
			var obj = {};
			obj.text = _item.series.label;
			obj.top  = tiptop;
			obj.left = tipleft;
			obj.item = dObj;
			
			return obj;
		};
		
		var drawValue = function(stat, _data, _styles) {
			var item = etcctx;
			if(_styles.maxvaluearrowimage != null || _styles.minvaluearrowimage != null){
				var img_y = 0, img_x = 0, img_w = 0, img_h = 0;
				item.beginPath();
				item.textAlign = "center";
				item.textBaseline = "top";
				var xdata = _data.xaxis.toString();
				xdata = xdata.substr(xdata.length - 4, 4);
				if(stat == "max"){
					var _textX = _data.x;
					img_w = _styles.maxvaluearrowimage.width, img_h = _styles.maxvaluearrowimage.height;
					img_x = Math.round(_textX - img_w/2), img_y = Math.round(_data._high - (img_h + 2));
					
					item.font = _styles.maxvaluefontstyle;
					item.fillStyle = _styles.maxvaluefontcolor;
					
					item.drawImage(valueMaxImage, _styles.maxvaluearrowimage.left, _styles.maxvaluearrowimage.top, img_w, img_h, img_x, img_y, img_w, img_h);
					var _text = ("최고"+_data.high.toString().format()+" ("+xdata.dateFormat()+")");
					var _textWHalf = Number(item.measureText(_text).width / 2);
					if(_textX < getStyles(KEY, "graphpaddingleft")){
						_textX = _textX + _textWHalf + getStyles(KEY, "graphpaddingleft");
					} else if(_textX + (_textWHalf * 2) > _this.GRAPH_WIDTH){
						_textX = _textX - _textWHalf - 5; 
					} else {
						_textX = _textX + _textWHalf + 7;
					}
					item.fillText(_text, Math.round(_textX), img_y - 2);
				} else {
					var _textX = _data.x;
					img_w = _styles.minvaluearrowimage.width, img_h = _styles.minvaluearrowimage.height;
					img_x = Math.round(_textX -img_w/2), img_y = Math.round(_data._low + 2);
					
					item.font = _styles.minvaluefontstyle;
					item.fillStyle = _styles.minvaluefontcolor;
					
					item.drawImage(valueMinImage, _styles.minvaluearrowimage.left, _styles.minvaluearrowimage.top, img_w, img_h, img_x, img_y, img_w, img_h);
					var _text = ("최저"+_data.low.toString().format()+" ("+xdata.dateFormat()+")");
					var _textWHalf = Number(item.measureText(_text).width / 2);
					if(_textX < getStyles(KEY, "graphpaddingleft")){
						_textX = _textX + _textWHalf + getStyles(KEY, "graphpaddingleft");
					} else if(_textX + (_textWHalf * 2) > _this.GRAPH_WIDTH){
						_textX = _textX - _textWHalf - 5; 
					} else {
						_textX = _textX + _textWHalf + 7;
					}
					item.fillText(_text, Math.round(_textX), img_y);
				}
				item.closePath();
			} else {}
		};
		
		var getCrossPoint = function (_A, _B, _baseLine) {
			var t, s;
			var under = (_baseLine - _baseLine) * (_B.x - _A.x) - (_B.x - _A.x) * (_B.y - _A.y);
			if(under == 0) return null;
			
			var _t = (_B.x - _A.x) * (_A.y - _baseLine) - (_baseLine - _baseLine) * (_A.x - _A.x);
			var _s = (_B.x - _A.x) * (_A.y - _baseLine) - (_B.y - _A.y) *(_A.x - _A.x);
			
			t = _t / under, s = _s / under;
			
			if(t < 0 || t> 1 || s < 0 || s > 1) return null;
			if(_t == 0 && _s == 0) return null;
			
			var obj = {};
			obj.x = _A.x + t * (_B.x - _A.x);
			obj.y = _A.y + t * (_B.y - _A.y);
			
			return obj;
		};
		
		// Styles getter
		var getStyles = function (_KEY, _name) {
			_name = _name.toLowerCase();
			var s = styles;
			if(_KEY !== "A") {
				s = s[_KEY];
			}
			return s[_name];
		};
		
		return _this;
	};
})(jQuery);