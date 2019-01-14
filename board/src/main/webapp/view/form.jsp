<%@ page language="java"
 		contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>게시물 등록폼</title>
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/write.css">
</head>
<body>
	<div id="wrap">
		<form action="write.do" method="post" enctype="multipart/form-data">
			<table>
				<tr>
					<td>
						<input type="text" name="title" value="${param.title}" placeholder="제목을 입력하세요.">
					</td>
				</tr>
				<tr>
					<td>
						<span class="borderCss1">작성자</span>
						<input type="text" name="name" value="${param.name}">
					</td>
				</tr>
				<tr>
					<td>
						<span class="borderCss1">비밀번호</span>
						<input type="text" name="pwd" value="${param.pwd}">
					</td>
				</tr>
				<tr>
					<td><textarea rows="10" cols="80" name="content">${param.content}</textarea></td>
				</tr>
				<tr>
					<td>
						<img id="fileContent">
						<input id="file" type="file" name="uploadFile">
					</td>
				</tr>
			</table>
			<div id="btnBox">
				<input type="submit" value="등록하기">
				<input type="reset" value="다시입력">
			</div>
		</form>
	</div>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<script src="${pageContext.request.contextPath}/js/form.js"></script>
</body>
</html>