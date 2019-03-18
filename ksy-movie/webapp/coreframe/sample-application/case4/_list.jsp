<%@ page language="java" contentType="text/html; charset=EUC-KR"
  pageEncoding="EUC-KR"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html>
<head>
<title>목록보기</title>
<script>

function view(id) {
  window.location.href='view.do?id='+id;
}

function update(id) {
  window.location.href='preUpdate.do?id='+id;
}

function del(id) {
  if( window.confirm('삭제하시겠습니까?') ) {
    window.location.href='delete.do?id='+id;
  }
} 
</script>
</head>

<body>

<table class="tbl">
  <tr>
    <th>id</th>
    <th>name</th>
    <th>country</th>
    <th>airport</th>
    <th>language</th>
    <th>action</th>
  </tr>
  <colgroup>
    <col class="code" />
    <col />
    <col />
    <col />
    <col />
    <col />
  </colgroup>
  
  <c:forEach var="entity" items="${output}">
  <tr>
    <td><c:out value="${entity.id}"/></td>
    <td><a href="javascript:view('<c:out value="${entity.id}"/>');"><c:out value="${entity.name}"/></a></td>
    <td><c:out value="${entity.country}"/></td>
    <td><c:out value="${entity.airport}"/></td>
    <td><c:out value="${entity.language}"/></td>
    <td><input type="button" value="update" onclick="update('<c:out value="${entity.id}"/>');"/>
      <input type="button" value="delete" onclick="del('<c:out value="${entity.id}"/>');"/></td>
  </tr>
  </c:forEach>
</table>

</body>
</html>