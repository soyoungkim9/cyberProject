<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=EUC-KR" pageEncoding="EUC-KR"%>

<html>
<head>
<title>BLD및 JSP를 이용한 coreframe 개발방법(case1) 개요</title>
<meta name="keywords"
	content="coreframe, framework, developement, web standard" />
<meta name="description"
	content="coreframe을 통한 개발방법중  BLD및 JSP 만을 이용한 개발방법입니다." />
<meta name="author"
	content="Sungkwon Kim, manpower@cyber-i.com, CyberImagination,Inc." />
</head>

<body>
<h3>case 1 : BLD + JSP</h3>

<ol>
	<li>Data access 부분은 BLD(Business Logic Descriptor)가 전담한다.</li>
	<li>데이터 호출 및 HTML 출력(view)을 JSP 에서 모두 처리한다.</li>
	<li>BLD와 JSP 2개의 소스 작성만으로 쉽게 구현할 수 있다.</li>
	<li>가장 쉽게 구현할 수 있는 구조이지만, JSP내에 control 로직이 들어가므로, 로직이 복잡할 경우 JSP
	소스코드가 복잡해질 가능성이 있다.</li>
</ol>

<div class="note">

<p>본 예제들은 데이터는 내장DB인 derbyPool을 이용하여 입/출력을 한다.</p>

<p>본 예제들은 coreframe내의 coreview module의 Template 기능에 의해 메뉴출력 및 디자인이
본문 페이지와 결합 상태로 출력되는 예제이다.MS PowerPoint 의 마스터 페이지와 각 개별페이지와의 관계와 유사하다.</p>
<ul>

	<li>기본적으로 ./templates/standard/template.jsp 을 사용하여 표시된다.</li>
	<li>다른 template등은 ./templates 디렉토리에 등록되어 있다.</li>
	<li>다른 templates으로 변경하고자 하는 경우 web 관리툴에서 수정하거나
	./WEB-INF/config/layout.xml 에서 기본 template을 수정한다.</li>
	<li>메뉴별 template 를 적용하고자 하는 경우 web 관리툴에서 수정하거나
	./WEB-INF/config/sitemap.xml 을 수정한다.</li>
</ul>
</div>
</body>
</html>