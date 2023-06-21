# 1 File-System-And-Storage



# 2 Archiving & Compression

- Archiving이란 파일과 디렉토리를 묶어 하나의 단일 파일로 만드는 것을 의미한다.
- 이렇게 아카이빙된 단일 파일을 압축하여 파일 사이즈를 줄일 수 있다.



## 2.1 Archiving Util

- Archiving 기능이 있는 대표적인 유틸리티로 tar가 있다.
- GNU 'tar' saves many files together into a single tape or disk archive, and can restore individual files from the archive.



```bash
$ tar --help

Usage: tar [OPTION...] [FILE]...

Examples:
  tar -cf archive.tar foo bar  # Create archive.tar from files foo and bar.
  tar -tvf archive.tar         # List all files in archive.tar verbosely.
  tar -xf archive.tar          # Extract all files from archive.tar.

Compression options:
  -a, --auto-compress        use archive suffix to determine the compression
                             program
  -I, --use-compress-program=PROG
                             filter through PROG (must accept -d)
  -j, --bzip2                filter the archive through bzip2
  -J, --xz                   filter the archive through xz
      --lzip                 filter the archive through lzip
      --lzma                 filter the archive through xz
      --lzop                 filter the archive through xz
      --no-auto-compress     do not use archive suffix to determine the
                             compression program
  -z, --gzip, --gunzip, --ungzip   filter the archive through gzip
  -Z, --compress, --uncompress   filter the archive through compress
```



## 2.2 Compression Util

- Compression 기능의 유틸리티로 gzip, bzip2, xz, zip 등이 있다.



**gzip, bzip2, xz**

- 파일 단위로만 압축이 가능하다. 따라서 먼저 아카이빙을 통해 단일 파일을 만든 후 진행한다.
  - tar 커맨드에 아키이빙 후 **gzip, bzip2, xz**를 이용해 압축까지 해주는 옵션이 있다.
- 압축을 진행하면 원본 파일을 삭제되고 압축파일만 남겨진다.
- 압축파일의 확장자는 각각 gz, bz2, xz다
- 압축된 파일 내용을 보고싶다면 각각 zcat, bzcat, xzcat을 이용하며 된다.
- 압축해제는 각각 gunzip, bunzip2, unxz다



```bash
$ gzip --help
Usage: gzip [OPTION]... [FILE]...

Mandatory arguments to long options are mandatory for short options too.
  -c, --stdout      write on standard output, keep original files unchanged
  -d, --decompress  decompress
  -f, --force       force overwrite of output file and compress links
  -h, --help        give this help
  -k, --keep        keep (don't delete) input files
  -l, --list        list compressed file contents
  -L, --license     display software license
  -n, --no-name     do not save or restore the original name and time stamp
  -N, --name        save or restore the original name and time stamp
  -q, --quiet       suppress all warnings
  -r, --recursive   operate recursively on directories
  -S, --suffix=SUF  use suffix SUF on compressed files
  -t, --test        test compressed file integrity
  -v, --verbose     verbose mode
  -V, --version     display version number
  -1, --fast        compress faster
  -9, --best        compress better
  --rsyncable       Make rsync-friendly archive
```



**zip, unzip**

- 원본을 보존하면서 압축파일 생성
- 디렉토리 압축 가능



# 3 LVM

- Logical Volume Manager
- Logical Volume을 효율적이고 유연하게 관리하기 위한 커널의 한 부분이자 프로그램이다.
- 기존방식이 파일시스템을 블록 장치에 직접 접근해서 읽고 쓰기를 했다면, LVM은 파일시스템이 LVM이 만든 가상의 블록 장치에 읽고 쓰기를 하게된다.



## 3.1 PV

- Physical Volume
- LVM에서 block device를 사용하려면 우선 PV로 **초기화**를 해야한다.
- PV는 일정한 크기의 PE(Physical Extent)들로 구성된다.



