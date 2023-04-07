# 1 Type System

- 코틀린의 타입 시스템은 코드의 가독성을 향상시키는 데 도움이되는 몇가지 특성을 새로 제공한다.
  - `nullable type`(널이 될수 있는 타입)
  - 읽기 전용 컬렉션



# 2 nullable type



## 2.1 널 가능성(nullability)

- nullability는 NullPointerException을 피할 수 있게 돕는 코틀린 타입 시스템의 특성이다.
- 코틀린을 비롯한 최신 언어에서 null에대한 접근 방식으로 이 문제를 가능한 실행 시점에서 컴파일 시점으로 옮기고 있다.
- 널이 될수 있는지 여부를 타입 시스템에 추가해 컴파일러가 이 문제를 컴파일 시 미리 감지해서 실행 시점에 발생할 수 있는 예외의 가능성을 줄인다.



## 2.2  nullable type



**자바**

- 아래의 함수는 안전하지 않다.
- null을 인자로 넘기면 NullPointerException이 발생하기 때문

```java
int strLen(String s){
  return s.length()
}
```



**코틀린**

- 위 자바 함수를 코틀린으로 작성해보자.
- 이 때 중요한 부분이 `함수가 널을 인자로 받을 수 있는가?`이다.
- 만약 널이 인자로 들어올 수 없다면 아래와 같이 함수를 정의한다.
- strLen에 null이 될 수 있는 인자를 넘기는 것이 금지되며 null을 넘기려고 하면 컴파일 시 오류가 발생한다.
- 따라서 결코 strLen 함수가 실행 시점에 NullPointerException이 발생하지 않는다.

```kotlin
fun strLen(s:String) = s.length()
```



**코틀린 nullable type**

- 함수가 널을 인자로 받을 수 있게 하려면 타입 이름 뒤에 물음표(?)를 명시해야한다.
- nullable type은 타입 뒤에 물음표(?)를 명시해야 한다.
  - 물음표를 붙이면 해당 타입의 변수느 프로퍼티에 null 참조를 저장할 수 있다는 뜻이다.
- nullable type의 변수가 있다면 해당 변수에 대해 수행할 수 있는 연산이 제한된다.
- 따라서 아래와 같이 `s.length()` 메서드를 직접 호출할 수 없다.
  - 아래 코드를 컴파일 하면 오류가 발생한다.

```kotlin
fun strLen(s:String?) = s.length()
```

- 또한 아래와 같이 널이 될수 있는 값을 nullable type의 변수에 대입할 수 없다.

```kotlin
val x:String? = null
val t:String = x
```

- 또한 널이 될 수 있는 값을 널이 될 수 없는 타입의 파라미터를 받는 함수에 전달할 수 없다.



# 3 안전한 호출 연산자 `?.`

- 코틀린에서 제공하는 `?.`연산자는 null검사와 메서드 호출을 한 번의 연산으로 수행한다.
  - 호출하려는 값이 null이 아니리면 `?.`는 일반 메서드 호출과 같고 null인 경우 호출은 무시되고 null이 결과 값이 된다.
  - `s?.toUpperCase()`는 `if (s != null) s.toUpperCase() else null`과 같다.



# 4 엘비스 연산자 `?:`

- 코틀린은 null 대신 디폴트 값을 지정할 때 편리하게 사용할 수 있는 엘비스 연산자를 제공한다.
- 코틀린에서는 return, throw 등의 연산도 식이기 때문에 엘비스 연산자의 우항으로 사용할 수 있다.



**예시**

- 엘비스 연산자는 이항 연산자로 좌항 값이 null이 아니면 좌합 값을 결과로 하고 좌항 값이 널이면 우항 값을 결과로 한다. 

```kotlin
fun strLenSafe(s: String?): Int = s?.length ?: 0

fun main(args: Array<String>) {
    println(strLenSafe("abc"))
    println(strLenSafe(null))
}
```



# 5 안전한 캐스트 `as?`



# 6 널 아님 단언 `!!`



# 7 let 함수

- let 함수를 `?.(안전한 호출 연산자)`와 함께 사용하면 원하는 식을 평가해서 결과가 널인지 검사한 다음 결과를 변수에 넣는 작업을 간단히 처리할 수 있다.
- `?.`와 같이 사용해 let을 안전하게 호출하면 수신 객체가 널이 아닌 경우만 람다를 실행해준다.



**예시**

- sendEmailTo 함수는 널이 아닌 파라미터를 받는다.
- 따라서 이 함수에 널이 될 수 있는 타입의 값을 넘길 수 없고 인자를 넘기기 전에 널 검사를 해야한다.
- 

```kotlin
fun sendEmailTo(email: String) {
    println("Sending email to $email")
}

fun main(args: Array<String>) {
    var email: String? = "yole@example.com"
    email?.let { sendEmailTo(it) }
    email = null
    email?.let { sendEmailTo(it) }
}
```

