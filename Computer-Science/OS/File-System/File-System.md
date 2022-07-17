# 1 File System

* File System은 두 가지 부분으로 구성된다
  * a collection of file
  * a directory structure



# 2 File 

* File이란 이름이 붙여진 연관된 정보의 모음을 뜻한다.
* 일반적으로 비휘발성의 보조기억장치에 저장
* 운영체제는 다양한 저장 장치를 file이라는 동일한 논리적 단위로 볼 수 있게 해줌
  * 다양한 저장 장치: HDDs, magnetic tapes, and optical disks 등
* Operation
  * create, read, write, reposition, delete, open, close



## 2.1 File Attribute(Metadata)

* 파일 자체의 내용이 아니라 파일을 관리하기 위한 각종 정보
* 파일 이름, 유형, 저장된 위치, 파일 사이즈
* 접근 권한, 시간, 소유자



## 2.2 Operation



### 2.2.1 open

* 디스크에서 해당 파일의 메터데이터를 메모리로 가져오는 연산

# 3 Directory

* 파일의 메타데이터 중 일부를 보관하고 있는 일종의 특별한 파일
  * 해당 디렉토리에 속한 파일 이름 및 파일 메타데이터를 보관
* operation
  * search, create, delete a file
  * List a directory, rename a file, traverse the file system



# 4 File Protection

* 각 파일에 대해 누구에게 어떤 유형의 접근을 허락할 것인가를 정의
* Access Control 방법에는 아래와 같이 크게 3가지가 있다
  * Access Control Matrix
  * Grouping
  * Password



## 4.1 Access Control Matrix

* Access Control Matrix은 두 가지 방식으로 구현 가능
  * Access Controll List: 파일별로 누구에게 어떤 접근 권한이 있는지 링크드리스트 형태로 표시
  * Capability: 사용자별로 자신이 접근 권한을 가진 파일 및 해당 권한을 링크드리스트 형태로 표시
* Overhead가 커서 이 방식은 잘 사용하지 않는다



## 4.2 Grouping

* 일반적으로 사용하는 방식
* 전체 user를 owner, group, public 세 그룹으로 구분
* 각 파일에 대해 세 그룹의 전급 권한을 3비트씩 표시

```
owner group public
|‾|    |‾|    |‾|
rwx    r--    r--
```



## 4.3 Password

* 파일마다 Password를 두는 방법
  * 모든 접근 권한에 대해 하나의 패스워드
  * 접근 권한별 password



# 5 Allocation of File Data in Disk

* 디스크에 파일 데이터를 저장하는 방식에는 크게 3가지가 있다
  * Contiguous Allocation
  * Linked Allocation
  * Indexed Allocation



## 5.1 Contiguous Allocation

* 

**장점**

* 빠른 I/O
  * 한번의 Seek/Rotation으로 많은 바이트를 Trasfer
  * 블록들이 같은 트랙이 있는 경우
* Random access 가능

**단점**

* External Frangmentation 발생
* File Grow가 어려움
  * 크기가 늘어날 것을 대비해 예비 블록을 미리 할당하면 Internal Frahmentation이 발생할 수 있다

