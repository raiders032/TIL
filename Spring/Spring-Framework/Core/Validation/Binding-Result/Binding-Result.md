# 1 BindingResult

* 객체에 대한 유효성 검사 및 데이터 바인딩 오류(@ModelAttribute, @RequestBody, @RequestPart)에 대한 접근을 위해 사용된다.
  * 스프링이 제공하는 검증 오류를 보관하는 객체이다. 
  * 검증 오류가 발생하면 여기에 보관하면 된다.
* 검증할 메소드 아규먼트 바로 뒤에 BindingResult를 선언해야한다.
* 검증 오류가 발생하면, `FieldError` , `ObjectError` 를 생성해서 `BindingResult`에 담아준다.
* BindingResult가 있으면 @ModelAttribute 에 데이터 바인딩 시 오류가 발생해도 컨트롤러가 호출된다
  * BindingResult가 없을 때 @ModelAttribute에 바인딩 시 타입 오류가 발생하면  400 오류가 발생하면서 컨트롤러가 호출되지 않고, 오류 페이지로 이동한다.
  * BindingResult가 있으면 오류 정보( FieldError )를 BindingResult 에 담아서 컨트롤러를 정상 호출한다.



**Errors 인터페이스**

```java
package org.springframework.validation;

public interface Errors {
  void reject(String errorCode);
  void reject(String errorCode, String defaultMessage);
  void reject(String errorCode, @Nullable Object[] errorArgs, @Nullable String defaultMessage);
  void rejectValue(@Nullable String field, String errorCode);
  void rejectValue(@Nullable String field, String errorCode, String defaultMessage);
  void rejectValue(@Nullable String field, String errorCode,
                   @Nullable Object[] errorArgs, @Nullable String defaultMessage);
}
```



**BindingResult 인터페이스**

* BindingResult는 인터페이스이고, Errors 인터페이스를 상속받고 있다.
* 컨트롤러에 BindingResult를 아규먼트로 사용하면 실제 넘어오는 구현체는 BeanPropertyBindingResult다
* BeanPropertyBindingResult는 BindingResult와 Errors를 둘다 구현하므로 BindingResult 대신에 Errors로 받을 수 있다
* BindingResult가 Errors 인터페이스보다 많은 기능을 제공하기 때문에 주로 BindingResult를 사용한다

```java
package org.springframework.validation;

public interface BindingResult extends Errors {
}
```



# 2 사용법

**BindingResult에 검증 오류를 적용하는 3가지 방법**

1. @ModelAttribute 의 객체에 타입 오류 등으로 바인딩이 실패하는 경우 스프링이 FieldError 생성해서 BindingResult 에 넣어준다.
2. 개발자가 직접 넣어준다.
3. Validator 사용



**1번 사용 예시**

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



# 3 FieldError

* 필드에 오류가 있으면 `FieldError` 객체를 생성해서 `BindingResult` 에 담아둔다
* `FieldError`는 오류 발생시 사용자 입력 값을 저장하는 기능을 제공한다.
  * `rejectedValue`가 오류 발생시 사용자 입력 값을 저장하는 필드다.




**생성자**

```java
public FieldError(String objectName, String field, String defaultMessage);

public FieldError(String objectName, String field, @Nullable Object rejectedValue, 
                  boolean bindingFailure, @Nullable String[] codes, 
                  @Nullable Object[] arguments, @Nullable String defaultMessage)
```

* objectName : 오류가 발생한 객체 이름
* field : 오류 필드
* defaultMessage: 오류 기본 메시지
* rejectedValue : 사용자가 입력한 값(거절된 값)
* bindingFailure : 타입 오류 같은 바인딩 실패인지, 검증 실패인지 구분 값 
* codes : 메시지 코드
  * 메시지 코드는 하나가 아니라 배열로 여러 값을 전달할 수 있는데, 순서대로 매칭해서 처음 매칭되는 메시지가 사용된다.

* arguments : 메시지에서 사용하는 인자



> **스프링의 바인딩 오류 처리**
>
> 타입 오류로 바인딩에 실패하면 스프링은 FieldError 를 생성하면서 사용자가 입력한 값을 넣어둔다. 그리고 해당 오류를 BindingResult 에 담아서 컨트롤러를 호출한다. 따라서 타입 오류 같은 바인싱 실패시에도 사용자의 오류 메시지를 정상 출력할 수 있다.



# 4 ObjectError

* 특정 필드를 넘어서는 오류가 있으면 `ObjectError` 객체를 생성해서 `BindingResult` 에 담아둔다

**생성자**

```java
public ObjectError(String objectName, String defaultMessage) {}
```



# 5 오류 메시지

* FieldError , ObjectError 의 생성자는 errorCode , arguments 를 제공한다. 
* 이것은 오류 발생시 오류 코드로 메시지를 찾기 위해 사용된다.



## 5.1 오류 메시지 등록하기

**스프링 부트 메시지 설정 추가**

```properties
spring.messages.basename=messages,errors
```

**errors.properties 추가**

```properties
required.item.itemName=상품 이름은 필수입니다. 
range.item.price=가격은 {0} ~ {1} 까지 허용합니다. 
max.item.quantity=수량은 최대 {0} 까지 허용합니다. 
totalPriceMin=가격 * 수량의 합은 {0}원 이상이어야 합니다. 현재 값 = {1}
```

> 참고: errors_en.properties 파일을 생성하면 오류 메시지도 국제화 처리를 할 수 있다.



## 5.2 오류 메시지 사용하기

