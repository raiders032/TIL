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
  org.hibernate.type: trace
```

`spring.jpa.hibernate.ddl-auto`

* `create`: 애플리케이션 실행 시점에 테이블을 drop 하고, 다시 생성한다.

`spring.jpa.properties.show_sql`

* true: System.out 에 하이버네이트 실행 SQL을 남긴다

`spring.jpa.properties.format_sql`

* SQL을 보기 좋게 포맷팅 해준다

`logging.level.org.hibernate.SQL`

* logger를 통해 하이버네이트 실행 SQL을 남긴다

  `logging.level.org.hibernate.type`

* trace: 바인딩된 파라미터를 보여준다 

# 쿼리 파라미터 로그 남기기

**의존성 추가**

```groovy
implementation 'com.github.gavlyukovskiy:p6spy-spring-boot-starter:1.5.6'
```

[라이브러리](https://github.com/gavlyukovskiy/spring-boot-data-source-decorator)

> 쿼리 파라미터를 로그로 남기는 외부 라이브러리는 시스템 자원을 사용하므로, 개발 단계에서는 편하 게 사용해도 된다. 하지만 운영시스템에 적용하려면 꼭 성능테스트를 하고 사용하는 것이 좋다.



# IntelliJ Gradle 대신에 자바로 바로 실행하기

* 최근 IntelliJ 버전은 Gradle로 실행을 하는 것이 기본 설정이다. 
* 이렇게 하면 실행속도가 느리다. 다음과 같이 변경하면 자바로 바로 실행하므로 좀 더 빨라진다.

1. Preferences Build,Execution,Deployment BuildTools Gradle
2. Build and run using: Gradle IntelliJ IDEA
3. Run tests using: Gradle IntelliJ IDEA



# 롬복 적용

1. Preferences plugin lombok 검색 실행 (재시작)
2. Preferences Annotation Processors 검색 Enable annotation processing 체크 (재시작)
3. 임의의 테스트 클래스를 만들고 @Getter, @Setter 확인

# Querydsl 설정

**build.gradle**

```groovy
plugins {
  id "com.ewerk.gradle.plugins.querydsl" version "1.0.10"
}

dependencies {
	implementation 'com.querydsl:querydsl-jpa'
}

def querydslDir = "$buildDir/generated/querydsl"

querydsl {
  jpa = true
  querydslSourcesDir = querydslDir
}

sourceSets {
	main.java.srcDir querydslDir
}

configurations {
	querydsl.extendsFrom compileClasspath
}

compileQuerydsl {
  options.annotationProcessorPath = configurations.querydsl
}
```