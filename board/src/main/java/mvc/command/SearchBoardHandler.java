package mvc.command;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import service.BoardPage;
import service.BoardService;

// command패턴을 적용하여 적절한 view 페이지 보여주기
public class SearchBoardHandler implements CommandHandler {
	private BoardService boardService = new BoardService();
	
	@Override
	public String process(HttpServletRequest req, HttpServletResponse res) 
			throws Exception {
		String pageNoVal = req.getParameter("pageNo");
		String search = req.getParameter("search");
		int pageNo = 1;
		if (pageNoVal != null) {
			pageNo = Integer.parseInt(pageNoVal);
		}
		BoardPage searchPage = boardService.getBoardPage(pageNo);
		if (search != null) {
			searchPage = boardService.selectBySearch(pageNo, search);
		}
		req.setAttribute("searchPage", searchPage);
		req.setAttribute("searchTitle", search);
		return "/view/search.jsp";
	}
}