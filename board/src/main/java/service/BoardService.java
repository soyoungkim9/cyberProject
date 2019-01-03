package service;

import java.sql.Connection;
import java.sql.SQLException;

import dao.BoardDao;
import jdbc.ConnectionProvider;
import jdbc.JdbcUtil;
import mvc.model.Board;

// service - 트랜잭션 단위, 기능제공
// 데이터베이스에 접근 필요하면 DAO를 주입받고 DB처리는 DAO에게 위임한다.
public class BoardService {
	private BoardDao boardDao = new BoardDao();
	
	public int write(Board board) {
		Connection conn = null;
		try {
			conn = ConnectionProvider.getConnection();
			conn.setAutoCommit(false);

			Board savedBoard = boardDao.insert(conn, board);
			if(savedBoard == null) {
				throw new RuntimeException("fail to insert article");
			}
			
			conn.commit();
			return board.getBno();
		} catch (SQLException e) {
			JdbcUtil.rollback(conn);
			throw new RuntimeException(e);
		} catch (RuntimeException e) {
			JdbcUtil.rollback(conn);
			throw e;
		} finally {
			JdbcUtil.close(conn);
		}
	}
}
