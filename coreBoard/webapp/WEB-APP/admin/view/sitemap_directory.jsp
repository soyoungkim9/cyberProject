<%@ page import="coreview.menu.dao.MenuDaoBase" %>
<%@ page import="coreframe.CoreApplication" %>
<%@ page import="coreview.menu.dao.XmlDbMenuDao" %>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
    boolean isXmlDbMenuDao = false;

    MenuDaoBase menuDao = (MenuDaoBase) CoreApplication.getInstance().getBean("coreview.menuDao");
    if(menuDao instanceof XmlDbMenuDao){
        isXmlDbMenuDao = true;

    }

    String siteId = menuDao.getSourceInfo();
%>
<html>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=8,chrome=1">
<head>
    <style type="text/css">
        .placeholder { /* background-color: #cfcfcf; */
            width: 200px;
            border-color: #D6D6D6;
            border-style: dashed;
            border-width: 1px;
        }

        .ui-nestedSortable-error { /* background:#fbe3e4; */
            border-color: #F86363;
            border-style: dashed;
            border-width: 1px;
        }
    </style>
    ${import_baseUI}
    <script type="text/javascript">
        $(window).bind('resizestop', function (e) {
            $('div.content').height(parseInt($(window).height()) - 82);
        });

        $('body').ready(function () {
            var ux_tree = $('.ux-tree');

            $('#tabs').tabs();
            $.ajax({
                url: './getSitemapData?key=',
                dataType: 'text',
                async: false,
                cache: false,
                type: 'POST',
                success: function (msg) {
                    ux_tree.append(msg);
                }
            });

            $('div.content').height(parseInt($(window).height()) - 82);
            var openKey = [];
            var opens = [];
            var openKeys = '${open}';
            /*
            if (openKeys.length > 0){
                opens = openKeys.split(",");
            }
            if (opens.length > 0) {
                var spanT = $('span.fold.hasChildT');
                while (spanT.length > 0) {
                    spanT.each(function () {
                        $(this).trigger('append.auto', [$(this).parent()]);
                    });
                }

                $('span.unfold.hasChildT.prevOpen').each(function () {
                    $(this).addClass('fold').removeClass('unfold');
                    $(this).parent().attr('data-set', 'folded');
                    $(this).siblings('ol').hide();
                    $(this).removeClass('prevOpen');
                });
            }
            */

            $('#addTopMenu').click(function () {
                var name = prompt("새로추가할 메뉴의 이름을 입력하세요.");
                if (name != null) {
                    $.ajax('./addChild',{
                        data:'&name='+encodeURIComponent(name)+'&type=topfile',
                        success:function(data){
                            if(data['result'] == 'Y'){
                                var ol = ux_tree.find('ol');
                                var childCnt = ol.find('li').size();
                                var newXpath = '/site-menu/topmenu['+(childCnt+1)+']';

                                var newLi = '<li data-haschild="F" data-type="topfile" data-xpath="'+newXpath+'">';
                                newLi+= '<span class="indi hasChildF fold"></span>';
                                newLi+= '<span class="icon topfile"></span>';
                                newLi+= '<div class="label" >'+name+'</div>';
                                newLi+= '</li>';

                                if(ol.size()>0){
                                    ol.append(newLi);
                                }else{
                                    li.append('<ol>'+newLi+'</ol>')
                                }
                            }
                            alert(data['message']);
                        }
                    });

                }
            });

            ux_tree.click(function (e) {
                var o = e.target;
                var p = o.parentNode;
                if ($(o).hasClass('hasChildT')) {
                    var xpath = $(p).attr('data-xpath');
                    var s = $(p).attr('data-set');
                    if (s == undefined) {
                        $(o).addClass('unfold');
                        $.ajax({
                            url: './getSitemapData?xpath=' + encodeURIComponent(xpath),
                            dataType: 'text',
                            cache: false,
                            type: 'POST',
                            success: function (msg) {
                                var $msg = $(msg);
                                $msg.find('.no-nest').removeClass('no-nest');
                                $(p).append($msg);
                                $(p).attr('data-set', 'unfolded');
                            }
                        });
                    } else if (s == 'unfolded') {
                        $(p).attr('data-set', 'folded')
                                .find('> ol').hide();
                        $(o).removeClass('unfold');
                        $(o).addClass('fold');
                    } else {
                        $(p).attr('data-set', 'unfolded').find(
                                '> ol').show();
                        $(o).removeClass('fold');
                        $(o).addClass('unfold');
                    }
                } else if ($(o).hasClass('label')) {
                    var type = $(p).attr('data-type');
                    var nm = $(o).html();
                    openKey = [];
                    $('span.unfold').each(function () {
                        openKey.push($(this).parents('li').eq(0).attr('data-xpath'));
                    });

                    fireEvent({
                        'type': type,
                        'name': nm,
                        'cObj': o,
                        'open': openKey.join(',')
                    });
                }
            });


            ux_tree.delegate('.indi', 'append.auto', function (e) {
                $(e.target).addClass('unfold');
                $(e.target).removeClass('fold');
                var li = $(e.target).parents('li');
                $.ajax({
                    url: './getSitemapData?xpath=' + encodeURIComponent(li.attr('data-xpath')),
                    dataType: 'text',
                    async: false,
                    cache: false,
                    type: 'POST',
                    success: function (msg) {
                        var $msg = $(msg);
                        $msg.find('.no-nest').removeClass('no-nest');
                        $(e.target).parents('li').eq(0).append($msg);
                        $(e.target).parents('li').eq(0).attr('data-set', 'unfolded');

                        if (opens.indexOf($(e.target).parents('li').attr('data-key')) == -1) {
                            $(e.target).addClass('prevOpen');
                        }
                    }
                });
            });

            //리스트 드래그 드랍
            ux_tree.nestedSortable({
                disableNesting : 'no-nest',
                forcePlaceholderSize: true,
                handle: 'div',
                helper: 'clone',
                items: 'li.sortable',
                opacity: .8,
                placeholder: 'placeholder',
                revert: 0,
                tabSize: 0,
                containment: $('.content'),
                tolerance: 'pointer',
                toleranceElement: '> div',
                cancel: '.cancel',
                update: function (e, ui) {
                    var item = ui.item;
                    var catchItem = item.attr('data-xpath');
                    var parentKey = item.parents('li').attr('data-xpath');
                    var nextKey = item.next().attr('data-xpath') || '';
                    var preKey = item.prev().attr('data-xpath') || '';
                    var frm = $("#changeDIR");
                    $("[name='catchKey']", frm).val(catchItem);
                    $("[name='parentKey']", frm).val(parentKey);
                    $("[name='nextKey']", frm).val(nextKey);
                    $("[name='preKey']", frm).val(preKey);
                    $("[name='openKey']", frm).val(openKey.join(','));

                    frm.submit();
                    parent.frames['main'].location.href = './viewSitemapMenu?path=' + 0;
                }
            });


            var popmenu = '<span class="popmenu hover"></span>';//popmenu hover
            var popmenuItems = '<ol class="popmenuItems">'+ '<li class="append-child">Append Child</li>'+ '<li class="delete-menu">Delete</li>' + '</ol>';

            var timer = null;
            var c_time = 1000 / 20;

            var listTarget;//추가 타겟
            var removeTarget;//삭제 타겟

            //트리 ux 이벤트 바인딩
            ux_tree.delegate('.popmenu', 'mouseenter', function () {
                clearTimeout(timer);
            }).delegate('.popmenu', 'mouseleave', function () {
                var o = $(this).siblings('.label');
                var pi = o.siblings('.popmenuItems');
                if (pi.length == 0) {
                    timer = setTimeout(function () {
                        hidePopmenu(o);
                    }, c_time);
                } else {
                    timer = setTimeout(function () {
                        hidePopmenu(o);
                        hidePopmenuItem(pi);
                    }, c_time);
                }
            }).delegate('.label', 'mouseenter', function () {
                var s = $(this).siblings('.popmenu');
                if (s.length == 0) {
                    showPopmenu($(this));
                } else {
                    clearTimeout(timer);
                }
            }).delegate('.label', 'mouseleave', function () {
                var o = $(this);
                var pi = o.siblings('.popmenuItems');
                if (pi.length == 0) {
                    timer = setTimeout(function () {
                        hidePopmenu(o);
                    }, c_time);
                } else {
                    timer = setTimeout(function () {
                        hidePopmenu(o);
                        hidePopmenuItem(pi);
                    }, c_time);
                }
            }).delegate('.popmenu', 'click', function () {
                var pi = $(this).siblings('.popmenuItems');
                var dataXpath = $(this).parent().attr('data-xpath');
                listTarget = $(this).next();
                removeTarget = $(this).parent();

                if (pi.length == 0) {
                    showPopmenuItem($(this), dataXpath);
                } else {
                    hidePopmenuItem(pi);
                }
            }).delegate('.popmenuItems', 'mouseenter', function () {
                clearTimeout(timer);
            }).delegate('.popmenuItems', 'mouseleave', function () {
                hidePopmenu($(this).siblings('.label'));
                hidePopmenuItem($(this));
            }).delegate('.append-child', 'click', function () {
                var input = prompt("새로추가할 메뉴의 이름을 입력하세요.");
                if (input != null) {
                    var o = $(this).parent();
                    appendChild(o,o.closest('li'), input,'file');
                    hidePopmenuItem(o);
                }
            }).delegate('.delete-menu', 'click', function () {
                if (confirm("선택한 메뉴를 삭제 하시겠습니까?")) {
                    var o = $(this).parent();
                    deleteMenu(o, o.closest('li'));
                    hidePopmenuItem(o);
                }
            });

            function showPopmenu(o) {
                o.addClass('hover');
                o.after(popmenu);
            }

            function hidePopmenu(o) {
                o.removeClass('hover');
                o.siblings('.popmenu').remove();
            }

            function showPopmenuItem(o, xpath) {
                var c = o.parent(); //li

                var c_w = c.width();//li의 가로길이
                var s_w = 0;
                var div = o.siblings('div');
                var spans = o.siblings('span');
                spans.each(function () {
                    s_w += $(this).width();
                });
                div.each(function () {
                    s_w += $(this).width();
                });
                var pi = $(popmenuItems).css('right', (c_w - s_w) - 53).attr('data-xpath', xpath);
                o.after(pi);
            }

            function hidePopmenuItem(o) {
                o.remove();
            }

            //append child 버튼 클릭
            function appendChild(key,li, name, type) {
                var ol = li.find('ol');
                var parentLi = null;
                if(ol.size()>0){
                    parentLi = ol.closest('li');
                }else{
                    parentLi = li;
                }

                if(parentLi.attr('data-set')==undefined && parentLi.attr('data-haschild')=='T'){
                    $.ajax({
                        url: './getSitemapData?xpath=' + encodeURIComponent(parentLi.attr('data-xpath')),
                        dataType: 'text',
                        cache: false,
                        type: 'POST',
                        async: false,
                        success: function (msg) {
                            var $msg = $(msg);
                            $msg.find('.no-nest').removeClass('no-nest');
                            parentLi.append($msg).attr('data-set', 'unfolded');
                            parentLi.find('> .indi').addClass('unfold');
                        }
                    });
                }

                var xpath = key.attr('data-xpath');
                $.ajax('./addChild',{
                    data:'xpath='+xpath+'&name='+encodeURIComponent(name)+'&type='+type,
                    success:function(data){
                        if(data['result'] == 'Y'){
                            ol = li.find('ol');//다시 구함
                            var childCnt = ol.find('li').size();
                            var newXpath = xpath+'/child/menu['+(childCnt+1)+']';
                            var newLi = '<li class="sortable" data-haschild="F" data-type="'+type+'" data-xpath="'+newXpath+'">';
                            newLi+= '<span class="indi hasChildF fold"></span> ';
                            newLi+= '<span class="icon '+type+'"></span>';
                            newLi+= '<div class="label" >'+name+'</div>';
                            newLi+= '</li>';


                            if(ol.size()>0){
                                ol.append(newLi);
                            }else{
                                li.append('<ol>'+newLi+'</ol>');
                            }

                            parentLi.attr('data-haschild','T').attr('data-set','unfolded');
                            parentLi.find('> .indi').removeClass('hasChildF').addClass('hasChildT').addClass('unfold');
                        }
                        alert(data['message']);
                    }
                });
            }

            //delete 버튼 클릭
            function deleteMenu(key,li) {
                $.ajax('./removeChild',{
                    data:'xpath='+key.attr('data-xpath'),
                    success:function(data){
                        var ol = li.parent();
                        if(data['result']=='Y'){
                            li.remove();
                        }

                        if(ol.find('li').size()==0){
                            ol.closest('li').find('> .indi').removeClass('hasChildT').addClass('hasChildF').removeClass('unfold');
                        }

                        alert(data['message']);
                    }
                });
            }
        });


        var preLabelObj;
        function fireEvent(eobj) {
            //bld, dataTyp, labelObj
            var labelObj = eobj.cObj;

            if (eobj.type != 'file' && eobj.type != 'topfile')
                return;
            try {
                if (preLabelObj)
                    $(preLabelObj).removeClass('sel');
            } catch (e) {
            }
            $(labelObj).addClass('sel');
            preLabelObj = labelObj;

            var xpath = $(labelObj).closest('li').attr('data-xpath');

            parent.frames['main'].location.href = './viewSitemapMenu?xpath=' + encodeURIComponent(xpath);
        }


        Array.prototype.indexOf = function (object) {
            for (var i = 0, length = this.length; i < length; i++)
                if (this[i] == object) return i;
            return -1;
        };
    </script>
