# 1 Hook


# 2 useState

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

<br>

# 3 useEffect

- 리액트 컴포넌트가 렌더링될 때마다 특정 작업을 수행하도록 설정할 수 있는 Hook이다.
- 클래스형 컴포넌트의 `componentDidMount와` `componentDidUpdate`를 합친 형태로 봐도 무방하다.

<br>

**마운트 될 때만 실행**

- useEffect의 두 번째 파라미터로 비어 있는 배열을 넣어 주면 된다.


**특정 값이 업데이트될 때만 실행**

- useEffect의 두 번째 파라미터로 useState를 통해 관리하는 상태나 props로 전달 받은 값을 넣어주면 된다.

<br>

# 4 useReducer

- 리듀서는 현재 상태, 그리고 업데이트를 위해 필요한 정보를 담은 액션값을 전달받아 새로운 상태를 반환하는 함수다.
- 리듀서 함수에서 새로운 상태를 만들 때는 반드시 불변성을 지켜야 한다.

<br>
```javascript
import React, {useReducer} from "react";  
  
function reducer(state, action) {  
    switch (action.type) {  
        case 'INCREMENT':  
            return {value: state.value + 1}  
        case 'DECREMENT':  
            return {value: state.value - 1}  
        default:  
            return state  
    }  
}  
  
const Counter = () => {  
    const [state, dispatch] = useReducer(reducer, {value: 0});  
  
    return (  
        <div>  
            <p>                현재 카운터의 값은 {state.value} 입니다  
            </p>  
            <button onClick={() => dispatch({type: 'INCREMENT'})}>+1</button>  
            <button onClick={() => dispatch({type: 'DECREMENT'})}>-1</button>  
        </div>    )  
}  
  
export default Counter
```

<br>

# 5 useMemo

# 6 useCallback

# 7 useRef
