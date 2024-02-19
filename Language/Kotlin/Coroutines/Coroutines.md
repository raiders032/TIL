# 1 Coroutines

- 코루틴은 컴퓨터 프로그램 구성 요소 중 하나로 비선점형 멀티태스킹을 수행하는 일반화한 서브루틴이다.
- **실행을 중단하고 재개할 수 있으며**, 협력적 태스크, 예외 처리, 이벤트 루프, 이터레이터, 무한 리스트 및 파이프와 같은 프로그램 구성 요소의 구현에 적합합니다.
- "**실행을 일시 중지할 수 있는 함수**"로 묘사되기도 합니다.
- 코루틴은 어떤 특정 스레드에도 구속되지 않습니다.
	- 한 스레드에서 실행을 중단하고 다른 스레드에서 다시 재개할 수 있습니다.

<br>

### 1.1 비선점적 멀티태스킹

- **비선점형**: 한 프로세스가 CPU를 할당받으면 종료되기 전까지 다른 프로세스가 CPU를 강제로 차지할 수 없습니다. 코루틴이 이러한 방식을 따릅니다.
- **선점형**: 프로세스가 다른 프로세스를 대신하여 프로세서(CPU)를 강제로 차지할 수 있습니다. 이는 전통적인 스레드 방식입니다.

<br>

### 1.2 동시성과 병렬성

- **동시성(Concurrency)**: 여러 작업이 논리적으로 동시에 수행되는 것처럼 보이는 것.
- **병렬성(Parallelism)**: 여러 작업이 물리적으로 동시에 수행되는 것.
- 코루틴은 동시성을 제공하지만, 병렬성은 제공하지 않습니다.

<br>

# 2 서브루틴과 비교

### 2.1 서브루틴 (Subroutine)

**정의**
- 코드를 재사용 가능한 단위로 분리하는 것. 
- 함수나 프로시저로도 불립니다.

**특징**
- 호출된 위치에서 실행을 시작하고, 작업이 완료되면 제어를 호출 지점으로 반환합니다. 
- 호출 지점을 기억하지 않으며, 전통적인 프로그래밍 언어에서 널리 사용됩니다.

<br>

### 2.2 코루틴 (Coroutine)

**정의**
- 여러 진입점을 가질 수 있는 일반화된 서브루틴.

**특징**
- 실행 중단 지점을 기억하고 해당 지점부터 재개할 수 있습니다. 
- 멀티태스킹과 유사하게 작동하며, 서로 다른 코루틴 간에 실행을 양보할 수 있습니다. 
- 비동기 처리와 병렬 프로그래밍에 유용하며, Continuation Passing Style과 State machine을 이용해 동작합니다. 
- 현대 많은 프로그래밍 언어에서 지원됩니다.

<br>

### 2.3 차이점 요약

- **서브루틴**: 단일 진입점을 가지고, 호출될 때마다 처음부터 시작하여 작업이 완료되면 호출 지점으로 반환합니다.
- **코루틴**: 여러 진입점을 가질 수 있고, 실행을 중간에 중단하고 다시 재개할 수 있으며, 다른 코루틴에 실행을 양보할 수 있습니다.

<br>

# 3 Kotlin

- 코틀린은 특정 코틀린을 언어가 지원하는 형태가 아니다.
- 코루틴을 구현할 수 있는 기본 도구를 언어가 제공하는 형태다.
- 이런 코틀린의 기본 기능을 활용해 만든 다양한 형태의 코루틴들은 `kotlinx.coroutines` 패키지 밑에 있다.
- `kotlinx.coroutines.core` 모듈에는 코루틴을 만들어 주는 빌더가 있다.
- 코틀린에서는 코루틴 빌더에 원하는 동작을 람다로 넘겨 코루틴을 만들어 실행하는 방식으로 코루틴을 활용한다.

<br>

## 3.1 코루틴 빌더

- 모든 중단 함수는 또 다른 중단 함수에 의해 호출되어야 하기 때문에 시작되는 지점이 반드시 있다
	- 코루틴 빌더가 그 역할을 한다.
	- 일반 함수와 중단 가능한 세계를 연결시키는 다리가 된다.
- 코루틴 빌더는 코루틴을 시작하는 주요 방법입니다.
- `launch`, `async` 등이 코루틴 빌더의 예시입니다.
- 이들은 각각 다른 방식으로 코루틴을 실행하며, 특정 스코프에서 코루틴을 시작합니다.
- [[Coroutine-Builder]] 참고

