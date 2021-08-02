#  1 [Validation, Data Binding, and Type Conversion](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#validation)

> **Validation** 
>
> Spring은 검증(및 데이터 바인딩)기능을 제공합니다. 특히, 검증은 웹 계층에 국한되지 않고 애플리케이션의 모든 계층에서 사용할 수 있는 `Validator`를 제공한다.
>
> **Data Binding**
>
>  데이터 바인딩은 사용자 입력을 응용프로그램의 도메인 모델(또는 사용자 입력을 처리하는 데 사용하는 개체)에 동적으로 바인딩할 수 있도록 하는 데 유용하다. Spring에서는 이 기능을 `DataBinder`를 통해 제공한다. `Validator`와 `DataBinder`는 주로 웹 계층에 사용되지만 웹 계층에 국한되지 않고 애플리케이션의 모든 계층에서 사용할 수 있다.



**Validation 어디에서 해야되나?**

>  클라이언트 검증, 서버 검증 클라이언트 검증은 조작할 수 있으므로 보안에 취약하다. 서버만으로 검증하면, 즉각적인 고객 사용성이 부족해진다. 둘을 적절히 섞어서 사용하되, **최종적으로 서버 검증은 필수** API 방식을 사용하면 API 스펙을 잘 정의해서 검증 오류를 API 응답 결과에 잘 남겨주어야 한다

# 2 [Validator Interface](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#validator)

* 스프링에는 개체를 검증하는 데 사용할 수 있는 인터페이스다
* `Validator Interface`는 `Errors ` 개체를 사용하여 작동하므로 `Validator` 는 검증 실패를 `Errors`개체에 등록한다.



**Valisdator 인터페이스**

```java
package org.springframework.validation
    
public interface Validator {
   boolean supports(Class<?> clazz);
   void validate(Object target, Errors errors);
}
```

- `supports(Class)`:  `Validator`가 제공된 클래스의 인스턴스를 검증 할 수 있는지 여부를 반환한다.
- `validate(Object, org.springframework.validation.Errors)`: 지정된 개체를 검증하고 검증 오류가 발생한 경우 해당 개체를 지정된 `Errors`개체에 등록합니다.



**예시**

```java
public class Person {

    private String name;
    private int age;

    // the usual getters and setters...
}
```

```java
public class PersonValidator implements Validator {

    /**
     * This Validator validates only Person instances
     */
    public boolean supports(Class clazz) {
        return Person.class.equals(clazz);
    }

    public void validate(Object obj, Errors e) {
        ValidationUtils.rejectIfEmpty(e, "name", "name.empty");
        Person p = (Person) obj;
        if (p.getAge() < 0) {
            e.rejectValue("age", "negativevalue");
        } else if (p.getAge() > 110) {
            e.rejectValue("age", "too.darn.old");
        }
    }
}
```



# 3 Bean Validation

> 먼저 Bean Validation은 특정한 구현체가 아니라 Bean Validation 2.0(JSR-380)이라는 기술 표준이다. 쉽게 이야기해서 검증 애노테이션과 여러 인터페이스의 모음이다. 마치 JPA가 표준 기술이고 그 구현체로 하이버네이트가 있는 것과 같다. Bean Validation을 구현한 기술중에 일반적으로 사용하는 구현체는 하이버네이트 Validator이다. 이름이 하이버네이트가 붙어서 그렇지 ORM과는 관련이 없다.



## 3.1디펜던시 추가

* Bean Validation을 사용하려면 다음 의존관계를 추가해야 한다.

```groovy
implementation 'org.springframework.boot:spring-boot-starter-validation'
```

`jakarta.validation-api` : Bean Validation 인터페이스 

`hibernate-validator` : 구현체



## 3.2 Bean Validation 애노테이션 적용

```java
import javax.validation.constraints.Max;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class Item {
    private Long id;
    @NotBlank
    private String itemName;
    @NotNull
    @Range(min = 1000, max = 1000000)
    private Integer price;
    @NotNull
    @Max(9999)
    private Integer quantity;

    public Item() {
    }

    public Item(String itemName, Integer price, Integer quantity) {
        this.itemName = itemName;
        this.price = price;
        this.quantity = quantity;
    }
}
```

