<%@ page language="java" contentType="text/html; charset=EUC-KR"
  pageEncoding="EUC-KR"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html>
<head>
<title>도시정보 보기</title>
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
    <td>국가명</td>
    <td><c:out value="${output.country}"/></td>
    <td>국가ISO코드</td>
    <td><c:out value="${output.countryIsoCode}"/></td>
  </tr>
  <tr>
    <td>공항</td>
    <td><c:out value="${output.airport}"/></td>
    <td>언어</td>
    <td><c:out value="${output.language}"/></td>
  </tr>
</table>

</body>
</html>