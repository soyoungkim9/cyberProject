(function($) {
	DrawColumn = function (_graphctx, _options, _styles, _param, _yAxis, _sizeObject, _seriesColumnCount, _seriesColumnIndex) {
		var _this = this;
		
		var context = _graphctx;
		var options = _options, styles = _styles;
		this.series = _param.option.series;
		
		var defaultSeriesStyles = {
			"fillcolor": "#abe55c", "strokecolor": "#77bf10", "strokewidth": 1,
			"overfillcolor": "#77bf10", "overstrokecolor": "#77bf10", "overstrokewidth": 1,
			"itemwidth": 60, "gradientdirection": "horizontal",
			
			"upstrokecolor": "#c42c1c", "upfillcolor": "rgba(196,44,28,0.5)", "upstrokewidth": 1,
			"overupstrokecolor": "rgba(196,44,28,1)", "overupfillcolor": "rgba(196,44,28,1)", "overupstrokewidth": 1,
			
			"downstrokecolor": "#2e80cc", "downfillcolor": "rgba(46,128,204,0.5)", "downstrokewidth": 1,
			"overdownstrokecolor": "rgba(46,128,204,1)", "overdownfillcolor": "rgba(46,128,204,1)", "overdownstrokewidth": 1,
			
			"basestrokecolor": "#000000", "basestrokewidth": 1,
			
			"itemrenderer": "basic",
			
			"useitemvalue": false, 
			"itemvaluecolor": "#cccccc", "itemvaluestyle": "11px dotum", "itemvalueformat": null
		};
		var KEY = _param.option.key, DATA = $.extend(true, [], _param.data);//deepCopy(_param.data);
		var CHART_WIDTH  = _sizeObject.CHART_WIDTH, CHART_HEIGHT = _sizeObject.CHART_HEIGHT,
			CHART_TOP = _sizeObject.CHART_TOP,
			GRAPH_WIDTH  = _sizeObject.GRAPH_WIDTH, GRAPH_HEIGHT = _sizeObject.GRAPH_HEIGHT;
		var YAXIS = _yAxis;
		var BASE = _param.option.base;
		var PREV_DATA = _sizeObject.PREV_DATA;
		
		var thisStyles = styles[KEY], seriesForm = null;
		this.thisSeries = null;
		var seriesColumnCount = (_seriesColumnCount == 0) ? 1: _seriesColumnCount, 
			seriesColumnIndex = _seriesColumnIndex;
		this.seriesData = [];
		
		var itemRenderer = new DrawColumnSkin(context);
		
		var fillImage = null, upfillImage = null, downfillImage = null, itemfillImages = [];
		var overfillImage = null, overupfillImage = null, overdownfillImage = null;
		var UDfillImages = {};
		this.drawSeries = function (_seriesForm) {
			seriesForm = _seriesForm;
			
			_this.thisSeries = _this.series[seriesForm];
			thisStyles = $.extend(true, defaultSeriesStyles, thisStyles[seriesForm]);
			// x, y - data value matching
			_this.seriesData = parseData(DATA);
			if(thisStyles.fillcolor.src != undefined || thisStyles.itemfillcolors != undefined){//} || thisStyles.upfillcolor.src != undefined || thisStyles.downfillcolor.src != undefined){ // Gradient
				if(thisStyles.itemfillcolors == undefined){
					fillImage = new Image();
					fillImage.onload = function(){
						draw();
					};
					fillImage.src = thisStyles.fillcolor.src;
				} else {
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
			} else if(thisStyles.upfillcolor.src != undefined || thisStyles.downfillcolor.src != undefined ||  thisStyles.overupfillcolor.src != undefined ||  thisStyles.overdownfillcolor.src != undefined){
				var srcs = [["upfillcolor", thisStyles.upfillcolor.src], ["downfillcolor", thisStyles.downfillcolor.src], ["overupfillcolor", thisStyles.overupfillcolor.src], ["overdownfillcolor", thisStyles.overdownfillcolor.src]];
				for(var i = 0; i < srcs.length; i++){
					if(srcs[i][1] != undefined) {
						UDfillImages[srcs[i][0]] = srcs[i][1];
					}
				}
				draw();
			} else {
				draw();
			}
		};
		
		var draw = function(){
			var yLabelGap = getStyles(KEY, "ylabelgap"), yAxisAlign = getStyles(KEY, "yaxisalign");
			var yLabelPadR = getStyles(KEY, "ylabelpaddingright"), yLabelPadL = getStyles(KEY, "ylabelpaddingleft");
			if(options.usemultiyaxis){
				yLabelGap = thisStyles.ylabelgap;
				yAxisAlign = thisStyles.yaxisalign, yLabelAlign = thisStyles.ylabelalign;
				yLabelPadR = thisStyles.ylabelpaddingright, yLabelPadL = thisStyles.ylabelpaddingleft;
			}
			
			var startX = getStyles(KEY, "canvaspaddingleft") + 0.5;
			if(!options.usemultiyaxis){
				if(yAxisAlign === "left") startX += yLabelGap + yLabelPadR + yLabelPadL;
			} else {
				if(yAxisAlign === "left"){
					startX += yLabelGap + yLabelPadR + yLabelPadL;
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
							} catch(e){}
						}
						if(!check) break;
					}
				}
			}
			var graphPaddTop = getStyles(KEY, "graphpaddingtop"), graphPaddBottom = getStyles(KEY, "graphpaddingbottom");
			var startY = CHART_TOP + getStyles(KEY, "canvaspaddingtop") + graphPaddTop + getStyles(KEY, "mouseinfoheight") + 0.5;
			GRAPH_HEIGHT = GRAPH_HEIGHT - graphPaddTop - graphPaddBottom;
			
			var yAxisMax = YAXIS[YAXIS.length - 1], yAxisMin = YAXIS[0];
			
			var graphPadLR = getStyles(KEY, "graphpaddingright") + getStyles(KEY, "graphpaddingleft");
			
			var count = _this.seriesData.length;
			var yAxisGap 	= yAxisMax - yAxisMin;
			
			if(getStyles(KEY, "baseatzero") == true) BASE = 0;
			if((_this.thisSeries.form != "updown" && _this.thisSeries.form != "updown-n") && _this.thisSeries.minaxis == undefined) BASE = yAxisMin;
			
			var baseLine = 0;
			if(_this.thisSeries.form != "updown" && _this.thisSeries.form != "updown-n") baseLine = GRAPH_HEIGHT + startY;
			else {
				if(options.usemultiyaxis){
					BASE = 0;
					baseLine = (GRAPH_HEIGHT * ((yAxisMax - BASE) / yAxisGap)) + startY;
				} else {
					baseLine = (GRAPH_HEIGHT * ((yAxisMax - BASE) / yAxisGap)) + startY;
				}
			}
			
			
			var i = 0, j = 0, close = 0, close2 = 0, height = 0, height2 = 0;
			var dataValue = null;
			var xGap = (GRAPH_WIDTH - graphPadLR) / count, xGapHalf	= Math.ceil(xGap / 2);
			var firstItem_x = 0;
			if(getStyles(KEY, "baseatstart")){
				xGap = GRAPH_WIDTH / (count -1), xGapHalf = xGap / 2;
				firstItem_x = startX;
			} else {
				firstItem_x = startX + getStyles(KEY, "graphpaddingleft") + xGapHalf;
			}
			var xPdn = (xGap - (xGap * (Number(thisStyles.itemwidth) / 100))); 
			var w = Math.round((xGap - xPdn) / seriesColumnCount);
			if(w <= 0) w = 0.5;
			if(_this.thisSeries.form == "stacked" && _this.thisSeries.yaxisid == undefined){ seriesColumnIndex = 0;}
//			console.log(seriesColumnIndex)
			var gap = Math.floor((w * seriesColumnIndex) - (w * seriesColumnCount/2)) + firstItem_x;
			var item = context;
			var prevData = _this.seriesData[count-1];
			for(i = count;i --;){
				dataValue = _this.seriesData[i];
				if(dataValue.xaxis == " " || dataValue.xaxis == "") continue;
				if(dataValue.minaxis == undefined){ // 최소값이 없는 경우
					if(dataValue.yaxis >= BASE)	dataValue.comp = "up";
					else dataValue.comp = "down";
				} else {// 최소값이 있는 경우
					if(dataValue.yaxis >= dataValue.minaxis) dataValue.comp = "up";
					else dataValue.comp = "down";
				}
				if(_this.thisSeries.form != "stacked"){
					close = Math.floor(GRAPH_HEIGHT * ((yAxisMax - Number(dataValue.yaxis)) / yAxisGap)) + startY;
				} else {
					close = GRAPH_HEIGHT * ((yAxisMax - Number(dataValue.yaxis)) / yAxisGap) + startY;
					if(PREV_DATA != undefined)
						close = close - (GRAPH_HEIGHT + startY - (PREV_DATA[i].y) - 0.5);
				}
				if (_this.thisSeries.form == "double") {
					close2 = Math.floor(GRAPH_HEIGHT * ((yAxisMax - (dataValue.yaxis2*-1)) / yAxisGap)) + startY;
				}
				if(_this.thisSeries.form != "updown" && _this.thisSeries.form != "updown-n" && _this.thisSeries.form != "double"){
					if(_this.thisSeries.minaxis == undefined){
						height	= GRAPH_HEIGHT - close + startY;
						if(PREV_DATA != undefined  && _this.thisSeries.form == "stacked") {
							height = height - (GRAPH_HEIGHT +startY - PREV_DATA[i].y) + 1;
						}
					} else {
						var min = Math.floor(GRAPH_HEIGHT * ((yAxisMax - dataValue.minaxis) / yAxisGap)) + startY;
						height	= (GRAPH_HEIGHT - close) - (GRAPH_HEIGHT - min);
					}
				} else {
					if(_this.thisSeries.form == "updown" || _this.thisSeries.form == "updown-n") {
						if(thisStyles.strokewidth > 0)
							height	= baseLine - close;
						else
							height	= baseLine - close - 1;
			    	} else if(_this.thisSeries.form == "double") {		
			    		height	= baseLine - close;
			    		height2	= baseLine - close2;
			    	}
				}
				// Normal
				if((_this.thisSeries.form != "updown" && _this.thisSeries.form != "updown-n" && thisStyles.strokewidth > 0) || 
					((_this.thisSeries.form == "updown" || _this.thisSeries.form == "updown-n") && 
						((dataValue.comp == "up"   && thisStyles.upstrokewidth > 0) || 
						 (dataValue.comp == "down" && thisStyles.downstrokewidth > 0)))){
					dataValue.x = Math.floor((xGap * i)) + gap;
					dataValue.y = (dataValue.comp == "down") ? close + 1 : close;
					
					if(_this.thisSeries.form == "double") {
						dataValue.y2 = close2;
					}
				} else {
					dataValue.x = Math.floor((xGap * i)) + gap + 0.5;
					dataValue.y = close + 0.5;
					if(_this.thisSeries.form == "double") {
						dataValue.y2 = close2 + 0.5;
					}
					if(thisStyles.strokewidth == 0 || thisStyles.upstrokewidth == 0 || thisStyles.downstrokewidth == 0) dataValue.y -= 1;
				}
				dataValue.width = (seriesColumnCount <= 1) ? w: w -1;
				dataValue.height = height ;
				if(_this.thisSeries.form == "double") {
					dataValue.height2 = Math.floor(height2) ;
				}
				if(_this.thisSeries.form != "double") {
					if(thisStyles.itemfillcolors == undefined){
						if((typeof(thisStyles.fillcolor)).toLowerCase() == 'object' || (typeof(thisStyles.upfillcolor)).toLowerCase() == 'object' || (typeof(thisStyles.downfillcolor)).toLowerCase() == 'object'){ // Gradient							
							if(dataValue.yaxis == 0){
								if(_this.thisSeries.form != "updown" && _this.thisSeries.form != "updown-n" && _this.thisSeries.form != "updown-c"){
									item.fillStyle = thisStyles.fillcolor.src != undefined ? thisStyles.fillcolor.fill[0][1] : thisStyles.fillcolor[0][1];
								} else {
									if(_this.thisSeries.form == "updown"){
										if(dataValue.comp == "up"){
											item.fillStyle = thisStyles.upfillcolor.src != undefined ? thisStyles.upfillcolor.fill[0][1] : thisStyles.upfillcolor[0][1];
										} else {
											item.fillStyle = thisStyles.downfillcolor.src != undefined ? thisStyles.downfillcolor.fill[0][1] : thisStyles.downfillcolor[0][1];
										}
									} else if(_this.thisSeries.form == "updown-c"){
										if(i == 0 && _sizeObject.FIRSTDATA.yaxis < dataValue.yaxis || i > 0 && _this.seriesData[i-1].yaxis < dataValue.yaxis){
											item.fillStyle = thisStyles.upfillcolor.src != undefined ? thisStyles.upfillcolor.fill[0][1] : thisStyles.upfillcolor[0][1];
										} else {
											item.fillStyle = thisStyles.downfillcolor.src != undefined ? thisStyles.downfillcolor.fill[0][1] : thisStyles.downfillcolor[0][1];
										}
									} else {
										item.fillStyle = thisStyles.fillcolor.src != undefined ? thisStyles.fillcolor.fill[0][1] : thisStyles.fillcolor[0][1];
									}
								}
							} else {
								var fillObject = thisStyles.fillcolor;
								var gradient = item.createLinearGradient(dataValue.x, dataValue.y, dataValue.x+ dataValue.width, dataValue.y);
								if(_this.thisSeries.form != "updown" && _this.thisSeries.form != "updown-n" && _this.thisSeries.form != "updown-c"){
									if(thisStyles.fillcolor.src != undefined) fillObject = fillObject.fill;
								} else {
									
									if(_this.thisSeries.form == "updown"){
										if(dataValue.comp == "up"){
											if(thisStyles.upfillcolor.src == undefined) fillObject = thisStyles.upfillcolor;
											else fillObject = thisStyles.upfillcolor.fill;
											if(thisStyles.upstrokewidth) item.strokeStyle 	= thisStyles.upstrokecolor;
										} else {
											if(thisStyles.downfillcolor.src == undefined) fillObject = thisStyles.downfillcolor;
											else fillObject = thisStyles.downfillcolor.fill;
											if(thisStyles.downstrokewidth) item.strokeStyle 	= thisStyles.downstrokecolor;
										}
									} else if(_this.thisSeries.form == "updown-c"){
										if(i == 0 && _sizeObject.FIRSTDATA.yaxis < dataValue.yaxis || i > 0 && _this.seriesData[i-1].yaxis < dataValue.yaxis){
											if(thisStyles.upfillcolor.src == undefined) fillObject = thisStyles.upfillcolor;
											else fillObject = thisStyles.upfillcolor.fill;
											if(thisStyles.upstrokewidth) item.strokeStyle 	= thisStyles.upstrokecolor;
										} else {
											if(thisStyles.downfillcolor.src == undefined) fillObject = thisStyles.downfillcolor;
											else fillObject = thisStyles.downfillcolor.fill;
											if(thisStyles.downstrokewidth) item.strokeStyle 	= thisStyles.downstrokecolor;
										}
									} else {
										if(thisStyles.fillcolor.src != undefined) fillObject = fillObject.fill;
										if(thisStyles.strokewidth) item.strokeStyle 	= thisStyles.strokecolor;
									}
								}
								for(j = 0; j < fillObject.length; j++)
									gradient.addColorStop(fillObject[j][0], fillObject[j][1]);
								item.fillStyle = gradient;
							}
						} else {
							if(_this.thisSeries.form != "updown" && _this.thisSeries.form != "updown-n" && _this.thisSeries.form != "updown-c"){
								item.lineWidth 		= thisStyles.strokewidth;
								item.strokeStyle 	= thisStyles.strokecolor;
								item.fillStyle 		= thisStyles.fillcolor;
							} else {
								if(_this.thisSeries.form == "updown"){
									if(dataValue.comp == "up"){
										item.lineWidth 	 = thisStyles.upstrokewidth;
										item.strokeStyle = thisStyles.upstrokecolor;
										item.fillStyle 	 = thisStyles.upfillcolor;
									} else {
										item.lineWidth 	 = thisStyles.downstrokewidth;
										item.strokeStyle = thisStyles.downstrokecolor;
										item.fillStyle 	 = thisStyles.downfillcolor;
									}
								} else if(_this.thisSeries.form == "updown-c"){
									if(i == 0 && _sizeObject.FIRSTDATA.yaxis < dataValue.yaxis || i > 0 && _this.seriesData[i-1].yaxis < dataValue.yaxis){
										item.lineWidth 	 = thisStyles.upstrokewidth;
										item.strokeStyle = thisStyles.upstrokecolor;
										item.fillStyle 	 = thisStyles.upfillcolor;
									} else {
										item.lineWidth 	 = thisStyles.downstrokewidth;
										item.strokeStyle = thisStyles.downstrokecolor;
										item.fillStyle 	 = thisStyles.downfillcolor;
									}
								} else {
									item.lineWidth 		= thisStyles.strokewidth;
									item.strokeStyle 	= thisStyles.strokecolor;
									item.fillStyle 		= thisStyles.fillcolor;
								}
							}
						}
					} else {
						var obj = thisStyles.itemfillcolors[i];
						if((typeof(obj)).toLowerCase() == 'object'){ // Gradient
							var fillObject = obj;
							var gradient = null;
							if(thisStyles.gradientdirection != "vertical") gradient = item.createLinearGradient(dataValue.x, dataValue.y, dataValue.x+ dataValue.width, dataValue.y);
							else gradient = item.createLinearGradient(dataValue.x, dataValue.y, dataValue.x, dataValue.y + dataValue.height - 2);
		
							if(_this.series[seriesForm].form != "updown" && _this.series[seriesForm].form != "updown-n"){
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
					if(dataValue.xaxis != ""){
						if(!getStyles(KEY, "usezeroitem") && dataValue.yaxis == 0){
							
						} else {
							itemRenderer[thisStyles.itemrenderer](dataValue, thisStyles, _this.thisSeries.form);
						}
					}
					if(thisStyles.inline==true){
						item.strokeStyle = thisStyles.instrokecolor;
						itemRenderer["inline"](dataValue, thisStyles, _this.thisSeries.form);
					}
				} else {
					//double
					item.lineWidth 	 = thisStyles.upstrokewidth;
					item.strokeStyle = thisStyles.upstrokecolor;
					if((typeof(thisStyles.fillcolor)).toLowerCase() == 'object' || (typeof(thisStyles.upfillcolor)).toLowerCase() == 'object' || (typeof(thisStyles.downfillcolor)).toLowerCase() == 'object'){ // Gradient
						var fillObject = thisStyles.fillcolor;
						var gradient = item.createLinearGradient(dataValue.x, dataValue.y, dataValue.x+ dataValue.width, dataValue.y);
						if(_this.thisSeries.form != "updown" && _this.thisSeries.form != "updown-n"){
							if(thisStyles.fillcolor.src != undefined) fillObject = fillObject.fill;
						} else {
							if(_this.thisSeries.form == "updown"){
								if(dataValue.comp == "up"){
									if(thisStyles.upfillcolor.src == undefined) fillObject = thisStyles.upfillcolor;
									else fillObject = fillObject.fill;
								} else {
									if(thisStyles.downfillcolor.src == undefined) fillObject = thisStyles.downfillcolor;
									else fillObject = fillObject.fill;
								}
							} else {
								if(thisStyles.fillcolor.src != undefined) fillObject = fillObject.fill;
							}
						}
						for(j = 0; j < fillObject.length; j++)
							gradient.addColorStop(fillObject[j][0], fillObject[j][1]);
						item.fillStyle = gradient;
						if(thisStyles.strokewidth) item.strokeStyle 	= thisStyles.strokecolor;
					} else {
						if(_this.thisSeries.form != "updown" && _this.thisSeries.form != "updown-n"){
							item.lineWidth 		= thisStyles.strokewidth;
							item.strokeStyle 	= thisStyles.strokecolor;
							item.fillStyle 		= thisStyles.fillcolor;
						} else {
							if(_this.thisSeries.form == "updown"){
								if(dataValue.comp == "up"){
									item.lineWidth 	 = thisStyles.upstrokewidth;
									item.strokeStyle = thisStyles.upstrokecolor;
									item.fillStyle 	 = thisStyles.upfillcolor;
								} else {
									item.lineWidth 	 = thisStyles.downstrokewidth;
									item.strokeStyle = thisStyles.downstrokecolor;
									item.fillStyle 	 = thisStyles.downfillcolor;
								}
							} else {
								item.lineWidth 		= thisStyles.strokewidth;
								item.strokeStyle 	= thisStyles.strokecolor;
								item.fillStyle 		= thisStyles.fillcolor;
							}
						}
					}
					itemRenderer[thisStyles.itemrenderer](dataValue, thisStyles, _this.thisSeries.form);
					if(thisStyles.inline==true){
						item.strokeStyle = thisStyles.instrokecolor;
						itemRenderer["inline"](dataValue, thisStyles, _this.thisSeries.form);
					}
					var tempY = dataValue.y;
					var tempHeight = dataValue.height;
					dataValue.y = dataValue.y2;
					dataValue.height = dataValue.height2;
					item.lineWidth 	 = thisStyles.downstrokewidth;
					item.strokeStyle = thisStyles.downstrokecolor;
					if(typeof(thisStyles.downfillcolor) == 'object'){ // Gradient
						var gradient = item.createLinearGradient(dataValue.x, dataValue.y, dataValue.x, dataValue.y+dataValue.height);
						gradient.addColorStop(0, thisStyles.downfillcolor[0]);
						gradient.addColorStop(1, thisStyles.downfillcolor[1]);
						item.fillStyle 		= gradient;
					}else{
						item.fillStyle 		= thisStyles.downfillcolor;
					}
					itemRenderer[thisStyles.itemrenderer](dataValue, thisStyles, _this.thisSeries.form);
					if(thisStyles.inline==true){
						item.strokeStyle = thisStyles.instrokecolor;
						itemRenderer["inline"](dataValue, thisStyles, _this.thisSeries.form);
					}
					dataValue.y = tempY;
					dataValue.height = tempHeight;
				};

				
				if(thisStyles.usepattern) {
					item.globalAlpha = 0.2;
					if(_this.thisSeries.form != "double") {
						if(_this.thisSeries.form != "updown" && _this.thisSeries.form != "updown-n"){
							if(_this.thisSeries.form != "nomal2"){
								var pattern_style = item.createPattern(pattenImg, "repeat");//반복
								if(thisStyles.patternstyle != undefined){
									item.fillStyle = pattern_style;
								}
							}else{
								//nomal2는 일단 만들고!!!
								var pattern_styles = item.createPattern(pattenImgs["no"+(dataValue.falg-1)], "repeat");//반복
								item.fillStyle = pattern_styles;
							}
							
						} else {
							if(_this.thisSeries.form == "updown"){
								//updown
								if(dataValue.comp == "up"){
									var pattern_upstyle = item.createPattern(pattenupdownImg["no0"], "repeat");//반복
									item.fillStyle = pattern_upstyle;
								} else {
									var pattern_downstyle = item.createPattern(pattenupdownImg["no1"], "repeat");//반복
									item.fillStyle = pattern_downstyle;
								}
							} else {
								if(_this.thisSeries.form != "nomal2"){
									var pattern_style = item.createPattern(pattenImg, "repeat");//반복
									if(thisStyles.patternstyle != undefined){
										item.fillStyle = pattern_style;
									}
								}else{
									//nomal2는 일단 만들고!!!
									var pattern_styles = item.createPattern(pattenImgs["no"+(dataValue.falg-1)], "repeat");//반복
									item.fillStyle = pattern_styles;
								}
							}
						}
						itemRenderer[thisStyles.itemrenderer](dataValue, thisStyles, _this.thisSeries.form);
					} else {
						//double
						var pattern_upstyle = item.createPattern(pattenupdownImg["no0"], "repeat");//반복
						item.fillStyle = pattern_upstyle;
						itemRenderer[thisStyles.itemrenderer](dataValue, thisStyles, _this.thisSeries.form);
						var tempY = dataValue.y;
						var tempHeight = dataValue.height;
						dataValue.y = dataValue.y2;
						dataValue.height = dataValue.height2;
						var pattern_downstyle = item.createPattern(pattenupdownImg["no1"], "repeat");//반복
						item.fillStyle = pattern_downstyle;
						itemRenderer[thisStyles.itemrenderer](dataValue, thisStyles, _this.thisSeries.form);
						dataValue.y = tempY;
						dataValue.height = tempHeight;
					};
					item.globalAlpha = 1;
				}
				
				if(thisStyles.fillcolor.src != undefined || thisStyles.upfillcolor.src != undefined || thisStyles.downfillcolor.src != undefined){ // Gradient
					if(Math.abs(dataValue.height) > 0){
						if(_this.thisSeries.form != "updown" && _this.thisSeries.form != "updown-n"){
							item.drawImage(fillImage, 0, 0, dataValue.width, dataValue.height - 1, dataValue.x, dataValue.y, dataValue.width, dataValue.height - 1);
						} else {
							if(_this.thisSeries.form == "updown"){
								if(dataValue.comp == "up"){
									item.drawImage(upfillImage, 0, 0, dataValue.width, dataValue.height, dataValue.x, dataValue.y, dataValue.width, dataValue.height);
								} else {
									item.drawImage(downfillImage, 0, 0, dataValue.width, dataValue.height, dataValue.x, dataValue.y, dataValue.width, dataValue.height);
								}
							} else {
								if(dataValue.yaxis != 0){
									if(dataValue.comp == "up"){
										item.drawImage(fillImage, 0, 0, dataValue.width, dataValue.height, dataValue.x, dataValue.y, dataValue.width, dataValue.height);
									} else {
										item.drawImage(fillImage, 0, 0, dataValue.width, Math.abs(dataValue.height), dataValue.x, dataValue.y - Math.abs(dataValue.height) , dataValue.width, Math.abs(dataValue.height));
									}
								}
							}
						}
					}
				}
				if(thisStyles.useitemvalue && dataValue.xaxis != "") {
					item.beginPath();
					item.textAlign = "center"; 
					item.textBaseline = "middle";
					item.fillStyle = thisStyles.itemvaluecolor;
					item.font = thisStyles.itemvaluestyle;
					var yValue = (thisStyles.itemvalueformat != null) ? eval(thisStyles.itemvalueformat)(dataValue.yaxis,dataValue) : dataValue.yaxis.toString().format();
					if(_this.thisSeries.form != "updown" && _this.thisSeries.form != "updown-n"){
						item.fillText(yValue, dataValue.x + (dataValue.width / 2) - 3, dataValue.y - 10);
					} else {
						if(dataValue.comp == "up"){
							item.fillText(yValue, dataValue.x + (dataValue.width / 2), dataValue.y - 10);
						} else {
							item.fillText(yValue, dataValue.x + (dataValue.width / 2), dataValue.y + 10);
						}
					}
					item.fill();
					item.closePath();
				}
			}
			
			//BaseLine
			if((_this.thisSeries.form == "updown" || _this.thisSeries.form == "updown-n") && thisStyles.basestrokewidth > 0){
				item.beginPath();
				item.strokeStyle 	= thisStyles.basestrokecolor;
				item.lineWidth 		= thisStyles.basestrokewidth;
					item.moveTo(startX, baseLine);
					item.lineTo(startX + GRAPH_WIDTH, baseLine);
				item.stroke();
				item.closePath();
			} 
		};
		
		var parseData = function(_data) {
			var data = [];
			var minaxisChk = (_this.thisSeries.minaxis != undefined && _this.thisSeries.minaxis != null) ? true : false;
			for(var i = _data.length; i--;){
				var obj = _data[i];
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
				var j = 0;
				_selectCtx.clearRect(0, 0, _selectCtx.canvas.width, _selectCtx.canvas.height);
				var thisStyleForm = thisStyles;
				_selectCtx.lineWidth = thisStyles.overupstrokewidth;
				if((typeof(thisStyleForm.overfillcolor)).toLowerCase() == 'object' || (typeof(thisStyleForm.overupfillcolor)).toLowerCase() == 'object' || (typeof(thisStyleForm.overdownfillcolor)).toLowerCase() == 'object'){ // Gradient
					var fillObject = thisStyles.fillcolor;
					var gradient = _selectCtx.createLinearGradient(overData.x, overData.y, overData.x+ overData.width, overData.y);
					if((thisStyleForm.overupfillcolor).src != undefined || (thisStyleForm.overdownfillcolor).src != undefined) { //IMAGE
						if(_this.thisSeries.form == "updown"){
							if(overData.comp == "up"){
								if(thisStyleForm.overupfillcolor.src == undefined) fillObject = thisStyleForm.overupfillcolor;
								else fillObject = thisStyleForm.overupfillcolor.fill;
								if(thisStyleForm.upstrokewidth) _selectCtx.strokeStyle 	= thisStyleForm.upstrokecolor;
							} else {
								if(thisStyleForm.overdownfillcolor.src == undefined) fillObject = thisStyleForm.overdownfillcolor;
								else fillObject = thisStyleForm.overdownfillcolor.fill;
								if(thisStyleForm.downstrokewidth) _selectCtx.strokeStyle 	= thisStyleForm.downstrokecolor;
							}
						} else if(_this.thisSeries.form == "updown-c"){
							if(_item.index == 0 && _sizeObject.FIRSTDATA.yaxis < overData.yaxis || _item.index > 0 && _this.seriesData[_item.index-1].yaxis < overData.yaxis){
								if(thisStyleForm.overupfillcolor.src == undefined) fillObject = thisStyleForm.overupfillcolor;
								else fillObject = thisStyleForm.overupfillcolor.fill;
								if(thisStyleForm.upstrokewidth) _selectCtx.strokeStyle 	= thisStyleForm.upstrokecolor;
							} else {
								if(thisStyleForm.overdownfillcolor.src == undefined) fillObject = thisStyleForm.overdownfillcolor;
								else fillObject = thisStyleForm.overdownfillcolor.fill;
								if(thisStyleForm.downstrokewidth) _selectCtx.strokeStyle 	= thisStyleForm.downstrokecolor;
							}
						} else {
							if(thisStyleForm.fillcolor.src != undefined) fillObject = fillObject.fill;
							if(thisStyleForm.strokewidth) _selectCtx.strokeStyle 	= thisStyleForm.strokecolor;
						}
						for(j = 0; j < fillObject.length; j++)
							gradient.addColorStop(fillObject[j][0], fillObject[j][1]);
						_selectCtx.fillStyle = gradient;
						
						var fillImage = new Image();
						fillImage.onload = function(){
							var ptn = _selectCtx.createPattern(fillImage, 'repeat');
							_selectCtx.fillStyle = ptn;
							_selectCtx.fillRect(overData.x, overData.y, overData.width -1, overData.height);
						};
						if(_this.thisSeries.form == "updown"){
							if(overData.comp == "up"){
								fillImage.src = UDfillImages.overupfillcolor;
							} else {
								fillImage.src = UDfillImages.overdownfillcolor;
							}
						} else if(_this.thisSeries.form == "updown-c"){
							if(_item.index == 0 && _sizeObject.FIRSTDATA.yaxis < overData.yaxis || _item.index > 0 && _this.seriesData[_item.index-1].yaxis < overData.yaxis){
								fillImage.src = UDfillImages.overupfillcolor;
							} else {
								fillImage.src = UDfillImages.overdownfillcolor;
							}
						} else {
							
						}
					} else { //Gradient
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
				itemRenderer[thisStyleForm.itemrenderer](overData, thisStyleForm, null, _selectCtx);
				/*_selectCtx.fillRect(overData.x, overData.y, overData.width - 1, overData.height);
				if((_this.thisSeries.form != "updown" && thisStyles.strokewidth > 0) || 
						(_this.thisSeries.form == "updown" && 
								((overData.comp == "up"   && thisStyles.upstrokewidth > 0) || 
										(overData.comp == "down" && thisStyles.downstrokewidth > 0)))){
					_selectCtx.strokeRect(overData.x, overData.y, overData.width - 1, overData.height);
				}*/
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