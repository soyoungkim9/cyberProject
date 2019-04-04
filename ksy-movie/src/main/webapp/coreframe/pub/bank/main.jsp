<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/layout" prefix="layout"%>
<!doctype html>
<html lang="ko">
<head>
	<title>CoreSecurity 인터넷 뱅킹</title>
	<layout:elementGroup sequencialTypeNames="css,less,js" >
		<layout:element name="box" autoDevicePostfix="true"/>
		<layout:element name="input" autoDevicePostfix="true"/>
		<layout:element name="datepicker"/>
	</layout:elementGroup>
</head>
<body>
	
	<form action="?">
		<div class="ci-box round">
			<div class="ci-tl"></div>
			<div class="ci-tr"></div>
			<div class="ci-br"></div>
			<div class="ci-bl"></div>
			<fieldset class="ci-ia">
				<legend>인풋영역</legend>
				<ul>
					<li class="ci-cg">
						<label for="account">계좌번호</label>
						
						<select name="" id="account">
							<option value="">010101-191-1918229 (신용)</option>
							<option value="">010101-191-1918229</option>
							<option value="">010101-191-1918229</option>
						</select>
						
						<span class="cg-m-up">오상원</span>
					</li>

					<li class="ci-cg">
						<label for="password">비밀번호</label>
						<input type="password" name="" id="password"/>
						<input type="checkbox" class="cg-m-down" name="" id="passwordsave">
						<label class="checkbox" for="passwordsave">비밀번호 저장</label>
					</li>

					<li class="ci-cg cg-m-xoo">
						<label for="stock">종목코드</label>
						<input type="text" name="code" id="stock" value="005930"/>
						<input type="button" class="codeSearchBtn" value="검색"/>
						<span class="cg-m-up">삼성전자</span>
					</li>
							
					<li class="ci-cg">
						<label for="market">시장</label>
						<select name="" id="market">
							<option value="">전체</option>
							<option value="">KOSPI</option>
							<option value="">KOSDAQ</option>
						</select>
					</li>
							
					<li class="ci-cg cg-m-oo">
						<label for="marketplace">시장</label>
						<select name="" id="marketplace">
							<option value="">전체</option>
							<option value="">KOSPI</option>
							<option value="">KOSDAQ</option>
						</select>
					</li>
							
					<li class="ci-cg cg-checkbox">
						<fieldset>
							<legend>체크</legend>
							<input type="checkbox" name="" id="check1" checked="checked">
							<label class="checkbox" for="check1">우선주</label>
							<input type="checkbox" name="" id="check2">
							<label class="checkbox" for="check2">관리종목</label>
						</fieldset>
					</li>
					<li class="ci-cg cg-checkbox">
							
						<fieldset>
							<legend>조건</legend>
											
							<input type="checkbox" name="" id="check11" checked="checked">
							<label class="checkbox" for="check11">CHECK 1</label>
											
							<input type="checkbox" name="" id="check22">
							<label class="checkbox" for="check22">CHECK 2</label>
											
							<input type="checkbox" name="" id="check33" disabled="disabled" checked="checked">
							<label class="checkbox" for="check33">CHECK 3</label>
						</fieldset>
										
					</li>
					<li class="ci-cg">
						<label for="rate1">등락률</label>
						<input type="text" name="" id="rate1">
					</li>
					
					<li class="ci-cg cg-m-oo">
						<label for="rate2">등락률</label>
						<input type="text" name="" id="rate2">
					</li>
					
					<li class="ci-cg cg-m-xoo">
						<label for="rate">등락률</label>
						<input type="text" name="" id="rate">
						<span class="value">%이하</span>
					</li>
									
					<li class="ci-cg cg-m-xoo">
						<label for="amount">거래량</label>
						<input type="text" name="" id="amount">
						<span class="value">천주이상</span>
					</li>
					<li class="ci-cg cg-m-ooo">
						<label for="rate8">등락률</label>
						<input type="text" name="" id="rate8">
						<span class="value">%이하</span>
					</li>
									
					<li class="ci-cg cg-pc-100 cg-m-ooo">
						<label for="amount8">거래량</label>
						<input type="text" name="" id="amount8">
						<span class="value">천주이상</span>
					</li>
					
					<li class="ci-cg cg-pc-33 cg-radio">
					
						<fieldset>
							<legend>검색조건 1</legend>
							
							<input type="radio" name="radio" id="radio1" checked="checked">
							<label class="radio" for="radio1">라디오1</label>
							
							<input type="radio" name="radio" id="radio2">
							<label class="radio" for="radio2">라디오2</label>
						</fieldset>
					
					</li>
					<li class="ci-cg cg-pc-33 cg-radio">
							
						<fieldset>
							<legend>검색조건 2</legend>
							
							<input type="radio" name="radio2" id="radio11" checked="checked" disabled="disabled">
							<label class="radio" for="radio11">라디오1</label>
							
							<input type="radio" name="radio2" id="radio22" disabled="disabled">
							<label class="radio" for="radio22">라디오2</label>
						</fieldset>
					
					</li>
		
					<li class="ci-cg cg-pc-33 cg-radio">
							
						<fieldset>
							<legend>검색조건 3</legend>
							
							<input type="radio" name="radio3" id="radio111" checked="checked">
							<label class="radio" for="radio111">라디오1</label>
							
							<input type="radio" name="radio3" id="radio222">
							<label class="radio" for="radio222">라디오2</label>
						</fieldset>
					
					</li>
		
					<li class="ci-cg cg-m-xoo">
						<label for="date">검색일</label>
						<input type="text" class="datepicker" name="date" id="date" value=""/>
					</li>
							
					<li class="ci-cg cg-m-ooo">
						<label for="date2">검색일</label>
						<input type="text" class="datepicker" name="date2" id="date2" value=""/>
					</li>


					<li class="ci-cg cg-pc-100 cg-fromToDate">
						<label for="date3">검색일</label>
						<input type="text" class="datepicker" name="date" id="date3" value=""/>
						<span>~</span>
						<input type="text" class="datepicker" name="date2" id="date4" value=""/>
						<input type="button" class="mediumBtn ci-datepicker-1week" value="1주일" />
						<input type="button" class="mediumBtn ci-datepicker-1month" value="1개월" />
						<input type="button" class="mediumBtn ci-datepicker-3month" value="3개월" />
						<input type="button" class="mediumBtn ci-datepicker-6month" value="6개월" />
						<input type="button" class="mediumBtn ci-datepicker-1year" value="1년" />
					</li>
				</ul>
		
			</fieldset>
		</div>
	</form>


	<form action="?">
		
		<fieldset class="ci-ia ia-liketable">
			
			<legend>또다른 인풋 영역</legend>

			<ul>
				
				<li class="ci-cg">
					<label for="a-select1">계좌번호</label>
					<select name="" id="a-select1">
						<option value="">010101-191-1918229 (신용)</option>
						<option value="">010101-191-1918229</option>
						<option value="">010101-191-1918229</option>
					</select>
				</li>
				<li class="ci-cg cg-radio">
					<fieldset>
						<legend>구분</legend>
						
						<input type="radio" name="radio3" id="radio1111" checked="checked">
						<label class="radio" for="radio1111">전체</label>
						
						<input type="radio" name="radio3" id="radio2222">
						<label class="radio" for="radio2222">한화 → 은행</label>

						<input type="radio" name="radio3" id="radio3333">
						<label class="radio" for="radio3333">한화 → 한화</label>
					</fieldset>
				</li>
				<li class="ci-cg">
					<label for="a-password1">비밀번호</label>
					<input type="password" name="" id="a-password1"/>
				</li>
				<li class="ci-cg">
					<label for="a-text1">이체금액</label>
					<input type="text" name="" id="a-text1"/>
				</li>
				<li class="ci-cg">
					<label for="a-text2">출금계좌 표기내용</label>
					<input type="text" name="" id="a-text2"/>
				</li>
			</ul>


		</fieldset>

	</form>


	<script>
		$('.datepicker').each(function(){
			ci.datepicker($(this));
		});
	</script>

	

</body>
</html>
