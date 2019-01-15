package service;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import dao.CommetsDao;
import jdbc.ConnectionProvider;
import jdbc.JdbcUtil;
import mvc.model.Comments;

public class CommentsService {
	private CommetsDao commetsDao = new CommetsDao();
	
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
	
	public int getCount(int boardNum) {
		try (Connection conn = ConnectionProvider.getConnection()) {
			int total = commetsDao.selectCount(conn, boardNum);
			return total;
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
	}
	
	public List<Comments> getComments(int boardNum) {
		try (Connection conn = ConnectionProvider.getConnection()) {
			List<Comments> content = commetsDao.select(conn, boardNum);
			return content;
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
	}
	
	public void modify(Comments modReq) {
		Connection conn = null;
		try {
			conn = ConnectionProvider.getConnection();
			conn.setAutoCommit(false);
			Comments comments = commetsDao.selectByComments(conn, modReq.getCno());
			if (!modReq.getPwd().equals(comments.getPwd())) {
				return;
			}
			commetsDao.update(conn, modReq.getCno(), modReq.getContent());
			conn.commit();
		} catch(SQLException e) {
			JdbcUtil.rollback(conn);
			throw new RuntimeException(e);
		} finally {
			JdbcUtil.close(conn);
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
