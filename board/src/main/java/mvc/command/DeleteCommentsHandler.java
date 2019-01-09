package mvc.command;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mvc.model.Comments;
import service.BoardNotFoundException;
import service.CommentsService;

public class DeleteCommentsHandler implements CommandHandler {
	private CommentsService commentsService = new CommentsService();
	
	@Override
	public String process(HttpServletRequest req, HttpServletResponse res)
			throws Exception {
		try {
			String noVal = req.getParameter("cno");
			int no = Integer.parseInt(noVal);
			
			Comments deleteComments = commentsService.getComments(no);
			commentsService.delete(no);
			System.out.println(deleteComments.getCno());
			return "list.do"; // 얘도 현재 페이지로 돌려놓기
		} catch (BoardNotFoundException e) {
			req.getServletContext().log("no board", e);
			res.sendError(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
	}
}
