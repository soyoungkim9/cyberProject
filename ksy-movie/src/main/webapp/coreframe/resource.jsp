<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>


<%
    String reqName = null;
    java.net.URL classUrl = null;

    reqName = request.getParameter("reqName");
    if (reqName == null || reqName.trim().length() == 0) {
        reqName = "";
    }
%>

<html>
<body onLoad="document.form1.reqButton.focus();">

<br><hr align=center><br>
[Example]<br>
Document Builder Factory - org.apache.xerces.jaxp.DocumentBuilderFactoryImpl<br>
SAX Parser Factory - org.apache.xerces.jaxp.SAXParserFactoryImpl<br>
Transformer Factory - org.apache.xalan.processor.TransformerFactoryImpl<br>
<br>
(ex) org.apache.xerces.jaxp.DocumentBuilderFactoryImpl<br>

<form action="?" name=form1>
<input type=text name="reqName" value="<%= reqName %>" size="50">
<input type=submit name=reqButton value="FIND">
</form>

<%
    if (reqName.trim().length() != 0) {
%>

[Search Result]
<br>
<%
  reqName = reqName.replace('.', '/').trim();
 reqName = "/" + reqName + ".class";
        classUrl = this.getClass().getResource(reqName);
        if (classUrl == null) {
            out.println(reqName + " not found");
        } else {
            out.println("<b>" + reqName + "</b>: [" +
classUrl.getFile() + "]\n"
);
        }
        out.println("<br>");

    }
%>
