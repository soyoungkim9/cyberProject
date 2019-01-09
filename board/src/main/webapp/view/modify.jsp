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
		<form action="modify.do" method="post" enctype="multipart/form-data">
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
					<td>
						<input id="pwd" type="text" name="pwd" data-originPwd="${modReq.pwd}"
							placeholder="비밀번호를 입력해 주세요.">
					</td>
				</tr>
				<tr>
					<th>내용</th>
					<td><textarea rows="10" cols="80" name="content">${modReq.content}</textarea></td>
				</tr>
				<tr>
					<th>파일</th>
					<td>
						<c:if test="${modReq.fileURL ne null}">
							<img id="fileContent" src="upload/${modReq.fileURL}">
						</c:if>
						<input type="hidden" name="maintainFile" value="${modReq.fileURL}">
						<input id="file" type="file" name="uploadFile">
						<span id="originFile">(파일 수정 시 선택)</span>
					</td>
				</tr>
			</table>
			<div id="btnBox">
				<input id="update" type="submit" value="글 수정">
			</div>
		</form>
	</div>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="${pageContext.request.contextPath}/js/modify.js"></script>
</body>
</html>