package mvc.command;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mvc.model.Board;
import service.BoardNotFoundException;
import service.BoardService;

public class ReadBoardHandler implements CommandHandler {
	private BoardService boardService = new BoardService();
	
	@Override
	public String process(HttpServletRequest req, HttpServletResponse res)
			throws Exception {
		String noVal = req.getParameter("no");
		int boardNum = Integer.parseInt(noVal);
		try {
			Board board = boardService.getBoard(boardNum, true);
			req.setAttribute("board", board);
			return "/view/view.jsp";
		} catch (BoardNotFoundException e) {
			req.getServletContext().log("no board", e);
			res.sendError(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
	}
}
