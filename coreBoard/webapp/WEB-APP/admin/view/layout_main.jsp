<%@ page import="coreview.layout.dao.LayoutDaoBase" %>
<%@ page import="coreframe.CoreApplication" %>
<%@ page import="coreview.layout.dao.XmlDbDao" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<jsp:useBean id="xds" class="coreframe.data.XmlDataSet" scope="request"></jsp:useBean>
<jsp:useBean id="baseXpath" class="java.lang.String" scope="request"></jsp:useBean>
<jsp:useBean id="devices" class="java.util.ArrayList" scope="request"></jsp:useBean>
<%
	boolean isXmlDbLayoutDao = false;
	String siteId = "layout.xml";
	try{
		LayoutDaoBase layoutDao = (LayoutDaoBase) CoreApplication.getInstance().getBean("coreview.layout.dao");
		if(layoutDao instanceof XmlDbDao){
			isXmlDbLayoutDao = true;
		}
		siteId = layoutDao.getSourceInfo();
	}catch(Exception ex){

	}




%>
<html>
<head>
${import_baseUI}
<meta charset="utf-8">
<title>Layout</title>
<style type="text/css">
	fieldset label{
		font-size:10pt;
		font-family:고딕;
		color: #3E424B;
		text-align: right;
		vertical-align:middle;
		line-height:20px;
		font-weight: bold;
	}
	.alignLabel{

		float: left;
		width: 8em;
		padding-left:0em;
		padding-right:1em;
		padding-top:6px;
	}

	img{
		cursor: pointer;
	}
</style>


<script type="text/javascript">
	var values = [];
	var isSaveClick = false;

	$(window).bind('resizestop',function(e) {
		$('div.panel').height(parseInt($(window).height())-68);
	});

	$(window).bind("beforeunload", function(){
		var isModified = false;
		$('input[type=text],textarea,select').each(function(i){
			if($(this).val() != values[i]) isModified = true;
		});
		if(isModified && !isSaveClick){
			return "저장하지않은 변경내용이 있습니다.";
		}
	});

	var deviceOptions = '';
	var devices = '${devices}'.replace('[', "").replace(']', "").split(", ");
	for( var i = 0, ic = devices.length; i < ic; i++){
		var text = devices[i] == '*' ? '* (all)' : devices[i] ;
		deviceOptions+= '<option value="'+devices[i]+'">'+text+'</option>';
	}

	$(document).ready(function(){
		$('#tabs').tabs({ cookie: { expires: 30, name: 'tabs'} });
		$('div.panel').height(parseInt($(window).height())-68);
		
		$('input[type=text],textarea,select').each(function(){
			  values.push($(this).val());
		});

		$('#addDevice').click(function(e){
			var deviceTable = $('#deviceTable');
			var tbody = deviceTable.find('tbody');
			var rows = '<tr>';
			rows+= '<td><img src="view/img/info/remove.png" onclick="$(this).closest(\'tr\').remove()"/></td>';
			rows+= '<td>'+(tbody.find('tr').size()+1)+'</td>';
			rows+= '<td><input type="text" name="deviceName" style="width:95%"></td>';
			rows+= '<td><input type="text" name="deviceRegx" style="width:95%"></td>';
			rows+= '<td><input type="text" name="deviceDomain" style="width:95%"></td>';
			rows+= '</tr>';
			tbody.append($(rows));
		});
		
		$('#addLayout').click(function(e){
			var layoutTable = $('#layoutTable');
			var tbody = layoutTable.find('tbody');

			var rows = '<tr>';
			rows+= '<td><img src="view/img/info/remove.png" onclick="$(this).closest(\'tr\').remove()"/></td>';
			rows+= '<td>'+(tbody.find('tr').size()+1)+'</td>';
			rows+= '<td><input type="text" name="layoutName" style="width:95%"></td>';
			rows+= '<td><img title="template-page 추가" src="view/img/info/add_btn_small.png" onclick="addTempletPage(this)"></td>';
			rows+= '<td><div>';
			rows+= '<img title="template-page 삭제" src="view/img/info/remove.png" onclick="onclick="$(this).closest(\'div\').remove()""/>';
			rows+= '<input type="text" name="templetText" style="width:70%;"/>';
			rows+= '<select name="templetDevice" style="width: 20%">'+deviceOptions+'</select>';
			rows+= '</div></td>';
			rows += '</tr>';

			tbody.append($(rows));
		});
		

		$('.apply').click(function(e){
			 if (confirm("수정내용을 저장하시겠습니까?")){
				 isSaveClick = true;
				 $("#layoutTable tbody tr").each(function(idx){
					 $(this).find('[name="templetText"],[name="templetDevice"]').each(function(){
						 this.name = this.name+'_'+idx;//이름에 idx를 추가한 이름으로 변경
					 });
				 });
				 $('#mainFrm').submit();
			 }
		});
	});

	function addTempletPage(img){
		var targetTD = $(img).closest('TD').next();

		var div = '<div>';
		div+= '<img title="template-page 삭제" src="view/img/info/remove.png" onclick="$(this).closest(\'div\').remove()"/>\n';
		div+= '<input type="text" name="templetText" style="width:70%;"/>\n';//\n은 디자인이 틀어져서..
		div+= '<select name="templetDevice" style="width: 20%">'+deviceOptions+'</select>\n';
		div+= '</div>';

		targetTD.append(div);
	}
