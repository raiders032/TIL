# 1 DOM

- Document Object Model
- 객체로 문서 구조를 표현하는 방법으로 XML이나 HTM로 작성한다.
- 웹 브라우저는 DOM을 활용하여 객체에 자바스크립트와 CSS를 적용한다.

<br>

# 2 Virtual DOM

- 리액트는 Virtual DOM을 사용해서 DOM 업데이트를 추상화해 DOM 처리 횟수를 최소화하고 효율적으로 진행한다.

<br>

**실제 과정**

1. 데이터를 업데이트하면 전체 UI를 Virtual DOM에 리렌더링한다.
2. 이전 Virtual DOM에 있었던 내용과 현재 내용을 비교한다.
3. 바뀐 부분만 실제 DOM에 적용한다.