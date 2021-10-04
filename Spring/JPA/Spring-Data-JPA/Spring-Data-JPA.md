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

* 실무에서 거의 사용하는 일이 없다.
* 애플리케이션 실행 시점에 문법 오류를 발견할 수 있음

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

* 애플리케이션 실행 시점에 문법 오류를 발견할 수 있음
* 실무에서는 메소드 이름으로 쿼리 생성 기능은 파라미터가 증가하면 메서드 이름이 매우 지저분해진다. 
  * 따라서 @Query 기능을 자주 사용하게 된다.

**예시**

```java
public interface MemberRepository extends JpaRepository<Member, Long> {
  	// 엔티티 조회
    @Query("select m from Member m where m.username= :username and m.age = :age")
    List<Member> findUser(@Param("username") String username, @Param("age") int
    age);
  
  	// 값 조회
  	@Query("select m.username from Member m")
    List<String> findUsernameList();
  
		// DTO 직접 조회
  	@Query("select new study.datajpa.dto.MemberDto(m.id, m.username, t.name) " +
          "from Member m join m.team t")
  	List<MemberDto> findMemberDto();
  
  	// 파라미터 바인딩
  	@Query("select m from Member m where m.username = :name")
    Member findMembers(@Param("name") String username);
  
  	// 컬렌션 파라미터 바인딩
  	@Query("select m from Member m where m.username in :names")
    List<Member> findByNames(@Param("names") List<String> names);
}
```



# 4 페이징

* `org.springframework.data.domain.Sort` : 정렬 기능
* `org.springframework.data.domain.Pageable` : 페이징 기능
  * 인터페이스
  * 실제 사용시 해당 인터페이스를 구현한 `org.springframework.data.domain.PageRequest` 사용



## 4.1 페이징 사용하기

* PageRequest 생성자의 첫 번째 파라미터에는 현재 페이지를, 두 번째 파라미터에는 조회할 데이터 수를 입력한다. 
* 여기에 추가로 정렬 정보도 파라미터로 사용할 수 있다. 
* 참고로 페이지는 0부터 시작한다.



**인터페이스 정의**

```java
public interface MemberRepository extends Repository<Member, Long> {
	Page<Member> findByAge(int age, Pageable pageable);
}
```

**실제 사용**

```java
@Test
public void page() throws Exception {
    memberRepository.save(new Member("member1", 10));
    memberRepository.save(new Member("member2", 10));
    memberRepository.save(new Member("member3", 10));
    memberRepository.save(new Member("member4", 10));
    memberRepository.save(new Member("member5", 10));
    
    // 페이징 사용
    PageRequest pageRequest = PageRequest.of(0, 3, Sort.by(Sort.Direction.DESC, "username"));
    Page<Member> page = memberRepository.findByAge(10, pageRequest);
    
    //조회된 데이터
    List<Member> content = page.getContent(); 
    //조회된 데이터 수
    assertThat(content.size()).isEqualTo(3);
    //전체 데이터 수
    assertThat(page.getTotalElements()).isEqualTo(5);
    //페이지 번호
    assertThat(page.getNumber()).isEqualTo(0);
    //전체 페이지 번호
    assertThat(page.getTotalPages()).isEqualTo(2);
    //첫번째 항목인가?
    assertThat(page.isFirst()).isTrue();
    //다음 페이지가 있는가?
    assertThat(page.hasNext()).isTrue(); 
}
```

**count 쿼리를 분리하기**

```java
@Query(value = "select m from Member m",
 countQuery = "select count(m.username) from Member m")
Page<Member> findMemberAllCountBy(Pageable pageable);
```

**페이지를 유지하면서 엔티티를 DTO로 변환하기**

```java
Page<Member> page = memberRepository.findByAge(10, pageRequest);
Page<MemberDto> dtoPage = page.map(m -> new MemberDto(m));
```



## 4.2 Web 확장 - 페이징과 정렬

* 스프링 데이터가 제공하는 페이징과 정렬 기능을 스프링 MVC에서 편리하게 사용할 수 있다.
* 파라미터로 Pageable 을 받을 수 있다.
* Pageable 은 인터페이스, 실제는 org.springframework.data.domain.PageRequest 객체 생성된다.
* 요청예시 : `/members?page=0&size=3&sort=id,desc&sort=username,desc`
  * page: 현재 페이지, 0부터 시작한다
  * size: 한 페이지에 노출할 데이터 건수
  * sort: 정렬 조건을 정의한다. 
    * 예) 정렬 속성,정렬 속성...(ASC | DESC)
    * 정렬 방향을 변경하고 싶으면 sort파라미터 추가 ( asc 생략 가능)



```java
@GetMapping("/members")
public Page<Member> list(Pageable pageable) {
    Page<Member> page = memberRepository.findAll(pageable);
    return page;
}
```

**글로벌 설정하기**

```properties
spring.data.web.pageable.default-page-size=20 # 기본 페이지 사이즈/
spring.data.web.pageable.max-page-size=2000 # 최대 페이지 사이즈
```

**개별 설정하기**

```java
@RequestMapping(value = "/members_page", method = RequestMethod.GET)
public String list(@PageableDefault(size = 12, sort = "username",
                                    direction = Sort.Direction.DESC) Pageable pageable) {
  ... 
}
```



# 5 벌크성 수정 쿼리

* 벌크성 수정, 삭제 쿼리는 @Modifying 어노테이션을 사용해야한다.
  * 사용하지 않으면 예외가 발생한다.
* `@Modifying(clearAutomatically = true)` : 벌크성 쿼리 실행 후 영속성 컨텍스트를 자동으로 초기화
  * clearAutomatically 옵션의 기본값은 false이다

