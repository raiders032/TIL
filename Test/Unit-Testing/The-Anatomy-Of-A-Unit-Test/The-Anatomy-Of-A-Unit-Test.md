# 1 단위 테스트 구조

* AAA 패턴으로 작성된 단위 테스트의 구조를 살펴보자

# 2 AAA 패턴

* AAA 패턴은 각 테스트를 준비(Arrange), 실행(Act), 검증(Assert)이라는 세 부분으로 나눈다

**AAA 패턴의 장점**

* AAA 패턴은 스위트 내 모든 테스트가 단순하고 균일한 구조를 갖는 데 도움이 된다
* 일단 익숙해지면 쉽게 읽을 수 있고 이해할 수 있어 유지 보수 비용이 줄어든다



**Calculator.java**

```java
public class Calculator {
    public int sum(int first, int second) {
        return first + second;
    }
}
```

**AAA 패턴 Test 예시**

```java
@Test
void sum_of_two_numbers() {
  // Arrange
  int first = 10;
  int second = 20;
  Calculator calculator = new Calculator();

  // Act
  double result = calculator.sum(first, second);

  // Assert
  Assertions.assertThat(result).isEqualTo(30);
}
```



## 2.1 준비(Arrange)

* **테스트 대상 시스템(SUT)과 해당 의존성을 원하는 상태로 만든다**
* 일반적으로 준비 구절이 세 구절 중 가장 크다
* **준비 구절이 크면 테스트 클래스 내 비공개 메서드 또는 별도의 팩토리 클래스로 도출하는 것이 좋다**
* 준비 구절 코드 재사용에 도움이 되는 패턴으로 오브젝트 마더와 테스트 데이터 빌터 패턴이 있다



## 2.2 실행(Act)

* **실행 구절에서는 SUT에서 메서드를 호출하고 준비된 의존성을 전달하며 출력 값을 캡쳐한다**
* 보통 실행 구절은 코드 한 줄이다
* 실행 구절이 두 줄 이상인 경우 SUT의 공개 API에 문제가 있음을 시사한다
  * 클라이언트가 항상 이러한 작업을 같이 수행해야 하고, 이로 인해 잠재적으로 모순으로 이어질 수 있다
  * 한번의 메서드 호출로 같은 기능을 하도록 캡슐화를 생각해보자
  
* 실행 구절을 한줄로 하는 지침은 비즈니스 로직을 포함하는 대부분의 코드에 적용된다
  * 하지만 유틸리티나 인프라 코드에는 덜 적용되므로 절대 두 줄 이상 두지 말라고 할 수 없다
  * 따라서 각각의 사례에서 캡슐화 위반이 있을 수 있는지 검토해보자



## 2.3 검증(Assert)

* **검증 구절에서는 결과를 검증한다**
* 결과는 **반환값**이나 SUT와 협력자의 **최종 상태**, SUT가 협력자에 **호출한 메서드** 등으로 표시될 수 있다
* 반환값, 최종 상태, 호출한 메서드 3가지를 형태로 검증할 수 있다
* 제품 코드에서 추상화가 누락되면 검증 구절이 커질 수 있다
  * 예를 들어 SUT에서 반환되는 객체 내에 모든 속성을 검증하는 대신 객체 클래스 내에 적정한 동등 멤버를 정의하는 것이 좋다
  * 그러면 단일 검증문으로 개쳋를 기대값과 비교할 수 있다



## 2.4 given-when-then 패턴

* 테스트 구성 측면에서 AAA패턴과 차이는 없다
* given-when-then 구조가 더 읽기 쉬워 비기술자들과 공유하기 더 적합하다



## 2.5 주의사항

* 준비, 실행, 검증 구절이 여러개 있는 테스트를 간혹 만날 수 있는데 이는 좋지 않은 신호이다
* 이 신호는 너무 많은 것을 한 번에 검증하는 것을 의미하며 여러 개의 동작 단위를 검증하는 테스트를 뜻함
* 여러 개의 동작 단위를 검증하는 테스트는 더 이상 단위 테스트가 아니라 통합 테스트이다
* 이러한 구조는 피하는 것이 좋다
* 그래야 간단하고, 빠르며, 이해하기 쉽다

