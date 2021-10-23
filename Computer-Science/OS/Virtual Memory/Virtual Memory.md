# Virtual Memory

> 가상 메모리라는 것은 프로세스 전체가 메모리 내에 올라오지 않더라도 실행이 가능하도록 하는 기법이다.

* 장점
  * 사용자 프로그램이 물리 메모리보다 커져도 된다.
  * 파일의 공유를 쉽게 해준다.
  * 공유 메모리 구현을 가능하게 한다.
* 단점
  * 가상 메모리를 구현하는 것이 어렵다
  * 성능이 저하될 수 있다

<img src="/Users/YT/GoogleDrive/dev/TIL2/Computer Science/OS/Virtual Memory/images/image-20210428164639910.png" alt="image-20210428164639910" style="zoom:50%;" />





## 1. Virtual Memory Space

* 프로세스가 메모리에 저장되는 논리적인 모습을 말한다.
* 아래 그림과 같이 보통 0번지에서 시작하여 연속적인 공간을 차지한다.

<img src="/Users/YT/GoogleDrive/dev/TIL2/Computer Science/OS/Virtual Memory/images/space.jpeg" alt="Virtual Memory Management Strategy" style="zoom:70%;" />



## 2. Memory Management Unit

* 물리적인 페이지 프레임을 논리적인 페이지로 사상(매핑)하는 일을 한다.



## 3. Demand Paging

<img src="/Users/YT/GoogleDrive/dev/TIL2/Computer Science/OS/Virtual Memory/images/image-20210428171717691.png" alt="image-20210428171717691" style="zoom:50%;" />

* 실행 프로그램을 디스크에서 메모리로 적재할 때 프로그램의 전부를 물리 메모리에 적재하는 것이 아니라 **필요한 페이지만을 적재하는 전략**을 `Demand Paging` 이라 한다.
* 요구 페이징을 사용하는 가상 메모리에서는 페이지들이 실행과정에서 실제로 필요해 질 때 적재된다.
* 한번도 접근되지 않은 페이지는 물리 메모리에 적재되지 않는다.
* 스왑퍼는 전체 프로세스를 관리하는 반면 페이저는 프로세스 내의 개별 페이지들을 관리하기 때문에 `Demand Paging` 과 관련해서는 스왑퍼보다는 페이저라는 용어를 사용한다.



**Demand Paging의 장점**

* I/O 양의 감소: 프로그램에서 잘 발생하지 않는 오류 상황을 처리하는 코드가 메모리에 올라가지 않아도 된다.
* Memory 사용량 감소
* 더 많은 사용자 수용: 각 사용자 프로그램이 더 작은 메모리만 차지하므로
* 응답 시간은 늘어나지 않으면서 CPU이용률과 처리율이 높아진다.



**Valid-Invalid bit**

* 어느 페이지가 메모리에 올라와 있는지 구별할 수 있도록 페이지 테이블에서 사용하는 비트
* Valid
  * 해당 페이지가 메모리에 올라와 있는 상태
* Invalid
  * 사용되지 않는 주소 영역인 경우
  * 페이지가 물리적인 메모리에 없는 경우
  * 처음에는 페이지 테이블의 모든 page entry가 Invalid로 초기화
  * 주소 변환시에 Invalid로 셋팅된 경우 Page Fault 발생



## 4. Page Fault

* 프로세스가 **메모리에 올라와 있지 않은 페이지를 접근할 때**를 `Page Fault` 라고 한다.



**Page Fault 처리 과정**

1. Invalid page에 접근하면 MMU가 trap을 발생시킨다. (Page Fault Trap)
2. Kernel mode로 변경 후 page fault handler가 호출된다.
3. 유효한 참조인지 검사한다.(잘못된 주소, 접근권한 위반)
4. 유효한 참조가 아니라면 프로세스를 중단한다.
5. 비어 있는 페이지 프레임을 가져온다. (없다면 뺏어야 한다.)
6. 요청 페이지를 디스크에서 메모리로 읽어온다
7. 디스크 입출력이 끝나기까지 이 프로세스는 CPU를 선취당하고 block상태가 된다.
8. 디스크 입출력이 끝나면 페이지 테이블에 엔트리를 기록하고 valid-Invalid bit를 valid로 세팅한다.
9. ready 큐에서 대기하다가 CPU를 할당 받는다.
10. 중단되었던 instruction을 다시 실행한다.



## 5. Page Replacement



![image-20210814125729758](/Users/YT/Library/Application Support/typora-user-images/image-20210814125729758.png)



![image-20210814125804074](/Users/YT/Library/Application Support/typora-user-images/image-20210814125804074.png)



![image-20210814125844642](/Users/YT/Library/Application Support/typora-user-images/image-20210814125844642.png)



![image-20210814130128214](/Users/YT/Library/Application Support/typora-user-images/image-20210814130128214.png)



![image-20210814130247920](/Users/YT/Library/Application Support/typora-user-images/image-20210814130247920.png)



![image-20210814130459994](/Users/YT/Library/Application Support/typora-user-images/image-20210814130459994.png)

![image-20210814130544507](/Users/YT/Library/Application Support/typora-user-images/image-20210814130544507.png)



![image-20210814131029833](/Users/YT/Library/Application Support/typora-user-images/image-20210814131029833.png)



![image-20210818160749850](/Users/YT/Library/Application Support/typora-user-images/image-20210818160749850.png)



![image-20210818161100472](/Users/YT/Library/Application Support/typora-user-images/image-20210818161100472.png)



![image-20210818161330101](/Users/YT/Library/Application Support/typora-user-images/image-20210818161330101.png)



![image-20210818161500136](/Users/YT/Library/Application Support/typora-user-images/image-20210818161500136.png)



![image-20210818161909342](/Users/YT/Library/Application Support/typora-user-images/image-20210818161909342.png)



![image-20210818163148138](/Users/YT/Library/Application Support/typora-user-images/image-20210818163148138.png)
