

## HashMap과 HashTable

*  '키에 대한 해시 값을 사용하여 값을 저장하고 조회하며, 키-값 쌍의 개수에 따라 동적으로 크기가 증가하는 associate array'라고 할 수 있다. 
  *  associate array를 지칭하는 다른 용어가 있는데, 대표적으로 Map, Dictionary, Symbol Table 등이다.
* HashMap과 HashTable은 Java의 API 이름이다. 
* HashMap과 HashTable은 Map 인터페이스를 구현하고 있기 때문에 HashMap과 HashTable이 제공하는 기능은 같다. 

**HashTable**

* HashTable이란 JDK 1.0부터 있던 Java의 API이다
* HashTable의 현재 가치는 JRE 1.0, JRE 1.1 환경을 대상으로 구현한 Java 애플리케이션이 잘 동작할 수 있도록 하위 호환성을 제공하는 것

**HashMap**

* HashMap은 Java 2에서 처음 선보인 Java Collections Framework에 속한 API다. 
* HashMap은 보조 해시 함수(Additional Hash Function)를 사용하기 때문에 보조 해시 함수를 사용하지 않는 HashTable에 비하여 해시 충돌(hash collision)이 덜 발생할 수 있어 상대으로 성능상 이점이 있다. 
* HashTable 구현에는 거의 변화가 없는 반면, HashMap은 지속적으로 개선되고 있다. 

 

참조

* https://d2.naver.com/helloworld/831311

