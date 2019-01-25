<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="org.owasp.esapi.*" %>
<%@ page import="org.owasp.esapi.filters.*" %>

<html>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" type="text/css" href="/common/css/content.css" />

<script type="text/javascript" src="/common/jslib/prototype.js"></script>
<script type="text/javascript" src="/common/jslib/common.js"></script>
<script type="text/javascript">

</script>

</head>


<body>
 <div class="bodyArea">


  <div class="inputSection">

  </div>


  <div class="dataSection">

  </div>

 </div>
 
 <%
 java.util.Set requiredNames = new java.util.HashSet();
	//requiredNames.add("p1");
	

	java.util.Set optionalNames = new java.util.HashSet();
	//optionalNames.add("p4");
	//optionalNames.add("p5");
	//optionalNames.add("p6");
  
	
	Validator instance = ESAPI.validator();
	boolean result=instance.isValidHTTPRequestParameterSet("HTTPParameters", request, null, null);
  
  
	SecurityWrapperRequest req = new SecurityWrapperRequest(request);
  

 
%>

getQueryString : <%=req.getQueryString() %> <br/>
test:<%=req.getParameter("test") %> <br/>
han:<%=req.getParameter("han") %> <br/>

<%=result %>
<form action="?test" method="post">
<input type="text" name="han" value=""/>


<input type="submit" value="ok"/>

</form>
</body>
</html>