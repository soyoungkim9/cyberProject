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
<h3>case 4 : BLD + servlet(Control) + JSP(View:JSTL로 구현)</h3>

<ul>
	<li>Data access 부분은 BLD가 전담한다.</li>
	<li>데이터 호출 및 request/response 처리하는 control은
	coreframe.http.WebController를 확장한 servlet으로 구현한다.</li>
	<li>servlet 내의 메쏘드는 메쏘드명.do 방식으로 호출한다.</li>
	<li>view JSP는 로직이 없이 출력에만 관여한다.</li>
	<li>view JSP는 JSTL로 구현하여 Model과의 독립성을 부여한다.</li>
	<li>JSTL 로 구현시 J2EE 1.3(JSTL 1.0) 과 J2EE 1.4(JSTL 1.1) 환경이 약간
	상이하므로 주의한다.</li>
	<li>J2EE 1.4(JSTL 1.1) 이상인 경우만 JSTL 사용을 추천한다.</li>
	<li>일반적인 표준 웹개발 방법론에 해당하는 방식이다.</li>
	<li>콤포넌트 기반으로 BLD와 control사이에 service 객체를 구현하면 완벽한 CBD 기반으로 구현할 수
	있지만 개발방식이 복잡해지는 단점이 있다.</li>
	<li>관련소스는 ./WEB-INF/src 를 참조하면 된다.</li>
</ul>

<p><strong>본 예제를 이용하려면, web.xml에 다음과 같이 servlet을 등록하여야 한다.</strong></p>

<p><code> &lt;servlet&gt;<br />
&nbsp;&nbsp;&nbsp; &lt;servlet-name&gt;cityControl&lt;/servlet-name&gt;<br />
&nbsp;&nbsp;&nbsp;
&lt;servlet-class&gt;com.coreframe.example.control.CityController&lt;/servlet-class&gt;<br />
&lt;/servlet&gt;<br />
<br />
&lt;servlet-mapping&gt;<br />
&nbsp;&nbsp;&nbsp; &lt;servlet-name&gt;cityControl&lt;/servlet-name&gt;<br />
&nbsp;&nbsp;&nbsp; &lt;url-pattern&gt;/city/*&lt;/url-pattern&gt;<br />
&lt;/servlet-mapping&gt; </code></p>

</body>
</html>