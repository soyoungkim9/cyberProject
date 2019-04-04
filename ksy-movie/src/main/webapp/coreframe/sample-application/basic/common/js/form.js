
function select_innerHTML(objeto,innerHTML){
/******
* select_innerHTML - innerHTML to add option(s) to select(s)
* Problem: http://support.microsoft.com/default.aspx?scid=kb;en-us;276228
* Creative Commons license
* Versao: 1.0 - 06/04/2006
* Author: Micox - Nairon J.C.G - micoxjcg@yahoo.com.br - elmicoxcodes.blogspot.com
* Parametros:
* objeto(tipo object): the select
* innerHTML(tipo string): the new innerHTML
*******/
   
   var preSetVal = "";
   if(objeto.options.length==1)
    preSetVal = objeto.options[0].value;
 

    
    objeto.innerHTML = ""
    //creating phantom element to receive temp innerHTML
    var selTemp = document.createElement("micoxselect")
    var opt;
    selTemp.id="micoxselect1"
    document.body.appendChild(selTemp)
    selTemp = $("micoxselect1")
    selTemp.style.display="none"
    if(innerHTML.toLowerCase().indexOf("<option")<0){//if not option, convert do option
        innerHTML = "<option>" + innerHTML + "</option>"
    }
    innerHTML = innerHTML.replace(/<option/g,"<span").replace(/<\/option/g,"</span")
    selTemp.innerHTML = innerHTML
    //transfering childs of phantom element to options
    for(var i=0;i<selTemp.childNodes.length;i++){
        if(selTemp.childNodes[i].tagName){
            opt = document.createElement("OPTION");
            /*
            for(var j=0;j<selTemp.childNodes[i].attributes.length;j++){
                opt.setAttributeNode(selTemp.childNodes[i].attributes[j].cloneNode(true))
            }
            */
            opt.value = selTemp.childNodes[i].getAttribute("value")

            if(preSetVal==opt.value)
              opt.selected=true;

            opt.text = selTemp.childNodes[i].innerHTML
            
            if(document.all){ //IEca
                objeto.add(opt)
            }else{
                objeto.appendChild(opt)
            }                    
        }    
    }
    //clear phantom
    document.body.removeChild(selTemp)
    selTemp = null
}








///////// 이하는 별도의 js로 분리

var W3CDOM = (document.getElementsByTagName && document.createElement);


var validForm = true;

function checkFormBasic(frm) {

	validForm = true;
	
	//suggest 모드에서 엔터를 치는 경우
	
	if(suggestObj!=null) {
  
  	// 다음 필드를 찾아 포커싱
  	//frm.elements[suggestObj.tabIndex+1].focus();
  	try {
  		for(var k=0;k<frm.elements.length;k++) {
  				//alert( frm.elements[k].name  + ' = '+ suggestObj.name);
  				
  				if( frm.elements[k].name == suggestObj.name) {
  					if(k+1<frm.elements.length) {
  								frm.elements[k+1].focus();
  								validForm=false;
  								break;
  								
						}
  				}
  		}
  	}catch(e) {}
  	suggestObj=null;
  	//return false;
	}
	
	

var x = frm.elements;
  for (var i=0;i<x.length;i++) {
    //  alert(x[i].nodeName);
    if (!x[i].value && x[i].className.indexOf('required')>=0 ) {
      writeError(x[i],'필수입력항목입니다.');
    }
  }


  return validForm;
}


function writeError(obj,message) {

  validForm = false;
  if (obj.hasError) return;


  if (W3CDOM) {
    obj.className += ' error';
    obj.onchange = removeError;
    var sp = document.createElement('span');
    sp.className = 'error';
    sp.appendChild(document.createTextNode(message));
    obj.parentNode.appendChild(sp);
    obj.hasError = sp;
    
    validForm = false;
  }
  else {
    errorstring += obj.name + ': ' + message + '\n';
    obj.hasError = true;
  }

}

function removeError()
{
  this.className = this.className.substring(0,this.className.lastIndexOf(' '));
  this.parentNode.removeChild(this.hasError);
  this.hasError = null;
  this.onchange = null;
}



if (window.addEventListener) 
  window.addEventListener('load', onLoadFunc, false);
else 
  window.attachEvent('onload', onLoadFunc);

function onLoadFunc()
{
  onLoad(); 
}

function onLoad()
{
}



