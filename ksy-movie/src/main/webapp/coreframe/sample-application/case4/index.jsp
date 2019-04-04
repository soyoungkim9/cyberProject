<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>

<html>
<head>
<title>BLD�� JSP�� �̿��� coreframe ���߹��(case4) ����</title>
<meta name="keywords"
	content="coreframe, framework, developement, web standard" />
<meta name="description"
	content="coreframe�� ���� ���߹����  BLD��  Servlet Conrtroller, JSP��  �̿��� ���߹���Դϴ�." />
<meta name="author"
	content="Sungkwon Kim, manpower@cyber-i.com, CyberImagination,Inc." />
</head>


<body>
<h3>case 4 : BLD + servlet(Control) + JSP(View:JSTL�� ����)</h3>

<ul>
	<li>Data access �κ��� BLD�� �����Ѵ�.</li>
	<li>������ ȣ�� �� request/response ó���ϴ� control��
	coreframe.http.WebController�� Ȯ���� servlet���� �����Ѵ�.</li>
	<li>servlet ���� �޽��� �޽���.do ������� ȣ���Ѵ�.</li>
	<li>view JSP�� ������ ���� ��¿��� �����Ѵ�.</li>
	<li>view JSP�� JSTL�� �����Ͽ� Model���� �������� �ο��Ѵ�.</li>
	<li>JSTL �� ������ J2EE 1.3(JSTL 1.0) �� J2EE 1.4(JSTL 1.1) ȯ���� �ణ
	�����ϹǷ� �����Ѵ�.</li>
	<li>J2EE 1.4(JSTL 1.1) �̻��� ��츸 JSTL ����� ��õ�Ѵ�.</li>
	<li>�Ϲ����� ǥ�� ������ ����п� �ش��ϴ� ����̴�.</li>
	<li>������Ʈ ������� BLD�� control���̿� service ��ü�� �����ϸ� �Ϻ��� CBD ������� ������ ��
	������ ���߹���� ���������� ������ �ִ�.</li>
	<li>���üҽ��� ./WEB-INF/src �� �����ϸ� �ȴ�.</li>
</ul>

<p><strong>�� ������ �̿��Ϸ���, web.xml�� ������ ���� servlet�� ����Ͽ��� �Ѵ�.</strong></p>

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