# 1 Generic

* 자바 5부터 Generic이 추가되었다.
* 제네릭은 컬렉션, 람다식, 스트림, NIO에서 널리 사용된다.
* 제네릭은 클래스, 인터페이스, 메소드를 정의할 때 **타입을 파라미터로 사용**할 수 있도록한다.
* 타입 파라미터는 코드 작성 시 구체적인 타입으로 대체되어 다양한 코드를 생성하도록 한다.



## 1.1 Generic을 사용하는 이유

**컴파일 시 강한 타입 체크**

* 제네릭 타입을 사용하면 잘못된 타입이 사용될 수 있는 문제를 컴파일 과정에서 제거할 수 있다.
* 런타임 오류를 수정하는 것보다 컴파일 시간 오류를 수정하는 것이 더 쉽다

**타입 변환을 제거**

* 불필요한 타입 변환을 하지 않기 때문에 성능 향상

```java
// 제네릭 사용 X
List list = new ArrayList();
list.add("hello");
String s = (String) list.get(0);


// 제네릭 사용
ArrayList<String> list = new ArrayList<>();
list.add("hello");
String s = list.get(0);
```



# 2 Generic Type

* `Generic Type`은 타입을 파라미터로 가지는 클래스와 인터페이스를 말한다.
  * 즉 `Type Parameter` 를 가진 클래스와 인터페이스를 말한다.

* 선언시 클래스 또는 인터페이스 이름 뒤에 "< >"부호가 붙는다.
* `< >` 사이에 `type parameter`가 위치한다.

```java
class name<T1, T2, ..., Tn> { /* ... */ }
public interface 인터페이스명<T> { ... }
```



## 2.1 Type Parameter(Type Variable)

- 실제 사용 코드에서는 Type Parameter 자리에 구체적인 타입을 인자로 주어야 한다.
  - 메소드 정의시 파라미터를 선언하고 실제 메소드를 호출 할 때 인자를 넘겨주는 것과 같다.
  - 제네릭과 비교하면 메소드의 파라미터가 제네릭의 Type Parameter와 상응하고 메소드의 인자는 제네릭의  `type argument` 와 상응된다.
  - 컴파일러가  `type argument` 받은 타입으로 클래스를 재구성해준다.
  
- `Type Parameter`의 구체적인 타입은 기본 타입을 제외한 모든 종류가 가능하다
  - class type, interface type, array type, type variable 가능

```java
public class Box<T> {
  private T t;
  public T get() { return t; }
  public void set(T t) { this.t = t }
}
```

**`type parameter` T에 `type argument`로 String 사용**

```java
Box<String> box = new Box<>();
```

```java
// 재구성된 Box 클래스
public class Box<String> {
  private String t;
  public String get() { return t; }
  public void set(String t) { this.t = t }
}
```

**`type parameter` T에 `type argument`로 Integer 사용**

```java
Box<Integer> box = new Box<>();
```

```java
// 재구성된 Box 클래스
public class Box<Integer> {
  private Integer t;
  public Integer get() { return t; }
  public void set(Integer t) { this.t = t }
}
```



## 2.2 Type Parameter Naming Convention

* 일반적으로 `Type Parameter`의 이름은 대문자 알파벳 한 문자로 표현한다.

```
E - Element (used extensively by the Java Collections Framework)
K - Key
N - Number
T - Type
V - Value
S,U,V etc. - 2nd, 3rd, 4th types
```



## 2.3 Generic Type Invocation과 초기화

**Box.java**

```java
public class Box<T> {
  private T t;
  public T get() { return t; }
  public void set(T t) { this.t = t }
}
```

* 코드에서 제네릭 클래스를 참조하기 위해 *generic type invocation*이 필요하다.
  * generic type invocation이란 클래스에 `type argument`를 전달하는 것이다. 
  * 마치 메소드에  argument를 전달하는 것과 같다.

**generic type invocation 예시**

