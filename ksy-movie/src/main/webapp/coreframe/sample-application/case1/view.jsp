<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>

<%@ page import="coreframe.data.*"%>

<%
System.out.println( request.getParameter("id"));

InteractionBean interact = new InteractionBean();

	DataSet input = interact.getDataSet(request);
	DataSet output = new DataSet();
  try {
	interact.execute("samples/database/readCity", input, output);
  }catch(Exception e) {
    
  }
%>

<html>
<head>
<title>BLD및 JSP를 이용한 coreframe 개발방법(case1): 보기 예제</title>
<meta name="keywords"
	content="coreframe, framework, developement, web standard" />
<meta name="description"
	content="coreframe을 통한 개발방법중  BLD및 JSP 만을 이용한 개발방법입니다." />
<meta name="author"
	content="Sungkwon Kim, manpower@cyber-i.com, CyberImagination,Inc." />
</head>


<body>
<fieldset><legend>example <%=input.getText("id") %></legend>
<table cellspacing="0" class="tbl detail">
	<colgroup>
		<col class="code" />
		<col />
		<col class="code" />
		<col />
	</colgroup>
	<tr>
		<th scope="col">ID</th>
		<td><%=output.getText("id")%></td>
		<th scope="col">name</th>
		<td><%=output.getText("name")%></td>
	</tr>
	<tr>
		<th scope="col">국가명</th>
		<td><%=output.getText("country")%></td>
		<th>국가ISO코드</th>
		<td><%=output.getText("countryIsoCode")%></td>
	</tr>
	<tr>
		<th scope="col">공항</th>
		<td><%=output.getText("airport")%></td>
		<th scope="col">언어</th>
		<td><%=output.getText("language")%></td>
	</tr>
</table>
</fieldset>
</body>
</html>