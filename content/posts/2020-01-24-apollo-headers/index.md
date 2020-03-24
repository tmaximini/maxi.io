---
order: 3
path: '/blog/accessing-authorization-headers-in-apollo-graphql'
title: 'Accessing Authorization headers in Apollo graphql client'
subtitle: 'Afterware is the new middleware'
published: true
date: '20200124'
type: 'post'
keywords: 'GraphQL, Apollo, HTTP'
tags:
  - apollo
year: 2020
---

![tunnel](tunnel.jpg '@zachwoolf unsplash.com')
<span style="font-size: 11px;">Photo by Zach Woolf on Unsplash</span>

## Use case

Let's say we have a graphql server that is setup using `apollo-server`.

In our app, the user arrives at the page and the page will do a request for a cart (e-commerce site). The cart is personalized that means it depends on a user. The user can be identified by a unique sessionId, which we store in a cookie. Therefore, we would have to access the response headers that are returned from a graphql call.

All our requests from the client are made via graphql using apollo-client. In case there is no sessionId, the graphql-server will issue a new sessionId and send it back in the "Authorization" header. We need to parse this header on the client, see if the Authorization header is set and if yes, store the sessionId in our cookie.

## Problem

The Apollo client does not expose the response headers to client. We can use HttpLink to send custom headers to in our requests (which we will do to authorize via 'Authorization' header), but there is no direct way to handle the response headers.

## Solution

First, we need to setup our apollo-link with a combination of HttpLink and a so-called _afterware_ link. Afterware is a fancy term that I personally don't like very much, but basically it runs after the request is finished (as oposed to _middleware_ which intercepts each request).

> 'Afterware' is very similar to a middleware, except that an afterware runs after a request has been made, that is when a response is going to get processed.

[https://www.apollographql.com/docs/react/networking/network-layer/#afterware](https://www.apollographql.com/docs/react/networking/network-layer/#afterware)

This is how we instantiate the ApolloClient using our custom afterware to access the response headers:

```js
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';

const ENDPOINT = 'https://your-gql-server.com';

function createApolloClient(initialState = {}) {
  const sessionID = getSessionID(); // get sessionID, e.g. from a cookie

  // create HttpLink with custom headers if we have sessionID
  const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
    headers: sessionID
      ? {
          Authorization: `Bearer ${sessionID}`,
        }
      : {},
  });

  // our custom "afterware" that checks each response and saves the sessionID
  // if it contains an 'Authorization' header
  const afterwareLink = new ApolloLink((operation, forward) => {
    forward(operation).map(response => {
      const context = operation.getContext();
      const authHeader = context.response.headers.get(
        'Authorization',
      );

      // We would see this log in the SSR logs in the terminal
      // but in the browser console it would always be null!
      console.log(authHeader);

      if (authHeader) {
        // cut off the 'Bearer ' part from the header
        SESSION_ID = authHeader.replace('Bearer ', '');

        setSessionID(SESSION_ID); // save sessionID, e.g. in a cookie
      }

      return response;
    });
  });

  // this is how we combine middlewares in Apollo client
  const link = afterwareLink.concat(httpLink);

  return new ApolloClient({
    link, // use combined version for our final client
    cache: new InMemoryCache().restore(initialState),
  });
}
```

This looks pretty good so far. The problem that we faced now was that we would see the authHeader on the SSR logs but not in the browser console. Yikes!

## 'Access-Control-Expose-Headers' to the rescue

After an hour or so of tearing our hairs out we finally found the solution. As these graphql requests are CORS requests, we had to set the `'Access-Control-Expose-Headers'` headers.

By default, only the 6 [CORS-safelisted response headers](https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_response_header) are exposed ([source](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers)):

- [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- [Content-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Language)
- [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)
- [Expires](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expires)
- [Last-Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Last-Modified)
- [Pragma](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Pragma)

The default ApolloServer from `apollo-server` can only take a boolean attribute `cors. If set to true, apollo-server will add the cors middleware but with default values.

This is not enough in our case! As we learned this means it would just expose the 6 headers above.

In order to expose the header correctly we had to use the `apollo-server-express` package and set our custom `corsOptions` to the cors middleware (code below).

```js
    import { ApolloServer } from 'apollo-server-express'

    import express from 'express'
    import { resolvers, typeDefs } from './schema'

    // we need custom cors options in order to pass through our Auth header to the client
    // this works only using apollo-server-express
    const app = express()
    const corsOptions = {
      origin: '*',
      credentials: true,
      exposedHeaders: ['Authorization'],
    }


    const server = new ApolloServer({
      typeDefs,
      resolvers,,
      context: (ctx) => {
    		// get session, implementation omitted for clarity
        const session = getSession()

        ctx.res.setHeader('Authorization', `Bearer ${session.id}`)

        return {
          session,
        }
      },
    })

    // apply cors middleware with our custom corsOptions
    server.applyMiddleware({ app, cors: corsOptions, path: '/' })

    app.listen({ port: 4000 }, () => {
      console.log(`🚀 Server ready on port 4000`)
    })
```

## Conclusion

The key takeaway here is that `apollo-server` comes with a default options for cors, which works for most standard cases. If you want to have a custom cors configuration, you need to use apollo-server-express. And we learned that the CORS specification allows only the 6 _CORS-safelisted response headers_ by default.
