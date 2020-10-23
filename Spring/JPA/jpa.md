### 엔티티를 직접 노출

* 양방향 관계에서 문제가 발생한다. 
  * 따라서 반대편에 `@JsonIgnore` 를 사용해 무한 루프를 방지한다.
* 연관된 엔티티가 지연로딩일 경우 실제 엔티티 대신 프록시가 존재한다.
  * jackson 라이브러리는 기본적으로 이 프록시 객체를 json으로 어떻게 생성해야 하는지 몰라 예외가 발생한다.
  * `Hibernate5Module` 을 빈으로 등록하면 기본적으로 초기화 된 프록시 객체만 노출, 초기화 되지 않은 프록시 객체는 노출 하지 않는다.
* 엔티티를 직접 노출하는 것은 좋지 않다.
  * DTO로 변환해서 반환하는 것이 더 좋은 방법이다.

> 항상 지연 로딩을 기본으로 하고, 성능 최적화가 필요한 경우에는 페치 조인(fetch join)을 사용하자!



### 엔티티를 DTO로 변환 및 페치 조인

```java
@GetMapping("/api/v3/simple-orders") 
public List<SimpleOrderDto> ordersV3() {
	List<Order> orders = orderRepository.findAllWithMemberDelivery(); 
  List<SimpleOrderDto> result = orders.stream()
		.map(o -> new SimpleOrderDto(o))
		.collect(toList()); 
  return result;
}

public List<Order> findAllWithMemberDelivery() {
	return em.createQuery(
		"select o from Order o" +
		" join fetch o.member m" +
		" join fetch o.delivery d", Order.class).getResultList();
}
```

* 엔티티를 페치 조인(fetch join)을 사용해서 쿼리 1번에 조회
* 페치 조인으로 order -> member , order -> delivery 는 이미 조회 된 상태 이므로 지연로딩이 일어나지 않는다.
  * 즉 프록시 객체가 아니라 실제 엔티티이다. 
  * 지연로딩 없이 그래프 탐색이 가능해진다. 
* 참고, DTO는 엔티티를 참조해도 괜찮다. 



### JPA에서 DTO로 바로 조회

* 일반적인 SQL을 사용할 때 처럼 원하는 값을 선택해서 조회
* new 명령어를 사용해서 JPQL의 결과를 DTO로 즉시 변환
* 리포지토리 재사용성 떨어짐, API 스펙에 맞춘 코드가 리포지토리에 들어가는 단점

> 엔티티를 DTO로 변환하거나, DTO로 바로 조회하는 두가지 방법은 각각 장단점이 있다. 둘중 상황에 따라 서 더 나은 방법을 선택하면 된다. 엔티티로 조회하면 리포지토리 재사용성도 좋고, 개발도 단순해진다. 따라 서 권장하는 방법은 다음과 같다.

```java
public List<OrderSimpleQueryDto> findOrderDtos() { 
  return em.createQuery(
    "select new jpabook.jpashop.repository.order.simplequery.OrderSimpleQueryDto(o.id, m.name, o.orderDate, o.status, d.address) " +
	" from Order o" +
	" join o.member m" +
	" join o.delivery d", OrderSimpleQueryDto.class).getResultList();
}

@Data
public class OrderSimpleQueryDto {
	private Long orderId;
	private String name;
	private LocalDateTime orderDate; //주문시간 private OrderStatus orderStatus;
	private Address address;
      
  public OrderSimpleQueryDto(Long orderId, String name, LocalDateTime
  orderDate, OrderStatus orderStatus, Address address) {
		this.orderId = orderId; 
    this.name = name; 
    this.orderDate = orderDate; 
    this.orderStatus = orderStatus; 
    this.address = address;
  }
}
```



### 쿼리 방식 선택 권장 순서

1. 엔티티 조회 방식으로 우선 접근
   1. 페치조인으로 쿼리 수를 최적화 
   2. 컬렉션 최적화
      1. 페이징 필요 hibernate.default_batch_fetch_size , @BatchSize 로 최적화
      2. 페이징 필요 X -> 페치 조인 사용
2. 엔티티 조회 방식으로 해결이 안되면 DTO 조회 방식 사용
3. DTO 조회 방식으로 해결이 안되면 JPA가 제공하는 네이티브 SQL이나 스프링 JDBC Template을 사용해서 SQL을 직접 사용한다.



### 컬렉션 조회 최적화

