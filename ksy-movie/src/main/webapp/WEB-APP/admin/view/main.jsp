<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
	
<!DOCTYPE html>

<html>
<head>
<meta charset="utf-8">


<title>coreFRAME</title>


${import_baseUI}
${import_layoutUI}

	<script type="text/javascript">

	var myLayout; // a var is required because this page utilizes: myLayout.allowOverflow() method

	$(document).ready(function () {

		myLayout = $('body').layout({
			north__size:				50
		,	north__resizable:		false
		,   north__slidable:		false
		,   north__togglerLength_open:	0
		,   north__togglerLength_closed:	-1
		,   north__spacing_open:	0 
		,	west__size:					200
		,	west__spacing_closed:		20
		,	west__togglerLength_closed:	100
		,   west__spacing_open:	5 
		,	west__togglerAlign_closed:	"top"
		,	west__togglerContent_closed:"M<BR>E<BR>N<BR>U"
		,	west__togglerTip_closed:	"Open & Pin Menu"
		,	west__sliderTip:			"Slide Open Menu"
		,	west__slideTrigger_open:	"mouseover"
		});
		
		var h=$($('#identifier a').get(1)).attr('href');
		
		$('#mainFrame').attr('src',h);
		
		$("#identifier").accordion({ header: "h3" });

		


 	});

	</script>


	<style type="text/css">
	
	
	/**
	 *	Basic Layout Theme
	 */
	.ui-layout-pane { /* all 'panes' */ 
		border: 1px solid #BBB; 
	} 
	.ui-layout-pane-center { /* IFRAME pane */ 
		padding: 0;
		margin:  0;
	} 
	.ui-layout-pane-west { /* west pane */ 
		padding: 0 10px; 
		background-color: #E0E6EA !important;
		overflow: auto;
	} 

	.ui-layout-resizer { /* all 'resizer-bars' */ 
		background: #DDD; 
		} 
		.ui-layout-resizer-open:hover { /* mouse-over */
			background: #9D9; 
		}

	.ui-layout-toggler { /* all 'toggler-buttons' */ 
		background: #AAA; 
		} 
		.ui-layout-toggler-closed { /* closed toggler-button */ 
			background: #CCC; 
			border-bottom: 1px solid #BBB; 
		} 
		.ui-layout-toggler .content { /* toggler-text */ 
			font: 14px bold Verdana, Verdana, Arial, Helvetica, sans-serif;
		}
		.ui-layout-toggler:hover { /* mouse-over */ 
			background: #DCA; 
			} 
			.ui-layout-toggler:hover .content { /* mouse-over */ 
				color: #009; 
				}

	/* class to make the 'iframe mask' visible */
	.ui-layout-mask {
		opacity: 0.2 !important;
		filter:	 alpha(opacity=20) !important;
		background-color: #666 !important;
	}


	body {
		background-color: white;
		font: 10px Myriad,Helvetica,Tahoma,Arial,clean,sans-serif;
	}
	

	ul { /* basic menu styling */
		margin:		1ex 0;
		padding:	0;
		list-style:	none;
		position:	relative;
	}
	li {
		padding: 0.15em 1em 0.3em 5px;
	}
	.ui-layout-north {
 color: #fff;
  background-color: #00558e;
  background: -moz-linear-gradient(top, #0069a4, #004077);
  background: -webkit-gradient(linear, left top, left bottom, from(#0069a4), to(#004077));
  -ms-filter: "progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr=undefined, EndColorStr=undefined)";
  filter: "progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr=undefined, EndColorStr=undefined)";
  padding:10px;
	}
	
	h1 {
	 margin: 0;
  color: #eef6ff;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: -1px;
  text-shadow: 0 1px 0fcal #123;
  padding: 2px 8px;
  }
  
  p.items{
  	margin-bottom:5px;
  }

	</style>

</head>
<body>

<iframe id="mainFrame" name="mainFrame" class="ui-layout-center"
	width="100%" height="600" frameborder="0" scrolling="auto"
	src=""></iframe>

<div class="ui-layout-north">
<h1>coreFRAME Administrator</h1>
</div>
<div class="ui-layout-west">

<p></p>
<div id="identifier"> 
<c:forEach var="group" items="${menuList}">
<div>
 <h3><a href="#">${group.name}</a></h3>
 <div>
  <c:forEach var="child" items="${group.child}">
    <p class="items">- <a target="mainFrame"  href="${child.href}">${child.name}</a></p>
  </c:forEach>
 </div>
</div> 
</c:forEach>
</div>

<p></p>
<div>Copyright(c) 2012 CyberImagination, Inc. All rights reserved.</div>	
	
</div>

</body>
</html>