```java
@Modifying(clearAutomatically = true)
@Query("update Member m set m.age = m.age + 1 where m.age >= :age")
int bulkAgePlus(@Param("age") int age);
```



**주의 사항**

* 벌크 연산은 영속성 컨텍스트를 무시하고 실행하기 때문에, 영속성 컨텍스트에 있는 엔티티의 상태와 DB에 엔티티 상태가 달라질 수 있다
* 해결법
  1. 영속성 컨텍스트에 엔티티가 없는 상태에서 벌크 연산을 먼저 실행한다
  2. 부득이하게 영속성 컨텍스트에 엔티티가 있으면 벌크 연산 직후 영속성 컨텍스트를 초기화 한다

# 6 @EntityGraph

* 간단한 jpql이라면 직접 작성하지 않고 @EntityGraph를 사용하면 편리하다
* 연관된 엔티티를 SQL 한번에 조회하는 방법
* @EntityGraph를 사용하면 jpql을 직접 작성하지 않고 연관된 엔티티를 한번에 가져올 수 있다.
  * 페치 조인(FETCH JOIN)의 간편 버전이다



**JPQL 페치 조인**

* 멤버와 연관된 엔티티 팀을 SQL에 한번에 조회함
* @EntityGraph를 사용하면 jpql을 직접 작성하지 않고 연관된 엔티티를 한번에 가져올 수 있다.

```java
 @Query("select m from Member m left join fetch m.team")
 List<Member> findMemberFetchJoin();
```



**@EntityGraph 사용하기**

```java
// 연관된 team 같이 조회하기
@Override
@EntityGraph(attributePaths = {"team"})
List<Member> findAll();

//JPQL + 엔티티 그래프
@EntityGraph(attributePaths = {"team"})
@Query("select m from Member m")
List<Member> findMemberEntityGraph();

//메서드 이름으로 쿼리에서 특히 편리하다.
@EntityGraph(attributePaths = {"team"})
List<Member> findByUsername(String username)
```



# 7 JPA Hint & Lock

* SQL 힌트가 아니라 JPA 구현체에게 제공하는 힌트



**쿼리 힌트 사용하기**

* org.hibernate.readOnly = true
* 성능 최적화를 위해 읽기 전용으로 만든다
  * 읽기 전용이기 때문에 영속성 컨텍스트에 스냅샷을 만들지 않는다.(읽기 전용이라 변경이 없기 때문이다.)
  * 스냅샷을 위한 메모리를 절약할 수 있고 변경 감지를 할 필요도 없어져 성능상 이점이 있다.

```java
@QueryHints(value = @QueryHint(name = "org.hibernate.readOnly", value = "true"))
Member findReadOnlyByUsername(String username);
```

```java
@Test
public void queryHint() throws Exception {
			//given
      memberRepository.save(new Member("member1", 10));
      em.flush();
      em.clear();

  		//when
      Member member = memberRepository.findReadOnlyByUsername("member1");
      member.setUsername("member2");
  		em.flush(); //Update Query 실행X 
}
```



**Lock**

```java
@Lock(LockModeType.PESSIMISTIC_WRITE)
List<Member> findByUsername(String name);
```



# 8 사용자 정의 리포지토리 구현

* 스프링 데이터 JPA 리포지토리는 인터페이스만 정의하고 구현체는 스프링이 자동 생성
* 스프링 데이터 JPA가 제공하는 인터페이스를 직접 구현하면 구현해야 하는 기능이 너무 많음
* 인터페이스의 메서드를 직접 구현하고 싶다면 사용자 정의 리포지토리를 구현한다
* 실무에서는 주로 QueryDSL이나 SpringJdbcTemplate을 함께 사용할 때 사용자 정의 리포지토리 기능 자주 사용



**사용자 정의 인터페이스**

* 직접 구현할 메소드 정의

```java
public interface MemberRepositoryCustom {
      List<Member> findMemberCustom();
}
```



**사용자 정의 인터페이스 구현 클래스**

* 구현 클래스의 이름 = `리포지토리 인터페이스 이름` + `Impl` 또는 `사용자 정의 인터페이스 이름 + Impl`
  * `MemberRepositoryImpl` 또는 `MemberRepositoryCustomImpl`
* 사용자 정의 인터페이스를 구현한다.

```java
@RequiredArgsConstructor
public class MemberRepositoryImpl implements MemberRepositoryCustom {
      private final EntityManager em;
      
    	@Override
      public List<Member> findMemberCustom() {
          return em.createQuery("select m from Member m")
                  .getResultList();
			} 
}
```



**사용자 정의 인터페이스 상속**

```java
public interface MemberRepository extends JpaRepository<Member, Long>, MemberRepositoryCustom {
}
```



**실제 사용**

```java
List<Member> result = memberRepository.findMemberCustom();
```

> 항상 사용자 정의 리포지토리가 필요한 것은 아니다. 그냥 임의의 리포지토리를 만들어도 된다. 예를들어 MemberQueryRepository를 인터페이스가 아닌 클래스로 만들고 스프링 빈으로 등록해서 그냥 직접 사용해도 된다. 물론 이 경우 스프링 데이터 JPA와는 아무런 관계 없이 별도로 동작한다.



# 9 네이티브 쿼리

* 가급적 네이티브 쿼리는 사용하지 않는게 좋음, 정말 어쩔 수 없을 때 사용하자
* 페이징 지원
* 반환 타입
  * Object[]
  * Tuple
  * DTO(스프링 데이터 인터페이스 Projections 지원)
* 제약
  * Sort 파라미터를 통한 정렬이 정상 동작하지 않을 수 있음(믿지 말고 직접 처리) 
  * JPQL처럼 애플리케이션 로딩 시점에 문법 확인 불가
  * 동적 쿼리 불가
