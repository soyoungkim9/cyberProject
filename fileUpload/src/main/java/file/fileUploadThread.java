package file;

import dto.FileDto;
import service.FileService;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import static controller.WriteFileHandler.*;

public class fileUploadThread implements Runnable {
  private FileIO f = null;
  private FileService fileService = null;
  
  public fileUploadThread (FileIO f, FileService fileService) {
    this.f = f;
    this.fileService = fileService;
  }
  
  @Override
  public void run() {
    /*
    for(int i = 0; i < 300; i++) {
      System.out.println(i); // 스레드로 실행되는지 확인 절차 ^^
    }
    */
    synchronized (this){
      if(new File(f.getPath() + f.getFileName()).exists()) {
        String[] temp = f.getFileName().split("\\.");
        f.setFileName(temp[0] + "-" + f.createDate() + "." + temp[1]);
      }
    
      try {
        f.writeFile(f.getPart().getInputStream(), new FileOutputStream(f.getPath() + f.getFileName()),
          (int)f.getPart().getSize());
      
      } catch(IOException e){ System.out.println("파일업로드 오류!"); return;}
    
      FileDto fileDto = new FileDto();
      fileDto.setName(f.getFileName());
      fileService.wirte(fileDto);
    }
    System.out.println("######## 소요시간 " + f.getFileName() + " : " + (System.currentTimeMillis() - startTime)); /* 종료시간 */
  
  }
}
