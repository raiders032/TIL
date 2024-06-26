커널

쉘

프롬프트

* 사용자 호스트 디렉토리



## 디렉토리 명령어

### cd

* 작업 디렉토리 변경

### cp

* 디렉토리 복사 

```bash
cp -r
```

### ls

* 디렉토리 내용 확인

```bash
ls -a
ls -l
ls -al
ls -R
```

### pwd

* 현재 작업 디렉터로 확인

### mkdir

* 디렉토리 생성

```bash
mkdir -p 
```

### rmdir

* 디렉토리  제거

```bash
rmdir
rm -r
rm -rf
```

### mv

* 디렉토리  이름 변경
* 디렉토리  이동

```bash
mv -r
```



## 파일 관련 명령어

### touch

* 빈 파일을 생성

```bash
touch file1
```

### rm

* 파일 제거

```bash
rm -f
```

### mv

* 파일 이동
* 파일 이름 변경



### cp

* 파일 복사

```bash
 cp sourcefile destinationfile
```



### cat

* 파일 내용 확인

```bash
cat -n
```



### head

* 파일 처음부터 N줄까지 확인

```bash
head -3 
```

### tail

* 파일 끝부터 N줄까지 확인

```bash
tail -20
tail -f
```



### more

* 파일 내용 확인



## 파일 및 디렉토리 검색

### grep

* 파일 내용에서 특정 내용을 찾을 때 사용한다.

```bash
# 대소문자 구분 X
grep -i
# 라인넘버 표시
grep -n
grep -v
grep -w
grep -c
grep -l
```



### fgrep

* 특수문자들을 단순한 문자로 인식

### find

* 파일 또는 디렉토리를 검색할 떄 사용

```bash
find / -name passwd
find / -name passwd -type f
find / -name passwd -type d
find / -size +1G
find . -name test -ls
```



## 권한

* 리눅스의 모든 파일과 디렉토리는 권한을 가지고 있다.
* 다중 사용자 환경에서 제공하는 가장 기초적인 접근 통제 방법
* 소유자
  * 파일이나 디렉토리를 생성한 사용자
* 관리그룹
  * 파일이나 디렉토리를 생성한 사용자가 속한 그룹
* 나머지
  * 소유자도 아니고 관리 그룹에 속한 사용자도 아닌 경우
* 기본적으로 파일의 경우 `644` , 디렉토리는 `755` 의 권한을 가진다.

### chmod

```bash
# 소유자에게 읽기 권한 부여
chmode u+r test
# 관리 그룹에게 읽기 쓰기 권한 부여
chmode g+rw test
# 나머지 사용자에게 실행 권한 박탈
chmode o-x test
```



## 링크

### 하드링크

* 특정 파일 또는 디렉토리에 접근을 쉡게 할 수 있도록 하는 방법
* 파일 시스템이 물리적인 장치인 하드 디스크 상에 저장되어 있는 특정 파일의 위치를 가리키는 것

### 심볼릭링크

* 실질적인 디스크 상의 파일을 가리키는 것이 아니라 파일 시스렘 상의 특정 파일을 가리키는 것
* 하드링크를 가리킨다

### ln

```bash
ln
ln -s
```



## Shell

* 터미널에 입력한 명령을 해석하고 관리하는 프로그램은 쉘이라고 한다.
* 쉘은 사용자 커널 사이에 연결시켜주는 역할을 하며 사용자가 입력한 명령을 해석하여 운영체제가 해당 명령을 알아들을 수 있게 해준다.
* 가장 많이 사용되는 쉘은 Bash 쉘이다



### shell 메타문자 사용

* `~`

  * 현재 로그인 한 사용자의 홈디렉토리

  * ```bash
    cd ~
    cd ~<사용자이름>
    ```

* `-`

  * 이전 작업 디렉토리

  * ```bash
    cd -
    ```

* `*`

  * 하나 이상의 문자를 대체하는 문자

* `?`

  * 하나의 문자만 대체

* `<`

  * 표준 입력 재지정

* `>`

  * 표준 출력 및 표전 에러를 재지정

  * 일반적으로 명령어의 출력을 파일로 저장 또는 네트워크로 전송

  * 파일의 내용을 덮어씀

  * `>>` : 이어서 쓰기 

  * ```bash
    # 출력을 파일로 저장
    echo "test" > ./file
    # 정상적인 결과만 출력
    find / -perm -4000 2> /dev/null
    # 에러 결과만 출력
    find / -perm -4000 1> /dev/null
    # 정상 결과는 파일에 저장 에러는 출력 X
    find / -perm -4000 1> ./file 2> /dev/null
    ```

* `|`

  * 명령어1 | 명령어2
  
  * 명령어1의 결과를 명령어2의 입력으로 사용 
  
  * ```bash
    cat /etc/passwd | grep root
    ```



## 프로세스



### ps

* 현재 실행중인 프로세스의 정보를 보여준다.

