(function($) {
	DrawHloc = function (_graphctx, _etcctx, _options, _styles, _param, _yAxis, _sizeObject) {
		var _this = this;
		
		var context = _graphctx, etcctx = _etcctx;
		var options = _options, styles = _styles;
		this.series = _param.option.series;
		
		var defaultSeriesStyles = {
			"upfillcolor": "#ee695b",
			"upstrokecolor": "#c42c1c",
			"upstrokewidth": 1,
			"overupfillcolor": "#c42c1c",
			"overupstrokecolor": "#c42c1c",
			"overupstrokewidth": 1,
			"downfillcolor": "#65b9f8",
			"downstrokecolor": "#2e80cc",
			"downstrokewidth": 1,
			"overdownfillcolor": "#2e80cc",
			"overdownstrokecolor": "#2e80cc",
			"overdownstrokewidth": 1,
			"itemwidth": 60,
			"useaccessibility": false,
			"usemaxvalue": false,
			"useminvalue": false,
			"maxvaluefontstyle": "12px 'dotum'",
			"maxvaluefontcolor": "#dd4242",
			"maxvaluearrowimage": null,
			"minvaluefontstyle": "12px 'dotum'",
			"minvaluefontcolor": "#428dd3",
			"minvaluearrowimage": null
		};
		var KEY = _param.option.key, DATA = $.extend(true, [], _param.data);
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
//			extendStyles(thisStyles[seriesForm], defaultSeriesStyles); // STYLES UPDATE
			// x, y - data value matching
			_this.seriesData = parseData(DATA);
			
			var yLabelGap 	= getStyles(KEY, "ylabelgap");
			var yAxisAlign 	= getStyles(KEY, "yaxisalign"), yLabelAlign = getStyles(KEY, "ylabelalign");
			var yLabelPaddingRight = getStyles(KEY, "ylabelpaddingright"), yLabelPaddingLeft = getStyles(KEY, "ylabelpaddingleft");
			
			var startX = getStyles(KEY, "canvaspaddingleft") + 0.5;
			if(yAxisAlign === "left"){
				startX += yLabelGap + yLabelPaddingRight + yLabelPaddingLeft;
			}
			var startY = CHART_TOP + getStyles(KEY, "canvaspaddingtop") + getStyles(KEY, "mouseinfoheight") + 0.5;
			var yAxisMax = YAXIS[YAXIS.length - 1];
			var yAxisMin = YAXIS[0];
			
			var graphPaddingLeftRight = getStyles(KEY, "graphpaddingright") + getStyles(KEY, "graphpaddingleft");
			
			var count = _this.seriesData.length;
			var xGap = (_this.GRAPH_WIDTH - graphPaddingLeftRight) / count, xGapHalf	= Math.ceil(xGap / 2);
			var xPdn = (xGap - (xGap * (Number(thisStyles[seriesForm].itemwidth) / 100))); 
			
			var yAxisGap 	= yAxisMax - yAxisMin;
			var open = 0, high = 0, low = 0, close = 0, height = 0;
			var i = 0, j = 0;
			var dataValue = _this.seriesData[0];
			var firstItem_x = startX + getStyles(KEY, "graphpaddingleft") + xGapHalf;
			var w = Math.round((xGap - xPdn));
			if(w <= 0) w = 0.5;
			
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
				
				var x = dataValue.x = Math.floor(xGap * i) +firstItem_x;
				dataValue.width = w;
				
				dataValue.y = open;
				dataValue.height = Math.floor(height) ;
				dataValue._high = high;
				dataValue._low = low;
				if(open >= close) {
					dataValue.comp = "up";
				} else {
					dataValue.comp = "down";
				}
				item.beginPath();
				if(open >= close) {  // solid
					item.strokeStyle 	= thisStyles[seriesForm].upstrokecolor;
				} else {
					item.strokeStyle 	= thisStyles[seriesForm].downstrokecolor;
				}
				item.moveTo(x, high);
				item.lineTo(x, low);
				item.moveTo(x, open);
				item.lineTo(x - (w/2), open);
				item.moveTo(x, close);
				item.lineTo(x + (w/2), close);
				
				if(thisStyles[seriesForm].useaccessibility){
					if(dataValue.xaxis == " ") continue;
					var itemX = Math.floor(x - (w/2)), itemW = Math.floor(x + (w/2));
					var _accessY = _this.GRAPH_HEIGHT - 0.5, _accessW = itemW - itemX, _accessHalf = Math.round(_accessW / 2);
					if(open >= close) {
						item.moveTo(x, 	_accessY);
						item.lineTo(x, 	_accessY + _accessW);
						item.moveTo(itemX, 	_accessY + _accessHalf);
						item.lineTo(itemW, 	_accessY + _accessHalf);
					} else {
						item.moveTo(itemX,	_accessY + _accessHalf);
						item.lineTo(itemW, 	_accessY + _accessHalf);
					}
				}
				item.stroke();
				item.closePath();
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
			for(var i = _data.length; i--;){
				var obj = {};
				obj = _data[i];
				obj["xaxis"] = (obj)[_this.thisSeries["xaxis"]];
				obj["open"] = (obj)[_this.thisSeries["open"]];
				obj["high"] = (obj)[_this.thisSeries["high"]];
				obj["low"] = (obj)[_this.thisSeries["low"]];
				obj["close"] = (obj)[_this.thisSeries["close"]];
				if(options.usestock && _this.thisSeries.stockmain){
					if(obj.high != undefined) {
						var nHigh = obj.high;
						if(_max <= nHigh) {
							_max = nHigh;
							_this.maxItem = obj;
						}
					}
					if(obj.low != undefined) {
						var nLow = obj.low;
						if(_min >= nLow) {
							_min = nLow;
							_this.minItem = obj;
						}
					}
				}
				data.unshift(obj);
			}
			return data;
		};
		
		this.onMouseMove = function(_item, _selectCtx, dObj){
			var overData = _this.seriesData[_item.index];
			if(options.useselectitem){
				_selectCtx.clearRect(0, 0, _selectCtx.canvas.width, _selectCtx.canvas.height);
				var thisStyleForm = thisStyles[seriesForm];
				_selectCtx.lineWidth = thisStyles[seriesForm].overupstrokewidth + 1;
				if((typeof(thisStyleForm.overupfillcolor)).toLowerCase() === 'object') { 
					if((thisStyleForm.overupfillcolor).src != undefined) { //IMAGE
						var style;
						
					} else { //Gradient
						
					}
				} else { //Solid
					if(overData.height <= 0) {
						_selectCtx.strokeStyle = thisStyleForm.overupstrokecolor;
						_selectCtx.fillStyle = thisStyleForm.overupfillcolor;
					} else {
						_selectCtx.strokeStyle = thisStyleForm.overdownstrokecolor;
						_selectCtx.fillStyle = thisStyleForm.overdownfillcolor;
					}
					if(overData.comp === "up")
						_selectCtx.strokeRect(overData.x, overData._low, 0, overData._high - overData._low);
					else
						_selectCtx.strokeRect(overData.x, overData._high, 0, overData._low - overData._high);
				}
			}
			var tipleft = overData.x, tiptop = overData._high;
			
			var obj = {};
			obj.text = _item.series.label;
			obj.top  = tiptop;
			obj.left = tipleft;
			obj.item = dObj;
			
			return obj;
		};
		
		/*var drawValue = function(stat, _data, _styles) {
			var item = etcctx;
			if(_styles.maxvaluearrowimage != null || _styles.minvaluearrowimage != null){
				var img_y = 0;
				item.font = (stat == "max") ? 		_styles.maxvaluefontstyle : _styles.minvaluefontstyle;
				item.fillStyle = (stat == "max") ? 	_styles.maxvaluefontcolor : _styles.minvaluefontcolor;
				item.textAlign = "center";
				item.textBaseline = "top";
				item.beginPath();
				var xdata = _data.xaxis.toString();
				xdata = xdata.substr(xdata.length - 4, 4);
				var _x = Math.round(_data.x -_styles.maxvaluearrowimage.width/2);
				if(stat == "max"){
					img_y = Math.round(_data._high - (_styles.maxvaluearrowimage.height + 2));
					item.drawImage(valueMaxImage, _styles.maxvaluearrowimage.left, _styles.maxvaluearrowimage.top, _styles.maxvaluearrowimage.width, _styles.maxvaluearrowimage.height, _x, img_y, _styles.maxvaluearrowimage.width, _styles.maxvaluearrowimage.height);
					var _text = ("최고"+_data.high.toString().format()+" ("+xdata.dateFormat()+")");
					var _textWHalf = Number(item.measureText(_text).width / 2);
					var _textX = Number(_data.x);
					if(_textX - _textWHalf < getStyles(KEY, "graphpaddingleft")){
						_textX = _textX + Math.abs(_textX - _textWHalf) + getStyles(KEY, "graphpaddingleft");
					} else if(_textX + _textWHalf > _this.GRAPH_WIDTH){
						_textX = _textX - ((_textX + _textWHalf) - _this.GRAPH_WIDTH); 
					}
					item.fillText(_text, _textX, img_y - 15);
				} else {
					_x = Math.round(_data.x + (_data.width/2) -_styles.minvaluearrowimage.width/2);
					img_y = Math.round(_data._low + 2);
					item.drawImage(valueMinImage, _styles.minvaluearrowimage.left, _styles.minvaluearrowimage.top, _styles.minvaluearrowimage.width, _styles.minvaluearrowimage.height, _x, img_y, _styles.minvaluearrowimage.width, _styles.minvaluearrowimage.height);
					var _text = ("최저"+_data.low.toString().format()+" ("+xdata.dateFormat()+")");
					var _textWHalf = Number(item.measureText(_text).width / 2);
					var _textX = Number(_data.x);
					if(_textX - _textWHalf < getStyles(KEY, "graphpaddingleft")){
						_textX = _textX + Math.abs(_textX - _textWHalf) + getStyles(KEY, "graphpaddingleft");
					} else if(_textX + _textWHalf > _this.GRAPH_WIDTH){
						_textX = _textX - ((_textX + _textWHalf) - _this.GRAPH_WIDTH); 
					}
					item.fillText(_text, _textX, img_y + 12);
				}
				item.closePath();
			} else {}
		};*/
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
//					if(_textX - _textWHalf < getStyles(KEY, "graphpaddingleft")){
//						_textX = _textX + Math.abs(_textX - _textWHalf) + getStyles(KEY, "graphpaddingleft");
//					} else if(_textX + _textWHalf > _this.GRAPH_WIDTH){
//						_textX = _textX - ((_textX + _textWHalf) - _this.GRAPH_WIDTH); 
//					}
					if(_textX < getStyles(KEY, "graphpaddingleft")){
						_textX = _textX + _textWHalf + getStyles(KEY, "graphpaddingleft");
					} else if(_textX + (_textWHalf * 2) > _this.GRAPH_WIDTH){
						_textX = _textX - _textWHalf - 5; 
					} else {
						_textX = _textX + _textWHalf + 7;
					}
					item.fillText(_text, _textX, img_y - 2);
				} else {
					var _textX = _data.x;
					img_w = _styles.minvaluearrowimage.width, img_h = _styles.minvaluearrowimage.height;
					img_x = Math.round(_textX -img_w/2), img_y = Math.round(_data._low + 2);
					
					item.font = _styles.minvaluefontstyle;
					item.fillStyle = _styles.minvaluefontcolor;
					
					item.drawImage(valueMinImage, _styles.minvaluearrowimage.left, _styles.minvaluearrowimage.top, img_w, img_h, img_x, img_y, img_w, img_h);
					var _text = ("최저"+_data.low.toString().format()+" ("+xdata.dateFormat()+")");
					var _textWHalf = Number(item.measureText(_text).width / 2);
//					if(_textX - _textWHalf < getStyles(KEY, "graphpaddingleft")){
//						_textX = _textX + Math.abs(_textX - _textWHalf) + getStyles(KEY, "graphpaddingleft");
//					} else if(_textX + _textWHalf > _this.GRAPH_WIDTH){
//						_textX = _textX - ((_textX + _textWHalf) - _this.GRAPH_WIDTH); 
//					}
					if(_textX < getStyles(KEY, "graphpaddingleft")){
						_textX = _textX + _textWHalf + getStyles(KEY, "graphpaddingleft");
					} else if(_textX + (_textWHalf * 2) > _this.GRAPH_WIDTH){
						_textX = _textX - _textWHalf - 5; 
					} else {
						_textX = _textX + _textWHalf + 7;
					}
					item.fillText(_text, _textX, img_y);
				}
				item.closePath();
			} else {}
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
		
		// Styles use check - true | false
		var getUseStyles = function ( _styles, _name ) {
			if(_styles[_name] != undefined && _styles[_name] != "")
				return true;
			return false;
		};
		
		// Styles Extend
		var extendStyles = function (_styles, _default) {
			$.each(_default, function(_key, _val){
				if(!getUseStyles(_styles, _key)){
					_styles[_key] = _val;
				}
			});
		};
		
		return _this;
	};
})(jQuery);