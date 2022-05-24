# 1 R2DBC

> The Reactive Relational Database Connectivity (R2DBC) project brings reactive programming APIs to relational databases.



## 1.1 리액티브 프로그래밍

* 리액티브 프로그래밍을 사용하려면 모든 과정이 리액티브여야 한다
* 웹 컨트롤러를 리액티브 방식으로 동작하게 만들고 서비스 계층도 리액티브 방식으로 동작하게 만들었는데 블로킹 방식으로 연결되는 데이터베이스를 호출하면 리액티브는 무너진다
* 리액터 기반 애플리케이션은 많은 수의 스레드를 가지고 있지 않으므로 데이터베이스 호출 후 블로킹되는 스레드가 많아지면 스레드가 모두 고갈돼서 결국 전체 애플리케이션이 데이터베이스로부터 결과를 기다리면서 아무런 일도 할 수 없는 상태가 된다
* 따라서 리액티브 프로그래밍에서 데이터베이스와의 물리적인 연결과 상호작용 과정에 비동기 논블로킹 개념을 적용할 수 있는 데이터베이스 드라이버가 필요한데 그것이 바로 R2DBC다



## 1.2 JDBC와 비교

* 자바에서 관계형 데이터베이스를 사용할 때 JDBC, JPA 기술을 주로 사용한다
* JPA와 JDBC는 블로킹 API다
* 트랜잭션을 시작하는 메시지를 전송하고 쿼리를 포함하는 메시지를 전송하고 결과가 나올 때 클라이언트에게 스트리밍해주는 개념 자체가 없다
* 모든 데이터베이스 호출은 응답을 받을 때까지 블로킹되어 기다려야한다
* JDBC, JPA를 감싸서 리액티브 스트림 계층에서 사용할 수 있게 숨겨진 내부 스레드 풀을 사용할 수 있지만 이는 반쪽자리 솔루션이다



**내부 스레드풀 사용의 문제점**

* 장비의 코어 수보다 많은 스레드를 사용하는 것의 거의 장점이 없다
* 4코어 장비에 100개의 스레드를 만들어 사용하면 컨텍스트 스위칭 오버헤드가 증가하고 효율이 급격히 떨어짐
* 실제로 비동기 논블로킹 방식으로 동작하는 단일 스레드 애플리케이션이 블로킹 방식으로 동작하면서 스레드 100개를 사용하는 애플리케이션보다 처리량이 더 높게 나온다는 사실이 자바스크립트 진영에서 입증되고 있다
* 내부 스레드풀을 사용하는 솔루션은 포화 지점에 도달하고 새 요청이 들어와도 스레드풀에 받아서 처리할 스레드가 없어 스레드 풀 자체도 블로킹된다

# 2 의존성

**build.gradle**

* mysql 사용

```groovy
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-r2dbc'
    implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
    implementation 'org.springframework.boot:spring-boot-starter-webflux'
    compileOnly 'org.projectlombok:lombok'
    runtimeOnly 'dev.miku:r2dbc-mysql'
    runtimeOnly 'mysql:mysql-connector-java'
    annotationProcessor 'org.projectlombok:lombok'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'io.projectreactor:reactor-test'
}
```



# 3 R2dbcEntityTemplate

* RDB 접근을 위해 로우 레벨의 JDBC를 직접 쓰기 보다는 JdbcTemplate을 사용하면 편리하다
  * 반복되는 코드를 줄여준다
  * 커넥션 조회, 커넥션 동기화, 쿼리 실행, 결과 바인딩, 예외 발생시 스프링 예외 변환기 실행, 리소스 종료 등
* RDB 접근을 위해 마찬가지로 R2DBC를 직접 쓰지 않고 `R2dbcEntityTemplate`을 이용한다
* 행과 POJO 간의 통합 객체 매핑을 사용하여 일반적인 R2DBC 작업을 수행할 때 생산성을 향상시키는 엔터티 바인딩 작업의 주요 클래스인 `R2dbcEntityTemplate`



## 3.1 커넥션

```java
ConnectionFactory connectionFactory = ConnectionFactories.get("r2dbc:mysql://localhost:3400/waplpay?options=DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE");
```



# 4 [R2DBC Repositories](https://docs.spring.io/spring-data/r2dbc/docs/1.2.2/reference/html/#r2dbc.repositories)



## 4.1 도메인 엔티티

* Spring Data R2DBC는 엔티티를 식별하는데 ID를 사용한다
* 엔티티의 ID는 반드시 @Id 애노테이션을 붙여야한다
  * `org.springframework.data.annotation.Id`
  * 데이터베이스가 auto-increment 컬럼을 가지고 있다면 테이블에 삽입 후 자동 생성된 ID를 엔티티에 세팅한다



```java
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("Persons")
public class Person {

  @Id
  private Long id;
  private String firstname;
  private String lastname;

  // … getters and setters omitted
}
```



## 4.2 Repository Interface

```java
public interface PersonRepository extends R2dbcRepository<Person, Long> {
  // additional custom query methods go here
}
```



## 4.3 R2DBC Repository 설정

```java
@Configuration
@EnableR2dbcRepositories
public class R2DBCConfig extends AbstractR2dbcConfiguration {

  @Override
  public ConnectionFactory connectionFactory() {
    return ...;
  }

}
```



참고

* https://r2dbc.io/