# 기본 설정

```yml
spring:
  datasource:
    url: jdbc:h2:tcp://localhost/~/jpashop
    username: sa
    password:
    driver-class-name: org.h2.Driver
  jpa:
    hibernate:
      ddl-auto: create
    properties:
      hibernate:
        show_sql: true
        format_sql: true
logging.level:
  org.hibernate.SQL: debug

```

`spring.jpa.hibernate.ddl-auto`

* create: 애플리케이션 실행 시점에 테이블을 drop 하고, 다시 생성한다.

`spring.jpa.properties.show_sql`

* true: System.out 에 하이버네이트 실행 SQL을 남긴다

`logging.level.org.hibernate.SQL`

* logger를 통해 하이버네이트 실행 SQL을 남긴다



# 쿼리 파라미터 로그 남기기

**의존성 추가**

```groovy
implementation 'com.github.gavlyukovskiy:p6spy-spring-boot-starter:1.5.6'
```

[라이브러리](https://github.com/gavlyukovskiy/spring-boot-data-source-decorator)

> 쿼리 파라미터를 로그로 남기는 외부 라이브러리는 시스템 자원을 사용하므로, 개발 단계에서는 편하 게 사용해도 된다. 하지만 운영시스템에 적용하려면 꼭 성능테스트를 하고 사용하는 것이 좋다.