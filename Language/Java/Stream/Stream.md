# 1 Stream 정의

* 스트림은 자바8부터 추가된 컬렉션의 저장 요소를 하나씩 참조해서 람다식으로 처리할 수 있도록 해주는 반복자이다.
* Stream
  * sequence of elements supporting sequential and parallel aggregate operations
  * **데이터 처리 연산**을 지원하도록 **소스**에서 추출된 **연속된 요소**

 

## 1.1 연속된 요소

* 컬렉션과 마찬가지로 스트림은 특정 요소 형식으로 이루어진 연속된 값 집합의 인터페이스를 제공한다
* 컬렉션은 자료구조이므로 시간과 공간의 복잡성과 괸련된 요소 저장 및 접근 연산이 주를 이룬다
* 반면에 스트림 filter, sorted, map처럼 표현 계산식이 주를 이룬다
* 즉 **컬렌션의 주제는 데이터**고 **스트림의 주제는 계산**이다.



## 1.2 소스

* 스트림은 컬렉션, 배열, I/O 자원 등의 데이터 제공 소스로부터 데이터를 소비한다.
* 정렬된 컬렌션으로 스트림을 생성하면 정렬이 그대로 유지된다.



## 1.3 데이터 처리 연산

* 스트림은 함수형 프로그래밍 언어에서 일반적으로 지원하는 연산과 데이터베이스와 비슷한 연산을 지원한다.
* 예시 filter, map, reduce, find, match, sort 등으로 데이터를 조작할 수 있다.
* 스트림 연산은 순차적으로 또는 병렬로 실행할 수 있다.

# 2 스트림의 특징

* `Stream` 은 `Iterator` 와 비슷한 역할을 하는 반복자이지만 아래와 같은 차이점이 있다
* 람다식으로 요소 처리 코드를 제공한다.
* 내부 반복자를 사용하므로 병렬 처리가 쉽다
  * 멀티스레드 코드를 작성하지 않아도 데이터를 투명하게 병렬로 처리할 수 있다.
* 중간 처리와 최종 처리 작업을 수행할 수 있다.
* 스트림이 처리하는 데이터 소스를 변경하지 않는다.
* 반복자와 마찬가지로 스트림으로 처리하는 데이터는 오직 한번만 처리한다.
  * 탐색된 스트림의 요소는 소비된다.
  * 한 번 탐색한 요소를 다시 탐색하려면 초기 데이터 소스에서 새로운 스트림을 만들어야한다.




## 2.1 람다식으로 요소 처리 연산을 코드로 제공

* 스트림 요소에 적용하고 싶은 처리 연산을 코드로 정의하고 이를 스트림에 제공한다. 
* 동작 파라미터화(behavior parameterization)
  * 스트림 API의 연산 동작을 파라미터화해서 코드를 전달한다는 사상
  * 즉 함수를 값처럼 취급해 코드를 마음대로 전달할 수 있다.
  * [Behavior-Parameterization.md](../Behavior-Parameterization/Behavior-Parameterization.md)
* `Stream`이 제공하는 대부분의 요소 처리 메서드는 functional interface 파라미터를 가지고 있다.

```java
<R> Stream<R> map(Function<? super T, ? extends R> mapper);
```

```java
Stream<T> filter(Predicate<? super T> predicate);
```

```java
void forEach(Consumer<? super T> action);
```



**예시**

* 스트림의 요소(학생)의 이름과 점수를 출력하는 처리 연산을 스트림에 넘겨 준다.

```java
public static void main(String[] args) {
  List<Student> list = Array.asList(
    new Student("홍길동",92),
    new Student("김남준",90)
  );
  
  Stream<Student> stream = list.stream();
  stream.forEach(s -> {
    String name = s.getName();
    int score = s.getScore();
    System.out.println(name + "-" + score);
  });
}
```



## 2.2 내부 반복자

<img src="./images/내부 반복자.png" alt="image-20210706214913437" style="zoom: 33%;" />

**외부 반복자**

* 외부 반복자란 개발자가 코드로 직접 컬렉션의 요소를 반복해서 가져오는 코드 패턴을 말한다.
* 예시) index를 이용한 for 문, Iterator를 이용한 while 문

**내부 반복자**

* 컬렉션 내부에서 요소들을 반복시키고 개발자는 요소당 처리해야 할 코드만 제공하는 코드 패턴을 말한다.

