# 1 user & group 관련 파일



## 1.1 `/etc/passwd`

- 시스템의 모든 계정에 대한 정보를 담고 있는 파일
- 하나의 엔트리는 7개의 필드로 구분된다.



**User name**

- user의 login name을 나타낸다.

**Encrypted password**

- user의 password

**User ID number (UID)**

- user의 ID

**User's group ID number (GID)**

- primary group의 group id
- user의 Additional groups은 /etc/group 파일에 정의되어 있다.

Full name of the user (GECOS)

- comment field라고도 한다.
- 일반적으로 user의 full name을 가지고 있다.

User home directory

- user의 home directory를 나타낸다.
- 로그인 후 초기 디렉토리

**Login shell**

- Login shell을 나타낸다.



**예시**

```bash
cat /etc/passwd
...
ubuntu:x:1000:1000:Ubuntu:/home/ubuntu:/bin/bash
...
```

* login name: ubuntu
* encrypted password: 
  * `x `의 의미 /etc/shadow` 파일에 password를 별도로 관리한다.
* numerical user ID: 1000
* numerical group ID: 1000
* comment
  * useradd에서 -c 옵션으로 comment를 지정할 수 있다.
* user home directory
* login shell
  * system account는 로그인을 막기 위해 `/usr/sbin/nologin`



**user ID**

- `0`: root user
- `1~999`: system account
- `1000~60000`: local user
- `60000~65535`: system account



## 1.2 `/etc/shadow`

- 시스템 사용자의 비밀번호 정보를 가지고 있는 파일
- 9개의 필드로 이루어져 있다.



**login name**

- user의 이름

**encrypted password**

- `*`, `!`인 경우 로그인 금지를 나타냄
  - `*` : system account
  - `!`: password lock

**date of last password change**

- 최근 비밀번호 수정 날짜 

**minimum password age**

- 비밀번호 수정을 위해 충족해야할 최소 날짜
- 비어있거나 0인 경우 minimum password age이 없다는 의미

**maximum password age**

- date of last password change 이후로 maximum password age이 지나면 비밀번호를 변경해야 한다.

**password warning period**

- 비밀번호 만료 전 며칠전에 경고를 줄지 설정한다.

**password inactivity period**

- 비밀번호가 만료되고 **password inactivity period**로 설정한 기간이 지나면 더 이상 로그인 할 수 없으며 관리자를 통해 해결해야 한다.

**account expiration date**

- 계정의 만료 날짜를 나타냄
- 비밀번호 관리 정책과는 상관 없음

**reserved field**

- 추후 사용을 위해 예약된 필드



## 1.3 `/etc/group`

- group을 관리하는 파일
- 총 4 개의 필드로 구분된다.
  - group_name
  - group_password
  - group ID
  - user list



## 1.4 `/etc/login.defs`

- 계정 생성, 패스워드 설정에 default로 적용되는 값들을 설정하는 파일



# 2 user 관련 명령어

## 2.1 user 생성

- useradd 명령어로 user를 생성한다.
- -u 옵션으로 user ID를 지정하지 않으면 1000번 부터 순차적으로 부여된다.
- user가 생성되면 primary group도 자동으로 같이 생성되고 user를 삭제하면 같이 삭제된다.
  - 기본적으로 primary group의 group ID는 user ID와 동일하다 
  - -g 옵션을 사용하면 primary group의 group ID를 지정할 수 있다.

```bash
# useradd --help
Usage: useradd [options] LOGIN
       useradd -D
       useradd -D [options]

