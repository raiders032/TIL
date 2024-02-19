# 1 State

- 리액트에서 State는 컴포넌트 내부에서 바뀔 수 있는 값을 의미한다.
- props는 컴포넌트가 사용되는 과정에서 부모 컴포넌트가 설정하는 값이다.
	- props는 읽기 전용으로만 사용할 수 있다.
	- props를 바꾸려면 부모 컴포넌트에서 변경해야 한다.


<br>

# 2 State의 종류

- 리액트에는 두 가지 종류의 State가 있다.
- 하나는 클래스형 컴포넌트가 가지고 있는 State다.
- 다른 하나는 함수형 컴포넌트에서 useState라는 함수를 통해 사용하는 State다.

<br>

# 3 함수형 컴포넌트



## 3.1  useState 

- useState 함수는 함수형 컴포넌트에서도 가변적인 상태를 지닐 수 있게 해준다.
- useState 함수의 인자는 상태의 초기값을 넣는다.
- useState 함수를 호출하면 배열이 반환된다.
	- 첫 번째 원소: 현재 상태
	- 두 번째 원소: 상태를 바꾸는 함수
		- 이 함수를 setter라고 한다.

<br>

**예시**

```javascript
import React, {useState} from 'react'  
  
  
const Say = () => {  
    const [message, setMessage] = useState('');  
    const onClickEnter = () => setMessage('안녕하세요')  
    const onClickLeave = () => setMessage('안녕히 가세요')  
  
    return (  
        <div>  
            <button onClick={onClickEnter}>입장</button>  
            <button onClick={onClickLeave}>퇴장</button>  
            <h1>{message}</h1>  
        </div>  
    )  
}  
  
export default Say
```