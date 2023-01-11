# 1 Database Initialization

- [레퍼런스](https://docs.spring.io/spring-boot/docs/3.0.1/reference/htmlsingle/#howto.data-initialization)



# 2 SQL Script로 Database 초기화

- [레퍼런스](https://docs.spring.io/spring-boot/docs/3.0.1/reference/htmlsingle/#howto.data-initialization.using-basic-sql-scripts)
- 스프링 부트는 자동으로 JDBC(또는R2DBC)를 사용해 DDL scripts를 실행해 schema를 생성할 수 있다.
- root classpath에 `schema.sql` DDL 스크립트 파일을 위치시키면 자동으로 작동한다.
- root classpath에 `data.sql` 파일에 초기 값을 삽입하는 SQL을 작성한다.
- SQL database initialization은 기본적으로 엠베디드된 인메모리 데이터베이스를 사용할 때 작동한다.
  - `spring.sql.init.mode` 프로퍼티를 `always`로 설정하면 엠베디드된 메모리 데이터베이스가 아니여도 작동하도록 설정할 수 있다.



## 2.1 platform

- `schema-${platform}.sql` 또는 `data-${platform}.sql`로 파일을 작성해서 특정 dbms에 적합한 스크립트를 실행할 수 있다.
- `spring.sql.init.platform` 프로퍼티에 platform의 값을 설정할 수 있다.
  - mysql로 값을 설정하면 `schema-mysql.sql` 스크립트가 실행된다.



**주의사항**

- Script-based `DataSource` 초기화는 기본적으로 JPA `EntityManagerFactory` 빈이 생성되기 전에 수행된다.
- 따라서 Hibernate가 만들어낸 schema 위에 초기화를 진행하고 싶으면 `spring.jpa.defer-datasource-initialization` 프로퍼티를 `true`로 설정하라
- true로 설정하면 Hibernate가 초기화를 다 진행한 후 `schema.sql` 과 `data.sql`이 실행된다.





 