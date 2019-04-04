/**
	TABS FOR UI & Server Interaction.

	오상원
	




	개요 :

		탭은 셀렉터(마우스로 선택하는영역)와 패널(탭의 내용이 보여지는곳)로 구성된다.





	마크업 :

		<!-- TAB MARKUP : START -->
		<div class="mytab ci-tab">

		    <!-- 오른쪽 상단 이용할수 있는 부분 -->
		    <div class="extra-space"></div>

		    <!-- TAB 셀렉터 : START -->
		    <ul class="tab-selector">
		        <li>
		            <a href="#">TAB NAME 1</a>
		        </li>
		        <li class="active">
		            <a href="#">TAB NAME 2</a>
		        </li>
		        <li>
		            <a href="#">TAB NAME 3</a>
		        </li>
		        <li>
		            <a href="#">TAB NAME 4</a>
		        </li>
		    </ul>
		    <!-- TAB 셀렉터 : END -->

		    <!-- TAB 폐널 : START -->
		    <ul class="tab-panel">
		        <li>
		            <h3 class="blind">TAB NAME 1</h3>
		            <div class="panel">
		                PANEL1
		            </div>
		        </li>
		        <li>
		            <h3 class="blind">TAB NAME 2</h3>
		            <div class="panel">
		                PANEL2
		            </div>
		        </li>
		        <li>
		            <h3 class="blind">TAB NAME 3</h3>
		            <div class="panel">
		                PANEL3
		            </div>
		        </li>
		        <li>
		            <h3 class="blind">TAB NAME 4</h3>
		            <div class="panel">
		                PANEL4
		            </div>
		        </li>
		    </ul>
		    <!-- TAB 폐널 : END -->

		</div>
		<!-- TAB MARKUP : END -->





	초기화 : 

		var myTab = ci.tab.init($('.mytab'), option);





	옵션 :

		mode - dom | ajax | page
			탭 패널에 내용을 넣는 방식을 지정한다.

			dom - 위에 예시된 마크업과 같이 탭 패널안에 직접 마크업을 작성한다.
			ajax - 
			page -



		autoOpen - true | false
			탭을 자동으로 열것인지 세팅 
			(탭셀렉터를 클릭하기 전까지 탭이 열리지 않는다.)



		defaultTabIndex - number
			처음 열리게 될 탭 index를 지정해줄 수 있다.



		panelOpen - function (e, s, p) {}
			탭 패널이 열린 후 발생하는 콜백
			(탭 패널이 열린후 서버와 통신을 할때 사용할 수 있다.)

			e - 이벤트
			s - 해당탭의 셀렉터
			p - 해당탭 패널
			
			ex)
			panelOpen : function (e, s, p) {
			    console.log('client panel opened');
			}



		panelClose - function (e, s, p) {}
			탭 패널이 닫힌 후 발생하는 콜백
			(탭 패널이 닫힌후 자원을 반납하거나 할때 사용 할 수 있다.)

			e - 이벤트
			s - 해당탭의 셀렉터
			p - 해당탭 패널

			ex)
			panelClose : function (e, s, p) {
			    console.log('client panel closed');
			}


 */
