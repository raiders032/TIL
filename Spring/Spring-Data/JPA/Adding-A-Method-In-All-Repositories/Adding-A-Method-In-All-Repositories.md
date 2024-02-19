# 1 모든 Repository에 메서드 추가하기

- Spring Data JPA를 사용하면 Repository 인터페이스만 정의하면 구현체가 자동으로 만들어지는 기능을 상당히 잘 사용하고 잇다.
- 그 중에서도 JpaRepository가 제공하는 findById 메서드를 많이 사용하는데 반환 값이 Optional이기 때문에 반복되는 Optional 처리가 상당히 귀찮아지기 시작했다.
- JpaRepository에 Optional을 직접 처리해야되는 findById 메서드 대신 Optional을 처리해주고 엔티티를 바로 반환해주는 메서드가 있으면 좋겠다는 생각을 했다.
	- 모든 엔티티는 Id를 가지고 있기 때문에 Id로 엔티티를 조회하는 기능은 모든 리포지토리에서 공통적으로 사용할 수 있다고 생각했다.

<br>

# 2 문제점

- 간단한 예제 프로그램으로 당시 프로젝트를 진행하면서 겪었던 문제점을 개선해보자.

<br>

## 2.1 상황

**User 엔티티**

- 간단한 사용자 엔티티로 id와 name을 가지고 있다.

```java
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {
    @Id
    @GeneratedValue
    private Long id;

    private String name;
  
    public void changeName(String name) {
      this.name = name;
  	}
}
```



**UserRepository**

- Spring Data JPA 사용하면 JpaRepository를 상속한 인터페이스만 정의하면 UserRepository의 구현체를 만들어 준다.
- JpaRepository가 상속한 CrudRepository 인터페이스에 findById 메서드가 정의되어 있다.
- 해당 메서드는 Optional을 반환하므로 UserRepository의 클라이언트는 필히 Optional을 처리해야 한다.

```java
public interface UserRepository extends JpaRepository<User, Long> {
}
```



**UserService**

- UserRepository를 사용하는 서비스 컴포넌트다.
- 엔티티를 아이디로 조회하는 일은 여러 서비스 코드에서 많이 사용되고 있는 메서드인데 그런 모든 곳에서 아래와 같이 예외 처리 코드가 **중복적**으로 들어가고 있다.

```java
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Transactional
    public void updateUserName(Long userId, String name) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND));
        user.changeName(name);
    }
  
}
```



## 2.2 문제점

- UserRepository가 많은 서비스 컴포넌트에서 사용 중인데 예외 코드를 변경해달라는 요구 사항이 들어왔다.
- 더 자세한 에러 코드를 내려주기 위해 `NOT_FOUND`에서 `NOT_FOUND_USER`로 변경하기로 했다.



**변경 전**

```java
User user = userRepository.findById(userId)
        .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND));
```



**변경 후**

- UserRepository를 사용하는 모든 서비스의 코드에서 아래와 같이 에러코드를 수정해야 한다.
- 중복 코드가 가지는 가장 큰 문제는 코드를 수정하는 데 필요한 노력을 몇 배로 증가시킨다.

```java
User user = userRepository.findById(userId)
        .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_USER));
```



**문제점**

- 변경 사항이 발생했을 때 하나의 클래스만 수정한다면 응집성이 높은 것이고 그렇지 않다면 응집성이 낮다는 것을 의미한다.
- 현 상태에서 응집성을 높이려면 에러 처리를 클라이언트가 처리하는 것이 아닌 UserRepository가 예외를 처리하도록 하는 것이 좋다고 생각했다.
- UserRepository가 직접 처리해야 하는 부분을 클라이언트에 노출하므로써 결합도가 올라갔기 때문에 예외 코드를 변경할 때 연관된 UserService도 수정이 필요해 졌다.



# 3 해결 방안



## 3.1 프록시

처음에 생각한 해결 방안은 프록시를 사용하는 것이었습니다. 프록시는 JpaRepository 인스턴스를 감싸고, 사용자는 JpaRepository 인스턴스를 직접 사용하는 것이 아니라 프록시를 통해 간접적으로 JpaRepository 인스턴스를 사용하도록 합니다. 그런 다음 프록시는 사용자를 대신하여 Optional에 대한 처리를 수행한 후 엔티티를 반환하거나 예외를 던지도록 합니다.

하지만 이 방식은 적용할 수 없었는데 그 이유는 프록시는 감싸는 인스턴스와 동일한 인터페이스를 가져와야 하기 때문입니다. JpaRepository를 사용하는 클라이언트의 관점에서는 객체가 프록시인지 실제 JpaRepository 인스턴스인지 알 수 없도록 동작해야 합니다. 따라서 프록시는 실제 객체와 동일한 인터페이스를 가져야 합니다.

JpaRepository의 findById 메서드는 `Optional<T>`를 반환하므로 프록시가 해당 메서드를 감싸 예외 처리를 한다고 해도 결과적으로 반환값은 여전히 `Optional<T>`로 유지됩니다. 즉, 클라이언트는 여전히 Optional을 처리해야 합니다.

이러한 이유로 인해 프록시를 사용하여 Optional을 처리하는 방식은 제한적이며, 클라이언트에서 여전히 Optional을 다루어야 한다는 점을 고려해야 합니다.



## 3.2 커스텀 메서드 작성

```java
public interface UserRepository extends JpaRepository<User, Long> {
    User findByIdOrElseThrow(Long id);
}
```

