# 1 Serialization

- Serialization이란 객체의 상태를 바이트 스트림으로 변환하는 것을 의미한다.
- 반대로 Deserialization은 바이트 스트림을 객체로 변환하는 것의 의미한다.
- 객체를 바이트 스트림으로 변환하는 이유는 네트워크를 통해 전송하기 위해서다.



# 2 Serializable 인터페이스

- 직렬화의 조건으로 자바 기본(primitive) 타입과 `java.io.Serializable` 인터페이스를 상속받은 객체는 직렬화 할 수 있다.



**java.io.Serializable 인터페이스**

```java
public interface Serializable {
}
```



**예시**

```java
public class Person implements Serializable {
    private static final long serialVersionUID = 1L;
    static String country = "ITALY";
    private int age;
    private String name;

    // getters and setters
}
```



직렬화 역직렬화

```java
@Test 
public void whenSerializingAndDeserializing_ThenObjectIsTheSame(){
  // given
  Person person = new Person();
  person.setAge(20);
  person.setName("Joe");

  // when: Serialization
  FileOutputStream fileOutputStream = new FileOutputStream("yourfile.txt");
  ObjectOutputStream objectOutputStream = new ObjectOutputStream(fileOutputStream);
  objectOutputStream.writeObject(person);
  objectOutputStream.flush();
  objectOutputStream.close();

  // when: Deserialization
  FileInputStream fileInputStream = new FileInputStream("yourfile.txt");
  ObjectInputStream objectInputStream = new ObjectInputStream(fileInputStream);
  Person p2 = (Person) objectInputStream.readObject();
  objectInputStream.close(); 

  // then
  assertTrue(p2.getAge() == person.getAge());
  assertTrue(p2.getName().equals(person.getName()));
}
```



# 3 Serial Version UID

- 역직렬화를 위해선 직렬화 대상이 된 객체 클래스가 클래스 패스에 존재하며 `import` 되어 있어야 한다.
- 직렬화와 역직렬화를 진행하는 시스템이 서로 다를 수 있다.
- 직렬화와 역직렬화 되는 객체가 같은 애트리뷰트를 가지고 있다는 것을 나타내기 위해 `Serial Version UID`를 사용한다.
- 대부분의 IDE가 클래스의 이름, 애트리뷰트 등을 기반으로 `Serial Version UID`를 자동으로 만들어준다.
- 객체의 변화가 생기면 `Serial Version UID`도 변한다.
- 특별한 문제없으면 자바 직렬화 버전 `serialVersionUID`의 값은 개발 시 직접 관리해야 한다.
- `serialVersionUID`의 값이 동일하면 멤버 변수 및 메서드 추가는 크게 문제가 없습니다.
  - 그리고 멤버 변수 제거 및 이름 변경은 오류는 발생하지 않지만 데이터는 누락됩니다.

- 역직렬화 대상의 클래스의 멤버 변수 타입 변경을 지양해야 합니다. 
  - 자바 역직렬화시에 타입에 엄격합니다.
  - 나중에라도 타입 변경이 되면 직렬화된 데이터가 존재하는 상태라면 발생할 예외를 경우의 수를 다 신경 써야 합니다.

- 외부(DB, 캐시 서버, NoSQL 서버 등)에 장기간 저장될 정보는 자바 직렬화 사용을 지양해야 합니다.
  - 역직렬화 대상의 클래스가 언제 변경이 일어날지 모르는 환경에서 긴 시간 동안 외부에 존재했던 직렬화된 데이터는 쓰레기(Garbage)가 될 가능성이 높습니다.
  - **언제 예외가 발생할지 모르는 지뢰 시스템이 될 수도 있습니다.**

- 개발자가 직접 컨트롤이 가능한 클래스의 객체가 아닌 클래스의 객체에 대해서는 직렬화를 지양해야 합니다.
  - 개발자가 직접 컨트롤이 힘든 객체 란 보통 프레임워크 또는 라이브러리에서 제공하는 클래스의 객체를 이야기합니다. 
  - (사실 직접 변경 가능한 방법은 있지만 추천하진 않습니다.)
  - 그런 객체가 직접 `serialVersionUID`를 가지고 있기도 합니다. 
  - 그래서 개발 시에 편의상 직렬화 시켜 DB 또는 캐시 서버에 바로 저장하기도 하는데 이 부분에서 많은 문제가 발생합니다.




## 3.1 구조 변경 예시



**기존**

```java
public class Member implements Serializable {
  private String name;
  private String email;
  private int age;
  // 생략
}
```

위에 객체를 직렬화 한다.

```java
Member member = new Member("김배민", "deliverykim@baemin.com", 25);
byte[] serializedMember;
try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
  try (ObjectOutputStream oos = new ObjectOutputStream(baos)) {
    oos.writeObject(member);
    // serializedMember -> 직렬화된 member 객체 
    serializedMember = baos.toByteArray();
  }
}

// 바이트 배열로 생성된 직렬화 데이터를 base64로 변환
System.out.println(Base64.getEncoder().encodeToString(serializedMember));
```

직렬화 결과는 아래와 같다.

```
rO0ABXNyABp3b293YWhhbi5ibG9nLmV4YW0xLk1lbWJlcgAAAAAAAAABAgAESQADYWdlSQAEYWdlMkwABWVtYWlsdAASTGphdmEvbGFuZy9TdHJpbmc7TAAEbmFtZXEAfgABeHAAAAAZAAAAAHQAFmRlbGl2ZXJ5a2ltQGJhZW1pbi5jb210AAnquYDrsLDrr7w
```

위 문자열을 역직렬화해 Member 객체로 변환해보자. 아래와 같이 Member 클래스에 phone이라는 필드를 추가했다.

```java
public class Member implements Serializable {
  private String name;
  private String email;
  private int age;
  // phone 속성을 추가
  private String phone;
  // 생략
}
```

위 문자열을 이 객체로 역직렬화하면 나머지 필드는 채워지고 새로 추가된 phone 필드는 null로 채워지길 기대하면서 역직렬화를 해보지만 결과는 아래와 같다.

```
java.io.InvalidClassException: woowahan.blog.exam1.Member; local class incompatible: stream classdesc serialVersionUID = -8896802588094338594, local class serialVersionUID = 7127171927132876450
```

직렬화 객체의 serialVersionUID와 역직렬화 객체의 serialVersionUID가 달라 예외가 발생한다.



참고

- https://www.baeldung.com/java-serialization
- https://techblog.woowahan.com/2550/
- https://techblog.woowahan.com/2551/