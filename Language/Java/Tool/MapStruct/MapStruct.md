# 1 MapStruct

* MapStruct는 type-safe하게 빈과 빈을 매핑시켜주는 annotation processor이다.
* 개발자는 mapper 인터페이스만 작성하면 컴파일 시점에 MapStruct가 해당 인터페이스의 구현을 자동으로 만들어준다.
* 소스 객체에서 타켓 객체로 매핑할 때 자바의 평범한 메소드를 이용해 매핑한다
  * 리플렉션을 사용하지 않는다
  * 따라서 성능상 좋다



# 2 Dependency

**Maven**

```xml
<properties>
    <org.mapstruct.version>1.4.2.Final</org.mapstruct.version>
</properties>

<dependencies>
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>${org.mapstruct.version}</version>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.8.1</version>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
                <annotationProcessorPaths>
                    <path>
                        <groupId>org.mapstruct</groupId>
                        <artifactId>mapstruct-processor</artifactId>
                        <version>${org.mapstruct.version}</version>
                    </path>
                </annotationProcessorPaths>
            </configuration>
        </plugin>
    </plugins>
</build>
```

**Gradle**

```groovy
plugins {
    id "com.diffplug.eclipse.apt" version "3.26.0" // Only for Eclipse
}

dependencies {
    implementation "org.mapstruct:mapstruct:${mapstructVersion}"
    annotationProcessor "org.mapstruct:mapstruct-processor:${mapstructVersion}"

    // If you are using mapstruct in test code
    testAnnotationProcessor "org.mapstruct:mapstruct-processor:${mapstructVersion}"
}
```



# 3 Defining a mapper

* mapper를 만들고 싶다면 인터페이스만 정의하고 `@Mapper` 애노테이션을 적용한다.
  * 이 인터페이스는 mapping 메소드를 가지고 있다

```java
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface CarMapper {
  @Mapping(source = "make", target = "manufacturer")
  @Mapping(source = "numberOfSeats", target = "seatCount")
  CarDto carToCarDto(Car car);

  @Mapping(source = "name", target = "fullName")
  PersonDto personToPersonDto(Person person);
}
```



# 4 mapping

* 소스 엔티티와 타겟 엔티티의 프로퍼티 이름이 같으면 자동적으로 매핑
* 소스 엔티티와 타겟 엔티티의 프로퍼티 이름이 다르면 `@Mapping` 애노테이션을 통해 명시



# 5 Retrieving a mapper



## 5.1 The Mappers factory 

* DI framework를 사용하지 않고 `org.mapstruct.factory.Mappers` 클래스를 통해 Mapper 인스턴스를 얻을 수 있다.
* 관습적으로 mapper 인터페이스는 INSTANCE라는 이름을 가진 멤버를 정의한다.

```java
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CarMapper {
  CarMapper INSTANCE = Mappers.getMapper( CarMapper.class );
  CarDto carToCarDto(Car car);
}
```

```java
Car car = ...;
CarDto dto = CarMapper.INSTANCE.carToCarDto( car );
```



## 5.2 [Using dependency injection](https://mapstruct.org/documentation/stable/reference/html/#using-dependency-injection)



참고

* https://mapstruct.org/documentation/stable/reference/html/#defining-mapper