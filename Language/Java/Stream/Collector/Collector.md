# 1 컬렉터

* Collector 인터페이스란 스트림의 요소를 어떤식으로 도출할지에 대한 명세서
* 컬렉터란 Collector 인터페이스 구현체
  * Stream collect 메소드의 인자

* 스트림의 요소를 어떤식으로 도출할지 그 방식을 Collector 인터페이스 구현에 명시하고 이를 Stream의 collect 메소드에 넘겨준다
* Stream의 collect를 호출하면 스트림의 요소에 컬렉터로 파라미터화된 리듀싱 연산이 수행된다



**예시**

* `.collect(Collectors.toList());`
  * 각 요소를 리스트로 만들어라라고 명시된 Collector 인터페이스의 구현체(Collectors.toList())를 collect 메소드에 넘김

```java
import java.util.stream.Collectors;

List<String> dishNames = menu.stream()
  .map(Dish::getName)
  .collect(Collectors.toList());
System.out.println(dishNames);
System.out.println(wordLengths); 
// [5, 5]
```



# 2 Collectors 클래스

* Collectors 클래스는 팩토리 메서드를 통해 미리 정의된 컬렉터를 제공한다
* Collectors에서 제공하는 메서드의 기능은 크게 세 가지로 구분
  * 스트림 요소를 하나의 값으로 리듀스하고 요약
  * 요소 그룹화
  * 요소 분할



**예시 코드**

```java
public static final List<Dish> menu = asList(
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
```



## 2.1 summingInt

```java
import static java.util.stream.Collectors.summingInt;

menu.stream().collect(summingInt(Dish::getCalories));
// 4300
```



## 2.2 averagingInt

```java
import static java.util.stream.Collectors.averagingInt;

menu.stream().collect(averagingInt(Dish::getCalories));
// 477.77777777777777
```



## 2.3 joining

```java
import static java.util.stream.Collectors.joining;

menu.stream().map(Dish::getName).collect(joining(", "));
// pork, beef, chicken, french fries, rice, season fruit, pizza, prawns, salmon
```



## 2.4 counting

```java
import static java.util.stream.Collectors.counting;

menu.stream().collect(counting());
// 9
```



## 2.5 summarizingInt

```java
import static java.util.stream.Collectors.summarizingInt;

menu.stream().collect(summarizingInt(Dish::getCalories));
// IntSummaryStatistics{count=9, sum=4300, min=120, average=477.777778, max=800}
```



## 2.6 reducing

* 위에 모든 컬렉터는 reducing 팩토리 메서드로 정의할 수 있다
* reducing은 모든 상황에 범용적으로 사용가능하나 프로그래밍 편의성을 위해 위에 명시된 컬렉터를 사용한다
* reducing은 세 개의 인자를 받는다
  * 첫 번째 인수는 리듀싱 연산의 시작값 또는 스트림의 요소가 없을 경우 반환값
  * 두 번째 인수는 변환 함수(요리를 칼로리 정수로 변환)
  * 세 번째 인수는 같은 종류의 두 항목을 하나의 값으로 더하는 BinaryOperator다
* reducing은 한 개의 인자를 받을 수 있다
  * 한 개의 인수를 갖는 reducing을 호출하면  스트림의 요소가 없을 경우을 대비해 Optional 객체를 반환한다

```java
@Test
public void testReducing() {
  Optional<Dish> dish = menu.stream().collect(reducing((d1, d2) -> d1.getCalories() > d2.getCalories() ? d1 : d2));
  Dish mostCalorieDish = dish.get();
  assertThat(mostCalorieDish.getName()).isEqualTo("pork");
}
```



**예시**

* 아래의 코드는 모두 같은 결과를 반환
* `menu.stream().collect(summingInt(Dish::getCalories));`
* 위에 코드를 reducing으로 아래와 같이 표현
* `menu.stream().collect(reducing(0, Dish::getCalories, (Integer i, Integer j) -> i + j));`

