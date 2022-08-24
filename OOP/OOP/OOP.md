

# 1 OOP란?

> 객체 지향 프로그래밍은 컴퓨터 프로그램을 명령어의 목록으로 보는 시각에서 벗어나 여러 개의 독립된 단위, 즉 "객체"들의 모임으로 파악하고자 하는 것이다. 각각의 객체는 메시지 를 주고받고, 데이터를 처리할 수 있다.

- 객체 지향 프로그래밍은 프로그램을 **유연**하고 **변경**이 용이하게 만들기 때문에 대규모 소프 트웨어 개발에 많이 사용된다.



# 2 OOP의 특성

* encapsulation
* inheritance
* polymorphism
* abstraction
* association
* composition
* aggregation



## 2.1 Encapsulation

* 객체의 상태가 외부로부터 숨겨진 상황에서 이 상태에 접근하는 일련의 공개 메서드만 노출하는 기법을 `캡슐화`라고 합니다.
* 캡슐화는 객체의 상태를 비공개로 유지할 때 성립한다.
* 캡슐화를 정보 은닉이라고 부른다.
* 자바에서는 접근 제어자를 통해 캡슐화를 달성할 수 있다
  * [Access-Modifier.md](../../Language/Java/Access-Modifier/Access-Modifier.md) 참고




**캡슐화의 이점**

- 느스한 결합
- 재사용성
- 보안 및 테스트를 하기 쉬운 코드



## 2.2 Inheritance

* 상속
* 이미 존재하는 객체(클래스)를 기반으로 확장된 객체(클래스)를 만드는 방법
* 확장된 객체란?
  * 기존의 개체에 속한 데이터와 동작을 모두 물려 받는다.
  * 여기에 다른 데이터와 동작을 추가할 수 있다.
* 상속은 `IS-A` 관계라고 한다.
* 상속된 객체는 `슈퍼클래스` 또는 `부모 클래스`라고 하고 상속 받는 객체는 `서브클래스` 또는 `자식 클래스`라고 한다.



**상속의 이점**

* 코드 중복을 막는다.



## 2.3 Polymorphism

* 다형성
* 많은 사람들이 OOP의 핵심이라고 여긴다.
* **`같은 지시`를 내렸는데 다른 종류의 객체가 `동작을 달리`하는 것을 다형성이라고 한다.**
* 만약 절차적 언어 였다면 if 문을 사용해 각각 동작을 달리 했을 것이다.
* 다형성은 컴파일 타임 다형성과 런타임 다형성 두 종류로 구분된다.



**컴파일 타임 다형성**

- 컴파일 타임 다형성은 메서드 오버로딩으로 구현된다.
- 메서드 오버로딩은 이름은 동일하지만 매개변수가 다른 메서드를 말한다.
- 컴파일러가 오버로딩된 메서드 가운데 어떤 형식을 호출할지 컴파일 타임에 식별할 수 있으므로 `컴파일 타임 다형성`이라 부른다.



**런타임 다형성**

* 어떤 함수 구현이 실행될지는 실행중에 결정된다.
* 런타임 다형성은 상속 또는 인터페이스 구현으로 달성할 수 있다



> **주의점**
>
> 객체지향 프로그래밍에서 다형성을 가장 중요한 개념으로 여기는 사람들이 있다. 특히 런타임 다형성을 유일한 다형성이라고 여기는 주장도 있다. 



## 2.4 Abstraction

* 문헌에 따라 `데이터 추상화` 또는 `추상화` 라고 한다.
* 추상화는 사용자와 관련 있는 내용만 노출하고 나머지 세부 내용은 숨기는 개념이다.
* 추상화를 통해 사용자는 일을 수행하는 방법이 아니라 일 자체에 집중할 수 있다
* 다형성을 얻기위해 추상화가 필요하다.
  * 추상클래스나 인터페이스를 사용해 추상화 하면 다형성을 사용할 수 있다.



**추상화의 이점**

- 클라이언트는 고수준의 공개 API만 알고 세부 구현 사항을 모르기 때문의 클라이언트와 서버 사이의 결합도가 낮아진다.
- 결합도가 낮기 때문에 서버는 API를 그대로 두고 세부 구현 사항을 변경해도 클라이언트의 영향이 없다.



## 2.5 Association

* 연관은 서로 독립적인 두 클래스 간의 관계를 의미한다.
* 두 클래스는 독집적인 자체 수명을 가진다.
* 연관에는 소유 관계가 없다.



**연관 관계 예시**