<br>

## 3.2 Scope builder

- 코루틴 스코프 빌더는 코루틴의 실행과 생명주기를 관리하는 강력한 도구입니다.
- 코루틴 스코프는 코루틴이 어떻게 생성되고, 어떤 컨텍스트에서 실행될지 결정합니다.

<br>

### 3.2.1 CoroutineScope

- CoroutineScope는 코루틴이 탄생할 수 있는 영역이다.
- CoroutineScope는 코루틴을 실행할 때 사용되는 주요 인터페이스입니다. 
- 이 스코프는 코루틴의 실행 범위와 생명주기를 관리하며, 여러 코루틴 간의 상호 작용을 조정합니다.
- 모든 코루틴 빌더(launch, async 등)는 CoroutineScope 내에서 호출됩니다.
- CoroutineScope는 coroutineContext라는 속성을 가지며, 이 컨텍스트는 코루틴의 실행 환경을 정의합니다.
- CoroutineScope는 부모-자식 관계를 형성할 수 있으며, 부모 스코프가 취소되면 자식 코루틴도 취소됩니다.


<br>

### 3.2.2 CoroutineContext

- CoroutineContext는 코루틴과 관련된 데이터를 보관하는 곳이다.
- 이는 코루틴의 여러 속성을 결합한 집합으로, 코루틴의 디스패처, 잡, 기타 설정을 포함합니다.
- CoroutineContext는 코루틴이 어떻게 실행될지, 어떤 스레드에서 실행될지, 어떻게 예외를 처리할지 등을 결정합니다.
- CoroutineContext는 여러 요소를 합성하여 사용자 정의 컨텍스트를 만들 수 있습니다.
- Dispatchers, Job, CoroutineExceptionHandler 등은 CoroutineContext의 중요한 요소입니다.
- [[Coroutine-Context]] 참고

<br>

### 3.2.3 CoroutineDispatcher

- CoroutineDispatcher는 코루틴이 실행될 스레드를 결정하는 요소입니다. 코루틴의 동시성 관리와 실행 성능에 중요한 역할을 합니다.

<br>

**주요 특징**

- **CoroutineDispatcher**는 코루틴이 어떤 스레드 또는 스레드 풀에서 실행될지를 결정합니다.
- 코틀린은 다양한 종류의 디스패처를 제공하며, 각각 다른 사용 사례에 적합합니다.
- 주요 디스패처 유형에는 `Dispatchers.Main`, `Dispatchers.IO`, `Dispatchers.Default` 등이 있습니다.

<br>

**디스패처의 종류**

- **Dispatchers.Main**: 주로 UI 작업에 사용되며, 안드로이드의 메인 스레드에서 실행됩니다.
- **Dispatchers.IO**: I/O 작업(네트워크 요청, 파일 읽기/쓰기 등)에 최적화된 디스패처입니다.
- **Dispatchers.Default**: CPU 집약적 작업에 사용되며, 기본적으로 공유된 백그라운드 스레드 풀에서 실행됩니다.
- **newSingleThreadContext** 또는 **newFixedThreadPoolContext**: 사용자가 정의한 스레드 풀에서 코루틴을 실행할 수 있습니다.

<br>

## 3.3 중단 함수(Suspending Function)

- 중단 함수는 코루틴 내에서 실행을 일시 중단할 수 있고, 나중에 다시 재개할 수 있는 특수한 함수입니다.
- 이 함수들은 `suspend` 키워드를 사용하여 정의됩니다.
- 중단 함수는 무거운 계산 작업이나 긴 I/O 작업을 비동기적으로 처리하는 데 사용될 수 있습니다.
- 예를 들어, `delay()`, `await()` 등이 중단 함수입니다.
- 중단 함수는 컨티뉴에이션 객체를 다른 중단 함수로 전달해야 합니다.
	- 따라서 중단 함수가 일반 함수를 호출하는 것은 가능하지만 일반 함수가 중단 함수를 호출하는 것은 불가능합니다.

<br>

### 3.3.1 중단 함수와 스코프

- 중단 함수에선 스코프를 어떻

# 4 구조화된 동시성 (Structured Concurrency)

