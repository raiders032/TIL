## Interface



## Astract Method

* 추상 메서드는 객체가 가지고 있는 메서드를 설명한 것으로 호출할 때 어떤 매개값이 필요하고 리턴 타입이 무엇인지만 알려준다.
* 실제 실행부는 구현 객체가 가지고 있다.



## Default Method

* 디폴트 메서드는 인터페이스에 선언된다.
* 자바 8에서 디폴트 메서드허용한 이유는 기존 인터페이스를 확장해서 새로운 기능을 추가하기 위해서다
* 형태는 클래스의 인스턴스 메서드와 동일하다
* 디폴트 메서드는 public 특성을 갖기 떄문에 public 생략 가능

```java
public interface Iterable<T> {
    default void forEach(Consumer<? super T> action) {
        Objects.requireNonNull(action);
        for (T t : this) {
            action.accept(t);
        }
    }
}
```

```java
public interface WebMvcConfigurer {
	default void configurePathMatch(PathMatchConfigurer configurer) {
	}
    
	default void addCorsMappings(CorsRegistry registry) {
	}
}

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
     @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
        .allowedOrigins("*")
        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(true)
        .maxAge(MAX_AGE_SECS);
    }
}
```

* WebMvcConfigurer의 디폴트 메서드가 선언되어 있어 WebMvcConfigurer를 구현한 WebMvcConfig 클래스에서 모든 메서드를 정의하지 않아도 된다.
  * 필요한 메서드 addCorsMappings만 재정의 했다.



## Static Method

* 형태는 클래스의 정적 메서드와 동일하다
* 스태틱 메서드는 public 특성을 갖기 떄문에 public 생략 가능
* 인터페이스의 정적 메소드는 인터페이스로 바로 호출이 가능하다.
  * 예시: Comparator.nullsFirst();

```java
@FunctionalInterface
public interface Comparator<T> {
        public static <T> Comparator<T> nullsFirst(Comparator<? super T> comparator) {
        return new Comparators.NullComparator<>(true, comparator);
    }
}
```

