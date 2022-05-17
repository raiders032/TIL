# 1 Profiles

* Profiles을 사용하면 Configuration을 Profile 별로 분리해서 설정할 수 있다



## 1.1 @Profile을 사용하는 곳

* @Profile 애노테이션은 아래 3 가지 애노테이션이 붙은 곳에 사용할 수 있다
* @Component
* @Configuration
* @ConfigurationProperties



**예시**

* 프로파일이 `production`인 경우에만 활성화되는 Configuration은 아래와 같다

```java
@Configuration()
@Profile("production")
public class ProductionConfiguration {
}
```



# 2 Profile을 활성화 하는 법

* 만약 어떠한 Profile도 활성화되지 않으면 디폴트 Profile이 활성화 된다.
  * 디폴트 프로파일의 이름은 `default`다



## 2.1 apllication.properties를 수정

```properties
spring.profiles.active=production, hsqldb
```



## 2.2 인텔리제이에서 활성화 하는 법

* VM options = -Dspring.profiles.active=prod
* ![image-20210201140223461](./images/image-20210201140223461.png)



## 2.3 커멘드 라인을 이용하는 법

```bash
java -jar sprint1-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
```



# 3 활성화 Profiles 추가하기

* `spring.profiles.active`로 설정된 프로프티의 우선순위는 PropertySource 우선순위를 따른다
* 따라서 apllication.properties 파일에 설정한 프로파일을 커맨드 라인 아규먼트로 오버라이딩할 수 있다
* 만약 활성화 Profiles를 대체하는 것이 아니라 추가하고 싶다면 `spring.profiles.include`를 사용하라

> **주의**
>
> `spring.profiles.active`, `spring.profiles.include`는 프로파일이 지정되지 않은 파일에만 사용가능하다

**예시**

```properties
spring:
  profiles:
    active: local
    include: local1, local2
```

```
The following 3 profiles are active: "local1", "local2", "local"
```
