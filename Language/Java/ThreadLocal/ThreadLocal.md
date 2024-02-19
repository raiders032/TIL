# 1 ThreadLocal

* 쓰레드 로컬은 해당 쓰레드만 접근할 수 있는 특별한 저장소를 말한다
* `java.lang.ThreadLocal`

<br>

# 2 Method

| Modifier and Type           | Method                                        | Description                                                  |
| :-------------------------- | :-------------------------------------------- | :----------------------------------------------------------- |
| `T`                         | `get()`                                       | Returns the value in the current thread's copy of this thread-local variable. |
| `protected T`               | `initialValue()`                              | Returns the current thread's "initial value" for this thread-local variable. |
| `void`                      | `remove()`                                    | Removes the current thread's value for this thread-local variable. |
| `void`                      | `set(T value)`                                | Sets the current thread's copy of this thread-local variable to the specified value. |
| `static <S> ThreadLocal<S>` | `withInitial(Supplier<? extends S> supplier)` | Creates a thread local variable.                             |

<br>

# 3 사용하기

* ThreadLocal은 특정 쓰레드만 접근 가능한 저장소의 역할을 한다
* ThreadLocal은 thread를 key로 하는 맵에 데이터를 저장한다고 유추해볼 수 있다.



**예시**

```java
// ThreadLocal 인스턴스 생성
ThreadLocal<Integer> threadLocalValue = new ThreadLocal<>();

// ThreadLocal에 값 1 저장
threadLocalValue.set(1);

// ThreadLocal에 저장된 값 불러오기
Integer result = threadLocalValue.get();

// ThreadLocal에 저장된 값 지우기
threadLocalValue.remove();
```

<br>

# 4 주의사항

* ThreadLocal과 ThreadPool를 동시에 사용할 때 주의해야한다.
* ThreadLocal의 값을 사용 후 remove()를 통해 값을 제거해야한다.
* 제거하지 않고 그냥 두면 WAS(톰캣)처럼 쓰레드 풀을 사용하는 경우에 심각한 문제가 발생할 수 있다.

<br>

**문제점**

1. 애플리케이션이 쓰레드 풀에서 쓰레드를 빌린다
2. 현재 쓰레드의 쓰레드로컬에 값을 저장한다
3. 요청을 처리하고 빌렸던 쓰레드를 쓰레드 풀에 반환한다
4. 시간이 지나고 애플리케이션이 요청을 처리하기 위해 이전에 빌렸던 쓰레드를 다시 빌린다
5. 이전에 쓰레드를 빌리고 쓰레드로컬을 비우는 작업을 하지 않았기 때문에 새로운 요청에 대해서 이전에 저장된 데이터를 다시 사용하는 문제가 발생할 수 있다

<br>

참고

* https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/ThreadLocal.html
* https://www.baeldung.com/java-threadlocal