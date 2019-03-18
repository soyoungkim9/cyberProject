<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>

<jsp:useBean id="output" class="coreframe.data.DataSet" scope="request"></jsp:useBean>

<html>
<head>
<title>BLD�� JSP�� �̿��� coreframe ���߹��(case1): ��Ͽ���</title>
<meta name="keywords"
	content="coreframe, framework, developement, web standard" />
<meta name="description"
	content="coreframe�� ���� ���߹����  BLD�� JSP ���� �̿��� ���߹���Դϴ�." />
<meta name="author"
	content="Sungkwon Kim, manpower@cyber-i.com, CyberImagination,Inc." />
</head>


<body>
<form action="" method="post" class="boardListForm">
<fieldset><legend>�Խù� ���</legend>
<table cellspacing="0" class="tbl"
	summary="List of Cities">
	<colgroup>
		<col width="5%" class="code" />
		<col width="20%"/>
		<col width="20%"/>
		<col width="10%"/>
		<col width="20%"/>
		<col width="25%"/>
	</colgroup>

	<tr>
		<th scope="col">id</th>
		<th scope="col">name</th>
		<th scope="col">country</th>
		<th scope="col">airport</th>
		<th scope="col">language</th>
		<th scope="col">action</th>
	</tr>

	<%
		for (int i = 0, n = output.getCount("id"); i < 10; i++) {
			String id = output.getText("id", i);
	%>
	<tr>
		<td><%=id%></td>
		<td><a href="javascript:view('<%=id%>');"><%=output.getText("name", i)%></a></td>
		<td><%=output.getText("country", i)%></td>
		<td><%=output.getText("airport", i)%></td>
		<td><%=output.getText("language", i)%></td>
		<td>
		<span class="btn_pack medium icon">
				<span class="update">
				</span>
			<button type="button" onclick="update('<%=id%>');">update</button>
			</span>
			
			<span class="btn_pack medium icon">
				<span class="delete">
				</span>
			<button type="button" onclick="del('<%=id%>');">delete</button>
		</span>
		</td>
	</tr>
	<%
		}
	%>
</table>
</fieldset>

<div id="searchbarbg">
<div id="searchbar">
	<span class="b rightTab">�˻� ����</span>	
	<select name="searchType">
	<option>����+����</option>
	<option>����</option>
	<option>����</option>
	</select> 
	
	<input name="btn" type="text" class="inputText" title="�˻�" /> 
	<span class="btn_pack medium">
		<a href="javascript:document.form.submit();" >search</a>
	</span>
</div>
</div>

	
</form>

<script type="text/javascript">
	//<![CDATA[
	function view(id) {
		window.location.href = '?cmd=view&id=' + id;
	}

	function update(id) {
		window.location.href = '?cmd=preUpdate&id=' + id;
	}

	function del(id) {
		if (window.confirm('�����Ͻðڽ��ϱ�?')) {
			window.location.href = '?cmd=delete&id=' + id;
		}
	}
	//]]>
</script>
</body>
</html>