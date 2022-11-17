# 1 Spring이란?

- 스프링은 단지 IoC/DI 프레임워크라고는 말할 수 없다.
- 스프링은 단순히 IoC/DI를 편하게 적용하도록 돕는 단계를 넘어 엔터프라이즈 애플리케이션 개발의 전 영역에 걸쳐 다양한 종류의 기술에 관여한다.



# 2 Spring의 정의

- `자바 엔터프라이즈 개발을 편하게 해주는 오픈소스 경량급 애플리케이션 프레임워크`
- 정의를 봐도 감이 바로 오지 않는다.



## 2.1 애플리케이션 프레임워크

- 일반적으로 라이브러리나 프레임워크는 특정 업무 분야나 한 가지 기술에 특화된 목표를 가지고 있다.
- 예시
  - 웹 계층을 MVC 구조로 손쉽게 만들 수 있는 기술
  - 간단한 설정으로 관계형 DB와 자바 오브젝트를 매핑시켜주는 ORM 기술
- 하지만 스프링은 한 가지 기술 분야에 집중한 것이 아니라 `애플리케이션 프레임워크`라는 특징이 있다.
- 애플리케이션 프레임워크는 특정 계층이나, 기술, 업무 분야에 국한되지 않고 애플리케이션 전 영역을 포괄하는 범용적인 프레임워크를 말한다.
- 스프링을 MVC 프레임워크 또는 JDBC/ORM 지원 프레임워크로 생각하는 것은 스프링이 다루는 일부 영역만 봤기 때문이며 또 스프링을 IoC/DI 프레임워크나 AOP 툴이라고 보는 이유는 스프링이 제공하는 핵심 기술만 주목했기 때문이다.
- 스프링의 존재 목적은 핵심 기술에 담긴 프로그래밍 모델을 일관되게 적용해서 엔터프라이즈 애플리케이션 전 계층과 전 영역에 전략과 기능을 제공해줌으로서 애플리케이션을 편리하게 개발하게 해주는 애플리케이션 프레임워크다.



## 2.2 경량급

- 