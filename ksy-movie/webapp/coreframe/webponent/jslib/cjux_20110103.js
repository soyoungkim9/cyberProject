/*
 * Webponent JS Library 0.9+
 * Copyright(c) 2006-2010 CyberImagination, Inc.
 * Licensed under the CyberImagination Commercial License V.2.1
 * 
 * http://www.cyber-i.com/license
 */



var webponent = {
  Version: '0.9.9_rc4',
  ScriptFragment: '(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)',
  emptyFunction: function() {}
}

//configuration
webponent.isDebugMode = false;
webponent.gridTextAlign='right';



var _viE_x=navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5);
Prototype.Browser.IE6 = Prototype.Browser.IE && parseInt(_viE_x) == 6;
Prototype.Browser.IE7 = Prototype.Browser.IE && parseInt(_viE_x) == 7;
if(document.documentMode==7) Prototype.Browser.IE7=true; 
Prototype.Browser.IE8 = Prototype.Browser.IE && !Prototype.Browser.IE6 && !Prototype.Browser.IE7;

// <= IE7
Prototype.Browser.oldIE = (Prototype.Browser.IE6 || Prototype.Browser.IE7);

if(window.location.href.indexOf("#debug.log.enable")>0) {
	alert('enter debug log mode');
	webponent.isDebugMode = true;
}

var FOCUS_CLASSNM = 'focus';
var SELECT_CLASSNM = 'selected';

var styleFloatNm;
if (document.all) styleFloatNm = "styleFloat";
else styleFloatNm = "cssFloat";

var debugPopup;
function popupLogMsg() {
  debugPopup = window.open("", null, "height=170px,width=400px,top=0,left=0,scrollbars=yes,status=yes,toolbar=no,menubar=no,location=yes");
}
if(webponent.isDebugMode) popupLogMsg();
Event.observe(window, 'beforeunload', exitWindow);
function exitWindow() {
  if (debugPopup) {
    debugPopup.close();
  }
}
function log(msg) {
	try {
		//printConsole(msg);
	}catch(e) {}
  if (webponent.isDebugMode) {
    try {
      if (!debugPopup) {
        popupLogMsg();
      }
      var d = debugPopup.document;
      d.write(getTimeStamp() + ' &nbsp; ' + msg + '<br/>');
      d.body.style.fontSize = '12px';
      d.body.scrollTop = 1000000;
    } catch(e) {
      popupLogMsg();
    }
  }
}
function px(size) {
  
  size=size+'';
  try {
    if (size.indexOf('%') < 0 && size.indexOf('px') < 0) return size + 'px';
    else return size;
  } catch(e) {}
  return size;
}

function pxPstv(size) {
	if(size<0) return '0px';
	  
	  size=size+'';
	  try {
	    if (size.indexOf('%') < 0 && size.indexOf('px') < 0) return size + 'px';
	    else return size;
	  } catch(e) {}
	  return size;
}


function getTimeStamp() {
  var d = new Date();
  var s = leadingZeros(d.getHours(), 2) + ':' + leadingZeros(d.getMinutes(), 2) + ':' + leadingZeros(d.getSeconds(), 2);
  return s;
}
function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();
  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++) zero += '0';
  }
  return zero + n;
}
function findPosition(obj) {
  var curleft = curtop = 0;
  if (obj.offsetParent) {
    curleft = obj.offsetLeft; 
    curtop = obj.offsetTop;
    while (obj = obj.offsetParent) {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    }
  }
  return [curleft, curtop];
}


function $linkUrl(url, target) {
	
	target=$(target);
	if(target.nodeName=='IFRAME') {
		target.setAttribute('src',url);
		return;
	}
	
	if (url) {
		try {
			new Ajax.Request(url+'?'+Math.random(), {
				method :'get',
				onSuccess : function(transport) {

					var html = transport.responseText;
					var cnt = $cnt(html);
					var script = $srpt(html);
					
					target.innerHTML = cnt;
					$exec(script);
				}
			});
		} catch (e) {
		}
	}
}

function $cnt(B) {
	return B.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '');
}
function $srpt(B) {
	try {
		var p1 = B.indexOf('<script');
		if(p1<0) return '';
		var p2 = B.indexOf('>', p1);
		var p3 = B.indexOf('</script', p2);
		return B.substring(p2 + 1, p3);
	} catch (e) {
		return '';
	}

}

function $exec(B) {
	var x = B.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '');

	if (!B) {
		return B;
	}
	if (window.execScript) {
		window.execScript(B);
	} else {

try {
		var A = document.createElement("script");
		A.setAttribute("type", "text/javascript");
		A.text = B;
		//var h=document.head;
		var h=document.body;
		h.appendChild(A);
		h.removeChild(A);
		
}catch(e){alert(e.message); }		
	}
	return B;
}


function onDisableSelect() {
	try {
		if(event.srcElement.nodeName=='INPUT') return true;
	}catch(e){}
  return false;
}
webponent.LayoutEvent = Class.create();
webponent.LayoutEvent.prototype = {
  initialize: function() {
    this.eventArray = new Array();
    //0429
    //Event.observe(window, 'load', this.start.bind(this));
    this.onresize=false;
    this.isFirst=true;
    this.currHeight=0;
    this.currWidth=0;
    //alert(this.currHeight+' ' +this.currWidth)
    
    setTimeout(this.fireResizeEvent.bind(this), 500);
    
  },
  regist: function(func) {
    this.eventArray[this.eventArray.length] = func;
    log('webponent.LayoutEvent> regist count ' + this.eventArray.length);
  },
  fireResizeEvent: function(event) {
	  
	  if(this.isFirst) {
	    	Event.observe(window, 'resize', this.fireResizeEvent.bind(this));
	    	this.isFirst=false;
	    }
	  
	  
	if(this.onresize) return;
	this.onresize=true;
	
	if(this.currHeight==document.documentElement.clientHeight 
			&& this.currWidth==document.documentElement.clientWidth) {
		this.onresize=false;
		return;
	}
	this.currHeight=document.documentElement.clientHeight;
	this.currWidth=document.documentElement.clientWidth;
	
    //log('webponent.LayoutEvent> fire event ' + this.eventArray.length);
    //Event.stopObserving(window, 'resize', this.fireResizeEvent);
    for (var i = 0; i < this.eventArray.length; i++) {
      this.eventArray[i].call(null, event);
    }
    this.onresize=false;
    //Event.observe(window, 'resize', this.fireResizeEvent.bind(this));
    
  },
  start: function(e) {
	  alert('LayoutEvent start');
    this.fireResizeEvent(e);
    Event.observe(window, 'resize', this.fireResizeEvent.bind(this));
    
  }
}
var layoutEvent = new webponent.LayoutEvent();


webponent.Layout = Class.create();
webponent.Layout.TOP = 1;
webponent.Layout.LEFT = 2;
webponent.Layout.RIGHT = 3;
webponent.Layout.BOTTOM = 4;
webponent.Layout.CENTER = 5;

