# 1 Class



## 1.1 클래스 정의

```kotlin
class Person(val name:String)
```



**동일한 Java**

```java
public class Person{
	private final String name;
  
  public Person(String name) {
    this.name = name;
  }
  
  public String getName() {
    return name;
  }
}
```



## 1.2 프로퍼티

- 자바에서는 필드와 접근자를 한데 묶어 프로퍼티라고 한다.
- 코틀린은 프로퍼티를 언어 기본 기능으로 제공한다.
- 코틀린의 프로퍼티는 자바의 필드와 접근자 메서드를 완전히 대신한다
- val로 선언한 프로퍼티는 읽기 전용이다.
  - 비공개 필드와 public getter를 만들어낸다.
- var로 선언한 프로퍼티는 읽기/쓰기가 가능하다.
  - 비공개 필드와 public setter와 getter를 만들어 낸다.



## 1.3 커스텀 접근자

- 직사각형 클래스인 Rectangle을 정의하면서 자신이 정사각형인지 알려주는 기능을 만들어보자.



```kotlin
class Rectangle(val height:Int, val width:Int) {
  val isSquare: Boolean
  	get () {
      return height == width
    }
}
```

- 정사각형인지를 별도의 필드에 저장할 필요가 없다.
- isSquare 프로퍼티에는 자체 값을 저장하는 필드가 필요없다.
- 이 프로퍼티에는 자체 구현을 제공하는 getter만 존재한다.
- 클라이언트가 프로퍼티에 접근할 때마다 getter가 프로퍼티 값을 매번 계산한다.



# 2 자바 클래스와 차이점

- 코틀린의 클래스는 기본적으로 `final`, `pulic`이다.
- 중첩 클래스는 기본적으로 내부 클래스가 아니다.
  - 외부 클래스에 대한 참조가 없다.



# 3 abstract class

- abstract로 선언한 클래스는 인스턴스화할 수 없다.
- 추상 멤버는 항상 열려있어 추상 멤버 앞에 `open` 변경자를 명시할 필요가 없다.



**예시**

- 추상 클래스에는 abstract 변경자를 붙인다.
- 추상 메서드에도 abstract 변경자를 붙인다.
- 메서드에 abstract 변경자를 붙이지 않으면 추상 메서드가 아니다.

```kotlin
abstract class Animated {
	// 추상 메서드
  abstract fun animate()
  
  // 비추상 메서드도 기본적으로 final이기 때문에 원한다면 open을 명시해야 함
  open fun stopAnimating() {}
  
  // 비추상 메서드 기본적으로 final
  fun animateTwice() {}
}
```



# 4 nested class

- 자바의 nested class는 기본적으로 Inner Class로 선언된다.
  - 자바의 Inner Class는 `static` 키워드 없이 선언된 중첩 클래스를 의미한다.
  - Inner Class 클래스는 암묵적으로 바깥 클래스에 대한 참조를 가진다.
  - 자바에서 암묵적인 바깥 클래스에 대한 참조를 없애려면 `static` 키워드를 사용해야 한다.
- 코틀린에서는 nested class는 기본적으로 바깥 클래스에 대한 참조가 없다.
  - 즉 자바의 Static Nested Class와 같다.
  - 자바의 Inner Class처럼 바깥 클래스에 대한 참조 포함하고 싶다면 `inner` 변경자를 붙여야 한다.
- 코틀린에서는 바깥 클래스의 인스턴스를 가리키는 참조를 표기하는 법이 자바와 다르다.
  - 바깥쪽 클래스의 인스턴스에 접근하려면 `this@Outer`라고 써야 한다.



# 5 생성자와 초기화 블록

- 코틀린에서는 주 생성자와 부 생성자를 구분한다.
- constructor 키워드는 주 생성자나 부 생성자를 정의할 때 사용한다.



## 5.1 **Primary Constructor**

