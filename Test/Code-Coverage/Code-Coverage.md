# 1 Code Coverage

> In [computer science](https://en.wikipedia.org/wiki/Computer_science), **test coverage** is a measure used to describe the degree to which the [source code](https://en.wikipedia.org/wiki/Source_code) of a [program](https://en.wikipedia.org/wiki/Computer_program) is executed when a particular [test suite](https://en.wikipedia.org/wiki/Test_suite) runs. A program with high test coverage, measured as a percentage, has had more of its source code executed during testing, which suggests it has a lower chance of containing undetected [software bugs](https://en.wikipedia.org/wiki/Software_bug) compared to a program with low test coverage - [wikipedia](https://en.wikipedia.org/wiki/Code_coverage)

* 코드 커버리지는 소프트웨어의 **테스트 케이스가 얼마나 충족되었는지를 나타내는 지표** 중 하나입니다.
* 테스트를 진행하였을 때 **'코드 자체가 얼마나 실행되었느냐'**는 것이고, 이는 **수치**를 통해 확인할 수 있습니다.



# 2 Code Coverage 측정 기준

* 코드 커버리지는 소스 코드를 기반으로 수행하는 **화이트 박스 테스트**를 통해 측정합니다.
* 구문(Statement), 조건(Condition), 결정(Decision) 3가지 측정 기준을 가지고 화이트 박스 테스트를 통해 커버리지를 나타냄

> **블랙 박스 테스트(Black-box test)**
>
> - 소프트웨어의 **내부 구조나 작동 원리를 모르는 상태에서 동작을 검사**하는 방식이다.
> - 올바른 입력과 올바르지 않은 입력을 입력하여 **올바른 출력이 나오는지 테스트**하는 기법이다.
> - **사용자 관점**의 테스트 방법이라 볼 수 있다.
>
> **화이트 박스 테스트(White-box test)**
>
> - 응용 프로그램의 **내부 구조와 동작을 검사**하는 테스트 방식이다.
> - 소프트웨어 **내부 소스 코드를 테스트**하는 기법이다.
> - **개발자 관점**의 단위 테스트 방법이라 볼 수 있다.



## 2.1 구문(*Statement*)

* 구문은 **라인 커버리지**, **코드 커버리지**라고 부른다
* 코드 한줄이 한 번이상 실행되면 충족된다
* `코드 커버리지 = 실행 코드 라인 수 / 전체 라인 수`



## 2.2 조건(Condition)

* 모든 조건식의 내부 조건이 true/false를 가지게 되면 총족된다
* 내부 조건이란 조건식 내부에 있는 각각의 조건이다
* `if (x > 0 && y < 0)` 조건식이 있을 때
  * 내부 조건은 `x > 0` 와 `y < 0` 두 가지다
* 조건을 기준으로 하면 구문, 과 결정 커버리지를 만족 못하는 경우가 존재할 수 있다



## 2.3 결정(Decision)

* **브랜치 커버리지**, **분기 커버리지**라고 부른다
* 브랜치 커버리지 지표는 코드 라인 수를 사용하는 대신 if 문과 swith 문과 같은 제어 구조에 중점을 둔다
* 모든 조건식이 true/false를 가지게 되면 충족된다
* `브랜치 커버리지 = 통과 분기 / 전체 분기 수`



## 2.4 어떤 기준을 선택할까?

* 세 가지 코드 커버리지 중에서 구문 커버리지가 가장 대표적으로 많이 사용되고 있다
* 라인 커버리지를 사용하면(만족하면) 모든 시나리오를 테스트한다는 보장은 할 수 없지만, 어떤 코드가 실행되더라도 해당 코드는 문제가 없다는 보장은 할 수 있습니다.



# 3 Code Coverage의 중요성

* 테스트 코드는 발생할 수 있는 **모든 시나리오에 대해 작성**되어야 합니다.
* 개발자도 사람인지라 테스트로 커버하지 못하는 부분이 발생할 수 있다
* 이렇게 테스트에서 놓칠 수 있는 부분들을 코드 커버리지를 통해 확인할 수 있습니다.
* 코드 커버리지는 **휴먼 에러를 최대한 방지**할 수 있도록 도와주는 용도라고 생각해도 될 것 같습니다.



## 3.1 높은 Coverage의 장점

* 거침없이 리팩토링을 할 수 있게 됨
* 불필요한 코드 제거
  * 테스트 필요성이 없어지는 코드를 바로 제거
* 코드에 대한 이해도 향상
  * 이해도가 없이는 테스트를 작성할 수 없기 때문
* 테스트케이스의 패턴이 생겨 빠르고 쉽게 작성할 수 있게 됨
* 자신있게 누를 수 있는 배포 버튼
  * 모든 코드가 테스트되었다는 사실에서 오는 자신감



## 3.2 Coverage는 몇퍼센트가 좋을까?

> 100% 테스트 커버리지를 권장하냐고? 권장이 아니라 강력히 요구한다.
>
> 작성한 코드는 할 줄도 빠짐없이 전부 테스트해야 한다.
>
> 군말은 필요 없다.
>
> 로버트 마틴 - "클린 코더(2016") 중에서



