# 1 Observer

* Observer 패턴이란 한 객체의 상태가 바뀌면 그 객체의 의존하는 다른 객체에게 연락이 가고 자동으로 내용이 갱신되는 방식으로 일대다 의존성을 정의하는 것
* 신문 구독 메커니즘만 제대로 이해하면 옵저버 패턴을 쉽게 이해할 수 있다
* 신문사를 Subject, 구독자를 Observer로 부른다는 것만 외우자



# 2 Observer의 구조

![img](images/500px-Observer_w_update.svg.png)



## 2.1 Subject 인터페이스

* Subject는 데이터를 관리하는 주체이다
* 관리하는 데이터가 바뀌면 그 소식을 Observer에게 전달한다
* 데이터가 바뀌면 새로운 데이터 값이 어떤 방법으로든 Observer에게 전달됨



## 2.2 Observer 인터페이스

* Observer 객체들은 Subject를 구독하고 있으며 Subject의 데이터가 바뀌면 갱신된 내용을 전달받는다