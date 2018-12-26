$("#addBtn2").on("click", function() {
  var output = nodeInput.value;
  if(output != "")
    $("#tb").append(output);
});

$("#removeBtn2").on("click", function() {
  if($("#tb").children().length == 0) {
    $("#tb").text("더 이상 삭제할 노드가 없습니다.");	  
  } else {
	$("#tb").children().last().remove();
  }
});