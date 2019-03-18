// 페이지에 색깔, 옵션값 유지, 텍스트 상자 값 유지
$(function() {
    $(".selectbox__option")[0].classList.remove("selectbox__option--selected");

    // 연령대 이벤트(함수)
    for(var i = 0; i < $(".ageStyle").length; i++) {
        if($(".ageStyle").eq(i).html() == "0") {
            $(".ageStyle").eq(i).css("background", "#088210");
            $(".ageStyle").eq(i).text("전");
        } else if($(".ageStyle").eq(i).html() == "12") {
            $(".ageStyle").eq(i).css("background", "#1567c3");
        } else if($(".ageStyle").eq(i).html() == "15") {
            $(".ageStyle").eq(i).css("background", "#e6266e");
        } else if($(".ageStyle").eq(i).html() == "19") {
            $(".ageStyle").eq(i).css("background", "#e70e1d");
        }
    }

    // 페이징 처리
    if($("#search_page").children().length != 0) {
        var before = parseInt($("#before").attr("href").split("pageNo=")[1]);
        var beforeSearch1 = $("#before").attr("href").split("pageNo="
        )[0];
        var after = parseInt($("#after").attr("href").split("pageNo=")[1]);
        var afterSearch1 = $("#after").attr("href").split("pageNo=")[0];
        var total = parseInt($("#total").attr("href").split("pageNo=")[1]);

        if(before < 0) {
            $("#before").attr("href", beforeSearch1 + "pageNo=1");
        }

        if(after > total) {
            $("#after").attr("href", afterSearch1 +"pageNo=" + total);
        }
    }

    // 페이징 이벤트
    if($(location).attr("href").split("?")[1] != undefined && $(location).attr("href").split("pageNo=")[1] != undefined) {
        $(".number").removeClass('selected');
        var index = parseInt($(location).attr("href").split("pageNo=")[1]) - 1;
        $(".number:eq(" + index + ")").addClass('selected');
    } else {
        $(".number:eq(0)").addClass('selected');
    }

    $(".hoverStyle").hide();
    // 이미지에 마우스커버 올렸을 경우
    $("#search_content > ul > li").hover(
        function() {
            $(this).find(".hoverStyle").show();
        }, function() {
            $(".hoverStyle").hide();
        });


    /* 검색 흔적이 있는 경우 */
    if($(location).attr("href").split("?")[1] != undefined && $(location).attr("href").split("&")[1] != undefined) {
        $("input[type='checkbox']").prop('checked', false);

        // 영화검색목록 유지
        for(var i = 1; i <= $("#searchListBox").children().length; i++) {
            if($(".selectbox__option:nth-child(" + i + ")")[0].getAttribute("data-value") == $(location).attr("href").split("searchList=")[1].split("&")[0]) {
                $(".selectbox__label")[0].innerHTML = $(".selectbox__option:nth-child(" + i + ")")[0].innerHTML;
            }
        }
        // 영화검색 입력 유지
        if($(location).attr("href").split("search=")[1].split("&")[0] != "") {
            $("#searchInput").val(decodeURI($(location).attr("href")).split("search=")[1].split("&")[0]);
        }
        // 체크박스값 유지
        if($(location).attr("href").split("genre=")[1] != undefined) {
            if($("#all_genre").attr("class") == "checkOn"){
                $("#all_genre").removeClass("checkOn");
            }
            for(var i = 1; i < $(location).attr("href").split("genre=").length; i++) {
                $("[value='" + $(location).attr("href").split("genre=")[i].split("&")[0] + "']").prop('checked', true);
            }
        }

        if($(location).attr("href").split("nation=")[1] != undefined) {
            if($("#all_nation").attr("class") == "checkOn"){
                $("#all_nation").removeClass("checkOn");
            }
            for(var i = 1; i < $(location).attr("href").split("nation=").length; i++) {
                $("[value='" + decodeURI($(location).attr("href")).split("nation=")[i].split("&")[0] + "']").prop('checked', true);
            }
        }

        if($(location).attr("href").split("age=")[1] != undefined) {
            if($("#all_age").attr("class") == "checkOn"){
                $("#all_age").removeClass("checkOn");
            }
            for(var i = 1; i < $(location).attr("href").split("age=").length; i++) {
                $("[value='" + $(location).attr("href").split("age=")[i].split("&")[0] + "']").prop('checked', true);
            }
        }
        // 제작년도 유지
        var mySlider = new rSlider({
            target: '#slider',
            values: {min: 1990, max: 2020},
            range: true,
            set:    [parseInt($(location).attr("href").split("sdt=")[1].split("&")[0]), parseInt($(location).attr("href").split("edt=")[1])],
            width:    null,
            scale:    true,
            labels:   false,
            tooltip:  true,
            step:     1,
            disabled: false,
            onChange: null
        });

        // 전체 체크박스값 여부 유지
        if($(location).attr("href").split("genre=").length >= 6) {
            $("#all_genre").addClass("checkOn");
            $("#all_genre").prop('checked', true);
        }
        if($(location).attr("href").split("nation=").length >= 7) {
            $("#all_nation").addClass("checkOn");
            $("#all_nation").prop('checked', true);
        }
        if($(location).attr("href").split("age=").length >= 5) {
            $("#all_age").addClass("checkOn");
            $("#all_age").prop('checked', true);
        }

        // 검색결과 보여주기
        if($(location).attr("href").split("search=")[1].split("&")[0] != "") {
            $("#kewordVal").text(decodeURI($(location).attr("href")).split("search=")[1].split("&")[0]);
        } else {
            $("#kewordVal").text("전체");
        }

        if($(location).attr("href").split("genre=").length > 1 && $(location).attr("href").split("genre=").length != 6) {
            for(var i = 1; i < $(location).attr("href").split("genre=").length; i++) {
                var genre = "";
                if($(location).attr("href").split("genre=")[i].split("&")[0] == 1) {
                    genre = "코미디";
                } else if($(location).attr("href").split("genre=")[i].split("&")[0] == 2) {
                    genre = "드라마";
                } else if($(location).attr("href").split("genre=")[i].split("&")[0] == 3) {
                    genre = "애니메이션";
                } else if($(location).attr("href").split("genre=")[i].split("&")[0] == 4) {
                    genre = "스릴러/범죄/공포";
                } else if($(location).attr("href").split("genre=")[i].split("&")[0] == 5) {
                    genre = "액션/모험/SF";
                }
                if(i == $(location).attr("href").split("genre=").length-1) {
                    $("#ganreVal").append(genre)
                } else {
                    $("#ganreVal").append(genre + ", ");
                }
            }
        } else {
            $("#ganreVal").text("전체");
        }

        if($(location).attr("href").split("nation=").length > 1 && $(location).attr("href").split("nation=").length != 7) {
            for(var i = 1; i < $(location).attr("href").split("nation=").length; i++) {
                if(i == $(location).attr("href").split("nation=").length-1) {
                    if($(location).attr("href").split("nation=")[i].split("&")[0] == "aside") {
                        $("#nationVal").append("기타");
                    } else {
                        $("#nationVal").append(decodeURI($(location).attr("href")).split("nation=")[i].split("&")[0])
                    }
                } else if($(location).attr("href").split("nation=")[i].split("&")[0] == "aside") {
                    $("#nationVal").append("기타, ");
                } else {
                    $("#nationVal").append(decodeURI($(location).attr("href")).split("nation=")[i].split("&")[0] + ", ");
                }
            }
        } else {
            $("#nationVal").text("전체");
        }

        if($(location).attr("href").split("age=").length > 1 && $(location).attr("href").split("age=").length != 5) {
            for(var i = 1; i < $(location).attr("href").split("age=").length; i++) {
                if(i == $(location).attr("href").split("age=").length-1) {
                    if($(location).attr("href").split("age=")[i].split("&")[0] == 0) {
                        $("#ageVal").append("전체 관람가");
                    } else {
                        $("#ageVal").append($(location).attr("href").split("age=")[i].split("&")[0] + "세 관람가");
                    }
                } else if($(location).attr("href").split("age=")[i].split("&")[0] == 0) {
                    $("#ageVal").append("전체 관람가, ");
                } else {
                    $("#ageVal").append($(location).attr("href").split("age=")[i].split("&")[0] + "세 관람가, ");
                }
            }
        } else {
            $("#ageVal").text("전체");
        }

        $("#sdtVal").text($(location).attr("href").split("sdt=")[1].split("&")[0] + "년 ~ "
            + $(location).attr("href").split("edt=")[1] + "년");

        // 검색용 페이징 처리
        $("#search_page > a:first-child").attr("href",
            $("#search_page > a:first-child").attr("href") + "&searchList" + $(location).attr("href").split("searchList")[1]);
        $("#before").attr("href", $("#before").attr("href") + "&searchList" + $(location).attr("href").split("searchList")[1]);
        for(var i = 0; i < $(".number").length; i++) {
            $(".number")[i].setAttribute("href", $(".number")[i].getAttribute("href") + "&searchList" + $(location).attr("href").split("searchList")[1])
        }
        $("#after").attr("href", $("#after").attr("href") + "&searchList" + $(location).attr("href").split("searchList")[1]);
        $("#total").attr("href", $("#total").attr("href") + "&searchList" + $(location).attr("href").split("searchList")[1]);



    } else { /* 검색 흔적이 없는 경우 */
        // 날짜조정 슬라이더 바 library
        var mySlider = new rSlider({
            target: '#slider',
            values: {min: 1990, max: 2020},
            range: true,
            set:    [2000, 2020],
            width:    null,
            scale:    true,
            labels:   false,
            tooltip:  true,
            step:     1,
            disabled: false,
            onChange: null
        });
        $("#leftSdt").attr("value", 2000);
        $("#rightSdt").attr("value", 2020);

        // 검색결과 보여주기
        $("#kewordVal").text("전체");
        $("#ganreVal").text("전체");
        $("#nationVal").text("전체");
        $("#ageVal").text("전체 관람가");
        $("#sdtVal").text("2000년 ~ 2020년");
    }


});

