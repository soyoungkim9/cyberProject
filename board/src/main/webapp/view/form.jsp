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
		<form action="write.do" method="post" enctype="multipart/form-data">
			<table>
				<tr>
					<th>제목</th>
					<td><input type="text" name="title" value="${param.title}"></td>
				</tr>
				<tr>
					<th>작성자</th>
					<td><input type="text" name="name" value="${param.name}"></td>
				</tr>
				<tr>
					<th>비밀번호</th>
					<td><input type="text" name="pwd" value="${param.pwd}"></td>
				</tr>
				<tr>
					<th>내용</th>
					<td><textarea rows="10" cols="80" name="content">${param.content}</textarea></td>
				</tr>
				<tr>
					<th>파일</th>
					<td><input type="file" name="uploadFile"></td>
				</tr>
			</table>
			<div id="btnBox">
				<input type="submit" value="등록하기">
				<input type="reset" value="다시입력">
			</div>
		</form>
	</div>
</body>
</html>