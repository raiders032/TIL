# 1 React Router


## 1.1 설치

```bash
yarn add react-router-dom
```

<br>

## 1.2 단점

- 브라우저에서 자바스크립트를 사용하여 라우팅을 관리하면 자바스크립트를 실행하지 않는 일반 크롤러에서는 페이지의 정보를 제대로 수집하지 못하는 단점이 있다.

<br>

# 2 Components


## `<BrowserRouter>`

- [레퍼런스](https://reactrouter.com/en/main/router-components/browser-router)


## `<Switch>`

- [레퍼런스](https://v5.reactrouter.com/web/api/Switch)
- 6버전에서 사라짐
- Switch는 여러 자식 컴포넌트 중 하나만 렌더링 하는 기능을 제공한다.




## `<Route>`

- 

##  `<Link>`

- `<Link>` 컴포넌트는 클릭하면 다른 주소로 이동시켜 주는 컴포넌트다.
- 일반 웹 애플리케이션은 a 태그를 사용하지만 리액트 라우터를 사용할 때는 이 태그를 직접 사용하면 안된다.
	- 페이지를 새로 불러오기 때문에 애플리케이션이 들고 있는 상태를 모두 날려 버린다.
	- 렌더링된 컴포넌트도 다 사리지고 다시 처음부터 렌더링한다.
- `<Link>` 컴포넌트은 a 태그로 이루어져 있지만 페이지 전환을 방지하는 기능이 내장되어 있다.

<br>

# 3 Hook

## 3.1 useParam

- [레퍼런스](https://reactrouter.com/en/main/hooks/use-params)
- React Router에서 제공하는 훅 중 하나로 URL의 일부분을 변수로 사용할 수 있게 해준다.

<br>

**예시**

```javascript
import * as React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';

function ProfilePage() {
  // Get the userId param from the URL.
  let { userId } = useParams();
  // ...
}

function App() {
  return (
    <Routes>
      <Route path="users">
        <Route path=":userId" element={<ProfilePage />} />
        <Route path="me" element={...} />
      </Route>
    </Routes>
  );
}
```

- useParams을 사용하면 키 밸류 쌍으로 이루어진 객체를 반환한다.
- 객체의 내용으로 현재 URL의 파라미터들이 들어있다.

<br>

## 3.2 `useLocation`

- [레퍼런스](https://reactrouter.com/en/main/hooks/use-location#uselocation)
- useLocation을 사용하면 현재 location 오브젝트를 반환한다.
- location 오브젝트는 아래와 같은 속성을 가지고 있다.
	- pathname: 현재 URL의 경로 이름 (예: '/about')
	- search: 쿼리 문자열 (예: '?name=john')
	- hash: URL의 해시 부분 (예: '#section1')