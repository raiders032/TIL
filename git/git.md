# git

> 깃은 컴퓨터 파일의 변경사항을 추적하고 여러 명의 사용자들 간에 해당 파일들의 작업을 조율하기 위한 분산 버전 관리 시스템이다



## Centeralized Version Control

> 서버에 히스토리를 관리해서 각각의 개발자들이 원하는 내용을 업데이트해서 즉각적인 동기화가 이루어지는 시스템

단점

* 서버가 다운되면 많은 개발자가 이용을 못한다.
* 인터넷이 필수다

## Distributed Version Control

> 서버에만 히스토리가 있는게 아니라 모든 개발자들이 동일한 히스토리를 정보를 가지고 있는 것을 말한다.

장점

* 서버가 다운 되어도 각각의 개발자들이 동일한 히스토리를 가지고 있기 떄문에 서로의 정보를 이용해서 서버를 보관할 수 있다.
* 오프라인에서 일을 할 수 있다.



---



## workflow

### working directory

* untracked
  * `git add` 를 통해 `staging area`로 옮길 수 있다.
* tracked
  * unmodified
  * modified
    * `staging area`로 옮길 수 있다.
  * deleted
    * `staging area`로 옮길 수 있다.
  * `git add` 를 통해 `staging area`로 옮길 수 있다.

### staging area(index)

* newfile
* modified
* deleted

### .git repository(directory)



___



## merge

### fast-forward merges

### three-way merges



## rebase

* 브랜치에서 혼자 작업을 하는 경우 유용하게 쓸 수 있다.
* 패스트 포워드 머지를 사용할 수 없는 경우에도 머지 할 브랜치를 최신 마스터로 리베이스 후 마스터에 머지하면 패스트 포워드 머지를 사용할 수 있다.



## cherry pick

* 

