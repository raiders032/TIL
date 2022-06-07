# 1 [WireMock](https://wiremock.org/docs/)

* WireMock은 HTTP mock server다
* 테스트 시 외부 서비스의 API를 호출해야 하는 경우 WireMock을 이용해 대체할 수 있다
* WireMock은 HTTP 서버로 특정한 요청에 미리 준비된 응답을 제공하는 서버다
* WireMock은 들어온 요청을 캡쳐하기 때문에 캡쳐된 요청을 검증하는 것이 가능하다



# 2 Dependency

### Gradle

```groovy
testImplementation "com.github.tomakehurst:wiremock-jre8:2.33.2"
```



# 3 JUnit 5

* JUnit 5를 사용하면 손쉽게 test class에 대해서 하나 이상의 WireMock 인스턴스를 만들 수 있다
* declarative 방식과 programmatic 방식 두 가지 방식을 제공한다



## 3.1 declarative 방식

* 테스트 클래스에 `@WireMockTest` 애노테이션을 붙이면 랜덤 포트로 WireMock 서버가 작동된다
* WireMock 서버는 테스트 클래스의 첫 번째 테스트 메서드가 실행되기 전에 시작되며 마지막 테스트 메서드가 끝나면 종료된다
* 스텁 매핑은 매 테스트마다 초기화 된다



**특정 포트 지정**

* 특정 포트를 지정하고 싶다면 아래와 같이 httpPort 속성을 이용하면 된다

```java
@WireMockTest(httpPort = 8080)
public class FixedPortDeclarativeWireMockTest {
  ...
}
```



**HTTPS 활성화**

* 기본적으로 HTTPS는 활성화되어 있지 않다
* 아래와 같이 `httpsEnabled` 속성으로 활성화 하고 기본적으로 랜덤 포트를 사용하는데 `httpsPort` 속성으로 포트 지정 가능

```java
@WireMockTest(httpsEnabled = true, httpsPort = 8443)
public class HttpsFixedPortDeclarativeWireMockTest {
    ...
}
```



# 4 Stubbing

* 특정한 조건에 맞는 요청에 대해 미리 준비된 응답을 반환하도록 하는 것을 Stubbing이라고 한다



**예시**

* `/some/thing` 로 GET 요청이 들어온 경우 Content-Type은 `text/plain` 이고 body는 `Hello world!`인 응답을 반환한다
* `/some/thing/else` 에 대해서는 Stubbing을 하지 않았기 때문에 요청 시 404로 응답한다  

```java
@Test
public void exactUrlOnly() {
  stubFor(get(urlEqualTo("/some/thing"))
          .willReturn(aResponse()
                      .withHeader("Content-Type", "text/plain")
                      .withBody("Hello world!")));

  assertThat(testClient.get("/some/thing").statusCode(), is(200));
  assertThat(testClient.get("/some/thing/else").statusCode(), is(404));
}
```

> BDD 스타일로 코드를 작성한다면 stubFor 대신에 givenThat을 사용하라



참고

* https://wiremock.org/docs/