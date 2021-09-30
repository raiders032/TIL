## 컬렉션 조회 최적화

*  [지연 로딩과 조회 성능 최적화.md](../지연 로딩과 조회 성능 최적화/지연 로딩과 조회 성능 최적화.md) 에서 ToOne 관계에 대해서 알아봤다면 이번엔 ToMany관계에 대해서 알아보자
* `Order` 와 `Member` 일대일 관계이다.
* `Order` 와 `Delivery` 일대일 관계이다.
* `Order` 와 `OrderItem` 일대다 관계이다.
* `OrderItem` 과 `Item` 은 다대일 관계이다.
* 연관 관계는 모두 `fetch = FetchType.LAZY` 로 설정되어 있다.



## 엔티티 직접 노출 버전

* 엔티티 직접 노출은 피하자!

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



## 엔티티를 DTO로 변환 버전

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



## 엔티티를 DTO로 변환 + 페치 조인 최적화 버전

* `Order` 와 `OrderItem` 일대다 관계이다. 
* `Order` 와 `OrderItem` 을 페치 조인한다
  * `Order` 1개에 `OrderItem` 이 5개 있다고 가정하면 페치 조인시 로우가 5개가 된다.
  * 즉 같은 `Order` 가 5개가 중복되게 된다.
  * 이 증복을 없어기 위해서 `distinct` 를 사용할 수 있다.
  * JPA의 `distinct`는 SQL에 distinct를 추가하고, 더해서 같은 엔티티가 조회되면, 애플리케이션에서 중복을 걸러준다. 
* 결과적으로 SQL 실행 횟수는 1회이다.
* 단점
  * 컬렉션을 페치 조인하게되면 페이징이 불가능하다.
* 페이징이 불가능한 이유    
  * 일다대에서 일(1)을 기준으로 페이징을 하는 것이 목적이다. 
  * 그런데 데이터는 다(N)를 기준으로 row 가 생성된다.
  * `Order`를 기준으로 페이징 하고 싶은데, 다(N)인 `OrderItem`을 조인하면 OrderItem이 기준이 되어 버린다.

> 참고
>
> 컬렉션 페치 조인을 사용하면 페이징이 불가능하다. 하이버네이트는 경고 로그를 남기면서 모든 데이 터를 DB에서 읽어오고, 메모리에서 페이징 해버리는데 이는 매우 위험하다.

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



## 엔티티를 DTO로 변환 + 페치 조인 최적화 + 페이징 버전

* 앞선 버전에서는 컬렉션을 페치 조인하면서 페이징이 불가능했다.
* 페이징 + 컬렉션 엔티티를 함께 조회하는 방법을 알아보자.
* 해결 방법!!!
  * 먼저 ToOne(OneToOne, ManyToOne) 관계를 모두 페치조인 한다
    * ToOne 관계는 row수를 증가시 키지 않으므로 페이징 쿼리에 영향을 주지 않는다.
  * 컬렉션은 지연 로딩으로 조회한다.
  * 지연 로딩 성능 최적화를 위해 `hibernate.default_batch_fetch_size` , `@BatchSize` 를 적용한다.
    * `hibernate.default_batch_fetch_size`: 글로벌 설정
    * `@BatchSize`: 개별 최적화
    * 이 옵션을 사용하면 컬렉션이나, 프록시 객체를 한꺼번에 설정한 size 만큼 IN 쿼리로 조회한다.
* 장점
  * 쿼리호출수가`1+N` 에서 `1+1`로최적화된다.
  * 컬렉션 페치 조인은 페이징이 불가능 하지만 이 방법은 페이징이 가능하다.
  * 조인보다 DB 데이터 전송량이 최적화 된다.
    * `Order`와 `OrderItem`을 조인하면 `Order`가 `OrderItem` 만큼 중복해서 조회된다.

> 참고
>
> `default_batch_fetch_size` 의 크기는 적당한 사이즈를 골라야 하는데, 100~1000 사이를 선택 하는 것을 권장한다. 이 전략을 SQL IN 절을 사용하는데, 데이터베이스에 따라 IN 절 파라미터를 1000으 로 제한하기도 한다. 1000으로 잡으면 한번에 1000개를 DB에서 애플리케이션에 불러오므로 DB에 순간 부하가 증가할 수 있다. 하지만 애플리케이션은 100이든 1000이든 결국 전체 데이터를 로딩해야 하므로 메모리 사용량이 같다. 1000으로 설정하는 것이 성능상 가장 좋지만, 결국 DB든 애플리케이션이든 순간 부 하를 어디까지 견딜 수 있는지로 결정하면 된다.

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
        return em.createQuery(
                "select o from Order o" + 
          			" join fetch o.member m" +
                " join fetch o.delivery d", Order.class)
                .getResultList();
    }
}
```

```properties
# application.properties
spring: jpa:
        properties:
          hibernate:
default_batch_fetch_size: 1000
```



## JPA에서 DTO 직접 조회

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



## JPA에서 DTO 직접 조회 - 컬렉션 조회 최적화

* SQL 실행 횟수
  * Query: 루트 1번
  * 컬렉션 1번
  * ToOne 관계들을 먼저 조회하고, 여기서 얻은 식별자 `orderId`로 ToMany 관계인 `OrderItem` 을 한꺼번 에 조회

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



참조

* https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-API%EA%B0%9C%EB%B0%9C-%EC%84%B1%EB%8A%A5%EC%B5%9C%EC%A0%81%ED%99%94/dashboard