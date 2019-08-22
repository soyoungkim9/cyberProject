package controller;

import dto.FileDto;
import file.FileIO;
import file.fileUploadThread;
import service.FileService;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.*;
import java.util.Collection;
import java.util.Iterator;

public class WriteFileHandler extends HttpServlet {
  private static long startTime = 0;
  private FileIO f = null;
  private int threadIndex = 0;
  
  // 단일 파일 다운로드
  protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
    f = new FileIO();
    f.setFile(req.getParameter("fname"));
    
    File file = new File(f.getPath() + f.getDir() + f.getFileName());
    if(file.isFile()) {
      f.handleKoFileName(req, res, f.getFileName());
      res.setContentLength((int)file.length());
      res.setHeader("Content-Transfer-Encoding", "binary;");
      res.setHeader("paragma", "no-cache;");
      res.setHeader("Expires", "-1");

      f.writeFile(new FileInputStream(file), res.getOutputStream(), (int)file.length());
    }
  }

  // 다중 파일 업로드 - 멀티스레드, 1302, 1281, 1389
  protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
    Collection<Part> parts = req.getParts();
    Iterator<Part> iter = parts.iterator();

    System.out.println("######## 개수?" + parts.size());
    System.out.println("######## CPU Core 개수 체크 : " + Runtime.getRuntime().availableProcessors());

    Thread[] th = new Thread[parts.size()]; // ThreadGroup
    ThreadGroup fileG = new ThreadGroup("fileG"); // ThreadGroup
    startTime = System.currentTimeMillis(); /* 시작시간 */
    threadIndex = 0;
    while(iter.hasNext()) {
      f = new FileIO();
      f.setPart(iter.next());
      if(f.getFileName() != null && !f.getFileName().isEmpty()) {
        th[threadIndex] = new Thread(fileG, new fileUploadThread(f, new FileService()), f.getFileName());
        th[threadIndex].start();
        // new Thread(fileG, new fileUploadThread(f, new FileService()), f.getFileName()).start();

        threadIndex++;
      } else {
        continue;
      }
    }

    for(int i = 0 ; i < threadIndex; i++) {
      try {
        th[i].join(); // ㅠㅠ 배열에 넣지 않으면 제어가 안됨 fileG스레드 실행중에 main스레드의 실행으로 화면이 전환됨
      } catch(InterruptedException e) {}
    }
    System.out.println("######## 소요시간 " + (System.currentTimeMillis() - startTime)); /* 종료시간 */
    res.sendRedirect("/list"); // 나중에 파일하나씩 업로드 될 때 마다 리스트에 나타나도록 구현하기
  }
  
  // 다중파일 업로드 스레드 쓰지않기 - 2533, 1859, 1975
//  protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
//    Collection<Part> parts = req.getParts();
//    Iterator<Part> iter = parts.iterator();
//
//    System.out.println("######## 개수?" + parts.size());
//    System.out.println("######## CPU Core 개수 체크 : " + Runtime.getRuntime().availableProcessors());
//
//    startTime = System.currentTimeMillis(); /* 시작시간 */
//    while(iter.hasNext()) {
//      f = new FileIO();
//      f.setPart(iter.next());
//      if(f.getFileName() != null && !f.getFileName().isEmpty()) {
//        try {
//          f.writeFile(f.getPart().getInputStream(), new FileOutputStream(f.getPath() + f.getDir() + f.getFileName()),
//            (int)f.getPart().getSize());
//
//        } catch(IOException e){ System.out.println("파일업로드 오류!"); return;}
//
//        FileDto fileDto = new FileDto();
//        fileDto.setName(f.getFileName());
//        fileDto.setFpath(f.getPath() + f.getDir());
//        new FileService().wirte(fileDto);
//      } else {
//        continue;
//      }
//    }
//
//    System.out.println("######## 소요시간 " + (System.currentTimeMillis() - startTime)); /* 종료시간 */
//
//    res.sendRedirect("/list");
//  }
}