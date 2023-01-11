# 1. [Spring Cloud OpenFeign](https://docs.spring.io/spring-cloud-openfeign/docs/current/reference/html/)

> Feign은 선언적 웹 서비스 클라이언트입니다. 웹 서비스 클라이언트를 보다 쉽게 작성할 수 있습니다. Feign을 사용하려면 인터페이스를 만들고 주석을 추가합니다. Feign 주석과 JAX-RS 주석을 포함한 플러그형 주석 지원 기능이 있습니다. Feign은 플러그형 인코더와 디코더도 지원합니다. Spring Cloud는 Spring MVC 주석과 Spring Web에서 기본적으로 사용되는 것과 동일한 HttpMessage Converter를 사용할 수 있도록 지원합니다. Spring Cloud는 Spring Cloud CircuitBreaker, Eureka와 통합하여 사용할 수 있고 Spring Cloud LoadBalancer를 통합하여 Feign을 사용할 때 로드 밸런싱된 http 클라이언트를 제공합니다.



## 1.1. Feign 사용하기

**디펜던시 추가**

```xml
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```



**`@EnableFeignClients` 어노테이션 붙이기**

* 이제 FeignClients를 사용할 수 있다.

```java
@SpringBootApplication
@EnableFeignClients
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
```



**인터페이스에 @FeignClient() 어노테이션 붙이기**

* @FeignClient 주석에서 String 값("store")은 임의의 클라이언트 이름으로, Spring Cloud LoadBalancer 클라이언트를 생성하는 데 사용됩니다. 
* URL 속성(절대값 또는 호스트 이름)을 사용하여 URL을 지정할 수도 있습니다.

```java
@FeignClient("order-service")
public interface OrderServiceClient {
    
    @GetMapping("order-service/{userId}/orders")
    public List<ResponseOrder> getOrders(@PathVariable String userId);
}
```



**FeignClients 사용하기**

* `@FeignClient` 어노테이션이 붙은 인터페이스를 사용할 수 있다.

```java
@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {
  
  private final OrderServiceClient orderServiceClient;

  @Override
  public UserDto getUserByUserId(String userId) {
    User user = userRepository.findByUserId(userId);

    if (user == null)
      throw new UsernameNotFoundException("User not found");

    UserDto userDto = modelMapper.map(user, UserDto.class);

    List<ResponseOrder> orders = orderServiceClient.getOrders(userId);
    userDto.setOrders(orders);
    return userDto;
  }
}
```