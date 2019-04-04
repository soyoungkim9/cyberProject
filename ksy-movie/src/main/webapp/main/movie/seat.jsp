<%@ page language="java"
         contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
    <title>CINEMA - 예매</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" media="only screen and (min-width:415px)" href="../movie/css/pc/selectbox.min.css">
    <link rel="stylesheet" media="only screen and (max-width:414px)" href="../movie/css/mobile/selectbox.min.css">
    <link rel="stylesheet" media="only screen and (min-width:415px)" href="../movie/css/pc/seat.css">
    <link rel="stylesheet" media="only screen and (max-width:414px)" href="../movie/css/mobile/seat.css">
</head>
<body>
<div id="wrap">
    <div class="fixed_style">
        <div><h3>인원/좌석선택</h3></div>
        <div id="resetBox"><button type="button">전체 초기화</button></div>
        <div id="selectBox">
            <div class="justwrap">
                <label for="person0">성인</label>
                <select id= "person0" name="person0" class="justselect" required="" data-sid="select-1"
                        style="display: none;">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
                <div class="selectbox" data-pair="select-1">
                    <div id="seatListBox0" class="selectbox-options selectbox-options--hidden">
                        <div class="selectbox__option" data-value="0">0</div>
                        <div class="selectbox__option" data-value="1">1</div>
                        <div class="selectbox__option" data-value="2">2</div>
                        <div class="selectbox__option" data-value="3">3</div>
                        <div class="selectbox__option" data-value="4">4</div>
                    </div>
                </div>
            </div>
            <div class="justwrap">
                <label for="person1">청소년</label>
                <select id= "person1" name="person1" class="justselect" required="" data-sid="select-2"
                        style="display: none;">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
                <div class="selectbox" data-pair="select-2">
                    <div id="seatListBox1" class="selectbox-options selectbox-options--hidden">
                        <div class="selectbox__option" data-value="0">0</div>
                        <div class="selectbox__option" data-value="1">1</div>
                        <div class="selectbox__option" data-value="2">2</div>
                        <div class="selectbox__option" data-value="3">3</div>
                        <div class="selectbox__option" data-value="4">4</div>
                    </div>
                </div>
            </div>
            <div class="justwrap">
                <label for="person2">시니어</label>
                <select id= "person2" name="person2" class="justselect" required="" data-sid="select-3"
                        style="display: none;">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
                <div class="selectbox" data-pair="select-3">
                    <div id="seatListBox2" class="selectbox-options selectbox-options--hidden">
                        <div class="selectbox__option" data-value="0">0</div>
                        <div class="selectbox__option" data-value="1">1</div>
                        <div class="selectbox__option" data-value="2">2</div>
                        <div class="selectbox__option" data-value="3">3</div>
                        <div class="selectbox__option" data-value="4">4</div>
                    </div>
                </div>
            </div>
            <div class="justwrap">
                <label for="person3">장애인</label>
                <select id= "person3" name="person3" class="justselect" required="" data-sid="select-4"
                        style="display: none;">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
                <div class="selectbox" data-pair="select-4">
                    <div id="seatListBox3" class="selectbox-options selectbox-options--hidden">
                        <div class="selectbox__option" data-value="0">0</div>
                        <div class="selectbox__option" data-value="1">1</div>
                        <div class="selectbox__option" data-value="2">2</div>
                        <div class="selectbox__option" data-value="3">3</div>
                        <div class="selectbox__option" data-value="4">4</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="seat_Box">
        <div><p>Screen</p></div>
        <div id="seat_arrange"></div>
        <div id="seat_option_box">
            <ul>
                <li><span class="seat_option_style1"></span>선택가능</li>
                <li><span class="seat_option_style2"></span>선택불가</li>
                <li><span class="seat_option_style3"></span>선택좌석</li>
            </ul>
        </div>
    </div>
    <div id="total_Box">
        <ul>
            <li>
                <dl>
                    <dt>영화</dt>
                    <dd><dl id="movie_data"><dt></dt><dd></dd></dl></dd>
                </dl>
            </li>
            <li>
                <dl>
                    <dt>예매정보</dt>
                    <dd>
                        <dl id="info_data">
                            <dt>상영일</dt><dd id="info_day_data"></dd>
                            <dt>시작시간</dt><dd id="info_time_data"></dd>
                            <dt>상영관</dt><dd id="info_theater_data"></dd>
                            <dt>좌석</dt><dd id="info_seat_data"></dd>
                        </dl>
                    </dd>
                </dl>
            </li>
            <li>
                <dl id="money_data">
                    <dt>총 결제 금액</dt>
                    <dd>
                        <dl>
                            <dt>성인</dt><dd id="adult_pay"><span class="pay"></span><span class="person"></span></dd>
                            <dt>청소년</dt><dd id="teenager_pay"><span class="pay"></span><span class="person"></span></dd>
                            <dt>시니어</dt><dd id="senior_pay"><span class="pay"></span><span class="person"></span></dd>
                            <dt>장애인</dt><dd id="disabled_pay"><span class="pay"></span><span class="person"></span></dd>
                        </dl>
                    </dd>
                    <strong><span id="total_pay"></span><span> 원</span></strong>
                </dl>
            </li>
        </ul>
    </div>
    <div id="payment_Box">
        <button id="payment_Btn" type="button">결제하기</button>
    </div>
</div>
<script src="../movie/js/selectbox.min.js"></script>
<script src="../movie/js/seat.js" charset="UTF-8"></script>
</body>
</html>