```java
@PostMapping("/add")
public String addItemV3(@ModelAttribute Item item, 
                        BindingResult bindingResult, 
                        RedirectAttributes redirectAttributes) {

  // itemName 필드 검증
  if (!StringUtils.hasText(item.getItemName())) {
    bindingResult.addError(new FieldError("item", "itemName", item.getItemName(), 
                                          false, new String[]{"required.item.itemName"},
                                          null, null));
  }

  // price 필드 검증
  if (item.getPrice() == null || 
      item.getPrice() < 1000 || 
      item.getPrice() > 1000000) {
    bindingResult.addError(new FieldError("item", "price", item.getPrice(),
                                          false, new String[]{"range.item.price"}, 
                                          new Object[]{1000, 1000000}, null));
  }

  // quantity 필드 검증
  if (item.getQuantity() == null || item.getQuantity() > 10000) {
    bindingResult.addError(new FieldError("item", "quantity",
                                          item.getQuantity(), false, 
                                          new String[]{"max.item.quantity"}, new Object[]
                                          {9999}, null));
  }

  // 특정 필드 예외가 아닌 전체 예외
  if (item.getPrice() != null && item.getQuantity() != null) {
    int resultPrice = item.getPrice() * item.getQuantity();
    if (resultPrice < 10000) {
      bindingResult.addError(new ObjectError("item", new String[]
                                             {"totalPriceMin"}, 
                                             new Object[]{10000, resultPrice}, null));
    } 
  }

  // 검증 오류가 있는 경우
  if (bindingResult.hasErrors()) {
    log.info("errors={}", bindingResult);
    return "validation/v2/addForm";
  }

  // 성공 로직
  Item savedItem = itemRepository.save(item); 
  redirectAttributes.addAttribute("itemId", savedItem.getId()); 			  
  redirectAttributes.addAttribute("status", true);
  return "redirect:/validation/v2/items/{itemId}";
}
```

* itemName 필드 검증의 경우 codes 파라미터의 아규먼트로 `required.item.itemName`를 사용해서 메시지 코드를 지정한다.
  * `required.item.itemName=상품 이름은 필수입니다.` 로 오류 메시지를 등록했기 때문에
  * 오류 메시지로 `상품 이름은 필수입니다.` 가 사용된다
* 메시지 코드는 하나가 아니라 배열로 여러 값을 전달할 수 있는데, 순서대로 매칭해서 처음 매칭되는 메시지가 사용된다.
* price 필드 검증 검증의 경우 `arguments : Object[]{1000, 1000000}`를 사용해 메시지의 {0} , {1}를 치환할 값을 전달한다.
  * `range.item.price=가격은 {0} ~ {1} 까지 허용합니다.` 로 메시지를 등록했다
  * 따라서 플레이스 홀드를 치환하면 `가격은 1000 ~ 1000000 까지 허용합니다.`라는 오류 메시지가 사용된다





# 6 rejectValue(), reject() 메서드

* 검증 오류가 발생하면 위에 예시와 같이 `FieldError` , `ObjectError`를 직접 생성해서 `BindingResult`에 담아야한다.
* `BindingResult`가 제공하는 `rejectValue()` , `reject()` 를 사용하면 `FieldError` , `ObjectError` 를 직접 생성하지 않고, 깔끔하게 검증 오류를 넣을 수 있다



## 6.1 rejectValue() 메서드

* 객체 검증시 특정 필드 오류에는 `rejectValue()` 메서드를 사용한다
* `BindingResult`에 `FieldError` 를 생성해서 등록해준다

```java
void rejectValue(@Nullable String field, String errorCode);
```

```java
void rejectValue(@Nullable String field, String errorCode, String defaultMessage);
```

```java
void rejectValue(@Nullable String field, String errorCode,
			@Nullable Object[] errorArgs, @Nullable String defaultMessage);
```



## 6.2 reject() 메서드

* 객체 검증시 한 필드에 속하지 않는 글로벌 오류에는 reject() 메서드를 사용한다
* `BindingResult`에 `ObjectError` 를  생성해 등록해준다

```java
void reject(String errorCode);
```

```java
void reject(String errorCode, String defaultMessage);
```

```java
void reject(String errorCode, @Nullable Object[] errorArgs, @Nullable String defaultMessage);
```



## 6.3 사용 예시

* rejectValue(), reject() 메서드를 사용해서 5.2 오류 메시지 사용하기 코드를 간소화 해보자

```java
@PostMapping("/add")
public String addItemV4(@ModelAttribute Item item, BindingResult bindingResult,
                        RedirectAttributes redirectAttributes) {

  // itemName 필드 검증
  if (!StringUtils.hasText(item.getItemName())) {
    bindingResult.rejectValue("itemName", "required");
  }
  
  // price 필드 검증
  if (item.getPrice() == null || 
      item.getPrice() < 1000 || 
      item.getPrice() > 1000000) {
    bindingResult.rejectValue("price", "range", 
                              new Object[]{1000, 1000000}, null);
  }
  
  // quantity 필드 검증
  if (item.getQuantity() == null || item.getQuantity() > 10000) {
    bindingResult.rejectValue("quantity", "max", new Object[]{9999}, null);
  }
  
  //특정 필드 예외가 아닌 전체 예외
  if (item.getPrice() != null && item.getQuantity() != null) {
    int resultPrice = item.getPrice() * item.getQuantity();
    if (resultPrice < 10000) {
      bindingResult.reject("totalPriceMin", new Object[]{10000,
                                                         resultPrice}, null);
    } }

  if (bindingResult.hasErrors()) {
    log.info("errors={}", bindingResult);
    return "validation/v2/addForm";
  }

  //성공 로직
  Item savedItem = itemRepository.save(item); 
  redirectAttributes.addAttribute("itemId", savedItem.getId()); 
  redirectAttributes.addAttribute("status", true);
  return "redirect:/validation/v2/items/{itemId}";
}
```

