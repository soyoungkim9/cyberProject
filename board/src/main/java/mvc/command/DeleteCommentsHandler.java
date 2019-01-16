package mvc.command;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import service.BoardNotFoundException;
import service.CommentsService;

public class DeleteCommentsHandler implements CommandHandler {
	private CommentsService commentsService = new CommentsService();
	
	@Override
	public String process(HttpServletRequest req, HttpServletResponse res)
			throws Exception {
		try {
			String cnoVal = req.getParameter("cno");
			String noVal = req.getParameter("no");
			String pageNoVal = req.getParameter("pageNo");
			String pwd = req.getParameter("pwd");
			int cno = Integer.parseInt(cnoVal); 
			int no = Integer.parseInt(noVal);
			int pageNo = Integer.parseInt(pageNoVal);
			if(pwd == null) {
				commentsService.delete(cno);
			}
			return "read.do?no=" + no +"&pageNo=" + pageNo;
		} catch (BoardNotFoundException e) {
			req.getServletContext().log("no board", e);
			res.sendError(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
	}
}
