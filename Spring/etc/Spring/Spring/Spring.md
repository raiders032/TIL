# IoC Container



## IoC Container

* 애플리케이션 컴포넌트의 중앙 저장소

* 빈 설정 소스로 부터 빈정의를 읽어 의존 관계를 설정하고 빈 인스턴스를 생성 및 제공한다.

* 중요한 인터페이스 

  * BeanFactory
  * ApplicationContext
    * XML 또는 Java로 작성된 빈 설정 파일을 읽어 빈을 제공하는 역할을 한다.

  

## Beans

* IoC 컨테이너가 관리하는 객체
* 스코프
  * 싱글톤: 하나의 객체
  * 프로토 타입: 매번 다른 객체
* 라이프 사이클 인터페이스를 사용할 수 있다.



## Configuration Metadata

* 빈 설정 파일
* IoC Container는 Configuration Metadata를 읽고 요구대로 빈을 설정하고 만들어서 제공한다.
* XML configuration 와 Java configuration이 있으며 많은 개발자들이 Java configuration을 선호한다.
* 초기 XML로 작성해서 빈을 만들고 직접 주입하는 과정이 번거로워 컴포넌트 애노테이션과 함께 component scan을 사용한다.