webponent.Layout.prototype = {
  initialize: function(mainPanelId, width, height, paddingSz) {
    log('new');
    var p = $(mainPanelId);
    if (!p) {
      alert('ERROR:not defiend ' + mainPanelId);
      return;
    };
    this.parentPanel = p;
    
    this.parentPanel.addClassName('layout');
    
    {
      var pl = p.childNodes;
      for (k = 0; k < pl.length; k++) {
        if (pl[k].style) pl[k].style.display = 'none';
      }
    }
    var s = p.style;
    //s.overflow = 'hidden';
    this.paddingSize = 0;
    if (paddingSz) {
      this.paddingSize = parseInt(paddingSz);
    }
    s.margin = '0px';
    s.padding = px(this.paddingSize);
    
    if ('outline' == p.className) {
      s.border = '0px';
    }
    this.resizeX = false;
    this.resizeY = false;
    if (width) {
      s.width = width;
      if (width.indexOf("%") > 0) this.resizeX = true;
    }
    if (height) {
      s.height = height;
      if (height.indexOf("%") > 0) this.resizeY = true;
    }
    s.width = px(p.clientWidth);
    s.height = px(p.clientHeight);
    this.sideObjStyleArray = new Array();
    this.centerOutlineObjArray = new Array();
    this.centerOutlineStyle;
    this.lastObjMap = new Array();
    this.bodyWidth = 0;
    this.bodyHeight = 0;
    this.centerOutlineObj;
    this.borderSize = 2;
    layoutEvent.regist(this.resize.bind(this));
    

    // cf ) http://baepower.wordpress.com/2007/02/22/flash??-z-index/
    
    var extSt='';
    if(Prototype.Browser.IE)
    	extSt='background-color:#999;Filter:Alpha(Opacity=0);';
    this.coverDiv = new Element('div', {
        'style': 'position:absolute;left:0px;top:0px;width:0px;height:0px;z-index:999999;'+extSt
      });
    this.parentPanel.appendChild(this.coverDiv);
  },
  show: function() {
	//0419
    layoutEvent.fireResizeEvent();
  },
  addSplit: function(outlinePanel, mode, spliterParams) {
	var splitWidth= spliterParams.width;
	var resizable = false; 
    if(spliterParams.resizable==true) resizable = true; 
	//, splitWidth, isFix  
    if (splitWidth == 0) return;
    
    if (!splitWidth) splitWidth = 4 ;
    var linePanel = new Element('div', {
      'class': 'splitBar',
      'style': 'padding:0px;margin:0px;font-size:1px;vertical-align:bottom;text-align:center;overflow:hidden;',
      'mode': mode
    });
    
    var s = linePanel.style;
    switch (mode) {
    case webponent.Layout.TOP:
      var x = outlinePanel.next(0);
      if (x) {
        outlinePanel.parentNode.insertBefore(linePanel, x);
      } else {
        outlinePanel.parentNode.insert(linePanel);
      }
      s[styleFloatNm] = 'none';
      s.height = px(splitWidth);
      s.cursor = 'n-resize';
      break;
    case webponent.Layout.BOTTOM:
      outlinePanel.parentNode.insertBefore(linePanel, outlinePanel);
      s.height = px(splitWidth);
      s.position = 'static';
      s[styleFloatNm] = 'left';
      s.width = '100%';
      s.cursor = 'n-resize';
      break;
    case webponent.Layout.CENTER:
      //alert(splitWidth);
      outlinePanel.parentNode.insertBefore(linePanel, outlinePanel);
      s.height = px(splitWidth);
      s.cursor = 'n-resize';
      this.centerOutlineObjArray[this.centerOutlineObjArray.length] = linePanel;
      break;
    case webponent.Layout.LEFT:
      var x = outlinePanel.next(0);
      if (x) {
        outlinePanel.parentNode.insertBefore(linePanel, x);
      } else {
        outlinePanel.parentNode.insert(linePanel);
      }
      s[styleFloatNm] = 'left';
      s.width = px(splitWidth);
      s.cursor = 'e-resize';
      this.sideObjStyleArray[this.sideObjStyleArray.length] = s;
      break;
    case webponent.Layout.RIGHT:
      var x = outlinePanel.next(0);
      if (x) {
        outlinePanel.parentNode.insertBefore(linePanel, x);
      } else {
        outlinePanel.parentNode.insert(linePanel);
      }
      s[styleFloatNm] = 'right';
      s.width = px(splitWidth);
      s.cursor = 'e-resize';
      this.sideObjStyleArray[this.sideObjStyleArray.length] = s;
      break;
    }
    
    
    
    if(resizable) {
    	
      Event.observe(linePanel, 'mousedown', this.onSplitClickDn.bind(this));
    }else {
        s.cursor='';
    }
  },
  onSplitClickDn: function(event) {
	this.coverDiv.style.width='100%';
	this.coverDiv.style.height='100%';
	
    var e = event.element();
    var p = findPosition(e);
    var w = e.clientWidth;
    var y = e.clientHeight;
    var x = new Element('div', {
      'style': 'position:absolute;padding:0px;margin:0px;font-size:1px;'
    });
    document.body.appendChild(x);
    x.style.border = '0px solid #f00';
    x.style.backgroundColor = '#aaa';
    x.style.left = px(p[0]);
    x.style.top = px(p[1]);
    x.style.width = px(w);
    x.style.height = px(y);
    this.verticalMode = false;
    this.splitMode = e.getAttribute("mode");
    this.prePosition = p;
    this.preObj;
    this.nexObj;
    this.sideObj=e;
    if (e.clientWidth > e.clientHeight) {
      this.preObj = e.previous();
      this.nexObj = e.next();
      this.minY = p[1] - this.preObj.clientHeight + 45;
      this.maxY = p[1] + this.nexObj.clientHeight - 45;
    } else {
      if (e.style[styleFloatNm] == 'right') {
        this.preObj = e.previous(1);
        this.nexObj = e.previous(0);
      } else {
        this.preObj = e.previous(0);
        this.nexObj = e.next(0);
      }
      this.minX = p[0] - this.preObj.clientWidth + 70;
      this.maxX = p[0] + this.nexObj.clientWidth - 70;
      this.verticalMode = true;
    }
    
    Event.observe(document, 'selectstart', onDisableSelect);
    
    //Event.observe(this.parentPanel, 'mousemove', this.onSplitMouseOver.bind(this));
    Event.observe(window.document, 'mousemove', this.onSplitMouseOver.bind(this));
    Event.observe(window.document, 'mouseup', this.onSplitClickUp.bind(this));
    
    this.resizeSplit = x;
    this.resizeSplitStyle = x.style;
    this.isMouseClick = true;
    document.onselectstart = onDisableSelect;
    
    
  },
  onSplitMouseOver: function(event) {
	//log('mousemove:'+event.clientY);
    if (this.isMouseClick) {
      this.resizeSplitStyle.position = 'absolute';
      if (this.verticalMode) {
        var x = event.clientX;
        if (this.minX < x && x < this.maxX) this.resizeSplitStyle.left = px(x);
      } else {
        var y = event.clientY;
        if (this.minY < y && y < this.maxY) this.resizeSplitStyle.top = px(y);
      }
    }
  },
  onSplitClickUp: function(event) {
    document.onselectstart = null;
    if (this.isMouseClick) {
      this.coverDiv.style.width='0px';
      this.coverDiv.style.height='0px';
      
      //this.centerOutlineObj.style.overflow = 'hidden';
      var x= 0;
      var y=0;
      if(this.preObj.offsetWidth==0 || this.nexObj.offsetWidth==0 || this.preObj.offsetHeight==0 || this.nexObj.offsetHeight==0) {
    	var sb=this.sideObj;
    	x = sb.getAttribute('x');
    	y = sb.getAttribute('y');
    	sb.style.cursor=sb.getAttribute('pre-cursor');
    	sb.className='splitBar';
      }else {
    	  var p = findPosition(this.resizeSplit);
          y = p[1] - this.prePosition[1];
          x = p[0] - this.prePosition[0];  
      }
      
      var m1 = this.preObj.getAttribute('mode');
      var m2 = this.nexObj.getAttribute('mode');
      if (this.verticalMode) {
        this.preObj.style.width = px(this.preObj.clientWidth + x)
        this.nexObj.style.width = px(this.nexObj.clientWidth - x);
      } else if (y < 600) {
        if (m1 == m2) {
          try {
            this.preObj.style.height = px(this.preObj.clientHeight + y);
            this.nexObj.style.height = px(this.nexObj.clientHeight - y);
          } catch(e) {
            log('onSplitClickUp:' + this.preObj.clientHeight + ' > ' + y);
          }
        } else if (m1 == webponent.Layout.TOP) {
          this.preObj.style.height = px(this.preObj.clientHeight + y);
        } else if (m2 == webponent.Layout.BOTTOM) {
          this.nexObj.style.height = px(this.nexObj.clientHeight - y);
        }
      }
      document.body.removeChild(this.resizeSplit);
      this.isMouseClick = false;
      layoutEvent.fireResizeEvent(event);
    }
  },
  add: function(mode, panelId, size, spliterParams) {
	//splitWidth,isFix
	if(!spliterParams) spliterParams=new Object();  
    var outlinePanel = new Element('div', {
      'class': 'outline',
      'mode': mode,
      'style': 'margin:0px;'
    });
    if (mode != webponent.Layout.CENTER) {
      this.parentPanel.appendChild(outlinePanel);
    } else if (this.centerOutlineObj == null) {
      this.centerOutlineObj = new Element('div', {
        'class': 'center-outline',
        'style': 'padding:0px;margin:0px;border:0px solid #f00; '
      });
      this.parentPanel.appendChild(this.centerOutlineObj);
      this.centerOutlineObj.appendChild(outlinePanel);
      var ss = this.centerOutlineObj.style;
      this.sideObjStyleArray[this.sideObjStyleArray.length] = ss;
      this.centerOutlineStyle = ss;
      ss[styleFloatNm] = 'left';
    } else {
      this.centerOutlineObj.appendChild(outlinePanel);
    }
    var p = $(panelId);
    if (p) {
      outlinePanel.appendChild(p);
      p.style.display = 'block';
    } else {
      p = new Element('div');
      outlinePanel.appendChild(p);
      p.style.display = 'block';
    }
    var ol = outlinePanel;
    var os = ol.style;
    os.overflow = 'hidden';
    var lastObj = this.lastObjMap[mode];
    if (lastObj) {
      var x = lastObj.next(1);
      if (!x) x = lastObj.next(0);
      lastObj.parentNode.insertBefore(ol, x);
    }
    switch (mode) {
    case webponent.Layout.TOP:
      os.height = size;
      this.addSplit(ol, webponent.Layout.TOP, spliterParams);
      break;
    case webponent.Layout.LEFT:
      os[styleFloatNm] = 'left';
      os.width = size;
      this.sideObjStyleArray[this.sideObjStyleArray.length] = os;
      this.addSplit(ol, webponent.Layout.LEFT, spliterParams);
      break;
    case webponent.Layout.CENTER:
      if (size) {
    	  if(size.indexOf("%") && Prototype.Browser.IE6) {
    		  //alert(this.centerOutlineObj.clientHeight );
    		  size = this.centerOutlineObj.offsetHeight * parseInt(size) / 150; 
    		  //alert(size);
    		  size=px(size);  
    	  }
    	  os.height = size;
      }
      
      os.position = 'static';
      if (ol.previous(0) != null) {
        this.addSplit(ol, webponent.Layout.CENTER, spliterParams);
      }
      this.centerOutlineObjArray[this.centerOutlineObjArray.length] = ol;
      break;
    case webponent.Layout.RIGHT:
      os[styleFloatNm] = 'right';
      os.width = size;
      this.sideObjStyleArray[this.sideObjStyleArray.length] = os;
      this.addSplit(ol, webponent.Layout.RIGHT, spliterParams);
      break;
    case webponent.Layout.BOTTOM:
      os.position = 'relative';
      os[styleFloatNm] = 'left';
      os.width = '100%';
      os.height = size;
      this.addSplit(ol, webponent.Layout.BOTTOM, spliterParams);
      break;
    default:
      alert(mode + 'is not defined MODE');
    }
    this.lastObjMap[mode] = ol;
    return p;
  },
  getCenterPos: function() {
    var cwidth = 0;
    var cheight = 0;
    var pl = this.parentPanel.childNodes;
    for (k = 0; k < pl.length; k++) {
      var m = -1;
      if (pl[k].getAttribute) m = pl[k].getAttribute('mode');
      if (m == webponent.Layout.LEFT || m == webponent.Layout.RIGHT) {
        cwidth += pl[k].offsetWidth;
        
      }
      else if (m == webponent.Layout.TOP || m == webponent.Layout.BOTTOM) {
        cheight += pl[k].offsetHeight;
      } 
      
    } //cwidth=(this.parentPanel.clientWidth-cwidth-this.paddingSize*2);
    //cheight=(this.parentPanel.clientHeight-cheight-this.paddingSize*4);
    cwidth = (this.parentPanel.clientWidth - cwidth - this.paddingSize * 2);
    cheight = (this.parentPanel.clientHeight - cheight - this.paddingSize * 2);
    return [cwidth, cheight];
  },
  hide:function(panelId, size) {
	  if(!size) size='0px';
	  
	  var l=$(panelId).parentNode;
	  var mode=l.getAttribute('mode');
	  
	  var sb;//splitBar
	  var dn;
	  var up;
	  if(mode==webponent.Layout.LEFT) {
		  dn=l;
		  sb=l.next(0);
		  up=sb.next(0);
		  
		  var w=l.offsetWidth;
		  dn.style.width=size;
		  up.style.width = px( up.offsetWidth+w);
		  sb.setAttribute('x',w);
		  
	  } else if(mode==webponent.Layout.RIGHT) {
		  dn=l;
		  sb=l.next(0);
		  up=l.previous(0);
		  var w=l.offsetWidth;
		  dn.style.width=size;
		  up.style.width = px( up.offsetWidth+w);
		  sb.setAttribute('x',w*-1);
	  } else if(mode==webponent.Layout.CENTER) {
		  var a=-1;
		  dn=l;
		  try {
		  sb=l.previous(0);
		  up=sb.previous(0);
		  }catch(e) {
			  sb=l.next(0);
			  up=sb.next(0);
			  a=1;
		  }
		  var w=dn.offsetHeight;
		  dn.style.height=size;
		  up.style.height = px( up.offsetHeight+w);
		  sb.setAttribute('y',w*a);
	  }

	  if(size=='0px') {
	    sb.setAttribute('pre-cursor',sb.style.cursor);
	    sb.style.cursor='pointer';
	    sb.className='splitBar_hidden';
	  }
	  
	  layoutEvent.fireResizeEvent();

  },
  resize: function() {
	  
    log('webponent.Layout> resize');
    var fixW = this.paddingSize * 2;
    var s = this.parentPanel.style;
    s.display = 'none';
    var pp=this.parentPanel.parentNode;
    if (this.resizeX) s.width = pxPstv(pp.clientWidth - fixW);
    if (this.resizeY) s.height = pxPstv(pp.clientHeight - fixW);
    s.display = '';
    var cp = this.getCenterPos();
    this.bodyWidth = cp[0];
    this.bodyHeight = cp[1];
    if (this.bodyHeight > 30) {
      fixW = 0;
      
      for (var i = 0,
      n = this.sideObjStyleArray.length; i < n; i++) {
        if (this.centerOutlineStyle != this.sideObjStyleArray[i]) this.sideObjStyleArray[i].height = px(this.bodyHeight);
      }
      this.centerOutlineStyle.height = px(this.bodyHeight);
    }
    if (this.centerOutlineObjArray.length > 0) {
      var lastBodyHeight = this.bodyHeight;
      for (var i = 0,
      n = this.centerOutlineObjArray.length - 1; i < n; i++) {
        lastBodyHeight -= (this.centerOutlineObjArray[i].offsetHeight);
      }
      var minHt=20;
      if (lastBodyHeight > minHt) {
        this.centerOutlineObjArray[this.centerOutlineObjArray.length - 1].style.height = px(lastBodyHeight);
      }else {
    	try {
    	var pr=this.centerOutlineObjArray[0];
    	pr.style.height=px(pr.clientHeight+lastBodyHeight-minHt);
    	this.centerOutlineObjArray[this.centerOutlineObjArray.length - 1].style.height=minHt+'px';
    	}catch(e){}
      }
      
    }
    if (this.bodyWidth > 0 && this.centerOutlineStyle) {
      this.centerOutlineStyle.width = px(this.bodyWidth);
    }
  }
};
webponent.TabView = Class.create();
webponent.TabView.prototype = {
  initialize: function(mainPanelId, mouseOver, arg) {
    this.mp = $(mainPanelId);
    if (!this.mp) {
      alert('ERROR:not defiend ' + mainPanelId);
      return;
    };
    log('webponent.TabView> initialize id=' + this.mp.id);
    this.arg = arg;
    this.mouseOver = mouseOver;
    this.mp.style.borderWidth = '0px 0px 0px 0px';
    //this.mp.style.overflow = 'hidden';
 
    this.tabHeader = new Element('ul', {
      'class': 'tabHeader'
    });
    this.mp.appendChild(this.tabHeader);
    this.tabArray = new Array();
    this.tabHeadArray = new Array();
    this.labelArray = new Array();
    this.viewSelector;
    this.viewTab;
    
    
    
    this.tabParent=this.mp.parentNode;
    if(this.tabParent.nodeName=='FORM')
    	this.tabParent=this.tabParent.parentNode;
    
    layoutEvent.regist(this.resizing.bind(this));
    
    
    
    
  },
  setTabBody: function() {
    if (!this.tabBody) {
      this.tabBody = new Element('div', {
        'class': 'tabMainBody',
        'style': 'padding:0px;margin:0px;'
//>>>'style': 'overflow:auto;overflow-X:hidden;padding:0px;margin:0px;clear:both;border:0px solid #00f;'        	
      });
      this.mp.appendChild(this.tabBody);
      //this.tabBody.style.position = 'static';
    }
  },
  add: function(label, panelId, param) {
	if(!param) param=new Object();  
	//closable, url  
    var tab = $(panelId);
    if(!tab) {
      if(param.iframe==true)	{
    	  var scroll='no';
    	  if(param.overflow=='auto') scroll='auto';
    	  tab = new Element('iframe', {'id':panelId,'scrolling':scroll} );
      }
      else
          tab = new Element('div', {'id':panelId} );	
    }
    tab.addClassName('tabBody');
    var idx = this.tabArray.length;
    this.tabArray[idx] = tab;
    
    var tabSel = new Element('li', {
      'class': 'selector',
      'style': 'cursor:pointer',
      'idx': idx,
      'refId':panelId
    });
    tabSel.update(label+' '); //tabSel.style[styleFloatNm]='left';
    this.tabHeadArray[idx]=tabSel;
    this.labelArray[idx]=label;

    if(param.closable) {
    //var closeBtn = new Element('img', {'src':webponent.imgRootPath+'tab-close.gif', 'style':'margin:0px 0px 0px 0px','idx':idx});
    var closeBtn = new Element('span',{'class':'tabColseIcon', 'idx':idx});
    //var close2Btn = new Element('div',{'class':'tabColseIcon'});
    
    tabSel.appendChild(closeBtn);
    //closeBtn.appendChild(close2Btn);
    //closeBtn.update("x");
    Event.observe(closeBtn, 'mouseup', this.close.bind(this));
    }
    
    
    tab.tabSelector=tabSel;
    tabSel = $(tabSel);
    this.tabHeader.appendChild(tabSel); //tabSel.style.height=this.tabHeader.clientHeight-2+'px';
    this.setTabBody();
    //tab.style.height='100%';
    
    this.tabBody.appendChild(tab);
    tab.style.display = 'none';
    
    try {
    tab.style.overflow=param.overflow;
    }catch(e){
    	tab.style.overflow='auto';
    }
    
    
    if (idx == 0) {
      tabSel.addClassName('selected');
      this.viewSelector = tabSel;
    }
    
    tabSel.url=param.url;
    
    if (this.mouseOver) Event.observe(tabSel, 'mouseover', this.show.bind(this));
    else Event.observe(tabSel, 'mouseup', this.show.bind(this));
    return tabSel;
  },
  close:function(idx) {
	  
	  log('webponent.TabView> close '+idx);
	  
	  var selIdx = 0;
	  var selector;
	    if (idx) {
	      if (Object.isNumber(idx)) {
	        selIdx = idx;
	        //selector = this.tabHeader.childNodes[selIdx];
	        selector = this.tabHeadArray[selIdx];
	      } else {
	    	  selector = idx.element().parentNode;
	        selIdx = selector.getAttribute('idx');
	      }
	    }
	    //this.viewSelector.setAttribute('idx','close');
	    
	    this.viewSelector=null;
	    try {
	    	this.show(parseInt(selector.next().getAttribute('idx')));
	    }catch(e) {
	    	try {
	    	this.show(parseInt(selector.previous().getAttribute('idx')));
	    	}catch(e) {alert(e.message)}
	    }
	    
	    //this.viewTab = this.tabArray[selIdx];
	    //this.viewTab.parentNode.removeChild(this.viewTab);
	    var tabCnt = this.tabArray[selIdx];
	    this.viewTab.parentNode.removeChild(tabCnt);
	    
	    selector.parentNode.removeChild(selector);
	    this.tabArray[selIdx]=null;
	    this.tabHeadArray[selIdx]=null;
	    this.labelArray[selIdx]=null;
  },
  getIndexByLabel: function(label) {
	
	  for(var i=0;i<this.labelArray.length;i++) {
		if(this.labelArray[i]==label)
			return i;
	  }
	  
	  return -1;
  },
  
  show: function(idx) {
	  
	  
	  
	if(idx==null)
		idx=this.tabArray.length-1;
	  
    
    var selIdx = 0;
    var viewSel=this.viewSelector;
    
    if (idx!=null) {
      if (Object.isNumber(idx)) {
        selIdx = idx;
        //this.viewSelector = this.tabHeader.childNodes[selIdx];
        
        viewSel = this.tabHeadArray[selIdx];
        
      } else {
    	
    	  viewSel = idx.element();
        selIdx = viewSel.getAttribute('idx');
        if(selIdx=='close') return;
      }
    }
    var tmpTb= this.tabArray[selIdx];
    if(tmpTb==null) return;
    if (this.viewSelector) {
        this.viewSelector.removeClassName('selected');
    }
    if (this.viewTab) {
    	this.viewTab.style.display = 'none';
    }
    
    this.viewTab = this.tabArray[selIdx];
    
    try {
    if (viewSel.onselect) {
    	viewSel.selectId = this.viewTab.id;
    	viewSel.bind(this)(this.viewTab.id, this.arg);
    }
    }catch(e){}
    try {
    	this.viewTab.style.display = 'block';
    	
    	var u=viewSel.url
    	if(u && u.length >0) {
    		$linkUrl(u, this.viewTab);
    		viewSel.url=null;
    		
    	}
    
    }catch(e){}
    
    viewSel.addClassName('selected');
    
    this.fixTop=findPosition(this.tabParent)[1] - findPosition(this.mp)[1];  
    
    this.resizing();
    
   
    this.viewSelector=viewSel;
    return this.viewSelector;
  },
  resizing: function() {
    log('webponent.TabView> resizing');
    var fixH = this.fixTop;
    
    	
    if (Prototype.Browser.IE && this.fixTop<0) {
    	fixH=fixH -12;
    }else if (Prototype.Browser.Gecko) {
    	fixH=fixH -20;
    }else if (Prototype.Browser.WebKit) {
    	fixH=fixH -20;
    }
    
    try{
    	
      //log('tabBody size '+this.mp.offsetTop+ ' '+this.tabParent.clientHeight+ ' '+this.tabHeader.offsetHeight+ ' '+fixH);
      this.tabBody.style.height = px(this.tabParent.offsetHeight - this.tabHeader.offsetHeight + fixH);
      
    	
    }catch(e){log('tab resize err:'+e.message);}
    
  }
};
/*****************************************************
  webponent.DragDropProxy

*****************************************************/
webponent.DragDropProxy = Class.create();
webponent.DragDropProxy.prototype = {
  initialize: function(dragSource, dragNodeName) {
    this.dragSource = $(dragSource);
    this.isSourceTable = false;
    this.dragStart = false;
    this.sourceObj;
    this.targetObj;
    this.dragDiv;
    if(dragNodeName==null) dragNodeName='TABLE';
    if (this.dragSource.nodeName == dragNodeName) this.isSourceTable = true;
  },
  start: function() { // event regist;
    Event.observe(this.dragSource, 'mousedown', this.onMouseDownProxy.bind(this));
    Event.observe(window.document, 'mousemove', this.onMouseMoveProxy.bind(this));
    Event.observe(window.document, 'mouseover', this.onMouseOverProxy.bind(this));
    Event.observe(window.document, 'mouseup', this.onMouseUpProxy.bind(this));
  },
  getRowObj: function(elmnt) {
    if (elmnt) { //log('element name='+elmnt.nodeName);
      if (elmnt.nodeName == 'TD' || elmnt.nodeName == 'TH') {
        return $(elmnt.parentNode);
      }
    }
    return null;
  },
  startDragPopup: function(src) {
    try {
      this.dragDiv = new Element('div', {
        'style': 'position:absolute;top:-100px',
        'class': 'drag'
      });
      if (this.isSourceTable) {
        var tbl = new Element('table');
        this.dragDiv.appendChild(tbl);
        var tbody = new Element('tbody');
        tbl.appendChild(tbody);
        tbody.appendChild(src.cloneNode(true));
      } else this.dragDiv.appendChild(src.cloneNode(true));
      document.body.appendChild(this.dragDiv);
    } catch(e) {}
  },
  removeDragPopup: function() {
    if (this.dragDiv) {
      document.body.removeChild(this.dragDiv);
      this.dragDiv = null;
    }
  },
  // mouse down
  onMouseDownProxy: function(e) {
    document.onselectstart = onDisableSelect;
    var cell = e.element();
    if (this.isSourceTable) {
      var row = this.getRowObj(cell);
      if (row) {
        this.sourceObj = row;
        this.onMouseDown(e, row);
      }
    } else {
      this.sourceObj = cell;
      this.onMouseDown(e, cell);
    }
    this.startDragPopup(this.sourceObj);
    try {
      this.dragDiv.style.height = px(this.sourceObj.clientHeight);
      log('webponent.DragDropProxy> mouse down ' + this.isSourceTable);
      this.dragStart = true;
    } catch(e) {}
  },
  onMouseDown: function(e) {},
  onMouseMoveProxy: function(e) {
    if (this.dragStart) {
      this.dragDiv.style.left = e.clientX + 'px';
      this.dragDiv.style.top = e.clientY + 'px'; //log('webponent.DragDropProxy> mouse move');
      this.onMouseMove(e);
    }
  },
  onMouseMove: function(e) {},
  // mouse over
  onMouseOverProxy: function(e) { //log('xxxxxxxxx over');
    if (this.dragStart) {
      var cell = e.element();
      var row = this.getRowObj(cell);
      if (row) {
        if (this.targetObj) {
          this.targetObj.removeClassName(FOCUS_CLASSNM);
        }
        if (this.dragSource == row.parentNode.parentNode) return;
        this.targetObj = row;
        this.targetObj.addClassName(FOCUS_CLASSNM);
      }
      this.onMouseOver(e); //log('webponent.DragDropProxy> mouse over');
    }
  },
  onMouseOver: function(e) {},
  onMouseUpProxy: function(e) {
    document.onselectstart = null;
    if (this.dragStart) {
      log('webponent.DragDropProxy> mouse up2s2');
      this.dragStart = false;
      if (this.targetObj) {
        this.targetObj.removeClassName(FOCUS_CLASSNM);
      }
      var cell = e.element();
      if (this.isSourceTable) {
        var row = this.getRowObj(cell);
        if (row) {
          this.onMouseUp(e, this.sourceObj, row);
        }
      } else {
        this.onMouseUp(e, this.sourceObj, cell);
      }
      this.removeDragPopup();
    }
    log('webponent.DragDropProxy> mouse up');
  },
  onMouseUp: function(e) {}
};
/*******************************************************************************
 * webponent.HtmlGrid
 * 
 ******************************************************************************/
var FOLDED = 'treegridFolderIcon';
var UNFOLDED = 'treegridUnfolderIcon';
var NO_CHILD = 'treegridNoChildIcon';

/*
var FOLDED = 'plus.gif';
var UNFOLDED = 'minus.gif';
var NO_CHILD = 'blank.gif';
*/

var STYL_VIEW = 'block';
var SCROLL_BAR_SIZE = 0;
if (Prototype.Browser.Gecko) STYL_VIEW = '';
webponent.HtmlGrid = Class.create();

