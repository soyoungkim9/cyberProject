<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/layout" prefix="layout"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<layout:elementGroup sequencialTypeNames="css,text,js" compressMode="simple">
	<layout:element name="chart" autoDevicePostfix="true" />
</layout:elementGroup>

</head>
<body>
	<div class="stockchart-info">
		<span class="stockchart-name"></span> <span class="stockchart-open"></span>
		<span class="stockchart-high"></span> <span class="stockchart-low"></span>
		<span class="stockchart-close"></span> <span class="stockchart-volume"></span>
	</div>
	<div class="chart01"></div>
	<script type="text/javascript">
		var selector = $(".chart01");
		var f = {};
		f.jcode = 005930;
		var chart = $.stockchart(selector, f);

		callJsMouseInfo = function(param) {
			if (param.data.item.date == " ")
				return;
			var date = param.data.item.date.dateFormat();

			$(".stockchart-name").html(date);
			$(".stockchart-open").html("<span>시</span>&nbsp;" + param.data.item.open.toString().format());
			$(".stockchart-high").html("<span>고</span>&nbsp;" + param.data.item.high.toString().format());
			$(".stockchart-low").html("<span>저</span>&nbsp;" + param.data.item.low.toString().format());
			$(".stockchart-close").html("<span>종</span>&nbsp;" + param.data.item.close.toString().format());
			$(".stockchart-volume").html("<span>거래량</span>&nbsp;" + param.data.item.volume.toString().format());
		};
	</script>
</body>
</html>