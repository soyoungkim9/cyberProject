<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>

<html>
<head>
<title>BLD및 JSP를 이용한 coreframe 개발방법(case4) 개요</title>
<meta name="keywords"
	content="coreframe, framework, developement, web standard" />
<meta name="description"
	content="coreframe을 통한 개발방법중  BLD및  Servlet Conrtroller, JSP를  이용한 개발방법입니다." />
<meta name="author"
	content="Sungkwon Kim, manpower@cyber-i.com, CyberImagination,Inc." />
</head>


<body>
<h3>case 5 : BLD + jspx(Control) + JSP(View:JSTL로 구현)</h3>

<h4>coreFRAME5.0에 새롭게 추가된 방법으로 기본 coreframe.http.JspController 가 아닌 coreframe.http.JspxController 를 확장받은 JSPX controller 를 이용한다.</h4>

<ul>
  <li>Data access 부분은 BLD가 전담한다.</li>
  <li>데이터 호출 및 request/response 처리하는 control jsp를 구현한다.</li>
  <li>view JSP는 로직이 없이 출력에만 관여한다. </li>
  <li>view JSP는 JSTL로 구현하여 Model과의 독립성을 부여한다. </li>
  <li>컴파일 과정이 필요없이 쉽게 MVC 구조를 구현할 수 있다.</li>
  <li>public main(ViewMeta view) 와 같이 메소드 parameter 가 간략해 졌다.</li>
  
  
  
</ul>



</body>
</html>