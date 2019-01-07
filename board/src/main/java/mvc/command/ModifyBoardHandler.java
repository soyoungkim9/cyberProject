package mvc.command;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mvc.model.Board;
import service.BoardNotFoundException;
import service.BoardService;

public class ModifyBoardHandler implements CommandHandler {
	private static final String FORM_VIEW ="/view/modify.jsp";
	private BoardService boardService = new BoardService();
	private String noVal;
	
	@Override
	public String process(HttpServletRequest req, HttpServletResponse res) 
			throws Exception {
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
		throws IOException {
		try {
			noVal = req.getParameter("no");
			int no = Integer.parseInt(noVal);
			
			Board modReq = boardService.getBoard(no, false);
			req.setAttribute("modReq", modReq);
			return FORM_VIEW;
		} catch (BoardNotFoundException e) {
				res.sendError(HttpServletResponse.SC_NOT_FOUND);
				return null;
		}
	}

	private String processSubmit(HttpServletRequest req, HttpServletResponse res)
			throws IOException {
		int no = Integer.parseInt(noVal);
		Board modReq = new Board();
		modReq.setBno(no);
		modReq.setTitle(req.getParameter("title"));
		modReq.setPwd(req.getParameter("pwd"));
		modReq.setContent(req.getParameter("content"));
		req.setAttribute("modReq", modReq);
		try {
			boardService.modify(modReq);
			return "list.do";
		} catch (BoardNotFoundException e) {
				res.sendError(HttpServletResponse.SC_NOT_FOUND);
				return null;
		}
	}
}
