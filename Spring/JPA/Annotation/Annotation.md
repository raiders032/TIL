# 애노테이션

## @Repository

* 스프링 빈으로 등록, JPA 예외를 스프링 기반 예외로 예외 변환



## @PersistenceContext

* 엔티티 메니저( EntityManager ) 주입

**예시**

```java
@Repository
public class MemberRepository {
  @PersistenceContext
  private EntityManager em;

  public void save(Member member) {
    em.persist(member);
  }
}
```



## @PersistenceUnit

* 엔티티 메니터 팩토리( EntityManagerFactory ) 주입



## @Transactional

* `org.springframework.transaction.annotation.Transactional`
* 트랜잭션, 영속성 컨텍스트
  * 데이터의 변경은 트랜잭션 안에서 이뤄져야 한다
* `@Transactional(readOnly = true)`
  * 데이터의 변경이 없는 읽기 전용 메서드에 사용한다
  * 영속성 컨텍스트를 플러시 하지 않으므로 약간의 성능 향상



**예시**

* 모든 메소드에 @Transactional(readOnly = true) 적용
* 데아터 변경이 필요한 메소드 join()에서 @Transactional 적용

```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {
  private final MemberRepository memberRepository;
  
  @Transactional
  public Long join(Member member) {
    memberRepository.save(member);
    return member.getId();
  }

  public List<Member> findMembers() {
    return memberRepository.findAll();
  }

  public Member findOne(Long memberId) {
    return memberRepository.findOne(memberId);
  }
}
```



**테스트 코드 작성**

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

