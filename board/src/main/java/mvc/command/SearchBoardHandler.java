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
		String searchList = req.getParameter("searchList");
		int pageNo = 1;
		if (pageNoVal != null) {
			pageNo = Integer.parseInt(pageNoVal);
		}
		BoardPage searchPage = boardService.getBoardPage(pageNo);
		if (search != null) {
			if(searchList.equals("all")) {
				searchPage = boardService.selectByAll(pageNo, search);
			} else if(searchList.equals("title")) {
				searchPage = boardService.selectByTitle(pageNo, search);
			} else if(searchList.equals("name")) {
				searchPage = boardService.selectByName(pageNo, search);
			}
		}
		req.setAttribute("searchPage", searchPage);
		req.setAttribute("searchTitle", search);
		req.setAttribute("searchList", searchList);
		return "/view/search.jsp";
	}
}