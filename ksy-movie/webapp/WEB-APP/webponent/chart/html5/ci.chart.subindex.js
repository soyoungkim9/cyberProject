(function($) {
	ParseSubIndexFunction = function (){
		var _this = this;
		
		this.parseSubVolume = function( _originalData, _series, _value, _xAxisName ){
			var count = _originalData.length, data = null;
			for(var i = count; i --;){
				data = _originalData[i];
				data.VOLUME = Number(data[_series.series1.yaxis]);
			}
		};
		/*
		 * MACD
		 * param1 : 단기이평, param2 : 장기이평, param3 : Signal
		 */
		this.macd_param1 = 12, this.macd_param2 = 26, this.macd_param3 = 9;
		var dPrevShortEMA = 0, dPrevLongEMA = 0; // 단기, 장기 EMA
		this.parseSubMACD = function( _originalData, _series, _value, _xAxisName ){
			var count = _originalData.length;
			
			var dShortEMA = 0, dLongEMA = 0; // 단기, 장기 EMA
			for(var i = 0; i < count; i++) {
				var data = _originalData[i];
				var dClose = data.close;
				
				if(data.xaxis != ' ') {
					if(i == 0) {
						data.MACD = 0, data.MACD_SIGNAL = 0, data.MACD_OSC = 0;
						dPrevShortEMA = dPrevLongEMA = 0;
					} else {
						dShortEMA = subCalcEma(dClose, dPrevShortEMA, _this.macd_param1);
						dLongEMA = subCalcEma(dClose, dPrevLongEMA, _this.macd_param2);

						var dMACD = dShortEMA - dLongEMA; // MACD
						
						dPrevShortEMA = dShortEMA, dPrevLongEMA = dLongEMA;
						
						var dPrevSigEMA = _originalData[i - 1].MACD_SIGNAL;
						var dSignal = subCalcEma(dMACD, dPrevSigEMA, _this.macd_param3); // Signal 계산
						var dOsc = dMACD - dSignal; // MACD Osc 계산
						data.MACD = dMACD, data.MACD_SIGNAL = dSignal, data.MACD_OSC = dOsc;
					}
				} else {}
			}
			_series.series1.yaxis = "MACD_OSC";
			_series.series2.yaxis = "MACD";
			_series.series3.yaxis = "MACD_SIGNAL";
		};
		var subCalcEma = function (dClose, dPrevEMA, nDate) {
			var EP = 2 / (nDate + 1);
			return (dClose * EP) + dPrevEMA * (1 - EP);
		};
		/*
		 * Slow STC
		 * param1 : 기간, param2 : Slow%K, param3 : Slow%D
		 */
		this.slowstc_param1 = 15, this.slowstc_param2 = 5, this.slowstc_param3 = 3;
		this.parseSubSlowSTC = function( _originalData, _series, _value, _xAxisName ){
			var count = _originalData.length;
			
			// 고가, 저가, 종가, 최고가, 최저가,
			var dHigh = 0, dLow = 0, dClose = 0, dMax = 0, dMin = 99999999999999, dK = 0;
			for(var i = 0; i < count; i++) {
				dHigh = 0, dLow = 0, dClose = 0, dMax = 0, dMin = 99999999999999, dK = 0;
				var data = _originalData[i];
				if(i >= _this.slowstc_param1 - 1 && data.date != ' '){
					dClose = data.close; // 당일종가
					for(var j = i; j > i - _this.slowstc_param1; j--){
						dLow = _originalData[j].low, dHigh = _originalData[j].high;
						
						if(dMin > dLow) dMin = dLow;
						if(dMax < dHigh) dMax = dHigh;
					}
					//K
					if(dMax - dMin == 0){ dK = 0; } 
					else { dK = (dClose - dMin) / (dMax - dMin) * 100; }
					
					var dKPrevEMA = 0;
					if(i == _this.slowstc_param1 - 1) dKPrevEMA = dK;
					else dKPrevEMA = _originalData[i - 1].SlowSTC_PERK;
					
					// %K
					var dPerK = subCalcEma(dK, dKPrevEMA, _this.slowstc_param2);
					var dDPrevEMA = 0;
					if(i == _this.slowstc_param1 - 1) dDPrevEMA = dPerK;
					else dDPrevEMA = _originalData[i - 1].SlowSTC_PERD;
					// %D
					var dPerD = subCalcEma(dPerK, dDPrevEMA, _this.slowstc_param3);
					data.SlowSTC_ROC = dK, data.SlowSTC_PERK = dPerK, data.SlowSTC_PERD = dPerD;
				} else { }
			}
			_series.series1.yaxis = "SlowSTC_PERK";
			_series.series2.yaxis = "SlowSTC_PERD";
		};
		
		/*
		 * Fast STC
		 * param1 : Fast%K, param2 : Fast%D
		 */
		this.faststc_param1 = 15, this.faststc_param2 = 5;
		this.parseSubFastSTC = function( _originalData, _series, _value, _xAxisName ){
			var count = _originalData.length;
			// 고가, 저가, 종가, 최고가, 최저가,
			var dHigh = 0, dLow = 0, dClose = 0, dMax = 0, dMin = 99999999999999, dPerK = 0;
			for(var i = 0; i < count; i++) {
				dHigh = 0, dLow = 0, dClose = 0, dMax = 0, dMin = 99999999999999, dPerK = 0;
				var data = _originalData[i];
				if(i >= _this.faststc_param1 - 1 && data.date != ' '){
					dClose = data.close; // 당일종가
					
					for(var j = i; j > i - _this.faststc_param1; j--){
						dLow = _originalData[j].low, dHigh = _originalData[j].high;
						
						if(dMin > dLow) dMin = dLow;
						if(dMax < dHigh) dMax = dHigh;
					}
					//K
					if(dMax - dMin == 0){ dPerK = 0; } 
					else { dPerK = (dClose - dMin) / (dMax - dMin) * 100; }
					
					var dDPrevEMA = 0;
					if(i == _this.faststc_param1 - 1) dDPrevEMA = dPerK;
					else dDPrevEMA = _originalData[i - 1].FastSTC_PERD;
					// %D
					var dPerD = subCalcEma(dPerK, dDPrevEMA, _this.faststc_param2);
					data.FastSTC_PERK = dPerK, data.FastSTC_PERD = dPerD;
				} else {}
			}
			
			_series.series1.yaxis = "FastSTC_PERK";
			_series.series2.yaxis = "FastSTC_PERD";
		};
		/*
		 * RSI
		 * param1 : 기간, param2 : Signal
		 */
		this.rsi_param1 = 10, this.rsi_param2 = 5;
		this.parseSubRSI = function( _originalData, _series, _value, _xAxisName ){
			var count = _originalData.length;
			// 상승폭 합계, 하락폭 합계
			var dUpSum = 0, dDownSum = 0;
			for(var i = 0; i < count; i++) {
				var data = _originalData[i];
				if(i >= _this.rsi_param1 && data.date != ' '){
					for(var j = i - _this.rsi_param1 + 1; j <= i; j++){
						var dPrevClose = _originalData[j - 1].close; // 전일종가
						var dClose = _originalData[j].close; // 당일종가
						
						if(dPrevClose <= dClose) dUpSum += dClose - dPrevClose; //상승폭
						else dDownSum += dPrevClose - dClose; // 하락폭
					}
					// RSI 데이터
					var dRSI = dUpSum / (dUpSum + dDownSum) * 100;
					
					var dPrevEMA = 0;
					if(i == _this.rsi_param1) dPrevEMA = dRSI;
					else dPrevEMA = _originalData[i - 1].RSI_SIGNAL;
					
					var dSignal = subCalcEma(dRSI, dPrevEMA, _this.rsi_param2);
					
					data.RSI = dRSI, data.RSI_SIGNAL = dSignal;
				} else {}
			}
			_series.series1.yaxis = "RSI";
			_series.series2.yaxis = "RSI_SIGNAL";
		};
		/*
		 * DMI
		 * param1 : 기간
		 */
		this.dmi_param1 = 14;
		var subDMI_nShortSMA1 = null, subDMI_nShortSMA2 = null, subDMI_nShortSMA3 = null;
		this.parseSubDMI = function( _originalData, _series, _value, _xAxisName ){
			var count = _originalData.length;
			// 전일고가, 당일고가, 전일저가, 당일저가, 전일종가, PDM, MDM
			var dPrevHigh = 0, dHigh = 0, dPrevLow = 0, dLow = 0, dPrevClose = 0, dPDM = 0, dMDM = 0;
			var data = null, prevData = null;
			for(var i = 0; i < count; i++) {
				data = _originalData[i];
				
				dHigh = data.high, dLow = data.low;
				if(i == 0) {
					dPrevHigh = 0, dPrevLow = 0, dPrevClose = 0;
				} else {
					prevData = _originalData[i - 1];
					dPrevHigh = prevData.high, dPrevLow = prevData.low, dPrevClose = prevData.close;
				}
				// PDM 계산
				if( dHigh-dPrevHigh>0 && dHigh-dPrevHigh > dPrevLow-dLow) dPDM = dHigh - dPrevHigh;
				else dPDM = 0;
				
				// MDM 계산
				if( dPrevLow-dLow>0 && dHigh-dPrevHigh < dPrevLow - dLow) dMDM = dPrevLow - dLow;
				else dMDM = 0;
				
				// TR 계산 
				var val1 = dPrevClose-dHigh<0 ? (dPrevClose-dHigh)*-1 : dPrevClose-dHigh;
				var val2 = dPrevClose-dLow<0 ? (dPrevClose-dLow)*-1 : dPrevClose-dLow;
				var dTR = Math.max(dHigh-dLow, val1, val2);
				
				// PDMn 계산 
				var dPDMn = subCalcEmaRSI(i, dPDM, _this.dmi_param1, 1);
				// MDMn 계산 
				var dMDMn = subCalcEmaRSI(i, dMDM, _this.dmi_param1, 2);
				// TRn 계산
				var dTRn = subCalcEmaRSI(i, dTR, _this.dmi_param1, 3);
				var dPDI = dPDMn/dTRn * 100, dMDI = dMDMn/dTRn * 100;
				
				data.DMI_PDI = dPDI, data.DMI_MDI = dMDI;
			}
			_series.series1.yaxis = "DMI_PDI";
			_series.series2.yaxis = "DMI_MDI";
		};
		
		var subCalcEmaRSI = function(index, ema, paramDay, gubun){
			if(index == 0) {
				subDMI_nShortSMA1 = new Array(paramDay);
				subDMI_nShortSMA2 = new Array(paramDay);
				subDMI_nShortSMA3 = new Array(paramDay);
			}
			
			var dShortSMA = 0;
			if(gubun == 1) subDMI_nShortSMA1[index % paramDay] = ema;
			else if(gubun == 2) subDMI_nShortSMA2[index % paramDay] = ema;
			else if(gubun == 3) subDMI_nShortSMA3[index % paramDay] = ema;
			
			if(index >= paramDay - 1) {
				for(var i = paramDay; i--;){
					if(gubun == 1) dShortSMA += subDMI_nShortSMA1[i];
					else if(gubun == 2) dShortSMA += subDMI_nShortSMA2[i];
					else if(gubun == 3) dShortSMA += subDMI_nShortSMA3[i];
				}
				dShortSMA = dShortSMA / paramDay;
				return dShortSMA;
			} else {
				return 0;
			}
		};
		
		/*
		 * ADX
		 * param1 : DMI기간, param2 : ADX기간, param3 : ADX이평
		 */
		this.adx_param1 = 14, this.adx_param2 = 14, this.adx_param3 = 9;
		var subADX_nShortSMA1 = null, subADX_nShortSMA2 = null, subADX_nShortSMA3 = null,
			subADX_nShortSMA4 = null, subADX_nShortSMA5 = null;
		this.parseSubADX = function( _originalData, _series, _value, _xAxisName ){
			var count = _originalData.length;
			// 전일고가, 당일고가, 전일저가, 당일저가, 전일종가, PDM, MDM
			var dPrevHigh = 0, dHigh = 0, dPrevLow = 0, dLow = 0, dPrevClose = 0, dPDM = 0, dMDM = 0;
			var data = null, prevData = null;
			for(var i = 0; i < count; i++) {
				data = _originalData[i];
				
				dHigh = data.high, dLow = data.low;
				if(i == 0) {
					dPrevHigh = 0, dPrevLow = 0, dPrevClose = 0;
				} else {
					prevData = _originalData[i - 1];
					dPrevHigh = prevData.high, dPrevLow = prevData.low, dPrevClose = prevData.close;
				}
				// PDM 계산
				if( dHigh - dPrevHigh > 0 && dHigh - dPrevHigh > dPrevLow-dLow) dPDM = dHigh - dPrevHigh;
				else dPDM = 0;
				
				// MDM 계산
				if( dPrevLow - dLow > 0 && dHigh - dPrevHigh < dPrevLow - dLow) dMDM = dPrevLow - dLow;
				else dMDM = 0;
				
				// TR 계산 
				var val1 = dPrevClose-dHigh < 0 ? (dPrevClose-dHigh) * -1 : dPrevClose - dHigh;
				var val2 = dPrevClose-dLow < 0 ? (dPrevClose-dLow) * -1 : dPrevClose - dLow;
				var dTR = Math.max(dHigh-dLow, val1, val2);
				
				// PDMn 계산 
				var dPDMn = subCalcEmaADX(i, dPDM, _this.adx_param1, 1);
				// MDMn 계산 
				var dMDMn = subCalcEmaADX(i, dMDM, _this.adx_param1, 2);
				// TRn 계산
				var dTRn = subCalcEmaADX(i, dTR, _this.adx_param1, 3);
				var dPDI = dPDMn / dTRn * 100, dMDI = dMDMn / dTRn * 100;
				
				var dDX = ((Math.abs(dPDI - dMDI))/(dPDI+dMDI)) *100;
				var dADX = subCalcEmaADX(i, dDX, _this.adx_param2, 4);
				var dADXn = subCalcEmaADX(i, dADX, _this.adx_param3, 5);
				
				data.ADX = dADX, data.ADX_MA = dADXn;
			}
			_series.series1.yaxis = "ADX";
			_series.series2.yaxis = "ADX_MA";
		};
		var subCalcEmaADX = function(index, ema, paramDay, gubun){
			if(index == 0) {
				subADX_nShortSMA1 = new Array(paramDay);
				subADX_nShortSMA2 = new Array(paramDay);
				subADX_nShortSMA3 = new Array(paramDay);
				subADX_nShortSMA4 = new Array(paramDay);
				subADX_nShortSMA5 = new Array(paramDay);
			}
			
			var dShortSMA = 0;
			if(gubun == 1) subADX_nShortSMA1[index % paramDay] = ema;
			else if(gubun == 2) subADX_nShortSMA2[index % paramDay] = ema;
			else if(gubun == 3) subADX_nShortSMA3[index % paramDay] = ema;
			else if(gubun == 4) subADX_nShortSMA4[index % paramDay] = ema;
			else if(gubun == 5) subADX_nShortSMA5[index % paramDay] = ema;
			
			if(index >= paramDay - 1) {
				for(var i = paramDay; i--;){
					if(gubun == 1) dShortSMA += subADX_nShortSMA1[i];
					else if(gubun == 2) dShortSMA += subADX_nShortSMA2[i];
					else if(gubun == 3) dShortSMA += subADX_nShortSMA3[i];
					else if(gubun == 4) dShortSMA += subADX_nShortSMA4[i];
					else if(gubun == 5) dShortSMA += subADX_nShortSMA5[i];
				}
				dShortSMA = dShortSMA / paramDay;
				return dShortSMA;
			} else { return 0; }
		};
		/*
		 * OBV
		 * 
		 */
		this.parseSubOBV = function( _originalData, _series, _value, _xAxisName ){
			var count = _originalData.length;
			// OBV, 전일종가, 당일종가, 당일 거래량, 전일OBV
			var dOBV = 0, dPrevClose = 0, dClose = 0, dVolume = 0, dPrevOBV = 0;
			var data = null, prevData = null;
			for(var i = 0; i < count; i++) {
				data = _originalData[i];
				
				if(i == 0) { dOBV = 0; }
				else {
					prevData = _originalData[i - 1];
					dPrevClose = prevData.close;
					dClose = data.close;
					dVolume = Number(data.VOLUME);
					dPrevOBV = prevData.OBV;
					
					if (dClose > dPrevClose) dOBV = dPrevOBV + dVolume;	// 당일 종가 > 전일 종가
					else if (dClose < dPrevClose) dOBV = dPrevOBV - dVolume; // 당일 종가 < 전일 종가
					else if (dClose == dPrevClose) dOBV = dPrevOBV;	// 당일 종가 = 전일 종가
				}
				if(data.date != ' ') { data.OBV = dOBV; }
			}
			_series.series1.yaxis = "OBV";
		};
		/*
		 * SONAR
		 * param1 : EMA기간, param2 : 기간, param3 : 이평
		 */
		this.sonar_param1 = 12, this.sonar_param2 = 26, this.sonar_param3 = 9;
		this.parseSubSONAR = function( _originalData, _series, _value, _xAxisName ){
			var count = _originalData.length;
			// 상승폭 합계, 하락폭 합계
			var nEMA = null;
			for(var i = 0; i < count; i++) {
				var data = _originalData[i];
				if(i == 0)	nEMA = new Array(count - _this.sonar_param2); // n일전 EMA 값 저장
				// 전일EMA, 당일종가
				var dPrevEMA = 0, dClose = data.close;
				if(i == 0) dPrevEMA = dClose;
				else dPrevEMA = nEMA[(i - 1) % _this.sonar_param2];
				
				// 당일EMA
				var dEMA = subCalcEma(dClose, dPrevEMA, _this.sonar_param1);
				
				if(i >= _this.sonar_param2 && data.date != ' '){
					// SONAR 계산
					var dSONAR = dEMA - nEMA[i % _this.sonar_param2], dPrevSONAR = 0;
					if(i == _this.sonar_param2) dPrevSONAR = dSONAR;
					else dPrevSONAR = _originalData[i - 1].SONAR_SIGNAL;
					// Signal 계산
					var dSignal = subCalcEma(dSONAR, dPrevSONAR, _this.sonar_param3);
					data.SONAR = dSONAR, data.SONAR_SIGNAL = dSignal;
					
					nEMA[i % _this.sonar_param2] = dEMA;
				} else { nEMA[i % _this.sonar_param2] = dEMA; }
			}
			_series.series1.yaxis = "SONAR";
			_series.series2.yaxis = "SONAR_SIGNAL";
		};
		/*
		 * CCI
		 * param1 : 기간
		 */
		this.cci_param1 = 9;
		this.parseSubCCI = function( _originalData, _series, _value, _xAxisName ){
			var count = _originalData.length;
			// 상승폭 합계, 하락폭 합계
			var m_pdSMA = null, m_pdYSMA = null;
			for(var i = 0; i < count; i++) {
				var data = _originalData[i];
				if(i == 0) {
					m_pdSMA = new Array(_this.cci_param1); // n일전 EMA 값 저장
					m_pdYSMA = new Array(_this.cci_param1); // n일전 EMA 값 저장
				}
				// X
				var dHigh = data.high, dLow = data.low, dClose = data.close;	// 고가, 저가, 종가 
				
				var dX = (dHigh + dLow + dClose)/3;  // 평균가격
				m_pdSMA[i % _this.cci_param1] = dX;
				// Y
				var dY = 0;
				if (i >= _this.cci_param1 - 1) {
					var dSumY = 0;
					for (var j = 0; j < _this.cci_param1; j++)
						dSumY += m_pdSMA[j];
					dY = dSumY / _this.cci_param1; // 이동평균가격
					var dPrevZ = dX - dY<0 ? (dX - dY)*-1 : dX - dY;
					m_pdYSMA[i % _this.cci_param1] = dPrevZ;
				}
				// Z
				var dZ = 0;
				if (i >= (_this.cci_param1 - 1) && data.date != ' ')	{
					var dSumZ = 0;
					for (var j = 0; j < _this.cci_param1; j++)
						dSumZ += m_pdYSMA[j];
			
					dZ = dSumZ / _this.cci_param1;
					var dCCI;
					if (dZ == 0) dCCI = 0;
					else dCCI = (dX - dY) / (dZ * 0.015);
					data.CCI = dCCI;
				}
			}
			_series.series1.yaxis = "CCI";
		};
		/*
		 * VR
		 * param1 : 기간
		 */
		this.vr_param1 = 20;
		this.parseSubVR = function( _originalData, _series, _value, _xAxisName ){
			var count = _originalData.length;
			// 상승폭 합계, 하락폭 합계
			for(var i = 0; i < count; i++) {
				var data = _originalData[i];
				if (i >= _this.vr_param1 - 1 && data.date != ' ')
				{
					var nUpVolume = 0; // 주가 상승일 거래량
					var nEqualVolume = 0; // 주가 보합일 거래량
					var nDownVolume = 0; // 주가 하락일 거래량
										
					for (var j = i; j >= i - (_this.vr_param1 - 1); j--)
					{
						var thisData = _originalData[j];
						//시가, 종가, 거래량
						var dOpen = thisData.open, dClose = thisData.close, dVolume = Number(thisData.VOLUME);
						if (dOpen < dClose) nUpVolume += dVolume;	//상승
						if (dOpen == dClose) nEqualVolume += dVolume; // 보합
						if (dOpen > dClose) nDownVolume += dVolume;// 하락
					}
					
					var dVR = (( nUpVolume + nEqualVolume * 0.5) / (nDownVolume + nEqualVolume * 0.5)) * 100;
					
					if((nDownVolume + nEqualVolume * 0.5) == 0)
						dVR = 0;
						
					data.VR = dVR;
				}
			}
			_series.series1.yaxis = "VR";
		};
		/*
		 * TRIX
		 * param1 : 단기이평, param2 : Signal
		 */
		this.trix_param1 = 5, this.trix_param2 = 3; 
		this.parseSubTRIX = function( _originalData, _series, _value, _xAxisName ){
			var count = _originalData.length;
			
			var arrDataSignal = new Array(_this.trixparam2);
			
			var param1 = _this.trix_param1 - 1;
			var param2 = param1 + (_this.trix_param1 - 1);
			var param3 = param2 + (_this.trix_param1 - 1);
			var param_trix = param3 + 1;
			var dSum = 0, nSum = 0;
			for(var i = 0; i < count; i++){
				var data = _originalData[i];
				if(data.xaxis == " ") continue;
				
				if(i < param_trix){
					if(i < param1) { data.TRIX_EMA1 = 0; } 
					else {
						dSum = 0, nSum = 0;
						for(var j = _this.trix_param1; j > 0; j--){
							nSum += j;
							dSum += Number(_originalData[i + j - _this.trix_param1].close) * j;
						}
						data.TRIX_EMA1 = dSum / nSum;
					}
					if(i < param2) { data.TRIX_EMA2 = 0; } 
					else {
						dSum = 0, nSum = 0;
						for(var j = _this.trix_param1; j > 0; j--){
							nSum += j;
							dSum += _originalData[i + j - _this.trix_param1].TRIX_EMA1 * j;
						}
						data.TRIX_EMA2 = dSum / nSum;
					}
					if(i < param3) { data.TRIX_EMA3 = 0; } 
					else {
						dSum = 0, nSum = 0;
						for(var j = _this.trix_param1; j > 0; j--){
							nSum += j;
							dSum += _originalData[i + j - _this.trix_param1].TRIX_EMA2 * j;
						}
						data.TRIX_EMA3 = dSum / nSum;
					}
					if(i < param_trix){ data.TRIX = 0; } 
					else { data.TRIX = (data.TRIX_EMA3 - _originalData[i - 1].TRIX_EMA3) / _originalData[i - 1].TRIX_EMA3 * 100; }
					data.TRIX_SIGNAL = null;
				} else {
					dSum = 0, nSum = 0;
					for(var j = _this.trix_param1; j > 0; j--){
						nSum += j;
						dSum += _originalData[i + j - _this.trix_param1].close * j;
					}
					data.TRIX_EMA1 = dSum / nSum;
					
					dSum = 0, nSum = 0;
					for(var j = _this.trix_param1; j > 0; j--){
						nSum += j;
						dSum += _originalData[i + j - _this.trix_param1].TRIX_EMA1 * j;
					}
					data.TRIX_EMA2 = dSum / nSum;
					
					dSum = 0, nSum = 0;
					for(var j = _this.trix_param1; j > 0; j--){
						nSum += j;
						dSum += _originalData[i + j - _this.trix_param1].TRIX_EMA2 * j;
					}
					data.TRIX_EMA3 = dSum / nSum;
					
					data.TRIX = (data.TRIX_EMA3 - _originalData[i - 1].TRIX_EMA3) / _originalData[i - 1].TRIX_EMA3 * 100;
					data.TRIX_SIGNAL = parseSMA(arrDataSignal, i, _this.trix_param2, data.TRIX);
				}
			}
			_series.series1.yaxis = "TRIX";
			_series.series2.yaxis = "TRIX_SIGNAL";
		};
		var parseSMA = function(_arr, _index, _param, _data) {
			_arr[_index % _param] = _data;
			var dClose = 0;
			if(_index >= _param - 1){
				for(var i = _param; i--;)
					dClose += _arr[i];
				dClose = dClose / _param;
				return dClose;
			} else { return null; }
		};
		/*
		 * PMAO
		 * param1 : 단기이평, param2 : 장기이평
		 */
		this.pmao_param1 = 5, this.pmao_param2 = 20; 
		this.parseSubPMAO = function( _originalData, _series, _value, _xAxisName ){
			var count = _originalData.length;
			
			var nShortSMA = new Array(_this.pmao_param1), nLongSMA = new Array(_this.pmao_param2);;
			var dClose = 0, dShortSMA = 0, dLongSMA = 0;
			for(var i = 0; i < count; i++) {
				var data = _originalData[i];
				dClose = data.close, dShortSMA = 0, dLongSMA = 0;
				nShortSMA[i % _this.pmao_param1] = dClose;
				nLongSMA[i % _this.pmao_param2] = dClose;
				
				if(i >= _this.pmao_param2 - 1 && data[_xAxisName] != ' '){ 
					for(var j = _this.pmao_param1; j--;){//단기이평
						dShortSMA += nShortSMA[j];
					}
					dShortSMA = dShortSMA / _this.pmao_param1;
					for(j = _this.pmao_param2; j--;){//장기이평
						dLongSMA += nLongSMA[j];
					}
					dLongSMA = dLongSMA / _this.pmao_param2;
					
					var dPMAO = (dShortSMA - dLongSMA) / dShortSMA * 100;
					data.PMAO = dPMAO;
				}
			}
			_series.series1.yaxis = "PMAO";
		};
		/*
		 * Psyhological
		 * param1 : 기간
		 */
		this.psyhological_param1 = 10; 
		this.parseSubPsyhological = function( _originalData, _series, _value, _xAxisName ){
			var count = _originalData.length;
			var nUpDay = 0, dPrevClose = 0, dClose = 0, dTuja = 0;
			for(var i = 0; i < count; i++) {
				var data = _originalData[i];
				if(i >= _this.psyhological_param1 && data.date != " "){
					nUpDay = 0; // 상승일수
					
					for(var j = i; j > i - _this.psyhological_param1; j--){
						dPrevClose = _originalData[j - 1].close; //전일종가
						dClose = _originalData[j].close; //당일종가
						
						if(dPrevClose < dClose) nUpDay++; // 전일 대비 상승일때
					}
					dTuja = nUpDay / _this.psyhological_param1 * 100;
					data.Psyhological = dTuja;
				}
			}
			_series.series1.yaxis = "Psyhological";
		};
		/*
		 * Williams
		 * param1 : 기간
		 */
		this.williams_param1 = 14, this.williams_param2 = 3; 
		this.parseSubWilliams = function( _originalData, _series, _value, _xAxisName ){
			var count = _originalData.length;
			var dHigh = 0, dLow = 0, dClose = 0, dMax = 0, dR = 0, dMin = 99999999999;
			for(var i = 0; i < count; i++) {
				var data = _originalData[i];
				dHigh = 0, dLow = 0, dClose = 0, dMax = 0, dR = 0, dMin = 99999999999;
				if(i >= _this.williams_param1 - 1 && data.date != " "){
					dClose = data.close;
					for(var j = i; j > i - _this.williams_param1; j--){
						dLow = _originalData[j].low, dHigh = _originalData[j].high;
						if(dMin > dLow) dMin = dLow;
						if(dMax < dHigh) dMax = dHigh;
					}
					if( dMax - dMin == 0) dR = 0;
					else dR = (dMax - dClose) / (dMax - dMin) * 100;
					
					var dDPrevEMA = 0;
					if(i == _this.williams_param1 - 1) dDPrevEMA = dR;
					else dDPrevEMA = _originalData[i - 1].WILLIAMS_PERD;
					
					var dPerD = subCalcEma(dR, dDPrevEMA, _this.williams_param2);
					data.WILLIAMS_PERR = dR;
					data.WILLIAMS_PERD = dPerD;
				}
			}
			_series.series1.yaxis = "WILLIAMS_PERR";
			_series.series2.yaxis = "WILLIAMS_PERD";
		};
		/*
		 * ROC
		 * param1 : 기간
		 */
		this.roc_param1 = 12; 
		this.parseSubROC = function( _originalData, _series, _value, _xAxisName ){
			var count = _originalData.length;
			var dClose = 0, dNPrevClose = 0, dRoc = 0;
			for(var i = 0; i < count; i++) {
				var data = _originalData[i];
				if(i >= _this.roc_param1 && data.date != " "){
					dClose = data.close; //당일종가
					dNPrevClose = _originalData[i - _this.roc_param1].close; // n일전 종가
					dRoc = (dClose - dNPrevClose) / dNPrevClose * 100;
					data.ROC = dRoc;
				}
			}
			_series.series1.yaxis = "ROC";
		};
		return _this;
	};
})(jQuery);