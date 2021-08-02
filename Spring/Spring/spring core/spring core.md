## 스프링의 핵심

> 스프링은 자바 기반의 프레임워크이다. 자바는 객체 지향 언어이다. 스프링은 객체 지향 언어가 가진 강력한 특징을 살려내는 프레임워크라고 할 수 있다.

## 객체 지향 프로그래밍

> 객체지향의 본질은 협력하는 객체들의 공동체를 창조하는 것이다. 여기서 협력은 애플리케이션의 기능을 구현하기 위해 메시지를 주고받는 개체들 사이의 상호작용이다. 
>
> 개체지향이 강력한 이유는 한 곳에서 일어난 변경이 전체 시스템에 영향을 끼치지 않도록 파급효과를 적절하게 조절할 수 있는 장치가 있기 때문에 프로그램을 유연하고 변경이 용이하게 만들어 대규모 소프트웨어 개발에 많이 사용된다.

**객체 지향의 특징**

* 추상화
* 캡슐화
* 상속
* 다형성
  * 인터페이스를 구현한 객체 인스턴스를 실행 시점에 유연하게 변경할 수 있다.
  * 클라이언트를 변경하지 않고, 서버의 구현 기능을 유연하게 변경할 수 있다



## 스프링과 객체 지향

* 스프링은 다형성을 극대화해서 이용할 수 있게 도와준다.
* 스프링에서 이야기하는 제어의 역전(IoC), 의존관계 주입(DI)은 다형성을 활용해서 역할과 구현을 편리하게 다룰 수 있도록 지원한다.
* 스프링을 사용하면 마치 레고 블럭 조립하듯이! 구현을 편리하게 변경할 수 있다.



## 좋은 객체 지향 설계의 5가지 원칙(SOLID)

* SRP: 단일 책임 원칙(single responsibility principle)
* OCP: 개방-폐쇄 원칙 (Open/closed principle)
* LSP: 리스코프 치환 원칙 (Liskov substitution principle) 
* ISP: 인터페이스 분리 원칙 (Interface segregation principle) 
* DIP: 의존관계 역전 원칙 (Dependency inversion principle)



### Single responsibility principle

* 한 클래스는 하나의 책임만 가져야 한다.
* 중요한 기준은 변경이다. 변경이 있을 때 파급 효과가 적으면 단일 책임 원칙을 잘 따른 것



### Open/closed principle

* 소프트웨어 요소는 확장에는 열려 있으나 변경에는 닫혀 있어야 한다

**OCP를 지키지 못하는 예**

* `MemberRepository` 인터페이스를 구현한 `MemoryMemberRepository` 와 `JdbcMemberRepository`
* 역할과 구현을 분리해 손쉽게 구현을 대체할 수 있다.
* 그러나 `MemberService` 클라이언트가 구현 클래스를 직접 선택하므로 구현 객체를 변경하려면 클라이언트 코드를 변경해야한다.

```java
public class MemberService {
  private MemberRepository memberRepository = new MemoryMemberRepository();
}
```

```java
public class MemberService {
  private MemberRepository memberRepository = new JdbcMemberRepository();
}
```

**어떻게 OCP를 지킬 수 있을까?**

* 객체를 생성하고, 연관관계를 맺어주는 별도의 조립, 설정자가 필요하다.



### Liskov substitution principle

* 프로그램의 객체는 프로그램의 정확성을 깨뜨리지 않으면서 하위 타입의 인스턴스로 바꿀 수 있어야 한다.
* 다형성을 지원하기 위 한 원칙, 인터페이스를 구현한 구현체를 믿고 사용하려면, 이 원칙이 필요하다.
* 예시
  * 자동차 인터페이스의 엑셀은 앞으로 가라는 기능, 뒤로 가게 구현하면 LSP 위반, 느리 더라도 앞으로 가야함



### Interface segregation principle

* 특정 클라이언트를 위한 인터페이스 여러 개가 범용 인터페이스 하나보다 낫다
* 인터페이스가 명확해지고, 대체 가능성이 높아진다.
* 예시
  * 자동차 인터페이스 -> 운전 인터페이스, 정비 인터페이스로 분리
  * 사용자 클라이언트 -> 운전자 클라이언트, 정비사 클라이언트로 분리
  * 정비 인터페이스 자체가 변해도 운전자 클라이언트에 영향을 주지 않음



### Dependency inversion principle

* 프로그래머는 “추상화에 의존해야지, 구체화에 의존하면 안된다.” 의존성 주입은 이 원칙 을 따르는 방법 중 하나다.
* 구현 클래스에 의존하지 말고, 인터페이스에 의존하라는 뜻
  * 클라이언트가 인터페이스에 의존해야 유연하게 구현체를 변경할 수 있다! 
  * 구현체에 의존하게 되면 변 경이 아주 어려워진다.

**DIP를 지키지 못하는 예**

* `MemberRepository` 인터페이스를 구현한 `MemoryMemberRepository` 와 `JdbcMemberRepository`
* `MemberService` 클라이언트가 `MemberRepository` 인터페이스를 의존해 DIP를 지키고 있는 것처럼 보인다
* 그러나 `MemberService` 클라이언트가 구현 클래스를 직접 선택하므로 `MemoryMemberRepository` 에도 의존하고 있다.
* 즉 구현 클래스에 의존하고 있으므로 DIP를 위반하고있다.

```java
public class MemberService {
  private MemberRepository memberRepository = new MemoryMemberRepository();
}
```



### 정리

* 다형성 만으로는 쉽게 부품을 갈아 끼우듯이 개발할 수 없다.
* 다형성 만으로는 구현 객체를 변경할 때 클라이언트 코드도 함께 변경된다.
* 다형성 만으로는 OCP, DIP를 지킬 수 없다.



## 객체 지향 설계와 스프링

* 스프링은 다음 기술로 다형성 + OCP, DIP를 가능하게 지원
  * DI(Dependency Injection): 의존관계, 의존성 주입
  * DI 컨테이너 제공
  * 클라이언트 코드의 변경 없이 기능 확장하게 해준다.
* 모든 설계에 역할과 구현을 분리하자
  * 애플리케이션 설계도 공연을 설계 하듯이 배역만 만들어두고, 배우는 언제든지 유연하게 변경할 수 있도록 만드는 것이 좋은 객체 지향 설계다.
  * 모든 설계에 인터페이스를 부여하자

> 하지만 인터페이스를 도입하면 추상화라는 비용이 발생한다.
>
> 기능을 확장할 가능성이 없다면, 구체 클래스를 직접 사용하고, 향후 꼭 필요할 때 리팩터링해서 인터페이스를 도입하는 것도 방법이다.