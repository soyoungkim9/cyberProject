<%@ page language="java"
		 contentType="text/html; charset=UTF-8"
		 pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
	<title>CINEMA - 영화상세</title>
	<meta charset="UTF-8">
	<link rel="stylesheet" media="only screen and (min-width:415px)" href="../movie/css/pc/listDetail.css">
	<link rel="stylesheet" media="only screen and (max-width:414px)" href="../movie/css/mobile/listDetail.css">
    <link rel="stylesheet" media="only screen and (min-width:415px)" href="../movie/css/pc/rate.css">
    <link rel="stylesheet" media="only screen and (max-width:414px)" href="../movie/css/mobile/rate.css">
</head>
<body>
<div id="wrap">
	<div class="page_name"><h3>영화상세</h3></div>
	<div id="detail_content_box">
		<div id="detail_top">
			<div><img alt="영화이미지"></div>
			<div>
				<div class="info_title"></div>
				<dl class="info_grade_box">
					<dt>관람평점</dt>
					<dd class="info_grade"></dd>
					<dd class="info_grade_text"></dd>
				</dl>
				<dl>
					<dt>등급</dt>
					<dd class="info_age"></dd><br>
					<dt>개봉일</dt>
					<dd class="info_sdt"></dd><br>
					<dt>기본정보</dt>
					<dd class="info_genre"></dd><br>
					<dt>감독</dt>
					<dd class="info_director"></dd><br>
					<dt>배우</dt>
					<dd class="info_actor"></dd>
				</dl>
			</div>
		</div>
		<div id="detail_ex">
			<h3>시놉시스</h3>
		</div>
	</div>
	<div class="page_name"><h3>평점 및 영화 리뷰</h3></div>
	<div id="review_box">
		<div id="comment_write">
			<div class="score_star">
				<span>평점</span>
				<span>
                    <div id="rateBox"></div>
                </span>
			</div>
			<div class="score_textarea">
				<textarea id="txtComment" cols="92" rows="6"></textarea>
				<a id="comment_write_btn">입력</a>
			</div>
		</div>
		<div id="comment_list"></div>
	</div>
</div>
<script id="list-template" type="text/x-handlebars-template">
	<ul>
		{{#unless total}}
			<li class="no_comments">등록된 댓글이 없습니다.</li>
		{{/unless}}
		{{#comments}}
		<li data-writer="{{id}}">
			<div class="left_box" data-cmo="{{cmo}}">
				<div class="review_score" data-score="{{grade}}">
					<div class="starList"></div>
				</div>
				<p class="review_content">{{content}}</p>
				<div class="review_date_like">
					<div class="review_date">{{rdate}}</div>
					<div class="review_like"></div>
				</div>
			</div>
			<div class="left_update_box" data-cmo="{{cmo}}">
				<div class="review_update_score" data-score="{{grade}}">
					<div class="starList_update"></div>
				</div>
				<textarea class="review_update_content"></textarea>
			</div>
            <div class="right_box">
                <div class="review_id">{{id}}</div>
                <a class="review_update" data-cmo="{{cmo}}">수정</a>
                <a class="review_update_write" data-cmo="{{cmo}}">등록</a>
                <a class="review_delete" data-cmo="{{cmo}}">삭제</a>
            </div>
		</li>
		{{/comments}}
	</ul>
	{{#if total}}
	<div id="comments_page">
		<a data-pno="1">&lt;&lt;</a>
		<a id="before">&lt;</a>
		<span id="number_box"></span>
		<a id="after">&gt;</a>
		<a id="total">&gt;&gt;</a>
	</div>
	{{/if}}
</script>
<script src="../movie/js/rate.js"></script>
<script src="../movie/js/listDetail.js" charset="UTF-8"></script>
</body>
</html>