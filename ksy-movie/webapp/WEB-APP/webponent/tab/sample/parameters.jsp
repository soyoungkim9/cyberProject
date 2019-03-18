<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div>
	<h2>tab 초기화 parameter (두번째는 object를 받는다)</h2>
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
				<td>첫번째 param</td>
				<td>[dom selector] tab-selector 와 tab-panel 을 감싸고 있는 div (필수)</td>
			</tr>
			<tr>
				<td>mode</td>
				<td>[string] ajax, dom 모드가 있음 (default - dom)</td>
			</tr>
			<tr>
				<td>defaultTabIndex</td>
				<td>[number] tab이 초기화되면서 선택되어질 tab index (default - 0)</td>
			</tr>
			<tr>
				<td>disabled</td>
				<td>[array] 비활성화될 tab-panel 의 인덱스 배열 (default - none)</td>
			</tr>
			<tr>
				<td>autoOpen</td>
				<td>[boolean] 탭을 자동으로 열것인지 세팅 (탭셀렉터를 클릭하기 전까지 탭이 열리지 않는다.)</td>
			</tr>
			<tr>
				<td>panelOpen</td>
				<td>
					[function] 탭 패널이 열린 후 발생하는 콜백(탭 패널이 열린후 서버와 통신을 할때 사용할 수 있다.) <br /> [콜백인자 : e - 이벤트, s - 해당탭의 셀렉터, p - 해당탭 패널]
				</td>
			</tr>
			<tr>
				<td>panelClose</td>
				<td>
					[function] 탭 패널이 닫힌 후 발생하는 콜백(탭 패널이 닫힌후 자원을 반납하거나 할때 사용 할 수 있다.) <br /> [콜백인자 : e - 이벤트, s - 해당탭의 셀렉터, p - 해당탭 패널]
				</td>
			</tr>
		</tbody>
	</table>
</div>