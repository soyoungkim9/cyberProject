package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import jdbc.JdbcUtil;
import mvc.model.Comments;

//DAO - 단일 데이터 접근/갱신
//Commets 테이블에 접근하는 Class (query를 날린다.)
public class CommetsDao {
	
	public Comments insert(Connection conn, Comments comments) throws SQLException {
		PreparedStatement pstmt = null;
		try {
			pstmt = conn.prepareStatement("insert into comments"
					+ "(cno, name, pwd, content, bno)"
					+ "values(comments_seq.nextval, ?, ?, ?, ?)");
			pstmt.setString(1, comments.getName());
			pstmt.setString(2, comments.getPwd());
			pstmt.setString(3, comments.getContent());
			pstmt.setInt(4, comments.getBno());
			int insertedCount = pstmt.executeUpdate();
			if(insertedCount > 0) {
				return new Comments(comments.getCno(),
						comments.getName(),
						comments.getPwd(),
						comments.getContent(),
						comments.getSdt(),
						comments.getBno());
			}
			return null;
		} finally {
			JdbcUtil.close(pstmt);
		}
	}
	
	public int selectCount(Connection conn, int bno) throws SQLException {
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		
		try {
			pstmt = conn.prepareStatement(
					"select count(*) from comments where bno = ?");
			pstmt.setInt(1, bno);
			rs = pstmt.executeQuery();
			if(rs.next()) {
				return rs.getInt(1);
			}
			return 0;
		} finally {
			JdbcUtil.close(rs);
			JdbcUtil.close(pstmt);
		}
	}
	
	public List<Comments> select(Connection conn, int bno) 
			throws SQLException {
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		try {
			pstmt = conn.prepareStatement("select *"
					+ "from comments where bno = ? order by cno desc");
			pstmt.setInt(1, bno);
			rs = pstmt.executeQuery();
			List<Comments> result = new ArrayList<>();
			while(rs.next()) {
				Comments comments = getComments(rs);
				result.add(comments);
			}
			return result;
		} finally {
			JdbcUtil.close(rs);
			JdbcUtil.close(pstmt);
		}
	}
	
	public Comments selectByComments(Connection conn, int no) throws SQLException {
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		try {
			pstmt = conn.prepareStatement(
					"select * from comments where cno = ?");
			pstmt.setInt(1, no);
			rs = pstmt.executeQuery();
			Comments comments = null;
			if(rs.next()) {
				comments = getComments(rs);
			}
			return comments;
		} finally {
			JdbcUtil.close(rs);
			JdbcUtil.close(pstmt);
		}
	}
	
	public int update(Connection conn, int no, String content) 
			throws SQLException {
		try(PreparedStatement pstmt =
				conn.prepareStatement(
						"update comments set content = ? where cno = ?")) {
			pstmt.setString(1, content);
			pstmt.setInt(2, no);
			return pstmt.executeUpdate();
		}
	}
	
	public int delete(Connection conn, int no) 
			throws SQLException {
		try(PreparedStatement pstmt =
				conn.prepareStatement(
						"delete from comments where cno = ?")) {
			pstmt.setInt(1, no);
			return pstmt.executeUpdate();
		}
	}
	
	public Comments getComments(ResultSet rs) throws SQLException {
		Comments newComments = new Comments();
		newComments.setCno(rs.getInt("cno"));
		newComments.setName(rs.getString("name"));
		newComments.setPwd(rs.getString("pwd"));
		newComments.setContent(rs.getString("content"));
		newComments.setSdt(rs.getDate("sdt"));
		newComments.setBno(rs.getInt("bno"));
		return newComments;
	}
}
