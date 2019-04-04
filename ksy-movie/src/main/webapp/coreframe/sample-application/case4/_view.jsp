<%@ page language="java" contentType="text/html; charset=EUC-KR"
  pageEncoding="EUC-KR"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html>
<head>
<title>�������� ����</title>
</head>

<body>

<table class="tbl">
  <colgroup>
    <col class="code"/>
    <col/>
    <col class="code"/>
    <col/>
  </colgroup>
  <tr>
    <td>ID</td>
    <td><c:out value="${output.id}"/></td>
    <td>name</td>
    <td><c:out value="${output.name}"/></td>
  </tr>
  <tr>
    <td>������</td>
    <td><c:out value="${output.country}"/></td>
    <td>����ISO�ڵ�</td>
    <td><c:out value="${output.countryIsoCode}"/></td>
  </tr>
  <tr>
    <td>����</td>
    <td><c:out value="${output.airport}"/></td>
    <td>���</td>
    <td><c:out value="${output.language}"/></td>
  </tr>
</table>

</body>
</html>