

# 1 Spring Type Conversion

* 타입 변환하기
* 스프링의 타입 변환 적용 예
  * 스프링 MVC 요청 파라미터: @RequestParam , @ModelAttribute , @PathVariable
  * @Value 등으로 YML 정보 읽기
  * 뷰 템플릿



**주의**

* 메시지 컨버터( HttpMessageConverter )에는 컨버전 서비스가 적용되지 않는다.
  * HttpMessageConverter 의 역할은 HTTP 메시지 바디의 내용을 객체로 변환하거나 객체를 HTTP 메시지 바디에 입력하는 것이다. 
  * 예를 들어서 JSON을 객체로 변환하는 메시지 컨버터는 내부에서 Jackson 같은 라이브러리를 사용한다. 
  * 객체를 JSON으로 변환한다면 그 결과는 이 라이브러리에 달린 것이다. 
  * 따라서 JSON 결과로 만들어지는 숫자나 날짜 포맷을 변경하고 싶으면 해당 라이브러리가 제공하는 설정을 통해서 포맷을 지정해야 한다. 
  * 결과적으로 이것은 컨버전 서비스와 전혀 관계가 없다.



# 2 컨버터 사용하기

* 커스텀한 컨버터를 생성하려면 Converter 인터페이스를 구현하면된다. 
* 타입 컨버터 인터페이스는 단순하나 타입 컨버터를 하나하나 직접 사용하기엔 무리가 있다.
  * 개발자가 직접 컨버팅 하는 것과 큰 차이가 없다. 
* 타입 컨버터를 등록하고 관리하면서 편리하게 변환 기능을 제공하는 역할을 하는 무언가가 필요하다.



## 2.1 컨버터 인터페이스

```java
package org.springframework.core.convert.converter;

public interface Converter<S, T> {
  T convert(S source);
}
```



## 2.2 컨버터 구현

**StringToIntegerConverter - 문자를 숫자로 변환하는 타입 컨버터**

```java
import org.springframework.core.convert.converter.Converter;

public class StringToIntegerConverter implements Converter<String, Integer> {
    @Override
    public Integer convert(String source) {
        return Integer.valueOf(source);
    }
}
```



**IntegerToStringConverter - 숫자를 문자로 변환하는 타입 컨버터**

```java
import org.springframework.core.convert.converter.Converter;

public class IntegerToStringConverter implements Converter<Integer, String> {

    @Override
    public String convert(Integer source) {
        return String.valueOf(source);
    }
}
```



# 3 ConversionService

* 스프링은 개별 컨버터를 모아두고 그것들을 묶어서 편리하게 사용할 수 있는 기능을 제공한다.
* 이것이 바로 컨버전 서비스(`ConversionService`)이다.



## 3.1 ConversionService 인터페이스

* `canConvert()` : 컨버팅이 가능한지 체크하는 메서드
* `convert()` `source`에서 `targetType`으로 컨버팅하는 메서드

```java
package org.springframework.core.convert;

import org.springframework.lang.Nullable;

public interface ConversionService {
    boolean canConvert(@Nullable Class<?> sourceType, Class<?> targetType);

    boolean canConvert(@Nullable TypeDescriptor sourceType, TypeDescriptor targetType);

    <T> T convert(@Nullable Object source, Class<T> targetType);

    Object convert(@Nullable Object source, @Nullable TypeDescriptor sourceType, TypeDescriptor targetType);
}
```



## 3.2 DefaultConversionService

* `ConversionService` 인터페이스의 구현체
  * 컨버터를 사용하는 용도
* `ConverterRegistry` 인터페스의 구현체
  * 컨버터를 등록하는 용도

```java
public class ConversionServiceTest {
    @Test
    void conversionService() {
        DefaultConversionService conversionService = new DefaultConversionService();
        
        //컨버터 등록
        conversionService.addConverter(new StringToIntegerConverter());
        conversionService.addConverter(new IntegerToStringConverter());
        conversionService.addConverter(new StringToIpPortConverter());
        conversionService.addConverter(new IpPortToStringConverter());
        
        //컨버터 사용
        assertThat(conversionService.convert("10", Integer.class)).isEqualTo(10);
        assertThat(conversionService.convert(10, String.class)).isEqualTo("10");
    }
}
```



**등록과 사용 분리**

* 컨버터를 등록할 때는 StringToIntegerConverter 같은 타입 컨버터를 명확하게 알아야 한다.
* 반면에 컨버터를 사용하는 입장에서는 타입 컨버터를 전혀 몰라도 된다.
* 타입 컨버터들은 모두 컨버전 서비스 내부에 숨어서 제공된다.
* 따라서 타입을 변환을 원하는 사용자는 컨버전 서비스 인터페이스에만 의존하면 된다.
* 물론 컨버전 서비스를 등록하는 부분과 사용하는 부분을 분리하고 의존관계 주입을 사용해야 한다.



## 3.3 스프링에 Converter 적용하기

* 스프링은 내부에서 ConversionService 를 제공한다.
* WebMvcConfigurer가 제공하는 addFormatters() 를 사용해서 추가하고 싶은 컨버터를 등록하면 된다. 
* 스프링은 내부에서 사용하는 ConversionService에 컨버터를 추가해준다.
  *  스프링 부트는 DefaultFormattingConversionService를 상속 받은 WebConversionService 를 내부에서 사용한다.