webponent.HtmlGrid.prototype = {
  initialize: function(tblId, width, height, arg) {
    this.tbl = $(tblId);
    if (!this.tbl) {
      alert('ERROR:not defiend ' + tblId);
      return;
    };
    this.tbl.setAttribute('border','0');
    if(width==null || width=='') width='100%';
    this.width = width;
    this.height = height;
    this.tblHead = $(this.tbl.select('thead')[0]);
    this.tblCols = $(this.tbl.select('colgroup')[0]);
    this.tblBody = $(this.tbl.select('tbody')[0]); // todo
    var footer = $(this.tbl.select('tfoot')[0]);
    if (footer) {
      //this.tbl.removeChild(footer);
    }
    this.arg = arg;
    if (!arg) this.arg = '';
    this.width = width;
    this.isRelativeWidth = false;
    if (this.width && this.width.indexOf('%') > 0) {
      this.isRelativeWidth = true;
      this.relativeWidth=this.width;
    } 
    // attribute
    this.selRowArray = new Array();
    this.isTreeMode = false;
    this.multiSelectMode = false; // control
    this.seqSelectMode = false; // shift
    this.columnSortBind = null // sort 
    this.fldSort = null; // sort
    this.sortType = null; // sort
    this.preTableWidth;
    // this.imgURL = '../../img/'; // sort 
    this.imgURL = webponent.imgRootPath; 
    this.reqURL = null;
    this.pars = 0; // server source
    this.servSortUrl = null;
    this.tDoResize = null; // resize 
    this.tStopResize = null; // resize
    // event handler
    this.onreset;
    this.onselect;
    this.ondelete;
    this.onFinishEdit;
    this.onDataError;
    this.onDblclick;
    this.onSucessUpdateBody;
    
    this.preTblOutlineWidth;
    
    // grid scrolling
    this.preVp=0;
    this.scrllVGap=23;
    //if(Prototype.Browser.Gecko) this.scrllVGap=22;
    
    //attribute
    this.columnResizable=true;
    if(this.arg.columnResizable=='false' || this.arg.columnResizable==false || this.arg.autoColumnResizable)
    	this.columnResizable=false;
    	
    this.selectClssNm=SELECT_CLASSNM;
    if(this.arg.selectClassName!=null)
    	this.selectClssNm=this.arg.selectClassName;
    
    this.scrollBarWidth = SCROLL_BAR_SIZE;
    if (!SCROLL_BAR_SIZE || SCROLL_BAR_SIZE == 0) {
      var inner = document.createElement('p');
      inner.style.width = '100%';
      inner.style.height = '200px';
      var outer = document.createElement('div');
      outer.style.position = 'absolute';
      outer.style.top = '0px';
      outer.style.left = '0px';
      outer.style.visibility = 'hidden';
      outer.style.width = '200px';
      outer.style.height = '150px';
      outer.style.overflow = 'hidden';
      outer.appendChild(inner);
      document.body.appendChild(outer);
      var w1 = inner.offsetWidth;
      outer.style.overflow = 'scroll';
      var w2 = inner.offsetWidth;
      if (w1 == w2) w2 = outer.clientWidth;
      document.body.removeChild(outer);
      SCROLL_BAR_SIZE = (w1 - w2);
      this.scrollBarWidth = SCROLL_BAR_SIZE; // alert(this.scrollBarWidth);
    }
    this._initFixTableHtml();
    this._initLayout();
    this.tbl.style.display='';
    this._initSortFunc();
    this._initColumnResize();
   
    if (this.arg.popupMenu == true) {
      this._setPopupMenuObj();
      this._initPopupMenu();
      
      this._columnCtrl();
    }
    this.tblCalcWidth;
   
    
    this._initSetTableHeadMeta();
    
    this.resizing();
    
    /*		
    if (this.tblCalcWidth > 0) { //alert(tblWidth);
      //this.tblHeadOutline.width = px(tblWidth);
    } else {
      try {
    	  var cw=this.tblOutline.clientWidth;
    	  if(cw>this.scrollBarWidth) {
    	  if(Prototype.Browser.IE8) {
    		  this.tblHeadOutline.width = px(cw- this.scrollBarWidth+5);
    		  
    	  }else {
           this.tblHeadOutline.width = px(cw- this.scrollBarWidth );
    	  }
    	  }
      }catch(e) {}
    }
    
    */
    
    
    
    this._registEvent();
  
    log('webponent.HtmlGrid> init complete'); // alert(this.tbl.parentNode.parentNode.innerHTML);
    
  },
  _initFixTableHtml: function() {
    if (!this.tblCols) {
      var colsgrp = new Element('colgroup');
      for (var i = 0,
      i2 = this.tblHead.rows[0].cells, i3 = i2.length; i < i3; i++) {
        var c = i2[i].getAttribute('colspan');
        if (!c) c = 1;
        for (var j = 0; j < c; j++) {
          var cols = new Element('col');
          colsgrp.appendChild(cols);
        }
      }
      //this.tbl.insertBefore(colsgrp, this.tblBody);
      //this.tbl.insertBefore(colsgrp, this.tblHead);
      
      this.tblCols = colsgrp;
    }
  },
  
  
  
  
  
  
  _grd_th_sort:function(event)  {
	    var obj=event.element();
		
		var th=$(obj.parentNode.parentNode);
		
		this.columnSort(null, th);
		if( this.sortType == 'asc'){
			obj.value='2';
		}else {
			obj.value='xx';
		}
		/*
		var d=parseInt(th.getAttribute('x'));
		var type='string';
		try{
			var typeClssNm = th.className;
			var i=typeClssNm.indexOf('Type');
			type=typeClssNm.substring(0,i);
			
		}catch(e){}
		this.sortRow(d, 'dsc', type);
		*/
  },
  
  _grd_th_onfcs:function(e) {
	  
		obj=e.element();
		obj.parentNode.style.width="";
		obj.parentNode.style.height="";
		if( this.sortType == 'asc'){
			obj.value='xx';
		}else {
			obj.value='xx';
		}
		this.resizing();
		
		this._grid_th_mv(obj);
	},
	_grid_th_mv:function(obj) {
		//0419
		var xy = this.getPosition(obj, this.tblOutline);
		if(xy[0]>this.tblOutline.offsetWidth) {
			var d=xy[0]-this.tblOutline.offsetWidth+obj.offsetWidth;
			this.tblBodyOutline.scrollLeft=d;
			log(xy[0] +' > '+ this.tblOutline.offsetWidth);
		}
	},
	
	_grd_th_onblur:function(e) {
		obj=e.element();
		obj.parentNode.style.width="0px";
		obj.parentNode.style.height="0px";
		this.resizing();
		
		this._grid_th_mv(obj);
	},
  
  
  ///xxxxxxx
  _initSetTableHeadMeta: function() {

		
	 
    for (var i = 0,i2 = this.tblHead.rows; i < i2.length; i++) {
      for (var j = 0,j2 = i2[i].cells; j < j2.length; j++) {
        var t = this._getCellIndex(j2[j]);
        j2[j].setAttribute('x', t.x);
        j2[j].setAttribute('y', t.y); // alert('>>'+ this.hiddenColsArray[t.x].getAttribute("width")
        
        var el=$(j2[j]);
        if(el.hasClassName('stringType')||el.hasClassName('intType')||el.hasClassName('dateType')||el.hasClassName('extType1')||el.hasClassName('extType2')||el.hasClassName('extType3')) {
        	
        	var sortBtn= new Element('input', {
        		  'id' : 'cjux_sortHiddenBtn',
        	      'type': 'button',
        	      'value': 'xxx',
        	      'style': 'font-size:90%;'
        	    });
        	// 0419
        	var sortBtnDiv= new Element('div', {
      	      'style': 'display:block;width:0px;height:0px;overflow:hidden;padding:0px;margin:0px;'
      	    });
        	sortBtnDiv.appendChild(sortBtn);
        	el.appendChild(sortBtnDiv);
        	
        	
        	Event.observe(sortBtn, 'click', this._grd_th_sort.bind(this)); 
        	Event.observe(sortBtn, 'focus', this._grd_th_onfcs.bind(this));
        	Event.observe(sortBtn, 'blur', this._grd_th_onblur.bind(this));
        }

        // remove hidden header title
        var hc=this.tblHiddenHead.rows[i].cells[j];
        //hc.setAttribute('hTitle',hc.innerHTML);
        hc.innerHTML='';
        
        // );
        var w = this.hiddenColsArray[t.x].getAttribute("width");
        
        if (w && w > 0) {
          var c=j2[j].getAttribute('colspan');
          //j2[j].setAttribute("width", w+'px');
          if(c==null || c=='1') {
             j2[j].style.width=px(w);
          }
        }
        else {
        	//alert(j2[j].offsetWidth);
        	//this.hiddenColsArray[t.x].setAttribute("width", j2[j].offsetWidth );
        }
        this._fixCellWidthInfo(j2[j]);
      }
    }
    
    var tblWidth = 0;
    for (var i = 0; i < this.hiddenColsArray.length; i++) {
      try {
        var w = this.hiddenColsArray[i].getAttribute("width");
        //alert(i+'>'+w +' '+this.hiddenColsArray[i].style.display);
        
        
        
        if(w==null || w=='') {
        	if(this.hiddenColsArray[i].style.display=='none') {
        	  w=0;
        	}
        	else {
        	  tblWidth=0;
        	  break;
        	}
        	
        	
        }
        
        if(w.indexOf('%')>0) {tblWidth=0;break;}
    	w = parseInt(w);
        
        if (w > 0) {
          tblWidth = tblWidth + w;
        } 
      } catch(e) {
    	
        tblWidth = 0;
      }
    }
    this.tblCalcWidth=tblWidth;
    
    
    //check
    if (tblWidth > 0) { //alert(tblWidth);
      this.tblHeadOutline.width = px(tblWidth);
    } else {
      var w=this.tblOutline.clientWidth-this.scrollBarWidth;
      //if(Prototype.Browser.IE8) w=w+10; // IE8 bug?

      //if(Prototype.Browser.oldIE) w=w-10;
      
      this.tblHeadOutline.width= px(w);
      
    }
    
    if(Prototype.Browser.IE8) {
    	var cssTxt = '';
        for (var i = 0; i < this.hiddenColsArray.length; i++) {
          var txtAlign = this.hiddenColsArray[i].style.textAlign;
          if (!txtAlign || txtAlign.length == 0) {
            txtAlign = this.hiddenColsArray[i].align;
          }
          if(txtAlign=='') txtAlign=webponent.gridTextAlign;
          cssTxt = cssTxt + '#' + this.tbl.id + ' tbody tr > td ';
          for (var j = 0; j < i; j++) {
            cssTxt = cssTxt + '+ td';
          }
          cssTxt = cssTxt + ' {text-align:' + txtAlign + '} ';
        }
        try {
        	var ss = document.createElement('style');
            ss.setAttribute("type", "text/css");
            ss.styleSheet.cssText = cssTxt;
            
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(ss);
          } catch(e) {
            //alert('IE8 dynamic css create error '+e.messege);
          }
    }else if(Prototype.Browser.IE6||Prototype.Browser.IE7){
    	for (var i = 0; i < this.hiddenColsArray.length; i++) {
            var txtAlign = this.hiddenColsArray[i].style.textAlign;
            if (!txtAlign || txtAlign.length == 0) {
              txtAlign = this.hiddenColsArray[i].align;
            }
            if(txtAlign=='') { txtAlign=webponent.gridTextAlign; }
            
            
            
            alert(txtAlign);
            
            this.hiddenColsArray[i].align = txtAlign;
            
            
            
            
        }
    }
 
    else if ( !Prototype.Browser.IE) {
      var cssTxt = '';
      for (var i = 0; i < this.hiddenColsArray.length; i++) {
        var txtAlign = this.hiddenColsArray[i].style.textAlign;
        if (!txtAlign || txtAlign.length == 0) {
          txtAlign = this.hiddenColsArray[i].align;
        }
        if(txtAlign=='') txtAlign=webponent.gridTextAlign;
        cssTxt = cssTxt + '#' + this.tbl.id + ' tbody tr > td ';
        for (var j = 0; j < i; j++) {
          cssTxt = cssTxt + '+ td';
        }
        cssTxt = cssTxt + ' {text-align:' + txtAlign + '} ';
      }
      try {
        var styleEmnt = new Element('style', {
          'type': 'text/css'
        });
        
        styleEmnt.appendChild(document.createTextNode(cssTxt));
        document.body.appendChild(styleEmnt);
      } catch(e) {
        alert('dynamic css create error '+e.messege);
      } //document.write('<style>'+cssTxt+'</style>');
      
    }
    
    //0903
    //this.tblHeadOutline.width
    var tblHeadW=0;
    
    if(this.arg.autoColumnResizable!=true) {
    for (var i = 0,i2 = this.tblHead.rows; i < i2.length; i++) {
        for (var j = 0,j2 = i2[i].cells; j < j2.length; j++) {
          var t = this._getCellIndex(j2[j]);
          var w = this.hiddenColsArray[t.x].getAttribute("width");
          
          if (w && w > 0) {
        	  tblHeadW=tblHeadW+parseInt(w);
          }
          else {
          	//alert(j2[j].offsetWidth);
          	//this.hiddenColsArray[t.x].setAttribute("width", j2[j].offsetWidth );
        	w = px(j2[j].offsetWidth);
        	w=parseInt(w);
        	tblHeadW=tblHeadW+parseInt(w);
        	this.hiddenHeadColsArray[t.x].setAttribute("width",  w);
        	//this.tblHeadCols.childNodes[t.x].setAttribute("width",  w);
        	//this.hiddenColsArray[t.x].setAttribute("width",  w);
        	///j2[j].style.width=w;
        	//alert( this.tblHeadCols.parentNode.innerHTML );
          }
        }
      }
    }
    
  },
  _registEvent: function() {
    Event.observe(this.tblOutline, 'click', this.onTblClick.bind(this));
    
    Event.observe(this.tbl, 'dblclick', this.onDblclickFnc.bind(this));
    
    
    if (Prototype.Browser.IE) {
      Event.observe(this.tbl, 'keydown', this.onTblKeyDn.bind(this));
      Event.observe(window.document, 'keyup', this.onTblKeyUp.bind(this));
    } else {
      Event.observe(window, 'keydown', this.onTblKeyDn.bind(this));
      Event.observe(window, 'keyup', this.onTblKeyUp.bind(this));
    }
    Event.observe(this.tbl, 'mousedown', this.mouseDnSelfDrag.bind(this));
    Event.observe(window.document, 'mouseup', this.mouseUpSelfDrag.bind(this)); // event Column Sort
    this.columnSortBind = this.columnSort.bind(this);
    Event.observe(this.tblHead, 'mousedown', this.columnSortBind); // event Column Resize
    
    // multi header
    if (this.tblHead.rows.length < 5) {
      Event.observe(this.tblHead, 'mousemove', this.changeCursorState.bind(this));
      Event.observe(this.tblHead, 'mousedown', this.startColumnResize.bind(this));
    }
    this.resizingEvent = this.resizing.bind(this);

    this._regTblReszEvnt(true);
    
    this._scrollVerticalEvnt=this._scrollVertical.bind(this);
    Event.observe(this.tblBodyOutline, 'scroll', this._onTblBodyScroll.bind(this)); // event regist
    //Event.observe(this.tblBodyOutline, 'scroll', this._scrollVerticalEvnt); // event regist
    
    /* 0419
    try {
      layoutEvent.regist(this.resizing.bind(this));
      gridEvent.regist(this.resizing.bind(this));
    } catch(e) {}
    */
  },
  onDblclickFnc:function(e) {
	try {
	  this.onDblclick.bind(this)(this,e);
	  
	  var sel ;
		if(document.selection && document.selection.empty){
		   document.selection.empty() ;
		} else if(window.getSelection) {
		 sel=window.getSelection();
		 if(sel && sel.removeAllRanges)
		  sel.removeAllRanges() ;
		}
	
	}catch(e) {}
	
	
	
  },
  _scrollVertical:function() {
	  if(this.isResizing) return;
	  this.isResizing=true;
	  
	  Event.stopObserving(this.tblBodyOutline, 'scroll', this._scrollVerticalEvnt);
	  
	  
	  var gv=this.scrllVGap;
	  var v=this.tblBodyOutline.scrollTop;
	  var x=Math.abs(v-this.preVp);
	  
	  if(v>=this.preVp) 
		  x=Math.ceil( x/gv)*gv;
	  else
		  x=Math.ceil( x/gv)*gv*-1;
	  log(v+' ' +this.preVp+' > '+x);
	  
	  v=this.preVp+x;
	  
	  this.tblBodyOutline.scrollTop = v;
	  
	  Event.observe(this.tblBodyOutline, 'scroll', this._scrollVerticalEvnt); // event regist
	  
	  this.preVp=v;
	  this.isResizing=false;
	  
	  
  },
  _chkTblWidthChg:function() {
	
	  if(this.preTblOutlineWidth != this.tblOutline.offsetWidth) {
	
		  this.preTblOutlineWidth = this.tblOutline.offsetWidth;
		  this.resizing();
	  }
	  //0419
	  setTimeout(this._chkTblWidthChg.bind(this), 100);
  },
  
  _regTblReszEvnt:function(isActive) {
	  
	  setTimeout(this._chkTblWidthChg.bind(this), 50);
	  /*
	  Event.observe(this.tblOutline.parentNode, 'propertychange', this.resizingEvent);
	  Event.observe(this.tblOutline.parentNode, 'DOMAttrModified', this.resizingEvent);
	  Event.observe(this.tblOutline.parentNode, 'DOMSubtreeModified', this.resizingEvent);
	  Event.observe(this.tblOutline.parentNode, 'resize', this.resizingEvent);
	  */
	  
	  //deprecated
	  return;
	  
	  if(isActive) {
	    Event.observe(this.tbl, 'DOMNodeInserted', this.resizingEvent);
	    Event.observe(this.tbl, 'resize', this.resizingEvent);
	  }else {
	    Event.stopObserving(this.tbl, 'DOMNodeInserted', this.resizingEvent);
	    Event.stopObserving(this.tbl, 'resize', this.resizingEvent);
	  }
  },
  
  _initLayout: function() {
    this.tbl.cellPadding = "0px";
    this.tbl.cellSpacing = "0px";
    this.tbl.width='1px';
    this.tblOutline = new Element('div', {
      'class': 'tableContainer',
      'style': 'text-align:left;overflow:hidden;'
    });
    this.tblOutlineStyle = this.tblOutline.style; // this.tblOutline.onselectstart = function(){return false;};// there ???
    this.tbl.style.display = 'none';
    try {
      this.tbl.parentNode.insertBefore(this.tblOutline, this.tbl.next());
    } catch(e) {
      this.tbl.parentNode.appendChild(this.tblOutline);
    }
    //check
    this.tblOutline.style.width=this.width;
    this.tblOutline.style.overflowX = 'hidden';
    if (this.width) {
      this.tblOutlineStyle.width = px(this.width); //alert(this.width);
      // this.tblOutlineStyle.overflowX = 'hidden';
      //>>this.tblOutlineStyle.width = this.tblOutline.offsetWidth;
    }
    this.tbl.style.display = ''; // table header outline(table)
    var widthTxt = '';
    if (!this.isRelativeWidth) {
      widthTxt = 'width:' + px(this.width);
    }
    var headerDisplay=null;
    if(this.arg.displayHeader=='none')
    	headerDisplay='height:0px';
    this.tblHeadDiv = new Element('div', {
      'class': 'tableHeadDiv',
      'style': 'text-align:left;'+headerDisplay
    });
    this.tblOutline.appendChild(this.tblHeadDiv);
    this.tblHeadDiv.style.overflowX = 'hidden';
    if(headerDisplay!=null) {
    	this.tblHeadDiv.style.overflowY = 'hidden';
    }
    this.tblHeadDiv.onselectstart = function() {
      return false;
    };
    
    var tblLayout='table-layout:fixed;';
    if(this.arg.autoColumnResizable==true) {
    	tblLayout='';
    }
    this.tblHeadOutline = new Element('table', {
      'class': 'tableHeadOutline',
      'width': '0px',
      'cellpadding': '0px',
      'cellspacing': '0px',
      'style': tblLayout
    });
    this.tblHeadDiv.appendChild(this.tblHeadOutline);
    this.tblHiddenHead = this.tblHead;
    this.tblHead = this.tblHead.cloneNode(true);
    this.tblHeadOutline.appendChild(this.tblHead);
    this.tblHeadOutline.cellPadding = "0px";
    this.tblHeadOutline.cellSpacing = "0px";
    this.tblHiddenHead.style.display = 'none';
    this.hiddenColsIdxArray = new Array();
    this.hiddenColsArray = new Array();
    this.hiddenHeadColsArray = new Array();
    if (this.tblCols) {
    	// multi header
      if (this.tblHead.rows.length > 0) {
        this.tblHeadCols = this.tblCols.cloneNode(true);
        //this.tblHeadOutline.appendChild(this.tblHeadCols);
        this.tblHeadOutline.insertBefore(this.tblHeadCols, this.tblHead);
      }
      var h = this.tblCols.childNodes;
      
      var idx = 0;
      for (var i = 0,n = h.length; i < n; i++) {
        if (h[i].nodeName == 'COL') {
          this.hiddenColsArray[this.hiddenColsArray.length] = h[i];
          h[i].style.width = '';
          if (h[i].style.display == 'none') {
        	  
            this.hiddenColsIdxArray[this.hiddenColsIdxArray.length] = idx;
            
            if(!Prototype.Browser.oldIE) this.tblHead.rows[0].cells[idx].style.display='none';
            
          }
          idx++;
        }
      }
      //0903
      h = this.tblHeadCols.childNodes;
      var idx = 0;
      for (var i = 0,n = h.length; i < n; i++) {
          if (h[i].nodeName == 'COL') {
            this.hiddenHeadColsArray[this.hiddenHeadColsArray.length] = h[i];
            
          }
        }
      
      
      //0903
      /*
      for (var i = 0,
      m = this.hiddenColsArray.length; i < m; i++) {
        if (this.hiddenColsArray[i].style.width == '') {
          this.hiddenColsArray[i].style.width = this.tblOutline.clientWidth / m; // alert(this.hiddenColsArray[i].style.width );
        }
      }
      */
    } // table body outline (div)
    this.tblBodyOutline = new Element('div', {
      'class': 'tableBodyOutline',
      'tabindex':'0',
      'style': 'text-align:left;width:100%;margin:0px 0px;'
    });
    this.tblOutline.appendChild(this.tblBodyOutline);
    this.tblBodyOutline.appendChild(this.tbl);
    this.tblOutline.appendChild(this.tblBodyOutline);
    this.tblBodyOutline.style.overflowX = 'hidden';
    
    var overflowY=this.arg.overflowY;
    
    if(overflowY==null) overflowY='scroll';
    
    	
    if (this.height) {
    	this.tblBodyOutline.style.overflowY = overflowY;
    }
    else this.tblBodyOutline.style.overflowY = 'hidden';
    //if(Prototype.Browser.Gecko) this.tbl.style.backgroundImage="url('"+webponent.imgRootPath+"table_body_bg_ff.jpg')"; 
    //else this.tblBodyOutline.style.backgroundImage="url('"+webponent.imgRootPath+"table_body_bg.jpg')"; 
    
     /*
    if(Prototype.Browser.IE6||Prototype.Browser.IE7)this.tblBodyOutline.style.backgroundImage="url('"+webponent.imgRootPath+"table_body_bg.jpg')";
    else if(Prototype.Browser.Gecko) this.tbl.style.backgroundImage="url('"+webponent.imgRootPath+"table_body_bg_ff.jpg')";
    else this.tbl.style.backgroundImage="url('"+webponent.imgRootPath+"table_body_bg.jpg')";
    */
    
    if(this.arg.useTableBG!=false) {
      if(Prototype.Browser.IE6||Prototype.Browser.IE7)this.tblBodyOutline.addClassName('tableBodyBackgoundForNotFirefox');
      else if(Prototype.Browser.Gecko) this.tbl.addClassName('tableBodyBackgoundForFirefox');
      else this.tbl.addClassName('tableBodyBackgoundForNotFirefox');
    }
    
   
    
    
    this.tblStyle = this.tbl.style;
    this.tblStyle.tableLayout = 'fixed';
    this.isFullHeight = false;
    if (this.height) {
      if (this.height == '100%') this.isFullHeight = true;
      this.tblOutlineStyle.height = this.height;
      /*
      if (this.tblOutline.offsetHeight < 100) {
        this.tblOutlineStyle.height = 100;
      }
      */
    }
    if (!this.arg.isFixedWidth) {
      try {
        //var adjSize = 0;
        //if (Prototype.Browser.IE) adjSize = 1; //this.tblHeadOutline.width=this.tblOutline.clientWidth-adjSize-this.scrollBarWidth;
      } catch(e) {
        alert('this.tblHeadOutline.style.width ' + e.message);
      }
    }
  },
  _initColumnResize: function() { // Column control
    this.arrTdSz = []; // Column visible
    this.columnChkDiv = new Element('div', {
      'style': ' width:120px; background-color:#eee; border: solid 1px #999;'
    });
    this.columnChkDiv.style.position = "absolute";
    this.columnChkDiv.style.display = 'none';
    this.unVisiableColCnt = 0;
  },
  _initSortFunc: function() { // sort 
    var margin = "margin:2px 0px 0px 0px;top:0px; left:3px;";
    
    if (Prototype.Browser.IE8) {
    	margin = "";
    }
    else if (Prototype.Browser.IE || Prototype.Browser.Gecko) {
      margin = "margin:-10px 0px 0px 0px;top:0px; left:3px;";
    }	
    this.sortImg;
    if(Prototype.Browser.IE7 || Prototype.Browser.IE6) {
     this.sortImg = new Element('div', {
    	      'style': 'position:relative;top:3px;left:8px;margin:-15px -5px;float:left;vertical-align:top;', 'class':'sortDescIcon'
    	});
    }else{
      this.sortImg = new Element('div', {
      //'style': 'position:relative;top:3px;left:8px;margin:0px -5px;float:left;', 'class':'sortDescIcon'
    	  'style': 'position:relative;top:3px;left:8px;margin:-15px -5px;float:left;vertical-align:top;', 'class':'sortDescIcon'
      });
    }
    
    
    
    this.sortImg.style.display = "none"; // sort 
    this.tblOutline.parentNode.appendChild(this.sortImg);
    
  },
  // 
  addSelRow: function() {
    var tr = document.createElement("TR");
    var c = this.tblHead.rows[0].cells;
    var inputBox;
    var arrTd = [];
    for (var j = 0; j < c.length; j++) {
      arrTd[j] = document.createElement("TD");
      arrTd[j].innerHTML = ' &nbsp; ';
      tr.appendChild(arrTd[j]);
    }
    this.tblBody.appendChild(tr);
    this.tblBodyOutline.scrollTop = 10000;
  },
  moveRowScroll: function(idx) {
    try {
      var td = this.tblBody.rows[idx].cells[0];
      this.tblBodyOutline.scrollTop = td.offsetHeight * (idx);
    } catch(e) {
      alert(e.message);
    }
  },
  addActionRow: function(outCondition, hash, sumField) {
    var tr = document.createElement("TR");
    var c = this.tblHead.rows[0].cells;
    
    var arrTd = [];
    var content = [];
    
    if(outCondition != null){ 
	  if(outCondition instanceof Array){
    	for(var i = 0; i < outCondition.size(); i++){
    		var temp = outCondition.get(outCondition[i].key);
    		
    		Event.observe($(temp[1]), 'click', this.getData.bind(this,hash,content,arrTd,outCondition));
    		if(sumField == true)
    			content[j].observe(event, this.rowAction.bind(this));
		}
	  } else {
		  Event.observe($(outCondition), 'keyup', this.getData.bind(this,hash,content,arrTd,outCondition));
			  		  if(sumField == true)
  			content[j].observe(event, this.rowAction.bind(this));
	  }
    }
    
	for (var j = 0; j < this.tblCols.childNodes.length; j++) {
    	arrTd[j] = document.createElement("TD");
 	
    	if(hash.isContain(j)){
    		var temp = hash.get(j);    		
    		var event = 'click';
				
    		if(temp[0] == 'select'){
    			var vector = temp[2];
    			var text = vector[0];
    			var price = vector[1];
			  
    			content[j] = document.createElement("select");
			 
    			for(var i=0; i<5; i++){
					var option =  document.createElement("option");
					option.innerText = text[i];
					option.value = price[i];
					content[j].appendChild(option);
    			}
    			content[j].style.width = '100%';
    		} else {
    			content[j] = document.createElement("INPUT");
    			
    			content[j].type = temp[0];
    			
    			if(temp[2] == null) content[j].value = '';
    			else content[j].value = temp[2];
    			
    			content[j].style.border = '0px';
    			if((this.tblBody.rows.length % 2) == 0)content[j].style.background = '#FFFFFF';
    			else content[j].style.background = '#F8F8F6';
			  
    			if(temp[0] == 'text') event = 'keyup';
    			
    			var label = document.createElement("label");
    			if(temp[0] == 'radio') label.innerHTML = temp[1];
    			else label.innerHTML = temp[3]; 
    		}
			  
    		content[j].id = temp[1] + '_' + this.tblBody.rows.length;
			  
    		if(temp[3] == null) content[j].name = '';
    		else content[j].name = temp[3] + '_' + this.tblBody.rows.length;

    		arrTd[j].appendChild(content[j]);
			  
    		if(temp[0] != 'select'&& temp[3] != null)  arrTd[j].appendChild(label);  

    		Event.observe(content[j], event, this.getData.bind(this,hash,content,arrTd,outCondition));
    		if(sumField == true)
    			content[j].observe(event, this.rowAction.bind(this));
    		
    	}
    	else {
    		if(j == 0){
    				arrTd[j].innerHTML = this.tblBody.rows.length+1;
    		}
    		else{
    			arrTd[j].innerHTML = ' &nbsp; ';  
    		}
    	}
    	tr.appendChild(arrTd[j]);
	}
    this.tblBody.appendChild(tr);
    this.tblBodyOutline.scrollTop = 10000;
  },
  getData: function(hash, content, arrTd, outCondition) {
		var values = HashMap();

 	    for(var i=0; i<hash.size(); i++){
 	    	var key = content[hash[i].key].id;
 	    	var key_type = content[hash[i].key].type;
 	    	key = key.split('_');

 	    	var name = content[hash[i].key].name;

 	    	if(key_type == 'radio'){
 	    		var condition = document.getElementsByName(name);
				for(var k = 0; k < condition.length; k++){
	  				if(condition[k].checked == true) {
	  					name = name.split('_');
	  					values.putValue(name[0], condition[k].value);
	  					break;
	  				}	    				
				}
 	    	}
 	    	else{
 	    		values.putValue(key[0], eval("$F(content[hash[" + i + "].key].id)"));
 	    	}
 	    }

 	    if(outCondition != null){
 	    	if(outCondition instanceof Array){
 	    		for(var j=0; j<outCondition.size(); j++){
 	    			var temp = outCondition.get(outCondition[j].key);
 	    			if(temp[0] == 'radio'){
 	    				var condition = document.getElementsByName(temp[1]);
 	    				
 	    				for(var k = 0; k < condition.length; k++){
 	    					if(condition[k].checked == true) {
 	    						values.putValue(temp[1], condition[k].value);
 	    					}
 	    				}
 	    				break;
 	    			}
 	    			else{
 	    				values.putValue(temp[1], $F(temp[1]));
 	    			}
 	    		}
 	    	} 
 	    	else {
 	    		values.putValue(outCondition, $F(outCondition));      	    		
 	    	}
 	    }
 	    
 	   this.onDataChange(arrTd, values); 
  },
  rowAction:function(e){
	var idy = this.tblBody.rows.length;
	var idx = this.tblCols.childNodes.length;
	var list = new HashMap();

	for(var i = 0; i < idy; i++){
		var val_arr = new Array();
		
		for (var j = 0; j < idx ; j++) {
			var id_txt = this.tblBody.rows[i].cells[j].innerHTML.split(' ');
			
			for(var k=0; k<id_txt.length; k++){
				if(id_txt[k].indexOf('id') != -1){
					var value = id_txt[k].substring(3, id_txt[k].length);

					if($F(value) == null || $F(value) == ' ') val_arr[j] = 0;
					else val_arr[j] = $F(value);
				}
			}
		}
		list.putValue(i, val_arr);		
	}
	setSumAction(list);	
  },
  updateSumValue: function(gridObj, arr){
	  
	var tmpDiv = new Element('div');
	var tr = document.createElement("TR");
	var arrTd = [];
	for (var j = 0; j < this.tblCols.childNodes.length; j++) {
		arrTd[j] = document.createElement("TD");
		if(arr.isContain(j)){
			arrTd[j].innerHTML = arr.get(j);
		}else{
			arrTd[j].innerHTML = ' ';
		}
		tr.appendChild(arrTd[j]);
	}
	  
	tmpDiv.innerHTML = '<table><tbody id=' + this.tblBody.id + '>' + tr.innerHTML + '</tbody></table>';
	    
	this.tbl.removeChild(this.tblBody);
	    
	var tmp = tmpDiv.firstChild.firstChild;
	this.tbl.appendChild(tmp);
	    
	this.tblBody = tmp;
	this.resizing();
  },  
  moveRowScroll: function(idx) {
    try {
      var td = this.tblBody.rows[idx].cells[0];
      this.tblBodyOutline.scrollTop = td.offsetHeight * (idx);
    } catch(e) {
      alert(e.message);
    }
  }, 
  searchData: function(url, pars, mode) {
    this.reqURL = url;
    var id = this.tblBody.id;
    if (mode == 'add') {
      if (pars == 0) {
        this.deleteTblBody();
      }
      pars = ++this.pars;
    } else {
      this.deleteTblBody();
    }
    var params = "page=" + pars;
    this.requestBody(url, id, params, mode); // ??u
  },
  deleteTblBody: function() {
    try {
      this._updateTableBody();
    } catch(e) {
      alert(e.message);
    }
    /*
		 * while(this.tblBody.rows.length > 0) {
		 * this.tblBody.removeChild(this.tblBody.rows[0]); }
		 */
    this.pars = 0;
  },
  printBody: function(t) {
    var tbCtnt = t.responseText.strip();
    if (tbCtnt != '') {
      this.tableInnerHTML(this.tblBody, tbCtnt);
    }
  },
  updateBody: function(url, params) {
    if (this.waitImgPanel) {
      return;
    }
    if(params.refreshMode!=true)
      this.deleteTblBody();
    if (!params) {
      params = new Object();
    }
    params.onSuccess = this._updateTableBody.bind(this);
    params.onFailure = this._updateTableBodyFail.bind(this);
    if(params.refreshMode!=true)
      this._showJobProcessingIcon();
    new Ajax.Request(url, params);
  },
  _updateTableBodyFail: function(transport) {
    this._hiddenJobProcessingIcon();
    try {
    	var errMsg='server process fail. reponse code:' + transport.status;
    	if(this.onDataError) {
    		this.onDataError.bind(this)(errMsg)
    	}else {
    		//alert(errMsg);
    	}
    }catch(e) {}
    
  },
  _showJobProcessingIcon: function() {
    this.waitImgPanel = new Element('div', {
      'style': 'width:99%;border:0px solid #f00;'
    });
    
    var img = new Element('div', {
      'valign': 'baseline',
      'class':'displayProcessStatusImage' 	  
    });
    this.waitImgPanel.appendChild(img);
    this.tblBodyOutline.appendChild(this.waitImgPanel);
    
  },
  _hiddenJobProcessingIcon: function() {
    if (this.waitImgPanel) {
      this.waitImgPanel.parentNode.removeChild(this.waitImgPanel);
      this.waitImgPanel = null;
    }
  },
  updateBodyFromGrid:function(gridObj) {
	  

	  var tmpDiv = new Element('div');
	    
	    tmpDiv.innerHTML = '<table><tbody id=' + this.tblBody.id + '>' + gridObj.tblBody.innerHTML + '</tbody></table>';
	    
	    this.tbl.removeChild(this.tblBody);
	    
	    var tmp = tmpDiv.firstChild.firstChild;
	    this.tbl.appendChild(tmp);
	    
	    this.tblBody = tmp;
	    this.resizing();
	  
  },
  _updateTableBody: function(transport, content) {
    if(!content) content='';
    if (transport) {
      content = transport.responseText;
      
      
    }
    
    this._hiddenJobProcessingIcon();
    var tmpDiv = new Element('div');
    
    tmpDiv.innerHTML = '<table><tbody id=' + this.tblBody.id + '>' + content + '</tbody></table>';
    
    
    
    this.tbl.removeChild(this.tblBody);
    
    var tmp = tmpDiv.firstChild.firstChild;
    this.tbl.appendChild(tmp);
    
    this.tblBody = tmp;
    this.resizing();
    
    if(this.onSucessUpdateBody) {
  	  try {
		this.onSucessUpdateBody.bind(this)(transport, this);
  	  }catch(e){}
	  }
    
    
    //this._regTblReszEvnt(true);
  },
  
  
  
  
  tableInnerHTML: function(target, rowHTML) {
    var tmpDiv = new Element('div');
    tmpDiv.innerHTML = '<table><tbody>' + rowHTML + '</tbody></table>';
    var tmpRows = tmpDiv.firstChild.rows;
    while (tmpRows.length > 0) {
      target.appendChild(tmpRows[0]);
    }
  },
  columnCtrlVisible: function() {
    document.body.appendChild(this.columnChkDiv);
    this.columnChkDiv.style.left = px( this.getPosition(this.popupDiv)[0] + this.popupDiv.offsetWidth );
    //this.columnChkDiv.style.top = px( this.getPosition(this.popupDiv)[1] + this.popupDiv.offsetHeight - 20 );
    this.columnChkDiv.style.top = px( this.getPosition(this.popupDiv)[1] );
    this.columnChkDiv.style.display = '';
  },
  _columnCtrl: function() {
    this.columnChkDiv.style.zIndex = '10000';
    var c = this.tblHead.rows[0].cells;
    this.headCheckBox = [];
    for (var i = 0; i < c.length; i++) {
      var tDiv = new Element('div', {
        'style': 'height:25px;background-color:#EEE;padding:2px;'
      });
      var tSpan = new Element('span', {
        'style': 'background-color:#EEE;padding-left:2px;'
      });
      this.headCheckBox[i] = document.createElement("INPUT");
      this.headCheckBox[i].setAttribute('type', 'checkbox');
      this.headCheckBox[i].setAttribute('value', i);
      this.headCheckBox[i].setAttribute('name', 'headCheckBox' + i);
      Event.observe(this.headCheckBox[i], 'mouseup', this.columnVisible.bind(this));
      tDiv.appendChild(this.headCheckBox[i]);
      if (parseInt(c[i].rowSpan) != this.tblHead.rows.length) this.headCheckBox[i].disabled = true;
      tSpan.innerHTML = c[i].firstChild.nodeValue;
      tDiv.appendChild(tSpan);
      this.columnChkDiv.appendChild(tDiv);
      this.headCheckBox[i].checked = true;
    }
  },
  columnVisible: function(e) {
    var c = this.tblHead.rows[0].cells.length;
    document.body.appendChild(this.popupDiv);
    document.body.appendChild(this.columnChkDiv);
    var el = e.element();
    var idx = el.value;
    this.doColumnVisible(idx);
  },
  columnVisibleEx: function(idx) {
    this.doColumnVisible(idx);
  },
  doColumnVisible: function(idx) {
    this.sortImg.style.display = 'none';
    
    
    //0904
    var tblrows = this.tblHead.rows;
    var a = new Array();
    var tblrowsCnt = tblrows.length;
    var tbSz = parseInt(this.tbl.width);
    var tblColCnt = tblrows[0].cells.length;
    var s = this.tblCols.childNodes;
    var t = '';
    var c = this.tblHead.rows[0].cells[idx];
    var idx2 = c.getAttribute('x');
    var hc = this.hiddenColsArray[idx2];
    var hc2 = this.hiddenHeadColsArray[idx2];
    t = hc.style.display;
    if (t == '') {
      el = false;
    } else {
      el = true;
    }
    
    if (!el) {
    	if(this.arg.autoColumnResizable) {
    	  alert('not support on autoColumnResizable mode');
    	  return;
    	}
    	
      if (this.unVisiableColCnt == (tblColCnt - 1)) {
        el = true;
        this.headCheckBox[idx].checked = true;
        return;
      } 
      var hSize = parseInt(c.offsetWidth);
      
      //var tSize = this.tblHeadOutline.offsetWidth;
      //var hSize = parseInt(c.style.width);
      var tSize = parseInt(this.tblHeadOutline.width);
      if (parseInt(c.rowSpan) < this.tblHead.rows.length) {
        el = true;
        this.headCheckBox[idx].checked = true;
        return;
      }
      
      
      
      hc.setAttribute("width",hSize);
      c.setAttribute("pre-width",hSize);
      
      // IE7,IE6 table line remain bug
      c.style.width='0px';
      
      hc2.removeAttribute("width");
      
      if(!isNaN(hSize) ) {
    	  
          var w= px(tSize - hSize);
          this.tblHeadOutline.width = w;
      }
      
      this.preElmnt=null;
      

      
      
      this.resizing();
      
      this.tblOutlineStyle.display='none';
      
      if(  !Prototype.Browser.oldIE) {
        c.style.display = 'none';
      }
      
      //hc.style.display = 'none';
      //if(  !Prototype.Browser.IE || Prototype.Browser.IE8)
      
      
      hc2.style.display = 'none';
       
      
      
      
      this.tblOutlineStyle.display='block';
      
      this.unVisiableColCnt++; //if(this.tblStyle.width != '100%') {
      //   this.tblHeadOutline.style.width = tbSz - this.arrTdSz[idx];
      //}
      if (Prototype.Browser.IE) this.headCheckBox[idx].checked = false;
    } else {
    	
      // IE8 bug?	
      this.tblOutlineStyle.display='none';	
      
      
      c.style.display = '';
      //hc.style.display = '';
      hc2.style.display = '';
      
      
      //var hSize = parseInt(c.style.width);
      var hSize = parseInt(c.getAttribute("pre-width"));
      c.style.width=px(hSize);
      
      var tSize = parseInt(this.tblHeadOutline.width);
      if(!isNaN(hSize)) {
       this.tblHeadOutline.width = tSize + hSize;
      }
      
      this.tblOutlineStyle.display='block';
      
      this.unVisiableColCnt--;
      if (this.tbl.width != '100%') { // this.tblStyle.width = tbSz + this.arrTdSz[idx];
        //this.tblHeadOutline.style.width = tbSz + this.arrTdSz[idx];
      }
      if (Prototype.Browser.IE) this.headCheckBox[idx].checked = true;
    }
    
    
    this.resizing(idx);
    
    

  },
  _adjustHeadCols: function() {
    for (var i = 0; i < this.hiddenHeadColsArray.length; i++) {
      document.body.appendChild(this.hiddenHeadColsArray[i]);
      var status = this.hiddenHeadColsArray[i].getAttribute("status");
      if (status != 'hidden') {
        this.tblHeadCols.appendChild(this.hiddenHeadColsArray[i]);
      }
    }
  },
  setExcelFilename: function(name) {
    this.saveExcelFilename = name;
  },
  excelDownLoad: function(url) {
    //if (typeof(url) != 'string') url = '/coreframe/transform';
    url = url + '/transform';

    //var tblContent = this.tbl.innerHTML;
    //var tblContent = this.getXmlText({skipTableTag: true});
    var tblContent = '<thead>'+get_xhtml(this.tblHead)+'</thead><tbody>' + get_xhtml(this.tblBody)+'</tbody>';
    
    
    exForm = document.createElement("FORM");
    exForm.name = 'exDown';
    exForm.method = 'post';
    exForm.action = url; // hidden field 
    var hdField = document.createElement("INPUT");
    hdField.type = 'hidden';
    hdField.name = 'ctnt';
    hdField.value = tblContent;
    var hdField2 = document.createElement("INPUT");
    hdField2.type = 'hidden';
    hdField2.name = 'filename';
    if(this.saveExcelFilename==null)
    	//this.saveExcelFilename = this.tbl.id;
        this.saveExcelFilename = "Data";
    hdField2.value = this.saveExcelFilename+'.xls';
    exForm.appendChild(hdField);
    exForm.appendChild(hdField2);
    document.body.appendChild(exForm);
    exForm.submit();
  },
  
  exportFile: function(type, url ) {
	    if (typeof(url) != 'string') url = '/coreframe/transform';
	    //var tblContent = this.tbl.innerHTML;
	    //var tblContent = this.getXmlText({skipTableTag: true});
	    var tblContent = get_xhtml(this.tbl);
	    
	    exForm = document.createElement("FORM");
	    exForm.name = 'exDown';
	    exForm.method = 'post';
	    exForm.action = url; // hidden field 
	    var hdField = document.createElement("INPUT");
	    hdField.type = 'hidden';
	    hdField.name = 'ctnt';
	    hdField.value = tblContent;
	    var hdField2 = document.createElement("INPUT");
	    hdField2.type = 'hidden';
	    hdField2.name = 'filename';
	    if(this.saveExcelFilename==null)
	    	this.saveExcelFilename = this.tbl.id;
	    hdField2.value = this.saveExcelFilename+'.'+type;
	    exForm.appendChild(hdField);
	    exForm.appendChild(hdField2);
	    document.body.appendChild(exForm);
	    exForm.submit();
	  },
	  
	  
  columnSort: function(e, el) { // alert(e.isLeftClick());
    
    
    if(e!=null) {
    	if (!e.isLeftClick()) return;
        if (this.onSorting) return;
        
        var isRsz = this._chkResizeArea(e);
        if(isRsz) return;
        
    	el=e.element();
    }
    
    this.outEditMode();
    //this.unselectRow();
    var nodeVal;
    var headIdx;
    var mutiHeaderHeight = 0;
    
    if (el.nodeName != 'TH') {
      if (el.nodeName != 'SPAN') return;
      else el = el.parentNode;
    }
    
    //check2
    
    
    
    // text
    //var type = el.getAttribute('ext-type');
    var type=null;
    if(el.hasClassName('stringType')) type='string';
    else if(el.hasClassName('intType')) type='int';
    else if(el.hasClassName('dateType')) type='date';
    else if(el.hasClassName('extType1')) type='ext1';
    else if(el.hasClassName('extType2')) type='ext2';
    else if(el.hasClassName('extType3')) type='ext3';
    
    
    if (type != null) {
      this.onSorting = true;

      /*
       * var tArr = new Array();
      var tblHeadRows = this.tblHead.rows;
      if (tblHeadRows.length > 1) {
        headIdx = el.getAttribute('ext-columnIndex');
      } else { // headIdx = el.cellIndex;
        headIdx = el.getAttribute('x');
      }
      */
      
      headIdx = el.getAttribute('x');
      
      
      
      
      //var p = this.getPosition(el);
      
      
      
      //this.tbl.style.display='none';
      
      if (type == 's') this.servSortRow(el, headIdx, this.sortType);
      else this.sortRow(headIdx, this.sortType, type);
      
      //this.tbl.style.display='';
      
       
      
       this._fixSortImgPosition(el);
      
       
       
       if (this.fldSort == headIdx) {
           if (this.sortType == 'dsc') {
             this.sortImg.className='sortAscIcon';
             this.sortType = 'asc';
           } else {
             this.sortImg.className='sortDescIcon';
             this.sortType = 'dsc';
           }
           
         } else {
           this.sortImg.className='sortDescIcon';
           this.sortType = 'dsc'
         }
       this.onSorting = false;
       this._redrawTbl();
       
    }
    
  },
  _redrawTbl:function() {
	  // cause : IE8 table refresh bug
	  if (!Prototype.Browser.IE8) return; 
	  this.tblHeadOutline.style.display='inline';
	  setTimeout(this._refreshTbl.bind(this),1);
  
  },
  _refreshTbl:function() {
	  this.tblHeadOutline.style.display='table';
      //this.resizing();
	  
  },
  
  
  _fixSortImgPosition:function(el){
	  
	  this.preElmnt;
	  
	  try {
	  if(el==null) {
		  el=this.preElmnt;
		  
	  }else {
		  this.preElmnt=el;
	  }
	  
	  var s=this.sortImg.style;
	  s.display='block';
	  /*
	  if($(el).visible())
		  s.display='block';
	  else
		  s.display='none';
	  */	  
		  
	  //var p=findPosition(el);
	  //s.left=px(p[0]+3);
      //s.top=px(p[1]+7);
	  $(el).appendChild(this.sortImg);
      
	  }catch(e) {
		  this.sortImg.style.display='none';
		  
	  }
 },
  
  servSortRow: function(el, idx, sortType) {
    var id = this.tblBody.id;
    this.fldSort = idx;
    this.deleteTblBody();
    var sortCol = el.getAttribute('d-col');
    var url = this.reqURL;
    var pars = "col=" + sortCol + "&sort=" + sortType;
    this.requestBody(url, id, pars); // Body request
    
  },
  
  sortExt1:function(a,b) {
	var a1=a.node.firstChild;
	var b1=b.node.firstChild;
  	var t1=a1.getAttribute("class");
  	var t2=b1.getAttribute("class");
  	
  	if(t1==t2) {
  		
  		var va = a1.childNodes[1].nodeValue;
  		var vb = b1.childNodes[1].nodeValue;
  		
  		var r=(va/1- vb/1);
  		//alert(t1 + ' '+t2 + ' '+r +' '+va+' ' +vb);
  		return r;
  		//return 0;
  	}else if(t1=='up'|| t2=='down') {
  		return 1;
  	}else {
  		return -1;
  	}
  },
  sortExt2:function(a,b) {
	  return 0;
  },
  sortExt3:function(a,b) {
	  return 0;
  },
  sortRow: function(idx, sortType, type) {
	  log(idx+' ' +sortType+' '+type+'<');
	this.isResizing=true;  
    this.seq = 0;
    this.seq++;
    
   
    
    this.fldSort = idx;
    sortNum = function(a, b) {
     try {
      a = a.value;
      b = b.value;
     }catch(e){}
     try{
      a = a.replace(/,/g, '');
      b = b.replace(/,/g, '');
      
      if (a.indexOf('/') >= 0) a = eval(a);
      if (b.indexOf('/') >= 0) b = eval(b);
      }catch(e) { }
      try {
      return parseFloat(a) - parseFloat(b);
      }catch(e){ return -1; }
    };
    sortStr = function(a, b) {
      a = a.value;
      b = b.value;
      if (a.toUpperCase() < b.toUpperCase()) return - 1;
      if (a.toUpperCase() > b.toUpperCase()) return 1;
      return 0;
    };
    
    sortDate = function(a, b) {
      var RegExpHG = /[^(0-9|a-z|A-Z|\s)]/;
      aVal = 0;
      bVal = 0;
      a = a.value;
      b = b.value;
      if (a) {
        try {
          var aVal = Date.parse(a); // || (Date.parse("01/01/1900"));
          if (!aVal) {
            a = a.replaceAll('-', ' ').replace(RegExpHG, '');
            aVal = Date.parse(a);
          }
          if (!aVal) {
            x = a.split(' ');
            a = x[2] + '/' + x[1] + '/' + x[0];
            aVal = Date.parse(a);
            if (!aVal) aVal = 0;
          }
        } catch(e) {}
      }
      if (b) {
        try {
          var bVal = Date.parse(b); // || (Date.parse("01/01/1900"));
          if (!bVal) {
            b = b.replaceAll('-', ' ').replace(RegExpHG, '');
            bVal = Date.parse(b);
          }
          if (!bVal) {
            x = b.split(' ');
            b = x[2] + '/' + x[1] + '/' + x[0];
            bVal = Date.parse(b);
            if (!bVal) bVal = 0;
          }
        } catch(e) {}
      }
      return aVal - bVal;
    };
    var tbRow = this.tblBody.rows;
    
    var tbRowCnt = tbRow.length;
    if(tbRowCnt==0) return;
    var colArr = [];
    var rowArr = new Array(tbRowCnt);
    for (var i = 0; i < tbRowCnt; i++) {
      var r = tbRow[i];
      var c = r.cells[idx];
      var v = c.firstChild;
      colArr[i] = {};
      colArr[i].o = i + 1;
      colArr[i].value = (v != null) ? v.nodeValue: '';
      colArr[i].node = c;
      rowArr[i] = r;
    }
    
      if (type == 'int') {
    	  try {
    	  colArr.sort(sortNum);
    	  }catch(e) {
    		 //alert( e.message);  
    	  }
      }
      
      
      else if (type == 'date') colArr.sort(sortDate);
      else if (type == 'string') colArr.sort(sortStr);
      else if (type == 'ext1') colArr.sort(this.sortExt1);
      else if (type == 'ext2') colArr.sort(this.sortExt2);
      else if (type == 'ext3') colArr.sort(this.sortExt3);
      
    
    if (Prototype.Browser.IE) {
      if (sortType == 'dsc') {
        for (var i = colArr.length - 1; i >= 0; i--) {
          var r = rowArr[colArr[i].o - 1];
          this.tblBody.appendChild(r);
        }
      } else {
        for (var i = 0,
        k = colArr.length; i < k; i++) {
          var r = rowArr[colArr[i].o - 1];
          this.tblBody.appendChild(r);
        }
      }
    } else {
      var tmpDiv = new Element('tbody', {
        'id': this.tblBody.id
      });
      if (sortType == 'dsc') {
        for (var i = colArr.length - 1; i >= 0; i--) {
          var r = rowArr[colArr[i].o - 1];
          tmpDiv.appendChild(r.cloneNode(true)); // for Google chrome
        }
      } else {
        for (var i = 0,
        k = colArr.length; i < k; i++) {
          var r = rowArr[colArr[i].o - 1];
          tmpDiv.appendChild(r.cloneNode(true));
        }
      }
      this.tbl.removeChild(this.tblBody);
      this.tbl.appendChild(tmpDiv);
      this.tblBody = tmpDiv;
    }
    
    
    
    this.isResizing=false;
  },
  _chkResizeArea:function(e) {
	  var el = e.element();
	    var size = el.offsetWidth;
	    var iLeft = el.offsetLeft;
	    var pos;
	  var btsz;
	    if (Prototype.Browser.IE) {
	      pos = e.offsetX;
	      pos = pos || iLeft;
	      btsz = size - pos;
	    } else {
	      pos = this.getPosition(el, this.tblOutline)[0];
	      var scrLeft = this.tblOutline.scrollLeft;
	      var check = e.clientX + (((!Prototype.Browser.IE) && (el.tagName == "DIV")) ? el.offsetLeft: 0) + scrLeft;
	      btsz = size + (pos - check);
	    }
	    
	    if(btsz < 5)
	    	return true;
	    else
	    	return false;
	    
	    
  },
  
  changeCursorState: function(e) {
	  var el = e.element();
    var isRsz = this._chkResizeArea(e);
    
    var cs=el.getAttribute('colspan');
    if(cs==null) cs=1; 
    cs=parseInt(cs);
    
    if (isRsz && this.columnResizable && cs==1) {
      el.style.cursor = "e-resize";
    } else {
      el.style.cursor = "default";
    }
  },
  getPosition: function(oNode, pNode) {
    if (!pNode) var pNode = document.body
    var oCurrentNode = oNode;
    var iLeft = 0;
    var iTop = 0;
    while ((oCurrentNode) && (oCurrentNode != pNode)) {
      iLeft += oCurrentNode.offsetLeft - oCurrentNode.scrollLeft;
      iTop += oCurrentNode.offsetTop - oCurrentNode.scrollTop;
      oCurrentNode = oCurrentNode.offsetParent;
    }
    if (pNode == document.body) {
      if (Prototype.Browser.IE) {
        if (document.documentElement.scrollTop) iTop += document.documentElement.scrollTop;
        if (document.documentElement.scrollLeft) iLeft += document.documentElement.scrollLeft;
      } else if (!Prototype.Browser.Gecko) {
        iLeft += document.body.offsetLeft;
        iTop += document.body.offsetTop;
      }
    }
    return new Array(iLeft, iTop);
  },
  startColumnResize: function(e) {
	  
	  
    if (!e.isLeftClick()) return;
    
    var el = e.element();
    var pos = e.clientX;
    var size = el.offsetWidth;
    var el2;
    var size2 = 0;
    try {
      el2 = this.tblHead.rows[0].cells[el.cellIndex + 1];
      size2 = el2.offsetWidth;
    } catch(e) {}
    //0904
    //var tblwidth = parseInt(this.tblHeadOutline.getAttribute("width"));
    var tblwidth = parseInt(this.tblHeadOutline.offsetWidth);
    
    if (el.tagName == "TH" && el.style.cursor != "default") {
      if (this.tStopResize) {
        this.stopResize(e);
      }
      this.tDoResize = this.doResize.bindAsEventListener(this, el, pos, size, el2, size2, tblwidth);
      this.tStopResize = this.stopResize.bind(this);
      Event.observe(this.tblOutline, 'mouseup', this.tStopResize);
      Event.observe(document.body, 'mouseup', this.tStopResize);
      Event.observe(this.tblOutline, 'mousemove', this.tDoResize);
      Event.stopObserving(this.tblHead, 'mousedown', this.columnSortBind);
    }
  },
  stopResize: function(e) {
	  
    Event.stopObserving(this.tblOutline, 'mousemove', this.tDoResize);
    Event.stopObserving(this.tblOutline, 'mouseup', this.tStopResize);
    Event.stopObserving(document.body, 'mouseup', this.tStopResize);
    Event.stopObserving(this.tblHead, 'mousedown', this.columnSortBind);
    Event.observe(this.tblHead, 'mousedown', this.columnSortBind); // this.tblHead = null;
    this.tblHead.onmouseup = '';
    document.body.onmouseup = '';
    this.tStopResize = null; // >> this.tblHiddenHead.style.display = 'none';
    
    
    this.resizing();
    this._redrawTbl();
  },
  //0904
  doResize: function(e) {
	  
	if(this.workColResize) return;
	
	this.workColResize=true;
	
	
    var tblData = new Array(6);
    tblData = $A(arguments);
    tblData.shift();
    var el = tblData[0];
    var pos = tblData[1];
    var size = tblData[2];
    var el2 = tblData[3];
    var size2 = tblData[4];
    var tblWidth = tblData[5];
    el.style.cursor = "E-resize";
    var gap = e.clientX - pos;
    var colSz = size + gap; // var tblWSz = e.clientX - pos;
   
    
    var x=parseInt(el.getAttribute('x'));
    var cw=el.getAttribute('colspan');
    if(cw==null) cw=1;
    cw=parseInt(cw);
    
    this.tblHeadOutline.width = '';
    
    //this.tblHeadOutline.width = px(tblWidth + gap-10);
    //
    
    
    var y=el.getAttribute('y');
    
    var colSize=px(colSz < 15 ? 15 : colSz);
    
    this.tblHeadOutline.width = px(tblWidth + gap-1);
    el.style.width = colSize;
    
    
    // multi header
    for(var j=0,m=this.tblHead.rows.length;j<m;j++) {
    	
    	if(j!=y) {
    	
    		
    		var r=this.tblHead.rows[j];
    		for(var p=0;p<r.cells.length;p++) {
    			var c=r.cells[p];
    			var rx=parseInt(c.getAttribute('x'));
    			var rw=c.getAttribute('colspan');
    			if(rw==null) rw=1;
    			rw=parseInt(rw);
    			
    			var gx=x;
    			if(cw>0) {
    				gx=gx+cw;
    				//alert(cw+ ' '+gx );
    			}
    			
    			if(rw==1) {
    			if(gx>rx && gx<=(rx+rw)) {
    				//alert(j+' x=' +p+' pre_x='+x+' '+rx+' '+rw+' >'+(rx+rw));	
    				
    				if(gx==rx && cw==rw) {
    					c.style.width= colSize;
    					//c.style.width= '';
    					//c.setAttribute('width',colSize);
    				}else{
      				  var colSz2 = parseInt(c.offsetWidth) + gap ; // var tblWSz = e.clientX - pos;
    				  c.style.width= px(colSz2 < 15 ? 15 : colSz2);
    				  
    				  //c.style.width= '';
  					  //c.setAttribute('width',px(colSz2 < 15 ? 15 : colSz2));
    				}
    				break;
    			}
    			}
    			else {
    				c.style.width= 'auto';
    			}
    		}
    	}
    	if(j==0){
    		var colIdx=x;
    		if(!Prototype.Browser.IE)
    			colIdx=x*2+1;
    		try{
    			
    		this.tblHeadCols.childNodes[colIdx].setAttribute('width', colSize);
    		
    		}catch(ee){}
    	}
    }
    
    
    //var tblWSz = e.clientX - pos;
    //if (!this.isRelativeWidth) 
    
	
    this._fixSortImgPosition();
    
    
    
    this.workColResize=false;
    
  },
  reset: function() {
    log('webponent.HtmlGrid> reset'); // this.tblBody.style.display = 'none';
    if (this.onreset) {
      log('webponent.HtmlGrid> call reset function');
      this.onreset.bind(this)(this);
    }
    this.resetComplete();
  },
  resetComplete: function() {
	  
    if (Prototype.Browser.Gecko) {
    	
      var r = this.tbl.rows;
      for (var i = 0,
      n = r.length; i < n; i++) {
        var cr = r[i];
        for (var j = 0,
        k = this.hiddenColsIdxArray.length; j < k; j++) {
        	
          cr.cells[this.hiddenColsIdxArray[j]].style.display = 'none';
        }
      }
    }
    if (this.isTreeMode) {
      this.setTreeTableMode(this.levelIdx, this.titleIdx, this.isDragable);
    } // this.resizing();
    // this.tblBody.style.display = 'block';
  },
  initFooter: function() {
    var footer = this.tbl.select('tfoot');
    if (footer) footer = footer[0];
    if (footer && !this.footDiv) {
      this.footDiv = new Element('div', {
        'style': 'height:25px;background-color:#ddd;padding:2px;'
      });
      var outlineNext = this.tblOutline.next();
      if (outlineNext) this.tblOutline.parentNode.insertBefore(this.footDiv, outlineNext);
      else this.tblOutline.parentNode.appendChild(this.footDiv);
      this.appendFootMenu(' 1 ', this.changeViewLevel.bind(this));
      this.appendFootMenu(' 2 ', this.changeViewLevel.bind(this));
      this.appendFootMenu(' 3 ', this.changeViewLevel.bind(this));
      this.appendFootMenu(' All ', this.changeViewLevel.bind(this));
      this.appendFootMenu(' Excel', this.excelDownLoad.bind(this)); // ??????
      this.footDiv.appendChild(new Element('span').update(' &nbsp;&nbsp; '));
    }
  },
  appendFootMenu: function(label, func) {
    var btn = new Element('input', {
      'type': 'button',
      'value': label
    });
    this.footDiv.appendChild(btn);
    Event.observe(btn, 'click', func);
    return btn;
  },
  changeViewLevel: function(e) {
    var tblRows = this.tblBody.rows;
    var len = tblRows.length;
    var baseLevel = e.element().getAttribute("value");
    try {
      baseLevel = parseInt(baseLevel);
      if (!baseLevel) baseLevel = 1000;
    } catch(e) {
      baseLevel = 1000;
    }
    log('changeViewLevel : baseLevel=' + baseLevel);
    for (var i = 0; i < len; i++) {
      var r = tblRows[i];
      var depth = this.getLevel(r);
      if (depth <= baseLevel) {
        r.style.display = STYL_VIEW;
        var c = r.cells[this.titleIdx];
        var selImgObj = selImgObj = c.firstChild; // first is span
        if (selImgObj.className && selImgObj.className!=NO_CHILD) {
          //if (depth == baseLevel) selImgObj.src = webponent.imgPath + FOLDED;
        	if (depth == baseLevel) selImgObj.className = FOLDED;
          //else selImgObj.src = webponent.imgPath + UNFOLDED;
        	else selImgObj.className = UNFOLDED;
        }
      } else {
        r.style.display = 'none';
      }
    }
  },
  onTblKeyDn: function(e) {
    var k = e.keyCode;
    if(k==13) {
    	this.outEditMode();
    	return;
    	//this.unselectRow(false);
    }
    
    if (!this.seqSelectMode && k == 16) {
      this.seqSelectMode = true;
      log('SHIFT SELECT ??? ????  keydown ' + k);
    }
    if (!this.multiSelectMode && k == 17) {
      this.multiSelectMode = true;
      log('???SELECT ??? ????  keydown ' + k);
    }
  },
  onTblKeyUp: function(e) {
    var k = e.keyCode;
    if (k == 16) {
      this.seqSelectMode = false;
      
    }
    if (k == 17) {
      this.multiSelectMode = false;
      
    }
  },
  _initPopupMenu: function() {
    Event.observe(this.tbl, 'mousedown', this.onRightMouseDn.bind(this));
    
    Event.observe(window.document, 'click', this.onRightMouseDn2.bind(this)); // Event.observe(this.tbl, 'mouseup', this.onRightMouseUp.bind(this) );
    document.oncontextmenu = function() {
      return false;
    }
  },
  _setPopupMenuObj: function() {
    this.popupDiv = new Element('div', {
      'style': 'position:absolute;z-index:1000;'
    });
    this.popupDiv.className = 'popup';
    this.popupDiv.style.position = 'absolute';
    Event.observe(this.popupDiv, 'mouseover', this.popupMouseOv.bind(this));
    Event.observe(this.popupDiv, 'mouseout', this.popupMouseOut.bind(this)); // default menu
    if (this.isTreeMode) {
      this.addPopupMenu('move up', this.upSelRow.bind(this));
      this.addPopupMenu('move down', this.downSelRow.bind(this));
      this.addPopupMenu('delete select row', this.deleteSelRow.bind(this));
      this.addPopupMenu('delete all', this.deleteAllRow.bind(this));
    }
    
    if (this.tblHead.rows.length == 1) {
      this.addPopupMenuMouseOver('columns', this.columnCtrlVisible.bind(this));
    }
    //this.addPopupMenu('add row', this.addSelRow.bind(this));
  },
  addPopupMenuSplit: function() {
    var mn = new Element('div', {
      'style': 'background-color:#ddd;z-index:1000;'
    });
    this.popupDiv.appendChild(mn);
  },
  addPopupMenu: function(name, func) {
    var mn = new Element('div');
    mn.update(name);
    Event.observe(mn, 'click', func);
    Event.observe(mn, 'click', this.popupMouseOut.bind(this));
    this.popupDiv.appendChild(mn);
  },
  addPopupMenuMouseOver: function(name, func) {
    var mn = new Element('div');
    mn.update(name);
    Event.observe(mn, 'mouseover', func);
    Event.observe(mn, 'mouseout', this.popupMouseOut.bind(this));
    this.popupDiv.appendChild(mn);
  },
  onRightMouseDn2: function(e) { // log('onRightMouseDn2');
    this.removePopup();
  },
  onRightMouseDn: function(e) {
	  
    if (!e.isLeftClick()) {
      log('onRightMouseDn');
      if (this.selRowArray.length == 0) {
      }
      
      this.removePopup();
      document.body.appendChild(this.popupDiv);
      this.popupDiv.style.left = e.pointerX() + 'px';
      this.popupDiv.style.top = e.pointerY() + 'px';
      
      this.mouseDnSelfDrag(e,true);
      
      log('onRightMouseDn end');
    }
  },
  popupMouseOv: function(e) {
    m = e.element();
    m.addClassName('popup-mouseover');
  },
  popupMouseOut: function(e) {
    m = e.element();
    m.removeClassName('popup-mouseover');
  },
  getLevel: function(row) {
    try {
      return parseInt(row.cells[this.levelIdx].firstChild.nodeValue);
    } catch(e) { // log( this.levelIdx + '> ' + e);
    }
    return 0;
  },
  // up
  upSelRow: function(e) {
    var firstSelRow = this.selRowArray[0];
    var pre = this.getPreviousSibling(firstSelRow);
    if (pre) {
      this.moveSelectRow(pre, false);
    }
    this.removePopup();
  },
  // down
  downSelRow: function(e) {
    var firstSelRow = this.selRowArray[0];
    var next = this.getNextSibling(firstSelRow);
    if (next) {
      next = this.getNextSibling(next);
      if (next) {
        this.moveSelectRow(next, false);
      }
    }
    this.removePopup();
  },
  getParent: function(row) {
    var level = this.getLevel(row);
    var preRow = row.previous();
    while (preRow) {
      var preLevel = this.getLevel(preRow);
      if (level > preLevel) return preRow;
      preRow = preRow.previous();
    }
    return null;
  },
  getPreviousSibling: function(row) {
    var level = this.getLevel(row);
    var preRow = row.previous();
    while (preRow) {
      var preLevel = this.getLevel(preRow);
      if (level == preLevel) return preRow;
      if (preLevel < level) return null;
      preRow = preRow.previous();
    }
    return null;
  },
  getNextSibling: function(row) {
    var level = this.getLevel(row);
    var nextRow = row.next();
    while (nextRow) {
      var nextLevel = this.getLevel(nextRow);
      if (level == nextLevel) return nextRow;
      if (nextLevel < level) return null;
      nextRow = nextRow.next();
    }
    return null;
  },
  // delete
  deleteSelRow: function(e) {
    if (this.isTreeMode) {
      var r = this.selRowArray[0];
      var preSibling = this.getPreviousSibling(r);
      var nextSibling = this.getNextSibling(r);
      var parent = this.getParent(r);
      if (parent && !preSibling && !nextSibling) {
        this._changeTitleImg(parent, NO_CHILD);
      }
    }
    var f;
    if (this.ondelete) {
      f = this.ondelete.bind(this);
    }
    try {
      f(this.selRowArray, this);
    } catch(e) {}
    for (var i = (this.selRowArray.length - 1); i >= 0; i--) {
      this.tblBody.removeChild(this.selRowArray[i]);
    }
    this.removePopup();
  },
  // delete all
  deleteAllRow: function(eventOrForce) {
    if (eventOrForce == true || window.confirm('Do you really delete all of row?')) {
      var f;
      if (this.ondelete) {
        f = this.ondelete.bind(this);
      }
      var bodyRows = this.tblBody.rows;
      try {
        f(bodyRows, this);
      } catch(e) {}
      /*
         for(var i = (bodyRows.length - 1); i >= 0;i -- ) {
            this.tblBody.removeChild( bodyRows[i] );
         }
         */
      this._updateTableBody();
    }
    this.removePopup();
  },
  removePopup: function(e) {
    try {
      document.body.removeChild(this.popupDiv);
      document.body.removeChild(this.columnChkDiv);
      
      this.unselectRow();
    } catch(e) {}
  },
  setTreeTableMode: function(lvlIdx, tleIdx, isDragable) {
	this._regTblReszEvnt(false);
	  
    this.isTreeMode = true;
    this.levelIdx = lvlIdx;
    this.titleIdx = tleIdx;
    var tblRows = this.tblBody.rows;
    var len = tblRows.length;
    var preCell;
    var preDepth;
    
    for (var i = 0; i < len; i++) {
      var r = tblRows[i];
      var depth = this.getLevel(r);
      var selCell = r.cells[this.titleIdx];
      this.processTitle(preCell, preDepth, selCell, depth, isDragable);
      preDepth = depth;
      preCell = selCell;
    }
    this.processTitle(preCell, preDepth, null, -1, isDragable);
    this.isDragable = isDragable;
    if (this.isDragable) {
      Event.observe(this.tbl, 'mouseover', this.mouseOvSelfDrag.bind(this)); // Event.observe(b, 'mousemove', this.mouseMvSelfDrag.bind(this) );
      // Event.observe(document, 'selectstart', onDisableSelect );
      document.onselectstart = onDisableSelect;
    }
    this.initFooter();
    
    this._regTblReszEvnt(true);
    
  },
  /*
	 * getNextSibling : function (row) { var level =
	 * parseInt(row.cells[this.levelIdx].innerHTML);
	 * 
	 * var selChild; var nxt = row.next(); while(nxt) { var crntLvl =
	 * parseInt(nxt.cells[this.levelIdx].innerHTML); if(crntLvl <= level) {
	 * return nxt; } nxt = nxt.next(); } return null; },
	 */
  // appendChildRow
  appendChildRow: function(target, row) {
    this.unselectRow();
    var insertPreRow = this.getNextSibling(target);
    this._changeTitleImg(target, UNFOLDED);
    if (insertPreRow) {
      this.tblBody.insertBefore(row, insertPreRow);
    } else {
      this.tblBody.appendChild(row);
    }
    var lvl = this.getLevel(target);
    if (isNaN(lvl)) lvl = 0;
    var depth = lvl + 1;
    row.cells[this.levelIdx].innerHTML = depth;
    var imgObj = new Element('span', {
      //'src': webponent.imgPath + NO_CHILD,
      'class': NO_CHILD,
      'style': 'margin-right:5px;margin-left:' + this.getImgMargin(depth) + 'px'
    });
    var cell = row.cells[this.titleIdx];
    var lbl = cell.firstChild;
    cell.insertBefore(imgObj, lbl);
    this.selectRow(row);
  },
  processTitle: function(cell, depth, nexCell, nextDepth, isDragable) {
    if (cell == null) return; // TD in < span > & bnsp; < / span > < img > text 3 type
    var l = cell.childNodes.length;
    for (var i = 2; i >= 0 && i < l; i--) {
      cell.removeChild(cell.childNodes[i]);
    }
    var lbl = cell.firstChild; // var txt = cell.firstChild.nodeValue;
    var imgObj;
    if (depth < nextDepth) {
      imgObj = new Element('span', {
        //'src': webponent.imgPath + UNFOLDED,
    	'class': UNFOLDED,
        'style': 'margin-right:5px;margin-left:' + this.getImgMargin(depth) + 'px'
      });
    } else {
      imgObj = new Element('span', {
        //'src': webponent.imgPath + NO_CHILD,
    	'class': NO_CHILD,
        'style': 'margin-right:5px;margin-left:' + this.getImgMargin(depth) + 'px'
      });
    }
    cell.insertBefore(imgObj, lbl);
  },
  getImgMargin: function(level) {
    return ((level - 1) * 10);
  },
  // --
  updateRow: function(rowObj, level, mode) {
    rowObj.cells[this.levelIdx].innerHTML = level; // img
    var img = rowObj.cells[this.titleIdx].firstChild;
    img.style.marginLeft = this.getImgMargin(level) + 'px';
    if (mode) {
      img.src = webponent.imgPath + mode;
    }
  },
  //
  selectRow: function(selTr, isMultiSelection, callEvent, e) {
    row = $(selTr);
    this.selRow = row;
    if(isMultiSelection==null)
    	isMultiSelection=this.multiSelectMode;
    if (!isMultiSelection && !this.seqSelectMode) {
    	this.unselectRow();
    	this.selRowArray = new Array();
    }
    if (this.seqSelectMode && this.selRowArray.length > 0) {
      log('select mode by shift key');
      var p = this.selRowArray[0];
      var baseIdx = selTr.rowIndex;
      var isTopDown = true;
      if ((baseIdx - p.rowIndex) < 0) {
        isTopDown = false; // p = this.selRowArray[this.selRowArray.length - 1];
      }
      var tmp = new Array();
      tmp[0] = p;
      if (isTopDown) p = p.next();
      else p = p.previous();
      for (var i = 1; (p != null && baseIdx != p.rowIndex) && i < 1000; i++) {
        tmp[i] = p;
        if (isTopDown) p = p.next();
        else p = p.previous();
      }
      tmp[tmp.length] = selTr;
      if (tmp.length > 1) {
        this.unselectRow();
        this.selRowArray = tmp;
        for (var i = 0,
        n = tmp.length; i < n; i++) {
          tmp[i].addClassName(this.selectClssNm);
        }
      }
      if (this.onselect && callEvent!=false) {
        this.onselect.bind(this)(this, callEvent);
      }
      return;
    } 
    if (isMultiSelection && row.hasClassName(this.selectClssNm)) {
      row.removeClassName(this.selectClssNm);
      var tmp = new Array();
      for (var k = 0,
      n = this.selRowArray.length; k < n; k++) {
        if (this.selRowArray[k].rowIndex != row.rowIndex) tmp[tmp.length] = this.selRowArray[k];
      }
      this.selRowArray = tmp;
      return;
    }
    row.addClassName(this.selectClssNm);
    this.selRowArray[this.selRowArray.length] = row;
    if (this.isTreeMode) {
      var selLvl = row.cells[this.levelIdx].innerHTML;
      for (var i = row.rowIndex + 1,
      n = this.tbl.rows.length; i < n; i++) {
        var r = this.tbl.rows[i];
        var lvl = r.cells[this.levelIdx].innerHTML;
        if (lvl < selLvl) {
          this.noChildRow = row.previous();
          break;
        }
        if (lvl == selLvl) break;
        r = $(r);
        r.addClassName('child-selected');
        this.selRowArray[this.selRowArray.length] = r;
      }
    }
    if (this.onselect && callEvent!=false) {
      this.onselect.bind(this)(this, e);
    }
  },
  // unselect
  moveRow: function(targetRow) {
    if (!targetRow) targetRow = this.selRow;
    if (targetRow && this.selRowArray.length > 0) { // target rowIndex
      var rowIdx = targetRow.rowIndex;
      var stx = this.selRowArray[0].rowIndex;
      var etx = stx + this.selRowArray.length - 1;
      if (rowIdx < stx || rowIdx > etx) {
        var targetLvl = this.getLevel(targetRow);
        if (!targetLvl) targetLvl = 0;
        this.moveSelectRow(targetRow.next(), true, targetLvl); // remove folder image
        if (this.noChildRow) {
          this._changeTitleImg(this.noChildRow, NO_CHILD);
        }
        if (targetLvl > 0) {
          this._changeTitleImg(targetRow, UNFOLDED);
        }
        this.selRow.removeClassName(FOCUS_CLASSNM); // this.unselectRow();
      } // if( rowIdx < stx || rowIdx > etx)
    }
  },
  _changeTitleImg: function(row, mode) {
    try {
      //row.cells[this.titleIdx].firstChild.src = webponent.imgPath + mode;
    	row.cells[this.titleIdx].firstChild.className = mode;
    } catch(e) {}
  },
  moveSelectRow: function(be, ischangeLevel, targetLvl) {
    var baseLvl = 0;
    if (ischangeLevel) baseLvl = this.getLevel(this.selRowArray[0]);
    var le = this.selRowArray[this.selRowArray.length - 1]; // last
    if (be) {
      this.tblBody.insertBefore(le, be);
    } else {
      this.tblBody.appendChild(le);
    }
    if (ischangeLevel) {
      var lvl = this.getLevel(le);
      var newLevel = targetLvl + (lvl - baseLvl) + 1;
      this.updateRow(le, newLevel);
    } // log(targetLvl + ' >> ' + baseLvl);
    for (var l = this.selRowArray.length - 2; l >= 0; l--) {
      this.tblBody.insertBefore(this.selRowArray[l], le);
      le = this.selRowArray[l];
      if (ischangeLevel) {
        lvl = this.getLevel(le);
        newLevel = targetLvl + (lvl - baseLvl) + 1;
        le.cells[this.levelIdx].innerHTML = newLevel;
        this.updateRow(le, newLevel);
      }
    }
  },
  unselectRow: function(isRemoveFocusOnly) {
    if (this.selRow && this.selRowArray.length > 0) {
      this.selRow.removeClassName(FOCUS_CLASSNM);
      this.selRowArray[0].removeClassName(this.selectClssNm);
      for (var j = 1,
      n = this.selRowArray.length; j < n; j++) {
        this.selRowArray[j].removeClassName(this.selectClssNm);
        this.selRowArray[j].removeClassName('child-selected'); // log("remove >>>>>>>>>> " + this.selRowArray[j].rowIndex);
      }
      this.selRowArray = new Array();
    }
  },
  // mouse up
  mouseUpSelfDrag: function(e) { // log('mouse up start');
	  document.onselectstart = null;
    if (this.multiSelectMode) return;
    if (this.dragDiv) {
      this.moveRow();
      document.body.removeChild(this.dragDiv);
      this.dragDiv = null;
      log('grid mouse up end');
    } //
  },
  // mouse move
  mouseMvSelfDrag: function(e) {
    if (this.dragDiv) {}
  },
  showDragDiv: function() {
    if (this.dragDiv) this.dragDiv.style.display = 'block';
  },
  // mouse over
  mouseOvSelfDrag: function(e) { // log('grid mouse over');
    if (this.dragDiv) { // this.dragDiv.style.display = 'block';
      var srcElmnt = $(e.element());
      if (this.preOverObj == srcElmnt) {
        return;
      }
      this.preOverObj = srcElmnt;
      var nodeNm = srcElmnt.nodeName;
      if (nodeNm != 'TD' && nodeNm != 'TH') return; // var ps = findPosition(srcElmnt);
      // this.dragDiv.style.top = ps[1] + "px";
      this.dragDiv.style.top = e.clientY - 10 + "px";
      var p = $(srcElmnt.parentNode);
      if (p) {
        if (this.selRow != null) {
          this.selRow.removeClassName(FOCUS_CLASSNM);
        }
        if (srcElmnt.className.indexOf(FOCUS_CLASSNM) == -1) {
          p.addClassName(FOCUS_CLASSNM); // srcElmnt.addClassName(FOCUS_CLASSNM);
          this.selRow = p;
          this.selTdObj = srcElmnt;
        }
      } else {
        this.selRow = null;
        this.selTdObj = null;
      }
    }
  },
  // mouse down
  mouseDnSelfDrag: function(e, isForce) {
	var precheck=false;
	if(isForce==true) precheck=true;
	if(!precheck)
		precheck=e.isLeftClick();
	
    if (!precheck) return;
    document.onselectstart = onDisableSelect;
    log('grid mouse dn ');
    if(isForce!=true) { this.removePopup(); }
    if (!this.multiSelectMode && !this.seqSelectMode) {
      this.unselectRow();
    } // if(this.dragDiv) return;
    var p1 = e.element(); // td
    if (p1.nodeName != 'TD') {
      if (p1.nodeName != 'SPAN') return;
      else  {
    	  //p1 = p1.parentNode;
    	  for(p1 = p1.parentNode;p1.nodeName!='TD';p1 = p1.parentNode) {
    	  }
      }
    }
    var headerCell = this.getColumnHeader(p1);
    if ($(headerCell).hasClassName('editable') == 'true') return;
    var p2 = p1.parentNode; // tr
   
    this.selectRow(p2,null,null,e);
    
    var p3 = p2.parentNode; // tbody;
    var p4 = p3.parentNode; // table;
    // tr object which change to nochild image
    this.noChildRow = null;
    if (!this.dragDiv) {
      if (!this.isDragable) return;
      if (this.titleIdx >= 0) {
        var c = p2.cells[this.titleIdx];
        var e1 = e.element();
        var txt;
        if (c == e1) {
          txt = c.childNodes[1].nodeValue;
        } else {
          c = e1;
          txt = e1.innerHTML;
        }
        this.dragDiv = new Element('div', {
          'style': 'position:absolute;'
        });
        this.dragDiv.update(' [' + (this.selRowArray.length) + '] ' + txt);
        document.body.appendChild(this.dragDiv);
        var divS = this.dragDiv.style;
        var p = findPosition(c);
        divS.left = p[0] + 10 + "px";
        divS.top = e.clientY + "px"; // divS.width = c.clientWidth + 'px';
        divS.height = px( c.clientHeight + 1);
        divS.backgroundColor = '#ffc';
        divS.color = '#333';
        divS.padding = '1px 3px';
        divS.border = '1px solid #555';
        divS.display = 'none';
        window.setTimeout(this.showDragDiv.bind(this), 200);
      } // alert(this.dragDiv.innerHTML);
    }
    
  },
  // title folder mark
  processFoldering: function(event, imgObj, parentView) {
	  
    HIDDEN = 'none';
    if (!imgObj) imgObj = event.element();
    //var p = imgObj.src;
    var p = imgObj.className;
    var display;
    var img = null;
    if (parentView == HIDDEN) {
      display = HIDDEN;
    } else if (parentView == STYL_VIEW) {
      display = STYL_VIEW;
      if (p==FOLDED) {
        return;
      }
    } else if (p==UNFOLDED) {
      display = HIDDEN;
      img = FOLDED;
      parentView = display;
    } else if (p==FOLDED) {
      display = STYL_VIEW;
      img = UNFOLDED;
      parentView = display;
    } else return;
    var td = imgObj.parentNode;
    var cellIdx = td.cellIndex;
    var tr = td.parentNode;
    var rowIdx = tr.rowIndex;
    var tbl = tr.parentNode.parentNode;
    var rowLen = tbl.rows.length;
    var depth = tr.cells[this.levelIdx].innerHTML;
    for (var i = rowIdx + 1; i < rowLen; i++) {
      var r = tbl.rows[i];
      var selDepth = r.cells[this.levelIdx].innerHTML;
      if (depth >= selDepth) break;
      if (depth <= (selDepth - 1)) r.style.display = display;
      if (parentView == HIDDEN) {
      } else if (parentView == STYL_VIEW) {
        var selImgObj = r.cells[this.titleIdx].firstChild; // window.status = '>>>>' + selImgObj.nodeName;
        if (selImgObj.className==FOLDED) {
          if (depth == (selDepth - 1)) this.processFoldering(event, selImgObj, parentView);
        }
      }
    }
    if (img != null) imgObj.className = img; // window.status = '>>>>>>' + selImgObj.nodeName + ' > ' + rowLen;
  },
  getColumnHeader: function(td) {
    for (var m = this.tblHead.rows,
    i = m.length - 1; i >= 0; i--) {
      for (var k = 0,
      k1 = m[i].cells; k < k1.length; k++) {
        if (k1[k].getAttribute('x') == td.cellIndex) return k1[k];
      }
    }
  },
  outEditMode: function() {
	
    if(this.onFinishEdit && this.preInputObj!=null) {
        
	   this.onFinishEdit.bind(this)(this.preInputObj.value.trim(), this.selInputObj.getAttribute("preValue"), this.selInputObj,this.preTrObj);
    }
	  
    try {
      this.selInputObj.innerHTML = this.preInputObj.value;
      this.selInputObj.style.padding='';
      this.selInputObj.removeClassName('editmode');
      
      this.selInputObj = null;
      this.preInputObj = null;
      if (this.preTrObj) {
        this.preTrObj.removeClassName(this.selectClssNm);
      }
    } catch(e) {}
  },
  onTblClick: function(e) { // log('webponent.HtmlGrid> onTblClick');
    // if( ! e.isLeftClick())return;
	 
    var selTdObj = e.element();
    var nodeNm = selTdObj.nodeName; // window.status = '>>' + selTdObj.nodeName;
    log('onTblClick nodename=' + selTdObj.nodeName);
    if (nodeNm == 'SELECT' || nodeNm=='INPUT') {
      return;
    }
    this.outEditMode();
    if (nodeNm == 'SPAN' && (selTdObj.className==FOLDED || selTdObj.className==UNFOLDED) ) {
      this.processFoldering(e);
      return;
    }
   
    this.preInputObj; // text only
    if (nodeNm == 'TD') {
      if ((selTdObj.firstChild != null) || selTdObj.firstChild == null) {
        /*
			 * if(this.selInputObj != null && this.selInputObj != selTdObj &&
			 * this.preInputObj) { this.selInputObj.innerHTML =
			 * this.preInputObj.value; this.selInputObj = null;
			 * if(this.preTrObj) this.preTrObj.removeClassName(this.selectClssNm); }
			 */
        var trObj = $(selTdObj.parentNode);
        var headerCell = this.getColumnHeader(selTdObj);
        if (headerCell == selTdObj) return;
        var editable = $(headerCell).hasClassName('editable');
        var optVal = headerCell.getAttribute('ext-options');
        if (!editable) return; // alert(readOnly );
        // text not return
        if (selTdObj.firstChild && selTdObj.firstChild.nodeType != 3) return;
        var w = px(selTdObj.clientWidth - 4);
        selTdObj.style.padding='0px';
        //var h = '95%';
        var h = px(selTdObj.clientHeight - 2)
        if (Prototype.Browser.IE) h = px(selTdObj.clientHeight - 4);
        var value = selTdObj.innerHTML; // if(value == '&nbsp;') alert('tt');
        var newHTML = "";
        var newHTMLType = "";
        selTdObj.addClassName('editmode');
        if (optVal != null) {
          var optValues = optVal.split(",");
          newHTML = newHTML + "<" + "select style='width:100%'>";
          for (var j = 0,
          n = optValues.length; j < n; j++) {
            var selChk = "";
            if (value == optValues[j]) selChk = "selected";
            newHTML = newHTML + "<" + "option value='" + optValues[j] + "' " + selChk + " >" + optValues[j] + "<" + "/option>";
          }
          newHTML = newHTML + "<" + "/select>";
          newHTMLType = "select";
        } else {
          newHTML = "<input type=text value='" + value + "' style='vertical-align:bottom;margin:0px;padding:1px 2px;width:" + w + ";height:" + h + ";border:0px;background-color:#fff;' />";
          newHTMLType = "input";
        }
       
        trObj.addClassName(this.selectClssNm);
        this.preTrObj = trObj;
        selTdObj.innerHTML = newHTML;
        
        selTdObj.setAttribute("preValue", value);
        this.selInputObj = selTdObj;
        this.preInputObj = selTdObj.firstChild;
        
        
        
        if (optVal == null) {
          document.onselectstart = null;
          this.preInputObj.select();
          document.onselectstart = onDisableSelect;
        }
        try {
        this.preInputObj.observe('keydown', this.onTblKeyDn.bind(this));
        
        //editable ???? ???? ??????? TD?? ???? ??????? isEditedValue??? ????? ??????? true ???? ????
        if(newHTMLType=="input"){
        	this.selInputObj.observe('keyup', this._checkValueChanged.bind(this,this.selInputObj,this.preInputObj)); //input
        }else if(newHTMLType=="select"){
        	this.preInputObj.observe('click', this._checkValueChanged.bind(this,this.selInputObj,this.preInputObj)); //select
        }
        //-------------------------------------------------------------------------------------------
        }catch(e) {}
      }
    }
  },
  _checkValueChanged:function(td,ele){
	  if(ele.value != td.getAttribute("preValue")){
		  td.addClassName("editedValueClassName");
		  td.setAttribute("isEditedValue","true");
	  }else{
		  td.removeClassName("editedValueClassName");
		  td.setAttribute("isEditedValue","false");
	  }
  },
  _getCellIndex: function(cell) {
    var row = cell.parentNode,
    tb = row.parentNode,
    // this may be any container with .rows
    // (tbody, thead, table...)
    rows = tb.rows,
    rIndex = row.rowIndex,
    numCols = 0,
    table = [],
    n,
    // the spec says that we should autofill
    // missing cells so we'll comply
    dummyCell = {
      rowSpan: 1,
      colSpan: 1
    }; // pass1 - find the max number of columns
    for (var r, y = 0; r = rows[y]; y++) {
      n = 0;
      for (var c, x = 0; c = r.cells[x]; x++) {
        n += c.colSpan || 1;
      }
      numCols = Math.max(numCols, n);
    } // pass2 - build table matrix (up to our row)
    for (var y = 0; y <= rIndex; y++) {
      n = 0;
      for (var x = 0; x <= numCols; x++) {
        table[y] = (table[y] || []); // assign dimension && prevent overflow
        r = rows[y];
        if (!table[y][x]) {
          c = r.cells[n++] || dummyCell;
          for (var i = 0,
          l = (c.rowSpan || 1); i < l; i++) {
            for (var j = 0,
            m = (c.colSpan || 1); j < m; j++) {
              table[y + i] = (table[y + i] || []); // assign dimension && prevent
              // overflow
              table[y + i][x + j] = 1; // debug with: '['+x+'/'+y+']'
              if (c === cell) { // we've found our cell, no more work is needed
                // so we use an tried and tested tactic of early return
                return {
                  x: (x + j),
                  y: (y + i)
                };
              }
            } // for
          } // for
        } // if
      } // for x
    } // for y
    // what is appropriate return value here?
    // if the code is correct then this doesn't occur
    return;
  },
  
  
  
  // resize event
  resizing: function(checkCellIdx, tblRefHead) {
	  
	  
	if(this.isResizing) return;
	
	
	// when invisible, no process
    if(this.tblOutline.offsetWidth==0) return;
    
    this.isResizing=true;
    
    
    
    log( this.tbl.id+ ' webponent.HtmlGrid > resizing ' + this.tblOutlineStyle.width+':'+this.tblOutline.offsetWidth+' '+this.preTableWidth );
    
    this.preTableWidth = this.tblOutline.offsetWidth;
    
    if(this.isFullHeight) {
    	var p=this.tblOutline.parentNode;
    	try {
    		if(true) {
    			this.tblOutline.style.height='200px';
    			
    			var ipt=0;
    			var ipb=0;
    			try {
    			  var pt=p.style.paddingTop;
    			  var pb=p.style.paddingBottom;
    			  if(!pt=='') ipt=parseInt(pt);
    			  if(!pb=='') ipb=parseInt(pb);
    			}catch(e){}
    			this.tblOutline.style.height=parseInt(p.parentNode.clientHeight)-ipt-ipb+'px';
    			
    		}
    	}catch(e) {}
    }
    
    //alert(this.tblHeadDiv.clientHeight);
    if (this.height && (this.tblOutline.clientHeight - this.tblHeadOutline.clientHeight) > 10) {
      this.tblBodyOutline.style.height = px(this.tblOutline.clientHeight - this.tblHeadDiv.offsetHeight);
    }
   
    
    /*
    if (this.relativeWidth) {
      try {
    	var g=this.tblOutline.parentNode;
    	
    	if(g.clientWidth>0) {
    	  this.tblOutline.style.width = '1px';
    	  var g1=g.style;
    	  var l=parseInt(g1.paddingLeft);
    	  var r=0;
    	  if(l>=0) {
    		r=parseInt(g1.paddingRight);
    	  } else {
    		l=10;
    		r=10;
    	  }
    	
          this.tblOutline.style.width = g.clientWidth - l-r+'px';
    	}
      }catch(e) {}
      
    } 
    */
    
    if(this.arg.autoColumnResizable) {
    	
    try {
    	
  	  var cw=this.tblOutline.clientWidth;
  	  if(cw>this.scrollBarWidth) {
  		  
  	     var w=cw- this.scrollBarWidth;
  	     
  	     if(this.arg.tableMinWidth) {
  	       var w2=parseInt(this.arg.tableMinWidth);
  	       if(w<w2) w=w2;
  	     }
  	     this.tblHeadOutline.width = px(w);
  	  
  	  }
    }catch(e) {}
    }
    
    //this.tblBodyOutline.style.width = this.tblOutline.clientWidth;
    // if(this.tblBody.rows.length > 0) {
    
    if(Prototype.Browser.IE8) this.tbl.style.display = 'none';
    
    if(tblRefHead==null) tblRefHead = this.tblHead;
    try{
    	
      for (var rowSeq = 0,mm=this.tblHead.rows.length; rowSeq < mm; rowSeq++) {
        var viewHeadCells = this.hiddenColsArray;
        var headCells = tblRefHead.rows[rowSeq].cells;
        var existHiddenColumn = false;
        for (var i = 0,
        m = headCells.length; i < m; i++) { // log(rowSeq+':'+i+' check');
          var colIdx = headCells[i].getAttribute('x');
          var colspan = headCells[i].getAttribute('colspan');
          if (!colspan) colspan = 1;
          
          var hw=headCells[i].style.width;
          if (colspan == 1 && !hw && hw!='') {
        	  headCells[i].style.width = hw;
          }
        
          
          if (rowSeq == 0 && i == checkCellIdx) { // alert(viewHeadCells[i].style.display);
            if (viewHeadCells[i].style.display == 'none') {
        	  //if (this.hiddenHeadColsArray[i].style.display == 'none') {
            	
              var mx = parseInt(colIdx) + parseInt(colspan);
              for (var k = colIdx; k < mx; k++) {
                viewHeadCells[k].style.display = ''; // this.hiddenHeadColsArray[k].style.display = '';
                if (!Prototype.Browser.oldIE) {
                	
                  for (var p = 0,
                  p1 = this.tblBody.rows,
                  p2 = p1.length; p < p2; p++) {
                    p1[p].cells[k].style.display = '';
                  }
                }
              }
            }
          } 
          //0904
          //if (headCells[i].style.display == 'none') {
          //alert(this.hiddenHeadColsArray[i].style.display);
          if (this.hiddenHeadColsArray[colIdx].style.display == 'none') {
        	  
        	  
            var mx = parseInt(colIdx) + parseInt(colspan);
            for (var k = colIdx; k < mx; k++) {
              viewHeadCells[k].style.display = 'none'; // this.hiddenHeadColsArray[k].style.width= '';
              if (!Prototype.Browser.oldIE) {
                for (var p = 0,
                p1 = this.tblBody.rows,
                p2 = p1.length; p < p2; p++) {
                	
                  p1[p].cells[k].style.display = 'none';
                }
              }
            }
          } else if (colspan == 1) {
        	  

        	  if(Prototype.Browser.WebKit ) {
        		  /*
        		  if(i==(m-1)) {
        			  viewHeadCells[colIdx].width = px(headCells[i].clientWidth+1);
        		  }else if(i==0) {
        			  viewHeadCells[colIdx].width = px(headCells[i].clientWidth-1);
        		  }else if(i==1) {
        			  viewHeadCells[colIdx].width = px(headCells[i].clientWidth-2);
        		  }else 
        		  */
        		  
        		  {
        			  viewHeadCells[colIdx].width = px(headCells[i].offsetWidth);
        		  }
        	  }
        	  else if(Prototype.Browser.IE8 && this.arg.autoColumnResizable) {
        		  
        		  if(i==1) {
        			  viewHeadCells[colIdx].width = px(headCells[i].clientWidth-1);
        		  }else if(i==2) {
        			  viewHeadCells[colIdx].width = px(headCells[i].clientWidth);
        		  }else if(i==3) {
        			  viewHeadCells[colIdx].width = px(headCells[i].clientWidth+1);
        		  }
        		  else {
        			  viewHeadCells[colIdx].width = px(headCells[i].clientWidth);
        		  }
    		  }
        	  else{
        		  viewHeadCells[colIdx].removeAttribute("width");
        			  /*
          		      if(Prototype.Browser.oldIE && i==(m-1)) {
        				  viewHeadCells[colIdx].style.width = px(headCells[i].offsetWidth-1);
        			  }else 
        			  */
        			  {
        				  viewHeadCells[colIdx].style.width = px(headCells[i].offsetWidth);
        			  }
        		
        	  }
          }
        }
      }
      
      //check
      //var tw=this.tblHeadOutline.clientWidth;
      var tw=this.tblHeadOutline.width;
      if(Prototype.Browser.IE8 && !this.arg.autoColumnResizable) {
    	// IE8 bug??
    	  if(this.tblCalcWidth==0) {
    	    //tw=tw-10;
    		
    	  }
    	  else
    		tw=tw-2; 
      }
      
      
      
      
      //this.tbl.style.width=px(tw);
      
      // IE8 bug
      if(Prototype.Browser.IE8) {this.tbl.style.display = 'table';}
       
      this.tbl.width = tw;
      
      if(this.arg.overflowX==null) {
      if (this.tbl.offsetWidth > this.tblOutline.offsetWidth + 3) {
    	this.tblBodyOutline.style.overflowX = 'scroll';
      } else {
        this.tblBodyOutline.style.overflowX = 'hidden';
      }
      }else {
    	  this.tblBodyOutline.style.overflowX = this.arg.overflowX;
      }
    }catch(e){}
    

    try{
    
    if(Prototype.Browser.WebKit || Prototype.Browser.oldIE ) {
    	this.scrllVGap = this.tblBody.rows[0].cells[0].offsetHeight+1;
    }
    else
    	this.scrllVGap = this.tblBody.rows[0].cells[0].offsetHeight;
    }catch(e){}
    
    this._onTblBodyScroll();
    this.isResizing=false;
  },
  _fixCellWidthInfo: function(td) {
    var width = td.getAttribute("width");
    if (width && width.length > 0) {
      td.style.width = width;
      td.removeAttribute("width");
    }
  },
  _onTblBodyScroll: function(e) {
	  
    this.tblHeadDiv.style.marginLeft = px(parseInt(this.tblBodyOutline.scrollLeft) * -1);
    this._fixSortImgPosition();
    
    this.tblBodyOutline.focus();
  },
  requestBody: function(url, id, pars, mode) {
    if (mode == 'add') {
      var myAjax = new Ajax.Request(url, {
        method: "get",
        parameters: pars,
        onSuccess: this.printBody.bind(this)
      });
    } else {
      new Ajax.Updater(id, url, {
        parameters: pars,
        asynchronous: false
      });
    }
  },
  getXmlText: function(param) {
    if (!param) param = '';
    var str = '';
    if (param.skipTableTag != true) str += "<table border='1'>";
    str += "<thead>";
    for (var i = 0,
    r = this.tblHead.rows; i < r.length; i++) {
      str += "<tr>";
      for (var j = 0,
      c = r[i].cells; j < c.length; j++) {
        if (c[j].style.display != 'none') {
          str += "<th width='" + c[j].offsetWidth + "'";
          if (c[j].colSpan > 1) str += " colspan='" + c[j].colSpan + "'";
          if (c[j].rowSpan > 1) str += " rowspan='" + c[j].rowSpan + "'";
          str += ">" + c[j].innerHTML + "</td>";
        }
      }
      str += "</tr>";
    }
    str += "</thead>";
    str += "<tbody>";
    for (var i = 0,
    r = this.tblBody.rows; i < r.length; i++) {
      str += "<tr>";
      for (var j = 0,
      c = r[i].cells; j < c.length; j++) {
        if (this.hiddenColsArray[j].style.display == '') {
          str += "<td>" + c[j].innerHTML + "</td>";
        }
      }
      str += "</tr>";
    }
    str += "</tbody>";
    if (param.skipTableTag != true) str += "</table>";
    return str;
  },
  insertRow: function(idx) {
    var row = this.tblBody.insertRow(idx);
    for (var i = 0; i < this.hiddenColsArray.length; i++) {
      var cell = row.insertCell(i);
      //cell.innerHTML = this.tblBody.rows.length;
    }
    return row;
  }
} // ---------------------------------------
;



