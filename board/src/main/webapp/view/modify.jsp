<%@ page language="java"
 		contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>게시물 등록폼</title>
</head>
<body>
	<div id="wrap">
		<form action="modify.do" method="post">
			<table>
				<tr>
					<th>번호</th>
					<td>${modReq.bno}</td>
				</tr>
				<tr>
					<th>제목</th>
					<td><input type="text" name="title" value="${modReq.title}"></td>
				</tr>
				<tr>
					<th>작성자</th>
					<td>${modReq.name}</td>
				</tr>
				<tr>
					<th>비밀번호</th>
					<td><input type="text" name="pwd"></td>
				</tr>
				<tr>
					<th>내용</th>
					<td><textarea rows="10" cols="80" name="content">${modReq.content}</textarea></td>
				</tr>
			</table>
			<div id="btnBox">
				<input type="submit" value="글 수정">
			</div>
		</form>
	</div>
</body>
</html>