# Annotation

> 어노테이션은 메타데이터라고 볼 수 있다. 메타데이터란 애플리케이션이 처리해 할 데이터가 아니라 컴파일 과정과 실행 과정에서 코드를 어떻게 컴파일하고 처리할 것인지 알려주는 정보이다.



## 어노테이션의 용도

어노테이션은 다음 세가지 용도로 사용된다.

1. 컴파일러에게 코드 문법 에러 체크하도록 정보를 제공
2. 소프트웨어 개발 툴이나 빌드나 배치 시 코드를 자동으로 생성할 수 있도록 정보를 제공
3. 실행 시 특정 기능을 실행하도록 정보를 제공



## 어노테이션 타입 정의

* 어노테이션 타입을 정의하는 방법은 인터페이스를 정의하는 것과 유사하다.
* 어노테이션은 엘리먼트를 멤버로 가질 수 있다.
* 엘레먼트 타입은 `int` 나 `double` 과 같은 기본 데이터 타입이나 `String` , 열거 타입, Class 타입 그리고 이들의 배열 타입을 사용할 수 있다.
* 아래는 String 타입의 엘리먼트와 int 타입의 엘리먼트를 선언한 예시이다.

```java
public @interface AnnotationName{
  String elementName1();
  int elementName2() default 5;
}
```

* 사용 예시
  * `elementName2` 는 default 값이 있으므로 생략가능

```java
@AnnotationName(elementName1 = "값", elementName2 = 3)
@AnnotationName(elementName1 = "값")
```



## 어노테이션 적용 대상

* 어노테이션을 적용할 수 있는 대상은 `java.lang.annotation.ElementType` 열거 상수로 아래와 같이 정의되어 있다.
* 어노테이션 적용될 대상을 지정할 때에는 `@Target` 어노테이션을 사용한다.

| Enum Constant     | 적용 대상                     |
| :---------------- | :---------------------------- |
| `TYPE`            | 클래스, 인터페이스, 열거 타입 |
| `ANNOTATION_TYPE` | 어노테이션                    |
| `CONSTRUCTOR`     | 생성자                        |
| `FIELD`           | 필드                          |
| `LOCAL_VARIABLE`  | 로컬 변수                     |
| `METHOD`          | 메소드                        |

* 예시
  * `@Target(ElementType.TYPE)` : 클래스, 인터페이스, 열거 타입에만 `@RestController` 을 적용할 수 있다.

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Controller
@ResponseBody
public @interface RestController {

	@AliasFor(annotation = Controller.class)
	String value() default "";

}
```



## 어노테이션 유지 정책

* 어노테이션 정의 시 사용 용도에 따라 어느 범위까지 유지할 것인지 설정한다.
  * 소스상에서만 유지
  * 컴파일 클래스까지 유지
  * 런타임 시에도 유지
* 어노테이션 유지 정책은 `java.lang.annotation.RetentionPolicy` 에 아래와 같은 열거 상수로 정의되어 있다.
* `@Retention` 어노테이션을 사용해서 유지 정책을 지정한다.

| Enum Constant | Description                                                  |
| :------------ | :----------------------------------------------------------- |
| `CLASS`       | 바이트 코드 파일까지 어노테이션 정보를 유지한다. 하지만 리플렉션을 이용해서 어노테이션 정보를 얻을 수 없다. |
| `RUNTIME`     | 바이트 코드 파일 까지 어노테이션을 유지하면서 리플렉션을 이용해서 런타임 시에 어노테이션 정보를 얻을 수 있다. |
| `SOURCE`      | 소스상에서만 어노테이션 정보를 유지한다. 소스 코드를 분석할 때만 의미가 있으며, 바이트 코드 파일에는 정보가 남지 않는다. |

> 리플렉션이란 런타임 시에 클래스의 메타정보를 얻는 기능을 말한다. 예를 들면 클래스가 가지고 있는 필드, 생성자, 메소드, 적용된 어노테이션이 무엇인지 알아내는 것이 리플렉션이다.



### 런타임 시 어노테이션 정보 사용하기

* 런타임 시 어노테이션이 적용되었는지 확인하고 엘리먼트 값을 이용해서 특정 작업을 수행할 수 있다.
* 어노테이션 자체는 아무런 동작이 없지만 리플렉션을 이용해 어노테이션 적용 여부와 엘리먼트 값을 이용해 특정 작업을 수행할 수 있다.
* 클래스에 적용된 어노테이션 정보를 얻으려면 -> `java.lang.Class`
* 필드, 생성자, 메소드에 적용된 어노테이션 정보를 얻으려면  `java.lang.Class` 의 아래 메소드를 사용

| Modifier and Type  | Method                 | Description                                  |
| :----------------- | :--------------------- | :------------------------------------------- |
| `Field[]`          | `getFields()`          | 필드 정보를 `Field[]` 배열로 반환            |
| `Constructor<?>[]` | `getConstructors()`    | 생성자 정보를 `Constructor<?>[]` 배열로 반환 |
| `Method[]`         | `getDeclaredMethods()` | 메소드 정보를 `Method[]` 배열로 반환         |

* `java.lang.reflect` 패키지의 `Field`, `Constructor`, `Method` 가 가지고 있는 아래의 메소드를 통해 어노테이션 정보를 얻을 수 있다.

| Modifier and Type         | Method                                                       | Description                                                  |
| :------------------------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `boolean`                 | `isAnnotationPresent(Class<? extends Annotation> annotationClass)` | 지정한 어노테이션이 적용되어 있는지 여부를 반환한다.         |
| `<T extends Annotation>T` | `getAnnotation(Class<T> annotationClass)`                    | 지정한 어노테이션 적용되어 있으면 어노테이션을 리턴한고 그렇지 않다면 null을 리턴한다. |
| `Annotation[]`            | `getAnnotations()`                                           | 적용된 모든 어노테이션을 리턴한다.                           |
| `Annotation[]`            | `getDeclaredAnnotations()`                                   | 직접 적용된 모든 어노테이션을 리턴한다. Class에서 호출할 때 상위 클래스에 적용된 어노테이션은 포함되지 않는다. |

* 예시

```java
 public static void main(String[] args) {
        //리플렉션을 이용한 UserController 클래스에 선언된 메서드 얻기
        Method[] declaredMethods = UserController.class.getDeclaredMethods();

        for (Method method : declaredMethods) {
            // 해당 메서드에 CurrentUser 어노테이션이 적용되었는지 확인
            if( method.isAnnotationPresent(CurrentUser.class)){
                //CurrentUser 어노테이션 얻기
                CurrentUser annotation = method.getAnnotation(CurrentUser.class);

                //이곳에서 어노테이션 정보를 가지고 특정 작업을 수행합니다.
              	...
            }
        }
}
```



참조

* [이것이 자바다 269p](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788968481475)
* https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/annotation/ElementType.html
* https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/annotation/RetentionPolicy.html
* https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/reflect/AnnotatedElement.html

