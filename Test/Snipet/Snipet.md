## 예외 테스트

```java
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.catchThrowable;
import static org.mockito.BDDMockito.given;

@Test
void retrieveUserAccount_실패_존재하지_않는_userId() {
  // given
  UserAccountCommand.RetrievalByUserId command = UserAccountCommand.RetrievalByUserId.builder()
    .userId(NON_EXISTENT_USER_ID)
    .build();

  given(userAccountRepository.findByUserId(NON_EXISTENT_USER_ID))
    .willReturn(Optional.empty());

  // when
  Throwable throwable = catchThrowable(() -> userAccountServiceImpl.retrieveUserAccount(command));

  //then
  assertThat(throwable).isInstanceOf(EntityNotFoundException.class);
  assertThat(throwable).hasMessageContaining(String.format("User Account %s Not Found", NON_EXISTENT_USER_ID));
}
```



# 
