<%@ page language="java"
         contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
    <title>CINEMA - 마이페이지</title>
    <meta charset="UTF-8">
</head>
<body>
<div id="wrap">
    <div><h3>회원가입</h3></div>
    <div>
        <form action="registerMember.cmd" method="post">
            <div>
                <label for="id">아이디</label><br/>
                <input type="text" id="id" name="id">
                <c:if test="${errors.id}"><span>아이디를 입력해 주세요.</span></c:if>
                <c:if test="${errors.duplicatedId}"><span>이미 존재하는 아이디 입니다.</span></c:if>
            </div>
            <div>
                <label for="password">비밀번호</label><br/>
                <input type="password" id="password" name="password">
                <c:if test="${errors.pwd}"><span>비밀번호를 입력해 주세요.</span></c:if>
            </div>
            <div>
                <label for="confirmPassword">비밀번호 재확인</label><br/>
                <input type="password" id="confirmPassword" name="confirmPassword">
                <c:if test="${errors.confirmPwd}"><span>비밀번호를 입력해 주세요.</span></c:if>
                <c:if test="${errors.notMatch}"><span>비밀번호가 일치하지 않습니다.</span></c:if>
            </div>
            <div>
                <label for="name">이름</label><br/>
                <input type="text" id="name" name="name">
                <c:if test="${errors.name}"><span>이름을 입력해 주세요.</span></c:if>
            </div>
            <div>
                <label for="gender">성별</label><br/>
                <select id="gender" name="gender">
                    <option value="0">성별</option>
                    <option value="남">남자</option>
                    <option value="여">여자</option>
                </select>
                <c:if test="${errors.gender}"><span>성별을 선택해 주세요.</span></c:if>
            </div>
            <div>
                <label for="birth">생년월일</label><br/>
                <input type="date" id="birth" name="birth">
                <c:if test="${errors.birth}"><span>생년월일을 입력해 주세요.</span></c:if>
            </div>
            <div>
                <input type="submit" value="가입하기">
            </div>
        </form>
    </div>
</div>
</body>
</html>