# 1 Annotation





# 2 메타 Annotation

- 애노테이션 클래스에도 애노테이션을 붙일 수 있다.
- 애노테이션 클래스에 적용할 수 있는 애노테이션을 메타 애노테이션이라고 한다.



## 2.1 @Target



## 2.2 @Retention

- @Retention은 해당 애노테이션이 클래스를 소스 수준에서만 유지할지 .class 파일에 저장할지, 실행 시점에 리플렉션을 사용해 접근할 수 있게 할지 지정하는 애노테이션이다.
- 자바에서는 @Retention 애노테이션은 기본적으로 .class 파일에 저장해 런타임엔 사용할 수 없다.
- 코틀린에서는 기본적으로 RUNTIME으로 지정한다.





# 3 Annotation 선언

- 애노테이션 클래스 선언은 annotaion 변경자를 class 앞에 붙이면 된다.