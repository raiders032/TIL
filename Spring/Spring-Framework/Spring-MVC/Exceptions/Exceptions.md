참고

* [Servlet Exception](../../../etc/Servlet-Exception/Servlet-Exception.md) 

# 1 Exception

> @Controller 및 @ControllerAdvice 클래스는 @ExceptionHandler 메서드를 사용하여 컨트롤러 메서드의 예외를 처리할 수 있습니다.

* HTML 오류 화면을 제공할 떄는 `BasicErrorController` 를 사용하는 것이 편리하다.
  * [Servlet Exception](../../etc/Servlet-Exception/Servlet-Exception.md) 참고
* API 오류에서 BasicErrorController, HandlerExceptionResolver를 직접 사용하기는 쉽지 않다.
* HandlerExceptionResolver
  * ModelAndView를 반환한다.(API 응답에는 필요하지 않다.)
  * HttpServletResponse에 직접 응답 데이터를 넣어주어야 한다.
  * 특정 컨트롤러에만 발생하는 예외를 별도 처리 하기 어렵다
    * A 컨트롤러에서 발생하는 RuntimeException과 B 컨트롤러에서 발생하는 RuntimeException을 달리 처리하는 것



# 2 @ExceptionHandler

* [레퍼런스](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-exceptionhandler)
* `@ExceptionHandler` 메소드를 정의한 클래스 내에서 특정 예외가 발생한 요청을 처리하는 핸들러를 정의할 때 사용한다.
* ExceptionHandlerExceptionResolver가 @ExceptionHandler를 읽어 동작한다.
  * 스프링은 ExceptionHandlerExceptionResolver를 기본으로 제공한다.
  * 기본 제공하는 ExceptionResolver 중에 가장 우선순위가 높다.
* @ExceptionHandler({FileSystemException.class, RemoteException.class})
  * 지정한 예외 또는 그 예외의 자식 클래스는 모두 잡을 수 있다.

```java
// 다양한 예외를 한번에 처리할 수 있다.
@ExceptionHandler({FileSystemException.class, RemoteException.class})
public ResponseEntity<String> handle(IOException ex) {
  // ...
}

// 예외를 생략하면 메서드 파라미터의 예외가 지정됨
@ExceptionHandler
public ResponseEntity<ErrorResult> userExHandle(UserException e) {
  log.error("[exceptionHandle] ex", e);
  ErrorResult errorResult = new ErrorResult("USER-EX", e.getMessage());
  return new ResponseEntity<>(errorResult, HttpStatus.BAD_REQUEST);
}
```



## 2.1 동작 흐름

1. 컨트롤러에서 예외 발생되고 던짐
2. 핸들러 어댑터가 예외 던짐
3. Dispatcher 서블릿 예외를 받고 예외를 해결하기 위해 ExceptionResolver를 실행
4. 우선순위가 가장 높은  ExceptionHandlerExceptionResolver가 실행됨
5. ExceptionHandlerExceptionResolver는 예외를 처리할 수 있는 `@ExceptionHandler`를 찾는다
6. 찾은 핸들러를 실행해 예외를 처리한다.



## 2.2 Method Arguments

* `@ExceptionHandler`가 붙은 메소드에서 사용할 수 있는 아규먼트들
* [링크](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-exceptionhandler-args)



## 2.3 Return Values

* `@ExceptionHandler`메소드가 지원하는 반환 값들
* [링크](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-exceptionhandler-return-values)



# 3 @ControllerAdvice

* [레퍼런스](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-controller-advice)
* 일반적으로 `@ExceptionHandler`, `@InitBinder`, `@ModelAttribute` 메서드 들은 선언된 클래스에서만 적용된다. 
* 만약 이러한 **메서드를 글로벌하게사용하고 싶을 때 `@ControllerAdvice`, `@RestControllerAdvice` 를 사용한다.**
* `@ControllerAdvice` 는 `@Component`를 포함하기에 컴포넌트 스캐닝에 의해 스프링 빈으로 등록된다.
* `@RestControllerAdvice` 는 `@ControllerAdvice` 와 `@ResponseBody`를 합친것과 같다.



## 3.1 범위 지정

* 기본적으로 `@ControllerAdvice`의 메서드들은 모든 요청에 적용된다.
* 적용 범위를 좁히고 싶다면 아래와 같이 한다.

```java
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



참조

* https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-exceptionhandler