- 구조화된 동시성(Structured Concurrency)은 코루틴을 관리하는 중요한 개념으로, 코루틴 간의 부모-자식 관계를 통해 코루틴의 수명 주기를 명확하게 관리합니다. 
- 이 개념에 따르면, 모든 코루틴은 특정한 CoroutineScope 내에서 생성되며, 부모 스코프가 취소되면 그 스코프에 속한 모든 자식 코루틴들도 취소됩니다.
- 이러한 구조화된 동시성의 원칙은 코루틴을 사용하는 프로그램의 안정성과 관리 용이성을 크게 향상시킵니다.

<br>

## 4.1 부모-자식 관계

- 자식은 부모로부터 컨텍스트를 상속받습니다.
- 부모는 모든 자식이 작업을 마칠 때까지 기다립니다.
- 부모 코루틴이 취소되면 자식 코루틴도 취소됩니다.
- 자식 코루틴에서 에러가 발생하면 부모 코로틴 또한 에러로 소멸합니다.

<br>

# 5 Continuation Passing Style

코틀린에서 `suspend` 함수의 컴파일 과정을 이해하려면, Continuation Passing Style (CPS)과 상태 머신(State Machine)의 개념을 함께 고려해야 합니다. 이들은 코루틴의 실행과 중단, 그리고 재개 과정을 관리하는 데 중심 역할을 합니다.

<br>

## 5.1 Continuation Passing Style의 개념

CPS는 함수가 자신의 실행 결과를 직접 반환하지 않고, 대신 'Continuation'이라 불리는 콜백 함수를 통해 결과를 전달하는 프로그래밍 스타일입니다. 이 접근 방식을 통해 함수는 실행을 중단한 후 필요한 시점에 다시 시작할 수 있습니다. 이는 코루틴의 비동기 실행 패턴에 핵심적인 역할을 합니다.


**Continuation**

- Continuation 객체는 코루틴의 "중단점"을 기억합니다. 
	- 여기서 중단점이란 코루틴이 일시 중지되었다가 나중에 다시 시작할 수 있는 지점을 의미합니다. 
	- 이 객체는 코루틴이 어디에서 중단되었는지(상태를 나타내는 숫자), 그리고 중단된 시점에서의 변수나 데이터(로컬 데이터)를 저장합니다.
- 한 함수의 Continuation 객체는 해당 함수를 호출하는 다른 함수의 Continuation 객체에 "장식(decorate)"됩니다.
	- 이것은 마치 러시안 인형처럼 하나의 Continuation 객체 안에 다른 Continuation 객체가 포함되는 구조를 만듭니다. 
	- 이렇게 함으로써, 각각의 함수 호출과 중단점이 서로 연결되어 콜 스택과 같은 역할을 합니다.

<br>

## 5.2 상태 머신(State Machine)의 적용

상태 머신은 코루틴의 실행 과정을 다양한 상태(예: 시작, 중단, 재개, 완료 등)로 나누어 관리합니다. 코루틴이 실행되면서 이러한 상태들을 순차적으로 거치게 됩니다. 상태 머신은 이 과정을 체계적으로 추적하고 조정하여, 코루틴의 생명주기를 효율적으로 관리합니다.

<br>

## 5.3 suspend 함수 컴파일 과정

코틀린에서 `suspend` 함수는 CPS와 상태 머신을 이용해 컴파일됩니다. 컴파일러는 `suspend` 함수를 다음과 같이 변환합니다:

1. **Continuation 인자 추가**: 함수는 Continuation 객체를 인자로 받게 됩니다. 이 객체는 함수의 현재 상태(예: 중단 위치, 지역 변수 등)를 저장하는 데 사용됩니다.
2. **상태 머신 생성**: 컴파일러는 함수 내의 각 중단점을 상태로 변환하고, 이 상태들을 관리하는 상태 머신을 생성합니다. 각 상태는 함수의 실행 중 특정 지점을 나타냅니다.
3. **실행 및 중단 관리**: 함수가 호출될 때, 상태 머신은 현재 상태를 확인하고, 해당 상태에 따라 함수를 실행하거나 중단합니다. 함수가 중단되면, 현재 상태는 Continuation에 저장되고, 함수는 나중에 이 상태에서 재개될 수 있습니다.

<br>

**suspend 함수 정의**

