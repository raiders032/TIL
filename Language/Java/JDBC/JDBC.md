# 1 JDBC

- JDBC(Java Database Connectivity)는 자바에서 데이터베이스에 접속할 수 있도록 하는 자바 API다. 
- JDBC는 데이터베이스에서 자료를 쿼리하거나 업데이트하는 방법을 제공한다.



## 1.1 JDBC의 등장 이유

* 애플리케이션을 개발할 때 중요한 데이터는 대부분 데이터베이스에 보관한다.
* 클라이언트가 애플리케이션 서버를 통해 데이터를 저장하거나 조회하면, 애플리케이션 서버는 다음 과정을 통해서 데이터베이스를 사용한다.

1. 커넥션 연결: 주로 TCP/IP를 사용해서 커넥션을 연결한다.
2. SQL 전달: 애플리케이션 서버는 DB가 이해할 수 있는 SQL을 연결된 커넥션을 통해 DB에 전달한다.
3. 결과 응답: DB는 전달된 SQL을 수행하고 그 결과를 응답한다. 애플리케이션 서버는 응답 결과를 활용한다.



**데이터베이스 변경시 문제점**

* **각각의 데이터베이스마**다 커넥션을 연결하는 방법, SQL을 전달하는 방법, 그리고 결과를 응답 받는 **방법이 모두 다르다**
* 데이터베이스를 **다른 종류의 데이터베이스로 변경**하면 애플리케이션 서버에 개발된 데이터베이스 **사용 코드도 함께 변경**해야 한다.
* 개발자가 **각각의 데이터베이스마다** 커넥션 연결, SQL 전달, 그리고 그 결과를 응답 받는 **방법을 새로 학습**해야 한다.
* 이러한 문제점을 해결하기 위해 JDBC라는 표준이 만들어졌다



## 1.2 JDBC 인터페이스

* 대표적으로 아래 3가지 인터페이스를 제공한다
  * java.sql.Connection - 연결
  * java.sql.Statement - SQL을 담은 내용
  * java.sql.ResultSet - SQL 요청 응답
* 개발자는 이 표준 인터페이스를 사용해 데이터베이스를 사용하면 된다.



## 1.3 JDBC 구현체

*  JDBC 인터페이스만으로 기능이 동작하지 않는다 이를 구현한 구현체가 필요하다
*  각각의 DB 벤더는 자신의 DB에 맞도록 JDBC 인터페이스를 구현해 제공하며 이를 `JDBC 드라이버`라고 한다.



## 1.4 JDBC의 장점

- 애플리케이션 로직이 JDBC 인터페이스에 의존하기 때문에 다른 DB로 변경하는 경우 애플리케이션 로직 코드의 변경 없이 드라이버만 변경하면 된다.
- 과거 각각의 DB 사용법을 익혀야 했지만 표준 API인 JDBC를 사용하므로 개발자는 JDBC 인터페이스 사용법만 학습하면 된다.



## 1.5 한계점

* JDBC의 등장으로 많은 것이 편리해졌지만, 각각의 데이터베이스마다 SQL, 데이터타입 등의 일부 사용법이 다르다.
* ANSI SQL이라는 표준이 있기는 하지만 일반적인 부분만 공통화했기 때문에 한계가 있다.
* 결국 데이터베이스를 변경하면 JDBC 코드는 변경하지 않아도 되지만 SQL은 해당 데이터베이스에 맞도록 변경해야한다.





# 2 ORM과 SQL Mapper

- 최근에는 JDBC를 직접 사용하기 보다 ORM이나 SQL Mapper를 사용한다.
- 이 기술들도 내부에서는 모두 JDBC를 사용한다.  



## 2.1 SQL Mapper

- SQL Mapper는 SQL만 직접 작성하면 나머지 번거로운 일은 SQL Mapper가 대신 해결해준다.
- 대표적으로 스프링 JdbcTemplate, MyBatis이 있다.



**장점** 

- JDBC를 편리하게 사용하도록 도와준다.
- SQL 응답 결과를 객체로 편리하게 변환해준다.
- JDBC의 반복 코드를 제거해준다.
- SQL Mapper는 SQL만 작성할 줄 알면 금방 배워서 사용할 수 있다.



**단점**

- 개발자가 SQL을 직접 작성해야한다.



## 2.2 ORM

- ORM은 객체를 관계형 데이터베이스 테이블과 매핑해주는 기술이다
- JPA는 자바 진영의 ORM 표준 인터페이스이고, 이것을 구현한 것으로 하이버네이트와 이클립스 링크 등의 구현 기술이 있다.



