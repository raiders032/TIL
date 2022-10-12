# 1 Serialization

- Serialization이란 객체의 상태를 바이트 스트림으로 변환하는 것을 의미한다.
- 반대로 Deserialization은 바이트 스트림을 객체로 변환하는 것의 의미한다.
- 객체를 바이트 스트림으로 변환하는 이유는 네트워크를 통해 전송하기 위해서다.



# 2 Serializable 인터페이스

- 직렬화의 조건으로 자바 기본(primitive) 타입과 `java.io.Serializable` 인터페이스를 상속받은 객체는 직렬화 할 수 있다.



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
Base64.getEncoder().encodeToString(serializedMember);
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

직렬화 객체의 serialVersionUID와 역직렬화 객체의 serialVersionUID가 달라 



참고

- https://www.baeldung.com/java-serialization
- https://techblog.woowahan.com/2550/
- https://techblog.woowahan.com/2551/