# 1 커맨드 패턴(Command Pattern)

- 커맨드 패턴은 요청을 객체의 형태로 캡슐화하여 사용자가 보낸 요청을 나중에 이용할 수 있도록 매서드 이름, 매개변수 등 요청에 필요한 정보를 저장 또는 로깅, 취소할 수 있게 하는 패턴입니다.

# 2 문제 상황

- 텍스트 편집기 앱을 개발 중이며, 다양한 기능을 가진 버튼들이 있는 툴바를 만들고 있다고 가정해봅시다. `Button` 클래스를 만들어 툴바의 버튼과 다이얼로그의 버튼에 사용하려 합니다.
- 문제는 각 버튼마다 실행해야 할 기능이 다르다는 것입니다.
- 이 기능들을 `Button` 클래스의 하위 클래스로 만들면 어떻게 될까요?
	- 기능별로 많은 하위 클래스가 필요하게 됩니다.
	- 기능이 중복되는 경우가 있습니다. (예를 들어 툴바의 복사 버튼과 메뉴의 복사 메뉴 등)
	- 이는 유지보수를 어렵게 만듭니다. `Button` 클래스를 변경하면 모든 하위 클래스에 영향을 미칩니다.

<br>

# 3 해결책

- 커맨드 패턴은 GUI 객체에서 비즈니스 로직을 분리할 것을 제안합니다.
- 요청을 별도의 `Command` 클래스에 캡슐화합니다.
- `Command` 클래스는 요청을 수행하는 데 필요한 정보를 모두 가지고 있습니다.
- GUI 객체는 적절한 `Command`를 생성하고, 필요한 정보(수신자 객체, 실행 메서드 이름, 매개변수 등)를 전달하는 역할만 합니다.
- 이를 위해서는 모든 `Command` 클래스가 같은 인터페이스를 구현해야 합니다. 일반적으로 이 인터페이스는 `execute`라는 단일 메서드만 가지고 있습니다.
- GUI 객체는 `Command` 인터페이스에만 의존하게 되므로, 새로운 기능을 추가하더라도 GUI 코드를 변경할 필요가 없습니다.
- 기능이 중복되는 경우에도 같은 `Command` 객체를 재사용할 수 있습니다.

<br>

# 4 구조

![[Pasted image 20240418221551.png]]

## 4.1 Invoker (호출자)

- Invoker는 요청을 시작하는 역할을 합니다.
- Invoker 클래스에는 Command 객체에 대한 참조를 저장하는 필드가 있어야 합니다.
- Invoker는 요청을 Receiver에게 직접 보내는 대신 Command 객체를 실행합니다.
- Invoker는 일반적으로 Command 객체를 생성하지 않습니다. 대신 클라이언트로부터 미리 생성된 Command 객체를 전달받습니다.

<br>

## 4.2 Command (명령)

- Command는 실행될 작업을 캡슐화하는 인터페이스입니다.
- 일반적으로 Command 인터페이스는 execute()라는 단일 메서드만 가집니다.

<br>

## 4.3 Concrete Command (구체적인 명령)

- Concrete Command는 Command 인터페이스를 구현한 실제 명령 클래스입니다.
- Concrete Command는 실제 작업을 수행하는 대신, 해당 작업을 Receiver 객체에 위임합니다.
- Concrete Command는 작업 실행에 필요한 매개변수를 필드로 가지고 있을 수 있습니다.
- 이러한 필드는 생성자를 통해서만 초기화되어야 합니다. 이를 통해 Command 객체를 불변(immutable)으로 만들 수 있습니다.
- 경우에 따라 코드 단순화를 위해 Concrete Command와 Receiver를 하나의 클래스로 합칠 수도 있습니다.

<br>

## 4.4 Receiver (수신자)

- Receiver는 실제로 작업을 수행하는 객체입니다.
- Receiver는 해당 작업과 관련된 비즈니스 로직을 가지고 있습니다.
- 거의 모든 객체가 Receiver의 역할을 할 수 있습니다.
- 대부분의 Command는 요청을 Receiver에게 전달하는 방법에 대한 세부 사항만 처리하고, 실제 작업은 Receiver가 수행합니다.

