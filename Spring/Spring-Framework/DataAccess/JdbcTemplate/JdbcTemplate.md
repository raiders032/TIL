# 1 JdbcTemplate

- [레퍼런스](https://docs.spring.io/spring-framework/reference/data-access/jdbc/core.html#jdbc-JdbcTemplate)
- JdbcTemplate은 spring-jdbc 라이브러리에 포함되어 있는데, 이 라이브러리는 스프링으로 JDBC를 사용할 때 기본으로 사용되는 라이브러리이다.
- JdbcTemplate를 사용하면 개발자는 SQL을 작성하고, 전달할 파리미터를 정의하고, 응답 값을 매핑하기만 하면 된다.

<br>

## 1.1 JDBC의 단점

- JDBC(Java Database Connectivity)는 자바에서 데이터베이스에 접근하기 위한 표준 API입니다.
- 하지만 JDBC를 직접 사용하여 데이터베이스 연동을 구현하면 여러 가지 단점이 있습니다.
- 반복적인 코드 작성: 커넥션 획득, Statement 준비와 실행, ResultSet 처리, 커넥션 및 리소스 종료 등의 작업을 매번 반복해서 작성해야 합니다.
- 예외 처리의 어려움: JDBC에서 발생하는 예외는 체크 예외이므로 매번 try-catch 블록으로 처리해야 하며, 이로 인해 코드의 가독성이 떨어집니다.
- 트랜잭션 관리의 복잡성: 트랜잭션을 관리하기 위해서는 커넥션의 commit과 rollback을 직접 처리해야 하며, 이는 상당히 번거로운 작업입니다.

<br>

## 1.2 JdbcTemplate의 필요성

- 이러한 JDBC의 단점을 보완하고자 스프링에서는 JdbcTemplate을 제공합니다.
- JdbcTemplate은 JDBC를 래핑하여 위에서 언급한 문제점들을 해결해 줍니다.
- 반복적인 코드 제거: JdbcTemplate은 커넥션 획득, Statement 준비와 실행, ResultSet 처리, 리소스 종료 등의 작업을 내부적으로 처리하므로 개발자는 SQL 작성과 파라미터 설정, 결과 매핑에만 집중할 수 있습니다.
- 예외 처리 단순화: JdbcTemplate은 체크 예외를 언체크 예외로 변환해주므로 매번 try-catch 블록을 사용하지 않아도 됩니다. 이는 코드의 가독성을 높여줍니다.
- 트랜잭션 관리 편의성: JdbcTemplate은 트랜잭션 관리를 위한 유틸리티 메소드를 제공하므로 개발자는 복잡한 트랜잭션 관리 코드를 직접 작성하지 않아도 됩니다.

<br>

## 1.3 JdbcTemplate의 장점

- Jdbc를 직접 사용했을 때 직접 처리해야 하는 아래와 같은 부분들을 JdbcTemplate이 대신 처리해준다.
	- 커넥션 획득
	- statement 를 준비하고 실행
	- 결과를 반복하도록 루프를 실행
	- 커넥션 종료, statement , resultset 종료
	- 트랜잭션 다루기 위한 커넥션 동기화
	- 예외 발생시 스프링 예외 변환기 실행

<br>

## 1.4 JdbcTemplate의 단점

- 동적 SQL을 작성하기 어렵다.

<br>

# 2 사용 예시

```java
@Repository
public class UserDao {

    private final JdbcTemplate jdbcTemplate;

    public UserDao(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public void save(User user) {
        String sql = "INSERT INTO users (id, name, email) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, user.getId(), user.getName(), user.getEmail());
    }

	public User findById(Long id) {
	    String sql = "SELECT * FROM users WHERE id = ?";
	    return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(User.class), id);
	}
}
```

- 위 코드에서는 DataSource를 주입받아 JdbcTemplate을 초기화하고, save 메소드에서 update 메소드를 사용하여 사용자 정보를 데이터베이스에 저장합니다.
- SQL 문자열과 파라미터를 전달하는 것만으로 간단히 구현할 수 있습니다.
- queryForObject 메소드를 사용하여 하나의 사용자 정보를 조회합니다. 
- SQL 문자열과 RowMapper, 파라미터를 전달하면 JdbcTemplate이 내부적으로 JDBC API를 사용하여 데이터베이스에서 데이터를 가져오고, RowMapper를 통해 결과를 User 객체로 매핑합니다.

