<%@ page language="java" contentType="text/html; charset=EUC-KR"
  pageEncoding="EUC-KR"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<html>
<head>
<title>�������� ����</title>
</head>

<body>

<table class="tbl detail">
  <colgroup>
    <col class="code"/>
    <col/>
    <col class="code"/>
    <col/>
  </colgroup>
  <tr>
    <th>ID</th>
    <td><c:out value="${output.id}"/></td>
    <th>name</th>
    <td><c:out value="${output.name}"/></td>
  </tr>
  <tr>
    <th>������</th>
    <td><c:out value="${output.country}"/></td>
    <th>����ISO�ڵ�</th>
    <td><c:out value="${output.countryIsoCode}"/></td>
  </tr>
  <tr>
    <th>����</th>
    <td><c:out value="${output.airport}"/></td>
    <th>���</th>
    <td><c:out value="${output.language}"/></td>
  </tr>
</table>

</body>
</html>