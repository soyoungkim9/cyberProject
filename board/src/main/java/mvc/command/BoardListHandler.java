package mvc.command;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import service.BoardPage;
import service.BoardService;

// command패턴을 적용하여 적절한 view 페이지 보여주기
public class BoardListHandler implements CommandHandler {
	private BoardService boardService = new BoardService();
	
	@Override
	public String process(HttpServletRequest req, HttpServletResponse res) 
			throws Exception {
		String pageNoVal = req.getParameter("pageNo");
		int pageNo = 1;
		if (pageNoVal != null) {
			pageNo = Integer.parseInt(pageNoVal);
		}
		BoardPage boardPage = boardService.getBoardPage(pageNo);
		req.setAttribute("boardPage", boardPage);
		return "/view/list.jsp";
	}
}
