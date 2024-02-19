# Servlet Applications Architecture

* Servlet 기반의 애플리케이션에서 스프링 시큐리티의 아키텍쳐를 알아보자
* [레퍼런스](https://docs.spring.io/spring-security/reference/servlet/architecture.html)



# 1 Filters

* 클라이언트가 애플리케이션에 요청을 보내면 컨테이너는 필터 체인을 만든다.
  * [Servlet-Filter.md](../../../WEB/Servlet/Servlet-Filter/Servlet-Filter.md) 참고

* 필터 체인은 필터와 서블릿으로 구성된다.
  * Spring MVC application에서  `Servlet`은 `DispatcherServlet`이다.
  * 서블릿은 최대 하나이고 필터 하나 이상 가능하다.
* 필터와 서블릿은 HttpServletRequest 처리한다.



**Picture**

![filterchain](filterchain.png)

- 필터 체인은 필터와 서블릿으로 구성된다.



## 1.1 Filter의 기능

* HttpServletResponse를 write함으로써 해당 필터 이후의 필터 혹은 서블릿을 호출하지 않고 응답을 줄 수 있다.
* HttpServletRequest 또는 HttpServletResponse를 수정해서 다음 필터 또는 서블릿으로 전달할 수 있다.
  * 따라서 필터는 이후  필터 또는 서블릿에 영향을 미치며 순서가 중요하다.



**Example 1. FilterChain Usage Example**

```java
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
		// do something before the rest of the application
  	// request와 response를 수정해서 다음 필터 혹은 서블릿을 호출 할 수 있다.
    chain.doFilter(request, response); // invoke the rest of the application
    // do something after the rest of the application
}
```



# 2 DelegatingFilterProxy

* 일반적인 서블릿 필터
* 서블릿 필터 처리를 스프링 빈으로 위임하는 역할을 하는 필터
* 아래서 설명하는 [FilterChainProxy](#3 filterchainproxy)라는 빈으로 필터 처리를 위임한다.



**Picture**


![delegatingfilterproxy](DelegatingFilterProxy.png)

- 필터 체인은 필터와 서블릿으로 구성된다.
- DelegatingFilterProxy는 필터다.
- DelegatingFilterProxy는 내부에 가지고 있는 스프링 빈(Bean Filter0)에게 처리를 위임한다.





**DelegatingFilterProxy Pseudo Code**

- DelegatingFilterProxy는 애플리케이션 컨텍스트에서 someBeanName 빈을 찾아 처리를 위임한다.

```java
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
	// Lazily get Filter that was registered as a Spring Bean
	// For the example in DelegatingFilterProxy 
  // delegate is an instance of Bean Filter0
	Filter delegate = getFilterBean(someBeanName);
	// delegate work to the Spring Bean
	delegate.doFilter(request, response);
}
```



# 3 FilterChainProxy

* 스프링 시큐리티가 제공하는 필터를 호출하는 역할
  * 여러개의 [SecurityFilterChain](#4-securityfilterchain)들을 가지고 있어 요청에 따라 어떤 [SecurityFilterChain](#4-securityfilterchain)을 적용할지 결정한다.
  * 따라서 스프링 시큐리티와 관련해서 디버깅이 필요한 경우 **FilterChainProxy**가 좋은 시작 위치이다.
* **FilterChainProxy**는 빈이고 [DelegatingFilterProxy](#2-delegatingfilterproxy)라는 필터가 감싸는 형태이다
* `WebSecurity`가 **FilterChainProxy**를 만든다
* `WebSecurity`를 커스터마이징 하기 위해 `WebSecurityConfigurerAdapter`를 사용한다.
* 즉 `WebSecurityConfigurerAdapter`를 통해 `FilterChainProxy`를 관리할 수 있다.



**Picture**

![filterchainproxy](FilterChainProxy.png)

- 필터 체인은 필터와 서블릿으로 구성된다.
- DelegatingFilterProxy는 필터다.
- DelegatingFilterProxy는 내부에 가지고 있는 스프링 빈(FilterChainProxy)에게 처리를 위임한다.
- FilterChainProxy는 여러개의 SecurityFilterChain들을 가지고 있어 요청에 따라 어떤 SecurityFilterChain을 적용할지 결정한다.



# 4 [SecurityFilterChain](https://docs.spring.io/spring-security/reference/servlet/architecture.html#servlet-securityfilterchain)

* [FilterChainProxy](#3 filterchainproxy)는 여러개의 [SecurityFilterChain](#4-securityfilterchain)들을 가지고 있어 요청에 따라 어떤 [SecurityFilterChain](#4-securityfilterchain)을 적용할지 결정한다.
* 시큐리티 설정 정보를 통해 어떤 필터 체인을 호출해야 할지 결정



**Picture**

![multi securityfilterchain](multi-securityfilterchain.png)

- 필터 체인은 필터와 서블릿으로 구성된다.
- DelegatingFilterProxy는 필터다.
- DelegatingFilterProxy는 내부에 가지고 있는 스프링 빈(FilterChainProxy)에게 처리를 위임한다.
- FilterChainProxy는 여러개의 SecurityFilterChain들을 가지고 있어 요청에 따라 어떤 SecurityFilterChain을 적용할지 결정한다.
- 여러개의 SecurityFilterChain을 가지고 있을 경우 처음으로 매칭되는 SecurityFilterChain가 호출된다.
  - `/api/messages/` 패스로 요청하면 SecurityFilterChain(0)이 호출된다
    - SecurityFilterChain(n)도 조건을 충족하지만 가장 먼저 매칭되는 SecurityFilterChain(0)만 호출된다
  - `/messages/`로 호출하면 SecurityFilterChain(n)이 호출된다.



# 5 SecurityFilter

* SecurityFilter는 SecurityFilterChain에 삽입해 SecurityFilterChain을 만들 수 있다.
* 스프링 시큐리티가 제공하는 SecurityFilter 목록
* **SecurityFilter** 각각은 빈이다.



**주요 SecurityFilter**

1. WebAsyncManagerIntergrationFilter
2. SecurityContextPersistenceFilter
3. HeaderWriterFilter
4. CsrfFilter
5. LogoutFilter
6. UsernamePasswordAuthenticationFilter
7. DefaultLoginPageGeneratingFilter
8. DefaultLogoutPageGeneratingFilter
9. BasicAuthenticationFilter
10. RequestCacheAwareFtiler
11. SecurityContextHolderAwareReqeustFilter
12. AnonymouseAuthenticationFilter
13. SessionManagementFilter
14. ExeptionTranslationFilter
15. FilterSecurityInterceptor



## 5.1 SecurityContextPersistenceFilter

* 여러 요청간에 SecurityContext를 공유하기위해 사용되는 `SecurityFilter`이다
* SecurityContextRepository를 사용해서 기존의 SecurityContext를 읽어오거나 초기화 한다.
* 기본으로 사용하는 전략은 HTTP Session을 사용한다.
* SecurityContext를 가져올 수 있다면 뒤에 필터를 생략할 수 있기 때문에 필터 목록 상위에 위치한다.



## 5.2 HeaderWriterFilter

* 응답 헤더에 시큐리티 관련 헤더를 추가해주는 `SecurityFilter`이다



## 5.3 CorsFilter



## 5.4 CsrfFilter

* CSRF 공격을 막아주는 `SecurityFilter`이다

* 의도한 사용자만 리소스를 변경할 수 있도록 허용하는 필터 CSRF 토큰을 사용하여 방지한다

* CORS를 사용할 때 특히 주의 해야함

  * 타 도메인에서 보내오는 요청을 허용하기 때문에

* 일반 사용자들이 브라우저를 통해 요청을 하는 경우에는 CSRF 방지를 사용하는 것이 좋다.

* JSP에서 스프링 MVC가 제공하는 `<form:form>` 태그 또는 타임리프 2.1+ 버전을 사용할 때 폼에

  CRSF 히든 필드가 기본으로 생성 됨.



## 5.5 LogoutFilter

* 여러 LogoutHandler를 사용하여 로그아웃시 필요한 처리를 하며 이후에는 LogoutSuccessHandler를 사용하여 로그아웃 후처리를 한다.
* LogoutHandler
  * CsrfLogoutHandler
  * SecurityContextLogoutHandler
* LogoutSuccessHandler
  * SimplUrlLogoutSuccessHandler

**설정 예시**

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http.logout()
      .logoutUrl("/logout")	//로그아웃을 처리하는 페이지 Url
      .logoutSuccessUrl("/")	//로그아웃 후 리다이렉트 Url
      .logoutRequestMatcher()
      .invalidateHttpSession(true)	// 기본값 true
      .deleteCookies()
      .addLogoutHandler()
      .logoutSuccessHandler();
}
```



## 5.6 UsernamePasswordAuthenticationFilter

* 폼 로그인을 처리하는 `SecurityFilter`이다

* 사용자가 폼에 입력한 username과 password로 Authentcation을 만들고 AuthenticationManager를 사용하여 인증을 시도한다.

* AuthenticationManager (ProviderManager)는 여러 AuthenticationProvider를 사용하여

  인증을 시도하는데, 그 중에 DaoAuthenticationProvider는 UserDetailsServivce를 사용하여 UserDetails 정보를 가져와 사용자가 입력한 password와 비교한다



## 5.7 DefaultLoginPageGeneratingFilter

* 기본 로그인 폼 페이지를 생성해주는 필터

**설정 예시**

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http.formLogin()
      .usernameParameter("my-username")
      .passwordParameter("my-password");
}
```

* 아래와 같이 사용자 정의 로그인 페이지를 사용하면 `DefaultLoginPageGeneratingFilter`와 `DefaultLogoutPageGeneratingFilter`가 등록되지 않는다.

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http.formLogin()
      .loginPage("/custom-login");
}
```



## 5.8 BasicAuthenticationFilter

* Basic 인증 처리하는 `SecurityFilter`이다
* Basic 인증이란?
  * 요청 헤더에 username와 password를 실어 보내면 브라우저 또는 서버가 그 값을 읽어서 인증하는 방식
  * 예) `Authorization: Basic QWxhZGRpbjpPcGVuU2VzYW1l`(아이디:비밀번호를 BASE 64 인코딩)
  * 보안에 취약하기 때문에 반드시 HTTPS를 사용할 것을 권장.

**설정 예시**

* BasicAuthenticationFilter를 사용하도록 설정

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http.httpBasic();
}
```



## 5.9 AnonymousAuthenticationFilter

* SecurityContext에 익명 Authentication을 넣어주는 `SecurityFilter`이다
* SecurityContext의 Authentication이 null이면  익명 Authentication을 만들어 넣어주고
* null이 아니면 아무일도 하지 않는다.

**설정 예시**

* 기본 익명 Authentication 객체를 설정

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http.anonymous() 
      .principal()
      .authorities() 
      .key();
}
```



## 5.10 SessionManagementFilter

* 세션 변조 방지 전략을 설정할 수 있다
  * none: 전략을 사용하지 않음
  * changeSessionId: 세션 아이디를 변경(기본값 서블릿 3.1이상)
* 동시성 제어전략을 설정 할 수 있다.
  * 추가 로그인을 막을지 여부 설정
* 세션 생성 전략(sessionCreationPolicy)을 설정할 수 있다.
  * IF_REQUIRED: 필요하면 만든다
  * NEVER: 스프링 시큐리티에서는 만들지 않는다. 하지만 이미 세션이 있다면 사용한다.
  * STATELESS: 세션을 사용하지 않는다
  * ALWAYS

**설정 예시**

* 세션 변조 방지 전략을 changeSessionId로 설정

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http.sessionManagement()
      .sessionFixation()
      .changeSessionId();
}
```

```java
// 최대 한명 로그인
http.sessionManagement().maximumSessions(1);
// 세션을 사용하지 않는다
http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
```



## 5.11 ExceptionTranslationFilter

* 필터 체인에서 발생하는 AccessDeniedException과 AuthenticationException을 처리하는 `SecurityFilter`이다

* AuthenticationException 발생 시

  - AuthenticationEntryPoint 실행
    - 유저가 인증할 수 있는 곳으로 보낸다.
  - AbstractSecurityInterceptor 하위 클래스(예, FilterSecurityInterceptor)에서 발생하는 예외만 처리.
  - 그렇다면 UsernamePasswordAuthenticationFilter에서 발생한 인증 에러는?

* AccessDeniedException 발생 시
  * 익명 사용자라면 AuthenticationEntryPoint 실행
  * 익명 사용자가 아니면 AccessDeniedHandler에게 위임


**설정 예시**

* AccessDeniedException 발생 시 보여줄 페이지를 설정

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
  http.exceptionHandling()
    .accessDeniedPage();
}
```



## 5.12 FilterSecurityInterceptor

* AccessDecisionManager를 사용하여 인가를 처리하는 `SecurityFilter`이다
  * 해당 리소스에 접근할 적절한 ROLE을 가지고 있는가 확인
* 대부분의 경우 FilterChainProxy에 제일 마지막 필터로 들어있다.

**설정 예시**

* `/`, `/info`, `/account/**`, `/signup` 은 모두 접근 가능
* `/admin` 은 ROLE_ADMIN을 가지고 있는 유저만 가능
* anyRequest().authenticated() 나머지 요청은 모두 인증 후 가능

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http.authorizeRequests()
      .mvcMatchers("/", "/info", "/account/**", "/signup").permitAll()
      .mvcMatchers("/admin").hasAuthority("ROLE_ADMIN")
      .mvcMatchers("/user").hasRole("USER") //ROLE_ 를 생략할 수 있다
      .anyRequest().authenticated();
}
```



## 5.13 RememberMeAuthenticationFilter

* 세션이 사라지거나 만료가 되더라도 쿠키 또는 DB를 사용하여 저장된 토큰 기반으로 인증을

  지원하는 `SecurityFilter`이다

**설정 예시**

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http.rememberMe() 
      .userDetailsService(accountService) 
      .key("remember-me-sample");
}
```



# 6 커스텀 필터 추가하기

* GenericFilterBean을 상속 받고 doFilter 메서드를 구현하면 쉽게 필터를 만들 수 있다.
* 커스텀 필터 추가하기
  * `http.addFilterAfter(new LoggingFilter(), UsernamePasswordAuthenticationFilter.class);`

**필터 예시**

```java
public class LoggingFilter extends GenericFilterBean {
    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start(((HttpServletRequest) request).getRequestURI());
        chain.doFilter(request, response);
        stopWatch.stop();
        logger.info(stopWatch.prettyPrint());
    }
}
```



참고

* https://docs.spring.io/spring-security/reference/servlet/architecture.html
