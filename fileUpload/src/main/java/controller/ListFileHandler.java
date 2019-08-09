package controller;

import dto.FileDto;
import service.FileService;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet({"", "/list"})
public class ListFileHandler extends HttpServlet {
  private FileService fileService = new FileService();
  
  protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
    List<FileDto> fileList = fileService.list();
    req.setAttribute("file", fileList);
    req.setAttribute("count", fileList.size());
  
    RequestDispatcher dispatcher = req.getRequestDispatcher("index.jsp");
    dispatcher.forward(req, res);
  }
}
