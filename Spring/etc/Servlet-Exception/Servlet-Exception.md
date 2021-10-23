# 1 서블릿 Exception

* 스프링이 아닌 순수 서블릿 컨테이너는 예외를 어떻게 처리하는지 알아보자.
* 서블릿은 다음 2가지 방식으로 예외 처리를 지원한다.
  * Exception (예외)
  * response.sendError(HTTP 상태 코드, 오류 메시지)



# 2 Exception

**자바 직접 실행**

* 자바의 메인 메서드를 직접 실행하는 경우 main 이라는 이름의 쓰레드가 실행된다.
* 실행 도중에 예외를 잡지 못하고 처음 실행한 main() 메서드를 넘어서 예외가 던져지면, 예외 정보를 남기고 해당 쓰레드는 종료된다



**웹 애플리케이션**

* 웹 애플리케이션은 사용자 요청별로 별도의 쓰레드가 할당되고, 서블릿 컨테이너 안에서 실행된다. 
* 애플리케이션에서 예외가 발생했는데, 어디선가 try ~ catch로 예외를 잡아서 처리하면 아무런 문제가 없다. 
* 그런데 만약에 애플리케이션에서 예외를 잡지 못하고, 서블릿 밖으로 까지 예외가 전달되면 어떻게 동작할까?
* 결국 톰캣 같은 WAS 까지 예외가 전달된다. WAS는 예외가 올라오면 어떻게 처리해야 할까?

```
WAS(여기까지 전파) <- 필터 <- 서블릿 <- 인터셉터 <- 컨트롤러(예외발생)
```



**application.properties**

* 스프링 부트가 기본 제공하는 예외 페이지 비활성화

```
  server.error.whitelabel.enabled=false
```



**컨트롤러**

```java
@Slf4j
@Controller
public class ServletExController {
  @GetMapping("/error-ex")
  public void errorEx() {
    throw new RuntimeException("예외 발생!"); 
  }
}
```

* `/error-ex` 로 요청을 보내면 

* ```
  HTTP Status 500 – Internal Server Error
  ```

* 위와 같은 tomcat이 기본으로 제공하는 오류화면을 볼 수 있다.

* Exception 의 경우 서버 내부에서 처리할 수 없는 오류가 발생한 것으로 생각해서 HTTP 상태 코드 500을 반환한다.

* `/no-page` 로 요청하면

* ```
  HTTP Status 404 – Not Found
  ```

# 3 response.sendError()

* 오류가 발생했을 때 HttpServletResponse 가 제공하는 sendError 라는 메서드를 사용해도 된다
* 서블릿 컨테이너에게 오류가 발생했다는 점을 전달할 수 있다.
* 이 메서드를 사용하면 HTTP 상태 코드와 오류 메시지도 추가할 수 있다.

```java
@GetMapping("/error-404")
public void error404(HttpServletResponse response) throws IOException {
  response.sendError(404, "404 오류!"); 
}

@GetMapping("/error-500")
public void error500(HttpServletResponse response) throws IOException {
  response.sendError(500);
}
```

* response.sendError() 를 호출하면 response 내부에는 오류가 발생했다는 상태를 저장해둔다. 
* 그리고 서블릿 컨테이너는 고객에게 응답 전에 response 에 sendError() 가 호출되었는지 확인한다. 
* 그리고 호출되었다면 설정한 오류 코드에 맞추어 기본 오류 페이지를 보여준다.



# 4 서블릿 오류 페이지 작동 원리

* 서블릿은 Exception (예외)가 발생해서 서블릿 밖으로 전달되거나 또는 response.sendError() 가 호출 되었을 때 설정된 오류 페이지를 찾는다.



## 4.1 서블릿 오류 페이지 등록

```java
@Component
public class WebServerCustomizer implements
  WebServerFactoryCustomizer<ConfigurableWebServerFactory> {
  
  @Override
  public void customize(ConfigurableWebServerFactory factory) {
    ErrorPage errorPage404 = new ErrorPage(HttpStatus.NOT_FOUND, "/error-page/404");
    ErrorPage errorPage500 = new ErrorPage(HttpStatus.INTERNAL_SERVER_ERROR, "/error-page/500");
    ErrorPage errorPageEx = new ErrorPage(RuntimeException.class, "/error-page/500");
    factory.addErrorPages(errorPage404, errorPage500, errorPageEx);
  }
}
```



