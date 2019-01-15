package mvc.command;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mvc.model.Reply;
import service.BoardNotFoundException;
import service.ReplyService;

public class ListReplyHandler implements CommandHandler {
	private ReplyService replyService = new ReplyService();
	
	@Override
	public String process(HttpServletRequest req, HttpServletResponse res) 
			throws Exception {
		String cnoVal = req.getParameter("cno");
		String noVal = req.getParameter("no");
		String pageNoVal = req.getParameter("pageNo");
		
		try {
			//List<Reply> reply = replyService.getReply(cnoNum);
			//req.setAttribute("reply", reply);
			//req.setAttribute("rSize", reply.size());
			//return "/view/view.jsp";
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
