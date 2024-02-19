# 1 Servlet Filter

* 애플리케이션 여러 로직에서 공통으로 관심이 있는 있는 것을 공통 관심사(cross-cutting concern)라고 한다
* 예를 들면 등록, 수정, 삭제, 조회 등등 여러 로직에서 공통으로 인증에 대해서 관심을 가질 수 있다.
* 이러한 공통 관심사는 스프링의 AOP로도 해결할 수 있지만, 웹과 관련된 공통 관심사는 서블릿 필터를 사용하는 것이 좋다.
	* 웹과 관련된 공통 관심사를 처리할 때는 HTTP의 헤더나 URL의 정보들이 필요한다
	* 서블릿 필터는 `HttpServletRequest`를 제공해서 헤더나 URL 정보를 사용할 수 있다.

<br>

# 2 필터 흐름

```
 HTTP 요청 -> WAS -> 필터 -> 서블릿 -> 컨트롤러
```

* 필터를 적용하면 필터가 호출 된 다음에 서블릿이 호출된다.
* 그래서 모든 고객의 요청 로그를 남기는 요구사항이 있다면 필터를 사용하면 된다
* 필터는 특정 URL 패턴에 적용할 수 있다
	* `/*` 이라고 설정하면 모든 요청에 필터가 적용된다.
	* 스프링을 사용하는 경우 여기서 말하는 서블릿은 스프링의 디스패처 서블릿으로 생각하면 된다.
* 필터는 적절하지 않은 요청을 판단하여 이후 필터나 서블릿을 호출하지 않고 바로 응답을 줄 수 있다.

<br>

# 3 필터 체인

* 필터는 체인으로 구성되는데, 중간에 필터를 자유롭게 추가할 수 있다. 
* 예를 들어서 로그를 남기는 필터를 먼저 적용하고, 그 다음에 로그인 여부를 체크하는 필터를 만들 수 있다.

<br>

# 4 필터 인터페이스

* 필터 인터페이스를 구현하고 등록하면 서블릿 컨테이너가 필터를 싱글톤 객체로 생성하고 관리한다.
* `init()`: 필터 초기화 메서드, 서블릿 컨테이너가 생성될 때 호출된다.
* `doFilter()`: 고객의 요청이 올 때 마다 해당 메서드가 호출된다. 필터의 로직을 구현하면 된다. 
* `destroy()`: 필터 종료 메서드, 서블릿 컨테이너가 종료될 때 호출된다.

```java
public interface Filter {
  public default void init(FilterConfig filterConfig) throws ServletException {}
  
  public void doFilter(ServletRequest request, ServletResponse response,
                       FilterChain chain) throws IOException, ServletException;
  
  public default void destroy() {}
}
```

<br>

# 5 필터 사용하기

**모든 요청에 로그를 남기는 필터 구현하기**

* ServletRequest request 는 HTTP 요청이 아닌 경우까지 고려해서 만든 인터페이스이다.
	* HTTP를 사용하면 `HttpServletRequest httpRequest = (HttpServletRequest) request;` 와 같이 다운 케스팅 하면 된다.
* `chain.doFilter(request, response);`
	* 다음 필터가 있으면 필터를 호출하고, 필터가 없으면 서블릿을 호출한다.
	* 이 메서드를 호출하지 않으면 다음 단계로 진행되지 않는다.

```java
import lombok.extern.slf4j.Slf4j;
import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.UUID;

@Slf4j
public class LogFilter implements Filter {
  @Override
  public void init(FilterConfig filterConfig) throws ServletException {
    log.info("log filter init");
  }
  
  @Override
  public void doFilter(ServletRequest request, ServletResponse response,
                       FilterChain chain) throws IOException, ServletException {
    HttpServletRequest httpRequest = (HttpServletRequest) request;
    String requestURI = httpRequest.getRequestURI();
    String uuid = UUID.randomUUID().toString();
    try {
      log.info("REQUEST  [{}][{}]", uuid, requestURI);
      chain.doFilter(request, response);
    } catch (Exception e) {
      throw e;
    } finally {
      log.info("RESPONSE [{}][{}]", uuid, requestURI);
    } 
  }
  
  @Override
  public void destroy() {
    log.info("log filter destroy");
  }
}
```

<br>

**구현된 필터 등록하기**

* 필터를 등록하는 방법은 여러가지가 있지만, 스프링 부트를 사용한다면 FilterRegistrationBean 을 사용해서 등록하면 된다.
* setFilter(new LogFilter()) : 등록할 필터를 지정한다.
* setOrder(1) : 필터는 체인으로 동작한다. 따라서 순서가 필요하다. 낮을 수록 먼저 동작한다. 
* addUrlPatterns("/*") : 필터를 적용할 URL 패턴을 지정한다. 한번에 여러 패턴을 지정할 수 있다.

```java
@Configuration
public class WebConfig {
  @Bean
  public FilterRegistrationBean logFilter() {
    FilterRegistrationBean<Filter> filterRegistrationBean = new FilterRegistrationBean<>();
    filterRegistrationBean.setFilter(new LogFilter());
    filterRegistrationBean.setOrder(1);
    filterRegistrationBean.addUrlPatterns("/*");
    return filterRegistrationBean;
  } 
}
```

<br>

**인증 체크 필터 구현하기**

```java
@Slf4j
public class LoginCheckFilter implements Filter {
  // 인증 필터를 적용해도 홈, 회원가입, 로그인 화면, css 같은 리소스에는 접근할 수 있어야 한다.
  private static final String[] whitelist = {"/", "/members/add", "/login", "/logout","/css/*"};

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, 
                       FilterChain chain) throws IOException, ServletException {
    HttpServletRequest httpRequest = (HttpServletRequest) request;
    String requestURI = httpRequest.getRequestURI();
    HttpServletResponse httpResponse = (HttpServletResponse) response;

    try {
      log.info("인증 체크 필터 시작 {}", requestURI); 
      if (isLoginCheckPath(requestURI)) {
        log.info("인증 체크 로직 실행 {}", requestURI); 
        HttpSession session = httpRequest.getSession(false); 
        if (session == null || session.getAttribute(SessionConst.LOGIN_MEMBER) == null) { 
          log.info("미인증 사용자 요청 {}", requestURI);
          //로그인으로 redirect 
          httpResponse.sendRedirect("/login?redirectURL=" + requestURI);
          return; //여기가 중요, 미인증 사용자는 다음으로 진행하지 않고 끝! 
        }
      }
      chain.doFilter(request, response);
    } catch (Exception e) {
      throw e; //예외 로깅 가능 하지만, 톰캣까지 예외를 보내주어야 함 
    } finally {
      log.info("인증 체크 필터 종료 {}", requestURI); 
    }
  }

  private boolean isLoginCheckPath(String requestURI) {
    return !PatternMatchUtils.simpleMatch(whitelist, requestURI);
  }
}
```

```java
@PostMapping("/login")
public String login(
  @Valid @ModelAttribute LoginForm form, BindingResult bindingResult,
  @RequestParam(defaultValue = "/") String redirectURL,
  HttpServletRequest request) {
  ...
    //redirectURL 적용
    return "redirect:" + redirectURL;
}

```

