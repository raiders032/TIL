# [Mockito](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)

* Mock: 진짜 객체와 비슷하게 동작하지만 프로그래머가 직접 그 객체의 행동을 관리하는 객체.
* Mockito: Mock 객체를 쉽게 만들고 관리하고 검증할 수 있는 방법을 제공한다.
* 대체제: [EasyMock](http://easymock.org/), [JMock](http://jmock.org/)



**디펜던시 추가**

* 스프링 부트 2.2+ 프로젝트 생성시 spring-boot-starter-test에서 자동으로 Mockito 추가해 줌.
* 의존성을 직접 추가하려면 아래와 같이 디펜던시를 추가한다.

```xml
<dependency> 
  <groupId>org.mockito</groupId> 
  <artifactId>mockito-core</artifactId> 
  <version>3.1.0</version> <scope>test</scope>
</dependency>

<dependency>
	<groupId>org.mockito</groupId> 
  <artifactId>mockito-junit-jupiter</artifactId> 
  <version>3.1.0</version>
	<scope>test</scope>
</dependency>
```



## Mock 객체 만들기

**Mockito.mock() 메소드로 만드는 방법**

```java
MemberService memberService = Mockito.mock.mock(MemberService.class); StudyRepository studyRepository = mock(StudyRepository.class);
```



**@Mock 애노테이션으로 만드는 방법**

* `@Mock` 을 사용하기 위해선 extension으로 MockitoExtension을 사용해야 한다.

```java
@ExtendWith(MockitoExtension.class) 
class StudyServiceTest {
    @Mock 
  	MemberService memberService;
    @Mock 
  	StudyRepository studyRepository;
}
```



**메소드 매개변수에도 @Mock을 사용할 수 있다**

```java
@ExtendWith(MockitoExtension.class)
class StudyServiceTest {
    @Test
    void createStudyService(@Mock MemberService memberService, @Mock StudyRepository studyRepository) {
        StudyService studyService = new StudyService(memberService, studyRepository);
        assertNotNull(studyService);
    }
}
```



## [Mock 객체 Stubbing](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html#stubbing)

* Mock이 어떻게 동작해야 하는지 관리하는 방법
* Mock 객체의 기본 행동
  * Null을 리턴한다. (Optional 타입은 Optional.empty 리턴)
  * Primitive 타입은 기본 Primitive 값.
  * 콜렉션은 비어있는 콜렉션.
  * Void 메소드는 예외를 던지지 않고 아무런 일도 발생하지 않는다.

```java
import static org.mockito.BDDMockito.given;
@Test
void send() {
  //given
  SendEmailRequest request = SendEmailRequest.builder()
    .from("nameks17@gmail.com")
    .to(Lists.newArrayList("nameks@naver.com"))
    .subject("test subject")
    .content("test content")
    .build();

  SendMailResponse response = SendMailResponse.builder()
    .message("ok")
    .build();

  given(mailService.send(request)).willReturn(response);

  //when
  SendMailResponse result = mailService.send(request);

  //then
  assertEquals("ok", result.getMessage());
}
```



# 호출 검증하기

```java
//using mock
mockedList.add("once");

mockedList.add("twice");
mockedList.add("twice");

mockedList.add("three times");
mockedList.add("three times");
mockedList.add("three times");

//following two verifications work exactly the same - times(1) is used by default
verify(mockedList).add("once");
verify(mockedList, times(1)).add("once");

//exact number of invocations verification
verify(mockedList, times(2)).add("twice");
verify(mockedList, times(3)).add("three times");

//verification using never(). never() is an alias to times(0)
verify(mockedList, never()).add("never happened");

//verification using atLeast()/atMost()
verify(mockedList, atMostOnce()).add("once");
verify(mockedList, atLeastOnce()).add("three times");
verify(mockedList, atLeast(2)).add("three times");
verify(mockedList, atMost(5)).add("three times");
```





#### mockMvc response body 한글 깨짐

* 요청 accept header에 charset=UTF-8을 추가

  * ```java
    this.mockMvc.perform( post("/someUrl") .accept(MediaType.APPLICATION_JSON_UTF8) .params(params) .cookie(getLoginCookie()) )
    ```

* .getContentAsString() 대신 .getContentAsString(StandardCharsets.UTF_8) 사용하기

  * ```java
    String contentAsString = result.getResponse().getContentAsString(StandardCharsets.UTF_8);
    ```

    



