package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import jdbc.JdbcUtil;
import mvc.model.Reply;

public class ReplyDao {

	public Reply insert(Connection conn, Reply reply) throws SQLException {
		PreparedStatement pstmt = null;
		try {
			pstmt = conn.prepareStatement("insert into reply"
					+ "(rno, name, pwd, content, cno)"
					+ "values(reply_seq.nextval, ?, ?, ?, ?)");
			pstmt.setString(1, reply.getName());
			pstmt.setString(2, reply.getPwd());
			pstmt.setString(3, reply.getContent());
			pstmt.setInt(4, reply.getCno());
			int insertedCount = pstmt.executeUpdate();
			if(insertedCount > 0) {
				return new Reply(reply.getRno(),
						reply.getName(),
						reply.getPwd(),
						reply.getContent(),
						reply.getSdt(),
						reply.getCno());
			}
			return null;
		} finally {
			JdbcUtil.close(pstmt);
		}
	}
	
	public int selectCount(Connection conn, int cno) throws SQLException {
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		
		try {
			pstmt = conn.prepareStatement(
					"select count(*) from reply where cno = ?");
			pstmt.setInt(1, cno);
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
	
	public List<Reply> select(Connection conn, int cno) 
			throws SQLException {
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		try {
			pstmt = conn.prepareStatement("select *"
					+ "from reply where cno = ? order by rno asc");
			pstmt.setInt(1, cno);
			rs = pstmt.executeQuery();
			List<Reply> result = new ArrayList<>();
			while(rs.next()) {
				Reply reply = getReply(rs);
				result.add(reply);
			}
			return result;
		} finally {
			JdbcUtil.close(rs);
			JdbcUtil.close(pstmt);
		}
	}

	public Reply getReply(ResultSet rs) throws SQLException {
		Reply reply = new Reply();
		reply.setRno(rs.getInt("rno"));
		reply.setName(rs.getString("name"));
		reply.setPwd(rs.getString("pwd"));
		reply.setContent(rs.getString("content"));
		reply.setSdt(rs.getDate("sdt"));
		reply.setCno(rs.getInt("cno"));
		return reply;
	}
	
	public Reply selectByReply(Connection conn, int no) throws SQLException {
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		try {
			pstmt = conn.prepareStatement(
					"select * from reply where rno = ?");
			pstmt.setInt(1, no);
			rs = pstmt.executeQuery();
			Reply reply = null;
			if(rs.next()) {
				reply = getReply(rs);
			}
			return reply;
		} finally {
			JdbcUtil.close(rs);
			JdbcUtil.close(pstmt);
		}
	}
	
	public int update(Connection conn, int no, String content) 
			throws SQLException {
		try(PreparedStatement pstmt =
				conn.prepareStatement(
						"update reply set content = ? where rno = ?")) {
			pstmt.setString(1, content);
			pstmt.setInt(2, no);
			return pstmt.executeUpdate();
		}
	}
	
	public int delete(Connection conn, int no) 
			throws SQLException {
		try(PreparedStatement pstmt =
				conn.prepareStatement(
						"delete from reply where rno = ?")) {
			pstmt.setInt(1, no);
			return pstmt.executeUpdate();
		}
	}
}
