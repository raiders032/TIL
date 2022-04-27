# 1 단위 테스트 스타일



## 1.1 단위 테스트의 세 가지 스타일

* 단위 테스트에는 세 가지 스타일이 있다
  * **출력 기반 테스트**
  * **상태 기반 테스트**
  * **통신 기반 테스트**
* 출력 기반 테스트, 상태 기반 테스트, 통신 기반 테스트 순으로 테스트 품질이 좋다
* **출력 기반 테스트**가 가장 품질이 좋지만 아무데서나 사용할 수 없으며 **순수 함수 방식으로 작성된 코드에만 적용**된다
  * 그러나 걱정하지 마라 출력 기반 스타일로 변환하는 데 도움이 되는 기법이 있다



## 1.2 스타일과 단위 테스트 분파

* **고전파**는 통신 기반 테스트보다 **상태 기반 테스트를 선호**한다
* **런던파**는 상태 기반 테스트보다 **통신 기반 테스트를 선호**한다
* 두 분파 모두 출력 기반 테스트를 사용한다



# 2 출력 기반 스타일

* SUT에 입력을 넣고 생성되는 출력을 점검하는 방식
* 출력 기반 스타일은 전역 상태나 내부 상태를 변경하지 않는 코드에만 적용되므로 반환 값만 검증하면 된다
  * 전역 상태나 내부 상태를 변경하지 않는 코드 -> 순수 함수 방식으로 작성된 코드
* 출력 기반 단위 테스트 스타일을 함수형이라고도 한다
  * 부작용이 없는 코드 선호를 강조하는 프래그래밍 방식인 함수형 프로그래밍에 뿌리를 두고있다




**Order.java**

* 아래 Order 클래스의 calculateDiscount() 함수를 출력 기반 스타일로 테스트해보자
* 우선 calculateDiscount 메서드는 순수 함수이다
  * 따라서 출력 기반 스타일로 테스트가 가능하다
* **순수 함수**란 오직 입력만이 결과에 영향을 주는 함수를 말한다
* 다른 **가변 상태를 참조하지 않고** 함수 스스로도 **다른 상태를 변경하지 않는다**. 즉 부작용이 없어야한다
  * 컬렉션에 상품을 추가하거나 데이터베이스에 저장하지 않는다

```java
public class Order {
  public double calculateDiscount(List<Product> products) {
    double discount = products.size() * 0.01;
    return Math.min(discount, 0.2);
  }
}
```



**출력 기반 스타일 테스트**

```java
@Test
void discount_of_two_products() {
  // Arrange
  List<Product> products = Arrays.asList(new Product("A"), new Product("B"));
  Order sut = new Order();

  // Act
  double discount = sut.calculateDiscount(products);

  // Assert
  assertThat(discount).isEqualTo(0.02);
}
```



# 3 상태 기반 스타일

* 상태 기반 스타일은 작업이 완료된 후 시스템 상태를 확인하는 것이다
* 상태라는 용어는 SUT나 협력자 중 하나, 또는 데이터베이스나 파일 시스템 등과 같은 프로세스 외부 의존성의 상태를 의미할 수 있다



**Order.java**

* addProduct 메서드는 순수 함수가 아니다 따라서 출력 기반 스타일 테스트코드를 작성할 수 없다
* 메서드 외부 가변 상태를 변경하기 때문에 순수 함수가 아니다
  * products의 상태를 변경함
* 따라서 상태 기반 테스트를 작성해야 한다

```java
@Getter
public class Order {

  private List<Product> products = new ArrayList<>();

  public void addProduct(Product product) {
    products.add(product);
  }
}
```



**상태 기반 스타일 테스트**

* 상태 기반 스타일 작업 완료후 시스템 상태를 확인한다
* SUT와 협력자의 상태를 확인

```java
@Test
void adding_a_product_to_an_order() {
  // Arrange
  Product product = new Product("A");
  Order sut = new Order();

  // Act
  sut.addProduct(product);

  // Assert
  assertThat(sut.getProducts().size()).isEqualTo(1);
  assertThat(sut.getProducts().get(0)).isEqualTo(product);
}
```



# 4 통신 기반 스타일

* SUT의 협력자를 목으로 대체하고 SUT가 협력자를 올바르게 호출하는지 검증한다

