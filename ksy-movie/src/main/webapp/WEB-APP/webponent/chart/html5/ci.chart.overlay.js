(function($) {
	ParseOverLayFunction = function (){
		var _this = this;
		
		/* 이동평균 S */
		this.over1_param1 = 5, this.over1_param2 = 20, this.over1_param3 = 60;
		this.parseOver1Data = function ( _originalData, _series, _value ) {
			over1_Sma5(_originalData, _series.over1_series1);
			over1_Sma20(_originalData, _series.over1_series2);
			over1_Sma60(_originalData, _series.over1_series3);
			return _originalData;
		};
		var sma5_yaxis = "", _arrData = null;
		var over1_Sma5 = function (_data, _series){
			if(sma5_yaxis == "") sma5_yaxis = _series.yaxis;
			var price = sma5_yaxis;
			_arrData = new Array(_this.over1_param1);
			var t = null;
			for(var i = 0, len = _data.length; i < len; i++){
				if(_data.xaxis == " ") continue;
				t = _data[i];
				t.sma5 = parseSMA(_arrData, i, _this.over1_param1, Number(t[price]));
			}
			_series.yaxis = "sma5";
			try{
				return _data;
			} finally {
				price = null, _arrData = null;
				i = null, len = null;
			}
		};
		var sma20_yaxis = "";
		var over1_Sma20 = function (_data, _series){
			if(sma20_yaxis == "") sma20_yaxis = _series.yaxis;
			var price = sma20_yaxis;
			_arrData = new Array(_this.over1_param2);
			var t = null;
			for(var i = 0, len = _data.length; i < len; i++){
				if(_data.xaxis == " ") continue;
				t = _data[i];
				t.sma20 = parseSMA(_arrData, i, _this.over1_param2, Number(t[price]));
			}
			_series.yaxis = "sma20";
			try{
				return _data;
			} finally {
				price = null, _arrData = null;
				i = null, len = null;
			}
		};
		var sma60_yaxis = "";
		var over1_Sma60 = function (_data, _series){
			if(sma60_yaxis == "") sma60_yaxis = _series.yaxis;
			var price = sma60_yaxis;
			_arrData = new Array(_this.over1_param3);
			var t = null;
			for(var i = 0, len = _data.length; i < len; i++){
				if(_data.xaxis == " ") continue;
				t = _data[i];
				t.sma60 = parseSMA(_arrData, i, _this.over1_param3, Number(t[price]));
			}
			_series.yaxis = "sma60";
			try{
				return _data;
			} finally {
				price = null, _arrData = null;
				i = null, len = null;
			}
		};
		
		var parseSMA = function(_arr, _index, _param, _data) {
			_arr[_index % _param] = _data;
			var dClose = 0;
			if(_index >= _param - 1){
				for(var i = _param; i--;) dClose += _arr[i];
				dClose = dClose / _param;
				return dClose;
			} else {
				return null;
			}
		}; /* 이동평균 E */
		/*
		 * 일목균형 S
		 * S - 기준선 / C - 전환선 / B - 후행 / F1 - 선행1 / F2 - 선행2
		 * param1 - 기준, 후행, 선행 / param2 - 전환 / param3 - 선행
		 */
		this.over2_param1 = 26, this.over2_param2 = 9, this.over2_param3 = 52;
		var over2_bandS = 0, over2_bandC = 0, over2_bandB = 0, over2_bandF1 = 0, over2_bandF2 = 0;
		var over2_originalData = null, over2_originalDataCount = null;
		this.parseOver2Data = function ( _originalData, _series, _value, _xAxisName ) {
			over2_originalData = _originalData;
			var count = _originalData.length;
			if(over2_originalDataCount == null) {
				over2_originalDataCount = count;
			}
			for(var i = 0, len = over2_originalDataCount; i <= len; i++){
				var thisOriginalData = _originalData[i]; 
				if(i < over2_originalDataCount){
					over2_bandS  = over2_STDLine(i, _this.over2_param1); // 기준
					over2_bandC  = over2_CVTLine(i, _this.over2_param2); // 전환
					over2_bandB  = over2_BACKLine(i, _this.over2_param1); // 후행
					over2_bandF1 = over2_FST1Line(i, _this.over2_param1, _this.over2_param2); // 선행1
					over2_bandF2 = over2_FST2Line(i, _this.over2_param3, _this.over2_param1); // 선행2
					
					if(i < count - _this.over2_param1) {
						if(i >= _this.over2_param1 - 1 && i < count - _this.over2_param1) {
							thisOriginalData.bandSTD = over2_bandS;
							thisOriginalData.bandCVT = over2_bandC;
							thisOriginalData.bandBACK = over2_bandB;
							thisOriginalData.bandFIR1 = over2_bandF1;
							thisOriginalData.bandFIR2 = over2_bandF2;
						} else {
							thisOriginalData.bandSTD = over2_bandS;
							thisOriginalData.bandCVT = over2_bandC;
							thisOriginalData.bandBACK = over2_bandB;
						}
					} else if(i >= count - _this.over2_param1 && i < _this.over2_param1) {
						thisOriginalData.bandSTD = over2_bandS;
						thisOriginalData.bandCVT = over2_bandC;
					} else {
						thisOriginalData.bandSTD = over2_bandS;
						thisOriginalData.bandCVT = over2_bandC;
						thisOriginalData.bandFIR1 = over2_bandF1;
						thisOriginalData.bandFIR2 = over2_bandF2;
					}
				} else if(i == over2_originalDataCount) {
					_originalData.splice(over2_originalDataCount, count - over2_originalDataCount);
					for(var j = 1; j < _this.over2_param1; j++) {
						if(over2_nFST1Array[j] == null || over2_nFST1Array[j] == '') { } 
						else {
							var obj = new Object();
							obj[_xAxisName] = " ", obj.xaxis = " ";
							obj.bandFIR1 = over2_nFST1Array[j];
							obj.bandFIR2 = over2_nFST2Array[j];
							_originalData.push(obj);
						}
					}
				}
			}
			_series.over2_series1.yaxis = "bandCVT";
			_series.over2_series2.yaxis = "bandSTD";
			_series.over2_series6.yaxis = "bandFIR1";
			_series.over2_series6.minaxis = "bandFIR2";
			_series.over2_series3.yaxis = "bandFIR1";
			_series.over2_series4.yaxis = "bandFIR2";
			_series.over2_series5.yaxis = "bandBACK";
			
			return _originalData;
		};
		// 기준선
		var over2_nSTDLine_high = null, over2_nSTDLine_low = null;
		var over2_STDLine = function(_index, _paramDay) {
			if(_index == 0){
				over2_nSTDLine_high = new Array(_paramDay);
				over2_nSTDLine_low = new Array(_paramDay);
			} 
			if(_paramDay == 1) {
				return (over2_originalData[_index].high + over2_originalData[_index].low)/2;
			} else {
				over2_nSTDLine_high[_index % _paramDay] = over2_originalData[_index].high;
				over2_nSTDLine_low[_index % _paramDay]  = over2_originalData[_index].low;
				
				var dHigher = over2_nSTDLine_high[0], dLower  = over2_nSTDLine_low[0];
				
				for(var i = over2_nSTDLine_high.length; i --;){
					if(dHigher <= over2_nSTDLine_high[i]) dHigher = over2_nSTDLine_high[i];
					if(dLower >= over2_nSTDLine_low[i]) dLower  = over2_nSTDLine_low[i];
				}
				return (dHigher+dLower)/2;	
			}
		};
		// 전환선
		var over2_nCVTLine_high = null, over2_nCVTLine_low = null;
		var over2_CVTLine = function (index, paramDay) {
			if (index == 0){
				over2_nCVTLine_high = new Array(paramDay);
				over2_nCVTLine_low = new Array(paramDay);
			}
			if(paramDay == 1){
				return (over2_originalData[index].high + over2_originalData[index].low)/2;
			}else{
				over2_nCVTLine_high[index % paramDay] = over2_originalData[index].high;
				over2_nCVTLine_low[index % paramDay]  = over2_originalData[index].low;
				
				var dHigher = over2_nCVTLine_high[0];
				var dLower  = over2_nCVTLine_low[0];
				
				for(var i = over2_nCVTLine_high.length; i --;){
					if(dHigher <= over2_nCVTLine_high[i]) dHigher = over2_nCVTLine_high[i];
					if(dLower  >= over2_nCVTLine_low[i]) dLower  = over2_nCVTLine_low[i];
				}
				return (dHigher+dLower)/2;
			}
		};
		// 후행스팬
		var over2_BACKLine = function (index, paramDay)	{
			if(index + paramDay -1 < over2_originalData.length){ return over2_originalData[index + paramDay - 1].close; }
			else{ return 0; }
		};
		// 선행스팬1
		var over2_nFST1Array = null;
		var over2_nFSTSTD_high = null, over2_nFSTSTD_low = null;
		var over2_nFSTCVT_high = null, over2_nFSTCVT_low = null;
		var over2_FST1Line = function (index, paramDay1, paramDay2)	{
			if(index == 0){
				over2_nFST1Array   = new Array(paramDay1);
				over2_nFSTSTD_high = new Array(paramDay1);
				over2_nFSTSTD_low  = new Array(paramDay1);
				over2_nFSTCVT_high = new Array(paramDay2);
				over2_nFSTCVT_low  = new Array(paramDay2);
			}
			if(paramDay1 == 1){
				var dParam1 = (((over2_originalData[index].high + over2_originalData[index].low)/2) + ((over2_originalData[index].high + over2_originalData[index].low)/2))/2;
				return dParam1;
			}else{
				over2_nFSTSTD_high[index % paramDay1] = over2_originalData[index].high;
				over2_nFSTSTD_low[index % paramDay1]  = over2_originalData[index].low;
				over2_nFSTCVT_high[index % paramDay2] = over2_originalData[index].high;
				over2_nFSTCVT_low[index % paramDay2]  = over2_originalData[index].low;
				
				var dHigher1 = over2_nFSTSTD_high[0], dLower1  = over2_nFSTSTD_low[0];
				var dHigher2 = over2_nFSTCVT_high[0], dLower2  = over2_nFSTCVT_low[0];
				
				for(var i = over2_nFSTSTD_high.length; i--;){
					if(dHigher1 < over2_nFSTSTD_high[i]) dHigher1 = over2_nFSTSTD_high[i];
					if(dLower1 > over2_nFSTSTD_low[i]) dLower1 = over2_nFSTSTD_low[i];
				
					if(dHigher2 < over2_nFSTCVT_high[i]) dHigher2 = over2_nFSTCVT_high[i];
					if(dLower2 > over2_nFSTCVT_low[i]) dLower2 = over2_nFSTCVT_low[i];
				}
				var dSTD = (dHigher1 + dLower1) / 2; // 기준선
				var dCVT = (dHigher2 + dLower2) / 2; // 전환선
				var dFST1 = (dSTD+dCVT)/2;
				
				if(over2_nFST1Array[paramDay1-2] == null){
					over2_nFST1Array[index] = dFST1;
					return 0;
				}else if(over2_nFST1Array[paramDay1-1] == null){
					over2_nFST1Array[index] = dFST1;
					return over2_nFST1Array[0];
				}else{
					over2_nFST1Array.shift();
					over2_nFST1Array[paramDay1 - 1] = dFST1;
					return over2_nFST1Array[0];
				}
			}
		};
		// 선행스팬2
		var over2_nFST2Line_high = null, over2_nFST2Line_low = null;
		var over2_nFST2Array = null;
		var over2_FST2Line = function(index, paramDay1, paramDay2){
			if (index == 0)	{
				over2_nFST2Line_high = new Array(paramDay1);
				over2_nFST2Line_low = new Array(paramDay1);
				over2_nFST2Array = new Array(paramDay2);
			}
			// 종가
			var dHigh = over2_originalData[index].high, dLow = over2_originalData[index].low;
			
			over2_nFST2Line_high[index % paramDay1] = dHigh;
			over2_nFST2Line_low[index % paramDay1] = dLow;
			var dHigher = over2_nFST2Line_high[0], dLower = over2_nFST2Line_low[0];
			
			for(var i = over2_nFST2Line_high.length; i--;){
				if(dHigher < over2_nFST2Line_high[i]) dHigher = over2_nFST2Line_high[i];
				if(dLower > over2_nFST2Line_low[i]) dLower = over2_nFST2Line_low[i];
			}
			var dFST2 = (dHigher+dLower)/2;
			
			if(paramDay2 == 1){
				return dFST2;
			}else{	
				if(over2_nFST2Array[paramDay2-2] == null){
					over2_nFST2Array[index] = dFST2;
					return 0;
				}else if(over2_nFST2Array[paramDay2-1] == null){
					over2_nFST2Array[index] = dFST2;
					return over2_nFST2Array[0];
				}else{
					over2_nFST2Array.shift();
					over2_nFST2Array[paramDay2 - 1] = dFST2;
					return over2_nFST2Array[0];
				}
			}
		};
		this.deleteOver2Data = function ( _data ) {
			_data.splice(_data.length - _this.over2_param1 + 1, _this.over2_param1);
		};
		/* 일목균형 E */
		/* Bollinger Band S */
		this.over3_param1 = 20, this.over3_param2 = 2;
		var over3_bandT = 0, over3_bandM = 0, over3_bandB = 0;
		this.parseOver3Data = function ( _originalData, _series, _value, _xAxisName ) {
			var xAxisName = _xAxisName, count = _originalData.length;
			for(var i = 0; i < count; i++) {
				var stdDeviation = over3_STDdeviation(i, _this.over3_param1, _originalData); // 표준편차
				var stdSMA = over3_SMA(i, _this.over3_param1, _originalData);
				over3_bandT = stdSMA + _this.over3_param2 * stdDeviation; //상향
				over3_bandM = stdSMA; // 중간
				over3_bandB = stdSMA - _this.over3_param2 * stdDeviation; //하향
				
				var thisOriginalData = _originalData[i]; 
				if(i >= _this.over3_param1 && thisOriginalData[xAxisName] != ' '){
					thisOriginalData.bandTOP = over3_bandT;
					thisOriginalData.bandMID = over3_bandM;
					thisOriginalData.bandBOT = over3_bandB;
				} else if(i < _this.over3_param1) {	}
			}
			_series.over3_series1.yaxis = "bandTOP";
			_series.over3_series2.yaxis = "bandBOT";
			_series.over3_series3.yaxis = "bandMID";
			_series.over3_series4.yaxis = "bandTOP";
			_series.over3_series4.minaxis = "bandBOT";
		};
		
		var over3_STDdeviation = function( index, paramDay, _data){
			var sma = 0;
			if(index >= paramDay -1){
				var SMA_TOTAL = over3_SMA(index, paramDay, _data); // 단기이동평균
				for (var i = 0; i < paramDay; i++) {// 단기이평
					sma += Math.pow(over3_nShortSMA[i] - SMA_TOTAL, 2);
				}
				var STD_TOTAL = Math.sqrt((sma/paramDay));
				return STD_TOTAL;
			}else{
				return 0;
			}
		};
		var over3_nShortSMA = null;
		var over3_SMA = function(index, paramDay, _data) {
			if (index == 0)	{ over3_nShortSMA = new Array(paramDay); }
			// 종가
			var dClose = _data[index].close, dShortSMA = 0;
			over3_nShortSMA[index % paramDay] = dClose;
			if(index >= paramDay-1) { // 장기이평 
				for (var i = paramDay; i--;) // 단기이평
					dShortSMA += over3_nShortSMA[i];
				dShortSMA = dShortSMA / paramDay;
				return dShortSMA;
			}else{ return 0; }
		};
		/* Bollinger Band E */
		/* Parabollic SAR S */
		this.over4_param1 = 0.02, this.over4_param2 = 0.2;
		var over4_dSARCheck = ""; // 추세
		var over4_EP = 0, over4_low = 0, over4_AF = 0; // 신고가 EP, 신저가 EP, 가속도
		this.parseOver4Data = function ( _originalData, _series, _value, _xAxisName ) {
			var count = _originalData.length;
			var dSAR = 0, pSAR = 0; //당일 SAR, 전일 SAR
			for(var i = 0; i < count; i++) {
				var tData = _originalData[i];
				if(i == 0) {
					var nData =_originalData[i + 1];
					over4_AF = _this.over4_param1;
					if(tData.close > nData.close) {
						over4_dSARCheck = "DOWN";
						dSAR = pSAR = Math.max(tData.high, nData.high);
						over4_EP = Math.min(tData.low, nData.low);
					} else {
						over4_dSARCheck = "UP";
						dSAR = pSAR = Math.min(tData.low, nData.low);
						over4_EP = Math.max(tData.high, nData.high);
					}
				} else {
					if(over4_dSARCheck == "UP") { // 상승추세
						if(tData.low < pSAR){
							over4_dSARCheck = "DOWN";
							dSAR = pSAR = over4_EP;
							over4_EP = tData.low;
							over4_AF = _this.over4_param1;
						} else {
							pSAR = dSAR;
							dSAR = pSAR + over4_AF * (over4_EP - pSAR);
							if(over4_EP < tData.high){
								over4_EP = tData.high;
								over4_AF = Math.min(_this.over4_param2, over4_AF + _this.over4_param1);
							}
						}
					} else { // 하락추세
						if(tData.high > pSAR){
							over4_dSARCheck = "UP";
							dSAR = pSAR = over4_EP;
							over4_EP = tData.high;
							over4_AF = _this.over4_param1;
						}else{
							pSAR = dSAR;
							dSAR = pSAR + over4_AF * (over4_EP - pSAR);
							if(over4_EP > tData.low){
								over4_EP = tData.low;
								over4_AF = Math.min(_this.over4_param2, over4_AF + _this.over4_param1);
							}
						}
					}
				}
				if(i < count && tData.high != null) {
					tData.bandSAR = dSAR;
				}/* else { }*/
			}
			_series.over4_series1.yaxis = "bandSAR";
		};
		/* Parabollic SAR E */
		/* Envelop S */
		this.over5_param1 = 20, this.over5_param2 = 5;
		var over5_nShortSMA = [];
		this.parseOver5Data = function(_originalData, _series, _value, _xAxisName){
			var count = _originalData.length;
			var bandT = 0, bandM = 0, bandB = 0;
			var stdSMA = 0, tData = null;
			for(var i = 0; i < count; i++) {
				tData = _originalData[i];
				stdSMA = over5_SMA(i, _this.over5_param1, tData);
				bandT = stdSMA + (_this.over5_param2/100) * stdSMA; //상향
				bandM = stdSMA; // 중간
				bandB = stdSMA - (_this.over5_param2/100) * stdSMA; //하향
				
				if(i >= _this.over5_param1 && tData.high != null){
					tData.bandETOP = bandT;
					tData.bandEMID = bandM;
					tData.bandEBOT = bandB;
				}/* else if(i < _this.over5_param1){ } 
				else{ }*/
			}
			_series.over5_series1.yaxis = "bandETOP";
			_series.over5_series2.yaxis = "bandEBOT";
			_series.over5_series3.yaxis = "bandEMID";
			_series.over5_series4.yaxis = "bandETOP";
			_series.over5_series4.minaxis = "bandEBOT";
		};
		var over5_SMA = function(index, paramDay, _data)
		{
			if (index == 0) { over5_nShortSMA = new Array(paramDay); }

			// 종가
			var dClose = _data.close, dShortSMA=0;
			over5_nShortSMA[index % paramDay] = dClose;
			if(index >= paramDay-1) {// 장기이평 
				for (var i = paramDay; i--;) // 단기이평
					dShortSMA += over5_nShortSMA[i];
				dShortSMA = dShortSMA / paramDay;
				return dShortSMA;
			}else{ return 0; }
		};
		/* Envelop E */
		/* 그물차트 S * param1 = 시작이평, param2 = 종가, param3 = 갯수 */
		this.over6_param1 = 5, this.over6_param2 = 2, this.over6_param3 = 10;
		var over6_nShortSMA_Arr = [], over6_nShortSMA = [];
		var over6_style1 = null, over6_style2 = null;
		this.parseOver6Data = function(_originalData, _series, _style, _value, _xAxisName, _mainKey){
			var count = _originalData.length;
			var over6_param = 0, nShortSMA = 0;
			if(over6_style1 == null){
				over6_style1 = _style.over6_series1, over6_style2 = _style.over6_series2;
			} else {
				for(var i in _series){
					if(i.toString().indexOf("over6") > -1){
						$(_series).removeProp(i);
						$(_style).removeProp(i);
					}
				}
			}
			
			for(var i = 0; i < count; i++){
				if(i < count && _originalData[i].high != null){
					nShortSMA = 0;
					for(var j = 1; j <= _this.over6_param3;j++){
						if(j == 1){
							over6_param = _this.over6_param1;
							nShortSMA = over6_SMA(i, over6_param, j, _originalData[i]); // 단기이동평균
							
							(_originalData[i])["bandMA"+j] = nShortSMA;
						}else{
							over6_param = over6_param + _this.over6_param2;
							nShortSMA = over6_SMA(i, over6_param, j, _originalData[i]); // 단기이동평균
							
							(_originalData[i])["bandMA"+j] = nShortSMA;
						}
					}	
				}
			}
			var obj = null;
			for(var i = _this.over6_param3; i >= 1; i--){
				obj = new Object();
				obj.series = "line";
				obj.xaxis = _xAxisName;
				obj.yaxis = "bandMA"+i;
				obj.label = "그물차트";
				_series["over6_series"+i] = obj;
				if(i == 1 || i == _this.over6_param3){ _style["over6_series"+i] = over6_style1; } 
				else { _style["over6_series"+i] = over6_style2; }
			}
		};
		var over6_SMA = function(index, paramDay, _count, _data)
		{
			var count = _count - 1;
			if (index == 0) {
				over6_nShortSMA = new Array(paramDay);
				over6_nShortSMA_Arr.push(over6_nShortSMA);
			}
			// 종가
			var dClose = _data.close, dShortSMA=0;
			over6_nShortSMA_Arr[count][index % paramDay] = dClose;
			if(index >= paramDay-1) {// 장기이평 
				for (var i = paramDay; i--;) // 단기이평
					dShortSMA += over6_nShortSMA_Arr[count][i];
				dShortSMA = dShortSMA / paramDay;
				return dShortSMA;
			}else{
				for (i=0; i <= index; i++)
					dShortSMA += over6_nShortSMA_Arr[count][i];
				dShortSMA = dShortSMA / (index+1);
				return dShortSMA;
			}
		};
		/* 그물차트 E */
		return _this;
	};
})(jQuery);