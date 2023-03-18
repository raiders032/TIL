# 1 Interface

- 코틀린의 Interface는 자바 8의 Interface와 비슷하다.
- 추상 메서드뿐아니라 구현이 있는 메서드도 정의할 수 있다.
  - 자바 8의 디폴트 메서드와 비슷하다.
- 다만 인터페이스에는 아무런 상태(필드)가 들어갈 수 없다.



## 1.1 Interface 정의

- click이라는 추상 메서드가 있는 Interface를 정의한다.

```kotlin
interface Clickable {
  fun click()
}
```



## 1.2 구현이 있는 메서드

- 자바에서는 구현이 있는 메서드 앞에 `default` 키워드를 붙여야한다.
- 하지만 코틀린에서는 별다른 키워드가 필요 없고 메서드 본문을 시그니처 뒤에 추가하면 된다.
- 아래의 showOff 메서드의 경우 자식에서 새로운 동작을 정의할 수도 있고 정의를 생략하면 디폴트 구현을 사용한다.

```kotlin
interface Clickable {
    fun click()
    fun showOff() = println("I'm clickable!")
}
```



## 1.3 Interface 구현

- 자바에서는 `extends`와 `implement` 키워드를 사용하지만 코틀린에서는 클래스 이름에 `:`을 붙이고 인터페이스와 클래스 이름을 적는 것으로 클래스 확장과 인터페이스 구현을 모두 처리한다.
- 자바의 `@Override`와 비슷한 `override` 변경자는 상위 클래스나 인터페이스에 있는 프로퍼티나 메서드를 오버라이드한다는 표시다.
- 자바와 달리 `override` 변경자를 꼭 사용해야 한다.
  - 상위 클래스의 메서드와 시그니처가 같은 메서드가 하위 클래스에 선언되면 컴파일 에러가 발생한다.
  - 이런 경우 `override`를 붙이거나 메서드 이름을 변경해 시그니처를 다르게해야 한다.

```kotlin
class Button : Clickable {
    override fun click() = println("I was clicked")
}
```