</head>


<body>
<div id="tabs">
    <ul>
        <li><a href="#tabs-1">[<%=isXmlDbMenuDao?"DB":"XML"%>] <%=siteId%></a></li>
    </ul>
    <div class="section_body">
        <div style="margin-left: 20px;padding-top:10px;">
            <img title="TopMenu 추가" id="addTopMenu" style="cursor: pointer;" src="view/img/tree/add_2.png"/>
            <a href="./downloadSitemapXml"><img title="Sitemap download" style="cursor: pointer;" src="view/img/tree/download.png"/></a>
            <%if(isXmlDbMenuDao){%>
            <img title="Sitemap upload" style="cursor: pointer;" src="view/img/tree/upload.png" onclick="$('#sitemapUpload').toggle()"/>
            <%}%>
        </div>
        <div class="content" id="bld_tree">
            <ol class="ux-tree no-nest">

            </ol>
        </div>
    </div>
</div>


<form id="changeDIR" method="post" action="./changeDIR">
    <input name="catchKey" type="hidden" value=""/>
    <input name="parentKey" type="hidden" value=""/>
    <input name="nextKey" type="hidden" value=""/>
    <input name="preKey" type="hidden" value=""/>
    <input name="openKey" type="hidden" value=""/>
</form>
<%if(isXmlDbMenuDao){%>
<form id="sitemapUpload" method="post" action="./uploadSitemapXml" enctype="multipart/form-data" style="position: absolute;top:0;left:0;background: #E0E6EA;display: none;padding:10px;text-align: center;">
    <h3>SITE_ID = [<%=siteId%>]</h3>
    <p style="color: darkred;margin-bottom: 5px;">SITE_ID에 해당하는 모든 메뉴를 삭제후 입력</p>
    <input type="file"  class="button" name="uploadXml" style="width:100%;"><br>
    <div style="margin-top: 10px;">
        <input type="hidden" name="siteId" value="<%=siteId%>" />
        <input class="button" type="submit" value="전송" style="border:none;">
        <input class="button" type="button" value="취소" style="border:none;" onclick="$(this.form).hide();">
    </div>
</form>
<%}%>
</body>
</html>