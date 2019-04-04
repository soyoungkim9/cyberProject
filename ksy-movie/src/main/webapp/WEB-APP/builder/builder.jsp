<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/layout" prefix="layout"%>
<!doctype html>
<html lang="ko">
<head>

	<layout:element name="bootstrap"/>

	<script type="text/javascript">
	    less = {
	        env: "development", // or "production"
	        async: false,       // load imports async
	        fileAsync: false,   // load imports async when in a page under
	                            // a file protocol
	        poll: 1000,         // when in watch mode, time in ms between polls
	        functions: {},      // user functions, keyed by name
	        dumpLineNumbers: "comments", // or "mediaQuery" or "all"
	        relativeUrls: false // whether to adjust url's to be relative
	                            // if false, url's are already relative to the
	                            // entry less file
	        
	    };
	</script>

	<style>

		::-webkit-scrollbar {
	    	width: 10px;
	    	height: 10px;
		}
		::-webkit-scrollbar-track {
		    background: #FFF;
		    -webkit-box-shadow: inset 1px 1px 2px rgba(0,0,0,0.1);
		}
		::-webkit-scrollbar-thumb {
		    background: #CCC;
		    -webkit-box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2);
		}
		::-webkit-scrollbar-thumb:hover {
		    background: #AAA;
		}
		::-webkit-scrollbar-thumb:active {
		    background: #888;
		    -webkit-box-shadow: inset 1px 1px 2px rgba(0,0,0,0.3);
		}

		body {
			padding: 10px;
			padding-top: 55px;
		}

		#build-frame-menu {
			margin-bottom: 10px;
		}

		#element-def {
			display: none;
			position: relative;
			height: 100px;
			margin-bottom : 10px;
			
		}

		#element-selector {
			position: absolute;
			left: 0;
			height: 100px;
			width : 200px;
			overflow-y: scroll;
			border: 1px solid #cacaca;
			-webkit-box-shadow: 0px 0px 3px 0px #cacaca;
			box-shadow: 0px 0px 3px 0px #cacaca;
		}

		#element-preview {
			padding: 10px;
			position: absolute;
			left : 220px;
			width: 250px;
			height: 80px;
			overflow-y: auto;
			border: 1px solid #cacaca;
			-webkit-box-shadow: 0px 0px 3px 0px #cacaca;
			box-shadow: 0px 0px 3px 0px #cacaca;
		}

		#element-append-controls {
			position: absolute;
			left : 510px;
			width: 150px;
			height: 100px;
		}

		#build-frame-preview {
			width: 100%;
		}


		#build-frame-preview-inner {
			width: 100%;
		}

		.buildframe {
			border: 1px solid #cacaca;
			width: 700px;
			height: 700px;
			resize: horizontal;
			-webkit-box-shadow: 0px 0px 3px 0px #cacaca;
			box-shadow: 0px 0px 3px 0px #cacaca;

		}

		.buildframe.mobile {
			margin-left: 10px;
			width: 330px;
			
		}

		.class-applied {

		}
	</style>

	<title>Webponent Builder</title>

</head>
<body>
	
	<div class="navbar navbar-inverse navbar-fixed-top">
		<div class="navbar-inner">
			<div class="container" style="width:auto">

				<!-- Be sure to leave the brand out there if you want it shown -->
				<a class="brand" href="#" style="margin-left:0px;">&#10010; Form Builder</a>

			</div>
		</div>
	</div>

	<div id="build-frame-menu">
		
		<div class="btn-group">
			<a class="btn btn-primary btn-small dropdown-toggle" data-toggle="dropdown" href="#">
				<span>메뉴</span>
				<span class="caret"></span>
			</a>
			<ul class="dropdown-menu">
				<li>
					<a id="new-builder" href="#">
						<span>새로 시작하기</span>
					</a>
				</li>
			</ul>
		</div>

		<div class="btn-group">
			
			<a class="btn btn-small dropdown-toggle" data-toggle="dropdown" href="#">
				<i class="icon-plus"></i>
			</a>
			<ul class="dropdown-menu" >
				<li>
					<a id="new-form" href="#">
						<span>Form</span>
					</a>
					<!-- <a id="add-element-test" href="#">
						<span>TEST</span>
					</a> -->
					<a id="add-control-group" href="#">
						<span>Control Group</span>
					</a>
				</li>
			</ul>
		</div>

		<div id="display-selector-string" class="btn-group">

			<button class="btn btn-small" type="button">선택된 요소 없음</button>
			
			<a class="btn btn-small dropdown-toggle" data-toggle="dropdown" href="#">
				<span class="caret"></span>
			</a>
			<ul id="show-element-option" class="dropdown-menu" style="left:auto;right:-135px">

				<li>
					<a href="#" id="select-parent-elem">부모 요소 선택</a>
				</li>

				<li>
					<a href="#" id="remove-selected-elem">선택 취소</a>
				</li>

				<li class="divider"></li>

				<li>
					<a href="#">삭제</a>
				</li>

				<li class="divider"></li>
			</ul>
		</div>

		<div class="btn-group">
			<a class="btn btn-small dropdown-toggle" data-toggle="dropdown" href="#">
				<span>소스 보기</span>
				<span class="caret"></span>
			</a>
			<ul class="dropdown-menu">
				<li><a href="#">현재 요소</a></li>
				<li><a href="#">부모 요소</a></li>
			</ul>
		</div>

	</div>

	<div id="element-def">
		<div id="element-selector">
			
		</div>
		<form id="element-preview">
			
		</form>

		<div id="element-append-controls">
			<button id="element-append-btn" class="btn btn-small btn-success">APPEND</button>
			<button id="element-append-cancel-btn" class="btn btn-small btn-danger">CANCEL</button>
		</div>
	</div>
	
	<div id="build-frame-preview">
		<div id="build-frame-preview-inner">
			<iframe id="pc-frame" class="buildframe" src="http://localhost/WEB-APP/webponent/input/inputUnitTest.jsp"></iframe>
		
			<iframe id="mobile-frame" class="buildframe mobile" src="http://m.localhost/WEB-APP/webponent/input/inputUnitTest.jsp"></iframe>
		</div>
	</div>
	
	<script type="text/javascript" src="/WEB-APP/webponent/jquery/jquery-1.9.1.min.js"></script>

	<script src="./templets/js/dominfo.js"></script>
	<script src="./templets/js/builder.js"></script>
	
</body>
</html>