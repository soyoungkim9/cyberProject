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
		<input id="dia2" type="button" value="ajax로 페이지를 불러와서 다이알로그 띄우기" />
		<div class="fr">
			<a href="index.jsp">목록</a>
		</div>
		<div class="clear"></div>
	</h4>
	<div id="preview" class="preview"></div>

	<div id="htmlview">
		<textarea id="html" name="html" style="display: none;">

</textarea>
	</div>

	<div id="scriptview">
		<textarea id="script" name="script" style="display: none;">
<script type="text/javascript">
	//ajax로 페이지를 불러와서 다이알로그 띄우기
	$('#dia2').off('click').on('click', function() {

		var dia2 = ci.dialog.open({
			width : 'auto',
			height : 'auto',
			id : 'dialog_2',
			title : '다이아로그 프로토타입',
			url : 'case2_dialog.jsp', // 페이지 url지정
			ajaxOption : { //일반적인 ajax 옵션들을 여기서 정의할수 있음
				data : 'name=sangwon&age=28'
			},
			focus : $(this)

		});

	});
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