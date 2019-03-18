function getCurrentTime() {
	return toTimeString(new Date());
}

function toTimeString(date) {
    var year  = date.getFullYear();
    var month = date.getMonth() + 1; 
    var day   = date.getDate();
    var hour  = date.getHours();
    var min   = date.getMinutes();
    if (("" + month).length == 1) { month = "0" + month; }
    if (("" + day).length   == 1) { day   = "0" + day;   }
    if (("" + hour).length  == 1) { hour  = "0" + hour;  }
    if (("" + min).length   == 1) { min   = "0" + min;   }
    return ("" + year + month + day + hour + min)
}

function getCookie(name) {
	var ls_find ;
	var first ;
	var str = name +"=" ;
	if(document.cookie.length > 0 )
	{
		ls_find = document.cookie.indexOf(str) ;
		if(ls_find == -1)
		{
			return null ;
		}
		else
		{
			first = parseInt(parseInt(ls_find, 10) + str.length, 10) ;
			end = document.cookie.indexOf(";", first) ;
			if(end == -1)
			{
				end = document.cookie.length ;
			}
			return unescape(document.cookie.substring(first, end)) ;
		}
	}
	else
	{
		return "" ;
	}
}

function goRefresh(arg1, arg2, func){
	var d1 = new Date();
//	alert(arg1 + " / " + arg2);
	if(arg1=="all"){
		setInterval(func,arg2);
	}else if(arg1=="day"){
		if(d1.getDay() >= 1 && d1.getDay() <=5){
			var now = getCurrentTime().substr(8,4);
			now = now*1;
			if(now >= 830 && now <= 1510){
				setInterval(func,arg2);
			}
		}
	}
}

var autoRe = getCookie("autoRe");
var autoReTime = getCookie("autoReTime");