```java
// Generic Type invocation
// 여기서 type parameter는 T이고 type argument는 Integer이다.
Box<Integer> integerBox;

// Generic Type invocation과 초기화 동시에 진행
Box<Integer> integerBox = new Box<Integer>();

// 자바 7이후 아래와 같이 type argument 생략해서 사용 가능
Box<Integer> integerBox = new Box<>();
```



# 4 Generic 메소드

* 제네릭 메소드는 `Type Parameter`를 갖는 메소드를 말한다.
* 클래스 혹은 인테페이스 전체 레벨에 `Type Parameter` 를 설정하는 것이 아니라 하나의 메소드에만 `Type Parameter` 를 지정하고 싶을 때 Generic 메소드 사용

**제네릭 메소드 선언 방법**

```java
 public <타입파라미터,...> 리턴타입 메소드명(매개변수,...) { ... }
 public <T> Box<T> boxing(T t) { ... }
```

- 리턴 타입 앞에 angle bracket(`< >`)을 추가하고 그 안에 `Type Parameter`를 기술한다.
- `Type Parameter`를 리턴타입과 매개변수에 사용한다.
  - 리턴 타입: `Box<T>`
  - 매개 변수:  `T`

**제네릭 메소드 호출**

```java
Box<Integer> box = <Integer>boxing(100); //type argument를 명시적으로 지정
Box<Integer> box = boxing(100);  //type argument 생략 가능 컴파일러가 추론한다.
```



# 5 제한된 타입 파라미터(Bounded Type Parameters)

* `Type Parameter` 이 받는 `type argument`를 특정한 타입으로 제한하고 싶은 경우 Bounded Type Parameter를 사용한다.
  * 수와 관련된 일을 하는 메소드는 Number 클래스 또는 그 하위 클래스의 인스턴스를 받길 원한다.
  * 이러한 경우  `type argument`로 Number 클래스 또는 그 하위 클래스로 제한할 수 있다.



## 5.1 Bounded Type Parameter 정의

```java
public <T extends 상위타입> 리턴타입 메소드(매개변수, ...) { ... }
```

* 상위 타입은 클래스 뿐만 아니라 인터페이스도 가능하다. 
  * 인터페이스라고 해서 extends 대신 implements를 사용하지 않는다.
* 주의할 점
  * 메소드의 중괄호 {} 안에서 타입 파라미터 변수로 사용 가능한 것은 상위 타입의 멤버(필드, 메소드)로 제한된다.
  * 하위 타입에만 있는 필드와 메소드는 사용할 수 없다.
  * 상위타입으로 타입 파라미터를 제한시킨 상태에서 하위 타입의 멤버를 사용하면, 상위타입이 들어올 경우 에러가 발생한다.



**예시1**

* inspect 메소드에 Bounded Type Parameter 적용
* Number 클래스 또는 그 하위 클래스로 `type argument`를 제한함
* `integerBox.inspect("some text");`
  * String 클래스는 Number 클래스 또는 그 하위 클래스가 아니기 때문에 컴파일 에러
  * 컴파일 과정에서 에러를 체크할 수 있는 제니릭의 장점

```java
public class Box<T> {

    private T t;          

    public void set(T t) {
        this.t = t;
    }

    public T get() {
        return t;
    }

    public <U extends Number> void inspect(U u){
        System.out.println("T: " + t.getClass().getName());
        System.out.println("U: " + u.getClass().getName());
    }

    public static void main(String[] args) {
        Box<Integer> integerBox = new Box<Integer>();
        integerBox.set(new Integer(10));
        integerBox.inspect("some text"); // error: this is still String!
    }
}
```



**예시2**

* 타입 제한 기능과 더불어 제한시킨 타입의 메소드를 호출 할 수 있다.
* NaturalNumber 클래스에 Bounded Type Parameter 적용
* Integer 클래스 또는 그 하위 클래스로 `type argument`를 제한함
* T(Type Parameter)를 통해 Integer 클래스의 메소드 호출 가능
  * `n.intValue()`

