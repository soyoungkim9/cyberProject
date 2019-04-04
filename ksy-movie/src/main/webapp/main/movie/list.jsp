<%@ page language="java"
		 contentType="text/html; charset=UTF-8"
		 pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
	<title>CINEMA - 박스오피스</title>
	<meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" media="only screen and (min-width:415px)" href="../movie/css/pc/list.css" />
	<link rel="stylesheet" type="text/css" media="only screen and (max-width:414px)" href="../movie/css/mobile/list.css" />
</head>
<body>
<div id="wrap">
	<ul id="tab1">
		<li><a class="tab1_current tab1_style">현재상영작</a></li>
		<li><a class="tab1_expected">상영예정작</a></li>
	</ul>
	<div id="tab2">
		<ul>
			<li><a id="reserveList" class="tab2_style">예매순</a></li>
			<li><a id="gradeList">평점순</a></li>
		</ul>
	</div>
	<div id="tab_content"></div>
	<a id="btn_view"><span>더보기 + </span></a>
</div>
<script id="list-template" type="text/x-handlebars-template">
<ul>
	{{#movieList}}
		<li>
			<div class="movie_img">
				<span class="hoverStyle">
					<span class="reserve_Btn">예매하기</span>
					<span class="detail_btn" data-mno="{{mno}}">상세보기</span>
				</span>
				<span class="movieImgStyle">
					<img src="../../upload/{{fileurl}}">
					<span class="mno">{{inc @key}}</span>
				</span>
			</div>
			<dl class="movie_text">
				<dt>
					<span class="ageStyle">{{age}}</span>{{name}}
				</dt>
				<dd class="movie_text_bottom">
					<dl>
						<dt>예매율</dt><dd class="reserveP" data-cnt="{{mCnt}}"></dd>
						<dt>관람평점</dt><dd class="gradeP"></dd>
					</dl>
				</dd>
			</dl>
		</li>
	{{/movieList}}
</ul>
</script>
<script src="../movie/js/list.js" charset="UTF-8"></script>
</body>
</html>