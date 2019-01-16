package mvc.command;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import service.BoardNotFoundException;
import service.ReplyService;

public class DeleteReplyHandler implements CommandHandler {
	private ReplyService replyService = new ReplyService();
	
	@Override
	public String process(HttpServletRequest req, HttpServletResponse res)
			throws Exception {
		try {
			String rnoVal = req.getParameter("rno");
			int rno = Integer.parseInt(rnoVal);
				replyService.delete(rno);
			return null;
		} catch (BoardNotFoundException e) {
			req.getServletContext().log("no board", e);
			res.sendError(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
	}
}
