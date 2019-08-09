package file;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;

public class FileIO {
  public static void writeFile(InputStream input, OutputStream output, int size) throws IOException {
    int read = 0;
    byte[] b = new byte[size];
    BufferedInputStream in = null;
    BufferedOutputStream outs = null;
    
    try {
      in = new BufferedInputStream(input);
      outs = new BufferedOutputStream(output);
      while((read = in.read(b)) != -1) {
        outs.write(b, 0, read);
      }
    } catch (Exception e) {
      e.printStackTrace();
    } finally {
      outs.close();
      in.close();
    }
  }
  
  public static String handleKoFileName(HttpServletRequest req, HttpServletResponse res, String fileName) throws UnsupportedEncodingException {
    String browser = req.getHeader("User-Agent");
    
    if(browser.contains("MSIE") || browser.contains("Trident")) {
      fileName = URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");
      res.setHeader("Content-Disposition", "attachment;filename=" + fileName + ";");
    } else {
      fileName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
      res.setHeader("Content-Disposition", "attachment;filename=\"" + fileName +"\"");
    }
    return fileName;
  }
  
  public static String createDate() {
    Date date = new Date();
    SimpleDateFormat today = new SimpleDateFormat("yyyyMMddHHmmss");
    return today.format(date);
  }
}
