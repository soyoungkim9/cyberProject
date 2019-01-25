<%@ page language="java"
         contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>게시물 등록폼</title>
    <link rel="stylesheet" href="../board/css/write.css">
</head>
<body>
<div id="wrap">
    <form action="write.cmd" name="boardForm" method="post" enctype="multipart/form-data" onsubmit="return false;">
        <table>
            <tr>
                <td>
                    <input type="text" name="title" value="${param.title}" placeholder="제목을 입력하세요." data-size="50" data-alert="none">
                    <span class="alert">한글 25자, 영어 50자 이내로 작성해 주세요!</span>
                </td>
            </tr>
            <tr>
                <td>
                    <span class="borderCss1">작성자</span>
                    <input type="text" name="name" value="${param.name}" data-size="30" data-alert="none">
                    <span class="alert">한글 15자, 영어 30자 이내로 작성해 주세요!</span>
                </td>
            </tr>
            <tr>
                <td>
                    <span class="borderCss1">비밀번호</span>
                    <input type="password" name="pwd" value="${param.pwd}" data-size="30" data-alert="none">
                    <span class="alert">한글 15자, 영어 30자 이내로 작성해 주세요!</span>
                </td>
            </tr>
            <tr>
                <td>
                    <textarea rows="10" cols="80" name="content" data-size="1000" data-alert="none">${param.content}</textarea>
                    <span class="alert">한글 500자, 영어 1000자 이내로 작성해 주세요!</span>
                </td>
            </tr>
            <tr>
                <td>
                    <img id="fileContent">
                    <input id="file" type="file" name="uploadFile">
                </td>
            </tr>
        </table>
        <div id="btnBox">
            <button type="button" id="btnSubmit">등록하기</button>
            <input type="reset" value="다시입력">
        </div>
    </form>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="../board/js/form.js"></script>
</body>
</html>