### SecurityContextHolder

> Spring Security’s authentication의 핵심이라 할 수 있이며 `SecurityContext` 을 가지고 있다.

![image-20201021221913460](SecurityContextHolder.png)

### SecurityContext

> `SecurityContext` 는 `SecurityContextHolder` 로 부터 얻을 수 있으며 `Authentication` 객체를 가지고 있다.



### Authentication

> `Authentication` 은 주로 두가지 용도로 쓰인다.
>
> 1. 현재 인증된 유저를 나타낸다. 현재 `Authentication` 은 `SecurityContext` 에서 얻을 수 있다. 
> 2. `AuthenticationManager` 의 인풋으로 사용된다. 
>
> `Authentication` 은 다음을 포함한다.
>
> * principal
>   * 유저의 신원을 나타낸다.
>   * username/password를 가지고 인증을 하는 경우 UserDetails의 인스턴스이다.
> * credentials
> * authorities



### UserDetails

> `UserDetails` 은 `UserDetailsService` 의 반환 값이다.  `DaoAuthenticationProvider` 는 `UserDetails` 을 인증하고 `Authentication` 을 반환한다. 

### AuthenticationManager

> `AuthenticationManager` 는 스프링 시큐리티 필터가 어떻게 인증을 하는지 정의한 API이다. 반환된 `Authentication` 은`AuthenticationManager` 를 호출한  controller에서 `SecurityContextHolder` 에 저장된다.  `AuthenticationManager` 의 구현체는 많지만 가장 많이 사용되는 구현체는 `ProviderManager` 이다.



### ProviderManager

> `ProviderManager` 는 `AuthenticationManager` 의 가장 흔히 사용되는 구현체이다. `ProviderManager` 여러 `AuthenticationProvider` 에게 작업을 위임한다. 여러개의 `AuthenticationProvider` 중 가장 적합한 `AuthenticationProvider` 가 인증을 처리하고 적합한 `AuthenticationProvider` 가 없을 경우 `ProviderNotFoundException` 과 함께 인증은 실패한다. 

![image-20201021220422979](ProviderManager.png)



### AuthenticationProvider

> 여러개의 `AuthenticationProvider` 가 `ProviderManager` 에 주입될 수 있다. 각각의  `AuthenticationProvider` 는 구체적인 형태의 인증을 수행한다. 예를 들면 `DaoAuthenticationProvider` 는 유저네임과 패스워드를 기반으로하는 인증을 수행하고 `JwtAuthenticationProvider` 는 JWT token 인증을 수행한다. 



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

