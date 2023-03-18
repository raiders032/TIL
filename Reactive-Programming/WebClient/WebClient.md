# 1 WebClient

* Spring WebFlux가 제공하는 HTTP 요청을 보낼 수 있는 클라이언트



## 1.1 dependency

```groovy
implementation 'org.springframework.boot:spring-boot-starter-webflux'
```



## 1.2 WebClient 인터페이스

```java
package org.springframework.web.reactive.function.client;

public interface WebClient {
  // Static, factory methods

  /**
	 * Create a new {@code WebClient} with Reactor Netty by default.
	 * @see #create(String)
	 * @see #builder()
	 */
  static WebClient create() {
    return new DefaultWebClientBuilder().build();
  }

  /**
	 * Variant of {@link #create()} that accepts a default base URL. For more
	 * details see {@link Builder#baseUrl(String) Builder.baseUrl(String)}.
	 * @param baseUrl the base URI for all requests
	 * @see #builder()
	 */
  static WebClient create(String baseUrl) {
    return new DefaultWebClientBuilder().baseUrl(baseUrl).build();
  }
  
  	// Static, factory methods

	/**
	 * Create a new {@code WebClient} with Reactor Netty by default.
	 * @see #create(String)
	 * @see #builder()
	 */
	static WebClient create() {
		return new DefaultWebClientBuilder().build();
	}

	/**
	 * Variant of {@link #create()} that accepts a default base URL. For more
	 * details see {@link Builder#baseUrl(String) Builder.baseUrl(String)}.
	 * @param baseUrl the base URI for all requests
	 * @see #builder()
	 */
	static WebClient create(String baseUrl) {
		return new DefaultWebClientBuilder().baseUrl(baseUrl).build();
  }
  ... 
}
```



# 2 Configuration

**static factory method로 WebClient 만들기**

```java
WebClient webClient = WebClient.create();
WebClient webClient = WebClient.create("http:localhost:3000");
```

**WebClient.builder() 사용해서  WebClient 만들기**

```java
WebClient client = WebClient.builder()
        .codecs(configurer -> ... )
        .build();
```

```java
WebClient client1 = WebClient.builder()
        .filter(filterA).filter(filterB).build();
```



# 3 [retrieve()](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html#webflux-client-retrieve)

* retrieve() 메서드를 통해 response를 어떻게 뽑아낼 지 지정함
* exchange() 메서드의 간단 버전



## 3.1 ResponseEntity 반환받기

* response로 status code, headers, body를 가진 ResponseEntity를 반환 받는다

```java
WebClient client = WebClient.create("https://example.org");

Mono<ResponseEntity<Person>> result = client.get()
  .uri("/persons/{id}", id).accept(MediaType.APPLICATION_JSON)
  .retrieve()
  .toEntity(Person.class);
```



## 3.2 Body만 반환받기

* response의 body만 뽑아내고 싶다면 bodyToMono 메서드를 이용하자

```java
WebClient client = WebClient.create("https://example.org");

Mono<Person> result = client.get()
  .uri("/persons/{id}", id).accept(MediaType.APPLICATION_JSON)
  .retrieve()
  .bodyToMono(Person.class);
```



## 3.3 에러 핸들링

* 기본적으로 response의 status가 4XX, 5XX 이라면 `WebClientResponseException`이 발생한다
* status 마다 커스텀한 에러 핸들링을 하고 싶다면 아래와 샅이 onStatus 메서드를 사용하자

```java
Mono<Person> result = client.get()
  .uri("/persons/{id}", id).accept(MediaType.APPLICATION_JSON)
  .retrieve()
  .onStatus(HttpStatus::is4xxClientError, response -> ...)
  .onStatus(HttpStatus::is5xxServerError, response -> ...)
  .bodyToMono(Person.class);
```



# 4 exchange()





# Synchronous Use

```java
Person person = client.get().uri("/person/{id}", i).retrieve()
    .bodyToMono(Person.class)
    .block();
```

```java
List<Person> persons = client.get().uri("/persons").retrieve()
    .bodyToFlux(Person.class)
    .collectList()
    .block();
```



# 5  Request Body



## 5.1  [Form Data](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html#webflux-client-body-form)

* 폼 데이터를 전송하려면 바디로 `MultiValueMap<String, String>`를 제공하면 된다
* 그러면 `FormHttpMessageWriter`가 자동적으로 `application/x-www-form-urlencoded` 타입의 바디를 만들어준다

**예시**

```java
MultiValueMap<String, String> formData = ... ;

Mono<Void> result = client.post()
        .uri("/path", id)
        .bodyValue(formData)
        .retrieve()
        .bodyToMono(Void.class);
```



# 6 Testing

* 외부 서비스를 호출하다 보니 목으로 대체하는 경우가 많다
* Mockito를 사용해 WebClient를 모킹하는 것은 매우 번거롭다
  * fluent API를 모킹하면 매우 장황해짐



## 6.1 Mockito 사용

* 아래 예시와 같이 모킹 과정이 상당히 복잡하다

```java
    @Test
    void givenEmployeeId_whenGetEmployeeById_thenReturnEmployee() {

        Integer employeeId = 100;
        Employee mockEmployee = new Employee(100, "Adam", "Sandler", 
          32, Role.LEAD_ENGINEER);
        when(webClientMock.get())
          .thenReturn(requestHeadersUriSpecMock);
        when(requestHeadersUriMock.uri("/employee/{id}", employeeId))
          .thenReturn(requestHeadersSpecMock);
        when(requestHeadersMock.retrieve())
          .thenReturn(responseSpecMock);
        when(responseMock.bodyToMono(Employee.class))
          .thenReturn(Mono.just(mockEmployee));

        Mono<Employee> employeeMono = employeeService.getEmployeeById(employeeId);

        StepVerifier.create(employeeMono)
          .expectNextMatches(employee -> employee.getRole()
            .equals(Role.LEAD_ENGINEER))
          .verifyComplete();
    }
```



## 6.2 MockWebServer 사용

* MockWebServer는 HTTP 요청을 받고 응답을 보내는 작은 웹 서버다
* Test 코드에서 실행되는 Webclient가 MockWebServer와 실제로 상호작용하며 HTTP 요청과 응답을 주고 받는다
* 스프링 팀은 통합 테스트에 MockWebServer를 사용하길 권장한다



> 참고
>
> * https://www.baeldung.com/spring-mocking-webclient



참고

* https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html#webflux-client
