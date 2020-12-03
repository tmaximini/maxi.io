---
order: 1
path: '/blog/typescript-bang-operator-considered-harmful'
title: 'Typescript: Bang operator considered harmful'
subtitle: 'Oh no, a runtime error'
published: true
date: '20201203'
type: 'post'
keywords: 'Typescript, bang, operator, no-null-assertion, runtime error, eslint'
year: 2020
tags:
  - typescript
---

We recently ran into a few runtime errors in our frontend. People would get errors like `Cannot read property x of null` or `Cannot read property .length of undefined` and so on. Something propably every Javascript developer has encountered before.

![error](error.png 'Next.js throwing an error')

no bueno!

But our codebase is a Next.js application written in Typescript. How did the Typescript compiler not catch those errors during compile time.

Digging a bit deeper, I found that we had a rule in our `.eslintrc` that turned off any warnings around using the [bang(!) operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator) in Typescript:

```jsx
// .eslintrc
rules: {
// ...
'@typescript-eslint/no-non-null-assertion': 'off'
}
```

The [Typescript docs](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator) define this as the non-null-assertion operator. The docs state

> A new ! post-fix expression operator may be used to assert that its operand is non-null and non-undefined in contexts where the type checker is unable to conclude that fact. Specifically, the operation x! produces a value of the type of x with null and undefined excluded. Similar to type assertions of the forms <T>x and x as T, the ! non-null assertion operator is simply removed in the emitted JavaScript code.

Sounds difficult. But all it does is basically telling the compiler "this value can not be null or undefined".

One of the great advantages of Typescript is that it checks your code instantly for any type errors (duh), so whenever you are working with an object or variable value that _might_ be undefined, it gives you a warning.

![eslint](eslint.png 'Eslint showing a warning')

It usually does so by underlining the variable and showing you a little warning. The lazy developer might just go ahead, yell at Typescript that they know what they're doing and add a ! to it. Problem solved right?

This might cause the compiler to shut up, but then lead to the undesired runtime errors we saw above. It _might_ be defined 99% of the time or even 100% of the time on your local machine. Especially when working with asynchronous code, such as GraphQL queries and mutations, it's important to know that objects and values can often be undefined. Maybe the data is still being loaded or something takes a while until it is initialized.

The problem is that these exclamation marks are difficult to miss in a code review. Maybe someone started using them, they end up in the codebase. The next pages are partly copied and pasted or newer developers see this and start copying the pattern. Suddenly you have exclamation marks all over your codebase because it seems to make Typescript happy.

A better alternative would be using the optional chaining `?` operator that [got introduced in Typescript 3.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html).

And for React components, you can use the logical AND `&&` operator:

```jsx
// wrong
<VideoPresentation videoPresentation={videoPresentation!} />
// better
{videoPresentation && <VideoPresentation videoPresentation={videoPresentation} />}
```

By setting the [eslint rule](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-non-null-assertion.md) correctly to `'@typescript-eslint/no-non-null-assertion': 'error'` we've now disallowed any usage of that operator. In my opinion it defeats the purpose of Typescript, which brings a lot of sanity and safety into bigger Javascript projects.

Do you agree or do you think there are valid use cases for the ! operator in Typescript. Let me know at [Twitter](https://twitter.com/tmaximini).
