# 1 DDL

- Data Definition Language
- DBMS 서버의 모든 오브젝트를 생성하거나 변경하는 쿼리를 DDL이라 한다.
- 스토어드 프로시저나 함수, Database, 테이블 등을 생성하거나 변경하는 명렁이 DDL에 속한다.



## 1.1 데이터베이스

**데이터베이스 생성**

```sql
CREATE DATABASE [IF NOT EXISTS] employees CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```



**권한 부여**

- admin 사용자에게 employees 데이터베이스의 모든 권한을 부여하는 예시

```sql
GRANT ALL PRIVILEGES ON employees.* TO 'admin'@'%';

# 변경 사항 적용
FLUSH PRIVILEGES;
```



**데이터베이스 조회**

```sql
SHOW DATABASES;
```



**데이터베이스 선택**

````sql
USE employees;
````



**데이터베이스 속성 변경**

```sql
ALTER DATABASE employees CHARACTER SET=euckr;
```



**데이터베이스 삭제**

```sql
DROP DATABASE [IF EXISTS] employees;
```



## 1.2 테이블

**테이블 생성**

```sql
CREATE TABLE [IF NOT EXISTS] product (
	product_id BIGINT [UNSIGNED] [AUTO_INCREMENT],
  name CHAR(20) [NOT NULL]
)
```



## 1.3 컬럼

```sql
ALTER TABLE ORDERS 
ADD ORDER_GROUP_ID BINARY(16) NOT NULL AFTER ORDER_ID;
```



## 1.4 유저

**유저 생성**

- MySQL에서는 사용자와 그 사용자가 접근할 수 있는 호스트를 함께 지정해서 사용자를 생성한다.
- 아래는 로컬 호스트에서만 접속이 가능하다

```mysql
CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
```

- 사용자가 어떤 호스트에서든 접근할 수 있도록 설정

```mysql
CREATE USER 'username'@'%' IDENTIFIED BY 'password';
```



**유저 삭제**

```mysql
DROP USER 'username'@'localhost';
```

```mysql
CREATE USER 'username'@'%' IDENTIFIED BY 'password';
```



**유저 조회**

```mysql
SELECT User, Host FROM mysql.user;
```



# 2 DML

- Data Manipulation Language





# 3 연산자



## 3.1 =

- 동등 비교



## 3.2 <>

- 부정 비교
- 같지 않다를 비교하기 위한 연산자
- `!=` 도 같은 기능을 하는 연산자이다.
- 두 연산자 중 하나를 선택해 통일성있게 사용하자



## 3.3 !



## 3.4 AND, OR

- 



## 3.5 /, DIV, %, MOD

- `/` : 나누기
  - select 29/9; -> 3.2222
- `DIV` : 나눈 몫의 정수 부분 가져오기
  - select 29 DIV 9; -> 3
- `%` : 나눈 나머지 가져오기  
  - select 29 % 9; -> 2
- `MOD`: 나눈 나머지 가져오기
  - select 29 mod 9; -> 2
  - select mod(29,  9); -> 2



## 3.6 REGEXP

- RLIKE와 같이 문자열 값이 어떤 패턴을 만족하는지 확인하는 연산자다.
- 아래와 같이 REGEXP 좌측에 배교 대상 문자열 값을 우측에는 정규 표현식을 사용한다.
  - `SELECT 'abc' REGEXP '^[x-z]'`



# 4 내장 함수



