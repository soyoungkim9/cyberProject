package service;

import dao.FileDao;
import dto.FileDto;
import jdbc.ConnectionProvider;
import jdbc.JdbcUtil;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;

public class FileService {
  private FileDao fileDao = new FileDao();
  
  public void wirte(FileDto fileDto) {
    Connection conn = null;
    try {
      conn = ConnectionProvider.getConnection();
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
    try (Connection conn = ConnectionProvider.getConnection()) {
      fileDto = fileDao.select(conn);
      if(fileDto == null) {
        throw new RuntimeException("fail to select");
      }
    } catch (SQLException e) {
      System.out.println("너가 문제덩어리야!");
      System.out.println("db 유효성 검사를 해봐야 할듯함");
      System.out.println(DriverManager.getLoginTimeout());
      
      throw new RuntimeException(e);
    }
    return fileDto;
  }
  
  public void delete(int fno) {
    try(Connection conn = ConnectionProvider.getConnection()) {
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
