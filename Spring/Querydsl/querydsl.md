#### 조인 - on절

ON절을 활용한 조인(JPA 2.1부터 지원) 1. 조인대상필터링
 \2. 연관관계없는엔티티외부조인



#### 프로젝션과 결과 DTO로 반환

1. 프로퍼티 접근

   ```java
   List<MemberDto> result = queryFactory.select(Projections.bean(MemberDto.class,
   member.username,
   member.age)) .from(member)
   .fetch();
   ```

2. 필드 직접 접근

   ```java
   List<MemberDto> result = queryFactory.select(Projections.fields(MemberDto.class,
   member.username,
   member.age)) .from(member)
   .fetch();
   ```

   * 프로퍼티나, 필드 접근 생성 방식에서 이름이 다를 때 해결 방안 
   * ExpressionUtils.as(source,alias) : 필드나, 서브 쿼리에 별칭 적용 
   * username.as("memberName") : 필드에 별칭 적용

   ```java
    List<UserDto> fetch = queryFactory.select(Projections.fields(UserDto.class,
   member.username.as("name"), ExpressionUtils.as(
   ) ).from(member)
   .fetch();
   ```

   

3. 생성자 사용

   ```java
   @Getter
   @Setter
   @NoArgsConstructor
   @AllArgsConstructor
   public class MenuResponseDto {
       private BigInteger id;
       private String name;
       private int price;
   }
   ```

   

   ```java
   		@Override
       public List<MenuResponseDto> findMenuResponseDto(Long restaurantId) {
           return queryFactory
                   .select(Projections.constructor(MenuResponseDto.class, menu.id, menu.name, menu.price ))
                   .from(menu)
                   .where(menu.restaurant.id.eq(restaurantId))
                   .fetch();
       }
   
   ```

   

