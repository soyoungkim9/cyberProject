package mvc.command;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mvc.model.Reply;
import service.BoardNotFoundException;
import service.ReplyService;

public class ModifyReplyHandler implements CommandHandler {
	private ReplyService replyService = new ReplyService();
	
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
		return "/view/view.jsp";
	}

	private String processSubmit(HttpServletRequest req, HttpServletResponse res)
			throws IOException {
		String rnoVal = req.getParameter("rno");
		String pwd = req.getParameter("pwd");
		String content = req.getParameter("content");
		int rno = Integer.parseInt(rnoVal);
		
		Reply reply = new Reply();
		reply.setRno(rno);
		reply.setPwd(pwd);
		reply.setContent(content);
		try {
			replyService.modify(reply);
			return null;
		} catch(BoardNotFoundException e) {
			res.sendError(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
	} 
}
