	ChartData = function (){
		var _this = this;
		this._data = [];
		this._dataTotal = 0;
		this.loadData = function(dataParam, callback) {
			var data = undefined;
			if(dataParam.data){
				_this._data = dataParam.data;
			}else{
				$.ajax({
					url:dataParam.url,
					async:false,
					success:function(data2){
						data = data2;
						var arr = [];
						if(dataParam.datatype == "json"){
							arr = eval("("+data2+")").json;
						} else {
							var lineArr = data.split('\n');
							var dataTitles = [];
							var titleCheck = true;
							for(var i = 0; i < lineArr.length; i ++) {
								if(lineArr.length <= 1) continue;
								
								var objArr = lineArr[i].split('|');
								if(lineArr[i].indexOf("companyname") > -1 || objArr.length <= 1){
									
								} else {
									if(titleCheck){
										for(var j = objArr.length; j--;){
											dataTitles.unshift(trim(objArr[j]));
										}
										titleCheck = false;
									} else {
										var obj = {};
										if(objArr.length <= 1) continue;
										$.each(objArr, function(j, item){
											obj[dataTitles[j]] = trim(item);
											if(dataTitles[j] == dataParam.use) _this._dataTotal += Number(item);
										});
										if(dataParam.datasort == "reverse"){
											arr.unshift(obj);
										} else {
											arr.push(obj);
										}
									}
									
								}
							}
						}
						_this._data = arr;
						callback(_this);
					}
				});
			}
			
			
			
		};
		this.realData = function(oriData, newData, callback, dataParam) {
			var dataTitles = [];
			var realData = true;
			for(var i = 0; i < newData.length; i++){
				if(newData[i] == "") continue;
				
				var arr = newData[i].split('|');
				if(arr.length > 1) {
					if(i == 0){
						for(var j = arr.length; j--;){
							dataTitles.unshift(trim(arr[j]));
						}
					} else {
						var rObj = new Object();
						for(var j = 0; j < arr.length; j++){
							rObj[dataTitles[j]] = trim(arr[j]);
						}
						oriData.push(rObj);
					}
				} else {
					realData = false;
				}
			}
			if(realData) {
				_this._data = oriData;
				if(_this._data.length > 300) {
					for(var i = 0; i < _this._data.length; i ++) {
						_this._data.shift();
						if(_this._data.length <= 300) break;
					}
				}
				callback(_this);
			}
		};
		this.realAllData = function(oriData, newData, callback, use) {
			var dataTitles = [];
			var oriDataObj;
			var i = 0, j = 0, arrLength = 0;
			var oriDataLength = oriData.length, newDataLength = newData.length;
			for(i = 0; i < newDataLength; i++){
				var arr = newData[i].split('|');
				
				
				if(i == 0){
					arrLength = arr.length;
					for(j = arrLength; j--;){
						dataTitles.unshift(arr[j]);
					}
				} else {
					var rObj = stringToObject(arr, dataTitles);

					for(j = 0; j < oriDataLength; j++){
						oriDataObj = oriData[j].data;
						var forChk = realExtendObject(oriDataObj, rObj, 'a');
						if(!forChk) { break; }
					};
					
				}
			}

			_this._data = $.each(oriData, function(i, item){
				item.data = $.makeArray(item.data).sort(function(a, b){
					return b[use] - a[use];
				});
			});
			
			dataTitles = null, oriDataObj = null;
			forChk = null, rObj = null, arr = null; 
			i = null, j = null, arrLength = null;
			oriDataLength = null, newDataLength = null;
			
			callback(_this);
		};
		
		var stringToObject = function(arr, dataTitles){
			var obj = {};
			try{
				for(var i = arr.length; i--;){
					obj[dataTitles[i]] = arr[i];
				}
				return obj;
			} finally {
				obj = null;
			}
		};
		var realExtendObjectItem = function(ori, nObj) {
			var obj = {};
			for(var i in ori){
				obj[i] = ori[i];
			}
			for(i in nObj){
				obj[i] = nObj[i];
			}
			try{
				return obj;
			} finally {
				obj = null, i = null;
			}
		};
		var realExtendObject = function(oriDataObj, rObj, type){
			for(var i = oriDataObj.length; i--;){
				var obj = oriDataObj[i];
				if(rObj.code === obj.code){
					if(type == 'c' && obj.flag == rObj.flag) return false;
					oriDataObj[i] = realExtendObjectItem(obj, rObj);
					
					i = null, obj = null;
					return false;
				}
			}
			return true;
		};
		this.realAllColorData = function(oriData, newData, callback, use) {
			var dataTitles = [];
			var oriDataObj;
			var i = 0, j = 0;
			var oriDataLength = oriData.length, newDataLength = newData.length;
			for(i = 0; i < newDataLength; i++){
				var arr = newData[i].split('|');
				if(i == 0){
					for(j = arr.length; j--;){
						dataTitles.unshift(arr[j]);
					}
				} else {
					var rObj = stringToObject(arr, dataTitles);
					for(j = 0; j < oriDataLength; j++){
						oriDataObj = oriData[j].data;
						var forChk = realExtendObject(oriDataObj, rObj, 'c');
						if(!forChk) { break; }
					};
				}
			}
						
			_this._data = oriData;
			dataTitles = null, oriDataObj = null;
			forChk = null, rObj = null, arr = null; 
			i = null, j = null;
			oriDataLength = null, newDataLength = null;
			
			callback(_this);
		};
		
		var trim = function (str){
			str = str.replace(/(^\s*)|(\s*$)/gi, "");
			return str;
		};
		this.timeformat = function(str) {
			var length = str.length - 6;
			var data = str.substr(length, 2);
			data += ":";
			data += str.substr(length + 2, 2);
			data += ":";
			data += str.substr(length + 4, 2);
			
			return data;
		};
		this.dateformat = function(str) {
			var length = str.length;
			var data = str.substr(0, 4);
			data += ".";
			data += str.substr(4, 2);
			if(length > 6) {
				data += ".";
				data += str.substr(6, 2);
			}
			
			return data;
		};
		return _this;
	};