webponent.History = { 
	    initialize: function(options) { 
	        this.options = Object.extend({ 
	            interval: 200 
	        },options||{}); 
	        this.callback = this.options.callback || Prototype.emtpyfunction; 
	        if(Prototype.Browser.IE) {
	            this.locator = new webponent.History.Iframe('ajaxHistoryHandler', this.options.iframeSrc);
	        }
	        else 
	            this.locator = new webponent.History.Hash(); 
	        this.currentHash = ''; 
	        this.locked = false; 
	    }, 
	    add: function(hash) { 
	    	
	        this.locked = true; 
	        clearTimeout(this.timer);
	        this.currentHash = hash; 
	        this.locator.setHash(hash);
	        this.timer = setTimeout(this.checkHash.bind(this), this.options.interval); 
	        this.locked = false; 
	    }, 
	    checkHash: function(){ 
	        if(!this.locked){ 
	            var check = this.locator.getHash(); 

	            if(check != this.currentHash){
	            	try {
	                this.callback(check);
	            	}catch(e) {}
	                this.currentHash = check; 
	            } 
	        } 
	        this.timer = setTimeout(this.checkHash.bind(this), this.options.interval); 
	    }, 
	    getBookmark: function(){ 
	        return this.locator.getBookmark(); 
	    } 
	}; 

	// Hash Handler for IE (Tested with IE6) 
	webponent.History.Iframe = Class.create(); 
	webponent.History.Iframe.prototype = { 
	    initialize: function(id, src) { 
	        this.url = ''; 
	        this.id = id || 'ajaxHistoryHandler'; 
	        this.src = src || ''; 
	        var ifrm = new Element('iframe',{'src':this.src, 'id':this.id, 'name':this.id, 'style':'display:none;'});
	        document.body.appendChild(ifrm);
	        
	    }, 
	    setHash: function(hash){ 
	        try { 
	            $(this.id).setAttribute('src', this.src + '?' + hash); 
	        }catch(e) {} 
	        //window.location.href = this.url + '#' + hash; 
	    }, 
	    getHash: function(){ 
	        try { 
	            return (document.frames[this.id].location.href||'?').split('?')[1]; 
	        }catch(e){ return ''; } 
	    }, 
	    getBookmark: function(){ 
	        try{ 
	            return window.location.href.split('#')[1]||''; 
	        }catch(e){ return ''; } 
	    } 
	}; 

	// Hash Handler for a modern browser (tested with firefox 1.5) 
	webponent.History.Hash = Class.create(); 
	webponent.History.Hash.prototype = { 
	    initialize: function(){ 
	    }, 
	    setHash: function(hash){ 
	        window.location.hash = hash; 
	    }, 
	    getHash: function(){ 
	        return window.location.hash.substring(1)||''; 
	    }, 
	    getBookmark: function(){ 
	        try{ 
	            return window.location.hash.substring(1)||''; 
	        }catch(e){ return ''; } 
	    } 
	};

	
	


