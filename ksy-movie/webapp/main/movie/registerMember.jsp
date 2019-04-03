<%@ page language="java"
         contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
    <title>CINEMA - 마이페이지</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" media="only screen and (min-width:415px)" href="../movie/css/pc/registerMember.css">
    <link rel="stylesheet" media="only screen and (max-width:414px)" href="../movie/css/mobile/registerMember.css">
</head>
<body>
<div id="wrap">
    <div><h3>회원가입</h3></div>
    <div>
        <form accept-charset="UTF-8">
            <div id="idBox">
                <label for="id">아이디</label><br/>
                <input type="text" id="id" name="id" placeholder="5자 이상 15자 이내" value="${param.id}" maxlength="15">
                <span class="info_error" id="idMsg"></span>
            </div>
            <div id="pwdBox">
                <label for="password">비밀번호</label><br/>
                <input type="password" id="password" name="password" placeholder="5자 이상 15자 이내" maxlength="15">
                <span class="info_error" id="pwdMsg"></span>
            </div>
            <div id="pwdConfirmBox">
                <label for="confirmPassword">비밀번호 재확인</label><br/>
                <input type="password" id="confirmPassword" name="confirmPassword" maxlength="15">
                <span class="info_error" id="pwdConfirmMsg"></span>
            </div>
            <div id="nameBox">
                <label for="name">이름</label><br/>
                <input type="text" id="name" name="name" placeholder="10자 이내" value="${param.name}" maxlength="10">
                <span class="info_error" id="nameMsg"></span>
            </div>
            <div id="genderBox">
                <label for="gender">성별</label><br/>
                <select id="gender" name="gender" value="${param.gender}">
                    <option value>성별</option>
                    <option value="y" <c:if test="${param.gender == 'y'}">selected='selected'</c:if>>남자</option>
                    <option value="x" <c:if test="${param.gender == 'x'}">selected='selected'</c:if>>여자</option>
                </select>
                <span class="info_error" id="genderMsg"></span>
            </div>
            <div id="birthBox">
                <label for="birth">생년월일</label><br/>
                <input type="date" id="birth" name="birth" value="${param.birth}">
                <span class="info_error" id="birthMsg"></span>
            </div>
            <div>
                <input id="joinBtn" type="button" value="가입하기">
            </div>
        </form>
    </div>
</div>
<script>
var idFlag = false;

(function (){
    $("#id").blur(function(){
        checkId();
    });

    $("#name").blur(function(){
        checkName();
    });

    $("#gender").change(function(){
        checkGender();
    });

    $("#birth").blur(function(){
        checkBirth();
    });

    $("#joinBtn").click(function(){
        if(checkInputBox()) {
            alert("post 전송하기!");
        } else {
            return;
        }
    });
})();

function checkId() {
    var id = $("#id").val();
    var oMsg = $("#idMsg");

    if(id == "") {
        showErrorMsg(oMsg, "아이디를 입력해 주세요!");
        return false;
    }

    var isID = /^[a-z0-9][a-z0-9_\-]{4,14}$/;
    if(!isID.test(id)) {
        showErrorMsg(oMsg, "5~15자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다.");
        return false;
    }

    $.ajax({
        type: "GET",
        url: "confirmId.cmd?id=" + id,
        success : function(data) {
            if(data.result == "Y") {
                showErrorMsg(oMsg, "이미 사용중인 아이디 입니다.");
            } else {
                showSuccessMsg(oMsg, "사용 가능한 아이디 입니닷!");
                idFlag = true;
            }
        }
    });
    return true;
}

function checkpswd1() {
    // 얘는 서버단에서 유효성검사를 해주어야한다... 혹시 모를 보안때문에 ㅎㅎ
    // 이거 암호화 다른 글 참고하기
}

function checkpswd2() {

}

function checkName() {
    var name = $("#name").val();
    var oMsg = $("#nameMsg");

    if(name == "") {
        showErrorMsg(oMsg, "이름을 입력해 주세요.");
        return false;
    }

    var isName = /^[a-z\uac00-\ud7a3][a-z\uac00-\ud7a3]{0,9}$/;
    if(!isName.test(name)) {
        showErrorMsg(oMsg, "10자이하의 한글과 영문 대 소문자를 사용하세요. (특수기호, 공백 사용 불가)");
        return false;
    }

    hideMsg(oMsg);
    return true;
}

function checkGender() {
    var gender = $("#gender").val();
    var oMsg = $("#genderMsg");

    if(gender == "") {
        showErrorMsg(oMsg, "성별을 입력해 주세요.");
        return false;
    }

    hideMsg(oMsg);
    return true;
}

function checkBirth() {
    var birth = $("#birth").val();
    var oMsg = $("#birthMsg");

    if(birth == "") {
        showErrorMsg(oMsg, "생년월일을 입력해 주세요.");
        return false;
    }

    hideMsg(oMsg);
    return false;
}

function showErrorMsg(obj, msg) {
    obj.attr("class", "info_error");
    obj.html(msg);
    obj.show();
}

function showSuccessMsg(obj, msg) {
    obj.attr("class", "info_error green");
    obj.html(msg);
    obj.show();
}

function hideMsg(obj) {
    obj.hide();
}

function checkInputBox() {
    if(idFlag &&
       checkId() && checkName() && checkGender() && checkBirth()) {
        return true;
    } else {
        return false;
    }
}

// 일단 실시간으로 검사하는 기능은 있어야 하므로 프론트단에서 처리하는거 부터 다하고
// 서버단 생각하기
</script>
</body>
</html>