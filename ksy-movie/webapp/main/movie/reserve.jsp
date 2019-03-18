<%@ page language="java"
		 contentType="text/html; charset=UTF-8"
		 pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
	<title>CINEMA - 예매</title>
	<meta charset="UTF-8">
	<link rel="stylesheet" media="only screen and (min-width:415px)" href="../movie/css/pc/reserve.css" />
	<link rel="stylesheet" media="only screen and (max-width:414px)" href="../movie/css/mobile/reserve.css" />
	<link rel="stylesheet" media="only screen and (min-width:415px)" href="../movie/css/pc/rangecalendar.css">
	<link rel="stylesheet" media="only screen and (max-width:414px)" href="../movie/css/mobile/rangecalendar.css">
</head>
<body>
<div id="wrap">
	<div id="calendar_Box">
		<div id="demo"></div>
	</div>
	<div id="ticket_Picker_Box">
		<div id="ticket_left">
			<div><h3>영화관</h3></div>
			<div id="area_Zone_Box">
				<div id="area_Zone"></div>
				<div id="area_Zone_Content"></div>
			</div>
		</div>
		<div id="ticket_right">
			<div><h3>영화</h3></div>
			<div>
				<div id="tab">
					<ul>
						<li><a id="reserveList" class="tabStyle">예매순</a></li>
						<li><a id="gradeList">평점순</a></li>
					</ul>
				</div>
				<div id="movieList"></div>
			</div>
		</div>
	</div>
	<div id="selectMv_Area_Box">
		<dl>
			<dt>상영일</dt>
			<dd id="selectMv_Time"></dd>
		</dl>
		<dl>
			<dt>영화관</dt>
			<dd id="selectMv_Zone">영화관을 선택하세요. (최대 2개)</dd>
		</dl>
		<dl>
			<dt>영화</dt>
			<dd id="selectMv">영화를 선택하세요. (최대 2개)</dd>
		</dl>
	</div>
	<div id="time_Picker_Box">
		<div><h3>상영시간</h3></div>
		<div id="time_Zone">
			<div id="time_noData">
				<span>상영시간이 조회되지 않았습니다! 영화관 및 영화를 선택해 주십시오.</span>
			</div>
			<div id="time_list01">
				<h4 class="time_title"></h4>
			</div>
			<div id="time_list02">
				<h4 class="time_title"></h4>
			</div>
		</div>
	</div>
</div>
<script id="city-template" type="text/x-handlebars-template">
	<ul>
		{{#reserveList}}
		<li><a data-cno="{{cno}}">{{name}}</a></li>
		{{/reserveList}}
	</ul>
</script>
<script id="area-template" type="text/x-handlebars-template">
		<ul>
			{{#reserveList}}
			<li><a data-cno="{{cno}}" data-ano="{{ano}}">{{name}}</a></li>
			{{/reserveList}}
		</ul>
</script>
<script id="movie-template" type="text/x-handlebars-template">
	<ul>
		{{#movieList}}
		<li data-mno="{{mno}}">
			<a><span class="ageStyle">{{age}}</span><span class="movie_name">{{name}}</span></a>
		</li>
		{{/movieList}}
	</ul>
</script>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.0/jquery-ui.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.7.0/moment-with-langs.min.js"></script>
<script src="../movie/js/jquery.rangecalendar.js" charset="UTF-8"></script>
<script src="../movie/js/reserve.js" charset="UTF-8"></script>
</body>
</html>