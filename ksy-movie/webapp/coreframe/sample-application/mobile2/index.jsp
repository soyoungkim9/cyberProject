<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/menu" prefix="m"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/layout" prefix="layout"%>
<% 
String tmpl_dir = (String)request.getAttribute("TEMPLET_DIR");
if(tmpl_dir ==null) tmpl_dir = request.getContextPath()+"/coreframe/sample-application/mobile2";

%>

<html>
<head>
	<layout:head></layout:head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta name="viewport" content="initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=no;" />
	<link rel="stylesheet" type="text/css" href="<%=tmpl_dir%>/common/main.css" />
	<script type="text/javascript" src="<%=tmpl_dir%>/common/common.js"></script>
	<script type="text/javascript" src="<%=tmpl_dir%>/common/ajax.js"></script>
	<script type="text/javascript" src="<%=tmpl_dir%>/common/refresh.js"></script>

<script type="text/javascript"> 
var AJAX = createRequest(); 

function reloadJisu(){
	AJAX.open("GET", "http://m.youfirst.co.kr/ajax/ajaxIndex.jsp");
	AJAX.onreadystatechange = __reloadJisu;
	AJAX.send(null);
}
function __reloadJisu() {
	if (AJAX.readyState == 4) {
		if (AJAX.status == 200) {
			var json = eval('(' + AJAX.responseText +')'); 
			//window.location = 
			"http://m.youfirst.co.kr/sise/present.jsp?txtItmCd="+json.jcodeSearch+"&txtItmNm="+json.ls_ItmNmSearch;
			alert(json.mainHdTime1);
			document.getElementById("mainHdTime1").innerHTML = json.mainHdTime1;
			document.getElementById("mainHdUpdown").innerHTML = json.mainHdUpdown;
			document.getElementById("mainHdPlusminus").innerHTML = json.mainHdPlusminus;
			document.getElementById("mainHdJisu").innerHTML = json.mainHdJisu;
			document.getElementById("mainKospiUpdown").innerHTML = json.mainKospiUpdown;
			document.getElementById("mainKospiJisu").innerHTML = json.mainKospiJisu;
			document.getElementById("mainKosdaqUpdown").innerHTML = json.mainKosdaqUpdown;
			document.getElementById("mainKosdaqJisu").innerHTML = json.mainKosdaqJisu;
			document.getElementById("mainKospi200Updown").innerHTML = json.mainKospi200Updown;
			document.getElementById("mainKospi200Jisu").innerHTML = json.mainKospi200Jisu;
			document.getElementById("mainKospiFuUpdown").innerHTML = json.mainKospiFuUpdown;
			document.getElementById("mainKospiFuJisu").innerHTML = json.mainKospiFuJisu;
			//document.getElementById("mainHdTime2").innerHTML = json.mainHdTime2;
			document.getElementById("mainDowUpdown").innerHTML = json.mainDowUpdown;
			document.getElementById("mainDowJisu").innerHTML = json.mainDowJisu;
			document.getElementById("mainNasdaqUpdown").innerHTML = json.mainNasdaqUpdown;
			document.getElementById("mainNasdaqJisu").innerHTML = json.mainNasdaqJisu;
			document.getElementById("mainSnp500Updown").innerHTML = json.mainSnp500Updown;
			document.getElementById("mainSnp500Jisu").innerHTML = json.mainSnp500Jisu;
			document.getElementById("mainNikkeiUpdown").innerHTML = json.mainNikkeiUpdown;
			document.getElementById("mainNikkeiJisu").innerHTML = json.mainNikkeiJisu;
			//document.getElementById("mainHdTime3").innerHTML = json.mainHdTime3;
			document.getElementById("mainWonUpdown").innerHTML = json.mainWonUpdown;
			document.getElementById("mainWonJisu").innerHTML = json.mainWonJisu;
			document.getElementById("mainEnUpdown").innerHTML = json.mainEnUpdown;
			document.getElementById("mainEnJisu").innerHTML = json.mainEnJisu;
			document.getElementById("mainOliUpdown").innerHTML = json.mainOliUpdown;
			document.getElementById("mainOilJisu").innerHTML = json.mainOilJisu;
			document.getElementById("mainGoldUpdown").innerHTML = json.mainGoldUpdown;
			document.getElementById("mainGoldJisu").innerHTML = json.mainGoldJisu;
		}
	}
}
goRefresh(autoRe, autoReTime, reloadJisu);

