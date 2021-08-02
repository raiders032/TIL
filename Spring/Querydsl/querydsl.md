### 사용자 정의 리포지토리

1. 사용자 정의 인터페이스 작성
2. 사용자 정의 인터페이스 구현
3. 스프링 데이터 리포지토리에 사용자 정의 인터페이스 상속

### 페이징 적용하기

컨트롤러

* http://localhost:8080/api/v1/post?size=5&page=0

````java
@ApiOperation(value = "식당 정보 수정 요청 조회", notes = "식당 정보 수정 요청을 조회합니다.")
@GetMapping("/api/v1/post")
public ResponseEntity<?> getPost(Pageable pageable){
  Page<PostResponseDto> posts = postService.getPost(pageable);
	ApiResponse response = new ApiResponse(true, "식당 정보 수정 요청 조회 완료");
	response.putData("posts", posts);
  return ResponseEntity.ok(response);
}
````



리포지토리

```java
@Override
public Page<PostResponseDto> findAllPostResponseDto(Pageable pageable) {
	List<PostResponseDto> content = queryFactory
                .select(Projections.fields(PostResponseDto.class, post.id, 
                                           post.restaurant.id.as("restaurantId"), post.imageUrl, post.claim))
                .from(post)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

  JPAQuery<Post> countQuery = queryFactory
                .select(post)
                .from(post);

  return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchCount);
}
```



### SQL function 호출

* 사용하는 방언에 함수가 등록되어 있는지 확인하기

```java
public class MySQLDialect extends Dialect {
...
	public MySQLDialect() {
		super();
		registerFunction( "ascii", new StandardSQLFunction( "ascii", StandardBasicTypes.INTEGER ) );
		registerFunction( "bin", new StandardSQLFunction( "bin", StandardBasicTypes.STRING ) );
		registerFunction( "char_length", new StandardSQLFunction( "char_length", StandardBasicTypes.LONG ) );
  	registerFunction( "rand", new NoArgSQLFunction( "rand", StandardBasicTypes.DOUBLE ) );
		...
	}
}		
```

* 사용하기

```java
// group_concat() 사용하기
Expressions.stringTemplate("group_concat({0})",menu.name).as("menu"))
```

```java
//rand() 사용하기
Expressions.numberTemplate(Double.class, "rand()").asc()
```



### 랜덤 정렬하기

```
.orderBy(Expressions.numberTemplate(Double.class, "rand()").asc())
```



### 별칭으로 정렬하기

```java
 NumberPath<Long> aliasLike = Expressions.numberPath(Long.class, "like");
 List<Tuple> tuples = queryFactory
                .select(restaurant, userLiking.id.count().as(aliasLike))
                .from(restaurant)
                .leftJoin(restaurant.userLikings, userLiking)
                .where( longitudeBetween(condition.getLongitude(), condition.getRadius()),
                        latitudeBetween(condition.getLatitude(), condition.getRadius()),
                        nameLike(condition.getName()))
                .groupBy(restaurant.id)
                .orderBy(aliasLike.asc())
                .fetch();
```

