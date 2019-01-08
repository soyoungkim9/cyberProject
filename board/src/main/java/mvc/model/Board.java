package mvc.model;

import java.util.Date;

// board 테이블의 데이터를 저장하는 Class
public class Board {
	private int bno;
	private String name;
	private String pwd;
	private String title;
	private String content;
	private String fileURL;
	private int cnt;
	private Date sdt;
	
	public Board() {}
	public Board(int bno, String name, String pwd, String title,
			String content, String fileURL, int cnt, Date sdt) {
		this.bno = bno;
		this.name = name;
		this.pwd = pwd;
		this.title = title;
		this.content = content;
		this.fileURL = fileURL;
		this.cnt = cnt;
		this.sdt = sdt;
	}

	public int getBno() {
		return bno;
	}

	public void setBno(int bno) {
		this.bno = bno;
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

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public int getCnt() {
		return cnt;
	}

	public void setCnt(int cnt) {
		this.cnt = cnt;
	}

	public Date getSdt() {
		return sdt;
	}

	public void setSdt(Date sdt) {
		this.sdt = sdt;
	}
	
	public String getFileURL() {
		return fileURL;
	}
	
	public void setFileURL(String fileURL) {
		this.fileURL = fileURL;
	}
}
