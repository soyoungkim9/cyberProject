<!DOCTYPE html>
<%@page import="coreframe.CoreApplication"%>
<%@page import="coreframe.util.*"%>
<%@page import="coreframe.service.*"%>
<%@page import="coreframe.service.performance.*"%>

<%@page import="java.lang.management.*"%>
<%@page import="java.util.*"%>
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

<style>
div.mem {
 width:200px;
 background-color:#00CC00;
 float:left;
}
div.mem div {
 background-color:#CC0000;
 height:14px;
}
div.red {
 width:80px;
 height:16px;
 background-color:#CC0000;
 color:#ffffff;
 font-weight:bold;
 text-align:center;
}

div.RUNNING {
 width:80px;
 height:16px;
 background-color:#0000CC;
 color:#ffffff;
 font-weight:bold;
 text-align:center;
}

</style>
</head>

<body>
<div class="ContentTabSet">

		<div class="resourceName">System Information</div>

		<a class="tab" href="#1">coreFrame info</a>
		<a class="tab" href="#2">Memory</a>
		<a class="tab" href="#svc">Service info</a>
		<a class="tab" href="#3">JVM</a>
		<a class="tab" href="#4">extra info</a>
		
		<a class="tab" href="#6">System properties</a>
		<a class="tab" href="?">REFRESH</a>
		
	</div>

<br/> 
<table class="tableList" border="1" id="1" >
<colgroup>
<col class="name"/>
<col class="value wrap"/>
</colgroup>

<thead >
<tr>
<th>Property</th>
<th>Value</th>
</tr>
</thead>

<tbody>
<tr>
<td colspan='2' class='sectionHead' >coreFRAME Information</td>
</tr>

 <tr>
  <td><label class="paramName">coreFRAME Version</label></td>
  <td><strong><%=CoreApplication.getInstance().getMajorVersion() %></strong> (build:<%=CoreApplication.getInstance().getMinorVersion() %>)</td>
 </tr>

 <tr>
  <td><label class="paramName">coreFRAME Config Home</label></td>
  <td><%=CoreApplication.getInstance().getAttributeText(CoreApplication.COREFRAME_CONFIG_HOME) %></td>
 </tr>
 <tr>
  <td><label class="paramName">coreFRAME Config File</label></td>
  <td><%=CoreApplication.getInstance().getAttributeText(CoreApplication.COREFRAME_CONFIG_FILE) %></td>
 </tr> 
 <tr>
  <td><label class="paramName">System Current DateTime</label></td>
  <td><%=DateTime.getDateString() %> <%=DateTime.getTimeString() %></td>
 </tr>

<tr>
  <td><label class="paramName">VM start time</label></td>
  <td><%=DateTime.getString(ManagementFactory.getRuntimeMXBean().getStartTime(),"yyyy-MM-dd HH:mm:ss") %></td>
 </tr>
 <tr>
  <td><label class="paramName">coreFRAME load time</label></td>
  <td><%=CoreApplication.getInstance().getAttributeText(CoreApplication.FRAMEWORK_LOADTIME) %></td>
 </tr> 
 <tr>
  <td><label class="paramName">BLD Home Directory</label></td>
  <td><%=CoreApplication.getInstance().getAttributeText(CoreApplication.BLD_ROOT_DIRECTORY) %></td>
 </tr>
 
 <tr>
  <td><label class="paramName">web document root</label></td>
  <td><%=CoreApplication.getInstance().getAttributeText(CoreApplication.WEB_DOCUMENT_ROOT) %></td>
 </tr>

 <tr>
  <td><label class="paramName">Framework Library Path</label></td>
  <td><%=CoreApplication.getFrameworkLibraryPath() %></td>
 </tr>

 <tr>
  <td><label class="paramName">Server Ip</label></td>
  <td><%=java.net.InetAddress.getLocalHost().getHostAddress() %></td>
 </tr> 
 

<%
MemoryUsage mu = ManagementFactory.getMemoryMXBean().getHeapMemoryUsage();
long totalMem = mu.getMax();
long totalAlcMem = mu.getCommitted();
long usedMem = mu.getUsed();

long percent = (totalMem-usedMem)*100/totalMem;

%> 



