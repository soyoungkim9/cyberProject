package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import jdbc.JdbcUtil;
import mvc.model.Board;

// DAO - 단일 데이터 접근/갱신
// board 테이블에 접근하는 Class (query를 날린다.)
public class BoardDao {
	public Board insert(Connection conn, Board board) throws SQLException {
		PreparedStatement pstmt = null;
		try {
			pstmt = conn.prepareStatement("insert into board"
							+ "(bno, name, title, content, pwd)"
							+ "values(board_seq.nextval, ?, ?, ?, ?)");
			pstmt.setString(1, board.getName());
			pstmt.setString(2, board.getTitle());
			pstmt.setString(3, board.getContent());
			pstmt.setString(4, board.getPwd());
			int insertedCount = pstmt.executeUpdate();
			if(insertedCount > 0) {
				return new Board(board.getBno(),
							board.getName(),
							board.getPwd(),
							board.getTitle(),
							board.getContent(),
							board.getCnt(),
							board.getSdt());
			}
			return null;
		} finally {
			JdbcUtil.close(pstmt);
		}
	}
}
