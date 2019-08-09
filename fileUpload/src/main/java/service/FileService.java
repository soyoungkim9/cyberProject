package service;

import dao.FileDao;
import dto.FileDto;
import jdbc.DBConnection;
import jdbc.JdbcUtil;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

public class FileService {
  private FileDao fileDao = new FileDao();
  
  public void wirte(FileDto fileDto) {
    Connection conn = null;
    try {
      conn = DBConnection.getConnection();
      conn.setAutoCommit(false);
      Boolean savedFile = fileDao.insert(conn, fileDto);
      if(savedFile == false) {
        throw new RuntimeException("fail to insert");
      }
      
      conn.commit();
    } catch(SQLException e) {
      JdbcUtil.rollback(conn);
      throw new RuntimeException(e);
    } catch(RuntimeException e) {
      JdbcUtil.rollback(conn);
      throw new RuntimeException(e);
    } finally {
      JdbcUtil.close(conn);
    }
  }
  
  public List<FileDto> list() {
    List<FileDto> fileDto = null;
    try (Connection conn = DBConnection.getConnection()) {
      fileDto = fileDao.select(conn);
      if(fileDto == null) {
        throw new RuntimeException("fail to select");
      }
    } catch (SQLException e) {
      throw new RuntimeException(e);
    }
    return fileDto;
  }
  
  public void delete(int fno) {
    try(Connection conn = DBConnection.getConnection()) {
      if(fileDao.selectByFno(conn, fno)) {
        int del = fileDao.delete(conn, fno);
        
        if(del == 0) {
          throw new RuntimeException("fail to delete");
        }
      } else {
        throw new RuntimeException("not found file");
      }
      
      conn.commit();
    } catch(SQLException e) {
      throw new RuntimeException(e);
    }
  }
}
