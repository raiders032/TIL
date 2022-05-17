# 1 Externalized Configuration

* 스프링 부트는 외부에서 환경을 설정할 수 있다
* 따라서 같은 어플리케이션을 다른 환경으로 동작시킬 수 있다.



## 1.1 사용할 수 있는 외부 설정

* Java properties files
* YAML files
* 환경 변수
* 커맨드 라인 아규먼트



## 1.2 Property 접근하기

* 설정 된 Property 값을 접근하는 방식에는 3 가지가 있다
* `@Value` 애노테이션 사용해서 빈 필드에 직접 주입 받기

```java
@Component
public class MyBean {

  @Value("${name}")
  private String name;

  // ...

}
```

* Environment
* `@ConfigurationProperties` 애노테이션 사용해서 객체에 바인딩 후 사용하기
  *  [Type-Safe-Configuration-Properties.md](../Type-Safe-Configuration-Properties/Type-Safe-Configuration-Properties.md) 참고



## 1.3 프로퍼티 소스 우선순위

> 스프링 부트는 다양한 외부 설정 소스를 가지고 있기 때문에 특정한 `PropertySource` 에 대한 우선순위를 가지고 있다. 따라서 상위 아이템이 하위 아이템을 덮어 쓴다.



**프로퍼티 소스 우선순위**

1. 유저 홈 디렉토리에 있는 spring-boot-dev-tools.properties
2. 테스트에 있는 @TestPropertySource
3. @SpringBootTest 애노테이션의 properties 애트리뷰트
4. 커맨드 라인 아규먼트
5. SPRING_APPLICATION_JSON (환경 변수 또는 시스템 프로티) 에 들어있는 프로퍼티
6. ServletConfig 파라미터
7. ServletContext 파라미터
8. java:comp/env JNDI 애트리뷰트
9. System.getProperties() 자바 시스템 프로퍼티
10. OS 환경 변수
11. RandomValuePropertySource
12. **Config data `application.properties` 파일**
16. @PropertySource
17. 기본 프로퍼티 (SpringApplication.setDefaultProperties)



**컨피그 데이터 파일 우선순위**

* YAML 파일도 properties와 마찬가지

1. JAR 밖에 있는 `application-{profile}.properties`
2. JAR 밖에 있는 `application.properties`
3. JAR 안에 있는 `application-{profile}.properties`
4. JAR 안에 있는 `application.properties`



# 2 Command Line Properties

* 기본으로 커맨드 라인 옵션 아규먼트를 프로퍼티로 변환하여 spring `Environment`에 추가한다
  * `package org.springframework.core.env.Environment`
  * 커맨드 라인 옵션 아규먼트 예시 `--spring.profiles.active=dev,hsqldb`
* 커맨드 라인 프로퍼티는 컨피그 데이터 파일(application.properties) 보다 우선순위가 높다
* 커맨드 라인 프로퍼티가 Environment에 추가되길 원치 않는다면 아래의 코드를 실행
  * `SpringApplication.setAddCommandLineProperties(false)`



# 3 [External Application Properties](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config.files)



## 3.1 [Profile Specific Files](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config.files.profile-specific)

* 스프링 부트는 `application.properties` 파일 뿐만 아니라 Profile이 명시된 `application-{profile}.properties` 파일도 프로퍼티 소스로 사용한다.
* 예를 들어 `prod` 라는 Profile이 활성화 되어있으면 `application.yml` , `application-prod.yml` 둘다 사용된다.
* Profile이 명시된 컨피그 데이터 파일이 우선순위가 높다
* 여러 Profile이 활성화되어 있다면 last-wins 전략에 따른다
  * 예를 들면 `spring.profiles.active=prod,live` 같이 두 Profile이 활성화 되어있다면 `live` 프로파일이 우선순위가 높다



### 3.1.1 예시

**application.yml**

```yml
spring:
  profiles:
    active: test1, test2
A: default-A
B: default-B
```

**application-test1.yml**

```yml
A: test1-A
C: test1-C
```

**application-test2.yml**

```yml
C: test2-C
```

**Test**

* A: 프로파일이 지정된 컨피그 데이터 파일이 우선순위가 더 높으므로 `default-A` 를 `test1-A` 가 오버라이딩
* B: 오바라이딩된 값이 없기 때문에 `default-B`
* C: 여러 Profile이 활성화되어 있다면 last-wins 전략에 따라 test2가 더 우선순위가 높음

```java
@Test
void test() {
  assertThat(environment.getProperty("A")).isEqualTo("test1-A");
  assertThat(environment.getProperty("B")).isEqualTo("default-B");
  assertThat(environment.getProperty("C")).isEqualTo("test2-C");
}
```

