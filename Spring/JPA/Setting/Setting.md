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



# 2 기본 설정

**datasource 설정**

`spring.datasource.hikari.driver-class-name`

* JDBC 드라이버의 이름입니다. 기본적으로 URL을 기준으로 자동 탐지됩니다.



**스키마 자동 생성**

`spring.jpa.hibernate.ddl-auto`

* `true` : 스키마 자동 생성 활성화

`spring.jpa.hibernate.ddl-auto`

* `create`: 애플리케이션 실행 시점에 테이블을 drop 하고, 다시 생성한다.



**SQL 로그 관련**

`spring.jpa.properties.show_sql`

* true: System.out 에 하이버네이트 실행 SQL을 남긴다

`spring.jpa.properties.format_sql`

* SQL을 보기 좋게 포맷팅 해준다

`logging.level.org.hibernate.SQL`

* logger를 통해 하이버네이트 실행 SQL을 남긴다

`logging.level.org.hibernate.type`

* trace: 바인딩된 파라미터를 보여준다 

`spring.jpa.properties.hibernate.use_sql_comments`

* true: 실행되는 JPQL을 볼 수 있다.

`spring.jpa.properties.hibernate.highlight_sql`

* True인 경우 ANSI 이스케이프 코드를 통해 구문 강조 표시가 있는 SQL을 출력

`spring.jpa.properties.hibernate.use_sql_comments`

* 추가적인 주석 표시하기

`logging.level.org.hibernate.type.descriptor.sql`

* trace: 파라미터 바인딩 값 보여주기



**h2 관련**

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



# 3 쿼리 파라미터 로그 남기기

**의존성 추가**

```groovy
implementation 'com.github.gavlyukovskiy:p6spy-spring-boot-starter:1.5.6'
```

[라이브러리](https://github.com/gavlyukovskiy/spring-boot-data-source-decorator)

> 쿼리 파라미터를 로그로 남기는 외부 라이브러리는 시스템 자원을 사용하므로, 개발 단계에서는 편하 게 사용해도 된다. 하지만 운영시스템에 적용하려면 꼭 성능테스트를 하고 사용하는 것이 좋다.



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
@Bean
JPAQueryFactory jpaQueryFactory(EntityManager em) {
  return new JPAQueryFactory(em);
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