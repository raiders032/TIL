# 1 Annotated Controllers

* 스프링 MVC는 `@Controlle`r와 `@RestController` 컴포넌트가 애노테이션을 사용하여 요청 매핑, 요청 입력, 예외 처리 등을 표현하는 애노테이션 기반 프로그래밍 모델을 제공한다
* 애노테이션이 달린 컨트롤러는 다양한 메서드 시그니쳐 가지고 있다.
* 기본 클래스를 상속하거나 특정 인터페이스를 구현할 필요가 없다. 

**예시**

* Model을 받아서 String을 반환하는 메서드
  * 다양한 메서드가 더 존재한다.

```java
@Controller
public class HelloController {
  @GetMapping("/hello")
  public String handle(Model model) {
    model.addAttribute("message", "Hello World!");
    return "index";
  }
}
```



## 1.1 @Controller

* 컨트롤러에 `@Controller` 를 적용하면 컴포넌트 스캐닝에 의해 자동으로 빈으로 등록된다.
* 반환 값이 String 이면 뷰 이름으로 인식된다. 그래서 뷰를 찾고 뷰가 랜더링 된다.



## 1.2 @RestController

* @RestController는 `@Controller` 와 `@ResponseBody`를 합친 애노테이션이다.
* `@ResponseBody`
  * 반환 값으로 뷰를 찾는 것이 아니라, HTTP 메시지 바디에 바로 입력한다.

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Controller
@ResponseBody
public @interface RestController {
	@AliasFor(annotation = Controller.class)
	String value() default "";
}
```



# 2 Request Mapping

* `@RequestMapping` 애노테이션을 사용하여 요청을 컨트롤러 메서드에 매핑할 수 있다

* `@RequestMapping` 은 주로 클래스 레벨로 사용하여 모든 메서드의 공통된 매핑을 제공한다.

* URL, HTTP 메서드, 요청 파라미터, 헤더, 미디어 타입을 사용해 요청을 컨트롤러 메서드에 매핑한다.

* HTTP method 별로 축얀된 애노테이션을 지원한다
  * `@GetMapping`

  * `@PostMapping`

  * `@PutMapping`

  * `@DeleteMapping`

  * `@PatchMapping`


```java
@RequestMapping(value = "/mapping-get-v1", method = RequestMethod.GET)
// 축약된 버전
@GetMapping(value = "/mapping-get-v1")
```

**예시**

```java
@RestController
@RequestMapping("/persons")
class PersonController {

