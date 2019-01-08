package mvc.command;

import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;

import mvc.model.Board;
import service.BoardService;

// command패턴을 적용하여 적절한 view 페이지 보여주기
public class WriteBoardHandler implements CommandHandler {
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


	private String processSubmit(HttpServletRequest req, HttpServletResponse res)
		throws IOException {
		// 웹 어플리케이션의절대경로 구하기
		ServletContext context = req.getSession().getServletContext();
		String path = context.getRealPath("upload");
		String encType = "UTF-8";
		int sizeLimit = 20 * 1024 * 1024;
		
		MultipartRequest multi = new MultipartRequest(req, path, sizeLimit,
				encType, new DefaultFileRenamePolicy());
		
		// 멀티파트형식의 데이터를 가져온다.
		String name = multi.getParameter("name");
		String title = multi.getParameter("title");
		String content = multi.getParameter("content");
		String pwd = multi.getParameter("pwd");
		String fileURL = multi.getFilesystemName("uploadFile"); // == input name
		
		Board board = new Board();
		board.setName(name);
		board.setTitle(title);
		board.setContent(content);
		board.setPwd(pwd);
		board.setFileURL(fileURL);
		int newBoardNo = boardService.write(board);
		req.setAttribute("newBoardNo", newBoardNo);
		
		return "list.do";
	}
}