Options:
      --badnames                do not check for bad names
  -b, --base-dir BASE_DIR       base directory for the home directory of the
                                new account
      --btrfs-subvolume-home    use BTRFS subvolume for home directory
  -c, --comment COMMENT         GECOS field of the new account
  -d, --home-dir HOME_DIR       home directory of the new account
  -D, --defaults                print or change default useradd configuration
  -e, --expiredate EXPIRE_DATE  expiration date of the new account
  -f, --inactive INACTIVE       password inactivity period of the new account
  -g, --gid GROUP               name or ID of the primary group of the new
                                account
  -G, --groups GROUPS           list of supplementary groups of the new
                                account
  -h, --help                    display this help message and exit
  -k, --skel SKEL_DIR           use this alternative skeleton directory
  -K, --key KEY=VALUE           override /etc/login.defs defaults
  -l, --no-log-init             do not add the user to the lastlog and
                                faillog databases
  -m, --create-home             create the user's home directory
  -M, --no-create-home          do not create the user's home directory
  -N, --no-user-group           do not create a group with the same name as
                                the user
  -o, --non-unique              allow to create users with duplicate
                                (non-unique) UID
  -p, --password PASSWORD       encrypted password of the new account
  -r, --system                  create a system account
  -R, --root CHROOT_DIR         directory to chroot into
  -P, --prefix PREFIX_DIR       prefix directory where are located the /etc/* files
  -s, --shell SHELL             login shell of the new account
  -u, --uid UID                 user ID of the new account
  -U, --user-group              create a group with the same name as the user
  -Z, --selinux-user SEUSER     use a specific SEUSER for the SELinux user mapping
      --extrausers              Use the extra users database
```



**주요 옵션**

- `-d, --home-dir`: user의 홈 디렉토리를 설정한다. 설정하지 않으면 `home/{login name}`으로 생성된다.
- `-m, --create-home`:user의 홈디렉토리를 생성한다.
- `-u, --uid`: user의 ID를 지정한다. 지정하지 않으면 1000번 부터 순차적으로 할당된다.
- `-G, --groups`: 추가적인 그룹을 할당한다.
- `-s, --shell`: user의 login shell을 지정한다.



## 2.2 user 수정

- usermod 명령어로 user를 수정할 수 있다.

```bash
# usermod --help
Usage: usermod [options] LOGIN

Options:
  -b, --badnames                allow bad names
  -c, --comment COMMENT         new value of the GECOS field
  -d, --home HOME_DIR           new home directory for the user account
  -e, --expiredate EXPIRE_DATE  set account expiration date to EXPIRE_DATE
  -f, --inactive INACTIVE       set password inactive after expiration
                                to INACTIVE
  -g, --gid GROUP               force use GROUP as new primary group
  -G, --groups GROUPS           new list of supplementary GROUPS
  -a, --append                  append the user to the supplemental GROUPS
                                mentioned by the -G option without removing
                                the user from other groups
  -h, --help                    display this help message and exit
  -l, --login NEW_LOGIN         new value of the login name
  -L, --lock                    lock the user account
  -m, --move-home               move contents of the home directory to the
                                new location (use only with -d)
  -o, --non-unique              allow using duplicate (non-unique) UID
  -p, --password PASSWORD       use encrypted password for the new password
  -R, --root CHROOT_DIR         directory to chroot into
  -P, --prefix PREFIX_DIR       prefix directory where are located the /etc/* files
  -s, --shell SHELL             new login shell for the user account
  -u, --uid UID                 new UID for the user account
  -U, --unlock                  unlock the user account
  -v, --add-subuids FIRST-LAST  add range of subordinate uids
  -V, --del-subuids FIRST-LAST  remove range of subordinate uids
  -w, --add-subgids FIRST-LAST  add range of subordinate gids
  -W, --del-subgids FIRST-LAST  remove range of subordinate gids
  -Z, --selinux-user SEUSER     new SELinux user mapping for the user account
```



**주요 옵션**

- `-l, --login`: login name 변경하기
- `-s, --shell` : login shell 변경하기
- `-G, --groups`: user의 추가 그룹 설정
- `-a, --append`: -G 옵션만 사용하면 user의 추가 그룹을 오버라이딩 함 -a 옵션을 같이 쓰면 기존 그룹은 그대로 보존하고 지정된 그룹을 추가해 줌



## 2.3 user 삭제

- userdel 명령어로 user를 삭제할 수 있다.



```bash
# userdel --help
Usage: userdel [options] LOGIN

Options:
  -f, --force                   force removal of files,
                                even if not owned by user
  -h, --help                    display this help message and exit
  -r, --remove                  remove home directory and mail spool
  -R, --root CHROOT_DIR         directory to chroot into
  -P, --prefix PREFIX_DIR       prefix directory where are located the /etc/* files
      --extrausers              Use the extra users database
  -Z, --selinux-user            remove any SELinux user mapping for the user
```



**주요 옵션**

-  `-r, --remove`: 기본적으로 홈 디렉토리를 삭제하지 않는데 해당 옵션을 지정하면 홈 디렉토리도 같이 삭제한다. 



# 3 group 관련 명령어

## 3.1 group 생성

- groupadd

```bash
# groupadd --help
Usage: groupadd [options] GROUP

Options:
  -f, --force                   exit successfully if the group already exists,
                                and cancel -g if the GID is already used
  -g, --gid GID                 use GID for the new group
  -h, --help                    display this help message and exit
  -K, --key KEY=VALUE           override /etc/login.defs defaults
  -o, --non-unique              allow to create groups with duplicate
                                (non-unique) GID
  -p, --password PASSWORD       use this encrypted password for the new group
  -r, --system                  create a system account
  -R, --root CHROOT_DIR         directory to chroot into
  -P, --prefix PREFIX_DIR       directory prefix
      --extrausers              Use the extra users database
```



## 3.2 group 변경

- groupmod

```bash
# groupmod --help
Usage: groupmod [options] GROUP

Options:
  -g, --gid GID                 change the group ID to GID
  -h, --help                    display this help message and exit
  -n, --new-name NEW_GROUP      change the name to NEW_GROUP
  -o, --non-unique              allow to use a duplicate (non-unique) GID
  -p, --password PASSWORD       change the password to this (encrypted)
                                PASSWORD
  -R, --root CHROOT_DIR         directory to chroot into
  -P, --prefix PREFIX_DIR       prefix directory where are located the /etc/* files
```



## 3.3 group 삭제

- groupdel
- primary group은 삭제하지 못하며 supplementary group만 삭제할 수 있다.

```bash
# groupdel --help
Usage: groupdel [options] GROUP

Options:
  -h, --help                    display this help message and exit
  -R, --root CHROOT_DIR         directory to chroot into
  -P, --prefix PREFIX_DIR       prefix directory where are located the /etc/* files
  -f, --force                   delete group even if it is the primary group of a user
      --extrausers              Use the extra users database
```



# 4 password 관련 명령어



## 4.1 passwd

```bash
# passwd --help
Usage: passwd [options] [LOGIN]

Options:
  -a, --all                     report password status on all accounts
  -d, --delete                  delete the password for the named account
  -e, --expire                  force expire the password for the named account
  -h, --help                    display this help message and exit
  -k, --keep-tokens             change password only if expired
  -i, --inactive INACTIVE       set password inactive after expiration
                                to INACTIVE
  -l, --lock                    lock the password of the named account
  -n, --mindays MIN_DAYS        set minimum number of days before password
                                change to MIN_DAYS
  -q, --quiet                   quiet mode
  -r, --repository REPOSITORY   change password in REPOSITORY repository
  -R, --root CHROOT_DIR         directory to chroot into
  -S, --status                  report password status on the named account
  -u, --unlock                  unlock the password of the named account
  -w, --warndays WARN_DAYS      set expiration warning days to WARN_DAYS
  -x, --maxdays MAX_DAYS        set maximum number of days before password
                                change to MAX_DAYS
```



# 5 file permission

- 모든 파일과 디렉토리는 소유자와 소유 그룹이 존재한다.



**확인**

```bash
$ ls -l
total 4
drwxrwxr-x 2 test-user test-user 4096 Feb 11 10:07 dir
-rw-rw-r-- 1 test-user test-user    0 Feb 11 10:06 test.txt
```

- `ls -l` 명령으로 파일과 디렉토리의 소유자와 소유 그룹을 확일 할 수 있다.
- 첫 번째 test-user가 소유자를 의마하고 두 번째 test-user는 소유 그룹을 의미한다.
- `drwxrwxr-x`: 는 디렉토리 유무와 소유자, 소유 그룹, 그 외 사용자의 권한을 의미한다.
  - 첫 글자: 파일인 경우 `-`, 디렉토리인 경우 `d`
  - 이후 세 글자 씩 각각 소유자, 소유 그룹, 그 외 사용자의 권한을 의미한다.
  - `r`: 읽기 가능, 디렉토리인 경우 내용이 확인 가능하다 즉 ls가 가능하다
  - `w`: 쓰기 가능, 디렉토리인 경우 파일을 지우거나 파일을 생성하거나 등
  - `x`: 실행 가능, 디렉토리인 경우 cd로 해당 디렉토리로 이동 가능
  - `-`: 권한 없음



## 5.1 chown

- 파일 또는 디렉토리의 소유자 변경
- 루트 권한 필요



## 5.2 chgrp

- 파일 또는 디렉토리의 소유 그룹 변경



## 5.3 chmod



**symbolic 표현 방식**

```bash
# sandbox의 소유자(u)에 쓰기 권한(w)을 추가적으로 부여(+)한다.
chmod u+w sandbox

# sandbox의 소유 그룹(g)에 쓰기 권한(w)을 추가적으로 부여(+)한다.
chmod g+w sandbox

# sandbox의 소유자와 소유 그룹을 제외한 나머지 사용자(o)에게 쓰기 권한(w)을 추가적으로 부여(+)한다.
chmod o+w sandbox

# sandbox의 사용자(o)에게 아무 권한도 주지 않기
chmod o=s sandbox

# 모든 사용자(a)에게 쓰기 권한(w)을 추가적으로 부여(+)한다.
chmod a+w sandbox

# sandbox의 소유자(u)와 소유 그룹(g)에 읽기 권한(r)과 쓰기 권한(w)만 있도록 설정(=)한다.
chmod ug=rw sandbox
```

- 퍼미션을 금지하려면 `-`를 사용한다.



**numerical 표현 방식**

- 세 글자로 구성 됨
- 한 글자가 각각 소유자, 소유 그룹, 그 외 사용자의 권한을 나타냄
- 읽기가 가능하면  4를 쓰기가 가능하면 2를 실행이 가능하면  1을 더해서 나타낸다.

```bash
# sandbox의 소유자는 읽기(4), 쓰기(2)가 가능하고 소유 그룹은 읽기(4)가 가능하고 그 외 사용자는 다 불가능
chmod 640 sandbox
```
