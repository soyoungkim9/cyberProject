<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/menu" prefix="m"%>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
<head>
<title>사이트맵예제</title>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR" />
<link rel="StyleSheet" type="text/css" media="screen, print"
	href="./css/sitemap.css" />
</head>


<body>


<div class="sitemap">

<ul id="primaryNav">

	<m:list depth="1">
		<li class="top"><a href="<m:param attr="url"/>"><m:param attr="name" /></a>


		<m:list depth="2">
			<m:when test="{menu.isFirst}">
				<ul>
			</m:when>
			<li><a href="<m:param attr="url"/>"><m:param attr="name" /></a>



			<m:list depth="3">
				<m:when test="{menu.isFirst}">
					<ul>
				</m:when>


				<li><a href="<m:param attr="url"/>"><m:param attr="name" /></a></li>

				<m:when test="{menu.isLast}">
</ul>
</m:when> </m:list>

</li>
<m:when test="{menu.isLast}">
	</ul>
</m:when> </m:list>


</li>
</m:list>

</ul>
</div>


</body>
</html>