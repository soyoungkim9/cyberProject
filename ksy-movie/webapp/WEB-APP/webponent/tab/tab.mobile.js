/**
	MOBILE TAB
	데스크탑용 ci.tab을 확장함
*/
(function () {

	var parent = ci.tab;

	var self = {};

	var TAB_PADDING = 10;

	self.event = parent.event;

	function adjustTabSelcotrUlWidth (tabSelectorUl, tabSelectors) {

		var valid = true;
		
		var tabSelectorUlWidth = TAB_PADDING;

		tabSelectors.each(function () {
			tabSelectorUlWidth += $(this).outerWidth(true);
		});

		if (window.innerWidth >= tabSelectorUlWidth) {
			valid = false;
			return valid;
		}

		tabSelectorUl.width(tabSelectorUlWidth);

		return valid;
	}

	function appendSliderMarkUps (tabSelectorUl) {

		tabSelectorUl.wrap('<div class="tab-selector-wrapper">');

		var wrapper = tabSelectorUl.parent('.tab-selector-wrapper');

		wrapper.before('<div class="tab-selector-left-arrow">');
		wrapper.after('<div class="tab-selector-right-arrow">');

		return wrapper;
	}

	function resizeTabSlider (tab) {
		var tabSelectorUl = tab.find('.tab-selector');
		var tabSelectors = tabSelectorUl.children();

		var valid = adjustTabSelcotrUlWidth(tabSelectorUl, tabSelectors);

		var scrollObj = tab.data('oScroll');

		if (!valid) {
			hideSliderMarkUps(tab);
			scrollObj.scrollTo(0);
		} else {
			var currentSelector = tabSelectors.filter('.active');
			var idx = tabSelectors.index(currentSelector);
			movePosition(tab, idx);
			showSliderMarkUps(tab);
		}

		scrollObj.refresh();
	}

	function hideSliderMarkUps (tab) {
		
		var leftArrow = tab.find('.tab-selector-left-arrow');
		var rightArrow = tab.find('.tab-selector-right-arrow');

		leftArrow.hide();
		rightArrow.hide();
	}

	function showSliderMarkUps (tab) {

		var leftArrow = tab.find('.tab-selector-left-arrow');
		var rightArrow = tab.find('.tab-selector-right-arrow');

		leftArrow.show();
		rightArrow.show();
	}

	function applySlider (tabSelectorUl, tab) {

		var wrapper = tabSelectorUl.parent('.tab-selector-wrapper');

		var tabSelectorUlHeight = tabSelectorUl.outerHeight();
		wrapper.height(tabSelectorUlHeight);

		var oScroll = new jindo.m.Scroll(wrapper[0], {
			bUseHScroll : true,
			bUseVScroll : false,
			bUseMomentum : true,
			nDeceleration : 0.0005,
			bUseScrollbar : false,
			bAutoResize : true
		});

		tab.data('oScroll', oScroll);
	}

	function addEvent (tabSelectorUl, tab) {

		var oScroll = tab.data('oScroll');

		var wrapper = tabSelectorUl.parent('.tab-selector-wrapper');
		var leftBtn = wrapper.siblings('.tab-selector-left-arrow');
		var rightBtn = wrapper.siblings('.tab-selector-right-arrow');

		var scrollObj = oScroll.attach({
			position : function (scrollEvent) {
				
				if (scrollEvent.nLeft === 0 ) {
					leftBtn.css('opacity', 0);
					rightBtn.css('opacity', 1);
				} else if (scrollEvent.nLeft === scrollEvent.nMaxScrollLeft ) {
					leftBtn.css('opacity', 1);
					rightBtn.css('opacity', 0);
				} else {
					leftBtn.css('opacity', 1);
					rightBtn.css('opacity', 1);
				}
			}
		});
		
	}

	function makeSlider (tab, option) {

		var tabSelectorUl = tab.find('.tab-selector');
		var tabSelectors = tabSelectorUl.children();

		var valid = adjustTabSelcotrUlWidth(tabSelectorUl, tabSelectors);

		var wrapper = appendSliderMarkUps(tabSelectorUl);

		if (!valid) {
			hideSliderMarkUps(tab);
		}

		applySlider(tabSelectorUl, tab);

		addEvent(tabSelectorUl, tab);

		return true;
	}

	function collectPosition (tab) {

		var tabSelectorUl = tab.find('.tab-selector');
		var tabSelectors = tabSelectorUl.children();

		var selectorPosition = [];
		var scrollWidth = 0;

		tabSelectors.each(function (i) {
			var width = $(this).outerWidth();
			scrollWidth += width;
			selectorPosition[i] = scrollWidth;
		});

		tabSelectorUl.data('selectorPosition', selectorPosition);

	}

	function movePosition (tab, idx) {

		var tabSelectorUl = tab.find('.tab-selector');
		var tabSelectors = tabSelectorUl.children();

		var oScroll = tab.data('oScroll');
		var selectorPosition = tabSelectorUl.data('selectorPosition');

		var wrapper = tabSelectorUl.parent('.tab-selector-wrapper');
		var leftBtnWidth = wrapper.siblings('.tab-selector-left-arrow').outerWidth();

		var activatedSelector = tabSelectors.filter('.active');

		var domIdx = tabSelectors.index(activatedSelector);

		if (domIdx === -1) {
			domIdx = 0;
		}

		oScroll.scrollTo(1);

		setTimeout(function () {
			if (idx && idx !== 0) {
				//console.log('idx', selectorPosition[idx-1] - leftBtnWidth)
				oScroll.scrollTo(selectorPosition[idx-1] - leftBtnWidth);
			} else if (domIdx !==0) {
				//console.log('dom', selectorPosition,domIdx, selectorPosition[domIdx-1] , leftBtnWidth)
				oScroll.scrollTo(selectorPosition[domIdx-1] - leftBtnWidth);
			}else {
				oScroll.scrollTo(0);
			}
		}, 20);
		
		
	}

	self.init = function (tab, option) {
		
		if (!option) {
			option = {};
		}

		var returnObj = parent.init(tab, option);
		
		var valid = makeSlider(tab);

		collectPosition(tab);

		movePosition(tab, option.defaultTabIndex);

		$(window).on('resize.slidertab', function () {
			resizeTabSlider(tab);
		});

		return returnObj;

	};

	ci.tab = self;

})();