```java
import static java.util.stream.Collectors.reducing;
import static java.util.stream.Collectors.summingInt;

// reducing 사용
menu.stream().collect(reducing(0, Dish::getCalories, (Integer i, Integer j) -> i + j));
menu.stream().collect(reducing(0, Dish::getCalories, Integer::sum));
// 컬렉터 없이
menu.stream().map(Dish::getCalories).reduce(Integer::sum).get();
menu.stream().mapToInt(Dish::getCalories).sum();
// 컬렉터 사용
menu.stream().collect(summingInt(Dish::getCalories));
```



# 3 collect와 reduce

* 



# 4 그룹화

* 명령형으로 그룹화를 구현하려면 까다롭다. 하지만 자바 8의 함수형을 이용하면 가독성 있는 할 줄의 코드로 그룹화를 구현할 수 있다.
* 팩토리 메서드 `Collectors.groupingBy`를 이용해 쉽게 그룹화할 수 있다.



## 4.1 그룹화 명령형과 함수형 비교

```java
import static java.util.stream.Collectors.groupingBy;

// 그룹화 명령형 코드
Map<Currency, List<Transaction>> transactionsByCurrencies = new HashMap<>();
for (Transaction transaction : transactions) {
  Currency currency = transaction.getCurrency();
  List<Transaction> transactionsForCurrency = transactionsByCurrencies.get(currency);
  if (transactionsForCurrency == null) {
    transactionsForCurrency = new ArrayList<>();
    transactionsByCurrencies.put(currency, transactionsForCurrency);
  }
  transactionsForCurrency.add(transaction);
}

// 그룹화 함수형 코드
Map<Currency, List<Transaction>> transactionsByCurrencies = transactions.stream()
  .collect(groupingBy(Transaction::getCurrency));

System.out.println(transactionsByCurrencies);
```



## 4.2 그룹화 예시

**Dish.java**

```java
public class Dish {

  private final String name;
  private final boolean vegetarian;
  private final int calories;
  private final Type type;

  public Dish(String name, boolean vegetarian, int calories, Type type) {
    this.name = name;
    this.vegetarian = vegetarian;
    this.calories = calories;
    this.type = type;
  }

  public String getName() {
    return name;
  }

  public boolean isVegetarian() {
    return vegetarian;
  }

  public int getCalories() {
    return calories;
  }

  public Type getType() {
    return type;
  }

  @Override
  public String toString() {
    return name;
  }

  public enum Type {
    MEAT,
    FISH,
    OTHER
  }

  public static final List<Dish> menu = asList(
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

  public static final Map<String, List<String>> dishTags = new HashMap<>();
  static {
    dishTags.put("pork", asList("greasy", "salty"));
    dishTags.put("beef", asList("salty", "roasted"));
    dishTags.put("chicken", asList("fried", "crisp"));
    dishTags.put("french fries", asList("greasy", "fried"));
    dishTags.put("rice", asList("light", "natural"));
    dishTags.put("season fruit", asList("fresh", "natural"));
    dishTags.put("pizza", asList("tasty", "salty"));
    dishTags.put("prawns", asList("tasty", "roasted"));
    dishTags.put("salmon", asList("delicious", "fresh"));
  }

}
```



**예시 1**

```java
Map<Dish.Type, List<Dish>> dishesByType = menu.stream().collect(groupingBy(Dish::getType));
System.out.println("dishesByType = " + dishesByType);
// dishesByType = {OTHER=[french fries, rice, season fruit, pizza], FISH=[prawns, salmon], MEAT=[pork, beef, chicken]}
```

* `Collectors.groupingBy`의 메소드 인자로 **분류 함수**를 넘긴다
* `Dish::getType`: 분류 함수(각 요소에 분류 함수를 적용해 키를 뽑아낸다)
  * 요리의 type으로 그루핑( MEAT, FISH, OTHER)
* 각 키에 대응하는 스트림의 모든 항목 리스트를 값으로 갖는 맵이 반환된다.



**예시 2**

```java
Map<CaloricLevel, List<Dish>> dishesByCaloricLevel = menu.stream().collect(
  groupingBy(dish -> {
    if (dish.getCalories() <= 400) {
      return CaloricLevel.DIET;
    } else if (dish.getCalories() <= 700) {
      return CaloricLevel.NORMAL;
    } else {
      return CaloricLevel.FAT;
    }
  })
);
```

