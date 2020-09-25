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
title: GatsbyJS와 Github Pages로 블로그 만들기
date: 2019-11-18
category: 'logs'
tags: ['gatsby', 'gh-pages']
excerpt: '지금의 블로그로 옮겨오기 전, gatsby로 블로그를 만들었던 후기이다.'
---

여느 개발자들 처럼 나도 블로그를 운영하고 싶다는 생각은 오랫동안 해왔다. 하지만 내가 원하는 수준의 커스터마이징이나, 마크다운 에디터를 제공하는 기존의 플랫폼이 존재하지 않는 상황에서 블로그를 운영하기위해서는 많은 노력이 필요했다.


수 많은 도전과 실패 끝에 나는 GatsbyJS와 Github Pages를 이용하는 방법에 정착했고, 그간의 과정을 통해 배운것을 공유하며 첫 포스팅을 장식해보고자 한다.

## Github Pages ?

Github Pages 는 Github 에서 제공하는 정적 웹사이트 호스팅 서비스이다. 다시 말해 html, js, css 파일들로 구성된 정적인 파일들을 배포해주는 서비스이다. 사용법도 아주 간단하다 Github 저장소를 생성하고, 저장소 설정에서 호스팅 할 정적 웹사이트의 리소스 위치를 지정해주면 된다.

![](/images/gatsby-github-pages/create_repo.png)

우선 "username".gtihub.io 의 형식으로 이름을 짓고 저장소를 만든다.

![](/images/gatsby-github-pages/pages_setting.png)

<br>
저장소 설정에서 배포할 리소스의 위치를 지정해줄 수 있는데, 선택지는 두 가지이다. master 브랜치의 루트 디렉토리 혹은 그 아래의 docs 폴더 내부이다. 아마도 프레임워크나 라이브러리들이 프로젝트의 파일 구조를 깔끔하게 유지하면서 문서화 할 수 있도록 배려해준 듯 하다. 나는 master 브랜치에 배포를 선택했다.

이제 Github Pages를 통한 배포 준비는 끝났다고 볼 수 있다. 지정한 위치에 파일을 업로드하면 Github Pages 에서 리소스를 찾아내 배포해주는데 index.html 이나 Readme.md 파일을 엔트리 포인트로 삼기 때문에,
해당 이름을 가진 파일이 존재해야 한다.

하지만! 이는 그저 html 파일들의 연결에 불과하다. 우리는 좀 더 멋지고 힙한 블로그를 원한다. 이를 위한 도구가 바로 GatsbyJS 이다.

## GatsbyJS !

우리가 원하는 힙하고 멋진 블로그들은 그리 단순하지 않다. React 혹은 Vue 같은 프론트엔드 라이브러리를 사용할 수도 있고, 포스트를 저장하려면 데이터를 저장할 서버도 필요할 것이다. 하지만 Github Pages 는이런 복잡한 웹사이트를 배포할 수 없고, 설사 가능하더라도 이를 구현하려면 너무 많은 노력과 자원이 필요하다.

이러한 문제를 해결해 주는 것이 GatsbyJS 이다. GatsbyJS 는 우리가 원하는 복잡한 웹사이트를 Github Pages 가 배포할 수 있는 정적 웹사이트의 형태로 만들어준다. 덕분에 우리는 React와 GraphQL을 기반으로만든 복잡하고도 멋진 블로그를 Github Pages 를 통해 배포할 수 있다. 심지어 초심자를 위한 스타터 템플릿도 많이 공유되고 있다. 바로 시작해보자.

우선 gatsby-cli를 설치하자.

```bash
npm install -g gatsby-cli
```

그리고 개츠비 프로젝트를 시작하자

```bash
gatsby new "porject_name" "starter_url"
```

뒤의 `"starter_url"` 부분에 스타터 템플릿의 url을 추가하면 꽤 많은 부분이 완성된 프로젝트로 시작할 수 있다. 현재 이 블로그도 이미 만들어 진 [스타터](https://github.com/JaeYeopHan/gatsby-starter-bee)를 선택해 프로젝트를 시작했다.

```bash
cd "project_name"
git remote add origin https://github.com/"username"/"username".github.io
```

이제 GatsbyJS 폴더에 들어가서 배포하려는 저장소를 원격 저장소로 추가한다.

이때 우리의 배포 리소스 위치를 생각해보자. master 브랜치의 루트디렉토리이다. 즉 저장소의 최상위 경로에 index.html 을 포함하는 정적 웹사이트 파일이 존재해야 한다는 것이다. 하지만 현재의 프로젝트는 정적 웹사이트를 만들어내는 프로젝트이다. 이를 배포하기위해 `build` 명령어를 사용하면 `public`이라는 경로에 정적 웹사이트 파일들이 생성된다.

```bash
"project_name"/
|-- # some
|-- # files
|-- # of
|-- # GatsbyJS
|-- public
```

그렇다면 어떻게 public 폴더 내부의 파일을 배포할까? `gh-pages` 패키지와 추가적인 브랜치를 활용할 수 있다.

현재의 파일들 즉 정적 웹사이트 생성을 위한 파일들은 다른 브랜치로 옮기고, 생성된 정적 웹사이트 파일들만 master 브랜치에 저장하고 배포하자.

```bash
git branch -m dev          # dev 브랜치를 만들고 현재의 파일들을
                                      # 해당 브랜치로 이동하고 기본 브랜치로 설정한다.
npm install gh-pages --save-dev
```

현재의 파일들을 다른 브랜치로 옮기고 패키지를 설치한다. 그리고 배포를 위한 스크립트를 작성하자.

```bash
# package.json
....
  "scripts": {
      ....
    "deploy": "gatsby build && gh-pages -d public -b master"
  },
....
```

설정은 끝났다. `npm run deploy` 명령어를 실행하면 dev 브랜치에서 정적 웹사이트를 생성하고 해당 폴더를 master 브랜치에 푸시해 배포가 시작된다.

이렇게 GatsbyJS 와 Github Pages 를 사용한 블로그가 만들어졌다. 이제 포스팅만 하면 된다! 👏👏👏

## 참고

- [GatsbyJS](https://www.gatsbyjs.org/)
- [Gatsby 로 Blog 만들기](https://medium.com/@pks2974/gatsby-%EB%A1%9C-blog-%EB%A7%8C%EB%93%A4%EA%B8%B0-ac3eed48e068)
- [Gasby로 github 블로그(github page) 구축하기](https://blog.naver.com/PostView.nhn?blogId=lyshyn&logNo=221527017383&parentCategoryNo=&categoryNo=86&viewDate=&isShowPopularPosts=true&from=search)
