# 1 styled-components

- 자바스크립트 파일 안에 스타일은 선언하는 방식이다.
- 이 방식을 CSS-in-JS라고 부른다.
- styled-components를 사용하면 자바스크립트 파일 하나에 스타일까지 작성할 수 있어 `.css `또는 `.scss `확장자를 가진 스타일 파일을 따로 만들지 않아도 된다.

<br>

## 1.1 설치

```bash
yarn add styled-components
```

<br>

# 2 사용하기

- `styled.` 뒤에 HTML 태그를 명시한다.
- 이후 CSS를 백틱으로 감싼다.

<br>

**예시**

```javascript
import styled from 'styled-components';

const Box = styled.div`
	backgroud-color: ${props => props.color};
	width: 100px;
	height: 100px
`

function App() {
	return (
		<div>
			<Box color="teal"></Box>
			<Box color="tomato"></Box>
		</div>
	)
}
```

<br>

## 2.1 전역 스타일링

- 모든 태그에 스타일을 적용하고 싶다면 createGlobalStyle을 사용하면 된다.

<br>

**예시**

```javascript
import React, {Fragment} from 'react';  
import './App.css';  
import Router from "./Router";  
import { createGlobalStyle } from 'styled-components';  
  
const GlobalStyle = createGlobalStyle` 

	body { 
		margin: 0; 
		padding: 0; 
		font-family: 'Arial', 
		sans-serif; 
		background-color: #f4f4f4; 
	} 
	
	/* 다른 전역 스타일들을 여기에 추가하세요. */ 
`; 
  
function App() {  
    return (  
        <Fragment>  
            <GlobalStyle />            
            <Router/>        
        </Fragment>    
    );  
}  
  
export default App;
```


<br>

# 3 컴포넌트 확장하기

- 이미 정의된 styled-components의 속성을 그대로 가져오고 추가적인 속성을 정의할 수 있다.

<br>

**예시**

```javascript
const Box = styled.div`
	backgroud-color: ${props => props.color};
	width: 100px;
	height: 100px
`;

const Circle = styled(Box)`
	border-radius: 50px
`;
```

- Box의 속성을 모두 가져와 border-radius를 추가한 Circle를 쉽게 생성할 수 있다.