**통신 기반 스타일 테스트**

```java
@Test
void sending_a_greetings_email() {
    // Arrange
    EmailGateWay emailGateWay = mock(EmailGateWay.class);
    EmailController sut = new EmailController(emailGateWay);

    // Act
    sut.greetUser("user@email.com");

    // Assert
    verify(emailGateWay, times(1)).sendGreetingsEmail("user@email.com");
}
```



# 5 단위 테스트 스타일 비교



## 5.1 회귀 방지 지표로 스타일 비교

* **회귀 방지 지표는 특정 스타일에 따라 달라지지 않는다**
* 회귀 방지는 다음 세 가지 특성으로 결정되기 때문이다
  * 테스트 중에 실행되는 코드의 양
  * 코드 복잡도
  * 도메인 유의성



## 5.2 빠른 피드백 지표와 스타일 비교

* **테스트 스타일과 테스트 피드백 속도 사이에는 상관관계가 거의 없다**
* 테스트가 프로세스 외부 의존성과 떨어져 단위 테스트 영역에 있는 한 모든 스타일은 테스트 실행 속도가 거의 동일하다



## 5.3 리팩터링 내성 지표로 스타일 비교

* 리팩터링 내성은 리팩터링 중에 발생하는 거짓 양성(허위 경보) 수에 대한 척도다
* 거짓 양성의 결과는 식별할 수 있는 동작이 아니라 코드의 구현 세부 사항에 결합된 테스트의 결과다
* 리팩터링 내성을 지키려면 통신 기반 테스트를 사용할 때 더 신중해야 한다



**출력 기반 테스트**

* **출력 기반 테스트**는 SUT의 메서드에만 결합되므로 **거짓 양성 방지(리팩터링 내성)가 가장 우수**하다
* 출력 기반 테스트가 구현 세부 사항에 결합하는 경우는 SUT의 메서드가 구현 세부 사항일 때뿐이다



**상태 기반 테스트**

* 상태 기반 테스트는 일반적으로 거짓 양성이 되기 쉽다(리팩터링 내성이 없다)
* 상태 기반 테스트는 테스트 대상 메서드 외에도 클래스 상태와 함께 작동한다
* 테스트가 클래스의 상태를 안다는 것은 결합도가 높은 것을 의미하며 그 결과 테스트가 구현 세부 사항에 얽매일 가능성이 커진다



**통신 기반 테스트**

* 통신 기반 테스트는 허위 경보에 가장 취약하다
* **스텁과의 상호 작용을 검증하는 테스트는 대부분 깨지기 쉽다**
  * 이러한 상호 작용은 검증해서는 안 된다
* 애플리케이션 경계를 넘는 상호 작용을 확인하고 해당 상호 작용의 부작용이 외부 환경에 보이는 경우에만 목이 괜찮다
  * 애플리케이션 경계를 넘는 상호 작용 -> 시스템간 통신



## 5.4 유지 보수성 지표로 비교

* 유지 보수성 지표는 단위 테스트 스타일과 밀접한 관련이 있다
* 그러나 리팩터링 내성과 달리 완화할 수 있는 방법이 많지 않다
* 유비 보수성 측정 지표
  * 테스트를 이해하기 얼마나 어려운가?(테스트 크기)
  * 테스트를 실행하기 얼마나 어려운가?(테스트에 직접적으로 관련 있는 프로세스 외부 의존성 개수)



**출력 기반 스타일**

* 출력 기반 테스트는 거의 항상 짧고 간결하므로 유지 보수가 쉽다
* 출력 기반 테스트의 기반 코드는 전역 상태나 내부 상태를 변경할 리 없으므로 프로세스 의존성을 다루지 않는다
* 따라서 테스트를 이해하기 쉽고 또 실행하기도 쉬워 유지 보수성 측면에서 가장 좋은 스타일이다



**상태 기반 스타일**

* 일반적으로 출력 기반 테스트보다 유지 보수가 쉽지 않다
* 상태 검증은 종종 출력 검증보다 더 많은 공간을 차지하기 때문이다
  * AAA 패턴의 Assert 구절이 길어진다
