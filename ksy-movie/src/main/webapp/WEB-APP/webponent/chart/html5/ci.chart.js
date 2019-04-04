(function($) {
	$.fn.createChart = function(_options, _styles, _series) {
		var _this = this;
		var chart = null;
		var ctx = "/WEB-APP/webponent/chart/";
		var loadBaseChartLib = function (){
			var seriesArray = [ctx+'comm/ci.comm.common.js',
					         ctx+'comm/ci.comm.data.js',
					         ctx+'html5/ci.chart.set.js',
					         ctx+'html5/ci.chart.chart.js',
					         ctx+'html5/ci.chart.drawchart.js'
					         ];
			require(seriesArray, function(){
				loadSeriesChartLib();
			});
		};
		
		var loadSeriesChartLib = function (){
			ctx = ctx + "html5/";
			var seriesList = {
					"line": "ci.chart.lineseries",
					"bar": "ci.chart.barseries",
					"hloc": "ci.chart.hlocseries",
					"area": "ci.chart.areaseries",
					"candle": "ci.chart.candleseries",
					"plot": ["ci.chart.plotseries", "skin/ci.chart.skin.plot"],
					"column": ["ci.chart.columnseries", "skin/ci.chart.skin.column"]
			};
			var stockList = ["ci.chart.overlay", "ci.chart.subindex", "ci.chart.stocketc"];
			var series = _series, seriesArray = [];
			if(!_options.usestock){
				for(var s in series) {
					var seriesIn = series[s];
					for(var k in seriesIn){
						if(k == "type") continue;
						if(typeof(seriesList[seriesIn[k].series]) === "string"){
							seriesArray.push(ctx + seriesList[seriesIn[k].series] + ".js");
						} else {
							for(var j = seriesList[seriesIn[k].series].length; j--;){
								seriesArray.push(ctx + seriesList[seriesIn[k].series][j] + ".js");
							}
						}
					}
				}
			} else {
				for(var k in seriesList){
					if(typeof(seriesList[k]) === "string"){
						seriesArray.push(ctx + seriesList[k] + ".js");
					} else {
						for(var j = seriesList[k].length; j--;){
							seriesArray.push(ctx + (seriesList[k])[j] + ".js");
						}
					}
				}
				for(var j = stockList.length; j--;){
					seriesArray.push(ctx + stockList[j] + ".js");
				}
				try{
					if($.accordion("", {})){ }
				} catch(e){
					seriesArray.push(ctx + "ui.accordion.js");
				}
			}
			
			require( seriesArray, function () {
				_this.chart = new CreateChartSet(_this, _options, _styles, _series);
			});
		};
		try{
			var str = "10000".format(); // error 검출용 문장
			_this.chart = new CreateChartSet(_this, _options, _styles, _series);
			return _this;
		} catch(e) { // 스크립트 JS 가 로딩이 안되어있을때 - 제일 첫 create
			loadBaseChartLib();
		}
		return _this;
		
	};
})(jQuery);