```kotlin
class UserService(  
    val profileRepository: ProfileRepository,  
    val imageRepository: ImageRepository  
) {  
    suspend fun findUser(userId: String): User {  
        val profile = profileRepository.findByUserId(userId)  
        val image = imageRepository.findByProfile(profile)  
        return User(profile, image)  
    }  
}  
  
class ProfileRepository {  
    suspend fun findByUserId(userId: String): Profile {
	    delay(1000L)  
        return Profile(userId)  
    }  
}  
  
class ImageRepository {  
    suspend fun findByProfile(profile: Profile): Image { 
		delay(1000L)
        return Image()  
    }  
}  
  
class User(val profile: Profile, val image: Image)  
class Profile(userId: String)  
class Image(userId: String)
```

<br>

**컴파일 후**

```kotlin
package com.example.study  
  
import kotlinx.coroutines.delay  
  
interface Continuation {  
    suspend fun resumeWith(value: Any?)  
}  
  
private abstract class FindUserContinuation : Continuation {  
    var label = 0  
    var profile: Profile? = null  
    var image: Image? = null  
}  
  
class UserService(  
    val profileRepository: ProfileRepository,  
    val imageRepository: ImageRepository  
) {  
    suspend fun findUser(userId: String, continuation: Continuation?): User {  
        val stateMachine = continuation as? FindUserContinuation ?: object : FindUserContinuation() {  
            override suspend fun resumeWith(value: Any?) {  
                when (label) {  
                    0 -> {  
                        profile = value as Profile  
                        label = 1  
                    }  
  
                    1 -> {  
                        image = value as Image  
                        label = 2  
                    }  
                }  
                findUser(userId, this)  
            }  
        }  
  
        when (stateMachine.label) {  
            0 -> {  
                profileRepository.findByUserId(userId, stateMachine)  
            }  
  
            1 -> {  
                imageRepository.findByUserId(stateMachine.profile!!, stateMachine)  
            }  
  
            return User(stateMachine.profile!!, stateMachine.image!!)  
        }  
    }  
}  
  
class ProfileRepository {  
    suspend fun findByUserId(userId: String, continuation: Continuation) {  
        delay(1000L)  
        continuation.resumeWith(Profile(userId))  
    }  
}  
  
class ImageRepository {  
    suspend fun findByUserId(profile: Profile, continuation: Continuation) {  
        delay(1000L)  
        continuation.resumeWith(Image())  
    }  
}  
  
class User(val profile: Profile, val image: Image)  
class Profile(userId: String)  
class Image()
```

- Continuation 인자의 추가: 컴파일 후 findUser 함수는 Continuation 객체를 추가적인 인자로 받습니다. 이 객체는 함수가 중단될 때의 상태(예: 현재 지점, 로컬 변수 등)를 기억하는 데 사용됩니다.
- 상태 머신의 구현: FindUserContinuation 클래스는 상태 머신을 구현합니다. label 변수는 현재 함수의 실행 상태를 나타내며, 각 상태(0, 1, 2 등)는 findUser 함수 내의 특정 지점을 의미합니다.
- 상태에 따른 실행 분기: when 문을 사용하여 현재 label 값에 따라 다른 코드 블록을 실행합니다. 이는 함수가 중단되었던 지점부터 실행을 재개할 수 있게 해줍니다.
- 중단과 재개: ProfileRepository와 ImageRepository의 findByUserId, findByProfile 함수는 비동기 작업을 수행한 후 Continuation의 resumeWith 메소드를 호출하여 결과를 반환합니다. 이 호출은 UserService의 findUser 함수로 제어를 다시 넘겨주며, 이 함수는 중단된 지점부터 다시 실행을 시작합니다.
- 이러한 방식으로 코틀린의 suspend 함수는 CPS를 통해 비동기 코드를 동기적으로 작성할 수 있게 하며, 상태 머신을 이용해 함수의 중단 및 재개를 용이하게 합니다. 이는 비동기 프로그래밍을 더 단순하고 효율적으로 만들어 줍니다.

<br>

참고

- https://dev.gmarket.com/82#:~:text=%EC%BD%94%EB%A3%A8%ED%8B%B4%EC%9D%80%20Co(%ED%95%A8%EA%BB%98,%EC%9D%98%20%EC%88%9C%EC%84%9C%EB%A5%BC%20%EB%9C%BB%ED%95%A9%EB%8B%88%EB%8B%A4.