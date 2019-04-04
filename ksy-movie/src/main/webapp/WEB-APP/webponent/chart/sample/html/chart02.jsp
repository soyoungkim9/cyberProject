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
	<input type="button" onclick="inquery();" value="조회" />
	<br />

	<div class="chart02" style="background: #EEE;"></div>
	<br />
	<br />
	<div class="chart02-vol" style="background: #EEE;"></div>
	<br />

	<script type="text/javascript">
		/* form 정보 */
		var f = {};
		f.jcode = 005930;

		var chart1 = $.createChart().miniCandle.init($(".chart02"), f, {
			"url" : "../../../chart/sample/data/chart02.txt"
		});

		var chart2 = $.createChart().miniCandle.init($(".chart02-vol"), f, {
			"url" : "../../../chart/sample/data/chart02_2.txt"
		}, true);

		function inquery() {
			// 조회하기 버튼 혹은 종목 변경시에 데이터 변경
			// f는 form 관련 정보
			chart1.inquery(f);
		}
	</script>

	* 영역 확인을 위해 임의로 배경처리 했음.
	<br /> * document.ready 후 혹은 스크립트를 jsp 하단에 위치
	<br />
	<table width="100%" border="1">
		<tr>
			<td>$.createChart().miniCandle.init(<b>selector</b>, <b>form</b>,
				<b>options</b>, <b>useVolume</b>);
			</td>
			<td><ul>
					<li>selector - 차트가 그려지는 DIV selector</li>
					<li>form - form 정보</li>
					<li>options - 데이터 URL 등 차트의 옵션들 추가 정보</li>
					<li>useVolume - 거래량이 있는 차트의 경우 true 값을 보내주면 됌</li>
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
					<li>url - 데이터 경로(여기서는 2개로 나뉘어서 임시로 각기 다른 txt 호출되도록 구현)</li>
					<li>usetip - 툴팁 사용 유무(true || false)</li>
					<li>useselectitem - 마우스 위치의 활성 아이템 표현 유무(true || false)</li>
				</ul></td>
		</tr>
	</table>
</body>
</html>