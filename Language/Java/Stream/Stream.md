# 1. Stream

>  스트림은 자바8부터 추가된 컬렉션의 저장 요소를 하나씩 참조해서 람다식으로 처리할 수 있도록 해주는 반복자이다.



자바 7 이전까지는 컬렉션에서 요소를 순차적으로 처리하기 위해 `Iterator` 반복자를 아래와 같이 사용했다.

```java
List<String> list = Arrays.asList("홍길동", "신용권", "김남준");
Iterator<String> iterator = list.iterator();
while(iterator.hasNext()) {
  String name = iterator.next();
  System.out.println(name);
}
```

자바8 이후 stream을 이용한 코드

```java
List<String> list = Arrays.asList("홍길동", "신용권", "김남준");
Stream<String> stream = list.stream();
stream.forEach(name -> System.out.println(name));
```



# 2. 스트림의 특징

* `Stream` 은 `Iterator` 와 비슷한 역할을 하는 반복자이지만 아래와 같은 차이점이 있다
* 람다식으로 요소 처리 코드를 제공한다.
* 내부 반복자를 사용하므로 병렬 처리가 쉽다
* 중간 처리와 최종 처리 작업을 수행할 수 있다.



## 2.1 람다식으로 요소 처리 코드를 제공

```java
<R> Stream<R> map(Function<? super T, ? extends R> mapper);
```

```java
Stream<T> filter(Predicate<? super T> predicate);
```

```java
void forEach(Consumer<? super T> action);
```

* `Stream`이 제공하는 대부분의 요소 처리 메서드는 functional interface 매개 타입을 가지고 있다.



**예시**

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



## 2.3 중간 처리

* 스트림은 컬렉션의 요소에 대한 중간 처리를 할 수 있다.
* 중간 처리로 매핑, 필터링, 정렬 등을 할 수 있다.
* Stream을 반환한다.
* 최종 스트림의 집계 기능이 시작되기 전까지 중간 처리는 지연(lazy)된다.

**Lazy 예시**

* 최종 처리 오퍼레이션이 없기 때문에 중간 처리 오퍼레이션인 map이 실행되지 않았다.
* 아래 예시는 최종 처리 오퍼레이션 collect가 시작되면서 map 또한 실행되었다.

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



## 2.4 최종 처리

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



# 3. 스트림의 종류

![img](./images/stream종류.png)

- 모든 스트림에서 사용할 수 있는 공통 메소드들이 정의 되어있는 `BaseStream`아래에 객체와 타입 요소를 처리하는 스트림이 있다. 
- BaseStream은 공통 메소드들이 정의되어 있고, 코드에서 직접적으로 사용하지는 않는다.

**컬렉션으로부터 Stream 얻기**

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

**배열로부터 스트림 얻기**

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



# 4.스트림 파이프라인

**리덕션(Reduction)**

- 대량의 데이터를 가공해서 축소하는 것을 말한다.
  - 리덕션의 결과물: 합계, 평균값, 카운팅, 최대값, 최소값
- 요소가 리덕션의 결과물로 바로 집계할 수 없을 경우 중간 처리가 필요하다.
  - 중간 처리 : 필터링, 매핑, 정렬, 그룹핑
- 중간 처리한 요소를 최종 처리해서 리덕션 결과물을 산출한다.

**파이프라인**

![image-20210706221004528](./images/파이프라인.png)

* 여러개의 스트림이 연결되어 있는 구조를 말한다.
* 중간처리 메소드(필터링, 매핑, 정렬)는 중간 처리된 스트림을 리턴한다.
* 반환된 스트림에서 다시 중간 처리 메소드를 호출해서 파이프라인을 형성하게 된다.



**참조**

* 이것이 자바다
