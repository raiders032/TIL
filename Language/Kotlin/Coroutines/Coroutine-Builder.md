# 1 Coroutine Builder

 - 모든 중단 함수는 또 다른 중단 함수에 의해 호출되어야 하기 때문에 시작되는 지점이 반드시 있다
	- 코루틴 빌더가 그 역할을 한다.
	- **코루틴 빌더는 일반 함수와 중단 가능한 세계를 연결시키는 다리**가 된다.
- 코루틴 빌더는 코루틴을 시작하는 주요 방법입니다.
- 예를들어 `launch`, `async` 등이 코루틴 빌더입니다.
- 이들은 각각 다른 방식으로 코루틴을 실행하며, 특정 스코프에서 코루틴을 시작합니다.

<br>

# 2 kotlinx.coroutines 제공 코루틴 빌더

## 2.1 runBlocking

- 코루틴이 스레드를 블로킹하지 않고 작업을 중단시키기만 하는 것이 일반적인 법칙입니다.
	- 하지만 블로킹이 필요한 경우가 있습니다. 
	- 메인 함수의 경우 프로그램을 너무 빨리 끝내지 않기 위해 스레드를 블로킹해야 합니다.
	- 이런 경우 `runBlocking`을 사용하면 됩니다.
- `runBlocking`은 주로 테스트나 메인 함수에서 사용됩니다.
- CoroutineScope의 확장 함수가 아니기 때문에 runBlocking은 자식 코루틴이 될 수 없다.
- runBlocking은 코루틴을 실행하기 위한 자체적인 CoroutineScope를 제공합니다.
	-  이 스코프 내에서 시작되는 모든 코루틴은 `runBlocking`의 스코프에 속하게 됩니다.
- `runBlocking`은 호출된 스레드를 차단하고, 내부 블록(코루틴 스코프 내의 모든 코루틴)이 완료될 때까지 대기합니다. 
	- 이는 `runBlocking`이 주로 테스트 환경이나 메인 함수와 같이 코루틴이 기본적으로 지원되지 않는 환경에서 사용될 때 유용합니다.
- runBlocking은 현재는 거의 사용하지 않는다.
	- 메인 함수는 `runBlocking` 대신 suspend를 붙여 중단 함수로 만든다.

<br>

**예시**

```kotlin
@Test  
fun runBlockingTest() {  
    runBlocking {  
        delay(1000L)  
        println("[${Thread.currentThread().name}] World!")  
    }  
    runBlocking {  
        delay(1000L)  
        println("[${Thread.currentThread().name}] World!")  
    }  
    runBlocking {  
        delay(1000L)  
        println("[${Thread.currentThread().name}] World!")  
    }  
    println("[${Thread.currentThread().name}] Hello, ")  
}
```

```
[Test worker @coroutine#1] World! // (1초 후)
[Test worker @coroutine#2] World! // (1초 후)
[Test worker @coroutine#3] World! // (1초 후)
[Test worker] Hello,
```

<br>

## 2.2 launch

- `launch`는 새로운 코루틴을 시작하고 작업을 비동기적으로 실행합니다.
- 반환 값이 없는 작업에 적합합니다.
- 실행을 완료하는 데 시간이 걸리는 작업을 백그라운드에서 실행할 때 사용됩니다.
- CoroutineScope의 확장 함수입니다.

<br>

**예시**

```kotlin
fun main() = runBlocking {
    launch {
        delay(1000L)
        println("World!")
    }
    println("Hello")
}
```

- `main` 함수는 `runBlocking`을 사용해 코루틴을 시작합니다.
- `launch` 블록 내부는 별도의 코루틴에서 비동기적으로 실행됩니다. 따라서 `launch` 블록 내의 `delay(1000L)` 실행 동안 메인 코루틴은 중단되지 않고 계속 실행됩니다.
- 결과적으로, "Hello"가 먼저 출력되고, `launch` 블록 내의 1초 지연 후 "World!"가 출력됩니다.

<br>

