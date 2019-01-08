package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import jdbc.JdbcUtil;
import mvc.model.Board;

// DAO - 단일 데이터 접근/갱신
// board 테이블에 접근하는 Class (query를 날린다.)

// 시간남으면 반복되는 아이들 줄이기!
public class BoardDao {
	public Board insert(Connection conn, Board board) throws SQLException {
		PreparedStatement pstmt = null;
		try {
			pstmt = conn.prepareStatement("insert into board"
							+ "(bno, name, title, content, pwd, fileurl)"
							+ "values(board_seq.nextval, ?, ?, ?, ?, ?)");
			pstmt.setString(1, board.getName());
			pstmt.setString(2, board.getTitle());
			pstmt.setString(3, board.getContent());
			pstmt.setString(4, board.getPwd());
			pstmt.setString(5, board.getFileURL());
			int insertedCount = pstmt.executeUpdate();
			if(insertedCount > 0) {
				return new Board(board.getBno(),
							board.getName(),
							board.getPwd(),
							board.getTitle(),
							board.getContent(),
							board.getFileURL(),
							board.getCnt(),
							board.getSdt());
			}
			return null;
		} finally {
			JdbcUtil.close(pstmt);
		}
	}
	
	public int selectCount(Connection conn) throws SQLException {
		Statement stmt = null;
		ResultSet rs = null;
		
		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery("select count(*) from board");
			if(rs.next()) {
				return rs.getInt(1);
			}
			return 0;
		} finally {
			JdbcUtil.close(rs);
			JdbcUtil.close(stmt);
		}
	}
	
	public List<Board> select(Connection conn, int startRow, int size) 
			throws SQLException {
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		try {
			pstmt = conn.prepareStatement("select board.*"
					+ "from (select row_number() over(order by bno desc)as rnum, board.* from board)"
					+ "board where rnum > ? and rnum <= ? order by rnum asc");
			pstmt.setInt(1, startRow);
			pstmt.setInt(2, startRow + size);
			rs = pstmt.executeQuery();
			List<Board> result = new ArrayList<>();
			while(rs.next()) {
				Board board = getBoard(rs);
				result.add(board);
			}
			return result;
		} finally {
			JdbcUtil.close(rs);
			JdbcUtil.close(pstmt);
		}
	}
	
	public Board selectByBno(Connection conn, int no) throws SQLException {
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		try {
			pstmt = conn.prepareStatement(
					"select * from board where bno = ?");
			pstmt.setInt(1, no);
			rs = pstmt.executeQuery();
			Board board = null;
			if(rs.next()) {
				board = getBoard(rs);
			}
			return board;
		} finally {
			JdbcUtil.close(rs);
			JdbcUtil.close(pstmt);
		}
	}
	
	public void increaseCount(Connection conn, int no) throws SQLException {
		try(PreparedStatement pstmt =
				conn.prepareStatement(
						"update board set cnt = cnt + 1 where bno = ?")) {
			pstmt.setInt(1, no);
			pstmt.executeUpdate();
		}
	}
	
	public int update(Connection conn, int no, String title, String content) 
			throws SQLException {
		try(PreparedStatement pstmt =
				conn.prepareStatement(
						"update board set title = ?, content = ? where bno = ?")) {
			pstmt.setString(1, title);
			pstmt.setString(2, content);
			pstmt.setInt(3, no);
			return pstmt.executeUpdate();
		}
	}
	
	public int delete(Connection conn, int no) 
			throws SQLException {
		try(PreparedStatement pstmt =
				conn.prepareStatement(
						"delete from board where bno = ?")) {
			pstmt.setInt(1, no);
			return pstmt.executeUpdate();
		}
	}
	
	public int searchCount(Connection conn, String title) throws SQLException {
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		
		try {
			pstmt = conn.prepareStatement("select count(*) from board where title = ?");
			pstmt.setString(1, title);
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
	
	public List<Board> selectBySearch(Connection conn, int startRow, int size, String search) 
			throws SQLException {
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		try {
			pstmt = conn.prepareStatement("select board.*"
					+ "from (select row_number() over(order by bno desc)as rnum, board.* from board where title = ? or name = ?)"
					+ "board where rnum >= ? and rnum <= ? order by rnum asc");
			pstmt.setString(1, search);
			pstmt.setString(2, search);
			pstmt.setInt(3, startRow);
			pstmt.setInt(4, startRow + size);
			rs = pstmt.executeQuery();
			List<Board> result = new ArrayList<>();
			while(rs.next()) {
				Board board = getBoard(rs);
				result.add(board);
			}
			return result;
		} finally {
			JdbcUtil.close(rs);
			JdbcUtil.close(pstmt);
		}
	}
	
	public Board getBoard(ResultSet rs) throws SQLException {
		Board newBoard = new Board();
		newBoard.setBno(rs.getInt("bno"));
		newBoard.setName(rs.getString("name"));
		newBoard.setPwd(rs.getString("pwd"));
		newBoard.setTitle(rs.getString("title"));
		newBoard.setContent(rs.getString("content"));
		newBoard.setFileURL(rs.getString("fileURL"));
		newBoard.setCnt(rs.getInt("cnt"));
		newBoard.setSdt(rs.getDate("sdt"));
		return newBoard;
	}
}

