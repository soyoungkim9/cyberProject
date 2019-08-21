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
//    System.out.println("######## 무슨스레드? " + Thread.currentThread().getName());
//    for(int i = 0; i < 300; i++) {
//      System.out.println(Thread.currentThread().getName());
//    }
  
    try {
      f.writeFile(f.getPart().getInputStream(), new FileOutputStream(f.getPath() + f.getDir() + f.getFileName()),
        (int)f.getPart().getSize());
    
    } catch(IOException e){ System.out.println("파일업로드 오류!"); return;}
  
    FileDto fileDto = new FileDto();
    fileDto.setName(f.getFileName());
    fileDto.setFpath(f.getPath() + f.getDir());
    fileService.wirte(fileDto);
  }
}
