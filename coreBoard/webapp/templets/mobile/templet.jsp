<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/menu" prefix="m"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/layout" prefix="layout"%>
<% 
	String tmpl_dir = (String)request.getAttribute("TEMPLET_DIR");
		if(tmpl_dir ==null) tmpl_dir = request.getContextPath() + "/templets/mobile2";
%>

<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta name="viewport" content="initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=no;" />
	<meta name="keywords"
		content="coreframe, framework, developement, web standard" />
	<meta name="description"
		content="http://m.youfirst.co.kr UI를 coreframe templet 으로 작성"/>
	<meta name="author"
		content="Hyeonil Cho, hicho@cyber-i.com, CyberImagination,Inc." />
	<link href="<%=tmpl_dir%>/css/mobile2.css" rel="stylesheet" type="text/css" media="all" />
	<title>Mobile2 Sample</title>
</head>
<body>
	<!-- [s] head -->
	<div id="head">
		<h1>
			<a href="../index.jsp">
				<img src="<%=tmpl_dir%>/img/logo_youfirst.gif" alt="You First" />
			</a>
		</h1>
		<!-- 광고 영역 -->
		<div class="ad">
			<p>
				<img src="<%=tmpl_dir%>/img/banner_top_sub.gif" alt="자산관리의 정답을 만나다"></img>
			</p>
		</div>
		<!-- sample-application 안의 case1~4때문에 depth=2부터 시작 -->
		<!-- 상단 탭 (Global Navigation bar) -->
		<ul class="GNB">
			<m:list depth="1">
				<m:when test="{m.selected} == true">
					<li> <a href="<m:param attr="url" />" class="selected"><m:param attr="name" /></a></li>
				</m:when>
				<m:when test="{m.selected} == false">
					<li> <a href="<m:param attr="url" />" ><m:param attr="name" /></a> </li>
				</m:when>
			</m:list>
		</ul>
		<!-- 하단 탭 -->
		<div class="tabArea">		
			<ul class="tab">
				<m:list depth="2">
					<m:when test="{m.selected} == true">
						<li style="width:25%" > <a href="<m:param attr="url" />" class="selected"><m:param attr="name" /></a></li>
					</m:when>
					<m:when test="{m.selected} == false">
						<li style="width:25%"> <a href="<m:param attr="url" />" ><m:param attr="name" /></a> </li>
					</m:when>
				</m:list>
			</ul>
			
			<!-- 하단 서브 탭 -->
			<m:list depth="3">
				<m:when test="{m.isLast}==true">
					<ul class="stab">
						<m:list depth="4">
							<m:when test="{m.selected} == true">
								<li> <a href="<m:param attr="url" />" class="selected"> <m:param attr="name" /> </a></li>
							</m:when>
							<m:when test="{m.selected} == false">
								<li> <a href="<m:param attr="url" />" ><m:param attr="name" /></a> </li>
							</m:when>	
						</m:list>
					</ul>
				</m:when>
			</m:list>
		</div>
 	</div>
	<!-- [e] head -->

	<!-- [s] contentArea -->
	<layout:body> body 내용</layout:body>
	<!-- [e] contentArea -->

	<!-- [s] footArea -->
	<div id="footer">
		<p class="prevNext">
			<span class="prev" onclick="history.go(-1);">이전화면</span>
			<span class="top" onclick="top();"> Top </span>
		</p>
		<ul class="fMenu">
			<li class="first">
				<a href="http://www.cyber-i.com" >YouFirst홈 </a>
			</li>
			<li><a href="">지수</a></li>
			<li><a href="">시세</a></li>
			<li><a href="">안내</a></li>
			<li><a href="">알림</a></li>
		</ul>
		<address>Copyleft ~~!</address>
	</div>
	<!-- [e] footArea -->
</body>
</html>