package mvc.command;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mvc.model.Board;
import service.BoardNotFoundException;
import service.BoardService;

public class DeleteBoardHandler implements CommandHandler {
	private BoardService boardService = new BoardService();
	
	@Override
	public String process(HttpServletRequest req, HttpServletResponse res)
			throws Exception {
		try {
			String noVal = req.getParameter("no");
			String pageNoVal = req.getParameter("pageNo");
			String pwd = req.getParameter("pwd");
			int no = Integer.parseInt(noVal);
			int pageNo = Integer.parseInt(pageNoVal);
			if(pwd == null) {
				Board board = boardService.getBoard(no, false);
				boardService.delete(no);
				req.setAttribute("board", board);
				return "list.do?pageNo=" + pageNo;
			} else {
				return "read.do?no=" + no + "&pageNo=" + pageNo;
			}
		} catch (BoardNotFoundException e) {
			req.getServletContext().log("no board", e);
			res.sendError(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
	}
}
