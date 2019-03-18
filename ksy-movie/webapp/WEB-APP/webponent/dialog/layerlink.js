/**
	버튼등을 눌렀을때 링크들을 수납하는 레이어

	오상원

	사용법 :

	$('.layer-link-btn').on('click', function (e) {
		
		e.preventDefault();
		
		var btn = $(this);
		var option = {
			position : 'right' | 'left',
			links : [
						{
							'title' : '펀드 추가 매수',
							'href' : 'aaa'
						},
						{
							'title' : '펀드매도',
							'href' : 'bbb'
						},
						{
							'title' : '펀드상세정보 조회',
							'href' : 'ccc',
							'click' : function (e) {
								// 콜백
							}

						},
					]
		};

		LayerLink.open(btn, option);
	});


 */
var LayerLink = (function () {

	var self = {};

	var layerMarkup = 
			'<div class="layer-link">'+
				'<div class="ar-area ar-left"></div>'+
				'<ul>'+
				'</ul>'+
				'<div class="layer-close">'+
					'<a href="#" class="layer-close-a"><span>닫기</span></a>'+
				'</div>'+
			'</div>';

	function appendLinks (layer, links) {

		var ul = layer.find('> ul');

		for (var i = 0, len = links.length; i < len; i ++) {
			
			var link = links[i];

			var liMarkup = $('<li>');
			var linkMarkup = $('<a>');
			
			
			if(link !== undefined){
				linkMarkup.attr('href', link.href);
				linkMarkup.text(link.title);
	
				if (typeof link['click'] === 'function') {
					addCallback(linkMarkup, link['click']);
				}
	
				liMarkup.append(linkMarkup);
				ul.append(liMarkup);
			}
			
		}

		return layer;

	}

	function appendMessages (layer, messages) {

		var ul = layer.find('> ul');

		for (var i = 0, len = messages.length; i < len; i ++) {
			
			var message = messages[i];

			var messageMarkup = $('<p>');
			messageMarkup.html(message.message);

			ul.append(messageMarkup);
			
		}

		return layer;

	}

	function addCallback(linkMarkup, callback) {
		
		linkMarkup.on('click', function (e) {
			callback(e);
		});
	}

	function addEvents (layer) {

		var triggerBtn = layer.data('triggerBtn');

		triggerBtn.on('mouseenter.layerlink', function () {
			clearTimeout(layer.data('delay'));
			clearTimeout(triggerBtn.data('delay'));
		});

		triggerBtn.on('mouseleave.layerlink', function () {
			triggerBtn.data('delay', setTimeout(function () {
				closeLayer(layer);
			}, 300));
		});

		layer.on('mouseenter.layerlink', function () {
			clearTimeout(triggerBtn.data('delay'));
			clearTimeout(layer.data('delay'));
		});

		layer.on('mouseleave.layerlink', function () {
			layer.data('delay', setTimeout(function () {
				closeLayer(layer);
			}, 300));
		});

		var closeBtn = layer.find('.layer-close a');

		closeBtn.one('click.layerlink', function (e) {
			e.preventDefault();
			closeLayer(layer);
		});

		closeBtn.on('keydown.layerlink', function (e) {
			var keyCode = e.keyCode || e.which;
			if (keyCode == 9) {

				if (e.shiftKey) {

				} else {
					closeLayer(layer);
					return false;
				}
			}
		});

		layer.find('> ul a:eq(0)').on('keydown', function (e) {

			var keyCode = e.keyCode || e.which;
			var shiftTab = e.shiftKey && keyCode == 9;
			if (shiftTab) {
				e.preventDefault();
				closeLayer(layer);
				return false;
			}
		});

	}

	function removeEvent (layer) {
		layer.off('.layerlink');
		var triggerBtn = layer.data('triggerBtn');
		triggerBtn.off('.layerlink');
	}

	function setPosition (layer, option, triggerBtn) {

		if (option.position === 'left') {

			layer.find('.ar-area').removeClass('ar-left').addClass('ar-right');

			layer.position({
				'my' : 'right-7px top-7px',
				'at' : 'left top',
				'of' : triggerBtn,
				'collision' : 'none'
			});
		} else {

			layer.position({
				'my' : 'left+7px top-7px',
				'at' : 'right top',
				'of' : triggerBtn,
				'collision' : 'none'
			});
		}
		
	}

	function openLayer (triggerBtn, option) {

		var layer = $(layerMarkup);

		layer.data('triggerBtn', triggerBtn);
		triggerBtn.data('layer', layer);

		if (option.links) {
			layer = appendLinks(layer, option.links);
		}
		
		if (option.messages) {
			layer = appendMessages(layer, option.messages);
		}
		

		addEvents(layer);

		triggerBtn.after(layer);

		setPosition(layer, option, triggerBtn);

		focusToLink(layer);

	}

	function closeLayer (layer) {

		var triggerBtn = layer.data('triggerBtn');
		triggerBtn.data('opened', null);
		triggerBtn.data('layer', null);
		removeEvent(layer);
		layer.remove();
		triggerBtn.focus();
	}

	function focusToLink (layer) {
		layer.find('> ul a:eq(0)').focus();
	}

	self.open = function (triggerBtn, option) {

		if (triggerBtn.data('opened') === true) {
			var layer = triggerBtn.data('layer');
			focusToLink(layer);
			return;
		}

		triggerBtn.data('opened', true);

		openLayer(triggerBtn, option);

	};

	self.close = function (layer) {
		closeLayer(layer);
	};

	return self;

})();