```bash
# 현재 사용자가 실행한 프로세스
ps
# 풀 포맷으로 보여주기
ps -f
# 모든 프로세스 자세히
ps -ef
```



### kill

> 프로세스를 종료 시키는 명령어

* 프로세스에 특정 시그널을 전달합니다.
* 시그널 번호
  * `1` : 프로세스 종료 없이 프로그램을 초기화
  * `2`: 명령어 실행중 중단 명령
  * `9`: 무시할 수 없는 종료
  * `15`: 무시할 수 있는 종료

```bash
# 프로세스 52373에게 9번 시그널 전달 즉 종료
kill -9 52373
```



### top

> 프로세스와 쓰레드의 목록과 시스템의 요약 정보를 보여준다.



___



## 아카이브

> 여러 파일을 하나의 묶음으로 보관



### tar

> 여러 파일을 하나의 아카이브에 묶어서 저장한다.

```bash
 # foo 와 bar를 묶어 archive.tar를 생성한다.
 tar -cf archive.tar foo bar
 # archive.tar의 파일 리스트를 조회한다.
 tar -tvf archive.tar
 # archive.tar의 모든 파일을 추출한다.
 tar -xf archive.tar
 # archive.tar.gz을 압축 해제와 아카이브를 해제를 동시에 한다.
 tar -zxvf archive.tar.gz
```





## 사용자 관리 관련 파일들

1. /etc/passwd

* 사용자의 기본 정보를 가지고 있다

* ```bash
  cat /etc/passwd
  ...
  ubuntu:x:1000:1000:Ubuntu:/home/ubuntu:/bin/bash
  ...
  ```

* ubuntu

  * 로그인명

* x

  * 현재는 사용하지 않는다.

* 1000

  * UID

* 1000

  * GID

* /home/ubuntu

  * 사용자의 홈 디렉토리

* /bin/bash

  * 로그인 쉘



2. /etc/group

* 그룹에 대한 정보를 가지고 있다

* ```bash
  cat /etc/group
  ...
  sudo:x:27:ubuntu
  ...
  ```

* sudo

  * 그룹이름

* x

  * 패스워드 현재 사용하지 않음

* 27

  * GID

* ubuntu

  * 사용자 목록



## 사용자 관리 명령어

### useradd

> 새로운 유저를 생성한다.

```bash
# user01 사용자를 생성한다.
useradd user01
tail -1 /etc/passwd
user01:x:1002:1002::/home/user01:/bin/bash

# user02 사용자를 생성한다. 유저 아이디, 주석 옵션 사용
useradd -u 2000 -c "test user" user02
tail -1 /etc/passwd
user02:x:2000:2000:test user:/home/user02:/bin/bash
```

### usermod

> 유저의 정보를 변경한다.

```bash
# 변경전
tail -1 /etc/passwd
user02:x:2000:2000:test user:/home/user02:/bin/bash

# 사용자 user02의 유저 아이디를 1003으로 변경
usermod -u 1003 user02
tail -1 /etc/passwd
user02:x:1003:2000:test user:/home/user02:/bin/bash

# 현재 유저를 docker 그룹에 추가
sudo usermod -aG docker $USER
```

### userdel

> 유저를 삭제한다.

```bash
# user01 사용자를 삭제한다.
userdel user01
# user02 사용자를 삭제한다 홈디렉토리도 함께
userdel -r user02
```

### passwd

> 사용자의 비밀번호를 변경한다.

```bash
# 현재 사용자의 비밀번호 변경
passwd
# ec2-user 유저의 비밃번호 변경
passwd ec2-user
```



## 그룹 관리 명령어

**cat /etc/group**

> 그룹 조회하기.

### groupadd

> 새로운 그룹을 생성한다.

### groupmod

> 그룹 정보를 수정한다.

### groupdel

> 그룹을 삭제한다.

### groups

> 유저가 속한 그룹을 확인한다.

```bash
$ groups youngthree
youngthree : youngthree docker
```



## 사용자 로그인 관련 명령어

### su

> 다른 계정의 권한으로 명령어를 실할수 있게한다.
>
> * `-` 의 유무
>   * O: 입력한 사용자의 사용자 초기화 파일을 적용
>   * X: 현재 사용자의 환경을 유지

```bash
# root 유저의 권한을 빌려 명령을 수행함
su
# user 유저의 권한을 빌려 명령을 수행함
su user
# su - 는 root 계정으로 완전히 전환하고, root 사용자의 환경설정을 불러온다.
su -
# su - 는 다른 user 계정으로 완전히 전환하고, 전환한 사용자의 환경설정을 불러온다.
su - user
```

### who

> 로그인한 유저를 보여준다.

```bash
who
# 런레벨 확인
who -r
run-level 5  2021-01-29 13:29
```

### last

> 로그인 내역을 확인한다.

```bash
last
```



##  Systemctl 관련 명령어