<tr>
<td colspan='2' class='sectionHead' id="2">Java VM Memory Statistics</td>
</tr>
 <tr>
  <td><label class="paramName">Heap Memory</label></td>
  <td>
  <div class="mem"><div style="width:<%=(100-percent)%>%"></div></div> 
  &nbsp; <strong><%=percent %> % Free</strong>
  </td>
 </tr>
 <tr>
  <td><label class="paramName">Maximum Heap Size</label></td>
  <td><%=trans(totalMem)%></td>
 </tr>
 <tr>
  <td><label class="paramName">Total Allocated Memory</label></td>
  <td><%=trans(totalAlcMem)%></td>
 </tr>
 <tr>
  <td><label class="paramName">Used Memory</label></td>
  <td><%=trans(usedMem)%></td>
 </tr>
 <tr>
  <td><label class="paramName">Free Allocated Memory</label></td>
  <td><%=trans((totalAlcMem-usedMem))%></td>
 </tr>
 <tr>
  <td><label class="paramName">Total Free Memory</label></td>
  <td><%=trans((totalMem-usedMem))%></td>
 </tr> 
 <%
 
mu = ManagementFactory.getMemoryMXBean().getNonHeapMemoryUsage();
 totalMem = mu.getMax();
 totalAlcMem = mu.getCommitted();
 usedMem = mu.getUsed();
 percent = (totalMem-usedMem)*100/totalMem;
%> 
 
 <tr>
  <td><label class="paramName">Permanent Generation Memory</label></td>
  
   <td>
  <div class="mem"><div style="width:<%=(100-percent)%>%"></div></div> 
   &nbsp; <strong><%=percent %> % Free</strong>
  </td>
 </tr>
 <tr>
  <td><label class="paramName">Maximum PermGen</label></td>
  <td><%=trans(totalMem) %></td>
 </tr>
 <tr>
  <td><label class="paramName">Used PermGen</label></td>
  <td><%=trans(usedMem) %></td>
 </tr> 
 </tbody>
 </table>
 
 
<%
Service[] services = CoreApplication.getInstance().getServiceManager().getServiceArray();
%>
		
<table class="tableList" border="1" id="svc">
<colgroup>
<col class="name"/>
<col class="value wrap"/>
<col class="wrap"/>
</colgroup>

<thead>
<tr>
<th>Status</th>
<th>Service Name</th>
<th>Class name</th>
</tr>
</thead>

<tbody>
<tr>
<td colspan='3' class='sectionHead' >coreFRAME Service Information</td>
</tr>

<%
for (Service service : services) {


%>
<tr>
 <td><div class="<%= service.getStatusText()%> red"><%= service.getStatusText()%></div></td>
 <td><strong><%= service.getName()%></strong></td>
 <td><%= service.getClass().getName()%> </td>
 

<% } %>
</tbody>
</table>		
 
 
 
 <table class="tableList" border="1" id="3" >
<colgroup>
<col class="name"/>
<col class="value wrap"/>
</colgroup>

<thead >
<tr>
<th>Property</th>
<th>Value</th>
</tr>
</thead>

<tbody>
<tr>
<td colspan='2' class='sectionHead' >Java Runtime Environment</td>
</tr>
 <tr>
  <td><label class="paramName">Operating System</label></td>
  <td><%=System.getProperty("os.name") %> (version:<%=System.getProperty("os.version") %>)</td>
 </tr>
 <tr>
  <td><label class="paramName">OS Architecture</label></td>
  <td><%=System.getProperty("os.arch") %></td>
 </tr>
 <tr>
  <td><label class="paramName">CPU process num</label></td>
  <td><%=Runtime.getRuntime().availableProcessors() %></td>
 </tr>
  <tr>
  <td><label class="paramName">Thread Active Count</label></td>
  <td><%=Thread.activeCount() %> </td>
 </tr>
 <tr>
  <td><label class="paramName">Deadlocked Thread Count</label></td>
  <td><%=nullToZero(ManagementFactory.getThreadMXBean().findMonitorDeadlockedThreads() )%></td>
 </tr>
 
 <tr>
  <td><label class="paramName">Java Version</label></td>
  <td><%=System.getProperty("java.runtime.version") %></td>
 </tr>
 <tr>
  <td><label class="paramName">JVM Implementation Version</label></td>
  <td><%=System.getProperty("java.vm.version") %></td>
 </tr> 
 
 <tr>
  <td><label class="paramName">Java VM</label></td>
  <td><%=System.getProperty("java.vm.name") %></td>
 </tr>
 <tr>
  <td><label class="paramName">Java Runtime Arguments</label></td>
  <td>
<%
java.util.List<String> s=ManagementFactory.getRuntimeMXBean().getInputArguments();
for(String arg:s) {
	out.println(arg + "<br/>");
}
%>  
  </td>
  

 </tr>
 
 <tr>
  <td><label class="paramName">Java Runtime Classpath</label></td>
  <td><%=ManagementFactory.getRuntimeMXBean().getClassPath() %></td>
 </tr>
 <tr>
  <td><label class="paramName">Java Runtime Library path</label></td>
  <td><%
