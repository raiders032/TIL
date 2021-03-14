## 용어 정리

### stop-the-world

* GC을 실행하기 위해 JVM이 애플리케이션 실행을 멈추는 것이다.
* stop-the-world가 발생하면 GC를 실행하는 쓰레드를 제외한 나머지 쓰레드는 모두 작업을 멈춘다. 
* GC 작업을 완료한 이후에야 중단했던 작업을 다시 시작한다. 
* 어떤 GC 알고리즘을 사용하더라도 stop-the-world는 발생한다. 
* 대개의 경우 GC 튜닝이란 이 stop-the-world 시간을 줄이는 것이다.



## 가비지 컬렉션 과정

> Java는 프로그램 코드에서 메모리를 명시적으로 지정하여 해제하지 않는다. 개발자가 프로그램 코드로 메모리를 명시적으로 해제하지 않기 때문에 가비지 컬렉터(Garbage Collector)가 더 이상 필요 없는 (쓰레기) 객체를 찾아 지우는 작업을 한다. 이 가비지 컬렉터는 두 가지 가설 하에 만들어졌다(사실 가설이라기보다는 가정 또는 전제 조건이라 표현하는 것이 맞다).
>
> - 대부분의 객체는 금방 접근 불가능 상태(unreachable)가 된다.
> - 오래된 객체에서 젊은 객체로의 참조는 아주 적게 존재한다.



## Yong Generation & Old Generation

> 가설의 장점을 최대한 살리기 위해서 HotSpot VM에서는 크게 2개로 물리적 공간을 나누었다. 둘로 나눈 공간이 Young 영역과 Old 영역이다.
>
> Young 영역(Yong Generation 영역)
>
> 새롭게 생성한 객체의 대부분이 여기에 위치한다. 대부분의 객체가 금방 접근 불가능 상태가 되기 때문에 매우 많은 객체가 Young 영역에 생성되었다가 사라진다. 이 영역에서 객체가 사라질때 Minor GC가 발생한다고 말한다.
>
> Old 영역(Old Generation 영역)
>
> 접근 불가능 상태로 되지 않아 Young 영역에서 살아남은 객체가 여기로 복사된다. 대부분 Young 영역보다 크게 할당하며, 크기가 큰 만큼 Young 영역보다 GC는 적게 발생한다. 이 영역에서 객체가 사라질 때 Major GC(혹은 Full GC)가 발생한다고 말한다.
>
> ​													GC 영역 및 데이터 흐름도
>
> ![데이터 흐름도](./images/데이터 흐름도.png)
>
> Permanent Generation 영역
>
> Method Area라고도 한다. 객체나 억류(intern)된 문자열 정보를 저장하는 곳이며, Old 영역에서 살아남은 객체가 영원히 남아 있는 곳은 절대 아니다. 이 영역에서 GC가 발생할 수도 있는데, 여기서 GC가 발생해도 Major GC의 횟수에 포함된다.

## Young 영역

Young 영역은 3개의 영역으로 나뉜다.

- Eden 영역
- Survivor 영역(2개)

Young 영역에 대한 GC 절차

1. 새로 생성한 대부분의 객체는 Eden 영역에 위치한다.
2. Eden 영역에서 GC가 한 번 발생한 후 살아남은 객체는 Survivor 영역 중 하나로 이동된다.
3. Eden 영역에서 GC가 발생하면 이미 살아남은 객체가 존재하는 Survivor 영역으로 객체가 계속 쌓인다.
4. 하나의 Survivor 영역이 가득 차게 되면 그 중에서 살아남은 객체를 다른 Survivor 영역으로 이동한다. 
5. 그리고 가득 찬 Survivor 영역은 아무 데이터도 없는 상태로 된다.
6. 이 과정을 반복하다가 계속해서 살아남아 있는 객체는 Old 영역으로 이동하게 된다.

## Old 영역

Old 영역은 기본적으로 데이터가 가득 차면 GC를 실행한다. GC 방식에 따라서 처리 절차가 달라지므로, 어떤 GC 방식이 있는지 살펴보면 이해가 쉬울 것이다. GC 방식은 JDK 7을 기준으로 5가지 방식이 있다.

- Serial GC
- Parallel GC
- Parallel Old GC(Parallel Compacting GC)
- Concurrent Mark & Sweep GC(이하 CMS)
- G1(Garbage First) GC 

> 이 중에서 운영 서버에서 절대 사용하면 안 되는 방식이 Serial GC다. Serial GC는 데스크톱의 CPU 코어가 하나만 있을 때 사용하기 위해서 만든 방식이다. Serial GC를 사용하면 애플리케이션의 성능이 많이 떨어진다.



참조

* https://d2.naver.com/helloworld/1329

