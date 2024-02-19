# 1 CoroutineContext

- `CoroutineContext`는 코루틴의 설정과 수명주기를 관리하는 역할을 합니다.
- 이것은 코루틴의 여러 속성을 결합하여 작업 환경을 정의합니다.

<br>

**예시**

```kotlin
val context = Dispatchers.Default + CoroutineName("example")
val job = Job()
val scope = CoroutineScope(job + context)
```

- 이 코드는 기본 디스패처와 코루틴 이름을 설정한 컨텍스트를 생성하고, 이를 사용해 코루틴 스코프를 초기화합니다.

<br>

# 2 CoroutineContext 인터페이스

- `CoroutineContext` 인터페이스는 코루틴의 작업 환경을 정의하는 여러 요소(예: `Job`, `CoroutineDispatcher`)를 포함할 수 있습니다.
- 이러한 요소들은 서로 조합될 수 있으며, `plus` 연산자를 통해 추가적인 요소를 결합할 수 있습니다.

<br>

**예시**

```kotlin
val context = Dispatchers.IO + CoroutineName("IOCoroutine") + Job()
```

- 이 예제는 IO 디스패처, 코루틴 이름, 그리고 새로운 `Job`을 결합하여 새로운 컨텍스트를 생성합니다.

<br>

# 3 CoroutineContext에서 원소 찾기

- `CoroutineContext`에서 특정 요소를 찾을 때는 `get` 함수 또는 대괄호 표기법을 사용합니다.
- 원소가 없으면 `null`이 반환됩니다.

<br>

**예시**

```kotlin
val context = Dispatchers.Default + CoroutineName("example")

// val name = context[CoroutineName.Key]와 동일
val name = context[CoroutineName] 
```

- 여기서 `CoroutineName` 요소를 컨텍스트에서 추출합니다.
- `CoroutineName`은 타입이나 클래스가 아닌 캠패니언 객체입니다.
	- 클래스의 이름이 컴패니언 객체에 대한 참조로 사용되는 코틀린 언어 특징 때문에 `[CoroutineName]`은 `[CoroutineName.key]`가 됩니다. 

<br>

# 4 컨텍스트 더하기

- 코루틴 컨텍스트 요소는 `+` 연산자를 사용하여 결합할 수 있습니다.
- 이를 통해 여러 설정을 하나의 컨텍스트에 포함시킬 수 있습니다.
- 다른 키를 가진 두 원소를 더하여 만들어진 컨텍스트는 두 가지 키를 모두 가집니다.
- 같은 키를 가진 또 다른 원소가 더해지면 맵처럼 새로운 원소가 기존 원소를 대체합니다.

<br>

**예시**

```kotlin
val combinedContext = Dispatchers.Default + CoroutineName("combinedContext")
```

- 이 코드는 디스패처와 코루틴 이름을 결합하여 새로운 컨텍스트를 생성합니다.


# 5 비어 있는 코루틴 컨텍스트

- 컨텍스트는 컬렉션이므로 빈 컨텍스트 또한 만들 수 있습니다.
- `EmptyCoroutineContext`는 요소가 없는 초기 상태의 컨텍스트를 나타냅니다. 이는 코루틴이 기본 설정을 사용할 때 종종 참조됩니다.

<br>

**예시**

```kotlin
@Test  
fun testEmptyCoroutineContext() {  
    val context: CoroutineContext = EmptyCoroutineContext  
    println(context[CoroutineName])  
    println(context[Job])  
}
```

```
null
null
```

<br>

# 6 원소 제거

- 코루틴 컨텍스트에서 특정 요소를 제거하려면 `minusKey` 함수를 사용합니다.

<br>

**예시**

```kotlin
@Test  
fun removeCoroutineContext() {  
    val context = Dispatchers.Default + CoroutineName("example")  
    println(context)  
    val withoutDispatcher = context.minusKey(ContinuationInterceptor.Key)  
    println(withoutDispatcher)  
}
```

```
[CoroutineName(example), Dispatchers.Default]
CoroutineName(example)

```

- 이 코드는 컨텍스트에서 `Dispatcher` 요소를 제거합니다.

<br>

# 7 컨텍스트 폴딩

- `fold` 함수를 사용하여 컨텍스트의 모든 요소에 대해 연산을 수행할 수 있습니다. 
- 이는 컨텍스트의 모든 요소를 순회하며 각 요소에 대한 처리를 할 때 유용합니다.

<br>

**예시**

```kotlin
val context = Dispatchers.Default + CoroutineName("example") context.fold(0) { acc, element -> acc + 1 }
```

- 이 코드는 컨텍스트 내의 요소 개수를 계산합니다.

<br>

# 8 코루틴 컨텍스트와 빌더

- CoroutineContext는 코루틴 데이터를 저장하고 전달하는 방법입니다.
- 부모-자식 관계의 영향 중 하나로 부모는 기본적으로 컨텍스트를 자식에게 전달합니다.
	- 자식은 부모로부터 컨텍스트를 상속받는다고 할 수 있습니다.
- 모든 자식은 빌더의 인자에서 정의된 특정 컨텍스트를 가질 수 있다.
	- 인자로 전달받은 컨텍스트는 부모로부터 상속받은 컨텍스트를 대체한다.
- 새로운 원소가 같은 키를 가진 이전 원소를 대체하므로 자식 컨텍스트는 부모로부터 상속받은 컨텍스트 중 같은 키를 가진 원소를 대체한다.

<br>

# 9 중단함수에서 컨텍스트 접근하기

- 컨텍스트는 중단 함수 사이에 전달되는 컨티뉴에이션 객체가 참조하고 있습니다.
- 따라서 중단 함수에서
- 중단 함수(suspending function) 내에서 현재 코루틴의 컨텍스트에 접근할 수 있습니다. 
- `coroutineContext` 키워드를 사용하여 이를 참조할 수 있습니다.

<br>

**예시**

```kotlin
suspend fun exampleFunction() {     
	val context = coroutineContext     
	// 컨텍스트 사용 
}
```

- 이 함수는 실행 중인 코루틴의 컨텍스트를 참조합니다.

<br>

# 10 컨텍스트를 개별적으로 생성하기

- 개별적인 코루틴 컨텍스트 요소를 생성하여, 필요에 따라 코루틴의 동작을 세부적으로 제어할 수 있습니다.

<br>

**예시**

```kotlin
val customDispatcher = Executors.newSingleThreadExecutor().asCoroutineDispatcher() 
val context = customDispatcher + CoroutineName("custom")
```

- 이 예시에서는 사용자 정의 디스패처와 코루틴 이름을 조합하여 새로운 컨텍스트를 생성합니다.