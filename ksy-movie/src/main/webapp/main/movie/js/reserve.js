$(function(){
    $("#demo").rangeCalendar();

    $("#time_list01").hide();
    $("#time_list02").hide();

    // 연령대 스타일
    var ageStyle = function() {
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
    }

    // 영화관, 영화
    var anoselected = new Array();
    var areaEvent = function() {
        // 영화관을 선택했을 경우
        $("#area_Zone_Content > ul > li > a").on("click", function() {
            var time_ano = $(this).attr("data-ano");

            // 영화관선택 제한
            if($(".area_selected").length >= 2) {
                if($(this).hasClass("area_selected") && $(".area_selected").length == 2) {
                    $(this).toggleClass("area_selected");
                } else {
                    alert("최대 2개까지 선택하실 수 있습니다.");
                    return;
                }
            } else {
                $(this).toggleClass("area_selected");
            }
            if($(".area_selected").length == 0) {
                $("#selectMv_Zone").text("영화관을 선택하세요. (최대 2개)");
                $("#time_Zone > div").hide();
                $("#time_noData").show();
            } else {
                if($(".area_selected").length == 1)
                    $("#selectMv_Zone").text("");
                if($(".area_selected").length == 2)
                    $("#selectMv_Zone")[0].innerText += ", ";
                $("#selectMv_Zone")[0].innerText += $(".area_selected")[$(".area_selected").length-1].innerText;
            }

            var len = $(".area_selected").length;
            var changePoint = 0;
            if(len == 0) {
                anoselected.pop();
            } else if(len == 1) {
                if(anoselected.length > 0) {
                    for(var i = 0; i < anoselected.length; i++) {
                        if(anoselected[i] == $(this).attr("data-ano")) {
                            anoselected.splice(i, 1);
                        }
                    }
                } else {
                    anoselected.push($(this).attr("data-ano"));
                }
            } else if(len == 2) {
                changePoint = $(this).attr("data-ano");
                anoselected.push($(this).attr("data-ano"));
            }
            $.get("reserve.cmd", {len: len, ano: anoselected})
                .done(function(data) {
                    // 상영시간 리스트 (영화관까지 선택했을 경우) - 해당 상영관의 모든 영화를 보여준다
                    $("#time_noData").hide();
                    $("#time_list01").hide();
                    $("#time_list02").hide();
                    console.log(data);
                    if($(".area_selected").length == 1) {
                        $("#time_list01 > .time_title").text(data.reserveList[0]["area.name"]);
                        $(".time_line").remove();
                        $("#time_list02 > .time_title").text("");
                        for(var i = 0; i < data.reserveList.length; i++) {
                            $("#time_list01").append(
                                "<dl class='time_line' data-mno='" + data.reserveList[i]["areamovie.mno"] + "'" +
                                "data-ano='" + data.reserveList[i]["areamovie.ano"] + "'>" +
                                "<dt><span class='ageStyle'>" + data.reserveList[i]["movie.age"] + "</span>" +
                                "<span>" + data.reserveList[i]["movie.name"] + "</span></dt>" +
                                "<dd><ul></ul></dd>" +
                                "</dl>"
                            );
                        }

                        $("#time_Zone > div").hide();
                        $("#time_list01").show();

                        ageStyle();
                    } else if($(".area_selected").length == 2) {
                        $("#time_list02 > .time_line").remove();
                        $("#time_list02 > .time_title").text(data.reserveList[data.reserveList.length-1]["area.name"]);

                        var startIndex = 0;
                        var endIndex = 0;
                        if(time_ano == $(".area_selected:eq(0)").attr("data-ano")) {
                            $("#time_list02 > .time_title").text($(".area_selected:eq(0)").text());
                            for(var i = 0; i < data.reserveList.length; i++) {
                                if(time_ano != data.reserveList[i]["areamovie.ano"]) {
                                    endIndex = i;
                                    break;
                                }
                            }
                            for(var i = endIndex-1; i >= 0; i--) {
                                $("#time_list02").append(
                                    "<dl class='time_line' data-mno='" + data.reserveList[i]["areamovie.mno"] + "'" +
                                    "data-ano='" + data.reserveList[i]["areamovie.ano"] + "'>" +
                                    "<dt><span class='ageStyle'>" + data.reserveList[i]["movie.age"] + "</span>" +
                                    "<span>" + data.reserveList[i]["movie.name"] + "</span></dt>" +
                                    "<dd><ul></ul></dd>" +
                                    "</dl>"
                                );
                            }
                        } else if(time_ano == $(".area_selected:eq(1)").attr("data-ano")){
                            for(var i = 0; i < data.reserveList.length; i++) {
                                if(time_ano == data.reserveList[i]["areamovie.ano"]) {
                                    startIndex = i;
                                    break;
                                }
                            }
                            for(var i = startIndex; i < data.reserveList.length; i++) {
                                $("#time_list02").append(
                                    "<dl class='time_line' data-mno='" + data.reserveList[i]["areamovie.mno"] + "'" +
                                    "data-ano='" + data.reserveList[i]["areamovie.ano"] + "'>" +
                                    "<dt><span class='ageStyle'>" + data.reserveList[i]["movie.age"] + "</span>" +
                                    "<span>" + data.reserveList[i]["movie.name"] + "</span></dt>" +
                                    "<dd><ul></ul></dd>" +
                                    "</dl>"
                                );
                            }
                        }

                        $("#time_Zone > div").hide();
                        $("#time_list01").show();
                        $("#time_list02").show();

                        ageStyle();
                    } else if($(".area_selected").length == 0) {
                        $(".time_line").remove();
                        $("#time_list01 > .time_title").text("");
                        $("#time_noData").show();
                    }

                    // 영화관 선택지에 따라 영화목록 활성화/비활성화
                    if(len == 0) {
                        $("#movieList > ul > li").removeClass("movieDisplay");
                        return;
                    }
                    for(var i = 0; i < data.movieList.length; i++) {
                        for(var j = 0; j < data.reserveList.length; j++) {
                            if(data.movieList[i]["name"] == data.reserveList[j]["movie.name"]){
                                $("#movieList > ul > li")[i].classList.remove("movieDisplay");
                                break;
                            }
                            if(j == data.reserveList.length-1) {
                                for(var k = 0; k < $("#movieList > ul > li").length; k++) {
                                    if($("#movieList > ul > li:eq(" + k + ")").data("mno") == data.movieList[i]["mno"]
                                            && $(".area_selected").length > 0) {
                                        $("#movieList > ul > li")[k].classList.add("movieDisplay");
                                    }
                                }
                            }
                        }
                    }

                    /* 상영시간 리스트 */
                    if($(".time_line").length != 0) {
                        var infomno = new Array();
                        var infoano = new Array();
                        for(var i = 0; i < $(".time_line").length; i++) {
                            infomno.push($(".time_line")[i].getAttribute("data-mno"));
                            infoano.push($(".time_line")[i].getAttribute("data-ano"));
                        }
                        $.get("reserve.cmd", {infomno: infomno, infoano: infoano})
                            .done(function(data) {
                                console.log(data);
                                if($(".area_selected").length == 2) {
                                    // 이거추가됨 뭔가 2개일 대 이전데이터를 지우고싶음... 밑에꺼 확인
                                    $(".time_line > dd > ul > a").remove();
                                }
                                for(key in data) {
                                    if(key.match(/theater/)) {
                                        var keyindex = key.split('r')[1];
                                            for(j = 0; j < data[key].length; j++) {
                                                $(".time_line:eq(" + keyindex + ") > dd > ul").append(
                                                    "<a class='time_box' data-tino='" + data[key][j]["tino"] +"'>" +
                                                        "<li><span class='theater_name'>" + data[key][j].name + "</span>" +
                                                        "<span class='theater_time'>" + data[key][j]["theaterinfo.time"] + "</span>" +
                                                        "<span class='theater_seat'>" + "<span class='seatLimit'>" + " / " +
                                                            data[key][j]["theaterinfo.seatlimit"] + "</span></span>" +
                                                    "</li></a>"
                                                );
                                            }
                                    }
                                }

                                /* 현재 예매한 좌석 수 */
                                for(var i = 0 ; i < $(".time_box").length; i++) {
                                    $.get("reserve.cmd", {tino: $(".time_box:eq(" + i + ")").attr("data-tino"), i: i})
                                        .done(function(data) {
                                            if(!$(".theater_seat:eq(" + data.i + ") > span:first-child").hasClass("seatLimit")) {
                                                $(".theater_seat:eq(" + data.i + ") > span:first-child").remove();
                                            }

                                            $(".theater_seat:eq(" + data.i + ")").prepend("<span>" + data.seatcnt[0].seatcnt + "</span>");
                                        });
                                }

                                /* 사영시간 지난 값 처리 */
                                var today = new Date();
                                for(var i = 0; i < $(".theater_time").length; i++) {
                                    if(parseInt(String((today.getHours() < 10 ? '0' : '') + today.getHours()) +
                                        String((today.getMinutes() < 10 ? '0' : '') + today.getMinutes())) >=
                                        parseInt($(".theater_time:eq(" + i + ")").text().split(":")[0]+$(".theater_time:eq(" + i + ")").text().split(":")[1])) {
                                        $(".time_line > dd > ul > a > li:eq(" + i + ")").addClass("theater_time_delete");
                                        $(".time_line > dd > ul > a > li:eq(" + i + ")").on("click", function(e){
                                            e.preventDefault();
                                            e.stopPropagation();
                                        });
                                    }
                                }

                                /* 티켓 예매를 위한 로그인 확인여부 */
                                if($(".time_box").length != 0) {
                                    $(".time_box").on("click", function() {
                                        if(!loginOn) {
                                            alert("로그인 후 이용할 수 있습니다!");
                                        } else {
                                            var tino = $(this).attr("data-tino");
                                            var date = $("#selectMv_Time").text();
                                            $.get("listSeat.cmd", {tino : tino})
                                                .done(function(data) {
                                                    //history.pushState(tino, "CINEMA - 예매", reserve.jsp); 한글
                                                    location.href = "seat.jsp?tino=" + tino + "&date=" + encodeURI(date, "UTF-8");
                                                });
                                        }
                                    });
                                };
                            });
                    }

                    // 상영시간 리스트 (영화까지 선택했을 경우) - 해당 상영관의 해당 영화목록을 보여준다.
                    // 해당영화를 상영하고 있는 영화관을 보여준다.
                    $("#movieList > ul > li > a").on("click", function() {
                        if($(this).hasClass("movie_selected")) {
                            $(".time_line").hide();
                            if($(".movie_selected").length == 2) {
                                for(var i = 0; i < $(".time_line").length; i++) {
                                    if ($(".movie_selected:eq(0) > .movie_name").text() == $(".time_line > dt > span:nth-child(2)")[i].innerText) {
                                        $(".time_line:eq(" + i + ")").show();
                                    }
                                }
                            }
                            for(var i = 0; i < $(".time_line").length; i++) {
                                if($(this).children()[1].innerText == $(".time_line > dt > span:nth-child(2)")[i].innerText) {
                                    $(".time_line:eq(" + i + ")").show();
                                }
                            }
                        } else {
                            $(".time_line").show();
                            if($(".movie_selected").length == 1) {
                                for(var i = 0; i < $(".time_line").length; i++) {
                                    if ($(".movie_selected:eq(0) > .movie_name").text() != $(".time_line > dt > span:nth-child(2)")[i].innerText) {
                                        $(".time_line:eq(" + i + ")").hide();
                                    }
                                }
                            }
                        }
                    });
                });
        });
    }

    // 영화선택
    var movieEvent = function() {
        $("#movieList > ul > li > a").on("click", function() {
            if($(".movie_selected").length >= 2) {
                if($(this).hasClass("movie_selected") && $(".movie_selected").length == 2) {
                    $(this).toggleClass("movie_selected");
                } else {
                    alert("최대 2개까지 선택하실 수 있습니다.");
                    return;
                }
            } else {
                $(this).toggleClass("movie_selected");
            }
            if($(".movie_selected").length == 0) {
                $("#selectMv").text("영화를 선택하세요. (최대 2개)");
            } else {
                if($(".movie_selected").length == 1)
                    $("#selectMv").text("");
                if($(".movie_selected").length == 2)
                    $("#selectMv")[0].innerText += ", ";
                $("#selectMv")[0].innerText += $(".movie_selected > .movie_name")[$(".movie_selected > .movie_name").length-1].innerText;
            }
        });
    }

    // 예매순/평점순 전환
    var tabSwitch = function() {
        $("#tab > ul > li > a").on("click", function() {
            if($(this).attr("id") == "reserveList") {
                $.get("list.cmd")
                    .done(function(data){
                        console.log(data);
                        $("#movieList > ul").remove();
                        var source2 = $("#movie-template").html();
                        var template2 = Handlebars.compile(source2);
                        var html2 = template2(data);
                        $("#movieList").append(html2);
                        ageStyle();
                        movieEvent();
                    });
            } else {
                $.get("list.cmd", {tab1: "tab1_current_grade"})
                    .done(function(data){
                        console.log(data);
                        $("#movieList > ul").remove();
                        var source2 = $("#movie-template").html();
                        var template2 = Handlebars.compile(source2);
                        var html2 = template2(data);
                        $("#movieList").append(html2);
                        ageStyle();
                        movieEvent();
                    });
            }

            if($("#tab > ul > li > a").hasClass("tabStyle")) {
                $("#tab > ul > li > a").removeClass("tabStyle");
            }
            $(this).addClass("tabStyle");
        });
    }

    $.get("reserve.cmd")
        .done(function(data) {
            // 초기 데이터 설정(영화관)
            var cno = 4;
            var area = "";
            var source1 = $("#city-template").html();
            var template1 = Handlebars.compile(source1);
            var html1 = template1(data);
            $("#area_Zone").append(html1);

            $.get("reserve.cmd", {cno: cno})
                .done(function(data) {
                    var source = $("#area-template").html();
                    var template = Handlebars.compile(source);
                    var html = template(data);
                    $("#area_Zone_Content").append(html);
                    areaEvent();
                });

            // 초기 css
            $("#area_Zone > ul > li:first-child > a").addClass("city_selected");

            // 시 선택 이벤트
            $("#area_Zone > ul > li > a").on("click", function () {
                if($("#area_Zone > ul > li > a").hasClass("city_selected")) {
                    $("#area_Zone > ul > li > a").removeClass("city_selected");
                }
                $(this).addClass("city_selected");

                cno = parseInt($(this).attr("data-cno"));
                // 지역 가져오기
                $("#area_Zone_Content > ul").remove();
                $.get("reserve.cmd", {cno: cno})
                    .done(function(data) {
                        var source = $("#area-template").html();
                        var template = Handlebars.compile(source);
                        var html = template(data);
                        $("#area_Zone_Content").append(html);

                        areaEvent();
                    });
            });

            // 초기 데이터 설정(영화)
            var source2 = $("#movie-template").html();
            var template2 = Handlebars.compile(source2);
            var html2 = template2(data);
            $("#movieList").append(html2);
            ageStyle();
            movieEvent();
            tabSwitch();
       });
});

