(function($) {
	DrawCandle = function (_graphctx, _etcctx, _options, _styles, _param, _yAxis, _sizeObject) {
		var _this = this;
		
		var context = _graphctx, etcctx = _etcctx;
		var options = _options, styles = _styles;
		this.series = _param.option.series;
		
		var defaultSeriesStyles = {
			"upfillcolor": "#ee695b", "upstrokecolor": "#c42c1c", "upstrokewidth": 1,
			"overupfillcolor": "#c42c1c", "overupstrokecolor": "#c42c1c", "overupstrokewidth": 1,
			"downfillcolor": "#65b9f8", "downstrokecolor": "#2e80cc", "downstrokewidth": 1,
			"overdownfillcolor": "#2e80cc", "overdownstrokecolor": "#2e80cc", "overdownstrokewidth": 1,
			"flatfillcolor": "#a8a8a8", "flatstrokecolor": "#777777", "flatstrokewidth": 1,
			"overflatfillcolor": "#a8a8a8", "overflatstrokecolor": "#777777", "overflatstrokewidth": 1,
			"itemwidth": 60,
			"useaccessibility": false,
			"usemaxvalue": false, "useminvalue": false,
			"maxvaluefontstyle": "12px 'dotum'", "maxvaluefontcolor": "#dd4242", "maxvaluearrowimage": null,
			"minvaluefontstyle": "12px 'dotum'", "minvaluefontcolor": "#428dd3", "minvaluearrowimage": null
		};
		var KEY = _param.option.key, DATA = $.extend(true, [], _param.data);//deepCopy(_param.data);
		var CHART_WIDTH  = _sizeObject.CHART_WIDTH, CHART_HEIGHT = _sizeObject.CHART_HEIGHT, CHART_TOP = _sizeObject.CHART_TOP;
		this.GRAPH_WIDTH  = _sizeObject.GRAPH_WIDTH, this.GRAPH_HEIGHT = _sizeObject.GRAPH_HEIGHT;
		var YAXIS = _yAxis;
		var BASE = _param.option.base, MAX = _param.option.max, MIN = _param.option.min;
		
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
			
			_this.seriesData = parseData(DATA); // x, y - data value matching
			
			var yLabelGap 	= getStyles(KEY, "ylabelgap"), yAxisAlign 	= getStyles(KEY, "yaxisalign");//, yLabelAlign = getStyles(KEY, "ylabelalign");
			var yLabelPadR = getStyles(KEY, "ylabelpaddingright"), yLabelPadL = getStyles(KEY, "ylabelpaddingleft");
			var graphPadLR = getStyles(KEY, "graphpaddingright") + getStyles(KEY, "graphpaddingleft");
			
			var startX = getStyles(KEY, "canvaspaddingleft") + 0.5;
			if(yAxisAlign === "left"){ startX += yLabelGap + yLabelPadR + yLabelPadL; }
			var startY = CHART_TOP + getStyles(KEY, "canvaspaddingtop") + getStyles(KEY, "mouseinfoheight") + 0.5;
			
			var yAxisMax = YAXIS[YAXIS.length - 1], yAxisMin = YAXIS[0];
			var count = _this.seriesData.length;
			var xGap = (_this.GRAPH_WIDTH - graphPadLR) / count, xGapHalf = Math.ceil(xGap / 2);
			var xPdn = (xGap - (xGap * (Number(thisStyles[seriesForm].itemwidth) / 100))); 
			
			var yAxisGap = yAxisMax - yAxisMin;
			var i = 0, j = 0, open = 0, high = 0, low = 0, close = 0, height = 0;
			var dataValue = null;
			var firstItem_x = startX + getStyles(KEY, "graphpaddingleft") + xGapHalf;
			var w = Math.round((xGap - xPdn));
			if(w <= 0) w = 0.5;
			
			var gradientFill;
			
			var item = context;
			item.lineWidth 		= thisStyles[seriesForm].strokewidth;
			item.strokeStyle 	= thisStyles[seriesForm].strokecolor;
			for(i = count; i --;){
				dataValue = _this.seriesData[i];
				open 	= Math.floor(_this.GRAPH_HEIGHT * ((yAxisMax - dataValue.open)  / yAxisGap)) + startY;
				high 	= Math.floor(_this.GRAPH_HEIGHT * ((yAxisMax - dataValue.high)  / yAxisGap)) + startY;
				low 	= Math.floor(_this.GRAPH_HEIGHT * ((yAxisMax - dataValue.low)   / yAxisGap)) + startY;
				close 	= Math.floor(_this.GRAPH_HEIGHT * ((yAxisMax - dataValue.close) / yAxisGap)) + startY;
				height	= close - open;
				
				dataValue.x = Math.floor((xGap * i) - w/2) +firstItem_x, dataValue.y = open;
				dataValue.width = w, dataValue.height = Math.floor(height);
				dataValue._low = low, dataValue._high = high, dataValue._open = open, dataValue._close = close;
				
				if(dataValue.open > dataValue.close) dataValue.comp = "down";
				else if(dataValue.open < dataValue.close) dataValue.comp = "up";
				else dataValue.comp = "flat";
			}
			item.strokeStyle 	= thisStyles[seriesForm].upstrokecolor;
			for(i = count; i --;){
				dataValue = _this.seriesData[i];
				if(dataValue.xaxis == ' ') continue;
				if(dataValue.comp === "up"){ // 상승
					item.beginPath();
					var itemX = dataValue.x, itemY = dataValue.y;
					var itemW = dataValue.x + w, itemH = dataValue.y + dataValue.height + 0.5;
					item.moveTo(itemX, itemY);
					item.lineTo(itemW, itemY);
					item.lineTo(itemW, itemH);
					item.lineTo(itemX, itemH);
					if((typeof(thisStyles[seriesForm].upfillcolor)).toLowerCase() == 'object'){ // GRADIENT or IMAGE
						if((thisStyles[seriesForm].upfillcolor).src != undefined){ // IMAGE
							
						} else { // Gradient
							gradientFill = thisStyles[seriesForm].upfillcolor;
							var gradient = item.createLinearGradient(itemX, itemY, itemW, itemY);
							for(j = 0; j < gradientFill.length; j++){
								gradient.addColorStop(gradientFill[j][0], gradientFill[j][1]);
							}
							item.fillStyle = gradient;
						}
					} else {
						item.fillStyle 		= thisStyles[seriesForm].upfillcolor;
					}
					item.fill();
					item.strokeRect(itemX, itemY, w, dataValue.height);
					
					xPos = Math.floor(dataValue.x + w/2) + 0.5;
					// Item 라인
					item.beginPath();
					item.moveTo(xPos, dataValue._close);
					item.lineTo(xPos, dataValue._high);
					item.moveTo(xPos, dataValue._open);
					item.lineTo(xPos, dataValue._low);
					
					if(thisStyles[seriesForm].useaccessibility){
						if(dataValue.xaxis == " ") continue;
						var _accessY = _this.GRAPH_HEIGHT + 0.5, _accessW = itemW - itemX, _accessHalf = Math.floor(_accessW / 2), _accessHalfGap = 0;
						if(_accessW > 5) { _accessHalfGap = Math.floor((_accessW - 5) / 2) + 0.5, _accessW = 5, _accessHalf = Math.floor(_accessW / 2); }
						/*item.moveTo(xPos - 1, 	_accessY - 1);
						item.lineTo(xPos - 1, 	_accessY + _accessW - 1);
						item.moveTo(itemX + _accessHalfGap - 1, _accessY + _accessHalf);
						item.lineTo(itemW - _accessHalfGap, 	_accessY + _accessHalf);*/
						item.moveTo(itemX + _accessHalfGap - 1, _accessY + _accessHalf + _accessW);
						item.lineTo(itemW - _accessHalfGap + 1, 	_accessY + _accessHalf + _accessW);
						item.lineTo(itemW - _accessHalfGap, 	_accessY + _accessHalf + _accessW);
						item.lineTo(dataValue.x + w/2, 	_accessY + _accessHalf);
						item.lineTo(itemX + _accessHalfGap, _accessY + _accessHalf + _accessW);
						item.fill();
					}
					item.stroke();
					item.closePath();
				}
			}
			item.strokeStyle 	= thisStyles[seriesForm].downstrokecolor;
			for(i = count; i --;){
				dataValue = _this.seriesData[i];
				if(dataValue.xaxis == ' ') continue;
				if(dataValue.comp === "down"){ // 하락
					item.beginPath();
					var itemX = dataValue.x, itemY = dataValue.y;
					var itemW = dataValue.x + w, itemH = dataValue.y + dataValue.height + 0.5;
					item.moveTo(itemX, itemY);
					item.lineTo(itemW, itemY);
					item.lineTo(itemW, itemH);
					item.lineTo(itemX, itemH);
					if((typeof(thisStyles[seriesForm].downfillcolor)).toLowerCase() == 'object'){ // GRADIENT or IMAGE
						if((thisStyles[seriesForm].downfillcolor).src != undefined){ // IMAGE
							
						} else { // Gradient
							gradientFill = thisStyles[seriesForm].downfillcolor;
							var gradient = item.createLinearGradient(itemX, itemY, itemW, itemY);
							for(j = 0; j < gradientFill.length; j++){
								gradient.addColorStop(gradientFill[j][0], gradientFill[j][1]);
							}
							item.fillStyle = gradient;
						}
					} else {
						item.fillStyle 		= thisStyles[seriesForm].downfillcolor;
					}
					item.fill();
					item.strokeRect(itemX, itemY, w, dataValue.height);
					
					xPos = Math.floor(dataValue.x + w/2) + 0.5;
					// Item 라인
					item.beginPath();
					item.moveTo(xPos, dataValue._open);
					item.lineTo(xPos, dataValue._high);
					item.moveTo(xPos, dataValue._close);
					item.lineTo(xPos, dataValue._low);
					
					if(thisStyles[seriesForm].useaccessibility){
						if(dataValue.xaxis == " ") continue;
						var _accessY = _this.GRAPH_HEIGHT + 0.5, _accessW = itemW - itemX, _accessHalf = _accessW / 2, _accessHalfGap = 0;
						if(_accessW > 5) { _accessHalfGap = Math.floor((_accessW - 5) / 2) + 0.5, _accessW = 5, _accessHalf = Math.floor(_accessW / 2); }
						/*item.moveTo(itemX + _accessHalfGap,	_accessY + _accessHalf);
						item.lineTo(itemW - _accessHalfGap, _accessY + _accessHalf);*/
						
						item.moveTo(itemX + _accessHalfGap - 1, _accessY + _accessHalf);
						item.lineTo(itemW - _accessHalfGap + 1, _accessY + _accessHalf);
						item.lineTo(itemW - _accessHalfGap, 	_accessY + _accessHalf);
						item.lineTo(dataValue.x + w/2, 			_accessY + _accessHalf + _accessW);
						item.lineTo(itemX + _accessHalfGap, 	_accessY + _accessHalf);
						item.fill();
					}
					item.stroke();
					item.closePath();
				}
			}
			item.strokeStyle 	= thisStyles[seriesForm].flatstrokecolor;
			for(i = count; i --;){
				dataValue = _this.seriesData[i];
				if(dataValue.xaxis == ' ') continue;
				if(dataValue.comp === "flat"){ // 보합
					item.beginPath();
					var itemX = dataValue.x, itemY = dataValue.y;
					var itemW = dataValue.x + w, itemH = dataValue.y + dataValue.height + 0.5;
					item.moveTo(itemX, itemY);
					item.lineTo(itemW, itemY);
					item.lineTo(itemW, itemH);
					item.lineTo(itemX, itemH);
					if((typeof(thisStyles[seriesForm].flatfillcolor)).toLowerCase() == 'object'){ // GRADIENT or IMAGE
						if((thisStyles[seriesForm].flatfillcolor).src != undefined){ // IMAGE
							
						} else { // Gradient
							gradientFill = thisStyles[seriesForm].flatfillcolor;
							var gradient = item.createLinearGradient(itemX, itemY, itemW, itemY);
							for(j = 0; j < gradientFill.length; j++){
								gradient.addColorStop(gradientFill[j][0], gradientFill[j][1]);
							}
							item.fillStyle = gradient;
						}
					} else {
						item.fillStyle 		= thisStyles[seriesForm].flatfillcolor;
					}
					item.fill();
					item.strokeRect(itemX, itemY, w, dataValue.height);
					
					xPos = Math.floor(dataValue.x + w/2) + 0.5;
					// Item 라인
					item.beginPath();
					item.moveTo(xPos, dataValue._open);
					item.lineTo(xPos, dataValue._high);
					item.moveTo(xPos, dataValue._close);
					item.lineTo(xPos, dataValue._low);
					
					if(thisStyles[seriesForm].useaccessibility){
						if(dataValue.xaxis == " ") continue;
						var _accessY = _this.GRAPH_HEIGHT + 0.5, _accessW = itemW - itemX, _accessHalf = _accessW / 2, _accessHalfGap = 0;
						if(_accessW > 5) { _accessHalfGap = Math.floor((_accessW - 5) / 2) + 0.5, _accessW = 5, _accessHalf = Math.floor(_accessW / 2); }
						item.moveTo(itemX + _accessHalfGap,	_accessY + _accessW);
						item.lineTo(itemW - _accessHalfGap, _accessY + _accessW);
						
						item.fill();
					}
					item.stroke();
					item.closePath();
				}
			}
			if(etcctx != undefined && valueMinImage != null) etcctx.clearRect(0, 0, CHART_WIDTH, CHART_HEIGHT);
			if(valueMinImage != null){
				drawValue("min", _this.minItem, thisStyles[seriesForm]);
			}
			if(valueMaxImage != null){
				drawValue("max", _this.maxItem, thisStyles[seriesForm]);
			}
		};
		
		var parseData = function(_data) {
			var data = [];
			
			var _max = -99999999999999999, _min = 99999999999999999;
			var useStock = (options.usestock && _this.thisSeries.stockmain) ?  true : false;
			var nHigh, nLow;
			for(var i = _data.length; i--;){
				var obj = {};
				obj = _data[i];
				obj["xaxis"] = (obj)[_this.thisSeries["xaxis"]];
				obj["open"] = (obj)[_this.thisSeries["open"]];
				obj["high"] = (obj)[_this.thisSeries["high"]];
				obj["low"] = (obj)[_this.thisSeries["low"]];
				obj["close"] = (obj)[_this.thisSeries["close"]];
				//if(useStock){
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
				//}
				data.unshift(obj);
			}
			return data;
		};
		
		this.onMouseMove = function(_item, _selectCtx, dObj){
			var overData = _this.seriesData[_item.index];
			if(options.useselectitem){
				_selectCtx.clearRect(0, 0, _selectCtx.canvas.width, _selectCtx.canvas.height);
				var thisStyleForm = thisStyles[seriesForm];
				_selectCtx.lineWidth = thisStyles[seriesForm].overupstrokewidth;
				if((typeof(thisStyleForm.overupfillcolor)).toLowerCase() == 'object' || (typeof(thisStyleForm.overdownfillcolor)).toLowerCase() == 'object'){ // Gradient
					if((thisStyleForm.overupfillcolor).src != undefined) { //IMAGE
						var style;
						
					} else { //Gradient
						var gradient = _selectCtx.createLinearGradient(overData.x, overData.y, overData.x + overData.width, overData.y);
						if(overData.comp == "up"){
							for(j = 0; j < thisStyleForm.overupfillcolor.length; j++)
								gradient.addColorStop(thisStyleForm.overupfillcolor[j][0], thisStyleForm.overupfillcolor[j][1]);
						} else {
							for(j = 0; j < thisStyleForm.overdownfillcolor.length; j++)
								gradient.addColorStop(thisStyleForm.overdownfillcolor[j][0], thisStyleForm.overdownfillcolor[j][1]);
						}
						_selectCtx.fillStyle = gradient;
					}
					_selectCtx.fillRect(overData.x, overData.y, overData.width, overData.height);
					if((overData.comp == "up" && thisStyleForm.overupstrokewidth > 0)){
						_selectCtx.strokeStyle = thisStyleForm.overupstrokecolor;
						_selectCtx.strokeRect(overData.x, overData.y, overData.width, overData.height);
					} else if((overData.comp == "down" && thisStyleForm.overdownstrokewidth > 0)){
						_selectCtx.strokeStyle = thisStyleForm.overdownstrokecolor;
						_selectCtx.strokeRect(overData.x, overData.y, overData.width, overData.height);
					}
				} else { //Solid
					if(overData.comp == "up") {
						_selectCtx.strokeStyle = thisStyleForm.overupstrokecolor;
						_selectCtx.fillStyle = thisStyleForm.overupfillcolor;
					} else {
						_selectCtx.strokeStyle = thisStyleForm.overdownstrokecolor;
						_selectCtx.fillStyle = thisStyleForm.overdownfillcolor;
					}
					_selectCtx.fillRect(overData.x, overData.y, overData.width, overData.height);
					_selectCtx.strokeRect(overData.x, overData.y, overData.width, overData.height);
				}
			}
			var tipleft = overData.x, tiptop = overData.y;
			if(overData.comp === "up") { //상승
				tiptop = tiptop + overData.height;
			} else { /*하락*/ }
			
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
					img_x = Math.round(_textX + (_data.width/2) - img_w/2), img_y = Math.round(_data._high - (img_h + 2));
					
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
					item.fillText(_text, Math.round(_textX + (_data.width / 2)), img_y - 2);
				} else {
					var _textX = _data.x;
					img_w = _styles.minvaluearrowimage.width, img_h = _styles.minvaluearrowimage.height;
					img_x = Math.round(_textX + (_data.width/2) -img_w/2), img_y = Math.round(_data._low + 2);
					
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
					item.fillText(_text, Math.round(_textX + (_data.width / 2)), img_y);
				}
				item.closePath();
			} else {}
		};
		// Styles getter
		var getStyles = function (_KEY, _name) {
			_name = _name.toLowerCase();
			var s = styles;
			if(_KEY !== "A") { s = s[_KEY]; }
			return s[_name];
		};
		// Styles use check - true | false
		var getUseStyles = function ( _styles, _name ) {
			if((_styles[_name] != undefined && _styles[_name] != "") || _styles[_name] == 0) return true;
			return false;
		};
		// Styles Extend
		var extendStyles = function (_styles, _default) {
			$.each(_default, function(_key, _val){
				if(!getUseStyles(_styles, _key)){ _styles[_key] = _val; }
			});
		};
		
		return _this;
	};
})(jQuery);