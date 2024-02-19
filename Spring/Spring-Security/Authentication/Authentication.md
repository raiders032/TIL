# [Servlet Authentication Architecture](https://docs.spring.io/spring-security/reference/servlet/authentication/index.html)

# 1 [SecurityContextHolder](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-securitycontextholder)

- Spring Security’s authentication의 핵심이라 할 수 있으며 [SecurityContext](#2-securitycontext)을 가지고 있다.
- **SecurityContextHolder** 는 스프링 시큐리티가 인증된 사용자의 세부 정보를 보관하는 곳이다.
- 스프링 시큐리티는 **SecurityContextHolder** 에 사용자 정보가 어떻게 저장되었는지 신경쓰지 않고 정보를 담고 있다면 사용자가 인증되었다고 간주한다.
  - 따라서 한 유저를 인증하기 위한 가장 쉬운 방법으로 **SecurityContextHolder** 사용자 세부 정보를 직접적으로 저장하는 것이다.
- **SecurityContextHolder**는 기본적으로 ThreadLocal을 사용한다.
  - ThreadLocal은 하나의 Thread 내에 저장소라고 생각하면 된다.
  - 따라서 서비스와 리포지토리간에 메소드 파라미터 통헤 데이터를 넘겨주는 작업 없이 한 쓰레드 내에서 공용으로 사용할 수 있다.

![image-20201021221913460](Spring/Spring-Security/Authentication/images/SecurityContextHolder.png)

**예시**

* SecurityContextHolder 세팅하기

```java
// 비어있는 SecurityContext 생성
SecurityContext context = SecurityContextHolder.createEmptyContext();

// 여기선 Authentication의 구현체로 TestingAuthenticationToken 사용해서 Authentication 객체 생성
Authentication authentication = new TestingAuthenticationToken("username", "password", "ROLE_USER"); 
context.setAuthentication(authentication);

// SecurityContextHolder에 context 직접 세팅
SecurityContextHolder.setContext(context); 
```

* 현재 인증된 사용자 불러오기

```java
SecurityContext context = SecurityContextHolder.getContext();
Authentication authentication = context.getAuthentication();
String username = authentication.getName();
Object principal = authentication.getPrincipal();
Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
```



# 2 SecurityContext

- **SecurityContext** 는 [SecurityContextHolder](#1-securitycontextholder)로 부터 얻을 수 있다
- [Authentication](#3-authentication) 객체를 가지고 있다.

![image-20201021221913460](Spring/Spring-Security/Authentication/images/SecurityContextHolder.png)



# 3 Authentication

![image-20201021221913460](Spring/Spring-Security/Authentication/images/SecurityContextHolder.png)

- **Authentication**은 `Principal`, `GrantAuthority`, `Credentials` 를 가지고 있다.

**Principal**

- 유저의 신원을 나타낸다.
- username/password를 가지고 인증을 하는 경우 `UserDetails`의 인스턴스이다.

**GrantAuthority**

- `ROLE_USER`, `ROLE_ADMIN`등 `Principal`이 가지고 있는 권한을 나타낸다.
- 인증 이후, 인가 및 권한 확인할 때 이 정보를 참조한다

**Credentials**

- 주로 비밀번호
- 많은 경우 인증 후 유출 방지를 위해 비어있다

**Authentication의 주요 용도**

- 현재 인증된 유저를 나타낸다. 현재 `Authentication` 은 `SecurityContext` 에서 얻을 수 있다. 
- `AuthenticationManager`의 인풋으로 사용된다. 



# 4 GrantedAuthority

* **GrantedAuthority**는 유저(principal)에게 부여된 권한을 나타낸다.
* **GrantedAuthority** 는 `Authentication.getAuthorities()` 메소드를 통해 얻을 수 있다.
  * **GrantedAuthority** 의 콜렉션을 반환한다.
* 권한은 보통 `ROLE_ADMINISTRATOR` 또는 `ROLE_HR_SUPERVISOR` 와 같은 역할이다
* 이러한 역할은 추후에 웹 인가, 메소드 인가, 도메인 오브젝트 인가에서 사용된다.
  * [Method-Security.md](Method-Security.md)
* username/password 기반의 인증을 사용하면 UserDetailsService를 통해 **GrantedAuthority**가 로드된다.



**예시**

* UserDetailsService의 loadUserByUsername는 UserDetails 타입의 객체를 반환한다.
* UserPrincipal 클래스는 UserDetails 인터페이스를 구현했다.
* 아래의 코드와 같이 UserDetails 타입의 객체에 GrantedAuthority를 로드한다.

```java
@Service
public class CustomUserDetailsService implements UserDetailsService {

  @Override
  public UserDetails loadUserByUsername(String username) {
    List<GrantedAuthority> authorities = Collections.
      singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    return new UserPrincipal("username", "password", authorities);
  }

  public class UserPrincipal implements UserDetails {
    private String username;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(String username, String password, Collection<? extends GrantedAuthority> authorities) {
      this.username = username;
      this.password = password;
      this.authorities = authorities;
    }

    @Override
    public String getPassword() {
      return password;
    }

    @Override
    public String getUsername() {
      return username;
    }

    @Override
    public boolean isAccountNonExpired() {
      return true;
    }

    @Override
    public boolean isAccountNonLocked() {
      return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
      return true;
    }

    @Override
    public boolean isEnabled() {
      return true;
    }
  } 
}
```



# 5 AuthenticationManager

- 스프링 시큐리티에서 인증(Authentication)은 **AuthenticationManager**가 한다.



**AuthenticationManager 인터페이스**

```java
package org.springframework.security.authentication;

public interface AuthenticationManager {
    Authentication authenticate(Authentication authentication) throws AuthenticationException;
}
```

- `Authentication authenticate(Authentication authentication) throws AuthenticationException;`
  - 인자로 받은 [Authentication](#3-authentication)이 유효한 인증인지 확인하고 [Authentication](#3-authentication) 객체를 반환한다.
  - 인증을 확인하는 과정에서 비활성 계정, 잘못된 비밀번호, 잠긴 계정 등의 에러를 던질 수 있다.
- 반환된 [Authentication](#3-authentication)은**AuthenticationManager**를 호출한 controller(Security Filters)에서 [SecurityContextHolder](#1-securitycontextholder)에 저장된다.  
- **AuthenticationManager**의 구현체는 많지만 가장 많이 사용되는 구현체는 [ProviderManager](#6-providermanager)이다.



# 6 [ProviderManager](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-providermanager)

- **ProviderManager**는 [AuthenticationManager](#5-authenticationmanager)의 가장 흔히 사용되는 구현체이다. 
- **ProviderManager**는 [AuthenticationProvider](#7-authenticationprovider)에게 인증 작업을 위임한다. 
- 여러개의 [AuthenticationProvider](#7-authenticationprovider) 중 인자로 받은 [Authentication](#3-authentication) 을 지원하는 [AuthenticationProvider](#7-authenticationprovider)가 인증을 처리한다
- 적합한 [AuthenticationProvider](#7-authenticationprovider)가 없을 경우 `ProviderNotFoundException`과 함께 인증은 실패한다.

![providermanager](Spring/Spring-Security/Authentication/images/providermanager.png)



**ProviderManager 클래스**

* 간략한 코드
* authentication을 처리할 수 있는 AuthenticationProvider를 찾아 `provider.authenticate(authentication);` 를 호출하는 것을 볼 수 있다.

```java
package org.springframework.security.authentication;

public class ProviderManager implements AuthenticationManager, MessageSourceAware, InitializingBean {
  
  @Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
    for (AuthenticationProvider provider : getProviders()) {
			if (!provider.supports(authentication.getClass())) {
				continue;
			}
      try {
				result = provider.authenticate(authentication);
				if (result != null) {
					copyDetails(authentication, result);
					break;
				}
			}
    }
  }
}
```



# 7 AuthenticationProvider

- 여러개의 **AuthenticationProvider**가 [ProviderManager](#6-providermanager)에 주입될 수 있다. 
- 각각의  **AuthenticationProvider**는 구체적인 형태의 인증을 수행한다.
  - `DaoAuthenticationProvider`: 유저네임과 패스워드를 기반으로하는 인증
  - `JwtAuthenticationProvider` : JWT token 인증을 수행한다. 



**AuthenticationProvider 인터페이스**

```java
public interface AuthenticationProvider {
  Authentication authenticate(Authentication authentication)throws AuthenticationException;
  boolean supports(Class<?> authentication);
}
```

- `boolean supports(Class<?> authentication);` 
  - 메소드를 통해 Authentication을 처리할 수 있는지 여부를 확인한다
- `Authentication authenticate(Authentication authentication)throws AuthenticationException;`
  - Authentication을 인증한다.



# 8 AuthenticationEntryPoint

* 클라이언트가 권한이 없는 상태에서 권한이 필요한 리소스에 접근할 때 클라이언트에게 credentials를 요청하는 HTTP response를 보내는데 사용된다.
* **AuthenticationEntryPoint**의 구현 중 하나는 로그인 페이지로 리다이렉트 시키는 것이다.



참고

* https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html