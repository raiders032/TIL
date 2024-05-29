# 1 Athena

- Amazon Athena는 표준 SQL을 사용하여 Amazon Simple Storage Service(Amazon S3)에 직접 저장된 데이터를 쉽게 분석할 수 있는 대화형 쿼리 서비스입니다.
- Athena는 고객이 Amazon S3에 저장된 비구조화, 반구조화 및 구조화 데이터를 분석할 수 있도록 돕습니다.
	- 예를 들어, CSV, JSON 또는 Apache Parquet 및 Apache ORC 같은 열 기반 데이터 형식이 있습니다. 
	- 고객은 Athena를 사용하여 ANSI SQL을 사용한 ad hoc 쿼리를 실행할 수 있으며, 데이터를 Athena에 집계하거나 로드할 필요가 없습니다.
- Serverless 쿼리 서비스로 S3에 저장된 데이터를 분석하는데 사용된다.
	- S3에 저장된 데이터를 SQL을 사용하여 직접 쿼리할 수 있어 별도의 인프라스트럭처 구성이나 관리가 필요하지 않다.

<br>

## 1.1 Redshift와 차이점

- Athena와 다르게 Redshift는 데이터를 Redshift 클러스터에 로드한 후에 쿼리를 실행해야 합니다.
- Amazon Athena는 ad-hoc 쿼리, 로그 분석, 간단한 데이터 탐색 등의 사례에 적합하다.
	- Redshift는 데이터 웨어하우징, 복잡한 데이터 분석 및 보고, BI 도구와의 통합 등의 사례에 적합하다.

<br>

참고

- https://docs.aws.amazon.com/whitepapers/latest/architecting-hipaa-security-and-compliance-on-aws/amazon-athena.html