<br>

## 4.5 Client (클라이언트)

- Client는 Concrete Command 객체를 생성하고 필요한 Receiver 객체를 설정합니다.
- Client는 Command 객체의 생성자에 Receiver 인스턴스를 포함한 모든 매개변수를 전달합니다.
- 생성된 Command 객체는 하나 이상의 Invoker와 연관될 수 있습니다.
- Client는 Invoker에 Command를 설정합니다.

<br>

# 5 예시 코드 (Java)

```java
// Receiver
class TextEditor {
    private String text = "";

    public void setText(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }
}

// Command
interface Command {
    void execute();
}

// Concrete Command
class CopyCommand implements Command {
    private TextEditor textEditor;

    public CopyCommand(TextEditor textEditor) {
        this.textEditor = textEditor;
    }

    @Override
    public void execute() {
        // 클립보드에 텍스트 복사 (구현 생략)
        System.out.println("텍스트를 클립보드에 복사했습니다: " + textEditor.getText());
    }
}

class PasteCommand implements Command {
    private TextEditor textEditor;
    private String textToPaste;

    public PasteCommand(TextEditor textEditor, String textToPaste) {
        this.textEditor = textEditor;
        this.textToPaste = textToPaste;
    }

    @Override
    public void execute() {
        textEditor.setText(textEditor.getText() + textToPaste);
    }
}

// Invoker
class Button {
    private Command command;

    public Button(Command command) {
        this.command = command;
    }

    public void click() {
        command.execute();
    }
}

// Client
public class Client {
    public static void main(String[] args) {
        TextEditor textEditor = new TextEditor();
        textEditor.setText("Hello ");

        Command copyCommand = new CopyCommand(textEditor);
        Button copyButton = new Button(copyCommand);
        copyButton.click();

        Command pasteCommand = new PasteCommand(textEditor, "World!");
        Button pasteButton = new Button(pasteCommand);
        pasteButton.click();

        System.out.println("현재 텍스트: " + textEditor.getText());
    }
}
```

- `TextEditor`가 Receiver의 역할을 합니다.
- `CopyCommand`와 `PasteCommand`가 Concrete Command입니다.
- `Button`이 Invoker의 역할을 하며, `Command` 객체를 가지고 있습니다.
- `Client`는 `TextEditor`, `Command`, `Button`을 생성하고 설정합니다.

<br>

# 6 장단점

## 6.1 장점

- 요청을 호출하는 객체(Invoker)와 실제로 요청을 수행하는 객체(Receiver)를 분리할 수 있습니다. (단일 책임 원칙)
- 기존 코드를 변경하지 않고 새로운 Command를 추가할 수 있습니다. (개방/폐쇄 원칙)
- Command를 계층구조로 구성할 수 있습니다. (Composite 패턴)
- 요청을 큐에 저장하거나, 로그로 기록하거나, 실행을 취소(Undo)할 수 있습니다.

<br>

## 6.2 단점

- 코드가 복잡해질 수 있습니다. 새로운 레이어가 추가되고 많은 수의 작은 클래스들이 도입됩니다.

<br>

# 7 다른 패턴과의 관계

- **Composite 패턴**: Command를 Composite 구조로 구성할 수 있습니다. 이를 통해 일련의 간단한 Command를 복잡한 Command로 구성할 수 있습니다.
- **Memento 패턴**: Command의 상태를 저장하고 복원할 때 (예를 들어 Undo 기능을 구현할 때) Memento 패턴을 사용할 수 있습니다.
- **Prototype 패턴**: Command 객체를 복사해야 할 때 Prototype 패턴을 사용할 수 있습니다.
- **Chain of Responsibility 패턴**: 일련의 Command 객체를 Chain of Responsibility 패턴으로 구성할 수 있습니다.

커맨드 패턴은 요청을 객체로 캡슐화함으로써 요청의 실행을 매개변수화하고, 요청 대기열에 저장하고, 요청의 실행을 취소하는 등의 기능을 제공합니다. 이를 통해 요청의 발신자와 수신자를 분리하고, 시스템의 유연성과 확장성을 높일 수 있습니다.