var need_nl_before = '|div|p|table|tbody|tr|td|th|title|head|body|script|comment|li|meta|h1|h2|h3|h4|h5|h6|hr|ul|ol|option|';
var need_nl_after = '|html|head|body|p|th|style|';

var re_comment = new RegExp();
re_comment.compile("^<!--(.*)-->$");

var re_hyphen = new RegExp();
re_hyphen.compile("-$");


function get_xhtml(node, lang, encoding, need_nl, inside_pre) {

	var i;
	var text = '';
	var children = node.childNodes;
	var child_length = children.length;
	var tag_name;
	var do_nl = need_nl ? true : false;
	var page_mode = true;

	for (i = 0; i < child_length; i++) {
		var child = children[i];

		switch (child.nodeType) {
		case 1: { // ELEMENT_NODE
			var tag_name = String(child.tagName).toLowerCase();

			if (tag_name == '')
				break;

			if (tag_name == 'meta') {
				var meta_name = String(child.name).toLowerCase();
				if (meta_name == 'generator')
					break;
			}
			
			if (!need_nl && tag_name == 'body') { // html fragment mode
				page_mode = false;
			}

			if (tag_name == '!') { // COMMENT_NODE in IE 5.0/5.5
				// get comment inner text
				var parts = re_comment.exec(child.text);

				if (parts) {
					// the last char of the comment text must not be a hyphen
					var inner_text = parts[1];
					text += fix_comment(inner_text);
				}
			} else {
				if (tag_name == 'html') {
					text = '<?xml version="1.0" encoding="' + encoding + '"?>\n<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n';
				}

				// inset \n to make code more neat
				if (need_nl_before.indexOf('|' + tag_name + '|') != -1) {
					if ((do_nl || text != '') && !inside_pre)
						text += '\n';
					else
						do_nl = true;
				}

				text += '<' + tag_name;

				// add attributes
				var attr = child.attributes;
				var attr_length = attr.length;
				var attr_value;

				var attr_lang = false;
				var attr_xml_lang = false;
				var attr_xmlns = false;

				var is_alt_attr = false;
				
				

				for (j = 0; j < attr_length; j++) {
					var attr_name = attr[j].nodeName.toLowerCase();

					if (!attr[j].specified
							&& (attr_name != 'selected' || !child.selected)
							&& (attr_name != 'style' || // IE 5.0
							child.style.cssText == '') && attr_name != 'value')
						continue; // IE 5.0

					if (attr_name == '_moz_dirty'
							|| attr_name == '_moz_resizing' || tag_name == 'br'
							&& attr_name == 'type'
							&& child.getAttribute('type') == '_moz')
						continue;

					var valid_attr = true;

					switch (attr_name) {
					case "style":
						attr_value = child.style.cssText;
						break;
					case "class":
						attr_value = child.className;
						break;
					case "http-equiv":
						attr_value = child.httpEquiv;
						break;
					case "noshade": // this set of choices will extend
					case "checked":
					case "selected":
					case "multiple":
					case "nowrap":
					case "disabled":
						attr_value = attr_name;
						break;
					default:
						try {
							attr_value = child.getAttribute(attr_name, 2);
						} catch (e) {
							valid_attr = false;
						}
					}

					// html tag attribs
					if (attr_name == 'lang') {
						attr_lang = true;
						attr_value = lang;
					}
					if (attr_name == 'xml:lang') {
						attr_xml_lang = true;
						attr_value = lang;
					}
					if (attr_name == 'xmlns')
						attr_xmlns = true;
					

					if (valid_attr) {
						// value attribute set to "0" is not handled correctly
						// in Mozilla
						if (!(tag_name == 'li' && attr_name == 'value')) {
							text += ' ' + attr_name + '="'
									+ fix_attribute(attr_value) + '"';
						}
					}

					if (attr_name == 'alt')
						is_alt_attr = true;
				}

				if (tag_name == 'img' && !is_alt_attr) {
					text += ' alt=""';
				}

				if (tag_name == 'html') {
					if (!attr_lang)
						text += ' lang="' + lang + '"';
					if (!attr_xml_lang)
						text += ' xml:lang="' + lang + '"';
					if (!attr_xmlns)
						text += ' xmlns="http://www.w3.org/1999/xhtml"';
				}

				if (child.canHaveChildren || child.hasChildNodes()) {
					text += '>';
					if (need_nl_after.indexOf('|' + tag_name + '|') != -1) {
						// text += '\n';
					}
					text += get_xhtml(child, lang, encoding, true, inside_pre
							|| tag_name == 'pre' ? true : false);
					text += '</' + tag_name + '>';
				} else {

					if (tag_name == 'style' || tag_name == 'title'
							|| tag_name == 'script') {

						text += '>';
						var inner_text;
						if (tag_name == 'script') {
							inner_text = child.text;
						} else
							inner_text = child.innerHTML;

						if (tag_name == 'style') {
							inner_text = String(inner_text).replace(/[\n]+/g,
									'\n');
						}

						text += inner_text + '</' + tag_name + '>';

					} else {
						text += ' />';
					}
				}

			}
			break;
		}
		case 3: { // TEXT_NODE
			if (!inside_pre) { // do not change text inside <pre> tag
				if (child.nodeValue != '\n') {
					text += fix_text(child.nodeValue);
				}
			} else
				text += child.nodeValue;
			break;
		}
		case 8: { // COMMENT_NODE
			text += fix_comment(child.nodeValue);
			break;
		}
		default:
			break;
		}
	}

	if (!need_nl && !page_mode) { // delete head and body tags from html
									// fragment
		text = text.replace(/<\/?head>[\n]*/gi, "");
		text = text.replace(/<head \/>[\n]*/gi, "");
		text = text.replace(/<\/?body>[\n]*/gi, "");
	}

	return text;
}

