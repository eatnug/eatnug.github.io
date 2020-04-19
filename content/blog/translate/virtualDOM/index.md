---
title: 번역] Virtual DOM 이해하기
date: 2019-11-19
category: 'Translated'
tags: ['dom']
---

> 본 글은 virtual DOM에 관한 [Ire Aderinokun](https://ireaderinokun.com/) 글을 번역한 것 입니다. 이해를 돕기위한 의역이 존재합니다.

나는 최근 [DOM](https://bitsofco.de/what-exactly-is-the-dom/) 과 [shadow DOM](https://bitsofco.de/what-is-the-shadow-dom/) 이 정확이 무엇이고 그들이 어떻게 다른지에 대한 글을 썼다. 요약하자면 Document Object Model은 HTML 문서에 대한 객체 기반 표현 그리고 그 객체를 조작하기 위한 인터페이스를 의미한다. Shadow DOM은 DOM의 '가벼운' 버젼이라고 생각할 수 있다. 이 또한 HTML 엘리먼트에 대한 객체 기반 표현이지만 완전히 독립적인 문서는 아니다. 대신에 shadow DOM은 DOM을 더 작고 캡슐화 된 부분들로 나누어 여러 HTML 문서에 걸쳐 사용할 수 있게 해준다.

아마 'virtual DOM' 이라는 이와 유사한 용어를 본 적이 있을 것이다. 사실 그 개념은 수 년간 존재해왔지만 React 프레임워크(역자 주: 리액트는 프레임워크라기 보다는 라이브러리에 가깝지만 원작자의 표현을 존중한다. 후술할 프레임워크도 같은 맥락에서 살려둔다.)에서 사용되었다는 점 때문에 유명해졌다. 이 글에서는 virtual DOM이 정확히 무엇이고, 이것이 기존의 DOM과 어떻게 다르며, 어떻게 사용되는지에 대해 알아
볼 것이다.

## 왜 virtual DOM이 필요한가?

virtual DOM이라는 개념이 왜 떠오르고 있는지 이해하기 위해서 먼저 기존의 DOM을 다시 살펴보자. 앞서 언급한대로, DOM은 두 부분으로 구성된다 - HTML 문서에 대한 객체 기반 표현 그리고 이 객체를 조작하기 위한 API.

예를 들어 `<ul>`과 `<li>`로 이루어진 간단한 HTML 문서를 살펴보자.

```html
<!DOCTYPE html>
<html lang="en">
  <head></head>
  <body>
    <ul class="list">
      <li class="list__item">List item</li>
    </ul>
  </body>
</html>
```

이 문서는 다음의 DOM tree로 표현될 수 있다.

![](./domTree.png)

첫번째 `<li>`의 내용을 `"List item one"`으로 수정하고 `<li>`를 하나 더 추가하고 싶다고 생각해보자. 우선 DOM API를 이용해 우리가 업데이트 하고 싶은 엘리먼트를 찾는다. 그리고 추가 할 새로운 엘리먼트를 만들고, 여기에 속성과 내용을 부여한다. 이 모든 작업이 끝나고서야 마침내 우리는 DOM 엘리먼트들을 업데이트 할 수 있다.

```javascript
const listItemOne = document.getElementsByClassName('list__item')[0]
listItemOne.textContent = 'List item one'

const list = document.getElementsByClassName('list')[0]
const listItemTwo = document.createElement('li')
listItemTwo.classList.add('list__item')
listItemTwo.textContent = 'List item two'
list.appendChild(listItemTwo)
```

### DOM은 그러라고 만든게 아닌데...

1998년, (DOM 에 대한 첫 번째 명세)[https://www.w3.org/TR/REC-DOM-Level-1/]가 처음 배포되었을 때 까지만 하더라도, 우리는 웹 페이지들을 굉장히 다르게 제작하고 운영했다. 오늘날에 비해 DOM API를 사용해 페이지의
내용을 수정해야하는 경우가 훨씬 적었다.

`document.getElementByClassName()` 같은 간단한 메소드들은 작은 스케일에서 사용해도 괜찮다. 하지만 만약 우리가 매 초마다 여러 엘리먼트를 업데이트 해야한다면, 지속적으로 DOM에 요청을 보내고 업데이트 하는 비용은 점점 비싸지기 시작한다.

심지어 DOM API의 특성 상, 특정 요소 하나만 찾아내서 업데이트 하는 작업 보다, 많은 부분을 업데이트하는 비싼 작업이 더 간단하다. 우리의 리스트 예제를 다시 보면, 리스트 전체를 새 것으로 바꿔치기 하는게, 특정 엘리먼트 하나만 업데이트 하는 것보다 쉽다.

```javascript
const list = document.getElementsByClassName('list')[0]
list.innerHTML = `
<li class="list__item">List item one</li>
<li class="list__item">List item two</li>
`
```

이 예제에서만 보면, 두 메소드의 성능 차이는 아마도 크지 않을 것이다. 하지만 웹페이지의 크기가 커짐에 따라, 필요한 엘리먼트만 선택하고 업데이트 하는 것이 더 중요해질 것이다.

### virtual DOM은 그러라고 만든게 맞다!

virtual DOM은 이렇게 DOM을 빈번하게 업데이트 해야하는 문제를 해결하기 위해 만들어졌다. DOM이나 shadow DOM과 달리 virtual DOM은 공식적인 스펙은 아니고, DOM과 인터페이스 하기 위한 새로운 메소드 정도로 볼 수 있다.

virtual DOM은 기존 DOM의 복사본이라고 볼 수 있는데, 이 복사본은 DOM API들을 사용하지 않고도 주기적으로 조작되고 업데이트 될 수 있다. virtual DOM에 모든 변경사항이 반영되면 우리는 원본 DOM에 정확히 어떤 변화가 필요한 지 알 수 있고 필요한 변화만 최적화 해서 반영할 수 있다.

## virtual DOM은 어떻게 생겼을까?

사실 virtual DOM이라는 이름 때문에 그 개념이 더 어렵게 느껴지곤 한다. 사실 virtual DOM은 평범한 자바스크립트 객체이다.

우리가 만든 DOM tree를 다시 한번 보자.

![](./domTree.png)

이 트리는 다음과 같은 자바스크립트 객체로 표현될 수 있다.

```javascript
const vdom = {
  tagName: 'html',
  children: [
    { tagName: 'head' },
    {
      tagName: 'body',
      children: [
        {
          tagName: 'ul',
          attributes: { class: 'list' },
          children: [
            {
              tagName: 'li',
              attributes: { class: 'list__item' },
              textContent: 'List item',
            }, // end li
          ],
        }, // end ul
      ],
    }, // end body
  ],
} // end html
```

이 객체를 virtual DOM이라고 생각하면 된다. 원본 DOM과 마찬가지로, 이는 HTML 문서에 대한 객체기반 표현이다. 하지만 동시에 자바스크립트 객체이므로 언제나 자유롭게 이를 수정할 수 있고, 꼭 필요한 경우가 아니라면 실제 DOM은 전혀 건드릴 필요가 없다.

매번 전체 객체를 다 사용하기 보다는, 보통은 virtual DOM의 작은 섹션을 따로 나누어서 사용한다. 예를 들어 우리는 아까 만든 `<ul>` 엘리먼트와 대응되는 list 컴포넌트에서 작업을 수행할 수 있다.

```javascript
const list = {
  tagName: 'ul',
  attributes: { class: 'list' },
  children: [
    {
      tagName: 'li',
      attributes: { class: 'list__item' },
      textContent: 'List item',
    },
  ],
}
```

## virtual DOM의 내부를 살펴보자

우린 virtual DOM이 어디에 사용되는지 살펴보았는데, virtual DOM은 어떻게 이런 문제를 해결하는 것일까?

앞서 언급한 대로, virtual DOM을 사용하면 우리는 DOM에서 변화가 생긴 부분만 콕 집어서 업데이트 할 수 있다. 다시 우리의 예제로 돌아가서 DOM API로 했던 것과 같은 변화를 만들어 보자.

가장 먼저 할 일은 우리의 변경사항이 반영된 virtual DOM의 복사본을 만드는 것이다. 우리는 DOM API를 쓸 필요가 없다. 그냥 객체만 만들면 된다.

```javascript
const copy = {
  tagName: 'ul',
  attributes: { class: 'list' },
  children: [
    {
      tagName: 'li',
      attributes: { class: 'list__item' },
      textContent: 'List item one',
    },
    {
      tagName: 'li',
      attributes: { class: 'list__item' },
      textContent: 'List item two',
    },
  ],
}
```

이 `copy`는 `diff`라는 것을 만드는것에 사용되는데 이 경우에는 `list` 그리고 업데이트 된 항목을 나타낸다. `diff`는 다음과 같이 생겼다.

```javascript
const diffs = [
    {
        newNode: { /* new version of list item one */ },
        oldNode: { /* original version of list item one */ },
        index: /* index of element in parent's list of child nodes */
    },
    {
        newNode: { /* list item two */ },
        index: { /* */ }
    }
]
```

이 `diff`는 실제 DOM 을 어떻게 업데이트 할 것인지 알려준다. 모든 `diff`들이 다 수집되고 나면, 그때 실제 DOM에게 변화를 발생시긴다. 이때 오직 변화가 필요한 부분만 업데이트된다.

예를 들어 우리는 각각의 `diff`를 순회하면서 새로운 자식 노드를 추가하거나, 기존의 노드를 업데이트 할 수 있다.

```javascript
const domElement = document.getElementsByClassName('list')[0]

diffs.forEach(diff => {
  const newElement = document.createElement(diff.newNode.tagName)
  /* Add attributes ... */

  if (diff.oldNode) {
    // If there is an old version, replace it with the new version
    domElement.replaceChild(diff.newNode, diff.index)
  } else {
    // If no old version exists, create a new node
    domElement.appendChild(diff.newNode)
  }
})
```

이건 실제 virtual DOM의 동작을 아주 간단히 설명한 것이라는 것을 명심하길 바란다. 여기서 다루지 않은 경우의 수도 많이 존재한다.

## virtul DOM 과 프레임워크

우리의 예시처럼 직접 virtual DOM을 다루는 것 보다는, 프레임워크를 통해 다루는 것이 훨씬 보편적이다.

React나 Vue같은 프레임워크들은 DOM업데이트를 더 효율적으로 수행하기 위해 virtual DOM 개념을 사용한다. 예를 들어 우리의 `list` 컴포넌트를 React로 작성하면 다음과 같다.

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

const list = React.createElement(
  'ul',
  { className: 'list' },
  React.createElement('li', { className: 'list__item' }, 'List item')
)

ReactDOM.render(list, document.body)
```

`list`를 업데이트 하고싶다면, 그냥 템플릿 전체를 다시 써버리고 다시 한번 `ReactDOM.render()`를 호출하면 된다.

```javascript
const newList = React.createElement("ul", { className: "list" },
    React.createElement("li", { className: "list__item" }, "List item one"),
    React.createElement("li", { className: "list__item" }, "List item two");
);

setTimeout(() => ReactDOM.render(newList, document.body), 5000);
```

React는 virtual DOM을 사용하기 때문에, 전체 템플릿을 렌더링해도, 실제로는 변경된 부분만 업데이트 한다.개발자 도구를 연 채로 변화를 확인하면 특정 엘리먼트만 변화한다는 것을 확인할 수 있다.

## DOM vs virtual DOM

요약하자면, virtual DOM은 DOM엘리먼트를 좀 더 쉽고 효율적인 방식으로 다룰 수 있게 해주는 도구이다. 자바스크립트 객체로 표현된 DOM이고, 우리가 언제든지 필요하다면 수정할 수 있다. virtual DOM에 만들어진 변화들은 실제 DOM과 대조되고, 실제 DOM에 덜 빈번하게 반영된다.

## 원문

- [Understanding the Virtual DOM](https://bitsofco.de/understanding-the-virtual-dom/) - by [Ire Aderinokun](https://ireaderinokun.com/)
