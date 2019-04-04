<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/menu" prefix="m"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/layout" prefix="layout"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<html lang="ko">
<head>
<layout:elementGroup sequencialTypeNames="css,less,text,js">
	<layout:element name="tab" autoDevicePostfix="true" />
	<layout:element name="codemirror" />
</layout:elementGroup>
<link rel="stylesheet" type="text/css" href="base.css">
</head>
<body>
	<jsp:include page="parameters.jsp"></jsp:include>
	<h4>
		<div class="fl">DOM TAB</div>
		<div class="fr">
			<a href="index.jsp">목록</a>
		</div>
		<div class="clear"></div>
	</h4>
	<div id="preview" class="preview"></div>

	<div id="htmlview">
		<textarea id="html" name="html" style="display: none;">



<!-- TAB MARKUP : START -->
    <div class="mytab1 ci-tab">

        <!-- 오른쪽 상단 이용할수 있는 부분 -->
        <div class="extra-space"></div>

        <!-- TAB 셀렉터 : START -->
        <ul class="tab-selector">
            <li>
                <a href="#">TAB NAME 1</a>
            </li>
            <li class="active">
                <a href="#">TAB NAME 2</a>
            </li>
            <li>
                <a href="#">TAB NAME 3</a>
            </li>
            <li>
                <a href="#">TAB NAME 4</a>
            </li>
        </ul>
        <!-- TAB 셀렉터 : END -->

        <!-- TAB 폐널 : START -->
        <ul class="tab-panel">
            <li>
                <h3 class="blind">TAB NAME 1</h3>
                <div class="panel">
                    dom PANEL1
                </div>
            </li>
            <li>
                <h3 class="blind">TAB NAME 2</h3>
                <div class="panel">
                    dom PANEL2
                </div>
            </li>
            <li>
                <h3 class="blind">TAB NAME 3</h3>
                <div class="panel">
                    dom PANEL3
                </div>
            </li>
            <li>
                <h3 class="blind">TAB NAME 4</h3>
                <div class="panel">
                    dom PANEL4
                </div>
            </li>
        </ul>
        <!-- TAB 폐널 : END -->

    </div>
    <!-- TAB MARKUP : END -->


</textarea>
	</div>

	<div id="scriptview">
		<textarea id="script" name="script" style="display: none;">
<script type="text/javascript">
	var myTab = ci.tab.init($('.mytab1'), {
		defaultTabIndex : 2,
		mode : 'dom', // 생략하면 dom모드
		panelOpen : function(e, s, p) {
			console.log('client panel opened', arguments);
		},
		panelClose : function(e, s, p) {
			console.log('client panel closed', arguments);
		}
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