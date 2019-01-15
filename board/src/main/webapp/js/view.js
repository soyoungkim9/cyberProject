var size = 5;
var startNo = size+1;
var total = $(".comments").length;
var comment = $('#comment');

$(function() {
	comment.find(".updateBox").hide();
	comment.find(".updateComment2").hide();
	
	// 만약 뒤에 cno가 있으면 리스트 목록을 보이게 해라!
	var cno = $(location).attr('href').split("cno=")[1];
	if(cno == undefined) {
		$(".replyForm").hide();
		$("#replyBox").hide();
	} else {
		var index = $('.replyBtn');
		for(var i = 0; i < index.length; i++) {
			if(index[i].getAttribute("data-cno") == cno) {
				var n = i+1;
				$(".comments:nth-child(" + n + ")").append($("#replyBox"));
				$(".comments:nth-child(" + n + ")").append($(".replyForm"));
				$(".replyBtn")[i].style.display = "none";
				$(".updateComment1")[i].style.display = "none";
				$(".commentDelete")[i].style.display = "none";
				$(".replyForm").show();
				$("#replyBox").show();
				
				var no = $(location).attr('href').split("no=")[1].split("&")[0];
				var pageNo = $(location).attr('href').split("pageNo=")[1].split("&")[0];
				$(".replySubmit").on("click", function() {
					var name = $(".inputForm > input:nth-child(1)").val();
					var pwd = $(".inputForm > input:nth-child(2)").val();
					var content = $(".inputForm + textarea").val();
					$.ajax({
						method: "POST",
					  url: "writeReply.do",
					  data: {name: name, pwd: pwd, content: content, 
					  	no: no, pageNo: pageNo, cno: cno}
					});
				});
			}
		}
	}
	
	
	//답변 버튼 클릭 시
	/*
	var cno = $(location).attr('href').split("cno=")[1];
	if(cno != undefined) {
		var index = $('.replyBtn');
		for(var i = 0; i < index.length; i++) {
			if(index[i].getAttribute("data-cno") == cno) {
				var n = i+1;
				$(".comments:nth-child(" + n + ")").append($(".replyForm"));
				$(".replyBtn")[i].style.display = "none";
				$(".updateComment1")[i].style.display = "none";
				$(".commentDelete")[i].style.display = "none";
				$(".replyForm").show();
				
				// 답변 post방식으로 전송
				var no = $(location).attr('href').split("no=")[1].split("&")[0];
				var pageNo = $(location).attr('href').split("pageNo=")[1].split("&")[0];
				$(".replySubmit").on("click", function() {
					var name = $(".inputForm > input:nth-child(1)").val();
					var pwd = $(".inputForm > input:nth-child(2)").val();
					var content = $(".inputForm + textarea").val();
					$.ajax({
						method: "POST",
					  url: "writeReply.do",
					  data: {name: name, pwd: pwd, content: content, 
					  	no: no, pageNo: pageNo, cno: cno}
					});
				});
			}
		}
	}
	*/
});


// 초기댓글 화면
if(total > size) {
	for(var i = startNo; i <= total; i++) {
		comment.find(".comments:nth-child(" + i +")").hide();
	}
}

// 더보기 클릭 시 댓글 5개씩 늘어난다.
$("#showComment").on("click", function() {
	for(var i = startNo; i < startNo + size; i++) {
		comment.find(".comments:nth-child(" + i +")").show();
	}
	startNo += size;
});

// 댓글 수정1 클릭 시
$(".originContent").on("click", function() {
	$(this).find(".updateComment1").hide();
	$(this).find(".origin").hide();
	$(this).find(".replyBtn").hide();
	$(this).find(".updateBox").show();
	$(this).find(".updateComment2").show();
});

// 댓글 수정2 클릭 시 
$(".updateComment2").on("click", function() {
	var index = $('.updateComment2').index(this);
	var originPwd= $(".inputPwd:eq(" + index + ")").attr("data-originPwd");
	
	if($(".inputPwd:eq(" + index + ")").val() == "") {
		alert("비밀번호를 입력해 주세요.");
	} else if($(".inputPwd:eq(" + index + ")").val() != originPwd) {
		alert("잘못된 비밀번호 입니다.");
	}
});


// 게시글 삭제 버튼 클릭 시
$("#boardDelete").on("click", function(){
	var originPwd = $("#boardDelete").attr("data-pwd");
	var userInput = prompt("게시글 비밀번호를 입력해 주세요.");
	var before = $("#boardDelete").attr("href");
	if(userInput == "") {
		alert("비밀번호가 입력돼지 않았습니다.");
		$("#boardDelete").attr("href", before + "&pwd=fail");
	} else if(userInput != originPwd) {
		alert("잘못된 비밀번호 입니다.");
		$("#boardDelete").attr("href", before + "&pwd=fail");
	}
});

// 댓글 삭제 버튼 클릭 시 commentDelete
$(".commentDelete").on("click", function(){
	var index = $('.commentDelete').index(this);
	var originPwd = $(".commentDelete:eq(" + index + ")").attr("data-pwd");
	var userInput = prompt("댓글 비밀번호를 입력해 주세요.");
	var before = $(".commentDelete").attr("href");
	if(userInput == "") {
		alert("비밀번호가 입력돼지 않았습니다.");
		$(".commentDelete").attr("href", before + "&pwd=fail");
	} else if(userInput != originPwd) {
		alert("잘못된 비밀번호 입니다.");
		$(".commentDelete").attr("href", before + "&pwd=fail");
	}
});

// 답변 버튼 클릭시
/*
$(".replyBtn").on("click", function(e) {
	e.stopPropagation(); // 이벤트 버블링 막기
	
	var index = $('.replyBtn').index(this);
	var cno = $(".replyBtn:eq(" + index + ")").attr("data-cno");
	var no = $(location).attr('href').split("no=")[1].split("&")[0];
	var pageNo = $(location).attr('href').split("pageNo=")[1];
	$(".comments:eq(" + index + ")").append($(".replyForm"));
	$(".replyBtn").hide();
	$(".updateComment1").hide();
	$(".commentDelete").hide();
	$(".replyForm").show();
	
	// 답변 목록 get방식으로 처리
//	$.ajax({
//		url: "listReply.do",
//		data: {cno: cno, no: no, pageNo: pageNo}
//	}).done(function(data){
//		console.log("성공");
//		console.log(cno);
//	});
//	
	// 답변작성 post방식으로 전송
	$(".replySubmit").on("click", function() {
		var name = $(".inputForm > input:nth-child(1)").val();
		var pwd = $(".inputForm > input:nth-child(2)").val();
		var content = $(".inputForm + textarea").val();
		$.ajax({
			method: "POST",
			url: "writeReply.do",
			data: {name: name, pwd: pwd, content: content, 
				no: no, pageNo: pageNo, cno: cno}
		});
	});
});
*/



