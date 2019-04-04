var WEB_SOCKET_IP = "wsocket.hanaw.com";
var WEB_SOCKET_PORT = "80";

try {
	WEB_SOCKET_IP = get__WEBSOCKET_IP();// globalVar.jsp
	WEB_SOCKET_PORT = get__WEBSOCKET_PORT();
} catch (e) {

}

// Set URL of your WebSocketMain.swf here:
var WEB_SOCKET_SWF_LOCATION = "/WEB-APP/webponent/websocket/WebSocketMain.swf";
// Set this to dump debug message from Flash to console.log:
var WEB_SOCKET_DEBUG = false;
var SOCKET;

var webSocketSetTimeTimer = null;
var WEB_SOCKET_INFO = { // 템플릿에 상관없이 공통적으로 실행되는 이벤트
	onmessage : function(event) {
		manager.onDataReceive(event.data);
	},
	onopen : function(event, socket) {
		var realTimeState = "true";
		try{
			realTimeState = ci.util.getCookie("wts_state_realtime");
		}catch(e){}
		if (realTimeState == "false") {
			setRealTimeControl("pause");
		}

		manager.setWebSocket(socket);
		$(document).trigger('socket:open');
	},
	onclose : function(event) {
		clearTimeout(webSocketSetTimeTimer);
		webSocketSetTimeTimer = setTimeout(function() {
			startWebsocket();
		}, 10000);//10초마다 재접속 시도.
		
		$(document).trigger('socket:close');
	},
	onerror : function(event){
		
	},
	param : undefined//웹소켓 연결시의 parameter
	
};

//$(document).bind('socket:open', function() {  });
//$(document).bind('socket:close',function() {  });

function startWebsocket(socketInfo) {
	//console.log("startWebsocket["+getSocketState()+"] : "+new Date());
	
	if (getSocketState() == WebSocket.OPEN) {
		return; // 이미 열려 있음
	}

	if (socketInfo !== undefined) {
		for ( var i in socketInfo){
			if(socketInfo.hasOwnProperty(i)){
				WEB_SOCKET_INFO[i] = socketInfo[i];
			}
		}
		
		if(socketInfo["WEB_SOCKET_IP"]){
			WEB_SOCKET_IP = socketInfo["WEB_SOCKET_IP"];
		}
		
		if(socketInfo["WEB_SOCKET_PORT"]){
			WEB_SOCKET_PORT = socketInfo["WEB_SOCKET_PORT"];
		}
	}
	
	webSocketInit(WEB_SOCKET_INFO);// websocketinfo.js
}

function webSocketInit(socketInfo) {
	try{
		var isIE = navigator.userAgent.match(/MSIE/i) != null;
		if (isIE && swfobject.getFlashPlayerVersion().major < 10) {
			if (confirm("실시간 데이터 서비스를 위해선 Flash Player 10.0.0 이상 버전이 필요 합니다. 설치페이지로 이동하시겠습니까?")) {
				//location.href = "http://get.adobe.com/kr/flashplayer/";
				var openNewWindow = window.open("about:blank");
				openNewWindow.location.href = "http://get.adobe.com/kr/flashplayer/";
			}
		}
	}catch(e){
		
	}
	
	
	try {
		if (WebSocket.loadFlashPolicyFile) {
			WebSocket.loadFlashPolicyFile("xmlsocket://" + WEB_SOCKET_IP + ":" + WEB_SOCKET_PORT);
		}
	} catch (e) {
		alert(e.message);
		return;
	}

	// SOCKET을 열기전 존재하면 close한다
	if (SOCKET !== undefined && SOCKET.close !== undefined) {
		SOCKET.close();
	}
	
	try{
		SOCKET = new WebSocket("ws://" + WEB_SOCKET_IP + ":" + WEB_SOCKET_PORT + "/websocket");
	}catch(e){
		console.log(e.message);
		//https통신일경우 에러 (IE10, FF)
		SOCKET = new WebSocket("wss://" + WEB_SOCKET_IP + ":" + WEB_SOCKET_PORT + "/websocket");
	}
	
	SOCKET.onmessage = function(event) {
		socketInfo.onmessage(event);
	};

	SOCKET.onopen = function(event) {
		/*요긴 미구현
		if(socketInfo.param!==undefined){
			SOCKET.send("WEBSOCKET:ONOPEN@"+socketInfo.param);
		}
		*/
		socketInfo.onopen(event, SOCKET);
	};

	SOCKET.onclose = function(event) {
		socketInfo.onclose(event);
	};

	SOCKET.onerror = function(event) {
		socketInfo.onerror(event);
	};

	return SOCKET;
}

function getSocketState() {
	// [ 0 : WebSocket.CONNECTING ] [ 1 : WebSocket.OPEN ] [ 2 : WebSocket.CLOSING ] [ 3 : WebSocket.CLOSED ]
	if (!window.WebSocket) {
		return false;
	}

	if (SOCKET === undefined) {
		return WebSocket.CLOSED;
	}
	return SOCKET.readyState;
}

// status[pause|resume]
function setRealTimeControl(status, changeFunction) {
	if (!window.WebSocket) {
		return false;
	}

	if (getSocketState() == WebSocket.OPEN) {
		// (++, --)가 결정하며 뒤에 :resume:real등은 의미 없는 데이터..
		var message = "++:resume:real";
		if (status == "pause") {
			message = "--:pause:real";
		} else {
			message = "++:resume:real";
		}

		SOCKET.send(message);

		return true;
	} else {
		alert("The WebSocket is not open.");
	}

	return false;
}