- 한 명의 Person이 여러개의 Address와 연관될 수 있으며 하나의 Address가 여러개의 Person과 연관될 수 있다
- Person과 Address 객체는 양방향 다대다 관계가 있다.
- Person는 Address 없이 존재할 수 있고 Address도 Person 없이 존재할 수 있다.
  - 독립적인 자체 수명을 가짐



**Person 클래스**

```java
public class Person {
    private String name;

    public Person(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```



**Address 클래스**

```java
public class Address {
    private String city;
    private String zip;

    public Address(String city, String zip) {
        this.city = city;
        this.zip = zip;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }
}
```



**Main 클래스**

- 메인 클래스에서 Person과 Address의 연관 관계가 성립한다.

```java
public class Main {
    public static void main(String[] args) {
        Person p1 = new Person("Andrei");
        Person p2 = new Person("Marin");
        Address a1 = new Address("Banesti", "107050");
        Address a2 = new Address("Bucuresti", "229344");

        // 메인 메서드에서의 두 클래스 간 연관(Association) 관계
        System.out.println(p1.getName() + " lives at address "
          + a2.getCity() + ", " + a2.getZip()
          + " but it also has an address at "
          + a1.getCity() + ", " + a1.getZip());
        System.out.println(p2.getName() + " lives at address "
          + a1.getCity() + ", " + a1.getZip()
          + " but it also has an address at "
          + a2.getCity() + ", " + a2.getZip());
    }
}
```



## 2.7 Aggregation

* Aggregation을 집약이라고 부른다.
* Aggregation은 단방향 연관 관계이다.
* 두 객체 사이에 소유 관계가 있으며 이를 `HAS-A` 관계가 있다라고 한다.
* 두 객체는 자체 수명 주기를 가지고 있다.



**Aggregation 예시**

- TennisPlayer는 Racket을 소유하고 있다.
- Racket이 TennisPlayer를 사용할 수 없으므로 단방향 연관관계다.
- TennisPlayer가 죽어도 Racket은 영향을 받지 않는다.
  - 두 객체는 자체 수명 주기를 가지고 있다.



TennisPlayer 클래스

```java
public class TennisPlayer {
    private String name;
    private Racket racket;

    public TennisPlayer(String name, Racket racket) {
        this.name = name;
        this.racket = racket;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Racket getRacket() {
        return racket;
    }

    public void setRacket(Racket racket) {
        this.racket = racket;
    }
}
```



**Racket 클래스**

```java
public class Racket {
    private String type;
    private int size;
    private int weight;

    public Racket(String type, int size, int weight) {
        this.type = type;
        this.size = size;
        this.weight = weight;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public int getWeight() {
        return weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }
}
```



**Main 클래스**

```java
public class Main {
    public static void main(String[] args) {
        Racket racket = new Racket("Babolat Pure Aero", 100, 300);
        TennisPlayer player = new TennisPlayer("Rafael Nadal", racket);

        System.out.println("Player " + player.getName() + " plays with " + player.getRacket().getType());
    }
}
```





## 2.6 Composition

* Composition은 더 제한적인 Aggregation 관계를 의미합니다.
* Aggregation은 두 객체가 자체 생명 주기를 가지는 두 객체의 `HAS-A` 관계를 의미한다면, Composition은 단독으로 존재할 수 없는 객체를 포함하는 `HAS-A` 관계를 의미합니다.



**Composition 예시**

- Car가 파괴되면 Engine도 파괴된다고 했을 때 Car와 Engine은 Composition 관계입니다. 



**Car 클래스**

```java
public class Car {
    private final String name;
    private final Engine engine;

    public Car(String name) {
        this.name = name;

        Engine engine = new Engine("petrol", 300);
        this.engine=engine;
    }

    public int getHorsepower() {
        return engine.getHorsepower();
    }
    
    public String getName() {
        return name;
    }    
}
```



**Engine 클래스**

```java
public class Engine {
    private String type;
    private int horsepower;

    public Engine(String type, int horsepower) {
        this.type = type;
        this.horsepower = horsepower;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getHorsepower() {
        return horsepower;
    }

    public void setHorsepower(int horsepower) {
        this.horsepower = horsepower;
    }        
}
```



**Main 클래스**

```java
public class Main {
    public static void main(String[] args) {
        Car car = new Car("MyCar");

        System.out.println("Horsepower: " + car.getHorsepower());
    }
}
```



**참고**

- [자바 코딩 인터뷰 완벽 가이드](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9791157688197&orderClick=&Kc=)
