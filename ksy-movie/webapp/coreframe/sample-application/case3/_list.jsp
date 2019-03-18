<%@ page language="java" contentType="text/html; charset=EUC-KR"
  pageEncoding="EUC-KR"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>
<head>
<title>목록보기</title>
<script>

function view(id) {
  window.location.href='?cmd=view&id='+id;
}

function update(id) {
  window.location.href='?cmd=preUpdate&id='+id;
}

function del(id) {
  if( window.confirm('삭제하시겠습니까?') ) {
    window.location.href='?cmd=delete&id='+id;
  }
} 
</script>
</head>

<body>
<fieldset><legend>게시물 목록</legend>
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
    <col width="5%" class="code" />
    <col width="20%"/>
	<col width="20%"/>
	<col width="10%"/>
	<col width="20%"/>
	<col width="25%"/>
  </colgroup>
  
  
 <c:forEach var="entity" items="${output}">
 	
  <tr>
  	<c:if test="${entity.id<11}">
    <td><c:out value="${entity.id}"/></td>
    <td><a href="javascript:view('<c:out value="${entity.id}"/>');"><c:out value="${entity.name}"/></a></td>
    <td><c:out value="${entity.country}"/></td>
    <td><c:out value="${entity.airport}"/></td>
    <td><c:out value="${entity.language}"/></td>
    <td>
    <span class="btn_pack medium icon">
			<span class="update">
			</span>
	<button type="button" onclick="update('${entity.id}');">update</button>
	</span>
			
	<span class="btn_pack medium icon">
			<span class="delete">
			</span>
	<button type="button" onclick="del('${entity.id}');">delete</button>
	</span>
    </td>   
     </c:if>
  </tr> 
  </c:forEach>  
</table>
</fieldset>

<div id="searchbarbg">
<div id="searchbar">
	<span class="b rightTab">검색 조건</span>	
	
	<select name="searchType">
	<option>제목+내용</option>
	<option>제목</option>
	<option>내용</option>
	</select> 
	
	<input name="btn" type="text" class="inputText" title="검색" /> 
	 <span class="btn_pack medium">
		<a href="javascript:document.form.submit();" >search</a>
	</span>
</div>
</div>
</body>
</html>