```bash
$ sudo fdisk -l /dev/sda
Disk /dev/sda: 3.7 TiB, 4000787030016 bytes, 7814037168 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xc509c055

Device     Boot Start        End    Sectors Size Id Type
/dev/sda1        2048 4294967294 4294965247   2T 8e Linux LVM
```

- 블록 디바이스 /dev/sda의 /dev/sda1 파티션의 Type이 LVM이다.

```bash
$ sudo pvscan
No matching physical volumes found
```

- 현재 PV가 없는 상태

```bash
$ sudo pvcreate /dev/sda1
```

- /dev/sda1 디바이스를 PV로 초기화

```bash
$ sudo pvscan
PV /dev/sda1                      lvm2 [<2.00 TiB]
Total: 1 [<2.00 TiB] / in use: 0 [0   ] / in no VG: 1 [<2.00 TiB]
```

- 다시 조회하면 PV `/dev/sda1`가 만들어졌다.



## 3.2 PE

- Physical Extent
- PV를 구성하는 일정한 크기의 블록으로 LVM2에서의 기본크기는 4MB다.
- PE는 LV(Logical Volume)의 LE(Logical Extent)와 1:1로 대응된다.



## 3.3 VG

- Volume Group
- PV의 집합이다.
- VG안에서 원하는대로 공간을 쪼개서 LV로 만들 수 있다.



**생성**

- myvg라는 vg를 생성한다.
- /dev/sda1 PV가 속해있다.

```bash
$ sudo vgcreate myvg /dev/sda1
```

```bash
$ sudo vgscan
Reading volume groups from cache.
Found volume group "myvg" using metadata type lvm2
```

```bash
$ sudo vgdisplay myvg
  --- Volume group ---
  VG Name               myvg
  System ID
  Format                lvm2
  Metadata Areas        1
  Metadata Sequence No  1
  VG Access             read/write
  VG Status             resizable
  MAX LV                0
  Cur LV                0
  Open LV               0
  Max PV                0
  Cur PV                1
  Act PV                1
  VG Size               <2.00 TiB
  PE Size               4.00 MiB
  Total PE              524287
  Alloc PE / Size       0 / 0
  Free  PE / Size       524287 / <2.00 TiB
  VG UUID               J9W3D7-Dkdo-noIV-AyIA-Q9rh-lomS-qDLGlc
```

- PE 사이즈는 4.00 MiB다



**PV 추가**

- PV로 초기화된 디바이스 /dev/sda2를 myvg VG에 추가한다.

```bash
sudo vgextend myvg /dev/sda2
```



## 3.4 LV

- Logical Volume



**생성**

```bash
sudo lvcreate -l +100%FREE -n mylv myvg
```

```bash
$ sudo lvscan
ACTIVE            '/dev/myvg/mylv' [<2.00 TiB] inherit
```



**확장**

```bash
$ sudo lvextend -l +100%FREE /dev/myvg/mylv
# lv 확장 후에는 파일 시스템 확장이 추가적으로 필요함
```



## 3.5 LE

- Logical Extent
- LV를 구성하는 일정한 크기의 블록으로 기본크기는 PE와 마찬가지로 4MB다



## 3.6 장점



**기존방식이 파일시스템을 블록 장치에 직접 접근**

- 만약 특정 파티션(/home 이라 가정합니다.)에 마운트된 파티션이 용량이 일정 수준 이상 찼을 경우 다음과 같이 번거로운 작업을 수행해야 했습니다.

  - 추가 디스크를 장착

  - 추가된 디스크에 파티션 생성 및 포맷

  - 새로운 마운트 포인트(/home2) 를 만들고 추가한 파티션을 마운트

  - 기존 home 데이타를 home2 에 복사 또는 이동

  - 기존 home 파티션을 언마운트(umount)

  - home2 를 home 으로 마운트



**LVM 사용**

