package jdbc;

import javax.servlet.http.HttpServlet;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection extends HttpServlet {
  public static Connection getConnection() {
    String user = "*****";
    String pw = "*****";
    String url = "jdbc:oracle:thin:@localhost:1521:orcl";
    Connection conn = null;
    
    try {
      // DB 드라이버 로딩
      Class.forName("oracle.jdbc.driver.OracleDriver");
      // DB 접속
      conn = DriverManager.getConnection(url, user, pw);
      
    } catch (ClassNotFoundException e) { // DB 드라이버 로딩 실패
      System.out.println("DB 드라이버 로딩 실패 :" + e.toString());
    } catch (SQLException e) { // DB 접속 실패
      System.out.println("DB 접속 실패 :" + e.toString());
    }
    
    return conn;
  }
}
