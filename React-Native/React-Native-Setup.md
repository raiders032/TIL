# 1 React Native Setup

* Mac OS 기준 IOS 앱 개발환경 세팅



# 2 Installing dependencies

**Node & Watchman**

```bash
$ brew install node
$ brew install watchman
```

**Xcode** 

* https://apps.apple.com/us/app/xcode/id497799835?mt=12
* Xcode를 설치하면 iOS 시뮬레이터도 자동 설치된다.

**CocoaPods**

```bash
$ sudo gem install cocoapods
```



# 3 Creating a new application

**react-native 사용**

```bash
$ npx react-native init AwesomeProject
$ npx react-native init IZreal --template react-native-template-typescript
```

**create-react-native-app 사용**

```bash
$ npx create-react-native-app
```



# 4 Running your React Native application

**react-native 사용**

```bash
# Metro 서버 시작
$ npx react-native start
# Application 시작
$ npx react-native run-ios
```

**create-react-native-app 사용**

```bash
# Metro 서버 시작
$ npm run strat
# Application 시작
$ npm run ios
```



참고

* https://reactnative.dev/docs/environment-setup
* https://github.com/expo/create-react-native-app