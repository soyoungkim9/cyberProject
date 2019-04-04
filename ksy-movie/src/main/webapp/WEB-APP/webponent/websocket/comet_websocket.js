var ___preWS;

(function() {
	if (window.MozWebSocket) {
		window.WebSocket = MozWebSocket;
		return;
	}

	var isAndroid = navigator.userAgent.match(/Android/i) != null;
	var isChrome = navigator.userAgent.match(/Chrome/i) != null;

	if (isChrome || (!isAndroid && window.WebSocket)) {
		return;
	}

	var isIE = navigator.userAgent.match(/MSIE/i) != null;

	window.WebSocket = function(url) {
		var z = this;
		z.onCloseEvent = true;

		try {
			___preWS.readyState = WebSocket.CLOSED;
		} catch (e) {

		}
		___preWS = this;

		z.readyState = WebSocket.CLOSED;
		var sessionId = Math.random();
		url = url.replace('ws:', 'http:');
		z.__url = url.replace('/websocket', '/comet?' + sessionId);
		// z.__url = url.replace('/websocket', '/comet?' +
		// sessionId+'&gzip=false');

		z.__chkClose = function() {
			if (!z.onCloseEvent)
				return;
			try {
				z.readyState = WebSocket.CLOSED;
				z.onclose();
				z.onCloseEvent = false;
			} catch (e) {
			}
		};

		z.s = function(recvMsg) {
			z.onmessage({
				data : recvMsg
			});
		};
		var xhr = new XMLHttpRequest();

		z.__conn = function() {

			xhr.onreadystatechange = function() {

				var rdS = -1;
				var st = -1;
				try {
					rdS = xhr.readyState;
					st = xhr.status;
				} catch (e) {
				}
				try {
					if (rdS != 1) {
						document.getElementById('st1').innerHTML = rdS;
						document.getElementById('st2').innerHTML = st + ' '
								+ z.readyState;
					}
				} catch (e) {

				}

				if (st == 403) {
					z.readyState = WebSocket.CLOSED;
					if (rdS == 4) {
						z.__chkClose();
					}
					return;
				}

				switch (z.readyState) {

				case WebSocket.CLOSED:
					if (rdS == 4) {
						if (st == 200 && xhr.responseText == 'O') {
							z.readyState = WebSocket.OPEN;
							try {
								z.onopen();
							} catch (e) {
							}
							z.__conn();
						} else {
							try {
								z.onerror();
							} catch (e) {
							}
						}
					}
					break;

				case WebSocket.OPEN:
					if (rdS == 4) {
						var y;
						try {
							y = xhr.responseText;
							if (y == 'O') {
								z.__chkClose();
								return;
							} else if (st == 200 || st == 0) {
								z.__conn();
							}
							eval(y);
						} catch (e) {
							alert(e.message+'\nerror MSG > ' + y);
						}

					}
					break;
				}

			};
			xhr.open('GET', z.__url, true);
			if (isIE) {
				xhr.setRequestHeader("If-Modified-Since",
						"Sat, 1 Jan 2000 00:00:00 GMT");
			}
			xhr.send();
		};
		z.__conn();
		z.send = function(msg) {
			var sx = new XMLHttpRequest();
			sx.open('POST', z.__url, true);
			sx.setRequestHeader("Content-type",
					"application/x-www-form-urlencoded");
			sx.setRequestHeader("Content-length", msg.length);
			sx.setRequestHeader("Connection", "close");
			sx.send(msg);
		};
		

		z.close = function() {
			z.send('^x');
		};

	};

	WebSocket.CONNECTING = 0;
	WebSocket.OPEN = 1;
	WebSocket.CLOSING = 2;
	WebSocket.CLOSED = 3;

	// alert('comet mode ');
})();
