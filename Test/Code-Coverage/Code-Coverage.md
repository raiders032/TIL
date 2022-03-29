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

* 구문은 라인 커버리지라고 부르기도 한다
* 코드 한줄이 한 번이상 실행되면 충족된다



## 2.2 조건(Condition)

* 모든 조건식의 내부 조건이 true/false를 가지게 되면 총족된다
* 내부 조건이란 조건식 내부에 있는 각각의 조건이다
* `if (x > 0 && y < 0)` 조건식이 있을 때
  * 내부 조건은 `x > 0` 와 `y < 0` 두 가지다
* 조건을 기준으로 하면 구문, 과 결정 커버리지를 만족 못하는 경우가 존재할 수 있다



## 2.3 결정(Decision)

* 브랜치 커버리지라고 부른다
* 모든 조건식이 true/false를 가지게 되면 충족된다



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



# 4 Java Code Coverage

* **자바 코드 커버리지 분석 도구**는 여러가지가 존재하는데, 대표적으로 **Cobertura, Jacoco, Clover** 등이 있다
* [Jacoco.md](../Jacoco/Jacoco.md)



참고

* [코드 분석 도구 적용기 - 1편, 코드 커버리지(Code Coverage)가 뭔가요?](https://velog.io/@lxxjn0/%EC%BD%94%EB%93%9C-%EB%B6%84%EC%84%9D-%EB%8F%84%EA%B5%AC-%EC%A0%81%EC%9A%A9%EA%B8%B0-1%ED%8E%B8-%EC%BD%94%EB%93%9C-%EC%BB%A4%EB%B2%84%EB%A6%AC%EC%A7%80Code-Coverage%EA%B0%80-%EB%AD%94%EA%B0%80%EC%9A%94)
* https://www.youtube.com/watch?v=jdlBu2vFv58