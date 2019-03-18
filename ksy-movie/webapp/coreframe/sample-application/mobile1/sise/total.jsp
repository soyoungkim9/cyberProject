<?xml version="1.0" encoding="EUC-KR" ?>
<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="EUC-KR"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR" />
<title>시세 페이지</title>
 
</head>
<body>

<div id="slideTabBox">
	<div id="topNavi">
	<p>시세 페이지 입니다.</p>
	</div>
			
	<div id="topNavi1_2" class="contents">
		<%@include file="ksise.jsp" %>
	</div><!-- 국내시세 끝 -->
	
	<div id="topNavi1_3" class="contents">
		<%@include file="osise.jsp" %>
	</div><!-- 해외시세 끝 -->
</div>

</body>
</html>