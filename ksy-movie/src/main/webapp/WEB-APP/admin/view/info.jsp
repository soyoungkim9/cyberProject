<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="EUC-KR"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>    
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title>FusionCharts Free Documentation</title>

${import_baseUI}
<script language="JavaScript" src="./view/chart/JSClass/FusionCharts.js"></script>
</head>

<body>
<table width="98%" border="0" cellspacing="0" cellpadding="3" align="center">
  <tr> 
    <td valign="top" class="text" align="center"> <div id="chartdiv" align="center"> 
        FusionCharts. </div>
      <script type="text/javascript">
		   var chart = new FusionCharts("./view/chart/Charts/FCF_MSColumn2DLineDY.swf", "ChartId", "800", "350");
		   chart.setDataURL("http://localhost:8080/coreframe5/apps/admin/chartData");		   
		   chart.render("chartdiv");
		</script> </td>
  </tr>
  <tr>
    <td valign="top" class="text" align="center">&nbsp;</td>
  </tr>
  
</table>

<fieldset>
<table>
<thead>
<tr>
<th>SERVERID</th>
 <th>TM</th>
 <th>TS</th>
 <th>TITLE</th>
</thead>
<tbody>
<c:forEach var="entity" items="${msgList}">
<tr>
 <td>${entity.SERVERID}</td>
 <td>${entity.TSDATE}</td>
 <td>${entity.TSTIME}</td>
 <td>${entity.TITLE}</td>
</c:forEach>
</tbody>
</table>
</fieldset>


</body>
</html>
