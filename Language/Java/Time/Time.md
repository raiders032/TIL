# 1 java.time 패키지

- java.time 패키지는 LocalDate, Instant, Duration, Period 등의 클래스를 제공한다.



# 2 LocalDate

- LocalDate 인스턴스는 시간을 제외한 날짜를 표현하는 불변 객체다.
- LocalDate 객체는 어떤 시간대 정보도 포함하지 않는다.



**LocalDate 인스턴스 생성**

- 정적 팩토리 메서드 of로 인스턴스를 만들 수 있다.

```java
LocalDate.of(2017, 9, 21);
```

- 팩토리 메서드 now는 시스템 시계의 정보를 이용해서 현재 날짜 정보를 얻는다.

```java
LocalDate.now()
```

- 문자열로 LocalDate 인스턴스를 만들 수 있다.
  - parse 메서드에 DateTimeFormatter를 전달해 날짜, 시간 객체의 형식을 지정할 수 있다.

```java
LocalDate.parse("2017-09-21");
```



# 3 LocalTime

- 시간은 LocalTime 클래스로 표현할 수 있다.



**LocalTime 인스턴스 생성**

- 정적 팩토리 메서드 of로 LocalTime 인스턴스를 만들 수 있다.
- 아래는 `13:45:20` 를 나타낸다

```java
LocalTime.of(13, 45, 20);
```

- 팩토리 메서드 now는 시스템 시계의 정보를 이용해서 현재 시간 정보를 얻는다.

```java
LocalTime.now()
```

- 문자열로 LocalTime 인스턴스를 만들 수 있다.

````java
LocalTime.parse("13:45:20");
````



# 4 LocalDateTime

- LocalDateTime은 LocalDate와 LocalTime를 쌍으로 갖는 복합 클래스다.
- 즉 LocalDateTime은 날짜와 시간을 모두 표현할 수 있다.



**LocalDateTime 생성**

- 정적 팩토리 메서드 of로 LocalDateTime 인스턴스를 만들 수 있다.

```java
LocalDateTime.of(2017, Month.SEPTEMBER, 21, 13, 45, 20);
```



# 5 Instant

- 사람은 주, 날짜, 시간, 분으로 날짜를 계산한다.
- 하지만 기계에서는 특정 지점을 기준으로 하나의 큰 수로 표현하는 것이 가장 자연스러운 표현 방법이다.
- Instant 클래스는 유닉스 에포크 시간을 기준으로 특정 지점까지의 시간을 초로 표현한다.
  - `1970년 1월 1일 0시 0분 0초 UTC`가 기준



관련자료

- [SpringBoot에서 날짜 타입 JSON 변환에 대한 오해 풀기](https://jojoldu.tistory.com/361)