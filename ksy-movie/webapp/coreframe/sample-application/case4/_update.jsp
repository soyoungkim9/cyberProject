<%@ page language="java" contentType="text/html; charset=EUC-KR"
  pageEncoding="EUC-KR"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html>
<head>
<title>�������</title>
<script>
function list() {
  window.location.href="./list.do";
}

function save() {
  document.frm.submit();
}

</script>
</head>

<body>


<form name="frm" action="./update.do" method="post">
<input type="hidden" name="id" value="<c:out value="${output.id}"/>" />


<fieldset class="control">
  <legend>�����</legend>

  <span id="msg"></span>

  <input type="button" value="��Ϻ���" onclick="list();"/>
  <input type="button" value="����" onclick="save()"/>
</fieldset>


<fieldset class="section">
<legend>�⺻�Ӽ�</legend>

<p>
<label for="name" accesskey="c">name</label> 
<input id="name" type="text" name="name" value="<c:out value="${output.name}"/>" />
</p>

<p>
<label for="country" accesskey="c">country</label> 
<input id="country" type="text" name="country" value="<c:out value="${output.country}"/>" />
</p>

<p>
<label for="airport" accesskey="c">airport</label> 
<input id="airport" type="text" name="airport" value="<c:out value="${output.airport}"/>" />
</p>

<p>
<label for="language" accesskey="c">language</label> 
<input id="language" type="text" name="language" value="<c:out value="${output.language}"/>" />
</p>

</fieldset>


</form>


</body>
</html>