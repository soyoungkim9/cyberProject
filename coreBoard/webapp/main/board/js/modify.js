var oversize = false;
var originPwd= $("#pwd").attr("data-originPwd");

$("#update").on('click', function() {
    // 입력크기 검사
    var len = $("[data-alert]").length;
    for(var i = 0; i < len; i++) {
        if($("[data-alert]:eq(" + i + ")").attr("data-alert") == "block") {
            oversize = true;
        }
    }

    // 비밀번호 유효성 검사
	if($("#pwd").val() == "") {
		alert("비밀번호를 입력해 주세요.");
		return;
	} else if($("#pwd").val() != originPwd) {
		alert("잘못된 비밀번호 입니다.");
		return;
	}

	if($("input[name='title']").val() == "") {
        alert("제목을 입력해 주세요.");
        return;
	}

	if(oversize == true) {
        oversize = false;
        alert("입력값이 너무 큽니다.");
        return;
    }
	
	document.modifyForm.submit();
});

// 파일 변경
$("#file").change(function() {
	if(this.files && this.files[0]) {
		var reader = new FileReader();
		reader.onload = function(e) {
			$('#fileContent').attr('src', e.target.result);
		}
		reader.readAsDataURL(this.files[0]);
	}
});

// 입력글자 수 제한
$("input[type='text'], input[type='password'], textarea").blur(function(){
    var str = $(this).val();
    var limit = $(this).attr("data-size");
    var strLength = 0;

    for(var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        var ch = str.substr(i,1).toUpperCase();
        if ((ch < "0" || ch > "9") && (ch < "A" || ch > "Z") && ((code > 255) || (code < 0))){
            strLength += 2;
        } else {
            strLength += 1;
        }
    }

    if(strLength >= limit){
        $(this).next().css("display", "inline-block");
        $(this).attr("data-alert", "block");
    } else {
        $(this).next().css("display", "none");
        $(this).attr("data-alert", "none");
    }
});

