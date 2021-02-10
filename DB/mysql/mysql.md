### 데이터 베이스 복사하기

* AWS RDS의 Mysql을 사용
* 아래와 같이 `momelet_dev`  데이터베이스의 데이터를 `momelet_test` 로 옮기고자 하였다.

```bash
show databases
+--------------------+
| Database           |
+--------------------+
| information_schema |
| momelet_dev        |
| momelet_prod       |
| momelet_test       |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

1. RDS에 접근할 수 있는 EC2로 접속한다.

> RDS는 직접적으로 ssh 접속이 불가능하다.

2. mysqldump명령어로 .sql파일을 만든다

```bash
mysqldump -h <RDS의 엔드포인트> -u <마스터 사용자 이름> -p <원본 데이터베이스> > <사본데이터베이스>.sql
# 예시
mysqldump -h rds.amazonaws.com -u momelet -p momelet_dev > momelet_test.sql
```

3. .sql 파일로 데이터 옮기기

```bash
mysql -h <RDS의 엔드포인트> -u <마스터 사용자 이름> -p <사본 데이터베이스> < <사본데이터베이스>.sql
#예시
mysql -h rds.amazonaws.com -u momelet -p momelet_test < momelet_test.sql
```



