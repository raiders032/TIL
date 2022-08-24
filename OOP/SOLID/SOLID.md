# 1.SOLID

* 클린코드로 유명한 로버트 마틴이 좋은 객체 지향 설계의 5가지 원칙을 정리함
* 소프트웨어 설계를 이해하기 쉽고 유연하고 유지보수하기 쉽게 만들기 위해 사용되는 원칙 5가지를 뜻한다.
* 5가지 원칙
  * Single Responsibility Principle(단일 책임 원칙)
  * Open-Closed Principle(개방-폐쇄 원칙)
  * Liskov Substitution Principle(리스코프 치환 원칙)
  * Interface Segregation Principle(인터페이스 분리 원칙)
  * Dependency Inversion Principle(의존 역전 원칙)



## 1.1 SOLID를 언제 적용할까?

* SOLID는 디커플링을 중요하게 여기니 대규모 프로젝트일수록 유용하다 따라서 모든 프로젝트에 적용할 수 있다고 생각하지 말자
* 많은 프로젝트의 시작은 직접적/구체적인 설계로 시작하고 규모가 커지면서 유연성이 필요해지면 SOLID를 고려해봐도 좋다



# 2.Single Responsibility Principle

> **한 클래스는 단 한기자의 변경 이유만을 가져야 한다**. 한 클래스를 변경하기 위한 한 가지 이상의 이유를 생각할 수 있다면, 그 클래스는 한 가지 이상의 책임을 맡고 있는 것이다. 

* SRP에서 책임은 `변경을 위한 이유`로 정의한다.
* 코드를 보는 대부분의 사람들이 이해할 수 있는 크기로 클래스를 만들자!
* 변경이 있을 때 파급 효과가 적으면 단일 책임 원칙을 잘 따른 것이다.



# 3.Open-Closed Principle

> 소프트웨어 개체는 **확장에 대해 열려** 있어야 하고, **수정에 대해서는 닫혀** 있어야 한다.

* 애플리케이션의 요구사항이 변결될 때, 이 변경에 맞게 새로운 행위를 추가해 모듈을 확장 할 수 있다.
* 어떤 모듈의 행위를 확장하는 것이 그 모듈의 소스 코드나 바이너리 코드의 변경을 초래하지 않는다.



**어떻게 이것이 가능할까?**

* 정답은 추상화!
  * 모듈이 추상화에 의존하면 수정에 대해 닫혀 있을 수 있다.
  * 그 모듈의 행위는 추상화의 새 파생 클래스를 만듦으로써 확장이 가능하다



**단점**

* OCP를 따르자면 비용이 든다. 적절한 추상화를 만들기 위해서는 개발 시간과 노력뿐만 아니라 이런 추상화는 소프트웨어 설계의 복잡성을 높이기도 한다.
* 개발자가 감당할 수 있는 추상화의 정도에는 한계가 있기 때문이다.
* 지나치고 불필요한 추상화로 설계에 부하를 주지 않으려면 추상화가 실제로 필요할 때까지 기다렸다가 사용하는 편이 좋다.



**OCP를 지키지 못하는 예**

* `MemberRepository` 인터페이스를 구현한 `MemoryMemberRepository` 와 `JdbcMemberRepository` 클래스
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

# 4.Liskov Substitution Principle

> 서브타입은 그것의 기반 타입으로 치환 가능해야 한다.

* 프로그램의 객체는 프로그램의 정확성을 깨뜨리지 않으면서 하위 타입의 인스턴스로 바꿀 수 있어야 한다.
  * 부모가 할 수 있었던 일은 자식도 다 할 수 있어야 한다는 것을 의미한다.
* 다형성을 지원하기 위한 원칙, 인터페이스를 구현한 구현체를 믿고 사용하려면, 이 원칙이 필요하다.
* 단순히 컴파일에 성공하는 것을 넘어서는 이야기
* 예시
  * 자동차 인터페이스의 엑셀은 앞으로 가라는 기능, 뒤로 가게 구현하면 LSP 위반, 느리 더라도 앞으로 가야함



# 5.Interface Segregation Principle

* 큰 인터페이스 몇 개 보다 작은 인터페이스가 많은 것이 좋다.
* 클라이언트가 오로지 자신이 필요로 하는 메서드만 알면 되도록 넓은 인터페이스를 특화된 인터페이스로 분리해야 한다
* 인터페이스가 명확해지고, 대체 가능성이 높아진다.
* 예시
  * 자동차 인터페이스 -> 운전 인터페이스, 정비 인터페이스로 분리
  * 사용자 클라이언트 -> 운전자 클라이언트, 정비사 클라이언트로 분리
  * 정비 인터페이스 자체가 변해도 운전자 클라이언트에 영향을 주지 않음



# 6.Dependency Inversion Principle

* 프로그래머는 “추상화에 의존해야지, 구체화에 의존하면 안된다.” 의존성 주입은 이 원칙 을 따르는 방법 중 하나다.
* 구현 클래스에 의존하지 말고, 인터페이스에 의존하라는 뜻
  * 클라이언트가 인터페이스에 의존해야 유연하게 구현체를 변경할 수 있다! 
  * 구현체에 의존하게 되면 변경이 아주 어려워진다.



**DIP를 지키지 못하는 예**

* `MemberRepository` 인터페이스를 구현한 `MemoryMemberRepository` 와 `JdbcMemberRepository`
* `MemberService` 클라이언트가 `MemberRepository` 인터페이스를 의존해 DIP를 지키고 있는 것처럼 보인다
* 그러나 `MemberService` 클라이언트가 구현 클래스를 직접 선택하므로 `MemoryMemberRepository`도 동시에 의존하고 있다.
* 즉 구현 클래스에 의존하고 있으므로 DIP를 위반하고있다.

```java
public class MemberService {
  private MemberRepository memberRepository = new MemoryMemberRepository();
}
```