**예외사항**

* 통합 테스트에서는 실행 구절을 여러개 두는 것이 괜찮을 경우도 있는데 이는 속도를 높이기 위해 여러 개의 통합 테스트를 단일한 테스트로 묶는 것이다
* 모든 테스트에 적용되는 것은 아니며 이미 느리고 더 느려지게 하고 싶지 않은 통합 테스트에만 해당된다



## 2.6 종료단계

* 준비, 실행, 검증 이후의 네 번째 구절로 종료 구절을 따로 구분하기도 한다
* 예를 들어 테스트에 의해 작성된 파일이나 데이테베이스 연결을 종료하고자 종료 구절을 사용한다
* 그러나 대부분의 단위 테스트는 종료 구절이 필요없다
* 단위 테스트는 프로세스 외부에 종속적이지 않으므로 처리해야 할 부작용을 남기지 않는다
* 따라서 종료 구절은 통합 테스트의 영역이다



## 2.7 테스트 대상 시스템 구별하기

* SUT는 테스트에서 중요한 역할을 한다
* 애플리케이션에서 호출하고자 하는 동작에 대한 진입점을 제공하기 때문이다
* 동작은 여러 클래스에 걸쳐 있을 만큼 클수도 단일 메서드로 작을 수도 있다
* 그러나 진입점은 오직 하나만 존재할 수 있다
* 따라서 의존성과 SUT를 구분하는 것이 중요하므로 테스트 내에 SUT의 이름을 `sut` 라고 명명하자

**SUT 구분 전**

```java
@Test
void sum_of_two_numbers() {
  // Arrange
  int first = 10;
  int second = 20;
  Calculator calculator = new Calculator();

  // Act
  double result = calculator.sum(first, second);

  // Assert
  Assertions.assertThat(result).isEqualTo(30);
}
```

**SUT 구분 후**

```java
@Test
void sum_of_two_numbers() {
  // Arrange
  int first = 10;
  int second = 20;
  Calculator sut = new Calculator();

  // Act
  double result = sut.sum(first, second);

  // Assert
  Assertions.assertThat(result).isEqualTo(30);
}
```

# 3 테스트 간 테스트 픽스쳐 재사용

* 테스트 에서 언제 어떻게 코드를 재사용할까?
* **준비 구절에서 코드를 재사용**하는 것이 테스트를 줄이면서 단순화하기 좋은 방법이다
  * 준비 구절은 코드가 많아지기 쉽다
  * 재사용을 위해 별도의 메서드나 클래스로 도출한 후 테스트 간에 재사용하는 것이 좋다
* 테스트 픽스쳐 재사용에는 생성자를 이용한 방법과 비공개 팩토리 메서드를 이용하는 방법이 있는데 후자를 선택해야한다



## 3.1 생성자에서 테스트 픽스처 초기화

* 클래스 생성자에서 테스트 픽스처를 초기화하는 것은 좋지 않다



**CustomerTest.java**

* 두 테스트에 공통된 구성 로직이 있다
* 실제로 준비 구절이 동일하므로 CustomerTest의 생성자로 완전히 추출할 수 있었다
* 테스트에서 더 이상 준비 구절이 없다
* 이 방법으로 테스트 코드의 양을 줄일 수 있지만 두 가지 중요한 단점이 있다

