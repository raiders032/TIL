# 1 Nested Class

* 클래스가 여러 클래스와 관계를 맺는 경우 독립적으로 선언하는 것이 좋으나 특정 클래스와 관계를 맺는 경우에는 관계 클래스를 클래스 내부에 선언하는 것이 좋다. 
* **중첩 클래스란(Nested Class)란 클래스 내부에 선언한 클래스를 말한다.**
* 중첩 클래스를 사용하면 두 클래스의 멤버들은 서로 쉽게 접근 할 수 있다는 장점과 외부에는 불필요한 관계 클래스를 감춤으로서 코드의 복잡성을 줄일 수 있다.
* 중첩 클래스는 선언 위치에 따라 분류된다. 
  * **클래스의 멤버**로서 선언되는 중첩 클래스를 **멤버 클래스**라고 하고, **메소드 내부**에 선언되는 중첩 클래스를 **로컬 클래스**라고 한다.



## 1.1 중첩 클래스의 용도

* 한 곳에서만 사용되는 클래스를 논리적으로 그룹화하는데 사용된다.
  * 하나의 클래스가 오직 다른 하나의 클래스에만 유용한 경우 해당 클래스에 클래스를 내장하고 두 클래스를 함께 유지하는 것이 좋다. 
  * 이러한 "helper class"를 중첩하면 패키지가 더 간소화된다.
* 캡슐화 강화

>  두 개의 최상위 클래스, A와 B를 고려해보자. 여기서 B는 privated으로 선언될 A의 멤버에 대한 액세스가 필요하다. 클래스 A 내에서 클래스 B를 숨김으로써 A의 멤버는 private으로 선언되고 B가 액세스할 수 있다. 게다가, B 자체는 외부로부터 숨겨질 수 있다.

* 읽기 쉽고 유지보수가 쉬운 코드
  * 최상위 클래스 내에 작은 클래스를 중첩하면  중첩 클래스의 코드가 사용되는 위치에 더 가깝게 배치되고 읽기가 쉬워진다.



# 2 멤버 클래스

* **클래스의 멤버**로서 선언되는 중첩 클래스를 **멤버 클래스**하며 멤버 클래스의 종류로 **인스턴스 멤버 클래스**와 **정적 멤버 클래스**가 있다
  * 인스턴스 멤버 클래스
    * **Non-static nested class** 또는 **inner class**라고 불림
    *  `static` 키워드 없음
  * 정적 멤버 클래스: `static` 키워드 있음
* 내부 클래스는  외부 클래스의 private으로 선언된 경우에도 다른 멤버에 액세스할 수 있습니다.
* 멤버 클래스도 하나의 클래스이기 때문에 컴파일하면 바이트 코드가 별도로 생성된다



## 2.1 인스턴스 멤버 클래스(non-static nested class)

* `static` 키워드 없이 선언된 중첩 클래스를 말한다.

* 인스턴스 멤버 클래스, non-static nested class, inner class라고 불린다.

* 이너 클래스는 **외부 클래스의 인스턴스와 연결**되어 있다

* 이너 클래스는 인스턴스와 연관되어 있기 때문에 정적 멤버를 선언할 수 없다.

  * 인스턴스 필드와 메서드만 선언 가능함

* 이너 클래스의 인스턴스 객체는 반드시 외부 클래스의 인스턴스와 함께 존재한다.

  * 이너 클래스의 인스턴스는 외부 클래스의 인스턴스의 메소드와 필드에 집적 접근이 가능하다

  

**이너 클래스 객체 생성하기**

* 이너 클래스의 인스턴스를 만들기 위해선 먼저 외부 클래스의 인스턴스를 생성해야한다.

```java
OuterClass outerObject = new OuterClass();
OuterClass.InnerClass innerObject = outerObject.new InnerClass();
```



**Inner Classes 셍성**

```java
class A{
	class B{
		B() {} //생성자
    int field; // 인스턴스 필드 가능
    void method(){} // 인스턴스 메소드 가능
    
    static in field2; // 정적 필드 불가능
    static void method2(){} // 정적 메소드 불가능
	}
}
```



**사용 예시**

```java
// 먼저 A 객체를 생성
A a = new A();
// B 객체 생성
A.B b = a.new B();
b.field = 3;
b.mehtod();
```



## 2.2 정적 멤버 클래스(static nested class)

* `static` 키워드로 선언된 중첩 클래스를 말한다.
* static nested class는 외부 클래스와 연결되어있다.
  * A 클래스로 바로 접근할 수 있는 B 중첩 클래스
* 정적 클래스 메서드와 마찬가지로 static nested class는 외부 클래스에 정의된 인스턴스 변수 또는 메서드를 직접 참조할 수 없다
  * 객체 참조를 통해서만 사용할 수 있다.
* 인스턴스 멤버 클래스와 달리 모든 종류의 필드와 메서드를 선언할 수 있다

