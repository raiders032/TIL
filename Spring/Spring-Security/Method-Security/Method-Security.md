# Method Security

* 특정 메서드에 권한 처리를 하는 기능



## @EnableGlobalMethodSecurity

* 특정 메서드에 권한 처리를 하는 MethodSecurity 설정 기능 제공한다. 
* 각 설정값 true로 변경하면 사용가능 ( default값은 false)
  * securedEnable : @Secured 사용하여 인가처리하는 옵션
  * prePostEnable : @PreAuthorize, @PostAuthorize 사용하여 인가처리 옵션
  * jsr250Enabled : @RolesAllowed 사용하여 인가처리 옵션
* @Secured, @RolesAllowed, @PreAuthorize
  * 메서드 호출 전 권한 검사
* @PostAuthorize
  * 메서드 호출 후 권한 검사

**예시**

* 설정 예시

```java
@Configuration
@EnableGlobalMethodSecurity(securedEnabled = true, prePostEnabled = true, jsr250Enabled = true)
public class MethodSecurityConfig extends GlobalMethodSecurityConfiguration {
	...
}
```

* 컨트롤러 클래스에 `@PreAuthorize("hasRole('USER')")` 을 적용 해당 클래스에 메소드를 실행하기전 USER 권한을 가지고 있는지 확인한다.

```java
@PreAuthorize("hasRole('USER')")
@RequiredArgsConstructor
@RestController
public class BookmarkController {

    @PostMapping("/api/v1/bookmarks/restaurants/{restaurantId}")
    public ResponseEntity<?> createBookmark(@CurrentUser UserPrincipal currentUser, @PathVariable Long restaurantId){
        bookmarkService.createBookmark(currentUser.getId(), restaurantId);
        return ResponseEntity.ok(new ApiResponse(true, "북마크 생성 완료"));
    }

}
```

