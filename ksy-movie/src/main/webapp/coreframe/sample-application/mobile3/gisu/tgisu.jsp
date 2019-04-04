<?xml version="1.0" encoding="EUC-KR" ?>
<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="EUC-KR"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR" />
<title>Insert title here</title>
<link rel="stylesheet" type="text/css" href="../css/style.css" />
 
<script type="text/javascript" language="javascript">
var tid = setInterval("setValue()", 4000);
var tcount = setInterval("setBackground()", 2000);
var count = 1;
var back = 0;

function setValue(){
	document.frm1.kospi1.value = count;
	document.frm2.dawoo1.value = count;
	document.frm2.dawoo2.value = count;
	count++;
}

function setBackground(){
	if(back == 1){
		document.frm1.kospi1.style.backgroundColor = "yellow";
		document.frm2.dawoo1.style.backgroundColor = "yellow";
		document.frm2.dawoo2.style.backgroundColor = "yellow";
	} else {
		document.frm1.kospi1.style.backgroundColor = "white";
		document.frm2.dawoo1.style.backgroundColor = "white";
		document.frm2.dawoo2.style.backgroundColor = "white";
		back = 0;
	}
	back++;	
}

</script>
</head>
<body>
<div>
	<form action="" name="frm1">
	<table class="dateTable" >
	<caption class="tableCaption">
		<img src="../img/gisu/tle_domestic.gif" width="102" height="21" alt="국내지수" />
		<span class="iconLayout">
			<img src="../img/common/refresh.gif" width="36" height="36" alt="" />
		</span>
	</caption>

	<colgroup>
		<col width="25%" />
		<col width="28%" />
		<col width="28%" />
		<col width="19%" />
	</colgroup>
	
	<tbody>
		<tr>
			<td width="500px">KOSPI</td>
			<td><span style="color: #DE2722;" /> <input type="text"
				name="kospi1" value="" size="5"
				style="color: #DE2722; background: none; border: none; text-align: center;" />
			</td>
			<td><span style="color: #DE2722;" />▲ 6.12</td>
			<td><span style="color: #DE2722;" />0.37%</td>
		</tr>

		<tr>
			<td>KOSDAQ</td>
			<td><span style="color: #DE2722;" />519.44</td>
			<td><span style="color: #DE2722;" />▲ 1.87</td>
			<td><span style="color: #DE2722;" />0.36%</td>
		</tr>

		<tr>
			<td>KOSPI200</td>
			<td><span style="color: #DE2722;" />217.35</td>
			<td><span style="color: #DE2722;" />▲ 0.59</td>
			<td><span style="color: #DE2722;" />0.27%</td>
		</tr>

		<tr>
			<td>선물</td>
			<td><span style="color: #DE2722;" />218.35</td>
			<td><span style="color: #DE2722;" />▲ 0.90</td>
			<td><span style="color: #DE2722;" />0.41%</td>
		</tr>
	</tbody>
	</table>
	</form>	
	</div>
	
	<div>
	<form action="" name="frm2">
	<table class="dateTable">
	<caption class="tableCaption">
		<img src="../img/gisu/tle_overseas.gif" width="103" height="21" alt="해외지수" />
	</caption>

	<colgroup>
		<col width="25%" />
		<col width="28%" />
		<col width="28%" />
		<col width="19%" />
	</colgroup>
	
	<tbody>
		<tr>
			<td>다우</td>
			<td><span style="color: #DE2722;">1,426.482</span></td>
			<td><input type="text" name="dawoo1" value=""
				size="5"
				style="color: #DE2722; background: none; border: none; text-align: center;" />
			</td>
			<td><span style="color: #DE2722;">0.42%</span></td>
		</tr>

		<tr>
			<td>S&amp;P선물</td>
			<td><input type="text" name="dawoo2" value=""
				size="5"
				style="color: #3C7FCB; background: none; border: none; text-align: center;" />
			</td>
			<td><span style="color: #3C7FCB;">▼ 1.10</span></td>
			<td><span style="color: #3C7FCB;">0.10%</span></td>
		</tr>

		<tr>
			<td>나스닥</td>
			<td><span style="color: #DE2722;">2,368.46</span></td>
			<td><span style="color: #DE2722;">▲ 9.51</span></td>
			<td><span style="color: #DE2722;">0.40%</span></td>
		</tr>

		<tr>
			<td>나스닥선물</td>
			<td><span style="color: #3C7FCB;">1,921.50</span></td>
			<td><span style="color: #3C7FCB;">▼ 1.00</span></td>
			<td><span style="color: #3C7FCB;">0.05%</span></td>
		</tr>
	</tbody>
	</table>
	</form>
	</div>
	
	<div>
	<table class="dateTable">
	<caption class="tableCaption">
		<img src="../img/gisu/tle_asia.gif" width="123" height="21" alt="아시아지수" />
		<span class="iconLayout">
			<img src="../img/common/refresh.gif" width="36" height="36" alt="" />
		</span>
	</caption>
	
	<colgroup>
		<col width="25%" />
		<col width="28%" />
		<col width="28%" />
		<col width="19%" />
	</colgroup>
	
	<tbody>
		<tr>
			<td>상해종합</td>
			<td><span style="color: #3C7FCB;">3,013.41</span></td>
			<td><span style="color: #3C7FCB;">▼	37.87</span></td>
			<td><span style="color: #3C7FCB;">1.24%</span></td>
		</tr>

		<tr>
			<td>홍콩항셍</td>
			<td><span style="color: #3C7FCB;">21,125.83</span></td>
			<td><span style="color: #3C7FCB;">▼	102.37</span></td>
			<td><span style="color: #3C7FCB;">0.48%</span></td>
		</tr>

		<tr>
			<td>홍콩H주</td>
			<td><span style="color: #3C7FCB;">12,157.56</span></td>
			<td><span style="color: #3C7FCB;">▼	12.48</span></td>
			<td><span style="color: #3C7FCB;">0.10%</span></td>
		</tr>

		<tr>
			<td>니케이</td>
			<td><span style="color: #DE2722;">10,751.26</span></td>
			<td><span style="color: #DE2722;">▲	86.31</span></td>
			<td><span style="color: #DE2722;">0.81%</span></td>
		</tr>
	</tbody>
	</table>
	</div>
	
	<div>
	<table class="dateTable">
	<caption class="tableCaption">
		<img src="../img/gisu/tle_moneyNum.gif" width="154" height="21" alt="금리/환율지수" />
	</caption>
	
	<colgroup>
		<col width="25%" />
		<col width="28%" />
		<col width="28%" />
		<col width="19%" />
	</colgroup>
	
	<tbody>
		<tr>
			<td>원/달러</td>
			<td><span style="color: #3C7FCB;">1,128.30</span></td>
			<td><span style="color: #3C7FCB;">▼	5.30</span></td>
			<td><span style="color: #3C7FCB;">0.47%</span></td>
		</tr>

		<tr>
			<td>엔/달러</td>
			<td><span style="color: #DE2722;">90.56</span></td>
			<td><span style="color: #DE2722;">▲	0.11</span></td>
			<td><span style="color: #DE2722;">0.12%</span></td>
		</tr>

		<tr>
			<td>국고채3년</td>
			<td><span style="color: #3C7FCB;">3.93</span></td>
			<td><span style="color: #3C7FCB;">▼	0.04</span></td>
			<td><span style="color: #3C7FCB;">1.01%</span></td>
		</tr>

		<tr>
			<td>CD(91일)</td>
			<td><span style="color: #3C7FCB;">2.83</span></td>
			<td><span style="color: #3C7FCB;">▼	0.01</span></td>
			<td><span style="color: #3C7FCB;">0.35%</span></td>
		</tr>
	</tbody>
	</table>
	</div>	
</body>
</html>