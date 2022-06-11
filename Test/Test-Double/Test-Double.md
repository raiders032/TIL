

# 1 Test Double

* 테스트를 진행하기 어려운 경우 이를 대신해 테스트를 진행할 수 있도록 만들어주는 객체를 말한다.
* 영화 촬영시 위험한 역할을 대신하는 스턴드 더블에서 유래됨



# 2 Test Double의 종류

* 테스트 더블은 크게 **Dummy**, **Fake**, **Stub**, **Spy**, **Mock**으로 나눈다.
* 여러 유형에 겁먹을 수 있지만 실제로 목과 스텁의 두 가지 유형으로 나눌 수 있다
* 목, 스파이는 목에 포함되며 스텁, 더미, 페이크는 스텁에 포함된다

# 3 Dummy

* 전달용으로 쓰이는 객체이며 실제로 사용되지는 않는다
* 보통 파라미터들을 채우기 위해 사용된다



# 4 Fake

* 실제로 동작하는 구현을 가진 객체를 의미한다
* Fake는 테스트 용으로 간단하게 구현되며 운영 환경에서는 적합하지 않다
* 대표적인 예로 실제 데이터베이스 대신 InMemoryTestDatabase를 간단히 만들어 테스트용으로 사용할 수 있다



# 5 Stub

- 테스트에서 특정 요청에 대해 미리 정의해둔 응답을 하는 객체
- 따리서 정의되지 않은 요청에 대해서는 응답을 하지 않는다



# 6 Spy

- Stub과 같은 기능을 한다
- 추가적으로 호출된 내용에 대해 약간의 정보를 기록한다.

# 7 Mock

- 호출에 대한 기대를 명세하고 내용에 따라 동작하도록 프로그래밍 된 객체이다.
- 목을 외부로 나가는 상호 작용을 모방하고 검사하는데 도움이 된다
- 이러한 상호 작용은 SUT가 상태를 변경하기 위한 의존성을 호출하는 것에 해당된다
- 예를 들면 이메일 발송은 SMTP 서버에 부작용을 초래하는 상호 작용, 즉 외부로 나가는 상호작용 이다
  * 목은 이러한 상호 작용을 모방하는 테스트 대역에 해당된다
- 목, 스파이는 목에 포함된다



**관련 자료**

* [Test Double을 알아보자](https://tecoble.techcourse.co.kr/post/2020-09-19-what-is-test-double/)
* [What is the difference between a stub, a mock and a virtual service?](https://www.linkedin.com/pulse/what-difference-between-stub-mock-virtual-service-wojciech-bulaty/)
* [Mocks Aren't Stubs - martinfowler](https://martinfowler.com/articles/mocksArentStubs.html)