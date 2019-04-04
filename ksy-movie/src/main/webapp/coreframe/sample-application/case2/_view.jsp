<%@ page language="java" contentType="text/html; charset=EUC-KR"
  pageEncoding="EUC-KR"%>
<jsp:useBean id="output" class="coreframe.data.DataSet" scope="request"></jsp:useBean>

<html>
<head>
<title>도시정보 보기</title>
</head>

<body>
<fieldset><legend>example</legend>
<table class="tbl detail">
  <colgroup>
    <col width="25%" class="code"/>
    <col width="25%"/>
    <col width="25%" class="code"/>
    <col width="25%"/>
  </colgroup>
  <tr>
    <th>ID</th>
    <td><%=output.getText("id")%></td>
    <th>name</th>
    <td><%=output.getText("name")%></td>
  </tr>
  <tr>
    <th>국가명</th>
    <td><%=output.getText("country")%></td>
    <th>국가ISO코드</th>
    <td><%=output.getText("countryIsoCode")%></td>
  </tr>
  <tr>
    <th>공항</th>
    <td><%=output.getText("airport")%></td>
    <th>언어</th>
    <td><%=output.getText("language")%></td>
  </tr>
</table>
</fieldset>

</body>
</html>