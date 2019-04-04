// $(window).on('popstate', function(e) {
// //     console.log(e.originalEvent.state);
// // })

$(function(){
    $("#payment_Box").hide();
    var tino = $(location).attr("href").split('tino=')[1].split('&')[0];
    var date = $(location).attr("href").split('date=')[1];
    var person = 0;
    
    // 랜덤문자 5자리 생성 함수
    var randomKey = function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    
    $.get("listSeat.cmd", {tino : tino}).
        done(function(data) {
            console.log(data.theaterInfo[0]);
            if(data.seat != undefined) {
                console.log(data.seat); // undefined case도 구분하기!
            }

            /* 좌석 배치 정보1 - 상영관 배치 */
            var rows = 19;
            var cols = parseInt(data.theaterInfo[0]["theaterinfo.seatlimit"]) / rows;
            var char = 65;
            var seat_no = 1;
            for(var i = 0; i < cols; i++) {
                $("#seat_arrange").append("<ul></ul>");
                $("#seat_arrange > ul:eq(" + i + ")").append("<li>" + String.fromCharCode(char) + "</li>");
                for(var j = 0; j < rows; j++) {
                    $("#seat_arrange > ul:eq(" + i + ")").append("<li class='seatNo' data-row='" +
                        String.fromCharCode(char) +"' data-seat='" + seat_no +"' data-seat-num='" +
                        String.fromCharCode(char) + seat_no + "'>" + (j+1) + "</li>");
                    ++seat_no;
                }
                ++char;
                seat_no = 1;
            }

            if(data.seat != undefined) {
                for(var i = 0; i < data.seat.length; i++) {
                    for(j = 0; j < $(".seatNo").length; j++) {
                        if(data.seat[i] == $(".seatNo:eq(" + j +")").attr("data-seat-num")) {
                            $(".seatNo:eq(" + j +")").addClass("seat_style_no");
                            $(".seatNo:eq(" + j +")").text("X");
                        }
                    }
                }
            }
            // 인원수 변경 시 모든 좌석 예매 값 초기화!
            $(".selectbox__option").on("click", function() {
                $("#info_seat_data > span").remove();

                $("#adult_pay > .pay").text("");
                $("#teenager_pay > .pay").text("");
                $("#senior_pay > .pay").text("");
                $("#disabled_pay > .pay").text("");

                $("#adult_pay > .person").text("");
                $("#teenager_pay > .person").text("");
                $("#senior_pay > .person").text("");
                $("#disabled_pay > .person").text("");

                $("#total_pay").text("");

                $("#seat_arrange > ul > li").removeClass("seat_style_selected");
                $("#payment_Box").hide();

                person = 0;
            })

            /* 좌석 배치 정보2 - 좌석 선택*/
            $(".seatNo").on("click", function() {
                var adult = parseInt($("[data-pair='select-1'] > div:eq(1) > .selectbox__option--selected")[0].getAttribute("data-value"));
                var teenager = parseInt($("[data-pair='select-2'] > div:eq(1) > .selectbox__option--selected")[0].getAttribute("data-value"));
                var senior = parseInt($("[data-pair='select-3'] > div:eq(1) > .selectbox__option--selected")[0].getAttribute("data-value"));
                var disabled = parseInt($("[data-pair='select-4'] > div:eq(1) > .selectbox__option--selected")[0].getAttribute("data-value"));
                person = adult + teenager + senior + disabled;

                if(person == 0) {
                    alert("인원을 선택해 주십시오.");
                } else {
                    if($(this).hasClass("seatNo seat_style_no"))
                        alert("이미 예매 된 좌석입니다.");
                    if(person <= $(".seat_style_selected").length && !$(this).hasClass("seat_style_selected")) {
                        alert("더 이상 선택하실 수 없습니다. 인원을 늘려주세요.");
                    } else {
                        if(!$(this).hasClass("seatNo seat_style_no"))
                            $(this).toggleClass("seat_style_selected");
                    }
                    if($(this).hasClass("seat_style_selected")) {
                        if(person != $(".seat_style_selected").length) {
                            $("#info_seat_data").append("<span data-selected-seat='" +
                                $(this).attr("data-row") + $(this).attr("data-seat") +"'>" +
                                $(this).attr("data-row") + $(this).attr("data-seat") + ", </span>");
                        } else {
                            $("#info_seat_data").append("<span data-selected-seat='" +
                                $(this).attr("data-row") + $(this).attr("data-seat") +"'>" +
                                $(this).attr("data-row") + $(this).attr("data-seat") + "</span>");
                        }
                    } else {
                        for(var i = 0; i < $("#info_seat_data > span").length; i++) {
                            if($("#info_seat_data > span:eq(" + i +")").attr("data-selected-seat")
                                == $(this).attr("data-row") + $(this).attr("data-seat")) {
                                $("#info_seat_data > span:eq(" + i +")").remove();
                            }
                        }
                    }

                    if(person == $(".seat_style_selected").length) {
                        // 총 결제금액과 관련된 메서드를 작성한다.
                        var origin_price = parseInt(data.theaterInfo[0]["movie.price"]);
                        var adult_price = origin_price;
                        var teenager_price = origin_price - (origin_price*0.2);
                        var senior_price = origin_price - (origin_price*0.2);
                        var disabled_price = origin_price - (origin_price*0.3);
                        var total_pay = 0;

                        $("#adult_pay > .pay").text("\\ " + (adult_price*adult));
                        $("#teenager_pay > .pay").text("\\ " + (teenager_price*teenager));
                        $("#senior_pay > .pay").text("\\ " + (senior_price*senior));
                        $("#disabled_pay > .pay").text("\\ " + (disabled_price*disabled));
                        total_pay = (adult_price*adult) + (teenager_price*teenager) + (senior_price*senior) + (disabled_price*disabled);

                        $("#adult_pay > .person").text(" (" + adult +"명)");
                        $("#teenager_pay > .person").text(" (" + teenager +"명, 할인 -" + ((origin_price*teenager) - (teenager_price*teenager)) +"원)");
                        if(teenager == 0)
                            $("#teenager_pay > .person").text(" (" + teenager +"명)");

                        $("#senior_pay > .person").text(" (" + senior +"명, 할인 -" + ((origin_price*senior) - (senior_price*senior)) +"원)");
                        if(senior == 0)
                            $("#senior_pay > .person").text(" (" + senior +"명)");
                        $("#disabled_pay > .person").text(" (" + disabled +"명, 할인 -" + ((origin_price*disabled) - (disabled_price*disabled)) +"원)");
                        if(disabled == 0)
                            $("#disabled_pay > .person").text(" (" + disabled +"명)");

                        $("#total_pay").text(total_pay);

                        $("#payment_Box").show();
                    } else {
                        $("#adult_pay > .pay").text("");
                        $("#teenager_pay > .pay").text("");
                        $("#senior_pay > .pay").text("");
                        $("#disabled_pay > .pay").text("");

                        $("#adult_pay > .person").text("");
                        $("#teenager_pay > .person").text("");
                        $("#senior_pay > .person").text("");
                        $("#disabled_pay > .person").text("");

                        $("#total_pay").text("");

                        $("#payment_Box").hide();
                    }
                }
            });

            /* 결제 진행 */
            $("#payment_Btn").on("click", function() {
                var charge = $("#total_pay").text();
                var result = confirm(charge +'원을 결제 하시겠습니까?');
                if(result) {
                    console.log("결제완료!");
                    var seatArr = new Array();
                    for(var i = 0 ; i < $(".seat_style_selected").length; i++) {
                        seatArr.push($(".seat_style_selected:eq(" + i +")").attr("data-seat-num"));
                    }

                    // 좌석값 추가
                    var id = $("#status").attr("data-id");
                    var d = new Date();
                    var random_key = randomKey() + d.getTime();
                    console.log(parseInt($("[data-pair='select-3'] > div:eq(1) > .selectbox__option--selected")[0].getAttribute("data-value")));
                    console.log($("#total_pay").text());
                    $.post("insertSeat.cmd",
                        {seatArr : seatArr, tino : tino, id : id, random : random_key,
                         adult : parseInt($("[data-pair='select-1'] > div:eq(1) > .selectbox__option--selected")[0].getAttribute("data-value")),
                         teenager : parseInt($("[data-pair='select-2'] > div:eq(1) > .selectbox__option--selected")[0].getAttribute("data-value")),
                         senior : parseInt($("[data-pair='select-3'] > div:eq(1) > .selectbox__option--selected")[0].getAttribute("data-value")),
                         disabled : parseInt($("[data-pair='select-4'] > div:eq(1) > .selectbox__option--selected")[0].getAttribute("data-value")),
                         charge : $("#total_pay").text(),
                         cdate : $("#info_day_data").text(),
                         mno : $("#movie_data > dd > strong").attr("data-mno")})
                         .done(function(data){
                            $(location).attr("href", $(location).attr("href").split("seat.jsp")[0] + "mypage.jsp");
                    });
                }
            });

            /* 예매 정보 */
            $("#movie_data > dt").append("<img src='../../upload/" + data.theaterInfo[0]['movie.fileurl'] +"'>");
            $("#movie_data > dd").append("<strong data-mno='"+ data.theaterInfo[0]['theater.mno'] + "'>" + data.theaterInfo[0]['movie.name'] + "</strong>");
            $("#movie_data > dd").append("<p>" + data.theaterInfo[0]['movie.age'] + "세이상관람가</p>");
            $("#info_day_data").text(decodeURI(date, "UTF-8"));
            $("#info_time_data").text(data.theaterInfo[0]['theaterinfo.time']);
            $("#info_theater_data").html(data.theaterInfo[0]['area.name'] + ",<br>" + data.theaterInfo[0]['theater.name']);
    });

    $("#resetBox > button").on("click", function() {
        location.reload();
    });
})