<%@ page language="java"
		contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="jdbc.ConnectionProvider" %>
<%@ page import="java.sql.*" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>게시물 목록</title>
</head>
<body>
	<%
		try(Connection conn = ConnectionProvider.getConnection()) {
			out.println("커넥션 연결 성공함d");
		} catch(SQLException ex) {
			out.println("커넥션 연결 실패함 : " + ex.getMessage());
			application.log("커넥션 연결 실패", ex);
		}
	%>
	<%--  <%= request.getAttribute("hello") %> --%>
	<div id="wrap">
		<form>
			<table>
				<thead>
					<tr>
						<th>번호</th>
						<th>제목</th>
						<th>작성자</th>
						<th>작성일</th>
						<th>조회</th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
		</form>
	</div>
</body>
</html>