```java
public class NaturalNumber<T extends Integer> {

    private T n;

    public NaturalNumber(T n)  { this.n = n; }

    public boolean isEven() {
        return n.intValue() % 2 == 0;
    }
}
```



## 5.2 Multiple Bounds

* 아래와 같이 바운드는 하나 이상 지정 가능하다.
  * `<T extends B1 & B2 & B3>`
* 바운드 중 하나가 클래스라면 맨 처음에 기입해줘야 한다.

```java
Class A { /* ... */ }
interface B { /* ... */ }
interface C { /* ... */ }

// ok
class D <T extends A & B & C> { /* ... */ }

// compile-time error: A는 클래스이기 때문에 맨 처음 기입해야한다.
class D <T extends B & A & C> { /* ... */ }
```



# 6 Generic과 Subtype

**예시1**

```java
Object someObject = new Object();
Integer someInteger = new Integer(10);
someObject = someInteger;   // OK
```

* 위와 같이 상위 클래스(Object) 참조 변수로 하위 클래스(Integer) 객체를 참조할 수 있다는 것을 알고 있을 것이다.
* 이러한 두 클래스간의 관계를 객체 지향 용어로  `is a` 관계라고 한다.
  * Integer is a Object

**예시2**

```java
// Number를 type argument로 Generic Type Invocation
Box<Number> box = new Box<Number>();

// Integer is a Number 관계이므로 OK
box.add(new Integer(10));

// Double is a Number 관계이므로 OK
box.add(new Double(10.1));
```

* 제네릭에서도 위와 같은 코드가 가능하다.

**예시3**

```java
public void boxTest(Box<Number> n) { /* ... */ }

// 불가능 Box<Integer>는 Box<Number>의 서브 타입이 아니다
box.boxTest(new Box<Integer>());
```

* boxTest 메소드는 어떤 타입의 아규먼트를 허용할까?
  * `Box<Integer>` 또는 `Box<Double>` 를  아규먼트로로 사용할 수 있을까?
  * 정답은  No!

* `Box<Integer>`와 `Box<Double>` 는 `Box<Number>`의 서브 타입이 아니므로 아규먼트로 사용할 수 없다
* `Integer` 와 `Double`이  `Number` 의 서브타입 일지라도 `Box<Integer>`와   `Box<Double>`이 `Box<Number>`의 서브 타입이 아니다

![generics-subtypeRelationship](https://docs.oracle.com/javase/tutorial/figures/java/generics-subtypeRelationship.gif)



# 7 Wildcard

* 제네릭 코드에서 `?` 를 와일드 카드라고 부른다.
* `Generic Type` 을 매개 변수나 리턴 타입으로 사용할 때 구체적인 타입 대신 와일드 카드를 사용한다.
* 와일드 카드는 세 가지 형태로 사용된다.
  * Upper Bounded Wildcard, Unbounded Wildcard, Lower Bounded Wildcard
  * Upper Bounded Wildcard: `<? extends 타입>`
  * Unbounded Wildcard: `<?>`
  * Lower Bounded Wildcard: `<? super 타입>`




## 7.1 Upper Bounded Wildcard

* Upper Bounded Wildcard 정의: `<? extends 타입>`
* `Type Argument`로 타입이나 타입의 하위 타입만 올 수 있다



**예시**

* `List<Number>` 와 List<? extends Number>의 차이점
* `List<Number>`는 오로지 `List<Number>`로만 초기화 가능
* `List<? extends Number>` 는`List<Integer>`, `List<Double>`로 초기화 가능

```java
public static double sumOfList(List<? extends Number> list) {
    double s = 0.0;
    for (Number n : list)
        s += n.doubleValue();
    return s;
}
```

```java
List<Integer> li = Arrays.asList(1, 2, 3);
System.out.println("sum = " + sumOfList(li)); // sum = 6.0
```

```java
List<Double> ld = Arrays.asList(1.2, 2.3, 3.5);
System.out.println("sum = " + sumOfList(ld));	// sum = 7.0
```



## 7.2 Unbounded Wildcard

* Unbounded Wildcard 정의: `<?>`



**Unbounded Wildcard가 유용한 경우1**

* 순수하게 Object 클래스에 제공된 기능만을 사용하여 메서드를 작성하는 경우
  * 아래의 코드는 리스트의 원소를 가지고 Object의 equals 메소드만 사용하기 때문에 Unbounded Wildcard를 사용할 수 있다.

```java
static <T> long frequency(List<T> list, T elem) {
    return list.stream().filter(s -> s.equals(elem)).count();
}
```

* 위에 코드를 아래와 같이 변경 가능하다

```java
static long frequency(List<?> list, Object elem) {
  return list.stream().filter(s -> s.equals(elem)).count();
}
```



**Unbounded Wildcard가 유용한 경우2**

* 제네릭 클래스의 메소드를 사용할 때 메소드가 type parameter의 의존적이지 않은 경우 Unbounded Wildcard를 사용한다.
  * 예) `List.size()`, `List.clear()`

