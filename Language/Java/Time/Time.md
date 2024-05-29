# 1 java.time 패키지

- Java 8부터 도입된 `java.time` 패키지는 날짜와 시간을 다루는 데 필요한 다양한 클래스를 제공합니다.
- `LocalDate`, `LocalTime`, `LocalDateTime`, `Instant`, `Duration`, `Period` 등의 클래스가 있습니다.

<br>

# 2 LocalDate

- `LocalDate`는 시간 정보를 제외한 날짜만을 표현하는 불변 객체입니다.
- `LocalDate`는 어떤 시간대 정보도 포함하지 않습니다.
    - 시간대 정보란 UTC(협정 세계시)로부터 얼마나 떨어져 있는지를 나타내는 정보입니다.
    - 예를 들어, 한국 표준시(KST)는 UTC보다 9시간 빠릅니다.

<br>

**LocalDate 인스턴스 생성**

```java
LocalDate date1 = LocalDate.of(2017, 9, 21);
LocalDate date2 = LocalDate.now();
LocalDate date3 = LocalDate.parse("2017-09-21");
```

- 정적 팩토리 메서드 `of`나 `now`를 사용하거나, 문자열을 `parse`하여 `LocalDate` 인스턴스를 생성할 수 있습니다.<br>
<br>

# 3 LocalTime

- `LocalTime`은 날짜 정보를 제외한 시간만을 표현하는 클래스입니다.



**LocalTime 인스턴스 생성**

```java
LocalTime time1 = LocalTime.of(13, 45, 20);
LocalTime time2 = LocalTime.now();
LocalTime time3 = LocalTime.parse("13:45:20");
```

- LocalDate와 마찬가지로 정적 팩토리 메서드나 문자열 파싱을 통해 LocalTime 인스턴스를 생성할 수 있습니다.

<br>

# 4 LocalDateTime

- `LocalDateTime`은 `LocalDate`와 `LocalTime`을 모두 포함하는 복합 클래스입니다.
- 즉, 날짜와 시간 정보를 모두 표현할 수 있습니다.

<br>

**LocalDateTime 생성**

```java
LocalDateTime.of(2017, Month.SEPTEMBER, 21, 13, 45, 20);
```

- 정적 팩토리 메서드 `of`를 사용하여 `LocalDateTime` 인스턴스를 생성할 수 있습니다.

<br>

# 5 Instant

- 사람은 주, 날짜, 시간, 분으로 날짜를 계산한다.
- 하지만 기계에서는 특정 지점을 기준으로 하나의 큰 수로 표현하는 것이 가장 자연스러운 표현 방법이다.
- Instant 클래스는 유닉스 에포크 시간을 기준으로 특정 지점까지의 시간을 초로 표현한다.
	- `1970년 1월 1일 0시 0분 0초 UTC`가 기준

<br>

# 6 날짜와 시간 객체 출력과 파싱

- 날짜와 시간 관련 작업에서 포매팅과 파싱은 서로 떨어질 수 없는 관계다.
- `java.time.format` 이라는 포매팅과 파싱 전용 패키지를 제공한다.

<br>

## 6.1 DateTimeFormatter

- `java.time.format`에서 가장 중요한 클래스다.



**예시**

```java
@Test
void testDateTimeFormatter() {
    // given
    LocalDate date = LocalDate.of(2014, 3, 18);

    // when
    String format1 = date.format(DateTimeFormatter.BASIC_ISO_DATE);
    String format2 = date.format(DateTimeFormatter.ISO_LOCAL_DATE);

    // then
    assertThat(format1).isEqualTo("20140318");
    assertThat(format2).isEqualTo("2014-03-18");
}
```

- 다음과 같이 상수가 미리 정의되어 있어 손쉽게 포매터를 만들 수 있다.

```java
    @Test
    void testDateTimeFormatter2() {
        // given
        LocalDate date = LocalDate.of(2014, 3, 18);
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        // when
        String format = date.format(dateTimeFormatter);

        // then
        assertThat(format).isEqualTo("18/03/2014");
    }
```

- 직접 패턴을 지정할 수 있다.

<br>

관련자료

- [SpringBoot에서 날짜 타입 JSON 변환에 대한 오해 풀기](https://jojoldu.tistory.com/361)