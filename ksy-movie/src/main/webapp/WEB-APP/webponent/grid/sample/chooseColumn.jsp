<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/menu" prefix="m"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/layout" prefix="layout"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<html lang="ko">
<head>
<layout:elementGroup sequencialTypeNames="css,less,text,js">
	<layout:element name="grid" />
</layout:elementGroup>

<script type="text/javascript">
	var grid1;
	var grid2;
	$(document).ready(function() {
		grid1 = $.dataGrid('#tbl1', {
			width 	:  "100%"
			,height :  200
			,chooseColumn:["name","country","airport"]
		});
		
		grid2 = $.dataGrid('#tbl2', {
			width 	:  "100%"
			,height :  200
		});
		
		
		send();
	});
	
	function send() {
		var f = $('#excform');
		grid1.updateBody(f);
		grid2.updateBody(f);
		return false;
	}
</script>

</head>
<body>
	<form id="excform" action="/corelogic/process/samples/database/listCities.xhtml?data-only=true" method="post" onSubmit="return send()">
		<table border="1">
			<tr>
				<th>name : <input type="text" name="name" value="" />
				</th>
				<td><input type="submit" value="execute" />
				</td>
			</tr>
		</table>
	</form>
	<h1>특정 컬럼 열을 선택하여 보기</h1>
	<!-- 
	<input type="button" value="removeCSS" onclick="removeCss('tbl1_internalCss')"/>
	<input type="button" value="showCol" onclick="showCol('col_countryIsoCode')"/>
	<input type="button" value="hideCol" onclick="hideCol('col_countryIsoCode')"/>
	 -->
	
	<h2>option추가| chooseColumn:["name","airport","country"]</h2>
	<table id="tbl1">
		<colgroup>
			<col id="col_id" width="100px" align="left" />
			<col id="col_name" width="200px" align="left" />
			<col id="col_country" width="100px" align="center" />
			<col id="col_airport" width="100px" align="right" />
			<col id="col_language" width="150px" align="left" />
			<col id="col_countryIsoCode"  align="left" />
		</colgroup>
		<thead>
			<tr>
				<th>id</th>
				<th>name</th>
				<th>country</th>
				<th>airport</th>
				<th>language</th>
				<th>countryIsoCode</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>
		</tbody>
	</table>
	
	<h2>class추가| class="choosable" </h2>
	<table id="tbl2">
		<colgroup>
			<col id="col_id" width="100px" align="left" />
			<col id="col_name" width="200px" align="left" class="choosable"/>
			<col id="col_country" width="100px" align="center" class="choosable"/>
			<col id="col_airport" width="100px" align="right" class="choosable"/>
			<col id="col_language" width="150px" align="left" />
			<col id="col_countryIsoCode"  align="left" />
		</colgroup>
		<thead>
			<tr>
				<th>id</th>
				<th>name</th>
				<th>country</th>
				<th>airport</th>
				<th>language</th>
				<th>countryIsoCode</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>
		</tbody>
	</table>
</body>
</html>