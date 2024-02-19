# 1 Interface

* 자바에서 인터페이스는 객체의 사용 방법을 정의한 타입
* 인터페이스는 객체의 교환성을 높여주기 때문에 다형성을 구현하는 매우 중요한 역할을 한다.
* 자바8에서는 람다식으로 함수적 인터페이스의 구현 객체를 생성한다.
* 인터페이스의 모든 메소드는 기본적으로 public 접근 제한자를 갖기 때문에 더 낮은 접근 제한자를 사용할 수 없다.

<br>

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

<br>

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

<br>

## 2.2 Astract Method

* 추상 메서드는 객체가 가지고 있는 메서드를 설명한 것으로 호출할 때 어떤 매개값이 필요하고 리턴 타입이 무엇인지만 알려준다.
* 실제 실행부는 구현 객체가 가지고 있다.
	* 인터페이스를 통해 호출된 메소드는 최종적으로 객체에서 실행된다.
* 추상 메소드는 public abstract의 특성을 갖기 때문에 생략하더라도 컴파일 과정에서 붙게된다.

<br>

## 2.3 Default Method

* 디폴트 메소드는 인터페이스의 모든 구현 객체가 가지고 있는 기본 메소드이다.
	* 그러나 어떤 구현 객체는 디폴트 메소드의 내용이 맞지 않아 수정이 필요할 수 있다
	* 구현 클래스를 작성할 때 디폴트 메소드를 오버라이딩해서 수정할 수 있다.
* 디폴트 메서드는 인터페이스에 선언된다.
* 형태는 클래스의 인스턴스 메서드와 동일하다
* 디폴트 메서드는 public 특성을 갖기 때문에 public 생략해도 컴파일 과정에서 붙게된다.
* 디폴트 메소드는 인터페이스에 선언되지만 인터페이스에서 바로 사용할 수 없다.
	* 추상 메소드가 아닌 인스턴스 메소드이므로 구현 객체가 있어야 사용할 수 있다.
	* 즉 `인터페이스이름.디폴트메소드이름()` 과 같이 호출할 수 없다.

<br>

**Default Method의 필요성**

* 자바 8에서 디폴트 메서드를 허용한 이유는 기존 인터페이스를 확장해서 새로운 기능을 추가하기 위해서다
* 기존 인터페이스의 이름과 추상 메소드의 변경 없디 디폴트 메소드만 추가할수 있다
	* 추상 메소드를 추가하면 기존 구현 클래스에 해당 추상 메소드를 구현해야만 한다.
	* 기존 구현 클래스를 수정할 수 없다면 기존 인터페이스에 새로운 메소드를 추가할 수 없다.
* 따라서 이전에 개발한 구현 클래스를 그대로 사용할 수 있으면서 새롭게 개발하는 클래스는 디폴트 메소드를 활용할 수 있다.

<br>

**Default Method의 상속**

* 자식 인터페이스에서 디폴트 메소드를 활용하는 방법은 세 가지가 있다.
  1. 단순히 상속만 받는다
  2. 디폴트 메소드를 오버라이딩한다
  3. 디폴트 메소드를 추상 메소드로 재선언한다.

<br>

**Default Method 예시**

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

<br>

**Default Method 예시2**

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



**Default Method 예시3**

> 디폴트 메서드없던 시절엔 WebMvcConfigurer 인터페이스 구현한 WebMvcConfigurerAdapter 추상 클래스를 상속받아 사용했다. WebMvcConfigurerAdapter는 WebMvcConfigurer의 모든 메소드를 재정의 했지만 메소드의 바디는 비어있다. 따라서 개발자들은WebMvcConfigurerAdapter를 상속받아 필요한 메소드만 재정의해서 WebMvcConfigurer의 모든 메소드를 재정의하지 않고 사용이 가능했다. 그러나 디폴트 메소드가 생기고 WebMvcConfigurer의 모든 메소드가 디폴트 메소드가 되면서 WebMvcConfigurerAdapter는 더이상 쓸모가 없어져 Deprecated 됐다

```java
@Deprecated
public abstract class WebMvcConfigurerAdapter implements WebMvcConfigurer {

	/**
	 * {@inheritDoc}
	 * <p>This implementation is empty.
	 */
	@Override
	public void configurePathMatch(PathMatchConfigurer configurer) {
	}
  
  @Override
	public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
	}
  
  ...
}
```

<br>

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

<br>

# 3 Interface 구현

* 코드에서 인터페이스 메소드를 호출하면 인터페이스는 객체의 메소드를 호출한다.
* 객체는 인터페이스의 정의된 추상 메소드와 동일한 시그니쳐(메소드 이름, 매개 타입, 리턴 타입)를 가진 실체 메소드를 가지고 있어야한다.
* 이러한 객체를 구현 객체라고 하고, 구현 객체를 생성하는 클래스는 **구현 클래스**라고 한다.

<br>

## 3.1 구현 클래스

* 인터페이스 타입으로 사용할 수 있음을 알려주기 위해 클래스 선언부에 `implements` 키워드를 추가한다.
* 만약 인터페이스의 선언된 추상 메소드에 대응하는 실체 메소드를 작성하지 않으면 구현 클래스는 자동적으로 추상 클래스가 된다.
	* 따라서 키워드에 `abstract` 추가해야한다.

```java
public class 구현클래스이름 implements 인터페이스명 {
  // 인터페이스에 선언된 추상 메소드의 실체 메소드 선언
}
```

<br>

## 3.2 Anonymous Class

* 익명 클래스란 **소스 파일을 만들지 않고 구현 객체를 만들 수 있는 방법**
* 구현 클래스를 만드는 것이 클래스를 재사용하기 때문에 일반적이지만 일회성 구현 객체를 만들기 위해 소스 파일을 만들고 클래스를 선언하는 것은 비효율적이다.
* 모든 객체는 클래스로부터 생성되는데 익명 구현 객체도 예외는 아니다.
	* 자바 컴파일러가 자동으로 클래스 파일을 만들어준다.
	* 자동으로 만들어진 클래스 이름: `인터페이스이름$1`
		* 인터페이스 이름 뒤에 $가 붙고 생성 번호가 붙는다
		* 생성 번호는 1부터 시작 두번째 익명 클래스를 만들면 생성번호는 2가 된다.
* [Anonymous-Class.md](../Anonymous-Class/Anonymous-Class.md)

<br>

# 4 인터페이스 사용

* 인터페이스 구현 객체를 사용하려면 인터페이스 변수를 선언하고 구현 객체를 대입해야한다.
* 인터페이스 변수는 참조 타입이기 때문에 구현 객체의 번지를 저장한다.

<br>

# 5 Functional Interface

* 모든 인터페이스를 람다식의 타겟 타입으로 사용할 수 없다
	* 두 개 이상의 추상 메서드가 선언된 인터페이스는 람다식을 이용해서 구현 객체를 생성할 수 없다.
* 하나의 추상 메서드가 선언된 인터페이스만이 람다식의 타켓 타입이 될 수 있다
	* 이러한 인터페이스를 함수적 인터페이스(functional interface)라고 한다.
* `@FunctionalInterface` 를 인터페이스에 적용하면 두 개 이상의 추상 메서드가 선언되지 않도록 컴파일 시점에 체킹할 수 있다.
* [Lambda.md](../Lambda/Lambda.md) 

<br>

참고

* 이것이 자바다(이상민 저)
