<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=EUC-KR" pageEncoding="EUC-KR"%>

<html>
<head>
<title>BLD및 JSP를 이용한 coreframe 개발방법(case3) 개요</title>
<meta name="keywords"
	content="coreframe, framework, developement, web standard" />
<meta name="description"
	content="coreframe을 통한 개발방법중  BLD및 JSP 만을 이용한 개발방법입니다." />
<meta name="author"
	content="Sungkwon Kim, manpower@cyber-i.com, CyberImagination,Inc." />
</head>

<body>
<h3>case 3 : BLD + JSP(Control) + JSP(View:JSTL로 구현)</h3>

<ol>
  <li>Data access 부분은 BLD가 전담한다.</li>
  <li>데이터 호출 및 request/response 처리하는 control jsp를 구현한다.</li>
  <li>view JSP는 로직이 없이 출력에만 관여한다. </li>
  <li>view JSP는 JSTL로 구현하여 Model과의 독립성을 부여한다. </li>
  <li>JSTL 로 구현시 J2EE 1.3(JSTL 1.0) 과 J2EE 1.4(JSTL 1.1) 환경이 약간 상이하므로 주의한다.</li>
  <li>J2EE 1.4(JSTL 1.1) 이상인 경우만 JSTL 사용을 추천한다.</li>
  
  <li>컴파일 과정이 필요없이 쉽게 MVC 구조를 구현할 수 있다.</li>
  <li>J2EE 1.4이상 환경에서는 control jsp 는 확장자는 .jspx 로 하여 구분하는것이 좋다</li>
  
  <li>중요한 비지니스 로직 또는 Service 로직이 control jsp 에 들어가면 관리가 
  힘들 수 있으므로, 중요하고 복잡한 로직은 별도의 Service 구현 class로 구현하고 
  control에서 호출하는 방식이 좋다.</li>
</ol>

<h4>JSTL은 커스텀 태그 uri 표시에서 J2EE 1.3용과 1.4용이상이 틀리므로, 어느 WAS의 J2EE 환경에 맞는 샘플을
선택해야 한다. </h4>
</body>
</html>