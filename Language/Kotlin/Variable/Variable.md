# 1 변수

- 자바에서는 변수를 선언할 때 타입이 앞에 온다.
- 코틀린에서는 타입 지정을 생략하는 경우가 흔하다.
- 이런 경우 `타입: 변수이름` 순서로 변수를 선언하면 타입을 생략할 경우 식과 변수 선언을 구별할 수 없다.
  - 그래서 코틀린에서는 `변수이름 : 타입` 순서로 변수를 선언한다.



# 2 변수와 변경 가능성

- 변수 선언 시 사용하는 키워드로 `val`,`var`이 있다.
- 기본적으로 `val`을 이용하고 필요한 경우에만 `var`를 이용하자.
  - 변경 불가능한 참조와 변경 불가능한 객체와 부수 효과가 없는 함수를 조합해 사용하면 코드가 함수형 코드에 가까워진다.



`val`

- 값을 뜻하는 value를 의미한다.
- 변경 불가능한 참조 변수를 저장하는 변수다.
- val로 선언된 변수는 초기화되면 재대입이 불가능하다.
- val 참조 자체는 불변이라도 참조하는 객체의 내부 값은 변경될 수 있다.



`var`

- 변수를 뜻하는 variable를 의미한다.
- 변경 가능한 참조다.
- 변수 값을 재대입할 수 있다.
- 변수의 값을 변경할 수 있디만 변수의 타입은 고정돼 바뀌지 않는다.