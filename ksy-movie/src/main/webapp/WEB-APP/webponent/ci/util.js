(function(ci) {

	var self = {};

	function isJQueryObj(obj) {
		if (window.jQuery && obj instanceof jQuery) {
			return true;
		} else {
			return false;
		}
	}

	function getByte(sChar) {
		var c = 0;
		var u = escape(sChar);
		if (u.length < 4) { // 반각문자 : 기본적인 영문, 숫자, 특수기호
			c++; // + 1byte
		} else {
			var s = parseInt(sChar.charCodeAt(0));
			if (((s >= 65377) && (s <= 65500)) || ((s >= 65512) && (s <= 65518))) // 반각문자
				// 유니코드
				// 10진수
				// 범위 :
				// 한국어,
				// 일본어,
				// 특수문자
				c++; // + 1byte
			else
				// 전각문자 : 위 조건을 제외한 모든 문자
				c += 2; // + 2byte
		}
		return c;
	}
	/**
	 * @public
	 * @description string의 byte를 반환
	 * @param 문자열
	 * @returns byte수
	 */
	self.getBytes = function(sString) {
		var c = 0;
		for (var i = 0; i < sString.length; i++) {
			c += parseInt(getByte(sString.charAt(i)));
		}
		return c;
	};

	/**
	 * @public
	 * @description 해당 dom객체의 값이 maxByte넘어가면 자른다
	 * @param input객체
	 * @param 최대 바이트수
	 */
	self.cutOverText = function(obj, maxByte) {

		if (isJQueryObj(obj)) {
			obj = obj[0];
		}

		var sString = obj.value;
		var c = 0;
		for (var i = 0; i < sString.length; i++) {
			c += parseInt(getByte(sString.charAt(i)));
			if (c > maxByte) {
				obj.value = sString.substring(0, i);
				break;
			}
		}
	};

	/**
	 * @public
	 * @description url 문자를 escape처리
	 * @param url string
	 * @returns 변환된 url
	 */
	self.escape_url = function(url) {
		var i;
		var ch;
		var out = '';
		var url_string = '';

		url_string = String(url);

		for (i = 0; i < url_string.length; i++) {
			ch = url_string.charAt(i);
			if (ch == ' ')
				out += '%20';
			else if (ch == '%')
				out += '%25';
			else if (ch == '&')
				out += '%26';
			else if (ch == '+')
				out += '%2B';
			else if (ch == '=')
				out += '%3D';
			else if (ch == '?')
				out += '%3F';
			else
				out += ch;
		}
		return out;
	};
	/**
	 * @public
	 * @description 10미만의 숫자의 앞에0을 붙여 반환
	 * @param 숫자
	 * @returns 두자리로 변환된 숫자
	 */
	self.setTwoDigits = function(param) {
		param = param + '';
		if (param.length == 1) {
			return '0' + param;
		} else {
			return param;
		}
	};

	/**
	 * @public
	 * @description 쿠키를 저장
	 * @param 쿠키
	 *            name
	 * @param 쿠키
	 *            value
	 * @param 쿠기
	 *            유지기간(일)
	 */

	self.setCookie = function(name, value, expiredays) {
		var todayDate = new Date();
		if (expiredays === undefined || expiredays == null) {
			expiredays = 7;
		}
		todayDate.setDate(todayDate.getDate() + expiredays);
		document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";";
	};
	/**
	 * @public
	 * @description 해당 name에 해당하는 쿠키값을 반환
	 * @param 쿠키
	 *            name
	 * @returns 쿠키 value
	 */

	self.getCookie = function(name) {
		var nameOfCookie = name + "=";
		var x = 0;
		while (x <= document.cookie.length) {
			var y = (x + nameOfCookie.length);
			if (document.cookie.substring(x, y) == nameOfCookie) {
				if ((endOfCookie = document.cookie.indexOf(";", y)) == -1)
					endOfCookie = document.cookie.length;
				return unescape(document.cookie.substring(y, endOfCookie));
			}
			x = document.cookie.indexOf(" ", x) + 1;
			if (x == 0)
				break;
		}
		return "";
	};

	/**
	 * @public
	 * @description 숫자에 콤마를 추가
	 * @param 숫자
	 * @returns 콤마가 추가된 숫자
	 */

	self.addCommas = function(num) {

		var minus = false;

		if (num === undefined) {
			num = '';
		}

		num = (num + '');

		if (num.charAt(0) == '-') {
			minus = true;
		}

		num = num.replace(/[^0-9]/g, "");// 숫자만 남겨놓고 모두 제거

		if (num.length < 4) {
			if (minus === true) {
				return '-' + num;
			} else {
				return num;
			}

		}

		var ret = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		if (minus === true) {
			ret = '-' + ret;
		}

		return ret;
	};

	/**
	 * @public
	 * @description 값이 존재하는지 여부 판단
	 * @param 값
	 * @returns true | false
	 */

	self.isNull = function(arg) {
		return arg === undefined || arg === null || arg === '';
	};
	/**
	 * @public
	 * @description 콤마를 제거
	 * @param 숫자
	 * @returns 콤마가된 숫자
	 */
	self.removeCommas = function(num) {
		num = (num === undefined || num === null) ? '' : num;
		return (num + '').replace(/,/g, '');
	};

	/**
	 * @public
	 * @description 현재날짜를 반환
	 * @param 구분자
	 * @returns 구분자가 포함된 현재날짜
	 */
	self.getTodayString = function(deli) {
		deli = deli === undefined ? '/' : deli;
		var curr = new Date();
		return curr.getFullYear() + deli + ci.util.setTwoDigits(parseInt(curr.getMonth()) + 1) + deli + ci.util.setTwoDigits(curr.getDate());
	};
	/**
	 * @public
	 * @description Date객체를 문자형식으로 날짜를 반환
	 * @param Date객체
	 * @param 구분자
	 * @returns 구분자가 포함된 날짜
	 */
	self.getDateString = function(date, deli) {
		deli = deli === undefined ? '' : deli;
		return date.getFullYear() + deli + ci.util.setTwoDigits(parseInt(date.getMonth()) + 1) + deli + ci.util.setTwoDigits(date.getDate());
	};

	/**
	 * @public
	 * @description 현재요일을 반환
	 * @returns 현재요일
	 */
	self.getDayofWeek = function() {
		var date = new Date();
		var week = new Array('일', '월', '화', '수', '목', '금', '토');

		return week[date.getDay()];
	};
	/**
	 * @public
	 * @description 현재시간을 반환
	 * @param 구분자
	 * @returns 구분자가 포함된 현재시간
	 */

	self.getTimeString = function(deli) {
		deli = deli === undefined ? ':' : deli;
		var curr = new Date();

		return ci.util.setTwoDigits(curr.getHours()) + deli + ci.util.setTwoDigits(curr.getMinutes()) + deli + ci.util.setTwoDigits(curr.getSeconds());
	};

	self.removeDelimiter = function(arg) {
		arg = (arg === undefined || arg === null) ? '' : arg;
		return (arg + '').replace(/[,\/\.-]/g, '');
	};
	/**
	 * @public
	 * @description yyyyMMdd 형식의 날짜포멧인지 판단
	 * @param 날짜문자열
	 * @returns true | false
	 */
	self.isValidDate = function(date) {
		date = self.removeDelimiter(date);
		var dateReg = /^(\d{4})(\d{2})(\d{2})$/;
		return dateReg.test(date);
	};
	/**
	 * @public
	 * @description 두개의 text input을 첫번째 인자의 값만큼 차이가 나도록하여 값을 세팅
	 * @param 기간
	 *            flag [ N,W,1M,3M,6M.. ]
	 * @param from
	 *            값을 지닐 input의 id or input객체
	 * @param to
	 *            값을 지닐 input의 id or input객체
	 */
	self.setDateLimit = function(flag, frObjId, toObjId) {
		var to = new Date();
		var from = new Date();

		var toObj = null, fromObj = null;

		if (typeof toObjId === 'string') {
			toObj = document.getElementById(toObjId);
		} else {
			toObj = toObjId;
		}

		if (typeof frObjId === 'string') {
			fromObj = document.getElementById(frObjId);
		} else {
			fromObj = frObjId;
		}

		var toDateStr = self.removeDelimiter(toObj.value);

		if (toDateStr.length == 8) {
			to.setFullYear(toDateStr.substring(0, 4));
			to.setMonth(toDateStr.substring(4, 6) - 1);
			to.setDate(toDateStr.substring(6));

			from.setFullYear(toDateStr.substring(0, 4));
			from.setMonth(toDateStr.substring(4, 6) - 1);
			from.setDate(toDateStr.substring(6));
		}

		var addValue = '';

		if (flag == 'N') {
			addValue = '0';
		} else if (flag == 'W') {
			addValue = '-7';
		} else if (flag == '1M') {
			addValue = '-1';
		} else if (flag == '2M') {
			addValue = '-2';
		} else if (flag == '3M') {
			addValue = '-3';
		} else if (flag == '6M') {
			addValue = '-6';
		} else if (flag == '1Y') {
			addValue = '-12';
		} else if (flag == '2Y') {
			addValue = '-24';
		} else if (flag == '3Y') {
			addValue = '-36';
		} else if (flag == '10D') {
			addValue = '-10';
		} else if (flag == '1D') {
			addValue = '-1';
		} else if (flag == '3D') {
			addValue = '-3';
		}

		if (flag == 'N' || flag == 'W' || flag.indexOf('D') > -1) {
			from.setDate(to.getDate() + parseInt(addValue));
		} else {
			from.setMonth(to.getMonth() + parseInt(addValue));
		}

		var t_year = to.getFullYear();
		var t_month = to.getMonth() + 1;
		t_month = self.setTwoDigits(t_month);
		var t_day = self.setTwoDigits(to.getDate());

		var f_year = from.getFullYear();
		var f_month = from.getMonth() + 1;
		f_month = self.setTwoDigits(f_month);
		var f_day = self.setTwoDigits(from.getDate());

		fromObj.value = (f_year + "/" + f_month + "/" + f_day);
		toObj.value = (t_year + "/" + t_month + "/" + t_day);

	};
	/**
	 * @public
	 * @description byte길이 체크하여 최대길이가 넘가면 경고창띄우고 최대길이만큼 자른다
	 * @param value를
	 *            가진 dom객체
	 * @param 최대
	 *            byte길이
	 */
	self.checkByte = function(obj, maxByte) {

		if (isJQueryObj(obj)) {
			obj = obj[0];
		}

		var sString = obj.value;
		if (self.getBytes(sString) > maxByte) {
			alert("최대 " + maxByte + "Bytes(한글 " + (maxByte / 2) + "자/영문 " + maxByte + "자)까지만 입력하실 수 있습니다.");
			self.cutOverText(obj, maxByte);
		}
	};

	/**
	 * @public
	 * @description 폼의 input요소들을 json타입으로 변환
	 * @param form
	 *            jquert객체
	 * @returns JSON object
	 */
	self.serializeObject = function($f) {
		var o = {};
		var a = $f.serializeArray();
		$.each(a, function() {
			if (o[this.name]) {
				if (!o[this.name].push) {
					o[this.name] = [ o[this.name] ];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};
	/**
	 * @public
	 * @description 날짜 포멧형태로 변환
	 * @param date
	 *            문자
	 * @param 구분자
	 * @returns 구분가가 포함되어 포맷된 날짜
	 */

	self.formatDate = function(date, delim) {
		date = self.removeDelimiter(date);
		delim = delim === undefined ? '.' : delim;

		var m1 = date.match(/^(\d{4})(\d{2})(\d{2})$/);
		var m2 = date.match(/^(\d{4})(\d{2})$/);

		var m = m1 || m2;

		var ret = '';
		for (var i = 1, max = m.length; i < max; i++) {
			ret += (delim + m[i]);
		}

		ret = ret.substring(1);

		return (m) ? ret : date;
	};

	/**
	 * @public
	 * @description json형태의 문자열에서 escape문자를 제거
	 * @param 문자
	 * @returns escape를 제거한 문자
	 */
	self.removeJsonEscapeChar = function(arg) {
		return arg.replace(/(\r\n|\n|\r|\t|\f|\b|)/g, "");
	};
	/**
	 * @public
	 * @description 함수 여부를 판단
	 * @param object
	 * @returns true | false
	 */
	self.isFunction = function(obj) {
		return typeof obj === 'function';
	};
	/**
	 * @public
	 * @description table데이터를 excel문서로 변환
	 * @param table
	 *            객체
	 * @param worksheet
	 *            이름
	 */
	self.tableToExcel = (function() {
		var uri = 'data:application/vnd.ms-excel;base64,', template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>', base64 = function(s) {
			return window.btoa(unescape(encodeURIComponent(s)));
		}, format = function(s, c) {
			return s.replace(/{(\w+)}/g, function(m, p) {
				return c[p];
			});
		};
		return function(table, name) {
			if (!table.nodeType)
				table = document.getElementById(table);
			var ctx = {
				worksheet : name || 'Worksheet',
				table : table.innerHTML
			};
			window.location.href = uri + base64(format(template, ctx));
		};
	})();

	/**
	 * @public
	 * @description 폼에서 e2e 필드를 다른 폼으로 이동하거나 복사한다.
	 * @param object
	 * 
	 */
	self.e2eFieldProccess = function(arg) {
		var $fromFrm = $(arg.fromFrm); // 복사할 필드가 있는 폼
		var $toFrm = $(arg.toFrm); // 복사되어질 폼
		var isCopy = arg.isCopy; // 엘리먼트 복사 여부 : true라면 객체 복사
		var elements = $('input[data-e2e]', $fromFrm).not('[data-append=false]');

		if (isCopy === true) {
			$toFrm.find('input.add-e2e-field').remove();
		}

		elements.each(function() {
			if (isCopy === true) {
				$toFrm.prepend($(this).clone().addClass('none add-e2e-field').attr('id', ''));
			} else {
				$(this).addClass('none add-e2e-field').prependTo($toFrm);
			}
		});
	};

	/***************************************************************************
	 * 유효성체크 field - 유효성체크할 객체명 patten - 패턴변수(regNum, regPhone, regMail....)
	 * name - 경고메세지 앞 타이틀 obj - 포커싱할 오브젝트(필드)
	 **************************************************************************/
	self.chkPatten = function(field, patten, name, obj) {
		var regExp = null;

		if (patten == 'regNum') {
			regExp = /^[0-9]+$/;
		} else if (patten == 'regPhone') {
			regExp = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/;
		} else if (patten == 'regIdNum') {
			regExp = /\d{6}[1234]\d{6}$/;
		} else if (patten == 'regMail') {
			regExp = /^[_a-zA-Z0-9-\.]+@[._a-zA-Z0-9-]+\.[a-zA-Z]+$/;
		} else if (patten == 'regDate') {
			regExp = /^[0-9]{4}.[0-1]{1}[0-9]{1}.[0-3]{1}[0-9]{1}$/;
		} else if (patten == 'regAlpha') {
			regExp = /^[a-zA-Z]+$/;
		} else if (patten == 'regKor') {
			regExp = /^[ㄱ-ㅎㅏ-ㅣ가-힇]+$/;
		}

		if (typeof field == "string") {
			if (!regExp.test(field)) {
				if ($.trim(name) != "") {
					alert(name + " 형식이 올바르지 않습니다.");
					if (obj != undefined) {
						obj.focus();
					}
				}
				return false;
			}
		}
		return true;
	};

	self.num2won = function(val) {
		var num = "";
		var won = new Array;

		re = /[^0-9]+/g;
		num = val.toString();
		if (!val) {
			return "";
		}
		if (re.exec(num)) {
			return "";
		}
		if (num.substr(0, 1) == 0) {
			return "";
		}

		var price_unit0 = new Array("", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구");
		var price_unit1 = new Array("", "십", "백", "천");
		var price_unit2 = new Array("만", "억", "조", "경", "해");
		for (var i = 0; i <= num.length - 1; i++) {
			won[i] = price_unit0[num.substr(i, 1)];
		}
		won = won.reverse();
		for (var i = 0; i <= num.length - 1; i++) {
			if (i > 0 && won[i] != "") {
				won[i] += price_unit1[i % 4];
			}
		}
		for (var i = 4; i <= won.length - 1; i = i + 4) {
			won[i] += price_unit2[(i / 4 - 1)];
		}
		for (var i = 0; i <= num.length - 1; i++) {
			if (i % 4 > 0) {
				won[i] = won[i].replace("일", "");
			}
		}
		won = won.reverse();
		var rtn = won.join("");
		rtn = rtn.replace("억만", "억");
		return rtn;
	};

	/**
	 * 날짜 차이계산
	 * 
	 * @param pStartDate -
	 *            시작일
	 * @param pEndDate -
	 *            종료일
	 * @param pType -
	 *            'D':일수, 'M':개월수
	 * @returns strGapDt - 차이 계산
	 */
	self.getDiffDays = function(pStartDate, pEndDate, pType) {
		pStartDate = self.removeDelimiter(pStartDate);
		pEndDate = self.removeDelimiter(pEndDate);

		var strSDT = new Date(pStartDate.substring(0, 4), pStartDate.substring(4, 6) - 1, pStartDate.substring(6, 8));
		var strEDT = new Date(pEndDate.substring(0, 4), pEndDate.substring(4, 6) - 1, pEndDate.substring(6, 8));
		var strGapDT = 0;

		if (pType == 'D') { // 일수 차이
			strGapDT = (strEDT.getTime() - strSDT.getTime()) / (1000 * 60 * 60 * 24);
		} else { // 개월수 차이
			// 년도가 같으면 단순히 월을 마이너스 한다.
			if (pEndDate.substring(0, 4) == pStartDate.substring(0, 4)) {
				strGapDT = pEndDate.substring(4, 6) * 1 - pStartDate.substring(4, 6) * 1;
			} else {
				strGapDT = ((strEDT.getTime() - strSDT.getTime()) / (1000 * 60 * 60 * 24 * 365.25 / 12)).toFixed(2);
			}
		}
		return parseInt(strGapDT, 10);
	};

	/**
	 * REGIST
	 */
	if (!ci) {
		window.ci = ci = {};
	}
	ci.util = self;

	window.ll = function() {
		if (console !== undefined && console.log !== undefined && console.log.apply != undefined) {
			console.log.apply(console, arguments);
		}
	};

})(window.ci);