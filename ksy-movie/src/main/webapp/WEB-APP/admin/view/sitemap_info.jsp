<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="xds" class="coreframe.data.XmlDataSet" scope="request"></jsp:useBean>
<jsp:useBean id="layoutXds" class="coreframe.data.XmlDataSet" scope="request"></jsp:useBean>
<jsp:useBean id="baseXpath" class="java.lang.String" scope="request"></jsp:useBean>
<%
    coreframe.xml.XMLReferer xref = new coreframe.xml.XMLReferer(xds);
    xref.setNullValue("");
%>

<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=8,chrome=1">
    <title>coreFRAME BLD</title>
    ${import_baseUI}

    <script type="text/javascript">
        var u = window.location.href + '';
        var idx = u.indexOf("/admin");
        u = u.substring(0, idx - 1);
        idx = u.lastIndexOf("/");
        var baseUrl = u.substring(0, idx);

        $(document).ready(function () {
            var values = [];
            var isSaveClick = false;

            $('input[type=text],textarea,select').each(function () {
                values.push($(this).val());
            });

            $(window).bind("beforeunload", function () {
                var isModified = false;
                $('input[type=text],textarea,select').each(function (i) {
                    if ($(this).val() != values[i]) isModified = true;
                });

                if (isModified && !isSaveClick){
                    return "저장하지않은 변경내용이 있습니다.";
                }
            }).bind('resizestop', function (e) {
                $('div.content').height(parseInt($(window).height()) - 82);
                $('#chkResult').height(parseInt($(window).height()) - 160);
            });

            $('#tabs').tabs({cookie: {expires: 30, name: 'tabs'}});

            $('div.panel').height(parseInt($(window).height()) - 82);
            $('#chkResult').height(parseInt($(window).height()) - 160);

            $('#btnChk').click(function () {
                var u = baseUrl + '/apps/admin/validateHTML?u=' + $('#furl').attr('value');
                $('#chkResult').attr('src', u);
            });

            $('#preview').click(function () {
                var u = $('#furl').attr('value');
                window.open('../admin/autoReload?reloadURL=' + u);
            });

            $('#apply').click(function () {
                isSaveClick = true;
                var name = $('#name_input').val();
                if ('${baseXpath}' != '') {
                    if (confirm(name + " 의 수정내용을 저장하시겠습니까?")) {
                        var open = '${open}';
                        //parent.frames['dir'].location.href = './viewSitemapDirectory?open=' + open;
                        $('#mainFrm').submit();
                    }
                }
            });

            $('#addUrlBtn').click(function (e) {
                var tblBody = $('#anotherUrlTable').find('tbody');
                var row = '<tr>';
                row += '<td><img src="view/img/info/remove.png" onclick="deleteRow(this)" data-name="URL"/></td>';
                row += '<td>'+(tblBody.find('tr').size()+1)+'</td>';
                row += '<td><input type="text" style="width:90%" name="another-url" class="addParamInput" /></td>';
                row += '<td><input type="text" style="width:90%" name="another-properties" class="addParamInput" /></td>';
                row += '</tr>';
                tblBody.append(row);
            });

            $('#addParamBtn').click(function (e) {
                var tblBody = $('#paraTable').find('tbody');
                var row = '<tr>';
                row += '<td><img src="view/img/info/remove.png" onclick="deleteRow(this)" data-name="Param"/></td>';
                row += '<td>'+(tblBody.find('tr').size()+1)+'</td>';
                row += '<td><input type="text" style="width:90%" name="paramName" class="addParamInput" /></td>';
                row += '<td><input type="text" style="width:90%" name="paramValue" class="addParamInput" /></td>';
                row += '</tr>';
                tblBody.append(row);
            });
        });

        function deleteRow(img){
            var $img = $(img);
            var name = $img.attr('data-name');
            if (confirm(name + "을 삭제 하시겠습니까?")) {
                $img.closest('TR').remove();
            }
        }
    </script>

    <style type="text/css">
        fieldset{
            margin-bottom: 40px;
        }

        .alignLabel {
            float: left;
            width: 8em;
            padding-left: 0em;
            padding-right: 1em;
            padding-top: 4px;
        }

        .inputText {
            width: 300px;
            border: 1px solid #B8BAB9;
            height: 20px;
            line-height: 20px;
            margin-top: 0;
        }

        img {
            cursor: pointer;
        }

        .tableList{
            margin-top: 0;
        }

        .from-control{
            margin-bottom: 10px;
        }

        select{
            height: 25px !important;
            width: 302px !important;
        }
        textarea{
            height: 25px !important;
            width: 296px !important;
        }
    </style>
