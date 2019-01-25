(function () {
    var oversize = false;

    //이미지 change
	$("#fileContent").hide();

	$("#file").change(function() {
		if(this.files && this.files[0]) {
	$("#fileContent").show();
			var reader = new FileReader();
			reader.onload = function(e) {
				$('#fileContent').attr('src', e.target.result);
			}
			reader.readAsDataURL(this.files[0]);
		}
	});

	$("input[type='reset']").on("click", function(){
		$("#fileContent").hide();
	});

	$("#btnSubmit").on("click", function () {
        // 입력크기 검사
	    var len = $("[data-alert]").length;
        for(var i = 0; i < len; i++) {
            if($("[data-alert]:eq(" + i + ")").attr("data-alert") == "block") {
                oversize = true;
            }
        }
        
        if($("input[name='title']").val() == "") {
            $("input[name='title']").attr("placeholder", "제목을 입력하세요!");
            $("input[name='title']").addClass("validation");
        } else if($("input[name='name']").val() == "") {
            $("input[name='name']").addClass("validation");
            $("input[name='name']").attr("placeholder", "작성자를 입력하세요!");
        } else if($("input[name='pwd']").val() == "") {
            $("input[name='pwd']").attr("placeholder", "비밀번호를 입력하세요!");
            $("input[name='pwd']").addClass("validation");
        } else if(oversize == true) {
            oversize = false;
            alert("입력값이 너무 큽니다.");
        } else {
            document.boardForm.submit();
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
})();