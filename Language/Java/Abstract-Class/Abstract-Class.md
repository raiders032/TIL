# 1 Abstract Class

* 객체를 직접 생성할 수 있는 클래스를 실체 클래스라고 한다
* 이 실체 클래스들의 공통적인 특성을 추출해서 선언한 클래스를 추상 클래스라고 한다.
* 추상 클래스와 실체 클래스는 상속 관계를 가지고 있다
* 실체 클래스는 추상 클래스의 모든 특성을 물려받고 추가적인 특성을 가질 수 있다
* 추상 클래스는 객체를 직접 생성해서 사용할 수 없다
  * new 연산자로 인스턴스를 생성할 수 없다



# 2 추상 클래스의 용도

* 추상 클래스는 새로운 실체 클래스를 만들기 위해 부모 클래스로만 사용된다.
  * 실체 클래스들의 공통된 필드와 메소드의 이름을 통일하는 것이 목적
* 실체 클래스를 작성할 때 시간을 절약
  * 공통적인 특성을 갖는 추상 클래스를 부모로 상속하면 중복 코드가 적어져 시간이 절약된다.
  * 설계 단계에서 추상 클래스를 미리 설계하면 시간이 많이 절약된다.



# 3 추상 클래스 선언

* 추상 클래스를 선언할 때 클래스 선언에 `abstract` 키워드를 붙인다.
* `abstract` 를 사용하면 new 연산자로 객체를 생성할 수 없다

```java
public abstract class ClassName {
  //필드
  //생성자
  //메소드
}
```



# 4 추상 클래스의 생성자

* 인스턴스화 될 수 없기 때문에 생성자가 필요 없다고 생각할 수 있지만 그렇지 않다
* 자식 클래스에서는 반드시 부모 클래스의 생성자를 호출해야 하므로 **추상 클래스 역시 생성자가 반드시 필요하다.**



# 5 추상 메소드와 오버라이딩

* 모든 실체 클래스들이 가지고 있는 메소드의 실행 내용이 동일하다면 추상 클래스에 메소드를 작성하는 것이 좋다.
* 하지만 메소드 선언만 동일하고 실행 내용이 다르다면 추상 메소드로 만들고 실체 메소드에서 오버라이딩 해야한다.



**추상 메소드**

* **모든 자식에게 시그니처는 같지만 실제 구현은 각각 다른 메소드가 필요할 때 추상 메소드를 사용한다.**
* 추상 메소드는 추상 클래스에서 선언한다
* 메소드의 선언부만 있고 메소드 실행 내용은 없다
* 자식 클래스는 추상 메소드를 반드시 오버라이딩해야 한다.
  * 그렇지 않으면 컴파일 에러가 발생한다.