</script>

	<title>Mobile2 Sample</title>
</head>
<body>
	<div id="head">
		<h1>
			<a href="/index.jsp">
				<img src="<%=tmpl_dir%>/img/logo_youfirst.gif" alt="You First" />
			</a>
		</h1>
		<!-- 광고 -->
		<div class="ad">
			<p>
				<img src="<%=tmpl_dir%>/img/banner_top_main.gif" alt="자산관리의 정답을 만나다"></img>
			</p>
		</div>	
		<div id="realStock">
		<div id="realStockCont">
			<ul class="tab">
				<li class="item1"><a href="#realValue1" onclick="mainTab.change('realValue1'); return false;">국내</a></li>
				<li class="item2"><a href="#realValue2" onclick="mainTab.change('realValue2'); return false;">해외</a></li>
				<li class="item3"><a href="#realValue3" onclick="mainTab.change('realValue3'); return false;">환율/원자재</a></li>
				<li class="item4"><a href="#realValue4" onclick="mainTab.change('realValue4'); return false;">검색 <img src="<%=tmpl_dir%>/img/ico_zoom.gif" class="ico" alt="search" /></a></li>
			</ul>
	
			<div id="realValue1" class="realValue">
				<p class="time" id="mainHdTime1">장마감</p>
	
				<div class="value">
					<span class="prev" onclick="mainTab.moveRoll($('realValue1'),0);"><img src="<%=tmpl_dir%>/img/btn_prev.gif" alt="이전" /></span>
					<span class="next" onclick="mainTab.moveRoll($('realValue1'),1);"><img src="<%=tmpl_dir%>/img/btn_next.gif" alt="다음" /></span>
					<ul class="rollList">
						<li style="display:block;">
							<strong class="name">현대증권</strong>
							<strong class="result" id="mainHdJisu">13,600</strong>
							<span class="variation">
								<span class="item" id="mainHdUpdown"><img src="<%=tmpl_dir%>/img/ico_down.gif" class="ico" alt="" /> 300</span>
								<span class="item" id="mainHdPlusminus"><img src="<%=tmpl_dir%>/img/ico_value2_minus.gif" class="ico" alt="" /> 2.15 %</span>
							</span>
						</li>
						<li style="display:none;">
							<strong class="name">KOSPI</strong>
							<strong class="result" id="mainKospiJisu">1,692.85</strong>
							<span class="variation">
								<span class="item" id="mainKospiUpdown"><img src="<%=tmpl_dir%>/img/ico_down.gif" class="ico" alt="" /> 7.34</span>
								<span class="item"><!--<img src="<%=tmpl_dir%>/img/ico_value2_minus" class="ico" alt="" /> 0.00%--></span>
							</span>
						</li>
						<li style="display:none;">
							<strong class="name">KOSDAQ</strong>
							<strong class="result" id="mainKosdaqJisu">515.74</strong>
							<span class="variation">
								<span class="item" id="mainKosdaqUpdown"><img src="<%=tmpl_dir%>/img/ico_down.gif" class="ico" alt="" /> 2.31</span>
								<span class="item"><!--<img src="<%=tmpl_dir%>/img/ico_value2_minus" class="ico" alt="" /> 0.00%--></span>
							</span>
						</li>
						<li style="display:none;">
							<strong class="name">KOSPI200</strong>
							<strong class="result" id="mainKospi200Jisu">221.58</strong>
							<span class="variation">
								<span class="item" id="mainKospi200Updown"><img src="<%=tmpl_dir%>/img/ico_down.gif" class="ico" alt="" /> 0.90</span>
								<span class="item"><!--<img src="<%=tmpl_dir%>/img/ico_value2_minus" class="ico" alt="" /> 0.00%--></span>
							</span>
						</li>
						<li style="display:none;">
							<strong class="name">선물</strong>
							<strong class="result" id="mainKospiFuJisu">222.65</strong>
							<span class="variation">
								<span class="item" id="mainKospiFuUpdown"><img src="<%=tmpl_dir%>/img/ico_down.gif" class="ico" alt="" /> 0.35</span>
								<span class="item"><!--&nbsp;&nbsp; 0.00%--></span>
							</span>
						</li>
					</ul>
				</div>
			</div>
			<div id="realValue2" class="realValue">
				<p class="time" id="mainHdTime2">&nbsp;</p>
	
				<div class="value">
					<span class="prev" onclick="mainTab.moveRoll($('realValue2'),0)"><img src="<%=tmpl_dir%>/img/btn_prev.gif" alt="이전" /></span>
					<span class="next" onclick="mainTab.moveRoll($('realValue2'),1)"><img src="<%=tmpl_dir%>/img/btn_next.gif" alt="다음" /></span>
					<ul class="rollList">
						<li style="display:block;">
							<strong class="name">DOW</strong>
							<strong class="result" id="mainDowJisu">10,907.42</strong>
							<span class="variation">
								<span class="item" id="mainDowUpdown"><img src="<%=tmpl_dir%>/img/ico_up.gif" class="ico" alt="" /> 11.56</span>
								<span class="item"></span>
							</span>
						</li>
						<li style="display:none;">
							<strong class="name">NASDAQ</strong>
							<strong class="result" id="mainNasdaqJisu">2,410.69</strong>
							<span class="variation">
								<span class="item" id="mainNasdaqUpdown"><img src="<%=tmpl_dir%>/img/ico_up.gif" class="ico" alt="" /> 6.33</span>
								<span class="item"></span>
							</span>
						</li>
						<li style="display:none;">
							<strong class="name">S&P500</strong>
							<strong class="result" id="mainSnp500Jisu">1,173.27</strong>
							<span class="variation">
								<span class="item" id="mainSnp500Updown"><img src="<%=tmpl_dir%>/img/ico_down.gif" class="ico" alt="" /> 0.05</span>
								<span class="item"></span>
							</span>
						</li>
						<li style="display:none;">
							<strong class="name">NIKKEI</strong>
							<strong class="result" id="mainNikkeiJisu">11,089.94</strong>
							<span class="variation">
								<span class="item" id="mainNikkeiUpdown"><img src="<%=tmpl_dir%>/img/ico_down.gif" class="ico" alt="" /> 7.20</span>
								<span class="item"></span>
							</span>
						</li>
					</ul>
				</div>
			</div>
			<div id="realValue3" class="realValue">
				<p class="time" id="mainHdTime3">&nbsp;</p>
	
				<div class="value">
					<span class="prev" onclick="mainTab.moveRoll($('realValue3'),0)"><img src="<%=tmpl_dir%>/img/btn_prev.gif" alt="이전" /></span>
					<span class="next" onclick="mainTab.moveRoll($('realValue3'),1)"><img src="<%=tmpl_dir%>/img/btn_next.gif" alt="다음" /></span>
					<ul class="rollList">
						<li style="display:block;">
							<strong class="name">원/달러</strong>
							<strong class="result" id="mainWonJisu">1,131.30</strong>
							<span class="variation">
								<span class="item" id="mainWonUpdown"><img src="<%=tmpl_dir%>/img/ico_up.gif" class="ico" alt="" /> 1.20</span>
								<span class="item"></span>
							</span>
						</li>
						<li style="display:none;">
							<strong class="name">엔/달러</strong>
							<strong class="result" id="mainEnJisu">93.37</strong>
							<span class="variation">
								<span class="item" id="mainEnUpdown"><img src="<%=tmpl_dir%>/img/ico_up.gif" class="ico" alt="" /> 0.41</span>
								<span class="item"></span>
							</span>
						</li>
						<li style="display:none;">
							<strong class="name">석유(WTI)</strong>
							<strong class="result" id="mainOilJisu">82.45</strong>
							<span class="variation">
								<span class="item" id="mainOliUpdown"><img src="<%=tmpl_dir%>/img/ico_up.gif" class="ico" alt="" /> 0.10</span>
								<span class="item"></span>
							</span>
						</li>
						<li style="display:none;">
							<strong class="name">금</strong>
							<strong class="result" id="mainGoldJisu">1,104.50</strong>
							<span class="variation">
								<span class="item" id="mainGoldUpdown"><img src="<%=tmpl_dir%>/img/ico_down.gif" class="ico" alt="" /> 5.80</span>
								<span class="item"></span>
							</span>
						</li>
					</ul>
				</div>
			</div>
			<div id="realValue4" class="realValue">
				<p class="label">현재가 검색</p>
				<div class="search">
					<label for=""><img src="<%=tmpl_dir%>/img/txt_search.gif" alt="search" /></label>
					<input type="text" class="text" value="" name="" id="stockCode" onfocus="this.style.background='#FFF';" onblur="if(this.value=='') this.style.background='#fff url(<%=tmpl_dir%>/img/bg_srhmsg.gif) no-repeat';" style="background: url(<%=tmpl_dir%>/img/bg_srhmsg2.gif) no-repeat rgb(255, 255, 255);"/>
					<input type="image" class="image" src="<%=tmpl_dir%>/img/btn_search.gif" onclick="serchStock(document.getElementById('stockCode').value);" alt="search" />
				</div>
			</div>
		</div>
	</div><script>mainTab.change('realValue1');</script>
	</div>
		<div id="cont">
		<!-- menu Start // -->
		<ul class="GNB">
			<li><a href="<%=tmpl_dir%>/jisu/totalJisu.jsp"><img src="<%=tmpl_dir%>/img/ico_menu1.gif" alt="" /> 대표지수</a></li>
			<li><a href="<%=tmpl_dir%>/sise/jongMok.jsp"><img src="<%=tmpl_dir%>/img/ico_menu2.gif" alt="" /> 관심종목</a></li>
			<li><a href="<%=tmpl_dir%>/sise/totalSise.jsp"><img src="<%=tmpl_dir%>/img/ico_menu3.gif" alt="" /> 시세</a></li>
			<li><a href="<%=tmpl_dir%>/sise/totalNews.jsp"><img src="<%=tmpl_dir%>/img/ico_menu4.gif" alt="" /> 뉴스</a></li>
		</ul>
		<!-- menu End // -->
		</div>

	<!-- [s] contentArea -->
<center>
<h3>*본 화면은 Templet을 적용한 화면이 아닙니다!<br/>
*지수정보는 Static info이며<br/>
*초기화면을 제외하고 나머지 부분은 Mobile2 Templet 적용~!<br/>
*상단의 아이콘을 클릭하면 Templet 확인할 수 있습니다~!
</h3>
</center>
	<!-- [e] contentArea -->

	<!-- [s] footArea -->
<div id="footer"> 
		<p class="ad"><a href="/noti/event_01.html"><img src="<%=tmpl_dir %>/img/banner.gif" alt="현대증권에서 펀드의 신되자 QnA 이벤트 바로가기" /></a></p> 
		<p class="tel"> 
			<span class="item">고객만족센터 <strong>1588-6611</strong></span> 
			<span class="item">주문전용 <strong>1566-6611</strong></span> 
		</p> 
		<address> 
			<span class="logo"><img src="<%=tmpl_dir %>/img/logo_hyundai.gif" alt="현대증권" /></span> 
			(c) HYUNDAI SECRUITIES Corp.
		</address> 
	</div> 
	<!-- [e] footArea -->
</body>
</html>