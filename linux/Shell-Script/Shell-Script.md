# if

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

