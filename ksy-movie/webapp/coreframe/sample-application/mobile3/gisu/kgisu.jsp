<?xml version="1.0" encoding="EUC-KR" ?>
<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="EUC-KR"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR" />
<title>Insert title here</title>
<link rel="stylesheet" type="text/css" href="../css/style.css" />
<style type="text/css">


</style>
</head>
<body>
<div>
	<table cellspacing="0" class="kidtab">
	
	<colgroup>
		<col width="25%" />
		<col width="25%" />
		<col width="25%" />
		<col width="25%" />
	</colgroup>

		<tr>
			<td id="ktd1" class="ton"><img id="timg1"
				src="../img/gisu/kid_tab1_on.gif" width="50" height="15"
				alt="KOSIPI" /></td>
			<td id="ktd2" class=""><img id="timg2"
				src="../img/gisu/kid_tab2_off.gif" width="69" height="16"
				alt="KOSDAQ" /></td>
			<td id="ktd3" class=""><img id="timg3"
				src="../img/gisu/kid_tab3_off.gif" width="79" height="15"
				alt="KOSIPI200" /></td>
			<td id="ktd4" class=""><img id="timg4"
				src="../img/gisu/kid_tab4_off.gif" width="34" height="18"
				alt="선물" /></td>
		</tr>
	</table>
	</div>

	<div>
	<table id="table_jisu" class="table_jisu">
		<tr>
			<td rowspan="3" width="80px">&nbsp;</td>
			<td rowspan="3">&nbsp;</td>
			<td colspan="3"><b>KOSPI</b></td>
			<td rowspan="3">&nbsp;</td>
			<td rowspan="3" width="67px"
				style="text-align: right; vertical-align: top"><img
				src="../img/common/refresh.gif" width="36" height="36" alt="" /></td>
		</tr>
		<tr>
			<td width="35px" rowspan="2" id="text_giho" class="blueTD">▼</td>
			<td width="80px" id="text_diff" class="blueTD">13.24</td>
			<td width="180px" id="text_jisu" class="blueTD" rowspan="2"
				style="text-align: right; font-size: 1.6em">1,649.50</td>
		</tr>
		<tr>
			<td id="text_drat" class="blueTD">0.80%</td>
		</tr>
	</table>
	</div>

	<table cellspacing="0" class="dtb">
		<colgroup>
			<col width="25%" />
			<col width="25%" />
			<col width="25%" />
			<col width="25%" />
		</colgroup>
		<tr>
			<td id="chartTd1"><img id="charTab1"
				src="../img/gisu/date_1_off.gif" width="21" height="17"
				alt="1일" /></td>
			<td id="chartTd2" class="ton"><img id="charTab2"
				src="../img/gisu/date_2_on.gif" width="36" height="17"
				alt="1개월" /></td>
			<td id="chartTd3"><img id="charTab3"
				src="../img/gisu/date_3_off.gif" width="37" height="17"
				alt="3개월" /></td>
			<td id="chartTd4"><img id="charTab4"
				src="../img/gisu/date_4_off.gif" width="21" height="17"
				alt="1년" /></td>
		</tr>
	</table>

	<div class="dsrs">
	<table cellspacing="0" class="dstb" summary="전일, 거래량, 시가, 거래대금, 고가, 52주최고, 저가, 52주최저 의 정보들이 있습니다.">
	
	<colgroup>
		<col width="65" />
		<col width="110" />
		<col width="110" />
		<col width="100" />
	</colgroup>
	
		<tr>
			<td colspan="4" class="bktd"></td>
		</tr>
		<tr>
			<th>시가</th>
			<td id="text_fid_16">1,663.86</td>
			<th>전일</th>
			<td>1,662.74</td>
		</tr>
		<tr>
			<th>고가</th>
			<td id="text_fid_17">1,667.44</td>
			<th id="text_trqt_tle">거래량</th>
			<td id="text_trqt">337,625</td>
		</tr>
		<tr>
			<th>저가</th>
			<td id="text_fid_18">1,643.51</td>
			<th id="text_tram_tle">거래대금</th>
			<td id="text_tram">3,282,239</td>
		</tr>
		<tr>
			<td colspan="4" class="bktd" style="height: 8px;"></td>
		</tr>
	</table>
	<p class="tableInfo">단위 : 거래량 - 천주, 거래대금 - 백만</p>
	</div>
	
	<div id="daily_div0" style="display: block">
	<table cellpadding="0" cellspacing="0" class="dateTable">
	<caption class="tableCaption"><img src="../img/gisu/tle_Date.gif" width="81" height="21" alt="일자별" /></caption>
	
	<colgroup>
		<col width="25%" />
		<col width="29%" />
		<col width="23%" />
		<col width="23%" />
	</colgroup>
	
	<thead>
		<tr>
			<th class="lfBor">일자</th>
			<th>종가</th>
			<th>대비</th>
			<th class="rgBor">등락률</th>
		</tr>
	</thead>
	
	<tbody>
		<tr>
			<td>10.03.15</td>
			<td><span style="color: #3C7FCB;" />1,649.50</td>
			<td><span style="color: #3C7FCB;" />▼ 13.24</td>
			<td><span style="color: #3C7FCB;" />0.80%</td>
		</tr>

		<tr>
			<td>10.03.12</td>
			<td><span style="color: #DE2722;" />1,662.74</td>
			<td><span style="color: #DE2722;" />▲ 6.12</td>
			<td><span style="color: #DE2722;" />0.37%</td>
		</tr>

		<tr>
			<td>10.03.11</td>
			<td><span style="color: #3C7FCB;" />1,656.62</td>
			<td><span style="color: #3C7FCB;" />▼ 5.62</td>
			<td><span style="color: #3C7FCB;" />0.34%</td>
		</tr>

		<tr>
			<td>10.03.10</td>
			<td><span style="color: #DE2722;" />1,662.24</td>
			<td><span style="color: #DE2722;" />▲ 1.41</td>
			<td><span style="color: #DE2722;" />0.08%</td>
		</tr>

		<tr>
			<td>10.03.09</td>
			<td><span style="color: #DE2722;" />1,660.83</td>
			<td><span style="color: #DE2722;" />▲ 0.79</td>
			<td><span style="color: #DE2722;" />0.05%</td>
		</tr>
	</tbody>
	</table>
	</div>
</body>
</html>