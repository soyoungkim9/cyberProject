<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="layout" uri="http://www.cyber-i.com/coreview/layout"%>

<html>
<head>
<title>Web Socket Test</title>
<layout:element name="websocket" autoDevicePostfix="true" />

<style>
	input[type=text]{
		width:200px;
	}
</style>
</head>

<body>
	<script type="text/javascript">
	
		var count=0;
	
		var socket;
		
		
		
		
		function connect() {
			var ipPort = document.getElementById('ipPort').value;
			WEB_SOCKET_IP = ipPort.split(":")[0];
			WEB_SOCKET_PORT = ipPort.split(":")[1];
			
			webSocketInit(setSocketInfo());
		};
		
		function setSocketInfo() {

			return {
				onmessage : function(event) {
					document.getElementById('cnt').innerHTML = ++count;
					
					//alert(event.data);
					var data = event.data;
					document.getElementById('msgblock').innerHTML = data;
					document.getElementById('bsz').innerHTML = data.length;
					data = data.replace(/\\/g, ',^').replace(/\?/g, '`#').replace(
							/\^/g, '~#').replace(/#/g, '","').replace(/~/g, '000')
							.replace(/`/g, '00').replace(/@/g, '0.');

					document.getElementById('msgblock2').innerHTML = data;
					document.getElementById('bsz2').innerHTML = data.length;
				},
				onopen : function(event, socketObj) {
					socket = socketObj;
					
					document.getElementById("socketStatus").innerHTML="Web Socket opened!";
					document.getElementById("socketStatus").style.backgroundColor="#86fda7";
				},
				onclose : function(event) {
					document.getElementById("socketStatus").innerHTML="Web Socket closed!";
					document.getElementById("socketStatus").style.backgroundColor="#fce4dc";
				}
			};
		};
		
		//setTimeout(connect, 1000);

		function send(message) {
			if (!window.WebSocket) {
				return;
			}
			
			//alert(socket.readyState + ' ' + WebSocket.OPEN);
			if (socket.readyState == WebSocket.OPEN) {
				socket.send(message);
			} else {
				alert("The socket is not open.");
			}
		}
		
		function controlSocket(){
			if(document.getElementById("control").value=="pause"){
				if(setRealTimeControl("pause")){
					document.getElementById("control").value="resume";	
				}
			}else{
				if(setRealTimeControl("resume")){
					document.getElementById("control").value="pause";
				}
			}
		}
	</script>
	<form onsubmit="return false;">
	
	<fieldset>
		<input type="text" name="ipPort" id="ipPort" value="192.168.2.1:8081" /> 
		<input type="button" value="connect" onclick="connect()" />
		<span id="socketStatus" style="background-color: #fce4dc;">Web Socket closed!</span>
		<input type="button" id="control" value="pause" onclick="controlSocket()" />
	</fieldset>
	
	<fieldset>
		<input type="text" name="message" value="+005930:bindFormID:x3b" /> 
		<input type="button" value="Send Web Socket Data" onclick="send(this.form.message.value)" />
		</fieldset>
	</form>
	
	상태 :<span id="st1"></span>  &nbsp;  <span id="st2"></span> <br/>
	
	받은갯수 :<span id="cnt"></span> <br/>
	
	원본사이즈:<span id="bsz"></span>
	<textarea style="border:1px solid #000; width:100%;height:150px" id="msgblock"></textarea>
	
	<br/>

	복원사이즈:<span id="bsz2"></span>
	<textarea style="border:1px solid #000; width:100%;height:150px" id="msgblock2"></textarea>

<script>
function getDomaint() {
    var dns, arrDns, str; 
    dns = document.location.href; //<-- 현재 URL 얻어온다
    arrDns = dns.split("//"); //<-- // 구분자로 짤라와서
    str = arrDns[1].substring(0,arrDns[1].indexOf("/")); //<-- 뒤에부터 다음 / 까지 가져온다 
    
    return "wsocket.koreastock.co.kr";
    //return str;
}

var d=getDomaint();
document.getElementById('ipPort').value=d+":8081";
</script>	
	
</body>
</html>
