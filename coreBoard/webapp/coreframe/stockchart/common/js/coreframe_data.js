/*  anyFrame JavaScript Data, version 1.0.0
 *  (c) 2007 CyberImagination <http://www.cyber-i.com>
 *
/*--------------------------------------------------------------------------*/

/**
 * anyFRAME 의 DataSet 과 유사
 * 
 * 
 * @constructor
 * @author 강상미, 수정:김성권
 */
function DataSet() {

	var mapObj = new Object();
	var keyArray = new Array();

	function put(key, value, seq) {
		if (!mapObj[key]) {
			mapObj[key] = new Array();
			keyArray[keyArray.length] = key;

		}
		if (!seq) {
			seq = 0;
		}

		mapObj[key][seq] = value;
	}

	function get(key, seq) {
		if (!mapObj[key])
			return '';
		if (!seq) {
			seq = 0;
		}

		var val = mapObj[key][seq];
		if (!val)
			return '';

		return val;

	}

	function getCount(key) {
		if (!mapObj[key])
			return 0;

		var array = mapObj[key];
		if (!array)
			return 0;

		return array.length;
	}

	function getDataSetCount() {
		return mapObj[keyArray[keyArray.length - 1]].length;
	}

	function getParam() {
		var str = '';
		var j = 0;
		for ( var i = 0; i < keyArray.length; i++) {
			var key = keyArray[i];
			var valArr = mapObj[key];
			var valCount = valArr.length;
			for ( var j = 0; j < valCount; j++) {

				if (str.length > 0)
					str += '&';
				str += key + '=' + valArr[j];

			}
		}
		// alert(str);
		return str;
	}

	function initDataSet() {
		mapObj = new Object();
	}

	this.put = put;
	this.get = get;
	this.getCount = getCount;
	this.getParam = getParam;
	this.getDataSetCount = getDataSetCount;
}