package jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectionProvider {
  public static Connection getConnection() throws SQLException {
    // 커넥션 풀을 가져와라!
    return DriverManager.getConnection("jdbc:apache:commons:dbcp:kimsydb");
  }
}
