# 1 Spring MVC Exception

- [레퍼런스](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-exceptionhandler.html)
- @Controller 및 @ControllerAdvice클래스는 @ExceptionHandler가 붙은 메서드를 사용하여 컨트롤러 메서드의 예외를 처리할 수 있다.

<br>

**예시**

```java
@Controller
public class SimpleController {

	@ExceptionHandler
	public ResponseEntity<String> handle(IOException ex) {
		// ...
	}
}
```

<br>

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

<br>

## 2.1 동작 흐름

1. 컨트롤러에서 예외 발생되고 던짐
2. 핸들러 어댑터가 예외 던짐
3. Dispatcher 서블릿 예외를 받고 예외를 해결하기 위해 ExceptionResolver를 실행
4. 우선순위가 가장 높은 ExceptionHandlerExceptionResolver가 실행됨
5. ExceptionHandlerExceptionResolver는 예외를 처리할 수 있는 `@ExceptionHandler`를 찾는다
6. 찾은 핸들러를 실행해 예외를 처리한다.

<br>

## 2.2 Method Arguments

* `@ExceptionHandler`가 붙은 메소드에서 사용할 수 있는 아규먼트들
* [링크](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-exceptionhandler-args)



## 2.3 Return Values

* `@ExceptionHandler`메소드가 지원하는 반환 값들
* [링크](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-exceptionhandler-return-values)

<br>

# 3 HandlerExceptionResolver

- 요청 매핑 중에 예외가 발생하거나 요청 핸들러(예: @Controller)에서 예외가 발생하면 DispatcherServlet은 예외를 해결하고 처리하기(일반적으로 오류 응답)위해 HandlerExceptionResolver 빈들의 체인에 위임한다.
- 다수의 HandlerExceptionResolver로 exception resolver chain을 만들 수 있다.
	- HandlerExceptionResolver을 빈으로 등록하면 된다.
	- HandlerExceptionResolver의 우선순위도 지정할 수 있다.

<br>

## 3.1 인터페이스

**인터페이스**

```java
public interface HandlerExceptionResolver {
    ModelAndView resolveException(
      HttpServletRequest request, HttpServletResponse response,
      Object handler, Exception ex);
}
```

- resolveException 메서드
	- handler : 핸들러(컨트롤러) 정보  
	- ex : 핸들러(컨트롤러)에서 발생한 발생한 예외
- 기본 제공되는 구현체
	- SimpleMappingExceptionResolver
		- 예외 클래스 이름과 오류 뷰 이름 사이의 매핑입니다. 
		- 브라우저 애플리케이션에서 오류 페이지를 렌더링하는 데 유용하다.
	- DefaultHandlerExceptionResolver
		- Spring MVC에서 발생한 예외를 해결하고 HTTP 상태 코드로 매핑한다.
		- 스프링 내부에서 발생하는 스프링 예외를 해결한다.
	- ResponseStatusExceptionResolver
		- @ResponseStatus 애노테이션이 있는 붙어있는 예외를 해결하고 애노테이션의 값에 기반하여 HTTP 상태 코드로 매핑한다.
		- 예) `@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "잘못된 요청 오류")`
	- ExceptionHandlerExceptionResolver
		- @Controller 또는 @ControllerAdvice 클래스에서 @ExceptionHandler 메서드를 호출하여 예외를 해결한다.

<br>

**[HandlerExceptionResolver의 규칙](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet/exceptionhandlers.html#mvc-exceptionhandlers-handling)**

1. 에러 페이지를 가리키는 `ModelAndView`를 반환한다.
2. 만약 exception을 HandlerExceptionResolver의에서 처리했다면 빈 `ModelAndView`를 반환한다.
3. 예외를 처리하지 못했다면 `null`을 반환한다.
	1. 다음 체인에서 해당 예외를 처리할 것이다.
	2. 모든 체인에서 예외를 처리하지 못하면 서블릿 컨테이너로 위임된다.

<br>

## 3.2 처리 과정

![[Pasted image 20231023130327.png]]
1. 인터셉터의 preHandle 호출
2. 핸들러 어댑터를 통해 핸들러 실행
3. 핸들러에서 예외 발생
4. Dispatcher Servlet에서 ExceptionResolver 체인을 가지고 예외를 처리한다.
5. 인터셉터의 afterCompletion 호출

<br>

# 4 @ControllerAdvice

* [레퍼런스](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-controller-advice)
* 일반적으로 `@ExceptionHandler`, `@InitBinder`, `@ModelAttribute` 메서드 들은 선언된 클래스에서만 적용된다. 
* 만약 이러한 **메서드를 글로벌하게사용하고 싶을 때 `@ControllerAdvice`, `@RestControllerAdvice` 를 사용한다.**
* `@ControllerAdvice` 는 `@Component`를 포함하기에 컴포넌트 스캐닝에 의해 스프링 빈으로 등록된다.
* `@RestControllerAdvice` 는 `@ControllerAdvice` 와 `@ResponseBody`를 합친것과 같다.

<br>

## 4.1 범위 지정

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

<br>

참조

* https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-exceptionhandler