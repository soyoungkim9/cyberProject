(function(ci) {

	var self = {};

	/**
	 * PRIVATE
	 */

	function isJQueryObj(obj) {
		if (window.jQuery && obj instanceof jQuery) {
			return true;
		} else {
			return false;
		}
	}

	function isString(obj) {
		return typeof obj === 'string';
	}

	function isElement(obj) {
		try {
			// Using W3 DOM2 (works for FF, Opera and Chrom)
			return obj instanceof HTMLElement;
		} catch (e) {
			// Browsers not supporting W3 DOM2 don't have HTMLElement and
			// an exception is thrown and we end up here. Testing some
			// properties that all elements have. (works on IE7)
			return (typeof obj === "object") && (obj.nodeType === 1) && (typeof obj.style === "object") && (typeof obj.ownerDocument === "object");
		}
	}

	/**
	 * @public
	 * @description checkbox radio의 체크여부를 반환
	 * @param dom객체
	 *            or 문자 or jquery객체
	 * @return 체크여부
	 */

	self.isChecked = function(obj) {

		if (isString(obj)) {
			return document.getElementById(obj).checked;
		}

		if (isJQueryObj(obj)) {
			return obj.is(':checked');
		}

		if (isElement(obj)) {
			return obj.checked;
		}

	};
	/**
	 * @public
	 * @description checkbox나 radio의 체크여부를 설정
	 * @param dom객체
	 *            or 문자 or jquery객체
	 * @param true |
	 *            false
	 */

	self.setChecked = function(obj, bool) {

		if (isString(obj)) {
			document.getElementById(obj).checked = bool;
		}

		if (isJQueryObj(obj)) {
			obj.prop('checked', bool);
		}

		if (isElement(obj)) {
			obj.checked = bool;
		}
	};

	/**
	 * @public
	 * @description 선택된 option의 index를 반환
	 * @param obj
	 * @returns 선택된 option의 index, 없으면 -1
	 */
	self.getSelectedIndex = function(obj) {

		if (isJQueryObj(obj)) {
			return obj.find('option').index(obj.find(':selected'));
		}

		return -1;
	};

	/**
	 * @public
	 * @description 선택된 option의 text를 반환
	 * @param dom객체
	 *            or jquery객체
	 * @returns 선택된 option의 text
	 */
	self.getSelectedText = function(obj) {

		if (isJQueryObj(obj)) {
			return obj.find('option:selected').text();
		} else {
			return obj.options[obj.selectedIndex].text;
		}
	};

	/**
	 * 주어진 value 값에 해당하는 option선택
	 * 
	 * @param obj
	 * @param val
	 *            option의 value 또는 text
	 * @param type
	 *            type이 undefined이거나 'value'이면 value기준 'text'이면 text기준
	 * @returns
	 */
	self.setSelectBox = function(selectBox, val, type) {
		var options = selectBox.options;
		if (type == "text") {
			for (var i = 0, ic = options.length; i < ic; i++) {
				if (options[i].text == val) {
					selectBox.selectedIndex = i;
				}
			}
		} else {
			for (var i = 0, ic = options.length; i < ic; i++) {
				if (options[i].value == val) {
					selectBox.selectedIndex = i;
				}
			}
		}
	};
	/**
	 * @public
	 * @description select의 index번째의 option을 선택
	 * @param select
	 *            jquery객체
	 * @param 선택될
	 *            index
	 */

	self.setSelectedIndex = function(obj, idx) {

		if (!idx) {
			idx = 0;
		}

		if (isJQueryObj(obj)) {
			obj.find('option').eq(idx).prop('selected', true);
		}

	};

	/**
	 * 선택된 option의 label과 attribute들을 자바스크립객체로 반환
	 * 
	 * @param selectObj
	 * @returns {object}
	 */
	self.getSelectedObj = function(selectObj) {

		if (isJQueryObj(selectObj)) {
			var selectedItem = selectObj.find(':selected');
			var ret = {
				'label' : selectedItem.text()
			};

			selectedItem = selectedItem[0];
			for (var attr, i = 0, attrs = selectedItem.attributes, l = attrs.length; i < l; i++) {
				attr = attrs.item(i);
				ret[attr.nodeName] = attr.nodeValue;
			}

			return ret;
		}

	};

	/**
	 * @param opsDataArr -
	 *            option의 속성에 들어갈 데이터 Object를 담고있는 배열
	 * 
	 * ({'label' : '레이블', 'value' : 'true', 'attr_1' : 'a', 'attr_2' : 'b' });
	 * 
	 * label은 화면에 보여질 값이며 나머지는 attribute로 들어간다.
	 * 
	 * @param selectObj -
	 *            select 노드
	 */

	self.setSelectOptions = function(opsDataArr, selectObj) {

		var opsHTML = "";
		for (var i = 0; i < opsDataArr.length; i++) {
			var obj = opsDataArr[i];
			var label = "";
			opsHTML += "<option ";
			for ( var prop in obj) {
				if (prop == 'label') {
					label = obj[prop];
				} else {
					opsHTML += (prop + "='");
					opsHTML += (obj[prop] + "' ");
				}
			}

			opsHTML += ">";
			opsHTML += label;
			opsHTML += "</option>";
		}

		if (isJQueryObj(selectObj)) {
			selectObj.html(opsHTML);
		} else if (isString(selectObj)) {
			selectObj = document.getElementById(selectObj);
			selectObj.innerHTML = opsHTML;
		} else if (isElement(selectObj)) {
			selectObj.innerHTML = opsHTML;
		}
	};
	/**
	 * @public
	 * @description dom 객체에 keydown, keyup이벤트를 바인딩하여 숫자만 입력가능하도록 하며 두번째
	 *              parameter에 format, callback등 속성을 넘겨서 사용가능
	 * @param input
	 *            jquery객체
	 * @param 옵션
	 */

	self.setOnlyNumber = function(obj, option) {

		option = option || {};

		var format = option['format'];
		var callback = option['callback'];
		// var toFixed = option['toFixed'] || 1;

		obj.on('keydown', function(e) {
			var code = e.keyCode;

			var onlyNum = (code > 34 && code < 41) || (code > 47 && code < 58) || (code > 95 && code < 106) || code == 8 || code == 9 || code == 13 || code == 46 || code == 110 || code == 56 || code == 190;

			if (!onlyNum) {
				e.preventDefault();
			}

		}).on('keyup', function(e) {
			var value = ci.util.removeCommas(this.value);
			value = Number(value);

			if (!isNaN(option['max'])) {
				var m = Number(option['max']);

				if (value > m) {
					alert(option['max'] + ' 까지 정수만 입력가능합니다.');
					this.value = '';
					return;
				}

			}

			if (isNaN(Number(value))) {
				this.value = '';
			} else {
				if (format === true) {
					this.value = ci.util.addCommas(value);
				}
			}

			if (callback) {
				callback.apply(this, [ value ]);
			}

		}).attr('onpaste', 'javascript:return false;');
	};
	/**
	 * @public
	 * @description dom 객체에 keydown이벤트를 바인딩하여 한글만 입력가능하도록 한다
	 * @param input
	 *            jquery객체
	 */

	self.setOnlyKor = function(obj) {
		obj.on('keydown', function(e) {
			var code = e.keyCode;
			var onlyKorean = code == 229 || code == 8 || code == 9 || code == 13 || code == 46;
			if (!onlyKorean) {
				e.preventDefault();
			}
		});
	};

	/**
	 * @public
	 * @description dom 객체에 keydown이벤트를 바인딩하여 숫자와 영문만 입력가능하도록 한다
	 * @param input
	 *            jquery객체
	 */

	self.setOnlyNumEng = function(obj) {
		obj.css('imeMode', 'disabled');
		obj.on('keydown', function(e) {
			var code = e.keyCode;
			var onlyNumEng = (code > 64 && code < 91) || (code > 34 && code < 41) || (code > 47 && code < 58) || (code > 95 && code < 106) || code == 8 || code == 9 || code == 13 || code == 46 || code == 110 || code == 56 || code == 190;
			if (!onlyNumEng) {
				e.preventDefault();
			}
		});
	};
	/**
	 * @public
	 * @description dom 객체의 value나 innerHTML을 공백으로 세팅
	 * @param jquery객체
	 */
	self.emptyFieldData = function(obj) {
		if (isJQueryObj(obj) && obj.size() > 0) {
			if (obj[0].nodeName == 'INPUT') {
				obj.val('');
			} else if (obj[0].nodeName == 'SELECT') {
				ci.ui.setSelectedIndex(obj, 0);
			} else {
				obj.html('');
			}
		}
	};
	/**
	 * @public
	 * @description dom 객체의 value나 innerHTML을 세팅
	 * @param jquery객체
	 * @param 값
	 */

	self.setFieldData = function(obj, data) {
		if (isJQueryObj(obj) && obj.size() > 0) {
			if (obj[0].nodeName == 'INPUT' || obj[0].nodeName == 'SELECT') {
				obj.val(data);
			} else {
				obj.html(data);
			}
		}
	};
	/**
	 * @public
	 * @description dom 객체의 value나 innerHTML을 반환
	 * @param jquery객체
	 * @returns 해당객체의 value or html
	 */

	self.getFieldData = function(obj) {
		if (isJQueryObj(obj) && obj.size() > 0) {
			if (obj[0].nodeName == 'INPUT' || obj[0].nodeName == 'SELECT') {
				return obj.val();
			} else {
				return obj.html();
			}
		}
	};
	/**
	 * @public
	 * @description dom 객체의 value나 innerHTML을 숫자로 반환
	 * @param jquery객체
	 * @returns 해당객체의 value(number)
	 */

	self.getNumberData = function(obj) {
		if (isJQueryObj(obj) && obj.size() > 0) {
			var ret = parseInt(ci.util.removeCommas(ci.ui.getFieldData(obj)), 10);
			if (isNaN(ret)) {
				ret = 0;
			}
			return ret;
		}
	};

	self.transformTable = function(table, transType) {
		if (transType == "type1") {
			var trs = table.find("thead tr");
			var rowgroup = trs.size();

			if (rowgroup == 1) {
				var ths = trs.children();
				table.find("tbody tr").each(function() {
					$(this).children().each(function(i) {
						$(this).attr("data-title", ths.eq(i).text());
					});
				});

				table.addClass("transform-type1");
				table.find("colgroup").remove();
			}
		} else if (transType == "type2") {
			var trs = table.find("thead tr");
			var rowgroup = trs.size();

			if (rowgroup == 1) {
				var ths = trs.children();
				table.find("tbody tr").each(function() {
					$(this).children().each(function(i) {
						$(this).attr("data-title", ths.eq(i).text());
					});
				});

				table.addClass("transform-type2");
				table.find("colgroup").remove();
			}
		}

	};
	/**
	 * @public
	 * @description dom 객체의 value가 공백인지 체크
	 * @param jquery객체
	 * @param 경고창을
	 *            띄워줄때 사용될 name
	 * @returns true | false
	 */

	self.checkFieldData = function(obj, name) {
		var value = '';
		if (isJQueryObj(obj) && obj.size() > 0) {
			if (obj[0].nodeName == 'INPUT') {
				value = obj.val();
			} else {
				value = obj.html();
			}

			if (ci.util.isNull(value)) {
				alert(name + '을(를) 입력해주세요');
				obj.select().focus();
				return false;
			}
			return true;
		}
		return false;
	};
	/**
	 * @public
	 * @description dom 객체에 keyup이벤트를 바인딩하여 해당 객체value의 byte를 체크
	 * @param dom객체
	 */
	self.checkByteKeyup = function(obj) {
		if (!isJQueryObj(obj)) {
			obj = $(obj);
		}
		obj.each(function() {
			$(this).on('keyup', function() {
				ci.util.checkByte($(this), $(this).data('maxbyte'));
			});
		});
	};
	/**
	 * @public
	 * @description dom 을 문자열로 생성
	 * @param object
	 * @returns 생성된 dom의 html
	 * @example ci.ui.makeElement({ nodeType : 'div', id : 'myDIV', class
	 *          :'myClass' });
	 * 
	 */
	self.makeElement = function(param) {

		if (!param || !param.nodeType) {
			throw '파라미터가 올바르지 않습니다. 필수 [nodeType]';
		}

		var ret = '<' + param.nodeType;
		for ( var i in param) {
			if (i == 'nodeType') {
				continue;
			}
			ret += ' ' + i + '="' + param[i] + '"';
		}

		ret += '></' + param.nodeType + '>';

		return ret;
	};
	/**
	 * @public
	 * @description dom 객채에 바인딩되어있는 event를 반환
	 * @param jquery객체
	 * @returns 바인딩되어있는 events
	 */

	self.showElementEvent = function(elem) {
		elem = $(elem);
		return $._data(elem[0], 'events');
	};
	/**
	 * @public
	 * @description dom 객체에 엔터키 이벤트를 바인딩
	 * 
	 * @param jquery객체
	 * @param 함수
	 */

	self.bindEnterEvent = function(elem, event) {
		elem = $(elem);
		elem.on('keydown', function(e) {
			if (e.keyCode == 13) {
				e.preventDefault();
				if (typeof event == 'function') {
					event();
				}
			}
		});
	};

	/**
	 * REGIST
	 */
	if (!ci) {
		window.ci = ci = {};
	}
	ci.ui = self;

})(window.ci);
