package mvc.model;

import java.util.Date;

public class Reply {
	private int rno;
	private String name;
	private String pwd;
	private String content;
	private Date sdt;
	private int cno;
	
	public Reply() {}
	public Reply(int rno, String name, String pwd, String content, 
			Date sdt, int cno) {
		this.rno = rno;
		this.name = name;
		this.pwd = pwd;
		this.content = content;
		this.sdt = sdt;
		this.cno = cno;
	}
	
	public int getRno() {
		return rno;
	}
	public void setRno(int rno) {
		this.rno = rno;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPwd() {
		return pwd;
	}
	public void setPwd(String pwd) {
		this.pwd = pwd;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public Date getSdt() {
		return sdt;
	}
	public void setSdt(Date sdt) {
		this.sdt = sdt;
	}
	public int getCno() {
		return cno;
	}
	public void setCno(int cno) {
		this.cno = cno;
	}
}
