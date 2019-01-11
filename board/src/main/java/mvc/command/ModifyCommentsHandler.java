package mvc.command;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mvc.model.Comments;
import service.BoardNotFoundException;
import service.CommentsService;

public class ModifyCommentsHandler implements CommandHandler {
	private CommentsService commentsService = new CommentsService();
	@Override
	public String process(HttpServletRequest req, HttpServletResponse res)
			throws Exception {
		if(req.getMethod().equalsIgnoreCase("GET")) {
			return processForm(req, res);
		} else if(req.getMethod().equalsIgnoreCase("POST")) {
			return processSubmit(req, res);
		} else {
			res.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
			return null;
		}
	}

	private String processForm(HttpServletRequest req, HttpServletResponse res)
			throws IOException {
		return "/view/list.jsp";
	}

	private String processSubmit(HttpServletRequest req, HttpServletResponse res)
			throws IOException {
		String bnoVal = req.getParameter("bno");
		String pageNoVal = req.getParameter("pageNo");
		String[] cnoVal = req.getParameterValues("cno");
		String[] pwd = req.getParameterValues("pwd");
		String[] comment = req.getParameterValues("comment");
		int bno = Integer.parseInt(bnoVal);
		int pageNo = Integer.parseInt(pageNoVal);
		
		int[] cno = new int[cnoVal.length];
		List<Comments> commentsList = new ArrayList<>();
		for(int i = 0; i < cnoVal.length; i++) {
			cno[i] = Integer.parseInt(cnoVal[i]);
		
			Comments comments = new Comments();
			comments.setCno(cno[i]);
			comments.setPwd(pwd[i]);
			comments.setContent(comment[i]);
			commentsList.add(comments);
		}
		
		try {
			for(int i = 0; i < commentsList.size(); i++) {
				commentsService.modify(commentsList.get(i));
			}
			res.sendRedirect("read.do?no=" + bno + "&pageNo=" + pageNo);
			return null;
		} catch (BoardNotFoundException e) {
				res.sendError(HttpServletResponse.SC_NOT_FOUND);
				return null;
			}
		} 
	
	/*
	 		int no = Integer.parseInt(noVal);
		int pageNo = Integer.parseInt(pageNoVal);
		int cno = Integer.parseInt(cnoVal);
		
		Comments comments = new Comments();
		comments.setCno(cno);
		comments.setPwd(req.getParameter("pwd"));
		comments.setContent(req.getParameter("content"));
		req.setAttribute("modReq", comments);
		try {
			commentsService.modify(comments);
//			res.setHeader("Refresh", "0; URL=" + req.getContextPath() 
//				+ "/read.do?no=" + no + "&pageNo=" + pageNo); 
	 */
}
