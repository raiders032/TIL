## 자주 사용하는 명령어

* cat
  * 파일 내용 보기
* cd
  * 디렉토리 이동
* clear
  * 터미널 스크린을 비운다.
* cp
  * 파일 복사
* file
  * 파일 속성 보기
* id
  * 내가 가진 권한 확인
* ls
  * 디렉토리 내 파일 목록 조회하기
* ln
* man
  * 도움말
* mkdir
  * 디렉토리 생성
* mv
  * 파일 이동
* rm
  * 파일 삭제
* su
  * 사용자의 권한을 대여
  * 관리자가 사용자 계정을 관리하고 이슈/장애를 분석 할 때
* sudo
  * 슈퍼유저의 권한을 수행한다.
  * 사용자 추가하기
    * `sudo adduser username`
* touch

## 사용자와 권한 관련 명령어

superuser

> 시스템 운영 관리자 계정으로 일반적으로 리눅스 운영체제에서는 루트(root) 유저를 말한다.
>
> 필요한 상황에서만 사용하도록하고 남용하게되면 시스템 손상과 바이러스, 악성코드의 침입에 의한 피해를 볼 수 있다.

명령어

* `whoami`

  * 나의 계정 확인

* `id`

  * 내가 가지고 있는 권한 확인

* `sudo`

  * 슈퍼유저의 권한을 수행한다.

  * ```shell
    ubuntu@ip-172-31-2-121:~$ sudo id
    uid=0(root) gid=0(root) groups=0(root)
    ```

* `user add -aG user1 sudo`

  * 사용자를 sudo 권한에 추가

* `su [options] [username]`

  * username의 아이디로 로그인 한다.



### 사용자 계정과 그룹 계정

* `cat /etc/passwd`

  * 사용자 계정 확인

  * UID

    * 0: root

    * 1~99: predefined

    * 100~999: administrative and system accounts

    * 1000~: user

    * ```shell
      ubuntu@ip-172-31-2-121:~$ cat /etc/passwd
      root:x:0:0:root:/root:/bin/bash
      daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
      bin:x:2:2:bin:/bin:/usr/sbin/nologin
      sys:x:3:3:sys:/dev:/usr/sbin/nologin
      sync:x:4:65534:sync:/bin:/bin/sync
      games:x:5:60:games:/usr/games:/usr/sbin/nologin
      man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
      lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
      mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
      news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
      uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
      proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
      www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
      backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
      list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
      irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
      gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
      nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
      systemd-network:x:100:102:systemd Network Management,,,:/run/systemd/netif:/usr/sbin/nologin
      systemd-resolve:x:101:103:systemd Resolver,,,:/run/systemd/resolve:/usr/sbin/nologin
      syslog:x:102:106::/home/syslog:/usr/sbin/nologin
      messagebus:x:103:107::/nonexistent:/usr/sbin/nologin
      _apt:x:104:65534::/nonexistent:/usr/sbin/nologin
      lxd:x:105:65534::/var/lib/lxd/:/bin/false
      uuidd:x:106:110::/run/uuidd:/usr/sbin/nologin
      dnsmasq:x:107:65534:dnsmasq,,,:/var/lib/misc:/usr/sbin/nologin
      landscape:x:108:112::/var/lib/landscape:/usr/sbin/nologin
      sshd:x:109:65534::/run/sshd:/usr/sbin/nologin
      pollinate:x:110:1::/var/cache/pollinate:/bin/false
      ubuntu:x:1000:1000:Ubuntu:/home/ubuntu:/bin/bash
      usbmux:x:111:46:usbmux daemon,,,:/var/lib/usbmux:/usr/sbin/nologin
      node:x:1001:1001::/home/node:/bin/bash
      jenkins:x:1002:1002:,,,:/home/jenkins:/bin/bash
      ```

* `cat /etc/shadow`

  * 사용자 암호
  * 솔트값이 첨가되어 있어 같은 암호라 하더라도 해시값이 다르다

* `cat /etc/group`

  * 사용자 그룹 확인

### 사용자 추가

