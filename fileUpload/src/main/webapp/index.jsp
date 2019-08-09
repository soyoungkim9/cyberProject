<%--
  Created by IntelliJ IDEA.
  User: CI
  Date: 2019-08-05
  Time: 오전 9:03
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>
  <head>
    <title>fileUpload</title>
    <style>
      body {
        margin: 0;
        padding: 0;
      }
      div {
        margin: 0 auto;
        width: 40%;
      }
      table {
        width: 100%;
        text-align: left;
        margin-top: 5%;
      }
      caption {
        padding-top: 10px;
        padding-bottom: 12px;
        font-weight: bold;
      }
      .delBtn {
        text-decoration: none;
        color: red;
        display: inline-block;
        padding: 10px;
      }
    </style>
  </head>
  <body>
    <div>
      <form action="fileUpload" method="post" enctype="multipart/form-data">
        <fieldset>
          <legend>파일업로드</legend>
          <input type="file" name="uploadFile" multiple>
          <input type="submit" value="업로드!">
        </fieldset>
      </form>
    </div>
    <div>
        <table>
          <caption>서버에 업로드 된 파일 목록</caption>
          <tr>
            <th>번호</th>
            <th>파일명</th>
            <th>날짜</th>
            <th></th>
          </tr>
          <c:if test="${count == 0}">
            <tr><td colspan="3">등록된 파일이 없습니다.</td></tr>
          </c:if>
          <c:forEach var="f" items="${file}" varStatus="status">
            <tr>
              <td>${f["fno"]}</td>
              <td><a href="/fileDownload?fname=${f["name"]}">${f["name"]}</a></td>
              <td>${f["sdt"]}</td>
              <td><a class="delBtn" href="/delete?fno=${f["fno"]}&fname=${f["name"]}">X</a></td>
            </tr>
          </c:forEach>

        </table>
    </div>
  </body>
</html>