# 4 Code Coverage와 테스트 스위트의 품질

* 일반적으로 커버리지 숫자가 높을수록 더 좋다. 
* 하지만 그렇게 간단하지만은 않다 커버리지 지표는 중요한 피드백을 주더라도 **테스트 스위트의 품질을 효과적으로 측정하는데 사용할 수 없다**
* 코드 커버리지가 10%라면 테스트가 충분하지 않다는 좋은 증거다
* 그러나 100% 커버리지라고 해서 반드시 양질의 테스트 스위트라고 보장하지 않는다
* 높은 커버리지의 테스트 스위트도 품질이 떨어질 수 있다



## 4.1 커버리지 지표에 관한 문제점

* 테스트 대상 시스템의 모든 가능한 결과를 검증한다고 보장할 수 없다
* 외부 라이브러리의 코드 경로를 고려할 수 잇는 커버리지 지표는 없다



**테스트 대상 시스템의 모든 가능한 결과를 검증한다고 보장할 수 없다**

* 단위 테스트는 단지 코드 경로를 통과하는 것이 아니라 적절한 검증이 있어야한다
* 테스트 대상 시스템이 낸 결과과 여러 개 있을 수 있고 정확히 예상하는 결과인지 확인해야 한다
* 따라서 커버리지 지표가 의미가 있으려면 모든 측정 지표를 검증해야 한다



아래와 같은 코드를 테스트해보자

```java
public static boolean isStringLong(String input) {
  boolean result = input.length() > 5;
  boolean wasLastStringLong = result;
  return result;
}
```

아래와 같이 테스트 코드를 작성했다

```java
@Test
void test() {
  boolean result = isStringLong("abc");
  Assertions.assertThat(result).isFalse();
}
```

* isStringLong 메소드가 반환하는 명시적 결과와 isStringLong 메소드 내부에 wasLastStringLong에 저장되는 암묵적 결과가 있다
* 위에 테스트 코드는 명시적 결과는 검증 했지만 wasLastStringLong(암묵적 결과)는 테스트 하지 않았다
* 하지만 구문 기준 테스트 커버리지 100% 브랜치 기준 테스트 커버리지 50%의 결과를 보여준다

더 극단적으로 테스트를 작성해보면 아래와 같다

```java
@Test
void test2() {
  isStringLong("abc");
  isStringLong("abcdef");
}
```

* 위 테스트 코드는 구문 기준 테스트 커버리지 100% 브랜치 기준 테스트 커버리지 100%의 결과를 보여준다
* 이렇듯 테스트 커버리지가 테스트 스위트의 품질까지는 보장해주지 못한다는 것을 알아봤다



**외부 라이브러리의 코드 경로를 고려할 수 있는 커버리지 지표는 없다**

* 모든 커버리지 지표가 테스트 대상 시스템이 메서드를 호출할 때 외부 라이브러리가 통과하는 코드 경로를 고려하지 않는 다는 것

아래의 코드를 테스트 해보자

```java
public static int parse(String input) {
  return Integer.parseInt(input);
}
```

아래와 같이 테스트 코드를 작성했다

```java
@Test
void test3() {
  int result = parse("5");
  Assertions.assertThat(result).isEqualTo(5);
}
```

브랜치 기준 커버리지 100%인 테스트이다 하지만 이 테스트 코드는 완벽하지 않다. 

Integer.parse 메서드의 입력 매개변수를 변경하면 다른 결과로 이어질 수 있고 테스트로부터 숨어 있는 분기가 있다

