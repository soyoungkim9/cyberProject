/**
 * Library for cross browsing, client enviroments controll.
 * 
 * While this is a rewrite, it is heavily inspired by google closure library:
 * 
 * google closure liblary Copyright (c) google Inc, Apache License, Version 2.0
 * 
 * @copyright CyberImagination [All rights reserved]
 * @licence MIT licence
 * @author Sangwon Oh
 */
(function(ci) {

	var self = {
		// platform
		os : {
			name : '',
			platform : '' // TODO
		},

		// renderer
		renderer : {
			name : '',
			version : '',
			isGecko : false,
			isIe : false,
			isOpera : false,
			isWebkit : false
		},

		// browser
		product : {
			name : '', // browser name
			kname : '', // browser korean name
			version : '' // browser version
		},

		version : undefined,

		isAndroid : false,
		isCamino : false,
		isChrome : false,
		isFirefox : false,
		isIe : false,
		isIpad : false,
		isIphone : false,
		isOpera : false,
		isSafari : false,
		isMobile : false,

		isLinux : false,
		isWindows : false,
		isMac : false,
		isX11 : false,

		documnetMode : undefined, // IE specific

		/**
		 * ie일경우 ie7, ie8식으로 버전과함께 반환 이외브라우져일경우 product명만 반환
		 */
		productVersion : '',

		/**
		 * 안전하게 CSS transform3D를 사용할수 있는지
		 */
		canUse3d : false,

		/**
		 * mordern browser인지 파악
		 */
		isMordern : true
	};

	var userAgentString = window.navigator.userAgent;

	function getURLParameter(name) {
		return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [ , null ])[1]);
	}

	// debug mode
	if (getURLParameter('device') == 'mobile') {
		userAgentString = 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3';
	}

	var navigator = window.navigator;
	var platform = navigator && navigator.platform || '';

	// utility functions
	var contains = function(s, ss) {
		return s.indexOf(ss) != -1;
	};

	// initialize browser render and is mobile
	var init = function() {
		var ua = userAgentString;

		self.renderer.isOpera = ua.indexOf('Opera') == 0;
		self.renderer.isIe = !self.renderer.isOpera && contains(ua, 'MSIE');

		if (!self.renderer.isIe && ua.toUpperCase().indexOf('TRIDENT') > -1) {
			self.renderer.isIe = true;
		}

		if (self.renderer.isIe) {
			self.isMordern = false;
		}
		self.renderer.isWebkit = !self.renderer.isOpera && contains(ua, 'WebKit');
		self.isMobile = self.renderer.isWebkit && contains(ua, 'Mobile');
		self.renderer.isGecko = !self.renderer.isOpera && !self.renderer.isWebkit && navigator.product == 'Gecko';

		if (self.renderer.isIe) {
			var doc = document;
			self.documnetMode = doc ? doc['documentMode'] : undefined;
		}

	};

	init();

	// determine browser version
	var determineRendererVersion = function() {
		var version = '', re;

		if (self.renderer.isOpera) {
			var operaVersion = opera.version;
			version = typeof operaVersion == 'function' ? operaVersion() : operaVersion;
		} else {
			if (self.renderer.isGecko) {
				re = /rv\:([^\);]+)(\)|;)/;
			} else if (self.renderer.isIe) {
				re = /MSIE\s+([^\);]+)(\)|;)/;
			} else if (self.renderer.isWebkit) {
				// WebKit/125.4
				re = /WebKit\/(\S+)/;
			}
			if (re) {
				var arr = re.exec(userAgentString);
				version = arr ? arr[1] : '';
			}

		}
		// IE9 can be in document mode 9 but be reporting an inconsistent user
		// agent
		// version. If it is identifying as a version lower than 9 we take the
		// documentMode as the version instead. IE8 has similar behavior.
		// It is recommended to set the X-UA-Compatible header to ensure that
		// IE9
		// uses documentMode 9.
		if (self.renderer.isIe) {

			if (userAgentString.indexOf('TRIDENT') > -1) {
				version = 11;
			}

			var docMode = self.documnetMode;
			if (docMode > parseFloat(version)) {
				return String(docMode);
			}
		}
		return version;
	};

	self.renderer.version = determineRendererVersion();

	// initialize os platform
	var initPlatform = function() {
		if (contains(platform, 'Win')) {
			self.isWindows = true;
			self.os.name = 'windows';
		} else if (contains(platform, 'Mac')) {
			self.isMac = true;
			self.os.name = 'mac';
		} else if (contains(platform, 'Linux')) {
			self.isLinux = true;
			self.os.name = 'linux';
		} else if (contains(navigator['appVersion'] || '', 'X11')) {
			self.isX11 = true;
			self.os.name = 'x11';
		}
	};

	initPlatform();

	// initialize product
	var initProduct = function() {
		var ua = userAgentString;

		if (self.renderer.isOpera) {
			self.isOpera = true;
			self.product.name = 'opera';
			self.product.kname = '오페라';
		} else if (self.renderer.isIe) {
			self.isIe = true;
			self.product.name = 'ie';
			self.product.kname = '인터넷 익스플로러';
		} else if (ua.indexOf('Firefox') != -1) {
			self.isFirefox = true;
			self.product.name = 'firefox';
			self.product.kname = '파이어폭스';
		} else if (ua.indexOf('Camino') != -1) {
			self.isCamino = true;
			self.product.name = 'camino';
			self.product.kname = '카미오';
		} else if (ua.indexOf('iPhone') != -1 || ua.indexOf('iPod') != -1) {
			self.isIphone = true;
			self.product.name = 'iPhone';
			self.product.kname = '아이폰';
		} else if (ua.indexOf('iPad') != -1) {
			self.isIpad = true;
			self.product.name = 'iPad';
			self.product.kname = '아이패드';
			self.isMobile = false; // 아이패드는 PC취급을 한다.
		} else if (ua.indexOf('Android') != -1) {
			self.isAndroid = true;
			self.product.name = 'android';
			self.product.kname = '안드로이드';
		} else if (ua.indexOf('Chrome') != -1) {
			self.isChrome = true;
			self.product.name = 'chrome';
			self.product.kname = '크롬';
		} else if (ua.indexOf('Safari') != -1) {
			self.isSafari = true;
			self.product.name = 'safari';
			self.product.kname = '사파리';
		}
	};

	initProduct();

	// initialize product version
	var initProductVersion = function() {
		if (self.isFirefox) {
			// Firefox/2.0.0.1 or Firefox/3.5.3
			return getFirstRegExpGroup(/Firefox\/([0-9.]+)/);
		}
		if (self.isIe || self.isOpera) {
			return self.renderer.version;
		}

		if (self.isChrome) {
			// Chrome/4.0.223.1
			return getFirstRegExpGroup(/Chrome\/([0-9.]+)/);
		}
		if (self.isSafari) {
			// Version/5.0.3
			//
			// NOTE: Before version 3, Safari did not report a product version
			// number.
			// The product version number for these browsers will be the empty
			// string.
			// They may be differentiated by WebKit version number in
			// goog.userAgent.
			return getFirstRegExpGroup(/Version\/([0-9.]+)/);
		}

		if (self.isIphone || self.isIpad) {
			// Mozilla/5.0 (iPod; U; CPU like Mac OS X; en) AppleWebKit/420.1
			// (KHTML, like Gecko) Version/3.0 Mobile/3A100a Safari/419.3
			// Version is the browser version, Mobile is the build number. We
			// combine
			// the version string with the build number: 3.0.3A100a for the
			// example.
			var arr = execRegExp(/Version\/(\S+).*Mobile\/(\S+)/);
			if (arr) {
				return arr[1] + '.' + arr[2];
			}
		} else if (self.isAndroid) {
			// Mozilla/5.0 (Linux; U; Android 0.5; en-us) AppleWebKit/522+
			// (KHTML, like Gecko) Safari/419.3
			//
			// Mozilla/5.0 (Linux; U; Android 1.0; en-us; dream)
			// AppleWebKit/525.10+
			// (KHTML, like Gecko) Version/3.0.4 Mobile Safari/523.12.2
			//
			// Prefer Version number if present, else make do with the OS number
			var version = getFirstRegExpGroup(/Android\s+([0-9.]+)/);
			if (version) {
				return version;
			}
			return getFirstRegExpGroup(/Version\/([0-9.]+)/);
		} else if (self.isCamino) {
			return getFirstRegExpGroup(/Camino\/([0-9.]+)/);
		}

		return '';

		function getFirstRegExpGroup(re) {
			var arr = execRegExp(re);
			return arr ? arr[1] : '';
		}

		function execRegExp(re) {
			return re.exec(userAgentString);
		}
	};

	self.version = parseFloat(initProductVersion());

	self.productVersion = self.product.name === 'ie' ? self.product.name + self.version : self.product.name;

	if (self.isIphone || (self.isAndroid && self.version > 3)) {
		self.canUse3d = true;
	}

	// add class to html element
	var addUserAgentClass = function() {
		var htmlElem = document.getElementsByTagName('html')[0];
		var classString = '';

		classString += self.os.name === '' ? '' : self.os.name + ' ';
		classString += self.product.name + ' ';
		classString += self.product.name + self.version;

		if (self.isMobile) {
			classString += ' ' + 'mobile';
		}

		if (self.isMordern && !(self.isWindows && self.isSafari)) {
			classString += ' ' + 'mordern-browser';
		}

		htmlElem.className = classString;
	};

	addUserAgentClass();

	// regist self object to global scope
	if (!ci)
		window.ci = ci = {};
	ci.agent = self;

})(window.ci);