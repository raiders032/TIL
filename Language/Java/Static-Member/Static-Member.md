# 1 Static Member(Class Member)

* Static Member는 클래스에 고정된 멤버로서 객체를 생성하지 않고 사용할 수 있는 필드와 메소드를 말한다.
  * 이들을 각각 static field(class variable), static method(class method)라고 부른다.
* Static Member는 클래스에 고정된 멤버이므로 클래스 로더가 클래스를 로딩해서 메소드 메모리 영역에 적재할 때 클래스 별로 관리된다.
  * 따라서 클래스 로딩이 끝나면 바로 사용 가능



**언제 사용하나?**

* 해당 클래스로 만든 모든 객체에 공통적인 변수를 사용하려고 하는 경우 사용한다.
  * 클래스의 모든 인스턴스는 메모리 내 하나의 고정 위치에 있는 클래스 변수를 공유합니다. 
  * 모든 객체는 클래스 변수의 값을 변경할 수 있고 **static field는 클래스의 인스턴스를 만들지 않고도 조작할 수 있습니다.**

**정리**

* 객체마다 가지고 있어야하는 데이터 -> 인스턴스 필드
* 객체마다 가지고 있을 필요성이 없는 공용적인 데이터 -> 정적 필드(Class Variable)
* 인스턴스 필드를 이용해서 실행해야 한다 -> 인스턴스 메소드
* 인스턴스 필드를 이용하지 않는다 -> 정적 메소드(Class Method)



# 2 Static Field(Class Variable)

* static field를 사용하고 싶다면 필드 선언시 `static` 키워드를 붙인다.
* static field는 선언과 동시에 초기값을 주는 것이 보통이다.

**예시**

```java
public class Bicycle {

  private int cadence;
  private int gear;
  private int speed;

  // add an instance variable for the object ID
  private int id;

  // add a class variable for the
  // number of Bicycle objects instantiated
  private static int numberOfBicycles = 0;
}
```

**테스트**

* static field는 클래스 이름 자체로 접근 가능하다.
* 또한 객체 참조로도 static field에 접근 가능하다

```java
@Test
void staticField(){
  Bicycle bicycle = new Bicycle();
  assertThat(bicycle.numberOfBicycles).isEqualTo(0);
  assertThat(Bicycle.numberOfBicycles).isEqualTo(0);
}
```



## 2.1 Static Field 초기화

**선언과 동시에 초기화**

* 간단한 경우 아래와 같이 선언과 동시에 static field를 초기화할 수 있다.

```java
public class BedAndBreakfast {
  public static int capacity = 10;
  private boolean full = false;
}
```



## 2.2 static initialization block

* static field를 초기화하기 위해 복잡한 로직이 필요하다면 static initialization block사용한다.
  * 에러 처리, for 문을 사용한 배열 값 채우기 등
* static initialization block은 클래스가 메모리로 로딩될 때 자동으로 실행된다.
* static initialization block은 여러개 선언할 수 있으며 순서대로 실행되는 것이 보장됨.
* 내부에서 인스턴스 필드나 인스턴스 메소드를 사용할 수 없다.
  * this도 사용 불가

```java
// static initialization block은 클래스의 body 어디에나 위치할 수 있다.
static {
    // 복잡한 초기화 로직
}
```



## 2.3 initializer block

* 보통 생성자를 통해 인스턴스 필드를 초기화하지만 initializer block을 사용해 인스턴스 필드를 초기화할 수 있다.
* initializer block은 static initialization block과 같은 구조이며 static 키워드만 없다.
* 자바 컴파일러는 initializer block에 작성된 코드를 모든 생성자에 붙여넣는다.
* 따라서 initializer block은 모든 생성자의 공통된 로직을 처리하기 적절하다.

```java
// initialization block은 클래스의 body 어디에나 위치할 수 있다.
{
     // 복잡한 초기화 로직
}
```



# 3 Static Method(Class Method)

* static method를 사용하고 싶다면 메소드 선언시 `static` 키워드를 붙인다.
* static method는 클래스 이름을 통해 호출한다.
  * 객체 참조를 통하여 static method를 호출하는 것이 가능하지만 이름부터 Class Method이기 때문에 클래스를 통해 호출하자!



**용도**

* static method의 흔한 용도는 static field의 접근하기 위해서다
* 아래는 static field인 numberOfBicycles에 접근하기 위한 메소드

```java
public static int getNumberOfBicycles() {
    return numberOfBicycles;
}
```



## 2.1 Instance method와 비교

* Instance method와 static method 에서 여러 종류의 필드에 직접 접근이 가능한지 나타내는 표
* **static method**는 instance variables과 instance methods에 직접 접근 불가
  * 객체 참조를 통해 접근이 가능하다.
* static method는 `this`키워드 사용이 불가능하다.

|                     | instance variables | instance methods | class variables | class methods |
| ------------------- | ------------------ | ---------------- | --------------- | ------------- |
| **Instance method** | O                  | O                | O               | O             |
| **static method**   | X                  | X                | O               | O             |



참고

* https://docs.oracle.com/javase/tutorial/java/javaOO/classvars.html