document.domain = 'localhost';

(function () {

	self = {};

	var frameReadyState = 0;

	var currentTree = null;

	var currentElem = null;

	var currentAppendingElem = null;

	/**
	 * PRIVATE
	 */
	function setUifunction () {
		$('#select-parent-elem').on('click', function (e) {
			e.preventDefault();
			self.selectParentTree();
		});

		$('#remove-selected-elem').on('click', function (e) {
			e.preventDefault();
			removeSelecteElem();
		});

		$('#new-builder').on('click', function (e) {
			e.preventDefault();

			removeSelecteElem();

			var pcDomain = 'http://localhost';
			var mobileDomain = 'http://m.localhost';
			var newFormPath = '/WEB-APP/webponent/input/inputBlank.jsp';

			$('#pc-frame').attr('src', pcDomain + newFormPath);
			$('#mobile-frame').attr('src', mobileDomain + newFormPath);
		});

		$('#new-form').on('click', function (e) {
			e.preventDefault();
			propagateFunction('makeNewForm');
		});

		$('#add-element-test').on('click', function (e) {
			e.preventDefault();
			propagateFunction('addInputElement', {
				inputName : 'text',
				parentElemIdx : currentTree[0]['index']
			});
		});

		$('#add-control-group').on('click', function (e) {
			e.preventDefault();
			prepareNewControlGroup();
		});

		$('#element-append-btn').on('click', function (e) {
			e.preventDefault();

			if (currentTree === null) {
				alert('추가 시킬 곳을 선택해 주세요.');
				return;
			} else if (currentAppendingElem === null) {
				alert('추가 시킬 INPUT을 선택 해 주세요.');
				return;
			}

			propagateFunction('addInputElement', {
				inputName : currentAppendingElem,
				inputMarkup : $('#element-preview').html(),
				parentElemIdx : currentTree[0]['index']
			});
		});

		$('#element-append-cancel-btn').on('click', function (e) {
			e.preventDefault();
			cancelAddElement();
		});
	}

	function getUid () {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
					.toString(16).substring(1);
		};

		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
	}

	function propagateFunction (func, param) {
		document.getElementById('pc-frame')
				.contentWindow.worker.responseFunction(func, param);
		document.getElementById('mobile-frame')
				.contentWindow.worker.responseFunction(func, param);
	};

	function makeSelectorString(el) {
		var tag = el[0].nodeName.toLowerCase();

		var id = el.attr('id');

		if (id) {
			id = '#'+id;
		} else {
			id = '';
		}

		var className = el.attr('class');

		if (className) {
			var cnarray = className.split(' ');
			className = '';
			for (var i = 0, len = cnarray.length; i < len; i++) {
				className += '.' + cnarray[i];
			}
		} else {
			className = '';
		}

		var selectorString = tag + id + className;

		return selectorString;
	}

	function getAvailableClasses (info) {

		var seo = $('#show-element-option');
		seo.find('.class-temp').remove();

		var currEl = info['el'];
		var currType = info['type'];

		if (currEl === null) {
			return;
		}

		var currClassDef = classDef[currType];

		for (var classKey in currClassDef) {

			var li = $('<li class="class-temp"><a href="#"></a></li>');
			var a = li.find('a');
			
			a.text(classKey).attr('data-className', classKey);

			if (currEl.hasClass(classKey)) {
				a.addClass('class-applied')
						.prepend('<i class="icon-ok"></i>&nbsp;&nbsp;');
			} else {
				a.prepend('<i class="icon-remove"></i>&nbsp;&nbsp;');
			}

			a.on('click', function () {

				if ($(this).hasClass('class-applied')) {
					removeClass($(this).attr('data-className'));
				} else {
					addClass($(this).attr('data-className'));
				}
				
			})

			seo.append(li);
		}
	}

	function makeSelectorTreeBtn (paramTree) {
		var dss = $('#display-selector-string');
		
		dss.find('button').remove();

		if (paramTree !== null) {

			for (var i = paramTree.length-1; i > -1; i --) {
				var btn = $('<button class="btn btn-small">');
				btn.text(makeSelectorString(paramTree[i]['el']));
				dss.prepend(btn);
			}

			dss.find('button:last').addClass('btn-info');
		} else {
			dss.prepend('<button class="btn btn-small" type="button">선택된 요소 없음</button>');
		}

	}

	function addClass (className) {
		propagateFunction ('modifyClass', {
			action : 'add',
			tree : currentTree,
			className : className
		})
	}


	function removeClass (className) {
		propagateFunction ('modifyClass', {
			action : 'remove',
			tree : currentTree,
			className : className
		})
	}

	function removeSelecteElem () {
		currentElem = null;
		currentTree = null;
		handler.setCurrentElem(currentTree);
	}

	function prepareNewControlGroup () {
		var ed = $('#element-def');


		ed.show();
	}

	function registInputElement () {

		var inputKey = 'data-inputName';

		var es = $('#element-selector');
		var ep = $('#element-preview');

		var inputs = markupDef['inputs'];

		var ul = $('<ul class="nav nav-list">');

		for (var key in inputs) {
			var el = inputs[key];
			var li = $('<li>');
			var a = $('<a>').append(el['name']);
			a.attr(inputKey, key);

			a.on('click', function (e) {
				e.preventDefault();

				ep.empty();

				var ul = $(this).closest('ul');
				ul.find('li.active').removeClass('active');
				$(this).parent().addClass('active');
				var markupKey = $(this).attr(inputKey);

				currentAppendingElem = markupKey;

				var markup = markupDef['inputs'][markupKey]['markup'];

				ep.append(markup);

				ep.find('*').attr('contentEditable', 'true');

				$('firsttable').focus();
			});

			li.append(a);
			ul.append(li);
		}

		es.append(ul);
	}

	function cancelAddElement () {
		$('#element-selector').find('.active').removeClass('active');
		$('#element-preview').empty();
		$('#element-def').hide();
	}

	/**
	 * INIT
	 */
	registInputElement();
	setUifunction();


	/**
	 * HANDLER
	 */

	var handler = {};

	handler.setCurrentElem = function (paramTree) {

		makeSelectorTreeBtn(paramTree);

		var elementIdx = null;
		var elementOption = null;

		if (paramTree != null) {
		
			elementIdx = paramTree[paramTree.length-1]['index'];
			
			currentElem = paramTree[paramTree.length-1];
			currentTree = paramTree;

			var currEl = currentElem['el'];
			var currType = currentElem['type'];

			elementOption = {
				el : currEl,
				type : currType
			};

		} else {

			elementIdx = null;

			elementOption = {
				el : null,
				type : null
			};
		}

		propagateFunction('setCurrentElem', {
			index : elementIdx
		});

		getAvailableClasses(elementOption);
		
	};

	/**
	 * PUBLICS
	 */
	self.propagateFunction = function (func, param) {
		propagateFunction(func, param);
	};

	self.recieve = function (func, param) {
		handler[func](param);
	};

	self.selectParentTree = function () {
		if (currentTree && currentTree.length > 0) {
			currentTree.pop();
			handler.setCurrentElem(currentTree);
		}
	};

	/**
	 * REGIST
	 */

	window.builder = self;

})();