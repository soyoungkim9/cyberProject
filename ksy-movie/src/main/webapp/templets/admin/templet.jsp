<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=euc-kr"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/menu" prefix="m"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/layout" prefix="layout"%>

<html>
<head>
<layout:head></layout:head>
<meta name="author" content="CyberImagination Inc." />
<meta name="viewport" content="width=1024" />


<link rel="stylesheet" type="text/css" href="${TEMPLET_DIR}/css/layout.css" />
<link rel="stylesheet" type="text/css" media="print" href="${TEMPLET_DIR}/css/print.css" />
<link rel="stylesheet" type="text/css" href="${TEMPLET_DIR}/css/table.css" />
<link rel="stylesheet" type="text/css" href="${TEMPLET_DIR}/css/form.css" />
<!--[if lte IE 7]>
    	<link rel="StyleSheet" type="text/css" href="${TEMPLET_DIR}/css/layout-ie.css"/>  
    <![endif]-->
    
<script type="text/javascript">

</script>
</head>



<body>
<div id="header_wrap">

	<div id="header">
	
		<div class="fl">
			<img src="${TEMPLET_DIR}/img/sub_topround01.gif" />	
		</div>		
		
		<div id="coreFRAME5_logo">
			<h3 class="dummy">coreFRAME5.0로고</h3>
			<img src="${TEMPLET_DIR}/img/sub_logo.gif" alt="coreFRAME5.0" />
		</div>
		
		<div id="info_wrap">
			<img src="${TEMPLET_DIR}/img/sub_topround02.gif"/>
			<div id="info">	
			<h3 class="dummy">관련 링크</h3>	
			<ul class="linkbar">		
				<li><a href="../case1/index.jsp">HOME</a></li>		
				<li><a href="../common/sitemap.jsp">SITEMAP</a><img src="${TEMPLET_DIR}/img/menu_line.gif"/></li>
				<li><a href="../common/login.jsp">LOGIN</a><img src="${TEMPLET_DIR}/img/menu_line.gif"/></li>
			</ul>
			</div>		
		</div>
	
	</div>

	<div id="menu">
		<h2 class="dummy">주메뉴</h2>
		<ul>
			<m:list depth="1">
				<m:when test="{menu.selected}==true">
					<li class="selected"><strong><m:param attr="name" /></strong>
					<m:isNotLast><img src="${TEMPLET_DIR}/img/menu_line.gif"/></m:isNotLast>				
					</li>
				</m:when>
				<m:when test="{menu.selected}==false">
					<li><a href='<m:param attr="url"/>'><m:param attr="name" /></a>
					<m:isNotLast><img src="${TEMPLET_DIR}/img/menu_line.gif"/></m:isNotLast>	
					</li>
				</m:when>
			</m:list>
		</ul>
	</div>

</div>




<div id="main">

	<div id="left-bar">
	
		<div id="subNavi">
		
		<div class="title"><m:list depth="1">
			<m:when test="{menu.selected}==true">
				<m:param attr="name" />
			</m:when>
		</m:list></div>
		
		<h3 class="dummy">서브메뉴목록</h3>
		<ul id="depth2">
			<m:list depth="2">
				<m:when test="{menu.selected}==true">
					<li class="selected"><m:param attr="name"/>
					<img src="${TEMPLET_DIR}/img/bullet_01.png"/>
					</li>
					<ul id="depth3">
						<m:list depth="3">							
								<m:when test="{menu.selected}==true">
									<li class="selected">- <m:param attr="name" />
									<img src="${TEMPLET_DIR}/img/bullet_02_on.png"/>
									</li>
								</m:when>
								
								<m:when test="{menu.selected}==false">
									<li><a href='<m:param attr="url"/>'>- <m:param attr="name" /></a>
									<img src="${TEMPLET_DIR}/img/bullet_02_off.png"/>
									</li>
								</m:when>							
						</m:list>
					</ul>
				</m:when>
				<m:when test="{menu.selected}==false">
					<li><a href='<m:param attr="url"/>'><m:param attr="name" /></a><img src="${TEMPLET_DIR}/img/bullet_02_off.png"/></li>
				</m:when>
			</m:list>
		</ul>
		
		</div>
	
	<%-- <div class="inform"><m:param attr="desc" /></div> --%>
	
	</div>


<div id="content">
<div class="content_margin">
<div class="title">
	<div class="pageTitle">
		<m:param attr="name" />
	</div>
	<div class="content_nav">
	<m:list depth="1">		
				<m:selected>
					<a href='<m:param attr="url"/>'><m:param attr="name" /></a>
					<m:list depth="2">
						<m:selected> &nbsp;<&nbsp;<a
								href='<m:param attr="url"/>'><m:param attr="name" /></a>
							<m:list depth="3">
								<m:selected> &nbsp;<&nbsp;<a
										href='<m:param attr="url"/>'><m:param attr="name" /></a>
								</m:selected>
							</m:list>
						</m:selected>
					</m:list>
				</m:selected>
			</m:list>
	</div>
</div>

<layout:body>body 내용</layout:body></div>
</div>
</div>

<div id="footer">
<h3 class="dummy">참조 링크</h3>
<div id="info2">
<ul class="linkbar">
	<li><a href="/_info/info04/info04.jsp">참조1</a></li>
	<li><a href="/_help/help01/help01.jsp">참조2</a><img src="${TEMPLET_DIR}/img/reference_bullet.gif"/></li>
	<li><a href="/_help/help11/help11.jsp">참조3</a><img src="${TEMPLET_DIR}/img/reference_bullet.gif"/></li>
</ul>
</div>

<p><img src="${TEMPLET_DIR}/img/ci_logo.gif" alt="CyberImagination"/></p>
	<p class="fr">coreFRAME,anyLOGIC,anyTEMPLET are trademarks of 
	CyberImagination Inc.&nbsp;ⓒ 2011 . All rights reserved. 
	</p> 

</div>

</body>
</html>