> 컬렉션 페치 조인을 사용하면 페이징이 불가능하다. 하이버네이트는 경고 로그를 남기면서 모든 데이 터를 DB에서 읽어오고, 메모리에서 페이징 해버린다(매우 위험하다).
>
> 컬렉션 페치 조인은 1개만 사용할 수 있다. 컬렉션 둘 이상에 페치 조인을 사용하면 안된다. 데이터가 부정합하게 조회될 수 있다.



### 페이징 한계 돌파

* 컬렉션을 페치 조인하면 페이징이 불가능하다.
  * 컬렉션을 페치 조인하면 일대다 조인이 발생하므로 데이터가 예측할 수 없이 증가한다.
  * 일다대에서 일(1)을 기준으로 페이징을 하는 것이 목적이다. 그런데 데이터는 다(N)를 기준으로 row 가 생성된다.
* 이 경우 하이버네이트는 경고 로그를 남기고 모든 DB 데이터를 읽어서 메모리에서 페이징을 시도한다. 최악의 경우 장애로 이어질 수 있다.



해결방안

1. 먼저 ToOne(OneToOne, ManyToOne) 관계를 모두 페치조인 한다. 
   * ToOne 관계는 row수를 증가시 키지 않으므로 페이징 쿼리에 영향을 주지 않는다.
2. 컬렉션은 지연 로딩으로 조회한다.
3. 지연 로딩 성능 최적화를 위해 `hibernate.default_batch_fetch_size` , `@BatchSize` 를 적용한다.
   * `hibernate.default_batch_fetch_size` : 글로벌 설정
   * `@BatchSize` : 개별 설정
   * 이 옵션을 사용하면 컬렉션이나, 프록시 객체를 한꺼번에 설정한 size 만큼 IN 쿼리로 조회한다.



### query method

* Entity Class의 멤버 변수 이름을 기준으로 한다.

```java
@Entity
public class Menu{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "menu_id")
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="restaurant_id")
    private Restaurant restaurant;

    private String name;

    private int price;
}
```



```java
#정상
Menu findByRestaurantIdAndId(Long restaurantId, Long menuId);
#비정상
Menu findByRestaurantIdAndMenuId(Long restaurantId, Long menuId);
```



___



### JPQL

* 객체지향 쿼리 언어
* **테이블이 아닌 엔티티 객체를 대상으로 검색**
* JPQL은 SQL을 추상화해서 특정데이터베이스 SQL에 의존하지 않는다.



#### 기본 함수

* CONCAT
* SUBSTRING 
* TRIM

* LOWER
* UPPER 
* LENGTH 
* LOCATE
* ABS
* SQRT
* MOD



#### 사용자 정의 함수 호출

* 하이버네이트는 사용전 방언에 추가해야 한다.
* 사용하는 DB 방언을 상속받고, 사용자 정의 함수를 등록한다.

```java
public class MysqlCustomDialect extends MySQL5Dialect {
    public MysqlCustomDialect() {
        super();
        registerFunction("group_concat", new StandardSQLFunction("group_concat",StandardBasicTypes.STRING));
    }
}
```

```properties
spring.jpa.database-platform = com.swm.sprint1.config.MysqlCustomDialect
```



___



### 예외

* `org.hibernate.QueryException: query specified join fetching, but the owner of the fetched association was not present in the select list`
  * fetch join을 사용하는 이유는 엔티티 상태에서 엔티티 그래프를 참조하기 위해서 사용하는 것입니다. 따라서 당연히 엔티티가 아닌 DTO 상태로 조회하는 것은 불가능합니다. 이 경우 fetch join대신 join을 사용한다. 





```
List<RestaurantResponseDto> content = queryFactory
                .select(Projections.constructor(RestaurantResponseDto.class,
                        restaurant.id, restaurant.name, restaurant.thumUrl,
                        restaurant.address, restaurant.roadAddress,
                        restaurant.longitude, restaurant.latitude,
                        restaurant.phoneNumber))
                        //userLiking.id.count().as("like")))
                .from(restaurant)
                .join(restaurant.restaurantCategories, restaurantCategory)
                .join(restaurantCategory.category, category)
                .join(restaurant.userLikings, userLiking)
                .where( nameLike(condition.getName()),
                        latitudeBetween(condition.getLatitude(), condition.getRadius()),
                        longitudeBetween(condition.getLongitude(), condition.getRadius()),
                        category.id.in(JPAExpressions
                                .select(c.id)
                                .from(userCategory)
                                .join(userCategory.category, c)
                                .where(userCategory.user.id.eq(userId))))
                .groupBy(userLiking.restaurant.id)
                //.orderBy(userLiking.id.count().desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
```

