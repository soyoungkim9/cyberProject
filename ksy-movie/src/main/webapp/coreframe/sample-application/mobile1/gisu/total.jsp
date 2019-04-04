<?xml version="1.0" encoding="EUC-KR" ?>
<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="EUC-KR"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR" />
<title>지수 페이지</title>
 
</head>
<body>

<div id="slideTabBox">
	<div id="topNavi">
	<p>지수 페이지 입니다.</p>
	</div>

	<div id="topNavi1_1" class="contents">
		<jsp:include page="tgisu.jsp" flush="true"/>
	</div><!-- 종합지수 끝 -->
	
	<div id="topNavi1_2" class="contents">
		<jsp:include page="kgisu.jsp" flush="true"/>
	</div><!-- 국내지수 끝 -->
	
	<div id="topNavi1_3" class="contents">
		<jsp:include page="ogisu.jsp" flush="true"/>
	</div><!-- 해외지수 끝 -->
</div>


</body>
</html>