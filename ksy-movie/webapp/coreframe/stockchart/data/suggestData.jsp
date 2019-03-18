<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<jsp:directive.page import="java.util.*" />
<jsp:directive.page import="coreframe.data.*"/>

<%

	String bld5 = request.getParameter("bld5");

	if("undefined".equals(bld5) || "".equals(bld5) || bld5 == null) {
			
		out.println("bld경로 없음");
		
	} else {
		InteractionBean interact = new InteractionBean();

		DataSet input = new DataSet();
		DataSet output = new DataSet();	
		
		interact.execute(bld5, input, output);
		
		Vector suggestList = new Vector();
		
		String code_num = "";
		String code_name = "";
		for(int i=0; i < output.getCount("code_num"); i++) {
			code_num = output.getText("code_num",i);
			code_name = output.getText("code_name",i);
			suggestList.addElement(code_num+"|"+code_name);		
		}

		out.clear();
		
		for(int i=0; i<suggestList.size(); i++){
			out.print(suggestList.get(i));		
			if(i != suggestList.size()-1){
				out.println();
			}
		}		
	}

%>