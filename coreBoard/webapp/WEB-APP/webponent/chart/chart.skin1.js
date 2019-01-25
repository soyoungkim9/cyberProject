(function($){
	/*
	 * 종합차트
	 */
	$.stockchart = function(selector, f, mobile){
		var stockchart = {
				init: function(){
					this.chart = null;
					this.isIE = true; // true 로 변경하면 html5 차트 출력
					if('ontouchstart' in document.documentElement || this.isIE || mobile == "mobile"){
						if(this.chart != null) return;
						var itemcount = 80, ylabelgap = 76, canvaspaddingleft = 20, ylabelpaddingright = 10;
						if(mobile){itemcount = 30, ylabelgap = 50, canvaspaddingleft = 8, ylabelpaddingright = 0; }
						var stockOptions = {
								//"url": "/WEB-APP/wts/chart-data.jspx?cmd=process&Stype=J&Scode="+f.jcode.value+"&Sbtngb=2",
								"url": "../../../chart/sample/data/6110.txt",
								"stockmenuurl": "/WEB-APP/webponent/chart/html5/ci.chart.personal.html",
								"xaxisformat": "dayDataFormat", "usestock": true, "usecrossline": true,
								"stockMenuWidth": 98,"usecanvasmoveall": true, "funcmoveall": "callJsMouseInfo", "usemobiledevice": "pc", "itemcount": itemcount/*,
								"usehtip": true, "usevtip": true*/
						};
						var stockStyles = {
								"main":{
									"canvaspaddingbottom": 0, "canvaspaddingleft": canvaspaddingleft,
									"ylabelgap": ylabelgap, "ylabelalign": "left", "ylabelpaddingright": ylabelpaddingright, "ylabelpaddingleft": 10, "yaxisalign": "right",
									"xlabelfontcolor": "#666666", "ylabelfontcolor": "#666666", "xlabelgap": 20, "xlabelpaddingtop": 15,
									"graphstroketopcolor": "#cccccc", "graphstrokeleftcolor": "#cccccc", "graphstrokebottomcolor": "#cccccc", "graphstrokerightcolor": "#cccccc",
									"horizontalgridstrokecolor": "#cccccc","verticalgridstrokecolor": "#cccccc",
									"crosslinestyle": "solid", "crosslinecolor": "#000000", "legendimage": "/WEB-APP/webponent/chart/html5/legend.png",
									"candle": {
										"itemwidth": "80", "useaccessibility": true, "usemaxvalue": true, "useminvalue": true,
										"maxvaluearrowimage": { "url": "/WEB-APP/webponent/chart/html5/legend.png", "top": 560, "left": 10, "width": 8, "height": 9 },
										"minvaluearrowimage": { "url": "/WEB-APP/webponent/chart/html5/legend.png", "top": 580, "left": 10, "width": 8, "height": 9 },
										"upfillcolor": 		 [[0.2, "rgba(219,76,60,0.6)"],  [0.5, "rgba(233,101,86,0.6)"],  [0.8, "rgba(219,76,60,0.6)"]],
										"downfillcolor": 	 [[0.2, "rgba(84,168,246,0.6)"], [0.5, "rgba(107,179,245,0.6)"], [0.8, "rgba(84,168,246,0.6)"]],
										"overupfillcolor":   [[0.2, "rgba(219,76,60,1)"],    [0.5, "rgba(233,101,86,1)"],    [0.8, "rgba(219,76,60,1)"]],
										"overdownfillcolor": [[0.2, "rgba(84,168,246,1)"],   [0.5, "rgba(107,179,245,1)"],   [0.8, "rgba(84,168,246,1)"]],
										"upstrokecolor": "#c42c1c", "downstrokecolor": "#2e80cc", "overupstrokecolor": "#c42c1c", "overdownstrokecolor": "#2e80cc"
									},
									"line": {
										"useaccessibility": true, "usemaxvalue": true, "useminvalue": true,
										"maxvaluearrowimage": { "url": "/WEB-APP/webponent/chart/html5/legend.png", "top": 560, "left": 10, "width": 8, "height": 9 },
										"minvaluearrowimage": { "url": "/chart/html5/legend.png", "top": 580, "left": 10, "width": 8, "height": 9 }
									},
									"hloc": {
										"useaccessibility": true, "usemaxvalue": true, "useminvalue": true,
										"maxvaluearrowimage": { "url": "/WEB-APP/webponent/chart/html5/legend.png", "top": 560, "left": 10, "width": 8, "height": 9 },
										"minvaluearrowimage": { "url": "/WEB-APP/webponent/chart/html5/legend.png", "top": 580, "left": 10, "width": 8, "height": 9 }
									}
								}
						};
						var stockSeries = {
								"main":{
									"candle": { "series": "candle","xaxis": "date","open": "open","high": "high","low": "low","close": "close","label": "종가","stockmain": true },
									"hloc":   { "visible": false, "series": "hloc", "xaxis": "date", "open": "open", "high": "high", "low": "low", "close": "close", "label": "종가", "stockmain": true },
									"line":   { "visible": false, "series": "line", "xaxis": "date", "yaxis": "close", "label": "종가", "stockmain": true }
								}
						};
						this.chart = selector.createChart(stockOptions, stockStyles, stockSeries);
						
					} else {
						var str = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,115,0" width="750" height="500" name="chart2" id="chart2">'
							+'<param name="movie" value="../../../chart/flex/stock.swf" />'
//							+'<param name="flashvars" value="dataURL=/WEB-APP/wts/chart-data.jspx&cmd=process&Stype=J&Scode='+f.jcode.value+'&Sunit=1&Sbtngb=2&funcmoveall=callJsMouseInfo" />'
							+'<param name="flashvars" value="dataURL=../../../chart/sample/data/6110.txt&cmd=process&Stype=J&Scode=005930&Sunit=1&Sbtngb=1&funcmoveall=callJsMouseInfo" />'
							+'<param name="allowScriptAccess" value="always" />'
							+'<param name="wmode" value="transparent" />'
							+'<param name="allowFullScreen" value="false" />'
							+'<!--[if !IE]>-->'
							+'<object type="application/x-shockwave-flash" data="../../../chart/flex/stock.swf" width="750" height="500">'
							+'<param name="flashvars" value="dataURL=../../../chart/sample/data/6110.txt&cmd=process&Stype=J&Scode=005930&Sunit=1&Sbtngb=1&funcmoveall=callJsMouseInfo" />'
//							+'<param name="flashvars" value="dataURL=/WEB-APP/wts/chart-data.jspx&cmd=process&Stype=J&Scode='+f.jcode.value+'&Sunit=1&Sbtngb=2&funcmoveall=callJsMouseInfo" />'
							+'<param name="allowScriptAccess" value="sameDomain" />'
							+'<param name="wmode" value="transparent" />'
							+'<param name="allowFullScreen" value="false" />'
							+'<embed name="chart2" src="../../../chart/flex/stock.swf" width="750" height="500"></embed>'
							+'<!--<![endif]-->'
							+'<p>이 콘텐츠를 보려면 <a href="http://www.adobe.com/kr/products/flashplayer/">Flash Player</a>(무료)가 필요합니다.</p>'
							+'<div>증권차트 플래시 파일입니다. </div>'
							+'<!--[if !IE]>-->'
							+'</object>'
							+'<!--<![endif]-->'
							+'</object>';
						this.chart = $(str);
						selector.addClass("pc");
						selector.append(this.chart);
					}
					return this.chart;
				}, 
				inquery: function(){
					
				},
				thisMovie: function( movieObject ){
					if( navigator.appName.indexOf( 'Microsoft' ) != -1 ){
						return movieObject[0];
						//return window[ movieName ];
					} else {
						return document[ movieObject.attr('name') ];
					}
				},
				changeSize: function(){
					this.chart.changeSize();
				}
		};
		var _this = stockchart;
		_this.init(selector, f, mobile); 
        
        return {
        	inquery: function(param, f){
        		return _this.inquery(param, f);
        	}, 
        	changeSize: function(){
        		return _this.changeSize();
        	}
        };
	};
	
	$.createChart = function(){
		var chart = {
			/*
			 * 호가 테이블 안에 들어가는 차트
			 * # useVolume 이 true 이면 거래량까지 출력
			 */
			miniCandle: {
				init: function(selector, f, _option, useVolume){
					this.chart = null;
					var set = {};
					set.mainHeight = 100, set.subHeight = 0, set.subVisible = false, set.canvaspaddingbottom = 8;
					if(useVolume){ set.mainHeight = 60, set.subHeight = 40, set.subVisible = true, set.canvaspaddingbottom = 0; }
					var option = { "url": "", "usetip": false, "useselectitem": false };
					var styles = {
							"main" :{
								"usexlabel": false,"useylabel": false, "xlabelgap": 0, "ylabelgap": 0,
								"canvaspaddingtop": 0,"canvaspaddingbottom": 8,"canvaspaddingleft": 0,"canvaspaddingright": 0,
								"graphpaddingtop": 0,"graphpaddingbottom": 0,"graphpaddingleft": 0,"graphpaddingright": 0,
								"xlabelpaddingtop": 0,"ylabelpaddingright":0,"ylabelpaddingleft": 0,
								"usegraphstroketop": false,"usegraphstrokebottom": false,"usegraphstrokeleft": false,"usegraphstrokeright": false,
								"usehorizontalgridstroke": false, "useverticalgridstroke": false, "graphheight": set.mainHeight, "graphbackgroundcolor": "#EEE",
								"series": {
									"itemwidth": 70, "useaccessibility": true,
									"upfillcolor": [[0.15, "#db4c3c"], [0.5, "#e96556"], [0.85, "#db4c3c"]], "upstrokecolor": "#c42c1c",
									"downfillcolor": [[0.15, "#54a8f6"], [0.5, "#6bb3f5"], [0.85, "#54a8f6"]], "downstrokecolor": "#2e80cc"
								},
								"series1": { "strokecolor": "#f23617" }
							},
							"sub": {
								"graphbackgroundcolor": "#EEE", "usexlabel": false,"useylabel": false, "xlabelgap": 0, "ylabelgap": 0,
								"canvaspaddingtop": 0,"canvaspaddingbottom": set.canvaspaddingbottom,"canvaspaddingleft": 0,"canvaspaddingright": 0,
								"graphpaddingtop": 0,"graphpaddingbottom": 0,"graphpaddingleft": 0,"graphpaddingright": 0,
								"xlabelpaddingtop": 0,"ylabelpaddingright":0,"ylabelpaddingleft": 0,
								"usegraphstroketop": false,"usegraphstrokebottom": false,"usegraphstrokeleft": false,"usegraphstrokeright": false,
								"usehorizontalgridstroke": false, "useverticalgridstroke": false, "graphheight": set.subHeight,
								"series3": { "itemwidth": 70 }
							}
					};
					var series = {
							"main":{
								"type": "main",
								"series": { "series": "candle", "xaxis": "date", "open": "open", "high": "high","low": "low", "close": "close", "label": "주식정보" }, 
								"series1": { "series": "line", "xaxis": "date", "yaxis": "close", "label": "이동평균5일선" }
							},
							"sub": {
								"type": "sub",
								"series3": { "visible": set.subVisible, "series": "column", "xaxis": "date", "yaxis": "volume", "label": "거래량" }
							}
					};
					option = $.extend(true, option, _option);
					this.chart = selector.createChart(option, styles, series);
					
				},
				inquery: function(f){
					var option = {
							"url": "../../../chart/sample/data/chart02_2.txt"
					};
					this.chart.chart.reDraw(option);
				}
			},
			columnChart: {
				init: function(selector, f){
					this.chart = null;
					var option = { "url": "../../../chart/sample/data/chart03.txt", "datatype": "json" };
					var styles = {
							"main": {
								"canvaspaddingtop": 8,
								"graphstroketopcolor": "#cccccc","graphstrokeleftcolor": "#cccccc","graphstrokebottomcolor": "#cccccc","graphstrokerightcolor": "#cccccc",
								"horizontalgridstrokecolor": "#cccccc","useverticalgridstroke": false, "xlabelfontcolor": "#666666", "ylabelfontcolor": "#666666",
								"crosslinecolor": "#000000", "crosslinestyle": "solid",
								"baseatzero": true, "xlabelgap": 100, "xlabelvertical": true, 
								"ylabelpaddingright": 0, "ylabelgap": 40, "ylabelalign": "right", "xlabelfontstyle": "12px dotum",
								"series": {
									"upfillcolor": [[0.15, "#db4c3c"], [0.5, "#e96556"], [0.85, "#db4c3c"]], "upstrokecolor": "#c42c1c",
									"downfillcolor": [[0.15, "#54a8f6"], [0.5, "#6bb3f5"], [0.85, "#54a8f6"]], "downstrokecolor": "#2e80cc",
									"overupfillcolor": {
										"src": "../../../chart/html5/img/pattern_column_over.png",
										"fill": [[0.15, "#db4c3c"], [0.5, "#e96556"], [0.85, "#db4c3c"]]
									},
									"overdownfillcolor": {
										"src": "../../../chart/html5/img/pattern_column_over.png",
										"fill": [[0.15, "#54a8f6"], [0.5, "#6bb3f5"], [0.85, "#54a8f6"]]
									}, "basestrokecolor":"#cccccc"
								}
							}
					};
					var series = {
							"main": {
								"series": { "series": "column", "form": "updown", "xaxis": "name", "yaxis": "rate" }
							}
					};
					this.chart = selector.createChart(option, styles, series);
				},
				inquery: function(f){
					var option = {
							"url": "../../../chart/sample/data/chart02_2.txt"
					};
					this.chart.chart.reDraw(option);
				}
			},
			lineChart: {
				init: function(selector, f, _option, _styles, _series){
					this.chart = null;
					var option = { "url": "../../../chart/sample/data/chart06.txt", "datatype": "json", "usecanvasmoveall": true, "funcmoveall": "callJsMouseInfo" };
					var styles = {
							"main": {
								"canvaspaddingtop": 8,
								"graphstroketopcolor": "#cccccc","graphstrokeleftcolor": "#cccccc","graphstrokebottomcolor": "#cccccc","graphstrokerightcolor": "#cccccc",
								"horizontalgridstrokecolor": "#cccccc","verticalgridstrokecolor": "#cccccc", "xlabelfontcolor": "#666666", "ylabelfontcolor": "#666666",
								"crosslinecolor": "#000000", "crosslinestyle": "solid",
								"xlabelgap": 12, 
								"ylabelpaddingright": 0, "ylabelgap": 65, "ylabelalign": "right", "xlabelfontstyle": "12px dotum",
								"series1": { "strokecolor" : "#be0001", "basestrokecolor": "#cccccc", "overfillcolor": "#be0001", "overstrokewidth": 0},
								"series2": { "strokecolor" : "#1a83d9", "basestrokecolor": "#cccccc", "overfillcolor": "#1a83d9", "overstrokewidth": 0},
								"series3": { "strokecolor" : "#82cd14", "basestrokecolor": "#cccccc", "overfillcolor": "#82cd14", "overstrokewidth": 0},
								"series4": { "strokecolor" : "#fcdd4c", "basestrokecolor": "#cccccc", "overfillcolor": "#fcdd4c", "overstrokewidth": 0}
							}
					};
					var series = {
							"main": {
								"series1": {"visible": false, "series": "line", "xaxis": "date", "yaxis": "rate1", "label": "개인" },
								"series2": {"visible": false, "series": "line", "xaxis": "date", "yaxis": "rate2", "label": "외국인" },
								"series3": {"visible": false, "series": "line", "xaxis": "date", "yaxis": "rate3", "label": "증권" },
								"series4": {"visible": false, "series": "line", "xaxis": "date", "yaxis": "rate4", "label": "투신" }
							}
					};
					option = $.extend(true, option, _option);
					styles = $.extend(true, styles, _styles);
					series = $.extend(true, series, _series);
					this.chart = selector.createChart(option, styles, series);
				},
				inquery: function(f, _option){
					var option = {};
					option = $.extend(true, option, _option);
					this.chart.chart.reDraw(option);
				}
			},
			multiChart: {
				init: function(selector, f, _option, _styles, _series){
					this.chart = null;
					var option = { 
							"url": "",
							"xaxisformat": "dayDataFormat", "yaxisformat": "priceDataFormat", 
							"usecrossline": true, "usetip": true, "usemultiyaxis": true
					};
					var styles = {
							"main":{
								"canvaspaddingtop": 8,
								"graphstroketopcolor": "#cccccc","graphstrokeleftcolor": "#cccccc","graphstrokebottomcolor": "#cccccc","graphstrokerightcolor": "#cccccc",
								"horizontalgridstrokecolor": "#cccccc","verticalgridstrokecolor": "#cccccc", "xlabelfontcolor": "#666666", "ylabelfontcolor": "#666666",
								"crosslinecolor": "#000000", "crosslinestyle": "solid", "xlabelgap": 12,
								"series1":{
									"baseatzero": false, "itemwidth": 65,
									"yaxisalign": "right", "ylabelalign": "left", "ylabelgap": 60,
									"ylabelpaddingright": 10, "ylabelpaddingleft": 10, "basestrokecolor": "#cccccc"
								},
								"series2":{
									"baseatzero": false, "overstrokewidth":0,
									"yaxisalign": "left", "ylabelalign": "right", "ylabelgap": 60,
									"ylabelpaddingright": 10, "ylabelpaddingleft": 10, "strokecolor": "#1a83d9", "overfillcolor": "#1a83d9"
								}
							}
						};
					var series = {
							"main":{
								"series1":{
									"series": "column",
									"xaxis": "date",
									"yaxis": "volume",
									"yaxisid":"series1"
								},
								"series2":{
									"series": "line",
									"xaxis": "date",
									"yaxis": "high",
									"yaxisid":"series2"
								}
							}
						};
					option = $.extend(true, option, _option);
					styles = $.extend(true, styles, _styles);
					series = $.extend(true, series, _series);
					this.chart = selector.createChart(option, styles, series);
				},
				inquery: function(f, _option){
					var option = {
							"url": ""
					};
					option = $.extend(true, option, _option);
					this.chart.chart.reDraw(option);
				}
			}
		};
		var _this = chart;
		return {
			miniCandle: {
				init: function(selector, f, options, useVolume){
					_this.miniCandle.init(selector, f, options, useVolume);
					return this;
				}, 
				inquery: function(f){
					_this.miniCandle.inquery(f);
				}
			},
			columnChart: {
				init: function(selector, f){
					_this.columnChart.init(selector, f);
					return this;
				}, 
				inquery: function(f){
					_this.columnChart.inquery(f);
				}
			},
			lineChart: {
				init: function(selector, f, _option, _styles, _series){
					_this.lineChart.init(selector, f, _option, _styles, _series);
					return this;
				}, 
				inquery: function(f, _option){
					_this.lineChart.inquery(f, _option);
				}
			},
			multiChart: {
				init: function(selector, f, _option, _styles, _series){
					_this.multiChart.init(selector, f, _option, _styles, _series);
					return this;
				}, 
				inquery: function(f, _option){
					_this.multiChart.inquery(f, _option);
				}
			}
		};
	};
	
})(jQuery);