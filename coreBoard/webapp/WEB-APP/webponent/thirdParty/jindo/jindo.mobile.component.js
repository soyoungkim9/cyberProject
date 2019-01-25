(function(_namespace){var jsTags=document.getElementsByTagName("script");
var jsTag=jsTags[jsTags.length-1];
if(jsTag&&/[\?&]jindo=([^&]+)/.test(jsTag.src)){_namespace=RegExp.$1
}var jindo=window[_namespace];
if(typeof jindo.m=="undefined"&&typeof Node!="undefined"){var ___Old__addEventListener___=Node.prototype.addEventListener;
Node.prototype.addEventListener=function(type,listener,useCapture){var callee=arguments.callee;
if(callee&&type==="click"&&this.tagName==="A"){(this.___listeners___||(this.___listeners___=[])).push({listener:listener,useCapture:useCapture})
}return ___Old__addEventListener___.apply(this,arguments)
};
var ___Old__removeEventListener___=Node.prototype.removeEventListener;
Node.prototype.removeEventListener=function(type,listener,useCapture){var callee=arguments.callee;
if(callee&&type==="click"&&this.tagName==="A"){if(this.___listeners___){this.___listeners___.pop()
}}return ___Old__removeEventListener___.apply(this,arguments)
}
}window.requestAnimationFrame=(function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||function(callback){return setTimeout(callback,16)
}
})(); 
window.cancelAnimationFrame=(function(){return window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.msCancelAnimationFrame||clearTimeout
})();
jindo.m=(function(){var _isVertical=null,_nPreWidth=-1,_nRotateTimer=null,_htHandler={},_htDeviceInfo={},_htTouchEventName={start:"mousedown",move:"mousemove",end:"mouseup",cancel:null};
function _initTouchEventName(){if("ontouchstart" in window){_htTouchEventName.start="touchstart";
_htTouchEventName.move="touchmove";
_htTouchEventName.end="touchend";
_htTouchEventName.cancel="touchcancel"
}else{if(window.navigator.msPointerEnabled){_htTouchEventName.start="MSPointerDown";
_htTouchEventName.move="MSPointerMove";
_htTouchEventName.end="MSPointerUp";
_htTouchEventName.cancel="MSPointerCancel"
}}}function _getOrientationChangeEvt(){var bEvtName="onorientationchange" in window?"orientationchange":"resize";
if((_htDeviceInfo.android&&_htDeviceInfo.version==="2.1")){bEvtName="resize"
}return bEvtName
}function _getVertical(){var bVertical=null,sEventType=_getOrientationChangeEvt();
if(sEventType==="resize"){var screenWidth=document.documentElement.clientWidth;
if(screenWidth<_nPreWidth){bVertical=true
}else{if(screenWidth==_nPreWidth){bVertical=_isVertical
}else{bVertical=false
}}_nPreWidth=screenWidth
}else{var windowOrientation=window.orientation;
if(windowOrientation===0||windowOrientation==180){bVertical=true
}else{if(windowOrientation==90||windowOrientation==-90){bVertical=false
}}}return bVertical
}function _attachEvent(){var fn=jindo.$Fn(_onOrientationChange,this);
fn.attach(window,_getOrientationChangeEvt()).attach(window,"load").attach(window,"pageshow")
}function _initDeviceInfo(){var sName=navigator.userAgent;
var ar=null;
function f(s,h){return((h||"").indexOf(s)>-1)
}_htDeviceInfo={iphone:f("iPhone",sName),ipad:f("iPad",sName),android:jindo.$Agent().os().android,win:f("Windows Phone",sName),galaxyTab:f("SHW-M180",sName),galaxyTab2:f("SHW-M380",sName),galaxyS:f("SHW-M110",sName),galaxyS2:f("SHW-M250",sName)||f("GT-I9100",sName),galaxyS2LTE:f("SHV-E110",sName),galaxyS3:f("SHV-E210",sName)||f("SHW-M440",sName),galaxyNote:f("SHV-E160",sName),galaxyNote2:f("SHV-E250",sName),galaxyNexus:f("Galaxy Nexus",sName),optimusLte2:f("LG-F160",sName),optimusVu:f("LG-F100",sName),optimusLte:f("LG-LU6200",sName)||f("LG-SU640",sName)||f("LG-F120K",sName),bChrome:(f("CrMo",sName)||f("Chrome",sName)),bInapp:false,version:"",samsung:f("GT-",sName)||f("SCH-",sName)||f("SHV-",sName)||f("SHW-",sName)||f("SPH",sName)||f("SWT-",sName)||f("SGH-",sName)||f("EK-",sName),lg:f("LG-",sName),pantech:f("IM-",sName)};
if(_htDeviceInfo.iphone||_htDeviceInfo.ipad){ar=sName.match(/OS\s([\d|\_]+\s)/i);
if(ar!==null&&ar.length>1){_htDeviceInfo.version=ar[1]
}}else{if(_htDeviceInfo.android){ar=sName.match(/Android\s([^\;]*)/i);
if(ar!==null&&ar.length>1){_htDeviceInfo.version=ar[1]
}}else{if(_htDeviceInfo.win){ar=sName.match(/Windows Phone\s([^\;]*)/i);
if(ar!==null&&ar.length>1){_htDeviceInfo.version=ar[1]
}}}}_htDeviceInfo.version=_htDeviceInfo.version.replace(/\_/g,".");
for(var x in _htDeviceInfo){if(typeof _htDeviceInfo[x]=="boolean"&&_htDeviceInfo[x]&&_htDeviceInfo.hasOwnProperty(x)){_htDeviceInfo.name=x
}}if(_htDeviceInfo.iphone||_htDeviceInfo.ipad){if(!f("Safari",sName)){_htDeviceInfo.bInapp=true
}}else{if(_htDeviceInfo.android){sName=sName.toLowerCase();
if(f("inapp",sName)||f("app",sName.replace("applewebkit",""))){_htDeviceInfo.bInapp=true
}}}}function _onOrientationChange(we){var self=this;
if(we.type==="load"){_nPreWidth=document.documentElement.clientWidth;
if(!_htDeviceInfo.bInapp&&(_htDeviceInfo.iphone||_htDeviceInfo.ipad||_getOrientationChangeEvt()!=="resize")){_isVertical=_getVertical()
}else{if(_nPreWidth>document.documentElement.clientHeight){_isVertical=false
}else{_isVertical=true
}}return
}if(_getOrientationChangeEvt()==="resize"){setTimeout(function(){_orientationChange(we)
},0)
}else{var nTime=200;
if(_htDeviceInfo.android){nTime=500
}clearTimeout(_nRotateTimer);
_nRotateTimer=setTimeout(function(){_orientationChange(we)
},nTime)
}}function _orientationChange(we){var nPreVertical=_isVertical;
_isVertical=_getVertical();
if(jindo.$Agent().navigator().mobile||jindo.$Agent().os().ipad){if(nPreVertical!==_isVertical){_fireEvent("mobilerotate",{isVertical:_isVertical})
}}else{_fireEvent("mobilerotate",{isVertical:_isVertical})
}}function _onPageshow(we){_isVertical=_getVertical();
setTimeout(function(){_fireEvent("mobilePageshow",{})
},300)
}function _getCssOffsetFromCSSMatrix(element){var curTransform=new WebKitCSSMatrix(window.getComputedStyle(element).webkitTransform);
return{top:curTransform.m42,left:curTransform.m41}
}function _fireEvent(sType,ht){if(_htHandler[sType]){for(var i=0,len=_htHandler[sType].length;
i<len;
i++){_htHandler[sType][i].call(this,ht)
}}}function _getCssOffsetFromStyle(element){var nTop=nLeft=0,s=element.style[jindo.m.getCssPrefix()+"Transform"];
if(!!s&&s.length>0){aTemp=s.match(/translate.{0,2}\((.*)\)/);
if(!!aTemp&&aTemp.length>1){var a=aTemp[1].split(",");
if(!!a&&a.length>1){nTop=parseInt(a[1],10);
nLeft=parseInt(a[0],10)
}}}return{top:nTop,left:nLeft}
}var __M__={MOVETYPE:{0:"hScroll",1:"vScroll",2:"dScroll",3:"tap",4:"longTap",5:"doubleTap",6:"pinch",7:"rotate",8:"pinch-rotate"},sVersion:"1.5.0",$init:function(){_initDeviceInfo();
_initTouchEventName();
_attachEvent()
},bindRotate:function(fHandlerToBind){var aHandler=_htHandler.mobilerotate;
if(typeof aHandler=="undefined"){aHandler=_htHandler.mobilerotate=[]
}aHandler.push(fHandlerToBind)
},unbindRotate:function(fHandlerToUnbind){var aHandler=_htHandler.mobilerotate;
if(aHandler){for(var i=0,fHandler;
(fHandler=aHandler[i]);
i++){if(fHandler===fHandlerToUnbind){aHandler.splice(i,1);
break
}}}},bindPageshow:function(fHandlerToBind){var aHandler=_htHandler.mobilePageshow;
if(typeof aHandler=="undefined"){aHandler=_htHandler.mobilePageshow=[]
}aHandler.push(fHandlerToBind)
},unbindPageshow:function(fHandlerToUnbind){var aHandler=_htHandler.mobilePageshow;
if(aHandler){for(var i=0,fHandler;
(fHandler=aHandler[i]);
i++){if(fHandler===fHandlerToUnbind){aHandler.splice(i,1);
break
}}}},getDeviceInfo:function(){return _htDeviceInfo
},hasClickBug:function(){return(_htDeviceInfo.iphone||_htDeviceInfo.ipad||(_htDeviceInfo.win&&((_htDeviceInfo.version*1)>=8)))
},isVertical:function(){if(_isVertical===null){return _getVertical()
}else{return _isVertical
}},getNodeElement:function(el){while(el.nodeType!=1){el=el.parentNode
}return el
},getCssOffset:function(element){var htOffset;
if(_htDeviceInfo.android&&parseInt(_htDeviceInfo.version,10)===3){htOffset=_getCssOffsetFromStyle(element)
}else{if("WebKitCSSMatrix" in window&&"m11" in new WebKitCSSMatrix()){htOffset=_getCssOffsetFromCSSMatrix(element)
}else{htOffset=_getCssOffsetFromStyle(element)
}}return htOffset
},attachTransitionEnd:function(element,fHandlerToBind){var nVersion=+jindo.$Jindo().version.replace(/[a-z.]/gi,"");
if(nVersion>230){element._jindo_fn_=jindo.$Fn(fHandlerToBind,this).attach(element,"transitionend")
}else{var sEvent=((this.getCssPrefix()==="ms")?"MS":this.getCssPrefix())+"TransitionEnd";
element.addEventListener(sEvent,fHandlerToBind,false)
}},detachTransitionEnd:function(element,fHandlerToUnbind){var nVersion=+jindo.$Jindo().version.replace(/[a-z.]/gi,"");
if(nVersion>230){if(element._jindo_fn_){element._jindo_fn_.detach(element,"transitionend");
delete element._jindo_fn_
}}else{var sEvent=((this.getCssPrefix()==="ms")?"MS":this.getCssPrefix())+"TransitionEnd";
element.removeEventListener(sEvent,fHandlerToUnbind,false)
}},_attachFakeJindo:function(element,fn,sEvent){var nVersion=+jindo.$Jindo().version.replace(/[a-z.]/gi,"");
var wfn=null;
if(nVersion<230&&(typeof _notSupport!=="undefined")){wfn=_notSupport.$Fn(fn).attach(element,sEvent)
}else{wfn=jindo.$Fn(fn).attach(element,sEvent)
}return wfn
},_getTouchEventName:function(){return _htTouchEventName
},getCssPrefix:function(){var sCssPrefix="";
if(typeof document.body.style.MozTransition!=="undefined"){sCssPrefix="Moz"
}else{if(typeof document.body.style.OTransition!=="undefined"){sCssPrefix="O"
}else{if(typeof document.body.style.msTransition!=="undefined"){sCssPrefix="ms"
}else{sCssPrefix="webkit"
}}}return sCssPrefix
},getClosest:function(sSelector,elBaseElement){var elClosest;
var welBaseElement=jindo.$Element(elBaseElement);
var reg=/<\/?(?:h[1-5]|[a-z]+(?:\:[a-z]+)?)[^>]*>/ig;
if(reg.test(sSelector)){if("<"+elBaseElement.tagName.toUpperCase()+">"==sSelector.toUpperCase()){elClosest=elBaseElement
}else{elClosest=welBaseElement.parent(function(v){if("<"+v.$value().tagName.toUpperCase()+">"==sSelector.toUpperCase()){return v
}});
elClosest=elClosest.length?elClosest[0].$value():false
}}else{if(sSelector.indexOf(".")==0){sSelector=sSelector.substring(1,sSelector.length)
}if(welBaseElement.hasClass(sSelector)){elClosest=elBaseElement
}else{elClosest=welBaseElement.parent(function(v){if(v.hasClass(sSelector)){return v
}});
elClosest=elClosest.length?elClosest[0].$value():false
}}return elClosest
},_isUseCss3d:function(isFlicking){if(isFlicking===undefined){isFlicking=false
}var bRet=false;
if(_htDeviceInfo.bChrome){return bRet
}if(_htDeviceInfo.iphone||_htDeviceInfo.ipad){bRet=true
}else{if(_htDeviceInfo.android){if(_htDeviceInfo.version>="4.1.0"){bRet=true
}else{var s=navigator.userAgent.match(/\(.*\)/)[0];
if(_htDeviceInfo.version>="4.0.3"&&/SHW-|SHV-|GT-|SCH-|SGH-|SPH-|LG-F160|LG-F100|LG-F180|LG-F200|EK-|IM-A|LG-F240|LG-F260/.test(s)&&!/SHW-M250|SHW-M420|SHW-M200|GT-S7562/.test(s)){bRet=true
}}}}return bRet
},_isUseFixed:function(){var isFixed=false;
if(_htDeviceInfo.bChrome||(_htDeviceInfo.android&&parseInt(_htDeviceInfo.version,10)>=3)||((_htDeviceInfo.iphone||_htDeviceInfo.ipad)&&(parseInt(_htDeviceInfo.version,10)>=5))||(_htDeviceInfo.win&&parseInt(_htDeviceInfo.version,10)>=8)){isFixed=true
}return isFixed
},_isUseTimingFunction:function(){var bUse=this._isUseCss3d();
if(_htDeviceInfo.android||((_htDeviceInfo.iphone||_htDeviceInfo.ipad)&&(parseInt(_htDeviceInfo.version,10)==6))){bUse=false
}return bUse
},_clientSize:function(isMinSize){if(typeof isMinSize==="undefined"){isMinSize=false
}var oSize={};
var oRet=jindo.$Document().clientSize();
var nVersion=parseInt(_htDeviceInfo.version,10);
if((_htDeviceInfo.ipad||_htDeviceInfo.iphone)||_htDeviceInfo.bChrome){if(isMinSize&&_htDeviceInfo.iphone){oRet.height=this.isVertical()?356:268
}return oRet
}switch(_htDeviceInfo.name){case"galaxyTab":oSize={portrait:400,landscape:683};
oSize.landscape-=92;
oSize.portrait-=66;
break;
case"galaxyTab2":oSize={portrait:1280,landscape:800};
oSize.landscape-=152;
oSize.portrait-=152;
break;
case"galaxyS":oSize={portrait:320,landscape:533};
oSize.landscape-=81;
oSize.portrait-=81;
break;
case"galaxyS2LTE":case"galaxyS2":oSize={portrait:320,landscape:533};
if(nVersion==4){oSize.landscape-=77;
oSize.portrait-=77
}else{oSize.landscape-=83;
oSize.portrait-=83
}break;
case"galaxyS3":oSize={portrait:360,landscape:640};
oSize.landscape-=73;
oSize.portrait-=73;
break;
case"galaxyNote":case"galaxyNote2":oSize={portrait:400,landscape:640};
if(nVersion==4){oSize.landscape-=77;
oSize.portrait-=77
}else{oSize.landscape-=103;
oSize.portrait-=103
}break;
case"galaxyNexus":oSize={portrait:360,landscape:598};
oSize.landscape-=83;
oSize.portrait-=83;
break;
case"optimusLte":oSize={portrait:360,landscape:640};
oSize.landscape-=73;
oSize.portrait-=73;
break;
case"optimusLte2":oSize={portrait:360,landscape:640};
oSize.landscape-=73;
oSize.portrait-=73;
break;
case"optimusVu":oSize={portrait:439,landscape:585};
oSize.landscape-=73;
oSize.portrait-=73;
break
}if(this.isVertical()){if(isMinSize||(oSize.landscape&&oSize.landscape>oRet.height)){oRet.height=oSize.landscape
}}else{if(isMinSize||(oSize.portrait&&oSize.portrait>oRet.height)){oRet.height=oSize.portrait
}}return oRet
},_getAdressSize:function(){var nSize=0;
if(_htDeviceInfo.bInapp){return nSize
}var nVersion=parseInt(_htDeviceInfo.version,10);
if(_htDeviceInfo.iphone){nSize=60
}else{if(_htDeviceInfo.android){switch(_htDeviceInfo.name){case"galaxyTab":nSize=66;
break;
case"galaxyTab2":nSize=48;
break;
case"galaxyS":nSize=56;
break;
case"galaxyS2LTE":case"galaxyS2":if(nVersion==4){nSize=52
}else{nSize=58
}break;
case"galaxyS3":nSize=48;
break;
case"galaxyNote":case"galaxyNote2":if(nVersion==4){nSize=52
}else{nSize=78
}break;
case"galaxyNexus":nSize=52;
break;
case"optimusVu":case"optimusLte":case"optimusLte2":nSize=48;
break
}}}return nSize
}};
__M__.$init();
return __M__
})();
jindo.m.Component=jindo.$Class({_htEventHandler:null,_htOption:null,$static:{VERSION:"1.5.0"},$init:function(){var aInstance=this.constructor.getInstance();
aInstance.push(this);
this._htEventHandler={};
this._htOption={};
this._htOption._htSetter={}
},option:function(sName,vValue){switch(typeof sName){case"undefined":var oOption={};
for(var i in this._htOption){if(!(i=="htCustomEventHandler"||i=="_htSetter")){oOption[i]=this._htOption[i]
}}return oOption;
case"string":if(typeof vValue!="undefined"){if(sName=="htCustomEventHandler"){if(typeof this._htOption[sName]=="undefined"){this.attach(vValue)
}else{return this
}}this._htOption[sName]=vValue;
if(typeof this._htOption._htSetter[sName]=="function"){this._htOption._htSetter[sName](vValue)
}}else{return this._htOption[sName]
}break;
case"object":for(var sKey in sName){if(sKey=="htCustomEventHandler"){if(typeof this._htOption[sKey]=="undefined"){this.attach(sName[sKey])
}else{continue
}}if(sKey!=="_htSetter"){this._htOption[sKey]=sName[sKey]
}if(typeof this._htOption._htSetter[sKey]=="function"){this._htOption._htSetter[sKey](sName[sKey])
}}break
}return this
},optionSetter:function(sName,fSetter){switch(typeof sName){case"undefined":return this._htOption._htSetter;
case"string":if(typeof fSetter!="undefined"){this._htOption._htSetter[sName]=jindo.$Fn(fSetter,this).bind()
}else{return this._htOption._htSetter[sName]
}break;
case"object":for(var sKey in sName){this._htOption._htSetter[sKey]=jindo.$Fn(sName[sKey],this).bind()
}break
}return this
},fireEvent:function(sEvent,oEvent){oEvent=oEvent||{};
var fInlineHandler=this["on"+sEvent],aHandlerList=this._htEventHandler[sEvent]||[],bHasInlineHandler=typeof fInlineHandler=="function",bHasHandlerList=aHandlerList.length>0;
if(!bHasInlineHandler&&!bHasHandlerList){return true
}aHandlerList=aHandlerList.concat();
oEvent.sType=sEvent;
if(typeof oEvent._aExtend=="undefined"){oEvent._aExtend=[];
oEvent.stop=function(){if(oEvent._aExtend.length>0){oEvent._aExtend[oEvent._aExtend.length-1].bCanceled=true
}}
}oEvent._aExtend.push({sType:sEvent,bCanceled:false});
var aArg=[oEvent],i,nLen;
for(i=2,nLen=arguments.length;
i<nLen;
i++){aArg.push(arguments[i])
}if(bHasInlineHandler){fInlineHandler.apply(this,aArg)
}if(bHasHandlerList){var fHandler;
for(i=0,fHandler;
(fHandler=aHandlerList[i]);
i++){fHandler.apply(this,aArg)
}}return !oEvent._aExtend.pop().bCanceled
},attach:function(sEvent,fHandlerToAttach){if(arguments.length==1){jindo.$H(arguments[0]).forEach(jindo.$Fn(function(fHandler,sEvent){this.attach(sEvent,fHandler)
},this).bind());
return this
}var aHandler=this._htEventHandler[sEvent];
if(typeof aHandler=="undefined"){aHandler=this._htEventHandler[sEvent]=[]
}aHandler.push(fHandlerToAttach);
return this
},detach:function(sEvent,fHandlerToDetach){if(arguments.length==1){jindo.$H(arguments[0]).forEach(jindo.$Fn(function(fHandler,sEvent){this.detach(sEvent,fHandler)
},this).bind());
return this
}var aHandler=this._htEventHandler[sEvent];
if(aHandler){for(var i=0,fHandler;
(fHandler=aHandler[i]);
i++){if(fHandler===fHandlerToDetach){aHandler=aHandler.splice(i,1);
break
}}}return this
},detachAll:function(sEvent){var aHandler=this._htEventHandler;
if(arguments.length){if(typeof aHandler[sEvent]=="undefined"){return this
}delete aHandler[sEvent];
return this
}for(var o in aHandler){delete aHandler[o]
}return this
}});
jindo.m.Component.factory=function(aObject,htOption){var aReturn=[],oInstance;
if(typeof htOption=="undefined"){htOption={}
}for(var i=0,el;
(el=aObject[i]);
i++){oInstance=new this(el,htOption);
aReturn[aReturn.length]=oInstance
}return aReturn
};
jindo.m.Component.getInstance=function(){if(typeof this._aInstance=="undefined"){this._aInstance=[]
}return this._aInstance
};
if(typeof jindo.m.TimingFunction==="undefined"){jindo.m.TimingFunction={}
}jindo.m.TimingFunction._cubicBezier=function(x1,y1,x2,y2){return function(t){var cx=3*x1,bx=3*(x2-x1)-cx,ax=1-cx-bx,cy=3*y1,by=3*(y2-y1)-cy,ay=1-cy-by;
function sampleCurveX(t){return((ax*t+bx)*t+cx)*t
}function sampleCurveY(t){return((ay*t+by)*t+cy)*t
}function sampleCurveDerivativeX(t){return(3*ax*t+2*bx)*t+cx
}function solveCurveX(x,epsilon){var t0,t1,t2,x2,d2,i;
for(t2=x,i=0;
i<8;
i++){x2=sampleCurveX(t2)-x;
if(Math.abs(x2)<epsilon){return t2
}d2=sampleCurveDerivativeX(t2);
if(Math.abs(d2)<0.000001){break
}t2=t2-x2/d2
}t0=0;
t1=1;
t2=x;
if(t2<t0){return t0
}if(t2>t1){return t1
}while(t0<t1){x2=sampleCurveX(t2);
if(Math.abs(x2-x)<epsilon){return t2
}if(x>x2){t0=t2
}else{t1=t2
}t2=(t1-t0)*0.5+t0
}return t2
}return sampleCurveY(solveCurveX(t,1/200))
}
};
jindo.m.TimingFunction.linear=jindo.m.TimingFunction._cubicBezier(0,0,1,1);
jindo.m.TimingFunction.ease_out=jindo.m.TimingFunction._cubicBezier(0,0,0.58,1);
jindo.m.TimingFunction.ease_in=jindo.m.TimingFunction._cubicBezier(0.42,0,1,1);
jindo.m.TimingFunction.ease_in_out=jindo.m.TimingFunction._cubicBezier(0.42,0,0.58,1);
jindo.m.TimingFunction.ease_out_in=jindo.m.TimingFunction._cubicBezier(0,0.42,1,0.58);
jindo.m.TimingFunction.cubicBezier=function(x1,y1,x2,y2){return jindo.m.TimingFunction._cubicBezier(x1,y1,x2,y2)
};
jindo.m.Transition=jindo.$Class({_aTaskQueue:null,$init:function(htOption){this.option({sTransitionTimingFunction:"ease-in-out",bUseTimingFunction:jindo.m._isUseTimingFunction()});
this.option(htOption||{});
this._initVar();
this._attachEvent()
},_initVar:function(){this._aTaskQueue=[];
this._bIsPlaying=false;
this._sCssPrefix=jindo.m.getCssPrefix();
this._aBeforeStatus=[];
if(this._sCssPrefix.length>0){this._sCssPrefix="-"+this._sCssPrefix.toLowerCase()+"-"
}this._bNoUseCss3d=!this.option("bUseTimingFunction");
this._nTimerAnimate=null;
this._htCurrentTask=null
},start:function(){if((!this.isPlaying())&&this.isExistTask()){this._prepareTask()
}},isPlaying:function(){return this._bIsPlaying
},isExistTask:function(){if(!this._aTaskQueue){return false
}var nLen=this._aTaskQueue.length;
bValue=(nLen>0)?true:false;
return bValue
},queue:function(elTarget,nDuration,aCommand){var htTask={sType:"style",sTaskName:"",elTarget:elTarget,nDuration:nDuration};
htTask.htDefault={};
htTask.htStyle=aCommand.htStyle||{};
htTask.htTransform=aCommand.htTransform||{};
htTask.sTaskName=aCommand.sTaskName||null;
htTask.fCallback=aCommand.fCallback;
htTask.htDefault["transition-timing-function"]=(typeof htTask.htTransform["transition-timing-function"]==="undefined")?this._getDefaultTransition().sTransitionTimingFunction:htTask.htTransform["transition-timing-function"];
htTask.htDefault["transition-property"]=(typeof htTask.htTransform["transition-property"]==="undefined")?"all":htTask.htTransform["transition-property"];
htTask.htDefault["transition-duration"]=nDuration+"ms";
this._pushTask(htTask);
return this
},stop:function(bAfter){if(!this.isPlaying()){return
}if(typeof bAfter==="undefined"){bAfter=true
}if(!this._fireCustomEvent("stop",{element:this._htCurrentTask.elTarget,sTaskName:this._htCurrentTask.sTaskName,nDuration:this._htCurrentTask.nDuration})){return
}this._stopTransition(bAfter)
},clear:function(bStopAfter){this.stop(bStopAfter);
this._aTaskQueue=[]
},_resume:function(){if(this._htCurrentTask){this._doTask()
}},_stopTransition:function(bAfter){this._detachTransitionEnd();
this._elCurrent.style[this._sCssPrefix+"transition-property"]="none";
this._initTransition();
if(!bAfter){var nIndex=this._getBeforeStatusElement(this._elCurrent);
if(nIndex>-1){jindo.$Element(this._elCurrent).attr("style",this._aBeforeStatus[nIndex].style)
}}this._htCurrentTask=null;
this._bIsPlaying=false
},_prepareTask:function(){var htTask=this._popTask();
if(htTask===null||!htTask){this._bIsPlaying=false;
return
}this._htCurrentTask=htTask;
this._resume()
},_pushTask:function(htTask){this._aTaskQueue.push(htTask)
},_popTask:function(){if(!this.isExistTask()){return null
}var htTask=this._aTaskQueue.shift();
if(htTask){return htTask
}else{return null
}},_doTask:function(){if(this._htCurrentTask){this._bIsPlaying=true;
if(!this._fireCustomEvent("start",{element:this._htCurrentTask.elTarget,sTaskName:this._htCurrentTask.sTaskName,nDuration:this._htCurrentTask.nDuration})){return
}var el=this._htCurrentTask.elTarget;
var wel=jindo.$Element(el);
this._elCurrent=el;
this._setBeforeStatus(wel);
var nDuration=this._htCurrentTask.nDuration;
var bAttachEvt=this._bAttachTransitionEvt();
if(bAttachEvt){this._attachTransitionEnd(el)
}this._setDefaultTransition(wel,bAttachEvt);
var bDiff=false;
bDiff=this._setTransform(wel);
bDiff=this._setStyle(wel,this._htCurrentTask.htStyle)||bDiff;
if(nDuration===0){this._onTransitionEnd()
}else{if(!bDiff){var self=this;
setTimeout(function(){self._onTransitionEnd()
},nDuration)
}}}},_setDefaultTransition:function(wel,bAttachEvt){for(var p in this._htCurrentTask.htDefault){var sValue=this._htCurrentTask.htDefault[p];
if(!(p.indexOf("duration")>-1&&!bAttachEvt)){wel.$value().style[this._sCssPrefix+p]=sValue
}}},_setStyle:function(wel,htOption){var bDiff=false;
for(var p in htOption){var sCurrent=wel.css(p);
if(sCurrent!=htOption[p]){bDiff=true
}wel.css(p,htOption[p])
}return bDiff
},_setStyleForAndroid:function(){},_setTransform:function(wel){var bDiff=false;
if(this._bNoUseCss3d){bDiff=this._setTransformForAnrdoid(wel)
}else{bDiff=this._setTransformForIos(wel)
}return bDiff
},_setTransformForIos:function(wel){var bDiff=false;
for(var p in this._htCurrentTask.htTransform){var sValue=this._htCurrentTask.htTransform[p];
wel.$value().style[this._sCssPrefix+p]=sValue;
bDiff=true
}return bDiff
},_setTransformForAnrdoid:function(wel){var bDiff=false;
var el=wel.$value();
for(var p in this._htCurrentTask.htTransform){var sValue=this._htCurrentTask.htTransform[p];
if(sValue.indexOf("translate")>-1){var nDuration=this._htCurrentTask.nDuration;
var reg=new RegExp(/(translate.*)\((.*)\)/);
var aMatch=sValue.match(reg);
var sPreValue=aMatch[1];
var aTemp=aMatch[2].replace(/px/g,"").split(",");
var sTransfrom="transform";
var htBeforeOffset=jindo.m.getCssOffset(el);
var startTime=(new Date()).getTime();
var self=this;
(function translate(){var now=(new Date()).getTime();
if(now>=(startTime+nDuration)){cancelAnimationFrame(self._nTimerAnimate);
el.style[self._sCssPrefix+sTransfrom]=sValue;
self._onTransitionEnd();
return
}var nGap=(now-startTime);
var nX=((sPreValue.indexOf("X")>-1)||(aTemp.length>1))?aTemp[0]:null;
var nY=null;
if(sPreValue.indexOf("Y")>-1){nY=aTemp[0]
}else{if(aTemp.length>1){nY=aTemp[1]
}}var nZ=null;
if(sPreValue.indexOf("Z")>-1){nZ=aTemp[0]
}else{if(aTemp.length>2){nZ=aTemp[2]
}}var aText=[];
var sX=(nX!==null)?self._getcubicBeziserPosition(htBeforeOffset.left,nX,nDuration,nGap)+"px":null;
var sY=(nY!==null)?self._getcubicBeziserPosition(htBeforeOffset.top,nY,nDuration,nGap)+"px":null;
var sZ=(nZ!==null)?nZ+"px":null;
if(sX!==null){aText.push(sX)
}if(sY!==null){aText.push(sY)
}if(sZ!==null){aText.push(sZ)
}el.style[self._sCssPrefix+sTransfrom]=sPreValue+"("+aText.join(",")+")";
self._nTimerAnimate=requestAnimationFrame(translate)
})()
}else{wel.$value().style[this._sCssPrefix+p]=sValue
}bDiff=true
}return bDiff
},_bAttachTransitionEvt:function(){var bValue=true;
if(this._htCurrentTask.nDuration===0){bValue=false
}else{if(this._bNoUseCss3d){for(var p in this._htCurrentTask.htTransform){var sValue=this._htCurrentTask.htTransform[p];
if(sValue.indexOf("translate")>-1){bValue=false
}}}}return bValue
},_setBeforeStatus:function(wel){var nIndex=this._getBeforeStatusElement(wel.$value());
if(nIndex>-1){this._aBeforeStatus[nIndex].style=wel.attr("style")
}else{this._aBeforeStatus.push({el:wel.$value(),style:wel.attr("style")})
}},_getBeforeStatusElement:function(el){var nIndex=-1;
for(var i=0,nLen=this._aBeforeStatus.length;
i<nLen;
i++){if(this._aBeforeStatus[i].el===el){nIndex=i;
break
}}return nIndex
},_getDefaultTransition:function(){return{sTransitionTimingFunction:this.option("sTransitionTimingFunction"),TransitionProperty:"all"}
},_fireCustomEvent:function(sName,htParam){return this.fireEvent(sName,htParam)
},_onTransitionEnd:function(){this._detachTransitionEnd();
this._initTransition();
var self=this;
if(this._htCurrentTask){var sCallbackType=typeof this._htCurrentTask.fCallback;
if(sCallbackType=="function"){if(this._bNoUseCss3d){setTimeout(function(){self._htCurrentTask.fCallback()
},5)
}else{self._htCurrentTask.fCallback()
}}else{if(sCallbackType=="object"){var wel=jindo.$Element(this._htCurrentTask.elTarget),p;
for(p in this._htCurrentTask.fCallback.htTransform){var sValue=this._htCurrentTask.fCallback.htTransform[p];
if(p=="transform"){var sPrefix=this._sCssPrefix+p;
var sText=wel.$value().style[sPrefix];
if(sText.length>0){sValue=sValue
}}wel.$value().style[this._sCssPrefix+p]=sValue
}for(p in this._htCurrentTask.fCallback.htStyle){wel.css(p,this._htCurrentTask.fCallback.htStyle[p])
}}}}if(this._htCurrentTask){this._fireCustomEvent("end",{element:this._htCurrentTask.elTarget,sTaskName:this._htCurrentTask.sTaskName,nDuration:this._htCurrentTask.nDuration})
}setTimeout(function(){self._prepareTask()
},10)
},_initTransition:function(el){if(typeof el==="undefined"){el=this._elCurrent
}el.style[this._sCssPrefix+"transition-duration"]=null;
el.style[this._sCssPrefix+"transition-timing-function"]=null;
el.style[this._sCssPrefix+"perspective"]=null;
el.style[this._sCssPrefix+"transform-style"]=null;
el.style[this._sCssPrefix+"transition-property"]=null
},_getcubicBeziserPosition:function(nStart,nEnd,nDuration,nCurrentTime){nStart=nStart*1;
nEnd=nEnd*1;
var sFunction=this.option("sTransitionTimingFunction").replace(/-/g,"_");
var f=jindo.m.TimingFunction[sFunction];
var t=nCurrentTime/nDuration;
t=(t>1)?1:t;
var nCurrent=f(t);
var nValue=nStart+((nEnd-nStart)*nCurrent.toFixed(2));
return nValue
},_attachTransitionEnd:function(el){this._elTransition=el;
jindo.m.attachTransitionEnd(this._elTransition,this._htEvent.transitionEnd)
},_detachTransitionEnd:function(){if(this._elTransition){jindo.m.detachTransitionEnd(this._elTransition,this._htEvent.transitionEnd);
this._elTransition=null
}},_attachEvent:function(){this._htEvent={};
this._htEvent.transitionEnd=jindo.$Fn(this._onTransitionEnd,this).bind()
},_detachEvent:function(){this._detachTransitionEnd();
this._htEvent=null
},destroy:function(){this._detachEvent();
for(var p in this._htWElement){this._htWElement[p]=null
}this._htWElement=null;
this._aTaskQueue=null;
this._bIsPlaying=null;
this._sCssPrefix=null;
this._aBeforeStatus=null;
this._bNoUseCss3d=null;
this._nTimerAnimate=null;
this._htCurrentTask=null
}}).extend(jindo.m.Component);
jindo.m.UIComponent=jindo.$Class({$init:function(){this._bIsActivating=false
},isActivating:function(){return this._bIsActivating
},activate:function(){if(this.isActivating()){return this
}this._bIsActivating=true;
if(arguments.length>0){this._onActivate.apply(this,arguments)
}else{this._onActivate()
}return this
},deactivate:function(){if(!this.isActivating()){return this
}this._bIsActivating=false;
if(arguments.length>0){this._onDeactivate.apply(this,arguments)
}else{this._onDeactivate()
}return this
}}).extend(jindo.m.Component);
jindo.m.LayerEffect=jindo.$Class({$init:function(el,htUserOption){this.option({nDuration:250,bActivateOnload:true});
this.option(htUserOption||{});
this._initVar();
this.setLayer(el);
this._initTransition();
if(this.option("bActivateOnload")){this.activate()
}},_htEffect:{expand:"jindo.m.ExpandEffect",contract:"jindo.m.ContractEffect",fade:"jindo.m.FadeEffect",pop:"jindo.m.PopEffect",slide:"jindo.m.SlideEffect",flip:"jindo.m.FlipEffect"},_initVar:function(){this._htEffectInstance={};
this._htLayerInfo={};
this._htWElement={};
this.bAndroid=jindo.m.getDeviceInfo().android;
this.sClassHighligting="_effct_hide_highlighting_tmp"
},_initTransition:function(){this._oTransition=new jindo.m.Transition()
},_createEffect:function(sType){if(this._htEffect[sType]&&!this._htEffectInstance[sType]){try{this._htEffectInstance[sType]=eval("new "+this._htEffect[sType]+"()")
}catch(e){}this._htEffectInstance[sType].setLayerInfo(this._htLayerInfo)
}},expand:function(htOption){var sType="expand";
this._run(sType,htOption)
},contract:function(htOption){var sType="contract";
this._run(sType,htOption)
},fade:function(htOption){var sType="fade";
this._run(sType,htOption)
},pop:function(htOption){var sType="pop";
this._run(sType,htOption)
},slide:function(htOption){var sType="slide";
this._run(sType,htOption)
},flip:function(htOption){var sType="flip";
this._run(sType,htOption)
},isPlaying:function(){return this._oTransition.isPlaying()
},_fireCustomEvent:function(sType,htOption){return this.fireEvent(sType,htOption)
},_run:function(sType,htOption){if(!this._isAvailableEffect()){return
}this._createEffect(sType);
if(typeof htOption==="undefined"){htOption={}
}var oEffect=this._htEffectInstance[sType];
var el=this.getLayer();
var nDuration=(typeof htOption.nDuration==="undefined")?this.option("nDuration"):parseInt(htOption.nDuration,10);
var htBefore=oEffect.getBeforeCommand(el,htOption);
var htCommand=oEffect.getCommand(el,htOption);
if(!this._fireCustomEvent("beforeEffect",{elLayer:el,sEffect:htCommand.sTaskName,nDuration:nDuration})){return
}if(htBefore){this._oTransition.queue(this.getLayer(),0,htBefore)
}this._oTransition.queue(this.getLayer(),nDuration,htCommand);
this._oTransition.start()
},setLayer:function(el){this._htWElement.el=jindo.$(el);
this._htWElement.wel=jindo.$Element(this._htWElement.el);
var elFocus;
if(!!this.bAndroid){elFocus=jindo.$$.getSingle("."+this.sClassHighligting,this._htWElement.el);
if(!elFocus){var sTpl='<a href="javascript:void(0)" style="position:absolute" class="'+this.sClassHighligting+'"></a>';
elFocus=jindo.$(sTpl);
this._htWElement.wel.append(elFocus);
elFocus.style.opacity="0";
elFocus.style.width=0;
elFocus.style.height=0;
elFocus.style.left="-1000px";
elFocus.style.top="-1000px"
}}this.setSize()
},stop:function(bAfter){if(typeof bAfter==="undefined"){bAfter=true
}if(this._oTransition){this._oTransition.stop(bAfter)
}},clearEffect:function(bAfter){if(this._oTransition){this._oTransition.clear(bAfter)
}},getLayer:function(){return this._htWElement.el
},setSize:function(){var elToMeasure=this._htWElement.el.cloneNode(true);
var welToMeasure=jindo.$Element(elToMeasure);
welToMeasure.opacity(0);
this._htWElement.wel.after(welToMeasure);
welToMeasure.show();
this._htLayerInfo.nWidth=this._htWElement.wel.width();
this._htLayerInfo.nHeight=this._htWElement.wel.height();
welToMeasure.css({position:"absolute",top:"0px",left:"0px"});
this._htLayerInfo.nMarginLeft=parseInt(welToMeasure.css("marginLeft"),10);
this._htLayerInfo.nMarginTop=parseInt(welToMeasure.css("marginTop"),10);
this._htLayerInfo.nMarginLeft=isNaN(this._htLayerInfo.nMarginLeft)?0:this._htLayerInfo.nMarginLeft;
this._htLayerInfo.nMarginTop=isNaN(this._htLayerInfo.nMarginTop)?0:this._htLayerInfo.nMarginTop;
this._htLayerInfo.nOpacity=this._htWElement.wel.opacity();
this._htLayerInfo.sPosition=this._htWElement.wel.css("position");
var sDisplay=this._htWElement.wel.css("display");
sDisplay=((sDisplay==="none")||(sDisplay.length===0))?"block":sDisplay;
this._htLayerInfo.sDisplay=sDisplay;
this._htLayerInfo.sClassHighligting=this.sClassHighligting;
welToMeasure.leave();
this._setEffectLayerInfo()
},_setEffectLayerInfo:function(){for(var p in this._htEffectInstance){this._htEffectInstance[p].setLayerInfo(this._htLayerInfo)
}},_onTransitionEnd:function(oCustomEvent){if(oCustomEvent.sTaskName){this._fireCustomEvent("afterEffect",{elLayer:oCustomEvent.element,sEffect:oCustomEvent.sTaskName,nDuration:oCustomEvent.nDuration})
}},_onTransitionStop:function(oCustomEvent){if(oCustomEvent.sTaskName){this._fireCustomEvent("stop",{elLayer:oCustomEvent.element,sEffect:oCustomEvent.sTaskName,nDuration:oCustomEvent.nDuration})
}},_isAvailableEffect:function(){return this.isActivating()
},_onActivate:function(){this._attachEvent()
},_onDeactivate:function(){this._detachEvent()
},_attachEvent:function(){this._htEvent={};
this._htEvent.end=jindo.$Fn(this._onTransitionEnd,this).bind();
this._htEvent.stop=jindo.$Fn(this._onTransitionStop,this).bind();
if(this._oTransition){this._oTransition.attach({end:this._htEvent.end,stop:this._htEvent.stop})
}},_detachEvent:function(){this._htEvent=null;
if(this._oTransition){this._oTransition.detachAll()
}},destroy:function(){this.deactivate();
for(var p in this._htWElement){this._htWElement[p]=null
}this._htWElement=null
}}).extend(jindo.m.UIComponent);
jindo.m.Effect=jindo.$Class({$init:function(){this._sCssPrefix=jindo.m.getCssPrefix();
var htDInfo=jindo.m.getDeviceInfo();
this.bIos=(htDInfo.iphone||htDInfo.ipad);
this.bIos3=htDInfo.iphone&&(htDInfo.version.length>0)&&(htDInfo.version.substring(0,1)=="3");
this.bAndroid=htDInfo.android;
this.bAndroid3Up=htDInfo.android&&(htDInfo.version.length>0)&&(htDInfo.version.substring(0,1)>="3");
this.bAndroid2_1=htDInfo.android&&(htDInfo.version.length>0)&&(htDInfo.version==="2.1");
this.sTranOpen=(this.bIos)?"translate3d(":"translate(";
this.sTranEnd=(this.bIos)?",0px)":")";
this._initVar()
},_initVar:function(){this._htLayerInfo={}
},setLayerInfo:function(htInfo){this._htLayerInfo={};
for(var p in htInfo){this._htLayerInfo[p]=htInfo[p]
}},getTransitionTask:function(){return null
},getBeforeCommand:function(){return null
},getCommand:function(){return null
}});
jindo.m.FadeEffect=jindo.$Class({sEffectName:"fade",getCommand:function(el,htOption){var sDirection=htOption.sDirection?htOption.sDirection:"in";
var htStyle=htOption.htTo||{};
var nOpacity=(sDirection=="in")?1:0;
htStyle.opacity=(typeof htStyle.opacity!=="undefined")?htStyle.opacity:nOpacity;
var htCallback={};
if(sDirection=="out"){htCallback.htStyle={};
htCallback.htStyle.display="none";
htCallback.htStyle.opacity=this._htLayerInfo.nOpacity
}return{sTaskName:this.sEffectName+"-"+sDirection,htStyle:htStyle,htTransform:{},fCallback:htCallback}
},getBeforeCommand:function(el,htOption){var sDirection=htOption.sDirection?htOption.sDirection:"in";
var htBeforeStyle=htOption.htFrom||{};
var nOpacity=(sDirection=="in")?0:1;
htBeforeStyle.display=this._htLayerInfo.sDisplay;
htBeforeStyle.opacity=(typeof htBeforeStyle.opacity=="undefined")?nOpacity:htBeforeStyle.opacity;
return{htStyle:htBeforeStyle,htTransform:{}}
}}).extend(jindo.m.Effect);
jindo.m.Touch=jindo.$Class({$init:function(sId,htUserOption){this._el=jindo.$(sId);
var htDefaultOption={nMomentumDuration:350,nMoveThreshold:7,nSlopeThreshold:25,nLongTapDuration:1000,nDoubleTapDuration:400,nTapThreshold:6,nPinchThreshold:0.1,nRotateThreshold:5,nEndEventThreshold:0,bActivateOnload:true};
this.option(htDefaultOption);
this.option(htUserOption||{});
this._initVariable();
this._setSlope();
if(this.option("bActivateOnload")){this.activate()
}},_initVariable:function(){this._hasTouchEvent=false;
this._htEventName=jindo.m._getTouchEventName();
if(this._htEventName.start.indexOf("touch")>-1){this._hasTouchEvent=true
}else{if(this._htEventName.start.indexOf("MSPointer")>-1){if(typeof this._el.style.msTouchAction!="undefined"){this._el.style.msTouchAction="none"
}}}this._radianToDegree=180/Math.PI;
this._htMoveInfo={nStartX:0,nStartY:0,nBeforeX:0,nBeforeY:0,nStartTime:0,nBeforeTime:0,nStartDistance:0,nBeforeDistance:0,nStartAngle:0,nLastAngle:0};
this.bStart=false;
this.bMove=false;
this.nMoveType=-1;
this.htEndInfo={};
this._nVSlope=0;
this._nHSlope=0;
this.bSetSlope=false
},_attachEvents:function(){this._htEvent={};
var bTouch=this._hasTouchEvent;
this._htEvent[this._htEventName.start]={fn:jindo.$Fn(this._onStart,this).bind(),el:this._el};
this._htEvent[this._htEventName.move]={fn:jindo.$Fn(this._onMove,this).bind(),el:this._el};
this._htEvent[this._htEventName.end]={fn:jindo.$Fn(this._onEnd,this).bind(),el:this._el};
this._htEvent.rotate=jindo.$Fn(this._onResize,this).bind();
jindo.m.bindRotate(this._htEvent.rotate);
if(this._htEventName.cancel){this._htEvent[this._htEventName.cancel]={fn:jindo.$Fn(this._onCancel,this).bind(),el:this._el}
}for(var p in this._htEvent){if(this._htEvent[p].fn){this._htEvent[p].ref=jindo.m._attachFakeJindo(this._htEvent[p].el,this._htEvent[p].fn,p)
}}},_detachEvents:function(){for(var p in this._htEvent){var htTargetEvent=this._htEvent[p];
if(htTargetEvent.ref){htTargetEvent.ref.detach(htTargetEvent.el,p)
}}jindo.m.unbindRotate(this._htEvent.rotate);
this._htEvent=null
},_onCancel:function(oEvent){this._onEnd(oEvent)
},_onStart:function(oEvent){this._resetTouchInfo();
var htInfo=this._getTouchInfo(oEvent);
var htParam={element:htInfo[0].el,nX:htInfo[0].nX,nY:htInfo[0].nY,oEvent:oEvent};
if(!this._fireCustomEvent("touchStart",htParam)){return
}this.bStart=true;
this._htMoveInfo.nStartX=htInfo[0].nX;
this._htMoveInfo.nBeforeX=htInfo[0].nX;
this._htMoveInfo.nStartY=htInfo[0].nY;
this._htMoveInfo.nBeforeY=htInfo[0].nY;
this._htMoveInfo.nStartTime=htInfo[0].nTime;
this._htMoveInfo.aStartInfo=htInfo;
this._startLongTapTimer(htInfo,oEvent)
},_onMove:function(oEvent){if(!this.bStart){return
}this.bMove=true;
var htInfo=this._getTouchInfo(oEvent);
var htParam=this._getCustomEventParam(htInfo,false);
if(htInfo.length===1){if(this.nMoveType<0||this.nMoveType==3||this.nMoveType==4){var nMoveType=this._getMoveType(htInfo);
if(!((this.nMoveType==4)&&(nMoveType==3))){this.nMoveType=nMoveType
}}}else{if(this.nMoveType!==8){this.nMoveType=this._getMoveType(htInfo)
}}htParam=this._getCustomEventParam(htInfo,false);
if((typeof this._nLongTapTimer!="undefined")&&this.nMoveType!=3){this._deleteLongTapTimer()
}htParam.oEvent=oEvent;
var nDis=0;
if(this.nMoveType==0){nDis=Math.abs(htParam.nVectorX)
}else{if(this.nMoveType==1){nDis=Math.abs(htParam.nVectorY)
}else{nDis=Math.abs(htParam.nVectorX)+Math.abs(htParam.nVectorY)
}}if(nDis<this.option("nMoveThreshold")){return
}if(!this.fireEvent("touchMove",htParam)){this.bStart=false;
return
}this._htMoveInfo.nBeforeX=htInfo[0].nX;
this._htMoveInfo.nBeforeY=htInfo[0].nY;
this._htMoveInfo.nBeforeTime=htInfo[0].nTime
},_onEnd:function(oEvent){if(!this.bStart){return
}var self=this;
this._deleteLongTapTimer();
this._deleteEndEventTimer();
if(!this.bMove&&(this.nMoveType!=4)){this.nMoveType=3
}if(this.nMoveType<0){return
}var htInfo=this._getTouchInfo(oEvent);
if(this._isDblTap(htInfo[0].nX,htInfo[0].nY,htInfo[0].nTime)){clearTimeout(this._nTapTimer);
delete this._nTapTimer;
this.nMoveType=5
}var htParam=this._getCustomEventParam(htInfo,true);
htParam.oEvent=oEvent;
var sMoveType=htParam.sMoveType;
if((typeof this._htEventHandler[jindo.m.MOVETYPE[5]]!="undefined"&&(this._htEventHandler[jindo.m.MOVETYPE[5]].length>0))&&(this.nMoveType==3)){this._nTapTimer=setTimeout(function(){self.fireEvent("touchEnd",htParam);
self._fireCustomEvent(sMoveType,htParam);
delete self._nTapTimer
},this.option("nDoubleTapDuration"))
}else{this.fireEvent("touchEnd",htParam);
if(this.nMoveType!=4){if(this.nMoveType===8){htParam.sMoveType=jindo.m.MOVETYPE[6];
this._fireCustomEvent(jindo.m.MOVETYPE[6],htParam);
htParam.sMoveType=jindo.m.MOVETYPE[7];
this._fireCustomEvent(jindo.m.MOVETYPE[7],htParam)
}else{setTimeout(function(){self._fireCustomEvent(sMoveType,htParam)
},0)
}}}this._updateTouchEndInfo(htInfo);
this._resetTouchInfo()
},_startEndEventTimer:function(oEvent){var self=this;
this._nEndEventTimer=setTimeout(function(){self._onEnd(oEvent);
delete self._nEndEventTimer
},self.option("nEndEventThreshold"))
},_deleteEndEventTimer:function(){if(typeof this._nEndEventTimer!="undefined"){clearTimeout(this._nEndEventTimer);
delete this._nEndEventTimer
}},_fireCustomEvent:function(sEvent,htOption){return this.fireEvent(sEvent,htOption)
},_getCustomEventParam:function(htTouchInfo,bTouchEnd){var sMoveType=jindo.m.MOVETYPE[this.nMoveType];
var nDuration=htTouchInfo[0].nTime-this._htMoveInfo.nStartTime;
var nVectorX=nVectorY=nMomentumX=nMomentumY=nSpeedX=nSpeedY=nDisX=nDisY=0;
nDisX=(this.nMoveType===1)?0:htTouchInfo[0].nX-this._htMoveInfo.nStartX;
nDisY=(this.nMoveType===0)?0:htTouchInfo[0].nY-this._htMoveInfo.nStartY;
nVectorX=htTouchInfo[0].nX-this._htMoveInfo.nBeforeX;
nVectorY=htTouchInfo[0].nY-this._htMoveInfo.nBeforeY;
if(bTouchEnd&&(this.nMoveType==0||this.nMoveType==1||this.nMoveType==2)){if(nDuration<=this.option("nMomentumDuration")){nSpeedX=Math.abs(nDisX)/nDuration;
nMomentumX=(nSpeedX*nSpeedX)/2;
nSpeedY=Math.abs(nDisY)/nDuration;
nMomentumY=(nSpeedY*nSpeedY)/2
}}var htParam={element:htTouchInfo[0].el,nX:htTouchInfo[0].nX,nY:htTouchInfo[0].nY,nVectorX:nVectorX,nVectorY:nVectorY,nDistanceX:nDisX,nDistanceY:nDisY,sMoveType:sMoveType,nStartX:this._htMoveInfo.nStartX,nStartY:this._htMoveInfo.nStartY,nStartTimeStamp:this._htMoveInfo.nStartTime};
if((htTouchInfo.length)>1||(this.nMoveType>=6)){htParam.nScale=this._getScale(htTouchInfo);
htParam.nRotation=this._getRotation(htTouchInfo);
if(htParam.nScale===null){htParam.nScale=this._htMoveInfo.nBeforeScale
}if(htParam.nRotation===null){htParam.nRotation=this._htMoveInfo.nBeforeRotation
}}if(htTouchInfo.length>=1){var aX=[];
var aY=[];
var aElement=[];
for(var i=0,nLen=htTouchInfo.length;
i<nLen;
i++){aX.push(htTouchInfo[i].nX);
aY.push(htTouchInfo[i].nY);
aElement.push(htTouchInfo[i].el)
}htParam.aX=aX;
htParam.aY=aY;
htParam.aElement=aElement
}if(bTouchEnd){htParam.nMomentumX=nMomentumX;
htParam.nMomentumY=nMomentumY;
htParam.nSpeedX=nSpeedX;
htParam.nSpeedY=nSpeedY;
htParam.nDuration=nDuration
}return htParam
},_updateTouchEndInfo:function(htInfo){this.htEndInfo={element:htInfo[0].el,time:htInfo[0].nTime,movetype:this.nMoveType,nX:htInfo[0].nX,nY:htInfo[0].nY}
},_deleteLongTapTimer:function(){if(typeof this._nLongTapTimer!="undefined"){clearTimeout(this._nLongTapTimer);
delete this._nLongTapTimer
}},_startLongTapTimer:function(htInfo,oEvent){var self=this;
if((typeof this._htEventHandler[jindo.m.MOVETYPE[4]]!="undefined")&&(this._htEventHandler[jindo.m.MOVETYPE[4]].length>0)){self._nLongTapTimer=setTimeout(function(){self.fireEvent("longTap",{element:htInfo[0].el,oEvent:oEvent,nX:htInfo[0].nX,nY:htInfo[0].nY});
delete self._nLongTapTimer;
self.nMoveType=4
},self.option("nLongTapDuration"))
}},_onResize:function(){this._setSlope()
},_isDblTap:function(nX,nY,nTime){if((typeof this._nTapTimer!="undefined")&&this.nMoveType==3){var nGap=this.option("nTapThreshold");
if((Math.abs(this.htEndInfo.nX-nX)<=nGap)&&(Math.abs(this.htEndInfo.nY-nY)<=nGap)){return true
}}return false
},_setSlope:function(){if(!this.bSetSlope){this._nHSlope=((window.innerHeight/2)/window.innerWidth).toFixed(2)*1;
this._nVSlope=(window.innerHeight/(window.innerWidth/2)).toFixed(2)*1
}},setSlope:function(nVSlope,nHSlope){this._nHSlope=nHSlope;
this._nVSlope=nVSlope;
this.bSetSlope=true
},getSlope:function(){return{nVSlope:this._nVSlope,nHSlope:this._nHSlope}
},_resetTouchInfo:function(){for(var x in this._htMoveInfo){this._htMoveInfo[x]=0
}this._deleteLongTapTimer();
this.bStart=false;
this.bMove=false;
this.nMoveType=-1
},_getMoveTypeBySingle:function(x,y){var nType=this.nMoveType;
var nX=Math.abs(this._htMoveInfo.nStartX-x);
var nY=Math.abs(this._htMoveInfo.nStartY-y);
var nDis=nX+nY;
var nGap=this.option("nTapThreshold");
if((nX<=nGap)&&(nY<=nGap)){nType=3
}else{nType=-1
}if(this.option("nSlopeThreshold")<=nDis){var nSlope=parseFloat((nY/nX).toFixed(2),10);
if((this._nHSlope===-1)&&(this._nVSlope===-1)){nType=2
}else{if(nSlope<=this._nHSlope){nType=0
}else{if(nSlope>=this._nVSlope){nType=1
}else{nType=2
}}}}return nType
},_getMoveTypeByMulti:function(aPos){var nType=-1;
if((this.nMoveType===6)||Math.abs(1-this._htMoveInfo.nBeforeScale)>=this.option("nPinchThreshold")){nType=6
}if((this.nMoveType===7)||Math.abs(0-this._htMoveInfo.nBeforeRotation)>=this.option("nRotateThreshold")){if(nType===6){nType=8
}else{nType=7
}}if(nType===-1){return this.nMoveType
}return nType
},_getScale:function(aPos){var nScale=-1;
var nDistance=this._getDistance(aPos);
if(nDistance<=0){return null
}if(this._htMoveInfo.nStartDistance===0){nScale=1;
this._htMoveInfo.nStartDistance=nDistance
}else{nScale=nDistance/this._htMoveInfo.nStartDistance
}this._htMoveInfo.nBeforeScale=nScale;
return nScale
},_getRotation:function(aPos){var nRotation=-1;
var nAngle=this._getAngle(aPos);
if(nAngle===null){return null
}if(this._htMoveInfo.nStartAngle===0){this._htMoveInfo.nStartAngle=nAngle;
nRotation=0
}else{nRotation=nAngle-this._htMoveInfo.nStartAngle
}this._htMoveInfo.nLastAngle=nAngle;
this._htMoveInfo.nBeforeRotation=nRotation;
return nRotation
},_getMoveType:function(aPos){var nType=this.nMoveType;
if(aPos.length===1){nType=this._getMoveTypeBySingle(aPos[0].nX,aPos[0].nY)
}else{if(aPos.length===2){nType=this._getMoveTypeByMulti(aPos)
}}return nType
},_getDistance:function(aPos){if(aPos.length===1){return -1
}return Math.sqrt(Math.pow(Math.abs(aPos[0].nX-aPos[1].nX),2)+Math.pow(Math.abs(aPos[0].nY-aPos[1].nY),2))
},_getAngle:function(aPos){if(aPos.length===1){return null
}var deltaX=aPos[0].nX-aPos[1].nX,deltaY=aPos[0].nY-aPos[1].nY;
var nAngle=Math.atan2(deltaY,deltaX)*this._radianToDegree;
if(this._htMoveInfo.nLastAngle!==null){var nDiff=Math.abs(this._htMoveInfo.nLastAngle-nAngle);
var nNext=nAngle+360;
var nPrev=nAngle-360;
if(Math.abs(nNext-this._htMoveInfo.nLastAngle)<nDiff){nAngle=nNext
}else{if(Math.abs(nPrev-this._htMoveInfo.nLastAngle)<nDiff){nAngle=nPrev
}}}return nAngle
},_getTouchInfo:function(oEvent){var aReturn=[];
var nTime=oEvent.$value().timeStamp;
if(this._hasTouchEvent){var oTouch=oEvent.$value().changedTouches;
for(var i=0,nLen=oTouch.length;
i<nLen;
i++){aReturn.push({el:jindo.m.getNodeElement(oTouch[i].target),nX:oTouch[i].pageX,nY:oTouch[i].pageY,nTime:nTime})
}}else{aReturn.push({el:oEvent.element,nX:oEvent.pos().pageX,nY:oEvent.pos().pageY,nTime:nTime})
}return aReturn
},getBaseElement:function(el){return this._el
},_onDeactivate:function(){this._detachEvents()
},_onActivate:function(){this._attachEvents()
},destroy:function(){this.deactivate();
this._el=null;
for(var p in this._htMoveInfo){this._htMoveInfo[p]=null
}this._htMoveInfo=null;
for(var p in this.htEndInfo){this.htEndInfo[p]=null
}this.htEndInfo=null;
this.bStart=null;
this.bMove=null;
this.nMoveType=null;
this._nVSlope=null;
this._nHSlope=null;
this.bSetSlope=null
}}).extend(jindo.m.UIComponent);
jindo.m.Flicking=jindo.$Class({$init:function(sId,htUserOption){this.option({bHorizontal:true,nDefaultIndex:0,sClassPrefix:"flick-",sContentClass:"ct",nDuration:100,nFlickThreshold:40,bUseCircular:false,sAnimation:"slide",nFlickDistanceOffset:null,bAutoResize:true,bAutoSize:true,nBounceDuration:100,bSetNextPanelPos:false,bUseCss3d:jindo.m._isUseCss3d(true),bUseTimingFunction:jindo.m._isUseTimingFunction(),bUseTranslate:true,bActivateOnload:true,bUseDiagonalTouch:false});
var htInfo=jindo.m.getDeviceInfo();
if((typeof htUserOption!=="undefined")&&(typeof htUserOption.sAnimation!=="undefined")&&(htUserOption.sAnimation==="cover")){if((htInfo.android&&!htInfo.bChrome)&&(parseInt(htInfo.version,10)>=4)&&(htInfo.galaxyS2||htInfo.galaxyNote)){this.option("bUseCss3d",true)
}}this.option(htUserOption||{});
this._setWrapperElement(sId);
this._initVar();
this._createDummyTag();
this._initTouch();
if(this.option("bActivateOnload")){this.activate()
}},$static:{_htAnimation:{"circular-slide":"jindo.m.CircularSlideFlicking",slide:"jindo.m.SlideFlicking",cover:"jindo.m.CoverFlicking","circular-cover":"jindo.m.CoverFlicking",flip:"jindo.m.FlipFlicking","circular-flip":"jindo.m.FlipFlicking",alignFlip:"jindo.m.AlignFlipFlicking","circular-alignFlip":"jindo.m.AlignFlipFlicking"}},_initVar:function(){this._oTouch=null;
this._oFlickingAnimation=null;
this._doFlicking=false;
this._htIndexInfo={nContentIndex:0,nNextContentIndex:0,welElement:this._htWElement.aPanel[0],welNextElement:this._htWElement.aPanel[0],sDirection:null};
var htInfo=jindo.m.getDeviceInfo();
this._isIos=(htInfo.iphone||htInfo.ipad);
this._bAndroid=htInfo.android&&(!htInfo.bChrome);
this._nVersion=htInfo.version;
this._fnDummyFnc=function(){return false
};
this._bClickBug=jindo.m.hasClickBug();
this._b3dExecption=this._bAndroid&&(navigator.userAgent.indexOf("LG")>-1)&&(this._nVersion>="4");
this._bDummyTagException=(this._bAndroid&&(this._nVersion<"3"))
},_setWrapperElement:function(el){this._htWElement={};
el=jindo.$(el);
var sClass="."+this.option("sClassPrefix");
this._htWElement.base=jindo.$Element(el).css("zIndex","99999");
this._htWElement.container=jindo.$Element(jindo.$$.getSingle(sClass+"container",el));
var aContents=jindo.$$(sClass+this.option("sContentClass"),el);
this._htWElement.aPanel=jindo.$A(aContents).forEach(function(value,index,array){array[index]=jindo.$Element(value)
}).$value();
if(typeof this._htWElement.base.$value().style.msTouchAction!=="undefined"){this._htWElement.base.css("msTouchAction","none")
}},_createDummyTag:function(){if(this._bDummyTagException){this._htWElement.aDummyTag=[];
for(var i=0,nLen=this._htWElement.aPanel.length;
i<nLen;
i++){var wel=this._htWElement.aPanel[i];
var elDummyTag=jindo.$$.getSingle("._cflick_dummy_atag_",wel.$value());
if(!elDummyTag){elDummyTag=jindo.$("<a href='javascript:void(0);' class='_cflick_dummy_atag_'></a>");
elDummyTag.style.position="absolute";
elDummyTag.style.left="-1000px";
elDummyTag.style.top="-1000px";
elDummyTag.style.width=0;
elDummyTag.style.height=0;
wel.append(elDummyTag)
}this._htWElement.aDummyTag.push(elDummyTag)
}}},_focusFixedBug:function(){if(!this._htWElement||typeof this._htWElement.aDummyTag==="undefined"){return
}for(var i=0,nLen=this._htWElement.aDummyTag.length;
i<nLen;
i++){this._htWElement.aDummyTag[i].focus()
}},_initTouch:function(){this._oTouch=new jindo.m.Touch(this._htWElement.base.$value(),{nSlopeThreshold:4,nMoveThreshold:0,nEndEventThreshold:(jindo.m.getDeviceInfo().win)?400:0,bActivateOnload:false})
},_onStart:function(oCustomEvt){if(this._doFlicking){return
}if(!this.fireEvent("touchStart",oCustomEvt)){oCustomEvt.stop();
return
}this._bTouchStart=true;
this._clearAnchor();
if(this._oFlickingAnimation){this._oFlickingAnimation.onStart()
}},_onMove:function(oCustomEvt){var bH=this.option("bHorizontal");
var weParent=oCustomEvt.oEvent;
if(oCustomEvt.sMoveType===jindo.m.MOVETYPE[0]){if(bH){weParent.stop(jindo.$Event.CANCEL_ALL)
}else{this.fireEvent("scroll");
return
}}else{if(oCustomEvt.sMoveType===jindo.m.MOVETYPE[1]){if(!bH){weParent.stop(jindo.$Event.CANCEL_ALL)
}else{this.fireEvent("scroll");
return
}}else{if(oCustomEvt.sMoveType===jindo.m.MOVETYPE[2]){if(this.option("bUseDiagonalTouch")){weParent.stop(jindo.$Event.CANCEL_ALL)
}else{this.fireEvent("scroll");
return
}}}}if(this._doFlicking){return
}if(!this._bTouchStart){return
}this.fireEvent("touchMove",oCustomEvt);
var nDis=bH?oCustomEvt.nDistanceX:oCustomEvt.nDistanceY;
var nVector=bH?oCustomEvt.nVectorX:oCustomEvt.nVectorY;
var nPos=bH?oCustomEvt.nX:oCustomEvt.nY;
if(this._oFlickingAnimation){this._oFlickingAnimation.movePanel(nDis,nVector,nPos,0)
}},_onEnd:function(oCustomEvt){if(this._doFlicking){return
}if(!this._bTouchStart){return
}this._doFlicking=true;
var bH=this.option("bHorizontal");
if(!(this._bAndroid&&(this._nVersion>="4.1"))){if(oCustomEvt.sMoveType===jindo.m.MOVETYPE[0]||oCustomEvt.sMoveType===jindo.m.MOVETYPE[1]||oCustomEvt.sMoveType===jindo.m.MOVETYPE[2]){oCustomEvt.oEvent.stop(jindo.$Event.CANCEL_DEFAULT)
}}if(oCustomEvt.sMoveType===jindo.m.MOVETYPE[3]||oCustomEvt.sMoveType===jindo.m.MOVETYPE[4]){this._restoreAnchor()
}var nTime=this.option("nDuration");
var htInfo=this._getSnap(oCustomEvt.nDistanceX,oCustomEvt.nDistanceY,nTime,oCustomEvt.sMoveType);
var nDis=bH?oCustomEvt.nDistanceX:oCustomEvt.nDistanceY;
var nVector=bH?oCustomEvt.nVectorX:oCustomEvt.nVectorY;
var nPos=bH?oCustomEvt.nX:oCustomEvt.nY;
if(htInfo.sDirection===null){nTime=this.option("nBounceDuration");
if(nDis===0||((oCustomEvt.sMoveType===jindo.m.MOVETYPE[2])&&!this.option("bUseDiagonalTouch"))){this._endAnimation(false);
return
}}var htParam={nContentsIndex:this.getContentIndex(),nContentsNextIndex:htInfo.nContentIndex};
if(this._bFlickLeft!==null){if(this.option("bHorizontal")){htParam.bLeft=this._bFlickLeft
}else{htParam.bTop=this._bFlickLeft
}}if(htInfo.sDirection!==null){if(!this.fireEvent("beforeFlicking",htParam)){this._oFlickingAnimation.restorePosition();
return
}}this._htIndexInfo.nNextContentIndex=htInfo.nContentIndex;
this._htIndexInfo.welNextElement=htInfo.welElement;
this._htIndexInfo.sDirection=htInfo.sDirection;
if(this._oFlickingAnimation){this._oFlickingAnimation.movePanel(nDis,nVector,nPos,nTime,true)
}this.fireEvent("touchEnd",oCustomEvt)
},_getSnap:function(nDistanceX,nDistanceY,nDuration,sType){var nFinalDis=this.option("bHorizontal")?nDistanceX:nDistanceY;
var welElement=this._htIndexInfo.welElement;
var nContentIndex=this.getContentIndex();
var sDirection=null;
if(!((sType===jindo.m.MOVETYPE[2])&&!this.option("bUseDiagonalTouch"))){if(Math.abs(nFinalDis)>=this.option("nFlickThreshold")){if(nFinalDis<0){welElement=this.getNextElement();
nContentIndex=this.getNextIndex();
this._bFlickLeft=true;
sDirection="next"
}else{welElement=this.getPrevElement();
nContentIndex=this.getPrevIndex();
this._bFlickLeft=false;
sDirection="prev"
}}}return{elElement:welElement.$value(),welElement:welElement,nContentIndex:nContentIndex,sDirection:sDirection}
},_createAnimation:function(sType){if(jindo.m.Flicking._htAnimation[sType]){this._oFlickingAnimation=null;
try{this._oFlickingAnimation=eval("new "+jindo.m.Flicking._htAnimation[sType]+"()")
}catch(e){}}},setFlickingAnimation:function(sType){if(typeof sType==="undefined"){sType=this.option("sAnimation");
if(this.option("bUseCircular")){sType="circular-"+sType
}}if(!jindo.m.Flicking._htAnimation[sType]){return false
}if(!this._oFlickingAnimation||(this.option("sAnimation")!==sType)){this.option("sAnimation",sType);
if(sType==="slide"){this._oTouch.deactivate()
}else{this._oTouch.activate()
}this._createAnimation(sType);
if(this._oFlickingAnimation){this._oFlickingAnimation.setOption(this.option());
this._oFlickingAnimation.setWrapperElement(this._htWElement);
this._oFlickingAnimation.setInstance(this);
this._oFlickingAnimation.initAnimation()
}}},_endAnimation:function(bFireEvent){var self=this;
if(typeof bFireEvent==="undefined"){bFireEvent=true
}this._doFlicking=false;
this._bTouchStart=false;
this._resetIndexInfo(this._htIndexInfo.nNextContentIndex,this._htIndexInfo.welNextElement);
if(bFireEvent){this._fireCustomEvent("afterFlicking")
}this._restoreAnchor();
this._setAnchorElement();
setTimeout(function(){self._createDummyTag();
self._focusFixedBug()
},5);
this._bFlickLeft=null
},_fireCustomEvent:function(sEventName,htParam){if(typeof htParam==="undefined"){htParam={nContentsIndex:this.getContentIndex()};
if(this._bFlickLeft){if(this.option("bHorizontal")){htParam.bLeft=this._bFlickLeft
}else{htParam.bTop=this._bFlickLeft
}}}return this.fireEvent(sEventName,htParam)
},refresh:function(n,bResize,bFireEvent){var self=this;
if(typeof n==="undefined"){n=this.getContentIndex()
}if(isNaN((n*1))||n<0){return
}var nMax=this.getTotalContents()-1;
if(n>nMax){return
}if(typeof bResize==="undefined"){bResize=true
}if(typeof bFireEvent==="undefined"){bFireEvent=true
}if(bFireEvent){if(!this._fireCustomEvent("beforeMove",{nContentsIndex:this.getContentIndex(),nContentsNextIndex:n})){return
}}if(this._oFlickingAnimation){this._oFlickingAnimation.refresh(n,bResize,bFireEvent)
}this._resetIndexInfo(n);
if(bFireEvent){this._fireCustomEvent("move")
}this._restoreAnchor();
this._setAnchorElement();
this._createDummyTag();
setTimeout(function(){self._focusFixedBug()
},100)
},_resetIndexInfo:function(n,el){this._htIndexInfo.nContentIndex=n;
this._htIndexInfo.nNextContentIndex=n;
if(typeof el==="undefined"){el=this.getElement()
}this._htIndexInfo.welElement=el;
this._htIndexInfo.welNextElement=el;
this._htIndexInfo.sDirection=null
},getIndexByElement:function(el){var bValue=-1;
for(var i=0,nLen=this._htWElement.aPanel.length;
i<nLen;
i++){if(this._htWElement.aPanel[i].$value()===el){bValue=i;
break
}}return bValue
},getElement:function(){var el=null;
if(!this.option("bUseCircular")){el=this._htWElement.aPanel[this.getContentIndex()]
}else{el=jindo.$Element(this._htIndexInfo.welElement)
}return el
},getContentElement:function(){return this.getElement()
},getContentIndex:function(){return this._htIndexInfo.nContentIndex
},getNextElement:function(){var n=this.getNextIndex();
if(this.option("bUseCircular")){n=this.getIndexByElement(this.getElement().$value());
n=((n+1)>2)?0:(n+1)
}return this._htWElement.aPanel[n]
},getPrevElement:function(){var n=this.getPrevIndex();
if(this.option("bUseCircular")){n=this.getIndexByElement(this.getElement().$value());
n=((n-1)<0)?2:(n-1)
}return this._htWElement.aPanel[n]
},getTotalContents:function(){var bValue=this._htWElement.aPanel.length;
if(this.option("bUseCircular")){if(typeof this.option("nTotalContents")==="undefined"){bValue=3
}else{bValue=this.option("nTotalContents")
}}return bValue
},getTotalPanels:function(){if(this.option("bUseCircular")){return 3
}else{return this.getTotalContents()
}},getPrevIndex:function(){var n=this.getContentIndex()-1;
if(this.option("bUseCircular")&&(n<0)){n=this.getTotalContents()-1
}n=Math.max(0,n);
return n
},getNextIndex:function(){var n=this.getContentIndex()+1;
var nMax=this.getTotalContents()-1;
if(this.option("bUseCircular")&&(n>nMax)){n=0
}n=Math.min(nMax,n);
return n
},moveNext:function(nDuration){if(!this.isActivating()){return
}if(this._doFlicking){return
}if(typeof nDuration==="undefined"){nDuration=this.option("nDuration")
}if(this._oFlickingAnimation){this._bTouchStart=true;
this._oFlickingAnimation.moveNext(nDuration)
}},movePrev:function(nDuration){if(!this.isActivating()){return
}if(this._doFlicking){return
}if(typeof nDuration==="undefined"){nDuration=this.option("nDuration")
}if(this._oFlickingAnimation){this._bTouchStart=true;
this._oFlickingAnimation.movePrev(nDuration)
}},_moveTo:function(nIndex,nDuration,bFireEvent,bFireFlickEvent){if(typeof nDuration==="undefined"){nDuration=this.option("nDuration")
}if(typeof bFireEvent==="undefined"){bFireEvent=true
}if(typeof bFireFlickEvent==="undefined"){bFireFlickEvent=false
}if(bFireEvent){if(!this._fireCustomEvent("beforeMove",{nContentsIndex:this.getContentIndex(),nContentsNextIndex:nIndex})){return
}}this._oFlickingAnimation.moveTo(nIndex,nDuration,bFireEvent,bFireFlickEvent)
},moveTo:function(nIndex,nDuration,bFireEvent){if((typeof nIndex==="undefined")||(nIndex==this.getContentIndex())){return
}if(nIndex<0||nIndex>=this.getTotalContents()){return
}this._moveTo(nIndex,nDuration,bFireEvent,false)
},isAnimating:function(){return this._doFlicking
},_setAnchorElement:function(el){if(this._bClickBug){this._aAnchor=jindo.$$("A",this._htWElement.container.$value())
}},_clearAnchor:function(){if(this._aAnchor&&!this._bBlocked){var aClickAddEvent=null;
for(var i=0,nILength=this._aAnchor.length;
i<nILength;
i++){if(this._fnDummyFnc!==this._aAnchor[i].onclick){this._aAnchor[i]._onclick=this._aAnchor[i].onclick
}this._aAnchor[i].onclick=this._fnDummyFnc;
aClickAddEvent=this._aAnchor[i].___listeners___||[];
for(var j=0,nJLength=aClickAddEvent.length;
j<nJLength;
j++){___Old__removeEventListener___.call(this._aAnchor[i],"click",aClickAddEvent[j].listener,aClickAddEvent[j].useCapture)
}}this._bBlocked=true
}},_restoreAnchor:function(){if(this._aAnchor&&this._bBlocked){var aClickAddEvent=null;
for(var i=0,nILength=this._aAnchor.length;
i<nILength;
i++){if(this._fnDummyFnc!==this._aAnchor[i]._onclick){this._aAnchor[i].onclick=this._aAnchor[i]._onclick
}else{this._aAnchor[i].onclick=null
}aClickAddEvent=this._aAnchor[i].___listeners___||[];
for(var j=0,nJLength=aClickAddEvent.length;
j<nJLength;
j++){___Old__addEventListener___.call(this._aAnchor[i],"click",aClickAddEvent[j].listener,aClickAddEvent[j].useCapture)
}}this._bBlocked=false
}},_onResize:function(evt){this._isFlicking=false;
if(this.option("bAutoResize")){var n=this.getIndexByElement(this.getElement().$value());
this.refresh(n,true,false)
}this.fireEvent("rotate",{isVertical:evt.isVertical})
},_onScroll:function(evt){if(this._doFlicking){var n=this.getIndexByElement(this.getElement().$value());
var self=this;
setTimeout(function(){if(self._doFlicking){var n=self._htIndexInfo.nNextContentIndex;
self._endAnimation(false);
self.refresh(n,true,false)
}},(this.option("nDuration")+20))
}},_onActivate:function(){this._attachEvent();
this._setAnchorElement();
if(this._oFlickingAnimation){if(typeof this._oFlickingAnimation._oCore!=="undefined"){this._oFlickingAnimation._oCore.activate()
}else{this._oTouch.activate()
}}else{this.setFlickingAnimation()
}var n=this.option("nDefaultIndex");
this.refresh(n,true,false)
},_onDeactivate:function(){this._detachEvent();
if(this._oFlickingAnimation){if(typeof this._oFlickingAnimation._oCore!=="undefined"){this._oFlickingAnimation._oCore.deactivate()
}}this._oTouch.deactivate()
},_attachEvent:function(){this._htEvent={};
this._htEvent.touchMove=jindo.$Fn(this._onMove,this).bind();
this._htEvent.touchEnd=jindo.$Fn(this._onEnd,this).bind();
this._htEvent.touchStart=jindo.$Fn(this._onStart,this).bind();
this._oTouch.attach("touchStart",this._htEvent.touchStart);
this._oTouch.attach("touchMove",this._htEvent.touchMove);
this._oTouch.attach("touchEnd",this._htEvent.touchEnd);
this._htEvent.rotate=jindo.$Fn(this._onResize,this).bind();
jindo.m.bindRotate(this._htEvent.rotate);
this._htEvent.pageshow=jindo.$Fn(this._onResize,this).bind();
jindo.m.bindPageshow(this._htEvent.pageshow);
if(this._isIos&&parseInt(this._nVersion,10)===6){this._htEvent.scroll={fn:jindo.$Fn(this._onScroll,this).bind(),el:window};
this._htEvent.scroll.ref=jindo.m._attachFakeJindo(this._htEvent.scroll.el,this._htEvent.scroll.fn,"scroll")
}},_detachEvent:function(){this._oTouch.detachAll();
jindo.m.unbindRotate(this._htEvent.rotate);
for(var p in this._htEvent){var htTargetEvent=this._htEvent[p];
if(typeof htTargetEvent.ref!=="undefined"){htTargetEvent.ref.detach(htTargetEvent.el,p)
}}this._htEvent=null
},destroy:function(){this.deactivate();
for(var p in this._htWElement){this._htWElement[p]=null
}this._htWElement=null;
this._oTouch=null;
this._oFlickingAnimation=null;
for(var p1 in this._htIndexInfo){this._htIndexInfo[p]=null
}this._isIos=null;
this._bAndroid=null;
this._nVersion=null;
this._fnDummyFnc=null;
this._doFlicking=null;
this._bClickBug=null;
this._b3dExecption=null;
this._bDummyTagException=null
}}).extend(jindo.m.UIComponent);
jindo.m.FlickingAnimation=jindo.$Class({$init:function(){this._WrapperInstacne=null;
this.bH=true;
this._elTransition=null;
this._sCssPrefix=jindo.m.getCssPrefix();
this._wfTransitionEnd=jindo.$Fn(this._onTransitionEnd,this).bind();
this._htOption={}
},setOption:function(htOption){for(var sKey in htOption){this._htOption[sKey]=htOption[sKey]
}this.bH=this._htOption.bHorizontal
},setWrapperElement:function(htWElement){this._htWElement={};
for(var p in htWElement){this._htWElement[p]=htWElement[p]
}},initAnimation:function(){this._initAnimation()
},onStart:function(){this._onStart()
},_onStart:function(){},moveTo:function(n,nTime,bFireEvent,bFireFlickEvent){this._moveTo(n,nTime,bFireEvent,bFireFlickEvent)
},_moveTo:function(n,nTime,bResize,bFireMoveEvent,bFireFlickEvent){},refresh:function(n,bResize){this._refresh(n,bResize)
},movePanel:function(nDistacne,nVector,nPos,nDuration,bEnd){this._movePanel(nDistacne,nVector,nPos,nDuration,bEnd)
},setInstance:function(oIns){this._WrapperInstacne=oIns
},endAnimation:function(bFireEvent){if(typeof bFireEvent==="undefined"){bFireEvent=true
}this._WrapperInstacne._endAnimation(bFireEvent)
},restorePosition:function(){},_onTransitionEnd:function(){},moveNext:function(){},movePrev:function(n){},_attachTransitionEnd:function(el,nTime){if(el===this._WrapperInstacne.getElement().$value()||el===this._htWElement.container.$value()){this._elTransition=el;
var self=this;
if(nTime===0){setTimeout(function(){self._onTransitionEnd()
},10)
}else{nTime+=10;
setTimeout(function(){self._onTransitionEnd()
},nTime)
}}},_detachTransitionEnd:function(){if(this._elTransition){jindo.m.detachTransitionEnd(this._elTransition,this._wfTransitionEnd)
}}});
jindo.m.CircularSlideFlicking=jindo.$Class({sAnimationName:"slide",$init:function(){this._isIos=jindo.m.getDeviceInfo().iphone||jindo.m.getDeviceInfo().ipad;
this._isAndroid=jindo.m.getDeviceInfo().android;
this._isChrome=this._isAndroid&&jindo.m.getDeviceInfo().bChrome;
this._nVersion=jindo.m.getDeviceInfo().version;
this._sTranslateStart="translate(";
this._sTranslateEnd=")";
this._bSetTopPos=false;
this._nLastDis=null;
this._b3dExecption=false
},_initAnimation:function(){this._bUseCss3d=this._htOption.bUseCss3d;
this._setElementStyle();
this._setElementSize();
this._setPanelPos();
this._prepareTransition()
},_setElementStyle:function(){this._htWElement.base.css("overflow","hidden");
this._htWElement.container.css("position","relative").css("width","100%");
if(this.bH){this._htWElement.container.css("clear","both")
}var bH=this.bH;
jindo.$A(this._htWElement.aPanel).forEach(function(value,index,array){var wel=value;
wel.css("position","absolute").css("width","100%").css("height","100%");
if(bH){wel.css("float","left")
}})
},_setPanelPos:function(){var el=this._htWElement.base.$value();
var nW=this.bH?el.clientWidth:el.clientHeight;
this._htPositionInfo={left:0,center:100,right:200};
this._htContainerInfo={left:nW*-1,center:0,right:nW};
this._nDefaultSize=nW
},_setElementSize:function(){if(this.bH){this._htWElement.container.height(this._htWElement.base.height())
}else{this._htWElement.container.height(this._htWElement.base.height())
}},_prepareTransition:function(){if(this._htOption.bUseCss3d){this._sTranslateStart="translate3d(";
this._sTranslateEnd=",0px)"
}var sTransfrom="all";
for(var i=0,nLen=this._htWElement.aPanel.length;
i<nLen;
i++){if(this._htOption.bUseTranslate){this._htWElement.aPanel[i].css(this._sCssPrefix+"Transform",this._sTranslateStart+"0px,0px"+this._sTranslateEnd)
}this._htWElement.aPanel[i].css(this._sCssPrefix+"TransitionProperty",sTransfrom)
}},_refresh:function(n,bResize,bFireEvent){var self=this;
var nCenter=(n%3);
var nPrev=(((nCenter-1)<0)?2:(nCenter-1))%3;
var nNext=(((nCenter+1)>2)?0:(nCenter+1))%3;
if(bResize){this._setElementSize();
this._setPanelPos()
}var sPosition=this.bH?"left":"top";
this._htWElement.container.css(this._sCssPrefix+"TransitionDuration","0ms");
if(this._b3dExecption){if((this._htOption.bUseTranslate||this._htOption.bUseCss3d)){var sValue="";
this._htWElement.container.css(this._sCssPrefix+"Transform",sValue)
}}this._htWElement.container.css(sPosition,"-100%");
if(this._htOption.bUseTranslate){if(this._b3dExecption){setTimeout(function(){self._htWElement.container.css(self._sCssPrefix+"Transform",self._sTranslateStart+"0,0px"+self._sTranslateEnd)
},50)
}else{this._htWElement.container.css(this._sCssPrefix+"Transform",this._sTranslateStart+"0,0px"+this._sTranslateEnd)
}}this._htWElement.aPanel[nCenter].css(sPosition,this._htPositionInfo.center+"%").css("zIndex",10);
this._htWElement.aPanel[nPrev].css(sPosition,this._htPositionInfo.left+"%").css("zIndex",1);
this._htWElement.aPanel[nNext].css(sPosition,this._htPositionInfo.right+"%").css("zIndex",1);
this._WrapperInstacne._htIndexInfo.welElement=this._htWElement.aPanel[nCenter]
},_movePanel:function(nDistance,nVector,nPos,nDuration,bEnd){var self=this;
var welCenter=this._WrapperInstacne.getElement();
var welPrev=this._WrapperInstacne.getPrevElement();
var welNext=this._WrapperInstacne.getNextElement();
var welWrapper=this._htWElement.container;
if(this._htOption.bSetNextPanelPos&&(Math.abs(nDistance)>5)){var nTop=welCenter.offset().top-window.scrollY;
if(nTop<0){this._bSetTopPos=true;
if(this._isIos){var sValue=this._sTranslateStart+"0,"+(nTop*-1)+"px"+this._sTranslateEnd;
welPrev.css(this._sCssPrefix+"Transform",sValue);
welNext.css(this._sCssPrefix+"Transform",sValue)
}else{welPrev.css("top",nTop*-1+"px");
welNext.css("top",nTop*-1+"px")
}}}if(!bEnd||(this._htOption.bUseTimingFunction)||(nDuration===0)){this._setPosition(welWrapper,nDistance,nVector,nPos,nDuration,bEnd)
}else{nDistance=this._nLastDis?this._nLastDis:nDistance;
var startTime=(new Date()).getTime(),nStartDis=nDistance,nBeforeDis=nDistance,nStartVector=nVector,nTotalDis=this.bH?this._htWElement.base.width():this._htWElement.base.height();
if(this._WrapperInstacne._htIndexInfo.sDirection===null){if(!this._htOption.bUseTranslate){nTotalDis=-100
}else{nTotalDis=0
}}if(nDistance<0){nTotalDis=nTotalDis*-1
}(function animate(){var now=(new Date()).getTime(),nEaseOut,nDis;
if(now>=startTime+nDuration){cancelAnimationFrame(self._nTimerAnimate);
delete self._nTimerAnimate;
self._setPosition(welWrapper,nTotalDis,(nDis-nBeforeDis),nPos,0,false);
setTimeout(function(){self._onTransitionEnd()
},100);
return
}now=(now-startTime)/nDuration-1;
nEaseOut=Math.sqrt(1-Math.pow(now,2));
nDis=(nTotalDis-nStartDis)*nEaseOut+nStartDis;
self._setPosition(welWrapper,nDis,(nDis-nBeforeDis),nPos,0,false);
nBeforeDis=nDis;
self._nTimerAnimate=requestAnimationFrame(animate)
})()
}},restorePosition:function(){var nTime=this._htOption.nBounceDuration;
this._movePanel(0,0,0,nTime,true)
},movePrev:function(nDuration){var n=this._htOption.nFlickThreshold;
this._WrapperInstacne._onEnd({nDistanceX:n+10,nDistanceY:n+10},nDuration)
},moveNext:function(nDuration){var n=this._htOption.nFlickThreshold*-1;
this._WrapperInstacne._onEnd({nDistanceX:n-10,nDistanceY:n-10},nDuration)
},_moveTo:function(n,nDruation,bFireEvent,bFireFlickEvent){this._WrapperInstacne.refresh(n,false,bFireEvent)
},_onTransitionEnd:function(){this._detachTransitionEnd();
var bFireEvent=true;
if(this._WrapperInstacne._htIndexInfo.sDirection===null){bFireEvent=false
}this._nLastDis=null;
this._restorePanel(this._WrapperInstacne._htIndexInfo.welNextElement.$value());
this.endAnimation(bFireEvent)
},_restorePanel:function(el){var self=this;
var sPosition=this.bH?"left":"top";
var nCenter=this._WrapperInstacne.getIndexByElement(el);
var nPrev=((nCenter-1)<0)?2:(nCenter-1);
var nNext=((nCenter+1)>2)?0:(nCenter+1);
if(this._b3dExecption){if((this._htOption.bUseTranslate||this._htOption.bUseCss3d)){var sValue="";
this._htWElement.container.css(this._sCssPrefix+"Transform",sValue)
}}this._htWElement.aPanel[nCenter].css(sPosition,this._htPositionInfo.center+"%");
this._htWElement.aPanel[nPrev].css(sPosition,this._htPositionInfo.left+"%");
this._htWElement.aPanel[nNext].css(sPosition,this._htPositionInfo.right+"%");
if(this._bSetTopPos){if(this._isIos){this._htWElement.aPanel[nCenter].css(this._sCssPrefix+"Transform",this._sTranslateStart+"0px,0px"+this._sTranslateEnd);
this._htWElement.aPanel[nPrev].css(this._sCssPrefix+"Transform",this._sTranslateStart+"0px,0px"+this._sTranslateEnd);
this._htWElement.aPanel[nNext].css(this._sCssPrefix+"Transform",this._sTranslateStart+"0px,0px"+this._sTranslateEnd)
}else{this._htWElement.aPanel[nCenter].css("top","");
this._htWElement.aPanel[nPrev].css("top","");
this._htWElement.aPanel[nNext].css("top","")
}this._bSetTopPos=false
}this._htWElement.container.css(this._sCssPrefix+"TransitionDuration","0ms");
if(this._htOption.bUseTranslate){if(this._b3dExecption){setTimeout(function(){self._htWElement.container.css(self._sCssPrefix+"Transform",self._sTranslateStart+"0,0px"+self._sTranslateEnd)
},100)
}else{this._htWElement.container.css(this._sCssPrefix+"Transform",this._sTranslateStart+"0,0px"+this._sTranslateEnd)
}}if(this._isIos){var welClonePrev=jindo.$Element(this._htWElement.aPanel[nPrev].$value().cloneNode(true));
var welCloneNext=jindo.$Element(this._htWElement.aPanel[nNext].$value().cloneNode(true));
this._htWElement.aPanel[nPrev].replace(welClonePrev);
this._htWElement.aPanel[nNext].replace(welCloneNext);
this._htWElement.aPanel[nPrev]=welClonePrev;
this._htWElement.aPanel[nNext]=welCloneNext;
this._WrapperInstacne._htWElement.aPanel[nPrev]=welClonePrev;
this._WrapperInstacne._htWElement.aPanel[nNext]=welCloneNext
}},_setPosition:function(wel,nDis,nVector,nPos,nDuration,bEnd){if(typeof nDuration==="undefined"){nDuration=0
}if(!this._htOption.bUseTranslate){this._setPositionForStyle(wel,nDis,nVector,nDuration,bEnd)
}else{this._setPositionTransform(wel,nDis,nDuration,bEnd)
}},_setPositionForStyle:function(wel,nDis,nVector,nDuration,bEnd){var sName=this.bH?"left":"top";
if(bEnd){if(this._WrapperInstacne._htIndexInfo.sDirection===null){nDis=-100
}else{if(nDis<0){nDis=-200
}else{nDis=0
}}}var n=((nDis/this._nDefaultSize)*100)-100;
var nPos=bEnd?nDis:n;
var htCss={};
htCss[this._sCssPrefix+"TransitionProperty"]="all";
htCss[this._sCssPrefix+"TransitionDuration"]=(nDuration===0)?"0":nDuration+"ms";
htCss[sName]=nPos+"%";
this._nLastDis=nDis;
if(bEnd){if(nPos===parseFloat(wel.css(sName).replace("px",""),10)){nDuration=0
}this._attachTransitionEnd(wel.$value(),nDuration)
}wel.css(htCss)
},_setPositionTransform:function(wel,nDis,nDuration,bEnd){if(bEnd){if(this._WrapperInstacne._htIndexInfo.sDirection===null){nDis=0
}else{if(nDis<0){nDis=this._htContainerInfo.left
}else{nDis=this._htContainerInfo.right
}}}var nX=this.bH?nDis:0;
var nY=this.bH?0:nDis;
var htCss={};
htCss[this._sCssPrefix+"TransitionProperty"]="all";
htCss[this._sCssPrefix+"TransitionDuration"]=(nDuration===0)?"0":nDuration+"ms";
htCss[this._sCssPrefix+"Transform"]=this._sTranslateStart+nX+"px,"+nY+"px"+this._sTranslateEnd;
this._nLastDis=nDis;
if(bEnd){var htCssOffset=jindo.m.getCssOffset(wel.$value());
if((htCssOffset.left===nX)&&(htCssOffset.top===nY)){nDuration=0
}this._attachTransitionEnd(wel.$value(),nDuration)
}wel.css(htCss)
}}).extend(jindo.m.FlickingAnimation);
jindo.m.DynamicScrollPlugin=jindo.$Class({$init:function(el,htUserOption){this.option({nRatio:1.5,sListElement:"li",sDirection:"V"});
this.option(htUserOption||{});
this._initVar(el)
},_initVar:function(el){this._wel=jindo.$Element(el);
this._aListElement=null;
this._nStartIdx=-1;
this._nEndIdx=-1;
this._nRatio=parseInt(this.option("nRatio"),10);
this._nPos=-1;
this._nSize=-1;
this._sDirection=this.option("sDirection")
},refresh:function(nPos){var aListElement=this._wel.queryAll(this.option("sListElement"));
if(!aListElement){return
}this._aListElement=[];
for(var i=0,nLength=aListElement.length;
i<nLength;
i++){wel=jindo.$Element(aListElement[i]);
this._aListElement.push({el:wel.$value(),wel:wel,htRange:this._getElementPos(wel),sDisplay:wel.css("display"),sPosition:wel.css("position")})
}this._nPos=nPos||0;
this._nSize=this._sDirection=="V"?this._wel.height():this._wel.width();
this._covertPositionType()
},_covertPositionType:function(){var nStartPos=this._getStartBoundary(),nEndPos=this._getEndBoundary();
for(var i=0,ht,nLength=this._aListElement.length;
i<nLength;
i++){ht=this._aListElement[i];
if(this._sDirection=="V"){ht.wel.css({top:ht.htRange.nStartPos+"px",width:"100%"})
}else{ht.wel.css({left:ht.htRange.nStartPos+"px",height:"100%"})
}ht.wel.css("position","absolute");
if(ht.htRange.nStartPos<=-nStartPos){this._nStartIdx=i
}else{if(ht.htRange.nEndPos<=-nEndPos){ht.el.style.display=ht.sDisplay;
this._nEndIdx=i
}else{ht.el.style.display="none"
}}}},updateListStatus:function(sDirection,nPos){if(!this._aListElement){return
}this._nPos=nPos;
var nStartPos=this._getStartBoundary(),nEndPos=this._getEndBoundary(),nLength=this._aListElement.length,ht,i,nWelPos;
if(sDirection=="forward"){for(i=this._nStartIdx+1;
i<nLength;
i++){ht=this._aListElement[i];
nWelPos=ht.htRange.nEndPos;
if(nWelPos<-nStartPos){ht.el.style.display="none";
this._nStartIdx=i
}else{break
}}for(i=this._nEndIdx;
i<nLength;
i++){ht=this._aListElement[i];
nWelPos=ht.htRange.nStartPos;
if(nWelPos<-nEndPos){ht.el.style.display=ht.sDisplay;
this._nEndIdx++
}else{break
}}}else{if(sDirection=="backward"){for(i=this._nEndIdx-1;
i>=0;
i--){ht=this._aListElement[i];
nWelPos=ht.htRange.nStartPos;
if(nWelPos<-nEndPos){break
}else{ht.el.style.display="none";
this._nEndIdx--
}}for(i=this._nStartIdx;
i>=0;
i--){ht=this._aListElement[i];
nWelPos=ht.htRange.nEndPos;
if(nWelPos<-nStartPos){break
}else{ht.el.style.display=ht.sDisplay;
this._nStartIdx--
}}}}},_getStartBoundary:function(){return this._nPos+(this._nSize*this._nRatio)
},_getEndBoundary:function(){return this._nPos-this._nSize-(this._nSize*this._nRatio)
},_getElementPos:function(wel){var nStartPos,nEndPos;
if(this._sDirection=="V"){nStartPos=wel.offset().top-this._wel.offset().top;
nEndPos=nStartPos+wel.height()
}else{nStartPos=wel.offset().left-this._wel.offset().left;
nEndPos=nStartPos+wel.width()
}return{nStartPos:nStartPos,nEndPos:nEndPos}
}}).extend(jindo.m.Component);
jindo.m.CoreScroll=jindo.$Class({$init:function(el,htUserOption){this.option({bActivateOnload:true,bUseHScroll:false,bUseVScroll:true,bUseMomentum:true,nDeceleration:0.0006,nOffsetTop:0,nOffsetBottom:0,nHeight:0,nWidth:0,bUseBounce:true,bUseHighlight:true,sClassPrefix:"scroll_",bUseCss3d:jindo.m._isUseCss3d(),bUseTimingFunction:jindo.m._isUseTimingFunction(),sListElement:"",nRatio:1.5,bUseTranslate:true});
this.option(htUserOption||{});
this._initVar();
this._setWrapperElement(el);
if(this.option("bActivateOnload")){this.activate()
}},_initVar:function(){var htDeviceInfo=jindo.m.getDeviceInfo();
this.isPositionBug=htDeviceInfo.android&&!htDeviceInfo.bChrome;
this.isIos=htDeviceInfo.ipad||htDeviceInfo.iphone;
this.isClickBug=jindo.m.hasClickBug();
this.nVersion=parseFloat(htDeviceInfo.version.substr(0,3));
this.sCssPrefix=jindo.m.getCssPrefix();
this.sTranOpen=null;
this.sTranEnd=null;
this.nWrapperW=null;
this.nWrapperH=null;
this.nScrollW=null;
this.nScrollH=null;
this.nMaxScrollLeft=null;
this.nMaxScrollTop=null;
this.nMinScrollTop=null;
this.bUseHScroll=null;
this.bUseVScroll=null;
this._nLeft=0;
this._nTop=0;
this.bUseHighlight=this.option("bUseHighlight");
this._aAni=[];
this._nAniTimer=-1;
this._nFixedPositionBugTimer=-1;
this._nTouchEndTimer=-1;
this._oTouch=null;
this._oDynamicScrollPlugin=null;
this._bUseDynamicScroll=false;
this._isAnimating=false;
this._isControling=false;
this._isStop=false;
if(this.option("sListElement")){this.option("bUseCss3d",false)
}this._setTrans();
if(this.bUseHighlight){if(this.isPositionBug){this._elDummyTag=null
}if(this.isClickBug){this._aAnchor=null;
this._fnDummyFnc=function(){return false
};
this._bBlocked=false
}}},_setTrans:function(){if(this.option("bUseCss3d")){this.sTranOpen="3d(";
this.sTranEnd=",0)"
}else{this.sTranOpen="(";
this.sTranEnd=")"
}},getCurrentPos:function(){return{nTop:this._nTop,nLeft:this._nLeft}
},setLayer:function(el){this._htWElement.wrapper=jindo.$Element(el);
this._htWElement.wrapper.css("overflow","hidden").css("zIndex","99999");
if(this._htWElement.wrapper.css("position")=="static"){this._htWElement.wrapper.css("position","relative")
}if(!this.bUseHighlight){this._htWElement.wrapper.css("-"+this.sCssPrefix+"-tap-highlight-color","rgba(0,0,0,0)")
}this.setScroller()
},setScroller:function(){this._htWElement.scroller=this._htWElement.wrapper.first();
this._htWElement.scroller.css({position:"absolute",left:0,top:0});
if(this.option("bUseTranslate")||this.option("bUseCss3d")){this._htWElement.scroller.css("-"+this.sCssPrefix+"-transition-property","-"+this.sCssPrefix+"-transform").css("-"+this.sCssPrefix+"-transform","translate"+this.sTranOpen+"0,0"+this.sTranEnd)
}if(this.option("bUseTimingFunction")){this._htWElement.scroller.css("-"+this.sCssPrefix+"-transition-timing-function","cubic-bezier(0.33,0.66,0.66,1)")
}if(this.isPositionBug&&this.bUseHighlight&&this.nVersion<3){this._elDummyTag=this._htWElement.scroller.query("._scroller_dummy_atag_");
if(!this._elDummyTag){this._elDummyTag=jindo.$("<a href='javascript:void(0);' style='position:absolute;height:0px;width:0px;' class='_scroller_dummy_atag_'></a>");
this._htWElement.scroller.append(this._elDummyTag)
}}},_setWrapperElement:function(el){this._htWElement={};
this.setLayer(el)
},refresh:function(bNoRepos){if(!this.isActivating()){return
}if(this.option("nWidth")){this._htWElement.wrapper.width(parseInt(this.option("nWidth"),10))
}if(this.option("nHeight")){this._htWElement.wrapper.height(parseInt(this.option("nHeight"),10))
}var nWidthLeft=parseInt(this._htWElement.wrapper.css("border-left-width"),10),nWidthRight=parseInt(this._htWElement.wrapper.css("border-right-width"),10),nHeightTop=parseInt(this._htWElement.wrapper.css("border-top-width"),10),nHeightBottom=parseInt(this._htWElement.wrapper.css("border-bottom-width"),10);
nWidthLeft=isNaN(nWidthLeft)?0:nWidthLeft;
nWidthRight=isNaN(nWidthRight)?0:nWidthRight;
nHeightTop=isNaN(nHeightTop)?0:nHeightTop;
nHeightBottom=isNaN(nHeightBottom)?0:nHeightBottom;
this.nWrapperW=this._htWElement.wrapper.width()-nWidthLeft-nWidthRight;
this.nWrapperH=this._htWElement.wrapper.height()-nHeightTop-nHeightBottom;
this.nScrollW=this._htWElement.scroller.width();
this.nScrollH=this._htWElement.scroller.height()-this.option("nOffsetBottom");
this.nMaxScrollLeft=this.nWrapperW-this.nScrollW;
this.nMaxScrollTop=this.nWrapperH-this.nScrollH;
this.nMinScrollTop=-this.option("nOffsetTop");
if(this.bUseHighlight&&this.isClickBug){this._aAnchor=jindo.$$("A",this._htWElement.scroller.$value())
}this.bUseHScroll=this.option("bUseHScroll")&&(this.nWrapperW<=this.nScrollW);
this.bUseVScroll=this.option("bUseVScroll")&&(this.nWrapperH<=this.nScrollH);
if(this.bUseHScroll&&!this.bUseVScroll){this._htWElement.scroller.$value().style.height="100%"
}if(!this.bUseHScroll&&this.bUseVScroll){this._htWElement.scroller.$value().style.width="100%"
}this._bUseDynamicScroll=false;
if(this.option("sListElement")&&!(this.bUseVScroll&&this.bUseHScroll)){var nRange=this.option("nRatio")*2;
if(this.bUseVScroll&&(this.nScrollH>(this.nWrapperH*nRange))){this._createDynamicScrollPlugin("V")
}else{if(this.bUseHScroll&&(this.nScrollW>(this.nWrapperW*nRange))){this._createDynamicScrollPlugin("H")
}}}if(!this.bUseHScroll&&!this.bUseVScroll){this._fixPositionBug()
}if(!bNoRepos){this.restorePos(0)
}},_createDynamicScrollPlugin:function(sDirection){if(!this._oDynamicScrollPlugin){this._oDynamicScrollPlugin=new jindo.m.DynamicScrollPlugin(this._htWElement.wrapper,{nRatio:this.option("nRatio"),sListElement:this.option("sListElement"),sDirection:sDirection})
}this._oDynamicScrollPlugin.refresh(sDirection=="V"?this._nTop:this._nLeft);
this.option("bUseTimingFunction",false);
this._bUseDynamicScroll=true
},_setPos:function(nLeft,nTop){var sDirection;
nLeft=this.bUseHScroll?nLeft:0;
nTop=this.bUseVScroll?nTop:0;
if(this._bUseDynamicScroll){sDirection=this._checkDirection(nLeft,nTop)
}if(this._fireEvent("beforePosition")){this._isControling=true;
this._nLeft=nLeft;
this._nTop=nTop;
if(this._bUseDynamicScroll){this._oDynamicScrollPlugin.updateListStatus(sDirection,this.bUseVScroll?this._nTop:this._nLeft)
}if(this.option("bUseTranslate")){if(this.bUseHighlight&&this.isPositionBug){var htStyleOffset=this.getStyleOffset(this._htWElement.scroller);
nLeft-=htStyleOffset.left;
nTop-=htStyleOffset.top
}this._htWElement.scroller.css("-"+this.sCssPrefix+"-transform","translate"+this.sTranOpen+nLeft+"px, "+nTop+"px"+this.sTranEnd)
}else{this._htWElement.scroller.css({left:nLeft+"px",top:nTop+"px"})
}this._fireEvent("position")
}},_checkDirection:function(nLeft,nTop){var nBeforePos=this.bUseVScroll?this._nTop:this._nLeft,nAfterPos=this.bUseVScroll?nTop:nLeft,sDirection;
if(nBeforePos>nAfterPos){sDirection="forward"
}else{sDirection="backward"
}return sDirection
},restorePos:function(nDuration){if(!this.bUseHScroll&&!this.bUseVScroll){return
}var nNewLeft=this.getPosLeft(this._nLeft),nNewTop=this.getPosTop(this._nTop);
if(nNewLeft===this._nLeft&&nNewTop===this._nTop){this._isControling=false;
this._fireEvent("afterScroll");
this._fixPositionBug();
return
}else{this.scrollTo(nNewLeft,nNewTop,nDuration)
}},_getMomentum:function(nDistance,nSpeed,nMomentum,nSize,nMaxDistUpper,nMaxDistLower){var nDeceleration=this.option("nDeceleration"),nNewDist=nMomentum/nDeceleration,nNewTime=0,nOutsideDist=0;
if(nDistance<0&&nNewDist>nMaxDistUpper){nOutsideDist=nSize/(6/(nNewDist/nSpeed*nDeceleration));
nMaxDistUpper=nMaxDistUpper+nOutsideDist;
nSpeed=nSpeed*nMaxDistUpper/nNewDist;
nNewDist=nMaxDistUpper
}else{if(nDistance>0&&nNewDist>nMaxDistLower){nOutsideDist=nSize/(6/(nNewDist/nSpeed*nDeceleration));
nMaxDistLower=nMaxDistLower+nOutsideDist;
nSpeed=nSpeed*nMaxDistLower/nNewDist;
nNewDist=nMaxDistLower
}}nNewDist=nNewDist*(nDistance>0?-1:1);
nNewTime=nSpeed/nDeceleration;
return{nDist:nNewDist,nTime:Math.round(nNewTime)}
},_stop:function(){if(this.option("bUseTimingFunction")){jindo.m.detachTransitionEnd(this._htWElement.scroller.$value(),this._htEvent.TransitionEnd)
}else{cancelAnimationFrame(this._nAniTimer)
}this._aAni=[];
this._isAnimating=false;
this._isStop=true
},scrollTo:function(nLeft,nTop,nDuration){this._stop();
nLeft=this.bUseHScroll?nLeft:0;
nTop=this.bUseVScroll?nTop:0;
this._aAni.push({nLeft:nLeft,nTop:nTop,nDuration:nDuration||0});
this._animate()
},isMoving:function(){return this._isControling
},_animate:function(){var self=this,oStep;
if(this._isAnimating){return
}if(!this._aAni.length){this.restorePos(300);
return
}do{oStep=this._aAni.shift();
if(!oStep){return
}}while(oStep.nLeft==this._nLeft&&oStep.nTop==this._nTop);
if(oStep.nDuration==0){if(this.option("bUseTimingFunction")){this._transitionTime(0)
}this._setPos(oStep.nLeft,oStep.nTop);
this._animate()
}else{this._isAnimating=true;
if(this.option("bUseTimingFunction")){this._transitionTime(oStep.nDuration);
this._setPos(oStep.nLeft,oStep.nTop);
this._isAnimating=false;
jindo.m.attachTransitionEnd(this._htWElement.scroller.$value(),this._htEvent.TransitionEnd)
}else{var startTime=(new Date()).getTime(),nStartLeft=this._nLeft,nStartTop=this._nTop;
(function animate(){var now=(new Date()).getTime(),nEaseOut;
if(now>=startTime+oStep.nDuration){self._setPos(oStep.nLeft,oStep.nTop);
self._isAnimating=false;
self._animate();
return
}now=(now-startTime)/oStep.nDuration-1;
nEaseOut=Math.sqrt(1-Math.pow(now,2));
self._setPos((oStep.nLeft-nStartLeft)*nEaseOut+nStartLeft,(oStep.nTop-nStartTop)*nEaseOut+nStartTop);
if(self._isAnimating){self._nAniTimer=requestAnimationFrame(animate)
}})()
}}},_transitionTime:function(nDuration){nDuration+="ms";
this._htWElement.scroller.css("-"+this.sCssPrefix+"-transition-duration",nDuration);
this._fireEventSetDuration(nDuration)
},_clearAnchor:function(){if(this.isClickBug&&this._aAnchor&&!this._bBlocked){var aClickAddEvent=null;
for(var i=0,nILength=this._aAnchor.length;
i<nILength;
i++){if(!this._aAnchor[i].___isClear___){if(this._fnDummyFnc!==this._aAnchor[i].onclick){this._aAnchor[i]._onclick=this._aAnchor[i].onclick
}this._aAnchor[i].onclick=this._fnDummyFnc;
this._aAnchor[i].___isClear___=true;
aClickAddEvent=this._aAnchor[i].___listeners___||[];
for(var j=0,nJLength=aClickAddEvent.length;
j<nJLength;
j++){___Old__removeEventListener___.call(this._aAnchor[i],"click",aClickAddEvent[j].listener,aClickAddEvent[j].useCapture)
}}}this._bBlocked=true
}},_restoreAnchor:function(){if(this.isClickBug&&this._aAnchor&&this._bBlocked){var aClickAddEvent=null;
for(var i=0,nILength=this._aAnchor.length;
i<nILength;
i++){if(this._aAnchor[i].___isClear___){if(this._fnDummyFnc!==this._aAnchor[i]._onclick){this._aAnchor[i].onclick=this._aAnchor[i]._onclick
}else{this._aAnchor[i].onclick=null
}this._aAnchor[i].___isClear___=null;
aClickAddEvent=this._aAnchor[i].___listeners___||[];
for(var j=0,nJLength=aClickAddEvent.length;
j<nJLength;
j++){___Old__addEventListener___.call(this._aAnchor[i],"click",aClickAddEvent[j].listener,aClickAddEvent[j].useCapture)
}}}this._bBlocked=false
}},_stopScroll:function(){var htCssOffset=jindo.m.getCssOffset(this._htWElement.scroller.$value()),htStyleOffset={left:0,top:0},nTop,nLeft;
if(this.isPositionBug&&this.bUseHighlight||!this.option("bUseTranslate")){htStyleOffset=this.getStyleOffset(this._htWElement.scroller)
}nLeft=htCssOffset.left+htStyleOffset.left;
nTop=htCssOffset.top+htStyleOffset.top;
if(nLeft!==parseInt(this._nLeft,10)||nTop!==parseInt(this._nTop,10)){this._stop();
this._setPos(this.getPosLeft(nLeft),this.getPosTop(nTop));
this._isControling=false;
this._fireEvent("afterScroll");
this._fixPositionBug()
}},getStyleOffset:function(wel){var nLeft=parseInt(wel.css("left"),10),nTop=parseInt(wel.css("top"),10);
nLeft=isNaN(nLeft)?0:nLeft;
nTop=isNaN(nTop)?0:nTop;
return{left:nLeft,top:nTop}
},getPosLeft:function(nPos){return(nPos>=0?0:(nPos<=this.nMaxScrollLeft?this.nMaxScrollLeft:nPos))
},getPosTop:function(nPos){return(nPos>=this.nMinScrollTop?this.nMinScrollTop:(nPos<=this.nMaxScrollTop?this.nMaxScrollTop:nPos))
},_fireEventSetDuration:function(nDuration){this.fireEvent("setDuration",{nDuration:nDuration,bUseHScroll:this.bUseHScroll,bUseVScroll:this.bUseVScroll})
},_fireEventbeforeScroll:function(htParam){return this.fireEvent("beforeScroll",htParam)
},_fireEventScroll:function(htParam){this.fireEvent("scroll",htParam)
},_fireEvent:function(sType){return this.fireEvent(sType,{nLeft:this._nLeft,nTop:this._nTop,nMaxScrollLeft:this.nMaxScrollLeft,nMaxScrollTop:this.nMaxScrollTop})
},_fireTouchEvent:function(sType,we){return this.fireEvent(sType,{nLeft:this._nLeft,nTop:this._nTop,nMaxScrollLeft:this.nMaxScrollLeft,nMaxScrollTop:this.nMaxScrollTop,oEvent:we})
},_onStart:function(we){this._clearPositionBug();
if(this._fireTouchEvent("beforeTouchStart",we)){this._clearAnchor();
this._isAnimating=false;
this._isControling=true;
this._isStop=false;
if(this.option("bUseTimingFunction")){this._transitionTime(0)
}this._stopScroll();
if(!this._fireTouchEvent("touchStart",we)){we.stop()
}}else{we.stop()
}},_onMove:function(we){this._clearTouchEnd();
var weParent=we.oEvent;
if(we.sMoveType===jindo.m.MOVETYPE[0]){if(this.bUseHScroll){if(!this.option("bUseBounce")&&((this._nLeft>=0&&we.nVectorX>0)||(this._nLeft<=this.nMaxScrollLeft&&we.nVectorX<0))){this._forceRestore(we);
return
}else{weParent.stop(jindo.$Event.CANCEL_ALL)
}}else{return true
}}else{if(we.sMoveType===jindo.m.MOVETYPE[1]){if(this.bUseVScroll){if(!this.option("bUseBounce")&&((this._nTop>=this.nMinScrollTop&&we.nVectorY>0)||(this._nTop<=this.nMaxScrollTop&&we.nVectorY<0))){this._forceRestore(we);
return
}else{weParent.stop(jindo.$Event.CANCEL_ALL)
}}else{return true
}}else{if(we.sMoveType===jindo.m.MOVETYPE[2]){weParent.stop(jindo.$Event.CANCEL_ALL)
}else{weParent.stop(jindo.$Event.CANCEL_ALL);
return true
}}}if(this._fireTouchEvent("beforeTouchMove",we)){var nNewLeft,nNewTop;
this._clearPositionBug();
if(this.option("bUseBounce")){nNewLeft=this._nLeft+(this._nLeft>=0||this._nLeft<=this.nMaxScrollLeft?we.nVectorX/2:we.nVectorX);
nNewTop=this._nTop+(this._nTop>=this.nMinScrollTop||this._nTop<=this.nMaxScrollTop?we.nVectorY/2:we.nVectorY);
var self=this;
this._nTouchEndTimer=setTimeout(function(){self._forceRestore(we)
},500)
}else{nNewLeft=this.getPosLeft(this._nLeft+we.nVectorX);
nNewTop=this.getPosTop(this._nTop+we.nVectorY)
}this._setPos(nNewLeft,nNewTop);
if(!this._fireTouchEvent("touchMove",we)){we.stop()
}}else{we.stop()
}},_onEnd:function(we){if(this._fireTouchEvent("beforeTouchEnd",we)){this._clearPositionBug();
this._clearTouchEnd();
if(we.sMoveType===jindo.m.MOVETYPE[0]||we.sMoveType===jindo.m.MOVETYPE[1]||we.sMoveType===jindo.m.MOVETYPE[2]){this._endForScroll(we);
if(this.isClickBug||this.nVersion<4.1){we.oEvent.stop(jindo.$Event.CANCEL_DEFAULT)
}}else{this._isControling=false;
if(!this._isStop){if(this.bUseHighlight){this._restoreAnchor()
}}}if(!this._fireTouchEvent("touchEnd",we)){we.stop()
}}else{we.stop()
}},_forceRestore:function(we){we.nMomentumX=we.nMomentumY=null;
this._endForScroll(we);
this._clearPositionBug();
this._clearTouchEnd()
},_endForScroll:function(we){clearTimeout(this._nFixedDubbleEndBugTimer);
var htMomentumX={nDist:0,nTime:0},htMomentumY={nDist:0,nTime:0},htParam={nMomentumX:we.nMomentumX,nMomentumY:we.nMomentumY,nDistanceX:we.nDistanceX,nDistanceY:we.nDistanceY,nLeft:this._nLeft,nTop:this._nTop};
if(this.option("bUseMomentum")&&(we.nMomentumX||we.nMomentumY)){if(this.bUseHScroll){htMomentumX=this._getMomentum(-we.nDistanceX,we.nSpeedX,we.nMomentumX,this.nWrapperW,-this._nLeft,-this.nMaxScrollLeft+this._nLeft)
}if(this.bUseVScroll){htMomentumY=this._getMomentum(-we.nDistanceY,we.nSpeedY,we.nMomentumY,this.nWrapperH,-this._nTop,-this.nMaxScrollTop+this._nTop)
}htParam.nNextLeft=this._nLeft+htMomentumX.nDist;
htParam.nNextTop=this._nTop+htMomentumY.nDist;
htParam.nTime=Math.max(Math.max(htMomentumX.nTime,htMomentumY.nTime),10);
if(this._fireEventbeforeScroll(htParam)){if(this.option("bUseBounce")){this.scrollTo(htParam.nNextLeft,htParam.nNextTop,htParam.nTime)
}else{this.scrollTo(this.getPosLeft(htParam.nNextLeft),this.getPosTop(htParam.nNextTop),htParam.nTime)
}this._fireEventScroll(htParam)
}}else{htParam.nNextLeft=this._nLeft;
htParam.nNextTop=this._nTop;
htParam.nTime=0;
if(this._fireEventbeforeScroll(htParam)){if(this._nLeft!==htParam.nNextLeft||this._nTop!==htParam.nNextTop){this.scrollTo(htParam.nNextLeft,htParam.nNextTop,htParam.nTime)
}else{this.restorePos(300)
}this._fireEventScroll(htParam)
}}},_onTransitionEnd:function(we){jindo.m.detachTransitionEnd(this._htWElement.scroller.$value(),this._htEvent.TransitionEnd);
this._animate()
},_onDocumentStart:function(we){if(this._htWElement.wrapper.visible()){if(this._htWElement.wrapper.isChildOf(we.element)){return true
}else{this._stopScroll()
}}},_onActivate:function(){if(!this._oTouch){this._oTouch=new jindo.m.Touch(this._htWElement.wrapper.$value(),{nMoveThreshold:0,nMomentumDuration:(jindo.m.getDeviceInfo().android?500:200),nTapThreshold:1,nSlopeThreshold:5,nEndEventThreshold:(jindo.m.getDeviceInfo().win8?100:0)})
}else{this._oTouch.activate()
}this._attachEvent();
this.refresh()
},_onDeactivate:function(){this._detachEvent();
this._oTouch.deactivate()
},_attachEvent:function(){this._htEvent={};
this._htEvent.touchStart=jindo.$Fn(this._onStart,this).bind();
this._htEvent.touchMove=jindo.$Fn(this._onMove,this).bind();
this._htEvent.touchEnd=jindo.$Fn(this._onEnd,this).bind();
this._htEvent.TransitionEnd=jindo.$Fn(this._onTransitionEnd,this).bind();
this._htEvent.document=jindo.$Fn(this._onDocumentStart,this).attach(document,"touchstart");
this._oTouch.attach({touchStart:this._htEvent.touchStart,touchMove:this._htEvent.touchMove,touchEnd:this._htEvent.touchEnd})
},_fixPositionBug:function(){if(this.isPositionBug&&this.bUseHighlight&&this.option("bUseTranslate")){var self=this;
this._clearPositionBug();
this._nFixedPositionBugTimer=setTimeout(function(){if(self._htWElement&&self._htWElement.scroller){self.makeStylePos(self._htWElement.scroller);
if(self.nVersion<3){self._elDummyTag.focus()
}}},200)
}},makeStylePos:function(wel){var ele=wel.$value();
var htCssOffset=jindo.m.getCssOffset(ele);
var htScrollOffset=wel.offset();
if(this.nVersion>=4){ele.style["-"+this.sCssPrefix+"-transform"]="translate"+this.sTranOpen+"0px, 0px"+this.sTranEnd
}else{ele.style["-"+this.sCssPrefix+"-transform"]=null
}ele.style["-"+this.sCssPrefix+"-transition-duration"]=null;
wel.offset(htCssOffset.top+htScrollOffset.top,htCssOffset.left+htScrollOffset.left)
},_clearPositionBug:function(){if(this.isPositionBug&&this.bUseHighlight){clearTimeout(this._nFixedPositionBugTimer);
this._nFixedPositionBugTimer=-1
}},_clearTouchEnd:function(){clearTimeout(this._nTouchEndTimer);
this._nTouchEndTimer=-1
},_detachEvent:function(){jindo.m.detachTransitionEnd(this._htWElement.scroller.$value(),this._htEvent.TransitionEnd);
this._htEvent.document.detach(document,"touchstart");
this._oTouch.detachAll();
if(this._elDummyTag){this._htWElement.scroller.remove(this._elDummyTag)
}},destroy:function(){this.deactivate();
for(var p in this._htWElement){this._htWElement[p]=null
}this._htWElement=null;
this._oTouch.destroy();
delete this._oTouch
}}).extend(jindo.m.UIComponent);
jindo.m.SlideFlicking=jindo.$Class({sAnimationName:"slide",$init:function(){this._bFlickEvent=false;
this._bMoveEvent=false;
this._htDefaultOption={bUseHighlight:true}
},_initCoreScroll:function(){this._oCore=new jindo.m.CoreScroll(this._htWElement.base.$value(),{bUseHScroll:this.bH,bUseVScroll:!this.bH,bUseMomentum:false,bUseCss3d:this._htOption.bUseCss3d,bUseTimingFunction:this._htOption.bUseTimingFunction,bUseTranslate:this._htOption.bUseTranslate,bUseHighlight:this._htOption.bUseHighlight});
this._oCore.attach({beforeScroll:jindo.$Fn(this._onBeforeScrollEnd,this).bind(),afterScroll:jindo.$Fn(this._onScrollEnd,this).bind(),beforeTouchStart:jindo.$Fn(this._onBeforeTouchStart,this).bind(),beforeTouchMove:jindo.$Fn(this._onBeforeTouchMove,this).bind(),beforeTouchEnd:jindo.$Fn(this._onBeforeTouchMove,this).bind()})
},_initAnimation:function(){this._initOption();
this._setElementStyle();
this._setElementSize();
this._updateSizeInfo();
this._initCoreScroll()
},_initOption:function(){for(var p in this._htDefaultOption){if(typeof this._htOption[p]==="undefined"){this._htOption[p]=this._htDefaultOption[p]
}}},_updateSizeInfo:function(){var sLen=this.bH?"width":"height";
var sOff=this.bH?"left":"top";
this._htPosition=[];
var nPos=0;
var nBeforePos=0;
for(var i=0,nLen=this._htWElement.aPanel.length;
i<nLen;
i++){if(i!=0){if(this._htOption.nFlickDistanceOffset===null){nPos+=this._htWElement.aPanel[i-1][sLen]()*-1
}else{var nW=this._htWElement.aPanel[i-1][sLen]()*-1;
nPos=nBeforePos+nW+(this._htOption.nFlickDistanceOffset*-1);
nBeforePos+=nW
}}this._htPosition.push(nPos)
}},_setElementSize:function(){var nLen=this._htWElement.aPanel.length;
var nW=this._htWElement.base.width();
var nH=this._htWElement.base.height();
var nMaxSize=0;
if(this._htOption.bAutoSize){if(this.bH){nMaxSize=nW*nLen;
this._htWElement.container.width(nMaxSize).height(this._htWElement.base.height());
jindo.$A(this._htWElement.aPanel).forEach(function(value){value.width(nW)
})
}else{jindo.$A(this._htWElement.aPanel).forEach(function(value){value.height(nH)
});
nMaxSize=nH*nLen;
this._htWElement.container.css("height",nMaxSize+"px").width(nW)
}}},_setElementStyle:function(){this._htWElement.base.css("overflow","hidden");
if(this.bH){this._htWElement.container.css("clear","both")
}var bH=this.bH;
jindo.$A(this._htWElement.aPanel).forEach(function(value,index,array){var wel=value;
if(bH){wel.css("float","left")
}})
},_onBeforeTouchStart:function(oCustomEvt){var htParam={element:oCustomEvt.oEvent.element,nX:oCustomEvt.oEvent.nX,nY:oCustomEvt.oEvent.nY,oEvent:oCustomEvt.oEvent.oEvent};
if(!this._WrapperInstacne._fireCustomEvent("touchStart",htParam)){oCustomEvt.stop();
return
}},_onBeforeTouchMove:function(oCustomEvt){var sType=(oCustomEvt.sType.indexOf("End")>-1)?"touchEnd":"touchMove";
var htParam={};
for(var p in oCustomEvt.oEvent){if(typeof oCustomEvt.oEvent[p]!=="object"&&typeof oCustomEvt.oEvent[p]!=="function"){htParam[p]=oCustomEvt.oEvent[p]
}}htParam.sType=sType;
this._WrapperInstacne._fireCustomEvent(sType,htParam)
},_onBeforeScrollEnd:function(oCustomEvt){var nOrignalTime=oCustomEvt.nTime;
var htPos=this._getSnap(oCustomEvt.nLeft,oCustomEvt.nTop,oCustomEvt.nDistanceX,oCustomEvt.nDistanceY,oCustomEvt.nMomentumX,oCustomEvt.nMomentumY);
oCustomEvt.nNextLeft=htPos.nX;
oCustomEvt.nNextTop=htPos.nY;
oCustomEvt.nTime=htPos.nTime;
var htParam={nContentsIndex:this._WrapperInstacne.getContentIndex(),nContentsNextIndex:htPos.nIndex};
if(this.bH){htParam.bLeft=htPos.nFlickLeft
}else{htParam.bTop=htPos.nFlickLeft
}if(!this._WrapperInstacne._fireCustomEvent("beforeFlicking",htParam)){oCustomEvt.stop();
return
}this._bFlickEvent=true;
this._WrapperInstacne._bAnimation=true;
this._WrapperInstacne._bFlickLeft=htPos.nFlickLeft;
this._WrapperInstacne._htIndexInfo.nNextContentIndex=htPos.nIndex
},_onScrollEnd:function(){var nBeforeContent=this._WrapperInstacne._htIndexInfo.nContentIndex;
if((this._WrapperInstacne._htIndexInfo.nContentIndex!==this._WrapperInstacne._htIndexInfo.nNextContentIndex)&&(this._bFlickEvent||this._bMoveEvent)){this._WrapperInstacne._htIndexInfo.nContentIndex=this._WrapperInstacne._htIndexInfo.nNextContentIndex;
var htParam={nContentsIndex:this._WrapperInstacne.getContentIndex()};
if(this.bH){htParam.bLeft=this._WrapperInstacne._bFlickLeft
}else{htParam.bTop=this._WrapperInstacne._bFlickLeft
}var sEvent=this._bFlickEvent?"afterFlicking":"move";
this._WrapperInstacne.fireEvent(sEvent,htParam)
}this._bFlickEvent=false;
this._bMoveEvent=false;
this._WrapperInstacne._bFlickLeft=null;
this._WrapperInstacne._bAnimation=false
},_getSnap:function(nX,nY,nDisX,nDisY,nMomX,nMomY){var nPosX=nPosY=nNewPos=0;
var nIndex=this._htWElement.aPanel.length-1;
var nCurrent=this.bH?nX:nY;
var nDis=this.bH?nDisX:nDisY;
var nMom=this.bH?nMomX:nMomY;
var bFlickLeft=false;
for(var i=0,nLen=this._htPosition.length;
i<nLen;
i++){if(nCurrent>=(this._htPosition[i])){nIndex=i;
break
}}if(nIndex==this._WrapperInstacne.getContentIndex()&&nIndex>0&&nDis>0){nIndex--
}if((Math.abs(nDis)<=this._htOption.nFlickThreshold)){nIndex=this._WrapperInstacne.getContentIndex()
}nNewPos=this._htPosition[nIndex];
var nTime=this._htOption.nDuration;
if(nDis<0){bFlickLeft=true
}return{nX:this.bH?nNewPos:nPosX,nY:this.bH?nPosY:nNewPos,nTime:Math.round(nTime),nIndex:nIndex,nFlickLeft:bFlickLeft}
},_getPosition:function(nIndex){var nPosX=nPosY=0;
if(typeof nIndex=="undefined"){nIndex=this.getContentIndex()
}nIndex=Math.max(0,nIndex);
nIndex=Math.min(this._htPosition.length-1,nIndex);
return{nX:this.bH?this._htPosition[nIndex]:nPosX,nY:this.bH?nPosY:this._htPosition[nIndex]}
},_refresh:function(n,bResize,bFireEvent){if(bResize){this._setElementSize();
this._updateSizeInfo();
if(this._oCore){this._oCore.refresh(true)
}}this._moveTo(n,0,bFireEvent,false)
},_moveTo:function(n,nDruation,bFireEvent,bFireFlickEvent){var htPos=this._getPosition(n);
this._WrapperInstacne._htIndexInfo.nNextContentIndex=n;
var nCurrent=this._WrapperInstacne.getContentIndex();
if(nCurrent<n){this._WrapperInstacne._bFlickLeft=true
}else{this._WrapperInstacne._bFlickLeft=false
}this._bMoveEvent=bFireEvent;
this._bFlickEvent=bFireFlickEvent;
this._oCore.scrollTo(htPos.nX,htPos.nY,nDruation)
},moveNext:function(nDuration){var n=this._WrapperInstacne.getNextIndex();
if(!this._WrapperInstacne._fireCustomEvent("beforeFlicking",{nContentsIndex:this._WrapperInstacne.getContentIndex(),nContentsNextIndex:n})){return
}this._moveTo(n,nDuration,false,true)
},movePrev:function(nDuration){var n=this._WrapperInstacne.getPrevIndex();
if(!this._WrapperInstacne._fireCustomEvent("beforeFlicking",{nContentsIndex:this._WrapperInstacne.getContentIndex(),nContentsNextIndex:n})){return
}this._moveTo(n,nDuration,false,true)
}}).extend(jindo.m.FlickingAnimation);
jindo.m.Calendar=jindo.$Class({$init:function(el,htOption){var oDate=new Date();
this.option({bActivateOnload:true,sClassPrefix:"calendar-",bUseEffect:false,nEffectDuration:200,sTitleFormat:"yyyy.mm",aMonthTitle:["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"],htToday:{nYear:oDate.getFullYear(),nMonth:oDate.getMonth()+1,nDate:oDate.getDate()}});
this.option(htOption||{});
this._initVar();
this._setWrapperElement(el);
if(this.option("bActivateOnload")){this.activate()
}},_initVar:function(){this._bVisible=false;
this._oToday=this.option("htToday");
this._oViewDate=null;
this._nSelectDate=-1;
this._sClassPrefix=this.option("sClassPrefix");
this._aDayInfo=[];
if(this.option("bUseEffect")){this._oTransition=new jindo.m.Transition()
}},_setWrapperElement:function(el){this._htWElement={};
this._htWElement.calendarBase=jindo.$Element(el);
this._htWElement.calendarBase.css({position:"absolute",display:"none"});
aTh=this._htWElement.calendarBase.queryAll("th");
for(var i=0,nLength=aTh.length;
i<nLength;
i++){this._aDayInfo.push(jindo.$Element(aTh[i]).text())
}this._htWElement.calendarTitle=jindo.$Element(this._htWElement.calendarBase.query("."+this._sClassPrefix+"title"));
this._htWElement.calendarTable=jindo.$Element(this._htWElement.calendarBase.query("table"));
this._htWElement.calendarTbody=jindo.$Element(this._htWElement.calendarTable.query("tbody"));
this._htWElement.yearPreBtn=jindo.$Element(this._htWElement.calendarBase.query("."+this._sClassPrefix+"btn-prev-year"));
this._htWElement.preBtn=jindo.$Element(this._htWElement.calendarBase.query("."+this._sClassPrefix+"btn-prev-mon"));
this._htWElement.yearNextBtn=jindo.$Element(this._htWElement.calendarBase.query("."+this._sClassPrefix+"btn-next-year"));
this._htWElement.nextBtn=jindo.$Element(this._htWElement.calendarBase.query("."+this._sClassPrefix+"btn-next-mon"));
this._htWElement.closeBtn=jindo.$Element(this._htWElement.calendarBase.query("."+this._sClassPrefix+"btn-close"))
},getCalendarBase:function(){return this._htWElement.calendarBase
},_onActivate:function(){this._attachEvent()
},_onDeactivate:function(){this._detachEvent()
},_attachEvent:function(){this._htEvent={};
if(this._htWElement.yearPreBtn){this._htEvent.pre_year_click={el:this._htWElement.yearPreBtn,ref:jindo.$Fn(this._onYearPre,this).attach(this._htWElement.yearPreBtn,"click")}
}if(this._htWElement.preBtn){this._htEvent.pre_click={el:this._htWElement.preBtn,ref:jindo.$Fn(this._onPre,this).attach(this._htWElement.preBtn,"click")}
}if(this._htWElement.yearNextBtn){this._htEvent.next_year_click={el:this._htWElement.yearNextBtn,ref:jindo.$Fn(this._onYearNext,this).attach(this._htWElement.yearNextBtn,"click")}
}if(this._htWElement.nextBtn){this._htEvent.next_click={el:this._htWElement.nextBtn,ref:jindo.$Fn(this._onNext,this).attach(this._htWElement.nextBtn,"click")}
}if(this._htWElement.closeBtn){this._htEvent.close_click={el:this._htWElement.closeBtn,ref:jindo.$Fn(this._onClose,this).attach(this._htWElement.closeBtn,"click")}
}this._htEvent.table_click={el:this._htWElement.calendarTable,ref:jindo.$Fn(this._onDate,this).attach(this._htWElement.calendarTable,"click")}
},_onPre:function(we){this._moveDate("pre");
we.stop()
},_onYearPre:function(we){this._moveDate("preYear");
we.stop()
},_onNext:function(we){this._moveDate("next");
we.stop()
},_onYearNext:function(we){this._moveDate("nextYear");
we.stop()
},_onClose:function(we){this.hide();
we.stop()
},_onDate:function(we){if(!this._bVisible){return
}var wel=jindo.$Element(we.element),sCellDate="";
if(wel.$value().tagName!="td"){wel=wel.parent(function(v){return(v.$value().tagName.toLowerCase()=="td")
})[0]
}if(wel){sCellDate=wel.attr("data-cal-date");
if(sCellDate&&sCellDate.length==8){this._nSelectDate=sCellDate*1;
if(this.fireEvent("selectDate",{oSelectDate:this.getSelectDate()})){wel.addClass(this._sClassPrefix+"selected");
this.hide()
}}}we.stopDefault();
return false
},_moveDate:function(sMode){if(!this._bVisible){return
}var oOldDate={nYear:this._oViewDate.nYear,nMonth:this._oViewDate.nMonth,nDate:this._oViewDate.nDate},oMoveDate={nDate:this._oViewDate.nDate};
switch(sMode){case"pre":oMoveDate.nYear=(oOldDate.nMonth==1)?oOldDate.nYear-1:oOldDate.nYear;
oMoveDate.nMonth=(oOldDate.nMonth==1)?12:oOldDate.nMonth-1;
break;
case"preYear":oMoveDate.nYear=oOldDate.nYear-1;
oMoveDate.nMonth=oOldDate.nMonth;
break;
case"next":oMoveDate.nYear=(oOldDate.nMonth==12)?oOldDate.nYear+1:oOldDate.nYear;
oMoveDate.nMonth=(oOldDate.nMonth==12)?1:oOldDate.nMonth+1;
break;
case"nextYear":oMoveDate.nYear=oOldDate.nYear+1;
oMoveDate.nMonth=oOldDate.nMonth;
break
}if(this.fireEvent("beforeMoveDate",{oOldDate:oOldDate,oMoveDate:oMoveDate})){this._drawCalendar(oMoveDate);
this.fireEvent("moveDate",{oOldDate:oOldDate,oMoveDate:oMoveDate})
}},_detachEvent:function(){for(var p in this._htEvent){var ht=this._htEvent[p];
ht.ref.detach(ht.el,p.substring(p.lastIndexOf("_")+1))
}this._htEvent=null
},show:function(oDrawDate,oSelectedDate){if(!oDrawDate){oDrawDate=this._oToday
}if(this.fireEvent("beforeShowCalendar",{oDrawDate:oDrawDate})){this._nSelectDate=this._getDateNumber(oSelectedDate);
if(this._getDateNumber(oDrawDate,"YearMonth")!=(this._oViewDate)?this._getDateNumber(this._oViewDate,"YearMonth"):0){this._drawCalendar(oDrawDate)
}else{this._drawDayColor()
}var self=this;
this._htWElement.calendarBase.show();
if(this.option("bUseEffect")){this._htWElement.calendarBase.opacity(0);
this._oTransition.queue(this._htWElement.calendarBase.$value(),this.option("nEffectDuration"),{htStyle:{opacity:1},fCallback:function(){self._afterShow(oDrawDate)
}});
setTimeout(function(){self._oTransition.start()
},10)
}else{this._afterShow(oDrawDate)
}}},_afterShow:function(oSelectDate){this._htWElement.calendarBase.css("zIndex","1000");
this._bVisible=true;
this.fireEvent("showCalendar",{oDrawDate:oSelectDate})
},hide:function(){var oSelectDate=this.getSelectDate();
if(this.fireEvent("beforeHideCalendar",{oSelectDate:oSelectDate})){this._bVisible=false;
if(this.option("bUseEffect")){var self=this;
this._oTransition.queue(this._htWElement.calendarBase.$value(),this.option("nEffectDuration"),{htStyle:{opacity:0},fCallback:function(){self._afterHide(oSelectDate)
}});
self._oTransition.start()
}else{this._afterHide(oSelectDate)
}}},_afterHide:function(oSelectDate){this._htWElement.calendarBase.css("zIndex","0").hide();
this.fireEvent("hideCalendar",{oSelectDate:oSelectDate})
},isVisible:function(){return this._bVisible
},getSelectDate:function(){var sSelectDate,oSelectDate;
if(this._nSelectDate&&this._nSelectDate>0){sSelectDate=this._nSelectDate+"";
oSelectDate={nYear:Number(sSelectDate.substr(0,4)),nMonth:Number(sSelectDate.substr(4,2)),nDate:Number(sSelectDate.substr(6,4))}
}return oSelectDate
},_drawCalendar:function(oDrawDate){this._oViewDate={nYear:oDrawDate.nYear,nMonth:oDrawDate.nMonth,nDate:oDrawDate.nDate};
this._drawCalendarHeaderHtml();
this._drawCalendarBodyHtml();
this._drawDayColor()
},_drawDayColor:function(){var nTodayDate=this._getDateNumber(this._oToday),nSelectDate=this._nSelectDate,aCells=this._htWElement.calendarTbody.queryAll("td");
for(var i=0,nLength=aCells.length,welCell;
i<nLength;
i++){welCell=jindo.$Element(aCells[i]);
if(!welCell.hasClass(this._sClassPrefix+"prev-mon")&&!welCell.hasClass(this._sClassPrefix+"next-mon")){var nDate=welCell.attr("data-cal-date")*1;
welCell[nTodayDate===nDate?"addClass":"removeClass"](this._sClassPrefix+"today");
welCell[(nSelectDate>-1&&nSelectDate===nDate)?"addClass":"removeClass"](this._sClassPrefix+"selected");
if(nTodayDate==nSelectDate){welCell.removeClass(this._sClassPrefix+"today")
}}}},_drawCalendarHeaderHtml:function(){var nYear=this._oViewDate.nYear,nMonth=this._oViewDate.nMonth;
if(nMonth<10){nMonth=("0"+(nMonth*1)).toString()
}if(this._htWElement.calendarTitle){this._htWElement.calendarTitle.text(this.option("sTitleFormat").replace(/yyyy/g,nYear).replace(/y/g,(nYear).toString().substr(2,2)).replace(/mm/g,nMonth).replace(/m/g,(nMonth*1)).replace(/M/g,this.option("aMonthTitle")[nMonth-1]))
}},_drawCalendarBodyHtml:function(){var aHTML=[],oDate,nFirstTime,nLastTime,bPaintLastDay=false,nNowTime,aClassName,nNowDate,nDay;
oDate=new Date(this._oViewDate.nYear,this._oViewDate.nMonth,0);
nLastTime=oDate.getTime();
oDate=new Date(this._oViewDate.nYear,this._oViewDate.nMonth-1,1);
nFirstTime=oDate.getTime();
while(oDate.getDay()!==0){oDate.setDate(oDate.getDate()-1)
}while(!bPaintLastDay){aHTML.push("<tr>");
for(var i=0;
i<7;
i++){nNowTime=oDate.getTime();
aClassName=[];
nNowDate="";
nDay=oDate.getDay();
bPrevMonth=false;
bNextMonth=false;
if(nNowTime<nFirstTime){aClassName.push(this._sClassPrefix+"prev-mon");
bPrevMonth=true
}if(nLastTime<nNowTime){aClassName.push(this._sClassPrefix+"next-mon");
bNextMonth=true
}if(nDay===0){aClassName.push(this._sClassPrefix+"sun")
}if(nDay===6){aClassName.push(this._sClassPrefix+"sat")
}nNowDate=oDate.getFullYear()*10000+(oDate.getMonth()+1)*100+oDate.getDate();
aHTML.push('<td class="'+aClassName.join(" ")+'" data-cal-date="'+nNowDate+'"><a href="javascript:void(0)" class="'+this._sClassPrefix+'date">'+oDate.getDate()+"</a></td>");
oDate.setDate(oDate.getDate()+1);
if(nLastTime===nNowTime){bPaintLastDay=true
}}aHTML.push("</tr>")
}this._htWElement.calendarTbody.html(aHTML.join(""))
},isBetween:function(htDate,htFrom,htTo){if(this.getDateObject(htDate).getTime()>this.getDateObject(htTo).getTime()||this.getDateObject(htDate).getTime()<this.getDateObject(htFrom).getTime()){return false
}else{return true
}},getDayName:function(nIdx){return this._aDayInfo[nIdx]
},getDateObject:function(htDate){if(arguments.length==3){return new Date(arguments[0],arguments[1]-1,arguments[2])
}return new Date(htDate.nYear,htDate.nMonth-1,htDate.nDate)
},_getDateNumber:function(htDate,sType){var nDate;
if(sType==="YearMonth"){nDate=(htDate)?(htDate.nYear*10000+htDate.nMonth*100):-1
}else{nDate=(htDate)?(htDate.nYear*10000+htDate.nMonth*100+htDate.nDate):-1
}return nDate
},destroy:function(){this.deactivate();
this._bVisible=false;
this._oToday=null;
this._oViewDate=null;
this._nSelectDate=-1;
this._sClassPrefix=null;
if(this.option("bUseEffect")){this._oTransition.destroy();
this._oTransition=null
}this._aDayInfo=null
}}).extend(jindo.m.UIComponent);
jindo.m.CircularFlicking=jindo.$Class({$init:function(sId,htUserOption){this.option({bHorizontal:true,sClassPrefix:"flick-",nFlickThreshold:40,nDuration:100,nTotalContents:3,nBounceDuration:100,bActivateOnload:true,bSetNextPanelPos:false,bUseCss3d:jindo.m._isUseCss3d(true),bUseTimingFunction:jindo.m._isUseTimingFunction(),bUseTranslate:true,bUseDiagonalTouch:true});
this.option(htUserOption||{});
this._initVar();
this._setWrapperElement(sId);
this._initFlicking();
if(this.option("bActivateOnload")){this.activate()
}},_initVar:function(){this._oFlicking=null
},_initFlicking:function(){var htOption=this.option();
htOption.sContentClass="panel";
htOption.sAnimation="slide";
htOption.bUseCircular=true;
htOption.bActivateOnload=false;
this._oFlicking=new jindo.m.Flicking(this._htWElement.base.$value(),htOption).attach({touchStart:jindo.$Fn(this._onTouchStart,this).bind(),touchMove:jindo.$Fn(this._onTouchMove,this).bind(),touchEnd:jindo.$Fn(this._onTouchEnd,this).bind(),beforeMove:jindo.$Fn(this._onBeforeMove,this).bind(),move:jindo.$Fn(this._onMove,this).bind(),rotate:jindo.$Fn(this._onRotate,this).bind(),scroll:jindo.$Fn(this._onScroll,this).bind(),beforeFlicking:jindo.$Fn(this._onBeforeFlicking,this).bind(),afterFlicking:jindo.$Fn(this._onAfterFlicking,this).bind()})
},_setWrapperElement:function(el){this._htWElement={};
el=jindo.$(el);
var sClass="."+this.option("sClassPrefix");
this._htWElement.base=jindo.$Element(el).css("zIndex","99999");
this._htWElement.container=jindo.$Element(jindo.$$.getSingle(sClass+"container",el));
var aPanel=jindo.$$(sClass+"panel",el);
this._htWElement.aPanel=jindo.$A(aPanel).forEach(function(value,index,array){var wel=jindo.$Element(value);
array[index]=wel
}).$value()
},getPanelIndex:function(){return this._oFlicking.getIndexByElement(this.getPanelElement().$value())
},getPanelElement:function(){return this._oFlicking.getElement()
},getRightPanelIndex:function(){return this._oFlicking.getIndexByElement(this.getRightPanelElement().$value())
},getRightPanelElement:function(){return this._oFlicking.getNextElement()
},getLeftPanelIndex:function(){return this._oFlicking.getIndexByElement(this.getLeftPanelElement().$value())
},getLeftPanelElement:function(){return this._oFlicking.getPrevElement()
},getContentIndex:function(){return this._oFlicking.getContentIndex()
},getRightContentIndex:function(){return this._oFlicking.getNextIndex()
},getLeftContentIndex:function(){return this._oFlicking.getPrevIndex()
},_onTouchStart:function(oCustomEvt){var bRet=this.fireEvent("touchStart",oCustomEvt);
if(!bRet){oCustomEvt.stop();
return
}},_onTouchMove:function(oCustomEvt){this.fireEvent("touchMove",oCustomEvt)
},_onTouchEnd:function(oCustomEvt){this.fireEvent("touchEnd",oCustomEvt)
},_onBeforeMove:function(oCustomEvt){var nPanelIndex=oCustomEvt.nContentsNextIndex%3;
if(!this.fireEvent("beforeMove",{nPanelIndex:this.getPanelIndex(),nContentIndex:oCustomEvt.nContentsIndex,nNextPanelIndex:nPanelIndex,nNextContentIndex:oCustomEvt.nContentsNextIndex})){oCustomEvt.stop()
}},_onMove:function(oCustomEvt){this.fireEvent("move",{nPanelIndex:this.getPanelIndex(),nPanelLeftIndex:this.getLeftPanelIndex(),nPanelRightIndex:this.getRightPanelIndex(),nContentIndex:this.getContentIndex(),nContentLeftIndex:this.getLeftContentIndex(),nContentRightIndex:this.getRightContentIndex()})
},_onRotate:function(evt){this.fireEvent("rotate",evt)
},_onScroll:function(){this.fireEvent("scroll")
},_onBeforeFlicking:function(oCustomEvent){var htParam={nContentIndex:oCustomEvent.nContentsIndex,nNextContentIndex:oCustomEvent.nContentsNextIndex,nPanelIndex:this.getPanelIndex(),nNextPanelIndex:this.getLeftPanelIndex()};
if(oCustomEvent.bTop){htParam.bTop=oCustomEvent.bTop
}if(oCustomEvent.bLeft){htParam.bLeft=oCustomEvent.bLeft
}if(htParam.bTop||htParam.bLeft){htParam.nNextPanelIndex=this.getRightPanelIndex()
}if(!this.fireEvent("beforeFlicking",htParam)){oCustomEvent.stop()
}},_onAfterFlicking:function(oCustomEvent){var htParam={nPanelIndex:this.getPanelIndex(),nPanelLeftIndex:this.getLeftPanelIndex(),nPanelRightIndex:this.getRightPanelIndex(),nContentIndex:this.getContentIndex(),nContentLeftIndex:this.getLeftContentIndex(),nContentRightIndex:this.getRightContentIndex()};
if(oCustomEvent.bTop){htParam.bTop=oCustomEvent.bTop
}if(oCustomEvent.bLeft){htParam.bLeft=oCustomEvent.bLeft
}this._htWElement.aPanel=this._oFlicking._htWElement.aPanel;
this.fireEvent("afterFlicking",htParam)
},moveNext:function(nDuration){if(!this.isActivating()){return
}this._oFlicking.moveNext()
},movePrev:function(nDuration){if(!this.isActivating()){return
}this._oFlicking.movePrev()
},refresh:function(n,bResize,bFireEvent){var self=this;
if(!this.isActivating()){return
}if(typeof bResize==="undefined"){bResize=false
}if(typeof bFireEvent==="undefined"){bFireEvent=false
}this._oFlicking.refresh(n,bResize,bFireEvent)
},setContentIndex:function(n,bRefresh){if(!this.isActivating()){return
}n=parseInt(n,10);
if(n<0||n>(this.option("nTotalContents")-1)){return
}if(typeof bRefresh==="undefined"){bRefresh=true
}this.refresh(n,bRefresh,true)
},_onActivate:function(){this._oFlicking.activate()
},_onDeactivate:function(){this._oFlicking.deactivate()
},destroy:function(){this.deactivate();
this._oFlicking=null;
for(var p in this._htWElement){this._htWElement[p]=null
}}}).extend(jindo.m.UIComponent);
jindo.m.CorePagination=jindo.$Class({_nCurrentPage:1,$init:function(htOption){this.option({nItem:10,nItemPerPage:10,nPage:1,bActivateOnload:true});
this.option(htOption||{});
this._nCurrentPage=this.option("nPage")
},getItemCount:function(){return this.option("nItem")
},getItemPerPage:function(){return this.option("nItemPerPage")
},getCurrentPage:function(){return this._nCurrentPage
},setItemCount:function(n){this.option("nItem",n)
},setItemPerPage:function(n){this.option("nItemPerPage",n)
},movePageTo:function(n){var nBefore=this._nCurrentPage;
var nPage=this._convertToAvailPage(n);
if(nPage!=this._nCurrentPage){this._nCurrentPage=nPage
}},nextPageTo:function(){var nPage=this._nCurrentPage+1;
this.movePageTo(nPage)
},previousPageTo:function(){var nPage=this._nCurrentPage-1;
this.movePageTo(nPage)
},hasNextPage:function(){var nPage=this.getCurrentPage(),totalPage=this.getTotalPages();
return nPage&&(nPage<totalPage)
},hasPreviousPage:function(){return(this.getCurrentPage()>1)
},getTotalPages:function(){var nTotal=this.option("nItem"),nCount=this.option("nItemPerPage");
if(!nCount){return null
}return Math.ceil(nTotal/nCount)
},getPageItemIndex:function(nPage){nPage=this._convertToAvailPage(nPage);
var nTotal=this.option("nItem"),nCount=this.option("nItemPerPage"),start,end;
if(!nPage||!nCount){return null
}start=(nPage-1)*nCount;
end=Math.min(start+nCount,nTotal)-1;
return{nStart:start,nEnd:end}
},getPageOfItem:function(n){return Math.ceil(n/this.getItemPerPage())
},_convertToAvailPage:function(nPage){var nLastPage=this.getTotalPages();
nPage=Math.max(nPage,1);
nPage=Math.min(nPage,nLastPage);
return nPage
}}).extend(jindo.m.UIComponent);
jindo.m.MoreContentButton=jindo.$Class({$init:function(el,htOption){this.option({sClassPrefix:"more_",nTotalItem:10,nShowMaxItem:10,nItemPerPage:10,nPage:1,bActivateOnload:true,htAjax:{}});
this.option(htOption||{});
this.option("nItem",this.option("nShowMaxItem"));
this._initVar();
this._setWrapperElement(el);
if(this.option("bActivateOnload")){this.activate();
this._nCurrentPage=this.option("nPage");
this.updateInfo()
}},_initVar:function(){var _htDefalutAjax={sApi:null,htAjaxOption:{type:"xhr"},htQuery:{},sStart:"start",sDisplay:"display"};
var htAjax=this.option("htAjax");
if(!htAjax){this.option("htAjax",_htDefalutAjax);
return
}for(var p in _htDefalutAjax){if(typeof htAjax[p]=="undefined"){htAjax[p]=_htDefalutAjax[p]
}}for(p in _htDefalutAjax.htAjaxOption){if(typeof htAjax.htAjaxOption[p]=="undefined"){htAjax.htAjaxOption[p]=_htDefalutAjax.htAjaxOption[p]
}}for(p in _htDefalutAjax.htQuery){if(typeof htAjax.htQuery[p]=="undefined"){htAjax.htQuery[p]=_htDefalutAjax.htQuery[p]
}}if(!!htAjax.sApi){this.oAjax=new jindo.$Ajax(htAjax.sApi,htAjax.htAjaxOption)
}},_setWrapperElement:function(el){this._htWElement={};
var sClass="."+this.option("sClassPrefix");
this._htWElement.elBase=jindo.$Element(el);
this._htWElement.elMoreButton=jindo.$Element(this._htWElement.elBase.query(sClass+"button"));
this._htWElement.elTop=jindo.$Element(this._htWElement.elBase.query(sClass+"top"));
this._htWElement.elLoading=jindo.$Element(this._htWElement.elBase.query(sClass+"loading"));
this._htWElement.elMoreCnt=jindo.$Element(this._htWElement.elBase.query(sClass+"moreCnt"));
this._htWElement.elTotal=jindo.$Element(this._htWElement.elBase.query(sClass+"total"));
this._htWElement.elCurrent=jindo.$Element(this._htWElement.elBase.query(sClass+"current"));
this._htWElement.elRemainder=jindo.$Element(this._htWElement.elBase.query(sClass+"remainder"));
this._htWElement.elLast=jindo.$Element(this._htWElement.elBase.query(sClass+"last"));
if(!!this._htWElement.elLast){this._htWElement.elLastTotal=jindo.$Element(this._htWElement.elLast.query(sClass+"total"));
this._htWElement.elLastCurrent=jindo.$Element(this._htWElement.elLast.query(sClass+"current"));
this._htWElement.elLastRemainder=jindo.$Element(this._htWElement.elLast.query(sClass+"remainder"))
}},_onClickMore:function(oEvent){oEvent.stop(jindo.$Event.CANCEL_DEFAULT);
if(this.hasNextPage()){this.more()
}},_onClickTop:function(oEvent){oEvent.stop(jindo.$Event.CANCEL_DEFAULT);
this.fireEvent("goTop",{element:oEvent.element})
},more:function(bFireEvent){if(typeof bFireEvent=="undefined"){bFireEvent=true
}var nPage=this._nCurrentPage+1;
var nBeforePage=this.getCurrentPage();
if(bFireEvent){if(!this.fireEvent("beforeMore",{nPage:nPage,nCurrentPage:nBeforePage})){return
}}var htIndex=this.getPageItemIndex(nPage);
if(!htIndex){this.updateInfo();
return
}this.showLoadingImg();
if(!!this.option("htAjax").sApi){this._callAjax(nPage,true,bFireEvent)
}else{this._move(nPage);
if(bFireEvent){this.fireEvent("more",{nPage:nPage,nStartIndex:htIndex.nStart,nEndIndex:htIndex.nEnd})
}this.updateInfo()
}},movePageTo:function(nPage,bFireEvent){if(typeof bFireEvent=="undefined"){bFireEvent=true
}var nBeforePage=this.getCurrentPage();
if(bFireEvent){if(!this.fireEvent("beforeMovePage",{nPage:nPage,nCurrentPage:nBeforePage})){return
}}var htIndex=this.getPageItemIndex(nPage);
if(!htIndex){this.updateInfo();
return
}this.showLoadingImg();
if(!!this.option("htAjax").sApi){this._callAjax(nPage,false,bFireEvent)
}else{this._move(nPage);
if(bFireEvent){this.fireEvent("movePage",{nPage:nPage,nBeforePage:nBeforePage,nStartIndex:0,nEndIndex:htIndex.nEnd})
}this.updateInfo()
}},_move:function(nPage){var n=this._convertToAvailPage(nPage);
if(n!=this._nCurrentPage){this._nCurrentPage=n
}},updateInfo:function(){var nPage=this.getCurrentPage(),htIndex=this.getPageItemIndex(nPage);
this.hideLoadingImg();
if(nPage>=this.getTotalPages()){if(this._htWElement.elBase){this._htWElement.elBase.addClass("u_pg_end")
}if(this._htWElement.elMoreButton){this._htWElement.elMoreButton.hide()
}if(this._htWElement.elLast){this._htWElement.elLast.show("block")
}}else{if(this._htWElement.elBase){this._htWElement.elBase.removeClass("u_pg_end")
}if(this._htWElement.elMoreButton){this._htWElement.elMoreButton.show("block")
}if(this._htWElement.elLast){this._htWElement.elLast.hide()
}}if(!!this._htWElement.elCurrent&&!!htIndex){var sText=htIndex.nEnd+1;
this._htWElement.elCurrent.text(this._setNumberFormat(sText))
}if(typeof this._htWElement.elLastCurrent!="undefined"&&this._htWElement.elLastCurrent&&!!htIndex){this._htWElement.elLastCurrent.text(this._setNumberFormat(htIndex.nEnd+1))
}if(!!this._htWElement.elRemainder&&!!htIndex){this._htWElement.elRemainder.text(this._setNumberFormat(parseInt(this.option("nTotalItem"),10)-(htIndex.nEnd+1)))
}if(!!this._htWElement.elLastRemainder&&!!htIndex){this._htWElement.elLastRemainder.text(this._setNumberFormat(parseInt(this.option("nTotalItem"),10)-(htIndex.nEnd+1)))
}if(!!this._htWElement.elTotal){this._htWElement.elTotal.text(this._setNumberFormat(this.option("nTotalItem")))
}if(typeof this._htWElement.elLastTotal!="undefined"&&this._htWElement.elLastTotal){this._htWElement.elLastTotal.text(this._setNumberFormat(this.option("nTotalItem")))
}if(!!this._htWElement.elMoreCnt&&!!htIndex){var nCnt=Math.min(this.getItemPerPage(),this.getItemCount()-htIndex.nEnd-1);
this._htWElement.elMoreCnt.text(this._setNumberFormat(nCnt))
}},_callAjax:function(nPage,bMore,bFireEvent){var self=this;
this.oAjax.option("onload",null);
this.oAjax.option("onload",function(res){self._onAjaxResponse(res,nPage,bMore,bFireEvent)
});
this.oAjax.request(this._getQueryString(nPage,bMore))
},_onAjaxResponse:function(oResponse,nPage,bMore,bFireEvent){if(bFireEvent){this._move(nPage);
var sEvent=bMore?"more":"movePage";
var htIndex=this.getPageItemIndex(nPage);
this.fireEvent(sEvent,{oResponse:oResponse,nPage:nPage,nStartIndex:bMore?htIndex.nStart:0,nEndIndex:htIndex.nEnd})
}this.updateInfo()
},_getQueryString:function(nPage,bMore){if(typeof bMore==="undefined"){bMore=true
}var htQuery=this.option("htAjax").htQuery||{};
var htIndex=this.getPageItemIndex(nPage);
htQuery[this.option("htAjax").sStart]=bMore?htIndex.nStart:0;
htQuery[this.option("htAjax").sDisplay]=Math.min(this.getItemPerPage(),(this.getShowMaxItem()-htIndex.nStart));
return htQuery
},_setNumberFormat:function(sText){sText=sText.toString();
var sReturn="";
var nDot=0;
var nLastPosition=sText.length;
for(var i=nLastPosition;
i>=0;
i--){var sChar=sText.charAt(i);
if(i>nLastPosition){sReturn=sChar+sReturn;
continue
}if(/[0-9]/.test(sChar)){if(nDot>=3){sReturn=","+sReturn;
nDot=0
}nDot++;
sReturn=sChar+sReturn
}}return sReturn
},showLoadingImg:function(){if(!!this._htWElement.elLoading){this._htWElement.elLoading.show()
}},hideLoadingImg:function(){if(!!this._htWElement.elLoading){this._htWElement.elLoading.hide()
}},reset:function(nShowMaxItem){if(typeof nShowMaxItem=="undefined"){nShowMaxItem=this.option("nShowMaxItem")
}this.setShowMaxItem(nShowMaxItem);
this.movePageTo(1,false)
},getTotalItem:function(){return this.option("nTotalItem")
},setTotalItem:function(n){this.option("nTotalItem",n)
},getShowMaxItem:function(){return this.option("nShowMaxItem")
},setShowMaxItem:function(n){this.option("nShowMaxItem",n);
this.option("nItem",n)
},_onActivate:function(){this._attachEvent()
},_onDeactivate:function(){this._detachEvent()
},_attachEvent:function(){this._htEvent={};
if(!!this._htWElement.elMoreButton){this._htEvent.click_More={ref:jindo.$Fn(this._onClickMore,this).attach(this._htWElement.elMoreButton,"click"),el:this._htWElement.elMoreButton.$value()}
}if(!!this._htWElement.elTop){this._htEvent.click_Top={ref:jindo.$Fn(this._onClickTop,this).attach(this._htWElement.elTop,"click"),el:this._htWElement.elTop.$value()}
}},_detachEvent:function(){for(var p in this._htEvent){var htTargetEvent=this._htEvent[p];
htTargetEvent.ref.detach(htTargetEvent.el,p.substring(0,p.indexOf("_")))
}this._htEvent=null
},header:function(vName,vValue){if(this.oAjax){return this.oAjax.header(vName,vValue)
}},destroy:function(){this._detachEvent();
for(var p in this._htWElement){this._htWElement[p]=null
}this._htWElement=null
}}).extend(jindo.m.CorePagination);
jindo.m.Scroll=jindo.$Class({$init:function(el,htUserOption){this.option({bActivateOnload:true,bUseScrollbar:true,bUseFixedScrollbar:false,sScrollbarBorder:"1px solid white",sScrollbarColor:"#8e8e8e",bUsePullDown:false,bUsePullUp:false,sClassPrefix:"scroll_",bUseVScroll:true,bUseHScroll:false,bUseBounce:true,fnPullDownIdle:null,fnPullDownBeforeUpdate:null,fnPullDownUpdating:null,fnPullUpIdle:null,fnPullUpBeforeUpdate:null,fnPullUpUpdating:null,nOffsetTop:0,nOffsetBottom:0,bAutoResize:false,nScrollbarHideThreshold:0,bUseScrollBarRadius:true});
this.option(htUserOption||{});
this._initVar();
this._setWrapperElement(el);
this._InitPullUpdateFunc();
if(this.option("bActivateOnload")){this.activate()
}},_initVar:function(){this._oCore=null;
this._isPullDown=false;
this._isPullUp=false;
this._isUpdating=false;
this._nOrgMaxScrollTop=null;
this._nPropHScroll=0;
this._nPropVScroll=0;
this._htWElement={}
},_setWrapperElement:function(el){this._htWElement.wrapper=jindo.$Element(el);
this._htWElement.pullDown=jindo.$Element(this._htWElement.wrapper.query("."+this.option("sClassPrefix")+"pullDown"));
this._htWElement.pullUp=jindo.$Element(this._htWElement.wrapper.query("."+this.option("sClassPrefix")+"pullUp"))
},_InitPullUpdateFunc:function(){if(this.option("bUsePullDown")===true){if(!this.option("fnPullDownIdle")){this.option("fnPullDownIdle",function(wel){wel.html("업데이트하시려면 아래로 내려주세요")
})
}if(!this.option("fnPullDownBeforeUpdate")){this.option("fnPullDownBeforeUpdate",function(wel){wel.html("업데이트 합니다")
})
}if(!this.option("fnPullDownUpdating")){this.option("fnPullDownUpdating",function(wel){wel.html("업데이트 중입니다...")
})
}}if(this.option("bUsePullUp")===true){if(!this.option("fnPullUpIdle")){this.option("fnPullUpIdle",function(wel){wel.html("더 보시려면 위로 올려주세요")
})
}if(!this.option("fnPullUpBeforeUpdate")){this.option("fnPullUpBeforeUpdate",function(wel){wel.html("로드 합니다")
})
}if(!this.option("fnPullUpUpdating")){this.option("fnPullUpUpdating",function(wel){wel.html("로드 중...")
})
}}},_onActivate:function(){if(this._oCore){this._oCore.activate()
}this.refresh();
this._attachEvent()
},setUsePullDown:function(bUse){this.option("bUsePullDown",bUse);
this._refreshPullStatus()
},setUsePullUp:function(bUse){this.option("bUsePullUp",bUse);
this._refreshPullStatus()
},width:function(nValue){if(nValue){this.option("nWidth",nValue);
this.refresh()
}else{if(this.option("nWidth")){return parseInt(this.option("nWidth"),10)
}else{return this._htWElement.wrapper.width()
}}},height:function(nValue){if(nValue){this.option("nHeight",nValue);
this.refresh()
}else{if(this.option("nHeight")){return parseInt(this.option("nHeight"),10)
}else{return this._htWElement.wrapper.height()
}}},_refreshPullStatus:function(){this._isUpdating=false;
this._nOrgMaxScrollTop=null;
this._isPullDown=this.option("bUsePullDown")&&this.option("bUseVScroll")&&!this.option("bUseHScroll")&&this.option("bUseBounce")&&(this._htWElement.pullDown!==null);
this._isPullUp=this.option("bUsePullUp")&&this.option("bUseVScroll")&&!this.option("bUseHScroll")&&this.option("bUseBounce")&&(this._htWElement.pullUp!==null);
if(this._isPullDown&&this.option("fnPullDownIdle")){this._htWElement.pullDown._isReady_=false;
this._htWElement.pullDown.show();
this.option("fnPullDownIdle")(this._htWElement.pullDown)
}if(this._isPullUp&&this.option("fnPullUpIdle")){this._htWElement.pullUp._isReady_=false;
this._htWElement.pullUp.show();
this.option("fnPullUpIdle")(this._htWElement.pullUp)
}},refresh:function(){if(!this.isActivating()){return
}this._refreshPullStatus();
if(this._oCore){this._oCore.option({nOffsetTop:(this._isPullDown?this._htWElement.pullDown.height():0)-this.option("nOffsetTop"),nOffsetBottom:(this._isPullUp?this._htWElement.pullUp.height():0)-this.option("nOffsetBottom"),nWidth:this.option("nWidth"),nHeight:this.option("nHeight")});
this._oCore.refresh()
}else{var htOption=this.option();
var htCloneOption={};
for(var p in htOption){htCloneOption[p]=htOption[p]
}htCloneOption.bActivateOnload=true;
htCloneOption.nOffsetTop=(this._isPullDown?this._htWElement.pullDown.height():0)-this.option("nOffsetTop");
htCloneOption.nOffsetBottom=(this._isPullUp?this._htWElement.pullUp.height():0)-this.option("nOffsetBottom");
this._oCore=new jindo.m.CoreScroll(this._htWElement.wrapper,htCloneOption)
}if(this.option("bUseScrollbar")){this._refreshScroll("V");
this._refreshScroll("H")
}if(!this.hasVScroll()){if(this._htWElement.pullDown!==null){this._htWElement.pullDown.hide()
}if(this._htWElement.pullUp!==null){this._htWElement.pullUp.hide()
}}},scrollTo:function(nLeft,nTop,nDuration){nDuration=nDuration||0;
nLeft=-Math.abs(nLeft);
nTop=-Math.abs(nTop);
nTop+=this.getTop();
this._oCore.scrollTo((nLeft>=this.getLeft()?this.getLeft():(nLeft<=this.getRight()?this.getRight():nLeft)),(nTop>=this.getTop()?this.getTop():(nTop<=this.getBottom()?this.getBottom():nTop)),nDuration)
},getRight:function(){return this._oCore.nMaxScrollLeft
},getLeft:function(){return 0
},getBottom:function(){return this._oCore.nMaxScrollTop
},getTop:function(){return this._oCore.nMinScrollTop
},getCurrentPos:function(){return this._oCore.getCurrentPos()
},hasHScroll:function(){return this._oCore.bUseHScroll
},hasVScroll:function(){return this._oCore.bUseVScroll
},_onDeactivate:function(){this._detachEvent();
this._oCore.deactivate()
},_attachEvent:function(){this._htEvent={};
this._oCore.attach({beforeTouchStart:jindo.$Fn(this._onBeforeTouchStart,this).bind(),touchStart:jindo.$Fn(this._onTouchStart,this).bind(),beforeTouchMove:jindo.$Fn(this._onBeforeTouchMove,this).bind(),touchMove:jindo.$Fn(this._onTouchMove,this).bind(),beforeTouchEnd:jindo.$Fn(this._onBeforeTouchEnd,this).bind(),touchEnd:jindo.$Fn(this._onTouchEnd,this).bind(),beforePosition:jindo.$Fn(this._onBeforePosition,this).bind(),position:jindo.$Fn(this._onPosition,this).bind(),setDuration:jindo.$Fn(this._onSetDuration,this).bind(),afterScroll:jindo.$Fn(this._onAfterScroll,this).bind()});
if(this.option("bAutoResize")){this._htEvent.rotate=jindo.$Fn(this._onRotate,this).bind();
jindo.m.bindRotate(this._htEvent.rotate)
}},_onRotate:function(we){this.fireEvent("rotate");
this.refresh()
},_onSetDuration:function(we){if(this.option("bUseScrollbar")){if(we.bUseHScroll&&this._htWElement.HscrollbarIndicator){this._htWElement.HscrollbarIndicator.css("-"+this._oCore.sCssPrefix+"-transition-duration",we.nDuration)
}if(we.bUseVScroll&&this._htWElement.VscrollbarIndicator){this._htWElement.VscrollbarIndicator.css("-"+this._oCore.sCssPrefix+"-transition-duration",we.nDuration)
}}},_onBeforeTouchStart:function(we){if(!this.fireEvent("beforeTouchStart",we)){we.stop()
}},_onTouchStart:function(we){if(!this.fireEvent("touchStart",we)){we.stop()
}},_onBeforeTouchMove:function(we){if(!this.fireEvent("beforeTouchMove",we)){we.stop()
}},_onTouchMove:function(we){if(this._isPullDown||this._isPullUp){this._touchMoveForUpdate(we)
}if(!this.fireEvent("touchMove",we)){we.stop()
}},_onBeforeTouchEnd:function(we){if(!this.fireEvent("beforeTouchEnd",we)){we.stop()
}},_onTouchEnd:function(we){if(this._isPullDown&&this._htWElement.pullDown._isReady_){this._pullUploading(this._htWElement.pullDown,false)
}if(this._isPullUp&&this._htWElement.pullUp._isReady_){this._pullUploading(this._htWElement.pullUp,true)
}if(!this.fireEvent("touchEnd",we)){we.stop()
}},_onBeforePosition:function(we){if(!this.fireEvent("beforePosition",we)){we.stop()
}},_onPosition:function(we){if(this.option("bUseScrollbar")){if(this._nScrollBarHideTimer){clearTimeout(this._nScrollBarHideTimer);
delete this._nScrollBarHideTimer
}this._setScrollBarPos("V",we.nTop);
this._setScrollBarPos("H",we.nLeft)
}this.fireEvent("position",we)
},_onAfterScroll:function(we){if(this.option("bUseScrollbar")&&!this.option("bUseFixedScrollbar")){var self=this;
this._nScrollBarHideTimer=setTimeout(function(){self._hideScrollBar("H");
self._hideScrollBar("V")
},this.option("nScrollbarHideThreshold"))
}this.fireEvent("afterScroll",we)
},_hideScrollBar:function(sDirection){var wel=this._htWElement[sDirection+"scrollbar"],bUseScroll=(sDirection==="H"?this._oCore.bUseHScroll:this._oCore.bUseVScroll);
if(bUseScroll&&wel){if(this._oCore.isPositionBug&&this._oCore.bUseHighlight){this._oCore.makeStylePos(this._htWElement[sDirection+"scrollbarIndicator"])
}wel.hide();
wel.css("left",wel.css("left")+"px")
}},_fireEventPullDown:function(){if(!this._htWElement){return
}this.fireEvent("pullDown",{welElement:this._htWElement.pullDown,oScroll:this})
},_fireEventPullUp:function(){if(!this._htWElement){return
}this.fireEvent("pullUp",{welElement:this._htWElement.pullUp,oScroll:this})
},_pullUploading:function(wel,isUp){var fn=isUp?this.option("fnPullUpUpdating"):this.option("fnPullDownUpdating");
var self=this;
this._isUpdating=true;
wel._isReady_=false;
if(fn){setTimeout(function(){fn(wel);
if(isUp){self._fireEventPullUp()
}else{self._fireEventPullDown()
}},0)
}},_touchMoveForUpdate:function(we){if(this._isUpdating){return
}var nTopMargin=this._oCore.option("nOffsetTop");
var nBottomMargin=this._oCore.option("nOffsetBottom");
we.nMaxScrollTop=this._nOrgMaxScrollTop?this._nOrgMaxScrollTop:we.nMaxScrollTop;
if(this._isPullDown){if(this._htWElement.pullDown._isReady_){if(nTopMargin>we.nTop){this._htWElement.pullDown._isReady_=false;
if(this.option("fnPullDownIdle")){this.option("fnPullDownIdle")(this._htWElement.pullDown);
this._oCore.nMinScrollTop=-nTopMargin
}}}else{if(we.nTop>nTopMargin){this._htWElement.pullDown._isReady_=true;
if(this.option("fnPullDownBeforeUpdate")){this.option("fnPullDownBeforeUpdate")(this._htWElement.pullDown);
this._oCore.nMinScrollTop=0
}}}}if(this._isPullUp){if(this._htWElement.pullUp._isReady_){if(we.nTop>=(we.nMaxScrollTop-nBottomMargin)){this._htWElement.pullUp._isReady_=false;
if(this.option("fnPullUpIdle")){this.option("fnPullUpIdle")(this._htWElement.pullUp);
this._oCore.nMaxScrollTop=we.nMaxScrollTop
}}}else{if(we.nTop<(we.nMaxScrollTop-nBottomMargin)){this._htWElement.pullUp._isReady_=true;
if(this.option("fnPullUpBeforeUpdate")){this.option("fnPullUpBeforeUpdate")(this._htWElement.pullUp);
this._nOrgMaxScrollTop=we.nMaxScrollTop;
this._oCore.nMaxScrollTop=we.nMaxScrollTop-nBottomMargin
}}}}},isMoving:function(){return this._oCore.isMoving()
},_detachEvent:function(){this._oCore.detachAll();
if(this.option("bAutoResize")){jindo.m.unbindRotate(this._htEvent.rotate)
}this._htEvent=null
},_createScroll:function(sDirection){if(!(sDirection==="H"?this._oCore.bUseHScroll:this._oCore.bUseVScroll)){return
}var welScrollbar=this._htWElement[sDirection+"scrollbar"],welScrollbarIndicator=this._htWElement[sDirection+"scrollbarIndicator"],welWrapper=this._htWElement.wrapper;
if(welScrollbar){welWrapper.remove(welScrollbar);
this._htWElement[sDirection+"scrollbar"]=this._htWElement[sDirection+"scrollbarIndicator"]=null
}welScrollbar=this._createScrollbar(sDirection);
welScrollbarIndicator=this._createScrollbarIndicator(sDirection);
this._htWElement[sDirection+"scrollbar"]=welScrollbar;
this._htWElement[sDirection+"scrollbarIndicator"]=welScrollbarIndicator;
welScrollbar.append(welScrollbarIndicator);
welWrapper.append(welScrollbar);
this._refreshScroll(sDirection)
},_refreshScroll:function(sDirection){if(sDirection==="H"){if(!this._oCore.bUseHScroll||this._oCore.nWrapperW==this._oCore.nScrollW){return
}}else{if(!this._oCore.bUseVScroll||this._oCore.nWrapperH==this._oCore.nScrollH){return
}}if(!this._htWElement[sDirection+"scrollbar"]){this._createScroll(sDirection)
}var welScrollbar=this._htWElement[sDirection+"scrollbar"],welScrollbarIndicator=this._htWElement[sDirection+"scrollbarIndicator"],nSize=0;
if(sDirection==="H"){nSize=Math.max(Math.round(Math.pow(this._oCore.nWrapperW,2)/this._oCore.nScrollW),8);
this._nPropHScroll=(this._oCore.nWrapperW-nSize)/this._oCore.nMaxScrollLeft;
welScrollbar.width(this._oCore.nWrapperW);
welScrollbarIndicator.width(isNaN(nSize)?0:nSize)
}else{nSize=Math.max(Math.round(Math.pow(this._oCore.nWrapperH,2)/this._oCore.nScrollH),8);
this._nPropVScroll=(this._oCore.nWrapperH-nSize)/this._oCore.nMaxScrollTop;
welScrollbar.height(this._oCore.nWrapperH);
welScrollbarIndicator.height(isNaN(nSize)?0:nSize)
}},_createScrollbar:function(sDirection){var welScrollbar=jindo.$Element("<div>");
welScrollbar.css({position:"absolute",zIndex:100,bottom:(sDirection==="H"?"1px":(this._oCore.bUseHScroll?"7":"2")+"px"),right:(sDirection==="H"?(this._oCore.bUseVScroll?"7":"2")+"px":"1px"),pointerEvents:"none"});
if(this.option("bUseFixedScrollbar")){welScrollbar.show()
}else{welScrollbar.hide()
}if(sDirection==="H"){welScrollbar.css({height:"5px",left:"2px"})
}else{welScrollbar.css({width:"5px",top:"2px"})
}return welScrollbar
},_createScrollbarIndicator:function(sDirection){var welScrollbarIndicator=jindo.$Element("<div>").css({position:"absolute",zIndex:100,border:this.option("sScrollbarBorder"),pointerEvents:"none",left:0,top:0,"background-color":this.option("sScrollbarColor")});
if(this._oCore.isIos&&this.option("bUseScrollBarRadius")){welScrollbarIndicator.css("-"+this._oCore.sCssPrefix+"-border-radius","12px")
}if(this._oCore.option("bUseTranslate")||this._oCore.option("bUseCss3d")){welScrollbarIndicator.css("-"+this._oCore.sCssPrefix+"-transition-property","-"+this._oCore.sCssPrefix+"-transform").css("-"+this._oCore.sCssPrefix+"-transform","translate"+this._oCore.sTransOpen+"0,0"+this._oCore.sTransEnd)
}if(this._oCore.option("bUseTimingFunction")){welScrollbarIndicator.css("-"+this._oCore.sCssPrefix+"-transition-timing-function","cubic-bezier(0.33,0.66,0.66,1)")
}if(sDirection==="H"){welScrollbarIndicator.height(5)
}else{welScrollbarIndicator.width(5)
}return welScrollbarIndicator
},_setScrollBarPos:function(sDirection,nPos){if(!(sDirection==="H"?this._oCore.bUseHScroll:this._oCore.bUseVScroll)){return
}var welIndicator=this._htWElement[sDirection+"scrollbarIndicator"],welScrollbar=this._htWElement[sDirection+"scrollbar"];
nPos=this["_nProp"+sDirection+"Scroll"]*nPos;
if(!this.option("bUseFixedScrollbar")&&!welScrollbar.visible()){welScrollbar.show()
}if(welIndicator){if(this._oCore.option("bUseTranslate")){if(this._oCore.isPositionBug&&this._oCore.bUseHighlight){var nBufferPos=parseInt((sDirection==="H"?welIndicator.css("left"):welIndicator.css("top")),10);
nPos-=isNaN(nBufferPos)?0:nBufferPos
}welIndicator.css("-"+this._oCore.sCssPrefix+"-transform","translate"+this._oCore.sTranOpen+(sDirection==="H"?nPos+"px,0":"0,"+nPos+"px")+this._oCore.sTranEnd)
}else{if(sDirection==="H"){welIndicator.css("left",nPos+"px")
}else{welIndicator.css("top",nPos+"px")
}}}},destroy:function(){this.deactivate();
for(var p in this._htWElement){this._htWElement[p]=null
}this._oCore.destroy();
delete this._oCore;
this._htWElement=null
}}).extend(jindo.m.UIComponent)
})("jindo");