    @GetMapping("/{id}")
    public Person getPerson(@PathVariable Long id) {
        // ...
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void add(@RequestBody Person person) {
        // ...
    }
}
```



## 2.1 **@PathVariable**

* @PathVariable를 사용해서 URI 변수를 사용할 수 있다.
* URI 경로가 자동적으로 변수로 컨버팅된다.
  * 타입이 다른경우 `TypeMismatchException` 이 발생한다.
  * int형을 String으로 받는 경우



**예시**

* 요청 URL이 `/owners/1/pets/2` 인 경우
* ownerId에는 1이 petId에는 2가 할당된다.

```java
@GetMapping("/owners/{ownerId}/pets/{petId}")
public Pet findPet(@PathVariable Long ownerId, @PathVariable Long petId) {
    // ...
}
```



# 3 Handler Methods

* @RequestMapping가 적용된 메서드는 유연한 시그니쳐를 가진다.
* 지원되는 컨트롤러 메서드 아규먼트 및 반환 값 범위에서 자유롭게 선택할 수 있다.
* [지원되는 메소드 아규먼트](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-arguments)
* [지원되는 반환 값](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-return-types)



## 3.1 @RequestParam

* 클라이언트가 쿼리 파라미터나 HTML Form으로 데이터를 전달할 때 @RequestParam를 사용해 아규먼트에 바인딩할 수 있다.
* 파라미터의 이름으로 아규먼트에 바인딩된다.
* HTTP 파라미터 이름이 변수 이름과 같으면 @RequestParam의 name속성 생략 가능
* String , int , Integer 등의 단순 타입이면 @RequestParam 도 생략 가능
  * 생략하면 스프링 MVC는 내부에서 required=false를 적용한다.
  * 가급적이면 생략하지 말자

```java
@ResponseBody
@RequestMapping("/request-param-v2")
public String requestParamV2(@RequestParam("username") String memberName, 
                             @RequestParam("age") int memberAge) {
  return "ok";
}
```



## 3.2 @RequestPart





## 3.3 @ModelAttribute

* 클라이언트가 쿼리 파라미터나 HTML Form으로 데이터를 전달할 때 @ModelAttribute를 사용해 아규먼트에 바인딩할 수 있다.
* 개발시 요청 파라미터를 받아 객체를 생성하는 일이 자주 발생한다.
* @ModelAttribute를 사용하면 요청 파라미터를 받고 객체를 생성하는 일을 자동화할 수 있다.
* @ModelAttribute는 생략할 수 있다.
  * String , int , Integer 같은 단순 타입 아규먼트의 애노테이션이 생략 -> @RequestParam로 인식
  * 단순 타입을 제외한 나머지 타입 아규먼트의 애노테이션 생략 -> @ModelAttribute로 인식



**Setter 사용**

* 기본 생성자가 존재하면 먼저 기본 생성자를 통해 객체를 만들고 Setter를 사용해 객체에 값을 바인딩한다.
* 따라서 기본 생성자가 존재하면 Setter가 필수적으로 필요하다.
* 기본 생성자가 존재하면 다른 생성자가 존재하더라도 기본 생성자와 Setter를 사용해 객체를 바인딩 한다.

```java
@Setter
@NoArgsConstructor
public static class RequestDto {
	  private String username;
	  private int age;
}
```



**생성자 사용**

- 기본 생성자와 Setter 없이 필요한 모든 인자를 받는 생성자를 통해 객체를 바인딩할 수 있다.
- 기본 생성자가 없어야 인자를 받은 생성자가 사용된다.

```java
@AllArgsConstructor
public static class RequestDto {
	  private String username;
  	private int age;
}
```



**@ModelAttribute 사용**

* 기본 생성자로 helloData 객체를 생성하고 setter로 요청 파라미터 이름과 매칭되는 프로퍼티에 값을 입력한다.
* 기본 생성자가 없는 경우 인자를 받는 생성자를 통해 객체 바인딩을 진행한다.

```java
@ResponseBody
@RequestMapping("/model-attribute-v1")
public String modelAttributeV1(@ModelAttribute RequestDto helloData) {
  log.info("username={}, age={}", helloData.getUsername(),
  helloData.getAge());
  return "ok";
}
```



## 3.4 @RequestBody

- [레퍼런스](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-requestbody)
- HTTP request body을 파싱해서 자바 객체로 변환해주는 기능이다.
- HttpMessageConverter를 사용해 request body를 자바 객체로 변환해준다.
- 타겟 타입은 기본 생성자가 필수적으로 필요하다.
  - 직렬화 가능한 클래스들은 기본 생성자가 필수
  - 데이터 바인딩을 위한 필드명을 알아내기 위해 getter나 setter 중 1가지는 정의되어 있어야 한다.



## 3.5 UriComponentsBuilder

* 현재 요청의 호스트, 포트, 프로토콜, 컨텍스트 패스를 이용해서 URL을 만들 때 사용한다.

**예시**

```java
@PostMapping("/users/{userId}/simulations")
public ResponseEntity<CommonResponse> registerSimulation(@PathVariable String userId,
                                                         @RequestBody RegisterSimulationRequest request,
                                                         UriComponentsBuilder uriComponentsBuilder){
	...

  CommonResponse<Object> commonResponse = CommonResponse.success("시뮬레이션 생성 요청 확인", null);
  URI location = uriComponentsBuilder
    .path(String.format("/users/%s/simulations", userId))
    .build().toUri();
  
  return ResponseEntity.created(location).body(commonResponse);
}
```



참고

* https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-controller
