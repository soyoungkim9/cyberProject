<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<html>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=8,chrome=1">

<head>
<title>BLD</title>

${import_baseUI}

<script type="text/javascript">

$(window).bind('resizestop',function(e) {
	$('div.content').height(parseInt($(window).height())-50);
});

$('body').ready(function() {
	
	$('#tabs').tabs();
	
	$.ajax( {url:'./getDbmsData?key=',dataType:'text',success:function(msg){
		
		$('.ux-tree').append(msg);
	}});
	
	$('div.content').height(parseInt($(window).height())-50);
	
	$('.ux-tree').click(function(e) {
		
		var o=e.target;
		
		if( $(o).hasClass('hasChildT') ) {
		  p=o.parentNode;
		  var key= $(p).attr('data-key');
		  var s=$(p).attr('data-set');
		  if(s == undefined) {
			$(o).addClass('unfold');
			$.ajax( {url:'./getDbmsData?key='+key,dataType:'text',success:function(msg){
				$(p).append(msg);
				$(p).attr('data-set','unfolded');
			}});
		  }else if(s=='unfolded') {
				$(p).attr('data-set','folded').find('> ol').hide();
				$(o).removeClass('unfold');
		  }else {
				$(p).attr('data-set','unfolded').find('> ol').show();
				$(o).addClass('unfold');
		  }
		}
		else if( $(o).hasClass('label') ) {
			 p=o.parentNode;
			 var key= $(p).attr('data-key');
			 var type= $(p).attr('data-type');
			 var nm = $(o).html();
			 
			 fireEvent({'key':key, 'type':type, 'name':nm,'cObj':o});
		}
	});
	
});

var preLabelObj;
function fireEvent(eobj) {
	
	//bld, dataTyp, labelObj
	labelObj=eobj.cObj;
	
	if(eobj.type!='file') return;
	try {
		if(preLabelObj)
		$(preLabelObj).removeClass('sel');
	}catch(e){}
	$(labelObj).addClass('sel');
	preLabelObj=labelObj;
	
	
	parent.frames['main'].location.href='./viewDbmsInfo?path='+eobj.key;
}

</script>

</head>



<body>

<div id="tabs">
<ul>
 <li><a href="#tabs-1">DBMS</a></li>
</ul>

<div class="section_body">
 <div class="content" id="bld_tree">
  <ol class="ux-tree" ></ol>
 </div>
</div>

</div>

</body>

</html>