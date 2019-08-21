package dto;

import java.util.Date;

public class FileDto {
  private int fno;
  private String name;
  private Date sdt;
  private String fpath;
  
  public int getFno() {
    return fno;
  }
  
  public void setFno(int fno) {
    this.fno = fno;
  }
  
  public String getName() {
    return name;
  }
  
  public void setName(String name) {
    this.name = name;
  }
  
  public Date getSdt() {
    return sdt;
  }
  
  public void setSdt(Date sdt) {
    this.sdt = sdt;
  }
  
  public void setFpath(String fpath) {this.fpath = fpath;}
  
  public String getFpath() { return fpath;}
}