- 이제 /home 영역이 거의 찼을 경우 LVM이 적용되어 있으면 다음과 같이 처리할 수 있습니다.

  - 추가 디스크를 장착

  - 추가된 디스크에 파티션을 만들어서 물리 볼륨(PV) 생성

  - 물리 볼륨을 볼륨 그룹(VG)에 추가. 여기서는 vg_data 볼륨 그룹으로 추가합니다.

  - /home 이 사용하는 논리 볼륨인 lv_home의 볼륨 사이즈를 증가

# 4



## lsblk

- block devices에 대한 정보 보기

```bash
$ lsblk
NAME MAJ:MIN RM SIZE RO TYPE MOUNTPOINT sda 8:0 0 8G 0 disk
├─sda1 8:1 0 7G 0 part /
├─sda2 8:2 0 1K 0 part
└─sda5 8:5 0 1022M 0 part [SWAP] sdb 8:16 0 100M 0 disk
sdc 8:32 0 100M 0 disk
sdd 8:48 0 100M 0 disk
sde 8:64 0 250M 0 disk
sdf 8:80 0 150M 0 disk
sr0 11:0 1 1024M 0 rom
```



## fdisk

- 

```bash
$ sudo fdisk -l /dev/sdd
Disk /dev/sdd: 104 MB, 104857600 bytes
64 heads, 32 sectors/track, 100 cylinders, total 204800 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0xb4faec8d
   Device Boot      Start         End      Blocks   Id  System
/dev/sdd1            2048      204799      101376   8e  Linux LVM

$  sudo fdisk /dev/sdb
Welcome to fdisk (util-linux 2.37.2).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

Device does not contain a recognized partition table.
Created a new DOS disklabel with disk identifier 0x7208e960.

Command (m for help): m

Help:

  DOS (MBR)
   a   toggle a bootable flag
   b   edit nested BSD disklabel
   c   toggle the dos compatibility flag

  Generic
   d   delete a partition
   F   list free unpartitioned space
   l   list known partition types
   n   add a new partition
   p   print the partition table
   t   change a partition type
   v   verify the partition table
   i   print information about a partition

  Misc
   m   print this menu
   u   change display/entry units
   x   extra functionality (experts only)

  Script
   I   load disk layout from sfdisk script file
   O   dump disk layout to sfdisk script file

  Save & Exit
   w   write table to disk and exit
   q   quit without saving changes

  Create a new label
   g   create a new empty GPT partition table
   G   create a new empty SGI (IRIX) partition table
   o   create a new empty DOS partition table
   s   create a new empty Sun partition table
```



## df

```bash
$ df --help
Usage: df [OPTION]... [FILE]...
Show information about the file system on which each FILE resides,
or all file systems by default.

Mandatory arguments to long options are mandatory for short options too.
  -a, --all             include pseudo, duplicate, inaccessible file systems
  -B, --block-size=SIZE  scale sizes by SIZE before printing them; e.g.,
                           '-BM' prints sizes in units of 1,048,576 bytes;
                           see SIZE format below
      --direct          show statistics for a file instead of mount point
      --total           produce a grand total
  -h, --human-readable  print sizes in human readable format (e.g., 1K 234M 2G)
  -H, --si              likewise, but use powers of 1000 not 1024
  -i, --inodes          list inode information instead of block usage
  -k                    like --block-size=1K
  -l, --local           limit listing to local file systems
      --no-sync         do not invoke sync before getting usage info (default)
      --output[=FIELD_LIST]  use the output format defined by FIELD_LIST,
                               or print all fields if FIELD_LIST is omitted.
  -P, --portability     use the POSIX output format
      --sync            invoke sync before getting usage info
  -t, --type=TYPE       limit listing to file systems of type TYPE
  -T, --print-type      print file system type
  -x, --exclude-type=TYPE   limit listing to file systems not of type TYPE
  -v                    (ignored)
      --help     display this help and exit
      --version  output version information and exit
```



**참고**

- https://tech.cloud.nongshim.co.kr/2018/11/23/lvmlogical-volume-manager-1-%EA%B0%9C%EB%85%90/
