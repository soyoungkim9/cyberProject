<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/menu" prefix="m"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/layout" prefix="layout"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<html lang="ko">
<head>
<layout:elementGroup sequencialTypeNames="css,less,text,js">
	<layout:element name="coreframe-client" />
	<layout:element name="dialog" autoDevicePostfix="true" />
	<layout:element name="codemirror" />
</layout:elementGroup>
<link rel="stylesheet" type="text/css" href="base.css">
</head>
<body>
	<jsp:include page="parameters.jsp"></jsp:include>
	<h4>
		<input id="dia1" type="button" value="화면내 HTML로 다이알로그 띄우기" />
		<div class="fr">
			<a href="index.jsp">목록</a>
		</div>
		<div class="clear"></div>
	</h4>
	<div id="preview" class="preview"></div>

	<div id="htmlview">
		<textarea id="html" name="html" style="display: none;">



<div class="dia-content ci-dialog-content">
    다이알로그 내용 입니다~ 다이알로그로 띄우고 싶은 마크업에 
    ci-dialog-content 클래스 주면 숨겨집니다
</div>


</textarea>
	</div>

	<div id="scriptview">
		<textarea id="script" name="script" style="display: none;">
<script type="text/javascript">
	$('#dia1').off('click').on('click', function() {

		var dia1 = ci.dialog.open({
			width : 'auto',
			height : 'auto',
			id : 'dialog_1', // id 지정
			title : '다이아로그 프로토타입', // title 지정
			dom : $('.dia-content'), // 내용으로 들어갈 마크업 지정
			focus : $(this), // 다이알로그 닫친뒤 포커스를 주고싶은 요소 지정

			// dialog객체에 특정 데이터를 저장한다.
			// 데이터를 꺼내쓸때에는 ci.dialog.getData 함수를 이용한다.
			data : {
				a : 'va',
				b : 'vb'
			}
		});

	});

	// 데이터 가져오기;
	//console.log(ci.dialog.getData('dialog_1', 'a')); // returns 'va'
</script>
</textarea>
	</div>
	<div class="clear"></div>


	<script type="text/javascript">
		var delay;
		// Initialize CodeMirror editor with a nice html5 canvas demo.
		var editor = CodeMirror.fromTextArea(document.getElementById('html'), {
			mode : 'text/html',
			tabMode : 'indent'
		});
		editor.on("change", function() {
			clearTimeout(delay);
			delay = setTimeout(updatePreview, 300);
		});

		var delay2;
		var script = CodeMirror.fromTextArea(document.getElementById('script'), {
			mode : 'text/html',
			tabMode : 'indent'
		});
		script.on("change", function() {
			clearTimeout(delay2);
			delay2 = setTimeout(updatePreview, 300);
		});

		function updatePreview() {
			var previewFrame = document.getElementById('preview');
			//var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
			//preview.open();
			//preview.write(editor.getValue());
			//preview.close();
			$(previewFrame).html(editor.getValue() + script.getValue());
		}
		setTimeout(updatePreview, 300);
	</script>
</body>
</html>