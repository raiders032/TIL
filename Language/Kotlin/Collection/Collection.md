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


