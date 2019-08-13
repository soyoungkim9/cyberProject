package file;

import dto.FileDto;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import static controller.WriteFileHandler.*;
import static file.FileIO.*;

public class fileUploadThread implements Runnable {
  @Override
  public void run() {
    try {
      for(int i = 0; i < 300; i++) {
        System.out.println(i); // 병렬처리하고 싶은데... 직렬로 처리되는거 같음..
      }
      
      if(new File(getPath() + getFileName()).exists()) {
        String[] temp = getFileName().split("\\.");
        setFileName(temp[0] + "-" + createDate() + "." + temp[1]);
      }
      
      // 흠 이부분 handler부분으로 옮길까 고민임..
      FileDto fileDto = new FileDto();
      fileDto.setName(getFileName());
      getFileService().wirte(fileDto);
      
      writeFile(getPart().getInputStream(), new FileOutputStream(getPath() + getFileName()),
        (int)getPart().getSize());
  
    } catch(IOException e){}
    System.out.println("######## 소요시간 : " + (System.currentTimeMillis() - startTime)); /* 종료시간 */
  
  }
}
