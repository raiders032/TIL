# 1 ArgumentResolver

* 애노테이션 기반의 컨트롤러는 매우 다양한 파라미터를 사용할 수 있다.
* HttpServletRequest , Model, @RequestParam , @ModelAttribute, @RequestBody , HttpEntity 등등
* 애노테이션 기반 컨트롤러를 처리하는 **RequestMappingHandlerAdaptor가 ArgumentResolver를 호출해서 컨트롤러(핸들러)가 필요로 하는 다양한 파라미터의 값(객체)을 생성한다.**
* 스프링은 30개가 넘는 ArgumentResolver 를 기본으로 제공한다.
* [사용 가능한 메소드 아규먼트](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-arguments)



# 2 인터페이스

* HandlerMethodArgumentResolver를 구현해서 원하는 ArgumentResolver를 만들 수 있다.

```java
public interface HandlerMethodArgumentResolver {
  boolean supportsParameter(MethodParameter parameter);
  
  @Nullable
  Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
                         NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception;
}
```

 **supportsParameter()**

* ArgumentResolver가 해당 파라미터를 지원하는지 체크하는데 사용

**resolveArgument()**

*  `supportsParameter()`가 `true`이면 `resolveArgument()` 를 실행해서 객체를 생성한다.
* 이렇게 생성된 객체가 컨트롤러 호출시 넘어간다.



# 3 ArgumentResolver 사용하기

* ArgumentResolver를 사용해 세션에 로그인한 유저를 컨트롤러에서 파라미터로 받아보자!
* `@Login` 이라는 커스텀한 애노테이션을 만들어서 컨트롤러에서 편리하게 사용해보기



**컨트롤러**

* ArgumentResolver를 사용해서 세션에 있는 로그인 회원을 찾아주고 loginMember에 넣어주고 만약 없다면 null을 반환하도록 개발한다.

```java
@GetMapping("/")
public String homeLoginV3ArgumentResolver(@Login Member loginMember, Model model) {
  //세션에 회원 데이터가 없으면 home 
  if (loginMember == null) {
  	return "home";
	}
	//세션이 유지되면 loginhome으로 이동
  model.addAttribute("member", loginMember); 
  return "loginHome";
}
```



**Login 애노테이션**

```java
package hello.login.web.argumentresolver;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface Login {
}
```

* @Target(ElementType.PARAMETER) : 파라미터에만 사용
* @Retention(RetentionPolicy.RUNTIME) : 리플렉션 등을 활용할 수 있도록 런타임까지 애노테이션 정보가 남아있음



**LoginMemberArgumentResolver 구현**

* supportsParameter()
  * @Login 애노테이션이 있고 Member 타입인 경우에만 작동
* resolveArgument()
  * 세션을 가져옴
  * 세션이 없으면 null 반환
  * 세션에서

```java
@Slf4j
public class LoginMemberArgumentResolver implements HandlerMethodArgumentResolver {
  
  @Override
  public boolean supportsParameter(MethodParameter parameter) { 
    log.info("supportsParameter 실행");                                                             
    boolean hasLoginAnnotation = parameter.hasParameterAnnotation(Login.class);
    boolean hasMemberType = Member.class.isAssignableFrom(parameter.getParameterType());
    return hasLoginAnnotation && hasMemberType;
  }
  
  @Override
  public Object resolveArgument(MethodParameter parameter,
                                ModelAndViewContainer mavContainer, NativeWebRequest webRequest,
                                WebDataBinderFactory binderFactory) throws Exception {
    log.info("resolveArgument 실행");
    HttpServletRequest request = (HttpServletRequest)webRequest.getNativeRequest();
    HttpSession session = request.getSession(false);
    if (session == null) {
      return null;
    }
    return session.getAttribute(SessionConst.LOGIN_MEMBER);
  }
}
```



**등록하기**

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
  @Override
  public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
    resolvers.add(new LoginMemberArgumentResolver());
  }
}
```