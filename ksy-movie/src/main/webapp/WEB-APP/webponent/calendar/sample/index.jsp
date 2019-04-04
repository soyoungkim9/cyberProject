<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=Edge"/>
<title>Insert title here</title>
</head>
<body>
    <table border="1" style="width:100%;border-collapse: collapse;">
        <caption>calendar 초기화 옵션</caption>
        <colgroup>
            <col width="220px;">
            <col width="200px;">
            <col width="100px;">
        </colgroup>
        <thead>
            <tr>
                <th>name</th>
                <th>param</th>
                <th>defaulVal</th>
                <th>description</th>
                <th>exam</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>type</td>
                <td>@string<br />day:일 달력<br />month:월 달력</td>
                <td>day</td>
                <td>
                    일달력,월달력 구분
                </td>
                <td><a href="sample.jsp">예제</a></td>
            </tr>
            <tr>
                <td>delim</td>
                <td>@string<br />/-</td>
                <td>/</td>
                <td>
                    년 월 일 사이의 구분자
                </td>
                <td><a href="sample.jsp">예제</a></td>
            </tr>
            <tr>
                <td>holiday</td>
                <td>@boolean</td>
                <td>true</td>
                <td>
                    공휴일 선택가능 여부
                </td>
                <td><a href="sample.jsp">예제</a></td>
            </tr>
            <tr>
                <td>weekend</td>
                <td>@boolean</td>
                <td>true</td>
                <td>
                    주말 선택가능 여부
                </td>
                <td><a href="sample.jsp">예제</a></td>
            </tr>
            <tr>
                <td>startRange</td>
                <td>@string<br />20130911:해당날짜이후<br />today:오늘이후부터</td>
                <td></td>
                <td>
                    선택가능 시작일을 설정한다. 날짜는 delim없이 설정하거나 today가 가능하다. 기본값은 ""으로 공백일경우 아무때나 선택가능하다.
                </td>
                <td><a href="sample.jsp">예제</a></td>
            </tr>
            <tr>
                <td>endRange</td>
                <td>@string<br />20130911:해당날짜이전<br />today:오늘이전부터</td>
                <td></td>
                <td>
                    선택가능 종료일을 설정한다. 날짜는 delim없이 설정하거나 today가 가능하다. 기본값은 ""으로 공백일경우 아무때나 선택가능하다.
                </td>
                <td><a href="sample.jsp">예제</a></td>
            </tr>
            <tr>
                <td>label</td>
                <td>@string</td>
                <td></td>
                <td>
                    접근성 대비 인풋박스의 title을 설정한다. label값이 ""이고 input 요소의 title값이 설정되어 있는경우 input의 title값을 가져간다.
                </td>
                <td><a href="sample.jsp">예제</a></td>
            </tr>
            <tr>
                <td>lang</td>
                <td>@string<br />kor:한국어<br />eng:영어</td>
                <td>kor</td>
                <td>
                    접근성 대비 언어 설정을 한다.
                </td>
                <td><a href="sample.jsp">예제</a></td>
            </tr>
            <tr>
                <td>hasdefaultToday</td>
                <td>@boolean</td>
                <td>kor</td>
                <td>
                    true로 설정된 경우 달력초기화시 오늘 날짜를 자동 셋팅한다.
                </td>
                <td><a href="sample.jsp">예제</a></td>
            </tr>
            <tr>
                <td>defaultDay</td>
                <td>@array<br />[년,월,일]</td>
                <td>[0,0,0]</td>
                <td>
                    hasdefaultToday가 true 인경우 세팅되는 날짜의 offset을 설정한다. [-1,0,20]인경우 1년전 오늘의 20일 이후로 세팅된다.
                </td>
                <td><a href="sample.jsp">예제</a></td>
            </tr>
            <tr>
                <td>reInit</td>
                <td>@boolean</td>
                <td>false</td>
                <td>
                    이미 초기화 되어 있는 달력이 $.calendar를 통해 다시 호출될때 초기화 할지 말지 여부
                </td>
                <td><a href="sample.jsp">예제</a></td>
            </tr>
            <tr>
                <td>zIndex</td>
                <td>@number<br /></td>
                <td>5</td>
                <td>
                    달력 레이어의 z-index값을 설정한다.
                </td>
                <td><a href="sample.jsp">예제</a></td>
            </tr>
            <tr>
                <td>indiTop<br />indiLeft<br />mobileIndiTop<br />mobileIndiLeft</td>
                <td>@number<br /></td>
                <td></td>
                <td>
                    달력 레이어의 삼각형 Indicator의 위치를 설정한다. pc버전과 mobile버전이 따로 존재한다.
                </td>
                <td><a href="sample.jsp">예제</a></td>
            </tr>
            <tr>
                <td>left<br />top<br />mobileLeft<br />mobileTop</td>
                <td>@number<br /></td>
                <td></td>
                <td>
                    달력 레이어의 위치를 설정한다. pc버전과 mobile버전이 따로 존재한다.
                </td>
                <td><a href="sample.jsp">예제</a></td>
            </tr>
            <tr>
                <td>startCalendar<br />endCalendar</td>
                <td>@element<br /></td>
                <td>undefined</td>
                <td>
                    시작일과 종료일이 함께 존재 하는경우 서로 연결을 시켜주면 시작일은 종료일보다 이후일이 선택이 안되고 종료일은 시작일보다 이전일이 선택이 안된다. 
                </td>
                <td><a href="sample.jsp">예제</a></td>
            </tr>
        </tbody>
    </table>
</body>
</html>