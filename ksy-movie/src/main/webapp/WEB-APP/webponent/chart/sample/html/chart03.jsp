<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/layout" prefix="layout"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<layout:elementGroup sequencialTypeNames="css,text,js"
	compressMode="simple">
	<layout:element name="chart" autoDevicePostfix="true" />
</layout:elementGroup>

</head>
<body>
	<div class="chart03"></div>
	<script type="text/javascript">
		var selector = $(".chart03");
		var f = {};
		f.jcode = 005930;
		var chart1 = $.createChart().columnChart.init($(".chart03"), f);
	</script>

	<br /> * document.ready 후 혹은 스크립트를 jsp 하단에 위치
	<br />
	<table width="100%" border="1">
		<tr>
			<td>$.createChart().columnChart.init(<b>selector</b>, <b>form</b>);
			</td>
			<td><ul>
					<li>selector - 차트가 그려지는 DIV selector</li>
					<li>form - form 정보</li>
				</ul></td>
		</tr>
		<tr>
			<td>chart1.inquery(f);</td>
			<td><ul>
					<li>chart1 - createChart() 하고 return 해준 Object</li>
					<li>inquery(f) - 조회 혹은 종목정보가 변경되면 다시 조회하기 위한 함수 <br /> - f는
						form 정보
					</li>
				</ul></td>
		</tr>
		<tr>
			<td>options</td>
			<td><ul>
					<li>url - 데이터 경로</li>
					<li>datatype - json 데이터 사용시 "json"</li>
				</ul></td>
		</tr>
	</table>
</body>
</html>