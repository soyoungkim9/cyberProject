<%@ page language="java"
         contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
    <title>CINEMA - 마이페이지</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" media="only screen and (min-width:415px)" href="../movie/css/pc/mypage.css">
    <link rel="stylesheet" media="only screen and (max-width:414px)" href="../movie/css/mobile/mypage.css">
</head>
<body>
<div id="wrap">
    <div><h3>마이페이지</h3></div>
    <div>
        <ul id="tab">
            <li><a>예매/구매내역</a></li>
        </ul>
        <div id="tab_content">
            <div id="no_content"><span>예매/구매한 내역이 없습니다.</span></div>
            <div id="view_contnet"></div>
        </div>
    </div>
</div>
<script id="list-template" type="text/x-handlebars-template">
{{#ticket}}
<div class="ticket_box">
    <dl class="ticket_number_box"><dt>예매번호</dt><dd class="ticket_number"></dd></dl>
    <div class="ticket_menu"><a class="cancle_Btn">취소하기</a><a class="success_Btn">관람완료</a><a class="detail_btn">후기남기기</a><a class="detail_view_btn">상세보기</a></div>
    <div class="ticket_img"><img></div>
    <dl class="ticket_info">
        <dt></dt>
        <dd>
            <dl class="ticket_info_detail">
                <dt>상영일</dt>
                <dd class="ticket_date"></dd>
                <dt>상영시간</dt>
                <dd class="ticket_time"></dd>
                <dt>상영관</dt>
                <dd class="ticket_location"></dd>
                <dt>관람인원</dt>
                <dd class="ticket_seat"></dd>
            </dl>
        </dd>
    </dl>
    <dl class="ticket_charge_box">
        <dt>총 결제 금액</dt>
        <dd class="ticket_charge"></dd>
    </dl>
</div>
{{/ticket}}
</script>
<script src="../movie/js/mypage.js" charset="UTF-8"></script>
</body>
</html>