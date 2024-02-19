# 1 ElasticSearch

## Document

- RDB로 비유하면 record라고 할 수 있다.
- JSON 형식으로 저장된다.
- 모든 Document는 유니크한 아이디를 가지고 있다.

<br>

## Index

- RDB로 비유하면 table이라고 할 수 있다.

<br>

## TD-IDF

- Term Frequency-Inverse Document Frequency 
- 정보 검색과 텍스트 마이닝에서 문서 내의 단어의 중요도를 평가하는 통계적인 방법이다.
- TF-IDF는 두 가지 주요 컴포넌트로 구성되어 있다. 
	- Term Frequency (TF)
	- Inverse Document Frequency (IDF)
- TF-IDF 점수는 특정 단어가 문서 내에서 얼마나 중요한지를 나타낸다.
	- 단어가 문서 내에서 자주 등장하고, 전체 문서 집합에서는 드물게 등장한다면 TF-IDF 점수가 높다. 
	- 이는 해당 단어가 그 문서의 특징을 잘 나타낸다고 볼 수 있으며, 문서 분류, 군집화, 검색 등 다양한 애플리케이션에서 활용된다.

<br>

**Term Frequency (TF)**

- TF는 특정 단어가 문서 내에서 얼마나 자주 등장하는지를 측정한다.
- 특정 단어의 빈도수를 전체 단어 수로 나눈 값으로 계산할 수 있다.
	- `특정 단어의 빈도 수 / 전체 단어의 빈도 수`

<br>

**Inverse Document Frequency (IDF)**

- IDF는 전체 문서 집합에서 특정 단어가 얼마나 일반적인지를 측정한다.
- 특정 단어가 많은 문서에서 등장한다면, 그 단어는 중요도가 낮을 것이라는 가정하에 계산한다.
	- `전체 문서 수 / 특정 단어를 포함한 문서 수 + 1`

<br>

**TD-IDF**

- TD-IDF는 두 값을 곱하여 얻는다.
- `TF-IDF =TF ×IDF