function setFormMode(formObj, mode)
{
   var x = formObj.elements;
  
  for (var i=0;i<x.length;i++) {
    var bindId = x[i].getAttribute("bind");
    if(bindId) {
      if(x[i].nodeName=='SELECT') {
        var b = $(bindId);
        select_innerHTML(x[i], b.innerHTML);
      }
      
    }
    
    var val = x[i].getAttribute("opt-val");
    if(val) {
    
      for(var k=0;k<x[i].options.length;k++) {
        if( x[i].options[k].value==val) {
          x[i].options[k].selected=true;
          break;
        }
      }
    }
    
  }
  
  
  
  if(mode=='view')
    setViewMode(formObj); 
  else if(mode=="update")
    setUpdateMode(formObj);
  else if(mode=="insert")
    setInsertMode(formObj);
}

// 수정모드인 경우
function setUpdateMode(formObj)
{
  
  var x = frm.elements;
  for (var i=0;i<x.length;i++) {
   if(x[i].className=='key')
    x[i].readOnly=true;
    
  }
  
}

// 입력모드인 경우
function setInsertMode(formObj)
{
  
  var x = formObj.elements;
  for (var i=0;i<x.length;i++) {
   if(x[i].className=='key') {
    x[i].readOnly=true;
    x[i].value="자동입력필드";
  }
    
  }
  
}

// 보기전용 모드인 경우
function setViewMode(frm)
{
  
  var x = frm.elements;
  
  for (var i=0;i<x.length;i++) {
    
     //x[i].readOnly=true;
     //x[i].disabled=true;
     
     
     if(x[i].type) {
        if(x[i].type=='submit' || x[i].type=='reset') {
        x[i].style.display='none';
      }
      
      if(x[i].type=='text' || x[i].nodeName=='TEXTAREA') {
        x[i].className='viewmode';
        x[i].readOnly=true;
      }
    }
    
     if(x[i].nodeName=="SELECT") {
      //x[i].disabled=true;
      x[i].className='viewmode';
    }
  }
}


  function getRealX(obj) {
    if ( obj.offsetParent == null ) return 0;
    var tmp = obj.clientLeft; 
    if(!tmp) tmp=0;
    
    return obj.offsetLeft + tmp + getRealX(obj.offsetParent);
  }
  
  function getRealY(obj) {
  	
    if ( obj.offsetParent == null ) return 0;
    var tmp = obj.clientTop; 
    if(!tmp) tmp=0;
    return obj.offsetTop + tmp + getRealY(obj.offsetParent);
  }
  
  
  
  function xc() {
  var C = null;
  try {
    C = new ActiveXObject("Msxml2.XMLHTTP")
  } catch (e) {
    try {
      C = new ActiveXObject("Microsoft.XMLHTTP")
    } catch (sc) {
      C = null
    }
  }
  if (!C && typeof XMLHttpRequest != "undefined") {
    C = new XMLHttpRequest()
  }
  return C
}
  
    
var suggestObj = null;

function suggestOut(sojb){}
 // 자동 추천단어 만들기    
