<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=8,chrome=1">
<title>coreFRAME BLD</title>
<!--[if lt IE 9]>
<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
${import_baseUI}
<script type="text/javascript">
	$(document).ready(function() {
		$('#tabs').tabs();
		$('#tabs2').tabs();
		
		$('#btnGenSql').click(function() {
			generate();
		});
		$('#btnGenBld').click(function() {
			genIOSchema();
		});
	});
	
	var isGenerate = false;
	var isGenIOSchema = false;
	
	var inNmArry;
	var inTypArry;

	var outNmArry;
	var outTypArry;
	
	NL='\n';
	if($.browser.msie) {
		NL='\r\n';
	}

	
		
	function generate() {
		inNmArry = new Array();
	    inTypArry = new Array();
	    inLblArry = new Array();

	    outNmArry = new Array();
	    outTypArry = new Array();
	    outLblArry = new Array();
	    
		var typ= $("#typQry > option:selected").val();
		$('#trname').attr('value',typ);
		var tblName='${dbms.name}';
		var sql=typ+' ';
		if(typ=='INSERT') {
			sql=sql+'INTO '+tblName+' (';
		}else if(typ=='UPDATE') {
			sql=sql+tblName+' SET ';
		}
		
		var colCnt=0;
		if(typ!='DELETE') {
		 $("input[name='col_chk1']:checked").each(function(i) {
			colCnt=i;
			colNm=$(this).attr('value');
			if(i>0) {
				sql=sql+', '+colNm;	
			}else {
				sql=sql+' '+colNm;	
			}
			if(typ=='UPDATE') {
				sql=sql+'=?';
				
				inNmArry[inNmArry.length]=$("input[name='"+colNm+"_field1']").attr('value');
				inTypArry[inTypArry.length]=$("#"+colNm+"_typ1").text();
				inLblArry[inLblArry.length]=$("input[name='"+colNm+"_label1']").attr('value');
			} else if( typ=='INSERT') {
				inNmArry[inNmArry.length]=$("input[name='"+colNm+"_field1']").attr('value');
				inTypArry[inTypArry.length]=$("#"+colNm+"_typ1").text();
				inLblArry[inLblArry.length]=$("input[name='"+colNm+"_label1']").attr('value');
				
			}else {
				outNmArry[outNmArry.length]=$("input[name='"+colNm+"_field1']").attr('value');
				outTypArry[outTypArry.length]=$("#"+colNm+"_typ1").text();
				outLblArry[outLblArry.length]=$("input[name='"+colNm+"_label1']").attr('value');
			}
			
			
		 });
		}
		if(typ=='SELECT' || typ=='DELETE') {
			sql=sql+' '+NL +'FROM '+tblName;
		}
		if(typ!='INSERT') {
		 $("input[name='col_chk2']:checked").each(function(i) {
			var colNm=$(this).attr('value'); 
			if(i>0) {
				sql=sql+' AND '+colNm+'=?';
			}else {
				sql=sql+' '+NL+'WHERE '+colNm+'=?';	
			}
			inNmArry[inNmArry.length]=$("input[name='"+colNm+"_field2']").attr('value');
			inTypArry[inTypArry.length]=$("#"+colNm+"_typ2").text();
			inLblArry[inLblArry.length]=$("input[name='"+colNm+"_label2']").attr('value');
			
			
		  });
		}else {
			sql=sql+') VALUES ( ';
			for(var p=0;p<colCnt;p++) {
				if(p==0) {
				 sql=sql+'?';
				}else {
					sql=sql+',?';
				}
			}
			sql=sql+')';
		}
		$('#sqlResult').text(sql);
		//alert(sql);
		isGenerate=true;
	}
		

	function genIOSchema()
	{
		
	  isGenIOSchema = true;

	  if(!isGenerate)
	    generate();

	  
	  var schemaTxt=

	  '<?xml version="1.0" encoding="EUC-KR"?>'+NL+NL
	  +'<transaction xmlns="http://www.cyber-i.com/xml/bld" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.cyber-i.com/xml/bld   http://www.cyber-i.com/xml/ns/bld-5.0.xsd">'+NL
	  +' <info>'+NL
	  +'  <name></name>'+NL
	  +'  <http-access>true</http-access>'+NL
	  +' </info>'+NL+NL
	  +' <processor-info type="dbms" datasource="${dbms.CONNECTION}">'+NL
	  +'  <transaction-type></transaction-type>'+NL

	  +'  <sql id="query1">'+NL
	  +'    <query><![CDATA['+NL
	  +$('#sqlResult').text()+NL
	  +']]></query>'+NL
	  +'    <mapping>'+NL
	  +'      <setProperty>';

	  for(var i=0;i<inNmArry.length;i++) {
	    if(i!=0)
	      schemaTxt=schemaTxt+', ';

	    schemaTxt=schemaTxt+inNmArry[i];

	  }

	  schemaTxt=schemaTxt
	  +'</setProperty>'+NL
	  +'      <getProperty>';

	  for(var i=0;i<outNmArry.length;i++) {
	    if(i!=0)
	      schemaTxt=schemaTxt+', ';

	    schemaTxt=schemaTxt+outNmArry[i];

	  }

	  schemaTxt=schemaTxt
	  +'</getProperty>'+NL
	  +'    </mapping>'+NL
	  +'  </sql>'+NL
	  +'</processor-info>'+NL+NL

	  +'<input>'+NL
	  +'  <block name="arg" repeat="1">'+NL
	  ;

	  for(var i=0;i<inNmArry.length;i++) {
	    schemaTxt=schemaTxt
	    +'    <field name="'+inNmArry[i]+'" type="'+ getSchemeType(inTypArry[i]) +'" label="'+inLblArry[i] +'"/>'+NL;
	  }

	  schemaTxt=schemaTxt
	  +'  </block>'+NL
	  +'</input>'+NL+NL

	  +'<output>'+NL
	  +'  <block name="result" repeat="">'+NL
	  ;

	  for(var i=0;i<outNmArry.length;i++) {
	    schemaTxt=schemaTxt
	    +'    <field name="'+ outNmArry[i] +'" type="'+ getSchemeType(outTypArry[i]) +'" label="'+outLblArry[i] +'"/>'+NL;
	  }
	  

	  schemaTxt=schemaTxt
	  +'  </block>'+NL
	  +'</output>'+NL+NL
	  +'</transaction>'
	  ;
	  
	  $('#bldResult').text(schemaTxt);


	

	}


	function getSchemeType(typ)
	{
	  if(typ=='LONG')
	    return 'long';

	  else if(typ=='INTEGER UNSIGNED')
	    return 'long';

	  else if(typ=='DECIMAL')
	    return 'int';


	  return 'string';

	}
		
