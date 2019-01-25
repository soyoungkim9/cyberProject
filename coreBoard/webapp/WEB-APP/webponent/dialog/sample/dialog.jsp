<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/layout" prefix="layout"%>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
<title>Dialog protoType</title>

<layout:elementGroup sequencialTypeNames="css,less,text,js">
	<layout:element name="coreframe-client" />
	<layout:element name="dialog" autoDevicePostfix="true" />
	<layout:element name="codemirror" />
</layout:elementGroup>

</head>
<body>

	<div class="dia-content ci-dialog-content">다이알로그 내용 입니다~ 다이알로그로 띄우고 싶은 마크업에 ci-dialog-content 클래스 주면 숨겨집니다</div>

	<div class="dia-content2 ci-dialog-content">
		다이알로그 내용 입니다~ 다이알로그로 띄우고 싶은 마크업에 ci-dialog-content 클래스 주면 숨겨집니다
		<input type="button" value="모달" class="open-modal-btn">
	</div>

	<div class="dia-quick ci-dialog-content">
		<ul>
			<li><a href="#">메뉴1</a></li>
			<li><a href="#">메뉴2</a></li>
			<li><a href="#">메뉴3</a></li>
			<li><a href="#">메뉴4</a></li>
			<li><a href="#">메뉴5</a></li>
			<li><a href="#">메뉴6</a></li>
		</ul>
	</div>

	<input id="dia1" type="button" value="화면내 HTML로 다이알로그 띄우기" />

	<input id="dia2" type="button" value="ajax로 페이지를 불러와서 다이알로그 띄우기" />

	<input id="dia3" type="button" value="title이 없는 다이알로그 띄우기" />

	<input id="dia4" type="button" value="단순 텍스트 출력 하는 다이알로그 띄우기" />

	<input id="dia5" type="button" value="여러가지 콜백들" />

	<input id="dia6" type="button" value="다이알로그에 버튼 추가하는 방법" />

	<input id="dia7" type="button" value="기본적으로 나오는 닫기 버튼을 없애는 방법" />

	<input id="dia9" type="button" value="버튼 재클릭시 다시 닫혔다가 열리는 옵션" />

	<input id="dia10" type="button" value="모달" />

	<input id="layer-link-opener" type="button" value="레이어링크" />

	<script type="text/javascript">
		// 화면내 숨겨진 마크업으로 다이알로그 띄우기
		$('#dia1').on('click', function() {

			var dia1 = ci.dialog.open({
				id : 'dialog_1', // id 지정
				title : '다이아로그 프로토타입', // title 지정
				dom : $('.dia-content'), // 내용으로 들어갈 마크업 지정
				focus : $(this), // 다이알로그 닫친뒤 포커스를 주고싶은 요소 지정

				// dialog객체에 특정 데이터를 저장한다.
				// 데이터를 꺼내쓸때에는 ci.dialog.getData 함수를 이용한다.
				data : {
					a : 'va',
					b : 'vb'
				}
			});

		});

		// 데이터 가져오기;
		//console.log(ci.dialog.getData('dialog_1', 'a')); // returns 'va'

		// ajax로 페이지를 불러와서 다이알로그 띄우기
		$('#dia2').on('click', function() {

			var dia2 = ci.dialog.open({
				id : 'dialog_2',
				title : '다이아로그 프로토타입',
				url : '/WEB-APP/wts/view/include/5hoka.jsp', // 페이지 url지정
				ajaxOption : { //일반적인 ajax 옵션들을 여기서 정의할수 있음
					data : 'name=sangwon&age=28'
				},
				focus : $(this)

			});

		});

		// title이 없는 다이알로그 띄우기
		$('#dia3').on('click', function() {

			var dia3 = ci.dialog.open({
				id : 'dialog_3',
				notitle : true, // 이옵션을 켜주면 타이틀이 지워집니다.
				dom : $('.dia-content'),
				focus : $(this)

			});

		});

		// 단순 텍스트 출력 하는 다이알로그 띄우기
		$('#dia4').on('click', function() {

			var dia4 = ci.dialog.open({
				id : 'dialog_4',
				notitle : true,
				msg : '간단한 텍스트는 바로 입력해서 띄울 수 있습니다.',
				focus : $(this)

			});

		});

		// 여러가지 콜백들
		$('#dia5').on('click', function() {

			var dia5 = ci.dialog.open({
				id : 'dialog_5',
				title : '다이아로그 프로토타입',
				url : '/WEB-APP/wts/view/include/5hoka.jsp',
				ajaxOption : {
					data : 'name=sangwon&age=28'
				},
				focus : $(this),

				close : function() {

					// 여기에서는 $(this)로 다이알로그 내용에 접근 할 수 있습니다.
					console.log($(this));
				},

				afterAppend : function() {

					// 여기서는 markup이라는 인자를 받아서 다이알로그 내용에 접근 할 수 있습니다 ^^;
					console.log(this);

				}
			});

		});

		// 다이알로그에 버튼 추가하는 방법
		$('#dia6').on('click', function() {

			var dia6 = ci.dialog.open({
				id : 'dialog_5',
				title : '다이아로그 프로토타입',
				url : '/WEB-APP/wts/view/include/5hoka.jsp',

				focus : $(this),

				// 배열형태로 버튼 text와 이벤트 콜백을 적어주면 
				// 공간이 허락하는 한 버튼을 계속 추가 할 수 있습니다.
				buttons : [ {
					text : '저장',
					click : function() {
						console.log($(this));
						alert('저장됨');
					}
				} ],
				clostButtonText : '확인'
			});

		});

		// 기본적으로 나오는 닫기 버튼을 없애는 방법
		$('#dia7').on('click', function() {

			var dia6 = ci.dialog.open({
				id : 'dialog_ff5',
				title : '다이아로그 프로토타입',
				dom : $('.dia-content'),

				focus : $(this),

				// 코딩할때 편의성때문에 기본적으로 닫기 버튼이 들어가 있습니다.
				// 기본 닫기버튼이 필요없는 경우는 아래옵션으로 지워주세요.
				closebutton : false,
				buttons : [ {
					text : '저장',
					click : function() {
						console.log($(this));
						alert('저장됨');
					}
				} ],
				clostButtonText : '확인'

			});

		});

		// 화면내 숨겨진 마크업으로 다이알로그 띄우기
		$('#dia9').on('click', function() {

			var dia1 = ci.dialog.open({
				id : 'dialog_9', // id 지정
				title : '다이아로그 프로토타입', // title 지정
				dom : $('.dia-content'), // 내용으로 들어갈 마크업 지정
				focus : $(this), // 다이알로그 닫친뒤 포커스를 주고싶은 요소 지정
				reopen : true,
				// dialog객체에 특정 데이터를 저장한다.
				// 데이터를 꺼내쓸때에는 ci.dialog.getData 함수를 이용한다.
				data : {
					a : 'va',
					b : 'vb'
				}
			});

		});

		// 화면내 숨겨진 마크업으로 다이알로그 띄우기
		$('#dia10').on('click', function() {

			var dia1 = ci.dialog.open({
				id : 'dialog_10', // id 지정
				title : '다이아로그 프로토타입', // title 지정
				dom : $('.dia-content2'), // 내용으로 들어갈 마크업 지정
				focus : $(this), // 다이알로그 닫친뒤 포커스를 주고싶은 요소 지정
				modal : true,
				afterAppend : function() {
					var btn = $(this).find('.open-modal-btn');
					btn.on('click', function() {

						var dia2 = ci.dialog.open({
							id : 'dialog_11', // id 지정
							title : '모달에 모달', // title 지정
							dom : $('.dia-content'), // 내용으로 들어갈 마크업 지정
							focus : $(this), // 다이알로그 닫친뒤 포커스를 주고싶은 요소 지정
							modal : true
						});
					});
				}
			});
		});

		$('#layer-link-opener').on('click', function(e) {

			e.preventDefault();

			var btn = $(this);
			var option = {
				position : 'left',
				messages : [ {
					'message' : '펀드 추가 매수zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'
				} ]
			};

			LayerLink.open(btn, option);
		});
	</script>
</body>
</html>