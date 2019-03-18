<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<html>
<head>
<title>BLD및 JSP를 이용한 coreframe 개발방법(case3) 예제 : 목록보기</title>
<meta name="keywords"
	content="coreframe, framework, developement, web standard" />
<meta name="description"
	content="coreframe을 통한 개발방법중  BLD및 JSP 만을 이용한 개발방법입니다." />
<meta name="author"
	content="Sungkwon Kim, manpower@cyber-i.com, CyberImagination,Inc." />
</head>


<body>

<form action="" method="post" class="boardListForm">
<fieldset><legend>게시물 목록</legend>
<table cellspacing="0" class="tbl"
	summary="List of Cities">
	<colgroup>
		<col width="5%" class="code" />
		<col width="20%"/>
		<col width="20%"/>
		<col width="10%"/>
		<col width="20%"/>
		<col width="25%"/>
	</colgroup>

	<tr>
		<th scope="col">id</th>
		<th scope="col">name</th>
		<th scope="col">country</th>
		<th scope="col">airport</th>
		<th scope="col">language</th>
		<th scope="col">action</th>
	</tr>


	<c:forEach var="entity" items="${output}">
		<tr>
			<c:if test="${entity.id<11}">
			<td>${entity.id}</td>
			<td><a href="javascript:view('${entity.id}');">${entity.name}</a></td>
			<td>${entity.country}</td>
			<td>${entity.airport}</td>
			<td>${entity.language}</td>
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
</form>


<script type="text/javascript">
	//<![CDATA[
	function view(id) {
		window.location.href = '?cmd=view&id=' + id;
	}

	function update(id) {
		window.location.href = '?cmd=preUpdate&id=' + id;
	}

	function del(id) {
		if (window.confirm('삭제하시겠습니까?')) {
			window.location.href = '?cmd=delete&id=' + id;
		}
	}
	//]]>
</script>

</body>
</html>