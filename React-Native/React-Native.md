# 1 React Native



## 1.1 [Component](https://reactnative.dev/docs/components-and-apis)

### [ActivityIndicator](https://reactnative.dev/docs/activityindicator)

* 로딩 인디케이터 표시하기



### [Button](https://reactnative.dev/docs/button)

* title
* opPress



### [FlatList](https://reactnative.dev/docs/flatlist)

* ScrollView는 화면에 나오지 않는 모든 아이템을 한번에 렌더링하기 때문에 느리다
* FlatList는 화면에 보이는 아이템만 렌더링해서 성능이 더 좋다
  * 아이템의 개수를 모를 경우

**Props**

* [renderItem](https://reactnative.dev/docs/flatlist#required-renderitem)
* [data](https://reactnative.dev/docs/flatlist#required-data)
* [keyExtractor](https://reactnative.dev/docs/flatlist#keyextractor)



### [ScrollView](https://reactnative.dev/docs/scrollview)

* 



**예시**

```javascript
import {ScrollView, StyleSheet, Text, View, StatusBar} from 'react-native';

const Presenter = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        pagingEnabled
        style={styles.scrollView}>
        {ITEMS.map((itemName, index) => (
          <Item key={index} itemName={itemName}></Item>
        ))}
      </ScrollView>
    </View>
  );
};
```





### [Text](https://reactnative.dev/docs/text)

* 리액트 네이티브와 모든 텍스트는 <Text> 를 사용한다



### [TextInput](https://reactnative.dev/docs/textinput)

* [placeholder](https://reactnative.dev/docs/textinput#placeholder)
* [value](https://reactnative.dev/docs/textinput#value)
* [onChangeText](https://reactnative.dev/docs/textinput#onchangetext)



### [TouchableOpacity](https://reactnative.dev/docs/touchableopacity)

* View를 감싸서 사용한다. 
* 누르면 View가 반투명해졌다가 돌아온다



### [View](https://reactnative.dev/docs/view)

* React JS 와 다르게 <div> 대신 <View>를 사용한다
* 모든 뷰는 플렉스 컨테이너이다
* 플렉스 디렉션 기본값은 Column이다
  * 웹은 Row



### [ImageBackground](https://reactnative.dev/docs/imagebackground)

* 

**예시**

```typescript
import styled from 'styled-components/native';

const Presenter = ({itemName}: ItemProps) => {
const ImageBackground = styled.ImageBackground`
  flex: 1;
  width: ${(WINDOW_WIDTH * 7) / 10};
  height: ${(WINDOW_HEIGHT * 2) / 10};
  border-radius: 30;
  margin-bottom: 20;
  align-items: flex-start;
  justify-content: flex-end;
  padding-left: 15;
  padding-bottom: 20;
  overflow: hidden;
`;
  
const Presenter = ({itemName}: ItemProps) => {
  return (
    <ImageBackground source={imageSrc} resizeMode="cover">
      <Text>{itemName}</Text>
    </ImageBackground>
  );
};
```

![image-20220122230945651](/Users/YT/Library/Application Support/typora-user-images/image-20220122230945651.png)



## 1.2 [API](https://reactnative.dev/docs/accessibilityinfo)

### [Alert](https://reactnative.dev/docs/alert)

* 경고 창 표시



### [Dimensions](https://reactnative.dev/docs/dimensions)

* 디바이스의 가로 세로 길이 얻을 수 있다.



### [Platform](https://reactnative.dev/docs/platform)

* 디바이스 플랫폼의 정보를 가져올 수 있다
* 디바이스의 운영체제 정보 가져오기
  * `android`, `ios`, `macos`, `web`, `windows`



### [StyleSheet](https://reactnative.dev/docs/stylesheet)

* StyleSheet.create()
* styles 오브젝트를 따로 만들어 관리할 수 있고 자동완성 기능까지 제공한다.

```javascript
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello!!!!!!!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
    fontSize: 28,
  }
});

```



### [useColorScheme](https://reactnative.dev/docs/usecolorscheme)

* 라이트 모드 다크 모드 적용하기



**예시**

```javascript
mport Movies from "../screens/Movies";
import Tv from "../screens/Tv";
import Search from "../screens/Search";
import { useColorScheme } from "react-native";
import { BLACK_COLOR, DARK_GREY, LIGHT_GREY, YELLOW_COLOR } from "../colors";

const Tab = createBottomTabNavigator();
const Tabs = () => {
  const isDark = useColorScheme() === "dark";
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDark ? BLACK_COLOR : "white",
        },
        tabBarActiveTintColor: isDark ? YELLOW_COLOR : BLACK_COLOR,
        tabBarInactiveTintColor: isDark ? DARK_GREY : LIGHT_GREY,
        headerStyle: {
          backgroundColor: isDark ? BLACK_COLOR : "white",
        },
        headerTitleStyle: {
          color: isDark ? "white" : BLACK_COLOR,
        },
      }}
    >
      <Tab.Screen name="Movies" component={Movies} />
      <Tab.Screen name="Tv" component={Tv} />
      <Tab.Screen name="Search" component={Search} />
    </Tab.Navigator>
  );
};

export default Tabs;

```





# 2 Expo

![image-20220114093816051](/Users/YT/Library/Application Support/typora-user-images/image-20220114093816051.png)

* 시뮬레이터나 Java, Xcode 없이 코드를 테스트해 볼 수 있다.
* 미리 컴파일된 앱으로 작성한 코드를 보내 실행할 수 있다



**설치**

```bash
$ npm install --global expo-cli
$ brew update
$ brew install watchman
```



**프로젝트 생성**

```bash
$ expo init projectName --npm
```



Pakage

* expo-status-bar
* expo-location



## 2.1 Component

### [StatusBar](https://docs.expo.dev/versions/v44.0.0/sdk/status-bar/)

```bash
$ expo install expo-status-bar
```



### [AppLoading](https://docs.expo.dev/versions/v44.0.0/sdk/app-loading/)

* 애플리케이션 시작 전 API로 데이터를 미리 받아오거나 폰트를 받아오거나 준비를 할 때 사용한다.
* AppLoading이 렌더링되면 화면에는 splash screen이 나온다
* 로딩시 에셋을 로딩하는 일만 한다면 Asset, Font 훅을 사용하는 것이 편리하다
* API 호출 등 에셋 로딩 외에 로직이 필요한 경우 startAsync, onFinish 프롭을 사용한다

```bash
$ expo install expo-app-loading
```



**예시**

```javascript
import AppLoading from "expo-app-loading";
import React, { useState } from "react";
import { Text } from "react-native";

export default function App() {
  const [ready, setReady] = useState(false);
  const onFinish = () => setReady(true);
  const startLoading = async () => {};
  if (!ready) {
    return (
      <AppLoading
        startAsync={startLoading}
        onFinish={onFinish}
        onError={console.error}
      />
    );
  }
  return <Text>We are done loading!</Text>;
}
```

```javascript
import AppLoading from "expo-app-loading";
import React, { useState } from "react";
import * as Font from "expo-font";
import { Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";

export default function App() {
  const [ready, setReady] = useState(false);
  const onFinish = () => setReady(true);
  const startLoading = async () => {
    await Font.loadAsync(Ionicons.font);
    await Asset.loadAsync(require("./my-face.jpeg"));
    await Image.prefetch("https://reactnative.dev/img/oss_logo.png");
  };
  if (!ready) {
    return (
      <AppLoading
        startAsync={startLoading}
        onFinish={onFinish}
        onError={console.error}
      />
    );
  }
  return <Text>We are done loading!</Text>;
}
```



## 2.2 API

### [Location](https://docs.expo.dev/versions/v44.0.0/sdk/location/)

```bash
$ expo install expo-location
```



### [AsyncStorage](https://docs.expo.dev/versions/v44.0.0/sdk/async-storage/)

```bash
$ expo install @react-native-async-storage/async-storage
```



### [Asset](https://docs.expo.dev/versions/v44.0.0/sdk/asset/)

```bash
$ expo install expo-asset
```

* 로컬 파일 시스템에 있는 이미지, 폰트, 사운드 등의 파일을 읽어올 수 있다
* 로컬 파일 시스템에 존재하지 않는 파일을 읽어 오기 위해선 react native의 Image 컴포넌트의 prefetch() 메소드를 이용한다.
  * 파일을 로컬 파일 시스템에 저장해서 Asset을 사용하는 편이 좋다

**예시**

```javascript
import AppLoading from "expo-app-loading";
import React, { useState } from "react";
import { Text, Image } from "react-native";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { Ionicons } from "@expo/vector-icons";


export default function App() {
  const [ready, setReady] = useState(false);
  const onFinish = () => setReady(true);
  const startLoading = async () => {
    await Font.loadAsync(Ionicons.font);
    await Asset.loadAsync(require("./my-face.jpeg"))
    await Image.prefetch("https://reactnative.dev/img/oss_logo.png")
  };
  
  if (!ready) {
    return (
      <AppLoading
        startAsync={startLoading}
        onFinish={onFinish}
        onError={console.error}
      />
    );
  }
  return <Text>We are done loading!</Text>;
}
```



### [Font](https://docs.expo.dev/versions/v44.0.0/sdk/font/)

```bash
$ expo install expo-font
```



**예시**

```javascript
import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as Font from 'expo-font';

export default class App extends React.Component {
  state = {
    fontsLoaded: false,
  };

  async loadFonts() {
    await Font.loadAsync({
      // Load a font `Montserrat` from a static resource
      Montserrat: require('./assets/fonts/Montserrat.ttf'),

      // Any string can be used as the fontFamily name. Here we use an object to provide more control
      'Montserrat-SemiBold': {
        uri: require('./assets/fonts/Montserrat-SemiBold.ttf'),
        display: Font.FontDisplay.FALLBACK,
      },
    });
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this.loadFonts();
  }

  render() {
    // Use the font with the fontFamily property after loading
    if (this.state.fontsLoaded) {
      return (
        <View style={styles.container}>
          <Text style={{ fontSize: 20 }}>Default Font</Text>
          <Text style={{ fontFamily: 'Montserrat', fontSize: 20 }}>Montserrat</Text>
          <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 20 }}>
            Montserrat-SemiBold
          </Text>
        </View>
      );
    } else {
      return null;
    }
  }
}
```



# 3 [React Navigation](https://reactnavigation.org/docs/getting-started)



## 3.1 install

```bash
$ npm install @react-navigation/native
```

**an Expo managed project**

```bash
$ expo install react-native-screens react-native-safe-area-context
```

**a bare React Native project**

```bash
$ npm install react-native-screens react-native-safe-area-context
```

**on a Mac and developing for iOS**

```bash
$ npx pod-install ios
```



## 3.2 [Bottom Tabs Navigator](https://reactnavigation.org/docs/bottom-tab-navigator/)



**BottomTabNavigator 생성**

```javascript
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Movies from "../screens/Movies";
import Tv from "../screens/Tv";
import Search from "../screens/Search";

const Tab = createBottomTabNavigator();

const Tabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Movies" component={Movies} />
    <Tab.Screen name="Tv" component={Tv} />
    <Tab.Screen name="Search" component={Search} />
  </Tab.Navigator>
);

export default Tabs;
```



**BottomTabNavigator 사용하기**

```javascript
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Tabs from "./navigation/Tabs";

export default function App() {
   return (
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>
  );
}
```



**Tab Bar Icon 설정**

```javascript
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Movies from "../screens/Movies";
import Tv from "../screens/Tv";
import Search from "../screens/Search";
import { useColorScheme } from "react-native";
import { BLACK_COLOR, DARK_GREY, LIGHT_GREY, YELLOW_COLOR } from "../colors";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const Tabs = () => {
  const isDark = useColorScheme() === "dark";
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDark ? BLACK_COLOR : "white",
        },
        tabBarActiveTintColor: isDark ? YELLOW_COLOR : BLACK_COLOR,
        tabBarInactiveTintColor: isDark ? DARK_GREY : LIGHT_GREY,
        headerStyle: {
          backgroundColor: isDark ? BLACK_COLOR : "white",
        },
        headerTitleStyle: {
          color: isDark ? "white" : BLACK_COLOR,
        },
        tabBarLabelStyle: {
          marginTop: -5,
          fontSize: 10,
          fontWeight: "600",
        },
      }}
    >
           <Tab.Screen
        name="Movies"
        component={Movies}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={"film-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="TV"
        component={Tv}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="tv-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={"search-outline"} color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
```



## 3.3 [Stack Navigator](https://reactnavigation.org/docs/stack-navigator)

* JavaScript로 구현됨
* 네이티브하게 구현된 Native Stack Navigator 보다 느릴 수 있다.
* Native Stack Navigator 보다 커스텀할 수 있는 부분이 많다



## 3.4 [Native Stack Navigator](https://reactnavigation.org/docs/native-stack-navigator)

* JavaScript로 구현된 것이 아니라 native API로 구현되어 Stack Navigator 보다 빠르다
* Stack Navigator 보다 커스텀할 수 있는 부분이 적다



```javascript
import React from 'react';
import {Button, SafeAreaView} from 'react-native';
import styled, {ThemeProvider} from 'styled-components/native';

import {Theme, useTheme} from './Theme/theme';

interface ContainerProps {
  theme: Theme;
  color: string;
}

const Container = styled.View<ContainerProps>`
  flex: 1;
  background-color: ${props => props.theme.colors.bg};
`;

const App = () => {
  const {theme, changeTheme} = useTheme();

  return (
    <SafeAreaView style={{flex: 1}}>
      <ThemeProvider theme={theme}>
        <Container color={'red'}>
          <Button
            title="light"
            onPress={() => {
              changeTheme('light');
            }}
          />
          <Button
            title="dark"
            onPress={() => {
              changeTheme('dark');
            }}
          />
        </Container>
      </ThemeProvider>
    </SafeAreaView>
  );
};

export default App;


```

78f821399723ec242fc941019287475f6f799ced
