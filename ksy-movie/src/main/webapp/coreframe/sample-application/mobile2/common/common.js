function $(element) {
	if (arguments.length > 1) {
		for (var i = 0, elements = [], length = arguments.length; i < length; i++) elements.push(util.$(arguments[i]));
		return elements;
	}
	if (typeof(element) == "string") element = document.getElementById(element);
	return element;
}


function AddEvent(obj, type, fn) {
	if(obj.addEventListener) {
		obj.addEventListener(type, fn, false);
	} else if(obj.attachEvent) {
		obj["e"+type+fn] = fn;
		obj[type+fn] = function() { obj["e"+type+fn]( window.event ); }
		obj.attachEvent("on"+type, obj[type+fn]);
		} else {
		obj["on"+type] = obj["e"+type+fn];
	}
}


var mainTab = {
	actRoll : null, actTime : 2000, actTag : 'li',
	change: function(name){
		clearTimeout(mainTab.actRoll)
		$('realStockCont').className=name;
		if(name!="realValue4") mainTab.actRoll = setTimeout(function(){mainTab.moveRoll($(name),mainTab.actTag,1)},mainTab.actTime)
	},
	moveRoll : function(obj,state){
		clearTimeout(mainTab.actRoll)
		var thisViewNum = 0;
		for(i=0;i<obj.getElementsByTagName(mainTab.actTag).length;i++){
			if(obj.getElementsByTagName(mainTab.actTag)[i].style.display=="block") thisViewNum = i;
			obj.getElementsByTagName(mainTab.actTag)[i].style.display = "none";
		}
		var nextViewNum = (state) ? thisViewNum+1 : thisViewNum-1;
		if(nextViewNum<0 || nextViewNum >= obj.getElementsByTagName(mainTab.actTag).length) nextViewNum = (nextViewNum<0) ? obj.getElementsByTagName(mainTab.actTag).length-1 : 0;
		obj.getElementsByTagName(mainTab.actTag)[nextViewNum].style.display = "block";
		mainTab.actRoll = setTimeout(function(){mainTab.moveRoll(obj,mainTab.actTag,1)},mainTab.actTime)
	}
}

function top(){ document.body.scrollTop=-1; }

function layerpop(msg){

	layer=document.getElementById('layerpop');
	if(!layer){
		layer=document.createElement('div');
		layer.setAttribute('id','layerpop');
		document.body.appendChild(layer);
	}
	layer.innerHTML=msg;
	layer.style.left='-10000px';
	layer.style.display='block';
	var scrolltop=document.documentElement.scrollTop || document.body.scrollTop;
	if(!scrolltop) scrolltop=0;
	var pageheight=document.documentElement.clientHeight;
	layer.style.top=((pageheight/2)-(layer.offsetHeight/2)+scrolltop)+'px';
	layer.style.left='50%';

	setTimeout(function(){layer.style.display='none'},2000);

}
function fnGoM(no)
{
	var goUrl = "";
	if (no)
	{
		switch (no)
		{
			case 1: //Ȩ
				goUrl = "/list.jsp";
				break;
			case 2: //����
				goUrl = "/jisu/totalJisu.jsp";
				break;
			case 3: //�ü�
				goUrl = "/sise/totalSise.jsp";
				break;
			case 4: //�ȳ�
				goUrl = "/info/accStore.jsp";
				break;
			case 5: //�˸�
				goUrl = "/noti/noticeList.jsp";
				break;
			default :
				goUrl = "/list.jsp";
		}
	}
	else
	{
		goUrl = "/list.jsp";
	}
	document.location.href = goUrl;
}

AddEvent(window,'load',function(){ if(location.href.indexOf("#") < 0) setTimeout(scrollTo, 0, 0, 1); }, false);