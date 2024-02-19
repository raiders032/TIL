# JPA 테스트

* 테스트는 케이스 격리된 환경에서 실행하고, 끝나면 데이터를 초기화하는 것이 좋다. 
* 따라서 메모리 DB를 사용하는 것이 가장 이상적이다.



## **테스트를 위한 간단한 스프링 부트 설정**

* `test/resources/application.yml` 아래와 같이 작성한다.

```yml
logging.level:
    org.hibernate.SQL: debug
```

* 스프링 부트는 datasource 설정이 없으면, 기본적을 메모리 DB를 사용한다.
* driver-class도 현재 등록된 라이브러를 보고 찾아준다
* ddl-auto 도 `create-drop` 모드로 동작한다



## @Transactional

* `@Transactional`을 테스트에 사용하면 반복 가능한 테스트 지원한다
  * 각각의 테스트를 실행할 때마다 트랜잭션을 시작하고 **테스트가 끝나면 트랜잭션을 강제로 롤백**
  * 아래의 회원가입() 메소드에서 실제 INSER SQL이 DB에 전달되지 않는다
  * 즉 DB에는 반영되지 않는다

```java
@SpringBootTest
@Transactional
public class MemberServiceTest {
  @Autowired
  MemberService memberService;
  
  @Autowired
  MemberRepository memberRepository;

  @Test
  public void 회원가입() throws Exception {
    //Given
    Member member = new Member();
    member.setName("kim");

    //When
    Long saveId = memberService.join(member);

    //Then
    assertEquals(member, memberRepository.findOne(saveId));
  }
}
```