**내부 반복자의 장점**

* 개발자는 요소 처리 코드에만 집중
* 멀티코어 CPU를 최대한 활용하기 위해 요소들을 분배시켜 병렬 처리 작업을 할 수 있다.
  * 외부 반복자를 이용하면 병렬성을 스스로 관리해야 한다.


**외부 반복자와 내부 반복자 예제**

```java
private List<Dish> menu = Arrays.asList(
  new Dish("pork", false, 800, Dish.Type.MEAT),
  new Dish("beef", false, 700, Dish.Type.MEAT),
  new Dish("chicken", false, 400, Dish.Type.MEAT),
  new Dish("french fries", true, 530, Dish.Type.OTHER),
  new Dish("rice", true, 350, Dish.Type.OTHER),
  new Dish("season fruit", true, 120, Dish.Type.OTHER),
  new Dish("pizza", true, 550, Dish.Type.OTHER),
  new Dish("prawns", false, 400, Dish.Type.FISH),
  new Dish("salmon", false, 450, Dish.Type.FISH)
);


// 외부 반복: 콜렉션 인터페이스를 사용하면 사용자가 직접 요소를 반복해야 한다.
@Test
public void collection_for_each() {
  List<String> names = new ArrayList<>();
  for (Dish dish : menu) {
    names.add(dish.getName());
  }
  System.out.println(names);
}

// 외부 반복: 콜렉션 인터페이스를 사용하면 사용자가 직접 요소를 반복해야 한다.
@Test
public void collection_iterator() {
  List<String> names = new ArrayList<>();
  Iterator<Dish> iterator = menu.iterator();
  while (iterator.hasNext()){
    names.add(iterator.next().getName());
  }
  System.out.println(names);
}

// 내부 반복
@Test
public void stream() {
  List<String> names = menu.stream().map(Dish::getName).collect(Collectors.toList());
  System.out.println(names);
}
```



**병렬 처리 코드 예제**

```java
public class ParallelEx {
  public static void main(String[] args) {
    List<String> list = Arrays.asList("홍길동","신용권","김남준","람다식","병렬처리");
		
    //순차처리
    Stream<String> stream = list.stream();
    stream.forEach(ParallelEx::print);
		
    //병렬처리
    Stream<String> parallelStream = list.parallelStream();
    parallelStream.forEach(ParallelEx::print);
  }

  public static void print(String string) {
    //사용된 스레드의 이름과 함께 출력
    System.out.println(string + " : " + Thread.currentThread().getName());
  }
}
```

```tex
홍길동 : main
신용권 : main
김남준 : main
람다식 : main
병렬처리 : main
김남준 : main
병렬처리 : ForkJoinPool.commonPool-worker-2
신용권 : ForkJoinPool.commonPool-worker-1
홍길동 : ForkJoinPool.commonPool-worker-1
람다식 : ForkJoinPool.commonPool-worker-2

Process finished with exit code 0
```



## 2.3 파이프라이닝

![image-20210706221004528](./images/파이프라인.png)

* 대부분의 스트림 연산은 스트림 연산끼리 연결해서 커다란 파이프 라인을 구성한다.
* 스트림 파이프라인은 0 또는 다수의 중간 처리(intermediate operation)와 한개의 최종 처리(terminal operation)로 구성된다
  * 중간 처리(intermediate operation)은 연산 처리후 다시 Stream을 반환한다.
  * 최종 처리(terminal operation)은 Stream을 반환하지 않는다.
* 파이프라이닝 덕분에 Laziness, 쇼트 서킷(short-circuiting) 같은 최적화가 가능하다



### 2.3.1 Intermediate Operation(중간 처리)

* 스트림은 컬렉션의 요소에 대한 중간 처리를 할 수 있다.
* 중간 처리로 매핑, 필터링, 정렬 등을 할 수 있다.
* Stream을 반환한다.
* 최종 스트림의 집계 기능이 시작되기 전까지 중간 처리는 지연(lazy)된다.
* 여러 중간 처리를 조합하여 유연성이 좋다.



### 2.3.2 Laziness

* 종료 오퍼레이션이 없기 때문에 중개 오퍼레이션인 map이 실행되지 않았다.
* 아래 예시는 종료 오퍼레이션 collect가 시작되면서 map 또한 실행되었다.

