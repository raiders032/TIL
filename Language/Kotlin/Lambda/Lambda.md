# 1 Lambda

- 람다 식(lambda expression)은 기본적으로 다른 함수에 넘길 수 있는 작은 코드 조각을 뜻한다
- 람다를 따로 선언해서 변수에 저장할 수 있지만 대부분 함수에 인자로 넘기면서 바로 람다를 정의하는 경우가 많다.



## 1.1 코드 블록을 함수 인자로 넘기기

- "이벤트가 발생하면 이 핸들러를 실행하자" 또는 "데이터 구조의 모든 원소에 이 연산을 적용하자"와 같은 생각을 코드로 구현할 때 일련의 동작을 변수에 저장하거나 다른 함수에 넘기는 경우가 있다.
- 자바 8 이전에는 익명 클래스를 통해  코드를 함수에 넘기거나 변수에 저장할 수 있었다.
  - [Anonymous Class.md](../../Java/Anonymous-Class/Anonymous-Class.md) 참조
  - 클래스를 선언하고 클래스의 인스턴스를 함수에 넘기는 방식으로 상당히 번거로운 작업이다.
- 함수형 프로그래밍 언어에서는 함수를 값처럼 다루는 접근 방식을 택해 이 문제를 해결한다.



# 2 람다 식의 문법

- 코틀린 람다 식은 항상 중괄호로 둘러싸여 있다.
- `->`가 인자 목록과 분문을 구분한다.



**예시**

```kotlin
{x: Int, y:Int -> x + y}
```



**변수에 람다 저장하기**

```kotlin
val sum = { x: Int, y: Int ->
   println("Computing the sum of $x and $y...")
   x + y
}

println(sum(1, 2))
```



## 2.1 람다식 줄여 쓰기



**원본**

```kotlin
val people = listOf(Person("Alice", 29), Person("Bob", 31))
println(people.maxBy({person -> person.age}))
```



**람다식 소괄호에서 빼기**

- 함수 호출 시 맨 뒤에 있는 인자가 람다식이면 그 람다를 괄호 밖으로 빼낼 수 있다.

```kotlin
val people = listOf(Person("Alice", 29), Person("Bob", 31))
println(people.maxBy() { person -> person.age })
```

- 람다가 함수의 유일한 인자이고 괄호 뒤에 람다를 썻다면 빈 괄호를 아래와 같이 없애도 된다.

```kotlin
val people = listOf(Person("Alice", 29), Person("Bob", 31))
println(people.maxBy { person -> person.age })
```



**it 사용하기**

- 파라미터 이름을 지정하지 않으면 it이라는 이름의 디폴트 파라미터가 만들어진다.
- 람다의 파라미터가 하나뿐이고 그 타입을 컴파일러가 추론할 수 있는 경우 it을 사용할 수 있다.

```kotlin
val people = listOf(Person("Alice", 29), Person("Bob", 31))
println(people.maxBy { it.age })
```



> it 사용하기
>
> - it은 코드를 간결하게 만들어주지만 람다가 중첩되는 경우 각 람다의 파라미터의 이름을 명시하는 편이 좋다.



## 2.2 람다식의 결과 값

- 람다식의 본문이 여러줄로 이루어진 경우 본문의 맨 마지막에 있는 식이 람다의 결과 값이 된다. 



# 3 멤버 참조

- 람다를 사용해 코드 블록을 넘길 수 있다. 그런데 이러한 코드 블록이 이미 함수로 정의된 경우 어떻게 할까?
  - 그 함수를 호출하는 람다를 만들면 되지만 이는 중복이다.
  - 멤버 참조를 이용하면 그 함수를 직접 넘길 수 있다.



**예시**

- `::`을 사용하는 식을 멤버 참조라고 부른다.
  - `::`은 클래스의 이름과 참조하려는 멤버(프로퍼티나 메서드) 이름 사이에 위치한다.
- 이를 이용해 함수를 값으로 바꾸고 변수에 담았다.

```kotlin
class Person(val name: String, val age: Int)

val age = Person::age
```



## 3.1 생성자 참조

- `::클래스이름` 으로 생성자 참조를 만들 수 있다.



```kotlin
data class Person(val name: String, val age: Int)

fun main(args: Array<String>) {
    val createPerson = ::Person
    val p = createPerson("Alice", 29)
    println(p)
}
```



## 3.2 확장 함수 참조

- `클래스이름::확장함수이름`으로 확장 함수 참조를 만들 수 있다.

```kotlin
data class Person(val name: String, val age: Int)
fun Person.isAdult() = age >= 21
val predicate = Person::isAdult
```