```java
class A{
	static classB{
		B() {} //생성자
    int field; // 인스턴스 필드 가능
    void method(){} //인스턴스 메소드 가능
    
    static in field2; // 정적 필드 가능
    static void method2(){} //정적 메소드 가능
	}
}
```



**사용 예시**

```java
// B 객체 생성
A.B b = new A.B();
b.field = 3;
b.mehtod();
```



# 3 로컬 클래스

* **메소드 내부**에 선언되는 중첩 클래스를 **로컬 클래스**라고 한다.
* 메소드 실행 시에만 사용되고, 메소드가 종료되면 없어진다.
* 로컬 클래스는 접근 제한자 및 static을 붙일 수 없다.
  * 메소드 내부에서만 사용하므로 접근을 제한할 필요가 없다.

```java
class A{
	void method(){
    class B{
      B() {} //생성자
      int field; // 인스턴스 필드 가능
      void method(){} // 인스턴스 메소드 가능
    
      static in field2; // 정적 필드 불가능
      static void method2(){} // 정적 메소드 불가능
    }
    
    // 로컬 클래스 사용
    B b = new B();
    b.field = 3;
    b.method();
  }
}
```



## 3.1 외부 클래스 멤버 접근

* 로컬 클래스는 외부 클래스 멤버에 접근이 가능하다
* 로컬 클래스는 로컬 변수와 메소드의 파라미터에 접근도 가능하다
  * 로컬 클래스의 객체는 메소드 실행이 끝나도 힙 메모리에 존재해서 계속 사용할 수 있다. 그러나 로컬 변수와 매개 변수는 메소드 실행이 끝나면 스택 메모리에서 사라져 로컬 객체에서 사용할 경우 문제가 된다.
  * 이 문제를 해결하기 위해 컴파일 시 로컬 클래스에서 사용하는 매개 변수나 로컬 변수의 값을 로컬 클래스 내부에 복사해 두고 사용한다.
  * 매개 변수나 로컬 변수가 수정되어 값이 변경되면 로컬 클래스에 복사해둔 값과 달라지는 문제를 해결하기 위해 매개 변수나 로컬 변수를 final로 선언해서 수정을 막는다.
  * 즉 final로 선언된 로컬 변수와 매개변수를 사용할 수 있다.

* 자바 8이후 final로 선언하지 않아도 로컬 변수가 `effectively final`이라면 접근 가능하다.
  * `effectively final`: 변수 혹은 파라미터가 초기화 이후 변하지 않은 경우
  * final 키워드가 있다면 로컬 클래스의 메소드 내부에 지역 변수로 복사
  * final 키워드가 없다면 로컬 클래스의 필드로 복사된다.



# 4 중첩 클래스 접근 제한



## 4.1 바깥 필드와 메소드에서 사용 제한

* 바깥 클래스에서 내부 클래스에 대한 접근 제한을 알아보자
* 외부 클래스 -> 인스턴스 멤버 클래스
  * 외부 클래스에서 인스턴스 필드나 인스턴스 메소드에서 인스턴스 멤버 클래스 객체 생성 가능
  * 외부 클래스에서 정적 필드나 정적 메소드에서 인스턴스 멤버 클래스 객체 생성 불가능
* 외부 클래스 -> 정적 멤버 클래스
  * 외부 클래스에서 인스턴스 필드나 인스턴스 메소드에서 정적 멤버 클래스 객체 생성 가능
  * 외부 클래스에서 정적 필드나 정적 메소드에서 정적 멤버 클래스 객체 생성 가능

```java
public class A {
  // 인스턴스 필드 
  B f1 = new B();	// 인스턴스 멤버 클래스 가능
  C f2 = new C(); // 정적 멤버 클래스 가능
  
  // 정적 필드 
  static B f3 = new B(); // 인스턴스 멤버 클래스 불가능
  static C f4 = new C(); // 정적 멤버 클래스 가능
  
  // 인스턴스 메소드
  void method1(){
    B var1 = new B(); // 인스턴스 멤버 클래스 가능
    C var2 = new C(); // 정적 멤버 클래스 가능
  }
 	
  // 정적 메소드
  static void method2(){
    B var1 = new B();	// 인스턴스 멤버 클래스 불가능
    C var2 = new C(); // 정적 멤버 클래스 가능
  }
  
  class B {}
  
  static class C {}
}
```



## 4.2 멤버 클래스에서 사용 제한

* 내부 클래스에서 바깥 클래스의 필드와 메소드에 대한 접근 제한을 알아보자
* 인스턴스 멤버 클래스 -> 외부 클래스
  * 모든 필드와 메소드 접근가능
* 정적 멤버 클래스 -> 외부 클래스
  * 외부 클래스의 정적 필드와 정적 메소드 접근 가능
  * 외부 클래스의 인스턴스 필드와 인스턴스 메소드 접근 불가능





참조

* [이것이 자바다](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788968481475)
* https://docs.oracle.com/javase/tutorial/java/javaOO/nested.html
* https://docs.oracle.com/javase/tutorial/java/javaOO/localclasses.html