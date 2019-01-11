package mvc.model;

import java.util.Date;

//Comments 테이블의 데이터를 저장하는 Class
public class Comments {
	private int cno;
	private String name;
	private String pwd;
	private String content;
	private Date sdt;
	private int bno;
	private int total;
	
	public Comments() {}
	
	public Comments(int cno, String name, String pwd, String content, 
			Date sdt, int bno) {
		this.cno = cno;
		this.name = name;
		this.pwd = pwd;
		this.content = content;
		this.sdt = sdt;
		this.bno = bno;
	}

	public int getCno() {
		return cno;
	}

	public void setCno(int cno) {
		this.cno = cno;
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

	public int getBno() {
		return bno;
	}

	public void setBno(int board) {
		this.bno = board;
	}

	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
	}
	
	public boolean hasNoComments() {
		return total == 0;
	}
	
	public boolean hasComments() {
		return total > 0;
	}
}
