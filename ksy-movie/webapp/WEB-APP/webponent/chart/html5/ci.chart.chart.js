(function($) {
	CreateChart = function (_parent, _id, _width, _height, _options, _styles, _series, _$tooltip) {
		var _this = this;
		
		var parent = _parent;
		/* Default Setting
		 * options : 차트 전반적인 옵션
		 * styles : 차트 스타일
		 * series : 차트 구성 시리즈
		 */
		var defaultGraphStyles = {
			"canvaspaddingtop": 10,	"canvaspaddingright": 10, "canvaspaddingbottom": 10, "canvaspaddingleft": 10,
			
			"graphpaddingtop": 0, "graphpaddingright": 10, "graphpaddingbottom": 0, "graphpaddingleft": 10,
			"graphbackgroundcolor": "#FFFFFF",
			"usehorizontalalternate": false, "horizontalalternatecolor": "#eee",
			
			"usegraphstroketop" : true, "usegraphstrokeright" : true, "usegraphstrokebottom" : true, "usegraphstrokeleft" : true,
			"graphstroketopwidth": 1, "graphstroketopcolor": "#dddddd",
			"graphstrokerightwidth": 1,	"graphstrokerightcolor": "#dddddd",
			"graphstrokebottomwidth": 1, "graphstrokebottomcolor": "#dddddd",
			"graphstrokeleftwidth": 1, "graphstrokeleftcolor": "#dddddd",
			"usegraphunderstroketop" : false, "usegraphunderstrokeright" : false, "usegraphunderstrokebottom" : false, "usegraphunderstrokeleft" : false, // UNDER
			"graphunderstroketopwidth": 1, "graphunderstroketopcolor": "#d1d1d1",
			"graphunderstrokerightwidth": 1, "graphunderstrokerightcolor": "#d1d1d1",
			"graphunderstrokebottomwidth": 1, "graphunderstrokebottomcolor": "#d1d1d1",
			"graphunderstrokeleftwidth": 1, "graphunderstrokeleftcolor": "#d1d1d1",
			
			"usehorizontalgridstroke": true, "useverticalgridstroke": true,
			"usehorizontalgriddashed": false, "useverticalgriddashed": false,
			"usehorizontalgridunderstroke": false, "useverticalgridunderstroke": false, // Under
			"usehorizontalgridunderdashed": false, "useverticalgridunderdashed": false, // Under
			"horizontalgriddashedstyle": [3,3], "verticalgriddashedstyle": [3,3],
			"horizontalgridunderdashedstyle": [3,3], "verticalgridunderdashedstyle": [3,3], // Under
			"horizontalgridstrokewidth" : 1, "horizontalgridstrokecolor" : "#eeeeee",
			"horizontalgridunderstrokewidth" : 1, // Under
			"verticalgridstrokewidth" : 1, "verticalgridstrokecolor" : "#eeeeee",
			
			"crosslinewidth": 1, "crosslinecolor": "#999", "crosslinestyle": "dashed", // 마우스따라다니는 선 스타일
			
			"usexlabelimage": false, "xlabelimagepaddingtop": 10, "xlabelimages": null,
			"usexlabel": true, "xlabelfontstyle": "11px dotum", "xlabelfontcolor": "#aaaaaa", "xlabelspace": 10,
			"useylabel": true,"ylabelfontstyle": "11px dotum", "ylabelfontcolor": "#aaaaaa",
			
			"xlabelgap": 20, "xlabelalign": "center", "xlabelpaddingtop": 10,
			"ylabelgap": 60, "ylabelalign": "left",	"ylabelpaddingright": 10, "ylabelpaddingleft": 10,
			
			"yaxisalign": "left",
			"useyaxisminvalue": false, // Y-Axis 값중 제일 작은 값 visible
			"useyaxismaxvalue": false, // Y-Axis 값중 제일 큰 값 visible
			"usexaxislastvalue": false, // X-Axis 맨마지막 값 visible
			
			"baseatzero": false, "baseatstart": false, "usezeroitem": true, // yaxis가 0값인데 1px이라도 표현해주고 싶을때 true 
			
			"mouseinfoheight": 0
		};
		
		var options = {
				"url": null, // Data URL
				"xaxisformat": null, "yaxisformat": null, //X, Y축 글자 포맷팅
				"usestock": false, // 증권차트사용여부
				"usestocksub": true, // 증권차트이지만 candle과 이동평균선만 있는 차트인 경우 false로 사용
				"usecrossline": false, "usehcrossline": false, "usevcrossline": false, // 마우스를 따라다니는 선 사용 여부
				"usehtip": false, "usevtip": false, // 마우스를 따라다니는 선 끝에 팁형태의 가로/세로 사용 여부
				"useselectitem": true, // 마우스오버시에 활성화아이템 여부 기본:활성화
				"usemultiyaxis": false, // 멀티축 사용 여부
				"usetip": true,	"functip": null, // 툴팁사용여부와 툴팁함수 (customize 가능)
				"datasort": "forward", // 데이터의 순서 기본 : 과거 -> 현재 (forward / back)
				"usesale": false, // 종목별매물대 차트 일경우 (candle + column) 
				"usefixmaxmin": false, // Y축 Max, Min을 style[KEY].yaxisstep 값으로 고정
				"usecanvasmoveall": false, "funcmoveall": null, // Canvas 영역전체를 MouseMove 이벤트 적용
				"useitemclick": false, "funcclick": null, // 아이템만 MouseMove 이벤트 적용
				"usemobiledevice": "pc", // pc || mobile
				"usexlabelfirst": false // false || "month" || "time"
		};
		var styles = {}, series = {};
		/* INTERNAL */
		var CHART_ID = _id; // chart id
		this.CHART_ID = _id; // chart id
		var CHART_WIDTH = _width, CHART_HEIGHT = _height; // chart width, chart height
		/* CLASS */
		var draw = null; // x/ y축, series 그리기 
		var chartData = null; // 데이터 불러오기
		var slider = null; // SLIDER
		this.overLayFunction = null, this.subIndexFunction = null;
		this.threelinechart = null, this.pnfchart = null;
		var legend = null;
		/* ELEMENT */
		this.$back = null, this.$graph = null, this.$select = null, this.$etc = null;
		this.$line = null, this.$hline = null, this.$vline = null, this.$tooltip = _$tooltip;
		this.$htooltip = null, this.$vtooltip = null;
		
		var doc = document;
		
		var originalData = [], sliceData = [];
		var itemCount = 80; // 기본 아이템 갯수(종합차트에서 쓰임)
		var itemCountArray = [10,20,30,50,80,140,200,280,400,'*'];
		var itemCountIndex = 4;
		var base = 99999999999999999999999;
		/* type : main | sub
		 * key : series key value
		 * series : series[key]
		 */
		var MAINCHART = {};//, MAINCHARTSTYLE = null;
		var SUBCHARTS = [];
		var DIVISION = [[100], [70, 30], [50, 25, 25], [40, 20, 20, 20], [40, 15, 15, 15, 15]]; // SUBCHART의 갯수에 따른 높이 비율
		
		var XAXISNAME = null, USESTOCK = false; // 증권차트인지 여부 체크
		var isIE8 = false; // IE7,8 체크
		var init = function () {
			//browser detect
			var browser = (function() {  
				var s = navigator.userAgent.toLowerCase();  
				var match = /(webkit)[ \/](\w.]+)/.exec(s) ||              
							/(opera)(?:.*version)?[ \/](\w.]+)/.exec(s) ||              
							/(msie) ([\w.]+)/.exec(s) ||                             
							/(mozilla)(?:.*? rv:([\w.]+))?/.exec(s) ||
							[];  
				return { name: match[1] || "", version: match[2] || "0" };
			}());
			
			if(browser.name == 'msie' && (browser.version < 9)) isIE8 = true; 
			
			var i = null, j = null;
			for(i in _options){	setOptions(i, _options[i]);	}
			var subLen = 0;
			for(i in _series){
				if(_series[i].type == "sub") ++subLen;
			}
			var divisionCount = 0;
			for(i in _styles){
				if(typeof(_styles[i]) === "object"){
					styles[i] = $.extend(true, {}, defaultGraphStyles);
					for(j in _styles[i]) { // SERIES 바로 전까지 styles update
						setStyles((styles[i]), j, (_styles[i])[j]);
						if(j == "graphheight"){
							(DIVISION[subLen])[divisionCount] = (_styles[i])[j];
						}
					}
					++divisionCount;
				}
			}
			for(i in _styles){
				if(typeof(_styles[i]) === "object"){
					styles[i] = $.extend(true, {}, defaultGraphStyles);
					for(j in _styles[i]) { // SERIES 바로 전까지 styles update
						setStyles((styles[i]), j, (_styles[i])[j]);
					}
				}
			}
			for(i in _series) {
				if(_series[i].type == undefined) _series[i].type = "main";
				if(_series[i].type === "main") { 
					MAINCHART.type = _series[i].type;
					MAINCHART.key = i;
					MAINCHART.series = _series[i];
					MAINCHART.top = 0; MAINCHART.style = styles[i];
				} else {
					var obj = {};
					obj.type = _series[i].type,	obj.key = i;
					obj.series = _series[i];
					SUBCHARTS.push(obj);
				}
			}
			USESTOCK = options.usestock;
			var mainChartSeries = MAINCHART.series;
			for (var i in mainChartSeries){
				var thisMainChartSeries = mainChartSeries[i];
				if(thisMainChartSeries.series != undefined){
					if(thisMainChartSeries.series !=="bar"){
						XAXISNAME = thisMainChartSeries.xaxis;
						break;
					} else {
						var x = thisMainChartSeries.xaxis, y = thisMainChartSeries.yaxis;
						thisMainChartSeries.xaxis = y, thisMainChartSeries.yaxis = x;
						XAXISNAME = thisMainChartSeries.xaxis;
					}
				}
			}
			
			if(USESTOCK) {
				if(options.usemobiledevice != "mobile") {
					CHART_HEIGHT = CHART_HEIGHT - 30; // Slider 위치
				} else {
					itemCount = options.itemcount ? options.itemcount : 80;
				}
				options.yaxisformat = "format";
				
				_this.overLayFunction = new ParseOverLayFunction();
				_this.subIndexFunction = new ParseSubIndexFunction();
			}
			series = _series;
			
			makeCanvas();
		};
		/*
		 * CANVAS, DIV 생성
		 */
		var makeCanvas = function () {
			var divOrigin = $(doc.createElement("DIV"));
			var back = $(doc.createElement("CANVAS")); // X-AXIS, Y-AXIS CANVAS
			// GRAPH DRAW CANVAS // MOUSEMOVE, SELECT CANVAS // ETC(max,minvalue...)
			var graph = $(back[0].cloneNode(false)), select = $(back[0].cloneNode(false)), etc = $(back[0].cloneNode(false)); 
			back.attr({"id": CHART_ID + "_back", "width": CHART_WIDTH, "height": CHART_HEIGHT})
				.css({ "width": "100%", "height": 	CHART_HEIGHT+'px', "position": "absolute", "left": 0, "top": 0 });
			graph.attr({"id": CHART_ID + "_graph", "width": CHART_WIDTH, "height": CHART_HEIGHT})
				.css({ "width": "100%", "height": 	CHART_HEIGHT+'px', "position": "absolute", "left": 0, "top": 0 });
			select.attr({"id": CHART_ID + "_select", "width": CHART_WIDTH, "height": CHART_HEIGHT})
				.css({ "width": "100%", "height": 	CHART_HEIGHT+'px', "position": "absolute", "left": 0, "top": 0 });
			etc.attr({"id": CHART_ID + "_etc", "width": CHART_WIDTH, "height": CHART_HEIGHT	})
				.css({ "width": "100%", "height": 	CHART_HEIGHT+'px', "position": "absolute", "left": 0, "top": 0 });
			
			if(USESTOCK) {
				slider = new CreateSlider(CHART_ID, CHART_WIDTH, CHART_HEIGHT, MAINCHART.style, select);
				
				var legendBox = $(divOrigin[0].cloneNode(false));
				legendBox.attr({"id": CHART_ID + "_legendBox"});
			}
			_this.$back = back, _this.$graph = graph, _this.$select = select, _this.$etc = etc;
			
			var flag = doc.createDocumentFragment();
			var div = $(divOrigin[0].cloneNode(false)).css({
				"position": "absolute",	"left": 0, "top": 0,
				"width": CHART_WIDTH, "height": CHART_HEIGHT
			}).attr('class', CHART_ID+"-container");
			div.append(_this.$back).append(_this.$graph).append(_this.$etc);
			if(USESTOCK) { // 증권차트 - 범례표시
				div.append(legendBox);
				legend = new Legend(doc, CHART_ID, legendBox, styles, MAINCHART, CHART_WIDTH, CHART_HEIGHT, _this.subIndexFunction, options.usemobiledevice);
			}
			if(options.usevcrossline || options.usecrossline) { // |
				_this.$vline = $(divOrigin[0].cloneNode(false));
				_this.$vline.attr({"id": CHART_ID + "_vline"})
					.css({
						"position": "absolute", "top": "0px", "left": "1px",
						"width": "1px", "height": CHART_HEIGHT,
						"borderLeft": MAINCHART.style.crosslinewidth + "px "+MAINCHART.style.crosslinestyle + " " + MAINCHART.style.crosslinecolor
					});
				div.append(_this.$vline);
				_this.$vline[0].style.display = 'none';
			}
			if(options.usehcrossline || options.usecrossline) { // ㅡ
				_this.$hline = $(divOrigin[0].cloneNode(false));
				_this.$hline.attr({"id": CHART_ID + "_hline"})
					.css({
						"position": "absolute", "top": "0px", "left": "0px",
						"width": CHART_WIDTH, "height": "1px",
						"borderTop": MAINCHART.style.crosslinewidth + "px "+MAINCHART.style.crosslinestyle + " " + MAINCHART.style.crosslinecolor
					});
				div.append(_this.$hline);
				_this.$hline[0].style.display = 'none';
			}
			
			if(options.usehtip) { // X-Axis 값 보여주는 툴팁
				_this.$htooltip = $(divOrigin[0].cloneNode(false));
				_this.$htooltip.attr({"id": CHART_ID + "_htooltip"})
					.css({
						"position": "absolute", "top": "0px", "left": "0px",
						"minWidth": "90px",
						"border": "1px solid #eee", "padding": "3px"
					});
				div.append(_this.$htooltip);
				_this.$htooltip[0].style.display = 'none';
			}
			if(options.usevtip) { // Y-Axis 값 보여주는 툴팁
				_this.$vtooltip = $(divOrigin[0].cloneNode(false));
				_this.$vtooltip.attr({"id": CHART_ID + "_vtooltip"})
				.css({
					"position": "absolute", "top": "0px", "left": "0px",
					"width": styles[KEY].ylabelgap,
					"border": "1px solid #eee", "padding": "3px"
				});
				div.append(_this.$vtooltip);
				_this.$vtooltip[0].style.display = 'none';
			}
			
			
			// 외부 툴팁이 있는지 확인
			div.append(_this.$select);
			if(options.usetip){
				if(_this.$tooltip != null) {
					$(parent.children()[0], parent).remove();
				} else { // 없으면
					var tip = $(divOrigin[0].cloneNode(false)).css({
						"position": "absolute", "border": "1px solid #eee", "backgroundColor": "#FFF", "padding": "4px", "fontSize": "11px", "whiteSpace": "nowrap"
					}).attr('class', CHART_ID+"-tooltip");
					_this.$tooltip = tip;
				}
				div.append(_this.$tooltip);
				_this.$tooltip[0].style.display = 'none';
			}
			flag.appendChild(div[0]);
			
			if(USESTOCK) { // 증권차트일 경우에 slider append
				parent.append(slider.init()[0]);
				
				var button = doc.createElement("BUTTON");
				var plusButton = $(button.cloneNode(false)).attr('class', 'button-plus').attr('type', 'button').css({
					'position': 'absolute', 'bottom': '7px', 'right': '80px', 'width': '15px', 'height': '15px'
				}).bind('click', function(){
					--itemCountIndex;
					if(itemCountIndex <0) itemCountIndex = 0;
					itemCount = itemCountArray[itemCountIndex];
					sliceData = slider.sliderUpdate('plus', originalData, itemCount);
					createChart(sliceData);
				});
				var minusButton = $(button.cloneNode(false)).attr('class', 'button-minus').attr('type', 'button').css({
					'position': 'absolute', 'bottom': '7px', 'right': '60px', 'width': '15px', 'height': '15px'
				}).bind('click', function(){
					++itemCountIndex;
					if(itemCountIndex > 9) itemCountIndex = 9;
					itemCount = itemCountArray[itemCountIndex];
					if(itemCount > originalData.length || itemCount === "*") {itemCount = originalData.length;}
					sliceData = slider.sliderUpdate('minus', originalData, itemCount);
					createChart(sliceData);
				});
				var defaultButton = $(button.cloneNode(false)).attr('class', 'button-default').attr('type', 'button').css({
					'position': 'absolute', 'bottom': '7px', 'right': '40px', 'width': '15px', 'height': '15px'
				}).bind('click', function(){
					itemCountIndex = 4;
					itemCount = itemCountArray[itemCountIndex];
					if(itemCount > originalData.length) {itemCount = originalData.length - 1;}
					sliceData = slider.sliderUpdate('default', originalData, itemCount);
					createChart(sliceData);
				});
				parent.append(plusButton).append(minusButton).append(defaultButton);
			}
			parent.append(flag);//.append(_this.$tooltip);
			//if(!_this.$back[0].getContext) isIE8 = true;
			if(isIE8) {
				_this.$back[0] = initCanvas(doc.getElementById(CHART_ID + "_back"));
				_this.$graph[0] = initCanvas(doc.getElementById(CHART_ID + "_graph"));
				_this.$select[0] = initCanvas(doc.getElementById(CHART_ID + "_select"));
				_this.$etc[0] = initCanvas(doc.getElementById(CHART_ID + "_etc"));
			}
			draw = new DrawChart(CHART_ID, _this.$back[0].getContext('2d'), _this.$graph[0].getContext('2d'), _this.$etc[0].getContext('2d'), options, styles);
			
			if(isIE8) {
				_this.$select[0].attachEvent("onmousemove", onMouseMove);
				_this.$select[0].attachEvent("onmouseout", onMouseOut);
				if(options.useitemclick)  _this.$select[0].attachEvent("onclick", onMouseDown);
				
				//$(_this.$select).on("mousemove", onMouseMove).on("mouseout", "onMouseOut").on("click", onMouseDown);
			} else {
				_this.$select[0].addEventListener("mousemove", onMouseMove, false);
				_this.$select[0].addEventListener("mouseout", onMouseOut, false);
				if(options.useitemclick)  _this.$select[0].addEventListener("click", onMouseDown, false);
			}
			if(USESTOCK) {
				var loader = function (items, thingToDo, allDone) {
				    if (!items) {
				        return;
				    }
				    if ("undefined" === items.length) {
				        items = [items];
				    }
				    var count = items.length;
				    var thingToDoCompleted = function (items, i) {
				        count--;
				        if (0 == count) {
				            allDone(items);
				        }
				    };
				    
				    for (var i = 0; i < items.length; i++) {
				        thingToDo(items, i, thingToDoCompleted);
				    }
				};
				var loadImage = function (items, i, onComplete) {
					if(imageValue[i] == "min"){
						valueMinImage = new Image();
						var onLoad = function (e) {
					    	$(this).unbind("load");
					        onComplete(items, i);
					    };
					    $(valueMinImage).bind("load", onLoad);
					    valueMinImage.src = items[i];
					} else if(imageValue[i] == "max"){
						valueMaxImage = new Image();
						var onLoad = function (e) {
					    	$(this).unbind("load");
					        onComplete(items, i);
					    };
					    $(valueMaxImage).bind("load", onLoad);
					    valueMaxImage.src = items[i];
					}
				};
				var imageCount = 0, imageArray= [], imageValue = [];;
				for(var i in MAINCHART.series){
					if(i !== "type"){
						var mmStyle = (styles[MAINCHART.key])[i];
						if(mmStyle.useminvalue){
							imageValue.push('min');
							imageArray.push(mmStyle.minvaluearrowimage.url);
							imageCount = imageCount + 1;
						}
						if(mmStyle.usemaxvalue){
							imageValue.push('max');
							imageArray.push(mmStyle.maxvaluearrowimage.url);
							imageCount = imageCount + 1;
						}
						break;
					}
				}
				loader(imageArray, loadImage, function () {
					_this.loadData();
				});
			} else {
				var pattern = [];
				for(var i in _series){
					for(var j in _series[i]){
						if(j != "type"){
							/*for(var k in (styles[i])[j]){
								var s = ((styles[i])[j])[k];
								console.log(s)
							}*/
							var k = (styles[i])[j];
							if((typeof(k.fillcolor)).toLowerCase() == "object" 			&& k.fillcolor.src != undefined){ pattern.push(k.fillcolor.src); }
							if((typeof(k.upfillcolor)).toLowerCase() == "object" 		&& k.upfillcolor.src != undefined){ pattern.push(k.upfillcolor.src); }
							if((typeof(k.downfillcolor)).toLowerCase() == "object" 		&& k.downfillcolor.src != undefined){ pattern.push(k.downfillcolor.src); }
							if((typeof(k.overfillcolor)).toLowerCase() == "object" 		&& k.overfillcolor.src != undefined){ pattern.push(k.overfillcolor.src); }
							if((typeof(k.overupfillcolor)).toLowerCase() == "object" 	&& k.overupfillcolor.src != undefined){ pattern.push(k.overupfillcolor.src); }
							if((typeof(k.overdownfillcolor)).toLowerCase() == "object" 	&& k.overdownfillcolor.src != undefined){ pattern.push(k.overdownfillcolor.src); }
							
						}
					}
				}
				if(pattern.length > 0){
					var loader = function (items, thingToDo, allDone) {
					    if (!items) {
					        return;
					    }
					    if ("undefined" === items.length) {
					        items = [items];
					    }
					    var count = items.length;
					    var thingToDoCompleted = function (items, i) {
					        count--;
					        if (0 == count) {
					            allDone(items);
					        }
					    };
					    
					    for (var i = 0; i < items.length; i++) {
					        thingToDo(items, i, thingToDoCompleted);
					    }
					};
					var loadImage = function (items, i, onComplete) {
							var img = new Image();
							var onLoad = function (e) {
						    	$(this).unbind("load");
						        onComplete(items, i);
						    };
						    $(img).bind("load", onLoad);
						    img.src = items[i];
					};
					loader(pattern, loadImage, function(){
						_this.loadData();
					});
				} else {
					_this.loadData();
				}
			}
		};
		var initCanvas = function(canvas){
			if (typeof FlashCanvas != "undefined") {
	        	FlashCanvas.initElement(canvas);
	        }
	        return canvas;
		};
		/* ELEMENT APPEND - ci.chart.js 에서 호출 */
		this.addElement = function (_width){
			var flag = doc.createDocumentFragment();
			
			var div = $(doc.createElement("DIV")).css({ "position": "absolute",	width: CHART_WIDTH, height: CHART_HEIGHT, "left": _width, "top": 0 });
			div.append(_this.$back[0]).append(_this.$graph[0]).append(_this.$select[0]);
			
			flag.appendChild(div[0]);
			if(USESTOCK) { // 증권차트일 경우에 slider append
				parent.append(slider.init()[0]);
			}
			
			return flag;
		};
		var reDrawCheck = false, reDrawSeries = "";
		this.reDraw = function(option, _series){
			if(USESTOCK){
				originalData = [], sliceData = [];
				legend.legend_MainBoxLeft.children().remove();
				legend.legend_MainBoxRight.children().remove();
				for(var i = 0; i < overSeriesSave.length; i++){
					if(overSeriesSave[i] === "over2"){
						itemCount = itemCount - _this.overLayFunction.over2_param1 + 1;
						break;
					}
				}
				if(_series != null){
					series = $.extend(true, series, _series);
					for(var i in _series) {
						if(series[i].type === "main" || series[i].type == undefined){
							for(var j in _series[i]){
								if((_series[i])[j].visible || (_series[i])[j].visible == undefined){
									reDrawSeries = j;
								}
							}
							MAINCHART.series = $.extend(true, {}, series[i]);
						}
					}
				}
				reDrawCheck = true;
			}
			$.extend(options, option);
			_this.loadData();
		};
		this.changeSize = function(w, h){
			sliceData = [];
			CHART_WIDTH = w, CHART_HEIGHT = h;
			
			if(options.usetip) this.$tooltip.hide();
			_this.$back.attr('width', CHART_WIDTH).css('width', CHART_WIDTH);
			_this.$graph.attr('width', CHART_WIDTH).css('width', CHART_WIDTH);
			_this.$select.attr('width', CHART_WIDTH).css('width', CHART_WIDTH);
			_this.$etc.attr('width', CHART_WIDTH).css('width', CHART_WIDTH);
			_this.$back[0].getContext('2d').canvas.width = CHART_WIDTH;
			_this.$graph[0].getContext('2d').canvas.width = CHART_WIDTH;
			_this.$select[0].getContext('2d').canvas.width = CHART_WIDTH;
			_this.$etc[0].getContext('2d').canvas.width = CHART_WIDTH;
			var cw = CHART_WIDTH - MAINCHART.style.canvaspaddingleft - MAINCHART.style.canvaspaddingright - MAINCHART.style.ylabelgap - MAINCHART.style.ylabelpaddingright - MAINCHART.style.ylabelpaddingleft;
			if(USESTOCK) {
				legend.legend_MainBoxLeft.children().remove();
				legend.legend_MainBoxRight.children().remove();
				reDrawCheck = true;
				legend.container.css('width', cw);
			}
			if(options.usehcrossline || options.usecrossline) {
				_this.$hline.css('width', CHART_WIDTH);
			}
			if(options.usevcrossline || options.usecrossline) {
				//_this.$vline.css('width', CHART_WIDTH);
			}
			
			//chartData.loadData(options, _this.complete);
			var obj = new Object();
			obj._data = originalData;
			_this.complete(obj);
		};
		var reDrawAddCheck = false;
		this.reDrawAdd = function(option){
			if(USESTOCK){
				originalData = [], sliceData = [];
				legend.legend_MainBoxLeft.children().remove();
				legend.legend_MainBoxRight.children().remove();
				for(var i = 0; i < overSeriesSave.length; i++){
					if(overSeriesSave[i] === "over2"){
						itemCount = itemCount - _this.overLayFunction.over2_param1 + 1;
						break;
					}
				}
			}
			$.extend(options, option);
			chartData.loadData(options, _this.completeAdd);
		};
		this.completeAdd = function(_obj){
			var data = _obj._data; // 원본 데이터
			var len = data.length; 
			if(data != null || data != "undefined" || len > 0){
				reDrawAddCheck = true;
				_this.complete(_obj);
			}
		};
		/* DATA CLASS 생성, 호출 - ci.chart.js 에서 호출 */
		this.loadData = function () {
			if(options.url != "" && options.url != null){
				chartData = new ChartData();
				chartData.loadData(options, _this.complete);
			} else {
				var selCtx = _this.$select[0].getContext('2d');
				var measureTxt = selCtx.measureText("Not Loaded.");
				selCtx.font = "11px 'dotum'";
				selCtx.fillText("Not Loaded.", selCtx.canvas.width /2 - measureTxt.width/2, selCtx.canvas.height /2);
			}
		};
		var valueMinImage = null, valueMaxImage = null;
		/* 데이터 로딩 완료 후 호출 되는 함수 */
		this.complete = function (_obj) {
			allClear();
			var data = _obj._data; // 원본 데이터
			//originalData = data.concat([]);
			
			var len = data.length;
			if(data != null || data != "undefined" || len > 0){
				if(reDrawAddCheck){
					var origin = parseData(data.concat([]), MAINCHART);
					originalData = origin.concat(originalData);
					reDrawAddCheck = false;
				} else {
					originalData = parseData(data.concat([]), MAINCHART);
				}
				if(len > itemCount && USESTOCK)	sliceData = data.slice(len - itemCount, len);
				else sliceData = originalData;
				var $parent = $(parent);
				if(!USESTOCK) createChart(sliceData);
				else {
					slider.sliderInit(originalData, itemCount, options.usemobiledevice);
					if(!reDrawCheck){
						var mouseDownCheck = false;
						if(('createTouch' in doc) || ('ontouchstart' in doc)){
							slider.slider[0].addEventListener("touchstart", function(event){ 
								mouseDownCheck = true;
							}, false);
							slider.slider[0].addEventListener("touchmove", function(event){
								if(mouseDownCheck){
									event.preventDefault();
									mouseMoveHandler(originalData);
								}
							}, false);
							slider.slider[0].addEventListener("touchend", function(event){
								if(mouseDownCheck) mouseMoveHandler(originalData);
							}, false);
							if(options.usemobiledevice != "mobile") {
								_this.$select[0].addEventListener("touchstart", function(event){ 
									if(_this.threelinechart != null || _this.pnfchart != null) return;
									mouseDownCheck = true;	
								}, false);
								_this.$select[0].addEventListener("touchmove", function(event){
									if(_this.threelinechart != null || _this.pnfchart != null) return;
									if(mouseDownCheck){
										event.preventDefault();
										mouseMoveHandler(originalData);
									}
								}, false);
								_this.$select[0].addEventListener("touchend", function(event){
									if(_this.threelinechart != null || _this.pnfchart != null) return;
									if(mouseDownCheck) mouseMoveHandler(originalData);
								}, false);
							}
						} else {
							slider.slider.mousedown(function(event){
								mouseDownCheck = true;
							}).mousemove(function(event){
								if(mouseDownCheck){
									mouseMoveHandler(originalData);
								}
							}).mouseup(function(event){ mouseDownCheck = false;	});
						}
						if(options.usemobiledevice != "mobile"){
							//$("input[value='over1']", $parent).click().attr("checked", true);//attr("checked", true).triggerHandler('click');
							//if(options.usestocksub) $("input[value='volume']", $parent).click().attr("checked", true);//attr("checked", true).triggerHandler('click');
							$("input[value='over1']", $parent).click().prop('checked', true);
							if(options.usestocksub) $("input[value='volume']", $parent).click().prop('checked', true);
							try{
								$.uniform.update($("input[value='over1']", $parent));
								$.uniform.update($("input[value='volume']", $parent));
							}catch(e){}
						} else {
							_this.reDrawOverSeries('over1', true);
							_this.reDrawSubSeries('volume', true);
						}
					} else { // ReDraw 될 경우
						slider.slider.show();
						slider.sliderReInit(originalData, itemCount);
						
						var over = overSeriesSave, sub = subSeriesSave;
						overSeriesSave = [], subSeriesSave = [], SUBCHARTS = [];
						if(reDrawSeries == "") $("input[value='candle']", $parent).click().prop('checked', true);
						else  $("input[value='"+reDrawSeries+"']", $parent).click().prop('checked', true);
						try{
							if(reDrawSeries == "") $.uniform.update($("input[value='candle']", $parent));
						}catch(e){}
						for(var i = 0; i < over.length; i++){
							$("input[value='"+over[i]+"']", $parent).click().prop('checked', true);
							try{$.uniform.update($("input[value='"+over[i]+"']", $parent));}catch(e){}
						}
						for(var i = 0; i < sub.length; i++){
							$("input[value='"+sub[i]+"']", $parent).click().prop('checked', true);
							try{$.uniform.update($("input[value='"+sub[i]+"']", $parent));}catch(e){}
						}
					}
				}
			} else { /*Failed..*/ }
			
		};
		/* MIN, MAX, BASE 구하기 */
		var parseData = function (_data, _thisChart) {
			_thisChart.max = -99999999999999999, _thisChart.min = 99999999999999999;
			var thisYaxisId = "";
			var smax = 0, smin = 99999999999999999, smaxArr = [], sminArr = [];
			for(var i in _thisChart.series) {
				var thisSeries = _thisChart.series[i];
				if(thisSeries.series != undefined && thisSeries.visible != false){
					var count = _data.length - 1;
					if(thisYaxisId == "") thisYaxisId = thisSeries.yaxisid;
					for(var j = overSeriesSave.length; j--;){
						if(overSeriesSave[j] == "over2"){
							count = count - _this.overLayFunction.over2_param1;
							break;
						}
					}
					
					var last = _data[count], thisSeries = _thisChart.series[i];
					if(thisSeries.series != "candle" && _thisChart.series[i].series != "hloc"){
						base = getMin(base, last[thisSeries.yaxis]);
					} else {
						base = getMin(base, getMin(last[thisSeries.close], last[thisSeries.low]));
					}
					if(thisYaxisId == thisSeries.yaxisid){
						if(thisSeries.form != "stacked"){ // NORMAL
							var vmax = -99999999999999999, vmin = 99999999999999999;
							for(var j = _data.length; j--;){
								t = _data[j];
								if(t.xaxis === " ") continue;
								for(var k in t){
									if(!isNaN(t[k]) && k != thisSeries.xaxis){
										if(t[k] != null)
											t[k] = Number(t[k]);
									}
								}
								if(thisSeries.series != "candle" && _thisChart.series[i].series != "hloc"){
									if(t[thisSeries.yaxis] != null && t[thisSeries.yaxis] != undefined && t[thisSeries.yaxis] != "" && !isNaN(t[thisSeries.yaxis]) || String(t[thisSeries.yaxis]) === "0"){
										vmax = getMax(vmax, t[thisSeries.yaxis]), vmin = getMin(vmin, t[thisSeries.yaxis]);
										if(thisSeries.minaxis != undefined)	vmax = getMax(vmax, t[thisSeries.minaxis]),	vmin = getMin(vmin, t[thisSeries.minaxis]);
										t.xaxis = t[thisSeries.xaxis].toString(), t.yaxis = Number(t[thisSeries.yaxis]);
									}
								} else {
									if(t[thisSeries.close] != null && t[thisSeries.close] != undefined && t[thisSeries.close] != ""){
										var mx = getMax(t[thisSeries.close], t[thisSeries.high]), mn = getMin(t[thisSeries.close], t[thisSeries.low]);
										vmax = getMax(vmax, mx), vmin = getMin(vmin, mn);
										t.xaxis = t[thisSeries.xaxis].toString();
										t.open = Number(t[thisSeries.open]), t.high = Number(t[thisSeries.high]);
										t.close = Number(t[thisSeries.close]), t.low = Number(t[thisSeries.low]);
									}
								}
							}
							_thisChart.base = base;
							
							if(vmax == -100000000000000000 && vmin == 100000000000000000 && _thisChart.max == -100000000000000000 && _thisChart.min ==100000000000000000)
								_thisChart.max = 90, _thisChart.min = 0;
							else 
								_thisChart.max = getMax(_thisChart.max, vmax), _thisChart.min = getMin(_thisChart.min, vmin);
						} else { // STACKED
							var loop = true;
							var lastSeries = i;
							for(var j = _data.length; j--;){
								t = _data[j];
								smax = 0;
								for(var k in _thisChart.series) {
									if(k == 'type' || _thisChart.series[k].visible == false) continue;
									if(thisYaxisId == _thisChart.series[k].yaxisid){
										smax = smax + Number(t[_thisChart.series[k].yaxis]);
										lastSeries = k;
									}
								}
								smaxArr.push(smax);
								if(j == 0) {
									loop = false;
								}
							}
							_thisChart.base = base;
							_thisChart.max = Math.max.apply(_thisChart.max, smaxArr), _thisChart.min = Math.min.apply(_thisChart.min, smaxArr);
							if(!loop) {
								i = lastSeries;
							}
						}
					} else {
						var vmax = -99999999999999999, vmin = 99999999999999999;
						for(var j = _data.length; j--;){
							t = _data[j];
							if(t.xaxis === " ") continue;
							for(var k in t){
								if(!isNaN(t[k]) && k != thisSeries.xaxis){
									t[k] = Number(t[k]);
								}
							}
							if(thisSeries.series != "candle" && _thisChart.series[i].series != "hloc"){
								if(t[thisSeries.yaxis] != null && t[thisSeries.yaxis] != undefined && t[thisSeries.yaxis] != "" && !isNaN(t[thisSeries.yaxis])){
									vmax = getMax(vmax, t[thisSeries.yaxis]), vmin = getMin(vmin, t[thisSeries.yaxis]);
									if(thisSeries.minaxis != undefined)	vmax = getMax(vmax, t[thisSeries.minaxis]),	vmin = getMin(vmin, t[thisSeries.minaxis]);
									t.xaxis = String(t[thisSeries.xaxis]), t.yaxis = Number(t[thisSeries.yaxis]);
								}
							} else {
								if(t[thisSeries.close] != null && t[thisSeries.close] != undefined && t[thisSeries.close] != ""){
									var mx = getMax(t[thisSeries.close], t[thisSeries.high]), mn = getMin(t[thisSeries.close], t[thisSeries.low]);
									vmax = getMax(vmax, mx), vmin = getMin(vmin, mn);
									t.xaxis = t[thisSeries.xaxis].toString();
									t.open = Number(t[thisSeries.open]), t.high = Number(t[thisSeries.high]);
									t.close = Number(t[thisSeries.close]), t.low = Number(t[thisSeries.low]);
								}
							}
						}
						_thisChart.base = base;
						_thisChart.max = getMax(_thisChart.max, vmax), _thisChart.min = getMin(_thisChart.min, vmin);
					}
				}
			}
			return _data;
		};
		var createChart = function ( _data, _sliderChk ){
			allClear();
			if(_data.length < itemCount && USESTOCK) slider.slider.hide();
			
			var subLen = SUBCHARTS.length;
			var bottompadding = (USESTOCK) ? 10 : 0;
			var mainChartHeight = (CHART_HEIGHT - bottompadding) * DIVISION[subLen][0] / 100;
			MAINCHART.height = mainChartHeight;
			
			_data = parseData(_data, MAINCHART);
			var mainChartSeries = MAINCHART.series;
			var firstData = null;
			for(var i in mainChartSeries){
				var thisMainChartSeries = mainChartSeries[i];
				// MAIN에 오버레이 SERIES 걸러내기
				if(thisMainChartSeries.series != undefined && thisMainChartSeries.series == "column" && thisMainChartSeries.form == "updown-c" && firstData == null){ 
					firstData = _data.shift();
					break;
				}
			}
			
			draw.drawSerieses = [];
			draw.initialize({
				"data": _data, "option": MAINCHART, "slider": _sliderChk, "minimage": valueMinImage, "maximage": valueMaxImage, "firstdata": firstData
			});
			if(options.usesale && !USESTOCK){
				overLay7();
				var startX = (MAINCHART.style.yaxisalign == "left") ? Number(MAINCHART.style.canvaspaddingleft) + Number(MAINCHART.style.ylabelgap) + 0.5: Number(MAINCHART.style.canvaspaddingleft) + 1.5;
				for(var i = _this.over7_param1; i--;) over7_draw(_this.over7_param1 - (i + 1), startX);
			}
			var parentID = parent.id;
			if(USESTOCK){ 
				$("button[id^="+CHART_ID+"-button]", parent).remove();  // 보조지표 닫기버튼 삭제
				if(subLen > 0) {
					for(var i = subLen; i--;){
						if(SUBCHARTS[i].series.visible != false){
							var subChartHeight = Math.floor((CHART_HEIGHT - bottompadding) * DIVISION[subLen][i + 1] / 100);
							SUBCHARTS[i].height = subChartHeight;
							SUBCHARTS[i].top = Math.floor(mainChartHeight + (subChartHeight * i));
							parseData(_data, SUBCHARTS[i]);
							draw.initialize({ "data": _data, "option": SUBCHARTS[i] });
							legend.subInit(SUBCHARTS[i]);
							if(options.usemobiledevice == "pc"){
								var button = draw.createSubChartButton(SUBCHARTS[i], SUBCHARTS[i].top, subChartHeight);
								button.bind('click', function(){
									var id = $(this).attr('id');
									id = id.split('-button-')[1];
									
									$(styles).removeProp(id), $(series).removeProp(id);
									legend.remove_subIndex(id);
									
									$('.stockchartsub-option-select', parent).find('option').each(function(){
										if(id == $(this).val()){
											$(this).remove();
											return false;
										}
									});
									$('.stockchartsub-option-select', parent).eq(0).attr('selected', true);
									try{
										$.uniform.update($('.stockchartsub-option-select', parent));
									}catch(e){}
									var $layer = $('.stockchartsub-option-container', parent);
									var name = $layer.children().eq(0).attr('class');
									if(name == id) {
										$('.stockchartsub-option').find("div."+name).html($layer.find("div."+name).children().clone());
										
										$layer.children().remove();
										
										var $option = $('.stockchartsub-option li', parent).find('div.'+id);//.children();
										$layer.html($option.clone());
									}
									
									for(i = subSeriesSave.length; i--;) {
										if(subSeriesSave[i] == id) {
											subSeriesSave.splice(i, 1);
											SUBCHARTS.splice(i, 1);
											break;
										}
									}
									$("input[value='"+id+"']", parent).prop('checked', false);
									try{
										$.uniform.update($("input[value='"+id+"']", parent));
									}catch(e){}
									createChart(sliceData);
								});
								$('canvas[id$=select]', parent).after(button);
							}
						}
					}
				}
				if(over7_select){
					overLay7();
					var startX = (MAINCHART.style.yaxisalign == "left") ? Number(MAINCHART.style.canvaspaddingleft) + Number(MAINCHART.style.ylabelgap) + 0.5: Number(MAINCHART.style.canvaspaddingleft) + 1.5;
					for(var i = _this.over7_param1; i--;) over7_draw(_this.over7_param1 - (i + 1), startX);
				}
				
				if(options.funcmoveall != null){
					var count = originalData.length - 1;
					for(var j = overSeriesSave.length; j--;){
						if(overSeriesSave[j] == "over2"){
							count = count - _this.overLayFunction.over2_param1 + 1;
							break;
						}
					}
					var item = {};
					item.data = {};
					item.data.item = originalData[count];
					if(String(typeof(options.funcmoveall)).toLowerCase() === "string"){
						eval(eval(options.funcmoveall)(item));
					} else {
						eval(options.funcmoveall(item));
					}
				}
			} else {
				if(subLen > 0) {
					for(var i = subLen; i--;){
						if(SUBCHARTS[i].series.visible != false){
							var subChartHeight = Math.floor((CHART_HEIGHT - bottompadding) * DIVISION[subLen][i + 1] / 100);
							SUBCHARTS[i].height = subChartHeight;
							SUBCHARTS[i].top = Math.floor(mainChartHeight + (subChartHeight * i));
							parseData(_data, SUBCHARTS[i]);
							draw.initialize({ "data": _data, "option": SUBCHARTS[i] });
						}
					}
				}
			}
			if(options.usecanvasmoveall && options.funcmoveall != null && !USESTOCK){
				var item = {};
				item.data = {};
				item.data.item = originalData[originalData.length - 1];
				if(String(typeof(options.funcmoveall)).toLowerCase() === "string"){
					eval(eval(options.funcmoveall)(item));
				} else {
					eval(options.funcmoveall(item));
				}
			}
		};
		
		var onMouseDown = function(event) {
			if(draw.HitItem != null){
				eval(eval(options.funcclick)(draw.HitItem));
			}
		};
		
		var onMouseMove = function(event) {
			try{
				var zoom = 1;
				if (event.offsetX) { // Opera
					event._x = event.offsetX, event._y = event.offsetY;
			    } else { // Firefox
			    	event._x = event.layerX, event._y = event.layerY;
			    }
				event._x = event._x / zoom, event._y = event._y / zoom;
		      	
				if(options.usevcrossline || options.usecrossline) { // |
		      		var startX = draw.drawAxis.startX;
		      		if(event._x > startX && event._x < draw.GRAPH_WIDTH + startX){
		      			_this.$vline[0].style.display = 'block';
		      			_this.$vline[0].style.left = event._x - 2+'px';
		      		} else {
		      			_this.$vline[0].style.display = 'none';
		      			if(options.usecrossline) _this.$hline[0].style.display = 'none';
		      		}
		      	}
				if(options.usehcrossline || options.usecrossline) { //ㅡ
		      		var startY = styles[MAINCHART.key].canvaspaddingtop;
		      		var h = CHART_HEIGHT - styles[MAINCHART.key].canvaspaddingbottom - startY + 2;// - slider.sliderContainer.height();
		      		if(event._y > startY && event._y < h){
		      			_this.$hline[0].style.display = 'block';
		      			_this.$hline[0].style.top = event._y - 2+'px';
		      		} else {
		      			_this.$hline[0].style.display = 'none';
		      			if(options.usecrossline) _this.$vline[0].style.display = 'none';
		      		}
		      	}
		      	
		      	var top = 0, height = 0;
		      	if(MAINCHART.top < event._y && MAINCHART.height > event.y){
		      		height = MAINCHART.height;
		      	} else {
		      		for(var i = SUBCHARTS.length; i --;){
		      			var subSeries = SUBCHARTS[i];
		      			if(subSeries.top < event._y && subSeries.top+subSeries.height > event._y){
		      				top = subSeries.top, height = subSeries.height;
		      				break;
		      			}
		      		}
		      	}
		      	
		      	var item = {};
		      	item.data = {};
		      	item.container = _this.$tooltip;
		      	draw.onMouseMove(event, _this.$select[0].getContext('2d'), top, height, item);
		      	if(!USESTOCK) { // 종합차트가 아니고 툴팁을 사용할 경우.
		      		if(options.usetip && options.usecanvasmoveall){ // 아이템 오버되지 않아도 마우스 위치의 정보를 가져오고자 할 경우(툴팁 동시 사용)
		      			var drawSD = draw.drawSerieses[0].seriesData;
			      		for(var i = drawSD.length; i--;){
		      				var data = drawSD[i];
		      				if(data.x <= event._x && data.x + data.width > event._x){
		      					if(data.xaxis === " ") return;
		      					var hitItem = {};
		      					hitItem.container = _this.$tooltip;
		      					if(draw.HitItem != null) {
		      						//hitItem.container.animate({opacity: 1}, {duration: 10, queue: false});
		      						hitItem.data = draw.HitItem;
		      						if(options.functip != null){
		      							if(String(typeof(options.functip)).toLowerCase() === "string"){
		      								eval(eval(options.functip)(hitItem));
		      							} else {
		      								eval(options.functip(hitItem));
		      							}
		      						} else {
		      							mouseMoveToolTip(event, hitItem);
		      						}
		      					}
		      					item.data.item = data;
		      					if(options.funcmoveall != null){
		      						if(String(typeof(options.funcmoveall)).toLowerCase() === "string"){
		    							eval(eval(options.funcmoveall)(item));
		    						} else {
		    							eval(options.funcmoveall(item));
		    						}
		      					}
		      					break;
			      			}
			      		}
		      		} else if(options.usetip && !options.usecanvasmoveall) { // 마우스 오버된 아이템 정보만 가져옴.
				      	item.data = draw.HitItem;
				      	if(options.functip != null){
							if(draw.HitItem == null) return;
							//item.container.animate({opacity: 1}, {duration: 10, queue: false});
							if(String(typeof(options.functip)).toLowerCase() === "string"){
								eval(eval(options.functip)(item));
							} else {
								eval(options.functip(item));
							}
						} else {
//							console.log(item)
							mouseMoveToolTip(event, item);
						}
		      		} else if(!options.usetip && options.usecanvasmoveall){ // 아이템 오버되지 않아도 마우스 위치의 정보를 가져오고자 할 경우(툴팁 동시 사용 X) 
		      			
		      			var drawSD = draw.drawSerieses[0].seriesData;
			      		for(var i = drawSD.length; i--;){
		      				var data = drawSD[i];
		      				if(data.x <= event._x && data.x + data.width > event._x){
		      					if(data.xaxis === " ") return;
		      					item.data.item = data;
		      					if(options.funcmoveall != null){
		      						if(String(typeof(options.funcmoveall)).toLowerCase() === "string"){
		    							eval(eval(options.funcmoveall)(item));
		    						} else {
		    							eval(options.funcmoveall(item));
		    						}
		      					}
		      					break;
			      			}
			      		}
		      		}
		      	}
		      	if(USESTOCK) { /* 마우스위치 데이터값 출력 */
		      		var drawSD = draw.drawSerieses[0].seriesData;
		      		for(var i = drawSD.length; i--;){
	      				var data = drawSD[i];
	      				if(data.x <= event._x && data.x + data.width > event._x){
	      					if(data.xaxis === " ") return;
	      					if(legend.legend_MainBoxRight.children().length > 0){
		      					var legend_over = legend.legend_MainBoxRight.children().eq(0).attr('class').split(CHART_ID+"-")[1];
		      					legend[legend_over+"_legendMouseMove"](data);
	      					}
	      					for(var i = SUBCHARTS.length; i--;)
	      						legend[SUBCHARTS[i].key + "_legendMouseMove"](data);
	      					
	      					if(options.funcmoveall != null){
	      						item.data.item = data;
	      						if(String(typeof(options.funcmoveall)).toLowerCase() === "string"){
	    							eval(eval(options.funcmoveall)(item));
	    						} else {
	    							eval(options.funcmoveall(item));
	    						}
	      					}
	      					break;
		      			}
		      		}
		      	}
		      	
			}catch(e){}
		};
		
		var mouseMoveToolTip = function (_event, _item){
			if(_item.data == null) return;
			
			var xaxisValue = _item.data.item[XAXISNAME], yaxisValue = null;
			if(_item.data.item.yaxis == undefined) {
				yaxisValue = _item.data.item.close;
			} else { 
				yaxisValue = _item.data.item.yaxis;
			}
			if(options.xaxisformat != null) xaxisValue = (_item.data.series.series != "bar") ? eval(options.xaxisformat)(xaxisValue) : eval(options.yaxisformat)(xaxisValue);
			if(options.yaxisformat != null) yaxisValue = (_item.data.series.series != "bar") ? eval(options.yaxisformat)(yaxisValue) : eval(options.xaxisformat)(yaxisValue);
			
			$(_item.container).text(xaxisValue +' : '+ yaxisValue);
			var tipWidth = _item.container.outerWidth(), tipWidthHalf = tipWidth / 2;
			var tPos = _item.data.item.y + _item.data.item.height, lPos = _item.data.item.x + _item.data.item.width / 2;
			if(_item.data.top != undefined){
				tPos = _item.data.top;
				if(_item.data.series.series == "line" || _item.data.series.series == "area" || _item.data.series.series == "plot"){
					lPos = _item.data.left;
				} else {
					lPos = _item.data.left + _item.data.item.width / 2;
				}
			}
			tPos = Math.round(tPos - _item.container.outerHeight() - 5), lPos = Math.round(lPos - tipWidthHalf);
			if(tPos < 0){ tPos = 0 + 5; }
			if(_item.data.item.comp === "down" && _item.data.series.series == "candle") {}// tPos = tPos + _item.container.outerHeight() + 10;// - (_item.container.outerHeight() + 10);
			else if(_item.data.item.comp === "down" && _item.data.series.series != "line" && _item.data.series.series != "area" && _item.data.series.series != "plot") tPos = tPos + _item.container.outerHeight() + 10;
			if(lPos < 0) lPos = 0;
			else if(lPos + tipWidth >= CHART_WIDTH) lPos = CHART_WIDTH - tipWidth;
			if(_item != ""){
				_item.container.show().css({top: tPos, left: lPos});
			}
		};
		
		var mouseMoveHandler = function(_data){
			var temp = _data.concat([]);
			sliceData = temp.splice(slider.leftSliderIndecator, itemCount);
			
			createChart(sliceData, slider.sliderDownChk);
			_data = null, temp = null;
		};
		
		var onMouseOut = function(_event) {
			if(options.usecrossline){
				_this.$vline[0].style.display = 'none';
				_this.$hline[0].style.display = 'none';
			} else if(options.usevcrossline) { // |
	      		_this.$vline[0].style.display = 'none';
	      	} else if(options.usehcrossline) { //ㅡ
      			_this.$hline[0].style.display = 'none';
	      	}
			if(_this.$tooltip != null) {
				_this.$tooltip[0].style.display = 'none';
			}
		};
		
		/*
		 * 종합차트 - 차트형식
		 */
		this.reDrawMainSeries = function(_value, _series){
			if(_value === 'candle' || _value === 'hloc' || _value === 'line'){
				if(isIE8){
					_this.$select[0].attachEvent("onmousemove", onMouseMove);
					_this.$select[0].attachEvent("onmouseout", onMouseOut);
				} else {
					_this.$select[0].addEventListener("mousemove", onMouseMove, false);
					_this.$select[0].addEventListener("mouseout", onMouseOut, false);
				}
				if(options.usecrossline){
					_this.$vline[0].style.display = 'block';
					_this.$hline[0].style.display = 'block';
				} else if(options.usevcrossline) { // |
		      		_this.$vline[0].style.display = 'block';
		      	} else if(options.usehcrossline) { //ㅡ
	      			_this.$hline[0].style.display = 'block';
		      	}
				_this.threelinechart = null, _this.pnfchart = null;
				
				$(parent).find('div[class*=legend]').show();
				$(parent).find('button[value="X"]').show();
				
				slider.slider.show();
			} else if(_value === 'three'){
				_this.threelinechart = new ThreeLineChart(_this.$etc, options, styles, MAINCHART);
				var drawSerieses = draw.drawSerieses;
				var drawSeries = null, loopCheck = true;
				for(var s in drawSerieses){
					var thisSerieses = drawSerieses[s].series;
					if(thisSerieses.type == "main"){
						for(var k in thisSerieses){
							if(k != "type"){
								var thisSeries = thisSerieses[k];
								if(thisSeries.stockmain && thisSeries.visible != false){
									drawSeries = drawSerieses[s];
									
									loopCheck = false;
									break;
								}
							}
						}
						if(!loopCheck) break;
					}
				}
				_this.threelinechart.init(originalData, drawSeries.GRAPH_WIDTH);
				if(isIE8){
					_this.$select[0].detachEvent("onmousemove", onMouseMove);
					_this.$select[0].detachEvent("onmouseout", onMouseOut);
				} else {
					_this.$select[0].removeEventListener("mousemove", onMouseMove, false);
					_this.$select[0].removeEventListener("mouseout", onMouseOut, false);
				}
				if(options.usecrossline){
					_this.$vline[0].style.display = 'none';
					_this.$hline[0].style.display = 'none';
				} else if(options.usevcrossline) { // |
		      		_this.$vline[0].style.display = 'none';
		      	} else if(options.usehcrossline) { //ㅡ
	      			_this.$hline[0].style.display = 'none';
		      	}
				$(parent).find('div[class*=legend]').hide();
				$(parent).find('button[value="X"]').hide();
				
				slider.slider.hide();
				return;
			} else if(_value === 'pnf'){
				_this.pnfchart = new PnFChart(_this.$etc, options, styles, MAINCHART);
				var drawSerieses = draw.drawSerieses;
				var drawSeries = null, loopCheck = true;
				for(var s in drawSerieses){
					var thisSerieses = drawSerieses[s].series;
					if(thisSerieses.type == "main"){
						for(var k in thisSerieses){
							if(k != "type"){
								var thisSeries = thisSerieses[k];
								if(thisSeries.stockmain && thisSeries.visible != false){
									drawSeries = drawSerieses[s];
									
									loopCheck = false;
									break;
								}
							}
						}
						if(!loopCheck) break;
					}
				}
				_this.pnfchart.init(originalData, drawSeries.GRAPH_WIDTH);
				
				if(isIE8){
					_this.$select[0].detachEvent("onmousemove", onMouseMove);
					_this.$select[0].detachEvent("onmouseout", onMouseOut);
				} else {
					_this.$select[0].removeEventListener("mousemove", onMouseMove, false);
					_this.$select[0].removeEventListener("mouseout", onMouseOut, false);
				}
				
				if(options.usecrossline){
					_this.$vline[0].style.display = 'none';
					_this.$hline[0].style.display = 'none';
				} else if(options.usevcrossline) { // |
		      		_this.$vline[0].style.display = 'none';
		      	} else if(options.usehcrossline) { //ㅡ
	      			_this.$hline[0].style.display = 'none';
		      	}
				$(parent).find('div[class*=legend]').hide();
				$(parent).find('button[value="X"]').hide();
				
				slider.slider.hide();
				return;
			}
			slider.mainSeriesValue = _value;
			slider.sliderDownChk = false;
			var mainChartSeries = MAINCHART.series;
			for(var i in mainChartSeries){
				var thisMainChartSeries = mainChartSeries[i];
				// MAIN에 오버레이 SERIES 걸러내기
				if(thisMainChartSeries.series != undefined && i.indexOf('over') < 0){ 
					if(thisMainChartSeries.series == _value){
						thisMainChartSeries.visible = true;
					} else {
						thisMainChartSeries.visible = false;
					}
				}
			}
			createChart(sliceData);
		};
		
		/*
		 * 종합차트 - 오버레이
		 */
		var overSeriesSave = [];
		var dataSkip = 1;
		this.reDrawOverSeries = function($checkbox, _checked) {
			var _value = $checkbox;
			if(typeof($checkbox) == "object"){ _value = $checkbox.attr('value'); }
			
			var style = null, item = null;
			var overFunc = _this.overLayFunction;
			if(_checked) {
				for(var i = overSeriesSave.length; i--;){
					if(overSeriesSave[i] == _value) return;
				}
				switch(_value){
				case "over1":
					style = {
						"over1_series1": { "strokecolor": "rgba(242,54,23,0.6)", "overstrokewidth": 0, "overfillcolor": "#f23617" },
						"over1_series2": { "strokecolor": "rgba(130,203,20,0.6)", "overstrokewidth": 0, "overfillcolor": "#82cb14" },
						"over1_series3": { "strokecolor": "rgba(56,162,243,0.6)", "overstrokewidth": 0, "overfillcolor": "#38a2f3" }
					};
					item = {
						"over1_series1": { "series": "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "5일선"	},
						"over1_series2": { "series": "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "20일선" },
						"over1_series3": { "series": "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "60일선" }
					};
					overFunc.parseOver1Data( originalData, item, _value );
					legend.over1_legend(style, overFunc.over1_param1, overFunc.over1_param2, overFunc.over1_param3);
					break;
				case "over2":
					style = {
						"over2_series1": { "strokecolor": "rgba(236,0,140,0.6)", "overstrokewidth": 0, "overfillcolor": "rgba(236,0,140,1)" }, // 전환
						"over2_series2": { "strokecolor": "rgba(0,147,67,0.6)", "overstrokewidth": 0, "overfillcolor": "rgba(0,147,67,1)" }, // 기준
						"over2_series6": { "overfillcolor": "rgba(0,0,0,0)", "overstrokewidth": 0}, // 선행1 Area
						"over2_series3": { "strokecolor": "rgba(21,120,221,0.6)", "overstrokewidth": 0, "overfillcolor": "rgba(21,120,221,1)" }, // 선행1
						"over2_series4": { "strokecolor": "rgba(78,81,158,0.6)", "overstrokewidth": 0, "overfillcolor": "rgba(78,81,158,1)" }, // 선행2
						"over2_series5": { "strokecolor": "rgba(102,102,102,0.6)", "overstrokewidth": 0, "overfillcolor": "rgba(102,102,102,1)" }  // 후행
					};
					item = {
						"over2_series1": { "series": "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "전환" },
						"over2_series2": { "series": "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "기준" },
						"over2_series6": { "series": "area", "xaxis": XAXISNAME, "yaxis": "close", "minaxis": "close", "label": "선행1" },
						"over2_series3": { "series": "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "선행1" },
						"over2_series4": { "series": "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "선행2" },
						"over2_series5": { "series": "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "후행" }
					};
					overFunc.parseOver2Data( originalData, item, _value, XAXISNAME );
					legend.over2_legend(style, overFunc.over2_param2, overFunc.over2_param1, overFunc.over2_param3);
					break;
				case "over3":
					style = {
						"over3_series4": { "upfillcolor": "rgba(214,194,173,0.2)" }, 
						"over3_series1": { "strokecolor": "rgba(242,109,125,0.6)", "overstrokewidth": 0, "overfillcolor": "#f26d7d" }, 
						"over3_series2": { "strokecolor": "rgba(124,169,0,0.6)", "overstrokewidth": 0, "overfillcolor": "#7ca900" }, 
						"over3_series3": { "strokecolor": "rgba(48,192,200,0.6)", "overstrokewidth": 0, "overfillcolor": "#30c0c8" }  
					};
					item = {
						"over3_series4": { "series": "area", "xaxis": XAXISNAME, "yaxis": "close", "minaxis": "close" },
						"over3_series1": { "series": "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "U" },
						"over3_series2": { "series": "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "L" },
						"over3_series3": { "series": "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "M" }
					};
					overFunc.parseOver3Data( originalData, item, _value, XAXISNAME );
					legend.over3_legend(style, overFunc.over3_param1, originalData[originalData.length - dataSkip]);
					break;
				case "over4":
					style = { "over4_series1": { "fillcolor": "rgba(178,42,242,0.4)", "strokewidth": 0, "overstrokewidth": 0, "overfillcolor": "rgba(178,42,242,1)" } };
					item = { "over4_series1": { "series": "plot", "xaxis": XAXISNAME, "yaxis": "close", "label": "Parabolic" } };
					overFunc.parseOver4Data( originalData, item, _value, XAXISNAME );
					legend.over4_legend(style, overFunc.over4_param1, originalData[originalData.length - dataSkip]);
					break;
				case "over5":
					style = {
						"over5_series4": { "upfillcolor": "rgba(231,165,22,0.2)" }, 
						"over5_series1": { "strokecolor": "rgba(242,90,41,0.6)", "overstrokewidth": 0, "overfillcolor": "rgba(255,98,162,1)" }, 
						"over5_series2": { "strokecolor": "rgba(231,165,22,0.6)", "overstrokewidth": 0, "overfillcolor": "rgba(231,165,22,1)" }, 
						"over5_series3": { "strokecolor": "rgba(215,75,185,0.6)", "overstrokewidth": 0, "overfillcolor": "rgba(215,75,185,1)" }  
					};
					item = {
						"over5_series4": { "series": "area", "xaxis": XAXISNAME, "yaxis": "close", "minaxis": "close" },
						"over5_series1": { "series": "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "U" },
						"over5_series2": { "series": "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "L" },
						"over5_series3": { "series": "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "M" }
					};
					overFunc.parseOver5Data( originalData, item, _value, XAXISNAME );
					legend.over5_legend(style, overFunc.over5_param1, overFunc.over5_param2, originalData[originalData.length - dataSkip]);
					break;
				case "over6":
					style = {
						"over6_series1": { "strokecolor": "rgba(140,98,57,0.7)", "overstrokewidth": 0, "overfillcolor": "rgba(140,98,57,1)" }, 
						"over6_series2": { "strokecolor": "rgba(140,98,57,0.3)", "overstrokewidth": 0, "overfillcolor": "rgba(140,98,57,1)" }
					};
					item = {
						"over6_series1": { "series": "line", "xaxis": XAXISNAME, "yaxis": "close" },
						"over6_series2": { "series": "line", "xaxis": XAXISNAME, "yaxis": "close" }
					};
					overFunc.parseOver6Data( originalData, item, style, _value, XAXISNAME, MAINCHART.key );
					legend.over6_legend(style, overFunc.over6_param1, overFunc.over6_param2, overFunc.over6_param3);
					break;
				case "over7":
					over7_select = true;
					legend.over7_legend(_this.over7_param1);
					break;
				}
				if(_value == "over2") {
					itemCount += overFunc.over2_param1 - 1;
					dataSkip = overFunc.over2_param1;
				}
				if(_value != "over7") {
					$.extend(true, MAINCHART.style, style);
					$.extend(true, series[MAINCHART.key], item);
				}
				overSeriesSave.push(_value);
			} else { // Remove
				$('.stockchartover-option-select', parent).find('option').each(function(){
					if(_value.indexOf(Number($(this).val()) + 1) >= 0){
						$(this).remove();
						return false;
					}
				});
				$('.stockchartover-option-select', parent).eq(0).attr('selected', true);
				try{
					$.uniform.update($('.stockchartover-option-select', parent));
				}catch(e){}
				for(var i in series[MAINCHART.key]){
					if(i.indexOf(_value) >= 0){
						$(MAINCHART.style).removeProp(i);
						$(series[MAINCHART.key]).removeProp(i);
					}
				}
				for(i = overSeriesSave.length; i--;) {
					if(overSeriesSave[i] == _value) {
						overSeriesSave.splice(i, 1);
						break;
					}
				}
				legend.remove_overlay(_value);
				
				if(_value == "over2") {
					overFunc.deleteOver2Data( originalData );
					itemCount -= overFunc.over2_param1;
					dataSkip = 1;
				} else if(_value == "over7"){
					over7_select = false;
				}
			}
			// 오버레이 최대개수 2개 까지 
			if(overSeriesSave.length > 2 && _checked){
				var o = overSeriesSave.shift();
				$("input[value='"+o+"']", parent).prop('checked', false);
				try{$.uniform.update($("input[value='"+o+"']", parent));}catch(e){}
				legend.remove_overlay(o);
				
				$('.stockchartover-option-select option:last', parent).remove();
				
				var last = $('.stockchartover-option-select option:last', parent);
				var idx = last.val(); 
				
				var $layer = $('.stockchartover-option-container', parent);
				var name = $layer.children().eq(0).attr('class');
				
				$('.stockchartover-option').find("div."+name).html($layer.find("div."+name).children().clone());
				
				$layer.children().remove();
				
				var $option = $('.stockchartover-option li', parent).eq(idx).children();
				$layer.html($option.clone());
				
				if(o != "over7") {
					for(var i in series[MAINCHART.key]){
						if(i.indexOf(o) >= 0){
							$(MAINCHART.style).removeProp(i);
							$(series[MAINCHART.key]).removeProp(i);
						}
					}
				}
				if(o == "over2") {
					overFunc.deleteOver2Data( originalData );
					itemCount -= overFunc.over2_param1;
					dataSkip = 1;
				}
				if(o == "over7") over7_select = false;
			}
			if(originalData.length > itemCount){
				var temp = originalData.concat([]);
				sliceData = temp.splice(slider.leftSliderIndecator, itemCount);
			}
			
			if(_this.threelinechart != null || _this.pnfchart != null){
				if(isIE8){
					_this.$select[0].attachEvent("onmousemove", onMouseMove);
					_this.$select[0].attachEvent("onmouseout", onMouseOut);
				} else {
					_this.$select[0].addEventListener("mousemove", onMouseMove, false);
					_this.$select[0].addEventListener("mouseout", onMouseOut, false);
				}
				_this.$line[0].style.display = 'block';
				_this.threelinechart = null, _this.pnfchart = null;
				
				$(parent).find('div[class*=legend]').show();
				slider.slider.show();
			}
			
			createChart(sliceData);
		};
		var over7_select = false, over7_graph_width = 0;
		this.over7_param1 = 10;
		var over7_arrX = [], over7_arrY = [], over7_total = 0, over7_bandT = null, over7_bandA = null, over7_itemHeight = 0, over7_itemTop = 0;
		var overLay7 = function(){
			/* 최대값, 최소값 라벨 그린 후에 작업 할것 */
			//overLay7_height();
			var drawSerieses = draw.drawSerieses;
			var drawSeries = null, drawMaxItem = null, drawMinItem = null;
			var loopCheck = true;
			var style = MAINCHART.style;
			for(var s in drawSerieses){
				var thisSerieses = drawSerieses[s].series;
				if(thisSerieses.type == "main"){
					for(var k in thisSerieses){
						if(k != "type"){
							var thisSeries = thisSerieses[k];
						//	if(thisSeries.stockmain && thisSeries.visible != false){
								drawSeries = drawSerieses[s];
								drawMaxItem = drawSeries.maxItem, drawMinItem = drawSeries.minItem;
								
								loopCheck = false;
								break;
						//	}
						}
					}
					if(!loopCheck) break;
				}
			}
			over7_total = 0;
			over7_itemHeight = Math.floor((drawMinItem._low - drawMaxItem._high) / _this.over7_param1) + 0.5;
			if(style.salestyle != undefined && style.salestyle.itemheight != undefined){
				over7_itemTop = Math.floor((over7_itemHeight - style.salestyle.itemheight) / 2);
			}
			over7_bandT = new Array(_this.over7_param1); // 거래량
			over7_bandA = []; // 백분율
			over7_graph_width = drawSeries.GRAPH_WIDTH - 2; // 차트의 드로우 넓이
			var dTotalPrice = [];
			var dMaxPrice = drawMaxItem.high, dMinPrice = drawMinItem.low;
			var dStepPrice = (dMaxPrice -dMinPrice) / _this.over7_param1;
			for(var i = 0; i <= _this.over7_param1; i++){
				dTotalPrice.push(dMinPrice + dStepPrice * i);
			}
			
			var tClose = 0;
			for(var i = 0, len = sliceData.length; i < len; i++){
				if(sliceData[i].xaxis == undefined || sliceData[i].xaxis == null || sliceData[i].xaxis == "" || sliceData[i].xaxis == " ") continue;
				for(var j = 0; j < dTotalPrice.length - 1; j++){
					tClose = sliceData[i].close;
					if(dTotalPrice[j] <= tClose && tClose < dTotalPrice[j + 1]){
						if(over7_bandT[j] ==  undefined) over7_bandT[j] = 0;
						if(options.usesale && !USESTOCK) over7_bandT[j] = over7_bandT[j] + Number((sliceData[i])[options.saleyaxis]);
						else over7_bandT[j] = over7_bandT[j] + Number(sliceData[i].VOLUME); 
						break;
					}
				}
				if(options.usesale && !USESTOCK)
					over7_total += Number((sliceData[i])[options.saleyaxis])
				else
					over7_total += Number(sliceData[i].VOLUME);
			}
			var max = 0;
			for(i = _this.over7_param1; i--;)
				if(max < over7_bandT[i]) max = over7_bandT[i];
			
			var startY = 0;
			if(!options.usefixmaxmin){
				startY = Number(MAINCHART.style.canvaspaddingtop) + Math.floor(drawMaxItem._high);
			} else {
				startY = Math.floor(drawMaxItem._high);
			}
			
			var maxWidth = max / over7_graph_width;
			var last = _this.over7_param1 - 1;
			for(i = 0; i < _this.over7_param1; i++){
				over7_arrX[i] = Math.floor(over7_bandT[i] / maxWidth);
				over7_arrY[i] = Math.floor(startY + (over7_itemHeight * (last - i))) - 0.5;
				over7_bandA.push((over7_bandT[i] / over7_total) * 100);
			}
			over7_itemHeight = Math.floor(over7_itemHeight);
		};
		
		var over7_draw = function(idx, _startX){
			if(over7_bandT[idx] != null){
				var ctx = _this.$graph[0].getContext('2d');
				var style = MAINCHART.style;
				var useSaleStyle = style.salestyle != undefined ? true : false;
				if(useSaleStyle && (typeof(style.salestyle.fillcolor)).toLowerCase() == 'object'){ // Gradient
					if((style.salestyle.fillcolor).src != undefined) { //IMAGE
						var style;
						
					} else { //Gradient
						var gradient = ctx.createLinearGradient(_startX, over7_arrY[idx], over7_arrX[idx] - 1, over7_itemHeight - 2);
						if(style.salestyle.gradientdirection == "vertical"){
							gradient = ctx.createLinearGradient(_startX, over7_arrY[idx], _startX, over7_arrY[idx] + over7_itemHeight - 2);
						}
						for(j = 0; j < style.salestyle.fillcolor.length; j++)
							gradient.addColorStop(style.salestyle.fillcolor[j][0], style.salestyle.fillcolor[j][1]);
						
						ctx.fillStyle = gradient;
					}
					ctx.strokeStyle = style.salestyle.strokecolor != undefined ? style.salestyle.strokecolor : "rgba(124, 168, 89, 0.5)";
				} else { //Solid
					ctx.strokeStyle =  useSaleStyle && style.salestyle.strokecolor != undefined ? style.salestyle.strokecolor : "rgba(124, 168, 89, 0.5)";
					ctx.fillStyle =  useSaleStyle && style.salestyle.fillcolor != undefined ? style.salestyle.fillcolor : "rgba(92, 204, 59, 0.2)";
					
				}
				ctx.beginPath();
				ctx.strokeWidth = 1;
				ctx.fillRect(_startX, over7_arrY[idx] + over7_itemTop, over7_arrX[idx] - 1, over7_itemHeight - (over7_itemTop *2) - 2);
				ctx.strokeRect(_startX, over7_arrY[idx] + over7_itemTop, over7_arrX[idx] - 1, over7_itemHeight - (over7_itemTop *2) - 2);
				ctx.beginPath();
				ctx.font = useSaleStyle && style.salestyle.fontstyle != undefined ? style.salestyle.fontstyle : "8px 'Tahoma'";
				ctx.fillStyle = useSaleStyle && style.salestyle.fontcolor != undefined ? style.salestyle.fontcolor : "#aaa";
				var sValue = over7_bandT[idx].toString().format(), sPer = over7_bandA[idx].toFixed(2);
				if(!useSaleStyle || style.salestyle.usetextmultiline != false){ // Text가 두줄 일때 Default
					ctx.textBaseline = "top";
					var sValueW = ctx.measureText(sValue).width, sPerW = ctx.measureText(sPer).width;
					var w = sValueW;
					if(sValueW < sPerW) w = sPerW;
					var x = _startX + over7_arrX[idx];
					if(over7_graph_width < x + w){
						ctx.textAlign = "right";
						ctx.fillText(over7_bandT[idx].toString().format(), x - 3, over7_arrY[idx] - 2);
						ctx.fillText(over7_bandA[idx].toFixed(2) + "%", x - 3, over7_arrY[idx] + 6);
					} else {
						ctx.textAlign = "left";
						ctx.fillText(over7_bandT[idx].toString().format(), x, over7_arrY[idx] - 2);
						ctx.fillText(over7_bandA[idx].toFixed(2) + "%", x, over7_arrY[idx] + 6);
					}
				} else {  // Text가 한줄 일때
					ctx.textBaseline = "middle";
					var sValueW = ctx.measureText(sValue + " " + sPer).width, standardline = over7_graph_width;
					var w = sValueW, x = _startX + over7_arrX[idx];
					if(useSaleStyle && style.salestyle.standardline != undefined){ standardline = style.salestyle.standardline; w = 0; } // Text 위치의 기준선이 있을 경우
					if(standardline < x + w){
						ctx.textAlign = "right";
						ctx.fillText(over7_bandT[idx].toString().format() + " (" + over7_bandA[idx].toFixed(2) + "%)", x - 3, over7_arrY[idx] + (over7_itemHeight/ 2));
					} else {
						ctx.textAlign = "left";
						ctx.fillText(over7_bandT[idx].toString().format() + " (" + over7_bandA[idx].toFixed(2) + "%)", x + 5, over7_arrY[idx] + (over7_itemHeight/ 2));
					}
				}
				ctx.fill();
				ctx.closePath();
			}
		};
		
		this.reDrawOverSeriesOption = function($input) {
			var value = $input.attr('name').split('_')[0];
			var overFunc = _this.overLayFunction;
			overFunc[$input.attr('name')] = Number($input.attr('value'));
			switch(value){
			case "over1":
				overFunc.parseOver1Data(originalData, MAINCHART.series, value);
				legend.over1_legendOption(overFunc.over1_param1, overFunc.over1_param2, overFunc.over1_param3);
				break;
			case "over2":
				overFunc.parseOver2Data(originalData, MAINCHART.series, value, XAXISNAME);
				legend.over2_legendOption(overFunc.over2_param2, overFunc.over2_param1, overFunc.over2_param3);
				break;
			case "over3":
				overFunc.parseOver3Data(originalData, MAINCHART.series, value, XAXISNAME);
				legend.over3_legendOption(overFunc.over3_param1);
				break;
			case "over4":
				overFunc.parseOver4Data(originalData, MAINCHART.series, value, XAXISNAME);
				legend.over4_legendOption(overFunc.over4_param1);
				break;
			case "over5":
				overFunc.parseOver5Data(originalData, MAINCHART.series, value, XAXISNAME);
				legend.over5_legendOption(overFunc.over5_param1, overFunc.over5_param2);
				break;
			case "over6":
				overFunc.parseOver6Data(originalData,  MAINCHART.series, MAINCHART.style, value, XAXISNAME, MAINCHART.key);
				legend.over6_legendOption(overFunc.over6_param1, overFunc.over6_param2, overFunc.over6_param3);
				break;
			case "over7":
				_this.over7_param1 = Number($input.attr('value'));
				legend.over7_legendOption(_this.over7_param1);
				break;
			}
			
			if(originalData.length > itemCount){
				var temp = originalData.concat([]);
				sliceData = temp.splice(slider.leftSliderIndecator, itemCount);
			}
			createChart(sliceData);
		};
		
		this.reDrawOverSeriesDefault = function(_value){
			var overFunc = _this.overLayFunction;
			switch(_value){
			case "over1":
				overFunc.parseOver1Data(originalData, MAINCHART.series, _value);
				legend.over1_legendOption(overFunc.over1_param1, overFunc.over1_param2, overFunc.over1_param3);
				break;
			case "over2":
				overFunc.parseOver2Data(originalData, MAINCHART.series, _value, XAXISNAME);
				legend.over2_legendOption(overFunc.over2_param2, overFunc.over2_param1, overFunc.over2_param3);
				break;
			case "over3":
				overFunc.parseOver3Data(originalData, MAINCHART.series, _value, XAXISNAME);
				legend.over3_legendOption(overFunc.over3_param1);
				break;
			case "over4":
				overFunc.parseOver4Data(originalData, MAINCHART.series, _value, XAXISNAME);
				legend.over4_legendOption(overFunc.over4_param1);
				break;
			case "over5":
				overFunc.parseOver5Data(originalData, MAINCHART.series, _value, XAXISNAME);
				legend.over5_legendOption(overFunc.over5_param1, overFunc.over5_param2);
				break;
			case "over6":
				overFunc.parseOver6Data(originalData,  MAINCHART.series, MAINCHART.style, _value, XAXISNAME, MAINCHART.key);
				legend.over6_legendOption(overFunc.over6_param1, overFunc.over6_param2, overFunc.over6_param3);
				break;
			case "over7":
				legend.over7_legendOption(_this.over7_param1);
				break;
			}
			if(originalData.length > itemCount){
				var temp = originalData.concat([]);
				sliceData = temp.splice(slider.leftSliderIndecator, itemCount);
			}
			createChart(sliceData);
		};
		
		var subSeriesSave = [];
		this.reDrawSubSeries = function($checkbox, _checked) {
			var _value = $checkbox;
			if(typeof($checkbox) == "object") _value = $checkbox.attr('value');
			
			var style = null, item = null;
			var subIndexFunc = _this.subIndexFunction;
			if(_checked) {
				for(var i = subSeriesSave.length; i--;){ if(subSeriesSave[i] == _value) return; }
				switch(_value){
				case 'volume': // 거래량
					style = {
						"volume": {
							"canvaspaddingtop": 0, "canvaspaddingbottom": 0, "canvaspaddingleft": MAINCHART.style.canvaspaddingleft, "ylabelfontcolor": "#666666",
							"ylabelgap": MAINCHART.style.ylabelgap, "ylabelpaddingright": MAINCHART.style.ylabelpaddingright, "ylabelpaddingleft": 10,	"yaxisalign": "right",
							"usexlabel": false, "xlabelgap": 0,	"xlabelpaddingtop": 0,
							"graphstroketopcolor": "#cccccc", "graphstrokeleftcolor": "#cccccc", "graphstrokebottomcolor": "#cccccc", "graphstrokerightcolor": "#cccccc",
							"horizontalgridstrokecolor": "#cccccc","verticalgridstrokecolor": "#cccccc",
							"series1":{	"fillcolor": [[0.15, "rgba(37,186,37,0.6)"], [0.5, "rgba(64,205,64,0.6)"], [0.85, "rgba(37,186,37,0.6)"]], "overfillcolor": [[0.15, "rgba(37,186,37,1)"], [0.5, "rgba(64,205,64,1)"], [0.85, "rgba(37,186,37,1)"]],	"strokewidth": "0", "overstrokewidth": "0", "itemwidth": "80" }
						}
					};
					item = {
						"volume": {
							"type": "sub", "series1": { "series" : "column", "xaxis": XAXISNAME, "yaxis": "volume", "label": "거래량" }
						}
					};
					subIndexFunc.parseSubVolume( originalData, item.volume, _value, XAXISNAME );
					break;
				case 'macd': // MACD
					style = {
						"macd": {
							"canvaspaddingtop": 0, "canvaspaddingbottom": 0, "canvaspaddingleft": MAINCHART.style.canvaspaddingleft, "ylabelfontcolor": "#666666",
							"ylabelgap": MAINCHART.style.ylabelgap, "ylabelpaddingright": MAINCHART.style.ylabelpaddingright, "ylabelpaddingleft": 10, "yaxisalign": "right",
							"usexlabel": false, "xlabelgap": 0, "xlabelpaddingtop": 0,
							"baseatzero": true,
							"graphstroketopcolor": "#cccccc", "graphstrokeleftcolor": "#cccccc", "graphstrokebottomcolor": "#cccccc", "graphstrokerightcolor": "#cccccc",
							"horizontalgridstrokecolor": "#cccccc","verticalgridstrokecolor": "#cccccc",
							"series1":{
								"upstrokewidth": 0,	"downstrokewidth": 0, "upfillcolor": "#ffa800",	"downfillcolor": "#7bb9d3",
								"overupfillcolor": "#c86d45", "overdownfillcolor": "#429bc0", "overupstrokewidth": 0, "overdownstrokewidth": 0,
								"itemwidth": 80
							},
							"series2":{ "strokecolor": "#525252", "overstrokewidth": 0, "overfillcolor": "#525252" },
							"series3":{ "strokecolor": "#ff7575", "overstrokewidth": 0, "overfillcolor": "#ff7575" }
						}
					};
					item = {
						"macd": {
							"type": "sub",
							"series1": { "form": "updown", "series" : "column", "xaxis": XAXISNAME, "yaxis": "close", "label": "Osc" },
							"series2": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "MACD" },
							"series3": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "Signal" }
						}
					};
					subIndexFunc.parseSubMACD( originalData, item.macd, _value, XAXISNAME );
					break;
				case 'slowstc' : // SlowSTC
					style = {
						"slowstc": {
							"canvaspaddingtop": 0, "canvaspaddingbottom": 0, "canvaspaddingleft": MAINCHART.style.canvaspaddingleft, "ylabelfontcolor": "#666666",
							"ylabelgap": MAINCHART.style.ylabelgap, "ylabelpaddingright": MAINCHART.style.ylabelpaddingright, "ylabelpaddingleft": 10, "yaxisalign": "right",
							"usexlabel": false, "xlabelgap": 0, "xlabelpaddingtop": 0,
							"graphstroketopcolor": "#cccccc", "graphstrokeleftcolor": "#cccccc", "graphstrokebottomcolor": "#cccccc", "graphstrokerightcolor": "#cccccc",
							"horizontalgridstrokecolor": "#cccccc","verticalgridstrokecolor": "#cccccc",
							"series1":{ "strokecolor": "#525252", "overstrokewidth": 0, "overfillcolor": "#525252" },
							"series2":{ "strokecolor": "#ff7575", "overstrokewidth": 0, "overfillcolor": "#ff7575" }
						}
					};
					item = {
						"slowstc": {
							"type": "sub",
							"series1": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "Slow %K" },
							"series2": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "Slow %D" }
						}
					};
					subIndexFunc.parseSubSlowSTC( originalData, item.slowstc, _value, XAXISNAME );
					break;
				case 'faststc': // FastSTC
					style = {
						"faststc": {
							"canvaspaddingtop": 0, "canvaspaddingbottom": 0, "canvaspaddingleft": MAINCHART.style.canvaspaddingleft, "ylabelfontcolor": "#666666",
							"ylabelgap": MAINCHART.style.ylabelgap, "ylabelpaddingright": MAINCHART.style.ylabelpaddingright, "ylabelpaddingleft": 10, "yaxisalign": "right",
							"usexlabel": false, "xlabelgap": 0, "xlabelpaddingtop": 0,
							"graphstroketopcolor": "#cccccc", "graphstrokeleftcolor": "#cccccc", "graphstrokebottomcolor": "#cccccc", "graphstrokerightcolor": "#cccccc",
							"horizontalgridstrokecolor": "#cccccc","verticalgridstrokecolor": "#cccccc",
							"series1":{ "strokecolor": "#525252", "overstrokewidth": 0, "overfillcolor": "#525252" },
							"series2":{ "strokecolor": "#ff7575", "overstrokewidth": 0, "overfillcolor": "#ff7575" }
						}
					};
					item = {
						"faststc": {
							"type": "sub",
							"series1": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "Fast %K" },
							"series2": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "Fast %D" }
						}
					};
					subIndexFunc.parseSubFastSTC( originalData, item.faststc, _value, XAXISNAME );
					break;
				case 'rsi': // RSI
					style = {
						"rsi": {
							"canvaspaddingtop": 0, "canvaspaddingbottom": 0, "canvaspaddingleft": MAINCHART.style.canvaspaddingleft, "ylabelfontcolor": "#666666",
							"ylabelgap": MAINCHART.style.ylabelgap, "ylabelpaddingright": MAINCHART.style.ylabelpaddingright, "ylabelpaddingleft": 10, "yaxisalign": "right",
							"usexlabel": false, "xlabelgap": 0, "xlabelpaddingtop": 0,
							"graphstroketopcolor": "#cccccc", "graphstrokeleftcolor": "#cccccc", "graphstrokebottomcolor": "#cccccc", "graphstrokerightcolor": "#cccccc",
							"horizontalgridstrokecolor": "#cccccc","verticalgridstrokecolor": "#cccccc",
							"series1":{ "strokecolor": "#525252", "overstrokewidth": 0, "overfillcolor": "#525252" },
							"series2":{ "strokecolor": "#ff7575", "overstrokewidth": 0, "overfillcolor": "#ff7575" }
						}
					};
					item = {
						"rsi": {
							"type": "sub",
							"series1": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "RSI" },
							"series2": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "RSI-Signal" }
						}
					};
					subIndexFunc.parseSubRSI( originalData, item.rsi, _value, XAXISNAME );
					break;
				case 'dmi': // DMI
					style = {
						"dmi": {
							"canvaspaddingtop": 0, "canvaspaddingbottom": 0, "canvaspaddingleft": MAINCHART.style.canvaspaddingleft, "ylabelfontcolor": "#666666",
							"ylabelgap": MAINCHART.style.ylabelgap, "ylabelpaddingright": MAINCHART.style.ylabelpaddingright, "ylabelpaddingleft": 10, "yaxisalign": "right",
							"usexlabel": false, "xlabelgap": 0, "xlabelpaddingtop": 0,
							"graphstroketopcolor": "#cccccc", "graphstrokeleftcolor": "#cccccc", "graphstrokebottomcolor": "#cccccc", "graphstrokerightcolor": "#cccccc",
							"horizontalgridstrokecolor": "#cccccc","verticalgridstrokecolor": "#cccccc",
							"series1":{ "strokecolor": "#525252", "overstrokewidth": 0, "overfillcolor": "#525252" },
							"series2":{ "strokecolor": "#ff7575", "overstrokewidth": 0, "overfillcolor": "#ff7575" }
						}
					};
					item = {
						"dmi": {
							"type": "sub",
							"series1": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "PDI" },
							"series2": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "MDI" }
						}
					};
					subIndexFunc.parseSubDMI( originalData, item.dmi, _value, XAXISNAME );
					break;
				case 'adx': // ADX
					style = {
						"adx": {
							"canvaspaddingtop": 0, "canvaspaddingbottom": 0, "canvaspaddingleft": MAINCHART.style.canvaspaddingleft, "ylabelfontcolor": "#666666",
							"ylabelgap": MAINCHART.style.ylabelgap, "ylabelpaddingright": MAINCHART.style.ylabelpaddingright, "ylabelpaddingleft": 10, "yaxisalign": "right",
							"usexlabel": false, "xlabelgap": 0, "xlabelpaddingtop": 0,
							"graphstroketopcolor": "#cccccc", "graphstrokeleftcolor": "#cccccc", "graphstrokebottomcolor": "#cccccc", "graphstrokerightcolor": "#cccccc",
							"horizontalgridstrokecolor": "#cccccc","verticalgridstrokecolor": "#cccccc",
							"series1":{ "strokecolor": "#525252", "overstrokewidth": 0, "overfillcolor": "#525252" },
							"series2":{ "strokecolor": "#ff7575", "overstrokewidth": 0, "overfillcolor": "#ff7575" }
						}
					};
					item = {
						"adx": {
							"type": "sub",
							"series1": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "ADX" },
							"series2": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "MA"	}
						}
					};
					subIndexFunc.parseSubADX( originalData, item.adx, _value, XAXISNAME );
					break;
				case 'obv': // OBV
					style = {
						"obv": {
							"canvaspaddingtop": 0, "canvaspaddingbottom": 0, "canvaspaddingleft": MAINCHART.style.canvaspaddingleft, "ylabelfontcolor": "#666666",
							"ylabelgap": MAINCHART.style.ylabelgap, "ylabelpaddingright": MAINCHART.style.ylabelpaddingright, "ylabelpaddingleft": 10, "yaxisalign": "right",
							"usexlabel": false, "xlabelgap": 0, "xlabelpaddingtop": 0,
							"graphstroketopcolor": "#cccccc", "graphstrokeleftcolor": "#cccccc", "graphstrokebottomcolor": "#cccccc", "graphstrokerightcolor": "#cccccc",
							"horizontalgridstrokecolor": "#cccccc","verticalgridstrokecolor": "#cccccc",
							"series1":{ "strokecolor": "#525252", "overstrokewidth": 0, "overfillcolor": "#525252" }
						}
					};
					item = {
						"obv": {
							"type": "sub", "series1": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "OBV" }
						}
					};
					subIndexFunc.parseSubOBV( originalData, item.obv, _value, XAXISNAME );
					break;
				case 'sonar': // SONAR
					style = {
						"sonar": {
							"canvaspaddingtop": 0, "canvaspaddingbottom": 0, "canvaspaddingleft": MAINCHART.style.canvaspaddingleft, "ylabelfontcolor": "#666666",
							"ylabelgap": MAINCHART.style.ylabelgap, "ylabelpaddingright": MAINCHART.style.ylabelpaddingright, "ylabelpaddingleft": 10, "yaxisalign": "right",
							"usexlabel": false, "xlabelgap": 0, "xlabelpaddingtop": 0,
							"graphstroketopcolor": "#cccccc", "graphstrokeleftcolor": "#cccccc", "graphstrokebottomcolor": "#cccccc", "graphstrokerightcolor": "#cccccc",
							"horizontalgridstrokecolor": "#cccccc","verticalgridstrokecolor": "#cccccc",
							"series1":{ "strokecolor": "#525252", "overstrokewidth": 0, "overfillcolor": "#525252" },
							"series2":{ "strokecolor": "#ff7575", "overstrokewidth": 0, "overfillcolor": "#ff7575" }
						}
					};
					item = {
						"sonar": {
							"type": "sub",
							"series1": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "SONAR" },
							"series2": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "MA" }
						}
					};
					subIndexFunc.parseSubSONAR( originalData, item.sonar, _value, XAXISNAME );
					break;
				case 'cci': // CCI
					style = {
						"cci": {
							"canvaspaddingtop": 0, "canvaspaddingbottom": 0, "canvaspaddingleft": MAINCHART.style.canvaspaddingleft, "ylabelfontcolor": "#666666",
							"ylabelgap": MAINCHART.style.ylabelgap, "ylabelpaddingright": MAINCHART.style.ylabelpaddingright, "ylabelpaddingleft": 10, "yaxisalign": "right",
							"usexlabel": false, "xlabelgap": 0, "xlabelpaddingtop": 0,
							"graphstroketopcolor": "#cccccc", "graphstrokeleftcolor": "#cccccc", "graphstrokebottomcolor": "#cccccc", "graphstrokerightcolor": "#cccccc",
							"horizontalgridstrokecolor": "#cccccc","verticalgridstrokecolor": "#cccccc",
							"series1":{ "strokecolor": "#525252", "overstrokewidth": 0, "overfillcolor": "#525252" }
						}
					};
					item = {
						"cci": {
							"type": "sub", "series1": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "CCI" }
						}
					};
					subIndexFunc.parseSubCCI( originalData, item.cci, _value, XAXISNAME );
					break;
				case 'vr': // VR
					style = {
						"vr": {
							"canvaspaddingtop": 0, "canvaspaddingbottom": 0, "canvaspaddingleft": MAINCHART.style.canvaspaddingleft, "ylabelfontcolor": "#666666",
							"ylabelgap": MAINCHART.style.ylabelgap, "ylabelpaddingright": MAINCHART.style.ylabelpaddingright, "ylabelpaddingleft": 10, "yaxisalign": "right",
							"usexlabel": false, "xlabelgap": 0, "xlabelpaddingtop": 0,
							"graphstroketopcolor": "#cccccc", "graphstrokeleftcolor": "#cccccc", "graphstrokebottomcolor": "#cccccc", "graphstrokerightcolor": "#cccccc",
							"horizontalgridstrokecolor": "#cccccc","verticalgridstrokecolor": "#cccccc",
							"series1":{ "strokecolor": "#525252", "overstrokewidth": 0, "overfillcolor": "#525252" }
						}
					};
					item = {
						"vr": {
							"type": "sub", "series1": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "VR" }
						}
					};
					subIndexFunc.parseSubVR( originalData, item.vr, _value, XAXISNAME );
					break;
				case 'trix': // TRIX
					style = {
						"trix": {
							"canvaspaddingtop": 0, "canvaspaddingbottom": 0, "canvaspaddingleft": MAINCHART.style.canvaspaddingleft, "ylabelfontcolor": "#666666",
							"ylabelgap": MAINCHART.style.ylabelgap, "ylabelpaddingright": MAINCHART.style.ylabelpaddingright, "ylabelpaddingleft": 10, "yaxisalign": "right",
							"usexlabel": false, "xlabelgap": 0, "xlabelpaddingtop": 0,
							"graphstroketopcolor": "#cccccc", "graphstrokeleftcolor": "#cccccc", "graphstrokebottomcolor": "#cccccc", "graphstrokerightcolor": "#cccccc",
							"horizontalgridstrokecolor": "#cccccc","verticalgridstrokecolor": "#cccccc",
							"series1":{ "strokecolor": "#525252", "overstrokewidth": 0, "overfillcolor": "#525252" },
							"series2":{ "strokecolor": "#ff7575", "overstrokewidth": 0, "overfillcolor": "#ff7575" }
						}
					};
					item = {
						"trix": {
							"type": "sub",
							"series1": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "TRIX" },
							"series2": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "TRMA" }
						}
					};
					subIndexFunc.parseSubTRIX( originalData, item.trix, _value, XAXISNAME );
					break;	
				case 'pmao': // PMAO
					style = {
						"pmao": {
							"canvaspaddingtop": 0, "canvaspaddingbottom": 0, "canvaspaddingleft": MAINCHART.style.canvaspaddingleft, "ylabelfontcolor": "#666666",
							"ylabelgap": MAINCHART.style.ylabelgap, "ylabelpaddingright": MAINCHART.style.ylabelpaddingright, "ylabelpaddingleft": 10, "yaxisalign": "right",
							"usexlabel": false, "xlabelgap": 0, "xlabelpaddingtop": 0,
							"baseatzero": true,
							"graphstroketopcolor": "#cccccc", "graphstrokeleftcolor": "#cccccc", "graphstrokebottomcolor": "#cccccc", "graphstrokerightcolor": "#cccccc",
							"horizontalgridstrokecolor": "#cccccc","verticalgridstrokecolor": "#cccccc",
							"series1":{
								"upstrokewidth": 0, "downstrokewidth": 0, "upfillcolor": "#ffa800", "downfillcolor": "#7bb9d3",
								"overupfillcolor": "#c86d45", "overdownfillcolor": "#429bc0", "overupstrokewidth": 0, "overdownstrokewidth": 0,
								"itemwidth": 80
							}
						}
					};
					item = {
						"pmao": {
							"type": "sub", "series1": { "form": "updown", "series" : "column", "xaxis": XAXISNAME, "yaxis": "close", "label": "PMAO" }
						}
					};
					subIndexFunc.parseSubPMAO( originalData, item.pmao, _value, XAXISNAME );
					break;
				case 'psyhological': // 투자심리
					style = {
						"psyhological": {
							"canvaspaddingtop": 0, "canvaspaddingbottom": 0, "canvaspaddingleft": MAINCHART.style.canvaspaddingleft, "ylabelfontcolor": "#666666",
							"ylabelgap": MAINCHART.style.ylabelgap, "ylabelpaddingright": MAINCHART.style.ylabelpaddingright, "ylabelpaddingleft": 10, "yaxisalign": "right",
							"usexlabel": false, "xlabelgap": 0, "xlabelpaddingtop": 0,
							"graphstroketopcolor": "#cccccc", "graphstrokeleftcolor": "#cccccc", "graphstrokebottomcolor": "#cccccc", "graphstrokerightcolor": "#cccccc",
							"horizontalgridstrokecolor": "#cccccc","verticalgridstrokecolor": "#cccccc",
							"series1":{ "strokecolor": "#525252", "overstrokewidth": 0, "overfillcolor": "#525252" }
						}
					};
					item = {
						"psyhological": {
							"type": "sub", "series1": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "투자심리선"	}
						}
					};
					subIndexFunc.parseSubPsyhological( originalData, item.psyhological, _value, XAXISNAME );
					break;
				case 'williams': // Williams' %R
					style = {
						"williams": {
							"canvaspaddingtop": 0, "canvaspaddingbottom": 0, "canvaspaddingleft": MAINCHART.style.canvaspaddingleft, "ylabelfontcolor": "#666666",
							"ylabelgap": MAINCHART.style.ylabelgap, "ylabelpaddingright": MAINCHART.style.ylabelpaddingright, "ylabelpaddingleft": 10, "yaxisalign": "right",
							"usexlabel": false, "xlabelgap": 0, "xlabelpaddingtop": 0,
							"graphstroketopcolor": "#cccccc", "graphstrokeleftcolor": "#cccccc", "graphstrokebottomcolor": "#cccccc", "graphstrokerightcolor": "#cccccc",
							"horizontalgridstrokecolor": "#cccccc","verticalgridstrokecolor": "#cccccc",
							"series1":{ "strokecolor": "#525252", "overstrokewidth": 0, "overfillcolor": "#525252" },
							"series2":{ "strokecolor": "#ff7575", "overstrokewidth": 0, "overfillcolor": "#ff7575" }
						}
					};
					item = {
						"williams": {
							"type": "sub",
							"series1": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "%R"	},
							"series2": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "%D"	}
						}
					};
					subIndexFunc.parseSubWilliams( originalData, item.williams, _value, XAXISNAME );
					break;
				case 'roc': // ROC
					style = {
						"roc": {
							"canvaspaddingtop": 0, "canvaspaddingbottom": 0, "canvaspaddingleft": MAINCHART.style.canvaspaddingleft, "ylabelfontcolor": "#666666",
							"ylabelgap": MAINCHART.style.ylabelgap, "ylabelpaddingright": MAINCHART.style.ylabelpaddingright, "ylabelpaddingleft": 10, "yaxisalign": "right",
							"usexlabel": false, "xlabelgap": 0, "xlabelpaddingtop": 0,
							"graphstroketopcolor": "#cccccc", "graphstrokeleftcolor": "#cccccc", "graphstrokebottomcolor": "#cccccc", "graphstrokerightcolor": "#cccccc",
							"horizontalgridstrokecolor": "#cccccc","verticalgridstrokecolor": "#cccccc",
							"series1":{ "strokecolor": "#525252", "overstrokewidth": 0, "overfillcolor": "#525252" }
						}
					};
					item = {
						"roc": {
							"type": "sub", "series1": { "series" : "line", "xaxis": XAXISNAME, "yaxis": "close", "label": "ROC" }
						}
					};
					subIndexFunc.parseSubROC( originalData, item.roc, _value, XAXISNAME );
				}
				extendStyles(style[_value], defaultGraphStyles);
				$.extend(true, styles, style);
				$.extend(true, series, item);
				SUBCHARTS.push({type: "sub", key: _value, series: item[_value], style: style[_value], lastData: originalData[originalData.length - dataSkip]});
				subSeriesSave.push(_value);
			} else { // Remove
				$('.stockchartsub-option-select', parent).find('option').each(function(){
					if(_value == $(this).val()){
						$(this).remove();
						return false;
					}
				});
				$('.stockchartsub-option-select', parent).eq(0).attr('selected', true);
				try{$.uniform.update($('.stockchartsub-option-select', parent));}catch(e){}
				for(var i in series){
					if(i.indexOf(_value) >= 0){
						$(styles).removeProp(i);
						$(series).removeProp(i);
						legend.remove_subIndex(i);
						break;
					}
				}
				for(i = subSeriesSave.length; i--;) {
					if(subSeriesSave[i] == _value) {
						subSeriesSave.splice(i, 1);
						SUBCHARTS.splice(i, 1);
						break;
					}
				}
			}
			// 보조지표 최대개수 4개 까지 
			if(subSeriesSave.length > 4 && _checked){
				var o = subSeriesSave.shift();
				SUBCHARTS.shift();
				$("input[value='"+o+"']", parent).prop('checked', false);
				try{$.uniform.update($("input[value='"+o+"']", parent));}catch(e){}
				
				var last = $('.stockchartsub-option-select option:last', parent);
				var idx = last.val(); 
				last.remove();
				
				var $layer = $('.stockchartsub-option-container', parent);
				var name = $layer.children().eq(0).attr('class');
				$('.stockchartsub-option').find("div."+name).html($layer.find("div."+name).children().clone());
				
				$layer.children().remove();
				
				var $option = $('.stockchartsub-option li', parent).find('div.'+idx);//.children();
				$layer.html($option.clone());
				
				for(var i in series){
					if(i.indexOf(o) >= 0){
						$(styles).removeProp(i);
						$(series).removeProp(i);
						legend.remove_subIndex(i);
						break;
					}
				}
			}
			
			if(originalData.length > itemCount){
				var temp = originalData.concat([]);
				sliceData = temp.splice(slider.leftSliderIndecator, itemCount);
			}
			
			if(_this.threelinechart != null || _this.pnfchart != null){
				if(isIE8){
					_this.$select[0].attachEvent("onmousemove", onMouseMove);
					_this.$select[0].attachEvent("onmouseout", onMouseOut);
				} else {
					_this.$select[0].addEventListener("mousemove", onMouseMove, false);
					_this.$select[0].addEventListener("mouseout", onMouseOut, false);
				}
				_this.$line[0].style.display = 'block';
				_this.threelinechart = null, _this.pnfchart = null;
				
				$(parent).find('div[class*=legend]').show();
				slider.slider.show();
			}
			
			createChart(sliceData);
		};
		
		this.reDrawSubSeriesOption = function($input) {
			var value = $input.attr('name').split('_')[0];
			var subIndexFunc = _this.subIndexFunction;
			subIndexFunc[$input.attr('name')] = Number($input.attr('value'));
			if(value == "volume" || value == "obv") return;
			switch(value){
			
			case "macd" :
				subIndexFunc.parseSubMACD(originalData, series.macd, value, XAXISNAME);
				legend.macd_legendOption(subIndexFunc.macd_param1, subIndexFunc.macd_param2, subIndexFunc.macd_param3);
				break;
			case "slowstc":
				subIndexFunc.parseSubSlowSTC(originalData, series.slowstc, value, XAXISNAME);
				legend.slowstc_legendOption(subIndexFunc.slowstc_param1, subIndexFunc.slowstc_param2, subIndexFunc.slowstc_param3);
				break;
			case "faststc":
				subIndexFunc.parseSubFastSTC(originalData, series.faststc, value, XAXISNAME);
				legend.faststc_legendOption(subIndexFunc.faststc_param1, subIndexFunc.faststc_param2);
				break;
			case "rsi":
				subIndexFunc.parseSubRSI(originalData, series.rsi, value, XAXISNAME);
				legend.rsi_legendOption(subIndexFunc.rsi_param1, subIndexFunc.rsi_param2);
				break;
			case "dmi":
				subIndexFunc.parseSubDMI(originalData, series.dmi, value, XAXISNAME);
				legend.dmi_legendOption(subIndexFunc.dmi_param1);
				break;
			case "adx":
				subIndexFunc.parseSubADX(originalData, series.adx, value, XAXISNAME);
				legend.adx_legendOption(subIndexFunc.adx_param1, subIndexFunc.adx_param2, subIndexFunc.adx_param3);
				break;
			case "sonar": 
				subIndexFunc.parseSubSONAR(originalData, series.sonar, value, XAXISNAME);
				legend.sonar_legendOption(subIndexFunc.sonar_param1, subIndexFunc.sonar_param2, subIndexFunc.sonar_param3);
				break;
			case "cci":
				subIndexFunc.parseSubCCI(originalData, series.cci, value, XAXISNAME);
			 	legend.cci_legendOption(subIndexFunc.cci_param1);
				break;
			case "vr":
				subIndexFunc.parseSubVR(originalData, series.vr, value, XAXISNAME);
		 		legend.vr_legendOption(subIndexFunc.vr_param1);
				break;
			case "trix":
				subIndexFunc.parseSubTRIX(originalData, series.trix, value, XAXISNAME);
		 		legend.trix_legendOption(subIndexFunc.trix_param1, subIndexFunc.trix_param2);
				break;
			case "pmao":
				subIndexFunc.parseSubPMAO(originalData, series.pmao, value, XAXISNAME);
		 		legend.pmao_legendOption(subIndexFunc.pmao_param1, subIndexFunc.pmao_param2);
				break;
			case "psyhological":
				subIndexFunc.parseSubPsyhological(originalData, series.psyhological, value, XAXISNAME);
				legend.psyhological_legendOption(subIndexFunc.psyhological_param1);
				break;
			case "williams":
				subIndexFunc.parseSubWilliams(originalData, series.williams, value, XAXISNAME);
				legend.williams_legendOption(subIndexFunc.williams_param1, subIndexFunc.williams_param2);
				break;
			case "roc":
				subIndexFunc.parseSubROC(originalData, series.roc, value, XAXISNAME);
				legend.roc_legendOption(subIndexFunc.roc_param1);
				break;
			}
			
			if(originalData.length > itemCount){
				var temp = originalData.concat([]);
				sliceData = temp.splice(slider.leftSliderIndecator, itemCount);
			}
			createChart(sliceData);
		};
		
		this.reDrawSubSeriesDefault = function(_value){
			if(_value == "volume" || _value == "obv") return;
			var subIndexFunc = _this.subIndexFunction;
			switch(_value){
			case "macd":
				subIndexFunc.parseSubMACD(originalData, series.macd, _value, XAXISNAME);
				legend.macd_legendOption(subIndexFunc.macd_param1, subIndexFunc.macd_param2, subIndexFunc.macd_param3);
				break;
			case "slowstc":
				subIndexFunc.parseSubSlowSTC(originalData, series.slowstc, _value, XAXISNAME);
				legend.slowstc_legendOption(subIndexFunc.slowstc_param1, subIndexFunc.slowstc_param2, subIndexFunc.slowstc_param3);
				break;
			case "faststc":
				subIndexFunc.parseSubFastSTC(originalData, series.faststc, _value, XAXISNAME);
				legend.faststc_legendOption(subIndexFunc.faststc_param1, subIndexFunc.faststc_param2);
				break;
			case "rsi":
				subIndexFunc.parseSubRSI(originalData, series.rsi, _value, XAXISNAME);
				legend.rsi_legendOption(subIndexFunc.rsi_param1, subIndexFunc.rsi_param2);
				break;
			case "dmi":
				subIndexFunc.parseSubDMI(originalData, series.dmi, _value, XAXISNAME);
				legend.dmi_legendOption(subIndexFunc.dmi_param1);
				break;
			case "adx":
				subIndexFunc.parseSubADX(originalData, series.adx, _value, XAXISNAME);
				legend.adx_legendOption(subIndexFunc.adx_param1, subIndexFunc.adx_param2, subIndexFunc.adx_param3);
				break;
			case "sonar":
				subIndexFunc.parseSubSONAR(originalData, series.sonar, _value, XAXISNAME);
				legend.sonar_legendOption(subIndexFunc.sonar_param1, subIndexFunc.sonar_param2, subIndexFunc.sonar_param3);
				break;
			case "cci":
				subIndexFunc.parseSubCCI(originalData, series.cci, _value, XAXISNAME);
				legend.cci_legendOption(subIndexFunc.cci_param1);
				break;
			case "vr":
				subIndexFunc.parseSubVR(originalData, series.vr, _value, XAXISNAME);
		 		legend.vr_legendOption(subIndexFunc.vr_param1);
				break;
			case "trix":
				subIndexFunc.parseSubTRIX(originalData, series.trix, _value, XAXISNAME);
		 		legend.trix_legendOption(subIndexFunc.trix_param1, subIndexFunc.trix_param2);
				break;
			case "pmao":
				subIndexFunc.parseSubPMAO(originalData, series.pmao, _value, XAXISNAME);
		 		legend.pmao_legendOption(subIndexFunc.pmao_param1, subIndexFunc.pmao_param2);
				break;
			case "psyhological":
				subIndexFunc.parseSubPsyhological(originalData, series.psyhological, _value, XAXISNAME);
				legend.psyhological_legendOption(subIndexFunc.psyhological_param1);
				break;
			case "williams":
				subIndexFunc.parseSubWilliams(originalData, series.williams, _value, XAXISNAME);
				legend.williams_legendOption(subIndexFunc.williams_param1, subIndexFunc.williams_param2);
				break;
			case "roc":
				subIndexFunc.parseSubROC(originalData, series.roc, _value, XAXISNAME);
				legend.roc_legendOption(subIndexFunc.roc_param1);
				break;
			}
			
			if(originalData.length > itemCount){
				var temp = originalData.concat([]);
				sliceData = temp.splice(slider.leftSliderIndecator, itemCount);
			}
			createChart(sliceData);
		};
		var allClear = function(){
			var UserAgent = navigator.userAgent;
			if(('createTouch' in doc) || ('ontouchstart' in doc) || !isIE8){
				_this.$back[0].width = CHART_WIDTH;
				_this.$graph[0].width = CHART_WIDTH;
				_this.$etc[0].width = CHART_WIDTH;
				_this.$select[0].width = CHART_WIDTH;
			} else {
				_this.$back[0].getContext('2d').clearRect(0, 0, CHART_WIDTH, CHART_HEIGHT);
				_this.$graph[0].getContext('2d').clearRect(0, 0, CHART_WIDTH, CHART_HEIGHT);
				_this.$etc[0].getContext('2d').clearRect(0, 0, CHART_WIDTH, CHART_HEIGHT);
				_this.$select[0].getContext('2d').clearRect(0, 0, CHART_WIDTH, CHART_HEIGHT);
			}
			
		};
		/* MAX, MIN */ 
		var getMax = function(val1, val2){
			if(Number(val1) > Number(val2)){
				return Number(val1);
			} else {
				return Number(val2);
			}
		};
		var getMin = function(val1, val2){
			if(Number(val1) < Number(val2)){
				return Number(val1);
			} else {
				return Number(val2);
			}
		};
		/*
		 * OPTIONS UPDATE
		 */
		var setOptions = function (name, value){
			name = name.toLowerCase();
			options[name] = value;
		};
		/*
		 * STYLES UPDATE
		 */
		var setStyles = function (param, name, value){
			name = name.toLowerCase();
			param[name] = value;
		};
		// Styles use check - true | false
		var getUseStyles = function ( _styles, _name ) {
			if((_styles[_name] != undefined && _styles[_name] != "") || _styles[_name] == 0) // 스타일이 사용되고 있으면..
				return true;
			return false;
		};
		var extendStyles = function (_styles, _default) {
			$.each(_default, function(_key, _val){
				if(!getUseStyles(_styles, _key)){
					_styles[_key] = _val;
				}
			});
		};
		// LINE SERIES - DashedLine
		CanvasRenderingContext2D.prototype.dashedLineFromTo = function(x, y, x2, y2, dashArray){
			if(!dashArray) dashArray = [10, 5];
			if(dashLength == 0) dashLength = 0.001;
			var dashCount = dashArray.length;
			this.moveTo(x, y);
			var dx = (x2 - x), dy = (y2 - y);
			var slope = dy / dx;
			var distRemaining = Math.sqrt(dx * dx + dy * dy);
			var dashIndex = 0, draw = true;
			while(distRemaining >= 0.1){
				var dashLength = dashArray[dashIndex ++%dashCount];
				if(dashLength > distRemaining) dashLength = distRemaining;
				var xStep = Math.sqrt( dashLength * dashLength / (1 + slope*slope));
				x += xStep;
				y += slope*xStep;
				this[draw ? 'lineTo' : 'moveTo'](x, y);
				distRemaining -= dashLength;
				draw = !draw;
			}
		};
		
		init();
		return _this;
	};
	
	CreateSlider = function(_chartId, _canvasWidth, _canvasHeight, _styles, _select){
		var _this = this;
		var chartId = _chartId, canvasWidth = _canvasWidth, canvasHeight = _canvasHeight;
		var styles = _styles;
		
		var sliderWidth = canvasWidth - Number(styles.ylabelgap) - Number(styles.ylabelpaddingright) - Number(styles.ylabelpaddingleft) - Number(styles.canvaspaddingleft) - Number(styles.canvaspaddingright);
		var itemCount = 0;
		this.leftSliderIndecator = 0, this.rightSliderIndecator = 0;
		
		this.slider = null, this.maximum = null;
		
		this.sliderBox = null,	this.sliderContainer = null;
		this.select = _select;
		this.sliderDownChk = false;
		
		this.mainSeriesValue = "candle";
		
		this.init = function () {
			var doc = document;
			_this.sliderContainer = $(doc.createElement("DIV")).css({
				"position": "absolute", "top": canvasHeight+"px", "left": "150px", "height": "30px", "width": canvasWidth+"px"
			}).attr('class', chartId+'-slider-cont');
			_this.sliderBox = $(doc.createElement("DIV")).css({
				"marginLeft": "20px", "position": "relative", "height": "100%"
			}).attr('class', chartId+'-slider-box');
			_this.slider = $("<div class='slider-button'><span class='slider-left'><span class='slider-right'><span>SLIDER</span></span></span></div>").css({
				'position': 'absolute', 'padding': 0, 'margin': '0', 'top': '7px', "cursor": "pointer"
			});
			
			_this.sliderBox.append(_this.slider);
			_this.sliderContainer.append(_this.sliderBox);
			
			return _this.sliderContainer;
		};
		
		this.sliderInit = function (_data, _itemCount, _mobile){
			_this.maximum = _data.length, itemCount = _itemCount;
			_this.leftSliderIndecator = _this.maximum - itemCount,	_this.rightSliderIndecator = _this.maximum;
			var buttonWidth = sliderWidth * (itemCount / _this.maximum);
			
			_this.sliderBox.css('width', sliderWidth);
			_this.slider.css({'width': buttonWidth + 'px', 'left': (sliderWidth - buttonWidth) +'px'});
			var downPos = {};
			var UserAgent = navigator.userAgent;
			if(('createTouch' in document) || ('ontouchstart' in document)){
				_this.slider[0].addEventListener("touchstart", function(event){
					if(event.layerX < 0){ //Android
						downPos.x = event.touches[0].pageX + event.layerX;
					} else {
						downPos.x = event.layerX;
					}
					downPos.y = event.layerY;
					downPos.left = Number($(_this.slider).css('left').split('px')[0]);
					downPos.width = sliderWidth * (itemCount / _this.maximum);
					_this.sliderDownChk = true;
				}, false);
				_this.slider[0].addEventListener("touchmove", function(event){
					if(_this.sliderDownChk){
						var _event = event;
						event.preventDefault();
						mouseMoveHandler(_event, downPos, "button", _this.maximum);
					}
				}, false);
				_this.slider[0].addEventListener("touchend", function(event){
					if(_this.sliderDownChk && event.target.nodeName.toUpperCase() == "DIV"){
						mouseMoveHandler(event, downPos, "", _this.maximum);
					}
				}, false);
				if(_mobile != 'mobile'){
					_this.select[0].addEventListener("touchstart", function(event){
						if(event.layerX < 0){ //Android
							downPos.x = event.touches[0].pageX;// + event.layerX;
						} else {
							downPos.x = event.layerX;
						}
						downPos.y = event.layerY;
						downPos.left = Number($(_this.slider).css('left').split('px')[0]);
						downPos.width = sliderWidth * (itemCount / _this.maximum);
						downPos.parentWidth = Number($(this).width());
						downPos.leftSlider = _this.leftSliderIndecator;
						_this.sliderDownChk = true;
					});
					_this.select[0].addEventListener("touchmove", function(event){
						if(_this.sliderDownChk){
							event.preventDefault();
							touchMoveHandler(event, downPos, "button", _this.maximum);
						}
					}, false);
					_this.select[0].addEventListener("touchend", function(event){
						if(_this.sliderDownChk && event.target.nodeName.toUpperCase() == "DIV"){
							mouseMoveHandler(event, downPos, "", _this.maximum);
						}
					}, false);
				}
			} else {
				_this.sliderBox.mousedown(function(event){
					if(!_this.sliderDownChk && (_this.mainSeriesValue != "threeline" && _this.mainSeriesValue != "pnf")) {
						if (typeof event.layerX !== 'undefined') { // Opera
							downPos.x = event.layerX, downPos.y = event.layerY;
					    } else if(typeof event.offsetX !== 'undefined') { // Firefox
					    	downPos.x = event.offsetX, downPos.y = event.offsetY;
					    } else {
					    	downPos.x = event.clientX - $(event.target).offset().left;
					    	downPos.y = event.clientY - $(event.target).offset().top;
						}
						downPos.left = Math.floor(Number(_this.slider.css('left').split('px')[0]));
						downPos.width = sliderWidth * (itemCount / _this.maximum);
						downPos.parentWidth = Number($(this).width());
						_this.sliderDownChk = true;
					}
				}).mousemove(function(event){
					if(_this.sliderDownChk){
						event.preventDefault();
						mouseMoveHandler(event, downPos, "button", _this.maximum);
					}
				}).mouseup(function(event){
					_this.sliderDownChk = false;
				});	
				$(_this.select).mousemove(function(event){
					if(_this.sliderDownChk && _this.sliderBox[0].style.display == 'block'){
						event.preventDefault();
						mouseMoveHandler(event, downPos, "select", _this.maximum);
					}
				}).mouseup(function(event){
					_this.sliderDownChk = false;
				});
			}
		};
		this.sliderReInit = function(_data, _itemCount) {
			_this.maximum = _data.length;
			_this.leftSliderIndecator = _this.maximum - itemCount,	_this.rightSliderIndecator = _this.maximum;
			var buttonWidth = sliderWidth * (_itemCount / _this.maximum);
			
//			_this.sliderBox.css('width', sliderWidth);
//			_this.slider.css('width', buttonWidth + 'px');
			_this.sliderUpdate('default', _data, _itemCount);
		};
		this.sliderUpdate = function(state, _data, _itemCount){
			var sliceData = [];
			itemCount = _itemCount;
			var buttonWidth = sliderWidth * (_itemCount / _this.maximum); // 새로구해진 넓이
			var sWidth = _this.slider.width(), sLeft = Number(_this.slider.css('left').split('px')[0]); // 기존 slider 넓이, x 축 위치
			var dWidth = sWidth - buttonWidth;
			if(state == 'plus'){
				_this.slider.css({'width': buttonWidth + 'px', 'left': sLeft + dWidth});
				_this.leftSliderIndecator = _this.rightSliderIndecator - itemCount;
				if(_this.leftSliderIndecator != 0 || _this.rightSliderIndecator != _this.maximum){
					_this.slider.css('display', '');
				}
			} else if(state == 'minus'){
				_this.leftSliderIndecator = _this.rightSliderIndecator - itemCount;
				if(_this.leftSliderIndecator < 0){
					var idx = _this.leftSliderIndecator;
					_this.leftSliderIndecator = 0;
					_this.rightSliderIndecator = _this.rightSliderIndecator + (idx * -1);
					_this.slider.css({'width': buttonWidth + 'px', 'left': 0});
				} else {
					_this.slider.css({'width': buttonWidth + 'px', 'left': sLeft + dWidth});
				}
				if(_this.leftSliderIndecator == 0 && _this.rightSliderIndecator == _this.maximum){
					_this.slider.css('display', 'none');
				}
			} else {
				_this.leftSliderIndecator = _this.rightSliderIndecator - itemCount;
				if(_this.leftSliderIndecator < 0){
					var idx = _this.leftSliderIndecator;
					_this.leftSliderIndecator = 0;
					_this.rightSliderIndecator = _this.rightSliderIndecator + (idx * -1);
					_this.slider.css({'width': buttonWidth + 'px', 'left': 0});
				} else {
					_this.slider.css({'width': buttonWidth + 'px', 'left': sLeft + dWidth});
				}
				if(_this.leftSliderIndecator == 0 && _this.rightSliderIndecator == _this.maximum){
					_this.slider.css('display', 'none');
				} else {
					_this.slider.css('display', '');
				}
			}
			sliceData = _data.slice(_this.rightSliderIndecator - _itemCount, _this.rightSliderIndecator);
			
			return sliceData;
		};
		var touchMoveHandler = function (_event, downPos, _type, _itemMax) {
			if(downPos.left >= 0 && downPos.left + downPos.width <= sliderWidth){
				var downX = downPos.x, move = null;
				if (typeof _event.layerX !== 'undefined') { // Opera
					if(_event.layerX < 0){ //Android
						move = Math.floor(downX - event.touches[0].pageX);
					} else {
						move = Math.floor(downX - _event.layerX);
					}
				} else if (typeof _event.offsetX !== 'undefined') {
					
				} else {
					
				}
				_this.leftSliderIndecator = downPos.leftSlider + move;
				_this.rightSliderIndecator = _this.leftSliderIndecator + itemCount;
				if(_this.leftSliderIndecator < 0) {
					_this.leftSliderIndecator = 0, _this.rightSliderIndecator = _this.leftSliderIndecator + itemCount;
				}else if(_this.rightSliderIndecator > sliderWidth || _this.leftSliderIndecator > (_this.maximum - itemCount)){
					_this.leftSliderIndecator = _this.maximum - itemCount;
					_this.rightSliderIndecator = _this.maximum;
				}
				_this.slider[0].style.left = sliderWidth * (_this.leftSliderIndecator / _this.maximum)+'px';
			}
		};
		var mouseMoveHandler = function (_event, downPos, _type, _itemMax) {
			if(!_this.sliderDownChk) return;
			if(downPos.left >= 0 && downPos.left + downPos.width <= sliderWidth){
				
				var left = downPos.left;
				var mouseX = null;
				if (typeof _event.layerX !== 'undefined') { // Opera
					if(_event.layerX < 0){ //Android
						mouseX = event.touches[0].pageX + event.layerX;
					} else {
						mouseX = _event.layerX;
					}
				} else if (typeof _event.offsetX !== 'undefined') {
					mouseX = _event.offsetX;
				} else {
					mouseX = _event.clientX - ($(_event.target).offset().left);
				}
				if(_type == "button"){ // Slider
					if(_event.target.nodeName == "SPAN" || $(_event.target).attr('class') == "slider-button"){
						if(downPos.x < mouseX) left = left + (mouseX - downPos.x);
						else if(downPos.x > mouseX) left = left - (downPos.x - mouseX);
					} else {
						left = mouseX - downPos.x;
					}
				}else{ // SliderBOX & SelectCanvas
					left = mouseX - downPos.x;
				}
				if(left < 0) left = 0;
				if(left + downPos.width > sliderWidth) left = sliderWidth - downPos.width;
				_this.slider[0].style.left = left + 'px';
				_this.leftSliderIndecator = Math.round((left / sliderWidth) * _itemMax);
				_this.rightSliderIndecator = Math.round(((left + downPos.width) / sliderWidth) * _itemMax);
				
				downPos.left = left;
			}
		};
		
		return _this;
	};
})(jQuery);