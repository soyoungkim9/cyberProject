<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<jsp:directive.page import="java.util.*" />
<jsp:directive.page import="webponent.stockchart.*" />
<jsp:directive.page import="coreframe.http.*"/>
<jsp:directive.page import="coreframe.data.*"/>

<%	

		String bld1 = request.getParameter("bld1");
		String bld2 = request.getParameter("bld2");

		if("undefined".equals(bld1) || "".equals(bld1) || bld1 == null 
				|| "undefined".equals(bld2) || "".equals(bld2) || bld2 == null) {
				
			out.println("bld경로 없음");
			
		} else {
			
			InteractionBean interact = new InteractionBean();
			HttpAttributes attr = HttpAttributes.getInstance(request);
			
			DataSet input = attr.getDataSet();
			DataSet outputList = new DataSet();	
			DataSet outputMap = new DataSet();
					
			interact.execute(bld1, input, outputList);
			interact.execute(bld2, input, outputMap);
					
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
					
					data.createData(ChartData.CANDLE_COLUMN, outputList, outputMap, response.getOutputStream());
				} catch(Exception e) {
					e.printStackTrace();
				}	
			} else {
				out.println("데이터가 존재하지 않습니다");
			}
			
		}
	
%>


