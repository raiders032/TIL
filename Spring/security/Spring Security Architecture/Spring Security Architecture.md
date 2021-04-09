# Servlet Security: The Big Picture



## 1. Filters

> 클라이언트가 요청을 하면, 컨테이너는 `FilterChain`을 만든다. `FilterChain`은 `Filter` 와 `Servlet` 을 포함하고 있다. Spring MVC application에서  `Servlet` 은 `DispatcherServlet` 의 인스턴스이다.

* 특정 `Filter`에서  `Filter` 또는 `Servlet`이 호출되는 것을 방지할 수 있다.
  * 이 경우 특정 `Filter`에서 HttpServletResponse 보낸다
* HttpServletRequest 또는 HttpServletResponse 을 수정해서 다음 `Filter`또는 `Servlet`으로 전달할 수 있다.
* 따라서 `Filter`는 이후  `Filter` 또는 `Servlet`에 영향을 미치며 순서가 중요하다.

![filterchain](images/filterchain.png)



### 1.1 DelegatingFilterProxy

* 일반적인 서블릿 필터
* 서블릿 필터 처리를 스프링에 들어있는 빈으로 위임하고 싶을 때 사용하는 서블릿 필터
* 스프링 부트 없이 스프링 시큐리티 설정할 때는 AbstractSecurityWebApplicationInitializer를 상속받아 등록.
* 스프링 부트를 사용할 때는 자동으로 등록 된다.

![securityfilterchain](images/securityfilterchain.png)



### 1.2 FilterChainProxy

* 스프링 시큐리티가 제공하는 필터를 호출하는 역할
* 스프링 시큐리티가 제공하는 SecurityFilterChain
  * WebAsyncManagerIntergrationFilter
  2. SecurityContextPersistenceFilter
  3. HeaderWriterFilter
  4. CsrfFilter
  5. LogoutFilter
  6. UsernamePasswordAuthenticationFilter
  6. DefaultLoginPageGeneratingFilter
  8. DefaultLogoutPageGeneratingFilter
  9. BasicAuthenticationFilter
  10. RequestCacheAwareFtiler
  11. SecurityContextHolderAwareReqeustFilter
  11. AnonymouseAuthenticationFilter
  13. SessionManagementFilter
  13. ExeptionTranslationFilter
  13. FilterSecurityInterceptor
13. WebSecurity가 FilterChainProxy를 만든다
13. WebSecurity를 커스터마이징 하기 위해 WebSecurityConfigurerAdapter를 사용한다.
13. 즉 WebSecurityConfigurerAdapter를 통해 FilterChainProxy를 관리할 수 있다.



### 1.3 SecurityFilterChain

* 클라이언트에서 요청이 들어오면 `FilterChainProxy`은 `SecurityFilterChain` 을 사용해서 어떤 `SecurityFilter` 필터를 호출해야 할지 결정한다. 
* 시큐리티 설정 정보를 통해 어떤 필터를 호출해야 할지 결정



#### SecurityContextPersistenceFilter

* 여러 요청간에 SecurityContext를 공유하기위해 사용되는 `SecurityFilter`이다
* SecurityContextRepository를 사용해서 기존의 SecurityContext를 읽어오거나 초기화 한다.
* 기본으로 사용하는 전략은 HTTP Session을 사용한다.
* SecurityContext를 가져올 수 있다면 뒤에 필터를 생략할 수 있기 때문에 필터 목록 상위에 위치한다.



#### HeaderWriterFilter

* 응답 헤더에 시큐리티 관련 헤더를 추가해주는 `SecurityFilter`이다



#### CsrfFilter

* CSRF 공격을 막아주는 `SecurityFilter`이다
* 의도한 사용자만 리소스를 변경할 수 있도록 허용하는 필터 CSRF 토큰을 사용하여 방지한다
* CORS를 사용할 때 특히 주의 해야함
  * 타 도메인에서 보내오는 요청을 허용하기 때문에
* 일반 사용자들이 브라우저를 통해 요청을 하는 경우에는 CSRF 방지를 사용하는 것이 좋다.



#### FilterSecurityInterceptor

* AccessDecisionManager를 사용하여 인가를 처리하는 `SecurityFilter`이다
  * 해당 리소스에 접근할 적절한 ROLE을 가지고 있는가 확인
* 대부분의 경우 FilterChainProxy에 제일 마지막 필터로 들어있다.



#### ExceptionTranslationFilter

* 필터 체인에서 발생하는 AccessDeniedException과 AuthenticationException을 처리하는 `SecurityFilter`이다

* AuthenticationException 발생 시

  - AuthenticationEntryPoint 실행
  - AbstractSecurityInterceptor 하위 클래스(예, FilterSecurityInterceptor)에서 발생하는 예외만 처리.
  - 그렇다면 UsernamePasswordAuthenticationFilter에서 발생한 인증 에러는?

* AccessDeniedException 발생 시

* - 익명 사용자라면 AuthenticationEntryPoint 실행
  - 익명 사용자가 아니면 AccessDeniedHandler에게 위임

* 

---



## 2. Authentication



### 2.1 SecurityContextHolder