$(function(){
    $("#demo").rangeCalendar({
        lang: "en",
        theme: "default-theme",
        themeContext: this,
        startDate: moment().add('days', -1),
        endDate: moment().add('months', 12),
        start : "+1",
        startRangeWidth : 1,
        minRangeWidth: 1,
        maxRangeWidth: 1,
        weekends: true,
        autoHideMonths: false,
        visible: true,
        trigger: null,
        changeRangeCallback : function( el, cont, dateProp ) {
            var selectedDay = parseInt($(".selected > .cell-content > .day-number").text()) > 10 ?
                "" : "0" + $(".selected > .cell-content > .day-number").text();
            // 상영일 선택
            $("#selectMv_Time").text(
                $(".selected > .date-formatted").text().split(" ")[0]
                + $(".selected > .date-formatted").text().split(" ")[1] + '.'
                + selectedDay
                + '(' + $(".selected > .cell-content > .day").text() + ')'
            );
            $(".cal-cell").on("click", function(){
                $("#selectMv_Time").text(
                    $(".selected > .date-formatted").text().split(" ")[0]
                    + $(".selected > .date-formatted").text().split(" ")[1] + '.'
                    + selectedDay
                    + '(' + $(".selected > .cell-content > .day").text() + ')'
                );
            });

            return false;
        }
    });
});



