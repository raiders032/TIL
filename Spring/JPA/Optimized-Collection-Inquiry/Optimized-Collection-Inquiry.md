# 1 컬렉션 조회 최적화

*  [지연로딩과 조회 성능 최적화](../Lazy-Loading-And-Optimaization-Of-Inquiry/Lazy-Loading-And-Optimaization-Of-Inquiry.md)에서 ToOne 관계에 대해서 알아봤다면 이번엔 ToMany관계에 대해서 알아보자
* `Order` 와 `Member` 일대일 관계이다.
* `Order` 와 `Delivery` 일대일 관계이다.
* `Order` 와 `OrderItem` 일대다 관계이다.
* `OrderItem` 과 `Item` 은 다대일 관계이다.
* 연관 관계는 모두 `fetch = FetchType.LAZY` 로 설정되어 있다.



# 2 엔티티 조회



## 2.1 엔티티 직접 노출 버전

* **엔티티 직접 노출하는 것은 피하자**
  * 엔티티가 변하면 API 스펙이 변한다
* 양방향 연관 관계가 있다면 JSON으로 변환하는 과정에서 문제가 발생한다.
  * 양방향 연관관계면 무한 루프에 걸리지 않게 한곳에 @JsonIgnore 를 추가해야 한다.

```java
@RestController
@RequiredArgsConstructor
public class OrderApiController {

    private final OrderRepository orderRepository;

    @GetMapping("/api/v1/orders")
    public List<Order> ordersV1() {
        List<Order> all = orderRepository.findAll();

        for (Order order : all) {
            order.getMember().getName(); //Lazy 강제 초기화
            order.getDelivery().getAddress(); //Lazy 강제 초기환
            List<OrderItem> orderItems = order.getOrderItems();
            orderItems.stream().forEach(o -> o.getItem().getName());	//Lazy 강제초기화
        }
        
        return all;
    }
}
```



## 2.2 엔티티를 DTO로 변환 버전

* SQL 실행 횟수
  * `Order` 조회 1회 -> N개의 `Order` 가 조회됨
  * `Order` -> `Member` 지연 로딩 N회
  * `Order` -> `Delivery` 지연 로딩 N회
  * `Order` -> `OrderItem` 지연 로딩 N회 각각 K개의 `OrderItem` 이 조회된다.
  * `OrderItem` ->  `Item` 지연 로딩 K회
* 성능이 좋지 않다 -> fetch 조인을 고려해보자

```java
@RestController
@RequiredArgsConstructor
public class OrderApiController {

    private final OrderRepository orderRepository;

    @GetMapping("/api/v2/orders")
    public List<OrderDto> ordersV2() {
        List<Order> orders = orderRepository.findAll();

        List<OrderDto> result = orders.stream()
                .map(o -> new OrderDto(o))
                .collect(toList());

        return result;
    }
}
```

```java
@Data
class OrderDto {
    private Long orderId;
    private String name;
    private LocalDateTime orderDate;
    private OrderStatus orderStatus;
    private Address address;
    private List<OrderItemDto> orderItems;

    public OrderDto(Order order) {
        orderId = order.getId();
        name = order.getMember().getName();
        orderDate = order.getOrderDate();
        orderStatus = order.getStatus();
        address = order.getDelivery().getAddress();
        orderItems = order.getOrderItems().stream()
                .map(orderItem -> new OrderItemDto(orderItem)).collect(toList());
    }
}
```

```java
@Data
class OrderItemDto {
    private String itemName;
    private int orderPrice;
    private int count;

    public OrderItemDto(OrderItem orderItem) {
        itemName = orderItem.getItem().getName();
        orderPrice = orderItem.getOrderPrice();
        count = orderItem.getCount();
    }
}
```



## 2.3 엔티티를 DTO로 변환 + 페치 조인 최적화 버전

* `Order` 와 `OrderItem` 일대다 관계이다. 
* `Order` 와 `OrderItem` 을 페치 조인한다
  * `Order` 1개에 `OrderItem` 이 5개 있다고 가정하면 페치 조인시 로우가 5개가 된다.
  * 즉 같은 `Order` 가 5개가 중복되게 된다.
  * 이 증복을 없어기 위해서 `distinct` 를 사용할 수 있다.
  * JPA의 `distinct`는 SQL에 distinct를 추가하고, 더해서 같은 엔티티가 조회되면, 애플리케이션에서 중복을 걸러준다. 
