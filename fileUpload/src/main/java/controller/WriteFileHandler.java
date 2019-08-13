package controller;

import file.fileUploadThread;
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
import static file.FileIO.*;

@WebServlet({"/fileUpload", "/fileDownload"})
@MultipartConfig
public class WriteFileHandler extends HttpServlet {
  public static long startTime = 0;
  private static FileService fileService = new FileService();
  
  public static FileService getFileService() {
    return fileService;
  }

  // 단일 파일 다운로드
  protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
    setFileName(req.getParameter("fname"));
    File file = new File(getPath() + getFileName());
    System.out.println("################ mime" + req.getContentType());
    if(file.isFile()) {
      setFileName(handleKoFileName(req, res, getFileName()));
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
    // 1. 그냥 단순 멀티스레드 처리를 해본다.
    // 2. 용량이 작은순서대로 큐에담고 꺼낸다.
    req.setCharacterEncoding("UTF-8");

    Collection<Part> parts = req.getParts();
    Iterator<Part> iter = parts.iterator();

    System.out.println("######## 개수?" + parts.size());
    System.out.println("######## CPU Core 개수 체크 : " + Runtime.getRuntime().availableProcessors());
    Runnable r = new fileUploadThread();
    Thread[] t = new Thread[parts.size()];
    int i = 0;
    startTime = System.currentTimeMillis(); /* 시작시간 */
    while(iter.hasNext()) {
      setPart(iter.next());
      setFileName(getPart().getSubmittedFileName());
      if(getFileName() != null && !getFileName().isEmpty()) {
        t[i] = new Thread(r , getFileName());
        
        //t[0].setPriority(3);
        //System.out.println(getFileName() + "의 우선순위" + t[i].getPriority());
        // 쓰레드가 아닌것만 같은 느낌적인 느낌 ㅠㅠ
        t[i].start();
        try {
          t[i].join();
        } catch(InterruptedException e) {}
        i++;
        req.setAttribute("new", 0);
      } else {
        continue;
      }
    }
    /* ㅠㅠ 원하는 결과가 안나옴.. 왜지..?
    System.out.println(t[0].getName());
    System.out.println(t[1].getName());
    t[0].start();
    t[1].start();
    try {
      t[0].join();
      t[1].join();
    } catch(InterruptedException e) {}
    */
    System.out.println("######## main 소요시간 : " + (System.currentTimeMillis() - startTime)); /* 종료시간 */
    res.sendRedirect("/list");
  }
}

// 1. 싱글스레드 테스트 - 하나의 스레드로 모든 작업처리
/*
public class WriteFileHandler extends HttpServlet {
  private String path = "C:\\Users\\CI\\Desktop\\workspace\\git\\cyberProject\\fileUpload\\src\\main\\webapp\\upload\\";
  private String fileName = null;
  private FileService fileService = new FileService();
  private static long startTime = 0;
  
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
  
  protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
    req.setCharacterEncoding("UTF-8");
    
    Collection<Part> parts = req.getParts();
    Iterator<Part> iter = parts.iterator();
    
    System.out.println("######## 개수?" + parts.size());
    startTime = System.currentTimeMillis();
    Part part = null;
    while(iter.hasNext()) {
      part = iter.next();
      fileName = part.getSubmittedFileName();
      if(fileName != null && !fileName.isEmpty()) {
        if(new File(path + fileName).exists()) {
          String[] temp = fileName.split("\\.");
          fileName = temp[0] + "-" + createDate() + "." + temp[1];
        }
        
        FileDto fileDto = new FileDto();
        fileDto.setName(fileName);
        fileService.wirte(fileDto);
  
        writeFile(part.getInputStream(), new FileOutputStream(path + fileName), (int)part.getSize());
        
        req.setAttribute("new", 0);
      } else {
        continue;
      }
    }
    
    System.out.println("######## 소요시간 : " + (System.currentTimeMillis() - startTime));
    res.sendRedirect("/list");
  }
}
*/
// 2. 멀티스레드 테스트 - 특정조건없이 그냥 멀티스레드 -> 여러스레드로 여러작업을 분리하여 처리..

// 3. 멀티스레드 테스트 - 가벼운파일부터 처리 될 수 있게 하는 테스트