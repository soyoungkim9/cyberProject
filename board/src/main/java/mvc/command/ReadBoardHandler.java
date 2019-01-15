package mvc.command;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mvc.model.Board;
import mvc.model.Comments;
import mvc.model.Reply;
import service.BoardNotFoundException;
import service.BoardService;
import service.CommentsService;
import service.ReplyService;

public class ReadBoardHandler implements CommandHandler {
	private BoardService boardService = new BoardService();
	private CommentsService commentsService = new CommentsService();
	private ReplyService replyService = new ReplyService();
	private String noVal;
	String pageNoVal;
	
	// 핸들러 처리를 바꿔줬기 때문에 여기서 답변 list를 출력해 주어야함
	// 만약에 url에 cno가 있으면
	// req.setAttribute("reply", reply);를 적용한다.
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
		int no = Integer.parseInt(noVal);
		int pageNo = Integer.parseInt(pageNoVal);
		int boardNum = Integer.parseInt(noVal);
		
		try {
			Board board = boardService.getBoard(boardNum, true);
			List<Comments> comments = commentsService.getComments(boardNum);
			req.setAttribute("board", board);
			req.setAttribute("comments", comments);
			req.setAttribute("size", comments.size());
			req.setAttribute("no", no);
			req.setAttribute("pageNo", pageNo);
			
			if(req.getParameter("cno") != null) {
				int cnoNum = Integer.parseInt(req.getParameter("cno"));
				List<Reply> reply = replyService.getReply(cnoNum);
				req.setAttribute("reply", reply);
				req.setAttribute("cno", cnoNum);
				req.setAttribute("rSize", reply.size());
			}
			
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
