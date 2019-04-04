<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %> 
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>엑셀 업로드</title>
<link rel="stylesheet" type="text/css" href="/common/css/contents.css"/>
<link rel="stylesheet" type="text/css" href="/common/css/pop_common.css"/>


<script type="text/javascript" src="/common/js/common.js"></script>
<script type="text/javascript" src="/common/js/jquery.js"></script>
<script type="text/javascript" src="/common/component/grid/jquery.dataGrid.js"></script>
<script type="text/javascript">
//<![CDATA[
    var grid1;
	
	$(document).ready(function() {    // document 로드가 완료되면 수행되는 이벤트
		grid1 = $.dataGrid('#tbl1', { // tbl1 이라는 아이디를 가지는 테이블을 그리드형태의 테이블로 변경
			'width' : "100%",
			'height' : 240,
			'gridInfo' : true
		});

		$("#ckAll").click(function() {
	        if ($("#ckAll:checked").length > 0) {
	            $("input:checkbox:not(checked)").attr("checked", "checked");
	        } else {
	            $("input:checkbox:checked").attr("checked", "");
	        }
		});

		var sampleFileUrl = $('#sampleFile').val();
		var sampleFileIdx = sampleFileUrl.lastIndexOf("/");
		var fileName = sampleFileUrl.substring(sampleFileIdx+1, sampleFileUrl.length);
		$('#fileName').text(fileName);

		if(fileName != ""){
			$('#fileEx').show();
		}
	});

	function hiddenFrameLoad(){
		if( $("#hiddenFrame").contents().find("body > table > tbody").html() != null ){
			grid1.appendRow($("#hiddenFrame").contents().find("body > table > tbody").html());
			grid1.resizing();
		}
	}
	
	function submitGridData(){
		var form = $('#saveFrm');
		form.empty();
		var excelHeaderArray = $('#excelHeader').val().split('|');
		
		$("tbody > tr", '#tbl1').each(function(i){
			if($("td > input:checkbox:checked", this).length > 0){
				var tdObj = $("td", $(this));
				for(i = 1; i < tdObj.length; i++){
					form.append(" <input type=\"hidden\" id=\""+excelHeaderArray[i-1]+ "\" name=\"" + excelHeaderArray[i-1]+ "\" value=\""+tdObj.eq(i).text()+"\" />");
				}
			}
		});

	    var dataString = form.serialize();
	    
		var param = {
			url:form.attr("action"),
			type:'post',
			data:dataString,
			success : function(data){
				var dataArray = data.split("|");
				if(dataArray[0] == "success"){
					alert(dataArray[1]);
					window.close();
				}else{
					alert(dataArray[1]);
				}
			}
		};
		$.ajax(param);
	}

	function upExcel(){
		var ext = getfileNameExt($('#upFile').val());

		if("xls" == ext ){
			$('#frm').attr("action", "?cmd=uploadExcel");
		}else if("csv" == ext){
			$('#frm').attr("action", "?cmd=uploadCsv");
		}
		
		$('#frm').submit();
	}
	
//]]>
</script>
</head>
<body>
	<div id="pop_container">
		<h1><span class="tit_01">엑셀업로드</span></h1>
	</div>
	
	<div class="mrml15">
	<h2>[엑셀 업로드]</h2>
		<div class="inputArea">
			<input type="hidden" id="excelHeader" value="${excelHeader}" />
			<input type="hidden" id="sampleFile" value="${sampleFile}" />
			<iframe id="hiddenFrame" name="hiddenFrame" onload="hiddenFrameLoad()" style="display: none;"></iframe>
						
			<table class="type1">
				<tr>
					<th>업로드</th>
					<td>
						<div style="float:left;margin-right:5px;">
							<form id='frm' action='?cmd=uploadExcel' method='post' enctype="multipart/form-data" target="hiddenFrame">
								<input type="file" name="uploadExcel" id="upFile" />
								<input type="button" class="btn_blue_b" value="업로드" style="display:inline" onclick="upExcel();"/>
							</form>
						</div>
						<div style="float:left;padding-top:1px;">
							<form id='saveFrm' action="${command}" method='post' >
							</form>
							<input type="button" value="저장"  class="btn_blue_b" onclick="submitGridData(); return false;" style="display:inline"/>
						</div>
					</td>
				</tr>
			</table>
			<div style="height:10px;"></div>
			<div id="fileEx" style="display:none">
				<h3>※ 양식에 맞춰 업로드 해 주시기 바랍니다. (예제 파일 : <a href="${sampleFile}" id="fileName"></a>)</h3>
			</div>
		</div>
		<div class="mt10"> </div>
		<div class="dataArea">
			<c:set var="excelHeaderDesc" value="${param['excelHeaderDesc']}"/>
			<c:set var="excelHeaderDescArray" value="${fn:split(excelHeaderDesc,'|')}"/>
					
			<table id="tbl1" >
				<!-- thead 부분  -->
				<colgroup>
					<col width="50px"/>
					<c:forEach var="excel_HeaderDesc" items="${excelHeaderDescArray}">
						<col width="80px"/>
					</c:forEach>
				</colgroup>
				<thead>
					<tr>
						<th>
							<input id="ckAll" type="checkbox" checked="checked" />
						</th>
						<c:set var="excelHeaderDesc" value="${excelHeaderDesc}"/>
						<c:set var="excelHeaderDescArray" value="${fn:split(excelHeaderDesc,'|')}"/>
						<c:forEach var="excel_HeaderDesc" items="${excelHeaderDescArray}">
							<th>${excel_HeaderDesc }</th>
						</c:forEach>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td></td>
					<c:forEach var="excel_HeaderDesc" items="${excelHeaderDescArray}">
						<td></td>
					</c:forEach>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</body>
</html>