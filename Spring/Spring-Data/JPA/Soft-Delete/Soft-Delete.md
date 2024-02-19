# 1 Soft Delete

* Soft Delete는 테이블의 레코드를 실제로 삭제하는 것이 아니라 레코드를 숨겨 접근하지 못하게 하는 것이다
* Soft Delete 구현 방식에는 3 가지가 있다
  * 레코드가 숨겨진 상태인지 공개 상태인지 나타내는 boolean을 사용하기
  * 레코드의 상태를 나타내는 Enum 사용하기
  * Soft Delete가 수행된 timestamp를 사용하기
* 가장 많이 사용되는 구현방식은 boolean 방식을 JPA를 사용해서 Soft Delete 기능을 적용해보자



## 1.1 Soft Delete를 사용하는 이유



# 2 Soft Delete 동작

* Soft Delete는 실제 레코드를 테이블에서 삭제하는 것이 아니라 레코드를 수정한다
  * 필드에 숨김 여부를 나타내는 필드를 두고 해당 필드를 수정하는 것
* 즉 DELEST가 아니라 UPDATE SQL을 실행해 해당 레코드를 숨김 상태로 만들어야 한다
  * `delete from table_product where id=1`
  * `update from table_product set deleted=1 where id=1`
  * UPDATE SQL을 실행해 숨김 여부를 나타내는 deleted 필드의 값을 변경하여 해당 레코드는 Soft Delete 됨을 나타냄
* 조회
  * `select * from table_product where deleted=0`
  * 이 테이블을 조회할 때 `deleted`가 `1`인 레코드는 조회하지 않도록 위와 같이 조회해야한다



# 3 Spring JPA를 이용해 Soft Delete 구현하기



## 3.1 Entity

* 아래는 예시로 사용할 엔티티 클래스이다
* 레코드 숨김 여부를 나타내는 `deleted` 필드가 있으며 기본 값을 `false`로 설정했다

```java
@Entity
@Table(name = "table_product")
public class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  private double price;

  private boolean deleted = Boolean.FALSE;
}
```



## 3.2 Delete SQL 수정

* 앞에 설명한대로 Soft Delete는 `DELETE` 대신 `UPDATE` SQL을 사용한다
* 이 때 `@SQLDelete` 애노테이션을 사용하면 Hibernate가 엔티티를 삭제할 때 사용하는 native SQL을 오버라이딩할 수 있다
* `@SQLDelete(sql = "UPDATE table_product SET deleted = true WHERE id=?")`
* 위와 같이 설정하면 앞으로 delete command 실행시 위와 같은 SQL이 실행될 것이다

```java
@Entity
@Table(name = "table_product")
@SQLDelete(sql = "UPDATE table_product SET deleted = true WHERE id=?")
@Where(clause = "deleted=false")
public class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  private double price;

  private boolean deleted = Boolean.FALSE;

  // setter getter method
}
```



## 3.4 Soft Delete된 엔티티 조회에서 제외하기

* 조회시 Soft Delete된 레코드는 제외해야 하는데 모든 쿼리에 Soft Delete된 레코드를 제외하는 조건을 넣는 것은 실수하기 쉽다
* 이 때 유용한 것이 Hibernate의 @Where 애노테이션이다
* `@Where(clause = "deleted=false")`
  * 위와 같이 사용하는데 모든 쿼리에 clause에 명시된 조건이 추가된다
  * 따라서 Product를 조회하면  `deleted`가 `true`인 `Product`는 조회되지 않는다

```java
@Entity
@Table(name = "table_product")
@SQLDelete(sql = "UPDATE table_product SET deleted = true WHERE id=?")
@Where(clause = "deleted=false")
public class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  private double price;

  private boolean deleted = Boolean.FALSE;

  // setter getter method
}
```



## 3.5 Repository

* Repository는 Soft Delete를 적용하기 위해 수정할 부분이 없다

```java
public interface ProductRepository extends CrudRepository<Product, Long>{
}
```



## 3.4 사용하기

* 아래와 같이 Repository의 deleteById를 호출하면 `@SQLDelete`로 오버라이딩된 UPDATE SQL이 실행될 것이다

```java
productRepository.deleteById(id);
```



## 3.5 숨긴 레코드 조회하기

* `@Where(clause = "deleted=false")`를 사용하면 숨긴 레코드를 조회하고 싶어도 조회할 수 없다
* 관리자 관점에서 숨긴 레코드를 조회하고 싶다면 `@Where` 애노테이션을 사용하면 안된다
* 이 때 `@FilterDef`,  `@Filter`를 사용하면 동적으로 조건을 적용할 수 있다
* https://thorben-janssen.com/hibernate-filter/ 내용 참고



참고

* https://www.baeldung.com/spring-jpa-soft-delete
* https://www.baeldung.com/hibernate-dynamic-mapping
* https://thorben-janssen.com/implement-soft-delete-hibernate/#Exclude_8220deleted8221_entities_in_queries
* https://thorben-janssen.com/hibernate-filter/