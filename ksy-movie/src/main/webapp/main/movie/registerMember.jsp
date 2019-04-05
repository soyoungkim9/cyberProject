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
        <form id="join_form" action="registerMember.cmd" method="POST" accept-charset="UTF-8">
            <div id="idBox">
                <label for="id">아이디</label><br/>
                <input type="text" id="id" name="id" value="${param.id}" maxlength="15">
                <span class="info_error" id="idMsg"></span>
            </div>
            <div id="pwdBox">
                <label for="password">비밀번호</label><br/>
                <input type="password" id="password" name="password" maxlength="16">
                <span class="info_error" id="pwdMsg"></span>
            </div>
            <div id="pwdConfirmBox">
                <label for="confirmPassword">비밀번호 재확인</label><br/>
                <input type="password" id="confirmPassword" name="confirmPassword" maxlength="16">
                <span class="info_error" id="pwdConfirmMsg"></span>
            </div>
            <div id="nameBox">
                <label for="name">이름</label><br/>
                <input type="text" id="name" name="name" value="${param.name}" maxlength="10">
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
                <input id="joinBtn" type="submit" value="가입하기">
            </div>
        </form>
    </div>
</div>
<script>

    var idFlag = false;
    var pwdFlag = false;

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

        $("#password").blur(function(){
            checkPswd1();
        });

        $("#confirmPassword").blur(function(){
            checkPswd2();
        });

        $("#joinBtn").click(function(){
            if(checkInputBox()) {
                $("#join_form").submit();
            } else {
                checkWhiteSpace();
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

    function checkPswd1() {
        var pwd = $("#password").val();
        var oMsg = $("#pwdMsg");

        if(pwd == "") {
            showErrorMsg(oMsg, "비밀번호를 입력해 주세요.");
            return false;
        }

        if(!isValidPassword(pwd)) {
            showErrorMsg(oMsg, "8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.");
            return false;
        }

        pwdFlag = true;
        hideMsg(oMsg);
        return true;
    }

    function checkPswd2() {
        var pwd1 = $("#password");
        var pwd2 = $("#confirmPassword");
        var oMsg = $("#pwdConfirmMsg");

        if(pwd2.val() == "") {
            showErrorMsg(oMsg, "비밀번호를 입력해 주세요.");
            return false;
        }

        if(pwd1.val() != pwd2.val()) {
            showErrorMsg(oMsg, "비밀번호가 일치하지 않습니다.");
            pwd2.val("");
            return false;
        }
        if(pwdFlag && pwd1.val() == pwd2.val()) {
            showSuccessMsg(oMsg, "일치합니다.");
            return true;
        }
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
        return true;
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

    function checkWhiteSpace() {
        if($("#id").val() == "") showErrorMsg($("#idMsg"), "아이디를 입력해 주세요!");
        if($("#password").val() == "") showErrorMsg($("#pwdMsg"), "비밀번호를 입력해 주세요!");
        if($("#confirmPassword").val() == "") showErrorMsg($("#pwdConfirmMsg"), " 비밀번호를 입력해 주세요!");
        if($("#name").val() == "") showErrorMsg($("#nameMsg"), "이름을 입력해 주세요!");
        if($("#gender").val() == "") showErrorMsg($("#genderMsg"), "성별을 입력해 주세요!");
        if($("#birth").val() == "") showErrorMsg($("#birthMsg"), "생년월일을 입력해 주세요!");
    }

    function checkSpace(str) {
        if(str.search(/\s/) != -1) {
            return true;
        } else {
            return false;
        }
    }

    function isValidPassword(str) {
        if (str == "")
            return false;

        var retVal = checkSpace(str);
        if(retVal)
            return false;
        if(str.length < 8)
            return false;

        var cnt = 0;
        for(var i = 0; i < str.length; i++) {
            if (str.charAt(0) == str.substring(i, i+1))
                ++cnt;
        }
        if(cnt == str.length)
            return false;

        var isPwd = /^[A-Za-z0-9`\-=\\\[\];',\./~!@#\$%\^&\*\(\)_\+|\{\}:"<>\?]{8,16}$/;
        if(!isPwd.test(str))
            return false;

        return true;
    }

    function checkInputBox() {
        if(idFlag && pwdFlag &&
            checkId() && checkName() && checkGender() && checkBirth() && checkPswd1() && checkPswd2()) {
            return true;
        } else {
            return false;
        }
    }
    // 비밀번호 저장할 때 반드시 암호화 하기
    // 일단 실시간으로 검사하는 기능은 있어야 하므로 프론트단에서 처리하는거 부터 다하고
    // 서버단 생각하기

</script>
</body>
</html>