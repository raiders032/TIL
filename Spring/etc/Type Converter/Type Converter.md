

# 컨버터 인터페이스

* 스프링에 추가적인 타입 변환이 필요하면 이 인터페이스를 구현해서 등록하면 된다.

```java
package org.springframework.core.convert.converter;

public interface Converter<S, T> {
  T convert(S source);
}
```

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

* 타입 컨버터 인터페이스는 단순하나 타입 컨버터를 하나하나 직접 사용하기엔 무리가 있다.
  * 개발자가 직접 컨버팅 하는 것과 큰 차이가 없다. 
* 타입 컨버터를 등록하고 관리하면서 편리하게 변환 기능을 제공하는 역할을 하는 무언가가 필요하다.



# ConversionService

* 스프링은 개별 컨버터를 모아두고 그것들을 묶어서 편리하게 사용할 수 있는 기능을 제공한다.
* 이것이 바로 컨버전 서비스(`ConversionService`)이다.



**ConversionService 인터페이스**

* `canConvert()` : 컨버팅이 가능한지 체크하는 메서드
* `convert()` `source`에서 `targetType`으로 컨버팅하는 메서드

```java
package org.springframework.core.convert;

import org.springframework.lang.Nullable;

public interface ConversionService {
    boolean canConvert(@Nullable Class<?> sourceType, Class<?> targetType);

    boolean canConvert(@Nullable TypeDescriptor sourceType, TypeDescriptor
            targetType);

    <T> T convert(@Nullable Object source, Class<T> targetType);

    Object convert(@Nullable Object source, @Nullable TypeDescriptor sourceType, TypeDescriptor targetType);
}
```



**DefaultConversionService**

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



**컨버전 서비스 사용**

* 사용자는 실제 어떤 컨버터가 사용되는지 모른다.

```java
Integer value = conversionService.convert("10", Integer.class)
```







