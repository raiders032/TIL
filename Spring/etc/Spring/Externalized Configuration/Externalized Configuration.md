### 외부 설정

> 스프링 부트는 외부에서 환경을 설정할 수 있도록 돕는다. 따라서 같은 어플리케이션을 다른 환경으로 동작시킬 수 있다.



#### 사용할 수 있는 외부 설정

* Java properties files
* YAML files
* 환경 변수
* 커맨드 라인 아규먼트



#### 프로퍼티의 우선순의

> 스프링 부트는 다양한 외부 설정 소스를 가지고 있기 때문에 특정한 `PropertySource` 에 대한 우선순위를 가지고 있다. 따라서 상위 아이템이 하위 아이템을 덮어 쓴다.

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
12. JAR 밖에 있는 특정 프로파일용 application properties
13. JAR 안에 있는 특정 프로파일용 application properties
14. JAR 밖에 있는 application properties
15. JAR 안에 있는 application properties
16. @PropertySource
17. 기본 프로퍼티 (SpringApplication.setDefaultProperties)



### Type-safe Configuration Properties

> `@Value("${property}")` 를 사용해서 프로퍼티를 주입하는 것은 번거롭다.  특히 많은 프로퍼티를 다룰 때 사용할 수 있는 대안이 있다.



#### @ConfigurationProperties

* 여러 프로퍼티를 묶어서 읽어올 수 있음

* 빈으로 등록해서 다른빈에 주입할 수 있음

  * @EnableConfigurationProperties
  * @Component
  * @Bean

* 융통성 있는 바인딩

  - context-path (케밥)

  - context_path (언드스코어)

  - contextPath (캐멀)

  - CONTEXTPATH

  - ```properties
    # 다 가능하다
    nys.full-name=NohYoungSam
    nys.full_name=NohYoungSam
    nys.fullName=NohYoungSam
    ```

* 프로퍼티 타입 컨버전

  * @DurationUnit

* 프로퍼티 값 검증

  * @Validated
  * JSR-303 (@NotNull, ...)

* 메타정보생성

*  @Value와 차이점

  * SpEL 을 사용할 수 있지만...
  * 위에 있는 기능들은 전부 사용 못합니다.

예시

```java
package com.example;

import java.net.InetAddress;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("acme")
public class AcmeProperties {

    private boolean enabled;

    private InetAddress remoteAddress;

    private final Security security = new Security();

    public boolean isEnabled() { ... }

    public void setEnabled(boolean enabled) { ... }

    public InetAddress getRemoteAddress() { ... }

    public void setRemoteAddress(InetAddress remoteAddress) { ... }

    public Security getSecurity() { ... }

    public static class Security {

        private String username;

        private String password;

        private List<String> roles = new ArrayList<>(Collections.singleton("USER"));

        public String getUsername() { ... }

        public void setUsername(String username) { ... }

        public String getPassword() { ... }

        public void setPassword(String password) { ... }

        public List<String> getRoles() { ... }

        public void setRoles(List<String> roles) { ... }

    }
}
```



### 빈으로 등록하기

> 스프링 부트는 @ConfigurationProperties의 타입을 바인딩하고 빈으로 등록해주는 기능을 인프라를 가지고있다. 즉 오토스캔을 통해 자동적으로 빈으로 등록된다.



#### @EnableConfigurationProperties()

> `@ConfigurationProperties` 가 쓰인 클래스가 오토 스캔이 안될 경우에 `@EnableConfigurationProperties`  을 사용해 직접 명시할 수 있다. 

**예시**

* `@Configuration` 애노테이션과 함께 쓰인다.

```java
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(AcmeProperties.class)
public class MyConfiguration {
}
```



### 사용하기

```yaml
acme:
    remote-address: 192.168.1.1
    security:
        username: admin
        roles:
          - USER
          - ADMIN

```

```java
@Service
public class MyService {

    private final AcmeProperties properties;

    @Autowired
    public MyService(AcmeProperties properties) {
        this.properties = properties;
    }

    //...

    @PostConstruct
    public void openConnection() {
        Server server = new Server(this.properties.getRemoteAddress());
        // ...
    }

}
```



참고

* https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-profiles
* [Spring boot + Spring Profile을 이용한 환경 별 자원 이용](https://ratseno.tistory.com/67)

