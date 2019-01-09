package mvc.command;

import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;

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
		// 웹 어플리케이션의절대경로 구하기
		ServletContext context = req.getSession().getServletContext();
		String path = context.getRealPath("upload");
		String encType = "UTF-8";
		int sizeLimit = 20 * 1024 * 1024;
		
		MultipartRequest multi = new MultipartRequest(req, path, sizeLimit,
				encType, new DefaultFileRenamePolicy());
		
		// 멀티파트형식의 데이터를 가져온다.
		String title = multi.getParameter("title");
		String content = multi.getParameter("content");
		String pwd = multi.getParameter("pwd");
		String fileURL = multi.getFilesystemName("uploadFile"); // == input name
		if(fileURL == null) {
			fileURL = multi.getParameter("maintainFile");
		}
		Board modReq = new Board();
		modReq.setBno(no);
		modReq.setTitle(title);
		modReq.setPwd(pwd);
		modReq.setContent(content);
		modReq.setFileURL(fileURL);
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
