var webponent = {
  Version: '0.9.0_rc1',
  ScriptFragment: '(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)',
  emptyFunction: function() {}
}






webponent.stockchart = Class.create();

webponent.stockchart.prototype = {
		
	initialize : function(divid, chartGubun, w, h, option) {
		this.divid = divid;
		this.chartGubun = chartGubun;
		this.chartURL = null;
		this.w = w;
		this.h = h;
		this.chartData = this.dataUrlInfo('1');	
		this.chartData2 = this.dataUrlInfo('2');
		this.suggest = this.dataUrlInfo('3');
		this.option = option;
		
		return;
	},
	
	
	show : function() {
		
		if(this.chartGubun == 'f') {
			this.chartURL = contextPath+'/coreframe/stockchart/flex/stock';
			this.setFlex();
		} else if(this.chartGubun == 's') {
			this.chartURL = contextPath+'/coreframe/stockchart/wpf/Webponent.StockChart.xap';
			this.setSilverLight();
		} else {
			alert("경로미확인");
			return;
		}
	},
	
	
	dataUrlInfo : function(num) {
		var url = window.location.href;
		
		var arr = new Array();
		
		url = url.replace("http://","");
		
		arr = url.split("/");
		
		if(num == 1) {
			url = "http://" + arr[0] + contextPath+"/coreframe/stockchart/data/chartdata.jsp";
		} else if(num == 2) {
			url = "http://" + arr[0] + contextPath+"/coreframe/stockchart/data/chartdata_comparison.jsp";
		} else if(num == 3) {
			url = "http://" + arr[0] + contextPath+"/coreframe/stockchart/data/suggestData.jsp";
		} else {
			url = "";
		}		
		return url;
	},
	
	
	setSilverLight : function() {
		
		var obj = $(this.divid);
		
		str = '<div id="errorLocation" style="font-size: small;color: Gray;"></div>';
		str += '<div id="silverlightControlHost">';
		str += '<object data="data:application/x-silverlight," type="application/x-silverlight-2" width="'+this.w+'" height="'+this.h+'">';
		str += '<param name="source" value="'+this.chartURL+'"/>';
		str += '<param name="onerror" value="onSilverlightError" />';
		str += '<param name="background" value="white" />';
		str += '<param name="minRuntimeVersion" value="2.0.31005.0" />';
		str += '<param name="autoUpgrade" value="true" />';		
		str += '<param name="initParams" value="address='+this.chartData+',address1='+this.chartData2+',address2='+this.suggest+',code='+this.option.code+',bld1='+this.option.bld1+',bld2='+this.option.bld2+',bld3='+this.option.bld3+',bld4='+this.option.bld4+',bld5='+this.option.bld5+'" />';
		str += '<a href="http://go.microsoft.com/fwlink/?LinkID=124807" style="text-decoration: none;">';
		str += '<img src="http://go.microsoft.com/fwlink/?LinkId=108181" alt="Get Microsoft Silverlight" style="border-style: none"/>';
		str += '</a>';
		str += '</object>';
		str += '<iframe style="visibility:hidden;height:0;width:0;border:0px"></iframe>';
		str += '</div>';
		
		obj.innerHTML = str;
	},
	
	
	setFlex : function() {
		
		var hasProductInstall = DetectFlashVer(6, 0, 65);
		var hasRequestedVersion = DetectFlashVer(9, 0, 28);
		
		if ( hasProductInstall && !hasRequestedVersion ) {
			
			var MMPlayerType = (isIE == true) ? "ActiveX" : "PlugIn";
			var MMredirectURL = window.location;
		    document.title = document.title.slice(0, 47) + " - Flash Player Installation";
		    var MMdoctitle = document.title;
			
			AC_FL_RunContent(
				"src", "playerProductInstall",
				"FlashVars", "MMredirectURL="+MMredirectURL+'&MMplayerType='+MMPlayerType+'&MMdoctitle='+MMdoctitle+"",
				"width", "712",
				"height", "550",
				"align", "middle",
				"id", "stock",
				"quality", "high",
				"bgcolor", "#869ca7",
				"name", "stock",
				"allowScriptAccess","sameDomain",
				"type", "application/x-shockwave-flash",
				"pluginspage", "http://www.adobe.com/go/getflashplayer"
			);
		} else if (hasRequestedVersion) {
			//alert("address="+this.chartData+"&address1="+this.chartData2+"&address2="+this.suggest+"&code="+this.option.code+"&bld1="+this.option.bld1+"&bld2="+this.option.bld2+"&bld3="+this.option.bld3+"&bld4="+this.option.bld4+"&bld5="+this.option.bld5);
			// if we've detected an acceptable version
			// embed the Flash Content SWF when all tests are passed
			AC_FL_RunContent(
					"src", this.chartURL,
					"FlashVars", "address="+this.chartData+"&address1="+this.chartData2+"&address2="+this.suggest+"&code="+this.option.code+"&bld1="+this.option.bld1+"&bld2="+this.option.bld2+"&bld3="+this.option.bld3+"&bld4="+this.option.bld4+"&bld5="+this.option.bld5,					
					"width", this.w,
					"height", this.h,
					"align", "middle",
					"id", "stock",
					"quality", "high",
					"bgcolor", "#869ca7",
					"name", "stock",
					"allowScriptAccess","sameDomain",
					"type", "application/x-shockwave-flash",
					"pluginspage", "http://www.adobe.com/go/getflashplayer"
			);
		} else {  // flash is too old or we can't detect the plugin
		    var alternateContent = 'Alternate HTML content should be placed here. '
		  	+ 'This content requires the Adobe Flash Player. '
		   	+ '<a href=http://www.adobe.com/go/getflash/>Get Flash</a>';
		    document.write(alternateContent);  // insert non-flash content
		}		
	}

	
}



function onSilverlightError(sender, args) {
    
    var appSource = "";
    if (sender != null && sender != 0) {
        appSource = sender.getHost().Source;
    } 
    var errorType = args.ErrorType;
    var iErrorCode = args.ErrorCode;
    
    var errMsg = "Unhandled Error in Silverlight 2 Application " +  appSource + "\n" ;

    errMsg += "Code: "+ iErrorCode + "    \n";
    errMsg += "Category: " + errorType + "       \n";
    errMsg += "Message: " + args.ErrorMessage + "     \n";

    if (errorType == "ParserError")
    {
        errMsg += "File: " + args.xamlFile + "     \n";
        errMsg += "Line: " + args.lineNumber + "     \n";
        errMsg += "Position: " + args.charPosition + "     \n";
    }
    else if (errorType == "RuntimeError")
    {           
        if (args.lineNumber != 0)
        {
            errMsg += "Line: " + args.lineNumber + "     \n";
            errMsg += "Position: " +  args.charPosition + "     \n";
        }
        errMsg += "MethodName: " + args.methodName + "     \n";
    }

    throw new Error(errMsg);
}

