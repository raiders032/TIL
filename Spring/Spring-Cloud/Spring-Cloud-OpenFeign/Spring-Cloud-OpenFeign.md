# 1 Spring Cloud OpenFeign

- [레퍼런스](https://docs.spring.io/spring-cloud-openfeign/docs/current/reference/html/)
- Feign은 선언적 웹 서비스 클라이언트다.
	- 선언적이라는 의미는 예를 들면 택시를 탈 때 목적지를 말하면 기사님이 알아서 가주는 것과 같고 반대로 100미터 앞에서 좌회전 등 목적지에 도달하기 위해 일일이 기사님에게 명령을 하는것은 비선언적이라고 한다.
	* 즉 선언적이라는 의미는 루프와 if 조건문 써가며 동작을 일일이 구현하지 않아도 된다는 의미이다
	* REST Clients로 사용되는 RestTemplate 또는 WebClient를 사용해 직접 코드 구현을 하지 않고 선언적 방식으로  웹 서비스 클라이언트를 보다 쉽게 작성할 수 있다.

<br>

## 1.1 디펜던시 추가


```xml
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```


<br>

# 2 Feign 사용하기

## 2.1 @EnableFeignClients 

* FeignClients를 사용하기 위해서는 `@EnableFeignClients`를 활성화 해야한다.
* `@EnableFeignClients(basePackages = "com.example.clients")` 와 같이 클라이언트의 위치를 지정할 수 있다.
* `@EnableFeignClients(clients = InventoryServiceFeignClient.class)` 처럼 특정 클래스를 지정할 수 있다.

```java
@SpringBootApplication
@EnableFeignClients
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
```


<br>

## 2.1 @FeignClient()

* @FeignClient 주석에서 String 값("store")은 임의의 클라이언트 이름으로, Spring Cloud LoadBalancer 클라이언트를 생성하는 데 사용된다.
* URL 속성(절대값 또는 호스트 이름)을 사용하여 URL을 지정할 수도 있다.

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