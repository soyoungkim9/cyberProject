package mvc.command;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import service.BoardNotFoundException;

public class ListReplyHandler implements CommandHandler {
	@Override
	public String process(HttpServletRequest req, HttpServletResponse res) 
			throws Exception {
		String cnoVal = req.getParameter("cno");
		String noVal = req.getParameter("no");
		String pageNoVal = req.getParameter("pageNo");
		
		try {
			res.sendRedirect("read.do?no=" + noVal + "&pageNo=" 
					+ pageNoVal + "&cno=" + cnoVal);
			return null;
		} catch (BoardNotFoundException e) {
			req.getServletContext().log("no board", e);
			res.sendError(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
	}
}
