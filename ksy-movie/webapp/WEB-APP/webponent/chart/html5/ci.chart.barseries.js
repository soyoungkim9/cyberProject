(function($) {
	DrawBar = function (_graphctx, _options, _styles, _param, _xAxis, _sizeObject, _seriesColumnCount, _seriesColumnIndex) {
		var _this = this;
		
		var context = _graphctx;
		var options = _options, styles = _styles;
		this.series = _param.option.series;
		
		var defaultSeriesStyles = {
			"fillcolor": "#abe55c",
			"strokecolor": "#77bf10",
			"strokewidth": 1,
			"overfillcolor": "#77bf10",
			"overstrokecolor": "#77bf10",
			"overstrokewidth": 1,
			"itemwidth": 60,
			"upstrokecolor": "#c42c1c",
			"downstrokecolor": "#2e80cc",
			"upfillcolor": "rgba(196,44,28,0.5)",
			"downfillcolor": "rgba(46,128,204,0.5)",
			"basestrokecolor": "#000000",
			"basestrokewidth": 1,
			"useitemvalue": false,
			"itemvaluecolor": "#cccccc", "itemvaluestyle": "11px dotum"
		};
		var KEY = _param.option.key, DATA = $.extend(true, [], _param.data);
		var CHART_WIDTH  = _sizeObject.CHART_WIDTH,
			CHART_HEIGHT = _sizeObject.CHART_HEIGHT,
			CHART_TOP = _sizeObject.CHART_TOP,
			GRAPH_WIDTH  = _sizeObject.GRAPH_WIDTH,
			GRAPH_HEIGHT = _sizeObject.GRAPH_HEIGHT;
		var XAXIS = _xAxis;
		var BASE = _param.option.base;
		var PREV_DATA = _sizeObject.PREV_DATA;
		
		var thisStyles = styles[KEY], seriesForm = null;
		this.thisSeries = null;
		var seriesColumnCount = (_seriesColumnCount == 0) ? 1: _seriesColumnCount, 
			seriesColumnIndex = _seriesColumnIndex;
		this.seriesData = [];
		var fillImage = null, upfillImage = null, downfillImage = null, itemfillImages = [];
		this.drawSeries = function (_seriesForm) {
			seriesForm = _seriesForm;
			_this.thisSeries = _this.series[seriesForm];
			thisStyles = $.extend(true, defaultSeriesStyles, thisStyles[seriesForm]);
			// x, y - data value matching
			_this.seriesData = parseData(DATA);
			
			if(thisStyles.fillcolor.src != undefined || thisStyles.itemfillcolors != undefined){ // Gradient
				if(thisStyles.itemfillcolors == undefined){
					fillImage = new Image();
					fillImage.onload = function(){
						draw();
					};
					fillImage.src = thisStyles.fillcolor.src;
				} else {
					var itemCheck = thisStyles.itemfillcolors.length;
					for(var k = thisStyles.itemfillcolors.length; k--;){
						var obj = thisStyles.itemfillcolors[k];
						if(obj.src == undefined){
							itemfillImages[k] = null;
						} else {
							var img = new Image();
							itemfillImages[k] = img;
							img.src = obj.src;
						}
					}
					draw();
				}
			} else if(thisStyles.upfillcolor.src != undefined || thisStyles.downfillcolor.src != undefined){
				
			} else {
				draw();
			}
		};
		var draw = function(){
			var yLabelGap 	= getStyles(KEY, "ylabelgap");
			var yAxisAlign 	= getStyles(KEY, "yaxisalign"), yLabelAlign = getStyles(KEY, "ylabelalign");
			var yLabelPaddingRight = getStyles(KEY, "ylabelpaddingright"), yLabelPaddingLeft = getStyles(KEY, "ylabelpaddingleft");
			
			var startX = getStyles(KEY, "canvaspaddingleft") + 0.5;
			if(yAxisAlign === "left"){
				startX += yLabelGap + yLabelPaddingRight + yLabelPaddingLeft;
			}else{
				startX = GRAPH_WIDTH + getStyles(KEY, "canvaspaddingleft") - 0.5;
			}
			GRAPH_WIDTH =  GRAPH_WIDTH - getStyles(KEY, "graphpaddingleft") - getStyles(KEY, "graphpaddingright");
			var startY = CHART_TOP + getStyles(KEY, "canvaspaddingtop") + getStyles(KEY, "graphpaddingtop") + getStyles(KEY, "mouseinfoheight") + 0.5;
			var xAxisMax = XAXIS[XAXIS.length - 1];
			var xAxisMin = XAXIS[0];
			
			var graphPaddingTopBottom = getStyles(KEY, "graphpaddingtop") + getStyles(KEY, "graphpaddingbottom");
			GRAPH_HEIGHT = GRAPH_HEIGHT - graphPaddingTopBottom;
			
			var count = _this.seriesData.length;
			var yGap = (GRAPH_HEIGHT) / count, yGapHalf	= Math.ceil(yGap / 2);
			var yPdn = (yGap - (yGap * (Number(thisStyles.itemwidth) / 100))); 
			
			var xAxisGap 	= xAxisMax - xAxisMin;
			if(getStyles(KEY, "baseatzero") == true){
				BASE = 0;
			}
			var baseLine = startX;
			if(_this.series[seriesForm].form == "updown") {
				baseLine = (yAxisAlign === "left")?GRAPH_WIDTH + baseLine-(GRAPH_WIDTH * ((xAxisMax - BASE) / xAxisGap)) -0.5:(GRAPH_WIDTH * ((xAxisMax - BASE) / xAxisGap))-0.5;
			}
			if(baseLine%1!= 0.5){baseLine = Math.floor(baseLine) + 0.5;}
			var close = 0, width = 0;
			var i = 0, j = 0;
			var dataValue = _this.seriesData[0];
			var firstItem_y =  startY + yGapHalf;
			var w = Math.round((yGap - yPdn) / seriesColumnCount);
			if(w <= 0) w = 0.5;
			if(options.type != null && options.type == "overlaid"||options.type == "stacked"){seriesColumnIndex = 0;}
			if(_this.thisSeries.form == "stacked" && _this.thisSeries.yaxisid == undefined){ seriesColumnIndex = 0;}
			var gap = Math.floor((w * seriesColumnIndex) - (w * seriesColumnCount/2)) + firstItem_y;// + (w * seriesColumnIndex);
			var item = context;
			item.lineWidth 		= thisStyles.strokewidth;
			for(i = count; i --;){
				dataValue = _this.seriesData[i];
				if(dataValue.xaxis == " " || dataValue.xaxis == "") continue;
				if(dataValue.minaxis == undefined){ // 최소값이 없는 경우
					if(Number(dataValue.yaxis) >=  BASE) dataValue.comp = "up";
					else dataValue.comp = "down";
				} else { // 최소값이 있는 경우
					if(Number(dataValue.yaxis) >= dataValue.minaxis) dataValue.comp = "up";
					else dataValue.comp = "down";
				}
				
				close 	= (yAxisAlign === "left")? 
						Math.floor(((dataValue.yaxis-xAxisMin)/xAxisGap)*GRAPH_WIDTH)+ startX-0.5:
						GRAPH_WIDTH + getStyles(KEY, "canvaspaddingleft") - 0.5 - Math.floor(((dataValue.yaxis-xAxisMin)/xAxisGap)*GRAPH_WIDTH);
				var min = 0;
				if(_this.thisSeries.minaxis != undefined){
					min = Math.floor(((dataValue.minaxis-xAxisMin)/xAxisGap)*GRAPH_WIDTH)-0.5;
				}
				if(_this.series[seriesForm].form == "updown"){
					width	= close - baseLine;
					dataValue.x = baseLine;
				} else {
					width	= close - startX - min;
					dataValue.x = startX + min;
					if(PREV_DATA != undefined  && _this.thisSeries.form == "stacked") {
						width	= close - startX - min;
						dataValue.x = min + PREV_DATA[i].x + PREV_DATA[i].width;
					}
				}
				//dataValue.x = close;// + canvasYPosition;
				dataValue.y = Math.floor(yGap * i) + gap + 0.5;
				dataValue.width = Math.round(width);
				
				dataValue.height = (seriesColumnCount <= 1) ? w: w -1;
				if(thisStyles.itemfillcolors == undefined){
					if((typeof(thisStyles.fillcolor)).toLowerCase() == 'object' || (typeof(thisStyles.upfillcolor)).toLowerCase() == 'object' || (typeof(thisStyles.downfillcolor)).toLowerCase() == 'object'){ // Gradient
						var fillObject = thisStyles.fillcolor;
						var gradient = null;
						if(thisStyles.gradientdirection != "vertical") gradient = item.createLinearGradient(dataValue.x, dataValue.y, dataValue.x+ dataValue.width, dataValue.y);
						else gradient = item.createLinearGradient(dataValue.x, dataValue.y, dataValue.x, dataValue.y + dataValue.height - 2);
	
						if(_this.series[seriesForm].form != "updown"){
							if(thisStyles.fillcolor.src != undefined) fillObject = fillObject.fill;
						} else {
							if(dataValue.comp == "up"){
								if(thisStyles.upfillcolor.src == undefined) fillObject = thisStyles.upfillcolor;
								else fillObject = fillObject.fill;
							} else {
								if(thisStyles.downfillcolor.src == undefined) fillObject = thisStyles.downfillcolor;
								else fillObject = fillObject.fill;
							}
						}
						for(j = 0; j < fillObject.length; j++)
							gradient.addColorStop(fillObject[j][0], fillObject[j][1]);
						item.fillStyle = gradient;
						if(thisStyles.strokewidth) item.strokeStyle 	= thisStyles.strokecolor;
					} else {
						if(_this.series[seriesForm].form != "updown"){
							item.strokeStyle = thisStyles.strokecolor;
							item.fillStyle = thisStyles.fillcolor;
						} else {
							if(dataValue.comp == "up"){
								item.strokeStyle = thisStyles.upstrokecolor;
								item.fillStyle 	 = thisStyles.upfillcolor;
							} else {
								item.strokeStyle = thisStyles.downstrokecolor;
								item.fillStyle 	 = thisStyles.downfillcolor;
							}
						}
					}
				} else {
					var obj = thisStyles.itemfillcolors[i];
					if((typeof(obj)).toLowerCase() == 'object'){ // Gradient
						var fillObject = obj;
						var gradient = null;
						if(thisStyles.gradientdirection != "vertical") item.createLinearGradient(dataValue.x, dataValue.y, dataValue.x+ dataValue.width, dataValue.y);
						else gradient = item.createLinearGradient(dataValue.x, dataValue.y, dataValue.x, dataValue.y + dataValue.height - 2);
	
						if(_this.series[seriesForm].form != "updown"){
							if(fillObject.src != undefined) fillObject = fillObject.fill;
						} else {
							if(dataValue.comp == "up"){
								if(thisStyles.upfillcolor.src == undefined) fillObject = thisStyles.upfillcolor;
								else fillObject = obj.fill;
							} else {
								if(thisStyles.downfillcolor.src == undefined) fillObject = thisStyles.downfillcolor;
								else fillObject = obj.fill;
							}
						}
						for(j = 0; j < fillObject.length; j++)
							gradient.addColorStop(fillObject[j][0], fillObject[j][1]);
						item.fillStyle = gradient;
						if(thisStyles.strokewidth) item.strokeStyle 	= thisStyles.strokecolor;
					} else {
						if(_this.series[seriesForm].form != "updown"){
							item.strokeStyle = thisStyles.strokecolor;
							item.fillStyle = thisStyles.fillcolor;
						} else {
							if(dataValue.comp == "up"){
								item.strokeStyle = thisStyles.upstrokecolor;
								item.fillStyle 	 = thisStyles.upfillcolor;
							} else {
								item.strokeStyle = thisStyles.downstrokecolor;
								item.fillStyle 	 = thisStyles.downfillcolor;
							}
						}
					}
				}
				item.beginPath();
				item.moveTo(dataValue.x, dataValue.y);
				item.lineTo(dataValue.x + dataValue.width, dataValue.y);
				item.lineTo(dataValue.x + dataValue.width, dataValue.y + dataValue.height - 1);
				item.lineTo(dataValue.x, dataValue.y + dataValue.height - 1);
				item.fill();
				item.closePath();
				if(thisStyles.strokewidth != 0){
					item.strokeRect(dataValue.x, dataValue.y - 0.5, dataValue.width, dataValue.height - 1);
				}
				if(thisStyles.itemfillcolors == undefined){
					if(thisStyles.fillcolor.src != undefined || thisStyles.upfillcolor.src != undefined || thisStyles.downfillcolor.src != undefined){ // Gradient
						if(_this.series[seriesForm].form != "updown"){
							if(PREV_DATA != undefined  && _this.thisSeries.form == "stacked") {
								item.drawImage(fillImage, 0, 0, dataValue.width, dataValue.height, PREV_DATA[i].x + PREV_DATA[i].width, dataValue.y, dataValue.width, dataValue.height - 1);
							} else {
								item.drawImage(fillImage, 0, 0, dataValue.width, dataValue.height, startX, dataValue.y, dataValue.width, dataValue.height - 1);
							}
						} else {
							if(_data.comp == "up"){
								item.drawImage(upfillImage, 0, 0, dataValue.width, dataValue.height, dataValue.x, dataValue.y, dataValue.width, dataValue.height);
							} else {
								item.drawImage(downfillImage, 0, 0, dataValue.width, dataValue.height, dataValue.x, dataValue.y, dataValue.width, dataValue.height);
							}
						}
					}
				} else {
//					for(var k = itemfillImages.length;k--;){
						if(itemfillImages[i] != null) {
							if(_this.series[seriesForm].form != "updown"){
								if(dataValue.width > 0){
									if(PREV_DATA != undefined  && _this.thisSeries.form == "stacked") {
										item.drawImage(itemfillImages[i], 0, 0, dataValue.width, dataValue.height, PREV_DATA[i].x + PREV_DATA[i].width, dataValue.y, dataValue.width, dataValue.height - 1);
									} else {
										item.drawImage(itemfillImages[i], 0, 0, dataValue.width, dataValue.height, startX, dataValue.y, dataValue.width, dataValue.height - 1);
									}
								}
							} else {
								if(_data.comp == "up"){
									item.drawImage(itemfillImages[i], 0, 0, dataValue.width, dataValue.height, dataValue.x, dataValue.y, dataValue.width, dataValue.height);
								} else {
									item.drawImage(itemfillImages[i], 0, 0, dataValue.width, dataValue.height, dataValue.x, dataValue.y, dataValue.width, dataValue.height);
								}
							}
						}
//					}
//					var obj = thisStyles.itemfillcolors[i];
//					if(obj.src != undefined){ // Gradient
//						var img = new Image();
//						img.onload = function(){
//							if(_this.series[seriesForm].form != "updown"){
//								item.drawImage(img, 0, 0, dataValue.width, dataValue.height, startX, dataValue.y, dataValue.width, dataValue.height - 1);
//							} else {
//								if(_data.comp == "up"){
//									item.drawImage(img, 0, 0, dataValue.width, dataValue.height, dataValue.x, dataValue.y, dataValue.width, dataValue.height);
//								} else {
//									item.drawImage(img, 0, 0, dataValue.width, dataValue.height, dataValue.x, dataValue.y, dataValue.width, dataValue.height);
//								}
//							}
//						};
//						img.src = obj.src;
//					}
				}
				if(thisStyles.useitemvalue) {
					item.beginPath();
					item.textAlign = "left", item.textBaseline = "middle";
					item.fillStyle = thisStyles.itemvaluecolor;
					item.font = thisStyles.itemvaluestyle;
					if(_this.thisSeries.form == "stacked") {
						item.textAlign = "center";
						item.fillText(String(dataValue.yaxis).format(), dataValue.x + dataValue.width - (dataValue.width/2), dataValue.y + (dataValue.height / 2));
					} else {
						item.fillText(String(dataValue.yaxis).format(), dataValue.x + dataValue.width + 5, dataValue.y + (dataValue.height / 2));
					}
					item.fill();
					item.closePath();
				}
			}
			
			//BaseLine
			if(_this.series[seriesForm].form == "updown"){
				item.beginPath();
				item.strokeStyle 	= thisStyles.basestrokecolor;
				item.lineWidth 		= thisStyles.basestrokewidth;
				if(_this.seriesData[_this.seriesData.length - 1].comp == "up"){
					item.moveTo(baseLine, _this.seriesData[_this.seriesData.length - 1].y - 0.5);
					item.lineTo(baseLine, _this.seriesData[0].y + w + 0.5);
				} else {
					item.moveTo(baseLine, _this.seriesData[_this.seriesData.length - 1].y - 0.5);
					item.lineTo(baseLine, _this.seriesData[0].y + w + 0.5);
				}
				item.stroke();
				item.closePath();
			} 
		};
		var parseData = function(_data) {
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
			//console.log(overData)
			if(options.useselectitem){
				_selectCtx.clearRect(0, 0, _selectCtx.canvas.width, _selectCtx.canvas.height);
				var thisStyleForm = thisStyles;
				_selectCtx.lineWidth = thisStyles.overupstrokewidth;
				if((typeof(thisStyleForm.overfillcolor)).toLowerCase() == 'object' || (typeof(thisStyleForm.overupfillcolor)).toLowerCase() == 'object' || (typeof(thisStyleForm.overdownfillcolor)).toLowerCase() == 'object'){ // Gradient
					if((thisStyleForm.overupfillcolor).src != undefined) { //IMAGE
						var style;
						
					} else { //Gradient
						var gradient = _selectCtx.createLinearGradient(overData.x, overData.y, overData.x+ overData.width, overData.y);
						var j = 0;
						if(_this.thisSeries.form != "updown"){
							for(j = 0; j < thisStyleForm.overfillcolor.length; j++)
								gradient.addColorStop(thisStyleForm.overfillcolor[j][0], thisStyleForm.overfillcolor[j][1]);
						} else {
							if(overData.comp == "up"){
								for(j = 0; j < thisStyleForm.overupfillcolor.length; j++)
									gradient.addColorStop(thisStyleForm.overupfillcolor[j][0], thisStyleForm.overupfillcolor[j][1]);
							} else {
								for(j = 0; j < thisStyleForm.overdownfillcolor.length; j++)
									gradient.addColorStop(thisStyleForm.overdownfillcolor[j][0], thisStyleForm.overdownfillcolor[j][1]);
							}
						}
						_selectCtx.fillStyle = gradient;
						_selectCtx.strokeStyle = thisStyleForm.overstrokecolor;
					}
				} else { //Solid
					if(_this.thisSeries.form == "updown") {
						if(overData.height > 0) {
							_selectCtx.strokeStyle = thisStyleForm.overupstrokecolor;
							_selectCtx.fillStyle = thisStyleForm.overupfillcolor;
						} else {
							_selectCtx.strokeStyle = thisStyleForm.overdownstrokecolor;
							_selectCtx.fillStyle = thisStyleForm.overdownfillcolor;
						}
					} else {
						_selectCtx.strokeStyle = thisStyleForm.overstrokecolor;
						_selectCtx.fillStyle = thisStyleForm.overfillcolor;
					}
				}
				_selectCtx.fillRect(overData.x, overData.y, overData.width - 1, overData.height);
				if((_this.thisSeries.form != "updown" && thisStyles.strokewidth > 0) || 
						(_this.thisSeries.form == "updown" && 
								((overData.comp == "up"   && thisStyles.upstrokewidth > 0) || 
										(overData.comp == "down" && thisStyles.downstrokewidth > 0)))){
					_selectCtx.strokeRect(overData.x, overData.y, overData.width - 1, overData.height);
				}
			}
			var tipleft = overData.x, tiptop = overData.y;
			if(_this.thisSeries.form == "updown") {
				if(overData.comp === "down") { // 하락
//					tiptop = tiptop + Math.abs(overData.height);
				} else { /*상승*/ }
			}
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