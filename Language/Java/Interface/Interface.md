# 1 Interface

* 자바에서 인터페이스는 객체의 사용 방법을 정의한 타입
* 인터페이스는 객체의 교환성을 높여주기 때문에 다형성을 구현하는 매우 중요한 역할을 한다.
* 자바8에서는 람다식으로 함수적 인터페이스의 구현 객체를 생성한다.

# 2 Interface의 구성

* 인터페이스는 `Constant Field`, `Astract Method`, `Default Method`, `Static Method` 로 구성된다.

**Interface 예시**

```java
public interface RemoteControl {
  // Constant Field
	int MAX_VOLUME = 10;
	int MIN_VOLUME = 0;

  // Astract Method
	void turnOn();
	void turnOff();
	void setVolume(int volume);

  // Default Method
	default void setMute(boolean mute) {
		if(mute)	{ System.out.println("무음 처리합니다."); }
		else		{ System.out.println("무음 해제합니다."); }
	}
	
	// Static Method
	static void changeBattery() {
		System.out.println("건전지를 교환합니다.");
	}
}
```



## 2.1 Constant Field

* 인터페이스는 객체의 사용 설명서로 런타임 시 데이터를 저장할 수 있는 필드를 선언한 수 없다.
* 그러나 **상수 필드는 선언이 가능**하다.
* 상수는 인터페이스에 고정된 값으로 런타임 시에 데이터를 바꿀 수 없다.
* 상수를 선언할 때에는 **반드시 초기값을 대입**해야 한다.
  * 인터페이스는 static {} 블록으로 초기화할 수 없다.
* 상수는 `public static final`로 선언하는데 이를 생략해도 컴파일 과정에서 붙게 된다.

```java
// Constant Field
// public static final 생략
int MAX_VOLUME = 10;
int MIN_VOLUME = 0;
```





## 2.2 Astract Method

* 추상 메서드는 객체가 가지고 있는 메서드를 설명한 것으로 호출할 때 어떤 매개값이 필요하고 리턴 타입이 무엇인지만 알려준다.
* 실제 실행부는 구현 객체가 가지고 있다.
  * 인터페이스를 통해 호출된 메소드는 최종적으로 객체에서 실행된다.
* 추상 메소드는 public abstract의 특성을 갖기 때문에 생략하더라도 컴파일 과정에서 붙게된다.



## 2.3 Default Method

* 디폴트 메서드는 인터페이스에 선언된다.
* 자바 8에서 디폴트 메서드를 허용한 이유는 기존 인터페이스를 확장해서 새로운 기능을 추가하기 위해서다
* 형태는 클래스의 인스턴스 메서드와 동일하다
* 디폴트 메서드는 public 특성을 갖기 때문에 public 생략해도 컴파일 과정에서 붙게된다.

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



## 2.4 Static Method

* 형태는 클래스의 정적 메서드와 동일하다
* 정적 메서드는 public 특성을 갖기 때문에 public 생략해도 컴파일 과정에서 붙게된다.
* 인터페이스의 정적 메소드는 **인터페이스로 바로 호출이 가능**하다.
  * 예시: `Comparator.nullsFirst();`

```java
@FunctionalInterface
public interface Comparator<T> {
        public static <T> Comparator<T> nullsFirst(Comparator<? super T> comparator) {
        return new Comparators.NullComparator<>(true, comparator);
    }
}
```



참고

* 이것이 자바다(이상민 저)