* 결과적으로 SQL 실행 횟수는 1회이다.
* 단점
  * **컬렉션을 페치 조인하게되면 페이징이 불가능하다.**
* 페이징이 불가능한 이유    
  * 일다대에서 일(1)을 기준으로 페이징을 하는 것이 목적이다. 
  * 그런데 데이터는 다(N)를 기준으로 row 가 생성된다.
  * `Order`를 기준으로 페이징 하고 싶은데, 다(N)인 `OrderItem`을 조인하면 OrderItem이 기준이 되어 버린다.

> 참고
>
> 컬렉션 페치 조인을 사용하면 페이징이 불가능하다. 하이버네이트는 경고 로그를 남기면서 모든 데이터를 DB에서 읽어오고, 메모리에서 페이징 해버리는데 이는 매우 위험하다.

```java
@RestController
@RequiredArgsConstructor
public class OrderApiController {

  private final OrderRepository orderRepository;

  @GetMapping("/api/v3/orders")
  public List<OrderDto> ordersV3() {
    List<Order> orders = orderRepository.findAllWithItem();

    List<OrderDto> result = orders.stream()
      .map(o -> new OrderDto(o)).collect(toList());

    return result;
  }
}
```

 ```java
@Repository
@RequiredArgsConstructor
public class OrderSimpleQueryRepository {
  private final EntityManager em;

  public List<Order> findAllWithItem() {
    // Order와 일대다 관계인 orderItems을 페치 조인함으로써 orderItems을 기준으로 row가 생성되고 이로인해 페이징이 불가능해진다
    return em.createQuery(
      "select distinct o from Order o" + 
      " join fetch o.member m" +
      " join fetch o.delivery d" +
      " join fetch o.orderItems oi" +
      " join fetch oi.item i", Order.class)
      .getResultList();
  }
}
 ```



## 2.4 엔티티를 DTO로 변환 + 페치 조인 최적화 + 페이징 버전

* 앞선 버전에서는 컬렉션을 페치 조인하면서 페이징이 불가능했다.
* 페이징 + 컬렉션 엔티티를 함께 조회하는 방법을 알아보자.



**컬렌션 조회 최적화 방법**

* 먼저 ToOne(OneToOne, ManyToOne) 관계를 모두 페치조인 한다
  * ToOne 관계는 row수를 증가시 키지 않으므로 페이징 쿼리에 영향을 주지 않는다.
* 컬렉션은 지연 로딩으로 조회한다.
* 지연 로딩 성능 최적화를 위해 `spring.jpa.properties.hibernate.default_batch_fetch_size` , `@BatchSize` 를 적용한다.
  * `spring.jpa.properties.hibernate.default_batch_fetch_size`: 글로벌 설정
  * `@BatchSize`: 개별 최적화
  * 이 옵션을 사용하면 컬렉션이나, 프록시 객체를 한꺼번에 설정한 size 만큼 IN 쿼리로 조회한다.

**장점**

* 쿼리호출수가`1+N` 에서 `1+1`로최적화된다.
* 컬렉션 페치 조인은 페이징이 불가능 하지만 이 방법은 페이징이 가능하다.
* 조인보다 DB 데이터 전송량이 최적화 된다.
  * `Order`와 `OrderItem`을 조인하면 `Order`가 `OrderItem` 만큼 중복해서 조회된다.

> 참고
>
> `default_batch_fetch_size` 의 크기는 적당한 사이즈를 골라야 하는데, 100~1000 사이를 선택 하는 것을 권장한다. 이 전략을 SQL IN 절을 사용하는데, 데이터베이스에 따라 IN 절 파라미터를 1000으로 제한하기도 한다. 1000으로 잡으면 한번에 1000개를 DB에서 애플리케이션에 불러오므로 DB에 순간 부하가 증가할 수 있다. 하지만 애플리케이션은 100이든 1000이든 결국 전체 데이터를 로딩해야 하므로 메모리 사용량이 같다. 1000으로 설정하는 것이 성능상 가장 좋지만, 결국 DB든 애플리케이션이든 순간 부 하를 어디까지 견딜 수 있는지로 결정하면 된다.

