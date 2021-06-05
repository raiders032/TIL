## reset

- 현재 HEAD가 가리키고 있는 브랜치가 가리키는 커밋을 바꾸는 역할을 한다.

![image-20210514220105492](./images/image-20210514220105492.png?lastModify=1622905139)

### git reset --soft HEAD~1

- 현재 HEAD가 가리키고 있는 브랜치가 가리키는 커밋을 바꾸는 일만 한다.

![image-20210514220237669](./images/image-20210514220237669.png?lastModify=1622905139)



### git reset --mixed HEAD~1

- 현재 HEAD가 가리키고 있는 브랜치가 가리키는 커밋을 바꾸고
- Index를 현재 HEAD가 가리키는 스냅샷으로 업데이트할 수 있다.
- 결과적으로 가장 최근의 `git commit` 명령을 되돌린다.
- `git commit` 명령도 되돌리고 `git add` 명령까지 되돌린다.

![image-20210514220424002](./images/image-20210514220424002.png?lastModify=1622905139)



### git reset --hard HEAD~1

- 현재 HEAD가 가리키는 브랜치가 가리키는 커밋을 바꾸고
- Index를 현재 HEAD가 가리키는 스냅샷으로 업데이트하고
- 워킹 디렉토리까지 현재 HEAD가 가리키는 스냅샷으로 업데이트한다.
- `git add` 와 `git commit` 명령으로 생성한 마지막 커밋을 되돌린다. 그리고 워킹 디렉토리의 내용까지도 되돌린다.

![image-20210514220538677](./images/image-20210514220538677.png?lastModify=1622905139)



참고

* https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified