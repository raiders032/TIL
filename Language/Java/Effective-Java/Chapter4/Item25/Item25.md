# 1 톱레벨 클래스는 한 파일에 하나만 담으라

- 소스 파일 하나에 톱레벨 클래스를 여러개 선언해도 컴파일 오류가 나지 않는다.
- 하지만 아무런 득이 없고 심각한 위험이 있을 수 있다.
- 한 클래스를 여러 가지로 정의할 수 있으며 그중 어느 것을 사용할지는 어느 소스 파일을 먼저 컴파일하냐에 따라 달라지기 때문이다.



# 2 예시

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(Utensil.NAME + Dessert.NAME);
    }   
}
```



Utensil.java라는 한 파일에 두 개의 톱레벨 클래스가 정의되어 있다.

```java
class Utensil {
    static final String NAME = "pan";
}

class Dessert {
    static final String NAME = "cake";
}
```



Dessert.java라는 한 파일에 두 개의 톱레벨 클래스가 정의되어 있다.

```java
class Utensil {
    static final String NAME = "pot";
}

class Dessert {
    static final String NAME = "pie";
}
```



# 3 문제 상황

- 컴파일 순서에 따라 컴파일 오류가 발생하기도 하며 실행 결과가 달라지기도 한다.



`javac Main.java Dessert.java`

- 먼저 `Main.java` 컴파일한다.
- `System.out.println(Utensil.NAME + Dessert.NAME);` 구문을 만나면
  -  Dessert보다 참조가 먼저 나오는 `Utensil.java`를 컴파일한다.
  - `Utensil.java` 파일을 살펴 `Utensil`과 `Dessert` 모두 찾아낸다.
- 2번째 인수로 넘어온 `Dessert.java`을 컴파일 하려고 할 때 같은 클래스가 이미 정의되어 있는 것을 알게된다.



`javac Main.java or javac Main.java Utensil.java`

- 결과로 `pancake`을 출력한다.



`javac Dessert.java Main.java`

- 결과로 `potpie`를 출력한다.



# 4 해결책

- 해결책은 간단하다 톱레벨 클래스들을 서로 다른 소스 파일로 분리하면 된다.
- 여러 톱레벨 클래스를 한 파일에 담고 싶다면 정적 멤버 클래스를 사용을 고민해보자.