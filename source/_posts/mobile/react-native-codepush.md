---
widgets:
  - position: left
    type: profile
    author: 박건태
    author_title: Eatnug
    location: Seoul/Korea
    avatar: /assets/profile.png
    follow_link: 'https://github.com/eatnug'
  - position: right
    type: toc
  - position: right
    type: recent_posts
  - position: left
    type: categories
  - position: left
    type: tags
  - position: left
    type: archives
toc: true
thumbnail: /images/react-native-codepush/cover.png
cover: /images/react-native-codepush/cover.png
title: codepush로 react-native 앱 심사 없이 업데이트 하기
tags: ['react-native', 'codepush', 'tools']
category: mobile
date: 2020-09-23
excerpt: '읽으면서 바로 따라할 수 있는 react-native codepush 핸즈 온 가이드'
---

## codepush란?

codepush는 react native 혹은 cordova 로 개발한 앱을 번거로운 심사과정 없이 바로 업데이트 할 수 있도록 해주는 서비스입니다. 네이티브 코드라는 막으로 감싸져있는 내부의 코드 번들을 원격 저장소에 업로드 해두고, 로컬 디바이스의 앱 번들과 비교해 차이가 있으면 다시 다운로드 받아 업데이트 하는 형태인 듯 합니다.

현재 ios (7+), android (4.1+), windows등의 운영체제를 지원하고 있고, react native 기준으로 `Image`, `Maview.Marker`, `PrgoressViewIOS` 등 특정 컴포넌트들은 소스가 되는 이미지를 codepush 서비스로 업데이트 할 수 있고 또 `SliderIOS`나 `Video`등 일부는 불가능하다고 하는 걸 보면 앱의 모든 부분을 완전히 업데이트 하는 것은 불가능한 듯 합니다.

허나 4달 정도 직접 사용해 본 결과 자바스크립트 번들을 통째로 업데이트 할 수 있기 때문에 네이티브 코드를 추가로 작성한다거나 하는 부분이 아니면 업데이트에서 제한을 거의 느낄 수 없었습니다.

## 세팅하기

### AppCenter CLI 설치하기

```bash
yarn global add appcenter-cli

or

npm i -g appcenter-cli
```

### Appcenter에 앱과 배포트랙 등록하기

우선 `appcenter-cli`로 로그인을 합니다.

```bash
appcenter login # 웹 브라우저가 켜지면 앱센터에 로그인해서 키를 복사한 후 커맨드라인에 붙여넣으면 됩니다.
```

이제 appcenter에 내 앱을 생성하고, 배포트랙을 설정해야합니다. 직접 appcentr 대시보드에 접속해서 진행해도 되지만, cli로는 명령어 한줄로 해결할 수 있으니 활용해봅시다.

```bash
# appname 과 os 부분을 본인 프로젝트에 맞게 수정해주셔야 합니다.
appcenter apps create -d {appname} -o {os}(Android/iOS) -p React-Native
```

실제 프로젝트에서 사용할 떄는 `appname-ios, appname-android`로 앱 두개를 등록하고 관리하는 형태로 사용하고 있습니다. 이제 각 앱마다 배포트랙을 생성해줍시다.

```bash
# 배포트랙은 말 그대로 배포를 하는 트랙입니다.
# 여러개로 설정해서 관리하는 경우도 있다고 하는데 아직 그렇게 깊게 경험해보지는 못했습니다.
# 만약 appcenter 대시보드를 이용하면 기본적으로 Staging 그리고 Production 트랙이 생성됩니다.
# 마지막에 살펴볼 배포과정에서 트랙 이름을 생략하면 Staging으로 배포를 시도합니다.
appcenter codepush deployment add -a {username/appname} {trackname}
```

이때 터미널에 배포 키가 보여집니다. 나중에 설정에 사용해야하니 복사해둡시다. 혹시나 놓쳤다면 다음 명령어로 다시 확인할 수 있습니다.

```bash
appcenter codepush deployment list -a {username/appname} -k
```

### 프로젝트에 codepush 설치하기

react native 프로젝트에 codepush 디펜던시를 추가합니다.

```
yarn add react-native-code-push
```

#### iOS Setup

1. 디펜던시 설치

react native 프로젝트 루트 디렉토리 기준으로 다음 명령어로 네이티브 디펜던시 설치를 진행합니다.

```bash
cd ios && pod install && cd ..
```

2. `AppDelegate.m` 수정

```obj-c
#import "AppDelegate.h"

#import <CodePush/CodePush.h> // codepush 헤더 추가

#import <React/RCTBridge.h>
...
```

3. source URL 수정하기

```obj-c
return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];    <!-- turn this into next line -->
return [CodePush bundleURL];
```

