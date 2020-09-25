---
widgets:
  - position: left
    type: profile
    author: Eatnug
    author_title: Have never had an avocado
    location: Seoul/Korea
    avatar: /assets/character.png
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
thumbnail: /images/storybook/cover.png
cover: /images/storybook/cover.png
title: 스토리북을 이용한 컴포넌트 개발 (1) - 시작하기
date: 2020-03-21
category: 'frontend'
tags: ['storybook', 'tools', 'react']
---

웹 프로젝트든 앱 프로젝트든 UI 개발을 하다보면 - 특히 프로젝트가 더 많이 진행될 수록 - 컴포넌트 하나만 따로 떼어서 이 컴포넌트가 제대로 동작하는지 확인하는 과정이 어려워 질 때가 있다. 좀 더 생산적인 UI 개발 환경을 구축하기 위해 스토리북을 사용해보자.

<!-- more -->

## 스토리북이란?

> Storybook is an open source tool for developing UI components in isolation for React, Vue, and Angular. It makes building stunning UIs organized and efficient.

스토리북은 UI 컴포넌트를 독립적인 환경에서 개발하기위한 도구이다. 사용자(개발자)는 스토리북을 이용해 **컴포넌트**를 어플리케이션의 다른 부분과 **독립적**으로 **렌더링**하고, **테스트**해볼 수 있게 된다. 따라서 컴포넌트의 시각적인 아웃풋을 직접 확인하며 코드를 짜는 속도도 빨라질 뿐 아니라, 디자이너와 소통하는 과정도 빨라지기 때문에 생산성 향상에 큰 도움이 된다.

## 설치하기

스토리북은 여러가지 프론트엔드 라이브러리, 프레임워크를 지원하는데, 본문에서는 CRA 기준으로 알아보겠다. 설치는 cli를 이용한 자동설치와, 직접적인 의존성 설치를 위한 수동설치로 나뉜다.

### Quick Start

`init` 명령어만 입력하면, 알아서 `package.json`을 읽어서 어떤 프론트엔드 라이브러리를 사용하고 있는지 확인한 후 의존성을 설치해준다.

```bash
npx @storybook/cli sb init
```

만약 문제가 발생한다면 어떤 환경인지 `--type` 플래그로 직접 알려주는 것도 가능하다.

```bash
npx @storybook/cli sb init --type react_scripts
# CRA로 init 한 프로젝트의 경우 react_scripts 타입을 사용해준다.
```

설치가 완료되면 `./storybook/`, `./src/.stories/` 디렉토리가 생성되고, `./storybook/main.js` 에서 스토리북 관련 설정을 할 수 있다.

```js
/* ./storybook/main.js */

module.exports = {
  stories: ['../src/**/*.stories.js'],
  // 스토리북이 읽어들일 스토리 파일들의 이름 형식을 지정한다.
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
  ],
  // addon은 잠시후에 더 알아보자.
}
```

### Slow Start

직접 의존성 설치를 해줄 수 도 있다.

```bash
yarn add -D @storybook/react
```

만일을 위해 `react, react-dom, babel-loader, @babel/core`가 설치되어있는지 확인하자. 해당 라이브러리들이 `@storybook/react`의 peerDependency이다.

설치가 완료되면 `./storybook/main.js` 파일을 만들고 스토리북 설정을 위한 내용을 작성하자.

```js
/* ./storybook/main.js */

module.exports = {
  stories: ['../src/**/*.stories.[tj]s'],
}
```

이제 `./src/stories/` 디렉토리에 실제 스토리를 작성하자. 스토리는 각 컴포넌트 별 테스트라고 생각하면 된다.

```js
/* ./src/index.stories.js */

import React from 'react'
import { Button } from '@storybook/react/demo'

export default { title: 'Button' }

export const withText = () => <Button>Hello Button</Button>

export const withEmoji = () => (
  <Button>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
)
```

이제 스토리북을 실행하기위한 스크립트를 추가하자.

```json
/* package.json */

{
    ...
    "scripts": {
        ...
        "storybook": "start-storybook"
    }
}
```

## 조금 더

실제 프로젝트를 진행할 때에는, 
## 실행하기

이제 스토리북 설치가 끝났다. 스크립트를 실행해보자.

```bash
yarn storybook
```

로컬호스트에 스토리북 서버가 올라간 것을 확인할 수 있을 것이다.

![storybook](/images/storybook/storybook.png)

다음글에서는 스토리북을 이용해 실제로 컴포넌트를 렌더링하고 테스트 하는 방법을 알아보자.

## 참고

- [Storybook Start Guide](https://storybook.js.org/docs/basics/introduction/)
