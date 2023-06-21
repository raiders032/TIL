# 1 Exception

- 자바의 예외와 비교하면서 코틀린의 예외를 학습해보자. 



## 1.1 Java의 Exception

- 자바의 예외는 두 가지 종류가 있다. 
  - 하나는 **Checked Exception**이고 다른 하나는 **Unchecked Exception**이다
- 두 가지 종류를 나누는 기본 규칙은 **호출하는 쪽에서 복구하리라 여겨지는 상황이리면 Checked Exception을 사용하는 것**



## 1.2 Checked Exception

- `Exception` 클래스를 상속 받은 예외를 Checked Exception이라고 한다.
- Checked Exception이란 컴파일러가 예외 처리를 제대로 하는지 확인 해주는 예외이다.
- 메서드에서 Checked Exception 발생하는 경우 throws 키워드로 명시해야 하기 때문에 메서드가 어떤 예외를 던지는지 명확히 알 수 있다.
- 자바 소스를 컴파일하는 과정에서 Checked Exception이 발생하는 코드에서 아래와 같은 조치중 하나를 하지않는다면 컴파일 오류가 발생한다.
  * 발생한 예외를 그 메서드 안에서 처리(`catch` 블록)
  * 처리를 안 할 경우 그 사실을 메서드 시그니쳐 옆에 표기(`throws`)
    * 그러면 이 메서드의 호출자가 다시 이 둘 중에 하나를 해야한다.



> **Unchecked Exception**
>
> * **RuntimeException** 클래스를 상속한 예외는 모두 **Unchecked Exception**이다
> * Unchecked Exception은 컴파일하는 과정에서 예외 처리 코드를 검사하지 않는 예외를 말한다
> * 처리를 안 할 경우에도 `throws`를 표기하지 않아도 된다.



## 1.3 Checked Exception의 목적

* Checked Exception을 던지면 호출자가 그 예외를 catch로 잡아 처리하거나 더 바깥으로 전파하도록 강제한다
* 따라서 메서드 선언에 포함된 Checked Exception은 메서드를 호출했을 때 발생할 수 있는 유력한 결과임을 API 사용자에게 알려주는 것
* 달리 말하면 `API 설계자는 Checked Exception를 던져주어 그 상황에서 회복해내라고 요구`하는 것이다
* 물론 사용자가 예외를 잡기만하고 별다른 조치를 취하지 않을 수 있지만 이는 좋지 못하다



## 1.4 Kotlin에서 예외를 구분하지 않는 이유

- 실제 자바 프로그래머들이 체크 예외를 사용하는 방식을 고려해 Kotlin에서는 Checked Exception과 Unchecked Exception을 구분하지 않는다. 
- 앞서 살펴본바로 Checked Exception은 사용자가 예외를 잡으면 그 상황을 회복해야 한다.
- 하지만 실질적으로 예외를 복구할 수 없는 Checked Exception이 존재하기도 하고 대부분의 개발자들이 Checked Exception를 잡기만하고 별다른 조치를 취하지 않는다.



**예외를 복구할 수 없는 Checked Exception**

- BufferedReader.close는 IOException을 던질 수 있다.
- IOException은 Checked Exception이므로 사용자가 필히 예외를 처리해야 한다.
- 하지만 실제로 스트림을 닫다가 실패하는 경우 사용자가 취할 수 있는 의미 있는 동작이 없다.
- 이렇게 예외를 복구할 수 없는 Checked Exception이 여러 존재한다.



# 2 try, catch, finally

- 코틀린은 자바의 try-with-resource을 위한 특별한 문법을 제공하지 않는다.
  - 라이브러리 함수로 같은 기능을 구현할 수 있다.



## 2.1 try

- 코틀린의 try는 if나 when과 마찬가지로 식이다.
- 따라서 try의 값을 변수에 대입할 수 있다.
- try의 본문은 반드시 중괄호로 둘러싸야 한다.
- try 본문에 여러 문장이 있으면 마지막 식의 값이 전체 결과 값이다.



## 2.2 catch

- catch도 식이다.
- catch 본문에 여러 문장이 있으면 마지막 식의 값이 전체 결과 값이다.



**예시**

```kotlin
fun readNumber(reader: BufferedReader) {
  val number = try {
    Integer.parseInt(reader.readLine())
  } catch(e: NumberFormatException) {
    null
  }
  print(number)
}
```

- try, catch는 식이기 대문에 변수에 대입할 수 있다.
- try 블록이 정상적으로 실행되면 try의 마지막 식의 값이 결과다.
- 예외가 발생하고 잡히면 그 예외를 잡는 catch 블록의 마지막 식의 값이 결과다.



## 2.3 finally

- 자바와 똑같이 작동한다.



블로그

- https://velog.io/@raiders032/%EC%9E%90%EB%B0%94%EC%99%80-%EB%B9%84%EA%B5%90%ED%95%98%EC%97%AC-%EC%BD%94%ED%8B%80%EB%A6%B0-Exception-%ED%95%99%EC%8A%B5%ED%95%98%EA%B8%B0