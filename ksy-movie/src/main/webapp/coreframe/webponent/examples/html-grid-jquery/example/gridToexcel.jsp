<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ page import="java.util.*" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>엑셀 다운로드</title>
<link rel="stylesheet" type="text/css" href="/common/css/contents.css"/>
<link rel="stylesheet" type="text/css" href="/common/css/pop_common.css"/>

<script type="text/javascript" src="/common/js/jquery.js"></script>
<script type="text/javascript" src="/common/js/common.js"></script>
<script type="text/javascript">

	function excelDown(){
		var frm = $('#excelForm');
		var frmDiv = $('#formDiv').empty();
		var frmEle = "";
		
		$("TR", $('#excelInfo')).each(function(k){
			var tr = $(this);
			if($("TD > INPUT[type=\"checkbox\"]", tr).is(':checked') == true){

				var key = tr.attr("id").split("#")[0];
				var cellConvert = tr.attr("id").split("#")[1];

				frmEle += '<input type="hidden" name="header" value="'+ $("TD", tr).eq(1).text() + '" />';
				frmEle += '<input type="hidden" name="key" value="'+ key +'" />';
				frmEle += '<input type="hidden" name="cellConvert" value="'+ cellConvert +'" />';
				frmEle += '<input type="hidden" name="alignSet" value="'+ $("input[type=\"radio\"]:checked", tr).val() +'" />';
			}
		});

		var searchDataArray = decodeURI($('#searchData').val()).split("&");

		for(var i=0, ic=searchDataArray.length; i<ic; i++){
			var data = searchDataArray[i].split("=");
			frmEle += '<input type="hidden" name="'+data[0]+'" value="'+ data[1] +'" />';
		}
		
		frmEle += '</form>';
		frmDiv.append(frmEle);
		frm.submit(); 
	}
		
	function checkAll(obj){
	      if ( $("[name=check_all]").is(":checked")){       
	           $("input[type=checkbox]").attr("checked","checked");     
	      } else{               
	    	  $("input[type=checkbox]").attr("checked","");       
	      } 
	}
	
</script>
</head>
<body>
	<iframe id='downloadFrame' name='downloadFrame' style='display:none' ></iframe>
	<form action='/transform/' method='post' target='downloadFrame' id='excelForm'>
		<input type="hidden" id="bldPath" name="bldPath" value="<c:out value="${param['bldPath'] }" />" />
		<input type="hidden" id="fileName" name="fileName" value="<c:out value="${param['fileName'] }" />" />
		<input type="hidden" id="searchData" value="<c:out value="${param['searchData'] }" />" />
		
		<input type="hidden" name="gridRowsPerPage" value="50000" />
		<input type="hidden" name="gridCurrentPage" value="0" />
		<input type="hidden" name="gridStartIndex" value="0" />
		<input type="hidden" name="gridEndIndex" value="0" />
    			
		<div id="formDiv"></div>
	</form>
	
	<div id="pop_container">
		<h1><span class="tit_01">엑셀다운로드</span></h1>
	</div>
	<div class="mrml15">
		<div class="fl"><h2>[엑셀 다운로드]</h2></div>
		<div class="fr">
			<input type="button" class="btn_purple" value="다운로드" onclick="excelDown();"/>
			<input type="button" class="btn_purple" value="창닫기" onclick="self.close();"/>
		</div>
		<div class="clear"></div>
		<div class="inputArea">
			<table class="type1" id="excelInfo">
				<tr>
					<th><input type="checkbox"  name="check_all" onclick="checkAll(this)" class="checkbox" checked="checked"/></th>
					<th>칼럼명</th>
					<th>정렬</th>
				</tr>
					<c:set var="excelHeader" value="${param['excelHeader']}"/>
					<c:set var="excelHeaderArray" value="${fn:split(excelHeader,'|')}"/>
					<c:set var="excelHeaderDesc" value="${param['excelHeaderDesc']}"/>
					<c:set var="excelHeaderDescArray" value="${fn:split(excelHeaderDesc,'|')}"/>
					<c:set var="cellConvert" value="${param['cellConvert']}"/>
					<c:set var="cellConvertArray" value="${fn:split(cellConvert,'|')}"/>
					
				<c:forEach var="excel_HeaderDesc" items="${excelHeaderDescArray}" varStatus="idx">
					<tr id="${excelHeaderArray[idx.index]}#${cellConvertArray[idx.index]}">
						<td class="tac"><input type="checkbox" name="${idx.index}" checked="checked"/></td>
						<td class="tal">${excel_HeaderDesc }</td>
						<td class="tac">
							<input type="radio" name="align_${idx.index}" value="left" >좌</input>
							<input type="radio" name="align_${idx.index}" value="center" checked="checked">중앙</input>
							<input type="radio" name="align_${idx.index}" value="right">우</input>
						</td>
					</tr>
				</c:forEach>
			</table>
		</div>

	</div>
</body>
</html>