- 클래스를 초기화할 때 주로 사용하는 생성자로 클래스 본문 밖에 정의한다.
- 주 생성자는 생상자 파라미터를 지정하고 그 생성자 파라미터에 의해 초기화되는 프로퍼티를 정의하는 두 가지 목적에 쓰인다.



**초기화 블록**

- init 키워드는 초기화 블록을 시작한다.
- 초기화 블록에는 클래스의 객체가 만들어질 때 실행될 초기화 코드가 들어간다.
- 초기화 블록은 주로 주 생성자와 함께 사용된다.
- 주 생성자는 제한적이기 때문에 별도의 코드를 포함할 수 없어 초기화 블록이 필요하다.



**예시**

```kotlin
class User constructor(_nickname: String) {
    val nickname: String

    init {
        nickname = _nickname
    }
}
```



**간략한 버전**

- 프로퍼티를 초기화하는 식이나 초기화 블록 안에서 주 생성자의 파라미터를 참조할 수 있다.

```kotlin
class User(_nickname: String) {
    val nickname: String = _nickname
}
```



**더 간결한 버전**

- 주 생성자의 파라미터로 프로퍼티를 초기화한다면 그 주 생성자 파라미터 이름 앞에 val을 추가하는 방식으로 프로퍼티 정의화 초기화를 간략히 아래와 같이 쓸 수 있다.

```kotlin
class User(val nickname: String)
```



## 5.2 **Secondary Constructor**

- 클래스 본문 안에 정의한다.



# 6 data class

- 어떤 클래스가 데이터를 저장하는 역할만 수행한다면 toString, equals, hashcode를 반드시 오버라이드해야 한다.
- 코틀린에서는 data 라는 변경자를 클래스 앞에 붙이면 필요한 메서드를 컴파일러가 자동으로 만들어준다.
- data 변경자가 붙은 클래스를 데이터 클래스라고 부른다.



**예시**

- equals와 hashcode는 주 생성자에 나열된 모든 프로퍼티를 고려해 만들어진다.
- 주 생성자 밖에 정의된 프로퍼티는 고려 대상이 아니다!

```kotlin
data class Client(val name: String, val postalCode: Int)
```



## 6.1 data 클래스와 불변성

- data 클래스의 프로퍼티가 꼭 val일 필요는 없다.
- 하지만 data 클래스의 모든 프로퍼티를 읽기 전용으로 만들어서 data 클래스를 불변 클래스로 만들길 권장한다.
- HashMap 컨테이너에 data 클래스를 담는 경우 불변성이 필수다.
  - 키로 쓰인 data 클래스의 프로퍼티를 변경하면 컨테이너 상태가 잘못될수 있기 때문
- data 클래스를 불변 객체로 더 쉽게 사용할 수 있게 코틀린 컴파일러는 copy라는 메서드를 제공한다.
  - 복사본은 원본과 다른 생명주기를 가지며 복사하면서 일부 프로퍼티 값을 바꿀 수 있다.
  - 복사복을 제거해도 원본에 전혀 영향을 미치지 않는다.



# 7 by

- 상속에 의해서 두 객체가 강력하게 결합하는 것을 막는 방법으로 데코레이터 패턴을 사용할 수 있다.
  - [상속보다는 컴포지션을 사용하라](../../Java/Effective-Java/Chapter4/Item18/Item18.md) 참고
- 데코레이터 패턴의 단점은 준비 코드가 상당히 많이 필요하다는 점이다.
- 코틀린은 이러한 준비 코드를 컴파일러가 만들어 준다.
  - 데코레이터가 기존 클래스 객체의 포워딩하는 메서드를 자동으로 만들어준다.



**예시**

- 새로운 기능 없이 기존 클래스의 기능을 그대로 쓰는 경우

```kotlin
class DelegatingCollection<T> (
	innnerList: Collection<T> = ArrayList<T>()
) Collection<T> by innnerList {}
```

- add와 addAll 메서드에 대해서 새로운 기능을 정의한 경우