```java
@Test
void test() {
  List<String> strings = Arrays.asList("1", "2", "3");

  strings.stream().map(s -> {
    System.out.println(s);
    return s.toUpperCase();
  });

  System.out.println("----------------");
}
```

```text
----------------
```

```java
@Test
void test() {
    List<String> strings = Arrays.asList("1", "2", "3");

    List<String> collect = strings.stream().map(s -> {
        System.out.println(s);
        return s.toUpperCase();
    }).collect(Collectors.toList());

    System.out.println("----------------");
}
```

```text
1
2
3
----------------
```



### 2.3.2 Terminal Operation(최종 처리)

* 스트림은 컬렉션의 요소에 대한 최종 처리를 할 수 있다.
* 최종 처리로 반복, 카운팅, 평균, 총합 등의 집계 처리를 수행할 수 있다.
* Stream을 반환하지 않는다.



**예시**

* Student 객체를 중간 처리에서 score 필드값으로 매핑하고 최종처리에선 score의 평균값을 산출

```java
public class MapAndReduceEx {
  public static void main(String[] args) {
    List<Student> list = Arrays.asList(
        new Student("홍길동", 92),
        new Student("신용권", 90),
        new Student("유미선", 82)
    );
 
    double avg = list.stream()
        .mapToInt(Student::getScore)
        .average()
        .getAsDouble();

    System.out.println("평균 점수: " + avg);

  }
}
```



## 2.5 선언형 코드

* 람다식을 이용해 선언형 코드를 작성할 수 있다
* 즉 루프와 if 조건문 등의 제어 블록을 사용해서 어떻게 동작을 구현할지 지정할 필요가 없다
* 단지 람다식을 이용 어떻게 동작할지 선언적으로 `Stream`에 제공한다.
* 선언적이라는 의미는 예를 들면 택시를 탈 때 목적지를 말하면 기사님이 알아서 가주는 것과 같고 반대로 100미터 앞에서 좌회전 등 목적지에 도달하기 위해 일일이 기사님에게 명령을 하는것은 비선언적이라고 한다.
* 즉 선언적이라는 의미는 루프와 if 조건문 써가며 동작을 일일이 구현하지 않아도 된다는 의미이다



**예시**

* 저칼로리의 요리명을 반환하고 칼로리 기준으로 요리를 정렬하는 자바 코드
* 위에는 자바 8이전 코드 밑은 자바 8 이후 코드
* 자바 8이전 코드
  * 스트림 없이 컬렉션을 직접 다루며 루프와 if 조건문을 써가며 동작을 일일이 구현
* 자바 8 이후 코드
  * `저칼로의 요리만 선택하라` 와 같은 동작의 수행을 지정하여 선언형 코드로 작성

```java
public static List<String> getLowCaloricDishesNamesInJava7(List<Dish> dishes) {
  List<Dish> lowCaloricDishes = new ArrayList<>();
  for (Dish d : dishes) {
    if (d.getCalories() < 400) {
      lowCaloricDishes.add(d);
    }
  }
  List<String> lowCaloricDishesName = new ArrayList<>();
  Collections.sort(lowCaloricDishes, new Comparator<Dish>() {
    @Override
    public int compare(Dish d1, Dish d2) {
      return Integer.compare(d1.getCalories(), d2.getCalories());
    }
  });
  for (Dish d : lowCaloricDishes) {
    lowCaloricDishesName.add(d.getName());
  }
  return lowCaloricDishesName;
}
```

```java
public static List<String> getLowCaloricDishesNamesInJava8(List<Dish> dishes) {
  return dishes.stream()
    .filter(d -> d.getCalories() < 400)
    .sorted(comparing(Dish::getCalories))
    .map(Dish::getName)
    .collect(toList());
}
```



# 3 스트림의 종류

![img](./images/stream종류.png)

- 모든 스트림에서 사용할 수 있는 공통 메소드들이 정의 되어있는 `BaseStream`아래에 객체와 타입 요소를 처리하는 스트림이 있다. 
- BaseStream은 공통 메소드들이 정의되어 있고, 코드에서 직접적으로 사용하지는 않는다.



## 3.1 기본형 특화 스트림

* 스트림 API는 박싱 비용을 피할 수 있도록 기본형에 특화된 세 가지 기본형 특화 스트림을 제공한다.
  * IntStream: int 요소 특화된 스트림
  * LongStream: long 요소 특화된 스트림
  * DoubleStream: double 요소 특화된 스트림
