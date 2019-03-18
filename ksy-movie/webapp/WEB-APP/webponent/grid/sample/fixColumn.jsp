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
	var grid3;
	var grid4;
	$(document).ready(function() {
		
		grid1 = $.dataGrid('#tbl1', {
			width 	:  800,
			height 	:  200,
			fixColumn:["id","country"]
		});
		
		grid2 = $.dataGrid('#tbl2', {
			width:"100%"
			,height:"200px"
			,fixColumn:["id","country"]
		});	
		
		grid3 = $.dataGrid('#tbl3', {
			width:"800"
			,height:"200px"
			,fixColumn:["id","country"]
		});	
		
		grid4 = $.dataGrid('#tbl4', {
			width:"100%"
			,height:"200px"
			,fixColumn:["id","country"]
		});	
		
		send();
	});
	
	function send() {
		var f = $('#excform');
		grid1.updateBody(f);
		grid2.updateBody(f);
		grid3.updateBody(f);
		grid4.updateBody(f);
		return false;
	}
</script>

</head>
<body>
	<form id="excform" action="/corelogic/process/samples/database/listCities.xhtml?data-only=true" method="post" onSubmit="return send()">
		<table border="1">
			<tr>
				<th>name : <input type="text" name="name" value="" /></th>
				<td><input type="submit" value="execute" /></td>
			</tr>
		</table>
	</form>
	<h1>특정 컬럼 열을 고정하기</h1>
	
	<h1>[table 800px][col pixel]</h1>
	<div class="visualContainer">
	<table id="tbl1" >
		<colgroup>
			<col id="col_id"             width="100" align="left"   />
			<col id="col_name"           width="150" align="center" />
			<col id="col_country"        width="120" align="center" />
			<col id="col_airport"        width="170" align="left"   />
			<col id="col_language"       width="150" align="right"   />
			<col id="col_countryIsoCode" width="200" align="left"   />
		</colgroup>
		<thead>
			<tr>
				<th>100px</th>
				<th>100px</th>
				<th>120px</th>
				<th>170px</th>
				<th>150px</th>
				<th>200px</th>
			</tr>
		</thead>
		<tbody></tbody>
	</table>
	</div>
	
	<br/>
	
	<h1>[width 100%][col pixel]</h1>
	<div class="visualContainer">
	<table id="tbl2" >
		<colgroup>
			<col id="col_id"             width="100" align="left"   />
			<col id="col_name"           width="150" align="center" />
			<col id="col_country"        width="120" align="center" />
			<col id="col_airport"        width="170" align="left"   />
			<col id="col_language"       width="150" align="right"   />
			<col id="col_countryIsoCode" width="200" align="left"   />
		</colgroup>
		<thead>
			<tr>
				<th>100px</th>
				<th>100px</th>
				<th>120px</th>
				<th>170px</th>
				<th>150px</th>
				<th>200px</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
	</div>
	
	<br/>
	
	<h1>[width 800px][col percent]</h1>
	<div class="visualContainer">
	<table id="tbl3" >
		<colgroup>
			<col id="col_id"             width="10%" align="left"   />
			<col id="col_name"           width="15%" align="center" />
			<col id="col_country"        width="15%" align="center" />
			<col id="col_airport"        width="20%" align="left"   />
			<col id="col_language"       width="20%" align="left"   />
			<col id="col_countryIsoCode" width="20%" align="left"   />
		</colgroup>
		<thead>
			<tr>
				<th>10%</th>
				<th>15%</th>
				<th>15%</th>
				<th>20%</th>
				<th>20%</th>
				<th>20%</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
	</div>
	
	<br/>
	
	<h1>[width 100%][col percent]</h1>
	<div class="visualContainer">
	<table id="tbl4" >
		<colgroup>
			<col id="col_id"             width="10%" align="left"   />
			<col id="col_name"           width="15%" align="center" />
			<col id="col_country"        width="15%" align="center" />
			<col id="col_airport"        width="20%" align="left"   />
			<col id="col_language"       width="20%" align="left"   />
			<col id="col_countryIsoCode" width="20%" align="left"   />
		</colgroup>
		<thead>
			<tr>
				<th>10%</th>
				<th>15%</th>
				<th>15%</th>
				<th>20%</th>
				<th>20%</th>
				<th>20%</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
	</div>

</body>
</html>