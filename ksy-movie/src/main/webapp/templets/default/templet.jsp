<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=euc-kr"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/menu" prefix="m"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/layout" prefix="layout"%>

<html>
<head>
<layout:head></layout:head>
<meta name="author" content="CyberImagination Inc." />
<link rel="stylesheet" type="text/css" href="${TEMPLET_DIR}/css/layout.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.12/handlebars.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="//developers.kakao.com/sdk/js/kakao.min.js"></script>
<script src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js"></script>
</head>
<body>
<div id="header_wrap">
	<div id="header">
		<ul>
			<li id="logoutBtnBox"><a id="logoutBtn">로그아웃</a></li>
			<li id="mypageBtnBox"><a href='/main/movie/mypage.jsp'>마이페이지</a></li>
			<li id="statusBox"><a id="status"></a></li>
			<li id="joinBtnBox"><a href='/main/movie/registerMember.cmd'>회원가입</a></li>
			<li id="loginBtnBox"><a id="loginBtn">로그인</a></li>
		</ul>
	</div>
	<div id="loginBox">
		<form id="member_login">
			<input type="text" id="member_login_id" name="name" placeholder="아이디">
			<input type="password" id="member_login_password" name="password" placeholder="비밀번호">
			<input type="button" id="member_login_btn" value="로그인">
		</form>
		<ul>
			<li>
				<a id="kakao-login-btn"><img src="${TEMPLET_DIR}/img/kakaolink_btn_small.png"><span>카카오 로그인</span></a>
				<!--<a href="http://developers.kakao.com/logout">로그아웃</a> -->
			</li>
			<li>
				<a id="naver-login-btn"><div id="naverIdLogin"></div><span id="naverStyle">네이버 로그인</span></a>
			</li>
		</ul>
		<input type="button" value="닫기">
	</div>
	<div id="logo">
		<a href="/main/movie/list.jsp"><img src="${TEMPLET_DIR}/img/logo.jpg"/></a>
	</div>
	<div id="menu">
		<ul>
			<m:list depth="1">
				<m:when test="{menu.id}==case1">
					<m:when test="{menu.selected}==true">
						<li class="selected"><a class="tabCss1" href='<m:param attr="url"/>'><m:param attr="name" /></a>
						</li>
					</m:when>
					<m:when test="{menu.selected}==false">
						<li><a href='<m:param attr="url"/>'><m:param attr="name" /></a>
						</li>
					</m:when>
				</m:when>
				<m:when test="{menu.id}==case2">
					<m:when test="{menu.selected}==true">
						<li class="selected"><a class="tabCss1" href='<m:param attr="url"/>'><m:param attr="name" /></a>
						</li>
					</m:when>
					<m:when test="{menu.selected}==false">
						<li><a href='<m:param attr="url"/>'><m:param attr="name" /></a>
						</li>
					</m:when>
				</m:when>
			</m:list>
		</ul>
	</div>
	<div id="sub-bar">
		<div id="subNavi">
			<ul id="depth2">
				<m:list depth="2">
					<m:when test="{menu.selected}==true">
						<li class="selected"><a class="tabCss2" href='<m:param attr="url"/>'><m:param attr="name" /></a></li>
					</m:when>
					<m:when test="{menu.selected}==false">
						<li><a href='<m:param attr="url"/>'><m:param attr="name" /></a></li>
					</m:when>
				</m:list>
			</ul>
		</div>
	</div>
</div>
<div id="content">
<layout:body>body 내용</layout:body>
</div>
<div id="footer">
	<div id="footer_wrap">
		<p>CINEMA</p>
		<p id="copy">COPYRIGHTⓒ SOYOUNG ALL RIGHT RESERVED.</p></div>