* 기본형 특화 스트림은 오직 박싱 과정에서 일어나는 효율성과 관련있으면 스트림에 추가 기능을 제공하지 않는다



**특화 스트림으로 매핑**

* 스트림을 특화 스트림으로 변환할 때는 mapToInt, mapToLong, mapToDouble 세 가지 메서드를 사용한다.

```java
int calories = menu.stream()
  .mapToInt(Dish::getCalories)
  .sum();
System.out.println("Number of calories:" + calories);
```

```
Number of calories:4300
```

* 특화 스트림으로 매핑하지 않고 일반 스트림을 쓴다면 sum 메서드가 없기 때문에 아래와 같이 reduce를 사용한다.

```java
int calories2 = menu.stream()
  .map(Dish::getCalories)
  .reduce(0, Integer::sum);
System.out.println("Number of calories2:" + calories2);
```

```
Number of calories2:4300
```



**특화 스트림에서 객체 스트림으로 복원**

* 특화 스트림에서 객체 스트림으로 변환해보자

```java
// 초기 객체 스트림
Stream<Dish> stream = menu.stream();
// mapToInt: 객체 스트림에서 특화 스트림으로
IntStream intStream = stream.mapToInt(Dish::getCalories);
// boxed: 특화 스트림을 다시 객체 스트림으로
Stream<Integer> stream = intStream.boxed();
```



# 4 스트림 메소드

## 4.1 필터링 메소드

### 4.1.1 filter

* filter: 주어진 predicate를 만족하는 요소로 구성된 스트림 반환

**예시**

```java
// 프레디케이트로 거름
System.out.println("Filtering with a predicate");
List<Dish> vegetarianMenu = menu.stream()
  .filter(Dish::isVegetarian)
  .collect(toList());
vegetarianMenu.forEach(System.out::println);
```



### 4.1.2 distinct

* distinct: 중복된 원소를 제거한 고유 원소 스트림 반환(객체의 고유성은 hashCode, equals로 결정)

**예시**

```java
// 고유 요소로 거름
System.out.println("Filtering unique elements:");
List<Integer> numbers = Arrays.asList(1, 2, 1, 3, 3, 2, 4);
numbers.stream()
  .filter(i -> i % 2 == 0)
  .distinct()
  .forEach(System.out::println);
```



## 4.2 스트림 슬라이싱 메소드

* 스트림의 요소를 선택하거나 스킵하는 방법



**예시**

* 스트림의 요소가 아래와 같이 칼로리 값을 기준으로 오름차순 정렬됨
* 요리의 칼로리를 기준으로 스트림을 슬라이싱 해보자

```java
public static final List<Dish> menu = Arrays.asList(
  new Dish("pork", false, 800, Dish.Type.MEAT),
  new Dish("beef", false, 700, Dish.Type.MEAT),
  new Dish("chicken", false, 400, Dish.Type.MEAT),
  new Dish("french fries", true, 530, Dish.Type.OTHER),
  new Dish("rice", true, 350, Dish.Type.OTHER),
  new Dish("season fruit", true, 120, Dish.Type.OTHER),
  new Dish("pizza", true, 550, Dish.Type.OTHER),
  new Dish("prawns", false, 400, Dish.Type.FISH),
  new Dish("salmon", false, 450, Dish.Type.FISH)
);

List<Dish> specialMenu = Arrays.asList(
  new Dish("season fruit", true, 120, Dish.Type.OTHER),
  new Dish("prawns", false, 300, Dish.Type.FISH),
  new Dish("rice", true, 350, Dish.Type.OTHER),
  new Dish("chicken", false, 400, Dish.Type.MEAT),
  new Dish("french fries", true, 530, Dish.Type.OTHER));
```



### 4.2.1 filter

* 스트림의 모든 원소에 프레디케이트를 적용해서 스트림을 슬라이싱 한다.

**예시**

```java
System.out.println("Filtered sorted menu:");
List<Dish> filteredMenu = specialMenu.stream()
  .filter(dish -> dish.getCalories() < 320)
  .collect(toList());
filteredMenu.forEach(System.out::println);
```

```
Filtered sorted menu:
season fruit
prawns
```



### 4.2.2 takeWhile

* 스트림의 원소가 정렬되어 있을 때 사용하자

**예시**