// 검색 이벤트
$("#searchStartBtn").on("click", function(){
    // 날자값 name 설정
    $("#leftSdt").attr("value", $("[data-dir='left'] > .rs-tooltip").html());
    $("#rightSdt").attr("value", $("[data-dir='right'] > .rs-tooltip").html());

    document.movieSearchForm.submit();
});

// 체크항목하나라도 없을시 전체 표시 제거
$("input[name='genre']").on("click", function(){
    for(var i = 0; i < $("[name='genre']").length; i++) {
        if($("[name='genre']:eq(" + i + ")").prop('checked') == false) {
            $("#all_genre").removeClass("checkOn");
            $("#all_genre").prop('checked', false);
            return;
        }
    }
    $("#all_genre").addClass("checkOn");
    $("#all_genre").prop('checked', true);
});

$("input[name='nation']").on("click", function(){
    for(var i = 0; i < $("[name='nation']").length; i++) {
        if($("[name='nation']:eq(" + i + ")").prop('checked') == false) {
            $("#all_nation").removeClass("checkOn");
            $("#all_nation").prop('checked', false);
            return;
        }
    }
    $("#all_nation").addClass("checkOn");
    $("#all_nation").prop('checked', true);
});

$("input[name='age']").on("click", function(){
    for(var i = 0; i < $("[name='age']").length; i++) {
        if($("[name='age']:eq(" + i + ")").prop('checked') == false) {
            $("#all_age").removeClass("checkOn");
            $("#all_age").prop('checked', false);
            return;
        }
    }
    $("#all_age").addClass("checkOn");
    $("#all_age").prop('checked', true);
});

