# 1 Dependencies

```groovy
dependencies {
  // h2 database
  runtimeOnly 'com.h2database:h2'
  // mysql driver
  runtimeOnly 'mysql:mysql-connector-java'
  // Spring Data JPA
  implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
}
```



# 2 데이터베이스 설정

**datasource 설정**

`spring.datasource.hikari.driver-class-name`

* JDBC 드라이버의 이름입니다. 기본적으로 URL을 기준으로 자동 탐지됩니다.



**스키마 자동 생성**

`spring.jpa.hibernate.ddl-auto`

* `true` : 스키마 자동 생성 활성화

`spring.jpa.hibernate.ddl-auto`

* `create`: 애플리케이션 실행 시점에 테이블을 drop 하고, 다시 생성한다.



## 2.1 h2 데이터베이스 설정

`spring.h2.console.enabled`

* true: h2 콘솔 사용하도록 설정



**h2 데이터 베이스 설정 예시**

```yml
spring:
  datasource:
    driver-class-name: org.h2.Driver
    url: jdbc:h2:mem:testdb;MODE=Oracle;
    username: sa
    password:
  h2:
    console:
      enabled: true
  jpa:
    hibernate:
      ddl-auto: create
    properties:
      hibernate:
        show_sql: true
        format_sql: true
        use_sql_comments: true
        highlight_sql: true
logging:
  level:
    org:
      hibernate:
        type: trace
```



# 3 쿼리 로그

```yml
logging:
  level:
    org:
      hibernate:
        SQL: trace # logger를 통해 하이버네이트 실행 SQL을 남긴다
        type:
          descriptor:
            sql: trace # 바인딩된 파라미터를 보여준다 
 spring:
   jpa:
     properties:
      hibernate:
      	show_sql: true # system.out 에 하이버네이트 실행 SQL을 남긴다
        format_sql: true # SQL을 보기 좋게 포맷팅 해준다
        use_sql_comments: false # 추가적인 주석 표시하기
        highlight_sql: true # True인 경우 ANSI 이스케이프 코드를 통해 구문 강조 표시가 있는 SQL을 출력
```



**spring.jpa.properties.show_sql**

* true: System.out 에 하이버네이트 실행 SQL을 남긴다

```
Hibernate: insert into user_book (created_at, updated_at, balance, version) values (?, ?, ?, ?)
```



**spring.jpa.properties.format_sql**

* SQL을 보기 좋게 포맷팅 해준다

```
Hibernate: 
    insert 
    into
        user_book
        (created_at, updated_at, balance, version) 
    values
        (?, ?, ?, ?)
```



**logging.level.org.hibernate.SQL**

* trace: logger를 통해 하이버네이트 실행 SQL을 남긴다

```
2022-03-30 13:57:31.852 DEBUG 4937 --- [nio-8080-exec-1] org.hibernate.SQL                        : 
    insert 
    into
        user_book
        (created_at, updated_at, balance, version) 
    values
        (?, ?, ?, ?)
```



**spring.jpa.properties.hibernate.highlight_sql**

* True인 경우 ANSI 이스케이프 코드를 통해 구문 강조 표시가 있는 SQL을 출력



**spring.jpa.properties.hibernate.use_sql_comments**

* 추가적인 주석 표시하기
* Querydsl를 사용할 때 생성되는 jpql을 보고싶다면 이 옵션을 상용하자

```
[Hibernate] 
    /* insert com.tmax.commerce.pay.core.money.domain.transaction.book.UserBook
        */ insert 
        into
            user_book
            (created_at, updated_at, balance, version) 
        values
            (?, ?, ?, ?)
```



**logging.level.org.hibernate.type**

* trace: 바인딩된 파라미터를 보여준다 

```
2022-03-30 14:00:02.351 DEBUG 4959 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    insert 
    into
        user_book
        (created_at, updated_at, balance, version) 
    values
        (?, ?, ?, ?)
2022-03-30 14:00:02.352 TRACE 4959 --- [nio-8080-exec-2] o.h.type.descriptor.sql.BasicBinder      : binding parameter [1] as [TIMESTAMP] - [2022-03-30T14:00:02.342786]
2022-03-30 14:00:02.354 TRACE 4959 --- [nio-8080-exec-2] o.h.type.descriptor.sql.BasicBinder      : binding parameter [2] as [TIMESTAMP] - [2022-03-30T14:00:02.342786]
2022-03-30 14:00:02.354 TRACE 4959 --- [nio-8080-exec-2] o.h.type.descriptor.sql.BasicBinder      : binding parameter [3] as [BIGINT] - [0]
2022-03-30 14:00:02.354 TRACE 4959 --- [nio-8080-exec-2] o.h.type.descriptor.sql.BasicBinder      : binding parameter [4] as [BIGINT] - [0]
```



**logging.level.org.hibernate.type.descriptor.sql**

* trace: 파라미터 바인딩 값 보여주기

```
[Hibernate] 
    insert 
    into
        user_book
        (created_at, updated_at, balance, version) 
    values
        (?, ?, ?, ?)
2022-03-30 14:05:20.948 TRACE 5001 --- [nio-8080-exec-2] o.h.type.descriptor.sql.BasicBinder      : binding parameter [1] as [TIMESTAMP] - [2022-03-30T14:05:20.938497]
2022-03-30 14:05:20.949 TRACE 5001 --- [nio-8080-exec-2] o.h.type.descriptor.sql.BasicBinder      : binding parameter [2] as [TIMESTAMP] - [2022-03-30T14:05:20.938497]
2022-03-30 14:05:20.950 TRACE 5001 --- [nio-8080-exec-2] o.h.type.descriptor.sql.BasicBinder      : binding parameter [3] as [BIGINT] - [0]
2022-03-30 14:05:20.950 TRACE 5001 --- [nio-8080-exec-2] o.h.type.descriptor.sql.BasicBinder      : binding parameter [4] as [BIGINT] - [0]
```



