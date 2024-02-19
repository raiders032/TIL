# 1 Generics

- 코틀린에서 제네릭 클래스의 기본 개념은 자바와 비슷하다.
	- [[Generic]] 참고

<br>

## 1.1 Type Parameter

- Generic을 사용하면 타입 파라미터를 받는 타입을 지정할 수 있다.
- Generic Type의 인스턴스를 만드려면 타입 파라미터(`Type Parameter`)를 구체적인 타입 인자(`type argument`)로 치환해야 한다.
	- 예를 들어 `Map<K, V>`라는 Generic Type이 있을 때 `Map<String, Person>` 처럼 구체적인 타입을 타입 인자로 넘기면 Generic Type을 인스턴스화할 수 있다.
- 자바와 달리 코틀린에서는 제네릭 타입의 타입 인자를 프로그래머가 명시하거나 컴파일러가 추론할 수 있어야 한다.
	- 자바에서는 리스트 원소 타입을 지정하지 않고 List 타입의 변수를 선언할 수 있다.
	- 이전 버전과 호환성을 유지하기 위해 타입 인자가 없는 타입(로 타입)을 허용한다.
	- 코틀린은 제넥릭을 처음부터 도입했기 때문에 로 타입을 지원하지 않는다.
	- 따라서 제네릭 타입의 타입 인자를 명시하거나 추론할 수 있어야 한다.

<br>

**예시**

```kotlin
val authors = listOf("Dmitry", "Svetlana")
```

- listOf에 전달된 두 값이 문자열이기 때문에 컴파일러는 여기서 생기는 리스트가 `List<String>`임을 추론한다.
- 빈 리스트를 만들어야 한다면 타입 인자를 추론할 수 없기 때문에 직접 타입 인자를 명시해야 한다.

<br>

## 1.2 Generic functions