## 4.2 예외 발생 흐름

* 예외가 발생해서 WAS까지 전파된다.
* WAS는 오류 페이지 경로를 찾아서 내부에서 오류 페이지를 호출한다. 
* 이때 오류 페이지 경로로 필터, 서블릿, 인터셉터, 컨트롤러가 모두 다시 호출된다.
* 중요한 점은 웹 브라우저(클라이언트)는 서버 내부에서 이런 일이 일어나는지 전혀 모른다는 점이다. 
* 오직 서버 내부에서 오류 페이지를 찾기 위해 추가적인 호출을 한다.

```
WAS(여기까지 전파) <- 필터 <- 서블릿 <- 인터셉터 <- 컨트롤러(예외발생)
WAS `/error-page/500` 다시 요청 -> 필터 -> 서블릿 -> 인터셉터 -> 컨트롤러(/error-page/ 500) -> View
```

**sendError** **흐름**

```
WAS(sendError 호출 기록 확인) <- 필터 <- 서블릿 <- 인터셉터 <- 컨트롤러 (response.sendError())
WAS `/error-page/500` 다시 요청 -> 필터 -> 서블릿 -> 인터셉터 -> 컨트롤러(/error-page/ 500) -> View
```



# 5 오류 정보 확인하기

* WAS는 오류 페이지를 단순히 다시 요청만 하는 것이 아니라, 오류 정보를 request 의 attribute에 추가해서 넘겨준다.
* 필요하면 오류 페이지에서 이렇게 전달된 오류 정보를 사용할 수 있다.

```java
public static final String ERROR_EXCEPTION = "javax.servlet.error.exception";
public static final String ERROR_EXCEPTION_TYPE = "javax.servlet.error.exception_type";
public static final String ERROR_MESSAGE = "javax.servlet.error.message";
public static final String ERROR_REQUEST_URI = "javax.servlet.error.request_uri";
public static final String ERROR_SERVLET_NAME = "javax.servlet.error.servlet_name";
public static final String ERROR_STATUS_CODE = "javax.servlet.error.status_code";

@RequestMapping("/error-page/500")
public String errorPage500(HttpServletRequest request, HttpServletResponse response) {
  log.info("errorPage 500");
  printErrorInfo(request);
  return "error-page/500";
}

private void printErrorInfo(HttpServletRequest request) {
  log.info("ERROR_EXCEPTION: ex=", request.getAttribute(ERROR_EXCEPTION));
  log.info("ERROR_EXCEPTION_TYPE: {}", request.getAttribute(ERROR_EXCEPTION_TYPE));
	log.info("ERROR_MESSAGE: {}", request.getAttribute(ERROR_MESSAGE)); 
  
  // ex의 경우 NestedServletException 스프링이 한번 감싸서 반환        
  log.info("ERROR_REQUEST_URI: {}", request.getAttribute(ERROR_REQUEST_URI));
  log.info("ERROR_SERVLET_NAME: {}", request.getAttribute(ERROR_SERVLET_NAME));
  log.info("ERROR_STATUS_CODE: {}", request.getAttribute(ERROR_STATUS_CODE));
  log.info("dispatchType={}", request.getDispatcherType());
}
```



**request.attribute에 서버가 담아준 정보** 

* javax.servlet.error.exception : 예외 
* javax.servlet.error.exception_type : 예외 타입 
* javax.servlet.error.message : 오류 메시지 
* javax.servlet.error.request_uri : 클라이언트 요청 URI 
* javax.servlet.error.servlet_name : 오류가 발생한 서블릿 이름
* javax.servlet.error.status_code : HTTP 상태 코드



# 6 필터

## 6.1 예외 발생과 오류 페이지 요청 흐름

```
1. WAS(여기까지 전파) <- 필터 <- 서블릿 <- 인터셉터 <- 컨트롤러(예외발생)
2. WAS `/error-page/500` 다시 요청 -> 필터 -> 서블릿 -> 인터셉터 -> 컨트롤러(/error- page/500) -> View
```

* 오류가 발생하면 오류 페이지를 출력하기 위해 WAS 내부에서 호출이 한번 더 일어난다
* 이 때 필터가 두번 호출된다.
* 만약 해당 필터가 로그인을 처리하는 필터라면 피터를 두번 호출하는 것은 매우 비효율적이다
  * 처음 필터에서 인증이 완료되었기 때문에
