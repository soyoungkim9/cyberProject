package jdbc;

import org.apache.commons.dbcp2.ConnectionFactory;
import org.apache.commons.dbcp2.DriverManagerConnectionFactory;
import org.apache.commons.dbcp2.PoolableConnection;
import org.apache.commons.dbcp2.PoolableConnectionFactory;
import org.apache.commons.dbcp2.PoolingDriver;
import org.apache.commons.pool2.impl.GenericObjectPool;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.http.HttpServlet;
import java.io.IOException;
import java.io.StringReader;
import java.sql.DriverManager;
import java.util.Properties;

// 커넥션 풀
public class DBConnection extends HttpServlet implements ServletContextListener {
  @Override
  public void contextInitialized(ServletContextEvent sce) {
    String dbOracle = sce.getServletContext().getInitParameter("dbOracle");
    Properties prop = new Properties();
    try {
      prop.load(new StringReader(dbOracle)); // web.xml에서 dbOracle의 정보를 읽는다.
    } catch(IOException e) {
      throw new RuntimeException(e);
    }
    loadJDBCDriver(prop);
    initConnectionPool(prop);
  }
  
  
  private void loadJDBCDriver(Properties prop) {
    String driverClass = prop.getProperty("jdbcdriver");
    try {
      // DB 드라이버 로딩
      Class.forName(driverClass);
    } catch (ClassNotFoundException e) { // DB 드라이버 로딩 실패
      System.out.println("DB 드라이버 로딩 실패 :" + e.toString());
    }
  }
  
  private void initConnectionPool(Properties prop) {
    try {
      String jdbcUrl = prop.getProperty("jdbcUrl");
      String dbUser = prop.getProperty("dbUser");
      String dbPass = prop.getProperty("dbPass");
      
      ConnectionFactory connFactory =
        new DriverManagerConnectionFactory(jdbcUrl, dbUser, dbPass);

      PoolableConnectionFactory poolableConnFactory =
        new PoolableConnectionFactory(connFactory, null);
      String validationQuery = prop.getProperty("validationQuery");
      if(validationQuery != null && !validationQuery.isEmpty()) {
        poolableConnFactory.setValidationQuery(validationQuery);
      }
  
      GenericObjectPoolConfig poolConfig = new GenericObjectPoolConfig();
      poolConfig.setTimeBetweenEvictionRunsMillis(1000L * 60L * 5L);
      poolConfig.setTestWhileIdle(true);
      int minIdle = getIntProperty(prop, "minIdle", 5);
      poolConfig.setMinIdle(minIdle);
      int maxTotal = getIntProperty(prop, "maxTotal", 50);
      poolConfig.setMinIdle(maxTotal);
      
      GenericObjectPool<PoolableConnection> connectionPool =
        new GenericObjectPool<>(poolableConnFactory, poolConfig);
      poolableConnFactory.setPool(connectionPool);
      
      Class.forName("org.apache.commons.dbcp2.PoolingDriver");
      PoolingDriver driver = (PoolingDriver)
        DriverManager.getDriver("jdbc:apache:commons:dbcp:");
      String poolName = prop.getProperty("poolName");
      driver.registerPool(poolName, connectionPool); // JDBC URL, 풀 이름
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }
  
  private int getIntProperty(Properties prop, String propName, int defaultValue) {
    String value = prop.getProperty(propName);
    if(value == null) return defaultValue;
    return Integer.parseInt(value);
  }

  @Override
  public void contextDestroyed(ServletContextEvent sce) {}
}
