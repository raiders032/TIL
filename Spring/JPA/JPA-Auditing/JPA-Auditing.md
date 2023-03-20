# 1 Auditing

* 엔티티를 생성, 변경할 때 변경한 사람과 시간을 추적하고 싶을 때 JPA의 Auditing 기능을 사용한다.



# 2 순수 JPA 사용 

* 먼저 순수 JPA를 사용해서 엔티티 생성과 변경 시간을 기록해보자.
* JPA 주요 이벤트 어노테이션에는 `@PrePersist`, `@PostPersist`, `@PreUpdate`, `@PostUpdate`이 있다
*  `@PrePersist` : 엔티티를 저장하기 전 호출될 콜백
*  `@PreUpdate` : 엔티티를 업테이트 하기 전 호출될 콜백

```java
@MappedSuperclass
@Getter
public class JpaBaseEntity {
    @Column(updatable = false)
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdDate = now;
        updatedDate = now;
    }

    @PreUpdate
    public void preUpdate() {
        updatedDate = LocalDateTime.now();
    }
}
```

* 시간 추적이 필요한 클래스에서 위에 클래스를 상속 받아서 사용한다.

```java
public class Member extends JpaBaseEntity {
  ...
}
```



# 3 스프링 데이터 JPA의 Auditing 기능 사용

* 스프링 부트 설정 클래스에 `@EnableJpaAuditing` 을 적용한다.
* `@EntityListeners(AuditingEntityListener.class)` 를 엔티티에 적용한다.
* 사용 할 수 있는 어노테이션
  * `@CreatedDate`: 생성일
  * `@LastModifiedDate` : 수정일
  * `@CreatedBy ` : 생성자
  * `@LastModifiedBy ` : 수정자
* `@CreatedBy ` 와 `@LastModifiedBy `를 사용하기 위해선 설정이 필요하다.
  * 등록자, 수정자를 처리해주는 `AuditorAware` 스프링 빈으로 등록해야한다.



**적용 예시** 

* 생성일, 수정일, 생성자, 수정자를 추적할 필요가 있는 엔티티에서 아래의 클래스를 상속받아 사용한다.

```java
@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
public class BaseEntity {
    
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdDate;
    
    @LastModifiedDate
    private LocalDateTime lastModifiedDate;
    
    @CreatedBy
    @Column(updatable = false)
    private String createdBy;
    
    @LastModifiedBy
    private String lastModifiedBy;
}
```



## 3.1 등록자 수정자 처리

**`AuditorAware` 빈 등록 예시**

* 스프링 부트 설정 클래스에 `@EnableJpaAuditing` 을 적용했다.
* 스프링 시큐리티 로그인 정보에서 ID를 받는 예시

```java
@EnableJpaAuditing
@Configuration
public class JpaConfig {

    @Bean
    public AuditorAware<Long> auditorProvider() {
        return new SpringSecurityAuditAwareImpl();
    }

    class SpringSecurityAuditAwareImpl implements AuditorAware<Long> {
        @Override
        public Optional<Long> getCurrentAuditor() {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication instanceof AnonymousAuthenticationToken) {
                return Optional.empty();
            }
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            return Optional.ofNullable(userPrincipal.getId());
        }
    }
}
```

* 실무에서 대부분의 엔티티는 등록시간, 수정시간이 필요하지만, 등록자, 수정자는 없을 수도 있다. 
* 그래서 다음과 같이 Base 타입을 분리하고, 원하는 타입을 선택해서 상속한다.

```java
public class BaseTimeEntity {
  @CreatedDate
  @Column(updatable = false)
  private LocalDateTime createdDate;
  @LastModifiedDate
  private LocalDateTime lastModifiedDate;
}
```

```java
public class BaseEntity extends BaseTimeEntity {
  @CreatedBy
  @Column(updatable = false)
  private String createdBy;
  @LastModifiedBy
  private String lastModifiedBy;
}
```
