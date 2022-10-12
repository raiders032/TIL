# 1 POJO

- Plain Old Java Object
- POJO란 어떠한 프레임워크에 대한 의존이 없는 순수한 자바 객체를 말한다
- POJO에는 어떠한 **naming convention**도 없다



**POJO 예시**

- 아래의 POJO는 어떠한 프레임워크와의 의존성도 없어서 모든 자바 프로그램에서 사용될 수 있다

```java
public class EmployeePojo {
    public String firstName;
    public String lastName;
    private LocalDate startDate;

    public EmployeePojo(String firstName, String lastName, LocalDate startDate) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.startDate = startDate;
    }

    public String name() {
        return this.firstName + " " + this.lastName;
    }

    public LocalDate getStart() {
        return this.startDate;
    }
}
```



# 2 JavaBean

- JavaBean은 POJO가 되기 위한 조건에 몇 가지 추가적인 조건을 만족한 경우를 의미한다.
- 따라서 모든 JavaBean은 POJO이지만 모든 POJO가 JavaBean은 아니다.



**POJO가 JavaBean이 되기 위한 조건**

1. 모든 프로퍼티의 접근 지시자는 private이어야 한다.
2. 프로퍼티의 접근하기 위한 getters and setters를 오픈해야 한다.
3. 기본 생성자가 있어야한다.
4. Serializable해야 한다.



**JavaBean 예시**

- 위에서 작성한 POJO를 JavaBean 조건을 만족시키도록 변경해보자.
- 먼저 Serializable 인터페이스를 구현 직렬화가 가능하게 한다.
- 아무런 인자를 받지 않는 기본 생성자를 정의한다.
- 모든 필드를 private으로 만들고 getter와 setter를 제공한다.

```java
public class EmployeeBean implements Serializable {
  private static final long serialVersionUID = -3760445487636086034L;
  private String firstName;
  private String lastName;
  private LocalDate startDate;

  public EmployeeBean() {
  }

  public EmployeeBean(String firstName, String lastName, LocalDate startDate) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.startDate = startDate;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  //  additional getters/setters

}
```





## 1.1 JavaBean의 단점

**Mutability**

- setter를 제공하기 때문에 불변 클래스를 만들 수 없다.
- 



- Boilerplate
- *Zero-argument Constructor* 





참고

- https://www.baeldung.com/java-pojo-class
- https://www.baeldung.com/java-pojo-javabeans-dto-vo