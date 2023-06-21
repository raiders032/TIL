# 1 Functions﻿

- 코틀린의 함수는 `fun` 키워드를 사용해 정의한다.
- 파라미터 이름 뒤에 그 파라미터의 타입을 쓴다.
- 함수를 최상위 수준에 정의할 수 있다.
  - 꼭 클래스 안에 함수를 넣어야 할 필요가 없다.
- 함수의 반환 타입은 파라미터 목록을 닫는 괄호 다음에 콜론과 함께 위치한다.



**예시**

```kotlin
fun double(x: Int): Int {
    return 2 * x
}
```



# 2 expression이 본문인 함수



## 2.1 expression과 statement의 차이

- 식(expression)은 `값을 만들어` 내며 다른 식의 하위 요소로 계산에 참여할 수 있다.

- 문(statement)은 자신을 둘러싸고 있는 가장 안쪽 블록의 최상위 요소로 존재하며 `아무런 값을 만들어내지 않는다`.
- 자바에서는 모든 제어 구조가 문인 반면에 코틀린에서는 루프를 제외한 모든 제어 구조가 식이다.



## 2.2 블록이 본문인 함수(Explicit return types)

- [레퍼런스](https://kotlinlang.org/docs/functions.html#explicit-return-types)
- 코틀린 에서 if 문은 expression이다.
- 아래는 `블록이 본문인 함수`라고 한다.
  - 본문이 중괄호로 둘러싸인 함수
- 블록이 본문인 함수는 **반환 타입을 명시적으로 지정**해야 한다.

```kotlin
fun max(a: Int, b: Int): Int {
  return if (a > b) a else b
}
```



## 2.3 식이 본문인 함수(Single-expression functions)

- [레퍼런스](https://kotlinlang.org/docs/functions.html#single-expression-functions)

- 위에서 본 것과 같이 함수 본문이 식 하나로 이루어진 경우 아래와 같이 간결하게 표현할 수 있다.

- 아래와 같은 함수를 `식이 본문인 함수`라고 한다.
  - 등호와 식으로 이루어진 함수

- 식이 본문인 경우 **반환 타입을 추론할 수 있어 생략 가능**하다

```kotlin
fun max(a: Int, b: Int) = if (a > b) a else b
```



# 3 Parameters

- [레퍼런스](https://kotlinlang.org/docs/functions.html#parameters)
- 함수의 파라미터들은 `, ` 를 기준으로 분리한다.

```kotlin
fun powerOf(number: Int, exponent: Int): Int { /*...*/ }
```



# 4 Named arguments

- [레퍼런스](https://kotlinlang.org/docs/functions.html#named-arguments)
- 코틀린으로 작성한 함수를 호출할 때는 인자 중 일부의 이름을 명시할 수 있다.
- 어느 하나라도 이름을 명시하고 나면 혼동을 막기 위해 그 뒤에 오는 모든 인자는 이름을 꼭 명시해야 한다.



**예시**

```kotlin
fun <T> joinToString(
    collection: Collection<T>,
    separator: String,
    prefix: String,
    postfix: String
)
```

```kotlin
joinToString(collection, " ", "", ".")
joinToString(collection, separator = " ", prefix = "", postfix = ".")
```



# 5 Default arguments

- [레퍼런스](https://kotlinlang.org/docs/functions.html#default-arguments)
- 자바에서는 일부 클래스에서 오버로딩한 메서드가 너무 많아진다는 문제가 있다.
- 코틀린에서는 함수 선언에서 파라미터의 디폴트 값을 지정할 수 있으므로 이런 오버로드 중 상당수를 피할 수 있다.
- 함수의 디폴트 파라미터는 함수 선언 쪽에서 지정한다.
  - 따라서 함수의 디폴트 값을 변경하면 해당 함수를 호출하는 코드 중에 값을 지정하지 않는 모든 인자는 자동으로 바뀐 디폴트 값을 적용받는다.




**예시**

- separator, prefix, postfix에 디폴트 값을 지정한다.

```kotlin
fun <T> joinToString(
    collection: Collection<T>,
    separator: String = ", ",
    prefix: String = "",
    postfix: String = ""
)
```

- 호출할 때 디폴트 파라미터 값이 있는 인자를 생략할 수 있다.
- 이름 붙인 인자 붙여서 사용하면 순서와 관계없이 지정할 수 있다.

```kotlin
joinToString(list)
joinToString(list, postfix = ".", prefix = "")
```



# 6 최상위 함수

- 자바에서는 모든 코드를 클래스의 메서드로 작성해야 한다.
- 그 결과 다양한 정적 메서드를 모아두는 역할만 담당하는 클래스인 유틸리티 클래스가 생겨난다.
  - 유틸리티 클래스: 상태나 인스턴스 메서드는 없는 클래스
  - JDK의 Collections 클래스가 전형적인 예시
- 코틀린에서는 이런 무의미한 클래스가 필요 없다
- 대신 함수를 직접 소스 파일의 최상위 수준, 모든 클래스의 밖에 위치시키면 된다.



**join.kt** 파일

```kotlin
@JvmName("StringsFuctions")
package strings

fun joinToString(): String {...}
```



**가능한 이유**

- JVM이 클래스 안에 들어있는 코드만 실행할 수 있기 때문에 컴파일러가 이 파일을 컴파일 할 때 새로운 클래스를 정의해준다.
- **join.kt** 파일을 컴파일한 결과와 같은 자바 코드는 아래와 같다.
- 코틀린 컴파일러가 생성하는 클래스의 이름은 소스 파일의 이름과 대응된다.

```java
package strings;

public class JoinKt {
  public static String joinToString(...) {...}
}
```



**최상위 함수를 자바에서 사용하기**

```java
import strings.JoinKt;

JoinKt.joinToString(list, ", ", "", "");
```



**파일에 대응하는 클래스의 이름 변경**

- 파일에 대응하는 클래스의 이름을 변경하려면 코틀린 파일 최상단에 @JvmName 애노테이션을 사용하자
- 해당 애노테이션은 파일의 맨 앞, 패키지 이름 선언 앞에 위치해야 한다.

```kotlin
@JvmName("StringsFuctions")
package strings

fun joinToString(): String {...}
```

```java
import strings.StringsFuctions;

StringsFuctions.joinToString(list, ", ", "", "");
```



# 7 Variable number of arguments

- [레퍼런스](https://kotlinlang.org/docs/functions.html#variable-number-of-arguments-varargs)
- 가변 인자 함수
- var 키워드를 사용하면 호출 시 인자 개수가 달라질 수 있는 함수를 정의할 수 있다.



**예시**

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // ts is an Array
        result.add(t)
    return result
}
```

```kotlin
val list = asList(1, 2, 3)
```



**가변 길이 인자로 배열 넘기기**

- 이미 배열에 들어있는 원소를 가변 길이 인자로 넘길 때 자바와 코틀린이 다르다.
- 자바에서는 배열을 그냥 넘기면 되지만 코틀린에서는 배열을 명시적으로 풀어서 배열의 각 원소가 인자로 전달되어야 한다.
- 이때 스프레드 연산자를 사용한다.
  - 배열 앞에 `*`를 붙이면 된다.

```kotlin
fun main(args: Array<String>){
  val list = listOf("args:", *args)
  print(list)
}
```





# 8 확장 함수

- 확장 함수란 어떤 클래스의 멤버 메서드인 것처럼 호출할 수 있지만 그 클래스 밖에 선언된 함수다.
  - 확장 함수는 마치 기존 클래스에 새로운 메서드를 추가하는 것과 같다.
- 확장 함수를 만드려면 추가하려는 함수 이름 앞에 확장할 클래스의 이름을 덧붙인다.
  - 여기서 클래스 이름을 수신 객체 타입(reveiver type)이라고 한다.
  - 수신 객체 타입: 확장이 정의될 클래스의 타입
  - 확장 함수가 호출된는 대상이 되는 객체를 수신 객체(reveicer object)라고 한다.
  - 수신 객체: 그 클래스에 속한 인스턴스 객체
- 수신 객체 타입으로 자바, 코틀린, 그루비 중 어떤 것으로 작성됐는가는 중요하지 않다.
  - 자바 클래스로 컴파일할 수 있는 클래스는 원하는 대로 확장할 수 있다.
- 내부적으로 확장 함수는 수식 객체를 첫 번째 인자로 받는 정적 메서드다.
  - 확장 함수는 단지 정적 메서드 호출에 대한 문법적 편의다.

- 어떤 클래스를 확장한 함수와 그 클래스 멤버 함수의 이름과 시그니처가 같으면 멤버 함수가 호출된다.
  - 멤버 함수의 우선순위가 더 높다.




**예시**

```kotlin
package strings

// String이 수식 객체 타입이고 this가 수신 객체이다.
fun String.lastChar(): Char = this.get(this.length - 1)

// 일반 메서드와 마찬가지로 this를 생략할 수 있다.
fun String.lastChar(): Char = get(length - 1)

// "Kotlin"이 수신 객체다.
fun main() {
    println("Kotlin".lastChar())
}
```



## 8.1 확장 함수와 캡슐화

- `확장 함수는 캡슐화를 깨트리지 않는다!`
- 클래스 안에서 정의한 메서드와 달리 확장 함수 안에서는 클래 내부에서만 사용할 수 있는 private, protected 멤버를 사용할 수 없다.



## 8.2 확장 함수 임포트

- 확장 함수를 정의하고 자동으로 프로젝트 안의 모든 소스코드에서 해당 함수를 사용할 수 없다.
- 다른 클래스나 함수와 마찬가지로 임포트가 필요하다.



**예시**

```kotlin
import strings.lastChar
val c = "Kotlin".lastChar
```

```kotlin
import strings.lastChar as last
val c = "Kotlin".last
```

- as 키워드를 사용하면 임포트한 클래스나 함수를 다른 이름으로 부를 수 있다.
- 같은 이름을 가진 확장 함수를 한 파일에서 사용할 때 as를 사용해 다른 이름을 부여하자



# 10 중위 호출

- [레퍼런스](https://kotlinlang.org/docs/functions.html#infix-notation)
- 맵을 만들 때 아래와 같이 mapOf 함수를 이용한다.



```kotlin
val map = mapOf(1 to "one", 2 to "two", 53 to "fifty-three")
```

- 여기서 to는 코틀린 키워드가 아니다.
- 이 코드는 중위 호출이라는 특별한 방식으로 **to라는 일반 메서드**를 호출한 것이다.



**중위 호출**

- 수신 객체와 유일한 메서드 인자 사이에 메서드 이름을 넣는다.
- 중위 호출은 인자가 하나뿐인 일반 메서드나 확장 함수에 적용할 수 있다.

```kotlin
// to 메서드를 일반적인 방식으로 호출한다.
1.to("one")

// 위 방식을 중위 호출 방식 변경했다.
1 to "one"
```



**함수에 중위 호출 적용하기**

- 함수에 `infix` 키워드를 붙이면 중위 호출이 가능해진다.
- 모든 함수에 중위 호출은 적용할 수 없고 아래의 모든 조건을 만족할 때 infix 키워드를 적용할 수 있다.
  - 함수 또는 확장 함수
  - 하나의 파라미터
  - 파라미터는 가변 인자가 아니다
  - 파라미터가 디폴트 값을 가지고 있지 않다.

```kotlin
infix fun Int.shl(x: Int): Int { ... }

// calling the function using the infix notation
1 shl 2

// is the same as
1.shl(2)
```



# 11 로컬 함수

- 코틀린에서는 함수에서 추출한 함수를 원 함수 내부에 중첩시킬 수 있다.
- 중첩된 함수를 로컬 함수라고 한다.
- 로컬 함수는 자신이 속한 바깥 함수의 모든 파라미터와 변수를 사용할 수 있다.
