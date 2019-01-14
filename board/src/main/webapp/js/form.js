// 이미지 change
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