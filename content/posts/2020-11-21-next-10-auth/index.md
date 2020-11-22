---
order: 1
path: '/blog/next-js-auth'
title: 'Authentication in Next.js apps'
subtitle: 'Concepts for isomorphic authentication'
published: true
date: '20201121'
type: 'post'
keywords: 'Next.js'
year: 2020
tags:
  - next.js
---

I _love_ Next.js.

Whenever I build production-grade websites with React, I will choose Next.js as the go-to framework.
What makes it an exceptional choice for me is that it abstracts away all the time-consuming gruntwork, such as server-side rendering (SSR),
Webpack and Typescript configurations, routing and so on for us, so we can work on our actual unique features instead of wasting time on these Metatasks.
And it does all of them very well, better as most people trying to implement these things themselves. I would advise strongly against trying to build your own server rendered React app in 2020, unless you are some kind of masochistic psychopath.

### Next.js 10

Next.js just keeps getting better. The recently released [version 10](https://nextjs.org/blog/next-10) with tons of improvements.
It's awesome. The have now a `next/image` helper similar to what Gatsby does with Gatsby image, support for i18n routing by default, and many other goodies. Head over there and check the changelog if you haven't already.
But this post is about authentication, so let's dive into that!

## Authentication in Next.js

There is no one way on how to deal with authentication in Next.js.
Ideally you don't try to re-invent the wheel and go with one of the standard auth providers, such as [Firebase](https://github.com/vercel/next.js/tree/canary/examples/with-firebase-authentication), [Auth0](https://github.com/vercel/next.js/tree/canary/examples/auth0) or [Cognito](https://aws.amazon.com/cognito/).
You'll find [examples](https://github.com/vercel/next.js/tree/canary/examples) on how to use those in the Next.js Github repository.
We use Firebase authentication over at Crowdcast, but those are all valid choices.
There is also a relatively new project called [next-auth](https://next-auth.js.org/) which we tested briefly and which looks very promising. This should cover most of the needs for authentication in Next.js apps.

## How to structure your authentication

The first thing I like to do is seperating my pages into three categories:

1. Pages that everyone can view (public)
   These pages don't need any authentication

2. Pages that are absolutely unaccessible when a user is not authorized. These pages are usually good candidates for _server-side_ authentication.

3. Pages and components that show differet views depending on a user's state. These pages are usually good candidates for _client-side_ authentication.

Let's look into the last two in more detail:

## Server-side authentication

Imagine you have some sensitive user data on your site such as a user's personal E-Mail and their payment information. This data can be accessed on the `/account` page. Now, when a user is not logged in, it does not make sense to render anything on this page at all, instead we want to redirect them to `/login`.
So we want to use a _server-side_ authentication here. That means, we check on the server if a user is logged in, and if not, we redirect them using an HTTP redirect. If they are logged in, we pass their user data directly into our Account page, so we can start rendering immediately and save another round trip.
For this, we make use of a method called `getServerSideProps` ([docs](https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering)). This was introduced in Next.js version 9.3, before that it was called `getInitialProps`.
One thing to note is that this function has to _exported seperately_ from a next.js page. This means, we can not use a higher-order component and wrap all the pages that use server-side auth with it, but we have to export it from each page.

The logic of that function depends on your use case. In my example it it is fairly straightforward: We try to read a user object from the `session` object that is stored on the request. If the user is found, return it as a prop to the page, if not, redirect the user to the /login route.

```ts
export const getServerSideProps = ({ req, res }) => {
  try {
    const user = req.session.get('user');
    if (!user) throw new Error('unauthorized');

    return {
      props: {
        user,
      },
    };
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }
};
```

One neat little refactoring trick is that we can create a shared helper somewhere that returns a function which can be used or aliased in this export, like this:

```ts
// helper.ts
export const getUserFromServerSession = ({
  redirectToLogin,
}: {
  redirectToLogin?: boolean;
}) =>
  withSession(
    async ({ req }: GetServerSidePropsContextWithSession<{}>) => {
      try {
        const user = req.session.get<User>('user');

        if (!user) throw new Error('unauthorized');

        return {
          props: {
            user,
          },
        };
      } catch (err) {
        if (redirectToLogin) {
          return {
            redirect: {
              permanent: false,
              destination: '/login',
            },
          };
        } else {
          return {
            props: {},
          };
        }
      }
    },
  );
```

Then you can use that helper function in all your pages that need server side auth:

```tsx
// some-page.tsx
export const getServerSideProps = getUserFromServerSession({
  redirectToLogin: true,
});
```

This way we don't have to repeat the same code in all our pages.

I am using `next-iron-session` for the session handling in case you're wondering. You can find [an example in the Next.js repo](https://github.com/vercel/next.js/tree/canary/examples/with-iron-session).

### When to use getServerSideProps

The Next.js docs state:

> You should use getServerSideProps only if you need to pre-render a page whose data must be fetched at request time. Time to first byte (TTFB) will be slower than getStaticProps because the server must compute the result on every request, and the result cannot be cached by a CDN without extra configuration. If you don’t need to pre-render the data, then you should consider fetching data on the client side.

So be careful to use use complex logic or requests to external APIs from there. In our case we just check the request to see if we have a session cookie which is pretty fast and that way we can avoid unnecessary re-renders and redirects on the client side.

## Client-Side authentication

So you have an site where users can log in. In the header or navigation bar you want to show a Login button when the user is logged out, or show an avatar when the user is logged in.
You also want to update the state throughout your application when a user decides to login or logout.
Indepentant of what provider you choose for your authentication, you'll want a [React hook](https://reactjs.org/docs/hooks-intro.html) that you can use in any page or component that needs to access the user.

In order to create this hook I highly recommend you use React's [context api](https://reactjs.org/docs/context.html). What you want it a _single user object_ that you can access from anywhere within your app, so context is perfect for that.

First, create a context:

```ts
// AuthContext.tsx
import React from 'react';
import { Session } from '~/types';

const AuthContext = React.createContext<{
  user: Session | undefined;
  mutateUser: () => Promise<any>;
  logout: () => void;
}>({
  user: undefined,
  mutateUser: async () => null,
  logout: async () => null,
});

export default AuthContext;
```

Here we tell our app that there is a context that has 3 properties: the user, and a mutateUser and logout function. We don't initialize them yet though but just return noop functions and undefined for the user.

The next step is to create a `Provider`. Every context needs a provider, because the provider defines the _scope_ of that context.

The provider usually gets added to the `_app` in Next.js apps (Usually you end up with multiple providers in bigger apps). So every component that is nested inside a provider can access that provider's context.

```tsx
// pages/_app.tsx
import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { CSSReset, ChakraProvider } from '@chakra-ui/core';
import { useApollo } from '~/lib/apolloClient';
import { AuthProvider } from '~/components/auth/AuthProvider';

// eslint-disable-next-line no-console
const onError = (err: Error) => console.log(err);

const App = ({ Component, pageProps }: AppProps) => {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider theme={customTheme}>
        <CSSReset />
        <AuthProvider>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </AuthProvider>
      </ChakraProvider>
    </ApolloProvider>
  );
};

export default App;
```

As you can see, here I have multiple providers, and sure enough we also find our `AuthProvider` in there. Now we can access its context from anywhere in the app!

The actual Provider could be implemented like this:

```tsx
// AuthProvider.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import useSWR from 'swr';
import { auth } from '~/services/auth';
import { Session } from '~/types';

import { post } from '~/utils/http';
import { jwt } from '~/utils/jwt';
import AuthContext from './AuthContext';

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, mutate: mutateUser } = useSWR<Session>(
    '/api/user',
  );

  const { push, pathname, query } = useRouter();

  const logout = async () => {
    await auth.logout();
    push('/');
  };

  useEffect(() => {
    // eslint-disable-next-line consistent-return
    auth.onIdTokenChanged(async _user => {
      if (!_user) return mutateUser(post('/api/logout'));

      await mutateUser(
        post('/api/session', { accountId: _user.uid! }),
      );

      const token = await auth.getLatestToken(_user);

      await jwt.save({ token });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, mutateUser]);

  return (
    <AuthContext.Provider value={{ user, mutateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

We are using [SWR](https://swr.vercel.app/) and Firebase auth in this example but the implementation details don't matter. The important thing is that we attach the things we care about (user, mutateUser and logout) to the _value_ property of the `AuthContext.Provider` and by doing this making it available throughout the app.

The actual hook itself now is super simple - it just returns the value from the AuthContext:

```ts
// hooks/useAuth.ts
import { useContext } from 'react';
import AuthContext from '~/components/auth/AuthContext';

export const useAuth = () => useContext(AuthContext);
```

Now whereever we want to access the user, we can just do

```tsx
import { useAuth } from '~/hook/useAuth';

const { user } = useAuth();
```

Here are some other blog posts that were helping me on the way:

- https://leerob.io/blog/nextjs-authentication
- https://colinhacks.com/essays/nextjs-firebase-authentication

I hope that was useful! Enjoy your Next.js project!
