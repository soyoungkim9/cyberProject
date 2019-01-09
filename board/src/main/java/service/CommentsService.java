package service;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import dao.CommetsDao;
import jdbc.ConnectionProvider;
import jdbc.JdbcUtil;
import mvc.model.Board;
import mvc.model.Comments;

public class CommentsService {
	private CommetsDao commetsDao = new CommetsDao();
	private int size = 5;
	
	public int write(Comments comments) {
		Connection conn = null;
		try {
			conn = ConnectionProvider.getConnection();
			conn.setAutoCommit(false);

			Comments savedcomments = commetsDao.insert(conn, comments);
			if(savedcomments == null) {
				throw new RuntimeException("fail to insert comments");
			}
			
			conn.commit();
			return comments.getCno();
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
	
	public CommentsPage getCommentsPage(int pageNum, int boardNum) {
		try (Connection conn = ConnectionProvider.getConnection()) {
			int total = commetsDao.selectCount(conn, boardNum);
			List<Comments> content = commetsDao.select(
					conn, (pageNum - 1) * size, size, boardNum);
			return new CommentsPage(total, pageNum, size, content);
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
	}
	
	public Comments getComments(int commentsNum) {
		try(Connection conn = ConnectionProvider.getConnection()) {
			Comments comments = commetsDao.selectByComments(conn, commentsNum);
			return comments;
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
	}
	
	public void delete(int commentNum) {
		try(Connection conn = ConnectionProvider.getConnection()) {
			commetsDao.delete(conn, commentNum);
			conn.commit();
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
	}
}
