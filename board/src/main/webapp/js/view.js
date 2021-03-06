var size = 5;
var startNo = size+1;
var total = $(".comments").length;
var comment = $('#comment');

$(function() {
	comment.find(".updateBox").hide();
	comment.find(".updateComment2").hide();
	comment.find(".updateCancle").hide();
	$('.updateReplyNone').hide();
	$('.replyPwd').hide();
	$('.replyForm').hide();
	
	// 만약 뒤에 cno가 있으면 리스트 목록을 보이게 해라! (답변버튼 클릭 시)
	var cno;
	if($(location).attr('href').split("cno=")[1] == undefined) {
		$(".replyForm").hide();
		$("#replyBox").hide();
	} else {
		cno = $(location).attr('href').split("cno=")[1].split("#")[0];
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
				var pageload = $(location).attr('href');
				$(".replySubmit").on("click", function() {
					var name = $(".inputForm > input:nth-child(1)").val();
					var pwd = $(".inputForm > input:nth-child(2)").val();
					var content = $(".inputForm + textarea").val();
					$.ajax({
						method: "POST",
					  url: "writeReply.do",
					  data: {name: name, pwd: pwd, content: content, 
					  	no: no, pageNo: pageNo, cno: cno}
					}).done(function(){
						location.reload();
					});
				});
			}
		}
	}
});

// 댓글 수정1 클릭 시
$(".originContent").on("click", function() {
	$(this).find(".updateComment1").hide();
	$(this).find(".origin").hide();
	$(this).find(".replyBtn").hide();
	$(this).find(".updateBox").show();
	$(this).find(".updateComment2").show();
	$(this).find(".updateCancle").show();
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

// 답변 수정 선택 시1
$(".updateReplyBtn").on("click", function(){
	var x = $(this).attr("data-rno");
	for(var i = 0; i < $(".updateReplyBtn").length; i++) {
		if(x == $('input.updateReplyNone')[i].getAttribute('data-rno')) {
			$('textarea.updateReplyNone')[i].style.display = "inline-block";
			$('input.updateReplyNone')[i].style.display = "inline-block";
			$('a.updateReplyNone')[i].style.display = "inline-block";
			$('.replyPwd')[i].style.display = "inline-block";
			$('.replyContent')[i].style.display = "none";
			$('.updateReplyBtn').hide();
			$('.deleteReplyBtn').hide();
		}
	}
	$('.replyForm').hide();
});

// 답변 수정 선택 시 2 (submit)
$(".replyAjax").on("click", function(){
	var index = $('.replyAjax').index(this);
	var rno = $(this).attr("data-rno");
	var originPwd = $(this).attr("data-pwd");
	var content = $(".updateReplyContent:eq(" + index + ")").val();
	if($(".replyPwd:eq(" + index + ")").val() == "") {
		alert("비밀번호를 입력해 주세요.");
	} else if($(".replyPwd:eq(" + index + ")").val() != originPwd) {
		alert("잘못된 비밀번호 입니다.");
	} else {
		$.ajax({
			method: "POST",
		  url: "modifyReply.do",
		  data: {rno: rno, pwd: originPwd, content: content}
		}).done(function(){
			location.reload();
		});
	}
});

//답변 삭제 버튼 클릭 시
$(".deleteReplyBtn").on("click", function(){
	var index = $('.deleteReplyBtn').index(this);
	var originPwd = $(".deleteReplyBtn:eq(" + index + ")").attr("data-pwd");
	var userInput = prompt("댓글 비밀번호를 입력해 주세요.");
	var before = $(".deleteReplyBtn").attr("href");
	if(userInput == "") {
		alert("비밀번호가 입력돼지 않았습니다.");
		$(".deleteReplyBtn").attr("href", $(location).attr('href'));
	} else if(userInput != originPwd) {
		alert("잘못된 비밀번호 입니다.");
		$(".deleteReplyBtn").attr("href", $(location).attr('href'));
	} else {
		var rno = $(this).attr("data-rno");
		$.ajax({
		  url: "deleteReply.do?rno=" + rno,
		}).done(function(){
			location.reload();
		});
	}
});