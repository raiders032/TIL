## @ExceptionHandler

* `@ExceptionHandler` 메소드를 정의한 클래스 내에서 특정 예외가 발생한 요청을 처리하는 핸들러를 정의할 때 사용한다.

* org.springframework.web.bind.annotation

* 예시

  * ```java
    @ExceptionHandler({FileSystemException.class, RemoteException.class})
    public ResponseEntity<String> handle(IOException ex) {
        // ...
    }
    ```



### Method Arguments

* `@ExceptionHandler` 가 붙은 메소드에서 사용할 수 있는  아규먼트들

| Method argument                                              | Description                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| Exception type                                               | For access to the raised exception.                          |
| `HandlerMethod`                                              | For access to the controller method that raised the exception. |
| `WebRequest`, `NativeWebRequest`                             | Generic access to request parameters and request and session attributes without direct use of the Servlet API. |
| `javax.servlet.ServletRequest`, `javax.servlet.ServletResponse` | Choose any specific request or response type (for example, `ServletRequest` or `HttpServletRequest` or Spring’s `MultipartRequest` or `MultipartHttpServletRequest`). |
| `javax.servlet.http.HttpSession`                             | Enforces the presence of a session. As a consequence, such an argument is never `null`. Note that session access is not thread-safe. Consider setting the `RequestMappingHandlerAdapter` instance’s `synchronizeOnSession` flag to `true` if multiple requests are allowed to access a session concurrently. |
| `java.security.Principal`                                    | Currently authenticated user — possibly a specific `Principal` implementation class if known. |
| `HttpMethod`                                                 | The HTTP method of the request.                              |
| `java.util.Locale`                                           | The current request locale, determined by the most specific `LocaleResolver` available — in effect, the configured `LocaleResolver` or `LocaleContextResolver`. |
| `java.util.TimeZone`, `java.time.ZoneId`                     | The time zone associated with the current request, as determined by a `LocaleContextResolver`. |
| `java.io.OutputStream`, `java.io.Writer`                     | For access to the raw response body, as exposed by the Servlet API. |
| `java.util.Map`, `org.springframework.ui.Model`, `org.springframework.ui.ModelMap` | For access to the model for an error response. Always empty. |
| `RedirectAttributes`                                         | Specify attributes to use in case of a redirect — (that is to be appended to the query string) and flash attributes to be stored temporarily until the request after the redirect. See [Redirect Attributes](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-redirecting-passing-data) and [Flash Attributes](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-flash-attributes). |
| `@SessionAttribute`                                          | For access to any session attribute, in contrast to model attributes stored in the session as a result of a class-level `@SessionAttributes` declaration. See [`@SessionAttribute`](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-sessionattribute) for more details. |
| `@RequestAttribute`                                          | For access to request attributes. See [`@RequestAttribute`](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-requestattrib) for more details. |



### Return Values

* `@ExceptionHandler` 메소드가 지원하는 반환 값들

| Return value                                    | Description                                                  |
| :---------------------------------------------- | :----------------------------------------------------------- |
| `@ResponseBody`                                 | The return value is converted through `HttpMessageConverter` instances and written to the response. See [`@ResponseBody`](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-responsebody). |
| `HttpEntity<B>`, `ResponseEntity<B>`            | The return value specifies that the full response (including the HTTP headers and the body) be converted through `HttpMessageConverter` instances and written to the response. See [ResponseEntity](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-responseentity). |
| `String`                                        | A view name to be resolved with `ViewResolver` implementations and used together with the implicit model — determined through command objects and `@ModelAttribute` methods. The handler method can also programmatically enrich the model by declaring a `Model` argument (described earlier). |
| `View`                                          | A `View` instance to use for rendering together with the implicit model — determined through command objects and `@ModelAttribute` methods. The handler method may also programmatically enrich the model by declaring a `Model` argument (descried earlier). |
| `java.util.Map`, `org.springframework.ui.Model` | Attributes to be added to the implicit model with the view name implicitly determined through a `RequestToViewNameTranslator`. |
| `@ModelAttribute`                               | An attribute to be added to the model with the view name implicitly determined through a `RequestToViewNameTranslator`.Note that `@ModelAttribute` is optional. See “Any other return value” at the end of this table. |
| `ModelAndView` object                           | The view and model attributes to use and, optionally, a response status. |
| `void`                                          | A method with a `void` return type (or `null` return value) is considered to have fully handled the response if it also has a `ServletResponse` an `OutputStream` argument, or a `@ResponseStatus` annotation. The same is also true if the controller has made a positive `ETag` or `lastModified` timestamp check (see [Controllers](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-caching-etag-lastmodified) for details).If none of the above is true, a `void` return type can also indicate “no response body” for REST controllers or default view name selection for HTML controllers. |
| Any other return value                          | If a return value is not matched to any of the above and is not a simple type (as determined by [BeanUtils#isSimpleProperty](https://docs.spring.io/spring-framework/docs/5.3.5/javadoc-api/org/springframework/beans/BeanUtils.html#isSimpleProperty-java.lang.Class-)), by default, it is treated as a model attribute to be added to the model. If it is a simple type, it remains unresolved. |



## @ControllerAdvice

* 일반적으로 `@ExceptionHandler`, `@InitBinder`, `@ModelAttribute` 메서드 들은 선언된 클래스에서만 적용된다. 만약 이러한 메서드를 글로벌하게(여러 컨트롤러에서) 사용하고 싶을 때 `@ControllerAdvice`, `@RestControllerAdvice` 를 사용한다.

* `@ControllerAdvice` 는 `@Component` 를 포함하기에 컴포넌트 스캐닝에 의해 스프링 빈으로 등록된다.

* `@RestControllerAdvice` 는 `@ControllerAdvice` 와 `@ResponseBody`를 합친것과 같다.

* 기본적으로 `@ControllerAdvice` 의 메서드들은 모든 요청에 적용된다.

  * 적용 범위를 좁히고 싶다면 아래와 같이 한다.

  * ```java
    // @RestController가 붙은 모든 컨트롤러 대상
    @ControllerAdvice(annotations = RestController.class)
    public class ExampleAdvice1 {}
    
    // 특정 package 안에 있는 모든 컨트롤러 대상
    @ControllerAdvice("org.example.controllers")
    public class ExampleAdvice2 {}
    
    // 대상 클래스를 명시
    @ControllerAdvice(assignableTypes = {ControllerInterface.class, AbstractController.class})
    public class ExampleAdvice3 {}
    ```

* org.springframework.web.bind.annotation

```java
@Controller
public class SimpleController {

    // ...

    @ExceptionHandler
    public ResponseEntity<String> handle(IOException ex) {
        // ...
    }
}
```



참조

* https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-exceptionhandler