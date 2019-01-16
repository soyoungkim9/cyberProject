package service;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import dao.ReplyDao;
import jdbc.ConnectionProvider;
import jdbc.JdbcUtil;
import mvc.model.Reply;

public class ReplyService {
	private ReplyDao replyDao = new ReplyDao();
	
	public int write(Reply reply) {
		Connection conn = null;
		try {
			conn = ConnectionProvider.getConnection();
			conn.setAutoCommit(false);
			
			Reply savedReply = replyDao.insert(conn, reply);
			if(savedReply == null) {
				throw new RuntimeException("fail to insert reply");
			}
			
			conn.commit();
			return reply.getRno();
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
	
	public int getCount(int commentsNum) {
		try (Connection conn = ConnectionProvider.getConnection()) {
			int total = replyDao.selectCount(conn, commentsNum);
			return total;
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
	}
	
	public List<Reply> getReply(int commentsNum) {
		try (Connection conn = ConnectionProvider.getConnection()) {
			List<Reply> content = replyDao.select(conn, commentsNum);
			return content;
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
	}
	
	public void modify(Reply modReq) {
		Connection conn = null;
		try {
			conn = ConnectionProvider.getConnection();
			conn.setAutoCommit(false);
			Reply reply = replyDao.selectByReply(conn, modReq.getRno());
			if (!modReq.getPwd().equals(reply.getPwd())) {
				return;
			}
			replyDao.update(conn, modReq.getRno(), modReq.getContent());
			conn.commit();
		} catch(SQLException e) {
			JdbcUtil.rollback(conn);
			throw new RuntimeException(e);
		} finally {
			JdbcUtil.close(conn);
		}
	}
	
	public void delete(int replyNum) {
		try(Connection conn = ConnectionProvider.getConnection()) {
			replyDao.delete(conn, replyNum);
			conn.commit();
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
	}
}