```kotlin
class CountingSet<T>(
        val innerSet: MutableCollection<T> = HashSet<T>()
) : MutableCollection<T> by innerSet {

    var objectsAdded = 0

    override fun add(element: T): Boolean {
        objectsAdded++
        return innerSet.add(element)
    }

    override fun addAll(c: Collection<T>): Boolean {
        objectsAdded += c.size
        return innerSet.addAll(c)
    }
}
```



> 데코레이터 패턴
>
> - 클래스에 새로운 동작을 추가해야할 때 데코레이터 패턴을 사용한다.
> - 데코레이터 패턴을 사용해 기존 클래스와 같은 인터페이스를 가지는 데코레이터를 만든다.
> - 데코레이터 내부에 기존 클래스에 대한 참조를 가지고 있다.
>   - 컴포지션
> - 새로운 기능은 데코레이터의 메서드에 새로 정의한다.
>   - 기존 클래스의 메서드나 필드를 활용할 수 있다.
> - 기존 기능이 필요한 경우 데코레이터 메서드에서 기존 클래스의 메서드에게 요청을 전달한다.(포워딩)



# 8 object



## 8.1 싱글턴 만들기

- 코틀린은 `객체 선언` 기능을 통해 싱글턴을 언어에서 기본 지원한다.



> 객체 선언
>
> - 객체 선언은 `object` 키워드로 시작한다.
> - 객체 선언은 클래스를 정의하고 그 클래스의 인스턴스를 만들어서 변수에 저장하는 모든 작업을 단 한 문장으로 처리한다.
> - 주 생성자는 객체 선언에 쓸 수 없다.
>   - 일반 클래스 인스턴스와 달리 싱글턴 객체는 객체  선언문이 있는 위치에서 생성자 호출 없이 즉시 만들어진다. 



**예시**

- 객체 선언도 클래스와 인터페이스를 상속할 수 있다.
- 특정 인터페이스를 구현해야 하는데 상태가 필요하지 않은 경우 object 키워드가 유용하다.

```kotlin
import java.util.Comparator
import java.io.File

object CaseInsensitiveFileComparator : Comparator<File> {
  override fun compare(file1: File, file2: File): Int {
      return file1.path.compareTo(file2.path, ignoreCase = true)
  }
}

fun main(args: Array<String>) {
  println(CaseInsensitiveFileComparator.compare(File("/User"), File("/user")))
  val files = listOf(File("/Z"), File("/a"))
  println(files.sortedWith(CaseInsensitiveFileComparator))
}
```



## 8.2 companion object

- 클래스 안에 정의된 `object` 중 하나에 `companion`이라는 키워드를 붙이면 그 클래스의 동반 객체로 만들 수 있다.
  - 동반 객체는 클래스 안에 정의된 일반 객체다.
- 동반 객체의 프로퍼티나 메서드에 접근하려면 동반 객체가 정의된 클래스 이름을 사용한다.
- 동반 객체는 자신을 둘러싼 클래스의 모든 private 멤버에 접근할 수 있다.
  - 따라서 동반 객체는 팩토리 메서드를 구현하기 가장 적합한 위치다.



**예시**

```kotlin
class A {
    companion object {
        fun bar() {
            println("Companion object called")
        }
    }
}

fun main(args: Array<String>) {
    A.bar()
}
```



**예시**

- 생성자의 접근 지시자가 private이므로 팩터리 메서드를 통해서만 인스턴스를 만들 수 있다.
- 클래스 이름을 사용해 동반 객체의 메서드를 호출할 수 있다.

```kotlin
fun getFacebookName(accountId: Int) = "fb:$accountId"

class User private constructor(val nickname: String) {
    companion object {
        fun newSubscribingUser(email: String) =
            User(email.substringBefore('@'))

        fun newFacebookUser(accountId: Int) =
            User(getFacebookName(accountId))
    }
}

fun main(args: Array<String>) {
    val subscribingUser = User.newSubscribingUser("bob@gmail.com")
    val facebookUser = User.newFacebookUser(4)
    println(subscribingUser.nickname)
}
```

