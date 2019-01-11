package mvc.command;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mvc.model.Board;
import mvc.model.Comments;
import service.BoardNotFoundException;
import service.BoardService;
import service.CommentsService;

public class ReadBoardHandler implements CommandHandler {
	private BoardService boardService = new BoardService();
	private CommentsService commentsService = new CommentsService();
	private String noVal;
	String pageNoVal;
	
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
		pageNoVal = req.getParameter("pageNo");
		int boardNum = Integer.parseInt(noVal);
		
		try {
			Board board = boardService.getBoard(boardNum, true);
			List<Comments> comments = commentsService.getComments(boardNum);
			req.setAttribute("board", board);
			req.setAttribute("comments", comments);
			req.setAttribute("size", comments.size());
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
		int pageNo = Integer.parseInt(pageNoVal);
		Comments comments = new Comments();
		comments.setName(req.getParameter("name"));
		comments.setPwd(req.getParameter("pwd"));
		comments.setContent(req.getParameter("content"));
		comments.setBno(no);
		int newCommentsNo = commentsService.write(comments);
		req.setAttribute("newCommentsNo", newCommentsNo);
		res.sendRedirect("read.do?no=" + no + "&pageNo=" + pageNo);
		return null;
	}
}
