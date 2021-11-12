# 1 Reflection

* 리플렉션 기술을 사용하면 클래스나 메서드의 메타정보를 동적으로 획득하고, 코드도 동적으로 호출할 수 있다.
* `Class` 객체를 이용하면 클래스의 생성자, 필드, 메소드 정보를 알아낼 수 있다.
* `Class` 객체의 리플렉션 메소드
  * `.getDeclaredConstructors()`
    * Constructor 객체의 배열을 반환
  * `.getDeclaredFields()` 
    * Field 객체의 배열을 반환
  * `getFields()`
    * Field 객체의 배열을 반환(상속된 필드 포함)
    * 단 public 멤버만 가져옴
  * `.getDeclaredMethods():`
    * Method 객체의 배열을 반환
  * `.getMethods():`
    * Method 객체의 배열을 반환(상속된 메소드 포함)
    * 단 public 멤버만 가져옴

