<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/layout" prefix="layout"%>
<!doctype html>
<html lang="ko">
<head>
	<title>CoreSecurity 인터넷 뱅킹 이체</title>
	<layout:elementGroup sequencialTypeNames="css,less,js" >
		<layout:element name="input" autoDevicePostfix="true"/>
		<layout:element name="datepicker"/>
	</layout:elementGroup>
</head>
<body>

	<h3>업종별현재가</h3>

	<form action="">
		
		<div class="inputArea">
			
			<fieldset class="cg">
				<label for="market">시장</label>
				<select name="" id="market">
					<option value="">KOSPI</option>
					<option value="">KOSDAQ</option>
				</select>
			</fieldset>

			<fieldset class="cg xoo value">
				<label for="market2">업종</label>
				<select name="" id="market2">
					<option value="">001</option>
					<option value="">002</option>
					<option value="">003</option>
				</select>
				<input type="button" value="검색">
				<span class="value">KOSPI(종합)</span>
			</fieldset>

			<fieldset class="cg">
				<label for="market3">대금구분</label>
				<select name="" id="market3">
					<option value="">순매수대금</option>
					<option value="">순매수대금2</option>
					<option value="">순매수대금3</option>
				</select>
			</fieldset>

			<fieldset class="cg button">
				<input type="button" value="조회">
			</fieldset>

		</div>

	</form>

	<h3>회원시간</h3>

	<form action="">
		
		<div class="inputArea">
			
			<fieldset class="cg">
				<label for="market11">회원</label>
				<select name="" id="market11">
					<option value="">외국계합</option>
					<option value="">외국계합2</option>
				</select>
			</fieldset>

			<fieldset class="cg xoo value">
				<label for="stock">종목코드</label>
				<input type="text" name="code" id="stock" value="005930"/>
				<input type="button" value="검색"/>
				<span class="value">삼성전자</span>
			</fieldset>

			<fieldset class="cg button">
				<input type="button" value="조회">
			</fieldset>

		</div>

		

	</form>
</body>
</html>
