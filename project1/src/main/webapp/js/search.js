$(function() {
   $("#page").load("../html/detailPage.html #wrap");
   $("#page").hide();
});

var cnt;
var name;
var idSearch; // 기준노드
var index; // idSearch의 바로 밑 자식노드 위치
var idValue;
var nodeInput;
var attrInput; 
var attrValInput;

function nodeSearch() {
   event.preventDefault();
   cnt = 0;
   index = 0;
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
    // 1. idSearch를 만나면 현재 가르키는 node를 가장 말단노드로 이동시킨다. (idSearch의 자식노드 까지)
    if(node == idSearch && index < idSearch.childElementCount) {
      node = node.children[index];
      while(node.childElementCount != 0) {
    	preNode = node;
    	node = node.children[0];
      }
	  ++index; // idSearch의 바로 밑 자식노드를 이동시킨다.
    }
    // 2. 현재 node가 조건에 일치하는지 확인한다.
    if(nodeInput == "" && node.attributes.length != 0) { // 노드명(x) 
      for(var i = 0; i < node.attributes.length; i++) {
    	if(idValue == "" && node.attributes[i].nodeName == attrInput &&
   		   node.attributes[i].nodeValue == attrValInput) { 
    		 name = "속성명 + 속성값 개수 = "; /* 노드명(x), id(x), 속성명 + 속성값 */
   		     ++cnt;
   		     console.log(node); 
    	} else if(node.attributes[i].nodeName == attrInput && attrValInput == "") { 
    	   if(idValue != "" && idValue == idSearch.id) {
        	  name = "id > 속성명 = "; /* id > 속성명 */
        	  ++cnt;
        	  console.log(node);
    	   } else if (idValue == ""){
         	  name = "속성명 = "; /* 속성명 */
        	  ++cnt;
        	  console.log(node); 
    	   }
    	} else if(node.attributes[i].nodeValue == attrValInput && attrInput == "") { 
     	   if(idValue != "" && idValue == idSearch.id) {
       		  name = "id > 속성값 = "; /* id > 속성값 */
    	      ++cnt;
    	      console.log(node);
           } else if (idValue == ""){
              name = "속성값 = "; /* 속성값 */
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
  	    		  name = "id + 노드명 + 속성명 + 속성값 개수 = "; /* id + 노드 + 속성명 + 속성값 */
  	    		  ++cnt;
  		    	  console.log(node);
  	    	   } else if(node.attributes[i].nodeName == attrInput && attrValInput == "") { 
  	    		  name = "id + 노드명 + 속성명 개수 = "; /* id + 노드 + 속성명 */
  	    		  ++cnt;
  		    	  console.log(node);
  		    	  
  	    	   } else if(node.attributes[i].nodeValue == attrValInput && attrInput == "") {
  	    		  name = "id + 노드명 + 속성값 개수 = "; /* id + 노드 + 속성값 */
  	    		  ++cnt;
  		    	  console.log(node);
  	    	   }
      	    }
    	 } else { // id(o), 노드명(o) 속성명(x), 속성값(x)
      		 ++cnt;  /* id > 노드명 */
      		 name = "id >= 노드명 개수 = ";
        	 console.log(node); 
    	 }
  	  } else if(idValue == ""){ // id (x)
  		 if(attrInput == "" && attrValInput == "" && node.localName == nodeInput) { 
    		name = "노드명 개수 = "; // id (x). 노드명(o), 속성명(x), 속성값(x)
     		++cnt;
    		console.log(node);
    	  } else if(attrInput != "" || attrValInput != "") { // 노드명(o), 속성명 or 속성값 존재하는 경우
    	    for(var i = 0; i < node.attributes.length; i++) {
 	    	   if(node.attributes[i].nodeName == attrInput && node.attributes[i].nodeValue == attrValInput) { 
 	    		  name = "노드명 + 속성명 + 속성값 개수 = "; /* 노드 + 속성명 + 속성값 */
 	    		  ++cnt;
 		    	  console.log(node);
 	    	   } else if(node.attributes[i].nodeName == attrInput && attrValInput == "") { 
 	    		  name = "노드명 + 속성명 개수 = "; /* 노드 + 속성명 */
 	    		  ++cnt;
 		    	  console.log(node);
 		    	  
 	    	   } else if(node.attributes[i].nodeValue == attrValInput && attrInput == "") {
 	    		  name = "노드명 + 속성값 개수 = "; /* 노드 + 속성값 */
 	    		  ++cnt;
 		    	  console.log(node);
 	    	   }
     	    }
  		 }
  	  }
    }
  // 4. idSearchd의 자식node를 다 돌면 return  
  if(node == idSearch && index >= idSearch.childElementCount)
     return name + cnt;
  // 3-1. node의 형제 노드가 있다면 node의 형제 노드를 다 돈다.
  if(node.nextElementSibling != null && preNode != idSearch) {
    node = node.nextElementSibling;
     // 3-2. 해당 현재 node의 자식 node가 존재한다면 해당 현재 node의 가장 끝 노드로 이동
     if(node.childElementCount != 0) {
       while(node.childElementCount != 0) {
       	 preNode = node;
      	 node = node.children[0];
       }
     }
  } else { // 3-3. 형제노드가 없는 경우 바로 위 노드로 올라간다.
        node = preNode;
        preNode = preNode.parentElement;
  }
  
  return counting(node, preNode);
}

document.getElementById('searchBtn1').addEventListener('click', nodeSearch);