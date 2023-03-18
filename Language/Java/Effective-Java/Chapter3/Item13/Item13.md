# 1 Clone 재정의는 주의해서 진행하라

- Cloneable은 복제해도 되는 클래스임을 명시하는 용도의 **믹스인 인터페이스**다.
- 하지만 의도한 목적을 제대로 이루지 못했다.
- clone 메서드가 선언된 곳이 Cloneable이 아닌 Object이고 그마저도 protected로 선언되어 있다.
  - 그래서 Cloneable을 구현하는 것만으로는 외부에 객체에서 clone 메서드를 호출할 수 없다.