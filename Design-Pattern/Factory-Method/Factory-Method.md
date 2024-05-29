# 1 팩토리 메서드 패턴

- 팩토리 메서드 패턴은 객체를 생성하기 위한 인터페이스를 정의하지만, 어떤 클래스의 인스턴스를 생성할지에 대한 결정은 서브클래스가 내리도록 합니다.
- 이를 통해 객체 생성을 캡슐화하고, 클라이언트 코드와 실제 객체 생성 코드를 분리할 수 있습니다.

<br>

# 2 문제

- 물류 관리 앱을 개발 중이며, 현재는 트럭 운송만 지원합니다. 그런데 이후 해상 운송 기능을 추가해달라는 요청이 많이 들어왔습니다.
- 문제는 현재 코드 대부분이 `Truck` 클래스에 의존하고 있다는 것입니다. 앱에 `Ship` 클래스를 추가하려면 코드 전체를 뜯어고쳐야 합니다. 게다가 이후에 또 다른 운송 수단이 추가된다면 또 코드를 대대적으로 수정해야 할 것입니다.
- 이렇게 되면 새로운 운송 수단이 추가될 때마다 클래스를 확인하는 조건문이 곳곳에 들어가게 되어 코드가 복잡해질 것입니다.

![프로그램에 새 운송 클래스를 추가하면 문제가 발생합니다](https://refactoring.guru/images/patterns/diagrams/factory-method/problem1-ko.png?id=d54af258065966bbd1afc0329adc5ecc)

<br>

# 3 해결책

![creator(크리에이터) 클래스들의 구조](https://refactoring.guru/images/patterns/diagrams/factory-method/solution1.png?id=fc756d2af296b5b4d482e548214d08ef)

![제품 계층구조의 구조](https://refactoring.guru/images/patterns/diagrams/factory-method/solution2-ko.png?id=36e26bcbf4edb396e547573c2d56d894)

- 팩토리 메서드 패턴은 객체를 직접 생성하는 코드(`new` 연산자 사용)를 팩토리 메서드 호출로 대체할 것을 제안합니다.
- 객체는 여전히 `new`를 통해 생성되지만, 이 코드는 팩토리 메서드 안에 있게 됩니다.
- 이렇게 하면 서브클래스에서 팩토리 메서드를 오버라이드하여 객체의 생성 방식을 변경할 수 있습니다.
- 단, 서브클래스에서 생성하는 객체는 모두 공통의 인터페이스나 기본 클래스를 공유해야 합니다.
- 예를 들어, `Truck`과 `Ship` 클래스 모두 `Transport` 인터페이스를 구현하도록 합니다. 그리고 `Transport` 인터페이스의 `deliver` 메서드를 각자 다르게 구현합니다.
- 그리고 `RoadLogistics` 클래스의 팩토리 메서드는 `Truck` 객체를 반환하고, `SeaLogistics` 클래스의 팩토리 메서드는 `Ship` 객체를 반환하도록 합니다.
- 자식 클래스들은 팩토리 메서드가 반환하는 객체들의 클래스를 변경할 수 있습니다.
- 이렇게 하면 클라이언트 코드는 `Transport` 인터페이스에만 의존하게 되므로, 구체적으로 어떤 운송 수단이 사용되는지 알 필요가 없어집니다.

<br>

# 4  구조

![팩토리 메서드 패턴 구조](https://refactoring.guru/images/patterns/diagrams/factory-method/structure.png?id=4cba0803f42517cfe8548c9bc7dc4c9b)

<br>

## 4.1 Product(제품)

- Product는 팩토리 메서드로 생성될 객체들의 공통 인터페이스를 정의합니다.
- 이 인터페이스는 Creator와 Concrete Creator에서 생성되는 모든 객체에 공통으로 적용됩니다.

<br>

## 4.2 Concrete Product(구체적인 제품)

- Concrete Product 클래스들은 Product 인터페이스를 구현합니다.
- Concrete Creator에 의해 생성되는 실제 객체들입니다.
<br>

## 4.3 Creator(생성자)

- Creator 클래스는 Product 객체를 반환하는 팩토리 메서드를 선언합니다. 이 메서드의 리턴 타입은 Product 인터페이스여야 합니다.
- Creator는 팩토리 메서드를 abstract로 선언하여 모든 하위 클래스에서 이를 구현하도록 강제할 수도 있고, 기본적인 구현을 제공할 수도 있습니다.
- Creator의 주요 책임이 제품을 생성하는 것은 아닙니다. 주로 Product와 관련된 핵심 비즈니스 로직을 포함하고 있으며, 팩토리 메서드를 통해 이 로직과 구체적인 Product 클래스를 분리하는 것이 목적입니다.

<br>

## 4.4 Concrete Creator

- Concrete Creator 클래스들은 Creator의 팩토리 메서드를 오버라이드하여 다양한 유형의 Product 객체를 반환합니다.
- 팩토리 메서드는 항상 새 인스턴스를 생성할 필요는 없습니다. 기존 객체를 반환하거나 객체를 공유하는 방식으로 구현할 수도 있습니다.

<br>

## 4.5 Client(클라이언트)

- Client는 Creator와 Product의 인터페이스에만 의존합니다.
- Creator의 팩토리 메서드를 호출하여 Product 객체를 얻습니다.
- 어떤 Concrete Creator와 Concrete Product가 사용되는지 알 필요가 없습니다.

<br>

# 5  예시 코드


![팩토리 메서드 패턴 구조 예시](https://refactoring.guru/images/patterns/diagrams/factory-method/example.png?id=67db9a5cb817913444efcb1c067c9835)

```java
// Product
interface Button {
    void render();
    void onClick();
}

// Concrete Product
class WindowsButton implements Button {
    @Override
    public void render() {
        System.out.println("Windows 스타일 버튼을 그립니다.");
    }

    @Override
    public void onClick() {
        System.out.println("Windows 버튼 클릭!");
    }
}

// Concrete Product
class WebButton implements Button {
    @Override
    public void render() {
        System.out.println("웹 스타일 버튼을 그립니다.");
    }

    @Override
    public void onClick() {
        System.out.println("웹 버튼 클릭!");
    }
}

// Creator
abstract class Dialog {
    public void renderDialog() {
        Button button = createButton();
        button.render();
    }

    public abstract Button createButton();
}

// Concrete Creator
class WindowsDialog extends Dialog {
    @Override
    public Button createButton() {
        return new WindowsButton();
    }
}

// Concrete Creator
class WebDialog extends Dialog {
    @Override
    public Button createButton() {
        return new WebButton();
    }
}

// Client
class Client {
    private Dialog dialog;

    public void setDialog(Dialog dialog) {
        this.dialog = dialog;
    }

    public void render() {
        dialog.renderDialog();
    }
}

// Usage
public class Demo {
    public static void main(String[] args) {
        Client client = new Client();

        Dialog windowsDialog = new WindowsDialog();
        Dialog webDialog = new WebDialog();

        client.setDialog(windowsDialog);
        client.render();

        client.setDialog(webDialog);
        client.render();
    }
}
```

- 이 예제에서는 Button 인터페이스가 Product 역할을 하고, WindowsButton과 WebButton이 Concrete Product입니다.
- Dialog 클래스가 Creator 역할을 하는데, createButton 메서드가 팩토리 메서드입니다. 
- WindowsDialog와 WebDialog가 Concrete Creator로써 createButton 메서드를 각자 다르게 구현하고 있습니다.
- Client 코드는 Dialog 클래스에만 의존하며, 실제로 어떤 종류의 버튼이 생성되는지 알 필요가 없습니다.

<br>
    

# 6 장단점

## 6.1 장점

- 크리에이터(Creator)와 구체적인 제품(Concrete Product) 간의 밀접한 결합을 피할 수 있습니다.
- 단일 책임 원칙을 지킬 수 있습니다. 제품 생성 코드를 한 곳에 모아둠으로써 코드를 더 깔끔하게 유지할 수 있습니다.
- 개방/폐쇄 원칙을 지킬 수 있습니다. 새로운 종류의 제품을 추가하더라도 기존 클라이언트 코드를 변경하지 않아도 됩니다.

<br>

## 6.2 단점

- 패턴을 적용하면 클래스가 많이 늘어나므로 코드가 복잡해질 수 있습니다.

<br>

# 7 다른 패턴과의 관계

- **추상 팩토리 패턴**은 종종 팩토리 메서드 패턴을 이용해 구현됩니다.
- 팩토리 메서드 패턴은 **템플릿 메서드 패턴**의 특수한 형태로 볼 수 있습니다.
- **프로토타입 패턴**은 상속 대신 델리게이션을 사용한다는 점을 제외하면 팩토리 메서드 패턴과 구조적으로 매우 유사합니다.