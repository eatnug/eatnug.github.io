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
thumbnail: /assets/thumbnail.png
cover: /assets/cover.png
title: 번역] 타입스크립트 프로젝트에서 eslint와 prettier 사용하기
tags: ['typescript', 'eslint', 'prettier', 'tools']
category: etc
date: 2020-04-19
excerpt: '타입스크립트 환경에서 prettier와 eslint를 사용해보자.'
---

> Robert Cooper의 ['Using ESLint and Prettier in a TypeScript Project'](https://www.robertcooper.me/using-eslint-and-prettier-in-a-typescript-project)를 저작자의 허가를 받고 번역한 글입니다.

타입스크립트 코드를 린트 하고 싶을때 고려할 수 있는 선택지가 크게 두가지 있는데, [TSLint](https://palantir.github.io/tslint/)와 [ESLint](https://eslint.org/)이다. TSLint는 타입스크립트 전용 린터이고, ESLint는 자바스크립트와 타입스크립트 모두를 지원한다.

타입스크립트 코어 팀은 [TypeScript 2019 Roadmap](https://github.com/Microsoft/TypeScript/issues/29288#developer-productivity-tools-and-integration)에서 **_'TSLint보다 ESLint의 아키텍쳐가 성능면에서 우월하므로, 앞으로는 타입스크립트를 위한 린터 통합 제공에 있어서 ESLint에만 집중하겠다`_**라고 설명했다. 이러한 이유로 나는 타입스크립트 프로젝트에서 린트를 사용할 때 ESLint를 사용하기를 추천한다.

## ESLint를 타입스크립트와 함께 쓸 수 있도록 세팅하기

우선 ESLint 사용을 위해 필요한 개발의존성을 설치한다.

```bash
yarn add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

> 저자 주: 만약 `create-react-app` 으로 프로젝트를 시작했다면, `eslint`는 `react-scripts`에 의해 이미 의존성에 추가되어서, 따로 다시 설치할 필요가 없다.

- [eslint](https://www.npmjs.com/package/eslint): 핵심 ESLint 라이브러리
- [@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser): ESLint가 타입스크립트 코드를 린트 할 수 있도록 해주는 파서
- [@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin): 타입스크립트를 타겟으로 하는 ESLint 규칙들을 포함하고 있는 플러그인

다음으로, `.eslintrc.js` 설정 파일을 프로젝트 루트 디렉토리에 만든다. 타입스크립트 프로젝트를 위한 설정파일의 예시는 다음과 같다.

```js
/* .eslintrc.js */
module.exports = {
  parser: '@typescript-eslint/parser', // ESLint 파서를 지정한다.
  extends: [
    'plugin:@typescript-eslint/recommended', // @typescript-eslint/eslint-plugin 규칙을 사용한다.
  ],
  rules: {
    // ESLint 규칙을 작성한다. 앞서 extend 한 규칙들을 덮어쓸 수 도 있다.
    // 예시 "@typescript-eslint/explicit-function-return-type": "off",
  },
}
```

> 저자 주: 나는 `.eslintrc` 파일을 `.js` 확장자로 선언하는 것을 선호하는데, `.json` 파일은 필요할 때 규칙에 대한 주석을 달 수 없기 때문이다.

만약 타입스크립트와 함께 리액트를 사용한다면, [`eslint-plugin-react`](https://www.npmjs.com/package/eslint-plugin-react)도 설치되어야 하고, 설정 파일은 다음과 같이 작성할 수 있다.

```js
/* .eslintrc.js */
module.exports = {
  parser: '@typescript-eslint/parser', // ESLint 파서를 지정한다.
  extends: [
    'plugin:react/recommended', // @eslint-plugin-react 의 규칙을 사용한다.
    'plugin:@typescript-eslint/recommended', // @typescript-eslint/eslint-plugin 의 규칙을 사용한다.
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // jsx의 파싱을 허용한다.
    },
  },
  rules: {
    // ESLint 규칙을 작성한다. extends 한 규칙들을 덮어쓸 수 도 있다.
    // 예시 "@typescript-eslint/explicit-function-return-type": "off",
  },
  settings: {
    react: {
      version: 'detect', // eslint-plugin-react에게 사용하고 있는 리액트의 버전을 알아서 탐지하도록 한다.
    },
  },
}
```

궁극적으로 `.eslintrc.js` 파일의 `rules` 객체에 어떤 규칙을 사용하고, 어디에서 규칙을 `extend`할 것 인지는 당신의 자유이다.

## Prettier 까지 추가하기

코드를 포매팅해주는 도구인 [prettier](https://prettier.io/)는 ESLint와 조합이 아주 좋다. prettier를 ESLint와 함께 사용하기 위해서는 다음과 같은 개발의존성들을 설치해야한다.

```bash
yarn add -D prettier eslint-config-prettier eslint-plugin-prettier
```

- [prettier](https://www.npmjs.com/package/prettier): 핵심 prettier 라이브러리
- [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier): prettier와 충돌할 수 있는 ESLint 규칙을 비활성화 해주는 도구
- [eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier): prettier를 ESLint의 규칙으로 사용하기 위한 도구

prettier를 설정하기 위해서, `.prettierrc.js` 파일을 프로젝트 루트 디렉토리에 만들어야 한다. 예시는 다음과 같다.

```js
/* .prettierrc.js */
module.exports = {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 4,
}
```

다음으로 `.eslintrc.js` 파일을 수정해야한다.

```js
/* .eslintrc.js */
module.exports = {
  parser: '@typescript-eslint/parser', // ESLint 파서를 지정한다.
  extends: [
    'plugin:react/recommended',
    // @eslint-plugin-react의 규칙을 사용한다.
    'plugin:@typescript-eslint/recommended',
    // @typescript-eslint/ eslint-plugin의 규칙을 사용한다.
    'prettier/@typescript-eslint',
    // eslint-config-prettier를 사용해서 @typescript-eslint/eslint-plugin의 규칙들 중 prettier와 충돌하는 규칙을 비활성화한다.
    'plugin:prettier/recommended',
    // eslint-plugin-prettier와 eslint-config-prettier를 활성화한다. prettier 에러를 eslint 에러로 표시해 줄 것이다. 이 설정은 반드시 extends 배열의 마지막 값이어야 한다.
  ],
  parserOptions: {
    ecmaVersion: 2018, // 모던 ES의 파싱을 허용한다.
    sourceType: 'module', // import의 사용을 허용한다.
  },
}
```

> 저자 주: `plugin:prettier/recommended`는 반드시 `extends` 배열의 마지막 값이어야 한다.

`eslint-plugin-prettier`를 사용해 prettier를 ESLint의 규칙으로 설정해두면, `--fix` 옵션을 걸고 ESLint를 실행할때 린트 에러 뿐 아니라 prettier 에러까지 수정해주기 때문에 자동으로 포매팅이 된다.

## VS Code에서 자동으로 코드 수정하기

좋은 개발 경험을 위해서는, 코드를 저장할때마다 ESLint의 자동수정(`eslint --fix`와 같은) 커맨드를 실행하도록 설정해두는게 좋다. 나는 VS Code를 사용하고, VS Code에서 파일을 저장할 때마다 자동수정을 실행하기 위해서는 VS Code의 설정파일인 `settings.json`에 다음과 같은 내용을 작성하면 된다.

```json
/* settings.json (vscode 세팅파일) */
{
  "eslint.autoFixOnSave": true,
  // 위 설정 값은 deprecate 되었다, 대신 editor.codeActionsOnSave를 사용하자.
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    { "language": "typescript", "autoFix": true },
    { "language": "typescriptreact", "autoFix": true },
    // 역자 주: autoFix 설정을 true로 세팅한다면 다음과 같이 일반적인 문자열로 작성해도 된다.
    "typescript",
    "typescriptreact"
  ]
}
```

만약 `editor.formatOnSave` 옵션도 `true`로 설정했다면, 자바스크립트 또는 타입스크립트 파일을 저장할 때 포매팅이 두번 실행되지 않도록 다음과 같은 설정을 추가해야한다.

```json
/* settings.json (vscode 세팅파일) */
{
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.formatOnSave": false
  },
  "[javascriptreact]": {
    "editor.formatOnSave": false
  },
  "[typescript]": {
    "editor.formatOnSave": false
  },
  "[typescriptreact]": {
    "editor.formatOnSave": false
  }
}
```

## 커맨드라인 인터페이스(CLI)로 ESLint 실행하기

프로젝트의 모든 코드가 컴파일러 세팅이나 포매팅, 스타일 규칙에 어긋나지 않도록 확인해주는 `lint` 커맨드는 `package.json`의 [scripts](https://docs.npmjs.com/misc/scripts) 에 추가해두면 매우 유용하다.

```json
/* package.json */
{
  "scripts": {
    "lint": "tsc --noEmit && eslint '*/**/*.{js,ts,tsx}' --quiet --fix"
  }
}
```

위 스크립트는 커맨드라인에서 `npm run lint` 또는 `yarn lint`를 입력하면 실행된다. 이 커맨드는 먼저 타입스크립트 컴파일러를 실행하고, 타입스크립트 에러가 있으면 보고한다. 만약 에러가 없다면 그다음 모든 `.js`, `.ts`, `.tsx` 파일에 대해 ESLint를 실행한다. 자동수정으로 수정될 수 있는 에러들은 수정되고 남은 에러가 있다면 터미널 창에 출력된다.

- [타입스크립트 CLI 옵션](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [ESLint CLI 옵션](https://eslint.org/docs/user-guide/command-line-interface)

## ESLint 에러와 포매팅 에러가 커밋되지 않게 방지하기

깃에 커밋되는 모든 코드를 타입스크립트, 린트, 포매팅 에러로부터 자유롭게 하고싶다면, `lint-staged` 라는 도구를 사용하면 된다. `lint-staged`는 커밋되기 위해 스테이지 된 파일들에 대해 린트를 할 수 있게 해준다. `lint-staged`를 `husky`와 함께 사용하면, 커밋이 실행되기 직전에 스테이지된 파일들을 대상으로 `lint-staged`에 명시된 린트 작업을 수행하도록 할 수 있다.(git hooks가 낯설다면 [이 글](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)을 읽어보자.)

> 역자 주: 본문에서는 `lint-staged`와 `husky`를 설치하는 과정이 나와있지 않은데 앞서 살펴 본 두 도구와 마찬가지로 `yarn add -D lint-staged husky` 커맨드로 설치할 수 있다.

`lint-stage`와 `husky`를 설정하기 위해서는 다음과 같은 내용을 `package.json`에 추가하면 된다.

```json
/* package.json */
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,ts,tsx}": ["eslint --fix", "git add"]
  }
}
```

위와 같이 설정하면 사용자가 코드를 커밋하려고 할 때 `lint-staged`명령이 실행된다. 그러면 `lint-staged`는 모든 `,js`, `.ts`, `.tsx` 파일들에 대해 ESLint를 실행한다. 자동수정이 가능한 에러들은 수정되어서 커밋 될 것이다. 만약 자동수정이 불가능한 에러가 있다면, 커밋은 중단될 것이고, 해당 에러를 직접 해결해야 다시 커밋할 수 있다.

개인적으로 나는 커밋 할 때 타입스크립트 컴파일러 에러 또한 통과시키고 싶지 않기 때문에, pre-commit 훅에 타입스크립트 에러를 체크하는 명령도 추가한다. `husky` 설정을 다음과 같이 변경하면 된다.

```json
/* package.json */
{
  "husky": {
    "hooks": {
      "pre-commit": "tsc --noEmit && lint-staged"
    }
  }
}
```

그런데 git hooks는 커밋할 때 `--no-verify`라는 [flag](https://git-scm.com/docs/git-commit#Documentation/git-commit.txt---no-verify)를 달면 생략되기 때문에, `lint-staged`와 `husky`에만 의존하는 방법은 커밋된 코드를 에러로부터 지켜내기에는 역부족이다. 그러므로 [CI](https://codeship.com/continuous-integration-essentials) 서버에서 타입스크립트와 린트 에러가 없는 것을 확인하는 다음과 같은 커맨드를 실행하는것을 추천한다.

```bash
tsc --noEmit && eslint '*/**/*.{js,ts,tsx}' --quiet
```

위 명령어에서는 `eslint` cli에 `--fix` 옵션을 넘기지 않는데, 이렇게 하면 어떤 에러든 자동으로 수정하지 않고 출력한다. 자동수정이 가능한 에러는 이미 커밋단계에서 필터링 되어있어야 하기 때문에, CI가 자동으로 코드를 수정하는 일은 일어나서는 안된다.

이렇게 ESLint와 Prettier로 타입스크립트 프로젝트를 린트하고 포매팅하는 방법을 알아보았다 😎
