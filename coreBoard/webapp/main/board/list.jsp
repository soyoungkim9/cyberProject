<%@ page language="java"
         contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>게시물 목록</title>
    <link rel="stylesheet" type="text/css" href="../board/css/list.css" />
</head>
<body>
<div id="wrap">
    <form action="search.cmd">
        <div id="searchBox">
            <select name="searchList">
                <option value="all">전체</option>
                <option value="title">제목</option>
                <option value="name">작성자</option>
            </select>
            <input name="search" type="text">
            <input type="submit" value="검색">
        </div>
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
            <tbody>
            <c:if test="${line == 0}">
                <tr>
                    <td colspan="5">게시글이 없습니다.</td>
                </tr>
            </c:if>
            <c:forEach var="board" items="${boardPage}">
                <tr>
                    <td>
                        ${board.bno}
                    </td>
                    <td>
                        <a href="read.cmd?no=${board.bno}&pageNo=${pageNo}">
                            ${board.title}
                        </a>
                    </td>
                    <td>
                        ${board.name}
                    </td>
                    <td>
                        ${board.sdt}
                    </td>
                    <td>
                        ${board.cnt}
                    </td>
                </tr>
            </c:forEach>
            </tbody>
            <tfoot>
            <c:if test="${line > 0}">
                <tr>
                    <td colspan="5">
                        <a href="list.cmd?pageNo=1">&lt;&lt;</a>
                        <a id="before" href="list.cmd?pageNo=${startPage - 5}">&lt;</a>
                        <c:forEach var="pNo"
                                   begin="${startPage}"
                                   end="${endPage}">
                            <a class="number" href="list.cmd?pageNo=${pNo}">${pNo}</a>
                        </c:forEach>
                        <a id="after" href="list.cmd?pageNo=${startPage + 5}">&gt;</a>
                        <a id="total" href="list.cmd?pageNo=${totalPages}">&gt;&gt;</a>
                    </td>
                </tr>
            </c:if>
            </tfoot>
        </table>
    </form>
    <div>
        <a href="write.cmd">글쓰기</a>
    </div>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="../board/js/list.js"></script>
</body>
</html>