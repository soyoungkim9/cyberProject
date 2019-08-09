package controller;

import dto.FileDto;
import service.FileService;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.*;
import java.util.Collection;
import java.util.Iterator;

import static file.FileIO.createDate;
import static file.FileIO.handleKoFileName;
import static file.FileIO.writeFile;
import static java.lang.System.out;

@WebServlet({"/fileUpload", "/fileDownload"})
@MultipartConfig
public class WriteFileHandler extends HttpServlet {
  private String path = "C:\\Users\\CI\\Desktop\\workspace\\git\\cyberProject\\fileUpload\\src\\main\\webapp\\upload\\";
  String fileName = null;
  private FileService fileService = new FileService();
  
  // 단일 파일 다운로드
  protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
    fileName = req.getParameter("fname");
    File file = new File(path + fileName);
    System.out.println("################ mime" + req.getContentType());
    if(file.isFile()) {
      fileName = handleKoFileName(req, res, fileName);
      // 흠.... 파일확장자처리 어케할지.. getMimeType
      res.setContentLength((int)file.length());
      res.setHeader("Content-Transfer-Encoding", "binary;");
      res.setHeader("paragma", "no-cache;");
      res.setHeader("Expires", "-1");
  
      writeFile(new FileInputStream(file), res.getOutputStream(), (int)file.length());
      
    }
  }
  
  // 다중 파일 업로드
  protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
    req.setCharacterEncoding("UTF-8");
    
    Collection<Part> parts = req.getParts();
    Iterator<Part> iter = parts.iterator();
    Part part = null;
    while(iter.hasNext()) { /* 아무래도 여러개의 파일을 업로드 하다보니 이 부분에서 쓰레드를 적용해 볼 수 있을꺼 같음..*/
      part = iter.next();
      fileName = part.getSubmittedFileName();
  
      if(fileName != null && !fileName.isEmpty()) {
        // 파일이름 중복되는지 체크
        if(new File(path + fileName).exists()) {
          String[] temp = fileName.split("\\.");
          fileName = temp[0] + "-" + createDate() + "." + temp[1];
        }
    
        FileDto fileDto = new FileDto();
        fileDto.setName(fileName);
        fileService.wirte(fileDto);
    
        // part.write(fileName); 사실 이거 하나면 파일업로드 바로 됨
        writeFile(part.getInputStream(), new FileOutputStream(path + fileName), (int)part.getSize());
        req.setAttribute("new", 0);
      } else {
        continue;
      }
    }
    
    res.sendRedirect("/list");
  }
}
