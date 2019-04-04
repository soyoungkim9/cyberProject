<%@ page language="java" contentType="text/html; charset=EUC-KR" pageEncoding="EUC-KR"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!-- controller(jspx) ���� ȣ��Ǵ� �������̸�  items�� list �� jspx���� req.setAttribute("list")�� ������ �����Ͱ� �Ѿ� ���� �ȴ�.  -->
<!-- ������ �� ä������ ���������� ��� ������ list.jsp table�� tbody������ ���� �ȴ�. -->
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