* 애노테이션의 의미는 [검증 애노테이션 모음]( https://docs.jboss.org/hibernate/validator/6.2/reference/en-US/ html_single/#validator-defineconstraints-spec) 참고



**참고** 

>  `javax.validation.constraints.NotNull`  
>
> `org.hibernate.validator.constraints.Range` 
>
> `javax.validation` 으로 시작하면 특정 구현에 관계없이 제공되는 표준 인터페이스이고, `org.hibernate.validator` 로 시작하면 하이버네이트 validator 구현체를 사용할 때만 제공되는 검증 기능이다. 실무에서 대부분 하이버네이트 validator를 사용하므로 자유롭게 사용해도 된다.



**하이버네이트 Validator 관련 링크**

* [메뉴얼]( https://docs.jboss.org/hibernate/validator/6.2/reference/en-US/html_single/)
* [검증 애노테이션 모음]( https://docs.jboss.org/hibernate/validator/6.2/reference/en-US/ html_single/#validator-defineconstraints-spec)



## 3.3 Bean Validation 애노테이션 사용

* 스프링 부트가 `spring-boot-starter-validation` 라이브러리를 넣으면 자동으로 Bean Validator를 인지하고 스프링에 통합한다
* 스프링 부트는 자동으로 글로벌 `Validator`로 등록한다.
  * `LocalValidatorFactoryBean`을 글로벌 `Validator`로 등록한다. 
  * 이 `Validator`는 `@NotNull` 같은 애노테이션을 보고 검증을 수행한다. 
  * 이렇게 글로벌 `Validator`가 적용되어 있기 때문에, `@Valid` , `@Validated` 만 적용하면 된다.
  * 검증 오류가 발생하면, `FieldError` , `ObjectError` 를 생성해서 `BindingResult`에 담아준다.
* `@Valid` , `@Validated`
  * `@Valid` :  자바 표준 검증 애노테이션, 의존성 추가 필요
  *  `@Validated`:  스프링 전용 검증 애노테이션, 그룹 기능 추가



**주의**

> 다음과 같이 직접 글로벌 Validator를 직접 등록하면 스프링 부트는 Bean Validator를 글로벌
> Validator 로 등록하지 않는다. 따라서 애노테이션 기반의 빈 검증기가 동작하지 않는다.
>
> ```java
> @SpringBootApplication
> public class ItemServiceApplication implements WebMvcConfigurer {
>  // 글로벌 검증기 추가
> @Override
> public Validator getValidator() {
> return new ItemValidator();
> }
>  // ...
> }
> ```



**사용 예시**

* 검증이 필요한 객체에 `@Validated` 또는 `@Valid`를 적용
* 검증 오류가 발생하면, `FieldError` , `ObjectError` 가 `BindingResult` 에 담겨있다.

```java
    @PostMapping("/add")
    public String addItem(@Validated @ModelAttribute Item item, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            log.info("errors={}", bindingResult);
            return "validation/v3/addForm";
        }
        
        ...
    }
```



## 3.4 검증 순서

1. @ModelAttribute 각각의 필드에 타입 변환 시도 
   * 성공하면 다음으로
   * 실패하면 `typeMismatch` 로 `FieldError` 추가
2. Validator 적용
   * 바인딩에 성공한 필드만 Bean Validation 적용

**예시 1**

1. itemName 에 문자 "A" 입력 
2. 타입 변환 성공 
3. itemName 필드에 BeanValidation 적용 

**예시 2**

1. price 에 문자 "A" 입력 
2. "A"를 숫자 타입 변환 시도 실패 
3. typeMismatch FieldError 추가 
4. price 필드는 BeanValidation 적용 X

**참고**

> `@ModelAttribute` 는 HTTP 요청 파라미터(URL 쿼리 스트링, POST Form)를 다룰 때 사용한다.
> `@RequestBody` 는 HTTP Body의 데이터를 객체로 변환할 때 사용한다. 주로 API JSON 요청을 다룰 때
> 사용한다.

# 4 Bean Validation - 에러 코드

* Bean Validation이 기본으로 제공하는 오류 메시지를 커스텀 해보자
* Bean Validation을 적용하고 bindingResult 에 등록된 검증 오류 코드를 살펴보면
  * 오류 코드가 애노테이션 이름으로 자동 등록된다.
  * 4.1의 예시를 보자



## 4.1 예시

* 검증 에러시 애노테이션을 기반으로 `MessageCodesResolver`가 오류 아래와 같이 오류 코드를 자동 생성한다.

  

**@NotBlank**

* `NotBlank.item.itemName`  : `애노테이션이름.객체이름.필드이름`
* `NotBlank.itemName` : 애노테이션이름.필드이름
* `NotBlank.java.lang.String` : `애노테이션이름.필드타입`
* `NotBlank`: `애노테이션이름`

@**Range** 

* `Range.item.price` 
* `Range.price` 
* `Range.java.lang.Integer` 
* `Range`



## 4.2 메시지 등록

`errors.properties`작성

* 에러 코드와 매핑되는 커스텀한 에러 메세지를 아래와 같이 정의한다.

```properties
NotBlank={0} 공백X
Range={0}, {2} ~ {1} 허용
Max={0}, 최대 {1}
```



## 4.3 BeanValidation 메시지의 우선순위

1. 생성된 메시지 코드 순서대로 `messageSource` 에서 메시지 찾기
2. 애노테이션의 message 속성 사용 -> @NotBlank(message = "공백! {0}") 
3. 라이브러리가 제공하는 기본 값 사용 -> 공백일 수 없습니다.



# 5 Bean Validation - 오브젝트 오류

* Bean Validation에서 특정 필드(`FieldError`)가 아닌 해당 오브젝트 관련 오류(`ObjectError`)는 어떻게 처리하는 방법을 알아보자



## 5.1 @ScriptAssert()

* `가격 * 수량이 >= 10000`인 검증 조건을 적용한 예시
* 검증 에러 코드
  * `ScriptAssert.item`
  * `ScriptAssert`

```java
@Data
@ScriptAssert(lang = "javascript", script = "_this.price * _this.quantity >=
10000")
public class Item {
 //...
}
```



**@ScriptAssert() 사용해도 좋을까?**

* 실제 사용해보면 제약이 많고 복잡하다
* 실무에서는 검증 기능이 해당 객체의 범위를 넘어서는 경우들도 종종 등장한다
* 오브젝트 오류(글로벌 오류)의 경우 @ScriptAssert 보다는 직접 자바 코드로 작성하는 것을 권장한다.

```java
@PostMapping("/add")
    public String addItem(@Validated @ModelAttribute Item item, BindingResult bindingResult, RedirectAttributes redirectAttributes) {
        //특정 필드 예외가 아닌 전체 예외는 자바 코드로 처리
        if (item.getPrice() != null && item.getQuantity() != null) {
            int resultPrice = item.getPrice() * item.getQuantity();
            if (resultPrice < 10000) {
                bindingResult.reject("totalPriceMin", new Object[]{10000,
                        resultPrice}, null);
            }
        }
        
        if (bindingResult.hasErrors()) {
            log.info("errors={}", bindingResult);
            return "validation/v3/addForm";
        }
        
        //성공 로직
        Item savedItem = itemRepository.save(item);
        redirectAttributes.addAttribute("itemId", savedItem.getId());
        redirectAttributes.addAttribute("status", true);
        return "redirect:/validation/v3/items/{itemId}";
    }
```



# 6 Bean Validation - groups

* 아이템을 등록할 때와 수정할 때 동일한 모델 객체를 사용한다고 가정하고 각각 다르게 검증하는 방법을 알아보자

**2가지 방법이 존재한다**

1. `BeanValidation`의 `groups` 기능을 사용한다. 
2. `Item`을 직접 사용하지 않고, `ItemSaveForm`, `ItemUpdateForm` 같은 폼 전송을 위한 별도의 모델 객체를 만들어서 사용한다.



# 7 Bean Validation - HTTP 메시지 컨버터

* `@Valid` , `@Validated` 를 HttpMessageConverter (`@RequestBody`)에도 적용할 수 있다

**사용 예시**

```java
@PostMapping("/add")
public Object addItem(@RequestBody @Validated ItemSaveForm form, BindingResult bindingResult) {
        log.info("API 컨트롤러 호출");

        if (bindingResult.hasErrors()) {
            log.info("검증 오류 발생 errors={}", bindingResult);
            return bindingResult.getAllErrors();
        }

        log.info("성공 로직 실행");
        return form;
}
```



## 7.2 검증 순서

1. 성공 요청: 성공 
2. 실패 요청: JSON을 객체로 생성하는 것 자체가 실패함
3. 검증 오류 요청: JSON을 객체로 생성하는 것은 성공했고, 검증에서 실패함



## 7.3 @ModelAttribute vs @RequestBody

* `@ModelAttribute`
  * `@ModelAttribute`는 필드 단위로 정교하게 바인딩이 적용된다. 
  * 특정 필드가 바인딩 되지 않아도 나머지 필드는 정상 바인딩 되고, Validator를 사용한 검증도 적용할 수 있다. 
* `@RequestBody`
  * `@RequestBody`는 HttpMessageConverter 단계에서 JSON 데이터를 객체로 변경하지 못하면 이후 단계 자체가 진행되지 않고 예외가 발생한다. 
  * 컨트롤러도 호출되지 않고, Validator도 적용할 수 없다.



**참고**

* https://docs.spring.io/spring-framework/docs/current/reference/html/core.html
* https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-2/dashboard