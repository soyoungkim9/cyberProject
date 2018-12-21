$(function() {
   $("#page").load("../html/detailPage.html #wrap");
   $("#page").hide();
});

var cnt, name;
var idValue, nodeInput, attrInput, attrValInput;
var idSearch; // 기준노드

function nodeSearch() {
   event.preventDefault();
   cnt = 0;
   name = "";
   idValue = document.getElementById('idValue').value;
   nodeInput = document.getElementById('nodeInput').value;
   attrInput = document.getElementById('attrInput').value;
   attrValInput = document.getElementById('attrValInput').value;
   idSearch = document.getElementById(idValue);
   
   var res = name + cnt;
   if(idValue != "" && idSearch == null) {
	   res = name + cnt;
   } else if(idValue !="" || nodeInput !="" || attrInput !="" || attrValInput !="") {
	 var node = (idValue != "") ? idSearch : document.getElementById('wrap'); 
	 nodeCheck(node);
	 res = counting(node);
   }
   result.innerHTML = res;
}

function nodeCheck(node) {
  if(idValue != "" && node == idSearch && nodeInput == "" && attrInput== "" && attrValInput== "") {
  	  name = "id 개수 = "; 
  	  ++cnt;
  }
  if(nodeInput == "" && node.attributes.length != 0) {
	for(var i = 0; i < node.attributes.length; i++) {
	  if(node.attributes[i].nodeName == attrInput && node.attributes[i].nodeValue == attrValInput) {
		if(idValue != "" && idValue == idSearch.id) {
		  name = "id > 속성명 + 속성값 개수 = "; 
		  ++cnt;
		} else if (idValue == "") {
			  name = "속성명 + 속성값 개수 = "; 
			  ++cnt;
		  }  
		} else if(node.attributes[i].nodeName == attrInput && attrValInput == "") { 
		    if(idValue != "" && idValue == idSearch.id) {
		      name = "id > 속성명 = "; 
		      ++cnt;
		  	} else if (idValue == "") {
		        name = "속성명 = "; 
		      	++cnt;
		  	}
		  } else if(node.attributes[i].nodeValue == attrValInput && attrInput == "") { 
		   	  if(idValue != "" && idValue == idSearch.id) {
		        name = "id > 속성값 = "; 
		  	    ++cnt;
		      } else if (idValue == "") {
		          name = "속성값 = "; 
		          ++cnt;
		        }
		  	}
	 }
  } else if(nodeInput != "" && node.localName == nodeInput) { // 노드명(o)
	  if(idValue != "" && idValue == idSearch.id) { // id (o)
	    if(attrInput != "" || attrValInput != "") { // 속성명이나 속성값이 존재하는 경우
	      for(var i = 0; i < node.attributes.length; i++) {
		    if(node.attributes[i].nodeName == attrInput && node.attributes[i].nodeValue == attrValInput) { 
		      name = "id + 노드명 + 속성명 + 속성값 개수 = "; 
		      ++cnt;
		    } else if(node.attributes[i].nodeName == attrInput && attrValInput == "") { 
		        name = "id + 노드명 + 속성명 개수 = "; 
		        ++cnt;
		      } else if(node.attributes[i].nodeValue == attrValInput && attrInput == "") {
		          name = "id + 노드명 + 속성값 개수 = "; 
		    	  ++cnt;
		        }
	       }
	    } else { // id(o), 노드명(o) 속성명(x), 속성값(x)
	        ++cnt;  
	        name = "id >= 노드명 개수 = ";
	  	  }
	  } else if(idValue == ""){ // id (x)
		  if(attrInput == "" && attrValInput == "" && node.localName == nodeInput) { 
	  	    name = "노드명 개수 = "; 
	   		++cnt;
	  	  } else if(attrInput != "" || attrValInput != "") { // 노드명(o), 속성명 or 속성값 존재하는 경우
	  	      for(var i = 0; i < node.attributes.length; i++) {
	    	    if(node.attributes[i].nodeName == attrInput && node.attributes[i].nodeValue == attrValInput) { 
	    		  name = "노드명 + 속성명 + 속성값 개수 = "; 
	    		  ++cnt;
	    	     } else if(node.attributes[i].nodeName == attrInput && attrValInput == "") { 
	    		    name = "노드명 + 속성명 개수 = "; 
	    		    ++cnt;
		    	       } else if(node.attributes[i].nodeValue == attrValInput && attrInput == "") {
	    		       name = "노드명 + 속성값 개수 = "; 
	    		       ++cnt;
	    	         }
	   	       }
			 }
		  }
  }
} 

function counting(node) {
  for(var i = 0; i < node.children.length; i++) {
	nodeCheck(node.children[i]); // 함수호출(cnt증가조건 찾기)
    counting(node.children[i]); // 재귀적으로 자식노드 탐색
  }
  return name + cnt;  
}

document.getElementById('searchBtn1').addEventListener('click', nodeSearch);