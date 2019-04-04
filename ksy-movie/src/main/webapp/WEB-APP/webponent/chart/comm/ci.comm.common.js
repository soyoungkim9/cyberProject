		String.prototype.format = function() {
			if(this==0) return 0;
			 
		    var reg = /(^[+-]?\d+)(\d{3})/;
		    var n = (this + '');
		 
		    while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');
		 
		    return n;
		};
		
		String.prototype.replaceAll = function (str1, str2) {
			var str = this;
			var result = str.replace(eval("/"+str1+"/gi"), str2);
			return result;
		};
		
		/*
		 * Object Length Count
		 */
		String.prototype.getObjectLength = function () {
			var length = 0;
			for(var prop in this) length ++;
			return length;
		};
		
		roundNumber = function ( n, digits ) {
			if (digits >= 0) return parseFloat(n.toFixed(digits)); // �뚯닔遺�諛섏삱由�

			  digits = Math.pow(10, digits); // �뺤닔遺�諛섏삱由�
			  var t = Math.round(n * digits) / digits;

			  return parseFloat(t.toFixed(0));
		};
		
		//TIME Format (TT:MM:SS)
		String.prototype.timeFormat = function(){
			var length = this.length - 6;
			var data = this.substr(length, 2);
			data += ":";
			data += this.substr(length + 2, 2);
			data += ":";
			data += this.substr(length + 4, 2);
			return data;
		};
		//TIME Format (TT:MM)
		String.prototype.timeFormat4 = function(){
			var length = this.length;
			var data = this.substr(length - 4, 2);
			data += ":";
			data += this.substr(length - 2, 2);
			return data;
		};
		// DAY|MONTH Format (0000/00/00 | 0000/00 | 00/00)
		String.prototype.dateFormat = function( ){
			var length = this.length;
			var data = this;
			if(length > 6) {
				data = this.substr(0, 4);
				data += ".";
				data += this.substr(4, 2);
				data += ".";
				data += this.substr(6, 2);
			} else if (length > 4) {
				data = this.substr(0, 4);
				data += ".";
				data += this.substr(4, 2);
			} else {
				data = this.substr(0, 2);
				data += ".";
				data += this.substr(2, 2);
			}
			
			return data;
		};
		// DAY|MONTH Format (YY/MM/DD)
		String.prototype.dateFormatYMD6 = function( ){
			var data = this;
				data = this.substr(2, 2);
				data += "/";
				data += this.substr(4, 2);
				data += "/";
				data += this.substr(6, 2);
			
			return data;
		};
		
		//TIME Format (TT:MM:SS)
		timeDataFormat = function( str ){
			str = str.toString();
			var length = str.length - 6;
			var data = str.substr(length, 2);
			data += ":";
			data += str.substr(length + 2, 2);
			data += ":";
			data += str.substr(length + 4, 2);
			return data;
		};
		//TIME Format (TT:MM)
		timeDataFormat4 = function( str ){
			str = str.toString();
			var length = str.length;
			var data = str.substr(length - 4, 2);
			data += ":";
			data += str.substr(length - 2, 2);
			return data;
		};
		// DAY|MONTH Format (0000/00/00 | 0000/00)
		dayDataFormat = function( str ){
			var length = str.length;
			var data = str = str.toString();
			if(length > 6) {
				data = str.substr(0, 4);
				data += "/";
				data += str.substr(4, 2);
				data += "/";
				data += str.substr(6, 2);
			} else if (length > 4) {
				data = str.substr(0, 4);
				data += "/";
				data += str.substr(4, 2);
			} else {
				data = str.substr(0, 2);
				data += "/";
				data += str.substr(2, 2);
			}
			
			return data;
		};
		// DAY|MONTH Format (MM/DD)
		dayDataFormat4 = function( str ){
			var length = str.length;
			var data = str = str.toString();
				data = str.substr(length - 4, 2);
				data += "/";
				data += str.substr(length - 2, 2);
			
			return data;
		};
		// DAY|MONTH Format (YYYY/MM)
		dayDataFormatYM6 = function( str ){
			var data = str = str.toString();
				data = str.substr(0, 4);
				data += "/";
				data += str.substr(4, 2);
			
			return data;
		};
		// Number Format 1,000
		priceDataFormat = function(txt) {
			if(txt==0) return 0;
			 
		    var reg = /(^[+-]?\d+)(\d{3})/;
		    var n = (txt + '');
		 
		    while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');
		 
		    return n;
		};
		// Number Format 1,000%
		percentDataFormat = function(txt) {
			if(txt==0) return 0;
			
			var reg = /(^[+-]?\d+)(\d{3})/;
			var n = (txt + '');
			
			while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');
			
			return n + "%";
		};