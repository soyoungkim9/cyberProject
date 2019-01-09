package mvc.command;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mvc.model.Board;
import mvc.model.Comments;
import service.BoardNotFoundException;
import service.BoardService;
import service.CommentsPage;
import service.CommentsService;

public class ReadBoardHandler implements CommandHandler {
	private BoardService boardService = new BoardService();
	private CommentsService commentsService = new CommentsService();
	private String noVal;
	
	@Override
	public String process(HttpServletRequest req, HttpServletResponse res) throws Exception {
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
			throws Exception {
		noVal = req.getParameter("no");
		int boardNum = Integer.parseInt(noVal);
		
		String pageNoComment = req.getParameter("pageComment");
		int pageComment = 1;
		if (pageNoComment != null) {
			pageComment = Integer.parseInt(pageNoComment);
		}
		try {
			Board board = boardService.getBoard(boardNum, true);
			CommentsPage commentsPage = commentsService.getCommentsPage(pageComment, boardNum);
			req.setAttribute("board", board);
			req.setAttribute("commentsPage", commentsPage);
			return "/view/view.jsp";
		} catch (BoardNotFoundException e) {
			req.getServletContext().log("no board", e);
			res.sendError(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
	}

	private String processSubmit(HttpServletRequest req, HttpServletResponse res)
			throws Exception {
		int no = Integer.parseInt(noVal);
		Comments comments = new Comments();
		comments.setName(req.getParameter("name"));
		comments.setPwd(req.getParameter("pwd"));
		comments.setContent(req.getParameter("content"));
		comments.setBno(no);
		int newCommentsNo = commentsService.write(comments);
		req.setAttribute("newCommentsNo", newCommentsNo);
		
		return "list.do"; // 이거 원래의 view 페이지로 돌아가게!
	}
}