// fix inner text of a comment
function fix_comment(text) {

	// delete double hyphens from the comment text
	text = text.replace(/--/g, "__");

	if (re_hyphen.exec(text)) { // last char must not be a hyphen
		text += " ";
	}

	return "<!--" + text + "-->";
}

// fix content of a text node


function fix_text(text) {
	// convert <,> and & to the corresponding entities
	return String(text).replace(/\n{2,}/g, "").replace(/\&/g, "&amp;")
			.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\u00A0/g,
					"");
}

// fix content of attributes href, src or background
function fix_attribute(text) {
	// convert <,>, & and " to the corresponding entities
	return String(text).replace(/\&/g, "&amp;").replace(/</g, "&lt;").replace(
			/>/g, "&gt;").replace(/\"/g, "&quot;");
}

function _grd_th_onfcs(e) {
	obj=e.element();
	obj.parentNode.style.width="";
	obj.parentNode.style.height="";
	
	
	
}
function _grd_th_onblur(e) {
	obj=e.element();
	obj.parentNode.style.width="0px";
	obj.parentNode.style.height="0px";
	
}

/* ???? ???? ????( #,### ?? )*/
String.prototype.reverse = function() { return this.match(/(.)/g).reverse().join('') }; 
Number.prototype.str = function() { return new String(this) }; 
Number.prototype.format = function() { 
    return this.str().reverse().replace(/(\d{3})(?=\d)(?!\d+\.)/g, '$1,').reverse(); 
};


/* Hash map */
function HashMap() {
	var obj = [];
	
	obj.size = function () {
		return this.length;
	};
	
	obj.isEmpty = function () {
		if(this.length == 0) 
			return true;		
		else 
			return false;
	};
	
	obj.isContain = function (key) {
		for (var i = 0; i < this.length; i++) {
			if (this[i].key == key) {
				return true;
			}
		}
		return false;
	};
	
	obj.containsKey = function (key) {
		for (var i = 0; i < this.length; i++) {
			if (this[i].key == key) {
				return i;
			}
		}
		return -1;
	};
	
	obj.get = function (key) {
		var index = this.containsKey(key);
		if (index > -1) {
			return this[index].value;
		}
	};

	obj.putValue = function (key, value) {
		if (this.isContain(key)) {
			return this.get(key); 
		}
		this.push({'key': key, 'value': value});
	};

	obj.put = function (key, type, id, def_value, name) {
		if (this.isContain(key)) {
			return this.get(key);
		}
		
		var value = new Array(type, id, def_value, name);
		this.push({'key': key, 'value': value});
	};
	
	obj.clear = function () {
		obj = null;
	};

	return obj;  
}
