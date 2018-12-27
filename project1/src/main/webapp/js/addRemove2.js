$("#addBtn2").on("click", function() {
  if ($('tbody').children().length < 7) {
	  $('tbody').prepend('<tr><td>' + $("#time").val() + '</td>' +
			  			 				 '<td>'+ $("#price").val() +'</td>' +
			  			 				 '<td>'+ $("#netChange").val() +'</td>' +
			  			 				 '<td>'+ $("#sign").val() +'</td>' +
			  			 				 '<td>'+ $("#accumulate").val() +'</td></tr>');
  } else {
  	$("tbody").children().last().remove();
  	$('tbody').prepend('<tr><td>' + $("#time").val() + '</td>' +
  			'<td>'+ $("#price").val() +'</td>' +
  			'<td>'+ $("#netChange").val() +'</td>' +
  			'<td>'+ $("#sign").val() +'</td>' +
  			'<td>'+ $("#accumulate").val() +'</td></tr>');
  }	
});

$("#removeBtn2").on("click", function() {
  if ($('tbody').children().length != 0)
    $("tbody").children().last().remove();
});