```java
class CustomerTest {
  private Store store;	// 공통 테스트 픽스처
  private Customer sut;

  // 각 테슽 이전에 호출
  public CustomerTest() {
    this.store = new Store();
    this.store.addInventory(Product.Shampoo, 10);
    this.sut = new Customer();
  }

  @Test
  void purchase_succeeds_when_enough_inventory() {
    // Act
    boolean success = sut.purchase(store, Product.Shampoo, 5);

    // Assert
    assertThat(success).isTrue();
    assertThat(store.getInventory(Product.Shampoo)).isEqualTo(5);
  }

  @Test
  void purchase_fails_when_not_enough_inventory() {
    // Act
    boolean success = sut.purchase(store, Product.Shampoo, 15);

    // Assert
    assertThat(success).isFalse();
    assertThat(store.getInventory(Product.Shampoo)).isEqualTo(10);
  }
}
```



**생성자에서 테스트 픽스처 초기화 단점**

* 테스트 간 결합도가 높아진다
* 테스트 가독성이 떨어진다



### 3.1.1 테스트간 높은 결합도는 안티 패턴

* 위 버전에서는 모든 테스트가 서로 결합돼 있다
* 즉, 테스트 준비 로직을 수정하면 클래스의 모든 테스트에 영향을 미친다
* `this.store.addInventory(Product.Shampoo, 10);`
* 예를 들어 위에 코드를 `this.store.addInventory(Product.Shampoo, 15);` 로 수정하면 상점의 초기 상태에 대한 가정을 무효화하므로 쓸데없이 테스트가 실패한다



### 3.1.2 테스트 가독성을 떨어뜨리는 생성자 사용

* 준비 코드를 생성자로 추출하면 테스트 가독성을 떨이뜨린다
* 테스트만 보고는 더 이상 전체 그림을 볼 수 없다
* 준비 과정을 보기 위해 생성자를 봐야한다
* 준비 로직이 별로 없더라도 테스트 메서드 내에 있는 것이 좋다
* 그렇지 않으면 단순히 인스턴스를 만드는 것인지 아니면 다른 무언가가 환경 설정을 하는지 알기 어렵다



## 3.2 비공개 팩토리 메서드

* 생성자로 테스트 픽스처를 초기화하는 방법보다 비공개 팩토리 메서드를 사용하는 것이 좋다



**CustomerTestV2.java**

* 생성자로 테스트 픽스처를 초기화하는 코드를 비공개 팩토리 메서드를 사용하는 버전으로 수정했다
* 공통 초기화 코드를 비공개 팩토리 메서드로 추출해 테스트 **코드를 짧게 하면서 동시에 전체 맥락을 유지**할 수 있다
* 게다가 비공개 메서드를 충분히 일반화하면 **테스트가 서로 결합되지 않는다**
* 또한 팩토리 메서드 명으로 상점에 샴푸 열개를 추가하라고 명시하므로 굳이 메서드 내부를 알아볼 필요가 없기 때문에 가독성이 좋다
  * `Store store = createStoreWithInventory(Product.Shampoo, 10);`

```java
class CustomerTestV2 {

  @Test
  void purchase_succeeds_when_enough_inventory() {
    // Arrange
    Store store = createStoreWithInventory(Product.Shampoo, 10);
    Customer sut = createCustomer();

    // Act
    boolean success = sut.purchase(store, Product.Shampoo, 5);

    // Assert
    assertThat(success).isTrue();
    assertThat(store.getInventory(Product.Shampoo)).isEqualTo(5);
  }

  @Test
  void purchase_fails_when_not_enough_inventory() {
    // Arrange
    Store store = createStoreWithInventory(Product.Shampoo, 10);
    Customer sut = createCustomer();

    // Act
    boolean success = sut.purchase(store, Product.Shampoo, 15);

    // Assert
    assertThat(success).isFalse();
    assertThat(store.getInventory(Product.Shampoo)).isEqualTo(10);
  }

  private static Store createStoreWithInventory(Product product, int quantity) {
    Store store = new Store();
    store.addInventory(product, quantity);
    return store;
  }

  private static Customer createCustomer() {
    return new Customer();
  }
}
```



## 3.3 테스트 픽스처 재사용 규칙 예외