**장점**

- 개발자는 반복적인 SQL을 직접 작성하지 않고, ORM 기술이 개발자 대신에 SQL을 동적으로 만들어 실행해준다. 
- 각각의 데이터베이스마다 다른 SQL을 사용하는 문제도 중간에서 해결해준다.

**단점**

- 편리한 반면에 쉬운 기술은 아니므로 실무에서 사용하려면 깊이있게 학습해야 한다.





# 3 JDBC 직접 사용하기



## 3.1 JDBC DriverManager

* JDBC가 제공하는 `DriverManager`는 라이브러리에 등록된 DB 드라이버들을 관리하고, 커넥션을 획득하는 기능을 제공한다.



**DriverManager 작동 과정**

1. 애플리케이션 로직에서 커넥션이 필요하면 `DriverManager.getConnection()` 을 호출한다.
2. DriverManager는 등록된 드라이버 목록을 가지고 있는데 이 드라이버들에게 정보를 넘겨 커넥션을 획득할 수 있는지 확인
   * 넘겨주는 정보에는 URL, 사용자이름, 비밀번호 등이 있다
   * `jdbc:h2:tcp://localhost/~/test` 라는 URL 정보에서 `jdbc:h2` 로 시작하기 때문에 H2 드라이버가 처리할 수 있으므로 H2 드라이버가 실제 데이터베이스에 연결해서 커넥션을 획득하고 이 커넥션을 클라이언트에 반환한다.
3. 커넥션을 획득할 수 없다면 다음 드라이버를 확인
4. 커넥션을 획득할 수 있다면 찾은 커넥션 구현체가 커넥션을 획득하고 클라이언트에 반환



## 3.2 Connection 획득하기

* 데이터베이스 커넥션을 획득하려면  JDBC가 제공하는 `DriverManager.getConnection()` 를 사용하면 된다.
* 라이브러리에 있는 데이터베이스 드라이버를 찾아서 해당 드라이버가 제공하는 커넥션을 반환해준다.



**DBConnectionUtil.java**

* `DriverManager.getConnection()` 메서드를 호출해 커넥션을 획득한다.
* H2 데이터베이스 드라이버가 작동해서 실제 데이터베이스와 커넥션을 맺고 그 결과를 반환해준다.

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Slf4j
public class DBConnectionUtil {
  private static final String URL = "jdbc:h2:tcp://localhost/~/test";
  private static final String USERNAME = "sa";
  private static final String PASSWORD = "";

  public static Connection getConnection() {
    try {
      Connection connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
      log.info("get connection={}, class={}", connection, connection.getClass());
      return connection;
    } catch (SQLException e) {
      throw new IllegalStateException(e);
    }
  }

}
```



**테스트 코드와 실행 결과**

```java
@Test
void connection() {
  Connection connection = DBConnectionUtil.getConnection();
  assertThat(connection).isNotNull();
}
```

```
DBConnectionUtil - get connection=conn0: url=jdbc:h2:tcp://localhost/~/test
user=SA, class=class org.h2.jdbc.JdbcConnection
```

* 실행 결과를 보면 class=class org.h2.jdbc.JdbcConnection 부분을 확인할 수 있다
* 이것이 바로 H2 데이터베이스 드라이버가 제공하는 H2 전용 커넥션으로 JDBC 표준 커넥션 인터페이스인 java.sql.Connection 인터페이스를 구현하고 있다



## 3.3 SQL 전달 및 결과 응답

**MemberRepository.java**

* 3개의 메서드를 가지고 있다
* getConnection 메서드: 데이터베이스 커넥션을 획득
* findById 메서드: 커넥션을 가지고 SQL을 데이터베이스에 전달하고 결과를 응답 받기
* close 메서드: 리소스 정리

```java
@Slf4j
public class MemberRepository {
  private Connection getConnection() {
    return DBConnectionUtil.getConnection();
  }