```java
@RestController
@RequiredArgsConstructor
public class OrderApiController {

    private final OrderRepository orderRepository;
    
    @GetMapping("/api/v3.1/orders")
    public List<OrderDto> ordersV3_page(@RequestParam(value = "offset", defaultValue = "0") int offset,
                                        @RequestParam(value = "limit", defaultValue = "100") int limit) {
        List<Order> orders = orderRepository.findAllWithMemberDelivery(offset, limit);

        List<OrderDto> result = orders.stream().map(o -> new OrderDto(o))
                .collect(toList());

        return result;
    }
}
```

```java
@Repository
@RequiredArgsConstructor
public class OrderRepository {
  private final EntityManager em;

  public List<Order> findAllWithMemberDelivery() {
    // Order와 ToOne 관계인 member와 delivery는 페치 조인한다
    return em.createQuery(
      "select o from Order o" + 
      " join fetch o.member m" +
      " join fetch o.delivery d", Order.class)
      .getResultList();
  }
}
```

* 컬렉션의 지연 로딩 성능 최적화를 위해 `hibernate.default_batch_fetch_size` 로 글로벌한 배치 사이즈를 설정한다
* 이 옵션을 사용하면 컬렉션이나, 프록시 객체를 한꺼번에 설정한 size 만큼 IN 쿼리로 조회한다.

```yaml
spring:
  jpa:
    properties:
      hibernate:
        default_batch_fetch_size: 500
```



# 3 DTO 조회

## 3.1 DTO 직접 조회

* SQL 실행 횟수
  * 루트 조회 (ToOne 관계 함께) N개의 결과가 나온다 ->  1회
  * 추가적으로 ToMany관계 조회 -> N회

```java
@RestController
@RequiredArgsConstructor
public class OrderApiController {

    private final OrderRepository orderRepository;

    @GetMapping("/api/v4/orders")
    public List<OrderQueryDto> ordersV4() {
        return orderQueryRepository.findOrderQueryDtos();
    }
}
```

```java
@Repository
@RequiredArgsConstructor
public class OrderQueryRepository {
    private final EntityManager em;

    public List<OrderQueryDto> findOrderQueryDtos() { 
      	//루트 조회(toOne 코드를 모두 한번에 조회)
        List<OrderQueryDto> result = findOrders();

      	//루프를 돌면서 컬렉션 추가(추가 쿼리 실행)
        result.forEach(o -> {
            List<OrderItemQueryDto> orderItems = findOrderItems(o.getOrderId());
            o.setOrderItems(orderItems);
        });

        return result;
    }

  	//ToOne 관계 한번에 조회
    private List<OrderQueryDto> findOrders() {
        return em.createQuery(
                "select new jpabook.jpashop.repository.order.query.OrderQueryDto(o.id, m.name, o.orderDate, o.status, d.address)" +
                " from Order o" +
                " join o.member m" +
                " join o.delivery d", OrderQueryDto.class).getResultList();
    }

  	//ToMany 관계 orderItems 조회
    private List<OrderItemQueryDto> findOrderItems(Long orderId) {
        return em.createQuery(
                "select new jpabook.jpashop.repository.order.query.OrderItemQueryDto(oi.order.id, i.name, oi.orderPrice, oi.count)" +
                " from OrderItem oi" +
                " join oi.item i" +
                " where oi.order.id = : orderId", OrderItemQueryDto.class)
                .setParameter("orderId", orderId)
                .getResultList();
    }
}
```

```java
@Data
@EqualsAndHashCode(of = "orderId")
public class OrderQueryDto {
    private Long orderId;
    private String name;
    private LocalDateTime orderDate;
    private OrderStatus orderStatus;
    private Address address;
    private List<OrderItemQueryDto> orderItems;

    public OrderQueryDto(Long orderId, String name, LocalDateTime orderDate,
                         OrderStatus orderStatus, Address address) {
        this.orderId = orderId;
        this.name = name;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.address = address;
    }
}
```

