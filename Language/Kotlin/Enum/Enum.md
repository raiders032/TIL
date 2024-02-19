# 1 Enum

- 코틀린에서 enum은 소프트 키워드다.
	- class 앞에서만 특별한 의미를 지니지만 다른 곳에서는 이름에 사용할 수 있다.
	- 반면 class는 키워드라서 이름으로 class를 사용할 수 없어 clazz나 aClass와 같은 이름을 사용한다.

<br>

**enum 선언**

```kotlin
enum class Color {
    RED, ORANGE, YELLOW, GREEN, BLUE, INDIGO, VIOLET
}
```

<br>

# 2 프로퍼티와 메서드

- 자바와 마찬가지로 enum은 단순히 값만 열거하는 존재가 아니다.
- 코틀린에서 `;`이 필수인 부분
	- enum에서 메서드를 정의할 경우 상수 목록과 메서드 정의 사이에 반드시 `;`을 넣어야 한다.

<br>

```kotlin
enum class Color(val r: Int, val g: Int, val b: Int) {
    RED(255, 0, 0),
    ORANGE(255, 165, 0),
    YELLOW(255, 255, 0),
    GREEN(0, 255, 0),
    BLUE(0, 0, 255),
    INDIGO(75, 0, 130),
    VIOLET(238, 130, 238);
    
    fun rgb() = (r * 256 + g) * 256 + b
}
```

