# Deadlock

* 일련의 프로세스들이 서로 가진 자원을 기다리며 bolck된 상태
* Recource
  * 하드웨어, 소프트웨어 등을 포함하는 개념
  * 예시) I/O device, memory space, semaphore



## 1. Deadlock 발생 조건

* Deadlock이 발생하려면 아래 4가지 조건을 모두 만족해야한다

### 1.1 Mutual Exclusion

* **매 순간 하나의 프로세스**만이 자원을 사용할 수 있다

### 1.2 No Preemption

* 프로세스는 자원을 스스로 내어놓을 뿐 **강제로 빼앗기지 않는다**

### 1.3 Hold and Wait

* 자원을 가진 프로세스가 다른 자원을 기다릴 때 보유 **자원을 놓지 않고 계속 가지고 있는다**

### 1.4 Circular Wait

* 자원을 기다리는 프로세스간에 **사이클**이 형성되어야한다



## 2. Deadlock 처리 방법

* Deadlock을 처리하난 방법에는 아래와 같이 4가지 방법이 있다
* **Deadlock Prevention, Deadlock Avoidance**는 Deadlock을 **미연에 방지**하는 방식이다
* **Deadlock Detection and revovery, Deadlock Ignorance**는 Deadlock을 방지하지 않고 Deadlock 발생 **후 처리**를 하는 방식이다



### 2.1 Deadlock Prevention

* Deadlock 발생 조건 4가지 중 어느 하나가 만족되지 않도록 하는 방법
* Deadlock Prevention 방식은 Utilization 저하, Throughtput 감소, Starvation 문제 등이 있다
* **Mutual Exclusion**
  * 공유해서는 안되는 자원의 경우 이 조건은 반드시 성립해야한다
  * 따라서 Mutual Exclusion은 배제할 수 없다
* **Hold and Wait**
  * 방법1: 프로세스 시작 시 모든 필요한 자원을 할당 받는다
  * 방법2: 자원이 필요한 경우 보유 자원을 모두 놓고 다시 요청한다
* **No Preemption**
  * 프로세스가 어떤 자원을 기다려야 하는 경우 이미 보유한 자원이 선점될 수 있다
* **Circular Wait**
  * 모든 자원 유형에 할당 순서를 정하여 정해진 순서대로만 자원을 할당한다



### 2.2 Deadlock Avoidance

* 자원 요청에 대한 부가적인 정보를 이용해서 deadlock의 가능성이 없는 경우만 자원을 할당하는 방법



### 2.3 Deadlock Detection and revovery

* Deadlock 발생은 허용하되 이를 감지하여 회복시키는 방법



### 24 Deadlock Ignorance

* Deadlock을 시스템이 책임지지 않는 방법
* Unix를 포함한 대부분의 운영체제가 이 방법을 채택했다