</head>


<body>
<div class="ContentTabSet2">
    <div class="resourceName">
        Sitemap (<%=xds.getText(baseXpath + "/@name")%>)
        <img style="vertical-align:text-top;" height="20px" title="저장하기" src="view/img/info/save.png" id="apply"/>
    </div>
</div>

<div id="formDiv" class="divStyle">
    <form id="mainFrm" action="./viewSitemapMenuModify" method="post">
        <input type="hidden" name="baseXpath" value="<%=baseXpath%>"/>
        <div id="tabs">
            <ul>
                <li><a href="#tabs-1"><span>Basic</span></a></li>
                <li><a href="#tabs-4"><span>Validation</span></a></li>
            </ul>

            <div id="tabs-1">
                <fieldset>
                    <legend>Basic Info <img height="25px" title="미리보기" src="view/img/info/Preview.png" id="preview"/>
                    </legend>
                    <div class="from-control">
                        <label class="alignLabel">Name</label>
                        <input type="text" class="inputText" id="name_input" name="<%=baseXpath%>/@name" value="<%=xds.getText(baseXpath+"/@name")%>"/>
                    </div>

                    <div class="from-control">
                        <label class="alignLabel">URL </label>
                        <input type="text" class="inputText" id="furl" name="<%=baseXpath%>/url" value="<%=xds.getText(baseXpath+"/url")%>"/>
                    </div>

                    <div class="from-control">
                        <label class="alignLabel">Authorization</label>
                        <input type="text" class="inputText" name="<%=baseXpath%>/auth" value="<%=xds.getText(baseXpath+"/auth")%>"/>
                    </div>

                    <div class="from-control">
                        <label class="alignLabel">layout</label>
                        <select class="inputText" name="<%=baseXpath%>/layout">
                            <%
                                {
                                    String xpath = "layout-profile/portal/layouts/layout";
                                    int cnt2 = layoutXds.getCount(xpath);
                                    int j;
                                    for (j = 0; j < cnt2; j++) {
                                        xpath = "layout-profile/portal/layouts/layout";
                                        xpath += "[" + (j + 1) + "]";
                            %>
                            <%if (xds.getText(baseXpath + "/layout").equals(layoutXds.getText(xpath + "/@name"))) { %>
                            <option selected="selected"
                                    value="<%=layoutXds.getText(xpath+"/@name")%>"><%=layoutXds.getText(xpath + "/@name")%>
                            </option>
                            <%} else { %>
                            <option value="<%=layoutXds.getText(xpath+"/@name")%>"><%=layoutXds.getText(xpath + "/@name")%>
                            </option>
                            <%} %>
                            <%
                                    }
                                }
                            %>
                        </select>
                    </div>

                    <div class="from-control">
                        <label class="alignLabel">visual</label>
                        <select class="inputText" name="<%=baseXpath%>/visual">
                            <option value="true">true</option>
                            <option value="false" <%="false".equals(xds.getText(baseXpath + "/visual")) ? "selected=\"selected\"" : ""%>>
                                false
                            </option>
                        </select>
                    </div>

                    <div class="from-control">
                        <label class="alignLabel">active</label>
                        <select class="inputText" name="<%=baseXpath%>/active">
                            <option value="true">true</option>
                            <option value="false" <%="false".equals(xds.getText(baseXpath + "/active")) ? "selected=\"selected\"" : ""%>>
                                false
                            </option>
                        </select>
                    </div>

                    <div class="from-control">
                        <label class="alignLabel">Memo</label>
                        <textarea class="inputText" name="<%=baseXpath%>/memo"><%=xds.getText(baseXpath + "/memo")%></textarea>
                    </div>

                    <div class="from-control">
                        <label class="alignLabel">Content DIR</label>
                        <input type="text" class="inputText" name="<%=baseXpath%>/content-dir" value="<%=xds.getText(baseXpath+"/content-dir")%>"/>
                    </div>
                </fieldset>

                <%
                    {
                        String xpath = baseXpath + "/another-url";
                        int cnt2 = xds.getCount(xpath);
                %>
                <fieldset id="anotherUrlField">
                    <legend>URL Extension
                        <img title="Another URL추가" src="view/img/info/add_btn_small.png" id="addUrlBtn" style="vertical-align: sub;"/>
                    </legend>
                    <table id="anotherUrlTable" class="tableList">
                        <colgroup>
                            <col width="30px"/>
                            <col width="120px"/>
                            <col align="left"/>
                            <col/>
                        </colgroup>
                        <thead>
                        <tr>
                            <th></th>
                            <th>No</th>
                            <th>URL</th>
                            <th>properties</th>
                        </tr>
                        </thead>
                        <tbody>
                        <%
                            for (int j = 0; j < cnt2; j++) {
                                xpath = baseXpath + "/another-url";
                                xpath += "[" + (j + 1) + "]";
                        %>
                        <tr>
                            <td><img src="view/img/info/remove.png" onclick="deleteRow(this)" data-name="<%=xds.getText(xpath+"/@another-url") %>"/></td>
                            <td><%=(j + 1) %></td>
                            <td><input type="text" style="width:90%" name="another-url" value="<%=xds.getText(xpath) %>"/></td>
                            <td><input type="text" style="width:90%" name="another-url-properties" value="<%=xds.getText(xpath+"/@properties") %>"/></td>
                        </tr>
                        <%
                                }
                            }
                        %>
                        </tbody>
                    </table>
                </fieldset>


                <fieldset>
                    <legend>Param
                        <img title="parameter 추가" id="addParamBtn" src="view/img/info/add_btn_small.png" style="vertical-align: sub;"/>
                    </legend>
                    <table id="paraTable" class="tableList">
                        <colgroup>
                            <col width="30px"/>
                            <col width="120px"/>
                            <col align="left"/>
                            <col/>
                        </colgroup>
                        <thead>
                        <tr>
                            <th></th>
                            <th>No</th>
                            <th>name</th>
                            <th>value</th>
                        </tr>
                        </thead>
                        <tbody>
                        <%
                            String paramXpath = baseXpath + "/param";
                            for (int j = 0, ic = xds.getCount(paramXpath); j < ic; j++) {
                                paramXpath = baseXpath + "/param"+"[" + (j + 1) + "]";
                        %>
                        <tr>
                            <td><img src="view/img/info/remove.png" onclick="deleteRow(this)" data-name="<%=xds.getText(paramXpath+"/@name") %>"/></td>
                            <td><%=(j + 1) %></td>
                            <td><input type="text" style="width:90%" name="paramName" value="<%=xds.getText(paramXpath+"/@name") %>"/></td>
                            <td><input type="text" style="width:90%" name="paramValue" value="<%=xds.getText(paramXpath) %>"/></td>
                        </tr>
                        <%  }%>
                        </tbody>
                    </table>
                </fieldset>

                <fieldset>
                    <legend>Publish</legend>
                    <div class="from-control">
                        <label class="alignLabel">Source url</label>
                        <input type="text" class="inputText" name="publish-source-url" value="<%=xds.getText(baseXpath+"/publish/source-url")%>"/>
                    </div>

                    <div class="from-control">
                        <label class="alignLabel">publish time</label>
                        <input type="text" class="inputText" name="publish-time-gap" value="<%=xds.getText(baseXpath+"/publish/time-gap")%>"/>
                    </div>

                    <div class="from-control">
                        <label class="alignLabel">min size</label>
                        <input type="text" class="inputText" name="publish-min-page-size" value="<%=xds.getText(baseXpath+"/publish/min-page-size")%>"/>
                    </div>
                </fieldset>
            </div>

            <div id="tabs-4">
                <fieldset>
                    <legend>HTML Valication</legend>
                    <button type="button" id="btnChk">Validation</button>
                    <iframe name="chkResult" id="chkResult" src="" style="width: 97%; height: 500px; border: 0px;"
                            frameborder="no"></iframe>
                </fieldset>
            </div>

            <div id="tabs-5">
                <!-- 이부분 없으면 IE 에서 멈춤 현상 -->
            </div>
        </div>
    </form>
</div>
</body>
</html>