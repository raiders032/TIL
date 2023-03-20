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