## 2.3 async

- async는 launch와 유사하지만, 결과 값을 반환할 수 있는 Deferred 객체를 반환합니다.
	- Deferred에는 작업이 끝나면 값을 반환하는 중단 메서드인 await가 있습니다.
- 결과 값을 반환하는 비동기 작업에 적합합니다.
- 반환된 Deferred 객체의  await() 함수를 통해 비동기적으로 계산된 결과를 얻을 수 있습니다.
- async 빌더는 호출되자마자 코루틴을 즉시 시작합니다.
- async가 동작하는 방식은 launch와 비슷하지만 값을 반환한다는 추가적인 특징이 있다.
	- launch를 async로 대체해도 코드는 여전히 똑같은 방식으로 동작하지만 권장하지 않는 방식이다.

<br>

**예시**

```kotlin
fun main() = runBlocking {
    val result = async {
        computeSomething()
    }
    // await()를 사용하여 결과를 얻음
    println("The result is ${result.await()}") 
}

suspend fun computeSomething(): Int {
    delay(1000L) // 예: 어떤 계산을 수행
    return 42 // 계산 결과
}
```

- `async` 블록은 새로운 코루틴을 시작하고 `Deferred` 객체를 반환합니다. 이 객체는 나중에 결과를 얻기 위해 사용됩니다.
- `computeSomething()` 함수는 1초 후에 42를 반환합니다.
- `result.await()` 호출로 메인 코루틴은 `computeSomething()`의 결과가 준비될 때까지 일시 중단됩니다.
- 결과가 준비되면, "The result is 42"가 출력됩니다.
- `async`는 결과를 반환하는 비동기 작업에 적합하며, `await()`를 통해 그 결과를 얻을 수 있습니다.

<br>

# 4 코루틴 스코프 함수

- 리포지토리 함수에서 비동기적으로 데이터와 글 목록을 가지고 오는 상황을 생각해보자.
	- 사용자가 볼 수 있는 글만 반환하고 싶다고 가정하자.
- 중단 함수에서 중단 함수를 호출하는 것이 첫 번째 방법이다.
	- 문제는 작업이 동시에 진행되지 않는다는 점이다.
	- 하나의 데이터를 얻는데 1초가 걸리면 총 2초가 걸린다.
	- 두 개의 중단 함수를 동시에 실행하려면 async로 래핑해야 한다.
	- 하지만 async를 사용하려면 스코프가 필요하다.
- GlobalScope를 사용하는 것도 권장 방식이 아니다.
	- GlobalScope에서 async를 사용하면 부모 코루틴과 아무런 관계가 없다.
	- async 코루틴은 취소될 수 없다.
	- 부모로부터 스코프를 상속받지 않는다.
	- 메모리 누수가 발생할 수 있으면 CPU를 낭비할 수 있다.
	- 코루틴을 단위 테스트하는 도구가 작동하지 않아 테스트가 어렵다.
- 스코프를 인자로 넘기는 방식은 권장하지 않는 방식이다.
	- 스코프를 함수로 전달하면 예상하지 못한 부작용이 발생할 수 있다.
	- async에서 예외가 발생하면 모든 스코프가 닫히게 된다.
	- 스코프에 접근하는 함수가 cancel 메서드를 사용해 스코프를 취소하는 등 조작이 가능하다.
- 중단 함수 밖에서 스코프를 만드려면 coroutineScope 함수를 사용할 수 있다.
- coroutineScope은 람다 표현식이 필요로하는 스코프를 만들어주는 중단 함수입니다.

<br>

## 4.1 coroutineScope

- 중단 함수 밖에서 스코프를 만드려면 coroutineScope 함수를 사용할 수 있다.
- coroutineScope은 람다 표현식이 필요로하는 스코프를 만들어주는 중단 함수입니다.
- coroutineScope 함수는 새로운 코루틴을 생성하지만 새로운 코루틴이 끝날 때까지 coroutineScope를 호출한 코루틴을 중단됩니다.