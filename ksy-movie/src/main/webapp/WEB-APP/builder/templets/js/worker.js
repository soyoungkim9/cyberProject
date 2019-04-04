document.domain = 'localhost';

(function () {

	var self = {};

	var builder = window.parent.builder;

	var selectedElem = null;

	/**
	 * PRIVATE
	 */
	
	function makeControllGroupSelectable () {
		$('body').on('click', '.ci-cg', function (e) {

			if (builder) {
				e.stopPropagation();
				e.preventDefault();
			}

			var elem = $(this);

			var elemTree = [];

			var ia = elem.closest('.ci-ia');
			elemTree.push({
				type : 'ci-ia',
				el : ia,
				index : $('body *').index(ia)
			});

			elemTree.push({
				type : 'ci-cg',
				el : elem,
				index : $('body *').index(elem)
			});

			if (builder) {
				builder.recieve('setCurrentElem', elemTree);
			}
			
		});
	}

	function makeControllGroupChildSelectable () {
		$('body').on('click', '.ci-cg > *', function (e) {

			if (builder) {
				e.stopPropagation();
				e.preventDefault();
			}

			var elem = $(this);

			var elemTree = [];

			var ia = elem.closest('.ci-ia');
			elemTree.push({
				type : 'ci-ia',
				el : ia,
				index : $('body *').index(ia)
			});

			var cg = elem.closest('.ci-cg');
			elemTree.push({
				type : 'ci-cg',
				el : cg,
				index : $('body *').index(cg)
			});

			elemTree.push({
				type : 'inputs',
				el : elem,
				index : $('body *').index(elem)
			});

			if (builder) {
				builder.recieve('setCurrentElem', elemTree);
			}
			
		});
	}

	

	/**
	 * INIT
	 */

	makeControllGroupSelectable();
	makeControllGroupChildSelectable();

	/**
	 * HANDLER
	 */

	var handler = {};

	handler.setCurrentElem = function (param) {

		if (selectedElem !== null) {
			selectedElem.removeAttr('data-selected');
		}

		if (param['index']) {

			selectedElem = $('body *').eq(param.index);

			if (builderOption['mode'] === 'mobile') {
				var offset = selectedElem.offset();
				$(window).scrollTop(offset['top'] - 350);
			}

			selectedElem.attr('data-selected', 'true');

		} else {
			selectedElem = null;
		}
		
	};

	handler.modifyClass = function (param) {

		var action = param['action'];

		var currTree = param.tree;
		var currElemInfo = currTree[currTree.length - 1];
		var currElemIdx = currElemInfo['index'];

		var currElem = $('body *').eq(currElemIdx);

		if (action === 'add') {
			currElem.addClass(param.className);
		} else if (action === 'remove') {
			currElem.removeClass(param.className);
		}

		currElemInfo['el'] = currElem;

		currTree[currTree.length - 1] = currElemInfo;

		if (builder) {
			builder.recieve('setCurrentElem', currTree);
		}
		
	};

	handler.makeNewForm = function () {
		$('body').append(markupDef['ci-ia']['form']['markup']);
	};

	handler.addInputElement = function (params) {

		var inputArea = $('body *').eq(params['parentElemIdx']);

		var inputElemInfo = markupDef['inputs'][params['inputName']];

		var $inputElem = null;
		
		if (params['inputMarkup']) {
			$inputElem = $(params['inputMarkup']);
		} else {
			$inputElem = $(inputElemInfo['markup']);
		}

		var parentName = inputElemInfo['parent'];

		var inputElemParentInfo = markupDef[parentName];

		var $parentElem = $(inputElemParentInfo['markup']);

		if (inputElemInfo['parent-require-class']) {
			$parentElem.addClass(inputElemInfo['parent-require-class']);
		}

		$parentElem.append($inputElem);

		$parentElem.find('*').removeAttr('contentEditable');

		inputArea.find('> ul').append($parentElem);

		if (typeof inputElemInfo['afterAppend'] === 'function') {
			inputElemInfo['afterAppend']($inputElem);
		}
	};

	/**
	 * PUBLICS
	 */


	self.responseFunction = function (func, param) {
		handler[func](param);
	};



	/**
	 * REGIST
	 */

	 
	window.worker = self;

})();