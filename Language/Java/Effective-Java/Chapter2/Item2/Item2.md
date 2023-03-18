# 생성자에 매개변수가 많다면 빌더를 고려하라

* 정적 팩토리 메소드와 생성자는 선택적 매개변수가 많은 경우 적절히 대응하기 어렵다
* 이렇게 선택적 매개변수가 많은 경우 객체의 생성 패턴을 알아보자
  * 점층적 생성자 패턴
  * 자바 빈즈 패턴
  * 빌더 패턴



# 1 점층적 생성자 패턴

- telescoping constructor pattern이라고 한다.
- 필수 매개변수만 받는 생성자, 필수 매개변수와 선택 매개변수 1개를 받는 생성자, 선택 매개변수를 2개까지 받는 생성자, ..., 선택 매개변수를 전부 받는 생성자까지 늘려가는 방식
- 확장하기 어렵다
- 매개변수가 많아지면 클라이언트 코드를 작성하거나 읽기 어렵다



**예시**

```java
public class NutritionFacts {
  private final int servingSize;  // 필수
  private final int servings;     // 필수
  private final int calories;     // 선택
  private final int fat;          // 선택
  private final int sodium;       // 선택
  private final int carbohydrate; // 선택

  public NutritionFacts(int servingSize, int servings) {
    this(servingSize, servings, 0);
  }

  public NutritionFacts(int servingSize, int servings, int calories) {
    this(servingSize, servings, calories, 0);
  }

  public NutritionFacts(int servingSize, int servings, int calories, int fat) {
    this(servingSize, servings, calories, fat, 0);
  }

  public NutritionFacts(int servingSize, int servings, int calories, int fat, int sodium) {
    this(servingSize, servings, calories, fat, 0);
  }

  public NutritionFacts(int servingSize, int servings, int calories, int fat, int sodium, int carbohydrate) {
    this.servingSize = servingSize;
    this.servings = servings;
    this.calories = calories;
    this.fat = fat;
    this.sodium = sodium;
    this.carbohydrate = carbohydrate;
  }
}
```



## 1.1 단점

* 보통 사용자가 설정하길 원치 않는 매개변수까지 포함된 경우가 많아 어쩔 수 없이 매개변수의 값을 지정
* 매개변수 개수가 많아지면 클라이언트 코드를 작성하거나 읽기 어렵다
* 같은 타입인 매개변수가 연달아 있으면 순서를 바꿔 건네줘도 컴파일러는 알아채지 못한다.



# 2 자바 빈즈 패턴(JavaBeans pattern)

- 매개변수가 없는 생성자로 객체를 만든 후, 세터(setter) 메서드를 호출해 원하는 매개변수의 값을 설정하는 방식
- 인스턴스를 만들기 쉽고 가독성이 좋아진다

**예시**

```java
public class NutritionFacts {
	private int servingSize = -1;  // 필수
	private int servings = -1;     // 필수
	private int calories = 0;
	private int fat = 0;
	private int sodium = 0;
	private int carbohydrate = 0;

	public NutritionFacts() {}

	public void setServingSize(int val) { servingSize = val; }
	public void setServings(int val) { servings = val; }
	public void setCalories(int val) { calories = val; }
	public void setFat(int val) { fat = val; }
	public void setSodium(int val) { sodium = val; }
	public void setCarbohydrate(int val) {carbohydrate = val; }
}
```

```java
// 점층적 생성자 패턴에 비해 확장하기 쉽고, 인스턴스를 만들기 쉽고, 가독성이 좋아진다.
NutritinFacts cocaCola = new NutritionFacts();
cocaCola.setServingSize(240);
cocaCola.setServings(8);
cocaCola.setCalories(100);
cocaCola.setSodium(35);
cocaCola.setCarbohydrate(27);
```



## 2.1 단점

- 객체를 하나 만들기 위해 메서드를 여러 개 호출해야 한다.
- 객체가 완전히 생성되기 전까지는 일관성(consistency)이 무너진 상태에 놓인다
- 생성자를 통한 유효성 검사라는 장치가 사라짐
- 클래스를 **불변**으로 만들 수 없으며 스레드 안정성을 위한 추가 작업이 필요하다
  - setter를 제공하기 때문에 객체의 상태가 변한다.




