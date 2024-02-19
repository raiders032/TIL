# 1 Recoil

- [레퍼런스](https://recoiljs.org/docs/introduction/getting-started)

<br>

## 1.1 install

```bash
$ npm install recoil
$ yarn add recoil
```

<br>

# 2 사용하기

## 2.1 RecoilRoot

- RecoilRoot의 자식 컴포넌트에서만 recoil이 관리하는 상태를 이용할 수 있다.
- 따라서 root component에 RecoilRoot를 위치 시키는 것이 좋다.

```tsx
import React from 'react';  
import {  
	RecoilRoot,  
	atom,  
	selector,  
	useRecoilState,  
	useRecoilValue,  
} from 'recoil';

function App() {  
	return (  
		<RecoilRoot>  
			<CharacterCounter />  
		</RecoilRoot>  
	); 
}
```


<br>

# 3 Atom

- recoil에서 Atom은 State를 의미한다.
- Atom의 값을 임의의 컴포넌트가 읽거나 쓸 수 있다.
- Atom의 값을 읽는 컴포넌트는 Atom을 구독한다고 말할 수 있다.
	- 따라서 Atom의 값이 변경되면 Atom을 구독하는 모든 컴포넌트가 리렌더링된다.

<br>

## 3.1 생성하기


```javascript
const textState = atom({  
	key: 'textState', // unique ID
	default: '', // default value  
});
```

- atom() 함수를 이용해서 atom을 생성할 수 있다.

<br>

## 3.2 사용하기

```tsx
function CharacterCounter() {  
return (  
	<div>  
		<TextInput />  
		<CharacterCount />  
	</div>  
	);  
}  
  
function TextInput() {  
	const [text, setText] = useRecoilState(textState);  

	const onChange = (event) => {  
		setText(event.target.value);  
	};  
	  
	return (  
		<div>  
			<input type="text" value={text} onChange={onChange} /> 
			<br />  
			Echo: {text}  
		</div>  
	);  
}
```

- atom을 사용할 때는 useRecoilState 훅을 사용한다
	- 첫 번째 반환 값은 atom의 값을 읽을 때 사용한다.
	- 두 번째 반환 값은 atom의 값을 변경할 때 사용한다.
- useRecoilState 훅을 사용하면 atom을 읽고 쓰기가 가능하다.
	- atom을 수정할 필요가 없다면 읽기 전용인 useRecoilValue 훅을 사용하자.
	- atom을 수정하기만 원한다면 useSetRecoilState 훅을 사용하자.