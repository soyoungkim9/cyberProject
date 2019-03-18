$(function(){
setTimeout(function() {
    var mno = $(location).attr('href').split("mno=")[1];
    $.get("listDetail.cmd", {mno: mno})
        .done(function(data){
            console.log(data.movie[0]);
            $("#detail_top > div:first-child > img").attr("src", "../../upload/" + data.movie[0].fileurl);
            $(".info_title").text(data.movie[0].name);
            $(".info_age").text(data.movie[0].age + "세이상관람가");
            $(".info_sdt").text(data.movie[0].sdt);
            $(".info_grade").rate({
                type: 0,
                length: 5,
                value: data.movie[0].result,
                half: true,
                decimal: false,
                readonly: true,
                hover: false,
                text: true,
                textList: ['1', '2', '3', '4', '5'],
                theme: '#33373a',
                size: '17px',
                gutter: '2px',
                selectClass: 'fxss_rate_select',
                incompleteClass: '',
                customClass: ''
            });
            $(".info_grade > .rate_wrapper > .rate_text").hide();
            $(".info_grade_text").text(data.movie[0].result);

            var genre = "";
            if(data.movie[0].genre == '1') {
                genre = "코미디";
            } else if(data.movie[0].genre == '2') {
                genre = "드라마";
            } else if(data.movie[0].genre == '3') {
                genre = "애니메이션";
            } else if(data.movie[0].genre == '4') {
                genre = "스릴러/범죄/공포";
            } else if(data.movie[0].genre == '5') {
                genre = "액션/모험/SF";
            }
            $(".info_genre").text(genre + " " + data.movie[0].nation);
            $(".info_director").text(data.movie[0].director);
            $(".info_actor").text(data.movie[0].actor);
            $("#detail_ex").append("<pre>" + data.movie[0].ex + "</pre>");
        });

    $("#rateBox").rate({
        // 0：svg  1：Font class  2：Unicode
        type: 0,
        // the number of stars
        length: 5,
        // initial value
        value: 3,
        // allows half star
        half: false,
        // supports decimal?
        decimal: false,
        // is readonly?
        readonly: false,
        // shows the current rating value on hover
        hover: false,
        // shows rating text
        text: true,
        // an array of rating text
        textList: ['1', '2', '3', '4', '5'],
        // color
        theme: '#33373a',
        // text/star size
        size: '17px',
        // space between stars
        gutter: '2px',
        // default CSS classes
        selectClass: 'fxss_rate_select',
        incompleteClass: '',
        customClass: ''
    });

    $(".rate_wrapper").append("<span>" + "점" + "</span>");

    var pageNo = 1;
    var commentsPage = function(pageNo){
        $.get("listComments.cmd", {mno : mno, pageNo : pageNo}).done(function(data) {
            console.log(data);
            var source = $("#list-template").html();
            var template = Handlebars.compile(source);
            var html = template(data);
            $("#comment_list").append(html);

            for (var i = 0; i < $(".starList").length; i++) {
                $(".starList:eq(" + i + ")").rate({
                    type: 0,
                    length: 5,
                    value: data.comments[i].grade,
                    half: false,
                    decimal: false,
                    readonly: true,
                    hover: false,
                    text: true,
                    textList: ['1', '2', '3', '4', '5'],
                    theme: '#33373a',
                    size: '14px',
                    gutter: '2px',
                    selectClass: 'fxss_rate_select',
                    incompleteClass: '',
                    customClass: ''
                });
            }

            $(".review_update").hide();
            $(".review_delete").hide();
            $(".left_update_box").hide();
            $(".review_update_write").hide();
            if($("#status").attr("data-id")) {
                for(var i = 0; i < $("#comment_list > ul > li").length; i++) {
                    if($("#comment_list > ul > li:eq(" + i + ")").attr("data-writer") == $("#status").attr("data-id")) {
                        $(".review_update:eq(" + i + ")").show();
                        $(".review_delete:eq(" + i + ")").show();
                    }
                }

                var index = 0;
                $(".review_update").on("click", function() {
                    for(var i = 0; i < $("#comment_list > ul > li").length; i++) {
                        if($("#comment_list > ul > li > .left_box:eq(" + i + ")").attr("data-cmo") == $(this).attr("data-cmo")
                            && $("#comment_list > ul > li > .left_update_box:eq(" + i + ")").attr("data-cmo") == $(this).attr("data-cmo")) {
                            var beforeContent = $(".left_box:eq(" + i + ") > .review_content").text();
                            $(".review_update_content:eq(" + i + ")").text(beforeContent);
                            $(".left_box:eq(" + i + ")").hide();
                            $(this).hide();
                            $(".left_update_box:eq(" + i + ")").show();
                            $(".review_update_write:eq(" + i + ")").show();
                            index = i;
                            for (var i = 0; i < $(".starList_update").length; i++) {
                                $(".starList_update:eq(" + i + ")").rate({
                                    type: 0,
                                    length: 5,
                                    value: $(".review_score:eq(" + i + ")").attr("data-score"),
                                    half: false,
                                    decimal: false,
                                    readonly: false,
                                    hover: false,
                                    text: true,
                                    textList: ['1', '2', '3', '4', '5'],
                                    theme: '#33373a',
                                    size: '14px',
                                    gutter: '2px',
                                    selectClass: 'fxss_rate_select',
                                    incompleteClass: '',
                                    customClass: ''
                                });
                            }
                            return;
                        }
                    }
                });
                $(".review_update_write").on("click", function() {
                    $.post("updateComments.cmd", {cmo : $(this).attr("data-cmo"),
                        grade : $(".starList_update:eq(" + index + ") > .rate_wrapper > .rate_text").text(),
                        content : $(".review_update_content:eq(" + index + ")").val()})
                        .done(function() {
                            location.reload();
                            // 똑같은  ajax 호출???!
                        });
                });

                $(".review_delete").on("click", function() {
                    if(confirm("삭제 하시겠습니까?")) {
                        $.post("deleteComments.cmd", {cmo : $(this).attr("data-cmo")})
                            .done(function(){
                                setTimeout(function() {
                                    location.reload();
                                }, 1100);
                            });
                    }
                });
            }

            var before = data.startPage-5;
            var after = data.startPage+5;
            if(before < 0) {
                $("#before").attr("data-pno", 1);
            } else {
                $("#before").attr("data-pno", before);
            }
            if(after > data.totalPages) {
                $("#after").attr("data-pno", data.totalPages);
            } else {
                $("#after").attr("data-pno", after);
            }
            $("#total").attr("data-pno", data.totalPages);
            for(var i = data.startPage; i <= data.endPage; i++) {
                if(i == pageNo) {
                    $("#number_box").append("<a class='number pageSelected' data-pno='" + i + "'>" + i + "</a>");
                } else {
                    $("#number_box").append("<a class='number' data-pno='" + i + "'>" + i + "</a>");
                }
            }

            $("#comments_page > a, #number_box > a").on("click", function(){
                pageNo = $(this).attr("data-pno");
                $.get("listComments.cmd", {mno : mno, pageNo: pageNo})
                    .done(function() {
                        $("#comment_list > ul").remove();
                        $("#comments_page").remove();
                        commentsPage(pageNo);
                    })
            });
        })};

    commentsPage(pageNo);

    if(!$("#status").attr("data-id")) {
        $("#txtComment").text("영화 리뷰는 로그인 후에 작성하실수 있습니다.");
        $("#txtComment").attr("disabled", "disabled");
        $("#txtComment").css("color", "#555");
        return;
    }

    // executeSQL("listReviewRight", connection, input, output); 얘를 어떻게 넣을까 생각해보기

    $.get("insertComments.cmd", {id : $("#status").attr("data-id"), mno : mno})
        .done(function(data) {
            console.log(data);
            if(data.charge[0].id == undefined) {
                $("#txtComment").text("평가는 구매한 사람만 남길 수 있습니다.");
                $("#txtComment").attr("disabled", "disabled");
                $("#txtComment").css("color", "#555");
                $("#comment_write_btn").on("click", function(){
                    alert("티켓 구매 후 이용해주세요.");
                });
            } else if(data.charge[0].cnt > 0) {
                $("#txtComment").text("이미 작성한 평점이 존재합니다.\n평가는 관람 내역당 1회만 작성 가능합니다.");
                $("#txtComment").attr("disabled", "disabled");
                $("#txtComment").css("color", "#555");
                $("#comment_write_btn").on("click", function () {
                    alert("이미 작성한 평점이 존재합니다.\n평가는 관람 내역당 1회만 작성 가능합니다.");
                });
            } else if(data.charge[0].cdate != "") {
                var date = new Date();
                var today = String(date.getFullYear()) +
                    String((parseInt(date.getMonth()+1) < 10 ? '0' : '') + parseInt(date.getMonth()+1)) +
                    String((date.getDate() < 10 ? '0' : '') + date.getDate());
                var time = String((date.getHours() < 10 ? '0' : '') + date.getHours()) +
                    String((date.getMinutes() < 10 ? '0' : '') + date.getMinutes());
                var current = parseInt(String(today) + String(time));
                for(var i = 0; i < data.charge.length; i++) {
                    if(data.charge[i].cdate == "") {
                        return;
                    } else {
                        var reviewRight = parseInt(data.charge[i].cdate.split(".")[0] +
                                                    data.charge[i].cdate.split(".")[1] +
                                                    data.charge[i].cdate.split(".")[2].split("(")[0] +
                                                    data.charge[i]["theaterinfo.time"].split(":")[0] +
                                                    data.charge[i]["theaterinfo.time"].split(":")[1]);

                        console.log(reviewRight > current);
                        if(reviewRight < current) {
                            $("#comment_write_btn").on("click", function(){
                                $.post("insertComments.cmd", {id : $("#status").attr("data-id"), mno : mno,
                                    grade : $("#rateBox > .rate_wrapper > .rate_text:eq(0)").text(), content : $("#txtComment").val()})
                                    .done(function() {
                                        location.reload();
                                    });
                            });
                            break;
                        }

                        $("#txtComment").text("평가는 상영시간 종료 후 가능합니다.");
                        $("#txtComment").attr("disabled", "disabled");
                        $("#txtComment").css("color", "#555");
                        $("#comment_write_btn").on("click", function () {
                            alert("평가는 상영시간 종료 후 가능합니다!");
                        });
                    }
                }
            }
        });
}, 1100);
});