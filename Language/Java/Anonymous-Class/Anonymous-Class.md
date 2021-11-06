# 1 Anonymous Class

* 익명 클래스를 사용하면 코드를 보다 간결하게 만들 수 있다.
* 별도의 소스파일을 작성하는 일 없이 클래스를 선언하고 동시에 인스턴스화할 수 있다.
* 이름이 없다는 점을 제외하면 로컬 클래스와 같습니다. 
* 로컬 클래스를 한 번만 사용해야 하는 경우 Anonymous Class를 사용하자.
* Anonymous Class를 선언하면 자바 컴파일러가 자동으로 클래스 파일을 만들어준다.
  * 자바 컴파일러가 자동으로 클래스 파일을 만들어준다.
  * 자동으로 만들어진 클래스 이름: `인터페이스이름$1`
    * 인터페이스 이름 뒤에 $가 붙고 생성 번호가 붙는다
    * 생성 번호는 1부터 시작 두번째 익명 구현 객체를 만들면 생성번호는 2가 된다.



# 2 Anonymous Classe 선언하기

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
  * 구혈할 인터페이스 이름 또는 상속할 클래스 이름
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



참고

* https://docs.oracle.com/javase/tutorial/java/javaOO/anonymousclasses.html