이때 `bundleURL`은 앱의 JSBundle이 `main.jsbundle`이라는 이름을 가지는 것을 기준으로 하기 때문에, 만약 번들 이름이 어떤 이유로 변경되어있다면 `bundleURLForResource:` 혹은 `bundleURLForResource:withExtension:`등을 호출해야 합니다.

특별한 경우가 아니라면 `sourceURLForBridge` 메소드는 다음과 같은 형태로 작성됩니다.

```obj-c
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  #if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  #else
    return [CodePush bundleURL];
  #endif
}
```

4. `Info.plist`에 배포 키 추가하기.

codepush 원격 저장소의 어떤앱에 접근할지 알려주기 위해 `Info.plist`에 아까 확인했던 codepush 배포키를 `CodePushDeploymentKey` 키의 값으로 추가해주어야 합니다.

이 키는 `code-push deployment ls <appName> -k` 명령어로 다시 확인할 수 있습니다.

```plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  ...
	<key>CodePushDeploymentKey</key>
	<string>mydeploymentkey</string>
  ...
</plist>

```

5. HTTP 예외 도메인 설정 (iOS)

사실 이부분이 좀 애매했습니다. 공식문서를 읽어보고 찾아서 이해해야하는데 일단 지금 작업중인 프로젝트에서는 다음과 같은 상태이고 문제 없이 사용하고있습니다.

```xml
<plist version="1.0">
  <dict>
  ...
  <key>CodePushDeploymentKey</key>
  <string>mydeploymentkey</string>
  ...
	<key>NSAppTransportSecurity</key>
	<dict>
		<key>NSAllowsArbitraryLoads</key>
		<true/>
		<key>NSExceptionDomains</key>
		<dict>
			<key>codepush.appcenter.ms</key>
			<dict>
				<key>NSExceptionAllowsInsecureHTTPLoads</key>
				<true/>
			</dict>
			<key>localhost</key>
			<dict>
				<key>NSExceptionAllowsInsecureHTTPLoads</key>
				<true/>
			</dict>
		</dict>
	</dict>
  ...
  </dict>
</plist>
```

#### Android 셋업

1. `android/app/build.gradle`에 `codepush.gradle`를 추가합니다.

```Gradle
...
apply from: "../../node_modules/react-native/react.gradle"
apply from: "../../node_modules/react-native-code-push/android/codepush.gradle"
...
```

2. `MainApplication.java`를 업데이트합니다.

```java
...
// 1. codepush 패키지를 import 합니다.
import com.microsoft.codepush.react.CodePush;
public class MainApplication extends Application implements ReactApplication {
    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        ...
        // 2. getJSBundleFile method 를 오버라이드 합니다.
        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }
    };
}
```

3. 배포키를 `strings.xml`에 추가합니다.

아까 확인했던 그 배포키입니다.

```xml
 <resources>
     <string name="app_name">AppName</string>
     <string moduleConfig="true" name="CodePushDeploymentKey">mydeploymentkey</string>
 </resources>
```

### 실제로 프로젝트에 codepush 적용하기

codepush 세팅이 끝났으니, 실제로 내 앱이 자바스크립트 번들을 원격 저장소에서 받아와서 업데이트 할 수 있도록 코드를 작성해야 합니다. 여러가지 옵션을 설정할 수 있지만 우선 가장 간단한 형태만 알아보겠습니다.

```jsx
// 최상위 컴포넌트라고 가정합니다.
import React from 'react'
import codePush from 'react-native-code-push'

const App = () => (
  <AwesomeWrapper>
    <AwesomeContent />
  </AwesomeWrapper>
)

// 각종 codepush 관련 옵션을 설정하고
const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.IMMEDIATE,
}

// 최상위 컴포넌트를 codepush 래퍼로 감싸서 export 시키고, 해당 컴포넌트를 앱에 등록시킵니다.
export default codepush(codePushOptions)(App)
```

위의 예제는 버젼 체크를 하는 케이스와 업데이트 하는 형태를 고정해두는 형태이지만, `codepush.sync` 함수로 동적으로 트리거 할수도 있습니다. 자세한 내용은 [codepush api](https://github.com/microsoft/react-native-code-push/blob/master/docs/api-js.md)에서 확인할 수 있습니다.

### 배포하기

앱이 세팅되고, appcenter 로그인이 된 상태에서 다음 명령어로 배포할 수 있습니다. 당연한 얘기일 수 있으나, react native 프로젝트 루트 디렉토리에서 진행해야 `package.json`을 제대로 읽어서 배포를 수행할 수 있습니다.

```
appcenter codepush release-react -a {username/appname} -d {trackname}
```