(function () {

	var self = {};

	self.event = $({});

	var ACTIVE = 'active';
	var ACTIVE_CLASS = '.active';
	var CHILDREN_NODE = 'childrenNode';
	var PAGEMODE_PARAM_NAME = 'citab';

	function checkDisabled (selector) {
		if (selector.hasClass('ci-tab-disabled')) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 클릭한 탭을 활성화 시킨다.
	 */
	function activateTab (tab, selector, panel) {

		if (checkDisabled(selector)) {
			return;
		}
		
		selector.addClass(ACTIVE);
		panel.addClass(ACTIVE);
		panel.append(panel.data(CHILDREN_NODE));
		triggerPanelOpen(tab, selector, panel);
	}

	/**
	 * 클릭한 탭을 비활성화 시킨다.
	 */
	function deActivateTab (tab, selector, panel) {

		if (checkDisabled(selector)) {
			return;
		}

		var deActivatedSelector = selector.siblings(ACTIVE_CLASS);

		deActivatedSelector.removeClass(ACTIVE);

		var deActivatedPanel = panel.siblings(ACTIVE_CLASS);

		if (deActivatedPanel.length === 0) {
			// 처음 텝이 열릴때는 비활성화 될 탭이 없기 때문에
			// 빈 객체를 넘겨준다.
			triggerPanelClose(tab, $({}), $({}));
			return;
		}

		deActivatedPanel.removeClass(ACTIVE);

		triggerPanelClose(tab, deActivatedSelector, deActivatedPanel);

		deActivatedPanel.data(CHILDREN_NODE, deActivatedPanel.children().detach());

	}

	/**
	 * AJAX 클릭한 탭을 활성화 시킨다.
	 */
	function activateAjaxTab (tab, selector, panel, result) {
		selector.addClass(ACTIVE);
		panel.addClass(ACTIVE);
		panel.html(result);
		triggerPanelOpen(tab, selector, panel);
	}

	/**
	 * AJAX 클릭한 탭을 비활성화 시킨다.
	 */
	function deActivateAjaxTab (tab, selector, panel) {

		var deActivatedSelector = selector.siblings(ACTIVE_CLASS);

		deActivatedSelector.removeClass(ACTIVE);

		var deActivatedPanel = panel.siblings(ACTIVE_CLASS);

		if (deActivatedPanel.length === 0) {
			// 처음 텝이 열릴때는 비활성화 될 탭이 없기 때문에
			// 빈 객체를 넘겨준다.
			triggerPanelClose(tab, $({}), $({}));
			return;
		}

		triggerPanelClose(tab, deActivatedSelector, deActivatedPanel);

		deActivatedPanel.empty();

	}

	
	/**
	 * PAGE 클릭한 탭을 활성화 시킨다.
	 */
	function activatePageTab (tab, selector, panel) {
		selector.addClass(ACTIVE);
		panel.addClass(ACTIVE);
		triggerPanelOpen(tab, selector, panel);
	}



	function triggerPanelOpen (tab, selector, panel) {
		tab.trigger('panelopen', [selector, panel]);
		self.event.trigger('panelopen', [selector, panel]);
	}

	function triggerPanelClose (tab, selector, panel) {
		tab.trigger('panelclose', [selector, panel]);
		self.event.trigger('panelclose', [selector, panel]);
	}

	function disableTabSelector(tab, selector, idx) {

		var tabSelector = tab.find("> .tab-selector > li");

		$.each(idx, function (i, v) {
			var selector = tabSelector.eq(v);
			selector.addClass('ci-tab-disabled');
		});

		return tab;
	}

	/**
	 * TAB 모드에 따른 로직 적용
	 */
	function applyMode (tab, option, returnObj) {

		var tabSelector = tab.find("> .tab-selector > li");
		var tabPanel = tab.find("> .tab-panel > li");

		if (option.disabled instanceof Array) {

			tab = disableTabSelector(tab, tabSelector, option.disabled);
		}

		if (option.mode === undefined || option.mode === 'dom') {

			tabPanel.each(function () {
				var li = $(this);
				li.data("childrenNode",li.children().detach());
			});

			// 탭 셀렉터 클릭시
			tabSelector.on('click', 'a', function(e) {

				e.preventDefault();
				
				var clickedLi = $(this.parentNode);
				
				var indexedPanel = tabPanel.eq(clickedLi.index());

				// 비활성화
				deActivateTab(returnObj, clickedLi, indexedPanel);

				// 활성화
				activateTab(returnObj, clickedLi, indexedPanel);

			});

		} else if (option.mode === 'ajax') {

			tabPanel.filter(':not(:eq(0))').remove();

			if (tabPanel.length === 0) {
				tab.find('> .tab-panel').append($('<li>'));
				tabPanel = tab.find("> .tab-panel > li");
			}


			// 탭 셀렉터 클릭시
			tabSelector.on('click', 'a', function(e) {

				e.preventDefault();

				if (checkDisabled($(this).closest('li'))) {
					return;
				}

				var clickedLi = $(this.parentNode);
				
				var url = $(this).attr('href');
				
				if('#' == url) {
					return;
				}

				if (option.ajaxOption === undefined) {
					option.ajaxOption = {};
				}

				var ajaxOption = {};

				$.extend(ajaxOption, option.ajaxOption);

				ajaxOption.url = url;

				ajaxOption.success = function (result) {
					
					// 비활성화
					deActivateAjaxTab(returnObj, clickedLi, tabPanel);
					// 활성화
					if(typeof result === 'object' && result.CONTENT_BODY) {
						result = result.CONTENT_BODY;
					}
					
					activateAjaxTab(returnObj, clickedLi, tabPanel, result);
					
				};

				$.ajax(ajaxOption);

				//xSubmitAjax(null, ajaxOption);
			});
		} else if (option.mode === 'page') {

			// query string에서 PAGEMODE_PARAM_NAME 파라메터 값을 가저온다.
			var param;

			var defaultSelector = getDefaultSelector(tab);

			if (typeof param === 'undefined') {

				activatePageTab(returnObj, defaultSelector, tabPanel);
			}

			if (!tabPanel.hasClass(ACTIVE)) {
				tabPanel.addClass(ACTIVE);
			}

			return;

			var links = tabSelector.find('a');

			links.each(function (idx) {

				var link = $(this);
				var href = link.attr('href');

				if (href.indexOf(PAGEMODE_PARAM_NAME + '=') === -1) {

					if (href.indexOf('?') === -1) {
						link.attr('href', link.attr('href') + '?' + PAGEMODE_PARAM_NAME + '=' + idx);
					} else {
						link.attr('href', link.attr('href') + '&' + PAGEMODE_PARAM_NAME + '=' + idx);
					}
					
				}
				
			});

		}
	}

	/**
	 * http get parameter를 얻어온다.
	 */
	function getQeuryVariables (variable) {
		
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		
		for (var i=0; i< vars.length; i++) {
			var pair = vars[i].split("=");
			if (pair[0] == variable) {
				return pair[1];
			}
		}
	}

	/**
	 * 사용자 지정 옵션을 적용한다.
	 */
	function applyCallback (tab, option) {

		// 탭 열릴때 이벤트
		if (option.panelOpen) {
			tab.on('panelopen', function (event, s, p) {
				option.panelOpen(event, s, p);
			});
		}

		// 탭 닫힐때 이벤트
		if (option.panelClose) {
			tab.on('panelclose', function (event, s, p) {
				option.panelClose(event, s, p);
			});
		}
	}

	function openDefaultTab (tab) {
		// 처음 열려있는 탭 선택
		var defaultSelected = getDefaultSelector(tab);
		defaultSelected.find('a').click();
	}
	
	/**
	 * 처음 선택되어있는 탭 셀렉터를 반환한다.
	 */
	function getDefaultSelector (tab) {

		var tabSelector = tab.find("> .tab-selector > li");

		var activeSelector = tabSelector.filter(ACTIVE_CLASS);

		if (activeSelector.length > 0 ) {
			return activeSelector;
		} else {
			return tabSelector.eq(0);
		}

	}

	/**
	 * 초기 설정된 IDX로 기본 탭을 바꿔준다.
	 */
	function applyDefalutTabIndex (tab, index) {

		var tabSelector = tab.find("> .tab-selector > li");
		tabSelector.removeClass(ACTIVE);
		tabSelector.eq(index).addClass(ACTIVE);
	}

	/**
	 * 외부에서 이용할 수 있는 API를 붙혀준다.
	 */
	function addMethods (tab, self) {
		self.getDefaultSelector = function () {
			return getDefaultSelector(tab);
		};
		self.openDefaultTab = function () {
			var defaultSelected = getDefaultSelector(tab);
			defaultSelected.find('a').click();
		};
	}

	/**
	 * TAB마크업을 기반으로 탭을 초기화 시킨다.
	 */

	/**
	 * autoOpen : true | false (default : true)
	 * 초기화시 탭을 연상태로 둘 것인가
	 *
	 * mode : 'dom' | 'ajax' | 'page' (default : 'dom')
	 * DOM을 보이게 안보이게 해서 조작할것인가, AJAX로 페이지를 불러올것인가, 
	 * 페이지를 REFRESH 할 것인가
	 *
	 *
	 *
	 *
	 *
	 */
	self.init = function (tab, option) {

		var tabObject = $({});

		if (option === undefined) {
			option = {};
		}

		// 콜백 설정
		applyCallback(tabObject, option);

		// 모드 설정
		applyMode(tab, option, tabObject);

		// 사용될 API를 붙힌다.
		addMethods(tab, tabObject);

		if (option.autoOpen === false) {
			return tabObject;
		}

		// 탭 열기
		if (typeof option.defaultTabIndex != 'undefined') {
			applyDefalutTabIndex(tab, option.defaultTabIndex);
			openDefaultTab(tab);
		} else {
			openDefaultTab(tab);
		}
		

		return tabObject;
	};

	if (typeof ci == 'undefined') {
		window.ci = {};
	}

	ci.tab = self;

})();