* null 값
* 빈 문자열
* "정수가 아님 문자열"
* 너무 긴 문자열

```java
@Test
void test4() {
  Throwable throwable = catchThrowable(() -> parse(""));
  assertThat(throwable).isInstanceOf(NumberFormatException.class);
}

@Test
void test5() {
  Throwable throwable = catchThrowable(() -> parse(null));
  assertThat(throwable).isInstanceOf(NumberFormatException.class);
}

@Test
void test6() {
  Throwable throwable = catchThrowable(() -> parse("abc"));
  assertThat(throwable).isInstanceOf(NumberFormatException.class);
}
```

위와 같은 숨어 있는 분기를 테스트 하더라고 똑같이 브랜치 기준 커버리지 100%인 테스트이다 따라서 수많은 예외 상황에 빠질 수 있지만 테스트에서 모든 예외 상황을 다루는지 확인할 방법이 없다

따라서 커버리지 지표로 테스트가 철저한지 또는 테스트가 충분한지 알 수는 없다



## 4.2 특정 커버리지 숫자를 목표로 하기

* 테스트 스위트 품질을 결정하기에 코드 커버리지 지표로는 충분하지 않다는것을 알게되었다
* 코드 커버리지 100%, 90% 숫자를 목표로 삼기 시작하면 위험 영역으로 이어질 수 있다
* 커버리지 숫자를 강요하면 개발자들은 테스트 대상에 신경쓰지 못하고 결국 적절한 단위 테스트는 더욱 달성하기 어려워 진다
* 커버리지 지표는 낮은 경우 문제 징후로 받아 들이고 높은 숫자는 큰 의미가 없다고 생각해야 한다



## 4.3 좋은 테스트 스위트의 특성

**개발 주기에 통합돼 있다**

* 모든 테스트는 개발 주기에 통합돼야 한다
* 이상적으로는 코드가 변경될 때마다 아무리 작은 것이라도 실행해야 한다

**코드베이스 중 가장 중요한 부분만을 대상으로 한다**

* 단위 테스트 측면에서 코드베이스의 모든 부분을 똑같이 주목할 필요는 없다
* **시스템의 가장 중요한 부분에 단위 테스트 노력을 기울이고 다른 부분을 간략하게 또는 간접적으로 검증하는 것이 좋다**
* 애플리케이션에서 가장 중요한 부분은 비즈니스 로직이 있는 부분이다
* 비즈니스 로직 테스트가 시간 투자 대비 최고의 수익을 낼 수 있다
* 다른 부분은 세 가지 범주로 나눌 수 있다
  * 인프라 코드
  * 데이터베이스 같은 외부 서비스 및 종속성
  * 모든 것을 하나로 묶는 코드
* 통합 테스트와 같이 도메인 모델을 넘어 코드베이스에서 중요하지 않은 부분을 포함해 시스템이 전체적으로 어떻게 동작하는지 확인할 수 있다
  * 이는 좋은 방법이지만 초첨은 도메인 모델에 머물러 있어야 한다

**최소한의 유지비로 최대의 가치를 끌어낸다**

* 테스트를 시스템에 통합하는 것만으로 충분하지 않으며 도메인 모델에 높은 테스트 커버리지를 유지하는 것도 충분하지 않다
* **가치있는 테스트를 식별하고 가치 있는 테스트를 작성하는 것이 가장 중요하다**



# 5 Java Code Coverage

* **자바 코드 커버리지 분석 도구**는 여러가지가 존재하는데, 대표적으로 **Cobertura, Jacoco, Clover** 등이 있다
* [Jacoco.md](../Jacoco/Jacoco.md)



참고

* [코드 분석 도구 적용기 - 1편, 코드 커버리지(Code Coverage)가 뭔가요?](https://velog.io/@lxxjn0/%EC%BD%94%EB%93%9C-%EB%B6%84%EC%84%9D-%EB%8F%84%EA%B5%AC-%EC%A0%81%EC%9A%A9%EA%B8%B0-1%ED%8E%B8-%EC%BD%94%EB%93%9C-%EC%BB%A4%EB%B2%84%EB%A6%AC%EC%A7%80Code-Coverage%EA%B0%80-%EB%AD%94%EA%B0%80%EC%9A%94)
* https://www.youtube.com/watch?v=jdlBu2vFv58