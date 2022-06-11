# 1 [Mockito](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)

* Mock: 진짜 객체와 비슷하게 동작하지만 프로그래머가 직접 그 객체의 행동을 관리하는 객체.
* Mockito: Mock 객체를 쉽게 만들고 관리하고 검증할 수 있는 방법을 제공한다.
* 대체제: [EasyMock](http://easymock.org/), [JMock](http://jmock.org/)



## 1.1 **디펜던시 추가**

* 스프링 부트 2.2+ 프로젝트 생성시 spring-boot-starter-test에서 자동으로 Mockito 추가해 줌.
* 의존성을 직접 추가하려면 아래와 같이 디펜던시를 추가한다.
* https://mvnrepository.com/artifact/org.mockito/mockito-core
* https://mvnrepository.com/artifact/org.mockito/mockito-junit-jupiter

**maven**

```xml
<dependency> 
  <groupId>org.mockito</groupId> 
  <artifactId>mockito-core</artifactId> 
  <version>3.1.0</version> 
  <scope>test</scope>
</dependency>

<dependency>
	<groupId>org.mockito</groupId> 
  <artifactId>mockito-junit-jupiter</artifactId> 
  <version>3.1.0</version>
	<scope>test</scope>
</dependency>
```

**gradle**

```groovy
testImplementation group: 'org.mockito', name: 'mockito-core', version: '4.3.1'
testImplementation group: 'org.mockito', name: 'mockito-junit-jupiter', version: '4.3.1'
```



# 2 Mock 객체 만들기

* Mockito의 Mock은 Class의 타입으로 부터 껍데기 인스턴스를 만든다



**Mockito.mock() 메소드로 만드는 방법**

```java
MemberService memberService = Mockito.mock.mock(MemberService.class); 
StudyRepository studyRepository = mock(StudyRepository.class);
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



# 3 [Mock 객체 Stubbing](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html#stubbing)

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



mockMvc response body 한글 깨짐

* 요청 accept header에 charset=UTF-8을 추가

  * ```java
    this.mockMvc.perform( post("/someUrl") .accept(MediaType.APPLICATION_JSON_UTF8) .params(params) .cookie(getLoginCookie()) )
    ```

* .getContentAsString() 대신 .getContentAsString(StandardCharsets.UTF_8) 사용하기

  * ```java
    String contentAsString = result.getResponse().getContentAsString(StandardCharsets.UTF_8);
    ```



# 4 Annotation



## 4.1 [@InjectMocks](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/InjectMocks.html)

* 테스트 대상 시스템의 협력자를 Mock 또는 Spy로 대체하는 작업을 자동으로 해준다
* 의존성 주입은 생성자 주입, 필드 주입, 세터 주입을 사용함



**예시**

* sut의 협력자를 @Mock 애노테이션으로 Mock으로 대체하고 이를 자동으로 sut에 주입해준다

```java
@ExtendWith(MockitoExtension.class)
class CashReceiptServiceUnitTest {

  @InjectMocks
  private CashReceiptService sut;

  @Mock
  WpayUserRepository wpayUserRepository;

  @Mock
  CashReceiptInfoRepository cashReceiptInfoRepository;
}
```





## 4.2 @Mock

* 



## 4.2 @Spy

* Mockito의 Mock



> 참고
>
> * https://www.baeldung.com/mockito-spy



---




참고

* https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html



관련 자료

* [Mockito, 이대로 괜찮은가?](https://tecoble.techcourse.co.kr/post/2020-10-16-is-ok-mockito/)
