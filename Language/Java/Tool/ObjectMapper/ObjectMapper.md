# 1 ObjectMapper

* ObjectMapper는 자바 객체를 JSON으로 또는 JSON을 자바 객체로 변환할 때 사용한다



# 2 의존성

**Gradle**

* ObjectMapper를 사용하기 위해선 아래와 같이 의존성을 추가한다

```groovy
implementation 'com.fasterxml.jackson.core:jackson-databind'
```

* 아래와 같이 spring-boot-starter-web을 추가하면 의존성으로 'com.fasterxml.jackson.core:jackson-databind' 이 자동으로 추가된다

```groovy
implementation 'org.springframework.boot:spring-boot-starter-web'
```



# 3 사용하기



## 3.1 자바 객체에서 JSON으로

```java
ObjectMapper objectMapper = new ObjectMapper();
Car car = new Car("yellow", "renault");
objectMapper.writeValue(new File("target/car.json"), car);
```

```json
{"color":"yellow","type":"renault"}
```



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



참고

* https://www.baeldung.com/jackson-object-mapper-tutorial