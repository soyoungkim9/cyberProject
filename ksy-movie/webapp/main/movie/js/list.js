$(function() {
    // 연령대 이벤트(함수)
    var ageCss = function() {
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

    // 더보기 이벤트(함수)
    var viewList = function() {
        var index = 1;
        for(var i = 9; i <= $("#tab_content > ul > li").length; i++) {
            $("#tab_content > ul > li:nth-child(" + i + ")").hide();
        }
        $("#btn_view").on("click", function(){
            for(var i = (8*index)+1; i <= (8*index)+8; i++) {
                $("#tab_content > ul > li:nth-child(" + i + ")").show();
            }
            ++index;
        });
    }

    // 상세보기 함수
    var detailPage = function() {
        $(".detail_btn").on("click", function() {
            var mno = $(this).attr("data-mno");
            location.href = "listDetail.jsp?mno=" + mno;
        });
    }

    // 예매하기 함수
    var reservePage = function() {
        $(".reserve_Btn").on("click", function() {
            location.href = "reserve.jsp";
        });
    }

    // 예매순기준 함수
    var reservePersent = function(data) {
        var total = data.movieList[0].stotal;
        for(var i = 0; i < $(".reserveP").length; i++) {
            var beforeCnt = $(".reserveP:eq(" + i + ")").attr("data-cnt");
            $(".reserveP:eq(" + i + ")").attr("data-cnt", Number((parseInt(beforeCnt)/parseInt(total))*100).toFixed(2) + '%');
            $(".reserveP:eq(" + i + ")").text($(".reserveP:eq(" + i + ")").attr("data-cnt"));

            $.get("list.cmd", {mno: $(".detail_btn:eq(" + i + ")").attr("data-mno"), i: i})
                .done(function(data){
                    if(data.selectList[0] == undefined) {
                        $(".gradeP:eq(" + parseInt(data.i) + ")").text("0.0");
                    } else {
                        $(".gradeP:eq(" + parseInt(data.i) + ")").text(Number(data.selectList[0].gsum/data.selectList[0].gcnt).toFixed(1))
                    }
                });
        }
    }

    // 평점순기준 함수
    var gradePersent = function(data) {
        console.log(data);
        for(var i = 0; i < $(".gradeP").length; i++) {
            if(String(data.movieList[i].result).split(".").length < 2) {
                $(".gradeP:eq(" + i + ")").text(data.movieList[i].result + ".0");
            } else {
                $(".gradeP:eq(" + i + ")").text(data.movieList[i].result);
            }

            $.get("list.cmd", {mno: $(".detail_btn:eq(" + i + ")").attr("data-mno"), j: i})
                .done(function(data){
                    if(data.selectList[0].mCnt == undefined) {
                        $(".reserveP:eq(" + parseInt(data.j) + ")").text("0%")
                    } else {
                        $(".reserveP:eq(" + parseInt(data.j) + ")").text(
                            Number((parseInt(data.selectList[0].mCnt)/parseInt(data.selectList[0].stotal))*100).toFixed(2) + '%');
                    }
                });
        }
    }

    // tab List 공통항목
    var commonList = function(data) {
        console.log(data);
        $("#tab_content > ul").remove();
        var source = $("#list-template").html();
        var template = Handlebars.compile(source);
        Handlebars.registerHelper("inc", function(value, options)
        {
            return parseInt(value) + 1;
        });
        var html = template(data);
        $("#tab_content").append(html);

        $(".hoverStyle").hide();
        // 이미지에 마우스커버 올렸을 경우
        $("#tab_content > ul > li").hover(
            function() {
                $(this).find(".hoverStyle").show();
            }, function() {
                $(".hoverStyle").hide();
            });
        ageCss();
        viewList();
        detailPage();
        reservePage();
    }

    // 초기화면(현재상영작, 예매순)리스트 함수
    var initList = function() {
        $.get("list.cmd", {tab1: "tab1_current"})
            .done(function(data) {
                commonList(data);
                reservePersent(data);
            });
    }

    // 평점순 리스트 함수
    var gradeList = function() {
        $.get("list.cmd", {tab1: "tab1_current_grade"})
            .done(function(data) {
                commonList(data);
                gradePersent(data);
            });
    }

    initList();

    // tab1 이벤트(현재상영작/상영예정작)
    $("#tab1 > li > a").on("click", function() {
        if($("#tab1 > li > a").hasClass("tab1_style")) {
            $("#tab1 > li > a").removeClass("tab1_style");
        }
        $(this).addClass("tab1_style");
        var tab1 = $(this).attr("class").split(" ")[0];
        console.log(tab1);
        $.get("list.cmd", {tab1: tab1})
            .done(function(data) {
                commonList(data);
                $("#tab2").show();
                if(tab1 == "tab1_expected") {
                    $(".movie_text_bottom").hide();
                    $("#tab2").hide();
                    $(".reserve_Btn").hide();
                    $("#tab_content > ul > li").css("height", "378px");
                    $("#tab_content > ul > li").css("border-bottom", "none");
                }

                $("#tab2 > ul > li > a").removeClass("tab2_style");
                $("#reserveList").addClass("tab2_style");
                reservePersent(data);
            });
    });

    // 예매순/평점순 전환
    $("#tab2 > ul > li > a").on("click", function() {
        if($(this).attr("id") == "reserveList") {
            initList();
        } else {
            gradeList();
        }

        if($("#tab2 > ul > li > a").hasClass("tab2_style")) {
            $("#tab2 > ul > li > a").removeClass("tab2_style");
        }
        $(this).addClass("tab2_style");
    });
});