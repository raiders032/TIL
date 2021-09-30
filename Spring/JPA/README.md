# JPA

* [JPA란?](JPA란?/JPA란?.md)



## 환경 설정

* [환경설정](환경설정/환경설정.md) 



## 개념 정리

* [영속성 관리](./영속성관리/영속성관리.md)
* [엔티티 매핑](entity-mapping/entity-mapping.md)
* [연관관계 매핑](Relationship Mapping/Relationship Mapping.md)
* [프록시와 연관관계 관리](./프록시와 연관관계 관리/프록시와 연관관계 관리.md)
* [값 타입](값 타입/값 타입.md)
* [JPQL](JPQL/JPQL.md)
* [지연 로딩과 조회 성능 최적화](지연 로딩과 조회 성능 최적화/지연 로딩과 조회 성능 최적화.md)
* [컬렉션 조회 최적화](컬렉션 조회 최적화/컬렉션 조회 최적화.md)
* [Spring Data JPA](Spring Data JPA/SpringDataJPA.md)



## 적용하기

* [JPA Auditing](JPA Auditing/JPA Auditing.md)
* [Annotation](Annotation/Annotation.md) 



## 정리할 것

### 테스트

* 테스트는 케이스 격리된 환경에서 실행하고, 끝나면 데이터를 초기화하는 것이 좋다. 
* 따라서 메모리 DB를 사용하는 것이 가장 이상적이다.



**간단한 테스트를 위한 스프링 부트 설정**

* `test/resources/application.yml` 아래와 같이 작성한다.

```yml
logging.level:
    org.hibernate.SQL: debug
```

* 스프링 부트는 datasource 설정이 없으면, 기본적을 메모리 DB를 사용한다.
* driver-class도 현재 등록된 라이브러를 보고 찾아준다
* ddl-auto 도 `create-drop` 모드로 동작한다

