# 1 Anonymous Class

* 익명 클래스를 사용하면 코드를 보다 간결하게 만들 수 있다.
* 별도의 소스파일을 작성하는 일 없이 클래스를 선언하고 동시에 인스턴스화할 수 있다.
* 이름이 없다는 점을 제외하면 로컬 클래스와 같다
* **로컬 클래스를 한 번만 사용해야 하는 경우 Anonymous Class를 사용하자.**
* Anonymous Class를 선언하면 자바 컴파일러가 자동으로 클래스 파일을 만들어준다.
  * 자바 컴파일러가 자동으로 클래스 파일을 만들어준다.
  * 자동으로 만들어진 클래스 이름: `인터페이스이름$1`
    * 인터페이스 이름 뒤에 $가 붙고 생성 번호가 붙는다
    * 생성 번호는 1부터 시작 두번째 익명 구현 객체를 만들면 생성번호는 2가 된다.
* 익명 클래스는 둘 이상의 메서드를 포함하는 인터페이스를 구현하는 데 이상적이다
  * 만약 하나의 메소드를 가진 인터페이스라면 익명 클래스보다 **람다 expression**를 이용하자



# 2 Anonymous Class 선언하기

* HelloWorld 인터페이스를 구현하는 이름없는 클래스 선언

```java
public class HelloWorldAnonymousClasses {

  interface HelloWorld {
    public void greet();
    public void greetSomeone(String someone);
  }

  public void sayHello() {

    // local class
    class EnglishGreeting implements HelloWorld {
      String name = "world";
      public void greet() {
        greetSomeone("world");
      }
      public void greetSomeone(String someone) {
        name = someone;
        System.out.println("Hello " + name);
      }
    }

    HelloWorld englishGreeting = new EnglishGreeting();

    // Anonymous Classe 선언과 동시에 인스턴스화
    HelloWorld frenchGreeting = new HelloWorld() {
      String name = "tout le monde";
      public void greet() {
        greetSomeone("tout le monde");
      }
      public void greetSomeone(String someone) {
        name = someone;
        System.out.println("Salut " + name);
      }
    };

    // Anonymous Classe 선언과 동시에 인스턴스화
    HelloWorld spanishGreeting = new HelloWorld() {
      String name = "mundo";
      public void greet() {
        greetSomeone("mundo");
      }
      public void greetSomeone(String someone) {
        name = someone;
        System.out.println("Hola, " + name);
      }
    };
    englishGreeting.greet();
    frenchGreeting.greetSomeone("Fred");
    spanishGreeting.greet();
  }

  public static void main(String... args) {
    HelloWorldAnonymousClasses myApp =
      new HelloWorldAnonymousClasses();
    myApp.sayHello();
  }            
}
```



# 3 Syntax of Anonymous Classes

* Anonymous Class의 문법은 생성자와 유사하다.
  * 차이점은 {} 블록에 클래스 정의를 작성한다.
* anonymous class의 구성 요소
  * new 키워드
  * 구혈할 인터페이스 이름 또는 상속할 클래스 이름: `HelloWorld`
  * `()`: 생성자 아규먼트 
    * 인터페이스를 구현할 경우 생성자가 없기 때문에 예시 처럼 `()`안을 비워놓는다.
  * `{}`: 클래스 정의를 작성하는 코드 블록

```java
HelloWorld frenchGreeting = new HelloWorld() {
  String name = "tout le monde";
  
  public void greet() {
    greetSomeone("tout le monde");
  }
  
  public void greetSomeone(String someone) {
    name = someone;
    System.out.println("Salut " + name);
  }
};
```



# 4 외부 멤버 접근 제한

* 로컬 클래스와 같은 외부 클래스 멤버에 접근 제한을 갖는다.
  * 이름이 없다는 점을 제외하면 로컬 클래스와 같다
  * [로컬 클래스 참고](../Nested-Class/Nested-Class.md)

* 익명 클래스는 외부 클래스의 멤버(필드와 메소드)에 접근 가능하다.
* 익명 클래스는 외부 스코프의 final(또는 effectively final)인 로컬 변수와 매개 변수에 접근이 가능하다
* 중첩 클래스와 마찬가지로 익명 클래스의 변수가 같은 이름의 외부 스코프 변수를 가린다.
* 선언 불가능한 것
  * static initializer와 멤버 인터페이스를 선언할 수 없다.
* 선언 가능한 것
  * 필드
  * 메소드
  * Instance initializers
  * 로컬 클래스



참고

* https://docs.oracle.com/javase/tutorial/java/javaOO/anonymousclasses.html
* 이것이 자바다(이상민 저)

