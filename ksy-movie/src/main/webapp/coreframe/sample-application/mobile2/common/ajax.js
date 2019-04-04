/* ajax 객체 생성 */
function getXMLHttpRequest()
{
	
	if((!!window.opera) && ((typeof XMLHttpRequest)=='function'))     // opera
	{
		return new XMLHttpRequest();
	}
	else if(navigator.userAgent.toLowerCase().indexOf("safari") != -1) // safari
	{
		return new XMLHttpRequest();
	}else if(window.ActiveXObject)                                               // ie
	{
		return new ActiveXObject("Microsoft.XMLHTTP");
	}
	else
	{
		return new XMLHttpRequest();
	}
}

/* ajax 통신, xml object 를 가져온다. */
function loadResponseXML(url, responseFunction)
{
	var gubun = "?";
	if(url.indexOf('?') > -1)
	{
		gubun = "&";
	}

	var request = getXMLHttpRequest();
	if(request.overrideMimeType)
	{
		request.overrideMimeType('text/text');
	}
	request.open("GET",url+gubun+"temp="+getTimeStamp(),true);
	request.send(null);
	request.onreadystatechange = function() {
		if (request.readyState==4) {
			if (request.status==200) {
				responseFunction(request.responseXML);
			} else {
				//alert("오류가 발생하였습니다. 새로고침 후 다시 시도해 주십시오.");
			}
		}
	}
}

/* XML 호출 시 캐쉬를 막기위해 매순간 고유한 파라미터값을 넣어준다. */
function getTimeStamp()
{
	var localTime = new Date();
	return localTime.getTime();
}

function createRequest() {
  var request;
  try {
    request = new XMLHttpRequest();
    request.open("GET", "http://m.youfirst.co.kr/ajax/ajaxIndex.jsp");
	request.send(null);
  } catch (trymicrosoft) {
    try {
      request = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (othermicrosoft) {
      try {
        request = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (failed) {
        request = false;
      }
    }
  }
  return request;
  //if (!request)
  //  alert("Error initializing XMLHttpRequest!");
}