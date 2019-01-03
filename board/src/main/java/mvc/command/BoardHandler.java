package mvc.command;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mvc.model.Board;
import service.BoardService;

// command패턴을 적용하여 적절한 view 페이지 보여주기
public class BoardHandler implements CommandHandler {
	private static final String FORM_VIEW ="/view/form.jsp";
	private BoardService boardService = new BoardService();
	
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

	private String processForm(HttpServletRequest req, HttpServletResponse res) {
		return FORM_VIEW;
	}


	private String processSubmit(HttpServletRequest req, HttpServletResponse res) {
		Board board = new Board();
		board.setName(req.getParameter("name"));
		board.setTitle(req.getParameter("title"));
		board.setContent(req.getParameter("content"));
		board.setPwd(req.getParameter("pwd"));
		int newBoardNo = boardService.write(board);
		req.setAttribute("newBoardNo", newBoardNo);
		
		return "view/list.jsp";
	}
}
