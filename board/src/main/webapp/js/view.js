var size = 5;
var startNo = size+1;
var total = $(".comments").length;
var comment = $('#comment');

$(function() {
	comment.find(".updateBox").hide();
	comment.find(".updateComment2").hide();
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

// 댓글 삭제 버튼 클릭 시commentDelete
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




