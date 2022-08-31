#  1 [Validator를 사용해서 Validation하기](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#validator)



## 1.1 Validation

* Spring은 검증(및 데이터 바인딩)기능을 제공한다
* 특히, 검증은 웹 계층에 국한되지 않고 애플리케이션의 모든 계층에서 사용할 수 있는 `Validator`를 제공한다.

>   #### Validation 어디에서 해야되나?
>
>   클라이언트 검증은 조작할 수 있으므로 보안에 취약하다. 서버만으로 검증하면, 즉각적인 고객 사용성이 부족해진다. 둘을 적절히 섞어서 사용하되, **최종적으로 서버 검증은 필수** API 방식을 사용하면 API 스펙을 잘 정의해서 검증 오류를 API 응답 결과에 잘 남겨주어야 한다.



# 2 Validator Interface

* 스프링이 제공하는 객체를 검증하는 데 사용할 수 있는 인터페이스다.
* `Validator Interface`는 `Errors ` 객체를 사용하여 작동하므로 `Validator`는 검증 실패를 `Errors` 객체에 등록한다.
* 컨트롤러에서 직접 검증 로직을 처리하기보다 별도의 클래스로 역할을 분리하는 것이 좋다 이럴 때 `Validator`를 사용한다.



## 2.1 Validator 인터페이스

```java
package org.springframework.validation
    
public interface Validator {
   boolean supports(Class<?> clazz);
   void validate(Object target, Errors errors);
}
```

**Validator의 메소드**

`supports(Class)`

-   `Validator`가 제공된 클래스의 인스턴스를 검증 할 수 있는지 여부를 반환한다.

`validate(Object, org.springframework.validation.Errors)`

-  지정된 객체를 검증하고 검증 오류가 발생한 경우 오류를 `Errors`개체에 등록한다.



## 2.2 Validator 인터페이스 구현

```java
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

@Component
public class ItemValidator implements Validator {
  @Override
  public boolean supports(Class<?> clazz) {
    return Item.class.isAssignableFrom(clazz);
  }

  @Override
  public void validate(Object target, Errors errors) {
    Item item = (Item) target;
    ValidationUtils.rejectIfEmptyOrWhitespace(errors, "itemName","required");
    
    if (item.getPrice() == null || item.getPrice() < 1000 || item.getPrice() > 1000000) {
      errors.rejectValue("price", "range", new Object[]{1000, 1000000},
    }

    if (item.getQuantity() == null || item.getQuantity() > 10000) {
    	errors.rejectValue("quantity", "max", new Object[]{9999}, null);
    }

    //특정 필드 예외가 아닌 전체 예외
    if (item.getPrice() != null && item.getQuantity() != null) {
    	int resultPrice = item.getPrice() * item.getQuantity();
      if (resultPrice < 10000) {
      	errors.reject("totalPriceMin", new Object[]{10000, resultPrice}, null);
      }                   
    }                       
  }
}
```



**ValidationUtils 사용**

* `ValidationUtils`가 제공하는 메소드를 사용해서 검증할 수 있다
* [ValidationUtils 참고](https://docs.spring.io/spring-framework/docs/5.3.15/javadoc-api/org/springframework/validation/ValidationUtils.html)

```java
public class PersonValidator implements Validator {
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





## 2.3 Validator 직접 사용하기

* 빈으로 등록된 ItemValidator을 주입받아 직접 검증하기

```java
private final ItemValidator itemValidator;

@PostMapping("/add")
public String addItemV5(@ModelAttribute Item item, BindingResult bindingResult,RedirectAttributes redirectAttributes) {
  //검증
  itemValidator.validate(item, bindingResult);
  
  //검증 오류시
  if (bindingResult.hasErrors()) {
    log.info("errors={}", bindingResult);
    return "validation/v2/addForm";
  }
  
  //성공 로직
  Item savedItem = itemRepository.save(item); redirectAttributes.addAttribute("itemId", savedItem.getId());
  redirectAttributes.addAttribute("status", true);
 	return "redirect:/validation/v2/items/{itemId}";
}
```



## 2.4 WebDataBinder를 통해서 Validator 사용하기

* WebDataBinder 는 스프링의 파라미터 바인딩의 역할을 해주고 검증 기능도 내부에 포함한다.
* 아래의 코드를 컨트롤러에 작성한다.
  * WebDataBinder에 검증기가 추가되고 해당 컨트롤러에서는 검증기를 자동으로 적용할 수 있다.
  * 해당 컨트롤러에만 영향을 준다. 글로벌 설정은 별도로 해야한다.

```java
@InitBinder
public void init(WebDataBinder dataBinder) {
  log.info("init binder {}", dataBinder);
  dataBinder.addValidators(itemValidator);
}
```

* validator를 직접 호출하지 않고 검증 대상 앞에 `@Validated` 를 붙인다
  * @Validated 는 검증기를 실행하라는 애노테이션이다.
  * WebDataBinder 에 등록한 검증기를 찾아서 실행한다. 
  * 여러 검증기를 등록한다면 그 중에 어떤 검증기가 실행되어야 할지 구분이 필요하다. 이때 supports() 가 사용된다.

```java
@PostMapping("/add")
public String addItemV6(@Validated @ModelAttribute Item item, BindingResult bindingResult,RedirectAttributes redirectAttributes){
  if (bindingResult.hasErrors()) {
    log.info("errors={}", bindingResult);
    return "validation/v2/addForm";
  }
  
  //성공 로직
  Item savedItem = itemRepository.save(item); redirectAttributes.addAttribute("itemId", savedItem.getId()); 
  redirectAttributes.addAttribute("status", true);
  return "redirect:/validation/v2/items/{itemId}";
}
```



# 3 [Resolving Codes to Error Messages](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#validation-conversion)

* 검증 오류에 해당하는 메시지 출력하기
* `MessageSource` 에 오류 코드를 정의하고 그에 해당하는 오류 메시지를 출력할 수 있다.
*  `e.rejectValue("age", "too.darn.old");`
  * MessageCodesResolver에 의해서 `too.darn.old code` 뿐만 아니라 `too.darn.old.age`,  `too.darn.old.age.int`도 코드로 등록된다.



**참고**

* https://docs.spring.io/spring-framework/docs/current/reference/html/core.html
* https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#validation-conversion
* https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-2/dashboard