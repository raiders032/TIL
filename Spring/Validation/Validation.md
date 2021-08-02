## Validation Interface 

* 애플리케이션에서 사용하는 객체 검증용 인터페이스.
* [org.springframework.validation.Validator](https://docs.spring.io/spring-framework/docs/current/javadoc-api/)
* 특징
  * 어떤한 계층과도 관계가 없다. => 모든 계층(웹, 서비스, 데이터)에서 사용할 수 있다.
  * DataBinder에 들어가 바인딩 할 때 같이 사용되기도 한다.
* 구현체 
  * JSR-303(Bean Validation 1.0)
  * [LocalValidatorFactoryBean](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/validation/beanvalidation/LocalValidatorFactoryBean.html)
* 스프링 부트 2.0.5 이상 버전을 사용하면
  * **LocalValidatorFactoryBean** 빈으로 자동 등록
  * JSR-380(Bean Validation 2.0.1) 구현체로 hibernate-validator 사용.

| Modifier and Type | Method and Description                                       |
| :---------------- | :----------------------------------------------------------- |
| `boolean`         | `supports(Class<?> clazz)`: 어떤 타입의 객체를 검증할 때 사용할 것인지 결정함 |
| `void`            | `validate(Object target, Errors errors)`: 실제 검증 로직을 이 안에서 구현 |



## @Valid

* javax.validation
* 그룹을 지정할 방법이 없다.



## @Validated

* org.springframework.validation.annotation
* 그룹 클래스를 설정할 수 있다.