* 스트림의 원소가 칼로리를 기준으로 오름차순 정렬되어 있음
* filter는 스트림의 모든 원소에 프레디케이트를 적용하지만 takeWhile를 사용하면 320 칼로리보다 크거나 같은 요리가 나왔을 때 반복 작업을 중단

```java
System.out.println("Sorted menu sliced with takeWhile():");
List<Dish> slicedMenu1 = specialMenu.stream()
  .takeWhile(dish -> dish.getCalories() < 320)
  .collect(toList());
slicedMenu1.forEach(System.out::println);
```

```
Sorted menu sliced with takeWhile():
season fruit
prawns
```



### 4.2.3 dropWhile

* 스트림의 원소가 정렬되어 있을 때 사용하자
* 320 칼로리 이상인 요리 슬라이싱

**예시**

```java
System.out.println("Sorted menu sliced with dropWhile():");
List<Dish> slicedMenu2 = specialMenu.stream()
  .dropWhile(dish -> dish.getCalories() < 320)
  .collect(toList());
slicedMenu2.forEach(System.out::println);
```

```
Sorted menu sliced with dropWhile():
rice
chicken
french fries
```



### 4.2.4 limit

* 주어진 값 이하의 크기를 갖는 새로운 스트림을 반환하는 메소드
* 스트림이 정렬되어 있으면 최대 요소 n개를 반환할 수 있다.

**예시**

```java
List<Dish> dishesLimit3 = menu.stream()
  .filter(d -> d.getCalories() > 300)
  .limit(3)
  .collect(toList());
System.out.println("Truncating a stream:");
dishesLimit3.forEach(System.out::println);
```

```
Truncating a stream:
pork
beef
chicken
```



### 4.2.5 skip

* 처음 n개의 요소를 제외한 스트림을 반환하는 메소드

**예시**

```java
List<Dish> dishesSkip2 = menu.stream()
  .filter(d -> d.getCalories() > 300)
  .skip(2)
  .collect(toList());
System.out.println("Skipping elements:");
dishesSkip2.forEach(System.out::println);
```

```
Skipping elements:
chicken
french fries
rice
pizza
prawns
salmon
```



## 4.3 매핑

* 특정 객체에서 특정 데이터를 선택하는 작업



### 4.3.1 map

* map 메소드는 함수를 인수로 받는다.
* 인수로 제공된 함수는 각 요소에 적용되며 함수를 적용한 새로운 요소로 매핑한다.

**예시**

```java
List<String> dishNames = menu.stream()
  .map(Dish::getName)
  .collect(toList());
System.out.println(dishNames);
```

```
[pork, beef, chicken, french fries, rice, season fruit, pizza, prawns, salmon]
```



### 4.3.2 flatMap



## 4.4 검색과 매칭

* anyMatch, allMatch, noneMatch, findAny, findFirst은 쇼트서킷 기법을 활용한다.

> **쇼트 서킷**
>
> * 쇼트 서킷이란 모든 스트림의 요소를 처리하지 않고 결과를 반환하는 것을 뜻한다
> * 무한한 요소를 가진 스트림을 유한한 크기로 줄일 수 있는 유용한 연산이다
> * 예를 들어 and 연산으로 연결된 커다란 불리언 표현식을 평가할 때 표현식 하나라도 거짓이라는 결과가 나오면 나머지 표현식의 결과와 상관없이 전체 결과도 거짓이 된다.
> * 예를 들어 anyMatch을 사용한다면 주어진 프레디케이트를 만족하는 하나의 요소가 나오면 나머지 요소에 프레디케이트를 적용하지 않고 true를 반환한다.



### 4.4.1 anyMatch

* 프레디케이트가 주어진 스트림에서 적어도 한 요소와 일치하는지 확일할 때 사용한다

```java
if (menu.stream().anyMatch(Dish::isVegetarian)) {
  System.out.println("Vegetarian friendly");
}
```



### 4.4.2 allMatch

* 스트림의 모든 요소가 주어진 프레디케이트와 일치하는지 검사한다

```java
menu.stream().allMatch(d -> d.getCalories() < 1000); // true
```



### 4.4.3 noneMatch

* 스트림의 모든 요소가 주어진 프레디케이트와 일치하지 않은지 확인

```java
menu.stream().noneMatch(d -> d.getCalories() >= 1000); // true
```



### 4.4.4 findAny

* 현재 스트림에서 임의의 요소를 반환한다