```java
@Data
public class OrderItemQueryDto {
    @JsonIgnore
    private Long orderId;
    private String itemName;
    private int orderPrice;
    private int count;

    public OrderItemQueryDto(Long orderId, String itemName, int orderPrice, int count) {
        this.orderId = orderId;
        this.itemName = itemName;
        this.orderPrice = orderPrice;
        this.count = count;
    }
}
```



## 3.2 컬렉션 조회 최적화

* 일대다 관계인 컬렉션은 IN 절을 활용해서 메모리에 미리 조회해서 최적화하는 방식
* SQL 실행 횟수
  * Query: 루트 1번
  * 컬렉션 1번
  * ToOne 관계들을 먼저 조회하고, 여기서 얻은 식별자 `orderId`로 ToMany 관계인 `OrderItem` 을 한꺼번에 조회

```java
@RestController
@RequiredArgsConstructor
public class OrderApiController {

    private final OrderRepository orderRepository;

    @GetMapping("/api/v5/orders")
    public List<OrderQueryDto> ordersV5() {
        return orderQueryRepository.findAllByDto_optimization();
    }
}
```

```java
@Repository
@RequiredArgsConstructor
public class OrderQueryRepository {
    private final EntityManager em;

    public List<OrderQueryDto> findAllByDto_optimization() {
        //루트 조회(toOne 코드를 모두 한번에 조회)
        List<OrderQueryDto> result = findOrders();

        //orderItem 컬렉션을 MAP 한방에 조회
        Map<Long, List<OrderItemQueryDto>> orderItemMap = findOrderItemMap(toOrderIds(result));

        //루프를 돌면서 컬렉션 추가(추가 쿼리 실행X)
        result.forEach(o -> o.setOrderItems(orderItemMap.get(o.getOrderId())));
        return result;
    }

    private List<OrderQueryDto> findOrders() {
        return em.createQuery(
                "select new jpabook.jpashop.repository.order.query.OrderQueryDto(o.id, m.name, o.orderDate, o.status, d.address)" +
                " from Order o" +
                " join o.member m" +
                " join o.delivery d", OrderQueryDto.class)
                .getResultList();
    }

    private Map<Long, List<OrderItemQueryDto>> findOrderItemMap(List<Long> orderIds) {
        List<OrderItemQueryDto> orderItems = em.createQuery(
                "select new jpabook.jpashop.repository.order.query.OrderItemQueryDto(oi.order.id, i.name, oi.orderPrice, oi.count)" +
                " from OrderItem oi" +
                " join oi.item i" +
                " where oi.order.id in :orders", OrderItemQueryDto.class)
                .setParameter("orderIds", orderIds)
                .getResultList();

        return orderItems.stream()
                .collect(Collectors.groupingBy(OrderItemQueryDto::getOrderId));
    }

    private List<Long> toOrderIds(List<OrderQueryDto> result) {
        return result.stream()
                .map(o -> o.getOrderId()).collect(Collectors.toList());
    }

}
```



## 3.3 플랫 데이터 최적화

* JOIN 결과를 그대로 조회 후 애플리케이션에서 원하는 모양으로 직접 변환
* 장점
  * SQL 실행 횟수 1
* 단점
  * 애플리케이션에서 중복 데이터를 처리하기 위한 작업이 크다
  * 페이징 불가능



**쿼리 한번으로 모든 데이터를 가져온다**

* Order와 OrderItem은 일대다 관계이기 때문에 Order관점에서 로우수가 증가한다.
* 따라서 Order 기준 페이징이 불가능하다

```java
public List<OrderFlatDto> findAllByDto_flat() {
  return em.createQuery(
    "select new jpabook.jpashop.repository.order.query.OrderFlatDto(o.id, m.name, o.orderDate, o.status, d.address, i.name, oi.orderPrice, oi.count)" +
    " from Order o" +
    " join o.member m" +
    " join o.delivery d" +
    " join o.orderItems oi" +
    " join oi.item i", OrderFlatDto.class)
    .getResultList();
}
```

