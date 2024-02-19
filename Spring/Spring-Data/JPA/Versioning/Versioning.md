# 1 Versioning

**전제**

- 상품과 옵션 그룹이 일대다 관계
- 옵션 그룹과 옵션이 일대다 관계



**요구사항**

- 상품을 장바구니에 담은 고객에게 상품과 그 하위 항목에 대한 변경을 안내해야한다.

  - 상품의 변경 또는 삭제

  - 옵션 그룹의 변경 또는 삭제

  - 옵션의 변경 또는 삭제

- 예를 들어 만원에 판매되고 있는 상품을 장바구니에 담은 후 판매자가 상품의 가격이 1만 2천원으로 변경하면 고객이 나중에 장바구니를 확인하면 상품 정보가 변경되었다는 안내 문구를 볼 수 있어야 한다.



**해결책 1**

- JPA에서 제공하는 낙관적 락 기능을 사용하면 이를 해결할 수 있지 않을까?
- 상품, 옵션 그룹, 옵션에 버전을 관리하는 필드를 추가하고 @Version 애노테이션을 붙이면 각각의 엔티티의 변경 발생할 때 마다 version이 하나씩 증가하게 된다.
- 장바구니 엔티티는 상품과 장바구니에 담았을 때의 상품 버전을 저장하고 있다.
- 고객이 장바구니를 조회하면 상품에게 최신 버전을 물어보고 자신이 기록한 버전과 다르면 고객에게 안내 문구를 보여주면 된다.
- 하지만 상품의 모든 필드가 안내 대상이 아니다
  - 특정 필드는 변경되어도 고객에게 특별한 안내 문구가 필요하지 않다.
  - 하지만 @Version을 사용하면 상품 엔티티의 모든 필드에 대해서 변경이 일어나면 버전이 증가한다.
  - 특정 필드만 변경되었을 때 version을 증가시키는 기능은 없다.



**해결책 2**

- JPA의 낙관적 락을 이용해 상품의 버전을 관리할 수 없다.
- 직접 엔티티 내에서 버전 필드를 추가하고 버전을 관리해야 한다.



# 2 Menu

```java
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Menu extends PersistableDateTimeEntity {
	private long version = 0;

  private void updateVersion() {
    version++;
  }
  
  public void changeName(String name) {
    this.name = name;
    updateVersion();
  }
  
  public void changePrice(int price) {
  	this.price = price;
    updateVersion();
  }
  
  public void changeRecommended(boolean recommended) {
  	this.recommended = recommended;
  }
  
}
```

- 버전을 나타내는 version 필드와 버전을 증가시키는 updateVersion 메서드를 추가했다.
- 상품의 가격이 변하면 안내 문구가 필요하니 version을 증가시킨다.
- 상품의 추천 여부의 변경은 안내가 필요 없으니 version을 증가시키지 않는다.



참고

- https://vladmihalcea.com/jpa-entity-version-property-hibernate/