```java
static <T> boolean isEmpty(List<T> list){
  return list.size() == 0;
}
```

* 위에 코드 대신 아래와 같이 Unbounded Wildcard를 사용하는 것이 좋다.

```java
static boolean isEmpty(List<?> list) {
	return list.size() == 0;
}
```



**예시2**

* 임의의 타입의 리스트를 출력하는 메소드 printList를 만들고 싶다.
* 아래의 예제로 `List<Integer>`, `List<String>`, `List<Double>` 등을 출력할 수 없다.
* `List<Integer>`, `List<String>`, `List<Double>` 가 `List<Object>`의 서브 타입이 아니기 때문
* 오로지  `List<Object>`만 출력 가능하다.

```java
public static void printList(List<Object> list) {
    for (Object elem : list)
        System.out.println(elem + " ");
    System.out.println();
}
```

* 모든 타입의 리스트를 출력하는 메소드로 동작하기 위해 Unbounded Wildcard를 사용해보자.
* 임의의 콘트리트 타입 A에 대해서 `List<A>` 는 `List<?>` 의 서브 타입이다.
* 즉  `List<Integer>`,  `List<String>`가  `List<?>` 의 서브 타입이므로 출력이 가능하다.

```java
public static void printList(List<?> list) {
    for (Object elem: list)
        System.out.print(elem + " ");
    System.out.println();
}
```

```java
List<Integer> li = Arrays.asList(1, 2, 3);
List<String>  ls = Arrays.asList("one", "two", "three");
printList(li);
printList(ls);
```



## 7.3 Lower Bounded Wildcard

* Lower Bounded Wildcard 정의: `<? super 타입>`
* `Type Argument`로 타입이나 타입의 상위 타입만 올 수 있다



**예시**

* Integer 객체를 리스트에 넣는 메소드를 만들고 싶다.
* 유연성을 최대화 하기위해  Interger의 상위 클래스도 커버하고 싶다면 아래와 같이 Lower Bounded Wildcard를 사용하면 된다.
  * `List<Number>`, `List<Object>`

```java
public static void addNumbers(List<? super Integer> list) {
    for (int i = 1; i <= 10; i++) {
        list.add(i);
    }
}
```



# 8 Generic Type의 상속과 구현

**제네릭 클래스를 부모 클래스로 사용할 경우**

- 자식 클래스에도 `Type Parameter`를 기술해야 한다.

  ```
  public class ChildProduct<T,M> extends Product<T,M> { ... }
  ```

- 추가적인 `Type Parameter`를 가질 수 있다.

  ```
  public class ChildProduct<T,M,C> extends Product<T,M> { ... }
  ```



**제네릭 인터페이스를 구현할 경우**

- 구현 클래스에도 `Type Parameter`를 기술해야 한다.

  ```
  public class StorageImpl<T> implements Storage<T> { ... }
  ```



참고

* 이것이 자바다(이상민 저)
* https://docs.oracle.com/javase/tutorial/java/generics/index.html