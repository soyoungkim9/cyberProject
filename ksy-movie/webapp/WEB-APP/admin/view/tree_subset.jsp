<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>


<ol>
<c:forEach var="item" items="${treeMapList}">
 <li class="no-nest ${item.sortable}"  data-key="${item.key}" data-haschild="${item.hasChild}" data-type="${item.type}" data-xpath="${item.xpath}">
   <span data-key="${item.key}" class="indi hasChild${item.hasChild} fold"></span>
   <span class="icon ${item.type}"></span>
   <div class="label" >${item.name}</div>
 </li>
</c:forEach>
</ol>
