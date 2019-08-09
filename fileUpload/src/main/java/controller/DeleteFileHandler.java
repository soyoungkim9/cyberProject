package controller;

import service.FileService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;

@WebServlet("/delete")
public class DeleteFileHandler extends HttpServlet {
  private String path = "C:\\Users\\CI\\Desktop\\workspace\\git\\cyberProject\\fileUpload\\src\\main\\webapp\\upload\\";
  private FileService fileService = new FileService();
  
  protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
    int fno = Integer.parseInt(req.getParameter("fno"));
    String fileName = req.getParameter("fname");
    
    File file = new File(path + fileName);
    if(file.exists()) {
      fileService.delete(fno);
      file.delete();
    }
    
    res.sendRedirect("/list");
  }
}
