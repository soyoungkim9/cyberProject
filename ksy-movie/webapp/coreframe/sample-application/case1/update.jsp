<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>

<%@ page import="coreframe.data.*"%>

<%
	InteractionBean interact = new InteractionBean();

	DataSet input = interact.getDataSet(request);
	DataSet output = new DataSet();

	if ("update".equals(request.getParameter("cmd"))) {
		interact.execute("samples/database/updateCity", input);
		response.sendRedirect("./list.jsp");
	} else {
		interact.execute("samples/database/readCity", input, output);
	}
%>

<html>
<head>
<title>BLD�� JSP�� �̿��� coreframe ���߹��(case1): ���� Form ����</title>
<meta name="keywords"
	content="coreframe, framework, developement, web standard" />
<meta name="description"
	content="coreframe�� ���� ���߹����  BLD�� JSP ���� �̿��� ���߹���Դϴ�." />
<meta name="author"
	content="Sungkwon Kim, manpower@cyber-i.com, CyberImagination,Inc." />
</head>



<body>


<form name="frm" action="?" method="post">
<input type="hidden" name="cmd" value="update" />
<input type="hidden" name="id" value="<%=output.get("id")%>" />


<fieldset class="control">
<legend>�����</legend> 
<span id="msg"></span>

<span class="button"><input type="button" value="��Ϻ���" onclick="list();"/></span> 
<span class="button"><input type="button" value="����" onclick="save();"/></span>
</fieldset>


<fieldset class="section">
<legend>�⺻�Ӽ�</legend>
<table class="tbl detail">
<colgroup>
    <col width="30%" class="code"/>
    <col width="70%"/>
  </colgroup>
	<tr>
	<th><label for="name" accesskey="c">name</label> </th>
	<td><input id="name" type="text" name="name" value="<%=output.get("name")%>" /></td>
	</tr>
	
	<tr>
	<th><label for="country" accesskey="c">country</label> </th>
	<td><input id="country" type="text" name="country" value="<%=output.get("country")%>" /></td>
	</tr>
	
	<tr>
	<th><label for="airport" accesskey="c">airport</label> </th>
	<td><input id="airport" type="text" name="airport" value="<%=output.get("airport")%>" /></td>
	
	</tr>
	
	<tr>
	<th><label for="language" accesskey="c">language</label> </th>
	<td><input id="language" type="text" name="language" value="<%=output.get("language")%>" /></td>
	</tr>
	
</table>
</fieldset>


</form>


<script type="text/javascript">
	//<![CDATA[
	function list() {
		window.location.href = "./list.jsp";
	}

	function save() {
		document.frm.submit();
	}
	//]]>
</script>
</body>
</html>