```java
@Data
public class OrderFlatDto {
  private Long orderId;
  private String name;
  private LocalDateTime orderDate;
  private Address address;
  private OrderStatus orderStatus;
  private String itemName;
  private int orderPrice;
  private int count;

  public OrderFlatDto(Long orderId, String name, LocalDateTime orderDate,
                      OrderStatus orderStatus, Address address, String itemName, int orderPrice, int count) {
    this.orderId = orderId;
    this.name = name;
    this.orderDate = orderDate;
    this.orderStatus = orderStatus;
    this.address = address;
    this.itemName = itemName;
    this.orderPrice = orderPrice;
    this.count = count;
  }
}
```

**중복된 데이터를 처리하는 애플리케이션 추가 작업**

* Order를 기준으로 중복된 데이터를 합치는 과정이다

```java
@GetMapping("/api/v6/orders")
public List<OrderQueryDto> ordersV6() {
  List<OrderFlatDto> flats = orderQueryRepository.findAllByDto_flat();
  return flats.stream()
    .collect(groupingBy(o -> new OrderQueryDto(o.getOrderId(), o.getName(), o.getOrderDate(), o.getOrderStatus(), o.getAddress()),
                        mapping(o -> new OrderItemQueryDto(o.getOrderId(), o.getItemName(), o.getOrderPrice(), o.getCount()), toList())
                       )).entrySet().stream()
    .map(e -> new OrderQueryDto(e.getKey().getOrderId(),
                                e.getKey().getName(), e.getKey().getOrderDate(), e.getKey().getOrderStatus(),
                                e.getKey().getAddress(), e.getValue()))
    .collect(toList());
}
```



## 3.4 DTO 조회 방식 선택지

* 3.1, 3.2, 3.3 방식중 3.3방식이 쿼리가 1번 실행된다고 항상 좋은 방법은 아니다
* 3.1은 코드가 단순하며 특정 주문 한건만 조회하면 이 방식으로도 성능이 잘 나온다
* 3.2는 코드가 복잡해졌으며 여러 주문을 한꺼번에 조회하는 경우 3.1 대신 3.2 방식을 써야한다
  * 3.1은 N+1 문제 발생
* 3.3은 쿼리 한번으로 최적화 되어 좋아보이지만 Order를 기준으로 페이징이 불가능하다



# 4 권장 순서

1. 엔티티 조회 방식으로 우선접근
   1. 페치조인으로 쿼리 수를 최적화
   2. 컬렉션 최적화
      1. 페이징 필요 hibernate.default_batch_fetch_size , @BatchSize 로 최적화
      2. 페이징 필요X 페치 조인 사용
2. 엔티티 조회 방식으로 해결이 안되면 DTO 조회 방식 사용
3. DTO 조회 방식으로 해결이 안되면 NativeSQL or 스프링 JdbcTemplate

> 참고: 엔티티 조회 방식은 페치 조인이나, hibernate.default_batch_fetch_size , @BatchSize 같이 코드를 거의 수정하지 않고, 옵션만 약간 변경해서, 다양한 성능 최적화를 시도할 수 있다. 반면에 DTO를 직접 조회하는 방식은 성능을 최적화 하거나 성능 최적화 방식을 변경할 때 많은 코드를 변경해야 한다.
>
> 개발자는 성능 최적화와 코드 복잡도 사이에서 줄타기를 해야 한다. 항상 그런 것은 아니지만, 보통 성능 최적화는 단순한 코드를 복잡한 코드로 몰고간다. 엔티티 조회 방식은 JPA가 많은 부분을 최적화 해주기 때문에, 단순한 코드를 유지하면서, 성능을 최적화 할 수 있다. 반면에 DTO 조회 방식은 SQL을 직접 다루는 것과 유사하기 때문에, 둘 사이에 줄타기를 해야 한다.



참조

* [실전! 스프링 부트와 JPA 활용2 - API 개발과 성능 최적화](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-API%EA%B0%9C%EB%B0%9C-%EC%84%B1%EB%8A%A5%EC%B5%9C%EC%A0%81%ED%99%94/dashboard)