<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="EUC-KR"%>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title></title>
<script src="./common/js/coreframe_data.js" language="javascript"></script>
<script src="./common/js/prototype-1.6.0.3.js" language="javascript"></script>	
<script src="./common/js/AC_OETags.js" language="javascript"></script>
<script src="./common/js/webponent_stockchart.js" language="javascript"></script>
<script language="javascript">

contextPath = '<%=request.getContextPath()%>';

function init() {
	/*
	webponent.stockchart() �޼ҵ� �Ű����� �� ����

	var option = {'�÷�����Ʈ ��Ÿ�� ���� ���� ��� �� ���ϸ�',
				  '�����ڵ�',
				  'bld1���(������ ����Ʈ)',
				  'bld2���(�����͸� ex : �����װ�)',
				  'bld3���(��Ʈ���� �����϶� ������ ����Ʈ)',
				  'bld4���(��Ʈ���� �����϶� �����͸� ex : �����װ�)',
				  'bld5���(�˻��� ������)'}
	
	webponent.stockchart(
		'��Ʈ�� ��µ� DIV ID��',
		'��µ���Ʈ���� s or f (s : �ǹ�����Ʈ , f : �÷���)',
		'�÷�����Ʈ width ������',
		'�÷�����Ʈ height ������',
		option
	)
	*/	
		
	var option = {chartStyle:'',
			  	  code:'003490',
			  	  bld1:'samples/stockchart/derby_outputList',
			  	  bld2:'samples/stockchart/derby_outputMap',
			  	  bld3:'samples/stockchart/derby_outputList_comparison',
			  	  bld4:'samples/stockchart/derby_outputMap_comparison',
			  	  bld5:'samples/stockchart/derby_suggest'};
	  
	var stockchart = new webponent.stockchart('chart','f','712','550',option);
	stockchart.show();
}

</script>
</head>
<body onload='init()'>

	<div id="chart"></div>

</body>
</html>