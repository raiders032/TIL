# 1 Factory Method Pattern

- new 키워드를 사용하면 구체 클래스의 인스턴스가 만들어진다.
- 인터페이스가 아닌 특정 구현을 사용하므로 이는 `특정 구현을 바탕으로 프로그래밍하지 않아야 된다`라는 원칙을 위배한다.
  - 구체 클래스를 바탕으로 코딩하면 나중에 수정해야 할 가능성이 커지고 유연성이 떨어진다.

```java
// Duck은 인터페이스 그럼에도 결국 구체 클래스의 인스턴스를 만들어야 한다.
Duck duck = new MallarDuck();
```