- [레퍼런스](https://kotlinlang.org/docs/generics.html#generic-functions)
- 클래스 또는 인터페이스만 타입 파라미터를 가지는 것이 아니다. 함수도 타입 파라미터를 가질 수 있다.
- 만약 리스트를 다루는 함수를 작성한다면 어떤 특정 타입을 저장하는 리스트뿐 아니라 모든 리스트를 다룰 수 있는 함수를 작성하길 원할 것이다.
- 이런 경우 Generic Function을 사용할 수 있다.

**예시**

```kotlin
fun <T> singletonList(item: T): List<T> { // ... } 
fun <T> T.basicToString(): String { // extension function // ... }
```

- 타입 파라미터는 함수 이름 앞에 위치한다.

```kotlin
val l = singletonList<Int>(1)
```

- generic function을 호출하기 위해서는 타입 아규먼트를 명시해야 한다.
- 타입 아규먼트는 함수 이름 뒤에 위치한다.

```kotlin
val l = singletonList(1)
```

- 하지만 대부분의 경우 컴파일러가 타입 인자를 추론할 수 있으므로 타입 인자를 명시할 필요가 없다.

<br>

## 1.3  Generic Class

- 자바와 마찬가지로 클래스 이름 뒤에 `<타입 파라미터>`를 사용해서 제네렉 클래스를 선언할 수 있다.
	- 타입 파라미터는 클래스 본문 안에서 일반 타입처럼 사용할 수 있다.

<br>

## 1.4 Generic constraints

- 타입 파라미터 제약은 클래스나 함수에 사용할 수 있는 타입 인자를 제한하는 기능이다.

<br>

**Upper Bounds**

- 어떠한 타입을 타입 파라미터에 상한으로 지정하면 그 제네릭 타입을 인스턴스화할 때 사용하는 타입 인자는 반드시 그 상한 타입이거나 그 상한 타입의 하위 타입이어야 한다.
- 타입 파라미터에 상한을 지정하려면 타입 파라미터 뒤에 `:`을 표시하고 그 뒤에 상한 타입을 적으면 된다.
- Upper Bounds를 명시하지 않으면 기본적으로 `Any?`가 상한이 된다.


```kotlin
fun <T : Comparable<T>> sort(list: List<T>) { ... }
```

- 위와 같이 설정하면 오직 `Comparable<T>`의 서브 타입만이 `T`의 타입 인자로 사용될 수 있다.

```kotlin
// OK. Int is a subtype of Comparable<Int> 
sort(listOf(1, 2, 3)) 

// Error: HashMap<Int, String> is not a subtype of Comparable<HashMap<Int, String>>
sort(listOf(HashMap<Int, String>())) 
```

<br>

**둘 이상의 제약이 필요한 경우**

- 드문 경우이지만 타입 파라미터에 대해 둘 이상의 제약을 가해야 하는 경우가 있다.
- 2개 이상의 제약은 분리된 `where` 절을 사용해야 한다.

```kotlin
fun <T> copyWhenGreater(list: List<T>, threshold: T): List<String> where T : CharSequence, T : Comparable<T> { return list.filter { it > threshold }.map { it.toString() } }
```

- 위와 같이 T 타입은 반드시 CharSequence와 Comparable를 반드시 구현해야 한다.

<br>

## 1.5 타입 파라미터를 널이 될 수 없는 타입으로 한정

- 타입 파라미터에 아무런 상한을 지정하지 않으면 기본적으로 `Any?`가 상한으로 지정된다.

<br>

**예시**

```kotlin
class Processor<T> {  
    fun process(value: T) {  
        value?.hashCode()  
    }  
}
```

- 따라서 위와 같이 value가 null이 될 수 있기 때문에 안전한 호출 연산자 `?.`를 사용해야 한다.
- 그렇다면 항상 null이 될 수 없는 타입만 타입 인자로 받으려면 어떤 제약을 걸어야 할까?

<br>

**항상 null이 될 수 없는 타입 인자 받기**

```kotlin
class Processor<T: Any> {  
    fun process(value: T) {  
        value.hashCode()  
    }  
}
```

- 상한으로 `Any` 를 지정하면 항상 널이 될 수 없는 타입이 되게 보장된다.
- 예를 들어 타입 인자로 String?을 넘기면 Any의 자손 타입이 아니므로 컴파일 에러가 난다.

<br>

# 2 Type erasure

- 타입 소거란 실행 시점에 제네릭 클래스의 인스턴스에 타입 인자 정보가 들어있지 않다는 뜻이다.
- 코틀린도 자바와 마찬가지로 제네릭 타입 인자 정보는 런타임에 지워진다.
	- 예를 들어 `List<String>` 객체를 만들고 그 안에 문자열을 넣더라도 실행 시점에서는 `List`로만 볼 수 있다.
	- 즉 실행 시점에서는 `List`에 어떤 타입의 원소를 저장하는지 알 수 없다.
	- `is List<String>`과 같이 is 검사에서 타입 인자로 지정한 타입을 검사할 수 없다.
	- 하지만 컴파일 시점에 타입 정보가 주어진 경우에는 `is` 검사를 수행할 수 있다. 

<br>

# 3 실체화한 타입 파라미터

<br>

# 4 변성

<br>

## 4.1 변성이 있는 이유

<br>

## 4.2 클래스, 타입, 하위 타입

**클래스와 타입**

- 제네릭 클래스가 아닌 경우 클래스 이름을 바로 타입으로 사용할 수 있다.
	- 예를 들어 `var x:String` 라고 쓰면 String 클래스의 인스턴스를 저장하는 변수를 정의할 수 있다.
	- 추가적으로 `var x:String?`과 같이 클래스 이름을 널이 될 수 있는 타입으로 사용할 수 있다.
	- 즉 모든 코틀린 클래스가 적어도 둘 이상의 타입으로 사용될 수 있다는 뜻이다.
- 제네릭 클래스의 경우 `List`는 타입이 아니다.
	- `List<Int>`, `List<String?>` 등은 모두 제대로 된 타입이다.
	- 즉 제네릭 클래스의 경우 무수히 많은 타입을 만들어낼 수 있다.

<br>

**하위 타입**

- 어떤 타입 A가 필요한 모든 장소에 어떤 타입 B의 값을 넣어도 아무 문제가 없다면 B는 A의 하위 타입이다.
- 컴파일러는 변수 대입이나 함수 인자 전달 시 하위 타입 검사를 매번 수행한다.