package controller;

import file.FileIO;
import service.FileService;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;

public class DeleteFileHandler extends HttpServlet {
  private FileService fileService = new FileService();
  private FileIO f = new FileIO();
  
  protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
    int fno = Integer.parseInt(req.getParameter("fno"));
    f.setFile(req.getParameter("fname"));
    
    File file = new File(new FileIO().getPath() + f.getDir() + f.getFileName());
    if(file.exists()) {
      fileService.delete(fno);
      file.delete();
    }
    
    res.sendRedirect("/list");
  }
}
