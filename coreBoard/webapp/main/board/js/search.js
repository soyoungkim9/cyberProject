// 페이지에 색깔, 옵션값 유지, 텍스트 상자 값 유지
$(function() {
     if($(location).attr("href").split("pageNo=")[1] == undefined) {
         $(location).attr("href", $(location).attr("href") + "&pageNo=1");
     }

	var page = parseInt($(location).attr("href").split("=")[3]);
	var search = decodeURI($(location).attr("href")).split("search=")[1].split("&")[0];
	var searchList = $(location).attr("href").split("searchList=")[1].split("&")[0];
	
	for(var i = 1; i <= $("[name='searchList']").children().length; i++) {
		if($("[name='searchList'] > option:nth-child(" + i + ")")[0].value == searchList) {
			$("[name='searchList'] > option:nth-child(" + i + ")")[0].setAttribute("selected", "selected");
		}
	}
	$("[name='search']").val(search);
	
	for(var i = 0; i < $(".number").length; i++) {
		if(parseInt($(".number")[i].text) == page) {
			$(".number")[i].className = "selected";
		}
	}
});

// 뒤로가기, 앞으로가기 버튼 조절
if($("tfoot").children().length != 0) {
	var before = parseInt($("#before").attr("href").split("pageNo=")[1]);
	var beforeSearch1 = $("#before").attr("href").split("pageNo=")[0];
	var after = parseInt($("#after").attr("href").split("pageNo=")[1]);
	var afterSearch1 = $("#after").attr("href").split("pageNo=")[0];
	var total = parseInt($("#total").attr("href").split("pageNo=")[1]);
	
	if(before < 0) {
		$("#before").attr("href", beforeSearch1 + "pageNo=1");
	}
	
	if(after > total) {
		$("#after").attr("href", afterSearch1 +"pageNo=" + total);
	}
}




