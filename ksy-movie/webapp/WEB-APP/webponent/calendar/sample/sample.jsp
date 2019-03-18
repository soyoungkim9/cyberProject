<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/menu" prefix="m"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/layout" prefix="layout"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<html lang="ko">
<head>
<layout:elementGroup sequencialTypeNames="css,less,text,js">
    <layout:element name="calendar" />
    <layout:element name="codemirror" />
</layout:elementGroup>
<link rel="stylesheet" type="text/css" href="/WEB-APP/webponent/databind/sample/data-bind.css">
</head>
<body>

<h4><div class="fl">startCalendar, endCalendar</div><div class="fr"><a href="index.jsp">목록</a></div><div class="clear"></div></h4>
<div id="preview" class="preview"></div>

<div id="htmlview">
<textarea id="html" name="html" style="display: none;">


<div class="fl examBox">
    <h5>month 달력</h5>
    <input type="text" class="j-calendar" name="cal" id="type" value="" title="날짜" />
</div>


<div class="fl examBox">
    <h5>delim 없음</h5>
    <input type="text" class="j-calendar" name="cal0" id="delim" value="" title="날짜" />
</div>

<div class="fl examBox">
    <h5>오늘이후부터 선택가능</h5>
    <input type="text" class="j-calendar" name="cal1" id="startRange" value="" title="날짜" />
</div>

<div class="fl examBox">
    <h5>오늘이전까지 선택가능</h5>
    <input type="text" class="j-calendar" name="cal2" id="endRange"  value="" title="날짜"/>
</div>

<div class="fl examBox">
    <h5>국경일 선택 불가(음력 제외)</h5>
    <input type="text" class="j-calendar" name="cal3" id="holiday"  value="" title="날짜"/>
</div>

<div class="fl examBox">
    <h5>주말 선택 불가</h5>
    <input type="text" class="j-calendar" name="cal4" id="weekend"  value="" title="날짜"/>
</div>

<div class="fl examBox">
    <h5>label 설정달력</h5>
    <input type="text" class="j-calendar" name="cal5" id="label"  value="" title="날짜"/>
</div>

<div class="fl examBox">
    <h5>lang 설정달력</h5>
    <input type="text" class="j-calendar" name="cal6" id="lang"  value="" title="날짜"/>
</div>

<div class="fl examBox">
    <h5>초기날짜 없음</h5>
    <input type="text" class="j-calendar" name="cal7" id="hasdefaultToday"  value="" title="날짜"/>
</div>

<div class="fl examBox">
    <h5>1년 1달전</h5>
    <input type="text" class="j-calendar" name="cal8" id="defaultDay"  value="" title="날짜"/>
</div>

<div class="fl examBox">
    <h5>위치변경</h5>
    <input type="text" class="j-calendar" name="cal9" id="position"  value="" title="날짜"/>
</div>


<div class="fl examBox">
    <h5>날짜 시작일~종료일</h5>
    <input type="text" class="j-calendar" name="startCalender" id="startCalender" value="" title="기간 시작일" />~
    <input type="text" class="j-calendar" name="endCalendar"   id="endCalendar"   value="" title="기간 종료일"/>
</div>

<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><!-- 공간 넓히기용 -->
</textarea>
</div>

<div id="scriptview">
<textarea id="script" name="script" style="display: none;">
<script type="text/javascript">


//month 달력
$.calendar($("#type"),{
    type:"month"
});

//delim 없음
$.calendar($("#delim"),{
    delim:""
});

//오늘이후부터 선택가능
$.calendar($("#startRange"),{
    startRange:"today"
});

//오늘이전까지 선택가능
$.calendar($("#endRange"),{
    endRange:"today"
});

//국경일 선택 불가(음력 제외)
$.calendar($("#holiday"),{
    holiday:false
});

//주말 선택 불가
$.calendar($("#weekend"),{
    weekend:false
});

//label 설정달력
$.calendar($("#label"),{
    label:"개교기념일"
});

//lang 설정달력
$.calendar($("#lang"),{
    lang:"eng"
});

//초기날짜 없음
$.calendar($("#hasdefaultToday"),{
	hasdefaultToday:false
});

//1년 1달전
$.calendar($("#defaultDay"),{
	defaultDay:[-1,-1,0]
});

//위치변경
$.calendar($("#position"),{
	indiLeft:96, left : -70
});

//시작일 종료일
var startCalendar = $("#startCalender");
var endCalendar   = $("#endCalendar");
    
$.calendar(startCalendar,{
    defaultDay:[0,0,-7],//일주일전
    endCalendar:endCalendar
});

$.calendar(endCalendar,{
    startCalendar:startCalendar
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
        $(previewFrame).html(editor.getValue()+script.getValue());
    }
    setTimeout(updatePreview, 300);
</script>
</body>
</html>