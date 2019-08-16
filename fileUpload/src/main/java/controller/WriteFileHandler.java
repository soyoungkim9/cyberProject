package controller;

import file.FileIO;
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

@WebServlet({"/fileUpload", "/fileDownload"})
@MultipartConfig
public class WriteFileHandler extends HttpServlet {
  public static long startTime = 0;
  private FileService fileService = new FileService();
  FileIO f = new FileIO();

  // 단일 파일 다운로드
  protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
    f.setFileName(req.getParameter("fname"));
    File file = new File(f.getPath() + f.getFileName());
    System.out.println("################ mime" + req.getContentType());
    if(file.isFile()) {
      f.setFileName(f.handleKoFileName(req, res, f.getFileName()));
      // 흠.... 파일확장자처리 어케할지.. getMimeType
      res.setContentLength((int)file.length());
      res.setHeader("Content-Transfer-Encoding", "binary;");
      res.setHeader("paragma", "no-cache;");
      res.setHeader("Expires", "-1");

      f.writeFile(new FileInputStream(file), res.getOutputStream(), (int)file.length());
    }
  }

  // 다중 파일 업로드
  protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
    // 1. 그냥 단순 멀티스레드 처리를 해본다.
    // 2. 용량이 작은순서대로 큐에담고 꺼낸다.


    // 스레드가 진행될 때,
    // 파일사이즈가 가장 작은아이를 발견하면 (모든파일 중 최소값만 변수에 넣음)
    // 개 부터 진행해서 빨리다운로드 될 수 있게 한다.

    // 음.. 아니면.. 두개이상이 동시에 다운로드가 진행될 수 있도록 해야하는데..
    // join을 쓰게되면 순서대로 처리함.. 흠 ㅠㅠㅠㅠㅠ

    // 음.. 파일개수를 공용변수에 저장해두고
    // 파일이 2개 이상이면 적절한 제어문을 사용해 일처리가 빠르게 진행될 수 있도록 한다.

    // 근데 이게 또 2개 상태에서만 가능해서 ㅠㅠㅠ

    req.setCharacterEncoding("UTF-8");

    Collection<Part> parts = req.getParts();
    Iterator<Part> iter = parts.iterator();

    System.out.println("######## 개수?" + parts.size());
    System.out.println("######## CPU Core 개수 체크 : " + Runtime.getRuntime().availableProcessors());
    Runnable r = new fileUploadThread(f, fileService);
    Thread[] t = new Thread[parts.size()];

    int i = 0;
    startTime = System.currentTimeMillis(); /* 시작시간 */
    while(iter.hasNext()) {
      f.setPart(iter.next());
      f.setFileName(f.getPart().getSubmittedFileName());
      if(f.getFileName() != null && !f.getFileName().isEmpty()) {
        t[i] = new Thread(r , f.getFileName());
        t[i].start(); // 스레드는 실행순서를 유지하지 않기 때문에 while문 써도 뒤죽박죽으로 만들어짐
        try {
          t[i].join(); // 그래서 join으로 스레드를 순서대로 실행할 수 있도록 제어한다. 음.. 이거없이도 순서대로 유지되어야 하는뎁 흠..
        } catch(InterruptedException e) {}
        i++;
      } else {
        continue;
      }
    }
    // 결과 확인하기.. 동기화 처리 잘 됐는지 개선 : 대기하는 동안 다른 일 처리하도록 하기!
    /*
    t[0].start();
    t[1].start();
    try {
      t[0].join();
      t[1].join();
    } catch(InterruptedException e) {}
    */
    res.sendRedirect("/list");
  }
}

// 1. 싱글스레드 테스트 - 하나의 스레드로 모든 작업처리 - DOPOST쪽 싱글스레드 바뀐거 안고쳤음 ㅠㅠ 나머지도 고치기
/*
public class WriteFileHandler extends HttpServlet {
  private static long startTime = 0;
  private FileService fileService = new FileService();
  FileIO f = new FileIO();
  
  protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
    f.setFileName(req.getParameter("fname"));
    File file = new File(f.getPath() + f.getFileName());
    System.out.println("################ mime" + req.getContentType());
    if(file.isFile()) {
      f.setFileName(f.handleKoFileName(req, res, f.getFileName()));
      // 흠.... 파일확장자처리 어케할지.. getMimeType
      res.setContentLength((int)file.length());
      res.setHeader("Content-Transfer-Encoding", "binary;");
      res.setHeader("paragma", "no-cache;");
      res.setHeader("Expires", "-1");
  
      f.writeFile(new FileInputStream(file), res.getOutputStream(), (int)file.length());
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