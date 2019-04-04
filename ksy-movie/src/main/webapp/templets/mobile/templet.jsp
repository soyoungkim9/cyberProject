<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/menu" prefix="m"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/layout" prefix="layout"%>
<html>
<head>
	<layout:head></layout:head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta name="viewport" content="initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=no;" />
	<link rel="stylesheet" type="text/css" href="${TEMPLET_DIR}/css/layout.css" />
	<script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.12/handlebars.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<script src="//developers.kakao.com/sdk/js/kakao.min.js"></script>
	<script src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js"></script>
</head>
<body>
<div class="menuLayer" id="leftMenu"></div>
<div class="menuLayer_in">
	<div class="menuLayer_in_top">
		<h2>CINEMA</h2>
		<a class="leftMenu_close_btn"><img src="${TEMPLET_DIR}/img/btn_menusclose.png" alt="닫기"></a>
	</div>
	<div class="menuLayer_in_category">
		<div id="menu">
			<ul>
				<m:list depth="1">
					<m:when test="{menu.id}==case1">
						<li>
							<a href='<m:param attr="url"/>'>
								<img src="${TEMPLET_DIR}/img/<m:param attr="id" />.png" alt="이미지">
								<span><m:param attr="name" /></span>
							</a>
						</li>
					</m:when>
					<m:when test="{menu.id}==case2">
						<li>
							<a href='<m:param attr="url"/>'>
								<img src="${TEMPLET_DIR}/img/<m:param attr="id" />.png" alt="이미지">
								<span><m:param attr="name" /></span>
							</a>
						</li>
					</m:when>
				</m:list>
			</ul>
		</div>
	</div>
</div>
<div class="myLayer" id="rightMenu"></div>
<div class="myLayer_in">
	<div class="login_box">
		<h3 class="login_on">CINEMA</h3>
		<p class="login_on">모바일앱으로 로그인 하시면</p>
		<p class="login_on">바로티켓을 확인 하실 수 있습니다.</p>
		<div id="loginBox" class="login_on">
			<ul>
				<li>
					<a id="kakao-login-btn"><img src="${TEMPLET_DIR}/img/kakaolink_btn_small.png"><span>카카오 로그인</span></a>
				</li>
				<li>
					<a id="naver-login-btn"><div id="naverIdLogin"></div><span id="naverStyle">네이버 로그인</span></a>
				</li>
			</ul>
		</div>
		<a id="logoutBtn">로그아웃</a>
		<div id="login_comment"><a id="status"></a><span>님 반갑습니다.</span></div>
	</div>
	<div class="mypage_list">
		<ul class="mypage_content">
			<li>
				<a href="/main/movie/mypage.jsp"><img src="${TEMPLET_DIR}/img/33b1c.png" alt="구매내역"><span>구매내역</span></a>
			</li>
		</ul>
	</div>
</div>
<div id="header_wrap">
	<div id="header">
		<a class="category"><img src="${TEMPLET_DIR}/img/btn_allMenu.png" alt="카테고리"></a>
		<m:list depth="1">
			<m:when test="{menu.selected}==true">
				<h2 class="title"><m:param attr="name" /></h2>
			</m:when>
		</m:list>
		<a class="my"><img src="${TEMPLET_DIR}/img/btn_Mypg.png" alt="마이페이지"></a>
	</div>
	<div id="sub-bar">
		<div id="subNavi">
			<ul id="depth2">
				<m:list depth="2">
					<m:when test="{menu.selected}==true">
						<li><a class="selected" href='<m:param attr="url"/>'><m:param attr="name" /></a></li>
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
<script type='text/javascript'>
    var loginOn = false;
    var loginName = "";
    var loginId = "";

    $(".category").on("click", function(){
        $("#leftMenu, .menuLayer_in").show();
    });

    $(".leftMenu_close_btn > img, #leftMenu").on("click", function(){
        $("#leftMenu, .menuLayer_in").hide();
	});

    $(".my").on("click", function(){
        $("#rightMenu, .myLayer_in").show();
    });

    $("#rightMenu").on("click", function(){
        $("#rightMenu, .myLayer_in").hide();
	});

    $(".mypage_content > li").on("click", function(){
		$(".title").text("마이페이지");
	});

    // 카카오 로그인 관련
    Kakao.init('9a3013478f244482da167dd14eb88244');
    $("#kakao-login-btn").on("click", function() {
        Kakao.Auth.loginForm({
            success: function(authObj) {
                Kakao.API.request({
                    url: '/v1/user/me',
                    success: function(res) {
                        var email = res.kaccount_email;
                        var id = email.split('@')[0];
                        $.post("insertMember.cmd", {id : id});
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
            $(".login_on").show();
            $("#logoutBtn").hide();
            $(".mypage_content").hide();
            $("#statusBox").hide();
        } else {
            loginOn = true;
            loginName = "kakao";
            loginId = statusObj.user.kaccount_email.split('@')[0];
            $(".login_on").hide();
            $("#logoutBtn").show();
            $(".mypage_content").show();
            $("#status").text(statusObj.user.properties.nickname);
            $("#login_comment").show();
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
            isPopup: false,
            callbackHandle: false,
            loginButton: {color: "green", type: 1, height: 32}
        }
    );

    naverLogin.init();

    if(location.href.split('#').length == 2) {
        location.href ='http://202.136.113.47:8888/main/movie/list.jsp';
    }

    naverLogin.getLoginStatus(function (status) {
        if (status) {
            var email = naverLogin.user.getEmail();
            var name = naverLogin.user.getNickName();
            var id = email.split('@')[0];

            loginOn = true;
            loginName = "naver";
            loginId = id;

            $(".login_on").hide();
            $("#logoutBtn").show();
            $(".mypage_content").show();
            $("#status").text(name);
            $("#status").attr("data-id", loginId);
            $("#login_comment").show();
            $("#statusBox").show();

            $.post("insertMember.cmd", {id : id});

            console.log(email);
            console.log(naverLogin.user); // naverLogin.user.id
        } else {
            console.log("사용자 정보를 얻을 수 없습니다. 네이버 로그인 해주세요!");
            $(".login_on").show();
            $("#logoutBtn").hide();
            $(".mypage_content").hide();
            $("#statusBox").hide();
        }
    });
</script>
</body>
</html>