* 상태 기반 스타일 검증 구절 단축하기
  * 헬퍼 메서드로 대부분의 검증 코드를 숨기고 테스트를 단축할 수 있지만 헬퍼 메서드를 작성하고 유지하는데 노력이 필요하다
  * 검증 대상 클래스의 동등 멤버를 정의해 비교하기
  * 이 두 가지 기법은 가끔만 적용할 수 있다



**상태 기반 스타일 검증 대상 클래스의 동등 멤버를 정의해 비교하기 예시**

* 앞서 상태 기반 스타일은 검증 부분이 길어질 수 있다고 했다 아래 검증부가 긴 테스트를 보자

```java
@Test
void adding_a_comment_to_an_article_long() {
  Article sut = new Article();
  String text = "text";
  String author = "young three";
  LocalDate now = LocalDate.of(2021, 4, 12);

  sut.addComment(text, author, now);

  assertThat(sut.getComments().size()).isEqualTo(1);
  assertThat(sut.getComments().get(0).getText()).isEqualTo(text);
  assertThat(sut.getComments().get(0).getAuthor()).isEqualTo(author);
  assertThat(sut.getComments().get(0).getDate()).isEqualTo(now);
}
```

* 상태 기반 테스트의 검증 구절을 단축하는 방법으로 아래의 코드와 같이 검증 대상 클래스의 동등 멤버를 정의해 비교하는 것이 있다
* 검증 구절에서 댓글을 개별 속성으로 지정하지 않고 동등 멤버로 검증하고 있다
* 본질적으로 클래스가 값에 해당하고 값 객체로 변환할 수 있을 때만 동등 멤버를 정의해 비교할 수 있다
  * 클래스가 값에 해당하지 않으면 코드 오염으로 이어지며 이는 단위 테스트 안티 패턴이다


```java
@Test
void adding_a_comment_to_an_article() {
  Article sut = new Article();
  Comment comment = new Comment("text", "young three", LocalDate.of(2021, 4, 12));

  sut.addComment(comment.getText(), comment.getAuthor(), comment.getDate());

  assertThat(sut.getComments().contains(comment));
}
```



**통신 기반 테스트**

* 세 가지 스타일중 유지 보수성이 가장 낮다
* 테스트 대역과 상호 작용 검증을 설정해야 하며 이는 공간을 많이 차지한다
* 목이 사슬 형태로 있을 때 테스트는 더 커지고 유지 보수하기가 어려워진다



# 6 결론

* 출력 기반 테스트가 가장 좋다 이 스타일은 구현 세부 사항과 거의 결합되지 않으므로 리팩터링 내성을 유지하고자 주의를 많이 기울일 필요가 없다
* 하지만 안타깝게도 출력 기반 스타일은 함수형으로 작성된 코드에만 적용할 수 있다
  * 대부분의 객체지향 프로그래밍 언어에는 해당하지 않는다
  * 그래도 테스트를 출력 기반 스타일로 변경하는 기법이 있다

|                           | 출력 기반 | 상태 기반 | 통신 기반 |
| ------------------------- | --------- | --------- | --------- |
| 리팩터링 내성을 위한 노력 | 낮음      | 중간      | 중간      |
| 유지비                    | 낮음      | 중간      | 높음      |



# 7 함수형 아키텍처 이해

* 변경 기법을 알아보기 전에 약간의 기초 지식이 필요하다 함수형 아키텍처를 먼저 이해해보자



## 7.1 함수형 프로그래밍

* **함수형 프로그래밍**은 **수학적 함수**를 사용한 프로그래밍이다



**수학적 함수**

* 수학적 함수는 호출 횟수에 상관없이 **주어진 입력에 대해 동일한 출력**을 생성한다
* **부작용이 없다**
  * 함수 외부에서 관찰 가능한 상태 변화가 없는 것
* 숨은 입출력이 없다



**Order.java**

* calculateDiscount 메서드는 동일한 입력에 대해 항상 같은 결과를 반환한다
  * 결과에 영향을 주는 것은 오직 배열의 길이
* calculateDiscount 부작용이 없다
  * `double discount = products.size() * 0.01;`
  * 로컬 변수의 상태를 변경하지만 이는 메서드 외부에서는 보이지 않다
* 따라서 calculateDiscount 메서드는 수학적 함수가 된다

```java
public class Order {
  public double calculateDiscount(List<Product> products) {
    double discount = products.size() * 0.01;
    return Math.min(discount, 0.2);
  }
}
```

