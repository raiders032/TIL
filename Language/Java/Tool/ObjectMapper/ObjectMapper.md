# 1 ObjectMapper

* ObjectMapper는 자바 객체를 JSON으로 또는 JSON을 자바 객체로 변환할 때 사용한다

<br>

# 2 의존성

**Gradle**

```groovy
implementation 'com.fasterxml.jackson.core:jackson-databind'
```

- ObjectMapper를 사용하기 위해선 위와 같이 의존성을 추가한다


```groovy
implementation 'org.springframework.boot:spring-boot-starter-web'
```

- 위와 같이 spring-boot-starter-web을 추가하면 의존성으로 
- `com.fasterxml.jackson.core:jackson-databind` 이 자동으로 추가된다

<br>

# 3 사용하기

## 3.1 자바 객체에서 JSON으로

```java
ObjectMapper objectMapper = new ObjectMapper();
Car car = new Car("yellow", "renault");

// JSON을 파일로 저장
objectMapper.writeValue(new File("target/car.json"), car);

// JSON을 String으로 변환
String carAsString = objectMapper.writeValueAsString(car);
```

```json
{"color":"yellow","type":"renault"}
```


<br>

## 3.2 JSON에서 자바 객체로

**JSON 문자열에서 자바 객체로**

```java
String json = "{ \"color\" : \"Black\", \"type\" : \"BMW\" }";
Car car = objectMapper.readValue(json, Car.class);	
```

**JSON 파일에서 자바 객체로**

```java
Car car = objectMapper.readValue(new File("src/test/resources/json_car.json"), Car.class);
```

**URL에서 자바 객체로**

```java
Car car = 
  objectMapper.readValue(new URL("file:src/test/resources/json_car.json"), Car.class);
```

<br>

## 3.3 다른 타입의 자바 객체로 변환하기

- `ObjectMapper`의 `convertValue` 메소드를 사용하면, 이미 메모리에 존재하는 Java 객체를 다른 타입의 객체로 변환할 수 있다.
- 이는 JSON 처리 과정 중에 유용하게 사용될 수 있습니다.

<br>

**다른 타입의 객체로 변환 예시**

```java
ObjectMapper objectMapper = new ObjectMapper(); 

Map<String, Object> map = new HashMap<>(); 
map.put("color", "Blue"); 
map.put("type", "Ford");  

Car car = objectMapper.convertValue(map, Car.class);
```

- 위 예시에서는 `Map` 객체를 `Car` 클래스의 인스턴스로 변환하고 있습니다.
- `map`에는 `Car` 클래스와 호환되는 필드가 들어 있으며, `convertValue` 메소드는 이를 `Car` 타입의 객체로 변환합니다.

<br>

### 주의사항

- 변환하려는 대상 객체는 변환될 타입과 호환되는 필드를 가지고 있어야 합니다.
- `convertValue` 메소드는 타입 불일치로 인한 `IllegalArgumentException`을 발생시킬 수 있으므로, 적절한 예외 처리가 필요합니다.
- 이 메소드는 복잡한 객체 그래프를 간단하게 변환할 때 유용하지만, 타입 안전성이 중요한 경우에는 주의해서 사용해야 합니다.

<br>

참고

* https://www.baeldung.com/jackson-object-mapper-tutorial