</script>
</head>
<body>
 <div id="formDiv">
  <form id="mainFrm" action="" method="post">
   <div id="tabs">
    <ul>
     <li><a href="#tabs-1">Manupulation columns</a></li>
     <li><a href="#tabs-2">Condition columns</a></li>
    </ul>
    <div id="tabs-1" class="panel">
     <fieldset>
      <table>
       <caption>${dbms.name}</caption>
       <thead>
        <tr>
         <th></th>
         <th>name</th>
         <th>PK</th>
         <th>type</th>
         <th>scale</th>
         <th>is null</th>
         <th>mapping field name</th>
         <th>mapping label</th>
        </tr>
       </thead>
       <tbody>
        <c:forEach var="col" items="${columns}">
         <tr>
          <td><input type="checkbox" name="col_chk1" value="${col.name}" checked="checked"/></td>
          <td>${col.name}</td>
          <td>${col.dbPk}</td>
          <td id="${col.name}_typ1">${col.dbTypeNm}</td>
          <td>${col.dbSize}</td>
          <td>${col.dbIsNullable}</td>
          <td><input type="text" name="${col.name}_field1" value="${col.codeName}" />
          <td><input type="text" name="${col.name}_label1" value="${col.label}" />
          </td>
         </tr>
        </c:forEach>
       </tbody>
      </table>
     </fieldset>
    </div>
    <div id="tabs-2" class="panel">
     <fieldset>
      <table>
       <caption>${dbms.name}</caption>
       <thead>
        <tr>
         <th></th>
         <th>name</th>
         <th>PK</th>
         <th>type</th>
         <th>scale</th>
         <th>is null</th>
         <th>mapping field name</th>
         <th>mapping label</th>
        </tr>
       </thead>
       <tbody>
        <c:forEach var="col" items="${columns}">
         <tr>
          <td><input type="checkbox"  name="col_chk2" value="${col.name}" /></td>
          <td>${col.name}</td>
          <td>${col.dbPk}</td>
          <td id="${col.name}_typ2">${col.dbTypeNm}</td>
          <td>${col.dbSize}</td>
          <td>${col.dbIsNullable}</td>
          <td><input type="text" name="${col.name}_field2" value="${col.codeName}" />
          <td><input type="text" name="${col.name}_label2" value="${col.label}" />
          </td>
         </tr>
        </c:forEach>
       </tbody>
      </table>
     </fieldset>    
    </div>
   </div>

   <div id="tabs2">
    <ul>
     <li><a href="#tabs2-1">SQL</a></li>
     <li><a href="#tabs2-2">BLD</a></li>
    </ul>
    <div id="tabs2-1" class="panel">
     <fieldset>
      <select id="typQry">
       <option value="SELECT">SELECT</option>
       <option value="INSERT">INSERT</option>
       <option value="UPDATE">UPDATE</option>
       <option value="DELETE">DELETE</option>
      </select>
      <button type="button" id="btnGenSql">Generate</button>
      
      
      <textarea id="sqlResult" style="width:96%;height:190px;"></textarea>
     </fieldset>
    </div>
    
    <div id="tabs2-2" class="panel">
    <fieldset>
      <label>BLD name</label>
      <input type="text" name="trname" id="trname" value=""/>
      <button type="button" id="btnGenBld">Generate</button>
      <textarea id="bldResult" style="width:96%;height:190px"></textarea>
     </fieldset>
    </div>
    
    </div>
       
   
  </form>
 </div>
</body>
</html>