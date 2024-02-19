# 1 Reflection

* Reflection이란 클래스로더를 통해 읽어온 클래스 정보를 사용하는 기술이다.
* 자바는 클래스와 인터페이스의 메타 데이터를 Class 클래스로 관리한다.
	* 여기서 메타 데이터란 클래스의 이름, 생성자 정보, 메서드 정보 등을 의미한다.
* 리플렉션 기술을 사용하면 클래스나 메서드의 메타정보를 동적으로 획득하고, 코드도 동적으로 호출할 수 있다.

<br>

## 1.1 Class 객체 얻기

- 자바는 클래스와 인터페이스의 메타 데이터를 Class객체로 관리하기 때문에 Reflection을 사용하기 위해서는 먼저 Class 객체를 얻어야 한다.
- Class 객체를 얻기 위해서는 Object 클래스가 가지고 있는 getClass() 메서드를 이용하면 된다.
	- getClass() 메서드는 해당 클래스의 객체가 있을 때 사용할 수 있다.
- 객체를 생성하기 전에 Class 객체를 얻고 싶다면 Class의 static 메서드 forName을 이용하면 된다.

<br>

**forName 메서드**

```java
public static Class<?> forName(String className)
                        throws ClassNotFoundException
```

- 매개값으로 주어진 클래스를 찾지 못하면 ClassNotFoundException 예외가 발생한다.
- 클래스에 대한 FQCN를 입력한다.
	- 예를 들어, 자바의 ArrayList 클래스에 대한 FQCN은 java.util.ArrayList이다.

<br>

## 1.2 Class

* [레퍼런스](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Class.html)
* `Class` 객체를 이용하면 클래스의 생성자, 필드, 메소드 정보를 알아낼 수 있다.

<br>

**Class 객체의 리플렉션 메소드**

- [레퍼런스](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Class.html#method-summary)
- [getDeclaredConstructors](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Class.html#getDeclaredConstructors())()
	- Constructor 객체의 배열을 반환
- [getDeclaredFields](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Class.html#getDeclaredFields())()
	- Field 객체의 배열을 반환
- [getFields](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Class.html#getFields())()
	- Field 객체의 배열을 반환(상속된 필드 포함)
	* 단 public 멤버만 가져옴
* [getDeclaredMethods](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Class.html#getDeclaredMethods())()
	* Method 객체의 배열을 반환
* [getMethods](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Class.html#getMethods())()
	* Method 객체의 배열을 반환(상속된 메소드 포함)
	* 단 public 멤버만 가져옴

<br>

# 2 Reflection으로 할 수 있는 것

- 프로그램 실행 시간에 클래스 내부의 메서드와 필드에 대한 정보를 얻을 수 있다
- 클래스의 객체를 생성할 수 있다
- 객체 필드의 접근 제어자에 관계없이 그 필드에 대한 참조를 얻어내어 값을 가져오거나 설정할 수 있다

<br>

# 3 Reflection을 사용하는 이유

- 프로그램이 어떻게 동작하는지 실행 시간에 관측하고 조정할 수 있도록 해준다.
- 메서드나 생성자, 필드에 직접 접근할 수 잇기 때문에 프로그램을 디버깅하거나 테스트할 때 유용하다

<br>

# 4 주의사항

- 리플렉션을 사용하면 클래스와 메서드의 메타정보를 사용해서 애플리케이션을 동적으로 유연하게 만들 수 있다. 
- 하지만 리플렉션 기술은 런타임에 동작하기 때문에, 컴파일 시점에 오류를 잡을 수 없다.
- 따라서 `리플렉션은 일반적으로 사용하면 안된다.`
- 리플렉션은 프레임워크 개발이나 또는 매우 일반적인 공통 처리가 필요할 때 부분적으로 주의해서 사용해야 한다.