* **결국 정상 요청인지 오류 페이지를 출력하기 위핸 내부 요청인지 구분할 수 있어야 한다.**



## 6.2 DispatcherType

* 요청이 클라이언트로 부터 발생한 요청인지 오류 페이지를 위한 내부 요청인지 구분하게 해준다.

```java
public enum DispatcherType {
  FORWARD,
  INCLUDE,
  REQUEST,
  ASYNC,
  ERROR
}
```

* REQUEST: 클라이언트의 처음 요청
* ERROR : 오류 요청
* FORWARD : 서블릿에서 다른 서블릿이나 JSP를 호출할 때
* INCLUDE : 서블릿에서 다른 서블릿이나 JSP의 결과를 포함할 때 
  * RequestDispatcher.include(request, response);
* ASYNC : 서블릿 비동기 호출



## 6.3 필터 설정

* `filterRegistrationBean.setDispatcherTypes(DispatcherType.REQUEST, DispatcherType.ERROR);`
  * DispatcherType에 따라 필터를 호출할지 말지 정할 수 있다.
  * 기본값은 `DispatcherType.REQUEST` 즉 클라이언트 요청에만 필터가 적용
  * 오류 페이지 경로도 필터를 적용할 것이 아니면 기본값 그대로 사용 

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
  @Bean
  public FilterRegistrationBean logFilter() {
    FilterRegistrationBean<Filter> filterRegistrationBean = new FilterRegistrationBean<>();
    filterRegistrationBean.setFilter(new LogFilter());
    filterRegistrationBean.setOrder(1);
    filterRegistrationBean.addUrlPatterns("/*");
    filterRegistrationBean.setDispatcherTypes(DispatcherType.REQUEST, DispatcherType.ERROR);
    return filterRegistrationBean;
  } 
}
```



# 7 인터셉터

* 필터를 등록할 때 어떤 DispatcherType인 경우에 필터를 적용할 지 선택할 수 있었다
* 인터셉터는 서블릿이 제공하는 기능이 아니라 스프링이 제공하는 기능이다. 따라서 DispatcherType과 무관하게 항상 호출된다.

```java
@Slf4j
public class LogInterceptor implements HandlerInterceptor {
  public static final String LOG_ID = "logId";

  @Override
  public boolean preHandle(HttpServletRequest request, 
                           HttpServletResponse response, Object handler) throws Exception {
    String requestURI = request.getRequestURI();
    String uuid = UUID.randomUUID().toString();
    request.setAttribute(LOG_ID, uuid);
    log.info("REQUEST  [{}][{}][{}][{}]", uuid, request.getDispatcherType(), requestURI, handler);
    return true;
  }

  @Override
  public void postHandle(HttpServletRequest request, HttpServletResponse response, 
                         Object handler, ModelAndView modelAndView) throws Exception {
    log.info("postHandle [{}]", modelAndView);
  }

  @Override
  public void afterCompletion(HttpServletRequest request, 
                              HttpServletResponse response, Object handler, Exception ex) throws Exception {
    String requestURI = request.getRequestURI();
    String logId = (String)request.getAttribute(LOG_ID);
    log.info("RESPONSE [{}][{}][{}]", logId, request.getDispatcherType(), requestURI);
    if (ex != null) {
      log.error("afterCompletion error!!", ex);
    }
  }
}
```



## 7.1 인터셉터 설정

* 오류로 인해 인터셉터가 두 번 호출되지는 것이 아니라 한번 호출 되게 해보자
* 오류 페이지 경로를 excludePathPatterns 를 사용해서 제외해야한다.

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(new LogInterceptor())
      .order(1)
      .addPathPatterns("/**")
      .excludePathPatterns("/css/**", "/*.ico", "/error", "/error-page/**"); //오류 페이지 경로
  }
}
```



# 8 스프링 부트 오류 페이지

* 아래와 같이 예외 처리 페이지를 만들었다.

