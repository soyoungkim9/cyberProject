package mvc.command;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mvc.model.Reply;
import service.ReplyService;

public class WriteReplyHandler implements CommandHandler {
	private static final String FORM_VIEW ="/view/view.jsp";
	private ReplyService replyService = new ReplyService();
	
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
		return FORM_VIEW;
	}

	private String processSubmit(HttpServletRequest req, HttpServletResponse res) 
			throws Exception {
		String noVal = req.getParameter("no");
		String pageNoVal = req.getParameter("pageNo");
		String cnoVal = req.getParameter("cno");
		int no = Integer.parseInt(noVal);
		int pageNo = Integer.parseInt(pageNoVal);
		int cno = Integer.parseInt(cnoVal);
		
		Reply reply = new Reply();
		reply.setName(req.getParameter("name"));
		reply.setPwd(req.getParameter("pwd"));
		reply.setContent(req.getParameter("content"));
		reply.setCno(cno);
		int newReplyNo = replyService.write(reply);
		req.setAttribute("newReplyNo", newReplyNo);
		//res.sendRedirect("read.do?no=" + no + "&pageNo=" + pageNo + "&cno=" + cno);
		return null;
	}
}