# 4 수신 객체 지정 람다: with, apply

- 수신 객체 지정 람다란 수신 객체를 명시하지 않고 람다의 본문 안에서 다른 객체의 메서드를 호출할 수 있게하는 것이다.



## 4.1 with

- 어떤 객체의 이름을 반복하지 않고도 그 객체에 대해 다양한 연산을 수행할 수 있다면 좋을 것이다.
- 코틀린에서는 언어 구성 요소로 제공하진 않지만 with라는 라이브러리 함수를 통해 이 기능을 제공한다.
- 아래 예시를 통해 with를 사용해보자.



**예시**

- 아래 예제에서 result에 대해 다른 여러 메서드를 호출하면서 result를 반복사용하고 있다.

```kotlin
fun alphabet(): String {
    val result = StringBuilder()
    for (letter in 'A'..'Z') {
         result.append(letter)
    }
    result.append("\nNow I know the alphabet!")
    return result.toString()
}

fun main(args: Array<String>) {
    println(alphabet())
}
```



**with를 사용하여 리팩터링**

```kotlin
fun alphabet(): String {
    val stringBuilder = StringBuilder()
    return with(stringBuilder) { // 메서드를 호출하려는 수신 객체를 지정한다.
        for (letter in 'A'..'Z') {
            this.append(letter) // this를 명시해서 수신 객체의 메서드를 호출한다.
        }
        append("\nNow I know the alphabet!") // this를 생략해서 수신 객체의 메서드를 호출한다.
        this.toString() // 람다의 값을 반환한다.
    }
}

fun main(args: Array<String>) {
    println(alphabet())
}
```

```kotlin
fun alphabet() = with(StringBuilder()) {
    for (letter in 'A'..'Z') {
        append(letter)
    }
    append("\nNow I know the alphabet!")
    toString()
}

fun main(args: Array<String>) {
    println(alphabet())
}
```



**with**

- with문은 언어제 제공하는 특별한 구문 같지만 실제로 파라미터가 2개 있는 함수다.
- 위 예시에서 첫 번째 파라미터는 stringBuilder고 두 번째 파라미터는 람다다
- 람다를 괄호 밖으로 빼는 관례에 따라 언어가 제공하는 특별한 구문처럼 보인다.
- with는 첫 번째 인자로 받은 객체를 두번 째 인자로 받은 람다의 수신 객체로 만든다.
- with가 반환하는 값은 람다 코드를 실행한 결과다.
  - 람다 식의 결과는 마지막 식의 값이다.
- 람다식의 결과 대신 수신 객체가 필요한 경우에는 `apply` 라이브러리 함수를 사용한다.



**메서드 이름 충돌**

- with에게 인자로 넘긴 객체의 메서드 이름과 with를 사용하는 코드가 들어있는 클래스의 메서드가 같은 경우에 바깥쪽 클래스의 메서드를 호출하고 싶다면 `this@OuterClass.toString()`과 같은 구문을 사용한다.



## 4.2 apply

- `apply`는 `with`와 거의 같은 함수다.
- 유일한 차이점은 `apply`는 항상 자신에게 전달된 수신 객체를 반환한다는 점이다.
- 이런 `apply` 함수는 객체의 인스턴스를 만들면서 즉시 프로퍼티 중 일부를 초기화하는데 용이하다.



**예시**

- 위에 `with`의 예시를 `apply`를 사용해 리팩터링 했다.

```kotlin
fun alphabet() = StringBuilder().apply {
    for (letter in 'A'..'Z') {
        append(letter)
    }
    append("\nNow I know the alphabet!")
}.toString()

fun main(args: Array<String>) {
    println(alphabet())
}
```



**초기화 예시**

- 보통 별도의 Builder객체가 이런 역할을 담당하지만 코틀린에서는 apply를 사용해 객체의 인스턴스를 만들면서 즉시 프로퍼티 중 일부를 초기화 할 수 있다.
- 새로운 TextView 인스턴스를 만들고 즉시 apply에게 넘긴다. apply에 전달된 TextView가 수신 객체가 된다.
- 따라서 TextView의 메서드를 호출하거나 프로퍼티를 설정할 수 있다.
- 람다가 실행되고 나면  apply는 람다에 의해 초기화된 TextView 인스턴스를 반환한다.

```kotlin
fun createViewCustomAttributes(context: Context) = 
TextView(context).apply {
  text = "Samplt Text"
  textSize = 20.0
  setPadding(10, 0, 0, 0)
}
```

