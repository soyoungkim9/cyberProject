<%@ page language="java"
 		contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>게시물 읽기</title>
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/view.css">
</head>
<body>
	<div id="wrap">
		<div>
			<span class="borderCss1">번호</span>${board.bno}
		</div>
		<table>
			<tr>
				<td>${board.title}</td>
			</tr>
			<tr>
				<td><span class="borderCss1">작성자</span>${board.name}</td>
				<td><span class="borderCss1">등록일</span>${board.sdt}</td>
			</tr>
			<tr>
				<td><pre>${board.content}</pre></td>
			</tr>
			<tr>
				<c:if test="${board.fileURL ne null}">
					<td><img src="upload/${board.fileURL}"></td>
				</c:if>
			</tr>
			<tfoot>
				<tr>
					<td colspan="2">
					<c:set var="pageNo" value="${empty param.pageNo ? '1' : param.pageNo}"/>
						<a class="btnCss1" href="list.do?pageNo=${pageNo}">목록</a>
						<a class="btnCss1" href="modify.do?no=${board.bno}&pageNo=${pageNo}">게시글수정</a>		
						<a class="btnCss1" id="boardDelete" data-pwd="${board.pwd}"
							href="delete.do?no=${board.bno}&pageNo=${pageNo}">게시글삭제</a>
					</td>
				</tr>
			</tfoot>
		</table>
		<form id="writeComment" action="read.do" method="post">
			<table>
				<tbody>
					<tr>
						<td>
						<input type="text" name="name" placeholder="이름" value="${param.name}">
						<input type="text" name="pwd" placeholder="암호" value="${param.pwd}">
						</td>
					</tr>
					<tr>
						<td>
							<textarea rows="5" cols="40" name="content">${param.content}</textarea>
						</td>				
					</tr>
					<tr>
						<td><input type="submit" value="등록"></td>
					</tr>
				</tbody>
			</table>
		</form>
		<form action="updateComment.do" method="post">
			<table id="comment">
				<tbody>
				<c:if test="${size == 0}">
					<tr>
						<td colspan="3">등록 된 댓글이 없습니다.</td>
					</tr>
				</c:if>	
				<c:forEach var="comments" items="${comments}">			
					<tr class="comments">
						<td>
							<h3>${comments.name}<span class="dateCss1">${comments.sdt}</span></h3>
							<input class="cno" type="hidden" name="cno" value="${comments.cno}">
						</td>
						<td class="originContent">
							<pre class="origin" data-cno="${comments.cno}">${comments.content}</pre>
							<a class="replyBtn" data-cno="${comments.cno}"
								href="read.do?no=${board.bno}&pageNo=${pageNo}&cno=${comments.cno}">[답변]</a>
							<a class="updateComment1">[수정]</a>
							<span class="updateBox">
							<textarea rows="5" cols="40" name="comment" 
								class="updateContent">${comments.content}</textarea>
							<input type="text" name="pwd" class="inputPwd"
								 data-originPwd="${comments.pwd}" placeholder="암호를 입력해 주세요">
							</span>
							<input class="updateComment2" type="submit" value="수정">
							<a class="origin pwd commentDelete" data-pwd="${comments.pwd}"
								href="deleteComment.do?cno=${comments.cno}&no=${board.bno}&pageNo=${pageNo}">
								[삭제]</a>
						</td>
					</tr>
				</c:forEach>
				</tbody>
			</table>
			<div>
				<a id="showComment">더보기</a>
			</div>
			<input type="hidden" name="bno" value="${board.bno}">
			<input type="hidden" name="pageNo" value="${param.pageNo}">
		</form>
		<div class="replyForm"> <!--cno 값을 가져오는 것이 관건임 update.do로 처리함...하-->
			<span class="inputForm">
				<input type="text" name="name" placeholder="이름">
				<input type="text" name="pwd" placeholder="암호">
			</span>
			<textarea rows="3" cols="20" name="content"></textarea>
			<input class="replySubmit" type="submit" value="등록">
			<a href="read.do?no=${board.bno}&pageNo=${pageNo}">취소</a>
		</div>
	</div>
	<div id="replyBox">
		<c:forEach var="reply" items="${reply}"> <!--  하.. 이태그가 안먹음... -->
			<div class="reply">
				<div>
					<h3>${reply.name}<span class="dateCss1">${reply.sdt}</span></h3>
				</div>
				<div>
					<a>[수정]</a>
					<a>[삭제]</a>
				</div>
				<div>
				
				</div>
			</div>
		</c:forEach>
	</div>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="${pageContext.request.contextPath}/js/view.js"></script>
</body>
</html>