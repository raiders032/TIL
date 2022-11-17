# React

## JSX

* 



## State

* `React.useState()` 를 사용하면 배열을 리턴한다.
* 배열의 첫 번째 원소는 state이다
* 배열의 두 번째 원소는 state를 변경하는 함수이다.
* 이 함수를 통해 state를 변경하면 리렌더링된다
* 부모 컴포넌트의 state가 변하면 자식 컴포넌트 모두 다시 렌더링된다.
  * 자식 컴포넌트가 부모의 state를 props로 사용하지 않는다면 리렌더링이 불필요하다 이럴 때 `React.memo()`를 사용한다

```javascript
const [state, setState = React.useState(0)
```



## Component

* JSX를 반환하는 함수



**Component 사용 예시**

```javascript
function Hello(){
  return <h1>Hello</h1>;
}

function App(){
  return (
  	<div>
    	<Hello />
    </div>
  )
}
```



## Props

* 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달 이 데이터를 `Props`라고 한다.



## useEffect

* 컴포넌트는 state가 변경될 때 마다 모든 코드가 다시 실행된다. 
  * 이때 useEffect()를 사용해서 특정 코드를 실행시킬지 실행시키지 않을지 선택할 수 있다.
* useEffect()의 첫 번째 아규먼트의 실행시키고 싶은 함수를 전달한다.
* useEffect()의 두 번째 아규먼트의 변경을 감시할 state의 리스트를 전달한다.
  * 감시중인 state의 변경이 일어났을 때 첫 번째 아규먼트로 전달한 함수가 실행된다.



**예시**

* 빈 state 리스트를 두 번째 아규먼트로 주면 컴포넌트 실행 시 한번만 실행된다.

```javascript
useEffect(() -> {
  console.log("I run only once")
}, []);
```

* keyword라는 state가 변경될 때 마다 실행된다.

```javascript
  const [keyword, setKeyword] = useState("");
  useEffect(() => {
    console.log("I run when 'keyword changes")
  }, [keyword])
```

