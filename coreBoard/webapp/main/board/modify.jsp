<%@ page language="java"
         contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>게시물 등록폼</title>
    <link rel="stylesheet" href="../board/css/modify.css">
</head>
<body>
<div id="wrap">
    <form action="modify.cmd" name="modifyForm" method="post" enctype="multipart/form-data">
        <table>
            <tr>
                <th>번호</th>
                <td>${modReq.bno}
                    <input type="hidden" name="bno" value="${modReq.bno}">
                    <input type="hidden" name="pageNo" value="${pageNo}">
                </td>
            </tr>
            <tr>
                <th>제목</th>
                <td><input type="text" name="title" value="${modReq.title}"
                           placeholder="제목을 입력해 주세요." data-size="50" data-alert="none">
                    <span class="alert">한글 25자, 영어 50자 이내로 작성해 주세요!</span>
                </td>
            </tr>
            <tr>
                <th>작성자</th>
                <td>${modReq.name}</td>
            </tr>
            <tr>
                <th>비밀번호</th>
                <td>
                    <input id="pwd" type="password" name="pwd" data-originPwd="${modReq.pwd}"
                           placeholder="비밀번호를 입력해 주세요." data-size="30" data-alert="none">
                    <span class="alert">한글 15자, 영어 30자 이내로 작성해 주세요!</span>
                </td>
            </tr>
            <tr>
                <th>내용</th>
                <td>
                    <textarea rows="10" cols="82" name="content" data-size="1000" data-alert="none">${modReq.content}</textarea>
                    <span class="alert">한글 500자, 영어 1000자 이내로 작성해 주세요!</span>
                </td>
            </tr>
            <tr>
                <th>파일</th>
                <td>
                    <c:if test="${modReq.fileurl != ''}">
                        <img id="fileContent" src="../../upload/${modReq.fileurl}">
                    </c:if>
                    <input type="hidden" name="maintainFile" value="${modReq.fileurl}">
                    <input id="file" type="file" name="uploadFile">
                </td>
            </tr>
        </table>
        <div id="btnBox">
            <button id="update" type="button">글 수정</button>

        </div>
    </form>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="../board/js/modify.js"></script>
</body>
</html>