> 불변(Immutable) 객체
>
> - 객체의 생성 시점 초기화된 값이 객체가 소멸될 때까지 변하지 않는 객체를 말한다
> - 대표적으로 String 객체는 한번 만들어지면 절대 값을 바꿀 수 없는 불변 객체다.
>
> 불변식
>
> - 프로그램이 실행되는 동안 반드시 만족해야 하는 조건을 말한다.
> - 예를 들어 Period 클래스의 start 필드의 값은 반드시 end 필드 값보다 앞서야 하므로 두 값이 역전되면 불변식이 깨진 것이다.
> - 가변 객체에서도 불변식이 존재할 수 있다.



# 3 빌더 패턴(Bulider Pattern)

- 필수 매개변수와 생성자(혹은 정적 팩터리)를 통해 객체 생성을 위한 빌더 객체를 얻는다.
- 빌더 객체가 제공하는 일종의 세터 메서드들로 원하는 선택 매개변수를 설정한다. 
- 마지막으로 build 메서드를 호출해 (보통은 불변인) 타겟 객체를 얻는다.
- 빌더의 세터 메서드들은 빌더 자신을 반환하기 때문에 메서드 연쇄(method chaining)가 가능하다(플루언트 API라고도 한다)



**예시**

```java
public class NutritionFacts {
  private final int servingSize;
  private final int servings;
  private final int calories;
  private final int fat;
  private final int sodium;
  private final int carbohydrate;

  public static class Builder {
    private final int servingSize;  // 필수
    private final int servings;     // 필수
    private int calories = 0;
    private int fat = 0;
    private int sodium = 0;
    private int carbohydrate = 0;

    public Builder(int servingSize, int servings) {
      this,servingSize = serginsSize;
      this.servings = servings;
    }

    public Builder fat(int val) {
      fat = val;
      return this;
    }

    public Builder sodium(int val) {
      sodium = val;
      return this;
    }

    public Builder carbohydrate(int val) {
      carbohydrate = val;
      return this;
    }

    public NutritionFacts build() {
      return new NutritionFacts(this);
    }
  }

  private NutirionFacts(Builder builder) {
    servingSize = builder.servingSize;
    servings = builder.servings;
    calories = builder.calories;
    fat = builder.fat;
    sodium = builder.fat;
    carbohydrate = builder.carbohydrate;
  }
}
```



## 3.1 빌더 패턴으로 객체 생성

1. 빌더 객체 얻기
   * 필수 매개변수만으로 생성자 혹은 정적 팩토리 메소드를 통해 빌더 객체를 얻는다
2. 빌더 객체의 세터 메소드 호출
   * 빌더 객체가 제공하는 일종의 세터 메소드로 선택 매개변수들을 설정
   * 빌더의 세터 메서드들은 빌더 자신을 반환하기 때문에 메서드 연쇄(method chaining)가 가능하다
     * 플루언트 API라고도 한다
3. `build()` 를 호출하여 객체 생성

```java
NutritionFacts cocaCola = 
  new NutritionFacts.Builder(240, 8) // 필수 매개변수만 넘겨주며 생성자로 빌더 객체 얻기
  .calories(100) // 빌더 객체의 세터 메소드 호출
  .sodium(35)	// 빌더 객체의 세터 메소드 호출
  .carbohydrate(27)	// 빌더 객체의 세터 메소드 호출
  .build(); // build() 를 호출하여 객체 생성
```



## 3.2 장점

- 점층적 생성자 패턴의 **안정성**(유효성 검사)과 자바 빈즈 패턴의 **가독성**이라는 장점을 가진다
- 빌더 하나로 여러 객체를 순회하며 만들 수 있고, 매개변수에 따라 다른 객체를 만드는 등 유연하게 사용 가능
- 따라서 생성자나 정적 팩토리의 매개변수가 많다면 빌더 패턴을 선택하는 것이 좋다
  - 매개변수 중 다수가 필수가 아니거나 같은 타입이면 특히 그렇다



## 3.3 단점

- 객체를 만들기 위해 빌더부터 만들어야하기 떄문에 성능에 민감한 상황에서 문제가 될 수 있다
- 점층적 생성자 패턴보다 코드가 장황해서 매개변수가 4개 이상일 때 유용하다



참고

* [이펙티브 자바 3/E](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788966262281)