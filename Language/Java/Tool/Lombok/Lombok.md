# 1 Lombok





# 2 [@EqualsAndHashCode](https://projectlombok.org/features/EqualsAndHashCode)

* 클래스에 `@EqualsAndHashCode` 애노테이션을 적용하면 롬복이 `equals(Object other)` 와 `hashCode()`를 생성해준다
* 기본적으로 모든 non-static 필드를 이용한다
* 특정 필드를 지정하고 싶다면 @EqualsAndHashCode.Include 또는 @EqualsAndHashCode.Exclude를 필드에 사용한다

```java
@EqualsAndHashCode(of = "id", callSuper=false)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "user_accounts")
@Entity
public class UserAccount extends BaseTimeEntity {
    @Column(name = "user_account_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;
}
```

