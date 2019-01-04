<%@ page language="java"
 		contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>게시물 목록</title>
</head>
<body>
	<div id="wrap">
		<div>
			<a href="write.do">글쓰기</a>
		</div>
		<form>
			<table border="1">
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
				<c:if test="${boardPage.hasNoBoards()}">
					<tr>
						<td colspan="5">게시글이 없습니다.</td>
					</tr>
				</c:if>
				<c:forEach var="board" items="${boardPage.content}">
					<tr>
						<td>${board.bno}</td>
						<td>
							<a> <!-- page 653 29번 라인 추가!-->
								<c:out value="${board.title}"/>
							</a>
						</td>
						<td>${board.name}</td>
						<td>${board.sdt}</td>
						<td>${board.cnt}</td>
					</tr>
				</c:forEach>
				</tbody>
				<tfoot>
				<c:if test="${boardPage.hasBoards()}">
					<tr>
						<td colspan="5">
						<c:if test="${boardPage.startPage > 5}">
							<a href="list.do?pageNo=${boardPage.startPage - 5}">[이전]</a>
						</c:if>
						<c:forEach var="pNo" 
							begin="${boardPage.startPage}" 
							end="${boardPage.endPage}">
							<a href="list.do?pageNo=${pNo}">[${pNo}]</a>
						</c:forEach>
						<c:if test="${boardPage.endPage < boardPage.totalPages}">
							<a href="list.do?pageNo=${boardPage.startPage + 5}">[다음]</a>
						</c:if>
						</td>
					</tr>
				</c:if>
				</tfoot>
			</table>
		</form>
		<div>
			<input type="text">
			<input type="button" value="검색">
		</div>
	</div>
</body>
</html>