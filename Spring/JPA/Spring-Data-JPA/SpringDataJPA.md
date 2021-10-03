[TOC]



# 1 Spring Data JPA

* Spring Data JPA의 목표는 데이터 액세스 계층을 구현하는 데 필요한 틀에박힌 코드 양을 크게 줄이는 것입니다.
* 엔티티에대한 기본적인 CRUD, 페이징 기능을 사용하고 싶으면 직접 리포지토리를 구현하는 것이 아니라 JpaRepository를 상속받는 인터페이스를 만들면 된다.
  * 해당 인터페이스의 구현체는 Spring Data JPA가 생성해서 주입해준다.
  * 따라서 직접 리포지토리를를 구현하지 않고 기본적인 기능들은 인터페이스를 만드는 것만으로도 이용할 수 있다.



# 2 인터페이스 구성

![image-20211001223011706](./images/interface.png)	 						 		



## 2.1 JpaRepository 인터페이스

* 가장 중심이 되는 인터페이스
* type argument로 도메인 클래스와 ID의 타입이 필요하다
  * 예) <Member, Long>
* JpaRepository 인터페이스는 주로 마커 인터페이스 역할을 합니다.

```java
public interface MemberRepository extends JpaRepository<Member, Long> {
}
```

**사용 예시**

* MemberRepository는 인터페이스이다. `memberRepository.save()`라는 메소드를 구현한적이 없지만 사용이 가능하다
* 이는 Spring Data JPA가 MemberRepository를 구현한 구현체를 주입받기 때문이다.
* 이처럼 기본적인 CRUD는 직접 구현하지 않아도 된다.

```java
@SpringBootTest
@Transactional
public class MemberRepositoryTest {
    @Autowired
    MemberRepository memberRepository;
    
  	@Test
    public void testMember() {
    	Member member = new Member("memberA");
      Member savedMember = memberRepository.save(member);
      Member findMember = memberRepository.findById(savedMember.getId()).get();
      
      Assertions.assertThat(findMember.getId()).isEqualTo(member.getId());
			Assertions.assertThat(findMember.getUsername()).isEqualTo(member.getUsername());
			Assertions.assertThat(findMember).isEqualTo(member);
		}
}
```



## 2.2 CrudRepository 인터페이스

* CrudRepository 인터페이스는 관리 중인 엔터티 클래스에 대해 CRUD 기능을 제공합니다.

```java
public interface CrudRepository<T, ID> extends Repository<T, ID> {

  // 주어진 엔티티 저장하기
  <S extends T> S save(S entity);      

  // 주어진 ID로 엔티티를 찾아 반환
  Optional<T> findById(ID primaryKey); 

  // 모든 엔티티를 반환
  Iterable<T> findAll();               

  // 엔티티의 수를 반환
  long count();                        

  // 주어진 엔티티를 삭제
  void delete(T entity);               

  // 주어진 ID를 가지는 엔티티의 존재 유무 반환
  boolean existsById(ID primaryKey);   

  // … more functionality omitted.
}
```



## 2.3 PagingAndSortingRepository 인터페이스

* PagingAndSortingRepository를 통해 페이징 기능을 사용할 수 있다

```java
public interface PagingAndSortingRepository<T, ID> extends CrudRepository<T, ID> {

  Iterable<T> findAll(Sort sort);

  Page<T> findAll(Pageable pageable);
}
```



**사용 예시**

```java
PagingAndSortingRepository<User, Long> repository = // … get access to a bean
Page<User> users = repository.findAll(PageRequest.of(1, 20));
```



# 3 Query Methods

* 메소드 이름으로 쿼리를 생성해주는 기능을 제공한다.
* 자동 생성된 쿼리가 상황에 맞지 않다면 JPA Named Query나 @Query를 이용해 직접 쿼리를 생성할 수 있다.



**쿼리 메소드의 3가지 기능**

1. 메소드 이름으로 쿼리 생성
2. 메소드 이름으로 JPA Named Query 호출
3. @Query 어노테이션을 사용해서 리포지토리 인터페이스에 쿼리 직접 정의



## 3.1 메소드 이름으로 쿼리 생성

```java
public interface UserRepository extends Repository<User, Long> {
  List<User> findByEmailAddressAndLastname(String emailAddress, String lastname);
}
```

