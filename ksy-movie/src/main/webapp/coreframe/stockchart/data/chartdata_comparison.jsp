<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<jsp:directive.page import="java.util.*" />
<jsp:directive.page import="webponent.stockchart.*" />
<jsp:directive.page import="coreframe.http.*"/>
<jsp:directive.page import="coreframe.data.*"/>

<%	
	String bld3 = request.getParameter("bld3");
	String bld4 = request.getParameter("bld4");
	
	if("undefined".equals(bld3) || "".equals(bld3) || bld3 == null 
			|| "undefined".equals(bld4) || "".equals(bld4) || bld4 == null) {
			
		out.println("bld경로 없음");
		
	} else {
		InteractionBean interact = new InteractionBean();
		HttpAttributes attr = HttpAttributes.getInstance(request);
		
		DataSet input = attr.getDataSet();
		DataSet outputList = new DataSet();	
		DataSet outputMap = new DataSet();
		String str = "";
		if(input.getText("code").indexOf(",") != -1) {
			String[] arr = input.getText("code").split(",");			
			
			for(int i=0; i < arr.length; i++) {
				if("".equals(str)) {
					str = "'"+arr[i]+"'";
				} else {
					str += ",'"+arr[i]+"'";
				}
			}			
		} else {
			str = "'"+input.getText("code")+"'";
		}
		input.put("code",str);
		interact.execute(bld3, input, outputList);
		interact.execute(bld4, input, outputMap);								
				
		//System.out.println("outputList===="+outputList);
		//System.out.println("outputMap===="+outputMap);
		
		/**
		 * getInstance 메소드 정의 방법 : getInstance(데이터생성타입)
		 * 데이터생성타입 : ChartData.TXT_TYPE(TXT 타입)
		 **/
		ChartData data = ChartDataFactory.getInstance(ChartData.TXT_TYPE);
		 
		//JSP 페이지에서 사용시 아래의 방법으로 사용하여야 한다.	
		
		if(outputList != null || outputMap != null) {			
			try {
				out.clear();	//out : jsp 자체객체
				out = pageContext.pushBody();		
								
				data.createData(ChartData.LINE_MULTIPLE, outputList, outputMap, response.getOutputStream());
			} catch(Exception e) {
				e.printStackTrace();
			}	
		} else {
			out.println("데이터가 존재하지 않습니다");
		}		
	}

		
	
%>


