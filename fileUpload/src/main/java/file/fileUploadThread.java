package file;

import dto.FileDto;
import service.FileService;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class fileUploadThread implements Runnable {
  private FileIO f;
  private FileService fileService;
  
  public fileUploadThread (FileIO f, FileService fileService) {
    this.f = f;
    this.fileService = fileService;
  }
  
  @Override
  public void run() {
      System.out.println("--> " + f.getPart().getContentType());
      // 현재디렉토리 존재하는지 검사 .exist()
      System.out.println("--> dir " + new File(f.getPath()).getName());
//    System.out.println("######## 무슨스레드? " + Thread.currentThread().getName());
//    for(int i = 0; i < 300; i++) {
//      System.out.println(Thread.currentThread().getName());
//    }
    if(new File(f.getPath() + f.getFileName()).exists()) {
      String[] temp = f.getFileName().split("\\.");
      String type = temp[temp.length-1];
      f.setFileName(f.getFileName().substring(0, f.getFileName().indexOf(type)-1) + "-" + f.createDate() + "." + type);
    }
  
    try {
      f.writeFile(f.getPart().getInputStream(), new FileOutputStream(f.getPath() + f.getFileName()),
        (int)f.getPart().getSize());
    
    } catch(IOException e){ System.out.println("파일업로드 오류!"); return;}
  
    FileDto fileDto = new FileDto();
    fileDto.setName(f.getFileName());
    fileService.wirte(fileDto);
  }
}