```java
Optional<Dish> dish = menu.stream().filter(Dish::isVegetarian).findAny()
```



### 4.4.5 findFirst

* 정렬된 연속 데이터로부터 생성된 스트림은 논리적인 아이템 순서를 가지고 있다.
* 이런 스트림에서 첫 번째 요소를 찾을 때 findFirst 메소드를 사용한다.

```java
@Test
public void testFindFirst() {
  List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
  Integer firstSquareDivisibleByThree = numbers.stream()
    .map(n -> n * n)
    .filter(n -> n % 3 == 0)
    .findFirst()
    .get();
  assertThat(firstSquareDivisibleByThree).isEqualTo(9);
}
```



> **findAny와 findFirst**
>
> 두 메서드가 모두 필요한 이유는 병렬성 때문이다. 병렬 실행에서는 첫 번째 요소를 찾기 어렵다. 따라서 요소의 순서가 상관 없다면 병렬 스트림에서는 제약이 적은 findAny를 사용한다.



## 4.5 리듀싱

* 리듀스는 스트림의 요소를 조합해서 더 복잡한 질의를 표현할 수 있다
* 이런 질의를 리듀싱 연산이라고 한다.
  * 리듀싱 연산: 모든 스트림 요소를 처리해서 값으로 도출하는 연산
  * 스트림이 하나의 값으로 줄어들 때 까지 람다는 각 요소를 반복해서 조합한다.
* 예시
  * 메뉴의 모든 칼로리의 합계를 구하시오
  * 메뉴에서 칼로리가 가장 높은 요리는?



**요소의 합 구하기**

```java
List<Integer> numbers = Arrays.asList(3, 4, 5, 1, 2);
int sum = numbers.stream().reduce(0, (a, b) -> a + b);
System.out.println(sum);
```

```
15
```

```java
int sum2 = numbers.stream().reduce(0, Integer::sum);
System.out.println(sum2);
```

```
15
```



**최대값 구하기**

```java
int max = numbers.stream().reduce(0, (a, b) -> Integer.max(a, b));
System.out.println(max);
```

```
5
```

```java
int max = numbers.stream().reduce(0, Integer::max);
System.out.println(max);
```

```
5
```



**최소값 구하기**

* reduce는 초기값이 없으면 Optional 객체를 반환한다.
* 스트림이 아무 요소도 가지고 있지 않은 상황에서 최소값이 없음을 가리킬수 있도록 Optional 객체로 감싼 결과를 반환한다

```java
Optional<Integer> min = numbers.stream().reduce(Integer::min);
min.ifPresent(System.out::println);
```

```
1
```



# 5 스트림 만들기

## 5.1 컬렉션으로 스트림 만들기

```java
List<Student> studentList = Arrays.asList(
  new Student("홍길동", 10),
  new Student("신용권", 20),
  new Student("유미선", 30)
);

Stream<Student> stream = studentList.stream();
stream.forEach(s -> System.out.println(s.getName()));
```

```text
홍길동
신용권
유미선
```



## 5.2 배열로 스트림 만들기

* 배열을 인수로 받는 정적 메소드 Arrays.stream을 이용해 스트림을 만들 수 있다

```java
String[] stringArray = {"홍길동", "신용권", "김미나"};
Stream<String> stringStream = Arrays.stream(stringArray);
stringStream.forEach(a -> System.out.print(a + ","));
System.out.println();

int[] intArray = {1, 2, 3, 4, 5};
IntStream intStream = Arrays.stream(intArray);
intStream.forEach(a -> System.out.print(a + ","));
```

```text
홍길동,신용권,김미나,
1,2,3,4,5,
```



# 6 컬렌션과 비교

* 데이터를 언제 계산하느냐가 컬렉션과 스트림의 가장 큰 차이
* 컬렉션
  * 현재 자료구조가 포함하는 모든 값을 메모리에 저장하는 자료구조
  * 컬렉션의 모든 요소는 컬렉션에 추가하지 전에 계산되어야 한다.
* 스트림
  * 스트림은 요청할 때만 요소를 계산하는 고정된 자료구조이다
  * 사용자가 요청하는 값만 스트림에서 추출하는 것이 핵심



**참조**

* [이것이 자바다](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9788968481475&orderClick=LEa&Kc=)
* [모던 자바 인 액션](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9791162242025)
* https://docs.oracle.com/javase/tutorial/collections/streams/index.html