- 위와 같이 엔티티가 존재하면 Optional로 감싸지 않은 객체를 반환하고 엔티티가 존재하지 않으면 예외를 던지는 메서드를 정의한다.
- 구현은 생략한다.



```java
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Transactional
    public void updateUserName(Long userId, String name) {
        User user = userRepository.findByOrElseThrow();
        user.changeName(name);
    }

}
```

- 서비스 코드에서 예외를 직접 처리하는 코드가 사라져서 한 단계 더 나아졌다.
	- 이제 서비스 코드를 변경하지 않고 UserRepository의 구현체를 수정해서 에러코드를 변경할 수 있게 되었다.
- 하지만 여러 리포지토리(User, Shop 등) 인터페이스에 findByIdOrElseThrow를 정의하고 구현작업을 해야 한다.
- ID는 모든 엔티티가 반드시 가져야하기 때문에 findById에 대해서는 공통화 작업이 가능하다.
- 이런 중복되는 작업을 JpaRepository에 공통 메서드를 추가해서 해결할 수 있을까?

<br>

## 3.3 상속

- 해결방안을 찾아보던 중 좋은 글을 발견했다.
- https://www.baeldung.com/spring-data-jpa-method-in-all-repositories
- 자세한 방법은 아래와 같다.



**ExtendedRepository 인터페이스**

```java
@NoRepositoryBean
public interface ExtendedRepository<T, ID extends Serializable> extends JpaRepository<T, ID> {
    T findByIdOrElseThrow(ID id);
}
```

- ExtendedRepository 인터페이스는 JpaRepository 인터페이스를 상속한다.
	- 따라서 ExtendedRepository의 구현체는 JpaRepository가 가지고 있는 모든 추상 메서드를 구현해야 한다.
- 추가적으로 ExtendedRepository에 예외 처리를 해주는 findByIdOrElseThrow 메서드를 정의했다.
- 이제 클라이언트는 JpaRepository 대신에 ExtendedRepository를 사용한다. 
	- ExtendedRepository는 JpaRepository의 모든 퍼블릭 인터페이스를 물려받기 때문에 클라이언트는 JpaRepository의 모든 기능을 사용할 수 있다.
	- 추가적으로  findByIdOrElseThrow메서드를 사용하면 예외 처리가 적용되어 Optional로 감싸지 않은 객체를 바로 얻을 수 있다.

<br>

**ExtendedRepositoryImpl 클래스**

```java
public class ExtendedRepositoryImpl<T, ID extends Serializable> extends SimpleJpaRepository<T, ID> implements ExtendedRepository<T, ID> {
    private final EntityManager entityManager;
    private static final String ID_MUST_NOT_BE_NULL = "The given id must not be null!";

    public ExtendedRepositoryImpl(JpaEntityInformation<T, ?> entityInformation, EntityManager entityManager) {
        super(entityInformation, entityManager);
        this.entityManager = entityManager;
    }

    @Override
    public T findByIdOrElseThrow(ID id) {
        Assert.notNull(id, ID_MUST_NOT_BE_NULL);
        Class<T> domainType = getDomainClass();
        T result = entityManager.find(domainType, id);

        if (result == null) {
            throw new BusinessException(ErrorCode.valueOf("NOT_FOUND_" + getClassName()), List.of(id));
        }
        return result;
    }

    private String getClassName() {
        Class<T> domainType = getDomainClass();
        return StringUtils.capitalize(domainType.getSimpleName())
                .replaceAll("(.)(\\p{javaUpperCase})", "$1_$2")
                .toUpperCase();
    }

}
```

- ExtendedRepositoryImpl 클래스는 ExtendedRepository 인터페이스의 구현체이다.
- 앞서 ExtendedRepository는 JpaRepository를 상속받았기 때문에 JpaRepository의 모든 추상 메서드를 구현해야 한다.
	- ExtendedRepositoryImpl은 JpaRepository의 구현체인 SimpleJpaRepository를 상속받으므로써 JpaRepository가 가지고 있는 모든 추상 메서드를 직접 구현하지 않아도 된다.
	- 이미 SimpleJpaRepository가 구현했기 때문
- 추가적으로 정의한 메서드 findByIdOrElseThrow만 직접 구현한다.

<br>

**UserRepository 인터페이스**

```java
public interface UserRepository extends ExtendedRepository<User, UUID> {
}
```

- JpaRepository 대신 ExtendedRepository를 상속 받는다.
- UserRepository를 사용해 JpaRepository의 모든 기능을 이용할 수 있으며 추가적으로 findByIdOrElseThrow 메서드를 사용할 수 있다.

<br>

**상속을 사용하는 것이 안전한가?**

- Effective Java에서는 상속보다는 컴포지션을 사용하라고 조언한다.
- 상속을 사용하면 보통 자식 클래스가 부모 클래스의 구현과 강하게 결합되기 때문이다.



## 3.4 합성

- 작성 중!



# 4 결과

```java
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Transactional
    public void updateUserName(Long userId, String name) {
        User user = userRepository.findByOrElseThrow();
        user.changeName(name);
    }

}
```

- 서비스 코드에서 예외 처리 로직이 사라졌다.
- 예외 처리와 관련된 변경이 일어날 때 더이상 서비스 레이어에 전파되지 않는다.



참고

- https://www.baeldung.com/spring-data-jpa-method-in-all-repositories



블로그

- https://velog.io/@raiders032/%EB%AA%A8%EB%93%A0-Repository%EC%97%90-%EB%A9%94%EC%84%9C%EB%93%9C-%EC%B6%94%EA%B0%80%ED%95%98%EA%B8%B0