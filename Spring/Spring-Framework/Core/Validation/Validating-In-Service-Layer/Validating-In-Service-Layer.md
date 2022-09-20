# 1 Validating In Service Layer

- 컨트롤러가 아닌 서비스에서 validation을 해보자



# 2 @Validated 애노테이션

- 서비스 클래스에 `@Validated` 애노테이션을 꼭 적용해야한다.
- 그래야 `MethodValidationPostProcessor`가  `@Valid`가 붙은 메소드 파라미터를 검증한다.
- 스프링 부트가 `MethodValidationPostProcessor` 컴포넌트를 자동 등록한다
  - [MethodValidationPostProcessor](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/validation/beanvalidation/MethodValidationPostProcessor.html) 링크
- 검증 오류가 발생하면 [ConstraintViolationException](https://docs.oracle.com/javaee/7/api/javax/validation/ConstraintViolationException.html)가 던져진다.



**서비스 클래스**

- 서비스 클래스에 `@Validated` 애노테이션을 적용한다.

```java
@Service
@Validated
public class UserService {

     public UserResource signup(@Valid SignupForm user) {
        // save the user
        // return userResource;
    }
}
```





# 3 ConstraintViolationException 변환하기

- `MethodValidationPostProcessor`는 검증 오류가 발생하면 `ConstraintViolationException`을 던진다.
- 이 예외를 사용자에게 보기 좋게 전달하기 위해 응답 구조를 만들어 보자.
- 사용자에게 아래와 같이 error를 보여줄 것이다.



## 3.1 ConstraintViolationException

- ConstraintViolationException은 아래와 같이 ConstraintViolation을 가지고 있다.



**ConstraintViolationException 클래스**

```java
package javax.validation;

public class ConstraintViolationException extends ValidationException {
	private final Set<ConstraintViolation<?>> constraintViolations;
	...
}
```



**ConstraintViolation 인터페이스의 구현체**

- ConstraintViolation은 인터페이스이며 구현체로 ConstraintViolationImpl가 있다.
- ConstraintViolationImpl의 주요 필드는 아래와 같다.
- **propertyPath**
  - 검증 위반이 발생한 위치
-  **rootBeanClass**
  - 대상 클래스
- **messageTemplate**
  - 오류 메시지 템플릿 key를 의미
- **interpolatedMessage**
  - messageTemplate으로 가져온 메시지를 이용해서 치환된 메시지를 나타냅니다.



**예시**

```
ConstraintViolationImpl{interpolatedMessage='100 이하여야 합니다', propertyPath=registerBoard.registerBoard.number, rootBeanClass=class com.example.monolithicbackend.service.board.BoardCommandService, messageTemplate='{javax.validation.constraints.Max.message}'}
```







**예시**

- field
  - 검증 오류가 발생한 필드의 패스를 가지고있다.
  - 중첩된 필드의 경우 `.` 을 이용해 표현한다.
  - 특정 필드가 아닌 글로벌 검증 오류의 경우 객체의 이름이 들어간다.
- code
  - 에러코드
- message
  - 에러 메시지

```json
[
    {
        field: "user.email",
        code: "com.naturalprogrammer.spring.invalid.email",
        message: "Not a well formed email address"
    },
    {
        field: "user.email",
        code: "com.naturalprogrammer.spring.blank.email",
        message: "Email needed"
    },
    {
        field: "user.name",
        code: "blank.name",
        message: "Name required"
    },
    {
        field: "user", // OR null OR "something.unknown"
        code: "some.code",
        message: "Some form level error"
    },
    {
        field: "user.address.lane",
        code: "com.naturalprogrammer.spring.long.lane",
        message: "Lane must be less than 50 characters"
    }
]
```







참고

- https://codemadeclear.com/index.php/2021/01/26/how-to-mock-dependencies-when-unit-testing-custom-validators/
- https://www.naturalprogrammer.com/courses/332639/lectures/5402564
- https://kapentaz.github.io/spring/Spring-Boo-Bean-Validation-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%95%8C%EA%B3%A0-%EC%93%B0%EC%9E%90/#