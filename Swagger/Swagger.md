# 1 디펜던시 설정

```groovy
implementation group: 'io.springfox', name: 'springfox-swagger2', version: '3.0.0'
```

**스프링 부트 이용시**

```groovy
implementation group: 'io.springfox', name: 'springfox-boot-starter', version: '3.0.0'
```



# 2 설정

* Docket 빈에 여러 가지 설정이 가능함
* RequestHandlerSelectors와 PathSelectors를 사용해서 원하는 핸들러를 선택할 수 있다
  * RequestHandlerSelectors: 패키지, 애노테이션을 기준으로 핸들러를 선택할 수 있다
  * PathSelectors: 핸들러의 URL를 antPattern 또는 정규표현식으로 핸들러를 선택할 수 있다



**설정 예시**

```java
@Configuration
public class SpringFoxConfig {                                    
  @Bean
  public Docket api() { 
    return new Docket(DocumentationType.SWAGGER_2)  
      .select()                                  
      .apis(RequestHandlerSelectors.any())              
      .paths(PathSelectors.any())                          
      .build();                                           
  }
}
```