```java
@Component
public class WebServerCustomizer implements
  WebServerFactoryCustomizer<ConfigurableWebServerFactory> {
  
  @Override
  public void customize(ConfigurableWebServerFactory factory) {
    ErrorPage errorPage404 = new ErrorPage(HttpStatus.NOT_FOUND, "/error-page/404");
    ErrorPage errorPage500 = new ErrorPage(HttpStatus.INTERNAL_SERVER_ERROR, "/error-page/500");
    ErrorPage errorPageEx = new ErrorPage(RuntimeException.class, "/error-page/500");
    factory.addErrorPages(errorPage404, errorPage500, errorPageEx);
  }
}
```

* 스프링 부트는 이런 과정을 기본으로 제공한다.
* ErrorPage 를 자동으로 등록한다. 이때 /error 라는 경로로 기본 오류 페이지를 설정한다.
  * new ErrorPage("/error") , 상태코드와 예외를 설정하지 않으면 기본 오류 페이지로 사용된다. 
  * 서블릿 밖으로 예외가 발생하거나, response.sendError(...) 가 호출되면 모든 오류는 /error 를 호출하게 된다.
* BasicErrorController 라는 스프링 컨트롤러를 자동으로 등록한다. 
  * ErrorPage 에서 등록한 /error 를 매핑해서 처리하는 컨트롤러다.
* **개발자는 오류 페이지만 등록**
  * 정적 HTML이면 정적 리소스, 뷰 템플릿을 사용해서 동적으로 오류 화면을 만들고 싶으면 뷰 템플릿 경로에 오류 페이지 파일을 만들어서 넣어두기만 하면 된다.



## 8.1 뷰 우선순위

* 해당 경로 위치에 HTTP 상태 코드 이름의 뷰 파일을 넣어두면 된다.

1. 뷰템플릿 
   * resources/templates/error/500.html 
   * resources/templates/error/5xx.html
2. 정적리소스(static,public) 
   * resources/static/error/400.html 
   * resources/static/error/404.html 
   * resources/static/error/4xx.html
3. 적용 대상이 없을 때 뷰 이름(error) 
   * resources/templates/error.html 



## 8.2 뷰에서 에러 정보 사용하기

* BasicErrorController 컨트롤러는 다음 정보를 model에 담아서 뷰에 전달한다. 
* 뷰 템플릿은 이 값을 활용해서 출력할 수 있다.

```
* timestamp: Fri Feb 05 00:00:00 KST 2021
* status: 400
* error: Bad Request
* exception: org.springframework.validation.BindException * trace: 예외 trace
* message: Validation failed for object='data'. Error count: 1 * errors: Errors(BindingResult)
* path: 클라이언트 요청 경로 (`/hello`)
```

**예시**

```html
<!DOCTYPE HTML>
<html xmlns:th="http://www.thymeleaf.org">
  <head>
    <meta charset="utf-8">
  </head>
  <body>
    <div class="container" style="max-width: 600px">
      <div class="py-5 text-center">
        <h2>500 오류 화면 스프링 부트 제공</h2> </div>
      <div>
        <p>오류 화면 입니다.</p>
      </div> 
      <ul>
        <li>오류 정보</li> 
        <ul>
          <li th:text="|timestamp: ${timestamp}|"></li>
          <li th:text="|path: ${path}|"></li>
          <li th:text="|status: ${status}|"></li>
          <li th:text="|message: ${message}|"></li>
          <li th:text="|error: ${error}|"></li>
          <li th:text="|exception: ${exception}|"></li>
          <li th:text="|errors: ${errors}|"></li>
          <li th:text="|trace: ${trace}|"></li>
        </ul>
        </li> 
      </ul>
    <hr class="my-4">
    </div> <!-- /container -->
  </body>
</html>
```

**설정**

```properties
# exception 포함 여부
server.error.include-exception=true
# message 포함 여부
server.error.include-message=always
# trace 포함 여부
server.error.include-stacktrace=on_param
# errors 포함 여부
server.error.include-binding-errors=on_param
```

*  on_param 은 파라미터가 있으면 해당 정보를 노출한다. 
* 디버그 시 문제를 확인하기 위해 사용할 수 있다. 그런데 이 부분도 개발 서버에서 사용할 수 있지만, 운영 서버에서는 권장하지 않는다.
* on_param 으로 설정하고 다음과 같이 HTTP 요청시 파라미터를 전달하면 해당 정보들이 model 에 담겨서 뷰 템플릿에서 출력된다.
* `http://localhost:8080/error-ex?message=&errors=&trace=`
  * 뷰에서 message, errors, trace 정보를 받을 수 있다.

