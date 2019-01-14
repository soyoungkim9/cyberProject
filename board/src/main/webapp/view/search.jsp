<%@ page language="java"
 		contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>게시물 목록</title>
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/list.css">
</head>
<body>
	<div id="wrap">
		<form action="search.do">
			<div id="searchBox">
				<select name="searchList">
					<option value="all">전체</option>
					<option value="title">제목</option>
					<option value="name">작성자</option>
				</select>
				<input name="search" type="text">
				<input type="submit" value="검색">
			</div>
			<table>
				<thead>
					<tr>
						<th>번호</th>
						<th>제목</th>
						<th>작성자</th>
						<th>작성일</th>
						<th>조회</th>
					</tr>
				</thead>
				<tbody>
				<c:if test="${searchPage.hasNoBoards()}">
					<tr>
						<td colspan="5">게시글이 없습니다.</td>
					</tr>
				</c:if>
				<c:forEach var="board" items="${searchPage.content}">
					<tr>
						<td>${board.bno}</td>
						<td>
							<a href="read.do?no=${board.bno}&pageNo=${searchPage.currentPage}">
								${board.title}
							</a>
						</td>
						<td>${board.name}</td>
						<td>${board.sdt}</td>
						<td>${board.cnt}</td>
					</tr>
				</c:forEach>
				</tbody>
				<tfoot>
				<c:if test="${searchPage.hasBoards()}">
					<tr>
						<td colspan="5">
							<a href="search.do?searchList=${searchList}&search=${searchTitle}&pageNo=1">&lt;&lt;</a>
							<a id="before" href="search.do?searchList=${searchList}&search=${searchTitle}&pageNo=${searchPage.startPage - 5}">&lt;</a>
						<c:forEach var="pNo" 
							begin="${searchPage.startPage}" 
							end="${searchPage.endPage}">
							<a class="number" href="search.do?searchList=${searchList}&search=${searchTitle}&pageNo=${pNo}">${pNo}</a>
						</c:forEach>
							<a id="after" href="search.do?searchList=${searchList}&search=${searchTitle}&pageNo=${searchPage.startPage + 5}">&gt;</a>
							<a id="total" href="search.do?searchList=${searchList}&search=${searchTitle}&pageNo=${searchPage.totalPages}">&gt;&gt;</a>
						</td>
					</tr>
				</c:if>
				</tfoot>
			</table>
		</form>
		<div>
			<a href="write.do">글쓰기</a>
		</div>
		<div>
			<a href="list.do">처음 목록으로 돌아가기</a>
		</div>
	</div>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<script src="${pageContext.request.contextPath}/js/search.js"></script>
</body>
</html>