  public Member findById(String memberId) throws SQLException {
    // 데이터베이스에 전달할 sql을 정의한다
    String sql = "select * from member where member_id = ?";
    Connection con = null;
    // PreparedStatement 는 Statement 의 자식 타입인데, ? 를 통한 파라미터 바인딩을 가능하게 해준다.
    PreparedStatement pstmt = null;
    ResultSet rs = null;

    try {
      con = getConnection();
      // 데이터베이스에 전달할 SQL과 파라미터로 전달할 데이터들을 준비한다.
      pstmt = con.prepareStatement(sql);
      // SQL의 첫 번째 ? 에 값을 지정한다
      pstmt.setString(1, memberId);
      // Statement 를 통해 준비된 SQL을 커넥션을 통해 실제 데이터베이스에 전달한다
      rs = pstmt.executeQuery();
      if (rs.next()) {
        Member member = new Member();
        member.setMemberId(rs.getString("member_id"));
        member.setMoney(rs.getInt("money"));
        return member;
      } else {
        throw new NoSuchElementException("member not found memberId=" + memberId);
      }
    } catch (SQLException e) {
      log.error("db error", e);
      throw e;
    } finally {
      // 리소스 정리
      close(con, pstmt, rs);
    }
  }

  private void close(Connection con, Statement stmt, ResultSet rs) {
    if (rs != null) {
      try {
        rs.close();
      } catch (SQLException e) {
        log.info("error", e);
      }
    }
    if (stmt != null) {
      try {
        stmt.close();
      } catch (SQLException e) {
        log.info("error", e);
      }
    }
    if (con != null) {
      try {
        con.close();
      } catch (SQLException e) {
        log.info("error", e);
      }
    }
  }
}
```



**getConnection 메서드**

* 앞서 정의한 DBConnectionUtil를 통해서 데이터베이스 커넥션을 획득한다



**findById 메서드**

* memberId로 Member를 찾아 반환하는 메서드
* DriverManager를 통해서 커넥션을 얻고 PreparedStatement를 이용해 데이터베이스에 전달할 SQL과 파라미터로 전달할 데이터들을 준비한다
* pstmt.executeQuery()로 sql을 실제 데이터베이스에 전달하고 그 결과를 ResultSet으로 받는다
* rs.next()는 커서를 다음으로 이동시키며 최초의 커서는 데이터를 가리키고 있지 않기 때문에 rs.next() 를 최초 한번은 호출해야 데이터를 조회할 수 있다.
* rs.next() 의 결과가 true 면 커서의 이동 결과 데이터가 있다는 뜻이다.
* rs.next() 의 결과가 false 면 더이상 커서가 가리키는 데이터가 없다는 뜻이다.



**close 메서드**

* 쿼리를 실행하고 나면 리소스를 반드시 정리해야 한다.
* 예외가 발생하든, 하지 않든 항상 수행되어야 하므로 finally 구문에 주의해서 작성해야한다
* 리소스를 정리하지 않으면 커넥션이 끊어지지 않고 계속 유지되는 문제가 발생할 수 있다.
* 이런 것을 리소스 누수라고 하는데, 결과적으로 커넥션 부족으로 장애가 발생할 수 있다
* 리소스를 정리할 때는 항상 역순으로 해야한다 ResultSet -> Statement -> Connection으로 리소스 반환





# 4 Connection Pool

- Connection Pool이 무엇이고 왜 필요한지 알아보자



**데이터베이스 커넥션을 획득하는 과정**

1. 애플리케이션 로직은 DB 드라이버를 통해 커넥션을 조회한다.
2. DB 드라이버는 DB와 TCP/IP 커넥션을 연결한다. 물론 이 과정에서 3 way handshake 같은 TCP/IP 연결을 위한 네트워크 동작이 발생한다.
3. DB 드라이버는 TCP/IP 커넥션이 연결되면 ID, PW와 기타 부가정보를 DB에 전달한다.
4. DB는 ID, PW를 통해 내부 인증을 완료하고, 내부에 DB 세션을 생성한다.
5. DB는 커넥션 생성이 완료되었다는 응답을 보낸다.
6. DB 드라이버는 커넥션 객체를 생성해서 클라이언트에 반환한다.



**Connection Pool 등장 배경**

- 커넥션을 새로 만드는 것은 과정도 복잡하고 시간도 많이 많이 소모되는 일이다.
- TCP/IP 커넥션을 새로 생성하기 위한 리소스를 매번 사용해야 한다.
- SQL을 실행하는 시간 뿐만 아니라 커넥션을 새로 만드는 시간이 추가되기 때문에 결과적으로 응답 속도에 영향을 준다.
- 즉 사용자의 요청마다 커넥션을 새로 만들어서 사용하는 것은 비효율적이다.
- 따라서 커넥션을 미리 생성해서 `커넥션 풀`이라는 곳에 에 보관하고 커넥션이 필요한 경우 커넥션 풀에서 가져와 사용하고 반납하는 것이 효율적일 것이다.