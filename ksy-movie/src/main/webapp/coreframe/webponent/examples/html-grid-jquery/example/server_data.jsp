<%@ page language="java" contentType="text/html; charset=EUC-KR" pageEncoding="EUC-KR"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!-- controller(jspx) 에서 호출되는 페이지이며  items의 list 는 jspx에서 req.setAttribute("list")로 설정한 데이터가 넘어 오게 된다.  -->
<!-- 내용이 다 채워진후 이페이지의 모든 내용은 list.jsp table의 tbody안으로 들어가게 된다. -->
<c:forEach var="entity" items="${list}" varStatus="i">
<tr>
<td>${entity.id}</td>
<td>${entity.name }</td>
<td>${entity.country}</td>
<td>${entity.airport}</td>
<td>${entity.language}</td>
<td>${entity.countryIsoCode}</td>
</tr>
</c:forEach>