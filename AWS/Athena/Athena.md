# 1 Athena

- Serverless 쿼리 서비스로 S3에 저장된 데이터를 분석하는데 사용된다.
	- S3에 저장된 데이터를 SQL을 사용하여 직접 쿼리할 수 있어 별도의 인프라스트럭처 구성이나 관리가 필요하지 않다.
- 표준 SQL 쿼리를 사용하여 Amazon S3 인벤토리 파일을 쿼리할 수 있다.

<br>

## 1.1 Redshift와 차이점

- Athena와 다르게 Redshift는 데이터를 Redshift 클러스터에 로드한 후에 쿼리를 실행해야 합니다.
- Amazon Athena는 ad-hoc 쿼리, 로그 분석, 간단한 데이터 탐색 등의 사례에 적합하다.
	- Redshift는 데이터 웨어하우징, 복잡한 데이터 분석 및 보고, BI 도구와의 통합 등의 사례에 적합하다.
<br>