function SuggestDig(viewField,valueField) {
  
  var sel_seq = -1;
  var preSelNode;
  
  var viewFieldObj=viewField;
  
  var valueFieldObj=valueField;
  
  var suggestDigDivObj;
  
  var dataUrl;
  
  var preRequestVal;
  
  var request=xc();
  
  
  // 초기
  function create()
  {
    var div=document.createElement("DIV");
    //div.innerHTML='<div title="v1">test1</div><div title="v2">test2</div>';
    div.id = viewFieldObj.name+'_sug_dig';
    
    viewFieldObj.parentNode.appendChild(div);
    suggestDigDivObj=div;
    
    var s=div.style;
    var p=viewFieldObj;
    
    s.backgroundColor='white';
    s.border="1px solid #777";
    
    s.position='absolute';  
    s.top=getRealY(p)+p.clientHeight+1+"px";
    s.left=getRealX(p)-1+"px";
    s.width =  p.clientWidth+2 +"px";
    
    s.display='none';

		// firefox 용    
    if( viewFieldObj.addEventListener) {
    	viewFieldObj.addEventListener('keypress' , keyDown, false);
    	viewFieldObj.addEventListener('focusout', out, false);
    }else {
	    viewFieldObj.attachEvent('onkeydown' , keyDown);
	    viewFieldObj.attachEvent('onfocusout', out);
    }
    
    
    
    //window.status='END';
  }
  
  function setDataUrl(url)
  {
    dataUrl = url;
  }

  
  // 포커스가 없어질때
  function out(event)
  {
    if(sel_seq>=0)
    	suggestObj=viewFieldObj;
    
    if(viewFieldObj.value=='') {
    	
    	if(valueFieldObj)
    		valueFieldObj.value='';
    }
    
    suggestDigDivObj.style.display='none';
    suggestOut(suggestObj);
  }
  
  var preCode;
  var callCount=0;
  
  // 키 입력시
  function keyDown(event)
  {
  
    var c=event.keyCode;
    
    //window.status=window.status+' '+c;
    var procss =false;
    if(c==38) {
      sel_seq--;
    	if(sel_seq <0)
      	sel_seq=0;
      selChild(sel_seq);    
    } else if(c==40 && (preCode==40 || preCode==38) ) {
    //window.status=c+'***';
      sel_seq++;
      selChild(sel_seq);
    } else if(c>8 && c<18) {
       // tab 인경우 , alt 키
       suggestDigDivObj.style.display='none';
       return;
    }
    else {
    	//window.status=window.status+' C ';
      //requestData();
      self.setTimeout( requestData, 100);
      callCount++;
    }
    preCode=c;
  }
  
  
  function requestData()
  {
    callCount--;
    if(callCount>0) {
        return;
    }
    if(preRequestVal==viewFieldObj.value) return;
    preRequestVal=viewFieldObj.value;
      
    var l = suggestDigDivObj.childNodes.length;
    for(var i=l-1;i>=0;i--) {
      suggestDigDivObj.removeChild( suggestDigDivObj.childNodes[i] );
    }
    if(viewFieldObj.value=='') return;
    
    
    
    
    var url = dataUrl+viewFieldObj.value;
    //var url = dataUrl+'문자';
    //window.status='URL='+url;
    
    request.open('GET',url,true);
    // firefox 만 UTF 로 보냄.
    
    request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    	
    request.setRequestHeader("Cache-Control","no-cache, must-revalidate");
    request.setRequestHeader("Pragma","no-cache");    
    request.onreadystatechange = myHandler;
    request.send();
      
    //addChild( suggestDigDivObj, 'company','sdfsdgsdf');
    //addChild( suggestDigDivObj, 'test','sdfsdgsdf');
    
    // 초기화
    sel_seq=-1;
  }
  
  
  function myHandler() {
      if (request.readyState == 4 ) {
      
          var suggest = eval('(' + request.responseText + ')');
          var l=suggest.result;
          for(var i=0; i<l.length;i++) {
            addChild( suggestDigDivObj, l[i].value,l[i].key);
          }
          
          if(l.length>0)
          	suggestDigDivObj.style.display='block';
         	else
         		suggestDigDivObj.style.display='none';
         	
      }
    }

  
  function addChild(obj, key, val)
  {
    var div=document.createElement("DIV");

    div.innerHTML=key;
    obj.appendChild(div);

    div.title=val;
    
    

  }
  

  // 순서에 따라 목록 선택
  function selChild(seq,x)
  {
    //window.status=seq;
    
    var x=suggestDigDivObj;
    
    if(!x.childNodes) return;
    var l = x.childNodes.length;
    if(l<1) return;
      
    
    if(seq>=l) {
      sel_seq=l-1;
      return;
    }

    if(preSelNode)
      preSelNode.style.backgroundColor='#fff';
  
    var p = x.childNodes[seq];
    preSelNode=p;
    p.style.backgroundColor='#eee';

    var o1 = viewFieldObj;
    o1.value=p.innerHTML;
    
    if(valueFieldObj)
      valueFieldObj.value=p.title;
    
    x.style.display='block';
    
    
  }
  
  
  this.create=create;
  this.setDataUrl=setDataUrl;
  

}

function toFirstUpperCase(str)
{
	if (str.length < 2)
		return str.toUpperCase();

	var pre = str.substring(0, 1);
	var post = str.substring(1);

	var re_str = pre.toUpperCase() + post;
	return re_str;
}

/*
function toFirstUpperCase(str) {
  leng =str.length;
  for (i =0; i <=leng; i++) {
    if (i==0) {
      if (str.charAt(i) !=" "){
        done =str.substring(0,1).toUpperCase();
      } else {
        done =" ";
      }
    } else {
      if (str.charAt(i) ==" "){
        done+=" ";
      } else {
        if (str.charAt(i-1)==" ") {
          done+=str.substring(i,i+1).toUpperCase();
        } else {
          done+=str.substring(i,i+1).toLowerCase();
        }
      }  // if 
    }  // for
  }
  return done;
}
*/

