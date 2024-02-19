
# 1 Operator Overloading

- [레퍼런스](https://kotlinlang.org/docs/operator-overloading.html)
- 자바에는 표준 라이브러리와 연관된 언어 기능이 몇 가지 있다.
	- `java.lang.Iterable`(표준 라이브러리)을 구현한 객체를 for ... in 루프(언어 기능)에 사용할 수 있다.
	- `java.lang.AutoCloseable`(표준 라이브러리)을 구현한 객체를 try문(언어 기능)에 사용할 수 있다.
- 코틀린에서도 어떤 **언어 기능이 정해진 사용자 작성 함수와 연결되는 경우**가 있다.
	- 자바와 다르게 이런 언어 기능이 클래스와 연관되기보다는 특정 함수 이름과 연관된다.
	- 예를 들어 어떤 클래스에 plus라는 이름의 특별한 메서드를 정의하면 해당 클래스의 인스턴스에 `+` 연산자를 사용할 수 있다.
- 이런식으로 미리 정해진 이름의 함수와 어떤 언어 기능을 연결해주는 기법을 코틀린에서는 **Convention**이라고 부른다.

<br>

## 1.1 연산자 오버로딩을 사용하는 이유

 - 자바에서는 원시 타입에 대해서만 이항 산술 연산자를 사용할 수 있고 추가적으로 String에 대해 `+` 연산자를 사용할 수 있다.
 - 연산자 오버로딩이 가능하면 아래와 같은 것들이 가능하다.
	 - BigInteger의 경우 add 메서드를 명시적으로 호출하기보다는 `+` 연산자를 사용하는 편이 더 직관적일 것이다.
	 - 컬렉션에 원소를 추가하는 작업에도 `+=` 연산자를 사용할 수 있다면 더 직관적일 것이다.
 - 자바에서는 이런 일이 불가능 하지만 코틀린에서는 이런 일이 가능하다.
 - 코틀린에서는 연산자와 매칭되는 특별한 함수 이름이 이미 정의되어 있다.
	 - 이것이 앞서 말한 **Convention**이다
	 - 따라서 `+` 연산자와 매칭되는 특별한 함수 이름 plus라는 함수를 정의하면 plus 메서드를 명시적으로 호출하지 않고 `+` 연산자를 사용하면 컴파일러가  `plus` 메서드를 호출하는 코드로 변경해준다.

<br>

# 2 Binary Operators Overloading

- [레퍼런스](https://kotlinlang.org/docs/operator-overloading.html#binary-operations)

<br>

## 2.1 Arithmetic Operators Overloading
 - **Convention**의 가장 단순한 예시로는 이항 산술 연산자(Binary Arithmetic Operators)가 있다.

<br>

**예시**

```kotlin
data class Point(val x: Int, val y: Int) {  
    operator fun plus(other: Point): Point {  
        return Point(x + other.x, y + other.y)  
    }  
  
}  
  
fun main() {  
    val point1 = Point(10, 20)  
    val point2 = Point(20, 30)  
    println(point1 + point2)  
}
```
- 위와 같이 plus 함수 앞에 operator 키워드를 붙인다.
- 연산자를 오버로딩 하는 함수 앞에는 반드시 operator가 있어야 한다.
- operator를 생략하고 **Convention**에서 사용하는 함수 이름을 사용하면 아래와 같은 오류가 발생한다.
	- `'operator' modifier is required on 'plus' in '...'`
- 이제 `point1 + point2을 사용하면 컴파일 시점에 `point1.plus(point2)`로 치환된다.


출력 결과는 아래와 같다.

```
Point(x=30, y=50)
```

<br>

**Arithmetic operations Convention**

- 코틀린에서 정의할 수 있는 이항 연산자와 그에 상응하는 연산자 함수 이름은 아래와 같다.

| Expression | Translated to     |
| ---------- | ----------------- |
| `a + b`    | `a.plus(b)`       |
| `a - b`    | `a.minus(b)`      |
| `a * b`    | `a.times(b)`      |
| `a / b`    | `a.div(b)`        |
| `a % b`    | `a.rem(b)`        |
| `a..b`     | `a.rangeTo(b)`    |
| `a..<b`    | `a.rangeUntil(b)` |

<br>

**다른 타입의 두 피연산자**
- 연산자를 정의할 때 두 피연산자가 같은 타입일 필요는 없다.
- 아래의 예시를 보자.

```kotlin
operator fun Point.times(scale: Double): Point {  
    return Point((x * scale).toInt(), (y * scale).toInt())  
}

fun main() {  
    val point1 = Point(10, 20)  
    println(point1 * 1.5)  
}
```
- 코틀린 연산자를 자동으로 교환 법칙이 적용되지 않는다.
- `point1 * 1.5` 외에 `1.5 * point1`라고 쓸 수 있어야 된다면 연산자 오버로딩을 반대로 한번 더 해야한다.


출력 결과는 아래와 같다.

```
Point(x=15, y=30)
```

<br>

## 2.2 Augmented assignments Operators Overloading
- 복합 대입 연산자 오버로딩에 대해서 알아보자.
- `plus`와 같은 연산자를 오버로딩하면 코틀린은 `+`연산자뿐 아니라 그와 관련 있는 연산자인 `+=`도 자동으로 함께 지원한다.
- `+=`, `-=` 등의 연산자를 복합 대입 연산자라 부른다.

<br>

**Augmented assignments Convention**

| Expression | Translated to      |
| ---------- | ------------------ |
| `a += b`   | `a.plusAssign(b)`  |
| `a -= b`   | `a.minusAssign(b)` |
| `a *= b`   | `a.timesAssign(b)` |
| `a /= b`   | `a.divAssign(b)`   |
| `a %= b`   | `a.remAssign(b)`   |

<br>

**주의점**
- 이론적으로 코드에 있는 `+=`은 아래와 같이 `plus`와 `plusAssign` 양쪽으로 컴파일이 가능하다.
	- `a = a.plus(b)`
	- `a.plusAssign(b)`
- 따라서 plus와 plusAssign 연산을 동시에 정의하지 말자.
- 만약 앞에서 본 Point 처럼 변경이 불가능하다면 plus와 같이 새로운 값을 반환하는 연산만 추가해야 한다.
- 빌더와 같이 변경 가능한 클래스를 설계한다면 plusAssign을 정의하자.

<br>

**복합 대입 연산자와 컬렉션**
- 컬렉션과 연산자를 같이 사용할 때 어떻게 동작하는지 알아보자.
- `+`와 `-` 연산자를 사용하면 항상 새로운 컬렉션을 반환한다.
- `+=`와 `-=` 연산자는 항상 변경 가능한 컬렉션에 작용해 메모리에 있는 객체 상태를 변화시킨다.
	- 새로운 컬렉션을 만들어 반환하지 않는다.
- 읽기 전용 컬렉션에 `+=`와 `-=`를 사용하면 변경을 적용한 복사본을 반환한다.
	- 새로운 컬렉션을 만들어 반환한다.
	- 따라서 var로 선언한 변수가 가리키는 읽기 전용 컬렉션에만 `+=`와 `-=`를 사용할 수 있다.

<br>

## 2.3 Equality and inequality operators Overloading
- 비교 연산자 오버로딩에 대해 알아보자!
- 코틀린은 `==` 연산자 호출을 `equals` 메서드 호출로 컴파일 한다.
- `a == b` 연산자는 먼저 a가 널인지 판단해서 널이 아닌 경우에만 a.equals(b)를 호출한다. a가 널인 경우 b도 널인 경우에만 true가 반환된다.

<br>

**Equality and inequality operators convention**

| Expression | Translated to                     |
| ---------- | --------------------------------- |
| `a == b`   | `a?.equals(b) ?: (b === null)`    |
| `a != b`   | `!(a?.equals(b) ?: (b === null))` |

<br>

**주의점**
- equals 메서드를 구현하기 위해 override 키워드를 사용한다.
- 연산자 오버로딩은 필수적으로 operator 키워드가 필요하다고 했다.
- 이는 Any의 equals 메서드에 operator 키워드가 적용되어 있기 때문이다.
- Any에서 상속받은 equals가 확장 함수보다 우선순위가 높기 때문에 **equals를 확장 함수로 정의할 수 없다**.

<br>

## 2.4 Comparison operators Overloading

- [레퍼런스](https://kotlinlang.org/docs/operator-overloading.html#comparison-operators)
- 자바에서는 비교를 위해 Comparable 인터페이스를 구현해야 한다.
	- 하지만 자바에서 이 메서드를 짧게 호출할 수 있는 방법이 없다.
	- `<` 나 `>` 등의 연산자는 원시 타입의 값만 비교할 수 있다.
	- 자바에서는 `element1.compareTo(element2)`와 같이 메서드 호출이 필수적이다.
- 코틀린에서는 compareTo 메서드에 대한 Convention을 제공한다. 
	- 따라서  `<` 나 `>` 등의 비교 연산자로 간단히 객체를 비교할 수 있다.

<br>

**Comparison operators Convention**

| Expression | Translated to         |
| ---------- | --------------------- |
| `a > b`    | `a.compareTo(b) > 0`  |
| `a < b`    | `a.compareTo(b) < 0`  |
| `a >= b`   | `a.compareTo(b) >= 0` |
| `a <= b`   | `a.compareTo(b) <= 0` |

<br>

**예시**

```kotlin
data class Person(val firstName: String, val lastName: String) : Comparable<Person> {  
    override fun compareTo(other: Person): Int {  
        return compareValuesBy(this, other, Person::lastName, Person::firstName)
    }  
}  
  
fun main() {  
    val person1 = Person("Alice", "Smith")  
    val person2 = Person("Bob", "Johnson")  
    println(person1 < person2)  // false
}
```

```kotlin
package kotlin

public interface Comparable<in T> {  
  public operator fun compareTo(other: T): Int  
}
```

- Comparable 인터페이스의 compareTo 메서드에는 operator 키워드가 적용되어 있어 operator키워드 적용하지 않아도 된다.

<br>

## 2.5 Indexed access operator Overloading
- 이번에는 컬렉션을 다룰 때 많이 사용하는 연산을 오버로딩 해보자.

<br>

**in operator**

| Expression | Translated to    |
| ---------- | ---------------- |
| `a in b`   | `b.contains(a)`  |
| `a !in b`  | `!b.contains(a)` |

<br>

**Indexed access operator**

| Expression             | Translated to             |
| ---------------------- | ------------------------- |
| `a[i]`                 | `a.get(i)`                |
| `a[i, j]`              | `a.get(i, j)`             |
| `a[i_1, ..., i_n]`     | `a.get(i_1, ..., i_n)`    |
| `a[i] = b`             | `a.set(i, b)`             |
| `a[i, j] = b`          | `a.set(i, j, b)`          |
| `a[i_1, ..., i_n] = b` | `a.set(i_1, ..., i_n, b)` |

<br>

# 3 Unary operations Overloading

- [레퍼런스](https://kotlinlang.org/docs/operator-overloading.html#unary-operations)

<br>

## 3.2 Unary prefix operators
- 단항 연산자를 오버로딩 하는 절차도 이항 연산자와 마찬가지다.

<br>

**Unary prefix operators convention**

| Expression | Translated to    |
| ---------- | ---------------- |
| `+a`       | `a.unaryPlus()`  |
| `-a`       | `a.unaryMinus()` |
| `!a`       | `a.not()`        |

<br>

**예시**

```kotlin
operator fun Point.unaryMinus(): Point {  
    return Point(-x, -y)  
}

fun main() {  
    val point1 = Point(10, 20)   
    println(-point1)  // Point(x=-10, y=-20)
}
```

<br>

# 4 Destructuring declarations
- [레퍼런스](https://kotlinlang.org/docs/destructuring-declarations.html)
- 구조 분해 선언(Destructuring declarations)과 component 함수에 대해서 알아보자.
- 구조 분해를 사용하면 복합적인 값을 분해해서 여러 다른 변수를 한번에 초기화 할 수 있다.
- 구조 분해 선언은 함수 본문 내의 선언뿐만 아니라 변수 선언이 들어갈 수 있는 장소라면 어디든 사용할 수 있다.
- 데이터 클래스에 대한 구조 분해는 추가작업 없이 사용할 수 있다.
	- 데이터 클래스를 사용하면 자동으로 componentN 함수를 만들어주기 때문이다.
	- 하지만 커스텀 클래스에 대한 구조 분해를 사용하려면 componentN 함수를 정의해야 한다.

<br>

**예시**

```kotlin  
val (x, y) = point 
```

- 위와 같이 구조 분해를 사용하면 객체를 분해해서 여러 변수에 한번에 담을 수 있다.
- 구조 분해 선언 또한 **convention**이 존재한다.
	- 구조 분해 선언과 componentN 함수가 연결되어 있다.
- 구조 분해 선언은 각 변수를 초기화하기 위해 componentN 이라는 함수를 호출한다.
	- N은 변수 위치에 따라 붙는 번호다.

<br>

**Point 클래스**

```kotlin
class Point(val x: Int, val y: Int) {   
    operator fun component1() = x  
    operator fun component2() = y  
}
```

- 각 변수를 초기화하기 위해 `componentN`이라는 **convention**에 따라 메서드를 정의한다.

<br>

**컴파일 된 코드**

```kotlin
val x = point.component1() 
val y = point.component2()
```

- `val (x, y) = point` 라는 구조 분해 선언은 위와 같이 변수 위치에 맞는 `componentN` 메서드를 호출하는 코드로 컴파일 된다.