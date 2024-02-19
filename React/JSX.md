# 1 JSX

- JSX는 자바스크립트의 확장 문법이며 XML과 매우 비슷하게 생겼다.
- 작성된 JSX는 브라우저에서 실행되기 전에 코드가 번들링되는 과정에서 바벨을 사용하여 일반 자바스크립트 형태의 코드로 변환된다.
	- 예를 들어, `<div></div>`는 `React.createElement('div')`로 변환된다.

<br>

# 2 장점

- HTML과 유사한 문법으로 JSX는 마크업 형식으로 컴포넌트의 UI를 정의한다.
	- 이는 HTML과 매우 유사하여 웹 개발자들에게 친숙하게 느낀다.

<br>

# 3 문법

- 컴포넌트에 여러 요소가 있다면 반드시 부모 요소 하나로 감싸야한다.

```javascript
function App() {  
  return (  
    <h1>hello world1</h1>  
    <h2>hello world2</h2>  
  )  
}  
  
export default App;
```

- 위와 같은 코드를 작성하면 ERROR가 발생한다.

```
ERROR

Module build failed (from ./node_modules/babel-loader/lib/index.js): SyntaxError: .../src/App.js: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>? (6:4)
```

<br>

# 4 자바스크립트 표현

- JSX가 단순히 DOM 요소를 렌더링하는 기능만 제공하는 것이 아니다.
- JSX안에 자바스크립트 표현식을 사용할 수 있다.
	- 자바스크립트 코드를 `{}`로 감싸면 된다.