## 3.1 쿼리 파라미터 로그 남기기

**의존성 추가**

* 스프링 부트를 사용하면 이 라이브러리만 추가하면 된다.

```groovy
implementation 'com.github.gavlyukovskiy:p6spy-spring-boot-starter:1.5.6'
```

[라이브러리](https://github.com/gavlyukovskiy/spring-boot-data-source-decorator)

> 쿼리 파라미터를 로그로 남기는 외부 라이브러리는 시스템 자원을 사용하므로, 개발 단계에서는 편하게 사용해도 된다. 하지만 운영시스템에 적용하려면 꼭 성능테스트를 하고 사용하는 것이 좋다.



**적용 후 로그**

```
[Hibernate] 
    insert 
    into
        user_book
        (created_at, updated_at, balance, version) 
    values
        (?, ?, ?, ?)
2022-03-30 14:06:58.334  INFO 5018 --- [nio-8080-exec-2] p6spy                                    : #1648616818334 | took 2ms | statement | connection 3| url jdbc:mysql://localhost:3306/money?useSSL=false&allowPublicKeyRetrieval=true&characterEncoding=UTF-8&serverTimezone=UTC
insert into user_book (created_at, updated_at, balance, version) values (?, ?, ?, ?)
insert into user_book (created_at, updated_at, balance, version) values ('2022-03-30T14:06:58.319+0900', '2022-03-30T14:06:58.319+0900', 0, 0);
```



# 4 IntelliJ Gradle 대신에 자바로 바로 실행하기

* 최근 IntelliJ 버전은 Gradle로 실행을 하는 것이 기본 설정이다. 
* 이렇게 하면 실행속도가 느리다. 다음과 같이 변경하면 자바로 바로 실행하므로 좀 더 빨라진다.

1. Preferences Build,Execution,Deployment BuildTools Gradle
2. Build and run using: Gradle IntelliJ IDEA
3. Run tests using: Gradle IntelliJ IDEA



# 5 롬복 적용

1. Preferences plugin lombok 검색 실행 (재시작)
2. Preferences Annotation Processors 검색 Enable annotation processing 체크 (재시작)
3. 임의의 테스트 클래스를 만들고 @Getter, @Setter 확인



# 6 Querydsl 설정

**build.gradle**

* dependencies
  * querydsl-apt: Querydsl 관련 코드 생성 기능 제공 
  * querydsl-jpa: querydsl 라이브러리

```groovy
plugins {
    id 'org.springframework.boot' version '2.6.1'
    id 'io.spring.dependency-management' version '1.0.11.RELEASE'
    id 'java'
    id "com.ewerk.gradle.plugins.querydsl" version "1.0.10"
}

group = 'kr.co.tmax'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '11'

configurations {
    compileOnly {
        extendsFrom annotationProcessor
    }
}

repositories {
    mavenCentral()
}

dependencies {
    runtimeOnly 'com.h2database:h2'
    runtimeOnly 'mysql:mysql-connector-java'

    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-oauth2-client'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'com.querydsl:querydsl-jpa'
    implementation 'com.querydsl:querydsl-apt'
    implementation 'io.jsonwebtoken:jjwt:0.9.1'
    implementation 'org.glassfish.jaxb:jaxb-runtime'

    compileOnly 'org.projectlombok:lombok'

    annotationProcessor 'org.projectlombok:lombok'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.security:spring-security-test'
}

test {
    useJUnitPlatform()
}

def querydslDir = "$buildDir/generated/querydsl"

querydsl {
    library = "com.querydsl:querydsl-apt"
    jpa = true
    querydslSourcesDir = querydslDir
}

sourceSets {
    main {
        java {
            srcDirs = ['src/main/java', querydslDir]
        }
    }
}

compileQuerydsl{
    options.annotationProcessorPath = configurations.querydsl
}

configurations {
    querydsl.extendsFrom compileClasspath
}
```

**JPAQueryFactory 스프링 빈 등록**

```java
@Configuration
public class JpaConfig {

    @PersistenceContext
    private EntityManager entityManager;

    @Bean
    JPAQueryFactory jpaQueryFactory() {
        return new JPAQueryFactory(entityManager);
    }
}
```

**JPAQueryFactory 사용하기**

```java
@Repository
public class MemberJpaRepository {
  private final JPAQueryFactory queryFactory;

  public List<Member> findAll_Querydsl() {
    return queryFactory
      .selectFrom(member).fetch();
  }
  
  public List<Member> findByUsername_Querydsl(String username) {
    return queryFactory
      .selectFrom(member)
      .where(member.username.eq(username))
      .fetch();
  }
}
```

> 동시성 문제는 걱정하지 않아도 된다. 왜냐하면 여기서 스프링이 주입해주는 엔티티 매니저는 실제 동작 시점에 진짜 엔티티 매니저를 찾아주는 프록시용 가짜 엔티티 매니저이다. 이 가짜 엔티티 매니저는 실제 사용 시점에 트랜잭션 단위로 실제 엔티티 매니저(영속성 컨텍스트)를 할당해준다.



참고

* [Spring Boot Data Jpa 프로젝트에 Querydsl 적용하기 - 기억보단 기록을](https://jojoldu.tistory.com/372)



# 7 OSIV 비활성화

* 성능상 OSIV를 끄는 것이 좋다
* 고객 서비스의 실시간 API는 OSIV를 끄고, ADMIN 처럼 커넥션을 많이 사용하지 않는 곳에서는 OSIV를 키는 편이 좋다
* [OSIV.md](../OSIV/OSIV.md) 참고

```yml
spring:
	jpa:
		open-in-view: false
```

