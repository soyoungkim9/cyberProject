<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=EUC-KR" pageEncoding="EUC-KR"%>

<html>
<head>
<title>BLD�� JSP�� �̿��� coreframe ���߹��(case1) ����</title>
<meta name="keywords"
	content="coreframe, framework, developement, web standard" />
<meta name="description"
	content="coreframe�� ���� ���߹����  BLD�� JSP ���� �̿��� ���߹���Դϴ�." />
<meta name="author"
	content="Sungkwon Kim, manpower@cyber-i.com, CyberImagination,Inc." />
</head>

<body>
<h3>case 1 : BLD + JSP</h3>

<ol>
	<li>Data access �κ��� BLD(Business Logic Descriptor)�� �����Ѵ�.</li>
	<li>������ ȣ�� �� HTML ���(view)�� JSP ���� ��� ó���Ѵ�.</li>
	<li>BLD�� JSP 2���� �ҽ� �ۼ������� ���� ������ �� �ִ�.</li>
	<li>���� ���� ������ �� �ִ� ����������, JSP���� control ������ ���Ƿ�, ������ ������ ��� JSP
	�ҽ��ڵ尡 �������� ���ɼ��� �ִ�.</li>
</ol>

<div class="note">

<p>�� �������� �����ʹ� ����DB�� derbyPool�� �̿��Ͽ� ��/����� �Ѵ�.</p>

<p>�� �������� coreframe���� coreview module�� Template ��ɿ� ���� �޴���� �� ��������
���� �������� ���� ���·� ��µǴ� �����̴�.MS PowerPoint �� ������ �������� �� �������������� ����� �����ϴ�.</p>
<ul>

	<li>�⺻������ ./templates/standard/template.jsp �� ����Ͽ� ǥ�õȴ�.</li>
	<li>�ٸ� template���� ./templates ���丮�� ��ϵǾ� �ִ�.</li>
	<li>�ٸ� templates���� �����ϰ��� �ϴ� ��� web ���������� �����ϰų�
	./WEB-INF/config/layout.xml ���� �⺻ template�� �����Ѵ�.</li>
	<li>�޴��� template �� �����ϰ��� �ϴ� ��� web ���������� �����ϰų�
	./WEB-INF/config/sitemap.xml �� �����Ѵ�.</li>
</ul>
</div>
</body>
</html>