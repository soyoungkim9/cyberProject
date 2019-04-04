(function($) {
	DrawArea = function (_graphctx, _options, _styles, _param, _yAxis, _sizeObject) {
		var _this = this;
		
		var context = _graphctx;
		var options = _options, styles = _styles;
		this.series = _param.option.series;
		
		var defaultSeriesStyles = {
			"strokecolor": "#c42c1c",
			"strokewidth": 1,
			"fillcolor": "rgba(196,44,28,0.5)",
			"upstrokecolor": "#c42c1c",
			"downstrokecolor": "#2e80cc",
			"upfillcolor": "rgba(196,44,28,0.5)",
			"downfillcolor": "rgba(46,128,204,0.5)",
			"basestrokecolor": "#000000",
			"basestrokewidth": 1,
			"overfillcolor": "rgba(196,44,28,0.5)",
			"overstrokecolor": "#c42c1c",
			"overstrokewidth": 1, "overitemwidth": 3
		};
		
		var KEY = _param.option.key, DATA = $.extend(true, [], _param.data);//deepCopy(_param.data);
		var CHART_WIDTH  = _sizeObject.CHART_WIDTH,
			CHART_HEIGHT = _sizeObject.CHART_HEIGHT,
			CHART_TOP = _sizeObject.CHART_TOP;
		this.GRAPH_WIDTH  = _sizeObject.GRAPH_WIDTH,
		this.GRAPH_HEIGHT = _sizeObject.GRAPH_HEIGHT;
		var YAXIS = _yAxis;
		var BASE = _param.option.base;
		
		var thisStyles = styles[KEY], seriesForm = null;
		this.thisSeries = null;
		this.seriesData = [];
		
		this.drawSeries = function (_seriesForm) {
			seriesForm = _seriesForm;
			_this.thisSeries = _this.series[seriesForm];
			//extendStyles(thisStyles[seriesForm], defaultSeriesStyles); // STYLES UPDATE
			thisStyles[seriesForm] = $.extend(true, defaultSeriesStyles, thisStyles[seriesForm]);
			// x, y - data value matching
			_this.seriesData = parseData(DATA, seriesForm);
			
			var yLabelGap 	= getStyles(KEY, "ylabelgap"), yAxisAlign 	= getStyles(KEY, "yaxisalign"), yLabelAlign = getStyles(KEY, "ylabelalign");
			var yLabelPaddingRight = getStyles(KEY, "ylabelpaddingright"), yLabelPaddingLeft = getStyles(KEY, "ylabelpaddingleft");
			var graphPaddingLeftRight = getStyles(KEY, "graphpaddingright") + getStyles(KEY, "graphpaddingleft");
			
			var startX = getStyles(KEY, "canvaspaddingleft") + 0.5;
			if(yAxisAlign === "left"){ startX += yLabelGap + yLabelPaddingRight + yLabelPaddingLeft; }
			var startY = CHART_TOP + getStyles(KEY, "canvaspaddingtop") + getStyles(KEY, "mouseinfoheight") + 0.5;
			
			var count = _this.seriesData.length;
			var xGap = (_this.GRAPH_WIDTH - graphPaddingLeftRight) / count, xGapHalf = xGap / 2;
			
			var yAxisMax = YAXIS[YAXIS.length - 1], yAxisMin = YAXIS[0];
			var yAxisGap 	= yAxisMax - yAxisMin;
			
			var close = 0, i = 0, undefineFrontItem = -1, undefineBackItem = count;
			
			var dataValue = _this.seriesData[0], dataValueAfter = _this.seriesData[1];
//			var firstItem_x = startX + getStyles(KEY, "graphpaddingleft") + xGapHalf;
			var firstItem_x = 0;
			if(getStyles(KEY, "baseatstart")){
				xGap = _this.GRAPH_WIDTH / (count -1), xGapHalf = xGap / 2;
				firstItem_x = startX;
			} else {
				firstItem_x = startX + getStyles(KEY, "graphpaddingleft") + xGapHalf;
			}
			for(i = count; i --;){
				dataValue = _this.seriesData[i];
				if(dataValue.yaxis != undefined && dataValue.yaxis != null && dataValue.yaxis != ""){
					if(dataValue.minaxis != undefined){ // 최소값이 있는 경우
						if(dataValue.yaxis >= dataValue.minaxis){ dataValue.comp = "up"; } 
						else { dataValue.comp = "down"; }
					} else {
						if(dataValue.yaxis >= BASE){ dataValue.comp = "up"; } 
						else { dataValue.comp = "down"; }
					}
					
					close 	= _this.GRAPH_HEIGHT * ((yAxisMax - dataValue.yaxis) / yAxisGap);
					height	= _this.GRAPH_HEIGHT - close;
					
					dataValue.x = (xGap * i) + firstItem_x, dataValue.y = close + startY;
					
					dataValue.width = xGap, dataValue.height = height;
					
					if(dataValue.minaxis != undefined){
						var minClose 	= _this.GRAPH_HEIGHT * ((yAxisMax - dataValue.minaxis) / yAxisGap);
						var minHeight 	= _this.GRAPH_HEIGHT - minClose;
						
						dataValue.minY = minClose + startY, dataValue.height = minHeight;
					}
				} else if(undefineFrontItem < 0 && dataValue.xaxis != " ") {
					undefineFrontItem = i;
				} else {
					if(dataValue.xaxis == " ") undefineBackItem = i;
				}
			}
			var baseLine = _this.GRAPH_HEIGHT + startY;
			if(_this.series[seriesForm].form == "updown") {
				baseLine = (_this.GRAPH_HEIGHT * ((yAxisMax - BASE) / yAxisGap)) + startY;
			}
			
			var item = context;
			item.lineWidth = thisStyles[seriesForm].strokewidth;
			item.lineJoin = "round";
			item.strokeStyle = thisStyles[seriesForm].strokecolor;
			if(undefineFrontItem + 1 < undefineBackItem){
				item.moveTo(_this.seriesData[undefineFrontItem + 1].x, _this.seriesData[undefineFrontItem + 1].y);
				var comp = _this.seriesData[undefineFrontItem + 1].comp;
				var start = undefineFrontItem + 1, stop = 0;
				var crossMemo = new Object();
				// Normal
				if(_this.series[seriesForm].form != "updown" && _this.series[seriesForm].minaxis == undefined){ 
					item.beginPath();
					for(i = undefineFrontItem + 1; i < undefineBackItem; i ++){
						crossMemo = drawItemArea(i, count, baseLine, start, stop, comp, crossMemo, seriesForm, undefineFrontItem + 1);
					}
					item.closePath();
				} else {
				// updown, minaxis
					for(i = undefineFrontItem + 1; i < undefineBackItem; i ++){
						if(dataValue.minaxis != undefined){
							baseLine = _this.seriesData[i].minY;
						}
						if(comp == _this.seriesData[i].comp) {
							stop = i;
							if(i == undefineBackItem-1){
								item.beginPath();
								crossMemo = drawItemArea(i, undefineBackItem, baseLine, start, stop, comp, crossMemo, seriesForm, undefineFrontItem + 1);
								item.closePath();
							}
						} else {
							item.beginPath();
							crossMemo = drawItemArea(i, undefineBackItem, baseLine, start, stop, comp, crossMemo, seriesForm, undefineFrontItem + 1);
							item.closePath();
							comp = _this.seriesData[i].comp;
							stop = i, start = i;
							i--;
						}
					}
				}
			}
//			item.stroke();
			
			//BaseLine
			if(_this.series[seriesForm].form == "updown"){
				item.beginPath();
				item.strokeStyle 	= thisStyles[seriesForm].basestrokecolor;
				item.lineWidth 		= thisStyles[seriesForm].basestrokewidth;
				item.moveTo(_this.seriesData[0].x, baseLine + 0.5);
				item.lineTo(_this.seriesData[_this.seriesData.length - 1].x + 0.5, baseLine + 0.5);
				item.stroke();
				item.closePath();
			} 
		};
		
		var drawItemArea = function(i, _count, baseLine, start, stop, comp, crossMemo, _seriesForm, _undefineFrontItem){
			var item = context;
			var seriesDataObject = _this.seriesData[i];
			var seriesDataStartObject = _this.seriesData[start];
			var seriesDataStopObject = _this.seriesData[stop];
			var count = _count;
			if(_this.series[_seriesForm].form != "updown" && _this.series[_seriesForm].minaxis == undefined){
				if(i == _undefineFrontItem){ // Start
					item.strokeStyle 	= thisStyles[_seriesForm].strokecolor;
					item.fillStyle 		= thisStyles[_seriesForm].fillcolor;
					item.moveTo(seriesDataStartObject.x, baseLine);
					item.lineTo(seriesDataStartObject.x, seriesDataStartObject.y);
				} else if(i == count - 1) { // End
					item.lineTo(seriesDataObject.x, seriesDataObject.y);
					item.lineTo(seriesDataObject.x, baseLine);
					item.fill();
					if(thisStyles[_seriesForm].strokewidth > 0)item.stroke();
				} else {
					item.lineTo(seriesDataObject.x, seriesDataObject.y);
				}
			} else {
				if(_this.series[_seriesForm].form != "updown"){
					var cross = getPolyPoint (_this.seriesData[i - 1], seriesDataObject, seriesDataObject.comp);
					if(start == _undefineFrontItem){
						item.moveTo(seriesDataStartObject.x, baseLine);
						item.lineTo(seriesDataStartObject.x, seriesDataStartObject.minY);
					} else {
						if(crossMemo != null){
							item.moveTo(crossMemo.x, crossMemo.y);
						} else {
							item.moveTo(seriesDataStartObject.x, seriesDataStartObject.y);
						}
					}
					for(var j = start; j <= stop; j++){
						var seriesDataJ = _this.seriesData[j];
						item.lineTo(seriesDataJ.x, seriesDataJ.y);
					}
					if(cross != null && stop < count -1 ){
						item.lineTo(cross.x, cross.y);
						crossMemo = cross;
					} else { }
					
					for(var j = stop; j >= start; j--){
						var seriesDataJ = _this.seriesData[j];
						item.lineTo(seriesDataJ.x, seriesDataJ.minY);
					}
					
					if(comp == "up"){
						item.strokeStyle 	= thisStyles[_seriesForm].upstrokecolor;
						item.fillStyle 		= thisStyles[_seriesForm].upfillcolor;
					} else {
						item.strokeStyle 	= thisStyles[_seriesForm].downstrokecolor;
						item.fillStyle 		= thisStyles[_seriesForm].downfillcolor;
					}
					
					item.fill();
				} else {
					var cross = getCrossPoint({"x":_this.seriesData[i - 1].x, "y": _this.seriesData[i - 1].y}, 
											  {"x":seriesDataObject.x, "y": seriesDataObject.y}, baseLine);
					if(start == _undefineFrontItem){
						item.moveTo(seriesDataStartObject.x, baseLine);
						item.lineTo(seriesDataStartObject.x, seriesDataStartObject.y);
					} else {
						if(crossMemo != null){
							item.moveTo(crossMemo.x, crossMemo.y);
						} else {
							item.moveTo(seriesDataStartObject.x, seriesDataStartObject.y);
						}
					}
					for(var j = start; j <= stop; j++){
						var seriesDataJ = _this.seriesData[j];
						item.lineTo(seriesDataJ.x, seriesDataJ.y);
					}
					if(cross != null){
						item.lineTo(cross.x, cross.y);
						crossMemo = cross;
					} else {
						if(stop < count){
							crossMemo.x = seriesDataStopObject.x;
							crossMemo.y = seriesDataStopObject.y;
						}
					}
					
					if(comp == "up"){
						item.strokeStyle 	= thisStyles[_seriesForm].upstrokecolor;
						item.fillStyle 		= thisStyles[_seriesForm].upfillcolor;
					} else {
						item.strokeStyle 	= thisStyles[_seriesForm].downstrokecolor;
						item.fillStyle 		= thisStyles[_seriesForm].downfillcolor;
					}
					item.fill();
				}
				//item.stroke();
			}
			return crossMemo;
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
		
		var getPolyPoint = function( s, e, chk){
			var sX = s.x, sY1 = 0, sY2 = 0;
			var eX = e.x, eY1 = 0, eY2 = 0;
			if(chk == "up"){
				sY1 = s.minY, sY2 = e.minY;
				eY1 = s.y, eY2 = e.y;
			} else {
				sY1 = s.y, sY2 = e.y;
				eY1 = s.minY, eY2 = e.minY;
			}
			var k1 = (sY2 - sY1)/(eX - sX);
			var start = sY1 - (k1 * sX);
			var k2 = (eY2 - eY1)/(eX - sX);
			var end = eY1 - (k2 * sX);
			
			var FX = (end - start)/(k1 - k2);
			var FY = (k1 * FX) + start;
			
			return {"x": FX, "y": FY};
		};
		var parseData = function(_data, _seriesForm) {
			var data = [];
			var minaxisChk = (_this.thisSeries.minaxis != undefined && _this.thisSeries.minaxis != null) ? true : false;
			for(var i = _data.length; i--;){
				var obj = {};
				obj = _data[i];
				obj["xaxis"] = (obj)[_this.thisSeries["xaxis"]];
				obj["yaxis"] = (obj)[_this.thisSeries["yaxis"]];
				if(minaxisChk){ obj["minaxis"] = (obj)[_this.thisSeries["minaxis"]]; }
				data.unshift(obj);
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
					if(thisStyleForm.tickstyle == "rect"){
						_selectCtx.rect(overData.x-overticksize*0.75, overData.y-overticksize*0.75, overticksize*1.5, overticksize*1.5);
					} else if(thisStyleForm.tickstyle == "rhom") {
						_selectCtx.moveTo(overData.x - overticksize, overData.y);
						_selectCtx.lineTo(overData.x, overData.y + overticksize);
						_selectCtx.lineTo(overData.x + overticksize, overData.y);
						_selectCtx.lineTo(overData.x, overData.y - overticksize);
						_selectCtx.lineTo(overData.x - overticksize, overData.y);
					} else {
						_selectctx.arc(overData.x, overData.y, overticksize, 0, Math.PI * 2, false);
					}
					_selectCtx.fillStyle = thisStyleForm.overtickfillcolor;
					_selectCtx.fill();
					
					_selectCtx.lineWidth = thisStyleForm.overtickstrokewidth;
					if(thisStyleForm.overtickstrokewidth != 0){
						_selectCtx.strokeStyle = thisStyleForm.overtickstrokecolor;
						_selectCtx.stroke();
					}
				} else { // TICK STYLE이 없을 경우 - BASIC
					_selectCtx.arc(overData.x, overData.y, thisStyleForm.overitemwidth, 0, Math.PI * 2, false);
					_selectCtx.fillStyle = thisStyleForm.overfillcolor;
					_selectCtx.fill();
					
					_selectCtx.lineWidth = thisStyleForm.overstrokewidth;
					if(thisStyleForm.overstrokewidth != 0){
						_selectCtx.strokeStyle = thisStyleForm.overstrokecolor;
						_selectCtx.stroke();
					}
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
})(jQuery);