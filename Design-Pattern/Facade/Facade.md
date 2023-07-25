# 1 Facade 패턴

- Facade는 어떤 서브시스템에 속한 일련의 복잡한 클래스를 단순하게 바꿔서 통합한 클래스를 만들 수 있다.
  - 서브시스템에 있는 일련의 인터페이스를 통합 인터페이스로 묶어준다.
  - Facade는 서브시스템의 기능을 사용할 수 있는 간단한 인터페이스를 제공한다.
- 퍼사드 클래스는 서브시스템 클래스를 캡슐화하지 않는다.
  - 따라서 클라이언트가 서브시스템의 특정 인터페이스가 필요하다면 서브시스템 클래스를 바로 사용할 수 있다.



> facade는 겉모양이나 외관이라는 뜻



# 2 예시

**클라이언트 코드**

```java
// 팝콘 기계를 키고 팝콘을 튀기기
popper.on();
popper.pop();

// 조명 밝기 조절
lights.dim(10);

// 스크린 내리기
screen.down();

// 프로젝터를 키고 와이드 스크린 모드로 진입
projector.on();
projector.setInput(player);
projector.wideScreenMode();

// 앰프를 키고 스프리밍 플레이어로 설정하고 서라운드 모드와 볼륨을 5로 지정
amp.on();
amp.setDvd(player);
amp.setSurroundSount();
amp.setVolume(5);

// 스트리밍 플레이어를 켜고 영화를 재생한다.
player.on();
player.paly(movie);
```

- 영화를 보기위해 필요한 작업들로 6개의 클래스를 가지고 클라이언트가 직접 작업한다.
- 클라이언트 입장에서 영화를 보기위해 알아야 할 것들이 많다.
- 이렇게 복잡한 일을 퍼사드 패턴으로 간단히 처리해보자.



**Facade**

```java
public class HomeTheaterFacade {
    private final Amplifier amp;
    private final Tuner tuner;
    private final StreamingPlayer player;
    private final Projector projector;
    private final TheaterLights lights;
    private final Screen screen;
    private final PopcornPopper popper;

    public HomeTheaterFacade(Amplifier amp, Tuner tuner, StreamingPlayer player, Projector projector, TheaterLights lights, Screen screen, PopcornPopper popper) {
        this.amp = amp;
        this.tuner = tuner;
        this.player = player;
        this.projector = projector;
        this.lights = lights;
        this.screen = screen;
        this.popper = popper;
    }

    public void watchMovie(String movie) {
        popper.on();
        popper.pop();

        lights.dim(10);

        screen.down();

        projector.on();
        projector.setInput(player);
        projector.wideScreenMode();

        amp.on();
        amp.setDvd(player);
        amp.setSurroundSount();
        amp.setVolume(5);

        player.on();
        player.paly(movie);
    }

    public void endMovie() {
        popper.off();

        lights.on();

        screen.up();

        projector.off();

        amp.off();

        player.stop();
        player.off(movie);
    }

}
```



**변경된 클라이언트 코드**

```java
HomeTheaterFacade homeTheater = new HomeTheaterFacade(amp, tuner, player, projector, screen, lights, popper);
homeTheater.watchMovie("아바타");
homeTheater.endMovie();
```

- 서브시스템에 속한 일련의 복잡한 클래스를 단순하게 바꿔서 통합한 클래스를 제공했다.
- 따라서 클라이언트 입장에서 복잡한 서브시스템을 더 편리하게 이용할 수 있다.