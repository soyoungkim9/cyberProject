<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=8,chrome=1">
<title>coreFRAME</title>

${import_baseUI}

<script>

	Map = function(){
		 this.map = new Object();
		};   
		Map.prototype = {   
		    put : function(key, value){   
		        this.map[key] = value;
		    },   
		    get : function(key){   
		        return this.map[key];
		    },
		    containsKey : function(key){    
		     return key in this.map;
		    },
		    containsValue : function(value){    
		     for(var prop in this.map){
		      if(this.map[prop] == value) return true;
		     }
		     return false;
		    },
		    isEmpty : function(key){    
		     return (this.size() == 0);
		    },
		    clear : function(){   
		     for(var prop in this.map){
		      delete this.map[prop];
		     }
		    },
		    remove : function(key){    
		     delete this.map[key];
		    },
		    keys : function(){   
		        var keys = new Array();   
		        for(var prop in this.map){   
		            keys.push(prop);
		        }   
		        return keys;
		    },
		    values : function(){   
		     var values = new Array();   
		        for(var prop in this.map){   
		         values.push(this.map[prop]);
		        }   
		        return values;
		    },
		    valuesTxt : function(){   
			     var rTxt='';
			     var i=0;
			        for(var prop in this.map){
			        	if(i>0) {
			        		rTxt=rTxt+','+this.map[prop];
			        	}else {
			        		rTxt=this.map[prop];
			        	}
			        	i++;
			        }   
			        return rTxt;
			    },
		    size : function(){
		      var count = 0;
		      for (var prop in this.map) {
		        count++;
		      }
		      return count;
		    }
		};
		
		var addMap = new Map();
		var delMap = new Map();
		var updMap = new Map();
		
		
 var editTbl;		
 
 function closeEdit() {
	 $('#editMaster').remove();
	 if(editTbl) {
		 editTbl.show();
	 }
 }
		
  $.fn.showEditMode=function() {
	  var tr=$(this).parent().parent();
	  
	  
	  
 	 
 	 var tds=tr.children();
 	 
 	 $('#editMaster').remove();
 	 
 	 var newTbl = $('<table class="tableList" id="editMaster"/>');
 	 newTbl.append('<tr><td colspan="3" class="sectionHead"><a href="javascript:closeEdit()">[X]</a> Edit Data</td></tr>');
 	 
 	 newTbl.append($('<colgroup><col class="name"/><col class="value wrap"/><col class="description wrap"/>'
 			 +'</colgroup><thead><th>Property</th><th>Value</th><th>Description</th></thead>'));

 	 var tbl = tr.parent().parent();
 	 tbl.after(newTbl);
 	 
 	 tbl.hide();
 	 editTbl=tbl;
 	 
 	 
 	 tds.each(function(i) {
 		 if(i>0) {
 			 
 		  var newTr = $('<tr/>');
 		  newTbl.append(newTr);
 		  newTr.append('<td>'+  tbl.find('th:eq(' +i+') ').text()   +'</td>');
 		  
 		  var z=$(this).clone();
 		  
 		  z.find('*[name]').each(function() {
 			var nm=$(this).attr('name');
 			$(this).attr('name', 'T'+nm);
 		  });
 		  newTr.append('<td>'+ z.html()+'</td>');
 		  newTr.append('<td>'+  tbl.find('th:eq(' +i+') ').attr('data-desc')   +'</td>');
 		 }
 		 
 		 
 	 } );
 	 
 	newTbl.find('input[type=radio]').change(function() {
 		var nm=$(this).attr('name');
 		$('input[name='+nm +']').each(function(){
 			
 			var val=$(this).attr('value');
 			var checked=$(this).attr('checked');
 			var orgNm = nm.substring(1);
 			
 			$('input[name='+orgNm+'][value='+ val+']').attr('checked',checked );
 			
 		});
 	});
 	
 	 newTbl.find('input').focusout(function() {
 		 var nm=$(this).attr('name').substring(1);
 		 var val = $(this).attr('value');
 		 tbl.find('input[name='+nm +']').attr('value',val).parent().addClass('changed');
 		 updMap.put(nm, nm);
 	 }
 			 );
  };		
		
   $.fn.bindEvent=function() {
	   
	   $(this).find('input').click(function() {
	    	 var nm=$(this).attr('name');
	    	 var val=$(this).attr('value');
	    	 updMap.put(nm, nm);
	    	 
	    	 if(val=='Delete') {
	    		 var answer = confirm("Are you sure you want to delete?");
	    		 if(answer) {
	    		 
	    		 var tr=$(this).parent().parent();
		    	 var nm=$($(tr).find("input").get(2)).attr('name');
		    	 nm=nm.substring(0, nm.lastIndexOf("/"));
		    	 
		    	 if(addMap.containsKey(nm)) {
		    		 addMap.remove(nm);
		    	 }else {
		    	   delMap.put(nm,nm);
	    	     }
		    	 
		    	 
		    	 tr.remove();
	    		 }
	    	 }else if(val=='Edit') {
	    		 $(this).showEditMode();
		    	 
	    	 }else if(val=='Add') {
	    		 var TBL=$(this).parent().parent().parent().parent();
	    		 
	    		 $(TBL).find('tbody.empty tr').each(function(i) {
		    		 var tr = $(this).clone();
		    		 $(TBL).find('tbody.master').append(tr);
		    		 var idx=$(TBL).find('tbody.master tr').length;
		    		 
		    		 var xpath='';
		    		 tr.find('input').each(function(j){
		    			 var nm=$(this).attr('name');
		    			 nm=nm.replace('[0]','['+idx+']');
		    			 $(this).attr('name',nm);
		    			 if(j==2) {
		    				 nm=nm.substring(0, nm.lastIndexOf("/"));
		    				 addMap.put(nm,nm);
		    			 }
		    		 });
		    		 
		    		 
		    		 $(tr).bindEvent();
		    		 $(tr).find('input[value=Edit]').showEditMode();
		    		 
		    	 });
	    		 
	    		 
	    		 
	    		
	    	 }
	     });
	   
   };	
		
		
	$(document).ready(function() {
	     $('#saveConfiguration').click(function() { 
	    	 
	    	 
	    	 if(updMap.size()==0 && delMap.size()==0 && addMap.size()==0) {
	    		 alert('변경사항 없음');
	    		 return;
	    	 }
	    	 
	    	 var answer = confirm("Are you sure you want to save?");
	    	 if(answer) {
	    	 
	    	  $('input[name=upd]').attr('value', updMap.valuesTxt() );
	    	  $('input[name=del]').attr('value', delMap.valuesTxt() );
	    	  $('input[name=add]').attr('value', addMap.valuesTxt() );
	    	  $('#editMaster').remove();
	    	  updMap.clear();
	    	  delMap.clear();
	    	  addMap.clear();
	    	 
	    	  $('#frm').submit();
	    	 }
	    	 
	      });
	     
	         
	     
	     
	     $('.tableList input').keydown(function() {
	    	 var nm=$(this).attr('name');
	    	 updMap.put(nm, nm);
	     });
	     
	     $('.tableList').bindEvent();
	     
	     $('input').keyup(function() {
	 		 $(this).parent().addClass('changed');
	     });
	     
	     $('input[type=radio]').change(function() {
	     	 $(this).parent().addClass('changed');
	     });
	    
	});
	</script>

</head>

<body>

	<div class="ContentTabSet">

		<div class="resourceName">Service [${serviceId}]</div>

		<a class="tab selected"
			href="/cmf/services/20/config">Configuration</a>
			
			&nbsp; &nbsp; ${filepath}

	</div>

	<br />
	<br />

	<form id="frm" class="cf" action="config" method="post">
	<input type="hidden" name="add" value=""/>
	<input type="hidden" name="del" value=""/>
	<input type="hidden" name="upd" value=""/>

${content}
		
	</form>
	
	<br/><br/><br/>

	<div class="FormToolbarBottom">

		<button class="saveConfigurationButton" id="saveConfiguration"
			type="submit">Save Configuration</button>

	</div>

</body>

</html>

