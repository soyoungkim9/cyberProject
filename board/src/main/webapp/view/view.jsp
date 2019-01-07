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
	</div>
</body>
</html>