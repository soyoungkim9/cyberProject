<!-- 주식주문 -->

<%@ page contentType="text/html; charset=utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<meta charset="utf-8">

<div class="screen">
	<h2>WebPonent Ajax Grid</h2>
	<h3>개요</h3>
	<p>WebPonent Ajax Grid는 기존 HTML table 의 기능을 확장하기 위하여 Html 양식의 table 을 간단한 javascript 함수를 이용하여 RIA 수준의 Grid를 구현하기 위한 HTML/JavaScript 기반의 Grid 이다.</p>
	<p>기본적인 디자인이나 데이터 양식은 HTML 의 Table 태그를 그대로 이용하여 구현하고, $.dataGrid('#tableID', {'width' : 800,'height' : 200}) 와 같은 방식으로 기존의 table을 확장한다.</p>
	<ul>
		<li>헤더가 고정된 상태에서 가로/세로축 scrolling 기능</li>
		<li>컬럼폭 resize 기능</li>
		<li>컬럼 타입별 sort 기능</li>
		<li>AJAX 방식에 의한 외부 데이터 호출기능</li>
		<li>오른쪽 팝업메뉴기능</li>
		<li>다중 row 선택 기능</li>
		<li>엑셀출력기능</li>
		<li>웹표준 준수</li>
	</ul>

	<h4>목차</h4>
	<ol>
		<li>
			<a href="#ch2">사용법</a>
		</li>
		<li>
			<a href="#ch3">확장 옵션</a>
		</li>
		<li>
			<a href="#ch4">grid 함수</a>
		</li>
	</ol>


	<h3 id="ch2">사용법</h3>
	<ol>
		<li>표현하고자 하는 그리드 모양을 일반적인 표준 HTML table를 작성한다.</li>
		<li>작성한 HTML table은 반듯이 고유한 id를 부여한다.</li>
		<li>
			col의 id는 반드시 부여하여야 하며 해당 table tag내에서 고유하여야 한다.<br /> col의 id는 페이지 내의 다른 아이디와의 충돌을 피하기 위하여 col_ 를 반드시 prefix로 붙여 준다. <br /> (ex : &lt;col id="col_id" width="50" align="left" /&gt; )<br /> col의 id는 내부로직에 쓰이며 데이터를 가져오는 방식에서도 사용된다.<br /> (ex : var dataArray = grid1.getRowDataArray(grid1.getRowFromChild(td)); alert(dataArray["id"]);)<br />
		</li>
		<li>
			HMTL document 로드 완료후 원하는 html를 Webponent Grid로 변환하기 위하여 아래와 같이 Javascript API 를 이용하여 호출한다.<br /> var grid = $.dataGrid('#tableID', {확장옵션});
		</li>
		<li>확장옵션은 {'option1':'value1', 'option2':'value2'} 형태와 같은 JSON 형태로 기술한다.</li>
	</ol>


	<div>
		<h3 id="ch3">확장 옵션</h3>
		<table border="1" style="width: 100%;">
			<colgroup>
				<col />
				<col />
				<col width="150" />
				<col width="150" />
				<col align="center" />
			</colgroup>

			<thead>
				<tr>
					<th>속성명</th>
					<th>이름</th>
					<th>설명</th>
					<th>기본값</th>
					<th>예제</th>
				</tr>
			</thead>

			<tbody>
				<tr>
					<td>width</td>
					<td>테이블의 width</td>
					<td>사용자 정의</td>
					<td>100%</td>
					<td rowspan="2">
						<a href="width_height.jsp" target="_exam">예제</a>
					</td>
				</tr>
				<tr>
					<td>height</td>
					<td>테이블의 height</td>
					<td>사용자 정의</td>
					<td>200</td>
				</tr>
				<tr>
					<td>gridInfo</td>
					<td>row수, 페이지등 그리드에 대한 하단 정보 표시 여부</td>
					<td>true | false</td>
					<td>false</td>
					<td>
						<a href="example/gridInfo.htm" target="_exam">예제</a>
					</td>
				</tr>
				<tr>
					<td>displayHeader</td>
					<td>header(thead) 표시 여부</td>
					<td>true | false</td>
					<td>true</td>
					<td>
						<a href="example/displayHeader.htm" target="_exam">예제</a>
					</td>
				</tr>
				<tr>
					<td>columnResizable</td>
					<td>컬럼 사이즈 조절 여부</td>
					<td>true | false</td>
					<td>true</td>
					<td>
						<a href="example/columnResizable.htm" target="_exam">예제</a>
					</td>
				</tr>
				<tr>
					<td>multiSelectable</td>
					<td>여러개의 row(tr)을 선택할수 있는지 여부(ctrl,shift)</td>
					<td>true | false</td>
					<td>true</td>
					<td>
						<a href="example/multiSelectable.htm" target="_exam">예제</a>
					</td>
				</tr>
				<tr>
					<td>onclick</td>
					<td>row 선택시 발생하는 이벤트설정</td>
					<td>function | undefined</td>
					<td>undefined</td>
					<td>
						<a href="example/onclick.htm" target="_exam">예제</a>
					</td>
				</tr>
				<tr>
					<td>hiddenColumn</td>
					<td>특정 컬럼 열을 숨기기</td>
					<td>array | undefined</td>
					<td>undefined</td>
					<td>
						<a href="example/hiddenColumn.htm" target="_exam">예제</a>
					</td>
				</tr>
				<tr>
					<td>fixColumn</td>
					<td>특정 컬럼 열을 고정하기</td>
					<td>array | undefined</td>
					<td>undefined</td>
					<td>
						<a href="example/fixColumn.htm" target="_exam">예제</a>
					</td>
				</tr>
				<tr>
					<td>sortColumn</td>
					<td>특정 컬럼 열을 소팅하기</td>
					<td>json | undefined</td>
					<td>undefined</td>
					<td>
						<a href="example/sortColumn.htm" target="_exam">예제</a>
					</td>
				</tr>
				<tr>
					<td>editColumn</td>
					<td>특정 컬럼 열을 수정하기</td>
					<td>json | undefined</td>
					<td>undefined</td>
					<td>
						<a href="example/editColumn.htm" target="_exam">예제</a>
					</td>
				</tr>
				<tr>
					<td>rotateColumn</td>
					<td>특정 컬럼 열을 회전하기</td>
					<td>json | undefined</td>
					<td>undefined</td>
					<td>
						<a href="example/rotateColumn.htm" target="_exam">예제</a>
					</td>
				</tr>
				
			</tbody>
		</table>
	</div>





	<div>
		<h3 id="ch4">grid 관련 function</h3>

		<table border="1" style="width: 100%;">
			<thead>
				<tr>
					<th>함수명</th>
					<th>파라미터</th>
					<th>설명</th>
					<th>예</th>
				</tr>
			</thead>

			<tbody>
				<tr>
					<td>updateBody</td>
					<td>
						(R)[Object]: formObj<br /> (O)[JSON]: settings
					</td>
					<td>
						AJAX 형태로 외부 데이터를 호출하여 grid 의 tabld tbody 에 삽입한다.<br /> updateBody메서드는 formObj를 이용하여 settings 의url,type,data를 추가 한다.<br /> settings 는 jQuery 의
						<a href="http://api.jquery.com/jQuery.ajax/" target="_new">AJAX settings[jQuery.ajax( settings )]</a>
						을 참조하면 된다.<br />
					</td>
					<td>
						type1 : grid.updateBody($('#formId')); <br /> type2 : grid.updateBody($('#formId'), {success:function(data){alert(data);} });
					</td>
				</tr>
				<tr>
					<td>appendDefaultRow</td>
					<td>(O)[JSON]: defaultJSON</td>
					<td>
						새로운 row를 제일 뒤에 추가 해준다. defaultJSON은 JSON으로 td의 기본 값을 정의한다.<br /> {0:'a','1':'b'}형태로 key는 z-base 시퀀스이며 이는 td의 cellIndex를 의미한다.<br /> 만약 defaultJSON이 없다면 테이블 초기 생성시에 tbody의 첫번째 tr을 그대로 복사한다.
					</td>
					<td>grid.appendDefaultRow({0:'abc',1:'efg'})</td>
				</tr>
				<tr>
					<td>appendRow</td>
					<td>(R)[Object|String]: rows</td>
					<td>
						jQuery Object 또는 html문자열로 들어오는 row를 추가한다.<br /> 단일 또는 복수가 가능하다.
					</td>
					<td>
						type2 : grid.appendRow($("tr.dd"));<br /> type1 : grid.appendRow($("&lt;tr&gt;&lt;td&gt;abc&lt;/td&gt;&lt;td&gt;efg&lt;/td&gt;&lt;/tr&gt;"))
					</td>
				</tr>
				<tr>
					<td>removeRow</td>
					<td>(R)[Object]: rows</td>
					<td>해당 로우를 삭제 한다.</td>
					<td>grid.removeRow($("tr.target"));</td>
				</tr>
				<tr>
					<td>removeAll</td>
					<td></td>
					<td>모든 로우를 삭제 한다.</td>
					<td>grid.removeAll();</td>
				</tr>
				<tr>
					<td>getRowFromChild</td>
					<td>(R)[Object|String]: childObject</td>
					<td>childObject를 자식으로 가지는 부모Row를 반환한다.</td>
					<td>grid.getRowFromChild($("td"));</td>
				</tr>
				<tr>
					<td>getRowDataArray</td>
					<td>(R)[Object|String]: row</td>
					<td>
						row 로부터 td의 값을 연관배열의 형태로 얻는다. 설정되는 값은 col 태그의 id<br /> (ex: &lt;col id="col_name" /&gt;으로 설정시 ['name']으로 값 참조 )
					</td>
					<td>
						var dataArray = grid.getRowDataArray($("tr.selectedTR"));<br /> alert(dataArray["name"]);
					</td>
				</tr>
				<tr>
					<td>getSelectedRow</td>
					<td></td>
					<td>
						현재 선택된 row를 반환, 여러행이라면 가장 마지막에 선택된 row를 반환한다.<br /> 선택된 row가 없다면 null을 반환한다.
					</td>
					<td>grid.getSelectedRow();</td>
				</tr>

			</tbody>

		</table>

	</div>
</div>