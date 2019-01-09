<%@ page language="java"
 		contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>게시물 읽기</title>
</head>
<body>
	<div id="wrap">
		<table border="1">
			<tr>
				<th>번호</th>
				<td>${board.bno}</td>
			</tr>
			<tr>
				<th>작성자</th>
				<td>${board.name}</td>
			</tr>
			<tr>
				<th>작성일</th>
				<td>${board.sdt}</td>
			</tr>
			<tr>
				<th>제목</th>
				<td>${board.title}</td>
			</tr>
			<tr>
				<th>내용</th>
				<td><pre>${board.content}</pre></td>
			</tr>
			<tr>
				<c:if test="${board.fileURL ne null}">
					<th>파일</th>
					<td><img src="upload/${board.fileURL}"></td>
				</c:if>
			</tr>
			<tfoot>
				<tr>
					<td colspan="2">
					<c:set var="pageNo" value="${empty param.pageNo ? '1' : param.pageNo}"/>
						<a href="list.do?pageNo=${pageNo}">[목록]</a>
						<a href="modify.do?no=${board.bno}">[게시글수정]</a>		
						<a href="delete.do?no=${board.bno}">[게시글삭제]</a>
					</td>
				</tr>
			</tfoot>
		</table>
		<form action="read.do" method="post">
			<table border="1">
				<tbody>
					<tr>
						<td>
						<input type="text" name="name" placeholder="이름" value="${param.name}">
						<input type="text" name="pwd" placeholder="암호" value="${param.pwd}">
						</td>
						<td>
							<textarea rows="5" cols="40" name="content">${param.content}</textarea>
						</td>				
						<td><input type="submit" value="댓글 등록"></td>
					</tr>
				</tbody>
			</table>
		</form>
		<form>
			<table border="1">
				<tbody>
				<c:if test="${commentsPage.hasNoComments()}">
					<tr>
						<td colspan="3">등록 된 댓글이 없습니다.</td>
					</tr>
				</c:if>	
				<c:forEach var="comments" items="${commentsPage.content}">			
					<tr>
						<td>
							<h3>${comments.name}</h3>
							<span>${comments.sdt}</span> 
							<span>${comments.cno}</span> 
						</td>
						<td><pre>${comments.content}</pre></td>				
						<td>
							<input type="submit" value="댓글 수정">
							<a href="deleteComment.do?cno=${comments.cno}">[댓글 삭제]</a>
						</td>
					</tr>
				</c:forEach>
				</tbody>
				<tfoot>
					<tr> <!-- 이 부분 ajax 처리해서 페이징하기 -->
					</tr>
				</tfoot>
			</table>
		</form>
	</div>
</body>
</html>