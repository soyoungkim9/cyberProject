	DrawPlot = function (_graphctx, _options, _styles, _param, _yAxis, _sizeObject) {
		var _this = this;

		var context = _graphctx;
		var options = _options, styles = _styles;
		this.series = _param.option.series;
		
		var defaultSeriesStyles = {
			"strokecolor": "#7433c5",
			"strokewidth": 1,
			"fillcolor": "#ac59ff",
			"overstrokecolor": "#7433c5",
			"overstrokewidth": 1,
			"overfillcolor": "#7433c5",
			"form": "rect",
			"radius": 2,
			"itemwidth": 60
		};
		
		var KEY = _param.option.key, DATA = $.extend(true, [], _param.data);//deepCopy(_param.data);
		var CHART_WIDTH  = _sizeObject.CHART_WIDTH,
			CHART_HEIGHT = _sizeObject.CHART_HEIGHT,
			CHART_TOP = _sizeObject.CHART_TOP,
			GRAPH_WIDTH  = _sizeObject.GRAPH_WIDTH,
			GRAPH_HEIGHT = _sizeObject.GRAPH_HEIGHT;
		var YAXIS = _yAxis;
		var BASE = _param.option.base;
		
		var thisStyles = styles[KEY], seriesForm = null;
		this.thisSeries = null;
		this.seriesData = [];
		
		var itemRenderer = new DrawPlotSkin(context);
		
		this.drawSeries = function (_seriesForm) {
			seriesForm = _seriesForm;
			_this.thisSeries = _this.series[seriesForm];
			thisStyles[seriesForm] = $.extend(true, defaultSeriesStyles, thisStyles[seriesForm]);
			
			_this.seriesData = parseData(DATA);
			
			var strokeX = thisStyles[seriesForm].strokewidth != 0 ? 0.5 : 0;
			
			var yLabelGap 	= getStyles(KEY, "ylabelgap"), yAxisAlign 	= getStyles(KEY, "yaxisalign");
			var yLabelPadR = getStyles(KEY, "ylabelpaddingright"), yLabelPadL = getStyles(KEY, "ylabelpaddingleft");
			var graphPadLR = getStyles(KEY, "graphpaddingright") + getStyles(KEY, "graphpaddingleft");
			
			var startX = getStyles(KEY, "canvaspaddingleft") + 0.5;
			if(yAxisAlign === "left"){ startX += yLabelGap + yLabelPadR + yLabelPadL; }
			var startY = CHART_TOP + getStyles(KEY, "canvaspaddingtop") + getStyles(KEY, "mouseinfoheight") + 0.5;
			
			var yAxisMax = YAXIS[YAXIS.length - 1], yAxisMin = YAXIS[0];
			var count = _this.seriesData.length;
			var xGap = (GRAPH_WIDTH - graphPadLR) / count, xGapHalf = Math.ceil(xGap / 2);
			var xPdn = (xGap - (xGap * (Number(thisStyles[seriesForm].itemwidth) / 100))); 
			var radius = thisStyles[seriesForm].radius, // 반지름
				diameter  = Math.round(radius * 2); // 지름
			if(options.usestock){
				diameter = Math.round((xGap - xPdn)), radius = Math.round(diameter / 2);
			}
			
			
			var yAxisGap 	= yAxisMax - yAxisMin;
			var close = 0, i = 0, undefineFrontItem = -1, undefineBackItem = count;
			
			var dataValue = _this.seriesData[0], dataValueAfter = _this.seriesData[1];
			var firstItem_x = startX + getStyles(KEY, "graphpaddingleft") + xGapHalf;
			for(i = count; i --;){
				dataValue = _this.seriesData[i];
				if(dataValue.yaxis != undefined && dataValue.yaxis != null && dataValue.yaxis != ""){
					if(Number(dataValue.yaxis) >= BASE){
						dataValue.comp = "up";
					} else {
						dataValue.comp = "down";
					}
					
					close 	= GRAPH_HEIGHT * ((yAxisMax - dataValue.yaxis) / yAxisGap) + startY;
					
					dataValue.x = Math.floor((xGap * i) - radius) +firstItem_x;// - radius;// + strokeX;
					dataValue.y = Math.round(close - radius) + 0.5;// - radius;// + strokeX;
					
					dataValue.width = diameter;
					dataValue.height = diameter;
					
					unBackItemCheck = true;
				} else if(undefineFrontItem < 0 && dataValue.xaxis != " ") {
					undefineFrontItem = i;
				} else {
					if(dataValue.xaxis == " ") undefineBackItem = i;
				}
			}
			
			var item = context;
			item.lineJoin = "miter";
			if(thisStyles[seriesForm].strokewidth == 0){
				item.lineWidth = thisStyles[seriesForm].strokewidth;
				item.strokeStyle = "rgba(255,255,255,0)";
			} else {
				item.lineWidth = thisStyles[seriesForm].strokewidth;
				item.strokeStyle = thisStyles[seriesForm].strokecolor;
			}
			item.fillStyle = thisStyles[seriesForm].fillcolor;
//			item.beginPath();
			
			if(undefineFrontItem + 1 < count){
				if(thisStyles[seriesForm].form == "dot") thisStyles[seriesForm].PI = Math.PI * 2;
				var ir = itemRenderer[thisStyles[seriesForm].form];
				for(i = undefineFrontItem+ 1; i < undefineBackItem; i ++){
					dataValue = _this.seriesData[i];
//					if(thisStyles[seriesForm].form == "square"){
//						item.moveTo(dataValue.x, dataValue.y);
//						item.lineTo(dataValue.x + dataValue.width, dataValue.y);
//						item.lineTo(dataValue.x + dataValue.width, dataValue.y + dataValue.height);
//						item.lineTo(dataValue.x, dataValue.y + dataValue.height);
//						item.lineTo(dataValue.x, dataValue.y);
						ir(dataValue, thisStyles[seriesForm]);
//					}
				}
			}
//			item.fill();
//			item.stroke();
//			item.closePath();
		};
		
		var parseData = function(_data) {
			var data = [];
			for(var i = _data.length; i--;){
				var obj = {};
				obj = _data[i];
				obj["xaxis"] = (obj)[_this.thisSeries["xaxis"]];
				obj["yaxis"] = (obj)[_this.thisSeries["yaxis"]];
				data.unshift(obj);
			}
			return data;
		};
		
		this.onMouseMove = function(_item, _selectCtx, dObj){
			var overData = _this.seriesData[_item.index];
			if(options.useselectitem){
				_selectCtx.clearRect(0, 0, _selectCtx.canvas.width, _selectCtx.canvas.height);
				var thisStyleForm = thisStyles[seriesForm];
				_selectCtx.lineWidth = thisStyleForm.overstrokewidth;
				if((typeof(thisStyleForm.overupfillcolor)).toLowerCase() === 'object') { 
					if((thisStyleForm.overupfillcolor).src != undefined) { //IMAGE
						var style;
						
					} else { //Gradient
						
					}
				} else { //Solid
					_selectCtx.strokeStyle = thisStyleForm.overstrokecolor;
					_selectCtx.fillStyle = thisStyleForm.overfillcolor;
					
					var ir = itemRenderer[thisStyleForm.form];
					ir(overData, thisStyleForm, _selectCtx);
					/*_selectCtx.fillRect(overData.x, overData.y, overData.width, overData.height);
					if(thisStyleForm.overstrokewidth != 0)
						_selectCtx.strokeRect(overData.x, overData.y, overData.width, overData.height);*/
				}
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
			if((_styles[_name] != undefined && _styles[_name] != "") || _styles[_name] == 0)
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
