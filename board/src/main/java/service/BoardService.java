package service;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import dao.BoardDao;
import jdbc.ConnectionProvider;
import jdbc.JdbcUtil;
import mvc.model.Board;

// service - 트랜잭션 단위, 기능제공
// 데이터베이스에 접근 필요하면 DAO를 주입받고 DB처리는 DAO에게 위임한다.
public class BoardService {
	private BoardDao boardDao = new BoardDao();
	private int size = 5;
	
	public int write(Board board) {
		Connection conn = null;
		try {
			conn = ConnectionProvider.getConnection();
			conn.setAutoCommit(false);

			Board savedBoard = boardDao.insert(conn, board);
			if(savedBoard == null) {
				throw new RuntimeException("fail to insert board");
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
	
	public BoardPage getBoardPage(int pageNum) {
		try (Connection conn = ConnectionProvider.getConnection()) {
			int total = boardDao.selectCount(conn);
			List<Board> content = boardDao.select(
					conn, (pageNum - 1) * size, size);
			return new BoardPage(total, pageNum, size, content);
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
	}
	
	public Board getBoard(int boardNum, boolean increaseCnt) {
		try(Connection conn = ConnectionProvider.getConnection()) {
			Board board = boardDao.selectByBno(conn, boardNum);
			if(board == null) {
				throw new BoardNotFoundException();
			}
			if(increaseCnt) {
				boardDao.increaseCount(conn, boardNum);
			}
			return board;
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
	}
	
	public void modify(Board modReq) {
		Connection conn = null;
		try {
			conn = ConnectionProvider.getConnection();
			conn.setAutoCommit(false);
			Board board = boardDao.selectByBno(conn, modReq.getBno());
			if (board == null) {
				throw new BoardNotFoundException();
			}
			if (!modReq.getPwd().equals(board.getPwd())) {
				throw new UpdateDeniedException();
			}
			boardDao.update(conn, modReq.getBno(), 
					modReq.getTitle(), modReq.getContent());
			conn.commit();
		} catch(SQLException e) {
			JdbcUtil.rollback(conn);
			throw new RuntimeException(e);
		} catch(UpdateDeniedException e) {
			JdbcUtil.rollback(conn);
			throw e;
		} finally {
			JdbcUtil.close(conn);
		}
	}
	
	public void delete(int boardNum) {
		try(Connection conn = ConnectionProvider.getConnection()) {
			Board board = boardDao.selectByBno(conn, boardNum);
			if(board == null) {
				throw new BoardNotFoundException();
			}
			boardDao.delete(conn, boardNum);
			conn.commit();
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
	}
	
	public BoardPage selectBySearch(int pageNum, String search) {
		try (Connection conn = ConnectionProvider.getConnection()) {
			int total = boardDao.searchCount(conn, search);
			List<Board> content = boardDao.selectBySearch(
					conn, (pageNum - 1) * size, size, search);
			return new BoardPage(total, pageNum, size, content);
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
	}
}
