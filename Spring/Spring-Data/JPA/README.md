# JPA

* [JPA란?](JPA.md)



## 환경 설정

* [환경설정](Setting.md)



## 개념 정리

* [영속성 관리](Persistence-Context-Management.md)
* [엔티티 매핑](Entity-Mapping.md)
  * @Entity, @Table, @Id, @Column, @Enumerated
  * DDL 생성 기능

* [연관관계 매핑](Relationship-Mapping.md)
  * @ManyToOne, @OneToMany, @OneToOne
  * @JoinColumn
  * @Inheritance, @DiscriminatorColumn, @DiscriminatorValue
  * @MappedSuperclass

* [프록시와 연관관계 관리](Proxy-And-Relationship-Management.md)
  * 프록시, 즉시로딩, 지연로딩

* [값 타입](Value-Type.md)
* [JPQL](JPQL.md)
* [지연 로딩과 조회 성능 최적화](Lazy-Loading-And-Optimaization-Of-Inquiry.md)
  * ToOne 관계 N + 1 문제

* [컬렉션 조회 최적화](Optimized-Collection-Inquiry.md)
  * ToMany 관계 N + 1 문제

* [OSIV](OSIV.md)
* [Spring Data JPA](Spring-Data-JPA.md)
  * JpaRepository, 쿼리 메소드, @Query, 페이징, 벌크 수정 쿼리, @EntityGraph, JPA hint/lock, 네이티브 쿼리
  * 사용자 정의 리포지토리, JPA Auditing, Web 확장
* [Querydsl](Spring/Spring-Data/JPA/Querydsl/README.md)
* [락](Lock.md)
  * Silent Data Loss, Optimistic Lock, Pessimistic Lock, @Version




## 적용하기

*  [JPA Auditing](JPA-Auditing.md)
* [Annotation](Spring/Spring-Data/JPA/Annotation/Annotation.md)
* [Test](Test.md)
* [사용자 정의 리포지토리](Custom-Repository.md)
*  [Soft Delete](Soft-Delete.md)
   *  @SQLDelete, @Where, @FilterDef,  @Filter




참고

* [자바 ORM 표준 JPA 프로그래밍](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788960777330)

