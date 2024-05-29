

# 1 Test Double

* 테스트를 진행하기 어려운 경우, 실제 객체를 대신해 테스트를 진행할 수 있도록 만들어주는 객체를 Test Double이라고 합니다.
- Test Double이라는 용어는 영화 촬영 시 위험한 장면을 대신 연기하는 스턴트 더블(Stunt Double)에서 유래되었습니다.
- Test Double은 실제 객체와 유사한 인터페이스를 가지고 있어, 테스트 코드에서 실제 객체처럼 사용할 수 있습니다.
- Test Double을 사용하면 테스트 대상 코드와 의존성을 분리할 수 있어, 테스트의 안정성과 속도를 향상시킬 수 있습니다.

<br>

# 2 Test Double의 종류

* 테스트 더블은 크게 **Dummy**, **Fake**, **Stub**, **Spy**, **Mock**의 다섯 가지 유형으로 나눌 수 있습니다. 
* 하지만 실제로는 **Mock**과 **Stub**의 두 가지 유형으로 크게 구분할 수 있습니다.
	* Mock: Mock, Spy
	* Stub: Stub, Dummy, Fake
- 차이점
	- **목은 외부로 나가는 상호 작용을 모방하고 검사**하는데 도움이 된다
	* **스텁은 내부로 들어오는 상호 작용을 모방**하는데 도움이 된다

<br>

# 3 Mock

- Mock의 종류로 Mock, Spy가 있습니다.
- **Mock**은 행위 검증(Behavior Verification)에 중점을 둡니다.

<br>

## 3.1 Mock

- Mock 객체는 테스트 코드에서 정의한 기대 행위(Expected Behavior)에 따라 동작하도록 프로그래밍된 객체입니다.
- Mock 객체는 테스트 대상 코드와 의존성 사이의 상호작용을 검증하는 데 사용되며, 특히 외부로 나가는 상호작용(예: 네트워크 호출, 데이터베이스 쿼리 등)을 모방하고 검증하는 데 유용합니다.
- Mock 객체는 테스트 코드에서 의존성의 행위를 지정하고, 해당 행위대로 동작하는지 확인합니다.
- Mock 객체는 테스트 대상 코드의 간접 출력(Indirect Output)을 검증하는 역할을 합니다.

<br>

## 3.2 Spy

- Spy 객체는 Stub 객체와 유사한 역할을 하면서, 추가적으로 호출된 내용에 대한 정보를 기록합니다.
- Spy 객체는 실제 객체를 감싸거나 상속하여 구현되며, 실제 객체의 메서드 호출 여부, 호출 횟수, 전달된 인자 등을 기록할 수 있습니다.
- Spy 객체는 테스트 대상 코드와 의존성 사이의 상호작용을 검증하는 데 사용됩니다.

<br>

# 4 Stub

- Stub의 종류에는 Stub, Dummy, Fake가 있습니다.
- **Stub**은 상태 검증(State Verification)에 중점을 둡니다.

<br>

## 4.1 Stub

- Stub 객체는 테스트에서 특정 요청에 대해 **미리 정의해둔 응답을 반환하는 객체**입니다.
- Stub 객체는 테스트 코드에서 의존성을 제어하고 예측 가능한 결과를 얻기 위해 사용됩니다.
- Stub 객체는 정의되지 않은 요청에 대해서는 응답하지 않습니다.
- Stub 객체는 테스트 대상 코드의 간접 입력(Indirect Input)을 제공하는 역할을 합니다.

<br>

## 4.1 Dummy

* Dummy 객체는 실제로 사용되지 않으며, 주로 파라미터 목록을 채우기 위해 사용됩니다.
- Dummy 객체는 테스트에 실질적인 영향을 주지 않으며, 단순히 코드가 컴파일되고 실행되도록 하는 역할을 합니다.
- 예를 들어, 테스트 코드에서 필요한 인자를 전달하기 위해 의미 없는 값으로 생성한 객체가 Dummy 객체에 해당됩니다.

<br>

## 4.2 Fake

* Fake 객체는 실제로 동작하는 구현을 가진 객체를 의미합니다.
- Fake 객체는 테스트 환경에서 사용하기 적합하도록 단순화된 구현을 가지고 있어, 운영 환경에서는 적합하지 않습니다.
- 예를 들어, 실제 데이터베이스 대신 인메모리 데이터베이스(In-Memory Database)를 사용하는 것이 Fake 객체의 대표적인 예시입니다.
- Fake 객체는 실제 객체와 유사한 동작을 하지만, 성능이나 확장성 측면에서 제한적일 수 있습니다.

<br>

**관련 자료**

* [Test Double을 알아보자](https://tecoble.techcourse.co.kr/post/2020-09-19-what-is-test-double/)
* [What is the difference between a stub, a mock and a virtual service?](https://www.linkedin.com/pulse/what-difference-between-stub-mock-virtual-service-wojciech-bulaty/)
* [Mocks Aren't Stubs - martinfowler](https://martinfowler.com/articles/mocksArentStubs.html)