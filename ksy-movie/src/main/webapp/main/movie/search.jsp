<%@ page language="java"
		 contentType="text/html; charset=UTF-8"
		 pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
	<title>CINEMA - 무비파인더</title>
	<meta meta http-equiv="Content-Language" content="ko">
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<link rel="stylesheet" media="only screen and (min-width:415px)" href="../movie/css/pc/rSlider.min.css" />
	<link rel="stylesheet" media="only screen and (max-width:414px)" href="../movie/css/mobile/rSlider.min.css" />
	<link rel="stylesheet" media="only screen and (min-width:415px)"href="../movie/css/pc/icheck-material.min.css">
	<link rel="stylesheet" media="only screen and (max-width:414px)" href="../movie/css/mobile/icheck-material.min.css">
	<link rel="stylesheet" media="only screen and (min-width:415px)"href="../movie/css/pc/selectbox.min.css">
	<link rel="stylesheet" media="only screen and (max-width:414px)" href="../movie/css/mobile/selectboxsearch.min.css">
	<link rel="stylesheet" media="only screen and (min-width:415px)" href="../movie/css/pc/search.css">
	<link rel="stylesheet" media="only screen and (max-width:414px)" href="../movie/css/mobile/search.css">
</head>
<body>
<div id="wrap">
	<div id="searchBox">
		<h2>Movie Search!</h2>
		<form id="movieSearch" action="search.cmd" method="GET" name="movieSearchForm" accept-charset="UTF-8">
			<table>
				<tbody>
					<tr>
						<th>영화검색</th>
						<td>
							<div class="justwrap">
								<select name="searchList" id="color" class="justselect" required="" data-sid="select-1"
										style="display: none;">
									<option value="all">전체</option>
									<option value="name">제목</option>
									<option value="director">감독</option>
									<option value="actor">주연배우</option>
								</select>
								<div class="selectbox" data-pair="select-1">
									<div id="searchListBox" class="selectbox-options selectbox-options--hidden">
										<div class="selectbox__option" data-value="all">전체</div>
										<div class="selectbox__option" data-value="title">제목</div>
										<div class="selectbox__option" data-value="director">감독</div>
										<div class="selectbox__option" data-value="actor">주연배우</div>
									</div>
								</div>
							</div>
							<input id="searchInput" type="text" name="search" placeholder="키워드를 입력해 주세요.">
						</td>
					</tr>
					<tr>
						<th>장르</th>
						<td>
							<ul>
								<li class="icheck-material-teal">
									<input type="checkbox" checked="" id="all_genre" class="checkOn">
									<label for="all_genre">전체</label>
								</li>
								<li class="icheck-material-teal">
									<input type="checkbox" checked="" name="genre" value="1" id="genre1">
									<label for="genre1">코미디</label>
								</li>
								<li class="icheck-material-teal">
									<input type="checkbox" checked="" name="genre" value="2" id="genre2">
									<label for="genre2">드라마</label>
								</li>
								<li class="icheck-material-teal">
									<input type="checkbox" checked="" name="genre" value="3" id="genre3">
									<label for="genre3">애니메이션</label>
								</li>
								<li class="icheck-material-teal">
									<input type="checkbox" checked="" name="genre" value="4" id="genre4">
									<label for="genre4">스릴러/범죄/공포</label>
								</li>
								<li class="icheck-material-teal">
									<input type="checkbox" checked="" name="genre" value="5" id="genre5">
									<label for="genre5">액션/모험/SF</label>
								</li>
							</ul>
						</td>
					</tr>
					<tr>
						<th>제작국가</th>
						<td>
							<ul>
								<li class="icheck-material-teal">
									<input type="checkbox" checked="" id="all_nation" class="checkOn">
									<label for="all_nation">전체</label>
								</li>
								<li class="icheck-material-teal">
									<input type="checkbox" checked="" name="nation" value="한국" id="nation1">
									<label for="nation1">한국</label>
								</li>
								<li class="icheck-material-teal">
									<input type="checkbox" checked="" name="nation" value="일본" id="nation2">
									<label for="nation2">일본</label>
								</li>
								<li class="icheck-material-teal">
									<input type="checkbox" checked="" name="nation" value="프랑스" id="nation3">
									<label for="nation3">프랑스</label>
								</li>
								<li class="icheck-material-teal">
									<input type="checkbox" checked="" name="nation" value="미국" id="nation4">
									<label for="nation4">미국</label>
								</li>
								<li class="icheck-material-teal">
									<input type="checkbox" checked="" name="nation" value="영국" id="nation5">
									<label for="nation5">영국</label>
								</li>
								<li class="icheck-material-teal">
									<input type="checkbox" checked="" name="nation" value="aside" id="nation6">
									<label for="nation6">기타</label>
								</li>
							</ul>
						</td>
					</tr>
					<tr>
						<th>관람등급</th>
						<td>
							<ul>
								<li class="icheck-material-teal">
									<input type="checkbox" checked="" id="all_age" class="checkOn">
									<label for="all_age">전체</label>
								</li>
								<li class="icheck-material-teal">
									<input type="checkbox" checked="" name="age" value="0" id="age0">
									<label for="age0">전체관람가</label>
								</li>
								<li class="icheck-material-teal">
									<input type="checkbox" checked="" name="age" value="12" id="age12">
									<label for="age12">12세관람가</label>
								</li>
								<li class="icheck-material-teal">
									<input type="checkbox" checked="" name="age" value="15" id="age15">
									<label for="age15">15세관람가</label>
								</li>
								<li class="icheck-material-teal">
									<input type="checkbox" checked="" name="age" value="19" id="age19">
									<label for="age19">19세관람가</label>
								</li>
							</ul>
						</td>
					</tr>
					<tr>
						<th>제작년도</th>
						<td>
							<div id="sliderStyle"><input type="text" id="slider" class="slider"></div>
							<input id="leftSdt" type="hidden" name="sdt" value="">
							<input id="rightSdt" type="hidden" name="edt" value="">
						</td>
						<td id="searchButtonBox">
							<button id="searchStartBtn" type="button">검색</button>
							<button id="searchInit" type="button">초기화</button>
						</td>
					</tr>
				</tbody>
			</table>
		</form>
		<div id="searchResultImgBox">
			<img id="searchResultImg" src="../movie/img/h3_search_results.gif">
			<h3>아래의 선택조건에 해당하는 영화가 총<span id="searchTotal"> ${total}</span>건 검색되었습니다.</h3>
			<!-- 키워드, 장르, 제작국가, 관람등급, 제작년도 script-->
			<div id="searchTextBox">
				<dl>
					<dt>키워드</dt>
					<dd id="kewordVal"></dd>
					<dt>장르</dt>
					<dd id="ganreVal"></dd>
					<dt>제작국가</dt>
					<dd id="nationVal"></dd>
					<dt>관람등급</dt>
					<dd id="ageVal"></dd>
					<dt>제작년도</dt>
					<dd id="sdtVal"></dd>
				</dl>

			</div>
		</div>
		<div id="search_content">
			<ul>
				<c:if test="${total == 0}">
					<li id="noSearchStyle">
						검색결과가 존재하지 않습니다.
					</li>
				</c:if>
                <c:if test="${total != 0}">
				<c:forEach var="search" items="${searchPage}">
					<li>
                        <span class="hoverStyle">
					        <span class="reserve_btn">예매하기</span>
					        <span class="detail_btn" data-mno="${search.mno}">상세보기</span>
				        </span>
                        <span class="movieImgStyle">
						    <div class="movie_img">
							    <img src="../../upload/${search.fileurl}">
						    </div>
                        </span>
						<dl class="movie_text">
							<dt>
								<span class="ageStyle">${search.age}</span>${search.name}
							</dt>
						</dl>
					</li>
				</c:forEach>
                </c:if>
			</ul>
		</div>
		<div id="search_page">
			<c:if test="${total > 0}">
				<a href="search.cmd?pageNo=1">&lt;&lt;</a>
				<a id="before" href="search.cmd?pageNo=${startPage - 5}">&lt;</a>
				<c:forEach var="pNo" begin="${startPage}" end="${endPage}">
					<a class="number" href="search.cmd?pageNo=${pNo}">${pNo}</a>
				</c:forEach>
				<a id="after" href="search.cmd?pageNo=${startPage + 5}">&gt;</a>
				<a id="total" href="search.cmd?pageNo=${totalPages}">&gt;&gt;</a>
			</c:if>
		</div>
	</div>
</div>
<script src="../movie/js/rSlider.min.js"></script>
<script src="../movie/js/selectbox.min.js"></script>
<script src="../movie/js/search.js" charset="UTF-8"></script>
</body>
</html>