* 메소드 이름으로 `select u from User u where u.emailAddress = ?1 and u.lastname = ?2`라고 query를 생성해준다.
* 엔티티의 필드명이 변경되면 인터페이스에 정의한 메서드 이름도 꼭 함께 변경해야 한다. 
  * 그렇지 않으면 애플리케이션을 시작하는 시점에 오류가 발생한다.



**[메소드 이름으로 지원되는 키워드](https://docs.spring.io/spring-data/jpa/docs/2.5.5/reference/html/#jpa.query-methods.query-creation)**

| Keyword                | Sample                                                       | JPQL snippet                                                 |
| :--------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `Distinct`             | `findDistinctByLastnameAndFirstname`                         | `select distinct … where x.lastname = ?1 and x.firstname = ?2` |
| `And`                  | `findByLastnameAndFirstname`                                 | `… where x.lastname = ?1 and x.firstname = ?2`               |
| `Or`                   | `findByLastnameOrFirstname`                                  | `… where x.lastname = ?1 or x.firstname = ?2`                |
| `Is`, `Equals`         | `findByFirstname`,`findByFirstnameIs`,`findByFirstnameEquals` | `… where x.firstname = ?1`                                   |
| `Between`              | `findByStartDateBetween`                                     | `… where x.startDate between ?1 and ?2`                      |
| `LessThan`             | `findByAgeLessThan`                                          | `… where x.age < ?1`                                         |
| `LessThanEqual`        | `findByAgeLessThanEqual`                                     | `… where x.age <= ?1`                                        |
| `GreaterThan`          | `findByAgeGreaterThan`                                       | `… where x.age > ?1`                                         |
| `GreaterThanEqual`     | `findByAgeGreaterThanEqual`                                  | `… where x.age >= ?1`                                        |
| `After`                | `findByStartDateAfter`                                       | `… where x.startDate > ?1`                                   |
| `Before`               | `findByStartDateBefore`                                      | `… where x.startDate < ?1`                                   |
| `IsNull`, `Null`       | `findByAge(Is)Null`                                          | `… where x.age is null`                                      |
| `IsNotNull`, `NotNull` | `findByAge(Is)NotNull`                                       | `… where x.age not null`                                     |
| `Like`                 | `findByFirstnameLike`                                        | `… where x.firstname like ?1`                                |
| `NotLike`              | `findByFirstnameNotLike`                                     | `… where x.firstname not like ?1`                            |
| `StartingWith`         | `findByFirstnameStartingWith`                                | `… where x.firstname like ?1` (parameter bound with appended `%`) |
| `EndingWith`           | `findByFirstnameEndingWith`                                  | `… where x.firstname like ?1` (parameter bound with prepended `%`) |
| `Containing`           | `findByFirstnameContaining`                                  | `… where x.firstname like ?1` (parameter bound wrapped in `%`) |
| `OrderBy`              | `findByAgeOrderByLastnameDesc`                               | `… where x.age = ?1 order by x.lastname desc`                |
| `Not`                  | `findByLastnameNot`                                          | `… where x.lastname <> ?1`                                   |
| `In`                   | `findByAgeIn(Collection<Age> ages)`                          | `… where x.age in ?1`                                        |
| `NotIn`                | `findByAgeNotIn(Collection<Age> ages)`                       | `… where x.age not in ?1`                                    |
| `True`                 | `findByActiveTrue()`                                         | `… where x.active = true`                                    |
| `False`                | `findByActiveFalse()`                                        | `… where x.active = false`                                   |
| `IgnoreCase`           | `findByFirstnameIgnoreCase`                                  | `… where UPPER(x.firstname) = UPPER(?1)`                     |



## 3.2 메소드 이름으로 JPA Named Query 호출

**Annotation 베이스로 Named Query 설정하기**

```java
@Entity
@NamedQuery(name = "User.findByEmailAddress",
  query = "select u from User u where u.emailAddress = ?1")
public class User {

}
```

**Interface 선언하기**

* 메소드 이름으로 쿼리를 생성하는 것이 아니라 위에서 설정된 Named Query가 실행된다.

```java
public interface UserRepository extends JpaRepository<User, Long> {
  User findByEmailAddress(String emailAddress);
}
```



## 3.3 @Query를 사용해 직접 쿼리 생성

```java
public interface UserRepository extends JpaRepository<User, Long> {
  @Query("select u from User u where u.emailAddress = ?1")
  User findByEmailAddress(String emailAddress);
}
```

