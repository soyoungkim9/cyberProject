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
        <form action="registerMember.cmd" method="post" accept-charset="UTF-8">
            <div id="idBox">
                <label for="id">아이디</label><br/>
                <input type="text" id="id" name="id" placeholder="5자 이상 15자 이내" value="${param.id}">
                <c:if test="${errors.idLength}"><span>아이디는 5자 이상 15자 이내로 작성해 주세요.</span></c:if>
                <c:if test="${errors.duplicatedId}"><span>이미 존재하는 아이디 입니다.</span></c:if>
            </div>
            <div id="pwdBox">
                <label for="password">비밀번호</label><br/>
                <input type="password" id="password" name="password" placeholder="5자 이상 15자 이내">
                <c:if test="${errors.passwordLength}"><span>비밀번호는 5자 이상 15자 이내로 작성해 주세요.</span></c:if>
            </div>
            <div id="pwdConfirmBox">
                <label for="confirmPassword">비밀번호 재확인</label><br/>
                <input type="password" id="confirmPassword" name="confirmPassword">
                <c:if test="${errors.notMatch}"><span>비밀번호가 일치하지 않습니다.</span></c:if>
            </div>
            <div id="nameBox">
                <label for="name">이름</label><br/>
                <input type="text" id="name" name="name" placeholder="5자 이상 10자 이내" value="${param.name}">
                <c:if test="${errors.nameLength}"><span>이름은 5자 이상 10자 이내로 작성해 주세요.</span></c:if>
            </div>
            <div id="genderBox">
                <label for="gender">성별</label><br/>
                <select id="gender" name="gender" value="${param.gender}">
                    <option value="0">성별</option>
                    <option value="y" <c:if test="${param.gender == 'y'}">selected='selected'</c:if>>남자</option>
                    <option value="x" <c:if test="${param.gender == 'x'}">selected='selected'</c:if>>여자</option>
                </select>
                <c:if test="${errors.gender}"><span>성별을 선택해 주세요.</span></c:if>
            </div>
            <div id="birthBox">
                <label for="birth">생년월일</label><br/>
                <input type="date" id="birth" name="birth" value="${param.birth}">
            </div>
            <div>
                <input type="submit" value="가입하기">
            </div>
        </form>
    </div>
</div>
<script>
    // 0. 함수로 만든다.
    // 1. input 창에 focus를 한다.
    // 1-1. 어떤 input인지 이름으로 구별에서 그에 맞는 값 처리를 한다.
    // 2. 해당 input창이 비어있거나 조건이 맞지 않으면 해당 줄에 span태그가 추가된다. (조건 부적합 시 return)
    // 3. 에러가 발생하면 해당함수의 지역변수는 true가 됨

    // 1. 만약 post전송을 누른다면 일단 서버에 넘기긴 해라. 에러발생 지역변수와 함께
    // 2. 서버단에서 true/false를 처리해서 화면을 보여줘라
    (function (){
        $("input").focus(function() {
            if($(this).hasClass("info_error")) {
                $(this).removeClass("info_error");
                $(this).next().remove();
            }
        });

        $("input").blur(function() {
            if($(this).val() == "") {
                $(this).addClass("info_error");
                $(this).parent().append("<span>" + $("label[for='" + $(this).attr('id') + "']").text()
                    + "를(을) 입력해 주세요.</span>");
            } else if($(this).val() == " ") {
                $(this).addClass("info_error");
                $(this).parent().append("<span>" + $("label[for='" + $(this).attr('id') + "']").text()
                    + "에공백을 포함할 수 없습니다..</span>");
            }

            // 아이디 관련

            // 비밀번호 관련

            // 비밀번호 재확인 관련

            // 이름관련
        });

        // 성별도 따로 만들기
    })();

</script>
</body>
</html>