$(function() {
    setTimeout(function() {
        // 예매목록 가져오기
        var id = $("#status").attr("data-id");
        $.get("mypage.cmd", {id : id})
            .done(function(data) {
                console.log(data.ticket);
                console.log(id);

                $("#no_content").hide();
                var source = $("#list-template").html();
                var template = Handlebars.compile(source);
                var html = template(data);
                $("#view_contnet").append(html);


                var ticket = new Array();
                var charge = new Array();
                for(var i = 0; i < data.ticket.length; i++) {
                    ticket.push(data.ticket[i].tino);
                    charge.push(data.ticket[i]["seat.randomkey"]);
                }
                $.get("mypage.cmd", {ticket : ticket})
                    .done(function(data) {
                        console.log(data);
                        for(key in data) {
                            if(key.match(/info/)) {
                                var keyindex = key.split('o')[1];
                                $(".ticket_img:eq(" + keyindex +") > img").attr("src", "../../upload/" + data[key][0]["movie.fileurl"]);
                                $(".ticket_time")[keyindex].innerText = data[key][0]["theaterinfo.time"];
                                $(".ticket_location")[keyindex].innerText = data[key][0]["area.name"] + " " + data[key][0]["theater.name"];
                                $(".detail_btn")[keyindex].setAttribute('data-mno', data[key][0]["theater.mno"]);
                                $(".detail_view_btn")[keyindex].setAttribute('data-mno', data[key][0]["theater.mno"]);
                            }
                        }
                    });
                $.get("mypage.cmd", {randomkey : charge})
                    .done(function(data) {
                        console.log(data);
                        $(".success_Btn").hide();
                        $(".detail_btn").hide();
                        for(key in data) {
                            if(key.match(/randomkey/)) {
                                var keyindex = key.split('y')[1];
                                $(".ticket_number")[keyindex].innerText = data[key][0]["randomkey"];
                                $(".cancle_Btn")[keyindex].setAttribute('data-key', data[key][0]["randomkey"]);
                                $(".ticket_date")[keyindex].innerText = data[key][0]["cdate"];
                                $(".ticket_charge")[keyindex].innerText = data[key][0]["charge"] + "원";
                                $(".ticket_seat")[keyindex].innerText = "성인" + data[key][0]["adult"] +
                                    ", 청소년" + data[key][0]["teenager"] +
                                    ", 노인" + data[key][0]["senior"] +
                                    ", 장애인" + data[key][0]["disabled"] +
                                    " (총 " + data[key][0]["ticketcount"] + "명)";
                            }
                        }

                        var date = new Date();
                        var month = parseInt(String(date.getFullYear()) +
                            String((parseInt(date.getMonth()+1) < 10 ? '0' : '') + parseInt(date.getMonth()+1)));
                        var today = parseInt(String(date.getFullYear()) +
                            String((parseInt(date.getMonth()+1) < 10 ? '0' : '') + parseInt(date.getMonth()+1)) +
                            String((date.getDate() < 10 ? '0' : '') + date.getDate()));
                        var time = parseInt(String((date.getHours() < 10 ? '0' : '') + date.getHours()) +
                            String((date.getMinutes() < 10 ? '0' : '') + date.getMinutes()));

                        for(var i = 0; i < $(".ticket_box").length; i++) {
                            console.log(month);
                            console.log(time);
                            if(month > parseInt($(".ticket_date:eq(" + i +")").text().split("(")[0].split(".")[0] +
                                (parseInt($(".ticket_date:eq(" + i +")").text().split("(")[0].split(".")[1].split('0')[1]) > 10 ?
                                    $(".ticket_date:eq(" + i +")").text().split("(")[0].split(".")[1].split('0')[1]
                                    : "0" + $(".ticket_date:eq(" + i +")").text().split("(")[0].split(".")[1].split('0')[1]))) {
                                    $(".success_Btn:eq(" + i + ")").show();
                                    $(".detail_btn:eq(" + i + ")").show();
                                    $(".detail_view_btn:eq(" + i + ")").hide();
                                    $(".cancle_Btn:eq(" + i + ")").hide();
                                    $(".ticket_box:eq(" + i + ")").css("color", "#b9b9b9");
                            } else if(today > parseInt($(".ticket_date:eq(" + i +")").text().split("(")[0].split(".")[0] +
                                (parseInt($(".ticket_date:eq(" + i +")").text().split("(")[0].split(".")[1].split('0')[1]) > 10 ?
                                    $(".ticket_date:eq(" + i +")").text().split("(")[0].split(".")[1].split('0')[1]
                                    : "0" + $(".ticket_date:eq(" + i +")").text().split("(")[0].split(".")[1].split('0')[1]) +
                                $(".ticket_date:eq(" + i +")").text().split("(")[0].split(".")[2])) {
                                    $(".success_Btn:eq(" + i + ")").show();
                                    $(".detail_btn:eq(" + i + ")").show();
                                    $(".detail_view_btn:eq(" + i + ")").hide();
                                    $(".cancle_Btn:eq(" + i + ")").hide();
                                    $(".ticket_box:eq(" + i + ")").css("color", "#b9b9b9");
                            } else if(time > parseInt($(".ticket_time:eq(" + i + ")").text().split(":")[0] + $(".ticket_time:eq(" + i +")").text().split(":")[1])){
                                $(".success_Btn:eq(" + i + ")").show();
                                $(".detail_btn:eq(" + i + ")").show();
                                $(".detail_view_btn:eq(" + i + ")").hide();
                                $(".cancle_Btn:eq(" + i + ")").hide();
                                $(".ticket_box:eq(" + i + ")").css("color", "#b9b9b9");
                            }
                        }
                    });
                
                // 취소하기
                $(".cancle_Btn").on("click", function() {
                    if(confirm("취소 하시겠습니까?")) {
                        var randomkey = $(this).attr("data-key");
                        $.post("deleteTicket.cmd", {randomkey: randomkey})
                            .done(function() {
                                location.reload();
                            });
                    }
                });

                // 상세보기
                $(".detail_btn, .detail_view_btn").on("click", function() {
                    var mno = $(this).attr("data-mno");
                    location.href = "listDetail.jsp?mno=" + mno;
                });
            });
    }, 1100);
});