String p = System.getProperty("path.separator");
String p1=ManagementFactory.getRuntimeMXBean().getLibraryPath();
p1=StringUtil.replaceStr(p1, p, "<br/>");
out.println(p1);
%></td>
 </tr>
 
 <tr>
  <td><label class="paramName">User Name</label></td>
  <td><%=System.getProperty("user.name") %></td>
 </tr>
 <tr>
  <td><label class="paramName">System Language</label></td>
  <td><%=System.getProperty("user.language") %></td>
 </tr>
 <tr>
  <td><label class="paramName">System Timezone</label></td>
  <td><%=System.getProperty("user.timezone") %></td>
 </tr> 
  <tr>
  <td><label class="paramName">Filesystem Encoding</label></td>
  <td><%=System.getProperty("file.encoding") %></td>
 </tr> 
 
 

<tr>
<td colspan='2' class='sectionHead' id="4">coreFRAME Extra Information</td>
</tr>

  <tr>
  <td><label class="paramName">WebSecurity Manager Classname</label></td>
  <td><%=CoreApplication.getInstance().getWebSecurityManager().getClass().getName() %></td>
 </tr>
 
<%
PerformanceMonitor pm = PerformanceMonitor
.getInstance(PerformanceMonitor.WEBPAGE);

if (pm != null) {
%>
  <tr>
  <td><label class="paramName">current TPS</label></td>
  <td><%=NumericUtil.format(pm.getCurrentTPS(), "#,##0.000")%></td>
 </tr>
 <tr>
  <td><label class="paramName">Max TPS</label></td>
  <td><%=NumericUtil.format(pm.getMaxTPS(), "#,##0.000")%></td>
 </tr>
 <tr>
  <td><label class="paramName">Average TPS</label></td>
  <td><%=NumericUtil.format(pm.getAvgTPS(), "#,##0.000")%></td>
 </tr>
 
<%
} else {
%>
 <tr>
  <td><label class="paramName">Performance Package</label></td>
  <td><strong>not installed (or not configuration)</strong></td>
 </tr>
<%	
}
%>	
 <tr>
  <td><label class="paramName">BeanFactory class name</label></td>
  <td><%=CoreApplication.getInstance().getBeanFactory().getClass().getName() %></td>
 </tr>
 </tbody>
 
 
<thead >
<tr>
<th>Bean ID</th>
<th>Bean Class Name</th>
</tr>
</thead>
 
 <tbody>

<%
coreframe.beans.BeanFactory bf= CoreApplication.getInstance().getBeanFactory();
String[] bx = CoreApplication.getInstance().getBeanDefinitionNames();
java.util.Arrays.sort(bx, String.CASE_INSENSITIVE_ORDER);

for(String b:bx) {
	Class c = bf.getType(b);
	String cn = c.getName();
	String rsrcNm=StringUtil.replaceStr(cn, ".", "/")+".class";
	
	if(c==null) {
	  out.println(b+" <br/>");
	}else {
		out.println("<tr><td>"+b+"</td><td><strong>"+ c.getName()+"</strong> ("+c.getClassLoader().getResource(rsrcNm)+")</td></tr>");
	}
}
%>
</tbody>

<thead >
<tr>
<th>Framework PropertyID</th>
<th>Value</th>
</tr>
</thead>

<tbody>
<%

String[] kys = CoreApplication.getInstance().getAttribyteKeyArray();
int seq = 1;
for (String keyName : kys) {
%>
<tr>
 <td><label class="paramName"><%=keyName%></label></td>
 <td><%=CoreApplication.getInstance().getAttributeText(keyName) %></label></td>
</tr>
<%
}
%> 
 
</tbody>
  
</table>





<table class="tableList" border="1" id="6">
<colgroup>
<col class="name"/>
<col class="value wrap"/>

</colgroup>

<thead>
<th>Key Name</th>
<th>value</th>

</thead>

<tbody>
<tr>
<td colspan='2' class='sectionHead' >System Properties</td>
</tr>
<%
Enumeration<Object> keys = System.getProperties().keys();

			while (keys.hasMoreElements()) {
				String key = (String) keys.nextElement();
%>

 <tr>
  <td><label class="paramName"><%=key %></label></td>
  <td><%=System.getProperty(key) %></td>
 </tr> 
 

<%
			}
%>			
</tbody>
</table>

</body>

<%!
private static String trans(long val ) {
	
	return (val/1024/1024) +" MB";
}

private static String nullToZero(long[] val ) {
	if(val==null) return "0";
	return val.length+"";
}

%>
</html>