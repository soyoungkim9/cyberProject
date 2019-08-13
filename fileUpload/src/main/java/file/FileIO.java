package file;

import service.FileService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.*;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;

public class FileIO {
  private static String path = "C:\\Users\\CI\\Desktop\\workspace\\git\\cyberProject\\fileUpload\\src\\main\\webapp\\upload\\";
  private static String fileName = null;
  private static Part part = null;
  
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
  
  public static String getPath() {
    return path;
  }
  public static void setFileName(String name) {
    fileName = name;
  }
  public static String getFileName() {
    return fileName;
  }
  public static void setPart(Part p) {
    part = p;
  }
  public static Part getPart() {
    return part;
  }
}