* ConversionService String을 Integer로 변환해주는 컨버터는 이미 있지만 직접 등록한 컨버터가 우선순위를 가진다. 

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
  @Override
  public void addFormatters(FormatterRegistry registry) {
    registry.addConverter(new StringToIntegerConverter());
    registry.addConverter(new IntegerToStringConverter());
    registry.addConverter(new StringToIpPortConverter());
    registry.addConverter(new IpPortToStringConverter());
  }
}
```



## 3.4 컨버전 서비스 사용

* 사용자는 실제 어떤 컨버터가 사용되는지 모른다.

```java
Integer value = conversionService.convert("10", Integer.class);
```



# 4 Formatter

* Converter 는 입력과 출력 타입에 제한이 없는, 범용 타입 변환 기능을 제공한다.
* Converter 는 범용(객체 ->  객체)
* Formatter 는 문자에 특화(객체 ->문자, 문자 -> 객체) + 현지화(Locale)
* **Formatter 는 객체를 문자로 변환하거나 문자를 객체로 변환하는데 특화된 Converter이다.**



## 4.1 Formatter 인터페이스

* String print(T object, Locale locale) : 객체를 문자로 변경한다. 
* T parse(String text, Locale locale) : 문자를 객체로 변경한다.

```java
public interface Printer<T> {
    String print(T object, Locale locale);
}

public interface Parser<T> {
  T parse(String text, Locale locale) throws ParseException;
}

public interface Formatter<T> extends Printer<T>, Parser<T> {
}
```



## 4.2 Formatter 구현

* 숫자 `1000`을 문자 `1,000` 으로 변환해주는 Formatter 구현하기
* Locale 정보를 활용해서 나라별로 다른 숫자 포맷을 만들어 줄 수 있다.

```java
import org.springframework.format.Formatter;

@Slf4j
public class MyNumberFormatter implements Formatter<Number> {
  @Override
  public Number parse(String text, Locale locale) throws ParseException {
    log.info("text={}, locale={}", text, locale);
    NumberFormat format = NumberFormat.getInstance(locale);
    return format.parse(text);
  }
  
  @Override
  public String print(Number object, Locale locale) {
    log.info("object={}, locale={}", object, locale);
    return NumberFormat.getInstance(locale).format(object);
  }
}
```



**테스트**

```java
class MyNumberFormatterTest {
  MyNumberFormatter formatter = new MyNumberFormatter();

  @Test
  void parse() throws ParseException {
    Number result = formatter.parse("1,000", Locale.KOREA); 		
    assertThat(result).isEqualTo(1000L); //Long 타입 주의
  }

  @Test
  void print() {
    String result = formatter.print(1000, Locale.KOREA);
    assertThat(result).isEqualTo("1,000");
  }
}
```



## 4.3 DefaultFormattingConversionService

* 컨버전 서비스에는 컨버터만 등록할 수 있고, 포맷터를 등록할 수 는 없다.
* 포맷터를 지원하는 컨버전 서비스를 사용하면 컨버전 서비스에 포맷터를 추가할 수 있다. 
  * 내부에서 어댑터 패턴을 사용해서 Formatter 가 Converter 처럼 동작하도록 지원한다.
* FormattingConversionService는 포맷터를 지원하는 컨버전 서비스이다.
* DefaultFormattingConversionService 는 FormattingConversionService 에 기본적인 통화, 숫자 관련 몇가지 기본 포맷터를 추가해서 제공한다.
* 스프링 부트는 DefaultFormattingConversionService 를 상속 받은 WebConversionService 를 내부에서 사용한다.

```java
public class FormattingConversionServiceTest {
  @Test
  void formattingConversionService() {
    DefaultFormattingConversionService conversionService = new DefaultFormattingConversionService();
    //컨버터 등록
    conversionService.addConverter(new StringToIpPortConverter());
    conversionService.addConverter(new IpPortToStringConverter()); 
    //포맷터 등록
    conversionService.addFormatter(new MyNumberFormatter());
    
    //컨버터 사용
    IpPort ipPort = conversionService.convert("127.0.0.1:8080", IpPort.class);
    assertThat(ipPort).isEqualTo(new IpPort("127.0.0.1", 8080)); 
    
    //포맷터 사용
    assertThat(conversionService.convert(1000, String.class)).isEqualTo("1,000");
    assertThat(conversionService.convert("1,000", Long.class)).isEqualTo(1000L);
  }
}
```



## 4.4 Formatter 적용하기

* Formatter보다 Converter가 우선순위를 가진다.



**Formatter 등록**

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
  @Override
  public void addFormatters(FormatterRegistry registry) {
  	registry.addConverter(new StringToIpPortConverter()); 
    registry.addConverter(new IpPortToStringConverter());
    registry.addFormatter(new MyNumberFormatter());
  }
}
```



## 4.5 애노테이션 Formatter

* 객체의 각 필드마다 다른 형식으로 포맷을 지정하기
* 애노테이션 기반으로 원하는 형식을 지정해서 사용할 수 있는 매우 유용한 포맷터 두 가지를 기본으로 제공한다.
* @NumberFormat 
  * 숫자 관련 형식 지정 포맷터 사용
  * NumberFormatAnnotationFormatterFactory
* @DateTimeFormat
  * 날짜 관련 형식 지정 포맷터 사용
  * Jsr310DateTimeFormatAnnotationFormatterFactory

```java
@Data
static class Form {
  @NumberFormat(pattern = "###,###")
  private Integer number;
  
  @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime localDateTime;
}
```