// 전체 체크박스 클릭 시 각 항목의 모든 선택지가 체크된다.
$("#all_genre").on("click", function() {
    $("#all_genre").toggleClass("checkOn");
    if($("#all_genre").attr("class") == "checkOn") {
        $("[name='genre']").prop('checked', true);
        $("#all_genre").prop('checked', true);
    } else {
        $("[name='genre']").prop('checked', false);
        $("#all_genre").prop('checked', false);

    }
});

$("#all_nation").on("click", function() {
    $("#all_nation").toggleClass("checkOn");
    if($("#all_nation").attr("class") == "checkOn") {
        $("[name='nation']").prop('checked', true);
    } else {
        $("[name='nation']").prop('checked', false);

    }
});

$("#all_age").on("click", function() {
    $("#all_age").toggleClass("checkOn");
    if($("#all_age").attr("class") == "checkOn") {
        $("[name='age']").prop('checked', true);
    } else {
        $("[name='age']").prop('checked', false);

    }
});

// 초기화
$("#searchInit").on("click", function() {
    location.href = $(location).attr("href").split("?")[0];
});

// 상세보기
$(".detail_btn").on("click", function() {
    var mno = $(this).attr("data-mno");
    location.href = "listDetail.jsp?mno=" + mno;
});

// 예약하기
$(".reserve_btn").on("click", function() {
    location.href = "reserve.jsp";
});