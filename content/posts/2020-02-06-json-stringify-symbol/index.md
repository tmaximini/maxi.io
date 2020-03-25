---
order: 2
path: '/json-stringify-symbols-and-react-components'
title: 'JSON.stringify, Symbols and React components'
subtitle: "Doh! Symbols won't get stringified"
published: true
date: '20200206'
type: 'post'
keywords: 'React'
tags:
  - React
year: 2020
---

I was building an graphql api where a resolver returns compiled JSX. The idea was that a page can dynamically render a component tree from a TemplateService, without knowing which components will be rendered in advance. The service would figure out the tree depending on the request parameters.

My first naive approach was to just stringify the compiled JSX.

```js
const renderComponent = () => <h1>This is my Component</h1>;
```

The compiled and stringified return value of `renderComponent()` looks like this:

```
  {"type":"h1","key":null,"ref":null,"props":{"children":"This is my Component"},"_owner":null,"_store":{}}
```

## Missing fields in the JSON string

I looked at it and thought it looks familiar and is probably right.
I can probably just add it in out other React component and render it.

I got a bunch of errors. I inspected the stringified JSON - and while looking familiar I started questioning myself. Is this really what compiled JSX looks like? I felt there was something missing. Why was the key `null` and how would react know what to render? 😕

I ended up re-reading [https://reactjs.org/docs/jsx-in-depth.html](https://reactjs.org/docs/jsx-in-depth.html) and tried to use `React.createElement()` on the json. Nothing worked.

## The '\$\$typeof' symbol

It finally occured to me to look at compiled jsx _before calling_ JSON.stringify() on it. There was the answer! Of course! There _were_ more fields on it, namingly `'$$typeof'` and `type` which somehow got swallowed during the stringification.

```js
const MyTestComponent = () => {
  const componentName = 'MyTestComponent';

  return (
    <div>
      <h2>Component: {componentName}</h2>
    </div>
  );
};
```

The compiled version of this gives us the following json:

```js
    {
    '$$typeof': Symbol(react.element),
    type: [Function: MyTestComponent],
    key: null,
    ref: null,
    props: {},
    _owner: null,
    _store: {}
    }
```

After reading through [Dan's blog post about \$\$typeof](https://overreacted.io/why-do-react-elements-have-typeof-property/) we went on googling and found the following on [esdiscuss](https://esdiscuss.org/topic/json-stringify-and-symbols):

1. `JSON.stringify(symbol)` returns `undefined`.
2. `JSON.stringify([symbol])` returns `"[null]"`.
3. `JSON.stringify(object)` skips any symbol-keyed properties on the object.

The MDN docs go on and explain:

> undefined, Functions, and Symbols are not valid JSON values. If any such values are encountered during conversion they are either omitted (when found in an object) or changed to null (when found in an array).

## The 'replacer' function

The good news is we can add a [custom replacer function to stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

```js
const asString = JSON.stringify(templateJSX, (k, v) =>
  typeof v === 'symbol' ? `$$Symbol:${Symbol.keyFor(v)}` : v,
);
```

And of course its counterpart on the other end, `JSON.parse`:

```js
JSON.parse(data.getTemplateForId, (k, v) => {
  const matches = v && v.match && v.match(/^\$\$Symbol:(.*)$/);

  return matches ? Symbol.for(matches[1]) : v;
});
```

_thank you [random StackOverflow person](https://stackoverflow.com/a/45171308/532102)_ 👍
