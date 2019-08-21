package file;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.*;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;

public class FileIO {
  private String path = "C:\\Users\\CI\\Desktop\\workspace\\git\\cyberProject\\fileUpload\\src\\main\\webapp\\upload\\";
  private String dir = null;
  private String fileName = null;
  private Part part = null;
  
  public void writeFile(InputStream input, OutputStream output, int size) throws IOException {
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
  
  public String handleKoFileName(HttpServletRequest req, HttpServletResponse res, String fileName) throws UnsupportedEncodingException {
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
  
  public void setPart(Part part) {
    this.part = part;
    setDir(part.getSubmittedFileName(), true);
    setFileName(part.getSubmittedFileName());
  }
  
  public void setFile(String fileName) {
    this.fileName = fileName;
    setDir(fileName, false);
  }
  
  private void setDir(String fileName, boolean partDate) {
    String type = splitFileType(fileName);
    if(type != null) {
      dir = type + "\\";
  
      if(partDate && !new File(path + type).isDirectory()) {
        new File(path + type).mkdir();
      }
    }
  }
  
  private void setFileName(String fileName) {
    if(new File(this.path + this.dir + fileName).exists()) {
      String type = splitFileType(fileName);
      this.fileName = fileName.substring(0, fileName.indexOf(type)-1) + "-" + createDate() + "." + type;
    } else {
      this.fileName = fileName;
    }
  }
  
  private String createDate() {
    Date date = new Date();
    SimpleDateFormat today = new SimpleDateFormat("yyyyMMddHHmmss");
    return today.format(date);
  }
  
  private String splitFileType(String fileName) {
    String[] temp = fileName.split("\\.");
    return temp[temp.length-1];
  }
  
  public String getPath() {return path;}
  public String getFileName() {return fileName;}
  public Part getPart() {return part;}
  public String getDir() {return dir;}
}
