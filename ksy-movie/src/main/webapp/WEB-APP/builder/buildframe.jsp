<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/layout" prefix="layout"%>
<!doctype html>
<html lang="ko">
<head>
	<layout:elementGroup sequencialTypeNames="css,less,js">
		<layout:element name="box" autoDevicePostfix="true"/>
		<layout:element name="input" autoDevicePostfix="true"/>
		<layout:element name="datepicker"/>
	</layout:elementGroup>

	<title>Webponent Build Frame</title>
</head>
<body>

	<div class="cf-box round">
		<div class="cf-tl"></div>
		<div class="cf-tr"></div>
		<div class="cf-br"></div>
		<div class="cf-bl"></div>
		<form action="">
			<fieldset class="cf-ia">
				<legend>인풋영역</legend>
				<ul>
					<li class="cf-cg value">
						<label for="account">계좌번호</label>
						
						<select name="" id="account">
							<option value="">010101-191-1918229 (신용)</option>
							<option value="">010101-191-1918229</option>
							<option value="">010101-191-1918229</option>
						</select>
						
						<span class="value">오상원</span>
					</li>
							
					<li class="cf-cg xoo value">
						<label for="stock">종목코드</label>
						<input type="text" name="code" id="stock" value="005930"/>
						<input type="button" value="검색"/>
						<span class="value">삼성전자</span>
					</li>
							
					<li class="cf-cg">
						<label for="market">시장</label>
						<select name="" id="market">
							<option value="">전체</option>
							<option value="">KOSPI</option>
							<option value="">KOSDAQ</option>
						</select>
					</li>
							
					<li class="cf-cg oo">
						<label for="marketplace">시장</label>
						<select name="" id="marketplace">
							<option value="">전체</option>
							<option value="">KOSPI</option>
							<option value="">KOSDAQ</option>
						</select>
					</li>
							
					<li class="cf-cg checkbox">
						<fieldset>
							<legend>체크</legend>
							<input type="checkbox" name="" id="check1" checked="checked">
							<label for="check1">우선주</label>
								<input type="checkbox" name="" id="check2">
							<label for="check2">관리종목</label>
						</fieldset>
					</li>
					<li class="cf-cg checkbox">
							
						<fieldset>
							<legend>조건</legend>
											
							<input type="checkbox" name="" id="check11" checked="checked">
							<label for="check11">CHECK 1</label>
											
							<input type="checkbox" name="" id="check22">
							<label for="check22">CHECK 2</label>
											
							<input type="checkbox" name="" id="check33" disabled="disabled" checked="checked">
							<label for="check33">CHECK 3</label>
						</fieldset>
										
					</li>
					<li class="cf-cg">
						<label for="rate1">등락률</label>
						<input type="text" name="" id="rate1">
					</li>
					
					<li class="cf-cg oo">
						<label for="rate2">등락률</label>
						<input type="text" name="" id="rate2">
					</li>
					
					<li class="cf-cg xoo">
						<label for="rate">등락률</label>
						<input type="text" name="" id="rate">
						<span class="value">%이하</span>
					</li>
									
					<li class="cf-cg xoo">
						<label for="amount">거래량</label>
						<input type="text" name="" id="amount">
						<span class="value">천주이상</span>
					</li>
					<li class="cf-cg ooo">
						<label for="rate8">등락률</label>
						<input type="text" name="" id="rate8">
						<span class="value">%이하</span>
					</li>
									
					<li class="cf-cg ooo">
						<label for="amount8">거래량</label>
						<input type="text" name="" id="amount8">
						<span class="value">천주이상</span>
					</li>
					
					<li class="cf-cg pc33 radio">
					
						<fieldset>
							<legend>검색조건 1</legend>
							
							<input type="radio" name="radio" id="radio1" checked="checked">
							<label for="radio1">라디오1</label>
							
							<input type="radio" name="radio" id="radio2">
							<label for="radio2">라디오2</label>
						</fieldset>
					
					</li>
					<li class="cf-cg pc33 radio">
							
						<fieldset>
							<legend>검색조건 2</legend>
							
							<input type="radio" name="radio2" id="radio11" checked="checked" disabled="disabled">
							<label for="radio11">라디오1</label>
							
							<input type="radio" name="radio2" id="radio22" disabled="disabled">
							<label for="radio22">라디오2</label>
						</fieldset>
					
					</li>
		
					<li class="cf-cg pc33 radio">
							
						<fieldset>
							<legend>검색조건 3</legend>
							
							<input type="radio" name="radio3" id="radio111" checked="checked">
							<label for="radio111">라디오1</label>
							
							<input type="radio" name="radio3" id="radio222">
							<label for="radio222">라디오2</label>
						</fieldset>
					
					</li>
		
					<li class="cf-cg xoo">
						<label for="date">검색일</label>
						<input type="text" class="datepicker" name="date" id="date" value=""/>
					</li>
							
					<li class="cf-cg ooo">
						<label for="date2">검색일</label>
						<input type="text" class="datepicker" name="date2" id="date2" value=""/>
					</li>

					<li class="cf-cg pc100 xooooo">
						<label for="date3">검색일</label>
						<input type="text" class="datepicker" name="date" id="date3" value=""/>
						<span>~</span>
						<input type="text" class="datepicker" name="date2" id="date4" value=""/>
					</li>
				</ul>
		
			</fieldset>
		</form>
	</div>

	<script>
		$('.datepicker').each(function(){
			cf.datepicker($(this));
		});
	</script>

	<script>

		$(document).ready(function () {
			var body = $('body');
			var webponents = body.find('[class*="cf"]');
			var elements = body.find('*');
			
			elements.on('click', function (e) {
				var parentWebponent = $(this).parent();
				console.log(parentWebponent[0]);
				e.stopPropagation();
			});
		});

	</script>
</body>
</html>