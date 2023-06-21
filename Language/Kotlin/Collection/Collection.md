# 1 코틀린에서 컬렉션 만들기

- 아래와 같이 컬럭션을 만들 수 있다.
- 객체의 클래스를 출력해보면 기존 자바 컬렉션을 활용한다는 것을 알 수 있다.
- 코틀린이 자체 컬렉션을 제공하지 않는 이유는 표준 자바 컬렉션을 활용하면 자바 코드와 상호작용하기가 훨씬 더 쉽기 때문이다.
  - 자바에서 코틀린 함수를 호출하거나 그 반대 상황에서 서로의 컬렉션을 변환할 필요가 없다.

```kotlin
val set = hashSetOf(1, 7, 53)
val list = arrayListOf(1, 7, 53)
val map = hashMapOf(1 to "one", 7 to "seven", 53 to "fifty-three")

println(set.javaClass)
println(list.javaClass)
println(map.javaClass)
```

```
class java.util.HashSet
class java.util.ArrayList
class java.util.HashMap
```

- 아래와 같이 코틀린 컬렉션은 자바 컬렉션과 똑같은 클래스지만 더 많은 기능을 사용할 수 있다.

```kotlin
println(list.last())
println(set.max())
```



# 2 읽기 전용과 변경 가능한 컬렉션

- 코틀린의 컬렉션은 데이터를 접근하는 인터페이스와 컬렉션 안의 데이터를 변경하는 인터페이스를 분리했다.
- 코틀린은 가장 기초적인 `kotlin.colletions.Collection` 인터페이스를 제공해 이터레이션, 컬렉션의 크기, 원소 검사 및 조회 기능을 제공한다.
  - 원소를 제거하거나 추가하는 메서드는 제공하지 않는다.
- 컬렉션 데이터 수정이 필요한 경우 `kotlin.colletions.MutableCollection`을 사용한다.
  - MutableCollection은 위 Collection을 확장해 데이터 추가와 삭제 등의 메서드를 추가로 제공한다.



## 2.1 주의점

`kotlin.colletions.Collection`

- **읽기 전용 컬렉션이 항상 Thread Safe하지는 않다.**
- 같은 컬렉션 객체를 각각 읽기 전용 타입과 변경 가능 타입으로 참조하는 경우 변경 가능 타입 쪽에서 컬렉션의 내용을 변경하는 도중 읽기 전용 타입에서 참조한다면 ConcurrentModificationException 등의 예외가 발생할 수 있다.



`kotlin.colletions.MutableCollection`

- 어떤 함수가 인자로 kotlin.colletions.MutableCollection를 받는다면 그 함수가 컬렉션의 데이터를 바꿀 수 있다는 것을 의미한다. 원본의 변경을 막고자한다면 컬렉션의 복사복을 넘겨주는 방어적 복사가 필요하다.



> 팁
>
> 항상 읽기 전용인 `kotlin.colletions.Collection`을 사용하고 컬렉션 데이터 수정이 필요한 경우에만 `kotlin.colletions.MutableCollection`을 사용하자.
