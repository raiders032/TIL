# 1 JdbcTemplate

- [레퍼런스](https://docs.spring.io/spring-framework/reference/data-access/jdbc/core.html#jdbc-JdbcTemplate)
- JdbcTemplate은 spring-jdbc 라이브러리에 포함되어 있는데, 이 라이브러리는 스프링으로 JDBC를 사용할 때 기본으로 사용되는 라이브러리이다.
- JdbcTemplate를 사용하면 개발자는 SQL을 작성하고, 전달할 파리미터를 정의하고, 응답 값을 매핑하기만 하면 된다.

<br>

## 1.1 JdbcTemplate의 장점

- Jdbc를 직접 사용했을 때 직접 처리해야 하는 아래와 같은 부분들을 JdbcTemplate이 대신 처리해준다.
	- 커넥션 획득
	- statement 를 준비하고 실행
	- 결과를 반복하도록 루프를 실행
	- 커넥션 종료, statement , resultset 종료
	- 트랜잭션 다루기 위한 커넥션 동기화
	- 예외 발생시 스프링 예외 변환기 실행

<br>

## 1.2 JdbcTemplate의 단점

- 동적 SQL을 작성하기 어렵다.