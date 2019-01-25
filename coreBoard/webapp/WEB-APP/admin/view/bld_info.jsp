<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<jsp:useBean id="xds" class="coreframe.data.XmlDataSet" scope="request"></jsp:useBean>
<%
	coreframe.xml.XMLReferer xref = new coreframe.xml.XMLReferer(xds);
	xref.setNullValue("");
%>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=8,chrome=1">
<title>coreFRAME BLD</title>
<!--[if lt IE 9]>
<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
${import_baseUI}
<script type="text/javascript">
var u=window.location.href+'';
var idx = u.indexOf("/admin");
u=u.substring(0,idx-1);
idx= u.lastIndexOf("/");
var baseUrl=u.substring(0,idx);

$(window).bind('resizestop',function(e) {
	$('div.panel').height(parseInt($(document).height())-67);
});

$(document).ready(function() {
 
 $('#tabs').tabs();
 $('div.panel').height(parseInt($(document).height())-67);
 
 $('#selInterface').click(function() {
	 
    var typ= $("#interfaceType > option:selected").val();
    var u=baseUrl+'/corelogic/ioschema/${bldPath}'+'.'+typ;
    $("#interfaceUrl").attr('value',u);
    
    var typ2= $("#openSchemaWin > option:selected").val();
    if(typ2=='window') window.open(u);
    else {
    	$.ajax( {url:u,dataType:'text',success:function(msg){
			$('#interfaceResult').text(msg);
			//alert(msg);
		}});
    	
    	//$('#interfaceResult').attr('src',u);
    }
    
    
 });
 
 
 $('#bldTestBtn').click(function(){
	 
	 var typ= $("#testDataType > option:selected").val();
	 var u=baseUrl+'/corelogic/process/${bldPath}'+'.'+typ;
	 $("#testUrl").attr('value',u);
	 
	 $('#mainFrm').attr('action',u);
	 $('#mainFrm').attr('target','testResult');
	 
	 $('#mainFrm').submit();
	 

	 
 });
 
 $('#sourceGen').click(function(){
	 var typ= $("#sourceGenType > option:selected").val();
	 var u=baseUrl+'/corelogic/source/${bldPath}'+'.'+typ;
	 $.ajax( {url:u,dataType:'text',success:function(msg){
			$('#genResult').text(msg);
			//alert(msg);
		}});
 });
});
</script>
</head>
<body>
 <div id="formDiv">
  <form id="mainFrm" action="" method="post"  >
   <div id="tabs">
    <ul>
     <li><a href="#tabs-1">Basic</a></li>
     <li><a href="#tabs-2">IO Schema</a></li>
     <li><a href="#tabs-3">Interface</a></li>
     <li><a href="#tabs-4">Test</a></li>
     <li><a href="#tabs-5">Generation</a></li>
    </ul>
    <div id="tabs-1" class="panel">
     <fieldset>
      <legend>Basic Info - ${bldPath} [type:<%=xds.getText("/transaction/processor-info/@type")%>]</legend>
      
      <div class="editable">
      <label>이름</label> 
      <input type="text" class="inputText" value="<%=xds.getText("/transaction/info/name")%>" />
      
      <label>개요</label>
      <textarea class="inputText"><%=xds.getText("/transaction/info/description")%></textarea>
      
      <label>작성자</label> 
      <input type="text" class="inputText" value="<%=xds.getText("/transaction/info/author")%>" />
       
      <label>HTTP Access 허용</label> 
      <input type="text" class="inputText" value="<%=xds.getText("/transaction/info/http-access")%>" />
      </div>
     </fieldset>
     
     <fieldset>
      <legend>Process Information</legend>
      
      <div class="editable">
      <label>adapter name</label> 
      <input type="text" class="inputText" name="/transaction/processor-info/@type" value="<%=xds.getText("/transaction/processor-info/@type")%>" readonly="readonly" /> 
      
      <label>transaction</label>
      <input type="text" class="inputText" name="/transaction/processor-info/transaction-type"
       value="<%=xds.getText("/transaction/processor-info/transaction-type")%>" /> 
      </div>
      
      <div>
       <table>
        <tr>
         <th></th>
         <th>sql id</th>
         <th>type</th>
         <th>maxrows</th>
         <th>crud type</th>
         <th>properties</th>
        </tr>
        <%
            String baseXpath = "/transaction/processor-info/sql";
        	int cnt = xds.getCount(baseXpath);
        	for (int i = 0; i < cnt; i++) {
        		String sqlTxt = xds.getText(baseXpath+"["+(i+1)+"]/query").trim().toLowerCase();
        		String crud = "select";
        		if (sqlTxt.indexOf("insert") == 0)
        			crud = "insert";
        		else if (sqlTxt.indexOf("update") == 0)
        			crud = "update";
        		else if (sqlTxt.indexOf("delete") == 0)
        			crud = "delete";

        		StringBuffer buf = new StringBuffer();
        		String setPropertyTxt = xds.getText(baseXpath+"["+(i+1)+"]/mapping/setProperty");
        		if (setPropertyTxt != null
        				&& setPropertyTxt.trim().length() > 0)
        			buf.append("IN");

        		String getPropertyTxt = xds.getText(baseXpath+"["+(i+1)+"]/mapping/getProperty");
        		if (getPropertyTxt != null
        				&& getPropertyTxt.trim().length() > 0) {

        			if (buf.length() > 0)
        				buf.append(" / ");

        			buf.append("OUT");
        		}
        %>
        <tr onclick="viewQry(<%=(i + 1)%>)" style="cursor: pointer;">
         <td><%=(i + 1)%></td>
         <td><%=xds.getText(baseXpath+"["+(i+1)+"]/@id")%></td>
         <td><%=xds.getText(baseXpath+"["+(i+1)+"]/query/@type")%></td>
         <td><%=xds.getText(baseXpath+"["+(i+1)+"]/@max-rows")%></td>
         <td><%=crud%></td>
         <td><%=buf%></td>
        </tr>
        <tr id="qry<%=(i + 1)%>" style="background-color: #f9f9f9">
         <td>SQL</td>
         <td colspan="5" align="left"><pre>
        <%=xds.getText(baseXpath+"["+(i+1)+"]/query").trim()%>
        </pre></td>
        </tr>
        <tr style="display: none" id="qryi<%=(i + 1)%>">
         <td style="background-color: #ddf">IN</td>
         <td colspan="5" align="left"><%=xds.getText(baseXpath+"["+(i+1)+"]/mapping/setProperty")%></td>
        </tr>
        <tr style="display: none" id="qryo<%=(i + 1)%>">
         <td style="background-color: #ddf">OUT</td>
         <td colspan="5" align="left"><%=xds.getText(baseXpath+"["+(i+1)+"]/mapping/getProperty")%></td>
        </tr>
        <%
        	}
        %>
       </table>
      </div>
     </fieldset>
     <fieldset>
      <legend>Properties Information</legend>
      
      <table>
       <colgroup>
        <col width="30px" />
        <col width="120px" />
        <col align="left" />
        <col />
       </colgroup>
       <tr>
        <th></th>
        <th>name</th>
        <th>value</th>
        <th>description</th>
       </tr>
       <%
       	{
       		String xpath = "/transaction/processor-info/property";
       		int cnt2 = xds.getCount(xpath);
       		for (int j = 0; j < cnt2; j++) {
       %>
       <tr>
        <td><%=(j + 1)%></td>
        <td><input type="text" name="<%=(xpath + "/@name")%>" value="<%=xds.getText(xpath + "/@name", j)%>" />
        </td>
        <td><input type="text" style="width: 100%" name="<%=(xpath + "/@value")%>"
         value="<%=xds.getText(xpath + "/@value", j)%>" />
        </td>
        <td><input type="text" style="width: 100%" name="<%=(xpath + "/@desc")%>"
         value="<%=xds.getText(xpath + "/@desc", j)%>" />
        </td>
       </tr>
       <%
       	}
       	}
       %>
      </table>
     </fieldset>
    </div>
    <div id="tabs-2" class="panel">
     <fieldset>
      <legend>Input Structure</legend>
      
      <%
      	int inCnt = xds.getCount("/transaction/input/block");
      	for (int i = 0; i < inCnt; i++) {
      %>
      <table>
       <caption>
        Block name:
        <%=xds.getText("/transaction/input/block[" + (i + 1)+ "]/@name")%> (<%=xds.getText("/transaction/input/block[" + (i + 1)+ "]/@id")%>)
        <br /> mapping class:<%=xds.getText("/transaction/input/block[" + (i + 1)+ "]/@class")%>
        <br /> ref:<%=xds.getText("/transaction/input/block[" + (i + 1)+ "]/@ref")%>
        </caption>
       <tr>
        <th></th>
        <th>name</th>
        <th>label</th>
        <th>type</th>
        <th>size</th>
        <th>default</th>
        <th>format</th>
        <th>xpath</th>
        <th>properties</th>
       </tr>
       <colgroup>
        <col />
        <col align="left" />
        <col align="left" />
        <col />
        <col />
        <col />
        <col />
        <col />
       </colgroup>
       <%
       	String xpath = "/transaction/input/block[" + (i + 1)+ "]/field";
       		int inFieldCnt = xds.getCount(xpath);
       		for (int j = 0; j < inFieldCnt; j++) {
       			xref.lookup(xpath + "[" + (j + 1) + "]");
       %>
       <tr>
        <td><%=(j + 1)%></td>
        <td><%=xref.getString("name")%></td>
        <td><%=xref.getString("label")%></td>
        <td><%=xref.getString("type")%></td>
        <td><%=xref.getString("size")%></td>
        <td><%=xref.getString("default")%></td>
        <td><%=xref.getString("format")%></td>
        <td><%=xref.getString("xpath")%></td>
        <td><%=xref.getString("properties")%></td>
       </tr>
       <%
       	}
       %>
      </table>
      <%
      	}
      %>
     </fieldset>
     <fieldset>
      <legend>Output Structure</legend>
      
      <%
      	int outCnt = xds.getCount("/transaction/output/block");
      	for (int i = 0; i < outCnt; i++) {
      		xref.lookup("/transaction/output/block" + "[" + (i + 1) + "]");
      %>
      <table>
       <caption>
        Block name:<%=xds.getText("/transaction/output/block[" + (i + 1)+ "]/@name")%> (<%=xds.getText("/transaction/output/block[" + (i + 1)+ "]/@id")%>)
        <br /> mapping class:<%=xds.getText("/transaction/output/block[" + (i + 1)+ "]/@class")%>
        <br /> ref:<%=xds.getText("/transaction/output/block[" + (i + 1)+ "]/@ref")%>
        
       </caption>
       <tr>
        <th></th>
        <th>name</th>
        <th>label</th>
        <th>type</th>
        <th>size</th>
        <th>default</th>
        <th>format</th>
        <th>xpath</th>
        <th>properties</th>
       </tr>
       <colgroup>
        <col />
        <col align="left" />
        <col align="left" />
        <col />
        <col />
        <col />
        <col />
        <col />
       </colgroup>
       <%
       	String xpath = "/transaction/output/block[" + (i + 1)
       				+ "]/field";
       		int inFieldCnt = xds.getCount(xpath);
       		for (int j = 0; j < inFieldCnt; j++) {
       			xref.lookup(xpath + "[" + (j + 1) + "]");
       %>
       <tr>
        <td><%=(j + 1)%></td>
        <td><%=xref.getString("name")%></td>
        <td><%=xref.getString("label")%></td>
        <td><%=xref.getString("type")%></td>
        <td><%=xref.getString("size")%></td>
        <td><%=xref.getString("default")%></td>
        <td><%=xref.getString("format")%></td>
        <td><%=xref.getString("xpath")%></td>
        <td><%=xref.getString("properties")%></td>
       </tr>
       <%
       	}
       %>
      </table>
      <%
      	}
      %>
     </fieldset>
    </div>
    <div id="tabs-3" class="panel">
     <fieldset>
      <legend>BLD Flexiable Schema Information</legend>
      <div class="editable">
      <label>schema type:</label> <select name="interfaceType" id="interfaceType">
       <option value="xml">native xml</option>
       <option value="xsd">xml schema</option>
       <option value="wsdl">wsdl</option>
      </select>  
      <label>new window</label> <select name="openSchemaWin" id="openSchemaWin">
       <option value="inner">inner</option>
       <option value="window">new window</option>
      </select> <button type="button" id="selInterface">submit</button>
      </div>
     </fieldset>
     <fieldset>
      <legend>interface schema</legend>
      <input type="text" name="interfaceUrl" id="interfaceUrl" style="width: 96%" value="" /><br />
      <textarea id="interfaceResult" style="width:96%;height:400px;"></textarea>
     
     </fieldset>
    </div>
    <div id="tabs-4" class="panel">
     <fieldset>
      <legend>Input parameters</legend>
      
      <div class="editable">
      <label>Response type</label> 
      <select name="testDataType" id="testDataType">
       <option value="htm">htm</option>
      <c:forEach var="entity" items="${dataTransformTypes}">
      <option value="${entity}">${entity}</option>
      </c:forEach>
             
      </select> <button type="button" id="bldTestBtn">submit</button>
      </div>
      <%
      	inCnt = xds.getCount("/transaction/input/block");
      	for (int i = 0; i < inCnt; i++) {
      %>
      
      <table>
       <caption>Block name:<%=xds.getText("/transaction/input/block[" + (i + 1)+ "]/@name")%></caption>
       <colgroup>
        <col />
        <col align="left" />
        <col align="left" />
        <col />
        <col />
        <col />
        <col />
       </colgroup>
       <thead>
       <tr>
        <th></th>
        <th>name</th>
        <th>label</th>
        <th>type</th>
        <th>size</th>
        <th>default</th>
        <th>value</th>
       </tr>
       </thead>
       
       <%
       	String inXpath = "/transaction/input/block[" + (i + 1)
       				+ "]/field";
       		int inFieldCnt = xds.getCount(inXpath);
       		for (int j = 0; j < inFieldCnt; j++) {
       			xref.lookup(inXpath + "[" + (j + 1) + "]");
       			String nm = (String) xref.getString("name");
       			String dv = (String) xref.getString("default");
       %>
       <tr>
        <td><%=(j + 1)%></td>
        <td><%=nm%></td>
        <td><%=xref.getString("label")%></td>
        <td><%=xref.getString("type")%></td>
        <td><%=xref.getString("size")%></td>
        <td><%=dv%></td>
        <td><input type="text" name="<%=nm%>" value="<%=dv%>" /></td>
       </tr>
       <%
       	}
       %>
      </table>
      <%
      	}
      %>
     </fieldset>
     <fieldset>
      <legend>Test result</legend>
      <hr />
      <input type="text" name="testUrl" id="testUrl" style="width: 96%" value="" /><br />
      <iframe name="testResult" id="testResult" src="" style="width: 97%; height: 500px; border: 0px;" frameborder="no" src=""></iframe>
     </fieldset>
    </div>
    <div id="tabs-5" class="panel">
     <fieldset>
      <legend>source code generator</legend>
      <select name="sourceGenType" id="sourceGenType">
      <c:forEach var="entity" items="${srcTransformTypes}">
      <option value="${entity}">${entity}</option>
      </c:forEach>
       </select>
      <button type="button" id="sourceGen">Generator</button>
     </fieldset>
     <textarea id="genResult" style="width:96%;height:400px;"></textarea>
    </div>
   </div>
  </form>
 </div>
</body>
</html>
