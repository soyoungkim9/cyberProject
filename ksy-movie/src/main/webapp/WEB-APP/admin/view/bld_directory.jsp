<!DOCTYPE html>
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
	$('div.content').height(parseInt($(window).height())-72);
});

$('body').ready(function() {
	$('#indexing').click(function() {
       $.ajax( {url:'./indexBld', dataType:'text',success:function(msg){
			
			$('#result').html(msg);
		}});
	});
	
	$('#search').click(function(){
		
		
		$.ajax( {url:'./searchBld', type:'POST', data:$('#searchForm').serialize(),dataType:'text',success:function(msg){
			
			$('#result').html(msg);
		}});
		
	} );
	
	$('#result').click(function(e){
		var o=$(e.target);
		if( o.hasClass('icon') ) {
			 p=o.next();
			 var nm = $(p).html();
			 var key= nm;
			 
			 parent.frames['main'].location.href='./viewBld?path='+key;
		}
	});
	
	$('#tabs').tabs();
	
	$.ajax( {url:'./getTreeData?key=',dataType:'text',success:function(msg){
		
		$('.ux-tree').append(msg);
	}});
	
	$('div.content').height(parseInt($(window).height())-72);
	
	$('.ux-tree').click(function(e) {
		
		var o=e.target;
		
		if( $(o).hasClass('hasChildT') ) {
		  p=o.parentNode;
		  var key= $(p).attr('data-key');
		  var s=$(p).attr('data-set');
		  if(s == undefined) {
			$(o).addClass('unfold');
			$.ajax( {url:'./getTreeData?key='+key,dataType:'text',success:function(msg){
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
	
	parent.frames['main'].location.href='./viewBld?path='+eobj.key;
}

</script>

</head>



<body>

<div id="tabs">
<ul>
 <li><a href="#tabs-1">BLD Directory</a></li>
 <li><a href="#tabs-2">Search</a></li>
</ul>

<div id="tabs-1" class="section_body">
 <div class="content" id="bld_tree">
  <ol class="ux-tree" ></ol>
 </div>
</div>

<div id="tabs-2" class="section_body">
<form action="" id="searchForm">
<fieldset>
<table >
<tbody>
<tr>
<th>name</th>
<td><input type="text" name="name" value="keyword"/></td>
</tr>
<tr>
<th>description</th>
<td><input type="text" name="description"/></td>
</tr>
<tr>
<th>writer</th>
<td><input type="text" name="writer"/></td>
</tr>
<tr>
<th>CRUD type</th>
<td>
<select name="crudInfo">
<option value="">All</option>
<option value="DELETE">delete</option>
<option value="SELECT">select</option>
<option value="INSERT">insert</option>
<option value="UPDATE">update</option>

</select>
</td>
</tr>
<tr>
<th>SQL</th>
<td><input type="text" name="sqlInfo"/></td>
</tr>

</tbody>
</table>


<button id="search" type="button">Search</button>
<button id="indexing" type="button">Indexing BLD</button>

</fieldset>

<ol class="tree" id="result"></ol>

</form>




</div>

</div>

</body>

</html>