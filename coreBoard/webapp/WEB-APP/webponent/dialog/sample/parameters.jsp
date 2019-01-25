<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div>
	<h2>dialog 초기화 parameter</h2>
	<table border="1" style="width: 100%; border-collapse: collapse;">
		<colgroup>
			<col width="10%" />
			<col width="*" />
		</colgroup>
		<thead>
			<tr>
				<th>name</th>
				<th>description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>id</td>
				<td>[string] 해당 id으로 설정된 dialog가 만들어진다</td>
			</tr>
			<tr>
				<td>title</td>
				<td>[string] dialog 상단의 제목</td>
			</tr>
			<tr>
				<td>dom</td>
				<td>[selector] 화면내의 마크업으로 dialog를 띄울때 사용 (clone해서 띄워주니, id속성 유의)</td>
			</tr>
			<tr>
				<td>url</td>
				<td>[string] ajax로 페이지를 불러와서 dialog를 띄울때 사용 (ajax url)</td>
			</tr>
			<tr>
				<td>ajaxOption</td>
				<td>[object] ajax로 페이지를 불러와서 dialog를 띄울때 사용 (ajax option)</td>
			</tr>
			<tr>
				<td>focus</td>
				<td>[selector] 다이알로그 닫친뒤 포커스를 주고싶은 요소</td>
			</tr>
			<tr>
				<td>data</td>
				<td>[object] dialog객체에 특정 데이터를 저장한다. (ci.dialog.getData('dialog-id','key') 사용해서 가져올수있다)</td>
			</tr>
			<tr>
				<td>notitle</td>
				<td>[boolean] true 속성이면 타이틀이 지워짐</td>
			</tr>
			<tr>
				<td>msg</td>
				<td>[boolean] 간단한 텍스트를 dialog로 띄울때 사용</td>
			</tr>
			<tr>
				<td>close</td>
				<td>[function] dialog가 닫힐때 호출되는 콜백 (dialog DIV가 this로 바인딩 되어있다)</td>
			</tr>
			<tr>
				<td>afterAppend</td>
				<td>[function] dialog가 띄워진후 호출되는 콜백 (dialog DIV가 this로 바인딩 되어있다)</td>
			</tr>
			<tr>
				<td>buttons</td>
				<td>[array] dialog 하단에 추가될 object배열 (각 object는 'text' , 'click' 값이 있어야 한다)</td>
			</tr>
			<tr>
				<td>clostButtonText</td>
				<td>[string] 닫기버튼의 텍스트를 지정한다(default - 닫기)</td>
			</tr>
			<tr>
				<td>modal</td>
				<td>[boolean] true 속성을주면 dialog밑에 화면을 컨트롤 할 수 없다(default - false)</td>
			</tr>
			<tr>
				<td>reopen</td>
				<td>[boolean] true이면 같은 id의 dialog가 화면에 존재할때 원래 dialog를 닫고 다시 띄우며 false이면 이전 dialog에 포커스만 준다 (default - false)</td>
			</tr>
		</tbody>
	</table>
</div>