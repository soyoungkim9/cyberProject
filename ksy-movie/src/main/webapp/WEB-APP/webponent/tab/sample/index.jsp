
<%@ page contentType="text/html; charset=utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<meta charset="utf-8">

<jsp:include page="parameters.jsp"></jsp:include>

<h2>tab mode</h2>
<div>
	<table border="1" style="width: 100%; border-collapse: collapse;">
		<colgroup>
			<col width="10%" />
			<col width="*" />
		</colgroup>
		<thead>
			<tr>
				<th>type</th>
				<th>description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>
					<a href="tab_dom.jsp" title="예제 바로가기">DOM TAB</a>
				</td>
				<td>각각panel을 DOM으로 직접 하드코딩하여 tab을 구성</td>
			</tr>
			<tr>
				<td>
					<a href="tab_ajax.jsp" title="예제 바로가기">AJAX TAB</a>
				</td>
				<td>각각panel이 별도의 페이지로 존재하여 ajax를 통하여 페이지를 load</td>
			</tr>
		</tbody>
	</table>
</div>