# 1 Star-Schema

- 데이터 웨어하우스 스키마 중 가장 단순한 종류의 스키마인데, 한 개의 사실 테이블과 주 키 및 각 차원과 추가적인 사실들로 이루어진 스키마이다.

![[Pasted image 20231206100443.png]]

- 일반적인 관계 카디널리티는 일 대 다 또는 역으로 다 대 일입니다. “일” 쪽은 항상 차원 유형 테이블인 반면, “다” 쪽은 항상 팩트 유형 테이블입니다.
- https://learn.microsoft.com/ko-kr/power-bi/guidance/star-schema


# 2 Fact Table

- 팩트 테이블에는 두 가지 유형의 열이 있다.
	- 사실을 포함하는 열
	- 차원 테이블의 외래 키
- 일반적으로 팩트 테이블의 기본 키는 테이블을 구성하는 모든 외래 키로 구성된 복합 키다.

<br>

# 3 Dimension Table





참고

- https://www.guru99.com/ko/star-schema-in-data-warehouse-modeling.html