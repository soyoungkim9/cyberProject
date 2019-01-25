// 페이지에 색깔 입히기
$(function() {
	if($(location).attr("href").split("=")[1] == undefined) {
        $(location).attr("href", "list.cmd?pageNo=1");
	}

	var page = parseInt($(location).attr("href").split("=")[1]);
	
	for(var i = 0; i < $(".number").length; i++) {
		if(parseInt($(".number")[i].text) == page) {
			$(".number")[i].className = "selected";
		}
	}
	
});

// 뒤로가기, 앞으로가기 버튼 조절
var before = parseInt($("#before").attr("href").split("=")[1]);
var after = parseInt($("#after").attr("href").split("=")[1]);
var total = parseInt($("#total").attr("href").split("=")[1]);

if(before < 0) {
	$("#before").attr("href", "list.cmd?pageNo=" + 1);
}

if(after > total) {
	$("#after").attr("href", "list.cmd?pageNo=" + parseInt(before + 5));
}



