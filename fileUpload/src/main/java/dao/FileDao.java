package dao;

import dto.FileDto;
import jdbc.JdbcUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class FileDao {
  public Boolean insert(Connection conn, FileDto file) throws SQLException {
    PreparedStatement pstmt = null;
    try {
      pstmt = conn.prepareStatement("insert into filelist (fno, name, fpath) values(filelist_seq.nextval, ?, ?)");
      pstmt.setString(1, file.getName());
      pstmt.setString(2, file.getFpath());
      int in = pstmt.executeUpdate();
      if(in > 0) {
        return true;
      }
      return false;
    } finally {
      JdbcUtil.close(pstmt);
    }
  }
  
  public List<FileDto> select(Connection conn) throws SQLException {
    PreparedStatement pstmt = null;
    ResultSet rs = null;
    
    try {
      pstmt = conn.prepareStatement("select fno, name, sdt from filelist order by fno desc");
      rs = pstmt.executeQuery();
  
      List<FileDto> result = new ArrayList<>();
      while(rs.next()) {
        FileDto newFile = new FileDto();
        newFile.setFno(rs.getInt("fno"));
        newFile.setName(rs.getString("name"));
        newFile.setSdt(rs.getDate("sdt"));
        
        result.add(newFile);
      }
      return result;
    } finally {
      JdbcUtil.close(rs);
      JdbcUtil.close(pstmt);
    }
  }
  
  public boolean selectByFno(Connection conn, int fno) throws SQLException {
    Boolean result = false;
    PreparedStatement pstmt = null;
    try {
      pstmt = conn.prepareStatement("select * from filelist where fno = ?");
      pstmt.setInt(1, fno);
      result = pstmt.execute();
    } finally {
      JdbcUtil.close(pstmt);
    }
    return result;
  }
  
  public int delete(Connection conn, int fno) throws SQLException {
    try(PreparedStatement pstmt = conn.prepareStatement("delete from filelist where fno = ?")) {
      pstmt.setInt(1, fno);
      return pstmt.executeUpdate();
    }
  }
}
