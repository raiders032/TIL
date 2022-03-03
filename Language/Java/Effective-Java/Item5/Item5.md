# 자원을 직접 명시하지 말고 의존 객체 주입을 사용하라



# 1 개요

* 많은 클래스가 하나 이상의 자원에 의존한다.
* 가령 맞춤법 검사기(SpellChecker)는 사전(dictionary)에 의존하는데, 이런 클래스를 정적 유틸리티 클래스로 구현한 모습을 드물지 않게 볼 수 있다.



**정적 유틸리티를 잘못 사용한 예**

* 유연하지 않고 테스트하기 어렵다
  * 사용할 사전이 단 한가지라고 가정하고 의존하는 객체를 클라이언트가 직접 생성하고 있기 때문

```java
public class SpellChecker {
    private static final Lexicon dictionary = ...;

    private SpellChecker() {} // 객체 생성 방지

    public static boolean isValid(String word) { ... }
    public static List<String> suggestions (String typo) { ... }
}
```



**싱글턴을 잘못 사용한 예**

* 유연하지 않고 테스트하기 어렵다
  * 사용할 사전이 단 한가지라고 가정하고 의존하는 객체를 클라이언트가 직접 생성하고 있기 때문

```java
public class SpellChecker {
    private final Lexicon dictionary = ...;

    private SpellChecker() {}
    public static SpellChecker INSTANCE = new SpellChecker(...);

    public boolean isValid(String word) { ... }
    public List<String> suggestions (String typo) { ... }
}
```

* 두 방식 모두 사전을 단 하나만 사용한다고 가정한다는 점에서 그리 훌륭해 보이지 않다. 
* 실전에서는 사전이 언어별로 있을 수도 있고, 특수 어휘용 사전을 별도로 두기도 한다. 심지어 테스트용 사전이 필요할 수 있다. 
* 사전 하나로 이 모든 쓰임에 대응할 수 있기를 바라는 것은 너무 순진한 생각이다.

> **클래스가 내부적으로 하나 이상의 자원에 의존하고, 그 자원이 클래스 동작에 영향을 준다면 싱글턴(Singleton) 과, 정적 유틸리티(static util class)는 사용하지 않는 것이 좋다.**

# 2 의존 객체 주입

* SpellChecker가 여러 사전을 사용할 수 있도록 만들어보자.
  * 클래스(SpellChecker)가 여러 자원 인스턴스를 지원해야 하며, 클라이언트가 원하는 자원(dictionary)을 사용해야 한다. 
* 의존 객체 주입 패턴은 아주 단순하여 수많은 프로그래머가 이 방식에 이름이 있다는 사실도 모른 채 사용해왔다.
* [Dependency-Injection.md](../../../../Spring/Spring-Framework/Core/Dependency-Injection/Dependency-Injection.md) 참고



## 2.1 의존 객체 주입의 장점

* 예시에서는 dictionary라는 딱 하나의 자원을 사용하지만, 자원이 몇 개든 의존 관계가 어떻든 상관 없이 잘 작동한다.
* 유연하고 테스트가 쉽다
* 의존 객체 주입은 생성자, 정적 팩터리, 빌더 모두에 똑같이 응용할 수 있다.



## 2.2 의존 객체 주입의 단점

* 의존성이 많은 경우 코드를 어지럽게 할 수 있다.
* 의존 객체 주입 프레임워크(대거, 주스, 스프링 등)를 사용하면 해소할 수 있다



## 2.3 setter 주입

* 간단히 dictionary 필드에서 final 한정자를 제거하고 다른 사전으로 교체하는 메서드를 추가한다(setter)
* 아쉽게도 setter 주입 방식은 어색하고 오류를 내기 쉬우며 멀티쓰레드 환경에서는 쓸 수 없다.

**예시**

```java
public class SpellChecker {

  private Lexicon dictionary = ...; //final 제거

  public SpellChecker() {
  }

  public void setDictionary(Lexicon dictionary) { //dictionary 변경 메서드
    this.dictionary = dictionary;
  }

  public boolean isValid(String word) {...}
  public List<String> suggestions(String typo) {...}
}
```



## 2.4 생성자 주입

* 클래스를 생성할 때 클래스가 의존하고 있는 객체를 주입하는 방식
* 클래스 생성시점에 필요한 자원이 주입되므로 완전한 상태의 객체를 얻을 수 있다.
  * 완전한 상태이기 때문에 필요한 자원을 생성시 할당하면 변하지 않는다.
  * 즉 immutable하기 때문에 멀티 쓰레드 환경에서 사용할 수 있다.
* 생성자가 너무 많은 파라미터를 가진 경우 좋은 코드라고 할 수 없다.
  * 해당 클래스가 너무 많은 책임을 가지고 있다는 증거
  * 해당 클래스의 책임을 적절히 분산하자



**생성자 주입 예시**

```java
public class SpellChecker {
  private final Lexicon dictionary;

  public SpellChecker(Lexicon dictionary) {
    this.dictionary = Objects.requireNonNull(dictionary);
  }

  public boolean isValid(String word) { ... }
  public List<String> suggestions(String typo) { ... }
}
```



**생성자에 자원 팩터리를 넘겨주는 방식**

* `팩터리란 호출할 때마다 특정 타입의 인스턴스를 반복해서 만들어주는 객체`를 말한다. 
* 즉, 팩터리 메서드 패턴(Factory Method Pattern)을 구현한 것이다. 
* 자바 8에서 소개한 Supplier 인터페이스가 팩터리를 표현한 완벽한 예이다. 
* Supplier를 입력으로 받는 메서드는 일반적으로 `한정적 와일드카드 타입 (bounded wildcard type)`을 사용해 팩터리의 타입 매개변수를 제한해야 한다.
*  `이 방식을 사용해 클라이언트는 자신이 명시한 타입의 하위 타입이라면 무엇이든 생성할 수 있는 팩터리를 넘길 수 있다.` 
* 예컨대 다음 코드는 클라이언트가 제공한 팩터리가 생성한 타일(Tile)들로 구성된 모자이크(Mosaic)를 만드는 메서드다.

```java
Mosaic create(Supplier<? extends Tile> tileFactory) { ... }
```



# 3 결론

* 클래스가 내부적으로 하나 이상의 자원에 의존하고, 그 자원이 클래스 동작에 영향을 준다면 싱글턴(Singleton) 과, 정적 유틸리티(static util class)는 사용하지 않는 것이 좋다.
* 클라이언트가 의존하고 있는 자원을 클라이언트가 직접 만들게 해선 안된다
* 필요한 자원(또는 그 자원을 만들어주는 팩터리)을 생성자(또는 정적 팩터리나 빌더)에 넘겨주면 클래스의 유연함, 재사용성, 테스트 용이성을 개선해준다



참고

* [이펙티브 자바 3/E](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788966262281)