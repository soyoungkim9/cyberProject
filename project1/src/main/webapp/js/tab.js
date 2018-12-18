$(function() {
		$(".ta_1").trigger("click");
});

$(".tabbed").click(function() {
	$(".tabbed").removeAttr("id");
	var sel_index = $(".tabbed").index(this) / 2 + 1;
	$(this).attr("id", "active");
	$(".tab_pane").hide();
	$(".type"+sel_index).show();
});
