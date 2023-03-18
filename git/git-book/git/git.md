# 1 Git





# 2 The Three States

- 파일의 주요 상태로 *modified*, *staged*, committed 3가지의 상태가 있다



**modified**

- 파일이 변경된 상태이나 아직 데이터베이스에 커밋되지 않은 상태

**staged**

- modified 상태의 파일을 다음 커밋에 포함하도록 표시한다.

**committed**

- 파일이 안전하게 Local 데이터베이스에 저장된 상태를 말한다.



**Git workflow**

![Working tree, staging area, and Git directory.](images/areas.png)

1. `Working tree`에 있는 파일을 수정한다.
   - 해당 파일은 아직 staged 되지 않았기 때문에 *modified* 상태이다
2. 다음 커밋에 포함 될 modified 상태의 파일을 add 명령어로 `staging area`에 올린다.
   - 해당 파일은 *staged* 상태이다
3. commit 명령어로 staging area의 파일을 스냅샷으로 `Git directory`에 영구히 저장한다.
   - 해당 파일은 committed 상태이다