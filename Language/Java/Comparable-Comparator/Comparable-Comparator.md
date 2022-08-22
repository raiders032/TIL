# 1 Comparable Interface

* 어떠한 클래스를 정렬하려면 `Comparable` 인터페이스를 구현해야한다
  * `Integer`, `String`, `Doulble` 모두 `Comparable` 인터페이스를 구현했다
  * 사용자 정의 클래스도 정렬이 필요하다면 `Comparable` 인터페이스를 구현하면 된다
* Comparable을 구현하지 않은 원소의 리스트를 정렬하는 경우 ClassCastException이 발생한다.
  * Collections.sort(list)
* Comparable은 구현한 클래스의 자연스러운 순서를 의미한다.
  * 예) String 클래스는 Comparable를 사전순으로 구현했다.



**Comparable Interface**

```java
public interface Comparable<T> {
      public int compareTo(T o);
}
```

`compareTo(T o)`

* 주어진 객체와 같으면 0 반환
* 주어진 객체보다 적으면 음수 반환
* 주어진 객체보다 크면 양수 반환
* 주어진 객체와 비교할 수 없으면 ClassCastException 발생



**구현 예시**

```java
public class Person implements Comparable<Person> {
    public String name;
    public int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public int compareTo(Person o) {
        if(age < o.age) return -1;
        else if(age == o.age) return 0;
        else return 1;
    }
}
```



# 2 Comparator Interface

* `Comparator`는 `Comparable` 를 구현하지 않은 객체를 정렬할 때 사용된다
  * **정렬자**를 제공하면 된다
  * `Collections.sort(list, comparator)`
  * comparator로 list의 원소를 비교할 수 없으면 ClassCastException 발생
* 또한 Comparable를 구현한 객체의 정렬 방식과 다르게 정렬하고 싶을 때 사용한다.
  * String은 Comparable를 사전순으로 구현했지만 사전순이 아닌 다른 방식으로 String을 정렬하고자 할 때 Comparator를 사용한다.



**Comparator 인터페이스**

```java
@FunctionalInterface
public interface Comparator<T> {
  int compare(T o1, T o2);
}
```

  `int compare(T o1, T o2)` 메서드

* `o1`과 `o2`가 동등하면 `0` 반환
* `o1`이 `o2`보다 앞에 오게 하려면 `음수` 반환
* `o1`이 `o2` 보다 뒤에 오게 하려면 `양수` 반환
* 두 객체를 비교할 수 없다면 ClassCastException 발생



## 2.1 정렬자

* 정렬자는 `Comparator` 인터페이스를 구현한 객체를 말한다



**comparable 비구현 객체 Fruit 정렬하기**

```java
public class Fruit {
    public String name;
    public int price;

    public Fruit(String name, int price) {
        this.name = name;
        this.price = price;
    }
}
```



**정렬자**

* overflow가 발생할 수 있으므로 `o1.price - o2.price` 같이 쓰지 않는다

```java
import java.util.Comparator;

public class DescendingComparator implements Comparator<Fruit> {
    @Override
    public int compare(Fruit o1, Fruit o2) {
        if(o1.price < o2.price) return 1;
        else if(o1.price == o2.price) return 0;
        else return -1;
    }
}
```



**정렬자 사용하기**

```java
import java.util.Iterator;
import java.util.TreeSet;

public  class ComparatorExmaple {
    public static void main(String[] args) {
        TreeSet<Fruit> treeSet = new TreeSet<>(new DescendingComparator());

        treeSet.add(new Fruit("포도", 3000));
        treeSet.add(new Fruit("수박", 10000));
        treeSet.add(new Fruit("딸기", 6000));

        Iterator<Fruit> iterator = treeSet.iterator();
        while (iterator.hasNext()) {
            Fruit fruit = iterator.next();
            System.out.println(fruit.name + ":" + fruit.price);
        }
    }
}
```



참고

* https://docs.oracle.com/javase/tutorial/collections/interfaces/order.html
* 이것이 자바다(이상민 저)