* 테스트 픽스처 재사용 규칙에 한 가지 예외가 있다
* 모든 테스트에, 또는 거의 대부분의 테스트에 사용되는 경우 생성자에 픽스처를 인스턴스화할 수 있다
* 데이터베이서와 작동하는 통합테스트가 종종 여기에 해당된다
* 이런 경우 부모 클래스를 둬서 개별 클래스가 아니라 클래스 생성자에서 데이터베이스 연결을 초기화하는 것이 합리적이다



# 4 단위 테스트 명명법

* 테스트에 표현력 있는 이름을 붙이는 것은 중요하다



## 4.1 좋지 않은 관습

* 가장 유명하지만 가장 도움이 되지 않는 방법 중 하나가 아래와 같은 관습이다
* `[테스트 대상 메서드]_[시나리오]_[예상결과]`
  * 테스트 대상 메서드: 메스트 중인 메서드의 이름
  * 시나리오: 메서드를 테스트하는 조건
  * 예상결과: 현재 시나리오에서 테스트 대상 메서드에 기대하는 것
* 이러한 관습은 동작 대신 세부 구현 사항에 집중하게끔 부추기기 때문에 도움이 되지 않는다



**쉬운 영어 이름 테스트**

```java
@Test
void sum_of_two_numbers() {
  // Arrange
  int first = 10;
  int second = 20;
  Calculator calculator = new Calculator();

  // Act
  double result = calculator.sum(first, second);

  // Assert
  Assertions.assertThat(result).isEqualTo(30);
}
```



**좋지 않은 관습**

* 프로그래머의 눈에는 논리적으로 보일지 몰라도 테스트 가독성이 떨어진다

```java
@Test
void sum_twoNumbers_returnsSum() {
  // Arrange
  int first = 10;
  int second = 20;
  Calculator calculator = new Calculator();

  // Act
  double result = calculator.sum(first, second);

  // Assert
  Assertions.assertThat(result).isEqualTo(30);
}
```



## 4.2 단위 테스트 명명 지침

* **엄격한 명명 정책을 따르지 않는다**
  * 복잡한 동작에 대한 높은 수준의 설명을 이러한 정책의 좁은 상자에 넣을 수 없다
  * 표현의 자유를 허용하자
* **도메인에 익숙한 비개발자들에게 시나리오를 설명하는 것처럼 테스트 이름을 짓자**
* **단어를 및줄 표시로 구분한다**
* **테스트 이름에 SUT의 메서드 이름을 포함하지 않는다**
  * 코드를 테스트하는 것이 아니라 동작을 테스트 해야 한다
  * SUT의 메서드 이름은 중요하지 않으며 이름을 수정해도 동작에는 아무런 영향을 미치지 않는다
  * 테스트 이름에 메서드를 포함하면 메서드 이름을 수정하면 테스트 이름도 수정해야한다
  * 동작 대신에 코드를 테스트하면 테스트가 구현 세부 사항과 결합도가 높아져 리팩터링 내성이 없어진다
  * 이 지침의 유일한 예외는 유틸리티 코드를 작업할 때다. 여기는 SUT 메서드 이름을 사용해도 괜찮다



## 4.4 테스크 클래스 명명

* 테스트 클래스의 이름을 지을 때 `[클래스명]Tests` 패턴을 사용하지만 테스트가 해당 클래만 검증하는 것으로 제한하는 것은 아니다
  * 단위 테스트에서 단위는 동작의 단위지 클래스 단위가 아니라는 것을 명심하자
* 단위(동작)은 하나 이상의 클래스에 걸쳐 있을 수 있다. 
* 그래도 동작이 어딘가에서 시작해야하는데 `[클래스명]Tests` 의 클래스를 동작의 진입점 또는 API로 여기자



# 5 매개변수화된 테스트

* 매개변수화된 테스트로 유사한 테스트에 필요한 코드의 양을 줄일 수 있다
* 단점은 테스트 이름을 더 포괄적으로 만들수록 테스트 이름을 읽기 어렵게 된다



참고

* [단위 테스트](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9791161755748)