# 1 Higher-order functions

- [레퍼런스](https://kotlinlang.org/docs/lambdas.html#higher-order-functions)
- 함수를 인자로 받거나 함수를 반환하는 함수를 Higher-order functions(고차 함수)라고 한다.
- 코틀린에서는 람다나 함수 참조를 사용해 함수를 값으로 표현할 수 있다.
	- 따라서 고차 함수는 람다나 함수 참조를 인자로 넘길 수 있거나 람다나 함수 참조를 반환하는 함수다.
- 고차 함수를 정의하려면 먼저 함수 타입을 알아야 한다.

<br>

## 1.1 Function Type (함수 타입)

- 람다를 인자로 받는 함수를 정의하려면 먼저 람다 인자의 타입을 어떻게 선언하는지 알아야 한다.


**예시**

```kotlin
val sum = { x: Int, y: Int -> x + y }  
val action = { println(42) }
```

- 함수 타입을 알아보기 위해 먼저 람다를 로컬 변수에 대입해보자.
- 코틀린은 타입 추론으로 인해 변수 타입을 지정하지 않아도 된다.
	- 컴파일러가 알아서 타입을 추론해준다.
- 그렇다면 이제 각 변수에 구체적인 타입 선언을 어떻게 해야 되는지 알아보자.

<br>
**구체적인 타입 선언**

```kotlin
val sum: (Int, Int) -> Int = { x, y -> x + y }  
val action: () -> Unit = { println(42) }
```

- 함수 타입을 정의하려면 함수 파라미터의 타입을 괄호 안에 넣고 `->` 를 추가한 다음 함수의 반환 타입을 지정하면 된다.
- 여기서 사용된 Unit이라는 타입은 의미 있는 값을 반환하지 않는 함수 반환 타입에 쓰는 특별한 타입이다.
	- 일반 함수를 정의하면 반환 타입으로 Unit 타입 지정을 생략해도 되지만 함수 타입을 선언할 때는 반드시 명시해야 한다.
- 변수 타입을 함수 타입으로 지정하면 람다의 파라미터 타입을 유추할 수 있기 때문에 `x`와 `y`의 타입을 생략해도 된다.

<br>

# 2 자바에서 코틀린 함수 타입 사용

- 함수 타입은 컴파일된 코드에서 일반 인터페이스로 변경된다.

<br>

**코틀린 표준 라이브러리**

```kotlin
package kotlin.jvm.functions  
  
/** A function that takes 0 arguments. */  
public interface Function0<out R> : Function<R> {  
    /** Invokes the function. */  
    public operator fun invoke(): R  
}

/** A function that takes 1 argument. */  
public interface Function1<in P1, out R> : Function<R> {  
    /** Invokes the function with the specified argument. */  
    public operator fun invoke(p1: P1): R  
}

...
```
- 코틀린 표준 라이브러리는 함수 인자의 개수에 따라 아래와 같은 인터페이스를 제공한다. 
	- `Function0<R>` : 인자가 없는 함수
	- `Function1<P1, R>`: 인자가 하나인 함수
	- `Function22`까지 존재함
- 각 인터페이스는 `invoke` 메서드 정의가 하나 들어있다.
	- `invoke` 를 호출하면 함수를 실행할 수 있다.
- 즉 **함수 타입의 변수는 인자의 개수에 따라 적당한 `FunctionN` 인터페이스를 구현한 클래스의 인스턴스를 만들어 저장하며 해당 클래스의 `invoke` 메서드 본문에는 람다의 본문이 들어가게 된다.**

<br>

# 3 함수 타입의 파라미터의 디폴트 값 설정

- 파라미터로 함수 타입으로 선언해도 디폴트 값을 설정할 수 있다.

<br>

**예시**

```kotlin
fun <T> Collection<T>.joinToString(  
    separator: String = ", ",  
    prefix: String = "",  
    postfix: String = "",  
    transform: (T) -> String = { it.toString() }  
): String {  
    val result = StringBuilder(prefix)  
  
    for ((index, element) in this.withIndex()) {  
        if (index > 0) result.append(separator)  
        result.append(transform(element))  
    }  
    result.append(postfix)  
    return result.toString()  
}
```

```kotlin
fun main() {  
    val letters = listOf("Alpha", "Beta")  
    println(letters.joinToString())  
    println(letters.joinToString{it.lowercase()})  
    println(letters.joinToString{it.uppercase()})  
}
```

```
Alpha, Beta
alpha, beta
ALPHA, BETA
```

<br>

# 4 함수를 반환하는 고차 함수


<br>

# 5 inline 함수

- 코틀린이 보통 람다를 무명 클래스로 컴파일 하지만 그렇다고 람다 식을 사용할 때마다 새로운 클래스가 만들어지지 않는다.
	- 람다가 변수를 포획하면 람다가 생성되는 시점마다 새로운 무명 클래스 객체가 생성된다.
- `inline` 변경자를 함수에 붙이면 코틀린 컴파일러에서 그 함수를 호출하는 모든 문장을 함수 본문에 해당하는 바이트코드로 바꿔치기 해준다.