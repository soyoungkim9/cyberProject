
<%@ page contentType="text/html; charset=utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<meta charset="utf-8">


<jsp:include page="parameters.jsp"></jsp:include>
<h2>dialog 예제</h2>
<div>
	<table border="1" style="width: 100%; border-collapse: collapse;">
		<colgroup>
		</colgroup>
		<thead>
			<tr>
				<th>CASE</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>
					<a href="case1.jsp" title="예제 바로가기">화면내 HTML로 다이알로그 띄우기</a>
				</td>
			</tr>
			<tr>
                <td>
                    <a href="case2.jsp" title="예제 바로가기">ajax로 페이지를 불러와서 다이알로그 띄우기</a>
                </td>
            </tr>
            <tr>
                <td>
                    <a href="case3.jsp" title="예제 바로가기">여러가지 콜백들</a>
                </td>
            </tr>
            <tr>
                <td>
                    <a href="case4.jsp" title="예제 바로가기">다이알로그에 버튼 추가하는 방법</a>
                </td>
            </tr>
            <tr>
                <td>
                    <a href="case5.jsp" title="예제 바로가기">모달창으로 띄우기</a>
                </td>
            </tr>
            <tr>
                <td>
                    <a href="dialog.jsp" title="예제 바로가기">종합</a>
                </td>
            </tr>
		</tbody>
	</table>
</div>