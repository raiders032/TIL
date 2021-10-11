# 1 [Internationalization using `MessageSource`](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#context-functionality-messagesource)

> `ApplicationContext` 인터페이스는 `MessageSource`라는 인터페이스를 상속하므로 국제화 기능을 제공합니다. 이 인터페이스는 스프링이 메세지를 가져오는 기반을 제공합니다. 

* 하드 코딩된 문자열들이 별도의 파일로 관리할 때 `MessageSource`를 사용한다.
* 메시지 파일을 각 나라별로 별도로 관리하면 서비스를 국제화 할 수 있다.



# 2 스프링 메시지 소스 설정

> 메시지 관리 기능을 사용하려면 스프링이 제공하는 `MessageSource` 를 스프링 빈으로 등록하면 되는데, `MessageSource` 는 인터페이스이다. 따라서 구현체인 `ResourceBundleMessageSource` 를 스프링 빈으로 등록하면 된다



## 2.1 직접 등록

```java
@Bean
public MessageSource messageSource() {
    ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
    messageSource.setBasenames("messages", "errors");
    messageSource.setDefaultEncoding("utf-8");
    return messageSource;
}
```

* `basenames` : 설정 파일의 이름을 지정한다.
  * `messages` 로 지정하면 `messages.properties` 파일을 읽어서 사용한다.
* 국제화 기능을 적용하려면 `basenames` 뒤에 언어 정보를 표시한다.
  * 예시) `messages_en.properties` , `messages_ko.properties`
* `messages.properties`를 기본으로 사용한다.
* 파일의 위치는 `/resources/messages.properties`이다
* 여러 파일을 한번에 지정할 수 있다.
* 여기서는 `messages` , `errors` 둘을 지정했다.
* `defaultEncoding` : 인코딩 정보를 지정한다. utf-8 을 사용하면 된다.



## 2.2 스프링 부트

>  스프링 부트를 사용하면 스프링 부트가 MessageSource 를 자동으로 스프링 빈으로 등록한다.

**메세지 소스 설정**

* 스프링 부트에서는 아래와 같이 메세지 소스를 설정할 수 있다.
* `/resources/config/i18n/messages.properties`를 메시지 파일로 사용한다.

```properties
spring.messages.basename=config.i18n.messages
```

**스프링 부트 메시지 소스 기본 값**

* `MessageSource`를 스프링 빈으로 등록하지 않고, 스프링 부트와 관련된 별도의 설정을 하지 않으면 `messages` 라는 이름으로 기본 등록된다.
* 따라서 `messages_en.properties` , `messages_ko.properties` , `messages.properties` 파일만 등록하면 자동으로 인식된다.



## 2.3 메시지 파일 만들기

**messages.properties 작성**

```properties
hello=안녕
hello.name=안녕 {0}
```

**messages_en.properties 작성**

```properties
hello=hello
hello.name=hello {0}
```



# 3 스프링 메시지 소스 사용



## 3.1 **MessageSource 인터페이스**

```java
public interface MessageSource {
    String getMessage(String code, @Nullable Object[] args, @Nullable String defaultMessage, Locale locale);

    String getMessage(String code, @Nullable Object[] args, Locale locale) throws NoSuchMessageException;
}
```

`String getMessage(String code, Object[] args, String default, Locale loc)`

* `MessageSource`에서 메시지를 검색하는 데 사용되는 기본 방법이다. 지정된 로케일에 대한 메시지를 찾을 수 없는 경우 `defaultMessage`가 사용된다. 전달된 `args`는 표준 라이브러리에서 제공하는 `MessageFormat` 기능을 사용하여 메세지의 값을 대체한다.

`String getMessage(String code, Object[] args, Locale loc)`

* 본질적으로 이전 방법과 동일하지만 다음과 한 가지 차이점이 있다. `defaultMessage`를 지정하지 않았기 때문에 메시지를 찾을 수 없는 경우 `NoSuchMessage`예외를 던진다.



## 3.2 메시지 소스 사용

```java
@SpringBootTest
public class MessageSourceTest {
    @Autowired
    MessageSource ms;

    @Test
    void helloMessage() {
        String result = ms.getMessage("hello", null, null);
        assertThat(result).isEqualTo("안녕");
    }
}
```

```java
 @Test
void notFoundMessageCode() {
    assertThatThrownBy(() -> ms.getMessage("no_code", null, null))
        .isInstanceOf(NoSuchMessageException.class);
}
```

* 메시지가 없는 경우에는 `NoSuchMessageException` 이 발생한다. 

```java
@Test
void notFoundMessageCodeDefaultMessage() {
    String result = ms.getMessage("no_code", null, "기본 메시지", null);
    assertThat(result).isEqualTo("기본 메시지");
}
```

* 메시지가 없으면 기본 메시지( `defaultMessage` )를 사용한다.

```java
@Test
void argumentMessage() {
    String result = ms.getMessage("hello.name", new Object[]{"Spring"}, null);
    assertThat(result).isEqualTo("안녕 Spring");
}	
```

* 메시지의 {0} 부분은 매개변수를 전달해서 치환할 수 있다



## 3.3 국제화 파일 선택

*  `locale` 정보를 기반으로 국제화 파일을 선택한다.
  * 한국에서 접근한 것인지 영어에서 접근한 것인지는 인식하는 방법은 HTTP `accept-language` 해더 값을 사용한다.
  * `Accept-Language`는 클라이언트가 서버에 기대하는 언어 정보를 담아서 요청하는 HTTP 요청 헤더이다.
* `Locale`이 en_US 의 경우 `messages_en_US` `messages_en` `messages` 순서로 찾는다.
* `Locale` 에 맞추어 구체적인 것이 있으면 구체적인 것을 찾고, 없으면 디폴트를 찾는다고 이해하면 된다.

```java
@Test
void defaultLang() {
     assertThat(ms.getMessage("hello", null, null)).isEqualTo("안녕");
     assertThat(ms.getMessage("hello", null, Locale.KOREA)).isEqualTo("안녕");
}
```

* `ms.getMessage("hello", null, null)` : `locale` 정보가 없으므로 `messages` 를 사용한다
* `ms.getMessage("hello", null, Locale.KOREA)` : locale 정보가 있지만, `message_ko` 가 없으므로 `messages` 를 사용한다

```java
@Test
void enLang() {
    assertThat(ms.getMessage("hello", null, Locale.ENGLISH)).isEqualTo("hello");
}
```

* `ms.getMessage("hello", null, Locale.ENGLISH)` : `locale` 정보가 `Locale.ENGLISH` 이므로 `messages_en` 을 찾아서 사용한다



# 4 타임리프 메시지 적용

* 타임리프의 메시지 표현식 #{...} 를 사용하면 스프링의 메시지를 편리하게 조회할 수 있다.

**메세지 파일**

```properties
label.item=상품
label.item.id=상품 ID
label.item.itemName=상품명
label.item.price=가격
label.item.quantity=수량

page.items=상품 목록
page.item=상품 상세
page.addItem=상품 등록
page.updateItem=상품 수정

button.save=저장
button.cancel=취소
```

**타임리프 메시지 적용**

**렌더링 전**

```
<div th:text="#{label.item}"></h2>
```

**렌더링 후**

```
<div>상품</h2>
```



참고

* https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#context-functionality-messagesource
* https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-2/dashboard