* Dish에는 더 복잡한 분류 함수가 없기 때문에 람다 표현식으로 필요한 로직을 구현할 수 있다.
* 복잡한 분류 기준
  * 400 칼로리 이하는 diet
  * 400~700 칼로리 : nomal
  * 700 칼로리 초과: fat



## 4.3 그룹화된 요소 조작

* 요소를 그룹화 한 다음 각 결과 그룹의 요소를 조작하는 연산이 필요하다



**예시**

* filter 적용후 collect한 결과와 groupingBy에서 필터링한 결과의 차이

```java
Map<Dish.Type, List<Dish>> dishesByType1 = menu.stream()
  .filter(dish -> dish.getCalories() > 500)
  .collect(groupingBy(Dish::getType));
System.out.println("dishesByType1 = " + dishesByType1);

Map<Dish.Type, List<Dish>> dishesByType2 = menu.stream()
  .collect(
  groupingBy(Dish::getType, filtering(dish -> dish.getCalories() > 500, toList())));
System.out.println("dishesByType2 = " + dishesByType2);
```

```
dishesByType1 = {MEAT=[pork, beef], OTHER=[french fries, pizza]}
dishesByType2 = {MEAT=[pork, beef], FISH=[], OTHER=[french fries, pizza]}
```



**예시2**

```java
Map<Dish.Type, List<String>> dishNameByType = menu.stream()
  .collect(groupingBy(Dish::getType, mapping(Dish::getName, toList())));
System.out.println("dishNameByType = " + dishNameByType);
```

```
dishNameByType = {OTHER=[french fries, rice, season fruit, pizza], MEAT=[pork, beef, chicken], FISH=[prawns, salmon]}
```



# 5 분할

* 분할은 분할 함수라 불리는 프레디케이트를 **분류 함수**로 사용하는 특수한 그룹화 기능이다
* 분할 함수가 불리언을 반환하므로 맵의 키 형식은 Boolean이며 결과적으로 그룹화 맵은 최대 두 개의 그룹으로 분류된다



## 5.1 분할의 장점

* 분할 함수가 반환하는 참, 거짓 두 가지 요소의 스트림 리스트를 모두 유지한다는 장점이 있다



**예시**

* filter를 두번 적용하는 대신 분할을 사용하면 참, 거짓 두 가지 요소를 한번에 얻을 수 있다

```java
@DisplayName("filter와 partitioningBy 비교")
@Test
public void test() {
  //when
  List<Dish> isVegetarianList = menu.stream().filter(Dish::isVegetarian).collect(Collectors.toList());
  List<Dish> isNotVegetarianList = menu.stream().filter(Predicate.not(Dish::isVegetarian)).collect(Collectors.toList());
  Map<Boolean, List<Dish>> partitionByVegeterian = menu.stream().collect(partitioningBy(Dish::isVegetarian));

  //then
  assertThat(partitionByVegeterian.get(true)).isEqualTo(isVegetarianList);
  assertThat(partitionByVegeterian.get(false)).isEqualTo(isNotVegetarianList);
}
```



**예시**

```java
@DisplayName("채식 요리의 개수 구하기")
@Test
public void partitionByVegeterian() {
  //when
  Map<Boolean, List<Dish>> partitionByVegeterian = menu.stream().collect(partitioningBy(Dish::isVegetarian));

  //then
  assertThat(partitionByVegeterian.get(true).size()).isEqualTo(4);
}
```



**예시**

```java
@DisplayName("채식 요리와 채식이 아닌 요리를 각각 그룹화해서 가장 칼로리가 높은 요리 찾기")
@Test
public void mostCaloricPartitionedByVegetarian() {
  //when
  Map<Boolean, Optional<Dish>> mostCaloricPartitionedByVegetarian = menu.stream()
    .collect(partitioningBy(Dish::isVegetarian,
                            maxBy(Comparator.comparingInt(Dish::getCalories))));

  //then
  assertThat(mostCaloricPartitionedByVegetarian.get(true).get().getName()).isEqualTo("pizza");
  assertThat(mostCaloricPartitionedByVegetarian.get(false).get().getName()).isEqualTo("pork");
}
```



# 6 Collector 인터페이스



# 7 커스텀 컬렉터 구현



**참고**

* [모던 자바 인 액션](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9791162242025)