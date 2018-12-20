$(function() {
   $("#page").load("../html/detailPage.html #wrap");
   $("#page").hide();
});

var cnt;
var name;
var idSearch; // 기준노드
var idValue;
var nodeInput;
var attrInput; 
var attrValInput;

function nodeSearch() {
   event.preventDefault();
   cnt = 0;
   name = "";
   // input 창에 작성한 값들 담기
   idValue = document.getElementById('idValue').value;
   nodeInput = document.getElementById('nodeInput').value;
   attrInput = document.getElementById('attrInput').value;
   attrValInput = document.getElementById('attrValInput').value;
   // id input 창에 입력받은 id명 or 노드명 노드 찾기
   idSearch = document.getElementById(idValue);
   
   var res;
   if(nodeInput =="" && attrInput =="" && attrValInput =="") {
	  if (idSearch == null) { /* 아무것도 입력되지 않은 경우 */
		 res = cnt;  
	  } else { /* id값만 존재하는 경우 */
	     ++cnt;
	     res = "id 개수 = " + cnt;
	     console.log(idSearch);  
	  }
   } else {
	   if(idSearch == null)
		  idSearch = document.getElementById('wrap');
	   var node = idSearch;
	   var preNode = node;
	   res = counting(node, preNode);
   }
   
   result.innerHTML = res;
   console.log("----------------------------------------------------");
}

function counting(node, preNode) {
  // 1.현재 node가 조건에 일치하는지 확인한다.
  if(nodeInput == "" && node.attributes.length != 0) { // 노드명(x) 
    for(var i = 0; i < node.attributes.length; i++) {
      if(node.attributes[i].nodeName == attrInput && node.attributes[i].nodeValue == attrValInput) {
        if(idValue != "" && idValue == idSearch.id) {
  	  	  name = "id > 속성명 + 속성값 개수 = "; 
	 	  ++cnt;
	      console.log(node);
	  	} else if (idValue == "") {
		    name = "속성명 + 속성값 개수 = "; 
		 	++cnt;
	      	console.log(node); 
	  	  }  
      } else if(node.attributes[i].nodeName == attrInput && attrValInput == "") { 
	      if(idValue != "" && idValue == idSearch.id) {
	        name = "id > 속성명 = "; 
	      	++cnt;
	      	console.log(node);
	  	  } else if (idValue == "") {
	       	  name = "속성명 = "; 
	      	  ++cnt;
	      	  console.log(node); 
	  	  }
	    } else if(node.attributes[i].nodeValue == attrValInput && attrInput == "") { 
	   	    if(idValue != "" && idValue == idSearch.id) {
	          name = "id > 속성값 = "; 
	  	      ++cnt;
	  	      console.log(node);
	        } else if (idValue == "") {
	           name = "속성값 = "; 
	           ++cnt;
	           console.log(node); 
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
			  console.log(node);
		    } else if(node.attributes[i].nodeName == attrInput && attrValInput == "") { 
		        name = "id + 노드명 + 속성명 개수 = "; 
		        ++cnt;
			    console.log(node);
		      } else if(node.attributes[i].nodeValue == attrValInput && attrInput == "") {
		          name = "id + 노드명 + 속성값 개수 = "; 
		    	  ++cnt;
			      console.log(node);
		        }
	       }
	    } else { // id(o), 노드명(o) 속성명(x), 속성값(x)
	        ++cnt;  
	        name = "id >= 노드명 개수 = ";
	        console.log(node); 
	  	  }
	  } else if(idValue == ""){ // id (x)
		  if(attrInput == "" && attrValInput == "" && node.localName == nodeInput) { 
	  	    name = "노드명 개수 = "; 
	   		++cnt;
	  		console.log(node);
	  	  } else if(attrInput != "" || attrValInput != "") { // 노드명(o), 속성명 or 속성값 존재하는 경우
	  	      for(var i = 0; i < node.attributes.length; i++) {
	    	    if(node.attributes[i].nodeName == attrInput && node.attributes[i].nodeValue == attrValInput) { 
	    		  name = "노드명 + 속성명 + 속성값 개수 = "; 
	    		  ++cnt;
		    	  console.log(node);
	    	     } else if(node.attributes[i].nodeName == attrInput && attrValInput == "") { 
	    		    name = "노드명 + 속성명 개수 = "; 
	    		    ++cnt;
		    	    console.log(node);
 	    	       } else if(node.attributes[i].nodeValue == attrValInput && attrInput == "") {
	    		       name = "노드명 + 속성값 개수 = "; 
	    		       ++cnt;
		    	       console.log(node);
	    	         }
	   	       }
			 }
		  }
	 }
  // 2. 현재 가리키는 node의 위치변화
  if(node.childElementCount != 0) { // 현재 node의 자식이 존재(o), 내려가기, 최초로 한번만 실행
    preNode = node;
	node = node.children[0];
	return counting(node, preNode);
  } else { // 현재 node의 자식이 존재(x), 옆으로가기, 올라가기
	  while(true) {
		if((preNode == idSearch.lastElementChild && node.nextElementSibling == null) ||
		   (preNode == idSearch && node.childElementCount == 0 && node == idSearch.lastElementChild))
			  break;
		if(node.nextElementSibling != null) {
		  node = node.nextElementSibling;
		  return counting(node, preNode);
		} else if(node.nextElementSibling == null && preNode.nextElementSibling != null) { 
			node = preNode.nextElementSibling;
			preNode = node.parentElement;
			return counting(node, preNode);
		  } else if(node.nextElementSibling == null && preNode.nextElementSibling == null) {
			  node = preNode;
			  preNode = node.parentElement;
		    }
	  }
  }
  return name + cnt;  // 3. 모든 node를 다 돌면 결과를 반환	  
}

document.getElementById('searchBtn1').addEventListener('click', nodeSearch);