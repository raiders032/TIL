# WebSecurity 설정



## 정적 자원에 필터 적용하지 않기

* WebSecurity의 ignoring()을 사용해서 시큐리티 필터 적용을 제외할 요청을 설정할 수 있다.
* 스프링 부트가 제공하는 PathRequest를 사용해서 정적 자원 요청을 스프링 시큐리티 필터를 적용하지 않도록 설정.
* 동적 리소스는 http.authorizeRequests()에서 처리하는 것을 권장한다
* 인증이 필요한 정적자원이 있는 경우는 http.authorizeRequests()를 사용할 수 있습니다

```java
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().requestMatchers(PathRequest.toStaticResources().atCommonLocations());
    }
}
```

