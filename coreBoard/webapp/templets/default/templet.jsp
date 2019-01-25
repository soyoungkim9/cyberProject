<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=euc-kr"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/menu" prefix="m"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/layout" prefix="layout"%>

<html>
<head>
<layout:head></layout:head>
<meta name="author" content="CyberImagination Inc." />
<meta name="viewport" content="width=1024" />
<layout:elementGroup sequencialTypeNames="css,less,text,js">
	<layout:element name="ksy.common" autoDevicePostfix="true"/>
	<layout:element name="ksy.common1" autoDevicePostfix="true"/>
	<layout:element name="ksy.common2" autoDevicePostfix="true"/>

</layout:elementGroup>
<!--<link rel="stylesheet" type="text/css" href="${TEMPLET_DIR}/css/layout.css" />-->
</head>

<body>
<!--
<div id="menu">
	<ul>
		<m:list depth="1">
			<m:when test="{menu.selected}==true">
				<li class="selectedBoard"><m:param attr="name" /></li>
			</m:when>
			<m:when test="{menu.selected}==false">
				<li><a href='<m:param attr="url"/>'><m:param attr="name" /></a>
				</li>
			</m:when>
		</m:list>
	</ul>
</div>
-->
<div id="boardContent">
	<div class="content_nav">
		<m:list depth="1">
			<m:selected>
				<m:list depth="2">
					<m:selected> &nbsp;<&nbsp;<a
							href='<m:param attr="url"/>'><m:param attr="name" /></a>

					</m:selected>
				</m:list>
			</m:selected>
		</m:list>
		<layout:body></layout:body>
	</div>
</div>
</body>
</html>