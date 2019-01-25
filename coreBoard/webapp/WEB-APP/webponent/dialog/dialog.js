/**
 * 
 * jQuery UI Dialog Wrapper
 * 
 * 오상원
 * 
 */
(function() {

	var self = {};

	/*
	 * 타이틀에 포커스 보이도록 하는 변수
	 */
	var ACCESSIBILITY = false;

	var dialogOption = {

		dialogClass : 'ci-dialog',
		autoOpen : false,
		/**
		 * 기본적으로 제공되는 닫기버튼을 사용할건지
		 */
		closebutton : true,
		resizable : false,
		unique : true,
		notitle : false
	};

	if (typeof getDevice !== 'function') {
		window.getDevice = function() {
			return 'pc';
		};
	}

	var buttonDefaultClass = '';

	if (window.ci && ci.config && ci.config.dialog) {
		buttonDefaultClass = ci.config.dialog['default-class'];
	}

	/**
	 * 모바일 디바이스 일때 추가되는 옵션
	 */
	var mobileOption = {

		width : '100%',
		height : 'auto',
		minHeight : window.innerHeight + 14,
		position : {
			my : 'top',
			of : window,
			at : 'top'
		}
	};

	/**
	 * 기본적으로 붙는 버튼들
	 */
	var defaultButtons = [ {
		text : '닫기',
		click : function() {
			$(this).dialog('close');
		},
		'class' : buttonDefaultClass + ' ' + 'ci-dialog-close'
	} ];

	/**
	 * 다이알로그에 ID 부여
	 */
	function addId(dialog, option) {
		if (option.id) {
			getWrapper(dialog).attr('id', option.id);
		}
	}

	/**
	 * 유니크한지 체크 이미 동일한 아이디의 창이 떠있으면 false 새롭게 뜨는 창이면 true반환
	 */
	function checkUnique(option) {

		if (option.unique === false) {
			return true;
		}

		if (option.id) {

			if ($('#' + option.id).length > 0) {
				return false;
			} else {
				return true;
			}
		} else {
			return true;
		}
	}

	/**
	 * 이미 창이 떠있는경우 다시 포커스를 준다.
	 */
	function reFocusDialog(option) {

		var dialogWrap = $('#' + option.id).closest('.ui-dialog');
		dialogWrap.find(':tabbable:first').focus();
	}

	/**
	 * 다이아로그가 초기화될때 기본적인 이벤트를 붙혀준다.
	 */
	function addDialogEvent(dialog, option) {

		// 닫칠때 실행된다.
		dialog.on('dialogclose', function(event) {

			// 다이알로그 해제
			$(event.target).dialog('destroy');

			// 지정된 요소에 포커스를 넘겨준다.
			if (option.focus) {

				if (typeof option.focus == 'string') {

					$('#' + option.focus).focus();
				} else {

					try {

						var focusObject = $(option.focus);

						// 나중에 풀자...
						// focusObject.one('blur', function () {
						// // fix ie bug
						// if ($(':focus')[0].tagName.toLowerCase() === 'body')
						// {
						// focusObject.focus();
						// }
						// });

						focusObject.focus();
					} catch (e) {

					}

				}
			}
		});

		dialog.on('dialogopen', function(event) {

			var dialog = $(event.target);
			var dialogWrap = dialog.closest('.ui-dialog');

			// title에 포커스
			if (ACCESSIBILITY) {
				dialogWrap.find('.ui-dialog-title').attr('tabindex', '0').focus();
			} else {
				// 미관 코드
				dialogWrap.find('.ui-dialog-title').attr('tabindex', '0');
				var titleClone = dialogWrap.find('.ui-dialog-title').clone();
				titleClone.css({
					position : 'absolute',
					width : 0,
					height : 0,
					left : -9999
				});
				dialogWrap.find('.ui-dialog-titlebar').prepend(titleClone);
				titleClone.focus();
			}

			// 타이틀에서 SHIFT + TAB 이 눌렸을때 다이알로그를 닫아준다.
			dialogWrap.find('.ui-dialog-title').on('keydown', function(e) {

				var keyCode = e.keyCode || e.which;
				var shiftTab = e.shiftKey && keyCode == 9;
				if (shiftTab) {
					e.preventDefault();
					dialog.dialog('close');
					return false;
				}
			});
			
			//웹접근성 관련 tabindex 추가
			dialogWrap.find(".ui-dialog-content").attr("tabindex","0");

			// 타이틀바에 있는 닫기버튼 삭제
			// dialogWrap.find('.ui-dialog-titlebar-close').remove();

			// 포커스 반복 안되게
			var lastButton = dialogWrap.find('.ui-dialog-buttonpane :tabbable:last');

			lastButton.on('keydown', function(e) {
				var keyCode = e.keyCode || e.which;
				if (keyCode == 9) {

					if (e.shiftKey) {

					} else {
						dialog.dialog('close');
						return false;
					}
				}
			});
		});

		// notitle == true 일때 처리
		if (option.notitle === true) {

			dialog.on('dialogopen', function(event) {
				var dialog = $(event.target);
				var dialogWrap = dialog.closest('.ui-dialog');

				// 타이틀에서 SPACE키와 SHIFT + TAB 이 눌렸을때 다이알로그를 닫아준다.
				dialogWrap.find('.ui-dialog-title').on('keydown', function(e) {
					var keyCode = e.keyCode || e.which;
					if (keyCode == 13 || keyCode == 32) {
						e.preventDefault();
						dialog.dialog('close');
						return false;
					}
				});
			});
		}

	}

	/**
	 * 버튼에 공통 css클래스를 부여한다.
	 */
	function addButtonClass(userButton) {

		for ( var i = 0, len = userButton.length; i < len; i++) {
			var button = userButton[i];
			var className = button['class'];

			if (className) {
				button['class'] = className + ' ' + buttonDefaultClass;
			} else {
				button['class'] = buttonDefaultClass;
			}
		}
	}

	/**
	 * 기본적인 버튼에 사용자가 지정한 버튼들을 추가시킨다.
	 */
	function addButton(userButton) {

		return userButton.concat(defaultButtons);
	}

	/**
	 * 다이알로그 내용을 붙힌다.
	 */
	function addContent(dialog, markup, option) {
		// 다이알로그 내용 추가
		if (option.dom) {

			// html로 입력
			var content = option.dom.first().clone();
			appendMarkup(dialog, markup, content.show(), option);

		} else if (option.script) {

			// 스크립트 템플릿으로 입력
			var content = option.script.html();
			appendMarkup(dialog, markup, content, option);

		} else if (option.url) {

			// 외부 페이지 호출
			loadPage(dialog, markup, option, option.ajaxOption);
		} else if (option.msg) {

			// 메시지
			appendMarkup(dialog, markup, option.msg, option);
		}
	}

	/**
	 * ajax를 통해 페이지 로드
	 */
	function loadPage(dialog, markup, option, ajaxOption) {

		if (!ajaxOption) {
			ajaxOption = {};
		}

		ajaxOption.url = option.url;

		ajaxOption.success = function(result) {

			if (typeof result === 'object') {
				result = result[option['JSONKey'] || 'CONTENT_BODY'];
			}

			appendMarkup(dialog, markup, result, option);
		};

		ajaxInterface(ajaxOption);
	}

	/**
	 * dialog에 마크업을 붙힌다.
	 */
	function appendMarkup(dialog, place, markup, option) {

		place.append(markup);

		afterAppend(dialog, place, option);
		
		// 모바일 화면열기전 배경을 지워준다.
		if (getDevice() === 'mobile') {
			hideBackground(dialog, $('#wrap'));
		}
	}

	/**
	 * 마크업이 붙은 이후 처리
	 */
	function afterAppend(dialog, place, option) {

		dialog.dialog('open');

		/**
		 * 버그가 보이는 브라우저들이 있기때문에 강제로 top과 scroll을 맞춰준다.
		 */		
		if (getDevice() === 'mobile') {
			try {
				if (option.full != false) {
					setTimeout(function() {

						var wrapper = getWrapper(dialog);
						wrapper.css({
							'top' : 0
						});
						$(window).scrollTop(0);

					}, 10);
				} else {
					// smartHt 용 모바일에서 full 화면 없이 사용.
					setTimeout(function() {

						getWrapper(dialog).position({
							at : 'center',
							my : 'center',
							of : window
						});

					}, 100);
				}
			} catch (e) {
				setTimeout(function() {

					var wrapper = getWrapper(dialog);
					wrapper.css({
						'top' : 0
					});
					$(window).scrollTop(0);

				}, 10);
			}
		} else {			
			if (option.full == false) {
				setTimeout(function() {

					getWrapper(dialog).position({
						at : 'center',
						my : 'center',
						of : window
					});

				}, 100);
			}else{
				if ($(window).height() > 800) {
					setTimeout(function() {

						getWrapper(dialog).position({
							at : 'center',
							my : 'center',
							of : window
						});

					}, 100);	
				} else {
					setTimeout(function() {

						getWrapper(dialog).position({
							at : 'top+50',
							my : 'top',
							of : window
						});

					}, 100);
				}
			}			
			
		}

		if (option.afterAppend) {
			var wrapper = getWrapper(dialog);
			option.afterAppend.call(dialog[0], wrapper);
		}

	}

	/**
	 * option.data 로 준 데이터 세팅
	 */
	function setData(dialog, data) {

		getWrapper(dialog).data('userData', data);
	}

	/**
	 * div.ui-dialog 를 반환한다.
	 */
	function getWrapper(dialog) {
		return dialog.closest('div.ui-dialog');
	}

	/**
	 * div#id.ui-dialog 안에 들어있는 div.ui-dialog-content (실제 다이알로그)를 반환한다.
	 */
	function getDialog(id) {
		return $('#' + id).find('div.ui-dialog-content');
	}

	/**
	 * 서로 다른 ajax통신 환경을 고려한 IF
	 */
	function ajaxInterface(ajaxOption) {
		//xSubmitAjax(null, ajaxOption);
		$.ajax(ajaxOption);
	}

	/**
	 * 해당 ID의 다이아로그가 열려있지 않거나, 존재하지 않을때 발생
	 */
	function dialogNotFoundException(dialogId) {
		throw dialogId + "에 해당하는 다이아로그가 없습니다.";
	}

	/**
	 * 배경을 지워준다.
	 */
	function hideBackground(dialog, background) {

		background.height(0);

		dialog.on('dialogclose', function() {

			if ($('.ui-dialog').length === 0) {
				background.height('auto');
			}

		});
	}

	/**
	 * jquery ui draggable 을 안정적으로 사용할 수 있는 브라우저인지 파악한다.
	 */
	function checkDraggable() {
		var draggable = true;

		if (ci.agent.isIe || ci.agent.isFirefox) {
			draggable = false;
		}

		return draggable;

	}

	/**
	 * 
	 */
	self.open = function(userOption) {

		// 이미 같은 id의 다이알로그가 떠 있는 경우
		if (!checkUnique(userOption)) {

			if (userOption.reopen === true) {
				self.close(userOption.id);
			} else {
				reFocusDialog(userOption);
				return;
			}
		}

		if (typeof userOption.focus === 'undefined') {
			throw "키보드 접근성을 위해 focus옵션이 필요합니다.";
		}

		var option = {};

		dialogOption.draggable = checkDraggable();

		$.extend(option, dialogOption);

		var div = $('<div>');

		// 버튼세팅
		if (userOption.buttons) {
			addButtonClass(userOption.buttons);
		}

		if (userOption.closebutton !== false) {
			if (userOption.buttons) {
				userOption.buttons = addButton(userOption.buttons);
			} else {
				userOption.buttons = defaultButtons;
			}

			if (userOption.closeButtonText) {
				var lastButtonIdx = userOption.buttons.length - 1;
				userOption.buttons[lastButtonIdx].text = userOption.closeButtonText;
			}

		}

		// 모드별 디자인을 위한 class설정
		if (userOption.notitle === true) {
			option.dialogClass += ' notitle';
		}

		// QUICK MENU 종류의 다이알로그
		if (userOption.quick === true) {

			var quickClass = ' quick';

			option.position = {
				my : 'right top',
				at : 'left-10 top',
				of : userOption.focus
			};

			if (userOption.quickPosition === 'right') {
				quickClass = ' quick quick-right';
				option.position = {
					my : 'left top',
					at : 'right+10 top',
					of : userOption.focus
				};
			}

			option.dialogClass += quickClass;

			option.draggable = false;
		}

		// 특정 class를 추가 하는 로직
		if (userOption.className) {
			option.dialogClass += (' ' + userOption.className);
		}

		// 사용자 옵션 확장
		$.extend(option, userOption);

		// 모바일 옵션 추가
		if (getDevice() === 'mobile') {
			try {
				if (option.full != false) {
					$.extend(option, mobileOption);
				}
			} catch (e) {
				$.extend(option, mobileOption);
			}
		}

		var dialog = div.dialog(option);

		// dialog에 데이터 세팅
		setData(dialog, option.data);

		// ID 부여
		addId(dialog, option);

		// 이벤트 부여
		addDialogEvent(dialog, option);

		// 내용 붙히기
		addContent(dialog, div, option);


		return dialog;
	};

	/**
	 * 다이알로그 닫기 string type일때는 해당 ID를 가진 dialog를 닫아준다.
	 */
	self.close = function(dialog) {

		if (typeof dialog === 'string') {
			// var dialogObj = $('#'+dialog);
			getDialog(dialog).dialog('close');
		} else {
			try {
				dialog.dialog('close');
			} catch (e) {
				$(".ui-dialog-titlebar-close", dialog).trigger("click");
			}

		}

	};

	/**
	 * 해당 다이알로그가 가지고 있는 key에 해당하는 value를 가져온다
	 */
	self.getData = function(dialogId, key) {

		var dialog = $('#' + dialogId);

		if (dialog.length > 0) {
			var userData = dialog.data('userData');
			return userData[key];
		} else {
			dialogNotFoundException(dialogId);
		}

	};

	/**
	 * 해당 다이알로그에 데이터를 세팅한다.
	 */
	self.setData = function(dialogId, key, value) {

		var dialog = $('#' + dialogId);

		if (dialog.length > 0) {

			var userData = dialog.data('userData');

			if (!userData) {
				dialog.data('userData', {});
			}

			userData[key] = value;

		} else {
			dialogNotFoundException(dialogId);
		}

	};

	/**
	 * 해당 ID를 가진 div.ui-dialog를 반환한다.
	 */
	self.get = function(dialogId) {
		var dialogWrapper = $('#' + dialogId);

		if (dialogWrapper.length > 0) {
			return dialogWrapper;
		} else {
			dialogNotFoundException(dialogId);
		}
	};

	/**
	 * 열려있는 다이알로그에 내용을 세팅한다. (이미 내용이 들어가 있는 DIA의 내용을 바꿀수있다.)
	 */
	self.setContent = function() {

	};

	if (typeof ci == 'undefined') {
		window.ci = {};
	}

	ci.dialog = self;

})();