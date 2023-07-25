# 1 mysqldump로 데이터베이스 마이그레이션

- 한 데이터베이스의 테이블 스키마와 로우 데이터를 다른 데이터베이스로 옮겨보자.



## 1.1 원본 데이터베이스 덤프 생성

```bash
mysqldump -u [username] -p[password] [database_name] > /tmp/[database_name].sql
```

```bash
mysql -u [username] -p[password] [new_database_name] < /tmp/[database_name].sql
```