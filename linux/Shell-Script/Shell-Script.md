# 1 shell script 생성

- shell script 파일은 `sh` 확장자를 사용한다.
- shell script를 만들 때는 시작에 `#!/bin/bash`를 붙여 shell script라는 것을 알린다.



**hello.sh**

```shell
#!/bin/bash
echo "hello world"
```



## 1.1 shell script 실행하기



**sh 명령어 이용**

```bash
$ sh hello.sh
hello world
```



**chmod 명령어 이용**

- shell script에 실행권한을 주고 직접 shell script를 실행하는 방법

```bash
$ chmod +x hello.sh
$ ./hello.sh
hello world
```



# 2 변수

``

**변수 선언 및 초기화**

```shell
#!/bin/bash

language="Korean"
echo "i can speak $language"
```

```bash
$ sh hello.sh
i can speak Korean
```



## 2.1 전역 변수

- 함수 내에서 전역 변수 language에 접근이 가능하다.

````shell
#!/bin/bash
language="Korean"

function print(){
  echo "i can speak $language"
}

print
````

```bash
$ sh hello.sh
i can speak Korean
```



## 2.2 지역 변수

- learn 함수 내에서 만 쓰이는 지역 변수 learn_language를 만든다.
- 지역 변수를 만들 때 `local` 이라는 키워드를 사용한다.

```shell
cat hello.sh
#!/bin/bash
language="Korean"

function learn(){
  local learn_language="English"
  echo "i can speak $learn_language"
}

function print(){
  echo "i can speak $1"
}

learn
print $language
print $learn_language
```

```bash
$ sh hello.sh
i can speak English
i can speak Korean
i can speak
```



## 2.3 위치 매개 변수

- 위치 매개변수는 스크립트 수행 시 함께 넘어오는 파라미터를 의미한다.

| 매개변수 | 설명                                                         |
| -------- | ------------------------------------------------------------ |
| $0       | 실행된 스크립트 파일 이름                                    |
| $1       | 첫 번째 파라미터 열 번째 파라미터부터는 `${10}`와 같이 중괄호로 감싸야한다. |
| $*       | 전체 인자 값                                                 |
| $@       | 전체 인자 값 `""`로 감싸면 $*과는 다르게 동작 함             |
| $#       | 매개변수의 총 개수                                           |



## 2.4 환경 변수

- 시스템을 위해 사전에 미리 시스템에서 사용하고 있는 변수들이 있다.



| 변수명 | 설명                             |
| ------ | -------------------------------- |
| HOME   | 사용자의 홈 디렉터리             |
| PATH   | 실행 파일을 찾을 디렉터리 경로   |
| PWD    | 사용자의 현재 작업 중인 디렉터리 |
| SHELL  | 로그인해서 사용하는 셸           |
| USER   | 사용자의 이름                    |
| ...    |                                  |



# 3 if

```
비교식
[ -z ${A} ] : A 문자열의 길이가 0이면 TRUE
[ -n ${A} ] : A 문자열의 길이가 0이 아니면 TRUE
[ ${A} -eq ${B} ] : A와 B값이 같으면 TRUE
[ ${A} -ne ${B} ] : A와 B값이 다르면 TRUE
[ ${A} -gt ${B} ] : A가 B보다 크면 TRUE
[ ${A} -ge ${B} ] : A가 B보다 크거나 같으면 TRUE
[ ${A} -lt ${B} ] : A가 B보다 작으면 TRUE
[ ${A} -le ${B} ] : A가 B보다 작거나 같으면 TRUE

[ 조건식A -a 조건식B ] : 조건식 A와 B가 모두 TRUE이면 TRUE (&& 와 동일)
[ 조건식A -o 조건식B ] : 조건식 A가 TRUE거나 조건식B가 TRUE면 TRUE (|| 와 동일)

파일관련
[ -d ${A} ] : A 파일이 디렉토리면 TRUE
[ -e ${A} ] : A 파일이(노드, 디렉토리, 소켓 등등 모두) 존재하면 TRUE
[ -L ${A} ] : A 파일이 심볼릭 링크면 TRUE
[ -r ${A} ] : A 파일이 읽기 가능하면 TRUE
[ -s ${A} ] : A 파일의 크기가 0 보다 크면 TRUE
[ -w ${A} ] : A 파일이 쓰기 가능하면 TRUE
[ -x ${A} ] : A 파일이 실행 가능하면 TRUE
[ -c ${A} ] : A 파일이 Special character file 이면 TRUE
[ -f ${A} ] : A 파일이 디렉토리가 아닌 일반 regular 파일이면 TRUE
[ -S ${A} ] : A 파일이 소켓이면 TRUE
[ ${A} -nt ${B} ] : A 파일 B 파일보다 최신파일이면 참
[ ${A} -ot ${B} ]  : A 파일이 B 파일보다 이전파일이면 참
[ ${A} -ef ${B} ] : A 파일과 B 파일이 같은 파일이면 참
```

