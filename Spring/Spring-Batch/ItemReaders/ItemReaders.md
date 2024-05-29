# 1 ItemReader

- ItemReader는 다양한 소스(데이터베이스, 파일, XML 등)로부터 데이터를 읽어오는 역할을 담당합니다.
- 스프링 배치는 다양한 유형의 데이터 소스에 대응하는 ItemReader 구현체를 제공하며, 필요에 따라 커스텀 ItemReader를 개발할 수도 있습니다.
- 대표적인 ItemReader 구현체로는 Cursor 기반과 Paging 기반이 있습니다.
	- Cursor 기반은 데이터를 순차적으로 읽어오며, 읽어온 데이터는 메모리에 저장되지 않습니다. 
	- Paging 기반은 데이터를 페이지 단위로 나누어 읽어오며, 페이지 단위로 메모리에 로드됩니다.
- Cursor 기반은 대량의 데이터를 처리할 때 메모리 사용량을 최소화할 수 있지만, 페이징에 비해 성능이 느릴 수 있습니다
- Paging 기반은 페이지 단위로 데이터를 처리하므로 성능이 빠르지만, 페이지 크기에 따라 메모리 사용량이 증가할 수 있습니다.

<br>

# 2 Cursor 기반 ItemReader

- Cursor 기반 ItemReader는 데이터베이스의 Cursor를 사용하여 데이터를 읽어옵니다.
- Cursor를 사용하면 데이터를 순차적으로 읽어올 수 있으며, 읽어온 데이터는 메모리에 저장되지 않습니다.
- 대표적인 Cursor 기반 ItemReader 구현체로는 JdbcCursorItemReader, HibernateCursorItemReader, StoredProcedureItemReader 등이 있습니다.

<br>

**구현체**

- JdbcCursorItemReader
	- JDBC의 Cursor를 사용하여 데이터를 읽어오며, 쿼리 결과를 RowMapper를 통해 객체로 매핑합니다.
		- 데이터베이스에서 Cursor는 쿼리 결과 집합을 순회하기 위한 포인터와 같은 개념입니다.
		- Cursor를 사용하면 결과 집합을 한 번에 메모리에 로드하는 것이 아니라, 현재 위치를 가리키는 포인터를 이동하며 데이터에 순차적으로 액세스할 수 있습니다.
	- Cursor는 하나의 Connection으로 Batch가 끝날때까지 사용되기 때문에 Batch가 끝나기전에 Database와 어플리케이션의 Connection이 먼저 끊어질수 있습니다.

<br>

# 3 Paging 기반 ItemReader

- Paging 기반 ItemReader는 데이터베이스의 페이징 기능을 사용하여 데이터를 일정 크기로 나누어 읽어옵니다.
- 페이징을 사용하면 대량의 데이터를 한 번에 메모리에 로드하지 않고, 일정 크기로 나누어 처리할 수 있습니다.
- 대표적인 Paging 기반 ItemReader 구현체로는 JdbcPagingItemReader, HibernatePagingItemReader, JpaPagingItemReader 등이 있습니다.

<br>

**구현체**

- JdbcPagingItemReader
	- 