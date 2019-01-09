var originPwd= $("#pwd").attr("data-originPwd");

// 비밀번호 유효성 검사
$("#update").on('click', function() {
	if($("#pwd").val() == "") {
		alert("비밀번호를 입력해 주세요.");
	} else if($("#pwd").val() != originPwd) {
		alert("잘못된 비밀번호 입니다.");
	}
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