</script>
</head>
<body>
	<div id="formDiv" class="divStyle">
 	<form id="mainFrm" action="./viewLayoutMenuModify" method="post">
		<div id="tabs">
			<ul>
	 			<li><a href="#tabs-1"><span>[<%=isXmlDbLayoutDao?"DB":"XML"%>]Devices</span></a></li>
	 			<li><a href="#tabs-2"><span>[<%=isXmlDbLayoutDao?"DB":"XML"%>]Layouts</span></a></li>
	 		</ul>
		
			<div id="tabs-1" class="panel">
				<a href="./downloadLayoutXml"><img title="Sitemap download" style="cursor: pointer;" src="view/img/tree/download.png"/></a>
				<%if(isXmlDbLayoutDao){%>
				<img title="Sitemap upload" style="cursor: pointer;" src="view/img/tree/upload.png" onclick="$('#layoutUpload').toggle()"/>
				<%}%>

				<%{ String devicesXpath = baseXpath+"/devices";%>
				<fieldset>
					<legend>
						Basic Info
						<img style="vertical-align:bottom;" height="20px" title="저장하기" src="view/img/info/save.png" class="apply"/>
					</legend>
					<label class="alignLabel">Default-device</label>
					<input type="text" class="inputText" name="defaultDeviceName" value="<%=xds.getText(devicesXpath+"/@default-device-name") %>"/><br/>
				</fieldset>
				<fieldset>
	 				<legend>
	 					Devices 
	 					<img style="vertical-align:sub;" title="Device 추가" alt="Device 추가" src="view/img/info/add_btn_small.png" id="addDevice"/>
	 			   </legend>
	 				<table id="deviceTable" class="tableList">
						<colgroup>
							<col width="5%"/>
							<col width="5%"/>
							<col width="15%"/>
							<col width="60%"/>
							<col width="15%"/>
						</colgroup>
						<thead>
						<tr>
						   <th></th>
						   <th>No</th>
						   <th>name</th>
						   <th>reg-exp</th>
							<th>domain</th>
						</tr>
						</thead>
						<tbody>
						<%
							for(int i = 0, ic = xds.getCount(devicesXpath+"/device"); i < ic; i++){
								String xpath = devicesXpath+ "/device["+(i+1)+"]";
						%>
						<tr>
							<td><img title="Device 삭제" src="view/img/info/remove.png" onclick="$(this).closest('tr').remove()"/></td>
							<td><%=i+1 %></td>	
							<td><input style="width:95%" type="text" name="deviceName" value="<%=xds.getText(xpath+"/@name") %>"/></td>
							<td><input style="width:95%" type="text" name="deviceRegx" value="<%=xds.getText(xpath+"/@reg-exp") %>"/></td>
							<td><input style="width:95%" type="text" name="deviceDomain" value="<%=xds.getText(xpath+"/@domain") %>"/></td>
						</tr>
						<%} %>
						</tbody>
						</table>
				</fieldset>
				<%} %>
	 		</div>
	 		
	 		<div id="tabs-2" class="panel">
				<a href="./downloadLayoutXml"><img title="Sitemap download" style="cursor: pointer;" src="view/img/tree/download.png"/></a>
				<%if(isXmlDbLayoutDao){%>
				<img title="Sitemap upload" style="cursor: pointer;" src="view/img/tree/upload.png" onclick="$('#layoutUpload').toggle()"/>
				<%}%>

				<%{String layoutsXpath = baseXpath+"/layouts";%>
				<fieldset>
					<legend>
						Basic Info
						<img style="vertical-align:bottom;" height="20px" title="저장하기" src="view/img/info/save.png" class="apply"/>
					</legend>
					<label class="alignLabel">Default-layout</label>
					<input type="text" class="inputText" name="defaultLayoutName" value="<%=xds.getText(layoutsXpath+"/@default") %>"/><br/>
				</fieldset>
				<fieldset>
	 				<legend>Layouts 
	 					<img style="vertical-align:sub;" title="Layout 추가" src="view/img/info/add_btn_small.png" id="addLayout"/>
	 				</legend>
	 				<table id="layoutTable" class="tableList">
						<colgroup>
							<col width="5%"/>
							<col width="5%"/>
							<col width="15%"/>
							<col width="2%"/>
							<col width="73%"/>
						</colgroup>
						<thead>
						<tr>
							<th></th>
							<th>No</th>
							<th>name</th>
							<th></th>
							<th>template-page</th>
						</tr>
						</thead>
						<tbody>
						<%
							String valueXpath;
							for(int i = 0, ic = xds.getCount(layoutsXpath+"/layout"); i < ic; i++){
								String xpath = layoutsXpath+"/layout"+"["+(i+1)+"]";
								valueXpath = xpath+"/template-page";
						%>
						<tr>
							<td><img title="Layout 삭제" src="view/img/info/remove.png" onclick="$(this).closest('tr').remove()"/></td>
							<td><%=i+1 %></td>	
							<td>
								<input style="width:95%;" type="text" name="layoutName" value="<%=xds.getText(xpath+"/@name") %>"/>
							</td>
							<td><img title="template-page 추가" src="view/img/info/add_btn_small.png" onclick="addTempletPage(this)"></td>
						  	<td>
						  		<%for(int j = 0, jc = xds.getCount(valueXpath); j<jc; j++){
									valueXpath = xpath+"/template-page"+"["+(j+1)+"]";%>
									<div>
										<img title="template-page 삭제" src="view/img/info/remove.png" onclick="$(this).closest('div').remove()"/>
										<input type="text" name="templetText" value="<%=xds.getText(valueXpath) %>" style="width:70%;"/>
										<select name="templetDevice"  style="width:20%;">
											<%for(int q = 0; q<devices.size(); q++) {%>
											<%if(devices.get(q).equals(xds.getText(valueXpath+"/@device"))){%>
											<option selected="selected" value="<%=devices.get(q) %>"><%=devices.get(q)%></option>
											<%}else { %>
											<option value="<%=devices.get(q) %>"><%=devices.get(q) %></option>
											<%}} %>
										</select>
									</div>
						  		<%}%>
						  	</td>
						</tr>
						<%}%>
						</tbody>
						</table>
				</fieldset>
				<%} %>
	 		</div>
		</div>
	</form>
	</div>

	<%if(isXmlDbLayoutDao){%>
	<form id="layoutUpload" method="post" action="./uploadLayoutXml" enctype="multipart/form-data" style="position: absolute;top:0;left:0;background: #E0E6EA;display: none;padding:10px;text-align: center;">
		<h3>SITE_ID = [<%=siteId%>]</h3>
		<p style="color: darkred;margin-bottom: 5px;">SITE_ID에 해당하는 모든 DEVICE,LAYOUT 삭제후 입력</p>
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