</div>
<script type='text/javascript'>
    var loginOn = false;
    var loginName = "";
    var loginId = "";
	$("#loginBtnBox").on("click", function() {
		$("#loginBox").toggle();
	});

	$("#loginBox > input").on("click", function() {
		$("#loginBox").hide();
	});

	// 카카오 로그인 관련
    Kakao.init('9a3013478f244482da167dd14eb88244');
    $("#kakao-login-btn").on("click", function() {
        Kakao.Auth.loginForm({
            success: function(authObj) {
                Kakao.API.request({
                    url: '/v1/user/me',
                    success: function(res) {
                        // console.log(res.kaccount_email); // 이거 짤라서 member테이블에 넣기
                        // console.log(res.properties['nickname']); // 이거 프로필에 이름 넣기
                        // console.log(authObj.access_token); // 토큰값 출력!!
						var email = res.kaccount_email;
						var id = email.split('@')[0];
						$.post("insertMember.cmd", {id : id, name : res.properties['nickname']});
						location.reload();
                    }
                });
            },
            fail: function(err) {
                alert(JSON.stringify(err));
            }
        });
    });

    // 카카오 로그인 여부 확인 statusObj.status.id
    Kakao.Auth.getStatus(function(statusObj){
        if(statusObj.status == "not_connected") {
            $("#loginBtnBox").show();
            $("#joinBtnBox").show();
            $("#logoutBtnBox").hide();
            $("#mypageBtnBox").hide();
            $("#statusBox").hide();
        } else {
            loginOn = true;
            loginName = "kakao";
            loginId = statusObj.user.kaccount_email.split('@')[0];
            $("#loginBtnBox").hide();
            $("#joinBtnBox").hide();
            $("#logoutBtnBox").show();
            $("#mypageBtnBox").show();
            $("#status").text(statusObj.user.properties.nickname + "님");
            $("#status").attr("data-id", loginId);
            $("#statusBox").show();
        }
        console.log("카카오 로그인 상태 " + statusObj.status);
        console.log(statusObj.user);
    });

    // 카카오, 네이버 로그아웃
    $("#logoutBtn").on("click", function() {
        loginOn = false;
        loginId = "";
        if(loginName == "kakao") {
            Kakao.Auth.logout(function() {
                loginName = "";
                location.reload();
            });
		} else {
            naverLogin.logout();
            location.reload();
		}
    });

    // 네이버 로그인 관련
    var naverLogin = new naver.LoginWithNaverId(
        {
            clientId: "PStU01_ayayV9RCNZhqO",
            callbackUrl: "http://202.136.113.47:8888/main/movie/list.jsp",
            isPopup: true,
            callbackHandle: false,
            loginButton: {color: "green", type: 1, height: 32}
        }
    );

    naverLogin.init();

	if(location.href.split('#').length == 2) {
		opener.parent.location='http://202.136.113.47:8888/main/movie/list.jsp';
	}
	window.close();

    naverLogin.getLoginStatus(function (status) {
        if (status) {
            var email = naverLogin.user.getEmail();
            var name = naverLogin.user.name;
            var id = email.split('@')[0];

            loginOn = true;
            loginName = "naver";
            loginId = id;

            $("#loginBtnBox").hide();
            $("#joinBtnBox").hide();
            $("#logoutBtnBox").show();
            $("#mypageBtnBox").show();
            $("#status").text(name + "님");
            $("#status").attr("data-id", loginId);
            $("#statusBox").show();

            $.post("insertMember.cmd", {id : id, name : name});

            //var profileImage = naverLogin.user.getProfileImage();
            //var birthday = naverLogin.user.getBirthday();
            //var age = naverLogin.user.getAge();
            console.log(email);
            console.log(naverLogin.user); // naverLogin.user.id
        } else {
            console.log("사용자 정보를 얻을 수 없습니다. 네이버 로그인 해주세요!");
            $("#loginBtnBox").show();
            $("#joinBtnBox").show();
            $("#logoutBtnBox").hide();
            $("#mypageBtnBox").hide();
            $("#statusBox").hide();
        }
    });

    // 일반로그인
	$("#member_login_btn").click(function(){
	    var id = $("#member_login_id").val();
	    var pwd = $("#member_login_password").val();
	    if(id == "") {
	        alert("아이디를 입력해 주세요!");
	        return;
		}

		if(pwd == "") {
	        alert("비밀번호를 입력해 주세요!");
	        return;
		}

		$.ajax({
			type: "GET",
			url: "confirmId.cmd?id=" + id + "&password=" + pwd,
            success : function (data) {
			    if(data.result == "Y") {
			        // 페이지 넘어가는거 미해결 ㅠㅠㅠ
                    // 서버단에서 하고싶은데
                    alert("성공");

                } else {
                    alert("아이디나 비밀번호가 일치하지 않습니다.");
                }
            }
		});

	    // 일반로그인은 세션에 저장해서 불러오기
        // 현재로서는 로그인 성공하면 list페이지로 이동한다.

		// 만약에 로그인 필터를 전체 다 적용하고 싶으면
		// url 패턴을 / 로 하면 됨

		// 로그인 체크 필터에서
		// response.sendRedirect(request.getContextPath() + "login.do"); 이 부분은
		// 로그인이 안됐으니까 login 하라고 로그인 화면으로 유도 하는 것임!
	});
</script>
</body>
</html>