* Spring Security’s authentication의 핵심이라 할 수 있으며 `SecurityContext` 을 가지고 있다.
* 기본적으로 ThreadLocal을 사용한다.
  * ThreadLocal은 하나의 Thread 내에 저장소라고 생각하면 된다.
  * 따라서 서비스와 리포지토리간에 메소드 파라미터 통헤 데이터를 넘겨주는 작업 없이 한 쓰레드 내에서 공용으로 사용할 수 있다.

![image-20201021221913460](images/SecurityContextHolder.png)



### 2.2 SecurityContext

* `SecurityContext` 는 `SecurityContextHolder` 로 부터 얻을 수 있다
*  `Authentication` 객체를 가지고 있다.



### 2.3 Authentication

* `Principal`, `GrantAuthority`, `Credentials` 제공
* `Principal`
  * 유저의 신원을 나타낸다.
  * username/password를 가지고 인증을 하는 경우 `UserDetails`의 인스턴스이다.
* `GrantAuthority`
  * `ROLE_USER`, `ROLE_ADMIN`등 `Principal`이 가지고 있는 권한을 나타낸다.
  * 인증 이후, 인가 및 권한 확인할 때 이 정보를 참조한다
* `Credentials`
  * 주로 비밀번호
  * 인증후 유출 방지를 위해 많은 경우 비어있다
* `Authentication`은 주로 두가지 용도로 쓰인다.
  * 현재 인증된 유저를 나타낸다. 현재 `Authentication` 은 `SecurityContext` 에서 얻을 수 있다. 
  * `AuthenticationManager` 의 인풋으로 사용된다. 



### 2.4 AuthenticationManager

* 스프링 시큐리티에서 인증(Authentication)은 AuthenticationManager가 한다.

* ```java
  package org.springframework.security.authentication;
  
  public interface AuthenticationManager {
      Authentication authenticate(Authentication authentication)
  			throws AuthenticationException;
  }
  ```

* `Authentication authenticate(Authentication authentication) throws AuthenticationException;`

  * 인자로 받은 Authentication이 유효한 인증인지 확인하고 Authentication 객체를 반환한다.
  * 인증을 확인하는 과정에서 비활성 계정, 잘못된 비번, 잠긴 계정 등의 에러를 던질 수 있다.

* 반환된 `Authentication`은`AuthenticationManager`를 호출한 controller(Security Filters)에서 `SecurityContextHolder`에 저장된다.  

* `AuthenticationManager`의 구현체는 많지만 가장 많이 사용되는 구현체는 `ProviderManager`이다.



### 2.5 ProviderManager

* `ProviderManager`는 `AuthenticationManager`의 가장 흔히 사용되는 구현체이다. 
* `ProviderManager`여러 `AuthenticationProvider`에게 작업을 위임한다. 
* 여러개의 `AuthenticationProvider`중 가장 적합한 `AuthenticationProvider`가 인증을 처리한다
* 적합한 `AuthenticationProvider`가 없을 경우 `ProviderNotFoundException`과 함께 인증은 실패한다. 

![image-20201021220422979](images/ProviderManager.png)



### 2.6 AuthenticationProvider

* 여러개의 `AuthenticationProvider`가 `ProviderManager`에 주입될 수 있다. 
* 각각의  `AuthenticationProvider`는 구체적인 형태의 인증을 수행한다. 
  * `DaoAuthenticationProvider`: 유저네임과 패스워드를 기반으로하는 인증
  *  `JwtAuthenticationProvider` : JWT token 인증을 수행한다. 



### 2.7 Username/Password Authentication

#### UserDetails

* `UserDetails` 은 `UserDetailsService` 의 반환 값이다. 
* `DaoAuthenticationProvider` 는 `UserDetails`을 인증하고 `Authentication` 을 반환한다. 

#### UserDetailsService

* 유저 정보를 UserDetails 타입으로 가져오는 DAO (Data Access Object) 인터페이스.
* `DaoAuthenticationProvider` 는 username, password를 가지고 인증을 하기위해 `UserDetailsService`를 사용해서 username, password 등을 조회한다. 

#### DaoAuthenticationProvider

* `AuthenticationProvider`구현체이다. `UserDetailsService` 와 `PasswordEncoder` 를 이용하여  username 과 password를 인증한다.

![daoauthenticationprovider](images/daoauthenticationprovider.png)

1. `UsernamePasswordAuthenticationToken` 을 `AuthenticationManager` 에게 건내준다.
2. ``AuthenticationManager` 의 구현체인 ProviderManager` 는 `DaoAuthenticationProvider` 타입의 `AuthenticationProvider` 를 사용하도록 설정되어 있다.
3. `DaoAuthenticationProvider` 는 `UserDetailsService` 를 사용해 `UserDetails` 을 찾는다.
4. `DaoAuthenticationProvider` 는 `PasswordEncoder` 를 사용해 `UserDetails` 의 password를 검증한다.
5. 검증이 성공적으로 완료되면 `UsernamePasswordAuthenticationToken` 타입의 `Authentication` 이 반환된다.
6. 최종적으로 `SecurityContextHolder` 에 `UsernamePasswordAuthenticationToken` 이 설정된다.



## AuthenticationManagerBuilder

* 사용자를 생성하고 권한을 부여한다.

```java
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    	@Override
    	public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
      	  authenticationManagerBuilder
        	        .userDetailsService(customUserDetailsService)
          	      .passwordEncoder(passwordEncoder());
    	}
    }
```

